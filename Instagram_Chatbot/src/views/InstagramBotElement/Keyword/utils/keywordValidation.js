import { VALIDATION_MESSAGES } from '../constants';

export function validateKeywordForm(values) {
  if (!values.title?.trim()) {
    return VALIDATION_MESSAGES.TITLE_REQUIRED;
  }
  if (!values.keywords?.trim()) {
    return VALIDATION_MESSAGES.KEYWORDS_REQUIRED;
  }
  if (!values.messageBagId) {
    return VALIDATION_MESSAGES.BAG_REQUIRED;
  }
  if (!values.channels?.length) {
    return VALIDATION_MESSAGES.CHANNEL_REQUIRED;
  }
  return null;
}
