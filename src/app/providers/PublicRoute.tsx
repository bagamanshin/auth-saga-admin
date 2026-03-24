import { Route, Redirect } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from '@app/routes/paths';
import { selectSessionTokens } from '@entities/session';

export const PublicRoute = ({ component: Component, render, ...rest }: RouteProps) => {
  const isAuthenticated = useSelector(selectSessionTokens);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect
            to={{
              pathname: PATHS.home,
              state: { from: props.location },
            }}
          />
        ) : (
          Component ? (
            <Component {...props} />
          ) : (
            render?.(props)
          )
        )
      }
    />
  );
};
