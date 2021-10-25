import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { CronJob } from "cron";
import { QuestionsService } from "src/questions/questions.service";
import { Repository } from "typeorm";

import { CheckSessionAnswerDto } from "./dto/check-session-answer.dto";
import { FindOneSessionDto } from "./dto/find-one-session.dto";
import { HandleSessionDisconnectingDto } from "./dto/handle-session-disconnecting.dto";
import { JoinSessionDto } from "./dto/join-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Session, Status } from "./entities/session.entity";

@Injectable()
export class SessionsService {
  constructor(
    private readonly questionsService: QuestionsService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject("API_GATEWAY_SERVICE") private client: ClientProxy,
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
    const result = await this.sessionsRepository.save(newSession);

    // remove session if no other user connects within 15 seconds
    const job = new CronJob(
      new Date(result.createdAt.getTime() + 15 * 1000),
      async () => {
        const deleteResult = await this.sessionsRepository
          .createQueryBuilder("session")
          .delete()
          .where("session.id = :id", { id: result.id })
          .andWhere(`ARRAY_LENGTH("session"."allowedUserIds", 1) < 2`)
          .execute();
        if (deleteResult.affected !== 0) {
          this.client.emit("session:removed", result.id);
        }
      }
    );
    this.schedulerRegistry.addCronJob(`remove-session-${result.id}`, job);
    job.start();

    return result;
  }

  private joinExisting(session: Session, joinSessionDto: JoinSessionDto) {
    const { userId } = joinSessionDto;
    session.allowedUserIds = [...session.allowedUserIds, userId];
    session.status = Status.InProgress;
    this.client.emit("session:started", session.id);
    return this.sessionsRepository.save(session);
  }

  findAllClosedSessions(userId: string) {
    return this.sessionsRepository
      .createQueryBuilder("session")
      .select([
        "session.id",
        "session.difficulty",
        "session.allowedUserIds",
        "question.title",
      ])
      .where("session.allowedUserIds @> (:userId)", {
        userId: [userId],
      })
      .andWhere("session.status = :status", { status: Status.Closed })
      .leftJoin("session.question", "question")
      .getMany();
  }

  findOneClosedSession(findOneSessionDto: FindOneSessionDto) {
    return this.sessionsRepository
      .createQueryBuilder("session")
      .select([
        "session.id",
        "session.difficulty",
        "session.allowedUserIds",
        "session.code",
        "question.title",
        "question.questionHtml",
        "question.answer",
        "notes.note",
      ])
      .where("session.allowedUserIds @> (:userId)", {
        userId: [findOneSessionDto.userId],
      })
      .andWhere("session.status = :status", { status: Status.Closed })
      .andWhere("session.id = :id", { id: findOneSessionDto.id })
      .leftJoin("session.question", "question")
      .leftJoin("session.notes", "notes", "notes.userId = :currUserId", {
        currUserId: findOneSessionDto.userId,
      })
      .getOne();
  }

  findOneUnclosedSession(userId: string) {
    return this.sessionsRepository
      .createQueryBuilder("session")
      .where("session.allowedUserIds @> (:userId)", {
        userId: [userId],
      })
      .andWhere("session.status != :status", { status: Status.Closed })
      .getOne();
  }

  findOneInProgressSessionByUser(userId: string) {
    return this.sessionsRepository
      .createQueryBuilder("session")
      .select(["session.id", "question.title"])
      .where("session.allowedUserIds @> (:userId)", {
        userId: [userId],
      })
      .leftJoin("session.question", "question")
      .andWhere("session.status = :status", { status: Status.InProgress })
      .getOne();
  }

  async findOneInProgressSession(id: string) {
    const result = await this.sessionsRepository
      .createQueryBuilder("session")
      .select([
        "session.id",
        "session.allowedUserIds",
        "question.title",
        "question.questionHtml",
      ])
      .leftJoin("session.question", "question")
      .where("session.id = :id", { id })
      .andWhere("session.status = :status", { status: Status.InProgress })
      .getOne();

    return result;
  }

  async join(joinSessionDto: JoinSessionDto) {
    const { difficulty, userId } = joinSessionDto;

    const isUserInUnclosedSession = await this.findOneUnclosedSession(userId);
    if (!!isUserInUnclosedSession) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "You are already in an existing practice session!",
        error: "Bad Request",
      });
    }

    const existingSession = await this.sessionsRepository
      .createQueryBuilder("session")
      .where("session.difficulty = :difficulty", { difficulty })
      .andWhere("ARRAY_LENGTH(session.allowedUserIds, 1) = 1") // only find sessions that has 1 connected user
      .orderBy("RANDOM()")
      .getOne();

    if (!existingSession) {
      // no session of specified difficulty exists, create new session
      return this.create(joinSessionDto);
    } else {
      return this.joinExisting(existingSession, joinSessionDto);
    }
  }

  update(updateSessionDto: UpdateSessionDto) {
    const updatedSession = plainToClass(Session, updateSessionDto);
    return this.sessionsRepository.save(updatedSession);
  }

  async checkAnswer(checkSessionAnswerDto: CheckSessionAnswerDto) {
    const session = await this.sessionsRepository
      .createQueryBuilder("session")
      .select(["session.id", "question.answer"])
      .leftJoin("session.question", "question")
      .where("session.id = :id", { id: checkSessionAnswerDto.id })
      .getOne();

    return session.question.answer === checkSessionAnswerDto.answer;
  }

  async handleSessionDisconnecting(
    handleSessionDisconnectingDto: HandleSessionDisconnectingDto
  ) {
    const { isDisconnectIntentional, sessionId } =
      handleSessionDisconnectingDto;

    const session = await this.sessionsRepository
      .createQueryBuilder("session")
      .where("session.id = :sessionId", {
        sessionId,
      })
      .getOne();
    if (!session) {
      return;
    }

    if (session.status === Status.Open) {
      // delete session if user disconnects (purposefully or not) even before anyone has joined the room
      await this.sessionsRepository.remove(session);
    } else if (
      session.status === Status.InProgress &&
      isDisconnectIntentional
    ) {
      // close session if a single user purposefully disconnects while session is in progress
      session.status = Status.Closed;
      await this.sessionsRepository.save(session);
    }
  }
}
