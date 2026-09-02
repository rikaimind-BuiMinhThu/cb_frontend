export const SCAN_REGEX = /\{\{(.*?)\}\}/g;
export const NUMBER_REGEXP = /^[0-9]+$/;

export const pad2 = (value) => String(value).padStart(2, '0');

export const DATA_HOUR_FIXED = Array.from({ length: 24 }, (_, hour) => ({
  key: pad2(hour),
  value: pad2(hour),
}));

export const DATA_MINUTES = Array.from({ length: 60 }, (_, minute) => ({
  key: pad2(minute),
  value: pad2(minute),
}));

export const YEAR_START = 1935;
export const YEAR_END = 2072;

export const DATA_YEAR_FIXED = Array.from(
  { length: YEAR_END - YEAR_START + 1 },
  (_, offset) => {
    const year = String(YEAR_START + offset);
    return { key: year, value: year };
  },
);

export const DATA_MONTH = Array.from({ length: 12 }, (_, offset) => ({
  key: pad2(offset + 1),
  value: pad2(offset + 1),
}));

export const DATA_DAY = Array.from({ length: 31 }, (_, offset) => ({
  key: pad2(offset + 1),
  value: pad2(offset + 1),
}));

export const PAYMENT_METHOD_VISA = 'visa';
export const PAYMENT_METHOD_JCB = 'jcb';
export const PAYMENT_METHOD_MASTER_CARD = 'master_card';
export const PAYMENT_METHOD_AMERICAN_EXPRESS = 'american_express';
export const PAYMENT_METHOD_DINER_CLUB = 'diner_club';
export const PAYMENT_METHOD_DISCOVER = 'discover';

export const CONTENT_TYPE = {
  TEXT_INPUT: 'text_input',
  IMAGE: 'image',
  LABEL: 'label',
  TEXTAREA: 'textarea',
  RADIO_BUTTON: 'radio_button',
  CHECKBOX: 'checkbox',
  PULL_DOWN: 'pull_down',
  ZIP_CODE_ADDRESS: 'zip_code_address',
  ATTACHING_FILE: 'attaching_file',
  CALENDAR: 'calendar',
  AGREE_TERM: 'agree_term',
  CAROUSEL: 'carousel',
  CREDIT_CARD_PAYMENT: 'credit_card_payment',
  CAPTURE: 'capture',
  PRODUCT_PURCHASE: 'product_purchase',
  PRODUCT_PURCHASE_RADIO_BUTTON: 'product_purchase_radio_button',
  SLIDER: 'slider',
  CARD_PAYMENT_RADIO_BUTTON: 'card_payment_radio_button',
  LABEL_NO_TRANSITION: 'label_no_transition',
  BUTTON_SUBMIT: 'button_submit',
  CONTACT_FORM: 'contact_form',
};

export const TEXT_INPUT_TYPE = {
  TEXT: 'text',
  PHONE_NUMBER: 'phone_number',
  PASSWORD: 'password',
  URLS: 'urls',
  EMAIL_ADDRESS: 'email_address',
  EMAIL_CONFIRMATION: 'email_confirmation',
  PASSWORD_CONFIRMATION: 'password_confirmation',
};

export const TEXTAREA_TYPE = {
  TEXT_INPUT: 'text_input',
  INVALID_INPUT: 'invalid_input',
};

export const RADIO_TYPE = {
  DEFAULT: 'default',
  RADIO_BUTTON_IMG: 'radio_button_img',
  UPSELL_BUTTON: 'upsell_button',
  CONSUME_API_RESPONSE: 'consume_api_response',
  BLOCK_STYLE: 'block_style',
};

export const CHECKBOX_TYPE = {
  DEFAULT: 'default',
  CHECKBOX_IMG: 'checkbox_img',
  CONSUME_API_RESPONSE: 'consume_api_response',
};

