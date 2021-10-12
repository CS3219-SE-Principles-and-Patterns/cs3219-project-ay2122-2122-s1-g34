import { Box, Container, LinearProgress } from "@mui/material";
import React from "react";
import { io } from "socket.io-client";

import { useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket, useOnSocketConnect } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";
import CollaborativeEditor from "features/collaboration/CollaborativeEditor";
import ChatBox from "features/practice-session/ChatBox";
import QuestionDisplay from "features/practice-session/QuestionDisplay";
import { Question } from "features/practice-session/question.interface";

export default function Session() {
  const user = useAppSelector(selectUser);
  const { setSocket } = useSocket();
  const [question, setQuestion] = React.useState<Question>();

  React.useEffect(() => {
    if (user) {
      const newSocket = io({
        extraHeaders: { token: user.token },
      });

      setSocket(newSocket);
    }
  }, [user, setSocket]);

  useOnSocketConnect((client) => {
    client.emit("practice:init", undefined, (response: any) => {
      if (response) {
        setQuestion(response.question);
      }
    });
  });

  if (!question) {
    return <LinearProgress />;
  }

  return (
    <Container
      fixed
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingY: 2,
        flexGrow: 1,
      }}
    >
      <QuestionDisplay
        sx={{
          minHeight: "230px",
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
        <CollaborativeEditor sx={{ flexBasis: "60%", marginRight: 2 }} />
        <ChatBox sx={{ flex: 1 }} />
      </Box>
    </Container>
  );
}
