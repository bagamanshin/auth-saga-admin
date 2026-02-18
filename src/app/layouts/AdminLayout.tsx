import React from 'react';
import { Layout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FileTextOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import { logout } from '@features/auth/model/slice';

const items: MenuProps['items'] = [
  { key: '/posts', label: <Link to="/posts">Posts</Link>, icon: <FileTextOutlined /> },
  { key: '/authors', label: <Link to="/authors">Authors</Link>, icon: <UserOutlined /> },
  { key: '/tags', label: <Link to="/tags">Tags</Link>, icon: <TagOutlined /> },
];

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
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={items} />
      </Sider>
      <Layout style={{ maxHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={handleLogout}>Logout</Button>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'auto' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
