export const TAB_THEME = 3;

export const FIELD_FOCUS_EFFECT_OPTIONS = [
  { id: 'none', label: 'なし' },
  { id: 'outline_soft', label: 'アウトライン（ソフト）' },
  { id: 'outline_strong', label: 'アウトライン（強）' },
  { id: 'border_fade', label: '枠線フェード' },
  { id: 'border_pulse', label: '枠線パルス' },
];

export const FIELD_FOCUS_EFFECT_IDS = FIELD_FOCUS_EFFECT_OPTIONS.map(({ id }) => id);

export const THEME_FIELD_KEYS = [
  'headerTextColor',
  'progressBarBgColor',
  'progressBarTextColor',
  'chatWindowBgColor',
  'botMessageBgColor',
  'botMessageTextColor',
  'userMessageBgColor',
  'userMessageTextColor',
  'fieldFocusBorderColor',
  'fieldFocusBgColor',
  'fieldFocusBgEffect',
  'fieldUnfocusBorderColor',
  'fieldUnfocusBgColor',
  'buttonNormalBgColor',
  'buttonNormalTextColor',
  'buttonPressedBgColor',
  'buttonPressedTextColor',
  'buttonDisabledBgColor',
  'buttonDisabledTextColor',
  'checkboxUncheckedBgColor',
  'checkboxUncheckedBorderColor',
  'checkboxCheckedBgColor',
  'checkboxCheckedBorderColor',
  'radioUnselectedBgColor',
  'radioSelectedBgColor',
  'radioUnselectedBorderColor',
  'radioSelectedBorderColor',
  'radioInputUnselectedColor',
  'radioInputSelectedColor',
  'errorMessageBgColor',
  'errorMessageTextColor',
  'errorMessageFontSize',
];

export const THEME_MAIN_COLOR_SECTION = {
  id: 'mainColor',
  title: 'メインカラー',
};

export const THEME_PREVIEW_REGIONS = [
  { sectionId: 'mainColor', label: 'メインカラー', targets: ['header', 'progressFill'] },
  { sectionId: 'header', label: 'ヘッダー', targets: ['headerText'] },
  { sectionId: 'progress', label: 'プログレスバー', targets: ['progressBar'] },
  { sectionId: 'window', label: 'チャットウィンドウ', targets: ['chatBody'] },
  { sectionId: 'messages', label: 'メッセージ', targets: ['botBubble', 'userBubble'] },
  { sectionId: 'fields', label: '入力・プルダウン', targets: ['inputs'] },
  { sectionId: 'buttons', label: 'ボタン', targets: ['buttons'] },
  { sectionId: 'checkbox', label: 'チェックボックス', targets: ['checkboxes'] },
  { sectionId: 'radio', label: 'ラジオボタン', targets: ['radios'] },
  { sectionId: 'errors', label: 'エラーメッセージ', targets: ['errorBanner'] },
];

