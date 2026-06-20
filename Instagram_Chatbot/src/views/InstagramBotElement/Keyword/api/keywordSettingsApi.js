import api from '../../../../api/api-management';
import { tokenExpired } from '../../../../api/tokenExpired';

function handleError(error) {
  if (error.response?.data?.code === 0) {
    tokenExpired();
  }
  throw error;
}

export async function fetchKeywords(page = 1) {
  const res = await api
    .get(`/api/v1/message_managements/keyword_settings?page=${page}`)
    .catch(handleError);
  return { data: res.data.data || [], total: res.data.total || 0 };
}

export async function createKeyword(payload) {
  const res = await api
    .post('/api/v1/message_managements/keyword_settings', {
      keyword_setting: payload,
    })
    .catch(handleError);
  return res.data;
}

export async function updateKeyword(id, payload) {
  const res = await api
    .patch(`/api/v1/message_managements/keyword_settings/${id}`, {
      keyword_setting: payload,
    })
    .catch(handleError);
  return res.data;
}

export async function deleteKeyword(id) {
  const res = await api
    .delete(`/api/v1/message_managements/keyword_settings/${id}`)
    .catch(handleError);
  return res.data;
}

export async function fetchInstagramSettings() {
  const res = await api.get('/api/v1/instagram_settings').catch(handleError);
  return res.data.data?.[0] || null;
}

export async function updateDefaultReply(settingId, instagramSettingData, defaultReplyBagId) {
  const res = await api
    .patch(`/api/v1/instagram_settings/${settingId}`, {
      instagram_setting: {
        post_comment_bag_id: instagramSettingData?.post_comment_bag_id,
        story_comment_bag_id: instagramSettingData?.story_comment_bag_id,
        live_comment_bag_id: instagramSettingData?.live_comment_bag_id,
        default_reply_bag_id: parseInt(defaultReplyBagId, 10),
      },
    })
    .catch(handleError);
  return res.data;
}
