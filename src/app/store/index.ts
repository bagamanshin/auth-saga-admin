import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import type { Reducer } from 'redux';
import type { RouterState } from 'connected-react-router';
import type { AuthState } from '@features/auth/model/slice';
import type { PostsState } from '@entities/post';
import createSagaMiddleware, { type Saga, type Task } from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

import { createRootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const asyncReducers: Record<string, Reducer> = {};

let rootReducer = createRootReducer(history, asyncReducers);

const baseStore = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), sagaMiddleware)
  )
);

export const store = Object.assign(baseStore, {
  injectedSagas: {} as Record<string, Task>,
  asyncReducers: asyncReducers,
  injectReducer: (key: string, reducer: Reducer) => {
    if (store.asyncReducers[key]) return;
    store.asyncReducers[key] = reducer;
    rootReducer = createRootReducer(history, store.asyncReducers);
    baseStore.replaceReducer(rootReducer);
  },
  injectSaga: (key: string, saga: Saga) => {
    if (store.injectedSagas[key]) return;
    const task = sagaMiddleware.run(saga);
    store.injectedSagas[key] = task;
  }
});

sagaMiddleware.run(rootSaga);

export interface RootState {
  router: RouterState;
  auth: AuthState;
  posts?: PostsState;
  // allow additional dynamically injected slices
  [key: string]: unknown;
}
