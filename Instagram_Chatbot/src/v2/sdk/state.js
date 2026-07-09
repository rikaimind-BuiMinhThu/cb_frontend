export const botId = sessionStorage.getItem('bot_id');
export const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export let chatbotBottom = sessionStorage.getItem('chatbotBottom');
export let chatbotH = sessionStorage.getItem('chatbotH');
export let chatbotRight = sessionStorage.getItem('chatbotRight');
export let chatbotBottomPc = sessionStorage.getItem('chatbotBottomPc');
export let chatbotRightPc = sessionStorage.getItem('chatbotRightPc');
export let chatbotBottomSp = sessionStorage.getItem('chatbotBottomSp');
export let chatbotRightSp = sessionStorage.getItem('chatbotRightSp');
export let chatbotW = sessionStorage.getItem('chatbotW');
export let scenarioId = '';
export let globalIframe;

export const updateChatbotOffsetsFromMessage = (messageData) => {
  if (messageData.widthPc !== undefined && messageData.widthPc !== null) chatbotW = messageData.widthPc;
  if (messageData.heightPc !== undefined && messageData.heightPc !== null) chatbotH = messageData.heightPc;
  if (messageData.chatbotRightPc !== undefined && messageData.chatbotRightPc !== null) chatbotRightPc = messageData.chatbotRightPc;
  if (messageData.chatbotBottomPc !== undefined && messageData.chatbotBottomPc !== null) chatbotBottomPc = messageData.chatbotBottomPc;
  if (messageData.chatbotRightSp !== undefined && messageData.chatbotRightSp !== null) chatbotRightSp = messageData.chatbotRightSp;
  if (messageData.chatbotBottomSp !== undefined && messageData.chatbotBottomSp !== null) chatbotBottomSp = messageData.chatbotBottomSp;
  if (messageData.chatbotRight !== undefined && messageData.chatbotRight !== null) chatbotRight = messageData.chatbotRight;
  if (messageData.chatbotBottom !== undefined && messageData.chatbotBottom !== null) chatbotBottom = messageData.chatbotBottom;
};

export const setScenarioId = (id) => {
  scenarioId = id;
};

export const setGlobalIframe = (iframe) => {
  globalIframe = iframe;
};
