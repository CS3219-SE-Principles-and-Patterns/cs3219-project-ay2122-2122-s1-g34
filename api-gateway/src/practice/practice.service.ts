import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WsException } from "@nestjs/websockets";
import * as admin from "firebase-admin";
import { firstValueFrom, map } from "rxjs";
import { Server, Socket } from "socket.io";

import { FirebaseService } from "../firebase/firebase.service";
import { JoinSessionDto } from "./dto/join-session.dto";

@Injectable()
export class PracticeService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject("PRACTICE_SERVICE") private client: ClientProxy
  ) {}

  private handleSocketDisconnecting(client: Socket, server: Server) {
    client.rooms.forEach(async (room) => {
      const socketsInRoom = await server.in(room).fetchSockets();
      this.client.emit("handleSessionDisconnect", {
        sessionId: room,
        isAnotherUserInSession: socketsInRoom.length >= 2,
      });
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
        this.client.send("findOneUnclosedSession", user.uid)
      );
      if (!session) {
        throw new Error("User has not joined any room yet.");
      }

      // join session room to receive room updates
      client.join(session.id);
      client.data.userId = user.uid;

      // TODO: maybe can choose what to do according to disconnecting reason
      client.on("disconnecting", () => {
        this.handleSocketDisconnecting(client, server);
      });
    } catch (e) {
      client.disconnect();
      throw new WsException(e?.message ?? "An unspecified error has occurred.");
    }
  }

  joinSession(user: admin.auth.DecodedIdToken, joinSessionDto: JoinSessionDto) {
    return this.client
      .send("joinSession", {
        userId: user.uid,
        ...joinSessionDto,
      })
      .pipe(map((session) => ({ sessionId: session.id })));
  }

  async handleSessionRemoved(sessionId: string, server: Server) {
    const sockets = await server.in(sessionId).fetchSockets();
    sockets.forEach((socket) => {
      socket.disconnect();
    });
  }
}
