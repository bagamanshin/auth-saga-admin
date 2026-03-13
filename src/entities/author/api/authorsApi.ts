import { createApi } from '@shared/api';
import type {
  AuthorListItemDTO,
  AuthorDetailDTO,
  EditAuthorRequestDTO,
} from '../model/types';

type GetAuthorDetailParams = {
  id: number;
};

type EditAuthorParams = {
  id: number;
  authorData: EditAuthorRequestDTO;
};

type RemoveAuthorParams = {
  id: number;
};

type AddAuthorParams = {
  authorData: EditAuthorRequestDTO;
};

export const getAuthorsApi = createApi<undefined, undefined, AuthorListItemDTO[]>({
  endpoint: '/manage/authors',
});

export const getAuthorDetailApi = createApi<GetAuthorDetailParams, undefined, AuthorDetailDTO>({
  endpoint: ({ id }) =>
    `/manage/authors/detail?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
});

export const editAuthorApi = createApi<EditAuthorParams, EditAuthorRequestDTO, boolean>({
  endpoint: ({ id }) =>
    `/manage/authors/edit?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
  options: ({ authorData }) => ({
    method: 'POST',
    body: authorData,
  }),
});

export const removeAuthorApi = createApi<RemoveAuthorParams, undefined, boolean>({
  endpoint: ({ id }) =>
    `/manage/authors/remove?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
  options: {
    method: 'DELETE',
  },
});

export const addAuthorApi = createApi<AddAuthorParams, EditAuthorRequestDTO, boolean>({
  endpoint: '/manage/authors/add',
  options: ({ authorData }) => ({
    method: 'POST',
    body: authorData,
  }),
});
