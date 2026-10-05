import { message } from 'antd';
import { tokenExpired } from 'v2/api/tokenExpired';
import { NAME_MAX, NAME_MAX_LENGTH, NAME_REQUIRED } from './constants';

const getErrorData = (error) => (error && error.response && error.response.data) || {};

export const validateVariableName = (name) => {
  if (!name || !String(name).trim()) {
    return NAME_REQUIRED;
  }
  if (name.length > NAME_MAX_LENGTH) {
    return NAME_MAX;
  }
  return '';
};

export const variableFieldErrorKey = (id, field) => `${id}-${field}`;

export const omitKey = (object, key) => {
  const next = { ...object };
  delete next[key];
  return next;
};

export const isTokenExpiredError = (error) => getErrorData(error).code === 0;

export const notifyApiError = (error, fallback) => {
  if (isTokenExpiredError(error)) {
    tokenExpired();
    return;
  }
  message.error(getErrorData(error).message || fallback);
};

export const variablesApiPath = (botId, id) => (
  id
    ? `/api/v1/managements/chatbots/${botId}/variables/${id}`
    : `/api/v1/managements/chatbots/${botId}/variables`
);
