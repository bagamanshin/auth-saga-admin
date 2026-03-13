import type { AuthorListItemDTO } from '@entities/author';
import type { Reducer } from 'redux';

export const FETCH_AUTHORS_REQUEST = 'authors/FETCH_AUTHORS_REQUEST';
export const FETCH_AUTHORS_SUCCESS = 'authors/FETCH_AUTHORS_SUCCESS';
export const FETCH_AUTHORS_FAILURE = 'authors/FETCH_AUTHORS_FAILURE';

export interface AuthorsState {
  authors: AuthorListItemDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  loading: false,
  error: null,
};

interface FetchAuthorsRequestAction {
    type: typeof FETCH_AUTHORS_REQUEST;
}

interface FetchAuthorsSuccessAction {
    type: typeof FETCH_AUTHORS_SUCCESS;
    payload: AuthorListItemDTO[];
}

interface FetchAuthorsFailureAction {
    type: typeof FETCH_AUTHORS_FAILURE;
    payload: string;
}

type AuthorsAction = FetchAuthorsRequestAction | FetchAuthorsSuccessAction | FetchAuthorsFailureAction;

export const authorsReducer = ((state = initialState, action: AuthorsAction): AuthorsState => {
  switch (action.type) {
    case FETCH_AUTHORS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_AUTHORS_SUCCESS:
      return { ...state, loading: false, authors: action.payload };
    case FETCH_AUTHORS_FAILURE:
      return { ...state, loading: false, error: action.payload, authors: [] };
    default:
      return state;
  }
}) as Reducer<AuthorsState>;

export const fetchAuthorsRequest = () => ({
  type: FETCH_AUTHORS_REQUEST,
});

export const fetchAuthorsSuccess = (authors: AuthorListItemDTO[]) => ({
  type: FETCH_AUTHORS_SUCCESS,
  payload: authors,
});

export const fetchAuthorsFailure = (error: string) => ({
  type: FETCH_AUTHORS_FAILURE,
  payload: error,
});
