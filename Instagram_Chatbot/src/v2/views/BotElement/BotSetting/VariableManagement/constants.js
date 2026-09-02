export const PAGE_SIZE = 25;

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
