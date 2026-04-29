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

export {
  getChatbotSavedState, savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus, getPrevOpenStatus,
  getTimerConfig, setTimerConfig,
};
