import { expectSaga } from 'redux-saga-test-plan';
import { all, call, fork, join } from 'redux-saga/effects';
import type { Task } from 'redux-saga';
import * as matchers from 'redux-saga-test-plan/matchers';
import { dynamic, throwError } from 'redux-saga-test-plan/providers';
import { NetworkError, request } from '@shared/api';
import { NotAuthorizedBackendError, type ApiResponse, type BackendErrorMap } from '@shared/api';
import {
  clearSessionTokens,
  refreshSessionTokensFailure,
  refreshSessionTokensRequest,
  refreshSessionTokensSuccess,
  REFRESH_SESSION_TOKENS_FAILURE,
  REFRESH_SESSION_TOKENS_SUCCESS,
  selectSessionRefreshPending,
  selectSessionTokens,
  type SessionTokens,
} from '../../model/slice';
import { authRequest } from '../authRequest';
import { AuthRequestPreventedError } from '../errors';
import {
  MOCK_REFRESHED_TOKENS as REFRESHED_TOKENS,
  MOCK_TOKENS as TOKENS,
  provideAuthRequestBase,
  provideAuthRequestRefreshPending,
  provide401ThenSuccess,
  create401Error as make401Error,
  silenceConsoleError,
} from './testUtils';

const ENDPOINT = '/api/test';

const RESPONSE: ApiResponse<{ id: number }> = { data: { id: 1 } };

const makeRefreshSuccessAction = (tokens: SessionTokens = REFRESHED_TOKENS) =>
  refreshSessionTokensSuccess({
    ...tokens,
    access_expired_at: 9999,
    refresh_expired_at: 9999,
  });

