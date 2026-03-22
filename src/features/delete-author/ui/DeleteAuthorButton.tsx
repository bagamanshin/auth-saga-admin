import React, { useState } from 'react';
import { Button } from 'antd';
import { removeAuthorApi } from '../api/authorsApi';
import { runSagaWorker } from '@shared/lib/sagaRunner';

type DeleteAuthorButtonProps = {
  authorId: number;
  onDeleted?: () => void;
};

export const DeleteAuthorButton: React.FC<DeleteAuthorButtonProps> = ({ authorId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await runSagaWorker(removeAuthorApi, { id: authorId});
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
