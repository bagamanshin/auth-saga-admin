import { useEffect } from 'react';
import { Table, Spin, Alert, Button, Space, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import type { RootState } from '@app/store';
import type { AuthorsState } from '@entities/author';
import { fetchAuthorsRequest, type AuthorListItem } from '@entities/author';
import { PATHS } from '@shared/lib/paths';

export const AuthorTable = () => {
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: { url?: string } | null | undefined) => (
        avatar?.url ? (
          <Avatar src={avatar.url} size={40} />
        ) : (
          <Avatar size={40} />
        )
      ),
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Second Name',
      dataIndex: 'secondName',
      key: 'secondName',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: AuthorListItem) => (
        <Space>
          <Button type="primary" onClick={() => dispatch(push(`${PATHS.authorEdit}?id=${record.id}`))}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const authorsState = useSelector((state: RootState) => state.authors as AuthorsState | undefined);
  const { authors = [], loading = false, error = null } = authorsState || {};

  useEffect(() => {
    dispatch(fetchAuthorsRequest());
  }, [dispatch]);

  if (loading && (!authors || authors.length === 0)) {
    return <Spin tip="Loading authors..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => dispatch(push(PATHS.authorAdd))}>
          Create Author
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={authors as AuthorListItem[]}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
