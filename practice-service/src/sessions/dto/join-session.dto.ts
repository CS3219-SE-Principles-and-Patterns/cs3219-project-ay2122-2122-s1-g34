import { IsEnum, IsString } from "class-validator";
import { Difficulty } from "src/questions/entities/question.entity";

export class JoinSessionDto {
  @IsString()
  readonly userId: string;

  @IsEnum(Difficulty)
  readonly difficulty: Difficulty;
}
