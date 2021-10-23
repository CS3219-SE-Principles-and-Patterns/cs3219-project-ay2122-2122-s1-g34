import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";

import { useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";

interface DisconnectedSnackbarProps {
  peerDisplayName: string;
}

export default function DisconnectedSnackbar({
  peerDisplayName,
}: DisconnectedSnackbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [disconnectedUser, setDisconnectedUser] = useState<string>();
  const user = useAppSelector(selectUser);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("practice:peer-lost-connection", () => {
        // peer has lost connection
        setDisconnectedUser(peerDisplayName);
        setIsOpen(true);
      });

      socket.on("disconnect", (reason) => {
        if (
          reason !== "io server disconnect" &&
          reason !== "io client disconnect" &&
          user
        ) {
          // user has lost connection but not purposefully left the room
          setDisconnectedUser(user.id);
          setIsOpen(true);
        }
      });

      socket.on("practice:peer-joined", () => {
        // peer rejoined session
        setIsOpen(false);
      });
    }
  }, [socket, peerDisplayName, user]);

  return (
    <Snackbar open={isOpen}>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          backgroundColor: "white",
          boxShadow: 8,
          padding: 4,
          borderRadius: 4,
        }}
      >
        <Typography sx={{ marginRight: 2 }}>
          {(user && user.id) === disconnectedUser
            ? "Your"
            : `${disconnectedUser}'s`}{" "}
          connection is unstable.
          <br />
          Trying to re-connect...
        </Typography>

        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
