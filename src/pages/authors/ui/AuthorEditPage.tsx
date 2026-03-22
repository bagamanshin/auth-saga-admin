import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { EditAuthorForm } from '@features/edit-author';
import { DeleteAuthorButton } from '@features/delete-author';

export type AuthorEditPageProps = {
  onInvalidId: () => void;
  onCancel: () => void;
  onDeleted: () => void;
  onSuccess: () => void;
};

export const AuthorEditPage: React.FC<AuthorEditPageProps> = ({ onInvalidId, onCancel, onDeleted, onSuccess }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));

  useEffect(() => {
    if (!id) {
      onInvalidId();
    }
  }, [id, onInvalidId]);

  if (!id) {
    return null;
  }

  return (
    <div>
      <EditAuthorForm authorId={id} onNotFound={onInvalidId} onSuccess={onSuccess} />
      <div>
        <DeleteAuthorButton authorId={id} onDeleted={onDeleted} />
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
