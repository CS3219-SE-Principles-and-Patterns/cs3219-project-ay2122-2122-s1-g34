import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CollaborationController } from "./collaboration.controller";
import { CollaborationGateway } from "./collaboration.gateway";
import { CollaborationService } from "./collaboration.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "COLLABORATION_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://nats:4222"],
          queue: "collaboration_queue",
        },
      },
    ]),
  ],
  controllers: [CollaborationController],
  providers: [CollaborationGateway, CollaborationService],
  exports: [CollaborationService],
})
export class CollaborationModule {}
