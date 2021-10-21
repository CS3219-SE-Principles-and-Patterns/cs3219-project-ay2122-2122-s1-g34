import { IsString } from "class-validator";

export class UpdateSessionDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly code: string;
}
