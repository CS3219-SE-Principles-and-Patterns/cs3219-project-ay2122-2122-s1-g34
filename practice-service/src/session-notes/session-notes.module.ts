import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionNote } from "./entities/session-note.entity";
import { SessionNotesController } from "./session-notes.controller";
import { SessionNotesService } from "./session-notes.service";

@Module({
  imports: [TypeOrmModule.forFeature([SessionNote])],
  controllers: [SessionNotesController],
  providers: [SessionNotesService],
})
export class SessionNotesModule {}
