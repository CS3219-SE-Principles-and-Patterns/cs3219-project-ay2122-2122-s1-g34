import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ChatModule } from "src/chat/chat.module";
import { CollaborationModule } from "src/collaboration/collaboration.module";

import { PracticeController } from "./practice.controller";
import { PracticeGateway } from "./practice.gateway";
import { PracticeService } from "./practice.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "PRACTICE_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER],
          queue: process.env.practice_queue,
        },
      },
    ]),
    CollaborationModule,
    ChatModule,
  ],
  controllers: [PracticeController],
  providers: [PracticeGateway, PracticeService],
})
export class PracticeModule {}
