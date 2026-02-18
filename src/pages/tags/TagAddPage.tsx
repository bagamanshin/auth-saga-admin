import React, { useState } from 'react';
import { Form, Input, Button, Alert, InputNumber } from 'antd';
import { addTagApi, type EditTagRequest } from '@entities/tag/api/tagsApi';
import type { EditTagRequestError } from '@entities/tag/api/tagsApi';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';

export const TagAddPage: React.FC = () => {
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState<EditTagRequestError | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  type FormValues = EditTagRequest;

  const onFinish = async (values: FormValues) => {
    setLoading(true);

    const res = await addTagApi({
      code: values.code,
      name: values.name,
      sort: values.sort,
    });

    setLoading(false);

    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.tags));
      return;
    }

    if (res.status === 422 && res.error) {
        setServerErrors(res.error as EditTagRequestError);
      return;
    }

    // For 400 and other errors show error
    if (res.error) {
      setServerErrors([{ field: 'general', message: 'Failed to create tag' }] as EditTagRequestError);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Tag</h1>
      {serverErrors && <Alert message="Validation errors" description={JSON.stringify(serverErrors)} type="error" style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sort" label="Sort" rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            Create
          </Button>
          <Button onClick={() => dispatch(push(PATHS.tags))}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
