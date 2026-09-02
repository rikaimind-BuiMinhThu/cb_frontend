import {
  AUTH_FALSE_VALUE,
  IS_AUTH_COOKIE_KEY,
  ROLE_ADMIN_DEEL,
  TOKEN_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
} from 'v2/api/constants';

export {
  AUTH_FALSE_VALUE,
  IS_AUTH_COOKIE_KEY,
  ROLE_ADMIN_DEEL,
  TOKEN_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
};

export const PLANS_API_PATH = '/api/v1/managements/plans';
export const TOKEN_EXPIRED_CODE = 0;
export const PLAN_CODE_CV = 4;
export const PLAN_MODAL_WIDTH = 520;
export const DESCRIPTION_ROWS = 5;
export const PRICE_MIN = 0;
export const PRICE_PRECISION = 0;
export const INTEGER_REGEX = /^\d+$/;
export const EMPTY_STRING = '';

export const FORM_LABEL_COL = { flex: '0 0 140px' };
export const FORM_WRAPPER_COL = { flex: 1 };

export const EDIT_PLAN_TITLE = 'プラン編集';
export const UPDATE_BUTTON_LABEL = '更新';
export const CANCEL_BUTTON_LABEL = 'キャンセル';
export const SUCCESS_CLIENT_UPDATED = 'クライアント更新しました!';

export const COL_ID = 'ID';
export const COL_PLAN_NAME = 'プラン名称';
export const COL_PLAN_PRICE = 'プラン価格';
export const COL_DESCRIPTION = '説明';
export const COL_ACTIONS = 'アクション';
export const PRICE_PER_CV_SUFFIX = ' / CV';

export const LABEL_PLAN_NAME = 'プラン名称';
export const LABEL_PLAN_PRICE = 'プラン価格';
export const LABEL_PLAN_PRICE_CV = 'プラン価格 / CV';
export const LABEL_DESCRIPTION = '説明';

export const PRICE_REQUIRED = 'プラン価格は、必ず指定してください。';
export const NAME_REQUIRED = 'プラン名称は、必ず指定してください。';
export const POSITIVE_NUMBER = '正数を入力してください。';
export const PRICE_INTEGER = 'プラン価格 は整数の必要です。';
