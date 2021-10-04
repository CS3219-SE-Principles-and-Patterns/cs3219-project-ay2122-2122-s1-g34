import { Route, Redirect, RouteProps } from "react-router-dom";

import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectUser } from "features/auth/user.slice";

export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const user = useAppSelector(selectUser);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
