import React, { useState } from 'react';
import { Button } from 'antd';
import { removeTagApi } from '../api/tagsApi';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';

type DeleteTagButtonProps = {
  tagId: number;
};

export const DeleteTagButton: React.FC<DeleteTagButtonProps> = ({ tagId }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onDelete = async () => {
    setLoading(true);
    try {
      await runSagaWorker(removeTagApi, { id: tagId });
      dispatch(push(PATHS.tags));
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
