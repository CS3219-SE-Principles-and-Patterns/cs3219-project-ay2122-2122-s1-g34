export interface Session {
  id: string;
  allowedUserIds: string[];
  difficulty: string;
  code: string;
  question: {
    title: string;
    questionHtml: string;
    answer: string;
    notes: { note: string }[];
  };
}
