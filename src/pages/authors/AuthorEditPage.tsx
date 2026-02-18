import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Upload, Alert } from 'antd';
import { getAuthorDetailApi, editAuthorApi, removeAuthorApi, type EditAuthorRequest } from '@entities/author/api/authorsApi';
import type { EditAuthorRequestError } from '@entities/author/api/authorsApi';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

export const AuthorEditPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState<EditAuthorRequestError | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));

    if (!id) {
      dispatch(push(PATHS.authors));
      return;
    }

    (async () => {
      const res = await getAuthorDetailApi(id);
      if (!res.data) {
        dispatch(push(PATHS.authors));
        return;
      }
      form.setFieldsValue({
        name: res.data.name,
        lastName: res.data.lastName,
        secondName: res.data.secondName,
        shortDescription: res.data.shortDescription,
        description: res.data.description,
      });
      setAvatarUrl(res.data.avatar?.url ?? null);
      setLoading(false);
    })();
  }, [location.search, form, dispatch]);

  type FormValues = EditAuthorRequest & { avatar?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));

    const fileList = values.avatar;

    const res = await editAuthorApi(id, {
      name: values.name,
      lastName: values.lastName,
      secondName: values.secondName,
      shortDescription: values.shortDescription,
      description: values.description,
      avatar: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
      removeAvatar: removeAvatar ? '1' : '0',
    });

    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.authors));
      return;
    }

    if (res.status === 422 && res.error) {
        setServerErrors(res.error as EditAuthorRequestError);
      return;
    }

    // For 400/404 and other errors redirect to authors
    dispatch(push(PATHS.authors));
  };

  const onDelete = async () => {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const res = await removeAuthorApi(id);
    if (res.status === 200 && res.data) {
      dispatch(push(PATHS.authors));
      return;
    }
    // For 400/404 errors redirect to authors
    dispatch(push(PATHS.authors));
  };

  if (loading) return <Spin />;

  return (
    <div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Form.Item
            name="avatar"
            label="Avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            style={{ marginBottom: 0 }}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          {avatarUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 80, height: 80, border: '1px solid #f0f0f0', padding: 4, borderRadius: 4 }}>
                <a href={avatarUrl} target="_blank" rel="noreferrer">
                  <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </a>
              </div>
              <Button 
                danger 
                onClick={() => {
                  setAvatarUrl(null);
                  setRemoveAvatar(true);
                }}
              >
                Remove
              </Button>
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
