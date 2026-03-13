import { createApi } from '@shared/api';
import type {
  TagListItemDTO,
  TagDetailDTO,
  EditTagRequestDTO,
} from '../model/types';

type GetTagDetailParams = {
  id: number;
};

type EditTagParams = {
  id: number;
  tagData: EditTagRequestDTO;
};

type RemoveTagParams = {
  id: number;
};

type AddTagParams = {
  tagData: EditTagRequestDTO;
};

export const getTagsApi = createApi<undefined, undefined, TagListItemDTO[]>({
  endpoint: '/manage/tags',
});

export const getTagDetailApi = createApi<GetTagDetailParams, undefined, TagDetailDTO>({
  endpoint: ({ id }) =>
    `/manage/tags/detail?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
});

export const editTagApi = createApi<EditTagParams, EditTagRequestDTO, boolean>({
  endpoint: ({ id }) =>
    `/manage/tags/edit?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
  options: ({ tagData }) => ({
    method: 'POST',
    body: tagData,
  }),
});

export const removeTagApi = createApi<RemoveTagParams, undefined, boolean>({
  endpoint: ({ id }) =>
    `/manage/tags/remove?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
  options: {
    method: 'DELETE',
  },
});

export const addTagApi = createApi<AddTagParams, EditTagRequestDTO, boolean>({
  endpoint: '/manage/tags/add',
  options: ({ tagData }) => ({
    method: 'POST',
    body: tagData,
  }),
});
