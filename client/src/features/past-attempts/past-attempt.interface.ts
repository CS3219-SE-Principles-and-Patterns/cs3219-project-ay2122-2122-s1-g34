import { Notes } from "features/past-attempts/notes.type";
import { Question } from "features/practice-session/question.interface";

export interface PastAttempt {
  id: string;
  code: string;
  difficulty: string;
  peerDisplayName: string;
  question: Question;
  notes: Notes;
}
