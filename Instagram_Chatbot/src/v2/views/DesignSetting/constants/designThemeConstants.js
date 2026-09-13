export const TAB_THEME = 3;

export const FIELD_FOCUS_EFFECT_OPTIONS = [
  { id: 'none', label: 'なし' },
  { id: 'outline_soft', label: 'アウトライン（ソフト）' },
  { id: 'outline_strong', label: 'アウトライン（強）' },
  { id: 'border_twinkle', label: '枠線きらきら' },
];

export const FIELD_FOCUS_EFFECT_IDS = FIELD_FOCUS_EFFECT_OPTIONS.map(({ id }) => id);

export const BORDER_TWINKLE_EFFECT_OPTIONS = [
  { id: 'none', label: 'なし' },
  { id: 'twinkle', label: '枠線きらきら' },
];

export const BORDER_TWINKLE_EFFECT_IDS = BORDER_TWINKLE_EFFECT_OPTIONS.map(({ id }) => id);

export const BUTTON_BORDER_STYLE_OPTIONS = [
  { id: 'square', label: '角なし' },
  { id: 'rounded', label: '少し丸' },
  { id: 'pill', label: 'ピル型' },
];

export const BUTTON_BORDER_STYLE_IDS = BUTTON_BORDER_STYLE_OPTIONS.map(({ id }) => id);

export const MESSAGE_BORDER_STYLE_OPTIONS = [
  { id: 'with_tail', label: 'しっぽあり' },
  { id: 'no_tail', label: 'しっぽなし' },
];

export const MESSAGE_BORDER_STYLE_IDS = MESSAGE_BORDER_STYLE_OPTIONS.map(({ id }) => id);

export const BUTTON_EFFECT_OPTIONS = [
  { id: 'none', label: 'なし' },
  { id: 'bounce', label: '動かす' },
];

export const BUTTON_EFFECT_IDS = BUTTON_EFFECT_OPTIONS.map(({ id }) => id);

export const BUTTON_POSITION_OPTIONS = [
  { id: 'left', label: '左' },
  { id: 'center', label: '中央' },
  { id: 'right', label: '右' },
];

export const BUTTON_POSITION_IDS = BUTTON_POSITION_OPTIONS.map(({ id }) => id);

export const MODAL_TITLE_ALIGNMENT_OPTIONS = [
  { id: 'left', label: '左' },
  { id: 'center', label: '中央' },
  { id: 'right', label: '右' },
];

export const MODAL_TITLE_ALIGNMENT_IDS = MODAL_TITLE_ALIGNMENT_OPTIONS.map(({ id }) => id);

export const THEME_FIELD_KEYS = [
  'headerTitleTextColor',
  'headerTitleFontSize',
  'headerSubtitleTextColor',
  'headerSubtitleFontSize',
  'progressBarBgColor',
  'progressBarTextColor',
  'progressBarFontSize',
  'chatWindowBgColor',
  'botMessageBgColor',
  'botMessageTextColor',
  'botMessageFontSize',
  'botMessageBorderStyle',
  'userMessageBgColor',
  'userMessageTextColor',
  'userMessageFontSize',
  'userMessageBorderStyle',
  'fieldFocusBorderColor',
  'fieldFocusBgColor',
  'fieldFocusBgEffect',
  'fieldUnfocusBorderColor',
  'fieldUnfocusBgColor',
  'fieldFontSize',
  'validationMessageBgColor',
  'validationMessageTextColor',
  'validationMessageFontSize',
  'requiredLabelTextColor',
  'requiredLabelFontSize',
  'buttonNormalBgColor',
  'buttonNormalTextColor',
  'buttonPressedBgColor',
  'buttonPressedTextColor',
  'buttonDisabledBgColor',
  'buttonDisabledTextColor',
  'buttonFontSize',
  'buttonBorderStyle',
  'buttonEffect',
  'buttonWidth',
  'buttonPadding',
  'buttonPosition',
  'checkboxUncheckedBgColor',
  'checkboxUncheckedBorderColor',
  'checkboxCheckedBgColor',
  'checkboxCheckedBorderColor',
  'checkboxCheckedBorderEffect',
  'checkboxFontSize',
  'radioUnselectedBgColor',
  'radioSelectedBgColor',
  'radioUnselectedBorderColor',
  'radioSelectedBorderColor',
  'radioSelectedBorderEffect',
  'radioInputUnselectedColor',
  'radioInputSelectedColor',
  'radioFontSize',
  'errorMessageBgColor',
  'errorMessageTextColor',
  'errorMessageFontSize',
  'modalBgColor',
  'modalTitleTextColor',
  'modalTitleFontSize',
  'modalTitleAlignment',
  'modalCancelButtonBgColor',
  'modalCancelButtonTextColor',
  'modalCancelButtonBorderColor',
  'modalCloseButtonBgColor',
  'modalCloseButtonTextColor',
  'modalButtonFontSize',
];

