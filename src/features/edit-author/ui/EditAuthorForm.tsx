import React, { useEffect, useState } from 'react';
import { Form, Button, Spin, Alert } from 'antd';
import { getAuthorDetailApi, editAuthorApi } from '../api/authorsApi';
import { AuthorFormFields, type EditAuthorRequestDTO } from '@entities/author';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';
import type { UploadFile } from 'antd/es/upload/interface';
import { DisplayError, isDisplayError } from '@shared/api';

type EditAuthorFormProps = {
  authorId: number;
};

export const EditAuthorForm: React.FC<EditAuthorFormProps> = ({ authorId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<DisplayError | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await runSagaWorker(getAuthorDetailApi, { id: authorId });
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
      } catch {
        dispatch(push(PATHS.authors));
      }
    })();
  }, [authorId, dispatch, form]);

  type FormValues = EditAuthorRequestDTO & { avatar?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    setError(null);
    setSaving(true);

    try {
      const fileList = values.avatar;
      await runSagaWorker(editAuthorApi, { id: authorId, authorData: {
        name: values.name,
        lastName: values.lastName,
        secondName: values.secondName,
        shortDescription: values.shortDescription,
        description: values.description,
        avatar: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
        removeAvatar: removeAvatar ? '1' : '0',
      }});

      dispatch(push(PATHS.authors));
    } catch (error) {
      if (isDisplayError(error)) {
        setError(error);
        return;
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <>
      {error && <Alert message="Errors" description={error.displayMessage} type="error" style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <AuthorFormFields
          avatarUrl={avatarUrl}
          onRemoveAvatar={() => {
            setAvatarUrl(null);
            setRemoveAvatar(true);
          }}
        />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
