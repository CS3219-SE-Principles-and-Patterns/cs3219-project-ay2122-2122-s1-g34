import SessionHeaderContainer from "common/components/SessionHeaderContainer";
import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectPracticeSession } from "features/practice-session/practice-session.slice";

export default function SessionHeader() {
  const practiceSession = useAppSelector(selectPracticeSession);

  const { peerTwo } = practiceSession;
  return (
    <SessionHeaderContainer
      headerText="Peers in Session"
      peerDisplayName={peerTwo?.displayName as string}
      hasEndSession
    />
  );
}
