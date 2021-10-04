import { CssBaseline, Typography } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import Login from "features/auth/Login";
import PrivateRoute from "features/auth/PrivateRoute";
import Register from "features/auth/Register";
import { useUser } from "features/auth/use-user.hook";
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
      <AppSnackbar />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <PrivateRoute path="/">
          <Typography>Signed in</Typography>
        </PrivateRoute>
      </Switch>
    </>
  );
}
