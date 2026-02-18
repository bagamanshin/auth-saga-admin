import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { PATHS } from '@shared/lib/paths';
import { AdminLayout } from './AdminLayout';
import { withSuspense } from '@shared/hoc';

const HomePage = lazy(() => import('@pages/home').then((m) => ({ default: m.HomePage })));
const PostsLayout = lazy(() => import('./PostsLayout').then((m) => ({ default: m.PostsLayout })));
const AuthorsLayout = lazy(() => import('./AuthorsLayout').then((m) => ({ default: m.AuthorsLayout })));
const TagsLayout = lazy(() => import('./TagsLayout').then((m) => ({ default: m.TagsLayout })));

export const AuthenticatedLayout: React.FC = () => (
  <AdminLayout>
    <Switch>
      <Route path={[PATHS.tags, PATHS.tagEdit]} component={withSuspense(TagsLayout)} />
      <Route path={[PATHS.authors, PATHS.authorEdit]} component={withSuspense(AuthorsLayout)} />
      <Route path={[PATHS.posts, PATHS.postEdit]} component={withSuspense(PostsLayout)} />
      <Route exact path={PATHS.home} component={withSuspense(HomePage)} />
    </Switch>
  </AdminLayout>
);

export default AuthenticatedLayout;
