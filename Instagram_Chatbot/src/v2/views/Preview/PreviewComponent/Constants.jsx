import american_express from "v2/assets/img/payment-method/american_express.png";
import diner_club from "v2/assets/img/payment-method/diner_club.png";
import discover from "v2/assets/img/payment-method/discover.png";
import jcb from "v2/assets/img/payment-method/jcb.png";
import master_card from "v2/assets/img/payment-method/master_card.png";
import visa from "v2/assets/img/payment-method/visa.png";
import { secondToDatetime } from "./Utils";
import { createDefaultDomainSuggestion } from "./emailDomainDefaults";

const HOUR_RANGE_START = 0;
const HOUR_RANGE_END = 23;
const MINUTE_RANGE_START = 0;
const MINUTE_RANGE_END = 59;
const YEAR_RANGE_START = 1935;
const YEAR_RANGE_END = 2072;
const MONTH_RANGE_START = 1;
const MONTH_RANGE_END = 12;
const DAY_RANGE_START = 1;
const DAY_RANGE_END = 31;

const padTwoDigits = (value) => (value < 10 ? `0${value}` : `${value}`);

const buildKeyValueRange = (start, end, pad) => Array.from(
  { length: end - start + 1 },
  (_, index) => {
    const current = start + index;
    const formattedValue = pad ? padTwoDigits(current) : `${current}`;
    return {
      key: formattedValue,
      value: formattedValue,
    };
  },
);

const dataHourFixed = buildKeyValueRange(HOUR_RANGE_START, HOUR_RANGE_END, true);
const dataMinutes = buildKeyValueRange(MINUTE_RANGE_START, MINUTE_RANGE_END, true);
const dataYearFixed = buildKeyValueRange(YEAR_RANGE_START, YEAR_RANGE_END, false);
const dataMonth = buildKeyValueRange(MONTH_RANGE_START, MONTH_RANGE_END, true);
const dataDay = buildKeyValueRange(DAY_RANGE_START, DAY_RANGE_END, true);

const dataPaymentMethod = [
  {
    key: "visa",
    value: <img src={visa} alt="visa" />,
  },
  {
    key: "jcb",
    value: <img src={jcb} alt="jcb" />,
  },
  {
    key: "master_card",
    value: <img src={master_card} alt="master card" />,
  },
  {
    key: "american_express",
    value: <img src={american_express} alt="american express" />,
  },
  {
    key: "diner_club",
    value: <img src={diner_club} alt="diner club" />,
  },
  {
    key: "discover",
    value: <img src={discover} alt="discover" />,
  },
];

const installmentOptions = Array.from({ length: 23 }, (_, i) => ({
  key: i + 2,
  value: `${i + 2}`,
}));

const SCAN_REGEX = /\{\{(.*?)\}\}/g;
const NUMBER_REGEX = /^\d+$/;
const CHATBOT_SERVER = {
  SCENARIO_USER_RESPONSE_PATH: '/api/v1/scenario_users/scenario_user_responses',
  SCENARIO_CREATE_ORDER_PATH: '/api/v1/scenario_users/scenario_user_responses/create_order',
  CONVERSION_PATH: '/api/v1/analytics/scenario_counts/:scenario_id',
  GET_CITIES_PATH: '/api/v1/cities?prefecture_jis_code=:prefecture_jis_code',
  GET_TOWNS_PATH: '/api/v1/towns?city_jis_code=:city_jis_code',
  GET_PREFECTURES_PATH: '/api/v1/prefectures',
  GET_SCENARIO_PREVIEW_DATA_PATH: '/api/v1/managements/chatbots/:bot_id/scenarios/:scenario_id/preview',
  GET_CHATBOT_SETTING_PATH: '/api/v1/managements/chatbots/:bot_id',
  SEND_EMAIL_PATH: '/api/v1/managements/emails/:email_id/send_email',
  SEND_CONTACT_FORM_PATH: '/api/v1/managements/contact_forms/send',
  CONVERT_TEXT_JAPANESE_PATH: '/api/v1/jp_convert',
  WITHDRAWAL_RESPONSE: '/api/v1/chatbot_settings/withdrawal_preventions/:bot_id',
  SEND_SCENARIO_USER_RESPONSE: '/api/v1/scenario_users/scenario_user_responses',
  CREATE_STATUS_CONVERSION_USER_RESPONSE: '/api/v1/scenario_users/scenario_user_responses_status',
  UPDATE_STATUS_CONVERSION_USER_RESPONSE: '/api/v1/scenario_users/scenario_user_responses_status',
  CREATE_USER_SCENARIO_RESPONSE_MESSAGE_HISTORY: '/api/v1/scenario_users/scenario_user_responses_message',
  USER_ENTRY_SCENARIO: '/api/v1/scenario_users/entry',
  GET_ADDRESS_FROM_ZIP_CODE_PATH: '/api/v1/get_address_from_zip_code?zip_code=:zip_code',
};

