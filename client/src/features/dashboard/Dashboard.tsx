import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import BackdropSpinner from "common/components/BackdropSpinner";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket, useOnSocketDisconnect } from "common/hooks/use-socket.hook";

import SignedInHeader from "features/auth/SignedInHeader";
import { logout, selectUser } from "features/auth/user.slice";
import DashboardCard from "features/dashboard/DashboardCard";
import { joinSession } from "features/dashboard/join-session.util";
import MatchingModal from "features/matching/MatchingModal";
import {
  setIsMatching,
  setDifficulty,
  setHasTimeout,
  DifficultyLevel,
} from "features/matching/matching.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

export default function Dashboard() {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const user = useAppSelector(selectUser);
  const { open } = useSnackbar();
  const { socket, setSocket } = useSocket();
  useOnSocketDisconnect(() => {
    dispatch(setIsMatching(false));
    setIsLoading(false);
  });

  // TODO: replace dummy data
  const dayStreak = "3rd";
  const userDisplayName = user ? user.displayName : "";

  React.useEffect(() => {
    if (socket) {
      const callback = () => {
        history.push("/session");
      };
      socket.on("session:started", callback);

      return () => {
        socket.off("session:started", callback);
      };
    }
  }, [socket, history]);

  return (
    <>
      <BackdropSpinner open={isLoading} />
      <MatchingModal />
      <SignedInHeader />
      <Container maxWidth="lg" disableGutters sx={{ paddingY: 1 }}>
        <Box sx={{ display: "flex", flex: 1, alignSelf: "flex-start" }}>
          <Typography fontWeight={"medium"} gutterBottom>
            Welcome back {userDisplayName}, complete a task to get your{" "}
            <Typography
              component="span"
              fontWeight={"bold"}
              sx={{ display: "inline" }}
            >
              {dayStreak}
            </Typography>{" "}
            day streak.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            gutterBottom
            fontWeight={"bold"}
            color={"black.main"}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Quick Start
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <DashboardCard
                  outlineColor={"green"}
                  title={"Easy question"}
                  subtitle={"Going chill today"}
                  onCardClick={() => quickStartQuestion("easy")}
                />
              </Grid>
              <Grid item xs={4}>
                <DashboardCard
                  outlineColor={"orange"}
                  title={"Medium question"}
                  subtitle={"Looking for a challenge"}
                  onCardClick={() => quickStartQuestion("medium")}
                />
              </Grid>

              <Grid item xs={4}>
                <DashboardCard
                  outlineColor={"red"}
                  title={"Hard question"}
                  subtitle={"Bring it on!"}
                  onCardClick={() => quickStartQuestion("hard")}
                />
              </Grid>
            </Grid>
          </Box>

          <Typography
            component="h1"
            variant="h6"
            gutterBottom
            fontWeight={"bold"}
            color={"black.main"}
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            OR
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <DashboardCard
                  outlineColor={"purple"}
                  title={"Continue a task"}
                  subtitle={"No on-going task"}
                  onCardClick={continueOngoingTask}
                  disabled
                />
              </Grid>
              <Grid item xs={3}>
                <DashboardCard
                  outlineColor={"violet"}
                  title={"Check out the Leaderboard"}
                  subtitle={"Woah who is that?"}
                  component={RouterLink}
                  to="/leaderboard"
                />
              </Grid>

              <Grid item xs={3}>
                <DashboardCard
                  outlineColor={"blue"}
                  title={"Review past attempts"}
                  subtitle={"What was it again?"}
                  component={RouterLink}
                  to="/past-attempts"
                />
              </Grid>

              <Grid item xs={3}>
                <DashboardCard
                  outlineColor={"yellow"}
                  title={"Logout"}
                  subtitle={"See you again!"}
                  onCardClick={() => {
                    dispatch(logout());
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );

  /**
   * Shows the matching modal and starts matching the
   * user with another available user.
   * @param difficulty Difficulty level of the question
   */
  async function quickStartQuestion(difficulty: DifficultyLevel) {
    try {
      setIsLoading(true);
      const socket = await joinSession(difficulty);
      setSocket(socket);

      dispatch(setIsMatching(true));
      dispatch(setHasTimeout(false));
      dispatch(setDifficulty(difficulty));
    } catch (e: any) {
      if (
        e?.response?.data?.message &&
        typeof e?.response?.data?.message === "object"
      ) {
        open({ message: e.response.data.message, severity: "error" });
      } else {
        open({
          message:
            "An error has occurred. You are unable to join a practice session.",
          severity: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function continueOngoingTask() {
    // TODO: navigate to practice session
    console.log("Continues on-going task");
  }
}
