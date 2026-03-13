import React from 'react';
import { CreateTagForm } from '@features/create-tag';

export const TagAddPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Tag</h1>
      <CreateTagForm />
    </div>
  );
};
