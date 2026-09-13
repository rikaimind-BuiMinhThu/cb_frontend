import {
  API_SUCCESS_CODE,
  AUTH_FALSE_VALUE,
  CLIENT_STORAGE_KEY,
  IS_AUTH_COOKIE_KEY,
  ROLE_ADMIN_CLIENT,
  ROLE_ADMIN_DEEL,
  TOKEN_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
} from 'v2/api/constants';

export {
  API_SUCCESS_CODE,
  AUTH_FALSE_VALUE,
  CLIENT_STORAGE_KEY,
  IS_AUTH_COOKIE_KEY,
  ROLE_ADMIN_CLIENT,
  ROLE_ADMIN_DEEL,
  TOKEN_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
};

export const CLIENTS_API_PATH = '/api/v1/managements/clients';
export const PAYMENT_HISTORIES_API_PATH = '/api/v1/managements/payment_histories';
export const CLIENT_PAYMENT_DETAIL_SEGMENT = 'client-payment-detail';
export const MAIN_PANEL_SELECTOR = '.main-panel';

export const PAGE_SIZE = 20;
export const INITIAL_PAGE = 1;
export const DEFAULT_PRICE = 0;
export const DATE_SLICE_LENGTH = 10;
export const ADD_MONTHS = 1;
export const SUBTRACT_DAYS = 1;
export const TOKEN_EXPIRED_CODE = 0;
export const API_SUCCESS_CODE_STRING = '1';
export const API_WARNING_CODE = 2;
export const API_WARNING_CODE_STRING = '2';

export const TIMEZONE_TOKYO = 'Asia/Tokyo';
export const MOMENT_DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_PICKER_FORMAT = 'yyyy/MM/dd';
export const DATE_PLACEHOLDER = 'yyyy/mm/dd';
export const DATE_DASH = '-';
export const DATE_SLASH = '/';
export const LOCALE_JA = 'ja';
export const MONTH_UNIT = 'months';
export const DAY_UNIT = 'days';

export const EMPTY_STRING = '';
export const STATUS_PAID = 'paid';
export const STATUS_UNPAID = 'unpaid';
export const STATUS_LABEL_PAID = '支払済';
export const STATUS_LABEL_UNPAID = '未払い';

export const FIELD_ID_START_AT = 'startAt';
export const FIELD_ID_END_AT = 'endAt';
export const FIELD_ID_PRICE = 'price';
export const FIELD_ID_STATUS = 'status';
export const FIELD_ID_PAID_AT = 'paidAt';

export const EMPTY_FORM_ERRORS = {
  startAt: EMPTY_STRING,
  endAt: EMPTY_STRING,
  paidAt: EMPTY_STRING,
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: STATUS_PAID, label: STATUS_LABEL_PAID },
  { value: STATUS_UNPAID, label: STATUS_LABEL_UNPAID },
];

export const ADD_PAYMENT_LABEL = '支払いの追加';
export const UPDATE_PAYMENT_TITLE = '支払いの更新';
export const ADD_PAYMENT_TITLE = '支払いの追加';
export const UPDATE_BUTTON_LABEL = '更新';
export const ADD_BUTTON_LABEL = '追加';
export const DELETE_CONFIRM_MESSAGE = '本当に削除しますか。';
export const SUCCESS_DELETED = '削除しました!';
export const SUCCESS_CLIENT_UPDATED = 'クライアント更新しました!';
export const SUCCESS_CLIENT_ADDED = 'クライアント追加しました!';

export const LABEL_BILLING_START = '課金開始日';
export const LABEL_BILLING_END = '課金終了日';
export const LABEL_PRICE = '価格';
export const LABEL_STATUS = 'スターテス';
export const LABEL_PAID_AT = '支払日';
export const COL_ID = 'ID';
export const COL_BILLING_START = '課金開始日';
export const COL_BILLING_END = '課金終了日';
export const COL_PRICE = '価格';
export const COL_STATUS = 'スターテス';
export const COL_PAID_AT = '支払日';
export const COL_CREATED_AT = '作成日';
export const COL_ACTIONS = 'アクション';

export const PAID_AT_REQUIRED = '支払日は、必ず指定してください。';
export const START_AT_REQUIRED = '課金開始日は、必ず指定してください。';
export const END_AT_REQUIRED = '課金終了日は、必ず指定してください。';
