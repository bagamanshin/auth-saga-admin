import { AuthorList } from '@features/authors-list';

export type AuthorsPageProps = {
  onEditAuthor: (id: number) => void;
  onCreateAuthor: () => void;
};

export const AuthorsPage = ({ onEditAuthor, onCreateAuthor }: AuthorsPageProps) => {
  return (
    <AuthorList onEdit={onEditAuthor} onCreate={onCreateAuthor} />
  );
};
