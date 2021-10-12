import { IsEnum } from "class-validator";

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export class JoinSessionDto {
  @IsEnum(Difficulty)
  readonly difficulty: Difficulty;
}
