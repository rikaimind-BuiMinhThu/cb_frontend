import { globalIframe } from '../state.js';

export const sendMessageToChatbot = (contentMessage, action) => {
  const data = { action, actionData: contentMessage };
  globalIframe.contentWindow.postMessage(data, '*');
};
