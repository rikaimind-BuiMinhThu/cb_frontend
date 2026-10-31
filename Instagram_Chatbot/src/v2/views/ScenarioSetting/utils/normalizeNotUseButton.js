const IMAGE_CONTENT_TYPE = 'image';

const contentHidesNextViaDisplayButtonNext = (content) => {
  if (!content || content.type !== IMAGE_CONTENT_TYPE) {
    return false;
  }
  return content.image?.displayButtonNext === false;
};

/**
 * Migrate legacy image.displayButtonNext === false onto message.not_use_button.
 * Does not mutate when not_use_button is already true.
 */
export const applyNotUseButtonFromImageDisplayButtonNext = (message) => {
  if (!message || message.not_use_button) {
    return message;
  }

  const contents = Array.isArray(message.message_content) ? message.message_content : [];
  const shouldHide = contents.some(contentHidesNextViaDisplayButtonNext);
  if (!shouldHide) {
    return message;
  }

  return {
    ...message,
    not_use_button: true,
  };
};

export const normalizeMessagesNotUseButton = (messages) => {
  if (!Array.isArray(messages)) {
    return messages;
  }
  return messages.map(applyNotUseButtonFromImageDisplayButtonNext);
};

export const shouldShowMessageNextButton = (message) => !message?.not_use_button;
