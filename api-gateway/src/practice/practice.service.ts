import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WsException } from "@nestjs/websockets";
import * as admin from "firebase-admin";
import { firstValueFrom, map } from "rxjs";
import { Server, Socket } from "socket.io";
import { CollaborationService } from "src/collaboration/collaboration.service";

import { FirebaseService } from "../firebase/firebase.service";
import { JoinSessionDto } from "./dto/join-session.dto";

@Injectable()
export class PracticeService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly collaborationService: CollaborationService,
    @Inject("PRACTICE_SERVICE") private natsClient: ClientProxy
  ) {}

  private async handleSocketDisconnecting(client: Socket, server: Server) {
    const room = client.data.sessionId;
    const socketsInRoom = await server.in(room).fetchSockets();

    // disconnect collaboration
    this.collaborationService.handleDisconnecting(client);

    // disconnect practice session
    this.natsClient.emit("handleSessionDisconnecting", {
      sessionId: room,
      isAnotherUserInSession: socketsInRoom.length >= 2,
    });
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
      if (!session) {
        throw new Error("User has not joined any room yet.");
      }

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

      client.on("disconnecting", () => {
        this.handleSocketDisconnecting(client, server);
      });
    } catch (e) {
      client.disconnect();
      throw new WsException(e?.message ?? "An unspecified error has occurred.");
    }
  }

  joinSession(user: admin.auth.DecodedIdToken, joinSessionDto: JoinSessionDto) {
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

  async practiceInit(client: Socket) {
    this.collaborationService.handleConnection(client);
    return firstValueFrom(
      this.natsClient.send("findOneInProgressSession", client.data.sessionId)
    );
  }

  async findAll(user: admin.auth.DecodedIdToken) {
    const practices = await firstValueFrom<
      {
        id: string;
        allowedUserIds: string[];
        difficulty: string;
        question: { title: string };
      }[]
    >(this.natsClient.send("findAllClosedSessions", user.uid));

    // get peer display name
    const practicesWithDisplayName = practices.map(async (practice) => {
      const peerId = practice.allowedUserIds.find(
        (userId) => userId !== user.uid
      );
      const peer = await this.firebaseService.getUserInformation(peerId);

      delete practice.allowedUserIds;

      return { ...practice, peerDisplayName: peer.displayName };
    });

    const resolved = await Promise.all(practicesWithDisplayName);

    return resolved;
  }

  async findOne(user: admin.auth.DecodedIdToken, id: string) {
    const practice = await firstValueFrom<{
      id: string;
      allowedUserIds: string[];
      difficulty: string;
      question: { title: string; questionHtml: string; answer: string };
    }>(this.natsClient.send("findOneClosedSession", { userId: user.uid, id }));

    // get peer display name
    const peerId = practice.allowedUserIds.find(
      (userId) => userId !== user.uid
    );
    const peer = await this.firebaseService.getUserInformation(peerId);

    delete practice.allowedUserIds;

    return { ...practice, peerDisplayName: peer.displayName };
  }
}
