import { Route, Redirect } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store';
import { PATHS } from '@shared/lib/paths';

export const PublicRoute = ({ component: Component, ...rest }: RouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.tokens?.access_token);

  if (!Component) {
    return null;
  }

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
          <Component {...props} />
        )
      }
    />
  );
};
