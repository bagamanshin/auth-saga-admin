import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';
import { logout } from '@features/auth/model/slice';


const { Header, Content, Sider } = Layout;

export const AdminLayout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline">
          <Menu.Item key="/" icon={<FileTextOutlined />}>
            <Link to="/">Posts</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={handleLogout}>Logout</Button>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
