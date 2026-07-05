export const FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX = '_fukushashiki_search_value';

export const AMAZON_PAY_URL_FLAG = 'is_using_amazon_pay';

export const AMAZON_PAY_DISPLAY_MODES = {
  ALWAYS: 'always',
  DISPLAY_WHEN: 'display_when_amazon_pay',
  UNDISPLAY_WHEN: 'undisplay_when_amazon_pay',
};

export const dataAmazonPayDisplayMode = [
  { key: AMAZON_PAY_DISPLAY_MODES.ALWAYS, value: '常に表示' },
  { key: AMAZON_PAY_DISPLAY_MODES.DISPLAY_WHEN, value: 'Amazon Pay利用時に表示' },
  { key: AMAZON_PAY_DISPLAY_MODES.UNDISPLAY_WHEN, value: 'Amazon Pay利用時に非表示' },
];

export const DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL =
  'https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/uploads/213/86ddda57-14ba-4159-8e75-971a574caec6.png';

export const DEFAULT_AMAZON_PAY_BUTTON_TEXT_ABOVE =
  '【Amazon Payで簡単にお買い物！】\nAmazon Payをご利用の方はこちらからどうぞ！';

export const DEFAULT_AMAZON_PAY_BUTTON_CONFIG = {
  button_image_url: DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL,
  button_image_width: '80%',
  text_above: DEFAULT_AMAZON_PAY_BUTTON_TEXT_ABOVE,
  text_below: '',
  button_fukushashiki_search_mode: 2,
  button_fukushashiki_search_value: '#AmazonPayCv2Button',
  button_selector: 'amazon_payment_method',
};

export const LP_INTEGRATION_MODES = {
  GENERIC: 'generic',
  LEGACY: 'legacy',
  AUTO: 'auto',
};

export const AMAZON_SELECTOR_KEY_TYPES = [
  'left_fukushashiki_search_value',
  'right_fukushashiki_search_value',
  'fukushashiki_search_value',
  'value_fukushashiki_search_value',
  'valueConfirm_fukushashiki_search_value',
  'confirm_fukushashiki_search_value',
  'value1_fukushashiki_search_value',
  'value2_fukushashiki_search_value',
  'value3_fukushashiki_search_value',
  'post_code_fukushashiki_search_value',
  'post_code_left_fukushashiki_search_value',
  'post_code_right_fukushashiki_search_value',
  'prefecture_fukushashiki_search_value',
  'municipality_fukushashiki_search_value',
  'address_fukushashiki_search_value',
  'building_name_fukushashiki_search_value',
  'initial_selection_fukushashiki_search_value',
  'checkedValue_fukushashiki_search_value',
];

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

export const AMAZON_PAY_CART_PRESETS = {
  ec_force: {
    amazon_detection: {
      match: 'any',
      strategies: [
        { type: 'dom_selector', selector: '#amazon_payment_method' },
      ],
      ready_when: [
        { type: 'dom_value', selector: 'input#order_shipping_address_attributes_name1' },
      ],
    },
  },
  subsc_store: {
    amazon_detection: {
      match: 'any',
      strategies: [
        { type: 'url_param', param: 'amazonCheckoutSessionId' },
      ],
      ready_when: [
        { type: 'dom_value', selector: 'input#jsUkProfileFamilyName' },
      ],
    },
  },
  repeat_plus: {
    amazon_detection: {
      match: 'any',
      strategies: [
        { type: 'url_param', param: 'amazonCheckoutSessionId' },
        { type: 'dom_selector', selector: '#ctl00_ContentPlaceHolder1_ucInputForm_lbCancelAmazonPay' },
      ],
      ready_when: [
        { type: 'dom_value', selector: 'input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName1' },
      ],
    },
  },
};

export const getAmazonPayCartPreset = (cartSystem) => {
  if (!cartSystem) return null;
  const preset = AMAZON_PAY_CART_PRESETS[cartSystem];
  if (!preset) return null;
  return JSON.parse(JSON.stringify(preset));
};

export const normalizeAmazonPayConfig = (config = {}) => {
  const merged = {
    ...DEFAULT_AMAZON_PAY_CONFIG,
    ...config,
  };

  merged.amazon_detection = {
    ...DEFAULT_AMAZON_DETECTION,
    ...(merged.amazon_detection || {}),
    strategies: (merged.amazon_detection?.strategies || DEFAULT_AMAZON_DETECTION.strategies).filter(Boolean),
    ready_when: merged.amazon_detection?.ready_when || [],
  };

  return merged;
};
