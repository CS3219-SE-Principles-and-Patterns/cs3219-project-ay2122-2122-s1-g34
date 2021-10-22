import { Question } from "features/practice-session/question.interface";

export interface PastAttempt {
  id: string;
  code: string;
  difficulty: string;
  peerDisplayName: string;
  question: Question;
}
