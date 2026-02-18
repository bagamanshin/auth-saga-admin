import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { PATHS } from '@shared/lib/paths';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Admin Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            onClick={() => dispatch(push(PATHS.posts))}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="Posts"
              value="Manage"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 18 }}
            />
            <p style={{ marginTop: 16, color: '#666' }}>
              View, create, and edit blog posts
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            onClick={() => dispatch(push(PATHS.authors))}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="Authors"
              value="Manage"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 18 }}
            />
            <p style={{ marginTop: 16, color: '#666' }}>
              Manage author profiles and information
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            onClick={() => dispatch(push(PATHS.tags))}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="Tags"
              value="Manage"
              prefix={<TagOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 18 }}
            />
            <p style={{ marginTop: 16, color: '#666' }}>
              Create and organize content tags
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
