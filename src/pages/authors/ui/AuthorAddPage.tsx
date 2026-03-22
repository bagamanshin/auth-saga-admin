import React from 'react';
import { CreateAuthorForm } from '@features/create-author';

export type AuthorAddPageProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export const AuthorAddPage: React.FC<AuthorAddPageProps> = ({ onCancel, onSuccess }) => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Author</h1>
      <CreateAuthorForm onCancel={onCancel} onSuccess={onSuccess} />
    </div>
  );
};
