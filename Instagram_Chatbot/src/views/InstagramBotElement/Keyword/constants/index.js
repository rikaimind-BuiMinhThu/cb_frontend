export const PAGE_TITLE = 'キーワード設定';

export const KEYWORD_PAGE_SIZE = 15;

export const SECTION_TITLES = {
  DEFAULT_REPLY: 'デフォルト返事',
  KEYWORDS: 'キーワード一覧',
};

export const CHANNEL_OPTIONS = [
  { key: 'is_dm', label: 'DM' },
  { key: 'is_story_comment', label: 'ストーリー' },
  { key: 'is_post_comment', label: '投稿' },
  { key: 'is_live_comment', label: 'ライブ' },
];

export const FORM_PLACEHOLDERS = {
  TITLE: 'キーワードグループ...',
  KEYWORDS: 'カンマまたはスペースで区別(例: key1, key2, ...)',
  SELECT_GROUP: 'メッセージグループを選択してください',
  SELECT_BAG: 'メッセージ袋を選択してください',
};

export const FORM_LABELS = {
  TITLE: 'タイトル',
  KEYWORDS: 'キーワード',
  MESSAGE_GROUP: 'メッセージグループ',
  MESSAGE_BAG: 'メッセージ袋',
  CHANNELS: '適用チャンネル',
};

export const TABLE_COLUMNS = {
  ACTIVE: '有効',
  TITLE: 'タイトル',
  KEYWORDS: 'キーワード',
  MESSAGE: 'メッセージ',
  CHANNELS: '適用チャンネル',
  ACTIONS: '操作',
};

export const TOAST_MESSAGES = {
  DEFAULT_REPLY_SAVED: 'デフォルト返事を保存しました。',
  KEYWORD_ADDED: 'キーワードを追加しました。',
  KEYWORD_UPDATED: 'キーワードを更新しました。',
  KEYWORD_DELETED: '削除しました。',
  KEYWORD_TOGGLED: 'キーワードの状態を更新しました。',
};

export const CONFIRM_MESSAGES = {
  DELETE_KEYWORD: 'キーワードを削除しますか。',
};

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'タイトルを入力してください。',
  KEYWORDS_REQUIRED: 'キーワードを入力してください。',
  BAG_REQUIRED: 'メッセージ袋を選択してください。',
  CHANNEL_REQUIRED: '適用チャンネルを1つ以上選択してください。',
  DEFAULT_REPLY_BAG_REQUIRED: 'メッセージ袋を選択してください。',
};

export const MODAL_TITLES = {
  ADD: 'キーワード追加',
  EDIT: 'キーワード編集',
};

export const ACTION_LABELS = {
  ADD_KEYWORD: 'キーワード追加',
  SAVE: '保存',
};
