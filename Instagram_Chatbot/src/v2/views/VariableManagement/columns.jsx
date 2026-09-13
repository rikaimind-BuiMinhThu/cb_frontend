import React from 'react';
import { Input, Space, Typography } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import {
  PAGE_SIZE,
  COL_NO,
  COL_NAME,
  COL_DEFAULT,
  COL_ACTION,
  COL_NOTE,
  SAVE_LABEL,
  PLACEHOLDER_NAME,
  PLACEHOLDER_VALUE,
} from './constants';
import { variableFieldErrorKey } from './variableUtils';

const VariableNameInput = ({ value, error, placeholder, onChange }) => (
  <div>
    <Input
      className="admin-variable-input"
      value={value || ''}
      placeholder={placeholder}
      status={error ? 'error' : undefined}
      onChange={(event) => onChange(event.target.value)}
    />
    {error ? (
      <div className="admin-form-error" role="alert">
        {error}
      </div>
    ) : null}
  </div>
);

export const createUserVariableColumns = ({
  page,
  fieldErrors,
  savingIds,
  onChangeField,
  onSave,
  onDelete,
}) => [
  {
    title: COL_NO,
    width: 70,
    align: 'center',
    render: (_, __, index) => (page - 1) * PAGE_SIZE + index + 1,
  },
  {
    title: COL_NAME,
    dataIndex: 'variable_name',
    width: '28%',
    render: (value, row) => (
      <VariableNameInput
        value={value}
        error={fieldErrors[variableFieldErrorKey(row.id, 'variable_name')]}
        placeholder={PLACEHOLDER_NAME}
        onChange={(nextValue) => onChangeField(row.id, 'variable_name', nextValue)}
      />
    ),
  },
  {
    title: COL_DEFAULT,
    dataIndex: 'default_value',
    render: (value, row) => (
      <Input
        className="admin-variable-input"
        value={value || ''}
        placeholder={PLACEHOLDER_VALUE}
        onChange={(event) => onChangeField(row.id, 'default_value', event.target.value)}
      />
    ),
  },
  {
    title: COL_ACTION,
    align: 'right',
    width: 180,
    render: (_, row) => (
      <Space size={4} wrap={false} className="admin-table-actions">
        <AdminActionButton
          action="save"
          label={SAVE_LABEL}
          iconOnly
          loading={Boolean(savingIds[row.id])}
          onClick={() => onSave(row)}
        />
        <AdminActionButton
          action="delete"
          iconOnly
          onClick={() => onDelete(row.id)}
        />
      </Space>
    ),
  },
];

export const SYSTEM_COLUMNS = [
  {
    title: COL_NO,
    width: 70,
    align: 'center',
    render: (_, __, index) => index + 1,
  },
  {
    title: COL_NAME,
    dataIndex: 'name',
    width: 220,
    render: (name) => (
      <Typography.Text code className="admin-variable-system-name">
        {name}
      </Typography.Text>
    ),
  },
  {
    title: COL_NOTE,
    dataIndex: 'description',
    render: (description) => (
      <Typography.Text type="secondary">{description}</Typography.Text>
    ),
  },
];
