import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  DollarOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const ACTION_CONFIG = {
  create: {
    label: '作成',
    type: 'primary',
    icon: <PlusOutlined />,
  },
  upload: {
    label: 'ファイル追加',
    type: 'primary',
    icon: <UploadOutlined />,
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
  copy: {
    label: 'コピー',
    type: 'link',
    size: 'small',
    icon: <CopyOutlined />,
  },
  back: {
    label: '戻る',
    type: 'default',
    icon: null,
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
  payment: {
    label: '決済',
    type: 'link',
    size: 'small',
    icon: <DollarOutlined />,
  },
  search: {
    label: '検索',
    type: 'primary',
    icon: <SearchOutlined />,
  },
  download: {
    label: 'ダウンロード',
    type: 'primary',
    icon: <DownloadOutlined />,
  },
};

function AdminActionButton({ action, label, className, icon: _ignoredIcon, ...rest }) {
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
  icon: PropTypes.node,
};

export default AdminActionButton;