export const PULL_DOWN_TYPE = {
  CUSTOMIZATION: 'customization',
  TIME_HM: 'time_hm',
  DATE_YMD: 'date_ymd',
  DOB_YMD: 'dob_ymd',
  DATE_MD: 'date_md',
  DATE_YM: 'date_ym',
  DOB_YM: 'dob_ym',
  DATE_YMD_HM: 'date_ymd_hm',
  TIMEZONE_FROM_TO: 'timezone_from_to',
  PERIOD_FROM_TO: 'period_from_to',
  PREFECTURES: 'prefectures',
  UP_TO_MUNICIPALITY: 'up_to_municipality',
};

export const CALENDAR_TYPE = {
  DATE_SELECTION: 'date_selection',
  EMBEDDED: 'embedded',
  START_END_DATE: 'start_end_date',
};

export const AGREE_TERM_TYPE = {
  DETAIL_CONTENT: 'detail_content',
  POST_LINK_ONLY: 'post_link_only',
};

export const CAROUSEL_TYPE = {
  DEFAULT: 'default',
};

export const PRODUCT_PURCHASE_TYPE = {
  TEXT_WITH_THUMBNAIL_IMAGE: 'text_with_thumbnail_image',
  TEXT_WITH_IMAGE: 'text_with_image',
  CONSUME_API_RESPONSE: 'consume_api_response',
};

export const CARD_PAYMENT_RADIO_TYPE = {
  DEFAULT: 'default',
  CUSTOMIZED_STYLE: 'customized_style',
  PICTURE_RADIO: 'picture_radio',
};

export const SLIDER_TYPE = {
  DISCRETE: 'discrete_type',
};

export const SLIDER_CONTINUOUS_MIN = 0;
export const SLIDER_CONTINUOUS_MAX = 100;
export const SLIDER_CONTINUOUS_STEP = 0.1;

export const DATE_DISABLE_TYPE = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  DAY_AFTER_TOMORROW: 'day_after_tomorrow',
  PAST: 'past',
  FUTURE: 'future',
  MOON: 'moon',
  FIRE: 'fire',
  WATER: 'water',
  WOOD: 'wood',
  MONEY: 'money',
  SOIL: 'soil',
  DAY: 'day',
};

export const REQUIRE_ALL_ITEMS = 'all_items_require';
export const REQUIRE_FLAG = 'require';

