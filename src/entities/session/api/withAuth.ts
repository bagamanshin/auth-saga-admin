import { call } from 'redux-saga/effects';
import type { ApiResponse, RequestFn } from '@shared/api';
import { authRequest } from './authRequest';

type ApiGenerator<RES> = Generator<unknown, ApiResponse<RES>>;
type ApiWithRequester<Args extends unknown[], RES> = (
  ...args: [...Args, RequestFn?]
) => ApiGenerator<RES>;

export function withAuth<Args extends unknown[], RES>(
  api: ApiWithRequester<Args, RES>
): (...args: Args) => ApiGenerator<RES> {
  return function* (...args: Args): ApiGenerator<RES> {
    return (yield call(
      api,
      ...args,
      authRequest
    )) as ApiResponse<RES>;
  };
}
