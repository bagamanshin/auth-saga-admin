import { AsyncModuleProvider } from "@shared/components";
import { withSuspense } from "@shared/hoc";
import { PATHS } from "@shared/lib/paths";
import { Spin } from "antd";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const moduleLoader = () => import('@entities/post');

const PostEditPage = lazy(() => import('@pages/posts').then((m) => ({ default: m.PostEditPage })));
const PostsPage = lazy(() => import('@pages/posts').then((m) => ({ default: m.PostsPage })));

export const PostsLayout = () => {
  return (
    <AsyncModuleProvider
      moduleKey="posts"
      moduleLoader={moduleLoader}
      reducerKey="postsReducer"
      sagaKey="postsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route path={PATHS.postEdit} component={withSuspense(PostEditPage)} />
        <Route exact path={PATHS.home} component={withSuspense(PostsPage)} />
      </Switch>
    </AsyncModuleProvider>
  );
};