const GET_CAPTCHA_PATH = `https://svg-captcha-nodejs.vercel.app/captcha?size=:size&color=:color&charPreset=:char_preset`;

const SESSION_STORAGE_KEY = {
  CHAT_BOT_STATE: 'CHAT_BOT_STATE',
  TIMER_CHATBOT: 'TIMER_CHATBOT',
  BOT_UPDATE_AT: 'bot_update_at',
  BOT_ID: (botId) => `messages_bot_${botId}`,
  PREV_OPEN_STATUS: 'prevOpenStatus',
};

const CRAWL_ELEMENT_TYPES = {
  SELECT: 'select',
  FROM_JS: 'from_js'
};

const NO_ERROR = 'NO_ERROR';
const GETTING_ERROR_NOTIFICATION = 'getting_error_notification';

export { CHATBOT_ACTIONS } from 'v2/variables/chatbotActions';

const SEARCH_MODES = {
  ID: 1,
  CSS_SELECTOR: 2,
  XPATH: 3,
};

const MESSAGE_CONTENT_TYPES = {
  PULLDOWN: {
    LP_INTEGRATION_OPTION: 'lp_integration_option',
    FROM_JS: 'from_js_result',
    CUSTOMIZATION: 'customization',
    TIME_HM: 'time_hm',
    DATE_YMD: 'date_ymd',
    DATE_MD: 'date_md',
    DATE_YM: 'date_ym',
    DATE_YMD_HM: 'date_ymd_hm',
    DOB_YMD: 'dob_ymd',
    DOB_YM: 'dob_ym',
    TIMEZONE_FROM_TO: 'timezone_from_to',
    PERIOD_FROM_TO: 'period_from_to',
    PREFECTURES: 'prefectures',
    UP_TO_MUNICIPALITY: 'up_to_municipality',
    CONSUME_API_RESPONSE: 'comsume_api_response',
  },
  IMAGE: 'image',
  TEXT_INPUT: 'text_input',
  LABEL: 'label',
  TEXT_AREA: 'textarea',
  RADIO_BUTTON: 'radio_button',
  CHECKBOX: 'checkbox',
  PULL_DOWN: 'pull_down',
  ZIP_CODE_ADDRESS: 'zip_code_address',
  SHIPPING_ADDRESS: 'shipping_address',
  PRODUCT_PURCHASE_SELECT_OPTION: 'product_purchase_select_option',
  ATTACHMENT: 'attaching_file',
  CALENDAR: 'calendar',
  AGREE_TERM: 'agree_term',
  CREDIT_CARD_PAYMENT: 'credit_card_payment',
  CARD_PAYMENT_RADIO_BUTTON: 'card_payment_radio_button',
  SUBMIT_BUTTON: 'button_submit',
  LABEL_NO_TRANSITION: 'label_no_transition',
  CONTACT_FORM: 'contact_form',
};

const CONTACT_FORM_TEMPLATES = {
  BASIC: 'basic',
  DETAILED: 'detailed',
  PRODUCT: 'product',
};

const CONTACT_FORM_TEMPLATE_LABELS = {
  basic: '基本（名前・メール・お問い合わせ内容）',
  detailed: '詳細（名前・メール・電話・種別・お問い合わせ内容）',
  product: '商品関連（名前・メール・注文番号・商品名・お問い合わせ内容）',
};

const CONTACT_FORM_FIELD_KEYS = [
  'name',
  'email',
  'phone',
  'inquiry_type',
  'order_number',
  'product_name',
  'content',
];

