import React from 'react';
import { Space } from 'antd';
import { AdminActionButton } from '../../components/AdminShell';

export function createUserColumns({ onEdit, onDelete }) {
  return [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'full_name' },
    { title: 'ログインID', dataIndex: 'email' },
    {
      title: '権限',
      dataIndex: 'role',
      width: 140,
      render: (role) => (role === 'admin_client' ? 'クライアント' : 'ユーザー'),
    },
    { title: 'クライアント', dataIndex: 'client_name' },
    {
      title: 'アクション',
      width: 140,
      render: (_, item) => (
        <Space className="admin-table-actions">
          <AdminActionButton action="edit" iconOnly onClick={() => onEdit(item)} />
          <AdminActionButton action="delete" iconOnly onClick={() => onDelete(item.id)} />
        </Space>
      ),
    },
  ];
}
