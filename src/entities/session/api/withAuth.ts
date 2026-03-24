import { call } from 'redux-saga/effects';
import type { ApiResponse, Api } from '@shared/api';
import { authRequest } from './authRequest';

export function withAuth<PAYLOAD, RES>(
  api: Api<PAYLOAD, RES>
): Api<PAYLOAD, RES> {
  return function* (payload?: PAYLOAD) {
    return (yield call(
      api,
      payload,
      authRequest
    )) as ApiResponse<RES>;
  };
}
