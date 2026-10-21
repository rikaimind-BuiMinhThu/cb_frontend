import api from 'v2/api/api-management';
import { ORDERS_API_PATH } from './constants';

export const listBotOrders = (params) => api.get(ORDERS_API_PATH, { params });

export const getBotOrder = (botId, id) => api.get(`${ORDERS_API_PATH}/${id}`, {
  params: { chatbot_id: botId },
});

export const getBotOrderScreenshot = (botId, id) => api.get(`${ORDERS_API_PATH}/${id}/screenshot`, {
  params: { chatbot_id: botId },
  responseType: 'blob',
});
