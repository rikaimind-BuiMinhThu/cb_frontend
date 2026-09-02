import { BOT_ID_STORAGE_KEY } from './constants.js';

const CHATBOT_BOTTOM_KEY = 'chatbotBottom';
const CHATBOT_H_KEY = 'chatbotH';
const CHATBOT_RIGHT_KEY = 'chatbotRight';
const CHATBOT_BOTTOM_PC_KEY = 'chatbotBottomPc';
const CHATBOT_RIGHT_PC_KEY = 'chatbotRightPc';
const CHATBOT_BOTTOM_SP_KEY = 'chatbotBottomSp';
const CHATBOT_RIGHT_SP_KEY = 'chatbotRightSp';
const CHATBOT_W_KEY = 'chatbotW';
const UUID_RADIX = 36;
const UUID_START = 2;
const UUID_END = 15;

const randomIdPart = () => Math.random().toString(UUID_RADIX).substring(UUID_START, UUID_END);

export const botId = sessionStorage.getItem(BOT_ID_STORAGE_KEY);
export const uuid = `${randomIdPart()}${randomIdPart()}`;

export const chatbotLayout = {
  chatbotBottom: sessionStorage.getItem(CHATBOT_BOTTOM_KEY),
  chatbotH: sessionStorage.getItem(CHATBOT_H_KEY),
  chatbotRight: sessionStorage.getItem(CHATBOT_RIGHT_KEY),
  chatbotBottomPc: sessionStorage.getItem(CHATBOT_BOTTOM_PC_KEY),
  chatbotRightPc: sessionStorage.getItem(CHATBOT_RIGHT_PC_KEY),
  chatbotBottomSp: sessionStorage.getItem(CHATBOT_BOTTOM_SP_KEY),
  chatbotRightSp: sessionStorage.getItem(CHATBOT_RIGHT_SP_KEY),
  chatbotW: sessionStorage.getItem(CHATBOT_W_KEY),
  scenarioId: '',
  globalIframe: null,
};

export const updateChatbotOffsetsFromMessage = (messageData) => {
  if (messageData.widthPc !== undefined && messageData.widthPc !== null) {
    chatbotLayout.chatbotW = messageData.widthPc;
  }
  if (messageData.heightPc !== undefined && messageData.heightPc !== null) {
    chatbotLayout.chatbotH = messageData.heightPc;
  }
  if (messageData.chatbotRightPc !== undefined && messageData.chatbotRightPc !== null) {
    chatbotLayout.chatbotRightPc = messageData.chatbotRightPc;
  }
  if (messageData.chatbotBottomPc !== undefined && messageData.chatbotBottomPc !== null) {
    chatbotLayout.chatbotBottomPc = messageData.chatbotBottomPc;
  }
  if (messageData.chatbotRightSp !== undefined && messageData.chatbotRightSp !== null) {
    chatbotLayout.chatbotRightSp = messageData.chatbotRightSp;
  }
  if (messageData.chatbotBottomSp !== undefined && messageData.chatbotBottomSp !== null) {
    chatbotLayout.chatbotBottomSp = messageData.chatbotBottomSp;
  }
  if (messageData.chatbotRight !== undefined && messageData.chatbotRight !== null) {
    chatbotLayout.chatbotRight = messageData.chatbotRight;
  }
  if (messageData.chatbotBottom !== undefined && messageData.chatbotBottom !== null) {
    chatbotLayout.chatbotBottom = messageData.chatbotBottom;
  }
};

export const setScenarioId = (id) => {
  chatbotLayout.scenarioId = id;
};

export const setGlobalIframe = (iframe) => {
  chatbotLayout.globalIframe = iframe;
};
