import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';
import Cookies from 'js-cookie';
import { BOT_TYPE_COOKIE_KEY } from 'v2/api/constants';
import {
  getAdminVersionSwitchLabel,
  getAlternateAdminDashboard,
} from 'v2/utils/adminVersionSwitch';

const AdminVersionSwitch = () => {
  const location = useLocation();
  const label = getAdminVersionSwitchLabel(location.pathname);

  const handleSwitch = () => {
    Cookies.remove(BOT_TYPE_COOKIE_KEY);
    window.location.href = getAlternateAdminDashboard(location.pathname);
  };

  return (
    <Button className="admin-version-switch" onClick={handleSwitch}>
      {label}
    </Button>
  );
};

export default AdminVersionSwitch;
