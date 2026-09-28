export const PAGE_SIZE = 25;
export const API_WARNING_CODE = 2;
export const ORDERS_API_PATH = '/api/v1/managements/selenium_results';
export const DATE_FORMAT = 'YYYY/MM/DD';
export const DATE_PARAM_FORMAT = 'YYYY-MM-DD';
export const DASH = '—';
export const EMPTY_VALUE = '';

export const RESULT_RUNNING = 'running';
export const RESULT_DONE = 'done';
export const RESULT_ERROR = 'error';
export const RESULT_OPEN = 'open';

export const PATH_FIRST_TIME = 'first_time';
export const PATH_NEW = 'new';
export const PATH_EXISTING = 'existing';

export const PAYMENT_CREDIT = 'credit';
export const PAYMENT_ZEUS = 'zeus';

export const STATUS_LABEL_RUNNING = '処理中';
export const STATUS_LABEL_DONE = '完了';
export const STATUS_LABEL_ERROR = 'エラー';
export const STATUS_LABEL_OPEN = '未処理';

export const STATUS_COLOR_SUCCESS = 'success';
export const STATUS_COLOR_ERROR = 'error';
export const STATUS_COLOR_PROCESSING = 'processing';
export const STATUS_COLOR_DEFAULT = 'default';

export const PATH_LABEL_FIRST_TIME = 'はじめて';
export const PATH_LABEL_NEW = '新規会員';
export const PATH_LABEL_EXISTING = '既存会員';

export const STEP_LABEL_QUEUED = '待機中';

export const COL_CREATED_AT = '受付日時';
export const COL_STATUS = 'ステータス';
export const COL_PATH = '注文タイプ';
export const COL_PAYMENT = '支払い';
export const COL_EMAIL = 'メール';
export const COL_SKU = '商品コード';
export const COL_LEXICA_ORDER_ID = 'レキシカ注文ID';
export const COL_LAST_STEP = '最終ステップ';

export const FILTER_STATUS_PLACEHOLDER = 'ステータス';
export const FILTER_PATH_PLACEHOLDER = '注文タイプ';

export const LABEL_STATUS = 'ステータス';
export const LABEL_PATH = '注文タイプ';
export const LABEL_PAYMENT = '支払い';
export const LABEL_EMAIL = 'メール';
export const LABEL_SKU = '商品コード';
export const LABEL_PRODUCT_URL = '商品URL';
export const LABEL_CART_URL = 'カートURL';
export const LABEL_LEXICA_ORDER_ID = 'レキシカ注文ID';
export const LABEL_CARD = 'カード';
export const LABEL_CARD_EXPIRY = '有効期限';
export const LABEL_CARD_HOLDER = '名義';
export const LABEL_START = '開始';
export const LABEL_END = '終了';
export const LABEL_ERROR = 'エラー';
export const LABEL_CONVERSATION = '会話';
export const LABEL_ANSWERS = '入力内容';
export const LABEL_RPA_LOG = 'RPA実行ログ';
export const LABEL_SCREENSHOT = '失敗時スクリーンショット';
export const CONVERSATION_LINK_LABEL = '会話を開く';
export const BACK_TO_LIST_LABEL = '一覧へ戻る';
export const SCREENSHOT_ALT = '失敗時スクリーンショット';

export const INPUT_LABEL_USER_EMAIL = 'メール';
export const INPUT_LABEL_EMAIL = 'メール';
export const INPUT_LABEL_PATH = '注文タイプ';
export const INPUT_LABEL_USER_NAME = '氏名';
export const INPUT_LABEL_USER_NAME_KANA = '氏名（カナ）';
export const INPUT_LABEL_ZIP = '住所';
export const INPUT_LABEL_PHONE_NUMBER = '電話番号';
export const INPUT_LABEL_PHONE = '電話番号';
export const INPUT_LABEL_BIRTH_DATE = '生年月日';

export const INPUT_NAME_USER_EMAIL = 'user_email';
export const INPUT_NAME_EMAIL = 'email';
export const INPUT_NAME_PATH = 'path';
export const INPUT_NAME_USER_NAME = 'user_name';
export const INPUT_NAME_USER_NAME_KANA = 'user_name_kana';
export const INPUT_NAME_ZIP = 'zip_code_address';
export const INPUT_NAME_PHONE_NUMBER = 'phone_number';
export const INPUT_NAME_PHONE = 'phone';
export const INPUT_NAME_BIRTH_DATE = 'birth_date';

