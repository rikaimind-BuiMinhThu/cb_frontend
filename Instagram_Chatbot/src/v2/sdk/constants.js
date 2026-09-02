export const WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT = 20;
export const WAIT_FOR_ELEMENT_MAX_COUNT = 50;
export const WAIT_FOR_ELEMENT_INTERVAL_MS = 500;
export const YEAR_VALUE_PREFIX = '20';
export const NULL_OPTION_VALUE = 'NULL_OPTION';
export const AWAIT_FILL_TYPE = 'await';
export const PAYMENT_METHOD_ID_TYPE = 'payment_method_id';
export const EMPTY_VALUE = '';
export const BOT_ID_STORAGE_KEY = 'bot_id';

export const CHATBOT_ACTIONS = {
  CLICK_BUTTON: 'clickButton',
  EXCUTE_JS: 'excuteJS',
  FUKUSHASHIKI: 'fukushashiki',
  INJECT_CUSTOM_JS: 'injectCustomJS',
  GET_ERROR_MESSAGE: 'getErrorMessage',
  CRAWL_DATA: 'crawlData',
  OPEN_PREVIEW: 'openPreview',
  GET_PREVIEW_ORDER_CONTENT: 'getPreviewOrderContent',
  SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE: 'setChatbotConversionParamsToLocalStorage',
  UPDATE_AMAZON_PAY_DATA_BY_SELECTOR: 'updateAmazonPayDataBySelector',
};

export const LP_INTEGRATION_MODES = {
  GENERIC: 'generic',
  LEGACY: 'legacy',
  AUTO: 'auto',
};

export const FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX = '_fukushashiki_search_value';

export const AMAZON_SELECTOR_TO_VALUE_PATH = {
  left_fukushashiki_search_value: 'text_input.text.valueLeft',
  right_fukushashiki_search_value: 'text_input.text.valueRight',
  fukushashiki_search_value: 'text_input.text.value',
  value_fukushashiki_search_value: 'text_input.text.value',
  valueConfirm_fukushashiki_search_value: 'text_input.text.valueConfirm',
  confirm_fukushashiki_search_value: 'text_input.password_confirmation.value',
  value1_fukushashiki_search_value: 'text_input.phone_number.value1',
  value2_fukushashiki_search_value: 'text_input.phone_number.value2',
  value3_fukushashiki_search_value: 'text_input.phone_number.value3',
  post_code_fukushashiki_search_value: 'zip_code_address.value_post_code',
  post_code_left_fukushashiki_search_value: 'zip_code_address.value_post_code_left',
  post_code_right_fukushashiki_search_value: 'zip_code_address.value_post_code_right',
  prefecture_fukushashiki_search_value: 'zip_code_address.value_prefecture',
  municipality_fukushashiki_search_value: 'zip_code_address.value_municipality',
  address_fukushashiki_search_value: 'zip_code_address.value_address',
  building_name_fukushashiki_search_value: 'zip_code_address.building_name',
  initial_selection_fukushashiki_search_value: 'radio_button.initial_selection',
  checkedValue_fukushashiki_search_value: 'checkbox.checkedValue',
};

export const DEFAULT_AMAZON_DETECTION = {
  match: 'any',
  strategies: [
    { type: 'url_param', param: 'amazonCheckoutSessionId' },
    { type: 'dom_selector', selector: '#amazon_payment_method' },
  ],
  ready_when: [],
};

export const DEFAULT_AMAZON_PAY_CONFIG = {
  poll_interval_ms: 200,
  max_count: 20,
  amazon_detection: DEFAULT_AMAZON_DETECTION,
};

export const CUSTOM_JS_CODE_POSITION = {
  HEAD: 'head',
  TOP_BODY: 'top_body',
  BOTTOM_BODY: 'bottom_body',
};

export const CONVERSION_PARAMS_STORAGE_KEYS = {
  SCENARIO_ID: 'ecChatbotScenarioId',
  BOT_TYPE: 'ecChatbotBotType',
  USER_INPUT_ID: 'ecChatbotUserInputId',
  ENV: 'ecChatbotEnv',
};

export const SEARCH_MODES = {
  ID: 1,
  CSS_SELECTOR: 2,
  XPATH: 3,
};

export const CRAWL_ELEMENT_TYPES = {
  SELECT: 'select',
  FROM_JS: 'from_js',
};

export const ELEMENT_TAGS = {
  SELECT: 'SELECT',
  INPUT: 'INPUT',
};

export const MESSAGE_CONTENT_TYPES = {
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
  TEXT_INPUT: 'text_input',
  TEXT_AREA: 'textarea',
  RADIO_BUTTON: 'radio_button',
  CHECKBOX: 'checkbox',
  PULL_DOWN: 'pull_down',
  ZIP_CODE_ADDRESS: 'zip_code_address',
  SHIPPING_ADDRESS: 'shipping_address',
  PRODUCT_PURCHASE_SELECT_OPTION: 'product_purchase_select_option',
  CREDIT_CARD_PAYMENT: 'credit_card_payment',
  CARD_PAYMENT_RADIO_BUTTON: 'card_payment_radio_button',
};

export const TEXT_INPUT_TYPES = {
  TEXT: 'text',
  PHONE_NUMBER: 'phone_number',
  EMAIL_CONFIRMATION: 'email_confirmation',
  PASSWORD_CONFIRMATION: 'password_confirmation',
  EMAIL_ADDRESS: 'email_address',
  URLS: 'urls',
  PASSWORD: 'password',
};

export const AMAZON_STRATEGY_TYPES = {
  URL_PARAM: 'url_param',
  DOM_SELECTOR: 'dom_selector',
  CUSTOM_JS: 'custom_js',
};

export const AMAZON_MATCH_MODES = {
  ANY: 'any',
  ALL: 'all',
};

export const AMAZON_READY_CONDITION_TYPES = {
  DOM_VALUE: 'dom_value',
};

export const LP_RESOLVE_MODES = {
  DEFAULT: 'DEFAULT',
  GENERIC: 'GENERIC',
};

export const WAIT_OPTION_TYPES = {
  WAIT_FOR_LOADING: 'WAIT_FOR_LOADING',
  WAIT_FOR_SETTING_VALUE: 'WAIT_FOR_SETTING_VALUE',
};
