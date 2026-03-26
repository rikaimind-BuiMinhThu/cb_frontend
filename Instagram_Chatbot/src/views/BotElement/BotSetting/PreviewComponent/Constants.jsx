import american_express from "../../../../assets/img/payment-method/american_express.png";
import diner_club from "../../../../assets/img/payment-method/diner_club.png";
import discover from "../../../../assets/img/payment-method/discover.png";
import jcb from "../../../../assets/img/payment-method/jcb.png";
import master_card from "../../../../assets/img/payment-method/master_card.png";
import visa from "../../../../assets/img/payment-method/visa.png";
import { secondToDatetime } from "./Utils";

let dataHourFixed = [];
for (let i = 0; i <= 23; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataHourFixed.push({
    key: formattedValue,
    value: formattedValue,
  });
}

let dataMinutes = [];
for (let i = 0; i <= 59; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataMinutes.push({
    key: formattedValue,
    value: formattedValue,
  });
}

let dataYearFixed = [];
for (let i = 1935; i <= 2072; i++) {
  dataYearFixed.push({
    key: i.toString(),
    value: i.toString(),
  });
}

let dataMonth = [];
for (let i = 1; i <= 12; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataMonth.push({
    key: formattedValue,
    value: formattedValue,
  });
}

let dataDay = [];
for (let i = 1; i <= 31; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataDay.push({
    key: formattedValue,
    value: formattedValue,
  });
}

const dataPaymentMethod = [
  {
    key: "visa",
    value: <img src={visa} />,
  },
  {
    key: "jcb",
    value: <img src={jcb} />,
  },
  {
    key: "master_card",
    value: <img src={master_card} />,
  },
  {
    key: "american_express",
    value: <img src={american_express} />,
  },
  {
    key: "diner_club",
    value: <img src={diner_club} />,
  },
  {
    key: "discover",
    value: <img src={discover} />,
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

const CHATBOT_ACTIONS = {
  CLICK_BUTTON: 'clickButton',
  EXCUTE_JS: 'excuteJS',
  FUKUSHASHIKI: 'fukushashiki',
  GET_ERROR_MESSAGE: 'getErrorMessage',
  GET_ERROR_MESSAGE_WITH_DISPLAY_MSG: 'getErrorMessageWithDisplayMsg',
  CRAWL_DATA: 'crawlData',
  OPEN_PREVIEW: 'openPreview',
  GET_PREVIEW_ORDER_CONTENT: 'getPreviewOrderContent',
  PREVIEW_OBJECT: 'previewObject',
  SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE: 'setChatbotConversionParamsToLocalStorage',
  INJECT_CUSTOM_JS: 'injectCustomJS',
  UPDATE_AMAZON_PAY_DATA: 'updateAmazonPayData',
  UPDATE_AMAZON_PAY_DATA_FOR_BLISS: 'updateAmazonPayDataForBliss',
  UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH: 'updateAmazonPayDataForPhystech',
  UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU: 'updateAmazonPayDataForYuwaeru',
  UPDATE_NUMBER_ORDER_TO_UPSELL: "updateNumberOrderToUpsell"
};

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
  UGC: 'use_html_ugc_config',
  TEXT_INPUT: 'text_input',
  FILE: 'file',
  DELAY: 'delay',
  GETTING_ERROR_NOTIFICATION: 'getting_error_notification',
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
  CHATBOT_ACTIONS,
  CRAWL_ELEMENT_TYPES,
  SEARCH_MODES,
  MESSAGE_CONTENT_TYPES,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  REGEXP,
  CUSTOM_JS_CODE_POSITION,
  BOT_MESSAGE_TYPES,
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
  UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH: "UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH",
  UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU: "UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU",
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
};