import React, { useState } from 'react';
import { Button } from 'antd';
import { removeTagApi } from '../api/tagsApi';
import { runSagaWorker } from '@shared/lib/sagaRunner';

type DeleteTagButtonProps = {
  tagId: number;
  onDeleted?: () => void;
};

export const DeleteTagButton: React.FC<DeleteTagButtonProps> = ({ tagId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await runSagaWorker(removeTagApi, { id: tagId });
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
