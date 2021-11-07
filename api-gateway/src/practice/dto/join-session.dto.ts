import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export class JoinSessionDto {
  @ApiProperty({ description: "Difficulty level", enum: Difficulty })
  @IsEnum(Difficulty)
  readonly difficulty: Difficulty;
}
