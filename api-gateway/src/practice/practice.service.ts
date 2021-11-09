import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WsException } from "@nestjs/websockets";
import * as admin from "firebase-admin";
import { firstValueFrom, map } from "rxjs";
import { Server, Socket } from "socket.io";
import { CollaborationService } from "src/collaboration/collaboration.service";

import { FirebaseService } from "../firebase/firebase.service";
import { JoinSessionDto } from "./dto/join-session.dto";
import { RedactedSessionDto } from "./dto/session.dto";
import { SessionDto } from "./dto/session.dto";
import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";

@Injectable()
export class PracticeService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly collaborationService: CollaborationService,
    @Inject("PRACTICE_SERVICE") private natsClient: ClientProxy
  ) {}

  private async handleSocketDisconnecting(
    reason: string,
    client: Socket,
    server: Server
  ) {
    const room = client.data.sessionId;
    const socketsInRoom = await server.in(room).fetchSockets();
    const isDisconnectIntentional =
      reason !== "ping timeout" &&
      reason !== "transport close" &&
      reason !== "transport error";

    // disconnect practice session
    this.natsClient.emit("handleSessionDisconnecting", {
      sessionId: room,
      isDisconnectIntentional,
    });
    if (isDisconnectIntentional) {
      // end the session if the socket was intentionally disconnected by a user

      // disconnect collaboration
      this.collaborationService.handleDisconnecting(client);

      socketsInRoom.forEach((socket) => {
        if (socket.data.userId !== client.data.userId) {
          socket.emit("practice:ended");
        }
      });
    } else {
      // socket was disconnected from network issues and other non purposeful reasons
      socketsInRoom.forEach((socket) => {
        if (socket.data.userId !== client.data.userId) {
          socket.emit("practice:peer-lost-connection");
        }
      });
    }
  }

  private async withPeerDisplayName(
    session: SessionDto & { allowedUserIds: string[] },
    callerUserId: string
  ): Promise<SessionDto | RedactedSessionDto> {
    const peerId = session.allowedUserIds.find(
      (userId) => userId !== callerUserId
    );
    const peer = await this.firebaseService.getUserInformation(peerId);

    delete session.allowedUserIds;

    return { ...session, peerDisplayName: peer.displayName };
  }

  async handleSocketConnection(client: Socket, server: Server) {
    try {
      // authenticate socket connection
      const user = await this.firebaseService.verifyIdToken(
        client.handshake.headers.token as string
      );

      // authorize socket connection
      if (!user || !user.name || !user.email) {
        throw new Error("User is not authorized!");
      }
      const session = await firstValueFrom(
        this.natsClient.send("findOneUnclosedSession", user.uid)
      );

      // join session room to receive room updates
      await client.join(session.id);

      // set user id, display name, and session id as socket data
      client.data.userId = user.uid;
      client.data.displayName = user.name;
      client.data.sessionId = session.id;

      server
        .in(session.id)
        .fetchSockets()
        .then((sockets) => {
          if (sockets.length > 1) {
            // if room is already full emit start session event
            client.emit("session:started");
          }
        });

      client.on("disconnecting", (reason) => {
        this.handleSocketDisconnecting(reason, client, server);
      });
    } catch (e) {
      client.emit("practice:error");
      client.disconnect();
    }
  }

  async joinSession(
    user: admin.auth.DecodedIdToken,
    joinSessionDto: JoinSessionDto
  ) {
    try {
      const result = await this.natsClient
        .send("joinSession", {
          userId: user.uid,
          ...joinSessionDto,
        })
        .pipe(map((session) => ({ sessionId: session.id })));

      return result;
    } catch (e) {
      throw new HttpException(e, e.statusCode);
    }
  }

  async handleSessionStarted(sessionId: string, server: Server) {
    server.to(sessionId).emit("session:started");
  }

  async handleSessionRemoved(sessionId: string, server: Server) {
    const sockets = await server.in(sessionId).fetchSockets();
    sockets.forEach((socket) => {
      socket.disconnect();
    });
  }

  async practiceInit(client: Socket, server: Server) {
    this.collaborationService.handleConnection(client);
    const session = await firstValueFrom(
      this.natsClient.send("findOneInProgressSession", client.data.sessionId)
    );
    if (!session) {
      throw new WsException("User has not joined any room yet.");
    }

    const room = client.data.sessionId;
    const socketsInRoom = await server.in(room).fetchSockets();
    socketsInRoom.forEach((socket) => {
      if (socket.data.userId !== client.data.userId) {
        socket.emit("practice:peer-joined");
      }
    });

    return this.withPeerDisplayName(session, client.data.userId);
  }

  async checkAnswer(answer: string, client: Socket, server: Server) {
    try {
      const isCorrect = await firstValueFrom<boolean>(
        this.natsClient.send("checkSessionAnswer", {
          id: client.data.sessionId,
          answer,
        })
      );

      return server
        .to(client.data.sessionId)
        .emit("practice:check-answer", { answer, isCorrect });
    } catch {
      return server
        .to(client.data.sessionId)
        .emit("practice:check-answer", { answer, isCorrect: false });
    }
  }

  async findAll(
    user: admin.auth.DecodedIdToken
  ): Promise<RedactedSessionDto[]> {
    const sessions = await firstValueFrom(
      this.natsClient.send("findAllClosedSessions", user.uid)
    );

    // get peer display name
    const sessionsWithDisplayName = sessions.map(async (practice) =>
      this.withPeerDisplayName(practice, user.uid)
    );

    const resolved: RedactedSessionDto[] = await Promise.all(
      sessionsWithDisplayName
    );

    return resolved;
  }

  async findOne(user: admin.auth.DecodedIdToken, id: string) {
    const session = await firstValueFrom(
      this.natsClient.send("findOneClosedSession", { userId: user.uid, id })
    );

    return this.withPeerDisplayName(session, user.uid);
  }

  async findOneInProgressSessionByUser(user: admin.auth.DecodedIdToken) {
    try {
      const session = await firstValueFrom<SessionDto>(
        this.natsClient.send("findOneInProgressSessionByUser", user.uid)
      );
      return session;
    } catch {
      throw new HttpException(
        { statusCode: 404, message: "No sessions found", error: "Not Found" },
        HttpStatus.NOT_FOUND
      );
    }
  }

  updateSessionNote(
    user: admin.auth.DecodedIdToken,
    sessionId: string,
    updateSessionNoteDto: UpdateSessionNoteDto
  ) {
    return firstValueFrom(
      this.natsClient.send("updateSessionNote", {
        ...updateSessionNoteDto,
        sessionId,
        userId: user.uid,
      })
    );
  }
}
