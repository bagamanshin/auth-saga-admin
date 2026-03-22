import React, { useState } from 'react';
import { Button } from 'antd';
import { removePostApi } from '../api/postsApi';
import { runSagaWorker } from '@shared/lib/sagaRunner';

type DeletePostButtonProps = {
  postId: number;
  onDeleted?: () => void;
};

export const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await runSagaWorker(removePostApi, { id:postId });
      onDeleted?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button danger onClick={onDelete} loading={loading}>
      Delete
    </Button>
  );
};
