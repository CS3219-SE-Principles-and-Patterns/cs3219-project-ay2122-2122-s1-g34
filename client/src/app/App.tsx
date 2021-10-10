import { CssBaseline } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import TopRainbowBar from "common/components/TopRainbowBar";

import Login from "features/auth/Login";
import PrivateRoute from "features/auth/PrivateRoute";
import Register from "features/auth/Register";
import { useUser } from "features/auth/use-user.hook";
import Dashboard from "features/dashboard/Dashboard";
import Leaderboard from "features/leaderboard/Leaderboard";
import PastAttempts from "features/past-attempts/PastAttempts";
import AppSnackbar from "features/snackbar/AppSnackbar";

export default function App() {
  const isLoaded = useUser();

  if (!isLoaded) {
    // wait for useUser hook to mount before mounting everything
    return null;
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <CssBaseline />
      <AppSnackbar />
      <Switch>
        <Route path="/login">
          <TopRainbowBar />
          <Login />
        </Route>
        <Route path="/register">
          <TopRainbowBar />
          <Register />
        </Route>

        <PrivateRoute path="/">
          <TopRainbowBar />
          <Dashboard />
        </PrivateRoute>

        <PrivateRoute path="/past-attempts">
          <TopRainbowBar />
          <PastAttempts />
        </PrivateRoute>

        <PrivateRoute path="/leaderboard">
          <TopRainbowBar />
          <Leaderboard />
        </PrivateRoute>
      </Switch>
    </div>
  );
}