const CONTACT_FORM_FIELD_LABELS = {
  name: 'お名前',
  email: 'メールアドレス',
  phone: '電話番号',
  inquiry_type: 'お問い合わせ種別',
  order_number: '注文番号',
  product_name: '商品名',
  content: 'お問い合わせ内容',
};

const CONTACT_FORM_FIELD_SETTING = (visible, required) => ({
  visible: Boolean(visible),
  required: Boolean(visible && required),
});

const getContactFormTemplateFieldSettings = (template) => {
  const hidden = CONTACT_FORM_FIELD_SETTING(false, false);
  const required = CONTACT_FORM_FIELD_SETTING(true, true);

  const base = {
    name: required,
    email: required,
    phone: hidden,
    inquiry_type: hidden,
    order_number: hidden,
    product_name: hidden,
    content: required,
  };

  if (template === CONTACT_FORM_TEMPLATES.DETAILED) {
    return {
      ...base,
      phone: required,
      inquiry_type: required,
    };
  }

  if (template === CONTACT_FORM_TEMPLATES.PRODUCT) {
    return {
      ...base,
      order_number: required,
      product_name: required,
    };
  }

  return base;
};

const getContactFormFieldSettings = (contactForm = {}) => {
  const template =
    contactForm.form_template || CONTACT_FORM_TEMPLATES.BASIC;
  const preset = getContactFormTemplateFieldSettings(template);
  const saved = contactForm.field_settings || {};

  return CONTACT_FORM_FIELD_KEYS.reduce((settings, fieldKey) => {
    const presetSetting = preset[fieldKey] || CONTACT_FORM_FIELD_SETTING(false, false);
    const savedSetting = saved[fieldKey] || {};
    const visible =
      typeof savedSetting.visible === 'boolean'
        ? savedSetting.visible
        : presetSetting.visible;
    const required =
      typeof savedSetting.required === 'boolean'
        ? savedSetting.required
        : presetSetting.required;

    settings[fieldKey] = CONTACT_FORM_FIELD_SETTING(visible, required);
    return settings;
  }, {});
};

const DEFAULT_CONTACT_FORM_CONFIG = {
  form_template: 'basic',
  submit_button_name: '送信する',
  inquiry_type_options: ['商品について', '配送について', 'その他'],
  email_settings: {
    send_to_user: true,
    send_to_staff: true,
    user_email_id: null,
    staff_email_id: null,
  },
  domain_suggestion: createDefaultDomainSuggestion(),
  field_settings: getContactFormTemplateFieldSettings(CONTACT_FORM_TEMPLATES.BASIC),
  fields: {
    name: '',
    email: '',
    phone: '',
    inquiry_type: '',
    order_number: '',
    product_name: '',
    content: '',
  },
};

const LABELS = {
  GENDER_OPTIONS: {
    CHECKBOX_USE_AS_GENDER: '性別として使用',
    LABEL_GENDER_DISPLAY_TYPE: '性別表示タイプ',
    ICON_HEIGHT: 'アイコン高さ',
    ICON_WIDTH: 'アイコン幅',
    ICON_URL: 'アイコン画像',
    ICON_DEFAULT: "アイコンデフォルト",
    ICON_HOVER: "アイコンホバー",
    ICON_SELECTED: "アイコン選択時",
    BUTTON_DEFAULT: "ボタンデフォルト",
    BUTTON_HOVER: "ボタンホバー",
    BUTTON_SELECTED: "ボタン選択時",  
    HORIZONTAL: '横並び',
    VERTICAL: '縦並び',
  },
  SUBMIT_BUTTON: {
    STYLE: '送信ボタンのカスタムCSSを入力してください',
  },
  SUBMIT_BUTTON_LOADING: {
    LOADING_BUTTON_HTML: 'ローディングボタンHTML',
    LOADING_BUTTON_CSS: 'ローディングボタンCSS',
    LOADING_HTML: 'ローディングHTML',
    LOADING_CSS: 'ローディングCSS',
  },
}

const REGEXP = {
  NUMBER: /^[0-9]+$/,
}

