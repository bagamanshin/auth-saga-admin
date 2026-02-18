import { AsyncModuleProvider } from "@shared/components";
import { withSuspense } from "@shared/hoc";
import { PATHS } from "@shared/lib/paths";
import { Spin } from "antd";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const moduleLoader = () => import('@entities/author');

const AuthorEditPage = lazy(() => import('@pages/authors').then((m) => ({ default: m.AuthorEditPage })));
const AuthorAddPage = lazy(() => import('@pages/authors').then((m) => ({ default: m.AuthorAddPage })));
const AuthorsPage = lazy(() => import('@pages/authors').then((m) => ({ default: m.AuthorsPage })));

export const AuthorsLayout = () => {
  return (
    <AsyncModuleProvider
      moduleKey="authors"
      moduleLoader={moduleLoader}
      reducerKey="authorsReducer"
      sagaKey="authorsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route path={PATHS.authorEdit} component={withSuspense(AuthorEditPage)} />
        <Route path={PATHS.authorAdd} component={withSuspense(AuthorAddPage)} />
        <Route exact path={PATHS.authors} component={withSuspense(AuthorsPage)} />
      </Switch>
    </AsyncModuleProvider>
  );
};
