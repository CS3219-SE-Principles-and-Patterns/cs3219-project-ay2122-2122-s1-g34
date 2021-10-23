import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WsException } from "@nestjs/websockets";
import * as admin from "firebase-admin";
import { firstValueFrom, map } from "rxjs";
import { Server, Socket } from "socket.io";
import { CollaborationService } from "src/collaboration/collaboration.service";

import { FirebaseService } from "../firebase/firebase.service";
import { JoinSessionDto } from "./dto/join-session.dto";
import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";
import { Session } from "./interfaces/session.interface";

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
    if (
      reason !== "ping timeout" &&
      reason !== "transport close" &&
      reason !== "transport error"
    ) {
      // end the session if the socket was intentionally disconnected by a user

      // disconnect collaboration
      this.collaborationService.handleDisconnecting(client);

      // disconnect practice session
      this.natsClient.emit("handleSessionDisconnecting", room);

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

  private async withPeerDisplayName(session: Session, callerUserId: string) {
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
    return this.natsClient
      .send("joinSession", {
        userId: user.uid,
        ...joinSessionDto,
      })
      .pipe(map((session) => ({ sessionId: session.id })));
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

  async findAll(user: admin.auth.DecodedIdToken) {
    const practices = await firstValueFrom<Session[]>(
      this.natsClient.send("findAllClosedSessions", user.uid)
    );

    // get peer display name
    const practicesWithDisplayName = practices.map(async (practice) =>
      this.withPeerDisplayName(practice, user.uid)
    );

    const resolved = await Promise.all(practicesWithDisplayName);

    return resolved;
  }

  async findOne(user: admin.auth.DecodedIdToken, id: string) {
    const practice = await firstValueFrom<Session>(
      this.natsClient.send("findOneClosedSession", { userId: user.uid, id })
    );

    return this.withPeerDisplayName(practice, user.uid);
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
