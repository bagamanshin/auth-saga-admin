import { LazyReduxModuleProvider } from "@app/providers/LazyReduxModuleProvider";
import { withSuspense } from "@shared/hoc";
import { PATHS } from "@shared/config/routes";
import { Spin } from "antd";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const moduleLoader = () => import('@features/tags-list');

const TagEditPage = lazy(() => import('@pages/tags').then((m) => ({ default: m.TagEditPage })));
const TagAddPage = lazy(() => import('@pages/tags').then((m) => ({ default: m.TagAddPage })));
const TagsPage = lazy(() => import('@pages/tags').then((m) => ({ default: m.TagsPage })));

export const TagsLayout = () => {
  return (
    <LazyReduxModuleProvider
      moduleKey="tags"
      moduleLoader={moduleLoader}
      reducerKey="tagsReducer"
      sagaKey="tagsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route path={PATHS.tagEdit} component={withSuspense(TagEditPage)} />
        <Route path={PATHS.tagAdd} component={withSuspense(TagAddPage)} />
        <Route exact path={PATHS.tags} component={withSuspense(TagsPage)} />
      </Switch>
    </LazyReduxModuleProvider>
  );
};
