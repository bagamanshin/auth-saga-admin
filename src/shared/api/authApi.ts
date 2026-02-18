import { request } from '@shared/api';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  access_expired_at: number;
  refresh_expired_at: number;
};

export type AuthErrorResponse = {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
};

export type AuthValidationErrorResponse = {
  field: string;
  message: string;
}[];

export type LoginRequestError = AuthErrorResponse | AuthValidationErrorResponse;

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = LoginResponse;
export type RefreshTokenErrorResponse = AuthErrorResponse;

export const refreshTokenApi = (refreshToken: string) => {
  return request<RefreshTokenRequest, RefreshTokenResponse, RefreshTokenErrorResponse>(
    '/auth/token-refresh',
    {
      method: 'POST',
      body: { refresh_token: refreshToken },
      isAuth: false,
      isRefreshingTokensRequest: true,
    }
  );
};
