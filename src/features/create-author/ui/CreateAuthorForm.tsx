import React, { useState } from 'react';
import { Form, Button, Alert } from 'antd';
import { addAuthorApi } from '../api/authorsApi';
import { AuthorFormFields, type EditAuthorRequestDTO } from '@entities/author';
import { createAuthorSuccess } from '../model/events';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import type { UploadFile } from 'antd/es/upload/interface';
import { DisplayError, isDisplayError } from '@shared/api';

type CreateAuthorFormProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export const CreateAuthorForm: React.FC<CreateAuthorFormProps> = ({ onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<DisplayError | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  type FormValues = EditAuthorRequestDTO & { avatar?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      const fileList = values.avatar;
      const res = await runSagaWorker(addAuthorApi, {
        authorData: {
          name: values.name,
          lastName: values.lastName,
          secondName: values.secondName,
          shortDescription: values.shortDescription,
          description: values.description,
          avatar: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
          removeAvatar: '0',
        }}
      );

      if (res.data) {
        dispatch(createAuthorSuccess());
        onSuccess?.();
        return;
      }
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
        <AuthorFormFields />

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
