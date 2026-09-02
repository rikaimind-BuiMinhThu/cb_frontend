import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import jaJP from 'antd/es/locale/ja_JP';
import Cookies from 'js-cookie';
import { Route, Switch, useLocation } from 'react-router-dom';
import { getToken } from 'v2/api/auth';
import { AUTH_FALSE_VALUE, IS_AUTH_COOKIE_KEY, USER_ROLE_COOKIE_KEY } from 'v2/api/constants';
import { getAdminRoutePath, getDefaultLandingPath, getSignInPath } from 'v2/variables/constants';
import routes from '../../routes';
import { adminConfigProviderProps } from '../../theme/adminTheme';
import ListSmsTemplate from '../../views/BotSettings/SmsTemplate/ListSmsTemplate';
import PushMessage from '../../views/BotSettings/PushMessage/PushMessagePage';
import AdminHeader from './AdminHeader';
import { AdminHeaderActionsProvider } from './AdminHeaderActionsContext';
import { AdminHeaderTitleProvider } from './AdminHeaderTitleContext';
import AdminRouteTitleSync from './AdminRouteTitleSync';
import AdminSidebar from './AdminSidebar';
import {
  ADMIN_PATHS,
  EMPTY_VALUE,
  INSTAGRAM_ROLE_PATHS,
  parseStoredClient,
  PUSH_MESSAGE_ROUTE,
  SMS_TEMPLATE_ROUTE,
  USER_ROLE_ADMIN_DEEL,
  WEB_ROLE_PATHS,
} from './constants';
import 'v2/assets/css/admin/admin-shell.css';

const { Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const mainPanelRef = useRef();
  const token = getToken();
  const isAuthenticated = Boolean(token) && Cookies.get(IS_AUTH_COOKIE_KEY) !== AUTH_FALSE_VALUE;

  useEffect(() => {
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    const currentToken = getToken();
    if (!currentToken || Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
      return;
    }
    const pathname = location?.pathname;
    const client = parseStoredClient();
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY) || EMPTY_VALUE;
    const landingPath = getDefaultLandingPath(userRole, client);
    const dashboardPath = getAdminRoutePath(ADMIN_PATHS.DASHBOARD);

    if (pathname === dashboardPath && userRole !== USER_ROLE_ADMIN_DEEL) {
      if (landingPath !== dashboardPath) {
        window.location.href = landingPath;
      }
      return;
    }

    const isInstagram = client?.is_instagram;
    const isWeb = client?.is_web;
    const instagramRolesUrl = INSTAGRAM_ROLE_PATHS.map(getAdminRoutePath);
    const webRolesUrl = WEB_ROLE_PATHS.map(getAdminRoutePath);
    if (
      (!isInstagram && instagramRolesUrl.includes(pathname)) ||
      (!isWeb && webRolesUrl.includes(pathname))
    ) {
      window.location.href = landingPath;
    }
  }, [location]);

  if (!isAuthenticated) {
    window.location.href = getSignInPath();
    return null;
  }

  return (
    <ConfigProvider locale={jaJP} {...adminConfigProviderProps}>
      <AdminHeaderTitleProvider>
        <AdminHeaderActionsProvider>
          <AdminRouteTitleSync />
          <Layout className="admin-layout">
            <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout>
              <AdminHeader
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
              />
              <Content className="admin-content main-panel" ref={mainPanelRef}>
                <Switch>
                  {routes.map((route) => (
                    <Route
                      path={`${route.layout}${route.path}`}
                      component={route.component}
                      key={`${route.layout}${route.path}`}
                    />
                  ))}
                  <Route
                    path={getAdminRoutePath(SMS_TEMPLATE_ROUTE)}
                    component={ListSmsTemplate}
                  />
                  <Route
                    path={getAdminRoutePath(PUSH_MESSAGE_ROUTE)}
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
};

export default AdminLayout;
