import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern('createQuestion')
  create(@Payload() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @MessagePattern('findAllQuestions')
  findAll() {
    return this.questionsService.findAll();
  }

  @MessagePattern('findOneQuestion')
  findOne(@Payload() id: number) {
    return this.questionsService.findOne(id);
  }

  @MessagePattern('updateQuestion')
  update(@Payload() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(updateQuestionDto.id, updateQuestionDto);
  }

  @MessagePattern('removeQuestion')
  remove(@Payload() id: number) {
    return this.questionsService.remove(id);
  }
}
