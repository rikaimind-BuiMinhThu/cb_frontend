export const WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT = 20;

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
};

export const WAIT_OPTION_TYPES = {
  WAIT_FOR_LOADING: 'WAIT_FOR_LOADING',
  WAIT_FOR_SETTING_VALUE: 'WAIT_FOR_SETTING_VALUE',
};
