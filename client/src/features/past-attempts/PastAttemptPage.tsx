import { LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";

import { useAppSelector } from "common/hooks/use-redux.hook";
import { useSWR } from "common/hooks/use-swr.hook";

import { selectUser } from "features/auth/user.slice";
import { PastAttempt } from "features/past-attempts/past-attempt.interface";
import SessionContainer from "features/practice-session/SessionContainer";

function parseJson(str: string) {
  try {
    const result = JSON.parse(str);
    return result;
  } catch {
    return str;
  }
}

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
      notes={data.notes}
      CollaborativeEditorProps={{
        readOnly: true,
        defaultValue: parseJson(data.code),
      }}
    />
  );
}
