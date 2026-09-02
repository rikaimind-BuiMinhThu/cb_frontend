import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BOT_ID_COOKIE_KEY, BOT_TYPE_BOT, BOT_TYPE_COOKIE_KEY, USER_ROLE_COOKIE_KEY } from 'v2/api/constants';
import { getDefaultLandingPath } from 'v2/variables/constants';
import logo from 'v2/assets/img/ecchatbot-logo.png';
import {
  filterMenuByRole,
  getBotMenuItems,
  getGlobalMenuItems,
  isBotMenuRoute,
  resolveMenuPath,
} from './adminMenuConfig';
import {
  EMPTY_VALUE,
  LOGO_ALT,
  MENU_MODE_INLINE,
  parseStoredClient,
  SIDER_THEME_LIGHT,
  SIDER_WIDTH,
} from './constants';

const { Sider } = Layout;

const flattenPaths = (items) => items.reduce((paths, item) => {
  const next = item.path ? [...paths, item.path] : paths;
  return item.children ? [...next, ...flattenPaths(item.children)] : next;
}, []);

const buildMenuItems = (items) => items.map((item) => {
  if (item.children) {
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: buildMenuItems(item.children),
    };
  }
  return {
    key: item.key || item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.label}</Link>,
  };
});

const findSelectedKey = (pathname, paths) => {
  const match = paths
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((left, right) => right.length - left.length)[0];
  return match || pathname;
};

const collectOpenKeys = (items, selectedKey, parents = []) =>
  items.reduce((keys, item) => {
    const current = [...parents, item.key];
    const withMatch = item.path === selectedKey ? [...keys, ...parents] : keys;
    return item.children
      ? [...withMatch, ...collectOpenKeys(item.children, selectedKey, current)]
      : withMatch;
  }, []);

const AdminSidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const [botId, setBotId] = useState(EMPTY_VALUE);
  const [userRole, setUserRole] = useState(EMPTY_VALUE);
  const [botType, setBotType] = useState(EMPTY_VALUE);
  const [client, setClient] = useState(null);

  useEffect(() => {
    setBotId(Cookies.get(BOT_ID_COOKIE_KEY) || EMPTY_VALUE);
    setUserRole(Cookies.get(USER_ROLE_COOKIE_KEY) || EMPTY_VALUE);
    setBotType(Cookies.get(BOT_TYPE_COOKIE_KEY) || EMPTY_VALUE);
    setClient(parseStoredClient());
  }, [location.pathname]);

  const menuSource = useMemo(() => {
    if (botType === BOT_TYPE_BOT || isBotMenuRoute(location.pathname)) {
      return getBotMenuItems(botId);
    }
    return filterMenuByRole(getGlobalMenuItems(client), userRole);
  }, [botType, botId, client, userRole, location.pathname]);

  const menuItems = useMemo(() => buildMenuItems(menuSource), [menuSource]);
  const allPaths = useMemo(() => flattenPaths(menuSource), [menuSource]);
  const menuPath = resolveMenuPath(location.pathname);
  const selectedKey = findSelectedKey(menuPath, allPaths);
  const landingPath = useMemo(
    () => getDefaultLandingPath(userRole, client),
    [userRole, client],
  );

  const openKeysFromPath = useMemo(
    () => [...new Set(collectOpenKeys(menuSource, selectedKey))],
    [menuSource, selectedKey],
  );

  const [openKeys, setOpenKeys] = useState(openKeysFromPath);

  useEffect(() => {
    setOpenKeys(openKeysFromPath);
  }, [openKeysFromPath]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={SIDER_WIDTH}
      className="admin-sider"
      theme={SIDER_THEME_LIGHT}
    >
      <div className="admin-sider-logo">
        <Link to={landingPath} onClick={() => Cookies.remove(BOT_TYPE_COOKIE_KEY)}>
          <img src={logo} alt={LOGO_ALT} />
        </Link>
      </div>
      <Menu
        mode={MENU_MODE_INLINE}
        selectedKeys={[selectedKey]}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
        className="admin-sider-menu"
      />
    </Sider>
  );
};

AdminSidebar.propTypes = {
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
};

export default AdminSidebar;
