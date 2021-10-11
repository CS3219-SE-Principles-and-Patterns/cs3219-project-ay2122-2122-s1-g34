import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsModule } from "src/questions/questions.module";

import { Session } from "./entities/session.entity";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Session]), QuestionsModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
