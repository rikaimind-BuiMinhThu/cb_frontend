export const PAGE_TITLE = 'チャットボット作成';

export const PREVIEW_LABELS = {
  TITLE: 'プレビュー',
  SHOW: '表示',
  HIDE: '非表示',
  EMPTY: 'プレビューなし',
};

export const SECTION_TITLES = {
  MESSAGE_GROUPS: 'メッセージグループ',
  MESSAGE_CONTENT: 'メッセージ内容',
  MESSAGE_TYPE: 'メッセージタイプ',
};

export const EMPTY_STATES = {
  LOADING: '読み込み中...',
  LOADING_BAGS: '袋を読み込み中...',
  LOADING_MESSAGES: 'メッセージを読み込み中...',
  NO_BAGS: 'メッセージ袋がありません',
  SELECT_BAG: 'メッセージ袋を選択してください',
  SELECT_BAG_TO_EDIT: 'メッセージ袋を選択して編集を開始してください',
  NO_MESSAGES: 'メッセージがありません。右側から追加してください。',
  NO_PAST_POST: '過去の投稿を選択してください',
  DRAFT_EDITING: '編集中...',
  DRAFT_NEW_PREFIX: '新規 — ',
  IMAGE: '画像',
};

export const ACTION_LABELS = {
  ADD_GROUP: 'グループ追加',
  TEMPLATE_SETTING: 'テンプレート設定',
  TEMPLATE_DETAIL: 'テンプレート詳細',
  SAVE: '保存',
  CANCEL: 'キャンセル',
  DELETE: '削除',
  UPDATE: '更新',
  SELECT: '選択',
  ADD_TEMPLATE: 'テンプレート追加',
  SELECT_IMAGE: '画像を選択',
};

export const MODAL_TITLES = {
  ADD_GROUP: 'グループ名入力',
  RENAME_GROUP: 'メッセージグループ名変更',
  ADD_BAG: 'メッセージ袋名入力',
  RENAME_BAG: 'メッセージ袋名変更',
  PAST_POST_PICKER: '過去の投稿選択',
  PROFILE_MESSAGE: 'プロファイルメッセージ追加',
  HOT_TEMPLATE_SETTING: 'テンプレート設定',
  HOT_TEMPLATE_DETAIL: 'テンプレート選択',
};

export const MODAL_OK_TEXT = {
  ADD_GROUP: 'グループ追加',
  CHANGE: '変更',
  ADD_BAG: '追加',
  SAVE: '保存',
};

export const CONFIRM_MESSAGES = {
  COPY_GROUP: 'メッセージグループをコピーしますか。',
  DELETE_GROUP: 'メッセージグループを削除しますか。',
  COPY_BAG: 'メッセージ袋をコピーしますか。',
  DELETE_BAG: 'メッセージ袋を削除しますか。',
  MOVE_BAG: '選択した袋をこのメッセージグループに移動しますか？',
};

export const FORM_PLACEHOLDERS = {
  REPLY: '返事入力...',
  CAPTION: 'キャプション入力...',
  TITLE: 'タイトル',
  DESCRIPTION: '詳細',
  URL: 'URL',
  LABEL: 'ラベル',
  VALIDATION_MESSAGE: 'バリデーションメッセージ',
  SELECT_BAG: 'メッセージ袋選択',
  SELECT_GROUP: 'メッセージグループ選択 ...',
};

export const FORM_LABELS = {
  FORMAT_CHECK: '形式チェック',
  BUTTON_PREFIX: 'ボタン',
};

export const CHOICE_LABELS = {
  SINGLE: '単一選択',
  THREE: '三択+URL',
  FREE_INPUT: '自由入力',
  MESSAGE: 'メッセージ',
  URL: 'URL',
};

export const TOAST_MESSAGES = {
  GROUP_EXISTS: 'メッセージグループが存在します。',
  GROUP_ADDED: 'メッセージグループを追加しました。',
  GROUP_RENAMED: 'メッセージグループ名を変更しました。',
  GROUP_DELETED: 'メッセージグループを削除しました。',
  GROUP_COPIED: 'メッセージグループをコピーしました。',
  BAG_ADDED: 'メッセージ袋を追加しました。',
  BAG_RENAMED: 'メッセージ袋名を変更しました。',
  BAG_DELETED: 'メッセージ袋を削除しました。',
  BAG_COPIED: 'メッセージ袋をコピーしました。',
  BAG_MOVED: 'メッセージ袋を移動しました。',
  MESSAGE_ADDED: '追加しました。',
  MESSAGE_UPDATED: '更新しました。',
  MESSAGE_DELETED: '削除しました。',
  MESSAGE_MOVED: 'メッセージを移動しました。',
  TEMPLATE_SAVED: 'テンプレートを保存しました。',
  TEMPLATE_UPDATED: 'テンプレートを更新しました。',
  TEMPLATE_DELETED: 'テンプレートを削除しました。',
  TEMPLATE_APPLIED: 'テンプレートが選択されました！',
};

export const VALIDATION_MESSAGES = {
  REQUIRED_NAME: (fieldLabel = '名前') => `${fieldLabel}を入力してください。`,
  IMAGE_REQUIRED: '画像を選択してください。',
  IMAGE_INVALID: '画像ファイルを選択してください。',
};

export const DRAFT_ERRORS = {
  INCOMPLETE: '新メッセージを作成する前に現在のメッセージを完成してください。',
};

export const BUTTON_TYPE_OPTIONS = [
  { value: 'mess', label: CHOICE_LABELS.MESSAGE },
  { value: 'web_url', label: CHOICE_LABELS.URL },
];
