import { Route, Redirect } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import {useIsAuthenticated} from 'react-auth-kit';

export const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const isAuthenticated = useIsAuthenticated();

  if (!Component) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
