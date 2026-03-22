import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { EditTagForm } from '@features/edit-tag';
import { DeleteTagButton } from '@features/delete-tag';

export type TagEditPageProps = {
  onInvalidId: () => void;
  onCancel: () => void;
  onDeleted: () => void;
  onSuccess: () => void;
};

export const TagEditPage: React.FC<TagEditPageProps> = ({ onInvalidId, onCancel, onDeleted, onSuccess }) => {
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
      <EditTagForm tagId={id} onNotFound={onInvalidId} onSuccess={onSuccess} />
      <div>
        <DeleteTagButton tagId={id} onDeleted={onDeleted} />
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
