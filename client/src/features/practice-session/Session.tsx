import { Box, Container, LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { io } from "socket.io-client";

import QuestionDisplay from "common/components/QuestionDisplay";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket, useOnSocketConnect } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";
import CollaborativeEditor from "features/collaboration/CollaborativeEditor";
import { setIsMatching } from "features/matching/matching.slice";
import ChatBox from "features/practice-session/ChatBox";
import DisconnectedSnackbar from "features/practice-session/DisconnectedSnackbar";
import SessionHeader from "features/practice-session/SessionHeader";
import SessionModal from "features/practice-session/SessionModal";
import {
  selectPracticeSession,
  setQuestion,
  setHasClickedOnSubmitSession,
  setHasEnded,
  setRoomId,
} from "features/practice-session/practice-session.slice";

export default function Session() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const practiceSession = useAppSelector(selectPracticeSession);
  const { setSocket } = useSocket();

  const { question, isPeerOffline, isUserOffline } = practiceSession;

  useEffect(() => {
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
        dispatch(setRoomId(response.id));
        dispatch(setQuestion(response.question));
      }
    });
  });

  useEffect(() => {
    // Bring user to session ended page if
    // both users go offline
    if (isPeerOffline && isUserOffline) {
      dispatch(setHasEnded(true));
    }
  }, [dispatch, isPeerOffline, isUserOffline]);

  useEffect(() => {
    // close is matching modal when user arrives on this page
    dispatch(setIsMatching(false));
  }, [dispatch]);

  if (!question) {
    return <LinearProgress />;
  }

  return (
    <>
      <SessionModal />
      <SessionHeader />
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
            hasSubmitButton
            isSubmitButtonDisabled={isUserOffline}
            onSubmitButtonClick={() =>
              dispatch(setHasClickedOnSubmitSession(true))
            }
          />
          <ChatBox sx={{ flex: 1 }} />
        </Box>
      </Container>
      <DisconnectedSnackbar />
    </>
  );
}
