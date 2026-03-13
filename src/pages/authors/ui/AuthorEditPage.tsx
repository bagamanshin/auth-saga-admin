import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';
import { EditAuthorForm } from '@features/edit-author';
import { DeleteAuthorButton } from '@features/delete-author';

export const AuthorEditPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));

  useEffect(() => {
    if (!id) {
      dispatch(push(PATHS.authors));
    }
  }, [dispatch, id]);

  if (!id) {
    return null;
  }

  return (
    <div>
      <EditAuthorForm authorId={id} />
      <div>
        <DeleteAuthorButton authorId={id} />
        <Button onClick={() => dispatch(push(PATHS.authors))} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
