import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Upload, Alert } from 'antd';
import { getPostDetailApi, editPostApi, removePostApi, type EditPostRequest } from '@entities/post/api/postsApi';
import type { EditPostRequestError } from '@entities/post/api/postsApi';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

export const PostEditPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // no local post state needed beyond form
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState<EditPostRequestError | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));

    if (!id) {
      dispatch(push(PATHS.home));
      return;
    }

    (async () => {
      const res = await getPostDetailApi(id);
      if (!res.data) {
        dispatch(push(PATHS.home));
        return;
      }
      form.setFieldsValue({
        code: res.data.code,
        title: res.data.title,
        text: res.data.text,
        authorId: res.data.author?.id,
        tagIds: res.data.tags?.map((t) => t.id),
      });
      setPreviewUrl(res.data.previewPicture?.url ?? null);
      setLoading(false);
    })();
  }, [location.search, form, dispatch]);

  type FormValues = EditPostRequest & { previewPicture?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));

    const fileList = values.previewPicture;

    const res = await editPostApi(id, {
      authorId: values.authorId,
      code: values.code,
      tagIds: values.tagIds,
      text: values.text,
      title: values.title,
      previewPicture: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
    });

    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.home));
      return;
    }

    if (res.status === 422 && res.error) {
        setServerErrors(res.error as EditPostRequestError);
      return;
    }

    // For 400/404 and other errors redirect to posts
    dispatch(push(PATHS.home));
  };

  const onDelete = async () => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const res = await removePostApi(id);
    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.home));
      return;
    }
    }

  if (loading) return <Spin />;

  return (
    <div>
      {serverErrors && <Alert message="Validation errors" description={JSON.stringify(serverErrors)} type="error" />}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Form.Item
            name="previewPicture"
            label="Preview Picture"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            style={{ marginBottom: 0 }}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          {previewUrl && (
            <div style={{ width: 120, height: 80, border: '1px solid #f0f0f0', padding: 4, borderRadius: 4 }}>
              <a href={previewUrl} target="_blank" rel="noreferrer">
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </a>
            </div>
          )}
        </div>

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
