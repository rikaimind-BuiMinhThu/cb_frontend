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

  messagesList[i].message_content.forEach((content) => {
    if (content.role !== COMBINE_CONTENT_ROLES.USER || content.type !== 'capture') return;

    const msgContentType = content.type;
    const captureConfig = content[msgContentType];
    if (!captureConfig) return;

    getCaptcha(
      captureConfig.length,
      captureConfig.colour ? 'true' : '',
      captureConfig.type,
    );
  });

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
