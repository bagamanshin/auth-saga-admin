import React, { useState } from 'react';
import { Button } from 'antd';
import { removePostApi } from '../api/postsApi';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';

type DeletePostButtonProps = {
  postId: number;
};

export const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onDelete = async () => {
    setLoading(true);
    try {
      await runSagaWorker(removePostApi, { id:postId });
      dispatch(push(PATHS.home));
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
