import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const ACTION_CONFIG = {
  create: {
    label: '作成',
    type: 'primary',
    icon: <PlusOutlined />,
  },
  save: {
    label: '保存',
    type: 'primary',
    icon: <SaveOutlined />,
  },
  edit: {
    label: '編集',
    type: 'link',
    size: 'small',
    icon: <EditOutlined />,
  },
  preview: {
    label: 'プレビュー',
    type: 'link',
    size: 'small',
    icon: <EyeOutlined />,
  },
  duplicate: {
    label: '複製',
    type: 'link',
    size: 'small',
    icon: <CopyOutlined />,
  },
  cancel: {
    label: 'キャンセル',
    type: 'default',
    icon: null,
  },
  delete: {
    label: '削除',
    type: 'link',
    size: 'small',
    danger: true,
    icon: <DeleteOutlined />,
  },
};

function AdminActionButton({ action, label, className, ...rest }) {
  const config = ACTION_CONFIG[action];

  if (!config) {
    return null;
  }

  return (
    <Button
      type={config.type}
      size={config.size}
      danger={config.danger}
      icon={config.icon}
      className={className}
      {...rest}
    >
      {label ?? config.label}
    </Button>
  );
}

AdminActionButton.propTypes = {
  action: PropTypes.oneOf(Object.keys(ACTION_CONFIG)).isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default AdminActionButton;
