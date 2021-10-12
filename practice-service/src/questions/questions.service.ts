import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Difficulty, Question } from "./entities/question.entity";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>
  ) {}

  getRandom(difficulty: Difficulty) {
    return this.questionsRepository
      .createQueryBuilder("question")
      .where("question.difficulty = :difficulty", { difficulty })
      .orderBy("RANDOM()")
      .getOne();
  }
}
