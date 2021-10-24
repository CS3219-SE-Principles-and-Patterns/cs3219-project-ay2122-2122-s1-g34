import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsModule } from "src/questions/questions.module";

import { Session } from "./entities/session.entity";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

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
    TypeOrmModule.forFeature([Session]),
    QuestionsModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
