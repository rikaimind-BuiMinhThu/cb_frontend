import {
  BOT_BELONG_TO,
  CHOICE_CONTENT_TYPES,
  DEFAULT_TAG_BUTTON_LABEL,
  DEFAULT_TAG_FIRING,
  DEFAULT_TAG_SUBMIT_LABEL,
  TAG_FIRING_PROVIDERS,
  TAG_STEP_EVENT_PREFIX,
  TAG_SUBMIT_EVENT_PREFIX,
  USER_BELONG_TO,
} from 'v2/variables/tagFiringConstants';

export const parseTagFiringFromApi = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_TAG_FIRING };
  }

  return {
    enabled: !!raw.enabled,
    provider: raw.provider === TAG_FIRING_PROVIDERS.GA4
      ? TAG_FIRING_PROVIDERS.GA4
      : TAG_FIRING_PROVIDERS.GTM,
    open_event: raw.open_event || DEFAULT_TAG_FIRING.open_event,
    start_event: raw.start_event || DEFAULT_TAG_FIRING.start_event,
    complete_event: raw.complete_event || DEFAULT_TAG_FIRING.complete_event,
  };
};

export const fillTagFiringDefaults = (current) => ({
  ...DEFAULT_TAG_FIRING,
  ...current,
  enabled: true,
  open_event: current?.open_event || DEFAULT_TAG_FIRING.open_event,
  start_event: current?.start_event || DEFAULT_TAG_FIRING.start_event,
  complete_event: current?.complete_event || DEFAULT_TAG_FIRING.complete_event,
});

export const getUserStepNumber = (dataMessages, message) => {
  const userMessages = (dataMessages || []).filter((item) => item.belong_to === USER_BELONG_TO);
  const index = userMessages.findIndex((item) => item.id === message?.id);
  return index >= 0 ? index + 1 : userMessages.length + 1;
};

const firstTextFromMessage = (message) => {
  const firstContent = message?.message_content?.[0];
  if (!firstContent) return '';
  const raw = firstContent.text
    || firstContent.originalContent
    || firstContent.html_code
    || firstContent.text_input?.originalContent
    || '';
  return String(raw).replace(/<[^>]+>/g, '').split('\n')[0].trim().slice(0, 40);
};

export const getDefaultTagLabelForMessage = (dataMessages, message) => {
  if (message?.buttonName) return message.buttonName;
  const messageIndex = (dataMessages || []).findIndex((item) => item.id === message?.id);
  if (messageIndex <= 0) return DEFAULT_TAG_BUTTON_LABEL;
  const previousBot = dataMessages.slice(0, messageIndex)
    .reverse()
    .find((item) => item.belong_to === BOT_BELONG_TO);
  return firstTextFromMessage(previousBot) || DEFAULT_TAG_BUTTON_LABEL;
};

export const getDefaultStepTagEvent = (dataMessages, message) => (
  `${TAG_STEP_EVENT_PREFIX}${getUserStepNumber(dataMessages, message)}`
);

export const getDefaultSubmitTagEvent = (dataMessages, message) => (
  `${TAG_SUBMIT_EVENT_PREFIX}${getUserStepNumber(dataMessages, message)}`
);

export const getDefaultSubmitTagLabel = (content) => (
  content?.button_submit_name || DEFAULT_TAG_SUBMIT_LABEL
);

export const messageHasInChatChoice = (message) => (
  (message?.message_content || []).some((content) => CHOICE_CONTENT_TYPES.includes(content.type))
);

export const shouldShowMessageTagBlock = (message) => (
  !message?.not_use_button || messageHasInChatChoice(message)
);
