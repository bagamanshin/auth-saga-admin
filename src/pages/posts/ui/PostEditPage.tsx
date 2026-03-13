import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';
import { EditPostForm } from '@features/edit-post';
import { DeletePostButton } from '@features/delete-post';

export const PostEditPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));

  useEffect(() => {
    if (!id) {
      dispatch(push(PATHS.home));
    }
  }, [dispatch, id]);

  if (!id) return null;

  return (
    <div>
      <EditPostForm postId={id} />
      <div>
        <DeletePostButton postId={id} />
        <Button onClick={() => dispatch(push(PATHS.home))} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
