import { Button, Typography, Grid } from "@mui/material";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";

import Header from "../../common/components/Header";
import {
  selectPracticeSession,
  setHasClickedOnLeaveSession,
} from "./practice-session.slice";

export default function SessionHeader() {
  const dispatch = useAppDispatch();
  const practiceSession = useAppSelector(selectPracticeSession);

  const { peerOne, peerTwo, isPeerOffline, isUserOffline } = practiceSession;
  return (
    <Header>
      <Grid
        container
        item
        xs={2}
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item>
          <Typography fontWeight="600" variant="h5">
            Peers in Session
          </Typography>
        </Grid>

        <Grid container item columns={2} spacing={2}>
          <Grid
            item
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ color: isUserOffline ? "gray.main" : "purple.main" }}
            >
              {peerOne?.displayName}
            </Typography>
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ color: isPeerOffline ? "gray.main" : "yellow.main" }}
            >
              {peerTwo?.displayName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="small"
        sx={{
          borderRadius: 40,
          paddingX: 1,
          fontSize: 18,
          fontWeight: "regular",
          color: "lightGray.main",
          backgroundColor: "red.main",
          textTransform: "none",
        }}
        onClick={onLeaveSessionClick}
        disabled={isUserOffline}
      >
        Leave Session
      </Button>
    </Header>
  );

  function onLeaveSessionClick() {
    dispatch(setHasClickedOnLeaveSession(true));
  }
}
