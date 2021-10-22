import { LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectUser } from "features/auth/user.slice";
import { PastAttempt } from "features/past-attempts/past-attempt.interface";
import SessionContainer from "features/practice-session/SessionContainer";

export default function PastAttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();

  const user = useAppSelector(selectUser);
  const { data } = useSWR<PastAttempt>(
    user ? [`/practice/${attemptId}`, user.token] : null
  );

  if (!data) {
    return <LinearProgress />;
  }

  return (
    <SessionContainer
      question={data.question}
      showNotes
      CollaborativeEditorProps={{
        readOnly: true,
        defaultValue: JSON.parse(data.code),
      }}
    />
  );
}
