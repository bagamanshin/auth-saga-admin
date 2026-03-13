import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';
import { EditTagForm } from '@features/edit-tag';
import { DeleteTagButton } from '@features/delete-tag';

export const TagEditPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));

  useEffect(() => {
    if (!id) {
      dispatch(push(PATHS.tags));
    }
  }, [dispatch, id]);

  if (!id) return null;

  return (
    <div>
      <EditTagForm tagId={id} />
      <div>
        <DeleteTagButton tagId={id} />
        <Button onClick={() => dispatch(push(PATHS.tags))} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
