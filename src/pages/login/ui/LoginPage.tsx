import { lazy, Suspense } from 'react';
import { Row, Col, Card, Typography, Spin } from 'antd';

const LoginForm = lazy(() => import('@features/login').then((m) => ({ default: m.LoginForm })));
const { Title } = Typography;

export type LoginPageProps = {
  onSuccess: () => void;
};

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={2}>Admin Panel</Title>
            </div>
            <Suspense fallback={<Spin />}>
              <LoginForm onSuccess={onSuccess} />
            </Suspense>
          </Card>
        </Col>
      </Row>
  );
};
