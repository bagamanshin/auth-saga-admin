import React, { useState } from 'react';
import { Form, Button, Alert } from 'antd';
import { addTagApi } from '../api/tagsApi';
import { TagFormFields, type EditTagRequestDTO } from '@entities/tag';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';
import { DisplayError, isDisplayError } from '@shared/api';

export const CreateTagForm: React.FC = () => {
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

      dispatch(push(PATHS.tags));
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
          <Button onClick={() => dispatch(push(PATHS.tags))}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
