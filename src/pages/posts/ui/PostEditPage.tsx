import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { EditPostForm } from '@features/edit-post';
import { DeletePostButton } from '@features/delete-post';

export type PostEditPageProps = {
  onInvalidId: () => void;
  onCancel: () => void;
  onDeleted: () => void;
  onSuccess: () => void;
};

export const PostEditPage: React.FC<PostEditPageProps> = ({ onInvalidId, onCancel, onDeleted, onSuccess }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));

  useEffect(() => {
    if (!id) {
      onInvalidId();
    }
  }, [id, onInvalidId]);

  if (!id) return null;

  return (
    <div>
      <EditPostForm postId={id} onNotFound={onInvalidId} onSuccess={onSuccess} />
      <div>
        <DeletePostButton postId={id} onDeleted={onDeleted} />
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
