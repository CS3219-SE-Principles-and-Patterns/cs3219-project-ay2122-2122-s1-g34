import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository } from "typeorm";

import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";
import { SessionNote } from "./entities/session-note.entity";

@Injectable()
export class SessionNotesService {
  constructor(
    @InjectRepository(SessionNote)
    private readonly sessionNotesRepository: Repository<SessionNote>
  ) {}

  async updateSessionNote(updateSessionNoteDto: UpdateSessionNoteDto) {
    const { userId, sessionId, note } = updateSessionNoteDto;

    const updatedNote = plainToClass(SessionNote, {
      userId,
      note,
      session: { id: sessionId },
    });

    await this.sessionNotesRepository.save(updatedNote);

    return true;
  }
}
