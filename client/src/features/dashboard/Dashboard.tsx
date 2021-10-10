import { signOut } from "@firebase/auth";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Redirect, useHistory } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { auth } from "common/utils/firebase.util";

import SignedInHeader from "features/auth/SignedInHeader";
import { removeUserStorage } from "features/auth/user-storage.util";
import { selectUser } from "features/auth/user.slice";
import MatchingModal from "features/matching/MatchingModal";
import {
  setIsMatching,
  setDifficulty,
  setHasTimeout,
  DifficultyLevel,
} from "features/matching/matching.slice";

import DashboardCard from "./DashboardCard";

export default function Dashboard() {
  const history = useHistory();

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // TODO: replace dummy data
  const dayStreak = "3rd";
  const userDisplayName = user ? user.displayName : "";

  return !!user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <>
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
                  onCardClick={navigateToLeaderboard}
                />
              </Grid>

              <Grid item xs={3}>
                <DashboardCard
                  outlineColor={"blue"}
                  title={"Review past attempts"}
                  subtitle={"What was it again?"}
                  onCardClick={navigateToPastAttempts}
                />
              </Grid>

              <Grid item xs={3}>
                <DashboardCard
                  outlineColor={"yellow"}
                  title={"Logout"}
                  subtitle={"See you again!"}
                  onCardClick={logout}
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
  function quickStartQuestion(difficulty: DifficultyLevel) {
    dispatch(setIsMatching(true));
    dispatch(setHasTimeout(false));
    dispatch(setDifficulty(difficulty));

    // TODO: match with a peer
  }

  function continueOngoingTask() {
    // TODO: navigate to leaderboard
    console.log("Continues on-going task");
  }

  function navigateToLeaderboard() {
    history.push("/leaderboard");
  }

  function navigateToPastAttempts() {
    history.push("/past-attempts");
  }

  /**
   * Removes the current user from the user
   * storage and signs the user out.
   */
  async function logout() {
    removeUserStorage();
    await signOut(auth);
  }
}
