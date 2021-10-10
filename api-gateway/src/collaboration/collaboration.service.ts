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
    client.join("monacco");
    this.natsClient.emit("collaboration:connected", {
      roomName: "monacco",
      socketId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.natsClient.emit("collaboration:disconnected", {
      roomName: "monacco",
      socketId: client.id,
    });
    client.disconnect();
  }

  handleCollaboration(client: Socket, message: string) {
    this.natsClient.emit("collaboration:message", {
      roomName: "monacco",
      socketId: client.id,
      message,
    });
  }

  async handleSend(payload: CollaborationPayload, server: Server) {
    const sockets = await server.in(payload.roomName).fetchSockets();
    sockets.forEach((socket) => {
      if (socket.id === payload.socketId) {
        socket.emit("collaboration", payload.message);
      }
    });
  }
}
