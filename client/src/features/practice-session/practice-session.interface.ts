import { Question } from "./question.interface";

export interface PracticeSession {
  id: string;
  code: string;
  difficulty: string;
  peerDisplayName: string;
  question: Question;
}
