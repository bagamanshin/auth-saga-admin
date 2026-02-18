import type { TagListItem } from './types';
import type { Reducer } from 'redux';

export const FETCH_TAGS_REQUEST = 'tags/FETCH_TAGS_REQUEST';
export const FETCH_TAGS_SUCCESS = 'tags/FETCH_TAGS_SUCCESS';
export const FETCH_TAGS_FAILURE = 'tags/FETCH_TAGS_FAILURE';

export interface TagsState {
  tags: TagListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

interface FetchTagsRequestAction {
    type: typeof FETCH_TAGS_REQUEST;
}

interface FetchTagsSuccessAction {
    type: typeof FETCH_TAGS_SUCCESS;
    payload: TagListItem[];
}

interface FetchTagsFailureAction {
    type: typeof FETCH_TAGS_FAILURE;
    payload: string;
}

type TagsAction = FetchTagsRequestAction | FetchTagsSuccessAction | FetchTagsFailureAction;

export const tagsReducer = ((state = initialState, action: TagsAction): TagsState => {
  switch (action.type) {
    case FETCH_TAGS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_TAGS_SUCCESS:
      return { ...state, loading: false, tags: action.payload };
    case FETCH_TAGS_FAILURE:
      return { ...state, loading: false, error: action.payload, tags: [] };
    default:
      return state;
  }
}) as Reducer<TagsState>;

export const fetchTagsRequest = () => ({
  type: FETCH_TAGS_REQUEST,
});

export const fetchTagsSuccess = (tags: TagListItem[]) => ({
  type: FETCH_TAGS_SUCCESS,
  payload: tags,
});

export const fetchTagsFailure = (error: string) => ({
  type: FETCH_TAGS_FAILURE,
  payload: error,
});
