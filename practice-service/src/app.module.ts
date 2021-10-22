import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import ormconfig from "./ormconfig";
import { QuestionsModule } from "./questions/questions.module";
import { SessionNotesModule } from "./session-notes/session-notes.module";
import { SessionsModule } from "./sessions/sessions.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    QuestionsModule,
    SessionNotesModule,
    SessionsModule,
  ],
})
export class AppModule {}
