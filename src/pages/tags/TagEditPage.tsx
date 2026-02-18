import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Alert, InputNumber } from 'antd';
import { getTagDetailApi, editTagApi, removeTagApi, type EditTagRequest } from '@entities/tag/api/tagsApi';
import type { EditTagRequestError } from '@entities/tag/api/tagsApi';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';

export const TagEditPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState<EditTagRequestError | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));

    if (!id) {
      dispatch(push(PATHS.tags));
      return;
    }

    (async () => {
      const res = await getTagDetailApi(id);
      if (!res.data) {
        dispatch(push(PATHS.tags));
        return;
      }
      form.setFieldsValue({
        code: res.data.code,
        name: res.data.name,
        sort: res.data.sort,
      });
      setLoading(false);
    })();
  }, [location.search, form, dispatch]);

  type FormValues = EditTagRequest;

  const onFinish = async (values: FormValues) => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));

    const res = await editTagApi(id, {
      code: values.code,
      name: values.name,
      sort: values.sort,
    });

    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.tags));
      return;
    }

    if (res.status === 422 && res.error) {
        setServerErrors(res.error as EditTagRequestError);
      return;
    }

    // For 400/404 and other errors redirect to tags
    dispatch(push(PATHS.tags));
  };

  const onDelete = async () => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const res = await removeTagApi(id);
    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.tags));
      return;
    }
    // For 400/404 errors redirect to tags
    dispatch(push(PATHS.tags));
  };

  if (loading) return <Spin />;

  return (
    <div>
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
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Save
          </Button>
          <Button danger onClick={onDelete}>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
