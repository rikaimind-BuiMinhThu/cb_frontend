import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../Sidebar/logoEC.jpg';
import {
  filterMenuByRole,
  getBotMenuItems,
  getGlobalMenuItems,
  isBotMenuRoute,
  resolveMenuPath,
} from './adminMenuConfig';
import { getAdminRoutePath } from 'v2/variables/constants';

const { Sider } = Layout;

function flattenPaths(items, paths = []) {
  items.forEach((item) => {
    if (item.path) paths.push(item.path);
    if (item.children) flattenPaths(item.children, paths);
  });
  return paths;
}

function buildMenuItems(items) {
  return items.map((item) => {
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
}

function findSelectedKey(pathname, paths) {
  const match = paths
    .filter((p) => pathname === p || pathname.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match || pathname;
}

function AdminSidebar({ collapsed, onCollapse }) {
  const location = useLocation();
  const [botId, setBotId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [botType, setBotType] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    setBotId(Cookies.get('bot_id') || '');
    setUserRole(Cookies.get('user_role') || '');
    setBotType(Cookies.get('bot_type') || '');
    try {
      setClient(JSON.parse(localStorage.getItem('client')));
    } catch {
      setClient(null);
    }
  }, [location.pathname]);

  const menuSource = useMemo(() => {
    if (botType === 'bot' || isBotMenuRoute(location.pathname)) {
      return getBotMenuItems(botId);
    }
    return filterMenuByRole(getGlobalMenuItems(client), userRole);
  }, [botType, botId, client, userRole, location.pathname]);

  const menuItems = useMemo(() => buildMenuItems(menuSource), [menuSource]);
  const allPaths = useMemo(() => flattenPaths(menuSource), [menuSource]);
  const menuPath = resolveMenuPath(location.pathname);
  const selectedKey = findSelectedKey(menuPath, allPaths);

  const openKeysFromPath = useMemo(() => {
    const keys = [];
    const findParents = (items, parents = []) => {
      items.forEach((item) => {
        const current = [...parents, item.key];
        if (item.path === selectedKey) {
          keys.push(...parents);
        }
        if (item.children) findParents(item.children, current);
      });
    };
    findParents(menuSource);
    return [...new Set(keys)];
  }, [menuSource, selectedKey]);

  const [openKeys, setOpenKeys] = useState(openKeysFromPath);

  useEffect(() => {
    setOpenKeys(openKeysFromPath);
  }, [openKeysFromPath]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      className="admin-sider"
      theme="light"
    >
      <div className="admin-sider-logo">
        <Link to={getAdminRoutePath('/dashboard')} onClick={() => Cookies.remove('bot_type')}>
          <img src={logo} alt="EC Chatbot" />
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
        style={{ borderRight: 0, padding: '8px 0' }}
      />
    </Sider>
  );
}

export default AdminSidebar;
