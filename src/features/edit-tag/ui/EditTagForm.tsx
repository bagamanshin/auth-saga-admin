import React, { useEffect, useState } from 'react';
import { Form, Button, Spin, Alert } from 'antd';
import { getTagDetailApi, editTagApi } from '../api/tagsApi';
import { TagFormFields, type EditTagRequestDTO } from '@entities/tag';
import { editTagSuccess } from '../model/events';
import { runSagaWorker } from '@shared/lib/sagaRunner';
import { useDispatch } from 'react-redux';
import { DisplayError, isDisplayError } from '@shared/api';

type EditTagFormProps = {
  tagId: number;
  onNotFound: () => void;
  onSuccess?: () => void;
};

export const EditTagForm: React.FC<EditTagFormProps> = ({ tagId, onNotFound, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<DisplayError | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await runSagaWorker(getTagDetailApi, { id:tagId });
        if (!res.data) {
          onNotFound();
          return;
        }

        form.setFieldsValue({
          code: res.data.code,
          name: res.data.name,
          sort: res.data.sort,
        });
        setLoading(false);
      } catch {
        onNotFound();
      }
    })();
  }, [dispatch, form, tagId, onNotFound]);

  type FormValues = EditTagRequestDTO;

  const onFinish = async (values: FormValues) => {
    setError(null);
    setSaving(true);

    try {
      await runSagaWorker(editTagApi, { id: tagId, tagData: values });


      dispatch(editTagSuccess());
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
        <TagFormFields />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
