import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Socket, Server } from "socket.io";

import { ChatPayload } from "./interfaces/chat-payload.interface";

@Injectable()
export class ChatService {
  constructor(
    @Inject("CHAT_SERVICE") private natsClient: ClientProxy
  ) {}

  handleConnection(client: Socket) {
    this.natsClient.emit("chat:connected", {
      roomName: client.data.sessionId,
      socketId: client.id,
    });
  }

  handleDisconnecting(client: Socket) {
    this.natsClient.emit("chat:disconnecting", {
      roomName: client.data.sessionId,
      socketId: client.id,
    });
  }

  handleChat(client: Socket, message: Object) {
    this.natsClient.emit("chat:message", {
      roomName: client.data.sessionId,
      socketId: client.id,
      message,
    });
  } //for a client sending message?

  async handleSend(payload: ChatPayload, server: Server) {
    const sockets = await server.in(payload.roomName).fetchSockets();
    sockets.forEach((socket) => {
      socket.emit("chat", payload.message);
    });
  } //for all clients in the room receving the message sent?
}
