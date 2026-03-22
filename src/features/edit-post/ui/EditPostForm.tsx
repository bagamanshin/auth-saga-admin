import React, { useEffect, useState } from 'react';
import { Form, Button, Spin, Alert } from 'antd';
import { getPostDetailApi, editPostApi } from '../api/postsApi';
import { PostFormFields, type EditPostRequestDTO } from '@entities/post';
import { editPostSuccess } from '../model/events';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import type { UploadFile } from 'antd/es/upload/interface';
import { DisplayError, isDisplayError } from '@shared/api';

type EditPostFormProps = {
  postId: number;
  onNotFound: () => void;
  onSuccess?: () => void;
};

export const EditPostForm: React.FC<EditPostFormProps> = ({ postId, onNotFound, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<DisplayError | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await runSagaWorker(getPostDetailApi, {id: postId});
        if (!res.data) {
          onNotFound();
          return;
        }

        form.setFieldsValue({
          code: res.data.code,
          title: res.data.title,
          text: res.data.text,
          authorId: res.data.author?.id,
          tagIds: res.data.tags?.map((t: { id: number }) => t.id),
        });
        setPreviewUrl(res.data.previewPicture?.url ?? null);
        setLoading(false);
      } catch {
        onNotFound();
      }
    })();
  }, [dispatch, form, postId, onNotFound]);

  type FormValues = EditPostRequestDTO & { previewPicture?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    setError(null);
    setSaving(true);

    try {
      const fileList = values.previewPicture;
      await runSagaWorker(editPostApi, {
        id:postId,
        postData: {
          authorId: values.authorId,
          code: values.code,
          tagIds: values.tagIds,
          text: values.text,
          title: values.title,
          previewPicture: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
        }
      });

      dispatch(editPostSuccess());
      onSuccess?.();
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
        <PostFormFields form={form} previewUrl={previewUrl} />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
