import React from 'react';
import { Space } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import {
  COL_ACTIONS,
  COL_CLIENT,
  COL_ID,
  COL_LOGIN_ID,
  COL_NAME,
  COL_ROLE,
  ROLE_ADMIN_CLIENT,
  ROLE_LABEL_ADMIN_CLIENT,
  ROLE_LABEL_CLIENT,
} from './constants';

export const createUserColumns = ({ onEdit, onDelete }) => [
  { title: COL_ID, dataIndex: 'id', width: 80 },
  { title: COL_NAME, dataIndex: 'full_name' },
  { title: COL_LOGIN_ID, dataIndex: 'email' },
  {
    title: COL_ROLE,
    dataIndex: 'role',
    width: 140,
    render: (role) => (role === ROLE_ADMIN_CLIENT ? ROLE_LABEL_ADMIN_CLIENT : ROLE_LABEL_CLIENT),
  },
  { title: COL_CLIENT, dataIndex: 'client_name' },
  {
    title: COL_ACTIONS,
    width: 140,
    render: (_, item) => (
      <Space className="admin-table-actions">
        <AdminActionButton action="edit" iconOnly onClick={() => onEdit(item)} />
        <AdminActionButton action="delete" iconOnly onClick={() => onDelete(item.id)} />
      </Space>
    ),
  },
];
