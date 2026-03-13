import React from 'react';
import { CreatePostForm } from '@features/create-post';

export const PostAddPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Post</h1>
      <CreatePostForm />
    </div>
  );
};
