export type PersistSessionPayload = {
  access_token: string;
  refresh_token: string;
  access_expired_at?: number;
  refresh_expired_at?: number;
} | null;

export type SessionTokens = Pick<NonNullable<PersistSessionPayload>, 'access_token' | 'refresh_token'>;

export interface SessionState {
  tokens: SessionTokens | null;
}

export const SET_SESSION_TOKENS = 'session/SET_SESSION_TOKENS';
export const PERSIST_SESSION_TOKENS = 'session/PERSIST_SESSION_TOKENS';

interface SetSessionTokensAction {
  type: typeof SET_SESSION_TOKENS;
  payload: SessionTokens | null;
}

interface PersistSessionTokensAction {
  type: typeof PERSIST_SESSION_TOKENS;
  payload: PersistSessionPayload;
}

type SessionAction =
  | SetSessionTokensAction
  | PersistSessionTokensAction;

const initialState: SessionState = {
  tokens: null,
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
    default:
      return state;
  }
};

export const setSessionTokens = (payload: SessionTokens | null) => ({
  type: SET_SESSION_TOKENS,
  payload,
});

export const persistSessionTokens = (payload: PersistSessionPayload) => ({
  type: PERSIST_SESSION_TOKENS,
  payload,
});

export const selectSessionTokens = (state: RootState) => state.session.tokens;
