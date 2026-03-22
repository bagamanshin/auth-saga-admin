import { LazyReduxModuleProvider } from "@app/providers/LazyReduxModuleProvider";
import { withSuspense } from "@shared/hoc";
import { PATHS } from '@app/routes/paths';
import { Spin } from "antd";
import { lazy, useCallback, type ComponentType } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import type { AuthorAddPageProps, AuthorEditPageProps, AuthorsPageProps } from "@pages/authors";

const moduleLoader = () => import('@features/authors-list');

const AuthorEditPage = lazy<ComponentType<AuthorEditPageProps>>(
  () => import('@pages/authors').then((m) => ({ default: m.AuthorEditPage }))
);
const AuthorAddPage = lazy<ComponentType<AuthorAddPageProps>>(
  () => import('@pages/authors').then((m) => ({ default: m.AuthorAddPage }))
);
const AuthorsPage = lazy<ComponentType<AuthorsPageProps>>(
  () => import('@pages/authors').then((m) => ({ default: m.AuthorsPage }))
);

const AuthorEditPageWithSuspense = withSuspense(AuthorEditPage);
const AuthorAddPageWithSuspense = withSuspense(AuthorAddPage);
const AuthorsPageWithSuspense = withSuspense(AuthorsPage);

export const AuthorsLayout = () => {
  const dispatch = useDispatch();
  const goAuthorsList = useCallback(() => dispatch(push(PATHS.authors)), [dispatch]);
  const goAuthorAdd = useCallback(() => dispatch(push(PATHS.authorAdd)), [dispatch]);
  const goAuthorEdit = useCallback((id: number) => dispatch(push(`${PATHS.authorEdit}?id=${id}`)), [dispatch]);

  return (
    <LazyReduxModuleProvider
      moduleKey="authors"
      moduleLoader={moduleLoader}
      reducerKey="authorsReducer"
      sagaKey="authorsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route
          path={PATHS.authorEdit}
          render={() => (
            <AuthorEditPageWithSuspense
              onInvalidId={goAuthorsList}
              onCancel={goAuthorsList}
              onDeleted={goAuthorsList}
              onSuccess={goAuthorsList}
            />
          )}
        />
        <Route
          path={PATHS.authorAdd}
          render={() => <AuthorAddPageWithSuspense onCancel={goAuthorsList} onSuccess={goAuthorsList} />}
        />
        <Route
          exact
          path={PATHS.authors}
          render={() => (
            <AuthorsPageWithSuspense
              onEditAuthor={goAuthorEdit}
              onCreateAuthor={goAuthorAdd}
            />
          )}
        />
      </Switch>
    </LazyReduxModuleProvider>
  );
};
