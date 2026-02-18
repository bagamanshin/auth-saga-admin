import { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './providers/PrivateRoute';
import { PublicRoute } from './providers/PublicRoute';
import { PATHS } from '@shared/lib/paths';
import './styles/index.css';
import './App.css';
import { withSuspense } from '@shared/hoc';

const NotAuthenticatedLayoutLazy = lazy(() => import('./layouts/NotAuthenticatedLayout').then((m) => ({ default: m.NotAuthenticatedLayout })));
const AuthenticatedLayoutLazy = lazy(() => import('./layouts/AuthenticatedLayout').then((m) => ({ default: m.AuthenticatedLayout })));
const NotFoundPageLazy = lazy(() => import('@pages/not-found').then((m) => ({ default: m.NotFoundPage })));

export const App = () => {
  return (
    <Switch>
      <PublicRoute path={PATHS.login} component={withSuspense(NotAuthenticatedLayoutLazy)} />
      <PrivateRoute path={PATHS.home} component={withSuspense(AuthenticatedLayoutLazy)} />
      <Route component={withSuspense(NotFoundPageLazy)} />
    </Switch>
  );
};
