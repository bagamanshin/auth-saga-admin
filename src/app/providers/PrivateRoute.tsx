import { Route, Redirect } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from '@shared/config/routes';
import { selectSessionTokens } from '@entities/session';

export const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const isAuthenticated = useSelector(selectSessionTokens);

  if (!Component) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: PATHS.login,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
