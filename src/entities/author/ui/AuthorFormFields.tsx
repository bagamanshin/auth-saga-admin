import React from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface AuthorFormFieldsProps {
  avatarUrl?: string | null;
  onRemoveAvatar?: () => void;
}

const UploadField = ({avatarUrl}: Pick<AuthorFormFieldsProps, 'avatarUrl'>) => (
    <Form.Item
      name="avatar"
      label="Avatar"
      valuePropName="fileList"
      getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
      style={avatarUrl ? { marginBottom: 0 } : undefined}
    >
      <Upload beforeUpload={() => false} maxCount={1}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </Form.Item>
  );

export const AuthorFormFields: React.FC<AuthorFormFieldsProps> = ({
  avatarUrl,
  onRemoveAvatar,
}) => {
  return (
    <>
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
      {avatarUrl ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UploadField avatarUrl={avatarUrl} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 80, border: '1px solid #f0f0f0', padding: 4, borderRadius: 4 }}>
              <a href={avatarUrl} target="_blank" rel="noreferrer">
                <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </a>
            </div>
            {onRemoveAvatar && (
              <Button danger onClick={onRemoveAvatar}>
                Remove
              </Button>
            )}
          </div>
        </div>
      ) : (
        <UploadField />
      )}
    </>
  );
};
