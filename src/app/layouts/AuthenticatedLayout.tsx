import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { PATHS } from '@shared/lib/paths';
import { AdminLayout } from './AdminLayout';
import { withSuspense } from '@shared/hoc';

const PostsLayout = lazy(() => import('./PostsLayout').then((m) => ({ default: m.PostsLayout })));

export const AuthenticatedLayout: React.FC = () => (
  <AdminLayout>
    <Switch>
      <Route path={[PATHS.home, PATHS.postEdit]} component={withSuspense(PostsLayout)} />
    </Switch>
  </AdminLayout>
);

export default AuthenticatedLayout;
