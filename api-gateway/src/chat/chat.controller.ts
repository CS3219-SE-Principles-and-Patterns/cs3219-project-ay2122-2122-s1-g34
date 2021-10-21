import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";


import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatPayload } from "./interfaces/chat-payload.interface";

@Controller()
export class ChatController {
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService
  ) {}

  @EventPattern("chat:receive_message") //to send out msg to all sockets when server receives a msg
  handleSend(payload: ChatPayload) {
    this.chatService.handleSend(
      payload,
      this.chatGateway.server
    );
  }
}
