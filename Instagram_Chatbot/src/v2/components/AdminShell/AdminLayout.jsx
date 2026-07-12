import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import jaJP from 'antd/es/locale/ja_JP';
import { Route, Switch, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminHeaderTitleProvider } from './AdminHeaderTitleContext';
import { AdminHeaderActionsProvider } from './AdminHeaderActionsContext';
import AdminRouteTitleSync from './AdminRouteTitleSync';
import routes from '../../routes';
import PushMessage from '../../views/BotSettings/PushMessage/PushMessagePage';
import ListSmsTemplate from '../../views/BotSettings/SmsTemplate/ListSmsTemplate';
import { adminConfigProviderProps } from '../../theme/adminTheme';
import { getAdminRoutePath, getDefaultLandingPath } from 'v2/variables/constants';
import Cookies from 'js-cookie';
import 'v2/assets/css/admin/admin-shell.css';

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
    const userRole = Cookies.get('user_role') || '';
    const landingPath = getDefaultLandingPath(userRole, client);
    const dashboardPath = getAdminRoutePath('/dashboard');

    if (pathname === dashboardPath && userRole !== 'admin_deel') {
      if (landingPath !== dashboardPath) {
        window.location.href = landingPath;
      }
      return;
    }

    const isInstagram = client?.is_instagram;
    const isWeb = client?.is_web;
    const instagramRolesUrl = [
      getAdminRoutePath('/chatbot'),
      getAdminRoutePath('/keyword'),
      getAdminRoutePath('/release'),
      getAdminRoutePath('/data'),
      getAdminRoutePath('/data-analyst'),
      getAdminRoutePath('/list-user'),
      getAdminRoutePath('/attracted-customer'),
      getAdminRoutePath('/crm'),
    ];
    const webRolesUrl = [
      getAdminRoutePath('/bot'),
      getAdminRoutePath('/account-information'),
      getAdminRoutePath('/basic-setting'),
      getAdminRoutePath('/reply-mail-management'),
      getAdminRoutePath('/scenario-template-list'),
      getAdminRoutePath('/scenario-template-setting'),
      getAdminRoutePath('/order-confirm-template-list'),
      getAdminRoutePath('/order-confirm-template-setting'),
    ];
    if (
      (!isInstagram && instagramRolesUrl.includes(pathname)) ||
      (!isWeb && webRolesUrl.includes(pathname))
    ) {
      window.location.href = landingPath;
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
                  path={getAdminRoutePath('/bot-settings/:botId/sms-template')}
                  component={ListSmsTemplate}
                />
                <Route
                  path={getAdminRoutePath('/bot-settings/:botId/push-message')}
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
