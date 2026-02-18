import React, { useState } from 'react';
import { Form, Input, Button, Upload, Alert } from 'antd';
import { addAuthorApi, type EditAuthorRequest } from '@entities/author/api/authorsApi';
import type { EditAuthorRequestError } from '@entities/author/api/authorsApi';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

export const AuthorAddPage: React.FC = () => {
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState<EditAuthorRequestError | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  type FormValues = EditAuthorRequest & { avatar?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    const fileList = values.avatar;

    const res = await addAuthorApi({
      name: values.name,
      lastName: values.lastName,
      secondName: values.secondName,
      shortDescription: values.shortDescription,
      description: values.description,
      avatar: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
      removeAvatar: '0',
    });

    setLoading(false);

    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.authors));
      return;
    }

    if (res.status === 422 && res.error) {
        setServerErrors(res.error as EditAuthorRequestError);
      return;
    }

    // For 400 and other errors show error
    if (res.error) {
      setServerErrors([{ field: 'general', message: 'Failed to create author' }] as EditAuthorRequestError);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Author</h1>
      {serverErrors && <Alert message="Validation errors" description={JSON.stringify(serverErrors)} type="error" style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="secondName" label="Second Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="shortDescription" label="Short Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item
          name="avatar"
          label="Avatar"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            Create
          </Button>
          <Button onClick={() => dispatch(push(PATHS.authors))}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
