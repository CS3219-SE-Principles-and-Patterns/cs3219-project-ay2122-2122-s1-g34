import { useRouteMatch, Switch, Route } from "react-router-dom";

import PastAttemptPage from "features/past-attempts/PastAttemptPage";
import PastAttempts from "features/past-attempts/PastAttempts";

export default function PastAttemptsPage() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <PastAttempts />
      </Route>
      <Route path={`${path}/:attemptId`}>
        <PastAttemptPage />
      </Route>
    </Switch>
  );
}
