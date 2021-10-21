import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
 imports: [
     ClientsModule.register([
    {
      name: "CHAT_SERVICE",
      transport: Transport.NATS,
      options: {
        servers: ["nats://nats:4222"],
        queue: "chat_queue",
      },
    },
  ]),],
 controllers: [ChatController],
 providers: [ChatGateway,ChatService],
 exports: [ChatService],
})
export class ChatModule {}