import { Button, Typography, Grid } from "@mui/material";

import Header from "common/components/Header";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";

import { selectUser } from "features/auth/user.slice";
import { setHasClickedOnLeaveSession } from "features/practice-session/practice-session.slice";

interface SessionHeaderContainerProps {
  headerText: string;
  peerDisplayName: string;
  hasEndSession?: boolean;
}

export default function SessionHeaderContainer({
  headerText,
  peerDisplayName,
  hasEndSession,
}: SessionHeaderContainerProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

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
            {headerText}
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
              sx={{ color: "purple.main" }}
            >
              {user.displayName}
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
              sx={{ color: "yellow.main" }}
            >
              {peerDisplayName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {hasEndSession && (
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
        >
          Leave Session
        </Button>
      )}
    </Header>
  );

  function onLeaveSessionClick() {
    dispatch(setHasClickedOnLeaveSession(true));
  }
}
