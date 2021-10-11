import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { QuestionsService } from "src/questions/questions.service";
import { Repository } from "typeorm";

import { JoinSessionDto } from "./dto/join-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Session, Status } from "./entities/session.entity";

@Injectable()
export class SessionsService {
  constructor(
    private readonly questionsService: QuestionsService,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>
  ) {}

  private async create(joinSessionDto: JoinSessionDto) {
    const { difficulty, userId } = joinSessionDto;
    const question = await this.questionsService.getRandom(difficulty);

    const newSession = plainToClass(Session, {
      allowedUserIds: [userId],
      difficulty: joinSessionDto.difficulty,
      question,
    });

    return this.sessionsRepository.save(newSession);
  }

  private joinExisting(session: Session, joinSessionDto: JoinSessionDto) {
    const { userId } = joinSessionDto;
    session.allowedUserIds = [...session.allowedUserIds, userId];
    session.status = Status.InProgress;
    return this.sessionsRepository.save(session);
  }

  async join(joinSessionDto: JoinSessionDto) {
    const { difficulty, userId } = joinSessionDto;

    const isUserInExistingSession = await this.sessionsRepository
      .createQueryBuilder("session")
      .where(":userId = ANY(session.allowedUserIds)", { userId })
      .getOne();

    if (!!isUserInExistingSession) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "You are already in an existing practice session!",
        error: "Bad Request",
      });
    }

    const existingSession = await this.sessionsRepository
      .createQueryBuilder("session")
      .where("session.difficulty = :difficulty", { difficulty })
      .andWhere("ARRAY_LENGTH(session.allowedUserIds, 1) = 1") // only find sessions that have only 1 connected user
      .orderBy("RANDOM()")
      .getOne();

    if (!existingSession) {
      // no session of specified difficulty exists, create new session
      return this.create(joinSessionDto);
    } else {
      return this.joinExisting(existingSession, joinSessionDto);
    }
  }

  findAll() {
    return `This action returns all sessions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} session`;
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: string) {
    return `This action removes a #${id} session`;
  }
}