export const RPA_STEP_FALLBACK = '—';
export const RPA_OK = 'OK';
export const RPA_NG = 'NG';
export const RPA_EXCEPTION_PREFIX = '例外: ';
export const RPA_ERROR_TRUNCATE = 40;
export const RPA_LOG_BUTTON = 'ログ';
export const RPA_LOG_MODAL_TITLE = 'ステップログ';
export const RPA_COL_INDEX = '#';
export const RPA_COL_STEP = 'ステップ';
export const RPA_COL_RESULT = '結果';
export const RPA_COL_TIME = '時刻';
export const RPA_COL_URL = 'URL';
export const RPA_COL_ERROR = 'エラー';
export const RPA_COL_ACTION = '操作';
export const RPA_TOKEN_ARTIFACT = /\[token\]/g;
export const RPA_STEP_PREFIX = 'Step';
export const RPA_LABEL_CURRENT_URL = 'Current URL';
export const RPA_LABEL_RUN_TIME = 'Run time';
export const RPA_LABEL_ID = 'id';
export const RPA_LABEL_RESULT = 'Result';
export const RPA_LABEL_REASON = 'Reason';
export const RPA_LABEL_ACTIONS = 'Actions';
export const RPA_LABEL_WHERE = 'where';
export const RPA_LABEL_VALUE = 'value';
export const RPA_ACTIONS_MISSING = '— (詳細未記録)';
export const RPA_EMPTY_STEPS = 'ステップはありません';
export const RPA_ACTION_TYPE_LABELS = {
  fill: 'Fill',
  click: 'Click',
  select: 'Select',
  navigate: 'Navigate',
};

export const BIRTH_DATE_YEAR_SUFFIX = '年';
export const BIRTH_DATE_MONTH_SUFFIX = '月';
export const BIRTH_DATE_DAY_SUFFIX = '日';

export const LOCALE_JA = 'ja-JP';

export const STATUS_LABELS = {
  [RESULT_RUNNING]: STATUS_LABEL_RUNNING,
  [RESULT_DONE]: STATUS_LABEL_DONE,
  [RESULT_ERROR]: STATUS_LABEL_ERROR,
  [RESULT_OPEN]: STATUS_LABEL_OPEN,
};

export const STATUS_COLORS = {
  [RESULT_DONE]: STATUS_COLOR_SUCCESS,
  [RESULT_ERROR]: STATUS_COLOR_ERROR,
  [RESULT_RUNNING]: STATUS_COLOR_PROCESSING,
  [RESULT_OPEN]: STATUS_COLOR_DEFAULT,
};

export const PATH_OPTIONS = [
  { value: PATH_FIRST_TIME, label: PATH_LABEL_FIRST_TIME },
  { value: PATH_NEW, label: PATH_LABEL_NEW },
  { value: PATH_EXISTING, label: PATH_LABEL_EXISTING },
];

export const RESULT_OPTIONS = [
  { value: RESULT_RUNNING, label: STATUS_LABEL_RUNNING },
  { value: RESULT_DONE, label: STATUS_LABEL_DONE },
  { value: RESULT_ERROR, label: STATUS_LABEL_ERROR },
];

export const PATH_VALUE_LABELS = {
  [PATH_FIRST_TIME]: PATH_LABEL_FIRST_TIME,
  [PATH_NEW]: PATH_LABEL_NEW,
  [PATH_EXISTING]: PATH_LABEL_EXISTING,
};

export const STEP_LABELS = {
  queued: STEP_LABEL_QUEUED,
};

export const INPUT_LABELS = {
  [INPUT_NAME_USER_EMAIL]: INPUT_LABEL_USER_EMAIL,
  [INPUT_NAME_EMAIL]: INPUT_LABEL_EMAIL,
  [INPUT_NAME_PATH]: INPUT_LABEL_PATH,
  [INPUT_NAME_USER_NAME]: INPUT_LABEL_USER_NAME,
  [INPUT_NAME_USER_NAME_KANA]: INPUT_LABEL_USER_NAME_KANA,
  [INPUT_NAME_ZIP]: INPUT_LABEL_ZIP,
  [INPUT_NAME_PHONE_NUMBER]: INPUT_LABEL_PHONE_NUMBER,
  [INPUT_NAME_PHONE]: INPUT_LABEL_PHONE,
  [INPUT_NAME_BIRTH_DATE]: INPUT_LABEL_BIRTH_DATE,
};
