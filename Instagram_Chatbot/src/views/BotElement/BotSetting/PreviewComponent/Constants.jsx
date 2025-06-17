import american_express from "../../../../assets/img/payment-method/american_express.png";
import diner_club from "../../../../assets/img/payment-method/diner_club.png";
import discover from "../../../../assets/img/payment-method/discover.png";
import jcb from "../../../../assets/img/payment-method/jcb.png";
import master_card from "../../../../assets/img/payment-method/master_card.png";
import visa from "../../../../assets/img/payment-method/visa.png";

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
  GET_ADDRESS_FROM_ZIP_CODE_PATH: '/api/v1/get_address_from_zip_code?zip_code=:zip_code',
};

const GET_CAPTCHA_PATH = `https://svg-captcha-nodejs.vercel.app/captcha?size=:size&color=:color&charPreset=:char_preset`;

const SESSION_STORAGE_KEY = {
  CHAT_BOT_STATE: 'CHAT_BOT_STATE',
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
};

const REGEXP = {
  NUMBER: /^[0-9]+$/,
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
};