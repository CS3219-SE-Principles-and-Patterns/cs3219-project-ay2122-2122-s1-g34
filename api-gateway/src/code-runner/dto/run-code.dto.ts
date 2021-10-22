import { IsString } from "class-validator";

export class RunCodeDto {
  @IsString()
  readonly code: string;
}
