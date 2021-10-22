import { IsString } from "class-validator";

export class UpdateSessionNoteDto {
  @IsString()
  readonly note: string;
}
