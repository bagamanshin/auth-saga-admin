import { call } from 'redux-saga/effects';
import type { ApiResponse } from './types';
import type { BackendErrorMap } from './responseHandlers';
import { request as requestFallback, type RequestFn, type RequestOptions } from './request';

type AllPossibleTypes<PARAM, RESOLVED> = RESOLVED | Resolvable<PARAM, RESOLVED>;
type Resolvable<PARAM, RESOLVED> = (() => RESOLVED) | ((fnParams: PARAM) => RESOLVED);

type Endpoint<PARAM> = AllPossibleTypes<PARAM, string>;
type Options<PARAM, REQUEST> = AllPossibleTypes<PARAM, RequestOptions<REQUEST>>;

export type CreateApiConfig<PARAM, REQUEST> = {
  endpoint: Endpoint<PARAM>;
  options?: Options<PARAM, REQUEST>;
  customBackendErrorMap?: BackendErrorMap;
};

function isCallable<PARAM, RESOLVED>(
  val: AllPossibleTypes<PARAM, RESOLVED>
): val is Resolvable<PARAM, RESOLVED> {
  return typeof val === 'function';
}

function resolve<PARAM, RESOLVED>(
  value: AllPossibleTypes<PARAM, RESOLVED>,
  params?: PARAM
) {
  if (isCallable(value)) {
    return params === undefined ? (value as () => RESOLVED)() : value(params);
  }

  return value;
}

export function createApi<PARAM, REQUEST, RESPONSE>(
  config: CreateApiConfig<PARAM, REQUEST>
): (params?: PARAM, requestFn?: RequestFn) => Generator<unknown, ApiResponse<RESPONSE>> {
  return function* (
    params?: PARAM,
    requestFn?: RequestFn
  ): Generator<unknown, ApiResponse<RESPONSE>> {
    const endpoint = resolve(config.endpoint, params);
    const options = resolve(config.options, params);

    const request = requestFn || requestFallback;

    return (yield call(
      request<REQUEST, RESPONSE>,
      endpoint,
      options,
      config.customBackendErrorMap
    )) as ApiResponse<RESPONSE>;
  };
}
