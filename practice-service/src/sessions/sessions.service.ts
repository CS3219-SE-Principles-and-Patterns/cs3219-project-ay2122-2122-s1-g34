import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { QuestionsService } from "src/questions/questions.service";
import { Repository } from "typeorm";

import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionsService {
  constructor(
    private readonly questionsService: QuestionsService,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const { difficulty, userId } = createSessionDto;
    const question = await this.questionsService.getRandom(difficulty);

    const newSession = plainToClass(Session, {
      allowedUserIds: [userId],
      difficulty: createSessionDto.difficulty,
      question: question,
    });

    return this.sessionsRepository.save(newSession)
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
