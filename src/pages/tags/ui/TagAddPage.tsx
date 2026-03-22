import React from 'react';
import { CreateTagForm } from '@features/create-tag';

export type TagAddPageProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export const TagAddPage: React.FC<TagAddPageProps> = ({ onCancel, onSuccess }) => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Tag</h1>
      <CreateTagForm onCancel={onCancel} onSuccess={onSuccess} />
    </div>
  );
};
