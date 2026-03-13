import React from 'react';
import { CreateAuthorForm } from '@features/create-author';

export const AuthorAddPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Author</h1>
      <CreateAuthorForm />
    </div>
  );
};
