import { IsString } from "class-validator";

export class FindOneSessionDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly userId: string;
}
