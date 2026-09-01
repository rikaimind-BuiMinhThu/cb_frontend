import api from '../../../../api/api-management';
import { tokenExpired } from '../../../../api/tokenExpired';

function handleError(error) {
  if (error.response?.data?.code === 0) {
    tokenExpired();
  }
  throw error;
}

function unwrap(response) {
  if (response.data?.code === 2) {
    const err = new Error(response.data.message || 'Request failed');
    err.metaError = response.data.meta_error;
    err.grantedScopes = response.data.granted_scopes;
    throw err;
  }
  return response.data;
}

export async function fetchInstagramSettings() {
  const res = await api.get('/api/v1/instagram_settings').catch(handleError);
  return res.data.data || [];
}

export async function fetchInstagramProfile() {
  const res = await api.get('/api/v1/instagram_settings/profile').catch(handleError);
  return unwrap(res).data;
}

export async function connectInstagram(data) {
  const res = await api.post('/api/v1/instagram_connect', data).catch(handleError);
  return unwrap(res);
}

export async function logoutInstagram(igId) {
  const res = await api.post('/api/v1/logout_fb', { ig_id: igId }).catch(handleError);
  return unwrap(res);
}

export async function updateInstagramSetting(id, payload) {
  const res = await api.patch(`/api/v1/instagram_settings/${id}`, payload).catch(handleError);
  return unwrap(res);
}

export async function changeInstagramSettingStatus(id, payload) {
  const res = await api.patch(`/api/v1/instagram_setting_change_status/${id}`, payload).catch(handleError);
  return unwrap(res);
}

export async function fetchMessageGroups() {
  const res = await api.get('/api/v1/message_managements/message_groups?page=1').catch(handleError);
  return res.data.data || [];
}

export async function fetchMessageGroup(id) {
  const res = await api.get(`/api/v1/message_managements/message_groups/${id}`).catch(handleError);
  return res.data.data;
}

export async function fetchKeywordSettings() {
  const res = await api.get('/api/v1/message_managements/keyword_settings').catch(handleError);
  return res.data.data || [];
}

export async function updateKeywordSetting(id, payload) {
  const res = await api.patch(`/api/v1/message_managements/keyword_settings/${id}`, payload).catch(handleError);
  return unwrap(res);
}

export async function fetchIceBreakers() {
  const res = await api.get('/api/v1/message_managements/ice_breakers').catch(handleError);
  return res.data.data || [];
}

export async function createIceBreaker(payload) {
  const res = await api.post('/api/v1/message_managements/ice_breakers', payload).catch(handleError);
  return unwrap(res);
}

export async function updateIceBreaker(id, payload) {
  const res = await api.patch(`/api/v1/message_managements/ice_breakers/${id}`, payload).catch(handleError);
  return unwrap(res);
}

export async function deleteIceBreaker(id) {
  const res = await api.delete(`/api/v1/message_managements/ice_breakers/${id}`).catch(handleError);
  return unwrap(res);
}

export async function fetchIceBreakersStatus(igId) {
  const res = await api.get(`/api/v1/message_managements/ice_breakers_status?ig_id=${igId}`).catch(handleError);
  return res.data;
}

export async function turnOnIceBreakers(igId) {
  const res = await api.get(`/api/v1/message_managements/ice_breakers_turn_on?ig_id=${igId}`).catch(handleError);
  return unwrap(res);
}

export async function turnOffIceBreakers(igId) {
  const res = await api.get(`/api/v1/message_managements/ice_breakers_turn_off?ig_id=${igId}`).catch(handleError);
  return unwrap(res);
}

export async function fetchPersistentMenus() {
  const res = await api.get('/api/v1/message_managements/persistent_menus').catch(handleError);
  return res.data.data || [];
}

export async function createPersistentMenu(payload) {
  const res = await api.post('/api/v1/message_managements/persistent_menus', payload).catch(handleError);
  return unwrap(res);
}

export async function updatePersistentMenu(id, payload) {
  const res = await api.patch(`/api/v1/message_managements/persistent_menus/${id}`, payload).catch(handleError);
  return unwrap(res);
}

export async function deletePersistentMenu(id) {
  const res = await api.delete(`/api/v1/message_managements/persistent_menus/${id}`).catch(handleError);
  return unwrap(res);
}

export async function fetchPersistentMenusStatus(igId) {
  const res = await api.get(`/api/v1/message_managements/persistent_menus_status?ig_id=${igId}`).catch(handleError);
  return res.data;
}

export async function turnOnPersistentMenus(igId) {
  const res = await api.get(`/api/v1/message_managements/persistent_menus_turn_on?ig_id=${igId}`).catch(handleError);
  return unwrap(res);
}

export async function turnOffPersistentMenus(igId) {
  const res = await api.get(`/api/v1/message_managements/persistent_menus_turn_off?ig_id=${igId}`).catch(handleError);
  return unwrap(res);
}
