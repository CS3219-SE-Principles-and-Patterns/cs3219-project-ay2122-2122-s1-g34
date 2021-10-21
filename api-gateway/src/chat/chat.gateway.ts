import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { ChatService } from "./chat.service";
import { ChatDto } from "./dto/chat.dto";

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage("chat:message")
  async onMessage(
    @MessageBody() chatDto: ChatDto,
    @ConnectedSocket() client: Socket
  ) {
    this.chatService.onMessage(chatDto, client, this.server);
  }
}
