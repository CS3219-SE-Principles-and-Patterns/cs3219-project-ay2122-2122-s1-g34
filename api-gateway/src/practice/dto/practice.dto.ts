import { ApiProperty } from "@nestjs/swagger";

import { Question } from "./session.dto";

export class PracticeDto {
  @ApiProperty()
  peerDisplayName: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  allowedUserIds: string[];

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  question: Question;
}
