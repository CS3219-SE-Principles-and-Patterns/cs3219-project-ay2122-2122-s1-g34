import { CssBaseline, Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import TopRainbowBar from "common/components/TopRainbowBar";

import Login from "features/auth/Login";
import PrivateRoute from "features/auth/PrivateRoute";
import Register from "features/auth/Register";
import { useUser } from "features/auth/use-user.hook";
import Dashboard from "features/dashboard/Dashboard";
import Leaderboard from "features/leaderboard/Leaderboard";
import PastAttempts from "features/past-attempts/PastAttempts";
import Session from "features/practice-session/Session";
import AppSnackbar from "features/snackbar/AppSnackbar";

export default function App() {
  const isLoaded = useUser();

  if (!isLoaded) {
    // wait for useUser hook to mount before mounting everything
    return null;
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <AppSnackbar />
        <TopRainbowBar />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/past-attempts">
            <PastAttempts />
          </PrivateRoute>
          <PrivateRoute path="/leaderboard">
            <Leaderboard />
          </PrivateRoute>
          <PrivateRoute path="/session">
            <Session />
          </PrivateRoute>
          <PrivateRoute path="/">
            <Dashboard />
          </PrivateRoute>
        </Switch>
      </Box>
    </>
  );
}
