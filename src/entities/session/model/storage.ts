import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@shared/lib/constants';
import { deleteCookie, getCookie, setCookie } from '@shared/lib/cookies';
import type { PersistSessionPayload, SessionTokens } from './slice';

export const getPersistedSessionTokens = (): SessionTokens | null => {
  const accessToken = getCookie(AUTH_TOKEN_COOKIE);
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

export const persistSessionTokensToCookies = (
  payload: PersistSessionPayload
) => {
  if (!payload) {
    deleteCookie(AUTH_TOKEN_COOKIE);
    deleteCookie(REFRESH_TOKEN_COOKIE);
    return;
  }

  const { access_token, refresh_token, access_expired_at, refresh_expired_at } = payload;
  const accessExpires = access_expired_at
    ? { expires: new Date(access_expired_at * 1000) }
    : {};
  const refreshExpires = refresh_expired_at
    ? { expires: new Date(refresh_expired_at * 1000) }
    : {};

  setCookie(AUTH_TOKEN_COOKIE, access_token, accessExpires);
  setCookie(REFRESH_TOKEN_COOKIE, refresh_token, refreshExpires);
};
