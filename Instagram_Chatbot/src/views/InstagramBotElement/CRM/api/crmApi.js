import api from '../../../../api/api-management';
import { PAGE_SIZE } from '../constants';

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  return search.toString();
}

export function normalizePage(currentPage, total) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return Math.min(currentPage, totalPages);
}

export async function fetchCrmUsers({
  page,
  instagramUserName,
  clientName,
  supportingUsers,
}) {
  const query = buildQuery({
    page,
    instagram_user_name: instagramUserName,
    client_name: clientName,
    supporting_users: supportingUsers,
  });

  const response = await api.get(`/api/v1/managements/instagram_users?${query}`);
  return {
    items: response.data?.data?.instagram_users || [],
    total: response.data?.total || 0,
  };
}

export async function fetchCrmUserDetail(id) {
  const response = await api.get(`/api/v1/managements/instagram_users/${id}`);
  const data = response.data?.data || {};
  return {
    user: data.instagram_users,
    labels: data.labels || [],
    customItems: data.custom_items || [],
    messageHistories: data.message_histories || [],
    needSupport: data.need_support,
  };
}

export async function updateUserStatus(id, status) {
  const response = await api.patch(`/api/v1/managements/instagram_users/${id}`, {
    instagram_user: { status },
  });
  return response.data;
}

export async function createLabel({ name, instagramUserId }) {
  const response = await api.post('/api/v1/instagram_users/labels', {
    label: { name, instagram_user_id: instagramUserId },
  });
  return response.data;
}

export async function deleteLabel(id) {
  const response = await api.delete(`/api/v1/instagram_users/labels/${id}`);
  return response.data;
}

export async function createCustomItem({ title, value, instagramUserId }) {
  const response = await api.post('/api/v1/instagram_users/custom_items', {
    custom_item: { title, value, instagram_user_id: instagramUserId },
  });
  return response.data;
}

export async function deleteCustomItem(id) {
  const response = await api.delete(`/api/v1/instagram_users/custom_items/${id}`);
  return response.data;
}

export async function disableSupportingUser(id) {
  const response = await api.delete(`/api/v1/instagram_users/supporting_users/${id}`);
  return response.data;
}
