import { ApiProperty } from "@nestjs/swagger";

export class Note {
  @ApiProperty()
  note: string;
}

export class Question {
  @ApiProperty()
  title: string;

  @ApiProperty()
  questionHtml: string;

  @ApiProperty()
  answer: string;

  @ApiProperty({ type: [Note] })
  notes: Note[];
}

export class SessionDto {
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
