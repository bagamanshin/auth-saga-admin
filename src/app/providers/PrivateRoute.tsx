import { Route, Redirect } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from '@app/routes/paths';
import { selectSessionTokens } from '@entities/session';

export const PrivateRoute = ({ component: Component, render, ...rest }: RouteProps) => {
  const isAuthenticated = useSelector(selectSessionTokens);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          Component ? (
            <Component {...props} />
          ) : (
            render?.(props)
          )
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
