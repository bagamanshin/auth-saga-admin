import { PostList } from '@features/posts-list';

export type PostsPageProps = {
  onEditPost: (id: number) => void;
  onCreatePost: () => void;
  onPageChange: (page: number) => void;
};

export const PostsPage = ({ onEditPost, onCreatePost, onPageChange }: PostsPageProps) => {
  return (
    <PostList onEdit={onEditPost} onCreate={onCreatePost} onPageChange={onPageChange} />
  );
};
