import { Box, Container } from "@mui/material";

import QuestionDisplay from "common/components/QuestionDisplay";

import CollaborativeEditor, {
  CollaborativeEditorProps,
} from "features/collaboration/CollaborativeEditor";
import ChatBox from "features/practice-session/ChatBox";
import { Question } from "features/practice-session/question.interface";

interface SessionContainerProps {
  question: Question;
  CollaborativeEditorProps: Omit<CollaborativeEditorProps, "sx">;
}

export default function SessionContainer({
  question,
  CollaborativeEditorProps,
}: SessionContainerProps) {
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
        }}
      >
        <CollaborativeEditor
          sx={{ flexBasis: "60%", marginRight: 2 }}
          {...CollaborativeEditorProps}
        />
        <ChatBox sx={{ flex: 1 }} />
      </Box>
    </Container>
  );
}
