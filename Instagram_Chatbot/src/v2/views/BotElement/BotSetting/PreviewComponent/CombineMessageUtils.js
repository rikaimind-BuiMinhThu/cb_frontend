import { BOT_MESSAGE_TYPES, COMBINE_CONTENT_ROLES } from './Constants';
import { getCaptcha } from './Utils';

const prepareCombineBotBlocks = (messagesList, messageIndex) => {
  const message = messagesList[messageIndex];
  if (!message?.message_content) return;

  message.message_content.forEach((content) => {
    if (content.role !== COMBINE_CONTENT_ROLES.BOT) return;

    if (
      content.type === BOT_MESSAGE_TYPES.TEXT_INPUT
      || content.type === BOT_MESSAGE_TYPES.GETTING_ERROR_NOTIFICATION
    ) {
      const section = content[content.type];
      if (section && section.content != null) {
        section.originalContent = section.content;
      }
    }
  });
};

export const processForCombineMessage = (messagesList, i, newState, assignToState = true) => {
  prepareCombineBotBlocks(messagesList, i);

  for (let j = 0; j < messagesList[i].message_content.length; j++) {
    const content = messagesList[i].message_content[j];
    if (content.role !== COMBINE_CONTENT_ROLES.USER || content.type !== 'capture') continue;

    const msgContentType = content.type;
    const captureConfig = content[msgContentType];
    if (!captureConfig) continue;

    getCaptcha(
      captureConfig.length,
      captureConfig.colour ? 'true' : '',
      captureConfig.type,
    );
  }

  if (assignToState) {
    newState.renderMessagesList.push(messagesList[i]);
    newState.currentMsgIndex = i;
  }

  return newState;
};

export const prepareCombineMessagesForPreview = (messagesList) => {
  messagesList.forEach((message, index) => {
    if (message.belong_to !== 'combine') return;
    prepareCombineBotBlocks(messagesList, index);
  });
};
