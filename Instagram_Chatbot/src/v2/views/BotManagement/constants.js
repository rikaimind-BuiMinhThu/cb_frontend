import {
  API_SUCCESS_CODE,
  AUTH_FALSE_VALUE,
  BOT_ID_COOKIE_KEY,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
  IS_AUTH_COOKIE_KEY,
  TOKEN_COOKIE_KEY,
} from 'v2/api/constants';

export {
  API_SUCCESS_CODE,
  AUTH_FALSE_VALUE,
  BOT_ID_COOKIE_KEY,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
  IS_AUTH_COOKIE_KEY,
  TOKEN_COOKIE_KEY,
};

export const CHATBOTS_API_PATH = '/api/v1/managements/chatbots';
export const DUPLICATE_PATH_SUFFIX = 'duplicate';
export const SCENARIO_LIST_PATH = '/v2/admin/scenario-list';
export const ADD_BOT_PATH = '/v2/admin/add-bot-management';
export const DEMO_BOT_PATH_PREFIX = '/v2/admin/demo-bot';

export const PAGE_SIZE = 10;
export const INITIAL_PAGE = 1;
export const API_WARNING_CODE = 2;
export const TOKEN_EXPIRED_CODE = 0;

export const STATUS_ALL = 'all';
export const STATUS_ON = 'on';
export const STATUS_OFF = 'off';

export const TAG_COLOR_ON = 'green';
export const TAG_COLOR_OFF = 'default';

export const CREATE_BOT_LABEL = 'ボット作成';
export const SEARCH_PLACEHOLDER = 'ボット名 ...';
export const FILTER_STATUS_LABEL = 'ボットステータス';
export const FILTER_STATUS_KEY = 'status';
export const FILTER_ALL_LABEL = 'すべて';
export const STATUS_ON_LABEL = 'ON';
export const STATUS_OFF_LABEL = 'OFF';
export const DEMO_LABEL = 'デモ';
export const ROLE_OWNER_LABEL = '所有者';
export const CANCEL_TEXT = 'キャンセル';
export const NO_TEXT = 'いいえ';

export const COL_NUMBER = '番号';
export const COL_BOT_NAME = 'ボット名';
export const COL_STATUS = 'ステータス';
export const COL_OWNER_NAME = '所有者名';
export const COL_PERMISSION = '自分の権限';
export const COL_ACTIONS = 'アクション';

export const COL_NUMBER_WIDTH = 70;
export const COL_STATUS_WIDTH = 120;
export const COL_PERMISSION_WIDTH = 120;
export const COL_ACTIONS_WIDTH = 320;

export const SUCCESS_DUPLICATED = '正常に複製されました！';
export const SUCCESS_STATUS_CHANGED = '正常に変更されました！';
export const SUCCESS_DELETED = '正常に削除されました！';
export const CONFIRM_BOT_OFF = '本当にボットをOFFにしますか。';
export const CONFIRM_BOT_ON = '本当にボットをONにしますか。';
export const CONFIRM_BOT_DELETE = '本当にボットを削除しますか。';
