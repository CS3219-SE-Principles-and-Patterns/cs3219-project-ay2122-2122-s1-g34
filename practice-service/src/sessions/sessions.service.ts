import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { CronJob } from "cron";
import { QuestionsService } from "src/questions/questions.service";
import { Repository } from "typeorm";

import { JoinSessionDto } from "./dto/join-session.dto";
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
          this.client.emit("session:removed", { sessionId: result.id });
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
}
