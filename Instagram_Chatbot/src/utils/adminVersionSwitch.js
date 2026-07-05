export const ADMIN_V1_DASHBOARD = '/admin/dashboard';
export const ADMIN_V2_DASHBOARD = '/v2/admin/dashboard';

export const ADMIN_VERSION_SWITCH_LABELS = {
  toV1: 'V1管理画面へ切り替え',
  toV2: 'V2管理画面へ切り替え',
};

export function getAdminVersion(pathname = window.location.pathname) {
  return pathname.startsWith('/v2/admin') ? 'v2' : 'v1';
}

export function getAlternateAdminDashboard(pathname = window.location.pathname) {
  return getAdminVersion(pathname) === 'v2' ? ADMIN_V1_DASHBOARD : ADMIN_V2_DASHBOARD;
}

export function getAdminVersionSwitchLabel(pathname = window.location.pathname) {
  return getAdminVersion(pathname) === 'v2'
    ? ADMIN_VERSION_SWITCH_LABELS.toV1
    : ADMIN_VERSION_SWITCH_LABELS.toV2;
}
