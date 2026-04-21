import { SESSION_STORAGE_KEY } from "./Constants";

const getChatbotSavedState = () => {
  const data = sessionStorage.getItem(SESSION_STORAGE_KEY.CHAT_BOT_STATE);
  if (!data) return null;

  return JSON.parse(data);
}

const savedChatbotState = (data) => {
  sessionStorage.setItem(SESSION_STORAGE_KEY.CHAT_BOT_STATE, JSON.stringify(data));
}

const saveCheckpointTime = (botId, updatedAt) => {
  const lastUpdatedAt = sessionStorage.getItem(SESSION_STORAGE_KEY.BOT_UPDATE_AT);

  if (lastUpdatedAt !== updatedAt) {
    sessionStorage.removeItem(SESSION_STORAGE_KEY.BOT_ID(botId));
    sessionStorage.setItem(SESSION_STORAGE_KEY.BOT_UPDATE_AT, updatedAt);
  }
}

const savePrevOpenStatus = (status) => {
  sessionStorage.setItem(SESSION_STORAGE_KEY.PREV_OPEN_STATUS, status);
}

const getPrevOpenStatus = () => {
  return sessionStorage.getItem(SESSION_STORAGE_KEY.PREV_OPEN_STATUS);
}

const getTimerConfig = () => {
  const timerChatbotStorage = sessionStorage.getItem(SESSION_STORAGE_KEY.TIMER_CHATBOT);

  if (!timerChatbotStorage?.trim().length) {
    return null;
  }
  
  return JSON.parse(timerChatbotStorage);
}

const setTimerConfig = (timerConfig) => {
  sessionStorage.setItem(SESSION_STORAGE_KEY.TIMER_CHATBOT, JSON.stringify(timerConfig));
}

export const EC_FORCE_SESSION_COOKIE_NAMES = Object.freeze(['_ec_force_session']);

const EXPIRED = 'Thu, 01 Jan 1970 00:00:00 GMT';

const buildDeletionLines = (cookieName) => {
  const lines = new Set();
  const add = (s) => lines.add(s);

  add(`${cookieName}=; expires=${EXPIRED}; path=/`);
  add(`${cookieName}=; Max-Age=0; path=/`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; Secure`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=Lax`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=Lax; Secure`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=None; Secure`);

  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (!host) return [...lines];

  add(`${cookieName}=; expires=${EXPIRED}; path=/; domain=${host}`);
  add(`${cookieName}=; Max-Age=0; path=/; domain=${host}`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; Secure; domain=${host}`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=Lax; domain=${host}`);
  add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=None; Secure; domain=${host}`);

  const segments = host.split('.');
  if (segments.length >= 2) {
    const dotDomain = `.${segments.slice(-2).join('.')}`;
    add(`${cookieName}=; expires=${EXPIRED}; path=/; domain=${dotDomain}`);
    add(`${cookieName}=; Max-Age=0; path=/; domain=${dotDomain}`);
    add(`${cookieName}=; expires=${EXPIRED}; path=/; Secure; domain=${dotDomain}`);
    add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=Lax; domain=${dotDomain}`);
    add(`${cookieName}=; expires=${EXPIRED}; path=/; SameSite=None; Secure; domain=${dotDomain}`);
  }

  return [...lines];
};

const assignCookieLine = (line) => {
  try {
    document.cookie = line;
  } catch (_) {
    /* ignore */
  }
  try {
    if (typeof window !== 'undefined' && window.top && window.top !== window) {
      window.top.document.cookie = line;
    }
  } catch (_) {
    /* cross-origin top */
  }
};

const tryClearEcForceSessionCookie = () => {
  for (const name of EC_FORCE_SESSION_COOKIE_NAMES) {
    for (const line of buildDeletionLines(name)) {
      assignCookieLine(line);
    }
  }

  try {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window.self) {
      window.parent.postMessage(
        {
          source: 'ec-chatbot',
          action: 'clear_ec_force_session',
          cookieNames: [...EC_FORCE_SESSION_COOKIE_NAMES],
        },
        '*'
      );
    }
  } catch (_) {
    /* ignore */
  }
};

const clearLandingPageChatbotSession = () => {
  tryClearEcForceSessionCookie();

  sessionStorage.removeItem('chatbotH');
  sessionStorage.removeItem('chatbotBottom');
  sessionStorage.removeItem('chatbotState');
  sessionStorage.removeItem(SESSION_STORAGE_KEY.CHAT_BOT_STATE);
  sessionStorage.removeItem('prevOpenStatus');
  sessionStorage.removeItem(SESSION_STORAGE_KEY.PREV_OPEN_STATUS);
  sessionStorage.removeItem('timerConfig');
  sessionStorage.removeItem(SESSION_STORAGE_KEY.TIMER_CHATBOT);
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('chatbot') || key.startsWith('messages_bot_')) {
      sessionStorage.removeItem(key);
    }
  });
};

export {
  getChatbotSavedState, savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus, getPrevOpenStatus,
  getTimerConfig, setTimerConfig,
  clearLandingPageChatbotSession,
  tryClearEcForceSessionCookie,
};