export const THEME_PREVIEW_REGIONS = [
  { sectionId: 'headerMain', label: 'メインカラー・ヘッダー', targets: ['header', 'progressFill', 'headerText'] },
  { sectionId: 'progress', label: 'プログレスバー', targets: ['progressBar'] },
  { sectionId: 'window', label: 'チャットウィンドウ', targets: ['chatBody'] },
  { sectionId: 'messages', label: 'メッセージ', targets: ['botBubble', 'userBubble'] },
  { sectionId: 'fields', label: '入力・プルダウン', targets: ['inputs'] },
  {
    sectionId: 'validation',
    label: 'バリデーション・必須ラベル',
    targets: ['validationMessage', 'requiredLabel'],
  },
  { sectionId: 'buttons', label: 'ボタン', targets: ['buttons'] },
  { sectionId: 'checkbox', label: 'チェックボックス', targets: ['checkboxes'] },
  { sectionId: 'radio', label: 'ラジオボタン', targets: ['radios'] },
  { sectionId: 'errors', label: 'エラーメッセージ', targets: ['errorBanner'] },
  { sectionId: 'modal', label: 'モーダル', targets: ['modalPreview'] },
];

export const THEME_SECTIONS = [
  {
    id: 'headerMain',
    title: 'メインカラー・ヘッダー',
    fields: [
      { fieldType: 'mainColor', label: 'メインカラー', fullWidth: true },
      { fieldType: 'groupLabel', label: 'タイトル', fullWidth: true },
      { key: 'headerTitleTextColor', label: '文字色' },
      { key: 'headerTitleFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { fieldType: 'groupLabel', label: 'サブタイトル', fullWidth: true },
      { key: 'headerSubtitleTextColor', label: '文字色' },
      { key: 'headerSubtitleFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
    ],
  },
  {
    id: 'progress',
    title: 'プログレスバー',
    fields: [
      { key: 'progressBarBgColor', label: '背景色' },
      { key: 'progressBarTextColor', label: '文字色' },
      { key: 'progressBarFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
    ],
  },
  {
    id: 'window',
    title: 'チャットウィンドウ',
    fields: [
      { key: 'chatWindowBgColor', label: '背景色', fullWidth: true },
    ],
  },
  {
    id: 'messages',
    title: 'メッセージ',
    fields: [
      { fieldType: 'groupLabel', label: 'ボット', fullWidth: true },
      { key: 'botMessageBgColor', label: '背景色' },
      { key: 'botMessageTextColor', label: '文字色' },
      { key: 'botMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      {
        key: 'botMessageBorderStyle',
        label: '枠スタイル',
        fieldType: 'messageBorderStyleSelect',
        fullWidth: true,
      },
      { fieldType: 'groupLabel', label: 'ユーザー', fullWidth: true },
      { key: 'userMessageBgColor', label: '背景色' },
      { key: 'userMessageTextColor', label: '文字色' },
      { key: 'userMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      {
        key: 'userMessageBorderStyle',
        label: '枠スタイル',
        fieldType: 'messageBorderStyleSelect',
        fullWidth: true,
      },
    ],
  },
  {
    id: 'fields',
    title: '入力・プルダウン',
    fields: [
      { key: 'fieldFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      { fieldType: 'groupLabel', label: 'フォーカス時', fullWidth: true },
      { key: 'fieldFocusBorderColor', label: '枠線色' },
      { key: 'fieldFocusBgColor', label: '背景色' },
      {
        key: 'fieldFocusBgEffect',
        label: '効果',
        fieldType: 'effectSelect',
        fullWidth: true,
      },
      { fieldType: 'groupLabel', label: '通常時', fullWidth: true },
      { key: 'fieldUnfocusBorderColor', label: '枠線色' },
      { key: 'fieldUnfocusBgColor', label: '背景色' },
    ],
  },
  {
    id: 'validation',
    title: 'バリデーション・必須ラベル',
    fields: [
      { fieldType: 'groupLabel', label: 'バリデーションメッセージ', fullWidth: true },
      { key: 'validationMessageBgColor', label: '背景色' },
      { key: 'validationMessageTextColor', label: 'テキスト色' },
      { key: 'validationMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      { fieldType: 'groupLabel', label: '必須ラベル', fullWidth: true },
      { key: 'requiredLabelTextColor', label: 'テキスト色' },
      { key: 'requiredLabelFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
    ],
  },
  {
    id: 'buttons',
    title: 'ボタン',
    fields: [
      { key: 'buttonFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      {
        key: 'buttonBorderStyle',
        label: '枠線スタイル',
        fieldType: 'borderStyleSelect',
        fullWidth: true,
      },
      {
        key: 'buttonEffect',
        label: '効果',
        fieldType: 'effectSelect',
        effectOptions: 'buttonBounce',
        fullWidth: true,
      },
      { key: 'buttonWidth', label: '幅', fieldType: 'dimension', unit: '%', fullWidth: true },
      {
        key: 'buttonPadding',
        label: 'パディング',
        fieldType: 'dimension',
        unitOptions: ['%', 'px'],
        fullWidth: true,
      },
      { key: 'buttonPosition', label: 'ボタン位置', fieldType: 'positionSelect', fullWidth: true },
      { fieldType: 'groupLabel', label: '通常時', fullWidth: true },
      { key: 'buttonNormalBgColor', label: '背景色' },
      { key: 'buttonNormalTextColor', label: '文字色' },
      { fieldType: 'groupLabel', label: '押下時', fullWidth: true },
      { key: 'buttonPressedBgColor', label: '背景色' },
      { key: 'buttonPressedTextColor', label: '文字色' },
      { fieldType: 'groupLabel', label: '無効時', fullWidth: true },
      { key: 'buttonDisabledBgColor', label: '背景色' },
      { key: 'buttonDisabledTextColor', label: '文字色' },
    ],
  },
  {
    id: 'checkbox',
    title: 'チェックボックス',
    fields: [
      { key: 'checkboxFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      { fieldType: 'groupLabel', label: '未選択', fullWidth: true },
      { key: 'checkboxUncheckedBgColor', label: '背景色' },
      { key: 'checkboxUncheckedBorderColor', label: '枠線色' },
      { fieldType: 'groupLabel', label: '選択時', fullWidth: true },
      { key: 'checkboxCheckedBgColor', label: '背景色' },
      { key: 'checkboxCheckedBorderColor', label: '枠線色' },
      {
        key: 'checkboxCheckedBorderEffect',
        label: '効果',
        fieldType: 'effectSelect',
        effectOptions: 'borderTwinkle',
        fullWidth: true,
      },
    ],
  },
  {
    id: 'radio',
    title: 'ラジオボタン',
    fields: [
      { key: 'radioFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      { fieldType: 'groupLabel', label: '未選択', fullWidth: true },
      { key: 'radioUnselectedBgColor', label: '背景色' },
      { key: 'radioUnselectedBorderColor', label: '枠線色' },
      { fieldType: 'groupLabel', label: '選択時', fullWidth: true },
      { key: 'radioSelectedBgColor', label: '背景色' },
      { key: 'radioSelectedBorderColor', label: '枠線色' },
      {
        key: 'radioSelectedBorderEffect',
        label: '効果',
        fieldType: 'effectSelect',
        effectOptions: 'borderTwinkle',
        fullWidth: true,
      },
      { fieldType: 'groupLabel', label: '入力欄', fullWidth: true },
      { key: 'radioInputUnselectedColor', label: '未選択スタイル' },
      { key: 'radioInputSelectedColor', label: '選択時スタイル' },
    ],
  },
  {
    id: 'errors',
    title: 'エラーメッセージ',
    fields: [
      { key: 'errorMessageBgColor', label: '背景色' },
      { key: 'errorMessageTextColor', label: '文字色' },
      { key: 'errorMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
    ],
  },
  {
    id: 'modal',
    title: 'モーダル',
    fields: [
      { key: 'modalBgColor', label: '背景色', fullWidth: true },
      { fieldType: 'groupLabel', label: 'タイトル', fullWidth: true },
      { key: 'modalTitleTextColor', label: '文字色' },
      { key: 'modalTitleFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      {
        key: 'modalTitleAlignment',
        label: '配置',
        fieldType: 'modalTitleAlignmentSelect',
        fullWidth: true,
      },
      { fieldType: 'groupLabel', label: 'ボタン', fullWidth: true },
      { key: 'modalCancelButtonBgColor', label: 'キャンセル背景色' },
      { key: 'modalCancelButtonTextColor', label: 'キャンセル文字色' },
      { key: 'modalCancelButtonBorderColor', label: 'キャンセル枠線色' },
      { key: 'modalCloseButtonBgColor', label: '閉じる背景色' },
      { key: 'modalCloseButtonTextColor', label: '閉じる文字色' },
      { key: 'modalButtonFontSize', label: 'フォントサイズ', fieldType: 'fontSize', fullWidth: true },
      { fieldType: 'modalPreviewToggle', label: 'プレビューに表示', fullWidth: true },
    ],
  },
];

export const THEME_SECTION_NAV_ITEMS = THEME_SECTIONS.map(({ id, title }) => ({ id, title }));

export const THEME_PREVIEW_CLICK_HINT = 'プレビューをクリックして設定箇所へ移動';
export const THEME_MAIN_COLOR_CONFIRM_TITLE = '確認';
export const THEME_MAIN_COLOR_CONFIRM_MESSAGE = 'メインカラーに合わせて各項目を再計算しますか？';
export const THEME_MAIN_COLOR_CONFIRM_OK = 'はい';
export const THEME_MAIN_COLOR_CONFIRM_CANCEL = 'いいえ';
export const THEME_MAIN_COLOR_HELPER =
  'メインカラーを変更しても個別設定は自動では上書きされません。セクションごとに「デフォルトに戻す」で再計算できます。';
export const THEME_RESET_SECTION_LABEL = 'デフォルトに戻す';
export const THEME_SECTION_NAV_ARIA_LABEL = 'テーマ設定セクション';
export const THEME_COLOR_TEXT_PLACEHOLDER = '例: 0 0 0 2px rgba(50,122,237,0.3)';

export { CAMEL_TO_SNAKE_THEME } from 'v2/utils/designThemeCore';
