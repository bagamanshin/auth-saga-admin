import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import { postsReducer } from '@entities/post';
import { authReducer } from '@features/auth';

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    posts: postsReducer,
    auth: authReducer,
  });
