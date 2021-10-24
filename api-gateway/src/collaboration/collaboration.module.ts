import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CollaborationController } from "./collaboration.controller";
import { CollaborationGateway } from "./collaboration.gateway";
import { CollaborationService } from "./collaboration.service";

console.log(
  "process.env.COLLABORATION_NATS_QUEUE: ",
  process.env.COLLABORATION_NATS_QUEUE
);
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "COLLABORATION_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER],
          queue: process.env.COLLABORATION_NATS_QUEUE,
        },
      },
    ]),
  ],
  controllers: [CollaborationController],
  providers: [CollaborationGateway, CollaborationService],
  exports: [CollaborationService],
})
export class CollaborationModule {}
