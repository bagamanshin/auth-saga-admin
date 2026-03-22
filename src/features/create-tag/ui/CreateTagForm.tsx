import React, { useState } from 'react';
import { Form, Button, Alert } from 'antd';
import { addTagApi } from '../api/tagsApi';
import { TagFormFields, type EditTagRequestDTO } from '@entities/tag';
import { createTagSuccess } from '../model/events';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { DisplayError, isDisplayError } from '@shared/api';

type CreateTagFormProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export const CreateTagForm: React.FC<CreateTagFormProps> = ({ onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<DisplayError | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  type FormValues = EditTagRequestDTO;

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      await runSagaWorker(addTagApi, { tagData: values });

      dispatch(createTagSuccess());
      onSuccess?.();
    } catch (error) {
      if (isDisplayError(error)) {
        setError(error);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert message="Errors" description={error.displayMessage} type="error" style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <TagFormFields />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            Create
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
