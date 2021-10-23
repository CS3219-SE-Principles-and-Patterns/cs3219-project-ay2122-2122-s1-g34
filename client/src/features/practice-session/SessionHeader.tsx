import React from "react";

import SessionHeaderContainer from "common/components/SessionHeaderContainer";

interface SessionHeaderProps {
  peerDisplayName: string;
  setIsLeaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SessionHeader({
  peerDisplayName,
  setIsLeaving,
}: SessionHeaderProps) {
  return (
    <SessionHeaderContainer
      headerText="Peers in Session"
      peerDisplayName={peerDisplayName}
      onLeaveSessionClick={() => {
        setIsLeaving(true);
      }}
    />
  );
}
