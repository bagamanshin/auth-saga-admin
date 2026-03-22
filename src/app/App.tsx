import { lazy, useCallback, type ComponentType } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PrivateRoute } from './providers/PrivateRoute';
import { PublicRoute } from './providers/PublicRoute';
import { PATHS } from '@app/routes/paths';
import './styles/index.css';
import './App.css';
import { withSuspense } from '@shared/hoc';
import type { NotFoundPageProps } from '@pages/not-found';

const NotAuthenticatedLayoutLazy = lazy(() => import('./layouts/NotAuthenticatedLayout').then((m) => ({ default: m.NotAuthenticatedLayout })));
const AuthenticatedLayoutLazy = lazy(() => import('./layouts/AuthenticatedLayout').then((m) => ({ default: m.AuthenticatedLayout })));
const NotFoundPageLazy = lazy<ComponentType<NotFoundPageProps>>(
  () => import('@pages/not-found').then((m) => ({ default: m.NotFoundPage }))
);

const NotFoundPageWithSuspense = withSuspense(NotFoundPageLazy);
const NotAuthenticatedLayoutWithSuspense = withSuspense(NotAuthenticatedLayoutLazy);
const AuthenticatedLayoutWithSuspense = withSuspense(AuthenticatedLayoutLazy);

export const App = () => {
  const dispatch = useDispatch();
  const goHome = useCallback(() => dispatch(push(PATHS.home)), [dispatch]);
  

  return (
    <Switch>
      <PublicRoute
        path={PATHS.login}
        render={() => <NotAuthenticatedLayoutWithSuspense onSuccess={goHome} />}
      />
      <PrivateRoute path={PATHS.home} render={() => <AuthenticatedLayoutWithSuspense />} />
      <Route render={() => <NotFoundPageWithSuspense onGoHome={goHome} />} />
    </Switch>
  );
};
