import React, { useState } from 'react';
import { Form, Input, Button, Upload, Alert } from 'antd';
import { addPostApi, type EditPostRequest } from '@entities/post/api/postsApi';
import type { EditPostRequestError } from '@entities/post/api/postsApi';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

export const PostAddPage: React.FC = () => {
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState<EditPostRequestError | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  type FormValues = EditPostRequest & { previewPicture?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    const fileList = values.previewPicture;

    const res = await addPostApi({
      code: values.code,
      title: values.title,
      authorId: values.authorId,
      tagIds: values.tagIds,
      text: values.text,
      previewPicture: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
    });

    setLoading(false);

    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.posts));
      return;
    }

    if (res.status === 422 && res.error) {
        setServerErrors(res.error as EditPostRequestError);
      return;
    }

    // For 400 and other errors show error
    if (res.error) {
      setServerErrors([{ field: 'general', message: 'Failed to create post' }] as EditPostRequestError);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Create Post</h1>
      {serverErrors && <Alert message="Validation errors" description={JSON.stringify(serverErrors)} type="error" style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="authorId" label="Author ID" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="tagIds" label="Tag IDs (comma separated)">
          <Input
            onChange={(e) => {
              const val = e.target.value.split(',').map((s) => Number(s.trim())).filter(Boolean);
              form.setFieldsValue({ tagIds: val });
            }}
          />
        </Form.Item>
        <Form.Item name="text" label="Text">
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item
          name="previewPicture"
          label="Preview Picture"
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
          <Button onClick={() => dispatch(push(PATHS.posts))}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
