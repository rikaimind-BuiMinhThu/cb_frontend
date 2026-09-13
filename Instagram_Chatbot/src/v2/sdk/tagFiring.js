import { TAG_FIRING_PROVIDERS } from '../variables/tagFiringConstants.js';

export const pushChatbotTagEvent = (payload = {}) => {
  const eventName = payload.event;
  if (!eventName) return;

  const params = payload.params || {};
  const provider = payload.provider || TAG_FIRING_PROVIDERS.GTM;

  if (provider === TAG_FIRING_PROVIDERS.GA4 && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
};
