import { Notes } from "features/past-attempts/notes.type";
import { PracticeSession } from "features/practice-session/practice-session.interface";

export interface PastAttempt extends PracticeSession {
  notes: Notes;
}
