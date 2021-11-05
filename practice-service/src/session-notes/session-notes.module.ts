import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Session } from "../sessions/entities/session.entity";
import { SessionNote } from "./entities/session-note.entity";
import { SessionNotesController } from "./session-notes.controller";
import { SessionNotesService } from "./session-notes.service";

@Module({
  imports: [TypeOrmModule.forFeature([Session, SessionNote])],
  controllers: [SessionNotesController],
  providers: [SessionNotesService],
})
export class SessionNotesModule {}
