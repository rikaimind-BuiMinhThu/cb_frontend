import _ from 'lodash';
import { getLpFieldSyncHandler } from './lpFieldSyncHandlers';

/**
 * Apply LP field value to matching chatbot user message contents via registered handlers.
 * @returns {{ messagesList: object[], changed: boolean }}
 */
const applyLpFieldValue = (messagesList, { searchMode, searchAddress, value, contentType }) => {
  if (searchMode == null || searchAddress == null || searchAddress === '') {
    return { messagesList, changed: false };
  }

  const normalizedValue = value == null ? '' : String(value);
  const nextList = _.cloneDeep(messagesList);
  let changed = false;

  nextList.forEach((message) => {
    if (!message?.message_content?.length) return;

    message.message_content.forEach((content) => {
      const handler = getLpFieldSyncHandler(contentType || content.type);
      if (!handler || !handler.matches(content, searchMode, searchAddress)) return;

      const current = handler.getCurrentValue(content);
      if (String(current) === normalizedValue) return;

      handler.applyValue(content, normalizedValue);
      changed = true;
    });
  });

  return { messagesList: nextList, changed };
};

export { applyLpFieldValue };
