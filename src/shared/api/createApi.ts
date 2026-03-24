import { call } from 'redux-saga/effects';
import type { ApiResponse, Api, BackendErrorMap, RequestFn, RequestOptions } from './types';
import { request as requestFnBase } from './request';

type ValueOrResolver<PAYLOAD, RESOLVED> = RESOLVED | Resolver<PAYLOAD, RESOLVED>;
type Resolver<PAYLOAD, RESOLVED> = (() => RESOLVED) | ((fnPayload: PAYLOAD) => RESOLVED);

type Endpoint<PAYLOAD> = ValueOrResolver<PAYLOAD, string>;
type Options<PAYLOAD, REQUEST> = ValueOrResolver<PAYLOAD, RequestOptions<REQUEST>>;

export type CreateApiConfig<PAYLOAD, REQUEST> = {
  endpoint: Endpoint<PAYLOAD>;
  options?: Options<PAYLOAD, REQUEST>;
  customBackendErrorMap?: BackendErrorMap;
};

function isCallable<PAYLOAD, RESOLVED>(
  val: ValueOrResolver<PAYLOAD, RESOLVED>
): val is Resolver<PAYLOAD, RESOLVED> {
  return typeof val === 'function';
}

function resolve<PAYLOAD, RESOLVED>(
  value: ValueOrResolver<PAYLOAD, RESOLVED>,
  payload?: PAYLOAD
) {
  if (isCallable(value)) {
    return payload === undefined ? (value as () => RESOLVED)() : value(payload);
  }

  return value;
}

export function createApi<PAYLOAD, REQUEST, RESPONSE>(
  config: CreateApiConfig<PAYLOAD, REQUEST>
): Api<PAYLOAD, RESPONSE> {
  return function* (
    payload?: PAYLOAD,
    requestFn?: RequestFn
  ) {
    const endpoint = resolve(config.endpoint, payload);
    const options = resolve(config.options, payload);

    const request = requestFn || requestFnBase;

    return (yield call(
      request<REQUEST, RESPONSE>,
      endpoint,
      options,
      config.customBackendErrorMap
    )) as ApiResponse<RESPONSE>;
  };
}
