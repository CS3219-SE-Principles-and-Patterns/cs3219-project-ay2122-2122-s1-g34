import { useParams } from "react-router-dom";

export default function PastAttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();

  return null;
}
