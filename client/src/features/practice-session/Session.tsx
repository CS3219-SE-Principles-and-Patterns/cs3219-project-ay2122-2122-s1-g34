import { LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { io } from "socket.io-client";

import QuestionDisplay from "common/components/QuestionDisplay";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket, useOnSocketConnect } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";
import { setIsMatching } from "features/matching/matching.slice";
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

import SessionContainer from "./SessionContainer";

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
      <SessionContainer
        question={question}
        CollaborativeEditorProps={{
          hasSubmitButton: true,
          isSubmitButtonDisabled: isUserOffline,
          onSubmitButtonClick: () =>
            dispatch(setHasClickedOnSubmitSession(true)),
        }}
      />
      <DisconnectedSnackbar />
    </>
  );
}
