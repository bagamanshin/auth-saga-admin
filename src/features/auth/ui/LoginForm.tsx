import { Form, Input, Button, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../model/slice';
import type { RootState } from '@app/store';
import type { LoginRequest } from '@shared/api/authApi';

export const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onFinish = (values: LoginRequest) => {
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
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input autoComplete='off' />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password  autoComplete="off" />
        </Form.Item>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24, textAlign: 'left' }} />}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};