const CUSTOM_JS_CODE_POSITION = {
  HEAD: 'head',
  TOP_BODY: 'top_body',
  BOTTOM_BODY: 'bottom_body',
}

const BOT_MESSAGE_TYPES = {
  HTML_CODE: 'html_code',
  AMAZON_PAY_BUTTON: 'amazon_pay_button',
  UGC: 'use_html_ugc_config',
  TEXT_INPUT: 'text_input',
  FILE: 'file',
  DELAY: 'delay',
  GETTING_ERROR_NOTIFICATION: 'getting_error_notification',
  ORDER_CONFIRM: 'order_confirm',
  CART_LOGIN: 'cart_login',
}

const COMBINE_MESSAGE_DEFAULTS = {
  CONTENT_GAP: 10,
  BLOCK_PADDING: 10,
}

const COMBINE_CONTENT_ROLES = {
  BOT: 'bot',
  USER: 'user',
}

const RENDER_CHATBOT_CONFIG = {
  DELAY_EACH_MESSAGE: 1000,
  DELAY_EACH_MESSAGE_FAQ: 700,
  FAQ_DELAY_CLEAR_SUBMIT_ERROR_MESSAGE: 2000,
  DEBOUNCE_INPUT_TEXT_JP_CONVERT: 300,
  DELAY_START_RENDER: 500,
  DELAY_BEFORE_SCROLL_TO_BOTTOM: 500,
  TEMP_DELAY_PREFIX: "__temp_delay_",
};

export const RENDER_MODES = {
  NEXT: "next", // when click next/update -> render next message 
  LAST: "last", // when click next/update -> render last message is displayed
}

const CONVERT_TEXT_TYPES = {
  HIRAGANA: 'hiragana',
  KATAKANA: 'katakana',
  ROMAJI: 'romaji',
}

const RANGE_TEXT_VALIDATE = {
  ONLY_KATAKANA: {
    KEY: 'only_katakana',
    REGEX: /[^\u30A0-\u30FF\uFF66-\uFF9Fー]+/,
    MESSAGE: 'カタカナのみ（全角・半角）',
    LOG: 'カタカナ（全角・半角）を入力してください。',
  },
}

const CART_SYSTEM = {
  EC_FORCE: 'ec_force',
  SHOPIFY: 'shopify',
}

export {
  dataHourFixed,
  dataMinutes,
  dataYearFixed,
  dataMonth,
  dataDay,
  dataPaymentMethod,
  installmentOptions,
  SCAN_REGEX,
  NUMBER_REGEX,
  CHATBOT_SERVER,
  GET_CAPTCHA_PATH,
  SESSION_STORAGE_KEY,
  CRAWL_ELEMENT_TYPES,
  SEARCH_MODES,
  MESSAGE_CONTENT_TYPES,
  CONTACT_FORM_TEMPLATES,
  CONTACT_FORM_TEMPLATE_LABELS,
  CONTACT_FORM_FIELD_KEYS,
  CONTACT_FORM_FIELD_LABELS,
  getContactFormTemplateFieldSettings,
  getContactFormFieldSettings,
  DEFAULT_CONTACT_FORM_CONFIG,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  REGEXP,
  CUSTOM_JS_CODE_POSITION,
  BOT_MESSAGE_TYPES,
  COMBINE_MESSAGE_DEFAULTS,
  COMBINE_CONTENT_ROLES,
  RENDER_CHATBOT_CONFIG,
  CONVERT_TEXT_TYPES,
  RANGE_TEXT_VALIDATE,
  CART_SYSTEM,
  LABELS,
};

export const CONVERSTION_RESPONSE_STATUS = {
  FINISH: "finished",
  UN_FINISH: "un_finished",
}

export const CONVERSION_RESPONSE_SUBMIT_TYPE = {
  ERROR: 'error',
  ADD: 'add',
  UPDATE: 'upd',
}

export const CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE = {
  APPEAR: 'appear',
  ERROR: 'error',
  ADD: 'add',
  RETRY: 'retry'
}

export const TIMER_TYPES = {
  COUNTING_DOWN: "counting_down",
};

export const TIMER_VARIABLES = {
  [TIMER_TYPES.COUNTING_DOWN]: {
    timeCounting: "timer",
    duration: "duration"
  }
};

