import { LinearProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket, useOnSocketConnect } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";
import { setIsMatching } from "features/matching/matching.slice";
import DisconnectedSnackbar from "features/practice-session/DisconnectedSnackbar";
import LeaveSessionModal from "features/practice-session/LeaveSessionModal";
import SessionContainer from "features/practice-session/SessionContainer";
import SessionHeader from "features/practice-session/SessionHeader";
import { PracticeSession } from "features/practice-session/practice-session.interface";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

export default function Session() {
  const [hasSessionEnded, setHasSessionEnded] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);
  const [practiceSession, setPracticeSession] =
    React.useState<PracticeSession>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const user = useAppSelector(selectUser);
  const { open } = useSnackbar();
  const { socket, setSocket } = useSocket();

  useEffect(() => {
    if (user && !socket) {
      // connect to socket if no existing connection exists
      const newSocket = io({
        extraHeaders: { token: user.token },
      });

      const onError = () => {
        open({
          severity: "error",
          message: "An unspecified error has occurred",
        });
        history.push("/");
      };

      newSocket.on("practice:error", onError);

      setSocket(newSocket);

      return () => {
        newSocket.off("practice:error", onError);
      };
    }
    // eslint-disable-next-line
  }, []);

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

  useEffect(() => {
    if (socket) {
      socket.on("practice:ended", () => {
        setHasSessionEnded(true);
        setIsLeaving(true);
        socket.disconnect();
      });
    }
  }, [socket]);

  if (!practiceSession) {
    return <LinearProgress />;
  }

  return (
    <>
      <LeaveSessionModal
        open={isLeaving}
        setIsLeaving={setIsLeaving}
        practiceSession={practiceSession}
        hasSessionEnded={hasSessionEnded}
      />
      <SessionHeader
        peerDisplayName={practiceSession.peerDisplayName}
        setIsLeaving={setIsLeaving}
      />
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
