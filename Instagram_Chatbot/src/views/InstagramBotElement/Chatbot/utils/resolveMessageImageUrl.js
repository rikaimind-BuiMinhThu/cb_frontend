import { EC_CHATBOT_URL } from 'variables/constants';

function getImagePath(raw) {
  if (!raw) return '';
  if (typeof raw === 'object') return raw.url || '';
  return String(raw);
}

export function resolveMessageImageUrl(messageOrDraft) {
  const raw = messageOrDraft?.img_value ?? messageOrDraft?.imgValue;
  const path = getImagePath(raw);
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;

  const base = EC_CHATBOT_URL.replace(/\/$/, '');
  if (path.startsWith('/uploads/')) return `${base}${path}`;

  const messageId = messageOrDraft?.id;
  if (messageId) return `${base}/uploads/message/${messageId}/${path}`;

  return `${base}/${path.replace(/^\//, '')}`;
}

export function isNewImageUpload(value) {
  return typeof value === 'string' && value.startsWith('data:');
}
