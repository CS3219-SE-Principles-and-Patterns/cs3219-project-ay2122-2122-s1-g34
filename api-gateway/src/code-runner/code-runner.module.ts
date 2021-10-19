import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CodeRunnerGateway } from "./code-runner.gateway";
import { CodeRunnerService } from "./code-runner.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "CODE_RUNNER_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://nats:4222"],
          queue: "code_runner_queue",
        },
      },
    ]),
  ],
  providers: [CodeRunnerGateway, CodeRunnerService],
})
export class CodeRunnerModule {}
