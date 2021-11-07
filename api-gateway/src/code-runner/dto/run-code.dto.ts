import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RunCodeDto {
  @ApiProperty({ description: "JavaScript code to run", example: `const foo = "hello world!";\nfoo;` })
  @IsString()
  readonly code: string;
}
