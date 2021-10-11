import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { PracticeController } from "./practice.controller";
import { PracticeService } from "./practice.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "PRACTICE_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://nats:4222"],
          queue: "practice_queue",
        },
      },
    ]),
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
})
export class PracticeModule {}
