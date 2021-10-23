import { Typography, Button, Box } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Modal from "common/components/Modal";
import { useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";
import { PracticeSession } from "features/practice-session/practice-session.interface";

interface LeaveSessionModalProps {
  open: boolean;
  practiceSession: PracticeSession;
  setIsLeaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeaveSessionModal({
  open,
  practiceSession,
  setIsLeaving,
}: LeaveSessionModalProps) {
  const [hasEnded, setHasEnded] = React.useState(false);
  const user = useAppSelector(selectUser);
  const { socket } = useSocket();

  return (
    <Modal isOpen={open} outlineColor={"green"}>
      <Box
        width={600}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingY: 4,
          paddingX: 8,
        }}
      >
        {hasEnded ? (
          <>
            <Typography fontWeight={"600"} variant="h4" sx={{ marginY: 2 }}>
              Session Ended
            </Typography>
            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ textAlign: "center", marginBottom: 4 }}
            >
              <Typography
                fontWeight="600"
                variant="h6"
                component="span"
                sx={{ color: "purple.main" }}
              >
                {user && user.displayName}
              </Typography>
              {" & "}
              <Typography
                component="span"
                fontWeight="600"
                variant="h6"
                sx={{ color: "yellow.main" }}
              >
                {practiceSession.peerDisplayName}
              </Typography>
              <Typography fontWeight="600" variant="h6">
                has completed
                <br />
                {practiceSession.question.title}
              </Typography>
            </Typography>
            <Button
              variant="text"
              sx={{
                textDecoration: "underline",
                textTransform: "none",
                fontSize: 20,
                fontWeight: 600,
              }}
              component={RouterLink}
              to={`/past-attempts/${practiceSession.id}`}
            >
              Click to view attempt
            </Button>
            <Typography fontWeight={"600"} variant="h6">
              OR
            </Typography>
            <Button
              variant="text"
              sx={{
                textDecoration: "underline",
                textTransform: "none",
                fontSize: 20,
                fontWeight: 600,
                color: "blue.main",
              }}
              component={RouterLink}
              to="/"
            >
              Go back to dashboard
            </Button>
          </>
        ) : (
          <>
            <Typography
              fontWeight={"600"}
              variant="h4"
              sx={{ marginY: 2, color: "orange.main" }}
            >
              Are you sure?
            </Typography>

            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ textAlign: "center", marginBottom: 4 }}
            >
              Leaving will close the session for both you and your peer!
            </Typography>
            <Box
              width={300}
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="text"
                sx={{
                  textDecoration: "underline",
                  textTransform: "none",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "blue.main",
                }}
                onClick={() => {
                  setIsLeaving(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="text"
                sx={{
                  textDecoration: "underline",
                  textTransform: "none",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "red.main",
                }}
                onClick={() => {
                  socket?.disconnect();
                  setHasEnded(true);
                }}
              >
                Leave
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
