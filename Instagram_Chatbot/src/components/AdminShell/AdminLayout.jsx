import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import jaJP from 'antd/es/locale/ja_JP';
import { Route, Switch, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminHeaderTitleProvider } from './AdminHeaderTitleContext';
import { AdminHeaderActionsProvider } from './AdminHeaderActionsContext';
import AdminRouteTitleSync from './AdminRouteTitleSync';
import routes from '../../routes';
import PushMessage from '../../views/BotSettings/PushMessage/PushMessagePage';
import ListSmsTemplate from '../../views/BotSettings/SmsTemplate/ListSmsTemplate';
import { adminConfigProviderProps } from '../../theme/adminTheme';
import '../../assets/css/admin/admin-shell.css';

const { Content } = Layout;

function AdminLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const mainPanelRef = React.useRef();

  React.useEffect(() => {
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    const pathname = location?.pathname;
    let client = null;
    try {
      client = JSON.parse(localStorage.getItem('client'));
    } catch {
      client = null;
    }
    const isInstagram = client?.is_instagram;
    const isWeb = client?.is_web;
    const instagramRolesUrl = [
      '/admin/chatbot',
      '/admin/keyword',
      '/admin/release',
      '/admin/data',
      '/admin/data-analyst',
      '/admin/list-user',
      '/admin/attracted-customer',
      '/admin/crm',
    ];
    const webRolesUrl = [
      '/admin/bot',
      '/admin/account-information',
      '/admin/basic-setting',
      '/admin/reply-mail-management',
      '/admin/scenario-template-list',
      '/admin/scenario-template-setting',
    ];
    if (
      (!isInstagram && instagramRolesUrl.includes(pathname)) ||
      (!isWeb && webRolesUrl.includes(pathname))
    ) {
      window.location.href = '/admin/dashboard';
    }
  }, [location]);

  return (
    <ConfigProvider locale={jaJP} {...adminConfigProviderProps}>
      <AdminHeaderTitleProvider>
        <AdminHeaderActionsProvider>
          <AdminRouteTitleSync />
          <Layout className="admin-layout">
            <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout>
              <AdminHeader collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
              <Content className="admin-content main-panel" ref={mainPanelRef}>
              <Switch>
                {routes.map((route, key) => (
                  <Route
                    path={route.layout + route.path}
                    component={route.component}
                    key={key}
                  />
                ))}
                <Route
                  path="/admin/bot-settings/:botId/sms-template"
                  component={ListSmsTemplate}
                />
                <Route
                  path="/admin/bot-settings/:botId/push-message"
                  component={PushMessage}
                />
              </Switch>
              </Content>
            </Layout>
          </Layout>
        </AdminHeaderActionsProvider>
      </AdminHeaderTitleProvider>
    </ConfigProvider>
  );
}

export default AdminLayout;
