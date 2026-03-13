import React, { useState } from 'react';
import { Form, Button, Alert } from 'antd';
import { addPostApi } from '../api/postsApi';
import { PostFormFields, type EditPostRequestDTO } from '@entities/post';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/config/routes';
import type { UploadFile } from 'antd/es/upload/interface';
import { DisplayError, isDisplayError } from '@shared/api';

export const CreatePostForm: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState<DisplayError | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  type FormValues = EditPostRequestDTO & { previewPicture?: UploadFile[] | null };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      const fileList = values.previewPicture;
      const res = await runSagaWorker(addPostApi, {postData: {
        code: values.code,
        title: values.title,
        authorId: values.authorId,
        tagIds: values.tagIds,
        text: values.text,
        previewPicture: fileList && fileList.length > 0 && fileList[0].originFileObj || null,
      }});

      if (res.data) {
        dispatch(push(PATHS.posts));
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
        <PostFormFields form={form} />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            Create
          </Button>
          <Button onClick={() => dispatch(push(PATHS.posts))}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
