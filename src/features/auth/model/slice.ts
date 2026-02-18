import type { LoginRequest, LoginResponse } from '@shared/api/authApi';

export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
export const LOGOUT = 'auth/LOGOUT';
export const SET_AUTH_TOKENS = 'auth/SET_AUTH_TOKENS';
export const PERSIST_AUTH_TOKENS = 'auth/PERSIST_AUTH_TOKENS';
export const RETRIEVE_AUTH_TOKENS = 'auth/RETRIEVE_AUTH_TOKENS';

type Tokens = Pick<LoginResponse, 'access_token' | 'refresh_token'>;

export interface AuthState {
  loading: boolean;
  error: string | null;
  tokens: Tokens | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  tokens: null,
};

interface LoginRequestAction {
    type: typeof LOGIN_REQUEST;
    payload: LoginRequest;
}

interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
    payload: LoginResponse;
}

interface LoginFailureAction {
    type: typeof LOGIN_FAILURE;
    payload: string;
}

interface LogoutAction {
    type: typeof LOGOUT;
}

interface SetAuthTokensAction {
  type: typeof SET_AUTH_TOKENS;
  payload: LoginResponse | null;
}

interface RetrieveAuthTokensAction {
  type: typeof RETRIEVE_AUTH_TOKENS;
}

type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | SetAuthTokensAction
  | RetrieveAuthTokensAction;

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null, tokens: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload, tokens: null };
    case LOGOUT:
      return { ...initialState };
    case SET_AUTH_TOKENS:
      return {
        ...state,
        tokens: action.payload,
      };
    default:
      return state;
  }
};

export const loginRequest = (credentials: LoginRequest) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setAuthTokens = (payload: Tokens | null) => ({
  type: SET_AUTH_TOKENS,
  payload,
});

export const persistAuthTokens = (
  payload: LoginResponse | null,
  onComplete?: () => void
) => ({
  type: PERSIST_AUTH_TOKENS,
  payload,
  ...(onComplete ? {meta: { onComplete }} : {}),
});

export const retrieveTokens = () => ({
  type: RETRIEVE_AUTH_TOKENS
});
