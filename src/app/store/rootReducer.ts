import { combineReducers, type Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import { authReducer } from '@features/login';
import { sessionReducer } from '@entities/session';

export const createRootReducer = (history: History, asyncReducers: Record<string, Reducer> = {}) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    session: sessionReducer,
    ...asyncReducers,
  });