export const CITIES_API_PATH = '/api/v1/cities';
export const ZIP_ADDRESS_API_PATH = '/api/v1/get_address_from_zip_code';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const EMPTY_STRING = '';
export const FILE_UNSELECTED = '未選択';
export const REQUIRED_LABEL = '※必須';
export const SAMPLE_LABEL = 'ラベル';
export const PLACEHOLDER_HOUR = '時';
export const PLACEHOLDER_MINUTE = '分';
export const PLACEHOLDER_YEAR = '年';
export const PLACEHOLDER_MONTH = '月';
export const PLACEHOLDER_DAY = '日';
export const PLACEHOLDER_SELECT = '選択してください。';
export const PLACEHOLDER_PREFECTURE = '都道府県を選択';
export const PLACEHOLDER_CITY = '市区町村を選択';
export const RANGE_SEPARATOR = '~';
export const ZIP_SEARCH_LABEL = '〒検索はこちら';
export const LABEL_POST_CODE = '郵便番号';
export const LABEL_PREFECTURE = '都道府県';
export const LABEL_MUNICIPALITY = '市区町村';
export const LABEL_ADDRESS = '番地';
export const LABEL_BUILDING = '建物名';
export const LABEL_SELECT_FILE = 'ファイルを選択';
export const LABEL_SELECT = '選択';
export const LABEL_CARD_NUMBER = 'カード番号';
export const LABEL_CARD_HOLDER = 'カード名義';
export const LABEL_EXPIRY = '有効期限';
export const LABEL_CVC = 'CVC';
export const LABEL_SUBMIT = '送信';
export const SUBMIT_IMAGE_WIDTH_DEFAULT = '80%';
export const LABEL_SUBMIT_CONTACT = '送信する';
export const CONTACT_FORM_TITLE = 'お問い合わせフォーム';
export const CONTACT_LABEL_NAME = 'お名前: ';
export const CONTACT_LABEL_EMAIL = 'メールアドレス: ';
export const CONTACT_LABEL_PHONE = '電話番号: ';
export const CONTACT_LABEL_INQUIRY_TYPE = 'お問い合わせ種別: ';
export const CONTACT_LABEL_ORDER_NUMBER = '注文番号: ';
export const CONTACT_LABEL_PRODUCT_NAME = '商品名: ';
export const CONTACT_LABEL_CONTENT = 'お問い合わせ内容: ';
export const PRODUCT_NUMBER_PREFIX = '商品番号: ';
export const PRICE_PREFIX = '値段: ';
export const PRICE_SUFFIX = ' 円';
export const QUANTITY_PREFIX = '数量：最大';
export const QUANTITY_SUFFIX = '個まで';
export const ALT_EMPTY = '';
export const HOUR_START_DEFAULT = '0';
export const HOUR_END_DEFAULT = '23';
export const YEAR_START_DEFAULT = '1935';
export const YEAR_END_DEFAULT = '2072';
export const PHONE_PART1_MAX = 3;
export const PHONE_PART2_MAX = 4;
export const PHONE_PART3_MAX = 4;
export const ZIP_FULL_LENGTH = 7;
export const ZIP_LEFT_LENGTH = 3;
export const ZIP_RIGHT_LENGTH = 4;
export const CARD_NUMBER_MAX = 16;
export const CARD_PART_MAX = 4;
export const CARD_PART_NUMBER_MAX = 9999;
export const TEXTAREA_ROWS_DEFAULT = 3;
export const AGREE_TERM_ROWS_LONG = 8;
export const AGREE_TERM_ROWS_SHORT = 5;
export const AGREE_TERM_LONG_THRESHOLD = 200;
export const CALENDAR_SEARCH_LIMIT = 100;
export const EXPIRY_YEAR_SPAN = 10;
export const PASTE_DELAY_MS = 10;
export const API_SUCCESS_CODE = 1;
export const WEEKDAY_SUNDAY = 0;
export const WEEKDAY_MONDAY = 1;
export const WEEKDAY_TUESDAY = 2;
export const WEEKDAY_WEDNESDAY = 3;
export const WEEKDAY_THURSDAY = 4;
export const WEEKDAY_FRIDAY = 5;
export const WEEKDAY_SATURDAY = 6;
export const DEFAULT_HOUR_START = 0;
export const DEFAULT_HOUR_END = 23;
export const DEFAULT_SLIDER_COLOR = '#2C75F0';
export const PASSWORD_TYPE = 'password';
export const FILE_INPUT_NAME = 'bot-file-upload';
export const CALENDAR_HEADER_MONTH = 'month';
export const CALENDAR_HEADER_YEAR = 'year';
export const EXPIRY_TYPE_YM = 'ym';
export const EXPIRY_TYPE_MY = 'my';
export const LINK_TARGET_BLANK = '_blank';
export const REL_NOREFERRER = 'noreferrer';
export const ICON_TIMES_CIRCLE = 'times-circle';
export const ICON_TIMES = 'times';
export const RADIO_SIZE_SMALL = 'small';
export const SLIDER_SIZE_SMALL = 'small';
export const CITIES_QUERY_PARAM = 'prefecture_jis_code';
export const ZIP_QUERY_PARAM = 'zip_code';
export const ERROR_KEY_MESSAGE = 'message';
export const ERROR_KEY_CONTENT = '_content';

export const buildErrorKey = (indexMessage, indexContent, ...parts) => (
  [`${ERROR_KEY_MESSAGE}${indexMessage}${ERROR_KEY_CONTENT}${indexContent}`, ...parts].join('_')
);
