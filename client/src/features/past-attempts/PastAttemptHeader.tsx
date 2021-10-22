import SessionHeaderContainer from "common/components/SessionHeaderContainer";

interface PastAttemptHeaderProps {
  peerDisplayName: string;
}

export default function PastAttemptHeader({
  peerDisplayName,
}: PastAttemptHeaderProps) {
  return (
    <SessionHeaderContainer
      headerText="Review Session"
      peerDisplayName={peerDisplayName}
    />
  );
}