export const TIMER_VARIABLES_DESCRIPTION = {
  [TIMER_TYPES.COUNTING_DOWN]: {
    timeCounting: "残り時間 dd日 hh時 mm分 ss秒 ms",
    duration: "設定されたタイマー時間 dd日 hh時 mm分 ss秒"
  }
};

export const TIMER_COUNTING_DELAY = 20;

export const TIMER_DELAY_RENDER = 500;

export const TIMER_MAP_VARIABLE_METHOD = {
  CONFIG: 1,
  PARAMS: 2,
  COMP_STATE: 3,
};

export const TIMER_MAP_VARIABLES_FIELD = {
  [TIMER_VARIABLES[TIMER_TYPES.COUNTING_DOWN].timeCounting]: {
    field: "timer",
    method: TIMER_MAP_VARIABLE_METHOD.COMP_STATE,
    transform: (timer) => secondToDatetime(timer, "{{dd}}日 {{hh}}時間 {{mm}}分 {{ss}}秒 {{ms}}"),
  },
  [TIMER_VARIABLES[TIMER_TYPES.COUNTING_DOWN].duration]: {
    field: "duration",
    method: TIMER_MAP_VARIABLE_METHOD.CONFIG,
    transform: (duration) => secondToDatetime(duration, "{{dd}}日 {{hh}}時間 {{mm}}分 {{ss}}秒"),
  },
};

export const CURRENCY_UNITS = [
  { value: 1_0000_0000_0000, symbol: "兆" }, // 1兆 = 10^12
  { value: 1_0000_0000, symbol: "億" },      // 1億 = 10^8
  { value: 1_0000, symbol: "万" },           // 1万 = 10^4
];

export const DISPLAY_TYPES = {
  RELOAD: 1,
  HIDDEN: 2,
  BUTTON_CLICK: 3,
}

export const PREVIEW_ACTIONS = {
  UPDATE_MULTI_STATE: "UPDATE_MULTI_STATE",
  ADD_LP_OPTION_DATA: "ADD_LP_OPTION_DATA",
  UPDATE_PREVIEW_ORDER_CONTENT: "UPDATE_PREVIEW_ORDER_CONTENT",
  SET_PROCESSING: "SET_PROCESSING",
  UPDATE_RENDER_MESSAGES: "UPDATE_RENDER_MESSAGES",
  UPDATE_SUBMIT_ERROR_MESSAGE: "UPDATE_SUBMIT_ERROR_MESSAGE",
  UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG: "UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG",
  UPDATE_PREFECTURES_LIST: "UPDATE_PREFECTURES_LIST",
  UPDATE_AMAZON_PAY_DATA: "UPDATE_AMAZON_PAY_DATA",
  UPDATE_AMAZON_PAY_DATA_FOR_BLISS: "UPDATE_AMAZON_PAY_DATA_FOR_BLISS",
  UPDATE_AMAZON_PAY_DATA_FOR_ROSEMAY: "UPDATE_AMAZON_PAY_DATA_FOR_ROSEMAY",
  UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH: "UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH",
  UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU: "UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU",
  UPDATE_AMAZON_PAY_DATA_BY_SELECTOR: "UPDATE_AMAZON_PAY_DATA_BY_SELECTOR",
  UPDATE_AFTER_CLICK_NEXT_BUTTON: "UPDATE_AFTER_CLICK_NEXT_BUTTON",
  UPDATE_AFTER_CHANGE_VALUE: "UPDATE_AFTER_CHANGE_VALUE",
  SET_CHECKOUT_URL: "SET_CHECKOUT_URL",
  SET_OBJ_PARAM: "SET_OBJ_PARAM",
  SET_SHOW_POPUP_CLOSE_BOT: "SET_SHOW_POPUP_CLOSE_BOT",
  SET_SCENARIO_USER_RESPONSES: "SET_SCENARIO_USER_RESPONSES",
  SET_BOT_ID: "SET_BOT_ID",
  SET_UPSELL_BOT_ID: "SET_UPSELL_BOT_ID",
  SET_CAPTCHA: "SET_CAPTCHA",
  SET_URL_SEND: "SET_URL_SEND",
  SET_URL_RECEIVE: "SET_URL_RECEIVE",
  SET_DEVICE_RECEIVE: "SET_DEVICE_RECEIVE",
  SET_SCENARIO_ID: "SET_SCENARIO_ID",
  SET_CONVERSION_STATUS: "SET_CONVERSION_STATUS",
  SET_STOP_RENDER: "SET_STOP_RENDER",
  SET_ERRORS: "SET_ERRORS",
  SET_DELAYING: "SET_DELAYING",
  SET_CHATBOT_SETTINGS: "SET_CHATBOT_SETTINGS",
  SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER: "SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER",
  SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE: "SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE",
  SET_IS_NOT_AUTO_SCROLL: "SET_IS_NOT_AUTO_SCROLL",
  OPEN_CHATBOT: "OPEN_CHATBOT",
  CLOSE_CHATBOT: "CLOSE_CHATBOT",
  OPEN_POPUP_CLOSE_BOT_MODAL: "OPEN_POPUP_CLOSE_BOT_MODAL",
  UPDATE_NUMBER_ORDER_TO_UPSELL: "UPDATE_NUMBER_ORDER_TO_UPSELL",
  SET_SUBMIT_ERROR_MESSAGE: "SET_SUBMIT_ERROR_MESSAGE",
  CLEAR_SUBMIT_ERROR_MESSAGE: "CLEAR_SUBMIT_ERROR_MESSAGE",
  UPDATE_LP_FIELD_VALUE: "UPDATE_LP_FIELD_VALUE",
};

