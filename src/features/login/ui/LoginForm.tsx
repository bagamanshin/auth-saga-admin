import { Form, Input, Button, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../model/slice';
import type { LoginRequestDTO } from '../model/saga';
import { selectSessionTokens } from '@entities/session';
import { useEffect } from 'react';

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const tokens = useSelector(selectSessionTokens);

  useEffect(() => {
    if (tokens) {
      onSuccess?.();
    }
  }, [tokens, onSuccess]);

  const onFinish = (values: LoginRequestDTO) => {
    dispatch(loginRequest(values));
  };

  return (
    <Spin spinning={loading}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        style={{ width: '400px' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: false, message: 'Please input your email!' }]}
        >
          <Input autoComplete='off' />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: false, message: 'Please input your password!' }]}
        >
          <Input.Password  autoComplete="off" />
        </Form.Item>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24, textAlign: 'left', whiteSpace: 'pre-line' }} />}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};
