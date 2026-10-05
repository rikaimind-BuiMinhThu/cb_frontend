import { BOT_ID_COOKIE_KEY } from 'v2/api/constants';

export { BOT_ID_COOKIE_KEY };

export const PAGE_SIZE = 25;

export const NEW_VARIABLE_TITLE = '新しい変数を追加';
export const VARIABLE_NAME_LABEL = '変数名';
export const DEFAULT_VALUE_LABEL = 'デフォルト値';
export const PLACEHOLDER_NAME = '変数名をご入力ください';
export const PLACEHOLDER_VALUE = '変数値をご入力ください';

export const COL_NO = '番号';
export const COL_NAME = '変数名';
export const COL_DEFAULT = 'デフォルト値';
export const COL_ACTION = 'アクション';
export const COL_NOTE = '変数備考';

export const SAVE_LABEL = '保存';
export const ADD_VARIABLE_LABEL = '変数追加';
export const TAB_USER_LABEL = 'ユーザー定義関数';
export const TAB_SYSTEM_LABEL = 'システム変数';
export const PAGE_DESCRIPTION = '※ユーザの入力内容などを保管する変数です。シナリオの中で代入や参照ができます。';

export const DELETE_CONFIRM = '変数を削除しますか。';
export const DELETE_OK = '削除';
export const FETCH_ERROR = '変数の取得に失敗しました。';

export const SEARCH_PLACEHOLDER = '変数検索...';
export const EMPTY_USER_VARIABLES = '変数がありません';
export const EMPTY_SYSTEM_VARIABLES = 'システム変数がありません';

export const NAME_MAX_LENGTH = 30;
export const NAME_REQUIRED = '変数名は、必ず指定してください。';
export const NAME_MAX = '変数名は30文字以内で入力してください。';

export const SUCCESS_UPDATE = '更新しました。';
export const FAIL_UPDATE_WARNING = '更新できませんでした。';
export const FAIL_UPDATE = '更新に失敗しました。';
export const SUCCESS_CREATE = '保存しました。';
export const FAIL_CREATE_WARNING = '保存できませんでした。';
export const FAIL_CREATE = '保存に失敗しました。';
export const SUCCESS_DELETE = '削除しました。';
export const FAIL_DELETE = '削除できませんでした。';
export const FAIL_DELETE_ERROR = '削除に失敗しました。';

export const NEW_VARIABLE_NAME_ERROR_KEY = 'new_variable_name';

export const TABS = {
  USER: 'user',
  SYSTEM: 'system',
};

export const EMPTY_VARIABLE = {
  variable_name: '',
  default_value: '',
};

export const SYSTEM_VARIABLES = [
  { name: 'current_url', description: 'ボットを開いたページのURL' },
  {
    name: 'current_url_param',
    description: 'ボットを開いたページのURLについてるパラメータ（「?」以降の文字列）',
  },
  { name: 'current_url_title', description: 'ボットを開いたwebページのタイトル' },
  {
    name: 'user_id',
    description: 'ボットを使用するユーザーごとに自動的に付与されるユニークなID',
  },
  { name: 'bot_id', description: 'ボットのID' },
  {
    name: 'preview_flg',
    description: 'プレビュー機能の使用ユーザーのフラグ（通常ユーザーは空）',
  },
  { name: 'user_ip_address', description: 'アクセスしたユーザーのIPアドレス' },
  { name: 'user_country', description: 'IPアドレスから割り出した国名' },
  { name: 'user_city', description: 'IPアドレスから割り出した市区町村' },
  {
    name: 'user_device',
    description: 'ユーザーが使用しているデバイスの種類（PC、スマホ、タブレット）',
  },
  { name: 'user_browser', description: 'ユーザーが使用しているブラウザの種類' },
  {
    name: 'user_agent',
    description: 'ユーザーが使用しているブラウザ情報とOS情報（各種類、バージョンなど）',
  },
  { name: 'cv_datetime', description: 'ユーザーがシナリオの終端まできた時の日時' },
  {
    name: 'cv_flg',
    description:
      'ユーザーがシナリオの終端まできた時にフラグ（終端まできたユーザーは「1」の値、途中のユーザーは「0」の値を返す）',
  },
  { name: 'start_datetime', description: 'チャットボットを開き最初に会話をした日時' },
  {
    name: 'user_referer_firstopen',
    description: '最初に開いた時のユーザーのリファラル（サイトに訪れる前に滞在していたページのURL）',
  },
  {
    name: 'user_referer_current',
    description: '最後に開いた時のユーザーのリファラル（サイトに訪れる前に滞在していたページのURL）',
  },
];
