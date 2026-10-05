export const ADMIN_V1_DASHBOARD = '/admin/dashboard';
export const ADMIN_V2_DASHBOARD = '/v2/admin/dashboard';
export const V2_ADMIN_PREFIX = '/v2/admin';
export const VERSION_V1 = 'v1';
export const VERSION_V2 = 'v2';
export const VARIANT_ANTD = 'antd';

export const ADMIN_VERSION_SWITCH_LABELS = {
  toV1: 'V1管理画面へ切り替え',
  toV2: 'V2管理画面へ切り替え',
};

export const getAdminVersion = (pathname = window.location.pathname) => (
  pathname.startsWith(V2_ADMIN_PREFIX) ? VERSION_V2 : VERSION_V1
);

export const getAlternateAdminDashboard = (pathname = window.location.pathname) => (
  getAdminVersion(pathname) === VERSION_V2 ? ADMIN_V1_DASHBOARD : ADMIN_V2_DASHBOARD
);

export const getAdminVersionSwitchLabel = (pathname = window.location.pathname) => (
  getAdminVersion(pathname) === VERSION_V2
    ? ADMIN_VERSION_SWITCH_LABELS.toV1
    : ADMIN_VERSION_SWITCH_LABELS.toV2
);
