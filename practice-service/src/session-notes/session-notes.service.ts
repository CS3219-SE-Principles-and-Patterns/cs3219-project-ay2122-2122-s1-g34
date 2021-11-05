import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository } from "typeorm";

import { Session, Status } from "../sessions/entities/session.entity";
import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";
import { SessionNote } from "./entities/session-note.entity";

@Injectable()
export class SessionNotesService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @InjectRepository(SessionNote)
    private readonly sessionNotesRepository: Repository<SessionNote>
  ) {}

  async updateSessionNote(updateSessionNoteDto: UpdateSessionNoteDto) {
    const { userId, sessionId, note } = updateSessionNoteDto;

    const session = await this.sessionsRepository
      .createQueryBuilder("session")
      .where("session.allowedUserIds @> (:userId)", {
        userId: [userId],
      })
      .andWhere("session.status = :status", { status: Status.Closed })
      .andWhere("session.id = :id", { id: sessionId })
      .getOne();

    if (!session) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "You are not allowed to edit this note!",
        error: "Forbidden",
      });
    }

    const updatedNote = plainToClass(SessionNote, {
      userId,
      note,
      session: { id: sessionId },
    });

    await this.sessionNotesRepository.save(updatedNote);

    return true;
  }
}
