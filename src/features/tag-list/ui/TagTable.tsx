import { useEffect } from 'react';
import { Table, Spin, Alert, Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import type { RootState } from '@app/store';
import type { TagsState } from '@entities/tag';
import { fetchTagsRequest, type TagListItem } from '@entities/tag';
import { PATHS } from '@shared/lib/paths';

export const TagTable = () => {
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
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
      render: (_: unknown, record: TagListItem) => (
        <Space>
          <Button type="primary" onClick={() => dispatch(push(`${PATHS.tagEdit}?id=${record.id}`))}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const tagsState = useSelector((state: RootState) => state.tags as TagsState | undefined);
  const { tags = [], loading = false, error = null } = tagsState || {};

  useEffect(() => {
    dispatch(fetchTagsRequest());
  }, [dispatch]);

  if (loading && (!tags || tags.length === 0)) {
    return <Spin tip="Loading tags..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => dispatch(push(PATHS.tagAdd))}>
          Create Tag
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={tags as TagListItem[]}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
