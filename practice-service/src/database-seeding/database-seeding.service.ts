import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Question } from "src/questions/entities/question.entity";
import { Repository } from "typeorm";

import * as questions from "./data/questions/questions.json";

@Injectable()
export class DatabaseSeedingService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>
  ) {}

  async seedQuestions() {
    for (const question of questions) {
      const newQuestion = plainToClass(Question, question);
      await this.questionsRepository.save(newQuestion);
    }
  }
}
