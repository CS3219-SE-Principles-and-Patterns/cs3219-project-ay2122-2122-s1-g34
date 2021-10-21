import { IsString } from "class-validator";

export class ChatDto {
  @IsString()
  displayName: string;

  @IsString()
  message: string;
}
