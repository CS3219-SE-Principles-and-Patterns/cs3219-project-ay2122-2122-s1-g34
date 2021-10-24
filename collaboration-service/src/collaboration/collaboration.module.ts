import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CollaborationController } from "./collaboration.controller";
import { CollaborationService } from "./collaboration.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "API_GATEWAY_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER],
          queue: process.env.API_GATEWAY_NATS_QUEUE,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: "PRACTICE_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER],
          queue: process.env.PRACTICE_NATS_QUEUE,
        },
      },
    ]),
  ],
  controllers: [CollaborationController],
  providers: [CollaborationService],
})
export class CollaborationModule {}
