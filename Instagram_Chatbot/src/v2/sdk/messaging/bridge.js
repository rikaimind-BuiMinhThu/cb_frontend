import { chatbotLayout } from '../state.js';

export const sendMessageToChatbot = (contentMessage, action) => {
  const data = { action, actionData: contentMessage };
  chatbotLayout.globalIframe.contentWindow.postMessage(data, '*');
};