export const THEME_SECTIONS = [
  {
    id: 'header',
    title: 'ヘッダー',
    fields: [
      { key: 'headerTextColor', label: 'テキスト色', fullWidth: true },
    ],
  },
  {
    id: 'progress',
    title: 'プログレスバー',
    fields: [
      { key: 'progressBarBgColor', label: 'プログレスバー背景色' },
      { key: 'progressBarTextColor', label: 'プログレスバーテキスト色' },
    ],
  },
  {
    id: 'window',
    title: 'チャットウィンドウ',
    fields: [
      { key: 'chatWindowBgColor', label: 'チャットウィンドウ背景色', fullWidth: true },
    ],
  },
  {
    id: 'messages',
    title: 'メッセージ',
    fields: [
      { key: 'botMessageBgColor', label: 'ボットメッセージ背景色' },
      { key: 'botMessageTextColor', label: 'ボットメッセージ文字色' },
      { key: 'userMessageBgColor', label: 'ユーザーメッセージ背景色' },
      { key: 'userMessageTextColor', label: 'ユーザーメッセージ文字色' },
    ],
  },
  {
    id: 'fields',
    title: '入力・プルダウン',
    fields: [
      { key: 'fieldFocusBorderColor', label: '入力欄・プルダウン（フォーカス時）枠線色' },
      { key: 'fieldFocusBgColor', label: '入力欄・プルダウン（フォーカス時）背景色' },
      {
        key: 'fieldFocusBgEffect',
        label: '入力欄・プルダウン（フォーカス時）効果',
        fieldType: 'effectSelect',
        fullWidth: true,
      },
      { key: 'fieldUnfocusBorderColor', label: '入力欄・プルダウン（通常時）枠線色' },
      { key: 'fieldUnfocusBgColor', label: '入力欄・プルダウン（通常時）背景色' },
    ],
  },
  {
    id: 'buttons',
    title: 'ボタン',
    fields: [
      { key: 'buttonNormalBgColor', label: 'ボタン（通常時）背景色' },
      { key: 'buttonNormalTextColor', label: 'ボタン（通常時）文字色' },
      { key: 'buttonPressedBgColor', label: 'ボタン（押下時）背景色' },
      { key: 'buttonPressedTextColor', label: 'ボタン（押下時）文字色' },
      { key: 'buttonDisabledBgColor', label: 'ボタン（無効時）背景色' },
      { key: 'buttonDisabledTextColor', label: 'ボタン（無効時）文字色' },
    ],
  },
  {
    id: 'checkbox',
    title: 'チェックボックス',
    fields: [
      { key: 'checkboxUncheckedBgColor', label: 'チェックボックス（未選択）背景色' },
      { key: 'checkboxUncheckedBorderColor', label: 'チェックボックス（未選択）枠線色' },
      { key: 'checkboxCheckedBgColor', label: 'チェックボックス（選択時）背景色' },
      { key: 'checkboxCheckedBorderColor', label: 'チェックボックス（選択時）枠線色' },
    ],
  },
  {
    id: 'radio',
    title: 'ラジオボタン',
    fields: [
      { key: 'radioUnselectedBgColor', label: 'ラジオボタン（未選択）背景色' },
      { key: 'radioSelectedBgColor', label: 'ラジオボタン（選択時）背景色' },
      { key: 'radioUnselectedBorderColor', label: 'ラジオボタン（未選択）枠線色' },
      { key: 'radioSelectedBorderColor', label: 'ラジオボタン（選択時）枠線色' },
      { key: 'radioInputUnselectedColor', label: 'ラジオ input（未選択）スタイル' },
      { key: 'radioInputSelectedColor', label: 'ラジオ input（選択時）スタイル' },
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
];

export const THEME_SECTION_NAV_ITEMS = [
  THEME_MAIN_COLOR_SECTION,
  ...THEME_SECTIONS.map(({ id, title }) => ({ id, title })),
];

export const CAMEL_TO_SNAKE_THEME = {
  headerTextColor: 'header_text_color',
  progressBarBgColor: 'progress_bar_bg_color',
  progressBarTextColor: 'progress_bar_text_color',
  chatWindowBgColor: 'chat_window_bg_color',
  botMessageBgColor: 'bot_message_bg_color',
  botMessageTextColor: 'bot_message_text_color',
  userMessageBgColor: 'user_message_bg_color',
  userMessageTextColor: 'user_message_text_color',
  fieldFocusBorderColor: 'field_focus_border_color',
  fieldFocusBgColor: 'field_focus_bg_color',
  fieldFocusBgEffect: 'field_focus_bg_effect',
  fieldUnfocusBorderColor: 'field_unfocus_border_color',
  fieldUnfocusBgColor: 'field_unfocus_bg_color',
  buttonNormalBgColor: 'button_normal_bg_color',
  buttonNormalTextColor: 'button_normal_text_color',
  buttonPressedBgColor: 'button_pressed_bg_color',
  buttonPressedTextColor: 'button_pressed_text_color',
  buttonDisabledBgColor: 'button_disabled_bg_color',
  buttonDisabledTextColor: 'button_disabled_text_color',
  checkboxUncheckedBgColor: 'checkbox_unchecked_bg_color',
  checkboxUncheckedBorderColor: 'checkbox_unchecked_border_color',
  checkboxCheckedBgColor: 'checkbox_checked_bg_color',
  checkboxCheckedBorderColor: 'checkbox_checked_border_color',
  radioUnselectedBgColor: 'radio_unselected_bg_color',
  radioSelectedBgColor: 'radio_selected_bg_color',
  radioUnselectedBorderColor: 'radio_unselected_border_color',
  radioSelectedBorderColor: 'radio_selected_border_color',
  radioInputUnselectedColor: 'radio_input_unselected_color',
  radioInputSelectedColor: 'radio_input_selected_color',
  errorMessageBgColor: 'error_message_bg_color',
  errorMessageTextColor: 'error_message_text_color',
  errorMessageFontSize: 'error_message_font_size',
};
