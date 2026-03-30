import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { END } from 'redux-saga';
import { sessionSaga } from '../saga';
import { refreshTokenApi, type RefreshTokenResponseDTO } from '../../api/refreshTokenApi';
import * as storage from '../storage';
import {
  clearSessionTokens,
  setSessionTokens,
  persistSessionTokens,
  refreshSessionTokensSuccess,
  refreshSessionTokensFailure,
  selectSessionTokens,
  type SessionTokens,
  refreshSessionTokensRequest,
} from '../slice';
import { BackendGeneralError, type ApiResponse, type ApiGeneralErrorResponseDTO } from '@shared/api';

import { MOCK_TOKENS as TOKENS } from '../../api/__tests__/testUtils';

const REFRESH_RESPONSE: ApiResponse<RefreshTokenResponseDTO> = {
  data: {
    access_token: 'new-access',
    refresh_token: 'new-refresh',
    access_expired_at: 9999999999,
    refresh_expired_at: 9999999999,
  },
};

// ---------------------------------------------------------------------------
// bootstrapSessionWorker — called inside sessionSaga before watchers start.
// We test it indirectly by checking what sessionSaga dispatches on startup.
// ---------------------------------------------------------------------------

describe('sessionSaga / bootstrapSessionWorker', () => {
  it('dispatches setSessionTokens when persisted tokens exist', async () => {
    jest.spyOn(storage, 'getPersistedSessionTokens').mockReturnValue(TOKENS);

    // We test it indirectly by checking what sessionSaga dispatches on startup
    return expectSaga(sessionSaga)
      .put(setSessionTokens(TOKENS))
      .dispatch(END)
      .run();
  });

  it('does NOT dispatch setSessionTokens when there are no persisted tokens', async () => {
    jest.spyOn(storage, 'getPersistedSessionTokens').mockReturnValue(null);

    return expectSaga(sessionSaga)
      .not.put(setSessionTokens(expect.anything() as SessionTokens))
      .dispatch(END)
      .run();
  });
});

// ---------------------------------------------------------------------------
// persistSessionTokensWorker
// ---------------------------------------------------------------------------

describe('sessionSaga / persistSessionTokensWorker', () => {
  beforeEach(() => {
    jest.spyOn(storage, 'getPersistedSessionTokens').mockReturnValue(null);
  });

  it('dispatches setSessionTokens and calls persistSessionTokensToCookies with tokens', () => {
    return expectSaga(sessionSaga)
      .provide([
        [matchers.call.fn(storage.persistSessionTokensToCookies), undefined],
      ])
      .put(setSessionTokens(TOKENS))
      .call(storage.persistSessionTokensToCookies, TOKENS)
      .dispatch(persistSessionTokens(TOKENS))
      .dispatch(END)
      .run();
  });

  it('dispatches setSessionTokens(null) and clears cookies when payload is null', () => {
    return expectSaga(sessionSaga)
      .provide([
        [matchers.call.fn(storage.persistSessionTokensToCookies), undefined],
      ])
      .put(setSessionTokens(null))
      .call(storage.persistSessionTokensToCookies, null)
      .dispatch(persistSessionTokens(null))
      .dispatch(END)
      .run();
  });
});

// ---------------------------------------------------------------------------
// refreshSessionTokensWorker
// ---------------------------------------------------------------------------

describe('sessionSaga / refreshSessionTokensWorker', () => {
  beforeEach(() => {
    jest.spyOn(storage, 'getPersistedSessionTokens').mockReturnValue(null);
    jest.spyOn(storage, 'persistSessionTokensToCookies').mockReturnValue(undefined);
  });

  it('dispatches failure and clears tokens when refresh_token is missing', () => {
    return expectSaga(sessionSaga)
      .provide([
        [matchers.select(selectSessionTokens), null],
        [matchers.call.fn(storage.persistSessionTokensToCookies), undefined],
      ])
      .put(clearSessionTokens())
      .put(refreshSessionTokensFailure())
      .dispatch(refreshSessionTokensRequest())
      .dispatch(END)
      .run();
  });

  it('dispatches success and persists new tokens on successful API call', () => {
    return expectSaga(sessionSaga)
      .provide([
        [matchers.select(selectSessionTokens), TOKENS],
        [matchers.call.fn(refreshTokenApi), REFRESH_RESPONSE],
        [matchers.call.fn(storage.persistSessionTokensToCookies), undefined],
      ])
      .put(persistSessionTokens(REFRESH_RESPONSE.data))
      .put(refreshSessionTokensSuccess(REFRESH_RESPONSE.data))
      .dispatch(refreshSessionTokensRequest())
      .dispatch(END)
      .run();
  });

  it('dispatches failure and clears tokens on API error', () => {
    const apiError = new BackendGeneralError({
      status: 400,
      dto: { message: 'Wrong credentials' } as ApiGeneralErrorResponseDTO,
    });

    return expectSaga(sessionSaga)
      .provide([
        [matchers.select(selectSessionTokens), TOKENS],
        [matchers.call.fn(refreshTokenApi), throwError(apiError)],
        [matchers.call.fn(storage.persistSessionTokensToCookies), undefined],
      ])
      .put(clearSessionTokens())
      .put(refreshSessionTokensFailure())
      .dispatch(refreshSessionTokensRequest())
      .dispatch(END)
      .run();
  });
});
