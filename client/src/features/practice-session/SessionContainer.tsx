import { Box, Container } from "@mui/material";
import React from "react";

import QuestionDisplay from "common/components/QuestionDisplay";
import { useOnSocketDisconnect } from "common/hooks/use-socket.hook";

import CollaborativeEditor, {
  CollaborativeEditorProps,
} from "features/collaboration/CollaborativeEditor";
import SessionNotes from "features/past-attempts/SessionNotes";
import { Notes } from "features/past-attempts/notes.type";
import ChatBox from "features/practice-session/ChatBox";
import LostConnectionPage from "features/practice-session/LostConnectionPage";
import { Question } from "features/practice-session/question.interface";

interface SessionContainerProps {
  question: Question;
  notes?: Notes;
  CollaborativeEditorProps: Omit<CollaborativeEditorProps, "sx">;
}

export default function SessionContainer({
  question,
  notes,
  CollaborativeEditorProps,
}: SessionContainerProps) {
  const [isLostConnection, setIsLostConnection] = React.useState(false);

  useOnSocketDisconnect((reason) => {
    if (
      reason !== "io server disconnect" &&
      reason !== "io client disconnect"
    ) {
      // user has lost connection but not purposefully left the room
      setIsLostConnection(true);
    }
  });

  if (isLostConnection) {
    return <LostConnectionPage />;
  }

  return (
    <Container
      fixed
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <QuestionDisplay
        sx={{
          minHeight: "200px",
          marginBottom: 2,
        }}
        question={question}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: "620px",
          maxHeight: "620px",
        }}
      >
        <CollaborativeEditor
          sx={{ flexBasis: "60%", marginRight: 2 }}
          {...CollaborativeEditorProps}
        />
        {!notes ? (
          <ChatBox sx={{ flex: 1 }} />
        ) : (
          <SessionNotes sx={{ flex: 1, minHeight: "100%" }} notes={notes} />
        )}
      </Box>
    </Container>
  );
}
