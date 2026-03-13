import { LazyReduxModuleProvider } from "@app/providers/LazyReduxModuleProvider";
import { withSuspense } from "@shared/hoc";
import { PATHS } from "@shared/config/routes";
import { Spin } from "antd";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const moduleLoader = () => import('@features/posts-list');

const PostEditPage = lazy(() => import('@pages/posts').then((m) => ({ default: m.PostEditPage })));
const PostAddPage = lazy(() => import('@pages/posts').then((m) => ({ default: m.PostAddPage })));
const PostsPage = lazy(() => import('@pages/posts').then((m) => ({ default: m.PostsPage })));

export const PostsLayout = () => {
  return (
    <LazyReduxModuleProvider
      moduleKey="posts"
      moduleLoader={moduleLoader}
      reducerKey="postsReducer"
      sagaKey="postsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route path={PATHS.postEdit} component={withSuspense(PostEditPage)} />
        <Route path={PATHS.postAdd} component={withSuspense(PostAddPage)} />
        <Route exact path={PATHS.posts} component={withSuspense(PostsPage)} />
      </Switch>
    </LazyReduxModuleProvider>
  );
};
