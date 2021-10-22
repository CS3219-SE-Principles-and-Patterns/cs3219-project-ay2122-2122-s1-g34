import { IsString } from "class-validator";

export class UpdateSessionNoteDto {
  @IsString()
  readonly sessionId: string;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly note: string;
}
