import { AdminLayout } from '@widgets/layout';
import { PostTable } from '@features/post-list';

export const PostsPage = () => {
  return (
    <AdminLayout>
      <PostTable />
    </AdminLayout>
  );
};
