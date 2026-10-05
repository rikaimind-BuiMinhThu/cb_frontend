import React from 'react';
import { Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useAdminHeaderTitleContext } from './AdminHeaderTitleContext';
import { useAdminHeaderActionsContext } from './AdminHeaderActionsContext';

const { Header } = Layout;

function AdminHeader({ collapsed, onToggleCollapse }) {
  const { title } = useAdminHeaderTitleContext();
  const { actions } = useAdminHeaderActionsContext();

  const logout = () => {
    Cookies.set('is_auth', 'false');
    Cookies.remove('token', '/');
    Cookies.remove('user_role');
    Cookies.remove('user_id');
    Cookies.remove('page_access_token');
    Cookies.remove('scenario_id');
    Cookies.remove('refreshToken');
    Cookies.remove('bot_type');
    Cookies.remove('bot_id');
    window.location.href = '/';
  };

  return (
    <Header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
        />
        {title && <h1 className="admin-header-title">{title}</h1>}
      </div>
      <div className="admin-header-right">
        {actions && <div className="admin-header-actions">{actions}</div>}
        <Button type="default" icon={<LogoutOutlined />} onClick={logout}>
          ログアウト
        </Button>
      </div>
    </Header>
  );
}

export default AdminHeader;
