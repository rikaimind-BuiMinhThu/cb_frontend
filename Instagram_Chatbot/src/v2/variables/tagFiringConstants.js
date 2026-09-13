export const TAG_FIRING_PROVIDERS = {
  GTM: 'gtm',
  GA4: 'ga4',
};

export const TAG_FIRING_KINDS = {
  OPEN: 'open',
  START: 'start',
  COMPLETE: 'complete',
  BUTTON_CLICK: 'button_click',
};

export const DEFAULT_TAG_FIRING_EVENTS = {
  open: 'chatbot_open',
  start: 'chatbot_start',
  complete: 'chatbot_complete',
};

export const DEFAULT_TAG_FIRING = {
  enabled: false,
  provider: TAG_FIRING_PROVIDERS.GTM,
  open_event: DEFAULT_TAG_FIRING_EVENTS.open,
  start_event: DEFAULT_TAG_FIRING_EVENTS.start,
  complete_event: DEFAULT_TAG_FIRING_EVENTS.complete,
};

export const DEFAULT_TAG_BUTTON_LABEL = '次へ';
export const DEFAULT_TAG_SUBMIT_LABEL = '送信';
export const TAG_STEP_EVENT_PREFIX = 'chatbot_step_';
export const TAG_SUBMIT_EVENT_PREFIX = 'chatbot_submit_';
export const BUTTON_SUBMIT_CONTENT_TYPE = 'button_submit';
export const USER_BELONG_TO = 'user';
export const BOT_BELONG_TO = 'bot';
export const CHOICE_CONTENT_TYPES = [
  'radio_button',
  'checkbox',
  'product_purchase_radio_button',
  'option_gender',
  'picture_radio',
  'card_payment_radio_button',
];
