import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../api/api-management';
import { tokenExpired } from '../../../../api/tokenExpired';

function handleError(error) {
  if (error.response?.data?.code === 0) {
    tokenExpired();
  }
  throw error;
}

export async function ensureInstagramSettings() {
  const accessToken = Cookies.get('page_access_token');
  if (accessToken) return;

  const res = await api.get('/api/v1/instagram_settings').catch(handleError);
  const settings = res.data.data?.[0];
  if (settings) {
    Cookies.set('page_access_token', settings.page_access_token);
    Cookies.set('ig_id', settings.ig_id);
  }
}

export async function fetchMessageGroups(page = 1) {
  const res = await api
    .get(`/api/v1/message_managements/message_groups?page=${page}`)
    .catch(handleError);
  return { data: res.data.data || [], total: res.data.total || 0 };
}

export async function fetchMessageGroup(id) {
  const res = await api
    .get(`/api/v1/message_managements/message_groups/${id}`)
    .catch(handleError);
  return res.data.data;
}

export async function createMessageGroup(groupName) {
  const res = await api
    .post('/api/v1/message_managements/message_groups', {
      message_group: { group_name: groupName },
    })
    .catch(handleError);
  return res.data;
}

export async function updateMessageGroup(id, groupName) {
  const res = await api
    .patch(`/api/v1/message_managements/message_groups/${id}`, {
      message_group: { group_name: groupName },
    })
    .catch(handleError);
  return res.data;
}

export async function deleteMessageGroup(id) {
  const res = await api
    .delete(`/api/v1/message_managements/message_groups/${id}`)
    .catch(handleError);
  return res.data;
}

export async function copyMessageGroup(id) {
  const res = await api
    .post(`/api/v1/message_managements/message_groups/${id}/copy`)
    .catch(handleError);
  return res.data;
}

export async function createMessageBag(messageGroupId, bagName) {
  const res = await api
    .post('/api/v1/message_managements/message_bags', {
      message_bag: { message_group_id: messageGroupId, bag_name: bagName },
    })
    .catch(handleError);
  return res.data;
}

export async function updateMessageBag(id, bagName) {
  const res = await api
    .patch(`/api/v1/message_managements/message_bags/${id}`, {
      message_bag: { bag_name: bagName },
    })
    .catch(handleError);
  return res.data;
}

export async function deleteMessageBag(id) {
  const res = await api
    .delete(`/api/v1/message_managements/message_bags/${id}`)
    .catch(handleError);
  return res.data;
}

export async function copyMessageBag(id) {
  const res = await api
    .post(`/api/v1/message_managements/message_bags/${id}/copy`)
    .catch(handleError);
  return res.data;
}

export async function moveMessageBag(id, messageGroupId) {
  const res = await api
    .post(`/api/v1/message_managements/message_bags/${id}/move`, {
      message_group_id: messageGroupId,
    })
    .catch(handleError);
  return res.data;
}

export async function fetchMessageBag(id) {
  const res = await api
    .get(`/api/v1/message_managements/message_bags/${id}`)
    .catch(handleError);
  return res.data.data;
}

export async function createMessage(payload) {
  const res = await api
    .post('/api/v1/message_managements/messages', payload)
    .catch(handleError);
  return res.data;
}

export async function updateMessage(id, payload) {
  const res = await api
    .patch(`/api/v1/message_managements/messages/${id}`, payload)
    .catch(handleError);
  return res.data;
}

export async function deleteMessage(id) {
  const res = await api
    .delete(`/api/v1/message_managements/messages/${id}`)
    .catch(handleError);
  return res.data;
}

export async function reorderMessages(messageId, orderedIds) {
  const res = await api
    .post(`/api/v1/message_managements/messages/${messageId}/move`, {
      messages: orderedIds,
    })
    .catch(handleError);
  return res.data;
}

export async function fetchHotTemplates() {
  const res = await api
    .get('/api/v1/message_managements/hot_templates')
    .catch(handleError);
  return res.data.data || [];
}

export async function createHotTemplate(payload) {
  const res = await api
    .post('/api/v1/message_managements/hot_templates', payload)
    .catch(handleError);
  return res.data;
}

export async function updateHotTemplate(id, payload) {
  const res = await api
    .patch(`/api/v1/message_managements/hot_templates/${id}`, payload)
    .catch(handleError);
  return res.data;
}

export async function deleteHotTemplate(id) {
  const res = await api
    .delete(`/api/v1/message_managements/hot_templates/${id}`)
    .catch(handleError);
  return res.data;
}

export async function fetchInstagramPastPosts() {
  await ensureInstagramSettings();
  const pageAccessToken = Cookies.get('page_access_token');
  const igId = Cookies.get('ig_id');
  if (!pageAccessToken || !igId) return [];

  const mediaRes = await axios
    .get(`https://graph.facebook.com/v14.0/${igId}/media`, {
      params: { access_token: pageAccessToken },
    })
    .catch(() => ({ data: { data: [] } }));

  const mediaItems = mediaRes.data?.data || [];
  const posts = await Promise.all(
    mediaItems.map(async (item) => {
      try {
        const detail = await axios.get(
          `https://graph.facebook.com/v14.0/${item.id}`,
          {
            params: {
              fields: 'id,media_type,media_url,username,timestamp',
              access_token: pageAccessToken,
            },
          }
        );
        return detail.data;
      } catch {
        return null;
      }
    })
  );

  return posts.filter(Boolean);
}
