import { IsString } from "class-validator";

export class CheckSessionAnswerDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly answer: string;
}
