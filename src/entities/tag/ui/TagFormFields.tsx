import React from 'react';
import { Form, Input, InputNumber } from 'antd';

export const TagFormFields: React.FC = () => (
  <>
    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="sort" label="Sort" rules={[{ required: true }]}>
      <InputNumber />
    </Form.Item>
  </>
);
