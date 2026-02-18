import { AsyncModuleProvider } from "@shared/components";
import { withSuspense } from "@shared/hoc";
import { PATHS } from "@shared/lib/paths";
import { Spin } from "antd";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const moduleLoader = () => import('@entities/tag');

const TagEditPage = lazy(() => import('@pages/tags').then((m) => ({ default: m.TagEditPage })));
const TagAddPage = lazy(() => import('@pages/tags').then((m) => ({ default: m.TagAddPage })));
const TagsPage = lazy(() => import('@pages/tags').then((m) => ({ default: m.TagsPage })));

export const TagsLayout = () => {
  return (
    <AsyncModuleProvider
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
    </AsyncModuleProvider>
  );
};
