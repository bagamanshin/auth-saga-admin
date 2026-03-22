export type PersistSessionPayload = {
  access_token: string;
  refresh_token: string;
  access_expired_at?: number;
  refresh_expired_at?: number;
} | null;

export type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

export interface SessionState {
  tokens: SessionTokens | null;
  refreshPending: boolean;
}

export const SET_SESSION_TOKENS = 'session/SET_SESSION_TOKENS';
export const PERSIST_SESSION_TOKENS = 'session/PERSIST_SESSION_TOKENS';
export const REFRESH_SESSION_TOKENS_REQUEST = 'session/REFRESH_SESSION_TOKENS_REQUEST';
export const REFRESH_SESSION_TOKENS_SUCCESS = 'session/REFRESH_SESSION_TOKENS_SUCCESS';
export const REFRESH_SESSION_TOKENS_FAILURE = 'session/REFRESH_SESSION_TOKENS_FAILURE';

interface SetSessionTokensAction {
  type: typeof SET_SESSION_TOKENS;
  payload: SessionTokens | null;
}

interface PersistSessionTokensAction {
  type: typeof PERSIST_SESSION_TOKENS;
  payload: PersistSessionPayload;
}

interface RefreshSessionTokensRequestAction {
  type: typeof REFRESH_SESSION_TOKENS_REQUEST;
}

interface RefreshSessionTokensSuccessAction {
  type: typeof REFRESH_SESSION_TOKENS_SUCCESS;
  payload: NonNullable<PersistSessionPayload>;
}

interface RefreshSessionTokensFailureAction {
  type: typeof REFRESH_SESSION_TOKENS_FAILURE;
}

type SessionAction =
  | SetSessionTokensAction
  | PersistSessionTokensAction
  | RefreshSessionTokensRequestAction
  | RefreshSessionTokensSuccessAction
  | RefreshSessionTokensFailureAction;

const initialState: SessionState = {
  tokens: null,
  refreshPending: false,
};

export const sessionReducer = (
  state = initialState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case SET_SESSION_TOKENS:
      return {
        ...state,
        tokens: action.payload,
      };
    case REFRESH_SESSION_TOKENS_REQUEST:
      return {
        ...state,
        refreshPending: true,
      };
    case REFRESH_SESSION_TOKENS_SUCCESS:
    case REFRESH_SESSION_TOKENS_FAILURE:
      return {
        ...state,
        refreshPending: false,
      };
    default:
      return state;
  }
};

export const setSessionTokens = (payload: SessionTokens | null) => ({
  type: SET_SESSION_TOKENS,
  payload,
} as const);

export const persistSessionTokens = (payload: PersistSessionPayload) => ({
  type: PERSIST_SESSION_TOKENS,
  payload,
} as const);

export const clearSessionTokens = () => persistSessionTokens(null);

export const refreshSessionTokensRequest = () => ({
  type: REFRESH_SESSION_TOKENS_REQUEST,
} as const);

export const refreshSessionTokensSuccess = (payload: NonNullable<PersistSessionPayload>) => ({
  type: REFRESH_SESSION_TOKENS_SUCCESS,
  payload,
} as const);

export const refreshSessionTokensFailure = () => ({
  type: REFRESH_SESSION_TOKENS_FAILURE,
} as const);

export const selectSessionTokens = (state: RootState) => state.session.tokens;
export const selectSessionRefreshPending = (state: RootState) => state.session.refreshPending;
