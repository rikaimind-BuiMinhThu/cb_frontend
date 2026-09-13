import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import {
  ArrowLeftOutlined,
  CloseOutlined,
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
import {
  ACTION_BACK,
  ACTION_CANCEL,
  ACTION_COPY,
  ACTION_CREATE,
  ACTION_DELETE,
  ACTION_DOWNLOAD,
  ACTION_DUPLICATE,
  ACTION_EDIT,
  ACTION_LABELS,
  ACTION_PAYMENT,
  ACTION_PREVIEW,
  ACTION_SAVE,
  ACTION_SEARCH,
  ACTION_UPLOAD,
  BUTTON_SIZE_SMALL,
  BUTTON_TYPE_DEFAULT,
  BUTTON_TYPE_LINK,
  BUTTON_TYPE_PRIMARY,
} from './constants';

const ACTION_CONFIG = {
  [ACTION_CREATE]: {
    label: ACTION_LABELS[ACTION_CREATE],
    type: BUTTON_TYPE_PRIMARY,
    icon: <PlusOutlined />,
  },
  [ACTION_UPLOAD]: {
    label: ACTION_LABELS[ACTION_UPLOAD],
    type: BUTTON_TYPE_PRIMARY,
    icon: <UploadOutlined />,
  },
  [ACTION_SAVE]: {
    label: ACTION_LABELS[ACTION_SAVE],
    type: BUTTON_TYPE_PRIMARY,
    icon: <SaveOutlined />,
  },
  [ACTION_EDIT]: {
    label: ACTION_LABELS[ACTION_EDIT],
    type: BUTTON_TYPE_LINK,
    size: BUTTON_SIZE_SMALL,
    icon: <EditOutlined />,
  },
  [ACTION_PREVIEW]: {
    label: ACTION_LABELS[ACTION_PREVIEW],
    type: BUTTON_TYPE_LINK,
    size: BUTTON_SIZE_SMALL,
    icon: <EyeOutlined />,
  },
  [ACTION_DUPLICATE]: {
    label: ACTION_LABELS[ACTION_DUPLICATE],
    type: BUTTON_TYPE_LINK,
    size: BUTTON_SIZE_SMALL,
    icon: <CopyOutlined />,
  },
  [ACTION_COPY]: {
    label: ACTION_LABELS[ACTION_COPY],
    type: BUTTON_TYPE_LINK,
    size: BUTTON_SIZE_SMALL,
    icon: <CopyOutlined />,
  },
  [ACTION_BACK]: {
    label: ACTION_LABELS[ACTION_BACK],
    type: BUTTON_TYPE_DEFAULT,
    icon: <ArrowLeftOutlined />,
  },
  [ACTION_CANCEL]: {
    label: ACTION_LABELS[ACTION_CANCEL],
    type: BUTTON_TYPE_DEFAULT,
    icon: <CloseOutlined />,
  },
  [ACTION_DELETE]: {
    label: ACTION_LABELS[ACTION_DELETE],
    type: BUTTON_TYPE_LINK,
    size: BUTTON_SIZE_SMALL,
    danger: true,
    icon: <DeleteOutlined />,
  },
  [ACTION_PAYMENT]: {
    label: ACTION_LABELS[ACTION_PAYMENT],
    type: BUTTON_TYPE_LINK,
    size: BUTTON_SIZE_SMALL,
    icon: <DollarOutlined />,
  },
  [ACTION_SEARCH]: {
    label: ACTION_LABELS[ACTION_SEARCH],
    type: BUTTON_TYPE_PRIMARY,
    icon: <SearchOutlined />,
  },
  [ACTION_DOWNLOAD]: {
    label: ACTION_LABELS[ACTION_DOWNLOAD],
    type: BUTTON_TYPE_PRIMARY,
    icon: <DownloadOutlined />,
  },
};

const AdminActionButton = ({
  action,
  label,
  className,
  icon: _ignoredIcon,
  iconOnly = false,
  ...rest
}) => {
  const config = ACTION_CONFIG[action];

  if (!config) {
    return null;
  }

  const resolvedLabel = label || config.label;
  const classes = [className, iconOnly && 'admin-action-button--icon-only']
    .filter(Boolean)
    .join(' ');

  const button = (
    <Button
      type={config.type}
      size={config.size}
      danger={config.danger}
      icon={config.icon}
      className={classes}
      aria-label={iconOnly ? resolvedLabel : undefined}
      {...rest}
    >
      {iconOnly ? null : resolvedLabel}
    </Button>
  );

  if (iconOnly) {
    return <Tooltip title={resolvedLabel}>{button}</Tooltip>;
  }

  return button;
};

AdminActionButton.propTypes = {
  action: PropTypes.oneOf(Object.keys(ACTION_CONFIG)).isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconOnly: PropTypes.bool,
};

export default AdminActionButton;
