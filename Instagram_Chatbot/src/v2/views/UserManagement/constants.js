import { ROLE_ADMIN_CLIENT, ROLE_CLIENT } from 'v2/api/constants';

export { ROLE_ADMIN_CLIENT, ROLE_CLIENT };

export const PAGE_SIZE = 25;
export const USER_MODAL_WIDTH = 520;
export const NAME_MAX_LENGTH = 35;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 24;
export const FORM_LABEL_COL = { flex: '0 0 140px' };
export const FORM_WRAPPER_COL = { flex: 1 };

export const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const ROLE_LABEL_ADMIN_CLIENT = 'クライアント';
export const ROLE_LABEL_CLIENT = 'ユーザー';

export const ROLE_OPTIONS = [
  { value: ROLE_ADMIN_CLIENT, label: ROLE_LABEL_ADMIN_CLIENT },
  { value: ROLE_CLIENT, label: ROLE_LABEL_CLIENT },
];

export const USERS_API_PATH = '/api/v1/managements/users';
export const CLIENTS_API_PATH = '/api/v1/managements/clients';
export const USER_REGISTRATIONS_PATH = '/api/v1/users/registrations';
export const DASHBOARD_PATH = '/dashboard';

export const API_WARNING_CODE = 2;
export const API_WARNING_CODE_STRING = '2';
export const EMAIL_TAKEN_TOKEN = 'Email has already been taken';

export const ADD_USER_TITLE = 'ユーザー追加';
export const EDIT_USER_TITLE = 'ユーザー編集';
export const ADD_BUTTON_LABEL = '追加';
export const UPDATE_BUTTON_LABEL = '更新';
export const SEARCH_PLACEHOLDER = 'ユーザー名 ...';
export const DELETE_CONFIRM_MESSAGE = '本当に削除しますか。';
export const SUCCESS_USER_ADDED = 'ユーザーを追加しました!';
export const SUCCESS_USER_UPDATED = 'ユーザーを更新しました!';
export const SUCCESS_USER_DELETED = '削除しました!';
export const WARNING_EMAIL_EXISTS = 'メールアドレスはは既に存在しています。';

export const LABEL_NAME = '名称';
export const LABEL_LOGIN_ID = 'ログインID';
export const LABEL_PASSWORD = 'パスワード';
export const LABEL_PASSWORD_CONFIRM = 'パスワード（確認用）';
export const LABEL_CLIENT = 'クライアント';
export const LABEL_ROLE = '権限';
export const COL_ID = 'ID';
export const COL_NAME = '名称';
export const COL_LOGIN_ID = 'ログインID';
export const COL_ROLE = '権限';
export const COL_CLIENT = 'クライアント';
export const COL_ACTIONS = 'アクション';

export const PLACEHOLDER_CLIENT = 'クライアントを選択';
export const NAME_REQUIRED = '名称は、必ず指定してください。';
export const NAME_MAX = '名称は35文字以下にしてください。';
export const LOGIN_REQUIRED = 'ログインIDは、必ず指定してください。';
export const LOGIN_MAX = 'ログインIDは35文字以下にしてください。';
export const EMAIL_FORMAT = 'メールの正しい形式で入力してください：abc@abc.com';
export const PASSWORD_REQUIRED = 'パスワードは、必ず指定してください。';
export const PASSWORD_CONFIRM_REQUIRED = 'パスワード（確認用）は、必ず指定してください。';
export const PASSWORD_LENGTH = '24文字以下入力してください。6文字以上入力してください。';
export const PASSWORD_MISMATCH = 'パスワードが一致しません。もう一度ご入力ください。';
export const CLIENT_REQUIRED = 'クライアントを選択してください。';
export const ROLE_REQUIRED = '権限を選択してください。';
