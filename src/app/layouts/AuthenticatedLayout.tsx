import React, { lazy, useCallback } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@app/routes/paths';
import { AdminLayout } from './AdminLayout';
import { withSuspense } from '@shared/hoc';
import type { HomePageProps } from '@pages/home';

const HomePage = lazy<React.ComponentType<HomePageProps>>(
  () => import('@pages/home').then((m) => ({ default: m.HomePage }))
);
const PostsLayout = lazy(() => import('./PostsLayout').then((m) => ({ default: m.PostsLayout })));
const AuthorsLayout = lazy(() => import('./AuthorsLayout').then((m) => ({ default: m.AuthorsLayout })));
const TagsLayout = lazy(() => import('./TagsLayout').then((m) => ({ default: m.TagsLayout })));

const HomePageWithSuspense = withSuspense(HomePage);
const TagsLayoutWithSuspense = withSuspense(TagsLayout);
const AuthorsLayoutWithSuspense = withSuspense(AuthorsLayout);
const PostsLayoutWithSuspense = withSuspense(PostsLayout);

export const AuthenticatedLayout: React.FC = () => {
  const dispatch = useDispatch();
  const goPosts = useCallback(() => dispatch(push(PATHS.posts)), [dispatch]);
  const goAuthors = useCallback(() => dispatch(push(PATHS.authors)), [dispatch]);
  const goTags = useCallback(() => dispatch(push(PATHS.tags)), [dispatch]);

  return (
    <AdminLayout>
      <Switch>
        <Route path={[PATHS.tags, PATHS.tagEdit]} render={() => <TagsLayoutWithSuspense />} />
        <Route path={[PATHS.authors, PATHS.authorEdit]} render={() => <AuthorsLayoutWithSuspense />} />
        <Route path={[PATHS.posts, PATHS.postEdit]} render={() => <PostsLayoutWithSuspense />} />
        <Route
          exact
          path={PATHS.home}
          render={() => <HomePageWithSuspense onGoPosts={goPosts} onGoAuthors={goAuthors} onGoTags={goTags} />}
        />
      </Switch>
    </AdminLayout>
  );
};

export default AuthenticatedLayout;
