import { LinearProgress } from "@mui/material";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket, useOnSocketConnect } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";
import { setIsMatching } from "features/matching/matching.slice";
import DisconnectedSnackbar from "features/practice-session/DisconnectedSnackbar";
import SessionContainer from "features/practice-session/SessionContainer";
import SessionHeader from "features/practice-session/SessionHeader";
import SessionModal from "features/practice-session/SessionModal";
import { PracticeSession } from "features/practice-session/practice-session.interface";

export default function Session() {
  const [practiceSession, setPracticeSession] =
    React.useState<PracticeSession>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { socket, setSocket } = useSocket();

  useEffect(() => {
    if (user && !socket) {
      // connect to socket if no existing connection exists
      const newSocket = io({
        extraHeaders: { token: user.token },
      });

      setSocket(newSocket);
    }
  }, [user, setSocket, socket]);

  useOnSocketConnect((client) => {
    client.emit("practice:init", undefined, (response: PracticeSession) => {
      if (response) {
        setPracticeSession(response);
      }
    });
  });

  useEffect(() => {
    // close is matching modal when user arrives on this page
    dispatch(setIsMatching(false));
  }, [dispatch]);

  if (!practiceSession) {
    return <LinearProgress />;
  }

  return (
    <>
      <SessionModal />
      <SessionHeader />
      <SessionContainer
        question={practiceSession.question}
        CollaborativeEditorProps={{
          practiceSession,
        }}
      />
      <DisconnectedSnackbar peerDisplayName={practiceSession.peerDisplayName} />
    </>
  );
}
