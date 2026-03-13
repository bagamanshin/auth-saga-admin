import React, { useState } from 'react';
import { Button } from 'antd';
import { removeAuthorApi } from '../api/authorsApi';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';

type DeleteAuthorButtonProps = {
  authorId: number;
};

export const DeleteAuthorButton: React.FC<DeleteAuthorButtonProps> = ({ authorId }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onDelete = async () => {
    setLoading(true);
    try {
      await runSagaWorker(removeAuthorApi, { id: authorId});
      dispatch(push(PATHS.authors));
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
