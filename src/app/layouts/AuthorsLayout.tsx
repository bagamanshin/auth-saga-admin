import { LazyReduxModuleProvider } from "@app/providers/LazyReduxModuleProvider";
import { withSuspense } from "@shared/hoc";
import { PATHS } from "@shared/config/routes";
import { Spin } from "antd";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const moduleLoader = () => import('@features/authors-list');

const AuthorEditPage = lazy(() => import('@pages/authors').then((m) => ({ default: m.AuthorEditPage })));
const AuthorAddPage = lazy(() => import('@pages/authors').then((m) => ({ default: m.AuthorAddPage })));
const AuthorsPage = lazy(() => import('@pages/authors').then((m) => ({ default: m.AuthorsPage })));

export const AuthorsLayout = () => {
  return (
    <LazyReduxModuleProvider
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
    </LazyReduxModuleProvider>
  );
};
