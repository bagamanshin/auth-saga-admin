import React from 'react';
import { CreatePostForm } from '@features/create-post';

export type PostAddPageProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export const PostAddPage: React.FC<PostAddPageProps> = ({ onCancel, onSuccess }) => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Post</h1>
      <CreatePostForm onCancel={onCancel} onSuccess={onSuccess} />
    </div>
  );
};
