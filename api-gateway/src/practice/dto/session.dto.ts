import { ApiProperty, OmitType } from "@nestjs/swagger";

export class Note {
  @ApiProperty()
  note: string;
}

export class RedactedQuestion {
  @ApiProperty()
  title: string;
}

export class Question extends RedactedQuestion {
  @ApiProperty()
  questionHtml: string;

  @ApiProperty()
  answer: string;

  @ApiProperty({ type: [Note] })
  notes: Note[];
}

export class RedactedSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  peerDisplayName: string;

  @ApiProperty()
  question: RedactedQuestion;
}

export class SessionDto extends OmitType(RedactedSessionDto, [
  "question",
] as const) {
  @ApiProperty()
  code: string;

  @ApiProperty()
  question: Question;
}