export const QUERY_PARAM_IS_LOGGED_IN = 'isLoggedIn';
export const QUERY_PARAM_VALUE_TRUE = 'true';

export const PREVIEW_MESSAGE_CONTENT_TYPES = {
  CAROUSEL: 'carousel',
  CAPTURE: 'capture',
  PRODUCT_PURCHASE: 'product_purchase',
  PRODUCT_PURCHASE_RADIO_BUTTON: 'product_purchase_radio_button',
  SLIDER: 'slider',
};

export const REQUIRED_FIELD_LABEL = '※必須';

export const EMPTY_INPUT_VALUE = '';

export const ALT_EMPTY = '';
export const EMPTY_STRING = '';
export const LABEL_SELECT = '選択';
export const NEXT_BUTTON_LABEL = '次へ';
export const PROCESS_BAR_COMPLETE_TEXT = '完了しました。';
export const formatProcessBarRemainingText = (remainingCount) => `あと${remainingCount}問`;
export const UPDATE_BUTTON_LABEL = '更新';
export const OK_BUTTON_LABEL = 'OK';
export const DELAY_SECONDS_UNIT = '秒';
export const PROCESSING_LABEL = '処理中...';
export const CONTACT_FORM_SUBMIT_FAILED = 'お問い合わせの送信に失敗しました。もう一度お試しください。';
export const PRODUCT_NUMBER_PREFIX = '商品番号: ';
export const PRICE_PREFIX = '値段: ';
export const PRICE_SUFFIX = ' 円';
export const QUANTITY_PREFIX = '数量：最大';
export const QUANTITY_SUFFIX = '個まで';
export const DEFAULT_SLIDER_COLOR = '#2C75F0';
export const SLIDER_CONTINUOUS_MIN = 0;
export const SLIDER_CONTINUOUS_MAX = 100;
export const SLIDER_CONTINUOUS_STEP = 0.1;

export const CAROUSEL_TYPE = {
  DEFAULT: 'default',
};

export const PRODUCT_PURCHASE_TYPE = {
  TEXT_WITH_THUMBNAIL_IMAGE: 'text_with_thumbnail_image',
  TEXT_WITH_IMAGE: 'text_with_image',
  CONSUME_API_RESPONSE: 'consume_api_response',
};

export const SLIDER_TYPE = {
  DISCRETE: 'discrete_type',
};

export const PULL_DOWN_PLACEHOLDERS = {
  YEAR: '年',
  MONTH: '月',
  DAY: '日',
  HOUR: '時',
  MINUTE: '分',
  SELECT: '選択してください。',
  PREFECTURE: '都道府県を選択',
  CITY: '市区町村を選択',
};