describe('authRequest', () => {
  describe('initial request', () => {
    it('sends request with session Authorization header and returns the response', () => {
      return expectSaga(authRequest, ENDPOINT)
        .provide(provideAuthRequestBase())
        .not.put(clearSessionTokens())
        .returns(RESPONSE)
        .run();
    });

    it('overrides caller Authorization header with the session access token', () => {
      return expectSaga(authRequest, ENDPOINT, {
        headers: {
          Authorization: 'Bearer manual-token',
          'X-Trace-Id': 'trace-1',
        },
      })
        .provide(provideAuthRequestBase())
        .call(request, ENDPOINT, {
          headers: {
            Authorization: `Bearer ${TOKENS.access_token}`,
            'X-Trace-Id': 'trace-1',
          },
        }, undefined)
        .returns(RESPONSE)
        .run();
    });

    it('rethrows non-401 request errors without touching tokens', () => {
      const networkError = new NetworkError();
      const consoleSpy = silenceConsoleError();

      return expectSaga(authRequest, ENDPOINT)
        .provide(provideAuthRequestBase(TOKENS, throwError(networkError)))
        .not.put(refreshSessionTokensRequest())
        .not.put(clearSessionTokens())
        .run()
        .catch((error) => {
          expect(error).toEqual(networkError);
        })
        .finally(() => {
          consoleSpy.mockRestore();
        });
    });
  });

  describe('when refresh is already pending before the request starts', () => {
    it('waits for refresh success and then sends the request with the refreshed access token', () => {
      return expectSaga(authRequest, ENDPOINT)
        .provide(provideAuthRequestRefreshPending(REFRESHED_TOKENS, RESPONSE))
        .dispatch(makeRefreshSuccessAction())
        .not.put(clearSessionTokens())
        .call(request, ENDPOINT, {
          headers: { Authorization: `Bearer ${REFRESHED_TOKENS.access_token}` },
        }, undefined)
        .returns(RESPONSE)
        .run();
    });

    it('clears tokens, throws AuthRequestPreventedError, and never sends the request when refresh fails', () => {
      const consoleSpy = silenceConsoleError();
      let requestCallCount = 0;

      return expectSaga(authRequest, ENDPOINT)
        .provide([
          [matchers.select(selectSessionRefreshPending), true],
          [matchers.call.fn(request), dynamic(() => {
            requestCallCount++;
            return RESPONSE;
          })],
        ])
        .dispatch(refreshSessionTokensFailure())
        .put(clearSessionTokens())
        .run()
        .catch((error) => {
          expect(error).toBeInstanceOf(AuthRequestPreventedError);
        })
        .finally(() => {
          expect(requestCallCount).toBe(0);
          consoleSpy.mockRestore();
        });
    });
  });

  describe('when the initial request returns 401', () => {
    describe('and refresh succeeds', () => {
      it('dispatches refreshSessionTokensRequest and retries the request', () => {
        return expectSaga(authRequest, ENDPOINT)
          .provide(provide401ThenSuccess(TOKENS, REFRESHED_TOKENS, RESPONSE, makeRefreshSuccessAction()))
          .put(refreshSessionTokensRequest())
          .returns(RESPONSE)
          .run();
      });

      it('retries with original request options and customBackendErrorMap after refresh', () => {
        const options = {
          method: 'POST' as const,
          body: { title: 'Draft title' },
          headers: { 'X-Trace-Id': 'trace-1' },
          isFormData: false,
        };
        const customBackendErrorMap: BackendErrorMap = {
          fallback: () => 'custom backend error',
        };
        const refreshSuccessAction = makeRefreshSuccessAction();
        let hasRefreshed = false;
        const requestCalls: Array<{
          endpoint: string;
          options: unknown;
          customBackendErrorMap: unknown;
        }> = [];

        return expectSaga(authRequest, ENDPOINT, options, customBackendErrorMap)
          .provide({
            select({ selector }, next) {
              if (selector === selectSessionRefreshPending) return false;
              if (selector === selectSessionTokens) {
                return hasRefreshed ? REFRESHED_TOKENS : TOKENS;
              }
              return next();
            },
            call(effect, next) {
              if (effect.fn !== request) {
                return next();
              }

              const [endpoint, requestOptions, backendErrorMap] = effect.args;
              requestCalls.push({
                endpoint,
                options: requestOptions,
                customBackendErrorMap: backendErrorMap,
              });

              if (requestCalls.length === 1) {
                throw make401Error();
              }

              return RESPONSE;
            },
            take(effect, next) {
              if (
                Array.isArray(effect.pattern) &&
                effect.pattern.includes(REFRESH_SESSION_TOKENS_SUCCESS)
              ) {
                hasRefreshed = true;
                return refreshSuccessAction;
              }

              return next();
            },
          })
          .put(refreshSessionTokensRequest())
          .returns(RESPONSE)
          .run()
          .then(() => {
            expect(requestCalls).toEqual([
              {
                endpoint: ENDPOINT,
                options: {
                  method: 'POST',
                  body: { title: 'Draft title' },
                  headers: {
                    Authorization: `Bearer ${TOKENS.access_token}`,
                    'X-Trace-Id': 'trace-1',
                  },
                  isFormData: false,
                },
                customBackendErrorMap,
              },
              {
                endpoint: ENDPOINT,
                options: {
                  method: 'POST',
                  body: { title: 'Draft title' },
                  headers: {
                    Authorization: `Bearer ${REFRESHED_TOKENS.access_token}`,
                    'X-Trace-Id': 'trace-1',
                  },
                  isFormData: false,
                },
                customBackendErrorMap,
              },
            ]);
          });
      });

      it('clears the session when retry after refresh also returns 401', () => {
        silenceConsoleError();
        let requestCallCount = 0;

        return expectSaga(authRequest, ENDPOINT)
          .provide({
            select({ selector }, next) {
              if (selector === selectSessionRefreshPending) return false;
              if (selector === selectSessionTokens) return TOKENS;
              return next();
            },
            call(effect, next) {
              if (effect.fn !== request) return next();
              requestCallCount++;
              throw make401Error();
            },
          })
          .put(refreshSessionTokensRequest())
          .dispatch(makeRefreshSuccessAction())
          .put(clearSessionTokens())
          .run()
          .catch((error) => {
            expect(error).toBeInstanceOf(NotAuthorizedBackendError);
          })
          .finally(() => {
            expect(requestCallCount).toBe(2);
          });
      });

      it('rethrows non-401 retry error without clearing the session', () => {
        const retryError = new NetworkError();
        const refreshSuccessAction = makeRefreshSuccessAction();
        const consoleSpy = silenceConsoleError();
        let requestCallCount = 0;

        return expectSaga(authRequest, ENDPOINT)
          .provide({
            select({ selector }, next) {
              if (selector === selectSessionRefreshPending) return false;
              if (selector === selectSessionTokens) return TOKENS;
              return next();
            },
            call(effect, next) {
              if (effect.fn !== request) {
                return next();
              }

              requestCallCount++;

              if (requestCallCount === 1) {
                throw make401Error();
              }

              throw retryError;
            },
            take(effect, next) {
              if (
                Array.isArray(effect.pattern) &&
                effect.pattern.includes(REFRESH_SESSION_TOKENS_SUCCESS)
              ) {
                return refreshSuccessAction;
              }

              return next();
            },
          })
          .put(refreshSessionTokensRequest())
          .not.put(clearSessionTokens())
          .run()
          .catch((error) => {
            expect(error).toEqual(retryError);
            expect(requestCallCount).toBe(2);
          })
          .finally(() => {
            consoleSpy.mockRestore();
          });
      });
    });

    describe('and refresh cannot complete', () => {
      it('clears tokens and rethrows the original 401 when refresh_token is missing', () => {
        const consoleSpy = silenceConsoleError();
        let requestCallCount = 0;

        return expectSaga(authRequest, ENDPOINT)
          .provide({
            select({ selector }, next) {
              if (selector === selectSessionRefreshPending) return false;
              if (selector === selectSessionTokens) {
                return { access_token: 'access-abc', refresh_token: '' };
              }
              return next();
            },
            call(effect, next) {
              if (effect.fn !== request) {
                return next();
              }

              requestCallCount++;
              throw make401Error();
            },
          })
          .not.put(refreshSessionTokensRequest())
          .put(clearSessionTokens())
          .run()
          .catch((error) => {
            expect(error).toBeInstanceOf(NotAuthorizedBackendError);
          })
          .finally(() => {
            expect(requestCallCount).toBe(1);
            consoleSpy.mockRestore();
          });
      });

      it('clears tokens and rethrows the original 401 when refresh fails', () => {
        const consoleSpy = silenceConsoleError();
        let requestCallCount = 0;

        return expectSaga(authRequest, ENDPOINT)
          .provide({
            select({ selector }, next) {
              if (selector === selectSessionRefreshPending) return false;
              if (selector === selectSessionTokens) return TOKENS;
              return next();
            },
            call(effect, next) {
              if (effect.fn !== request) {
                return next();
              }

              requestCallCount++;
              throw make401Error();
            },
          })
          .put(refreshSessionTokensRequest())
          .dispatch(refreshSessionTokensFailure())
          .put(clearSessionTokens())
          .run()
          .catch((error) => {
            expect(error).toBeInstanceOf(NotAuthorizedBackendError);
          })
          .finally(() => {
            expect(requestCallCount).toBe(1);
            consoleSpy.mockRestore();
          });
      });
    });
  });

  describe('concurrent requests', () => {
    it('shares a single refresh across parallel requests that all get 401', () => {
      const endpoints = ['/api/A', '/api/B', '/api/C'];
      const requestCounts: Record<string, number> = endpoints.reduce(
        (acc, endpoint) => ({ ...acc, [endpoint]: 0 }),
        {}
      );
      const refreshSuccessAction = makeRefreshSuccessAction();

      let refreshPending = false;
      let refreshRequestedCount = 0;
      let hasRefreshed = false;

      function* wrapperSaga() {
        yield all(endpoints.map((endpoint) => call(authRequest, endpoint)));
      }

      return expectSaga(wrapperSaga)
        .provide([
          [matchers.select(selectSessionRefreshPending), dynamic(() => refreshPending)],
          [matchers.select(selectSessionTokens), dynamic(() => (hasRefreshed ? REFRESHED_TOKENS : TOKENS))],
          [matchers.call.fn(request), dynamic(async (effect) => {
            const endpoint = effect.args[0] as string;
            requestCounts[endpoint]++;

            await Promise.resolve();

            if (requestCounts[endpoint] === 1) {
              throw make401Error();
            }

            return RESPONSE;
          })],
          [matchers.take([REFRESH_SESSION_TOKENS_SUCCESS, REFRESH_SESSION_TOKENS_FAILURE]), dynamic(async () => {
            await Promise.resolve();
            hasRefreshed = true;
            refreshPending = false;
            return refreshSuccessAction;
          })],
          [matchers.put(refreshSessionTokensRequest()), dynamic((_, next) => {
            refreshRequestedCount++;
            refreshPending = true;
            return next();
          })],
        ])
        .put(refreshSessionTokensRequest())
        .run()
        .then((result) => {
          endpoints.forEach((endpoint) => {
            expect(requestCounts[endpoint]).toBe(2);
          });

          expect(refreshRequestedCount).toBe(1);

          endpoints.forEach((endpoint) => {
            expect(result.allEffects).toContainEqual(
              call(request, endpoint, {
                headers: { Authorization: `Bearer ${REFRESHED_TOKENS.access_token}` },
              }, undefined)
            );
          });
        });
    });

    it('waits for an in-flight refresh before sending later requests', () => {
      const endpoints = ['/api/A', '/api/B', '/api/C'] as const;
      const [endpointA, endpointB, endpointC] = endpoints;
      const requestCounts: Record<string, number> = endpoints.reduce(
        (acc, endpoint) => ({ ...acc, [endpoint]: 0 }),
        {}
      );
      const requestSnapshots: Array<{
        endpoint: string;
        callNumber: number;
        token: string | undefined;
      }> = [];
      const refreshSuccessAction = makeRefreshSuccessAction();

      let refreshPending = false;
      let hasRefreshed = false;
      let refreshRequestedCount = 0;
      let waitingForRefreshCount = 0;
      let startedLaterRequestsDuringRefresh = false;
      let requestCountsBeforeRefreshRelease: Record<string, number> = {
        [endpointB]: -1,
        [endpointC]: -1,
      };

      const {
        resolve: startTokenRefresh,
        promise: waitUntilRefreshStarted,
      } = Promise.withResolvers<void>();

      const {
        resolve: markAllRequestsWaitingForRefresh,
        promise: waitUntilAllRequestsAreWaitingForRefresh,
      } = Promise.withResolvers<void>();

      const {
        resolve: finishTokenRefresh,
        promise: waitUntilTokenRefreshFinishes,
      } = Promise.withResolvers<void>();

      function* wrapperSaga() {
        const taskA = (yield fork(authRequest, endpointA)) as Task;

        yield call(() => waitUntilRefreshStarted);

        startedLaterRequestsDuringRefresh = refreshPending && !hasRefreshed;

        const taskB = (yield fork(authRequest, endpointB)) as Task;
        const taskC = (yield fork(authRequest, endpointC)) as Task;

        yield call(() => waitUntilAllRequestsAreWaitingForRefresh);

        requestCountsBeforeRefreshRelease = {
          [endpointB]: requestCounts[endpointB],
          [endpointC]: requestCounts[endpointC],
        };

        yield call(finishTokenRefresh);

        yield join([taskA, taskB, taskC]);
      }

      return expectSaga(wrapperSaga)
        .provide([
          [matchers.select(selectSessionRefreshPending), dynamic(() => refreshPending)],
          [matchers.select(selectSessionTokens), dynamic(() => (hasRefreshed ? REFRESHED_TOKENS : TOKENS))],
          [matchers.call.fn(request), dynamic(async (effect) => {
            const endpoint = effect.args[0] as string;
            const options = effect.args[1] as { headers?: Record<string, string> } | undefined;

            requestCounts[endpoint]++;
            requestSnapshots.push({
              endpoint,
              callNumber: requestCounts[endpoint],
              token: options?.headers?.Authorization,
            });

            await Promise.resolve();

            if (endpoint === endpointA && requestCounts[endpoint] === 1) {
              throw make401Error();
            }

            return RESPONSE;
          })],
          [matchers.take([REFRESH_SESSION_TOKENS_SUCCESS, REFRESH_SESSION_TOKENS_FAILURE]), dynamic(async () => {
            waitingForRefreshCount++;

            if (waitingForRefreshCount === 3) {
              markAllRequestsWaitingForRefresh();
            }

            await waitUntilTokenRefreshFinishes;
            hasRefreshed = true;
            refreshPending = false;
            return refreshSuccessAction;
          })],
          [matchers.put(refreshSessionTokensRequest()), dynamic((_, next) => {
            refreshRequestedCount++;
            refreshPending = true;
            startTokenRefresh();
            return next();
          })],
        ])
        .put(refreshSessionTokensRequest())
        .run()
        .then(() => {
          expect(refreshRequestedCount).toBe(1);
          expect(waitingForRefreshCount).toBe(3);
          expect(startedLaterRequestsDuringRefresh).toBe(true);

          expect(requestCounts[endpointA]).toBe(2);
          expect(requestCounts[endpointB]).toBe(1);
          expect(requestCounts[endpointC]).toBe(1);

          expect(requestCountsBeforeRefreshRelease[endpointB]).toBe(0);
          expect(requestCountsBeforeRefreshRelease[endpointC]).toBe(0);

          expect(requestSnapshots).toEqual([
            { endpoint: endpointA, callNumber: 1, token: 'Bearer access-abc' },
            { endpoint: endpointA, callNumber: 2, token: 'Bearer new-access' },
            { endpoint: endpointB, callNumber: 1, token: 'Bearer new-access' },
            { endpoint: endpointC, callNumber: 1, token: 'Bearer new-access' },
          ]);
        });
    });
  });
});
