import React from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

interface PostFormFieldsProps {
  form: FormInstance;
  previewUrl?: string | null;
}

type TagsIdValues = {
  tagIds?: number[];
};

const UploadField = ({previewUrl}: Pick<PostFormFieldsProps, 'previewUrl'>) => (
    <Form.Item
      name="previewPicture"
      label="Preview Picture"
      valuePropName="fileList"
      getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
      style={previewUrl ? { marginBottom: 0 } : undefined}
    >
      <Upload beforeUpload={() => false} maxCount={1}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </Form.Item>
  );

export const PostFormFields: React.FC<PostFormFieldsProps> = ({ form, previewUrl }) => {
  return (
    <>
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
            const val = e.target.value
              .split(',')
              .map((s) => Number(s.trim()))
              .filter(Number.isFinite);
            form.setFieldsValue({ tagIds: val } as TagsIdValues);
          }}
        />
      </Form.Item>
      <Form.Item name="text" label="Text">
        <Input.TextArea rows={6} />
      </Form.Item>
      {previewUrl ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UploadField previewUrl={previewUrl} />
          <div style={{ width: 120, height: 80, border: '1px solid #f0f0f0', padding: 4, borderRadius: 4 }}>
            <a href={previewUrl} target="_blank" rel="noreferrer">
              <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </a>
          </div>
        </div>
      ) : (
        <UploadField />
      )}
    </>
  );
};
