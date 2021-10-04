import { CssBaseline } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import Register from "features/registration/Register";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Switch>
        <Route path="/login"></Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/"></Route>
      </Switch>
    </>
  );
}
