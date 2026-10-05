export const PAGE_SIZE = 25;
export const FIRST_PAGE = 1;
export const EMPTY_COUNT = 0;
export const SCROLL_ORIGIN = 0;
export const COL_ACTIONS_WIDTH = 120;
export const MAIN_PANEL_SELECTOR = '.main-panel';
export const FILTER_KEY_CLIENT = 'client';
export const FIELD_EMAIL = 'email';
export const FIELD_PASSWORD = 'password';
export const INPUT_TYPE_TEXT = 'text';
export const INPUT_TYPE_PASSWORD = 'password';
export const ADD_EMAIL_INPUT_ID = 'add-reply-email';
export const ADD_PASSWORD_INPUT_ID = 'add-reply-password';

export const EMAIL_REGEX =
  /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

export const CLIENT_EMAILS_PATH = '/api/v1/managements/client_emails';
export const CLIENT_NAMES_PATH = '/api/v1/managements/get_client_with_name';

export const getClientEmailsPagePath = (pageIndex) =>
  `${CLIENT_EMAILS_PATH}?page=${pageIndex}`;

export const getClientEmailItemPath = (id) => `${CLIENT_EMAILS_PATH}/${id}`;

export const EMPTY_FIELD_ERRORS = { email: '', password: '' };

export const EMAIL_REQUIRED_MESSAGE = 'メールアドレスは、必ず指定してください。';
export const EMAIL_FORMAT_MESSAGE = 'メールの正しい形式で入力してください：abc@abc.com';
export const PASSWORD_REQUIRED_MESSAGE = 'パスワードは、必ず指定してください。';
export const CREATE_SUCCESS_MESSAGE = '作成しました。';
export const UPDATE_SUCCESS_MESSAGE = '更新しました。';
export const ADD_REPLY_MAIL_LABEL = '返事メール追加';
export const COL_CLIENT_NAME = 'クライアント名';
export const COL_PASSWORD = 'パスワード';
export const COL_ACTIONS = 'アクション';
export const UPDATE_BUTTON_LABEL = '更新';
export const CLIENT_FILTER_LABEL = 'クライアント';
export const CLIENT_SELECT_PLACEHOLDER = 'クライアントを選択してください。';
export const ADD_MAIL_TITLE = 'メール追加';
export const EMAIL_INPUT_PLACEHOLDER = 'メール入力';
export const PASSWORD_INPUT_PLACEHOLDER = 'パスワード入力';
export const ADD_BUTTON_LABEL = '追加';
export const PASSWORD_LABEL = 'パスワード';
export const ALIGN_CENTER = 'center';
