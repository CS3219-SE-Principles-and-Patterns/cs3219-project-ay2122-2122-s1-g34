import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateSessionNoteDto {
  @ApiProperty({ description: "Note content" })
  @IsString()
  readonly note: string;
}
