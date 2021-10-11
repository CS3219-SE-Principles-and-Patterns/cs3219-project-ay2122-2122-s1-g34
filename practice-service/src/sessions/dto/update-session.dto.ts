import { IsString, IsUUID } from "class-validator";

export class UpdateSessionDto {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly secondUserId: string;
}
