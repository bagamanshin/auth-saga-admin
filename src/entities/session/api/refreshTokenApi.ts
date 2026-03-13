import { call } from 'redux-saga/effects';
import { createApi, type ApiResponse } from '@shared/api';

export type RefreshTokenRequestDTO = {
  refresh_token: string;
};

export type RefreshTokenResponseDTO = {
  access_token: string;
  refresh_token: string;
  access_expired_at: number;
  refresh_expired_at: number;
};

type RefreshTokenParams = {
  refreshToken: string;
};

const refreshTokenApiBase = createApi<
  RefreshTokenParams,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO
>({
  endpoint: '/auth/token-refresh',
  options: ({ refreshToken }) => ({
    method: 'POST',
    body: { refresh_token: refreshToken },
  }),
});

export function* refreshTokenApi(
  refreshToken: string
): Generator<unknown, ApiResponse<RefreshTokenResponseDTO>> {
  return (yield call(
    refreshTokenApiBase,
    { refreshToken }
  )) as ApiResponse<RefreshTokenResponseDTO>;
}
