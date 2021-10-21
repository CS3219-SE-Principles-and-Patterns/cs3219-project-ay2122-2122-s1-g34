import { Injectable } from "@nestjs/common";
import { Socket, Server } from "socket.io";

import { ChatDto } from "./dto/chat.dto";

@Injectable()
export class ChatService {
  async onMessage(chatDto: ChatDto, client: Socket, server: Server) {
    const sockets = await server.in(client.data.sessionId).fetchSockets();
    sockets.forEach((socket) => {
      if (socket.data.userId !== client.data.userId) {
        socket.emit("chat:message", chatDto);
      }
    });
  }
}
