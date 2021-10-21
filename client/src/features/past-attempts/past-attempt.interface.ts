export interface PastAttempt {
  id: string;
  code?: string;
  difficulty: string;
  notes?: string;
  peerDisplayName: string;
  question: { title: string };
}
