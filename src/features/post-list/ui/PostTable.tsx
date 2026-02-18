import { useEffect } from 'react';
import { Table, Spin, Alert, Tag, Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'connected-react-router';
import type { RootState } from '@app/store';
import type { PostsState } from '@entities/post';
import { fetchPostsRequest, type Post } from '@entities/post';
import { PATHS } from '@shared/lib/paths';

export const PostTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'authorName',
      key: 'authorName',
    },
    {
      title: 'Tags',
      dataIndex: 'tagNames',
      key: 'tagNames',
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
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
      render: (_: unknown, record: Post) => (
        <Space>
          <Button type="primary" onClick={() => dispatch(push(`${PATHS.postEdit}?id=${record.id}`))}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const postsState = useSelector((state: RootState) => state.posts as PostsState | undefined);
  const { posts = [], pagination = null, loading = false, error = null } = postsState || {};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1', 10);
    dispatch(fetchPostsRequest({ page }));
  }, [location.search, dispatch]);

  const handleTableChange = (page: number) => {
    dispatch(push(`${location.pathname}?page=${page}`));
  };

  if (loading && (!posts || posts.length === 0)) {
    return <Spin tip="Loading posts..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Table
      columns={columns}
      dataSource={posts as Post[]}
      rowKey="id"
      loading={loading}
      pagination={pagination ? {
        current: pagination.currentPage,
        pageSize: pagination.perPage,
        total: pagination.totalCount,
        onChange: handleTableChange,
      } : false}
    />
  );
};
