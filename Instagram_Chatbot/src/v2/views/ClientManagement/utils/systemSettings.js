import api from 'v2/api/api-management';
import { SYSTEM_SETTINGS_API_PATH } from '../constants';

export const getSystemSettings = () => api.get(SYSTEM_SETTINGS_API_PATH);

export const patchSystemSetting = (payload) =>
  api.patch(SYSTEM_SETTINGS_API_PATH, payload);
