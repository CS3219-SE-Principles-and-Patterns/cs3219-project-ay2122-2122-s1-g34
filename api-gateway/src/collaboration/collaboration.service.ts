import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Socket, Server } from "socket.io";

import { CollaborationPayload } from "./interfaces/collaboration-payload.interface";

@Injectable()
export class CollaborationService {
  constructor(
    @Inject("COLLABORATION_SERVICE") private natsClient: ClientProxy
  ) {}

  handleConnection(client: Socket) {
    this.natsClient.emit("collaboration:connected", {
      roomName: client.data.sessionId,
      socketId: client.id,
    });
  }

  handleDisconnecting(client: Socket) {
    this.natsClient.emit("collaboration:disconnecting", client.data.sessionId);
  }

  handleCollaboration(client: Socket, message: string) {
    this.natsClient.emit("collaboration:message", {
      roomName: client.data.sessionId,
      socketId: client.id,
      message,
    });
  }

  async handleSend(payload: CollaborationPayload, server: Server) {
    const sockets = await server.in(payload.roomName).fetchSockets();
    sockets.forEach((socket) => {
      socket.emit("collaboration", payload.message);
    });
  }
}
