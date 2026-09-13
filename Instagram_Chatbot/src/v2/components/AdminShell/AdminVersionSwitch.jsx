import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';
import {
  getAdminVersionSwitchLabel,
  getAlternateAdminDashboard,
} from 'v2/utils/adminVersionSwitch';

const AdminVersionSwitch = () => {
  const location = useLocation();
  const label = getAdminVersionSwitchLabel(location.pathname);

  const handleSwitch = () => {
    window.location.href = getAlternateAdminDashboard(location.pathname);
  };

  return (
    <Button className="admin-version-switch" onClick={handleSwitch}>
      {label}
    </Button>
  );
};

export default AdminVersionSwitch;
