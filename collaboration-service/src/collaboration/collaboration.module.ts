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
          servers: ["nats://nats:4222"],
          queue: "api_gateway_queue",
        },
      },
    ]),
  ],
  controllers: [CollaborationController],
  providers: [CollaborationService],
})
export class CollaborationModule {}
