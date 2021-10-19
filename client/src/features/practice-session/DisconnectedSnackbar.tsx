import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";

import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectPracticeSession } from "./practice-session.slice";

export default function DisconnectedSnackbar() {
  const practiceSession = useAppSelector(selectPracticeSession);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const { isPeerOffline, peerTwo, isUserOffline } = practiceSession;

  useEffect(() => {
    setIsSnackbarOpen(isPeerOffline);
  }, [isPeerOffline]);

  useEffect(() => {
    setIsSnackbarOpen(isUserOffline);
  }, [isUserOffline]);

  return (
    <Snackbar open={isSnackbarOpen}>
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
          {isUserOffline ? "Your" : `${peerTwo?.displayName}'s`} connection is
          unstable.
          <br />
          Trying to re-connect...
        </Typography>

        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );

  function handleClose() {
    setIsSnackbarOpen(false);
  }
}
