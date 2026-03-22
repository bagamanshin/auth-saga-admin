import { LazyReduxModuleProvider } from "@app/providers/LazyReduxModuleProvider";
import { withSuspense } from "@shared/hoc";
import { PATHS } from '@app/routes/paths';
import { Spin } from "antd";
import { lazy, useCallback, type ComponentType } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import type { PostAddPageProps, PostEditPageProps, PostsPageProps } from "@pages/posts";

const moduleLoader = () => import('@features/posts-list');

const PostEditPage = lazy<ComponentType<PostEditPageProps>>(
  () => import('@pages/posts').then((m) => ({ default: m.PostEditPage }))
);
const PostAddPage = lazy<ComponentType<PostAddPageProps>>(
  () => import('@pages/posts').then((m) => ({ default: m.PostAddPage }))
);
const PostsPage = lazy<ComponentType<PostsPageProps>>(
  () => import('@pages/posts').then((m) => ({ default: m.PostsPage }))
);

const PostEditPageWithSuspense = withSuspense(PostEditPage);
const PostAddPageWithSuspense = withSuspense(PostAddPage);
const PostsPageWithSuspense = withSuspense(PostsPage);

export const PostsLayout = () => {
  const dispatch = useDispatch();
  const goPostsList = useCallback(() => dispatch(push(PATHS.posts)), [dispatch]);
  const goPostAdd = useCallback(() => dispatch(push(PATHS.postAdd)), [dispatch]);
  const goPostEdit = useCallback((id: number) => dispatch(push(`${PATHS.postEdit}?id=${id}`)), [dispatch]);
  const goPostsPage = useCallback((page: number) => dispatch(push(`${PATHS.posts}?page=${page}`)), [dispatch]);
  const goHome = useCallback(() => dispatch(push(PATHS.home)), [dispatch]);

  return (
    <LazyReduxModuleProvider
      moduleKey="posts"
      moduleLoader={moduleLoader}
      reducerKey="postsReducer"
      sagaKey="postsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route
          path={PATHS.postEdit}
          render={() => (
            <PostEditPageWithSuspense
              onInvalidId={goHome}
              onCancel={goHome}
              onDeleted={goHome}
              onSuccess={goPostsList}
            />
          )}
        />
        <Route
          path={PATHS.postAdd}
          render={() => <PostAddPageWithSuspense onCancel={goPostsList} onSuccess={goPostsList} />}
        />
        <Route
          exact
          path={PATHS.posts}
          render={() => (
            <PostsPageWithSuspense
              onEditPost={goPostEdit}
              onCreatePost={goPostAdd}
              onPageChange={goPostsPage}
            />
          )}
        />
      </Switch>
    </LazyReduxModuleProvider>
  );
};
