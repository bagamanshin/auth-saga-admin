import { useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState } from '@app/store';
import {
  fetchPostsRequest,
  setPostsPagination,
} from '@entities/post';

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
    title: 'Body',
    dataIndex: 'body',
    key: 'body',
  },
];

export const PostTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, pagination, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1', 10);
    const size = parseInt(params.get('size') || '10', 10);
    dispatch(fetchPostsRequest({ page, size }));
  }, [location.search, dispatch]);

  const handleTableChange = (page: number, size?: number) => {
    // antd size is optional in onChange
    const newSize = size || pagination.size;
    dispatch(setPostsPagination({ page, size: newSize }));
  };

  if (loading && posts.length === 0) {
    return <Spin tip="Loading posts..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Table
      columns={columns}
      dataSource={posts}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.size,
        total: pagination.total,
        onChange: handleTableChange,
      }}
    />
  );
};
