import { TagList } from '@features/tags-list';

export type TagsPageProps = {
  onEditTag: (id: number) => void;
  onCreateTag: () => void;
};

export const TagsPage = ({ onEditTag, onCreateTag }: TagsPageProps) => {
  return (
    <TagList onEdit={onEditTag} onCreate={onCreateTag} />
  );
};
