import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import AdminVersionSwitch from 'components/AdminVersionSwitch/AdminVersionSwitch';
import { tokenExpired } from 'v2/api/tokenExpired';
import { useAdminHeaderActionsContext } from './AdminHeaderActionsContext';
import { useAdminHeaderTitleContext } from './AdminHeaderTitleContext';
import {
  ADMIN_VERSION_SWITCH_VARIANT,
  BUTTON_TYPE_DEFAULT,
  BUTTON_TYPE_TEXT,
  LOGOUT_LABEL,
  TOGGLE_SIDEBAR_ARIA_LABEL,
} from './constants';

const { Header } = Layout;

const AdminHeader = ({ collapsed, onToggleCollapse }) => {
  const { title } = useAdminHeaderTitleContext();
  const { actions } = useAdminHeaderActionsContext();

  return (
    <Header className="admin-header">
      <div className="admin-header-left">
        <Button
          type={BUTTON_TYPE_TEXT}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          aria-label={TOGGLE_SIDEBAR_ARIA_LABEL}
        />
        {title && <h1 className="admin-header-title">{title}</h1>}
      </div>
      <div className="admin-header-right">
        {actions && <div className="admin-header-actions">{actions}</div>}
        <AdminVersionSwitch variant={ADMIN_VERSION_SWITCH_VARIANT} />
        <Button type={BUTTON_TYPE_DEFAULT} icon={<LogoutOutlined />} onClick={tokenExpired}>
          {LOGOUT_LABEL}
        </Button>
      </div>
    </Header>
  );
};

AdminHeader.propTypes = {
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
};

export default AdminHeader;
