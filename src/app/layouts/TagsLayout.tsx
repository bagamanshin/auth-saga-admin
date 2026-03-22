import { LazyReduxModuleProvider } from "@app/providers/LazyReduxModuleProvider";
import { withSuspense } from "@shared/hoc";
import { PATHS } from '@app/routes/paths';
import { Spin } from "antd";
import { lazy, useCallback, type ComponentType } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import type { TagAddPageProps, TagEditPageProps, TagsPageProps } from "@pages/tags";

const moduleLoader = () => import('@features/tags-list');

const TagEditPage = lazy<ComponentType<TagEditPageProps>>(
  () => import('@pages/tags').then((m) => ({ default: m.TagEditPage }))
);
const TagAddPage = lazy<ComponentType<TagAddPageProps>>(
  () => import('@pages/tags').then((m) => ({ default: m.TagAddPage }))
);
const TagsPage = lazy<ComponentType<TagsPageProps>>(
  () => import('@pages/tags').then((m) => ({ default: m.TagsPage }))
);

const TagEditPageWithSuspense = withSuspense(TagEditPage);
const TagAddPageWithSuspense = withSuspense(TagAddPage);
const TagsPageWithSuspense = withSuspense(TagsPage);

export const TagsLayout = () => {
  const dispatch = useDispatch();
  const goTagsList = useCallback(() => dispatch(push(PATHS.tags)), [dispatch]);
  const goTagAdd = useCallback(() => dispatch(push(PATHS.tagAdd)), [dispatch]);
  const goTagEdit = useCallback((id: number) => dispatch(push(`${PATHS.tagEdit}?id=${id}`)), [dispatch]);

  return (
    <LazyReduxModuleProvider
      moduleKey="tags"
      moduleLoader={moduleLoader}
      reducerKey="tagsReducer"
      sagaKey="tagsSaga"
      fallback={<Spin />}
    >
      <Switch>
        <Route
          path={PATHS.tagEdit}
          render={() => (
            <TagEditPageWithSuspense
              onInvalidId={goTagsList}
              onCancel={goTagsList}
              onDeleted={goTagsList}
              onSuccess={goTagsList}
            />
          )}
        />
        <Route
          path={PATHS.tagAdd}
          render={() => <TagAddPageWithSuspense onCancel={goTagsList} onSuccess={goTagsList} />}
        />
        <Route
          exact
          path={PATHS.tags}
          render={() => (
            <TagsPageWithSuspense
              onEditTag={goTagEdit}
              onCreateTag={goTagAdd}
            />
          )}
        />
      </Switch>
    </LazyReduxModuleProvider>
  );
};
