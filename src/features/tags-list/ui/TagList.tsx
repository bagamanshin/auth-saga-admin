import { useEffect } from 'react';
import { Table, Spin, Alert, Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { TagsState } from '../model/slice';
import { fetchTagsRequest } from '../model/slice';
import type { TagListItemDTO } from '@entities/tag';

type TagListProps = {
  onEdit: (id: number) => void;
  onCreate: () => void;
};

export const TagList = ({ onEdit, onCreate }: TagListProps) => {
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
      render: (_: unknown, record: TagListItemDTO) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record.id)}>
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
        <Button type="primary" onClick={onCreate}>
          Create Tag
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={tags as TagListItemDTO[]}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
