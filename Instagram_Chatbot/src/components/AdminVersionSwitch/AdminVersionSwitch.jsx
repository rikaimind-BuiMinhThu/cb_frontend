import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button as AntButton } from 'antd';
import { Button as ReactstrapButton } from 'reactstrap';
import {
  getAdminVersionSwitchLabel,
  getAlternateAdminDashboard,
} from 'utils/adminVersionSwitch';

function AdminVersionSwitch({ variant = 'antd' }) {
  const location = useLocation();
  const label = getAdminVersionSwitchLabel(location.pathname);

  const handleSwitch = () => {
    window.location.href = getAlternateAdminDashboard(location.pathname);
  };

  if (variant === 'reactstrap') {
    return (
      <ReactstrapButton
        className="admin-version-switch"
        color="info"
        outline
        size="sm"
        onClick={handleSwitch}
      >
        {label}
      </ReactstrapButton>
    );
  }

  return (
    <AntButton className="admin-version-switch" onClick={handleSwitch}>
      {label}
    </AntButton>
  );
}

export default AdminVersionSwitch;
