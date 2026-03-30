import * as matchers from 'redux-saga-test-plan/matchers';
import { dynamic, type StaticProvider } from 'redux-saga-test-plan/providers';
import { request, NotAuthorizedBackendError } from '@shared/api';
import {
  selectSessionRefreshPending,
  selectSessionTokens,
  type SessionTokens,
  REFRESH_SESSION_TOKENS_SUCCESS,
  REFRESH_SESSION_TOKENS_FAILURE,
} from '@entities/session/model/slice';

export const MOCK_TOKENS: SessionTokens = {
  access_token: 'access-abc',
  refresh_token: 'refresh-xyz',
};

export const MOCK_REFRESHED_TOKENS: SessionTokens = {
  access_token: 'new-access',
  refresh_token: 'new-refresh',
};

export const create401Error = () =>
  new NotAuthorizedBackendError({ status: 401, dto: { reason: 'Unauthorized' } });

export const silenceConsoleError = () => jest.spyOn(console, 'error').mockImplementation(() => {});

/**
 * Creates a common provide array for authRequest tests where no refresh is pending.
 */
export const provideAuthRequestBase = (
  tokens: SessionTokens = MOCK_TOKENS,
  response: unknown = { data: { id: 1 } }
): StaticProvider[] => [
  [matchers.select(selectSessionRefreshPending), false],
  [matchers.select(selectSessionTokens), tokens],
  [matchers.call.fn(request), response],
];

/**
 * Creates a provide array for when refresh is already pending.
 */
export const provideAuthRequestRefreshPending = (
  tokens: SessionTokens = MOCK_REFRESHED_TOKENS,
  response: unknown = { data: { id: 1 } }
): StaticProvider[] => [
  [matchers.select(selectSessionRefreshPending), true],
  [matchers.select(selectSessionTokens), tokens],
  [matchers.call.fn(request), response],
];

/**
 * Creates a provider for the "401 then success" scenario.
 */
export const provide401ThenSuccess = (
  initialTokens: SessionTokens = MOCK_TOKENS,
  refreshedTokens: SessionTokens = MOCK_REFRESHED_TOKENS,
  response: unknown = { data: { id: 1 } },
  refreshSuccessAction: unknown = { type: REFRESH_SESSION_TOKENS_SUCCESS }
): StaticProvider[] => {
  let callCount = 0;
  return [
    [matchers.select(selectSessionRefreshPending), false],
    [
      matchers.select(selectSessionTokens),
      dynamic(() => (callCount > 0 ? refreshedTokens : initialTokens)),
    ],
    [
      matchers.call.fn(request),
      dynamic(() => {
        callCount++;
        if (callCount === 1) throw create401Error();
        return response;
      }),
    ],
    [
      matchers.take([REFRESH_SESSION_TOKENS_SUCCESS, REFRESH_SESSION_TOKENS_FAILURE]),
      refreshSuccessAction,
    ],
  ];
};
