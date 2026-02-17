import { Row, Col, Card, Typography } from 'antd';
import { LoginForm } from '@features/auth';

const { Title } = Typography;

export const LoginPage = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={2}>Admin Panel</Title>
          </div>
          <LoginForm />
        </Card>
      </Col>
    </Row>
  );
};
