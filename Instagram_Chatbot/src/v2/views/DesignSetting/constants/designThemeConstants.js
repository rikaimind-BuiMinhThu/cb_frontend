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
  { id: 'shake', label: '横揺れ' },
];

export const BUTTON_EFFECT_IDS = BUTTON_EFFECT_OPTIONS.map(({ id }) => id);

export const HEADER_CHROME_OPTIONS = [
  { id: 'title_only', label: 'タイトルのみ' },
  { id: 'icon_and_title', label: 'アイコンとタイトル' },
];

export const HEADER_CHROME_IDS = HEADER_CHROME_OPTIONS.map(({ id }) => id);

export const HEADER_TITLE_ALIGNMENT_OPTIONS = [
  { id: 'left', label: '左' },
  { id: 'center', label: '中央' },
  { id: 'right', label: '右' },
];

export const HEADER_TITLE_ALIGNMENT_IDS = HEADER_TITLE_ALIGNMENT_OPTIONS.map(({ id }) => id);

export const HEADER_CLOSE_ICON_OPTIONS = [
  { id: 'chevron', label: '矢印' },
  { id: 'times', label: '×' },
];

export const HEADER_CLOSE_ICON_IDS = HEADER_CLOSE_ICON_OPTIONS.map(({ id }) => id);

export const PROGRESS_LABEL_MODE_OPTIONS = [
  { id: 'remaining', label: 'あとN問' },
  { id: 'fraction', label: 'n/N' },
];

export const PROGRESS_LABEL_MODE_IDS = PROGRESS_LABEL_MODE_OPTIONS.map(({ id }) => id);

export const PROGRESS_BAR_STYLE_OPTIONS = [
  { id: 'style1', label: 'スタイル1' },
  { id: 'style2', label: 'スタイル2' },
];

export const PROGRESS_BAR_STYLE_IDS = PROGRESS_BAR_STYLE_OPTIONS.map(({ id }) => id);

export const FIELD_PLACEHOLDER_STYLE_OPTIONS = [
  { id: 'native', label: 'ネイティブ' },
  { id: 'float', label: 'フローティング' },
];

export const FIELD_PLACEHOLDER_STYLE_IDS = FIELD_PLACEHOLDER_STYLE_OPTIONS.map(({ id }) => id);

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
  'headerTitleBold',
  'headerSubtitleVisible',
  'headerSubtitleTextColor',
  'headerSubtitleFontSize',
  'headerSubtitleBold',
  'headerChrome',
  'headerTitleAlignment',
  'headerCloseIcon',
  'headerCloseIconColor',
  'headerBgColor',
  'headerLogoImage',
  'headerHeight',
  'progressBarContainerBgColor',
  'progressBarBgColor',
  'progressBarTextColor',
  'progressBarFontSize',
  'progressBarBold',
  'progressBarHeight',
  'progressBarRadius',
  'progressBarFillColor',
  'progressBarStyle',
  'progressLabelMode',
  'progressBarAboveText',
  'progressBarCompletedHtml',
  'chatWindowBgColor',
  'botMessageBgColor',
  'botMessageTextColor',
  'botMessageFontSize',
  'botMessageBold',
  'botMessageBorderStyle',
  'userMessageBgColor',
  'userMessageTextColor',
  'userMessageFontSize',
  'userMessageBold',
  'userMessageBorderStyle',
  'fieldFocusBorderColor',
  'fieldFocusBorderWidth',
  'fieldFocusBgColor',
  'fieldFocusBgEffect',
  'fieldUnfocusBorderColor',
  'fieldUnfocusBorderWidth',
  'fieldUnfocusBgColor',
  'fieldFontSize',
  'fieldTextBold',
  'fieldPlaceholderBold',
  'fieldPlaceholderStyle',
  'fieldPlaceholderFontSize',
  'fieldPlaceholderFocusFontSize',
  'fieldTitleBold',
  'fieldTitleFontSize',
  'fieldTitleLetterSpacing',
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
  'buttonBold',
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
  'thanksMessageBgColor',
  'thanksMessageTextColor',
  'thanksMessageFontSize',
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
  { sectionId: 'mainWindow', label: 'メインカラー・チャットウィンドウ', targets: ['chatBody'] },
  { sectionId: 'header', label: 'ヘッダー', targets: ['header', 'headerText'] },
  { sectionId: 'progress', label: 'プログレスバー', targets: ['progressBar'] },
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
  { sectionId: 'thanks', label: 'サンクスメッセージ', targets: ['thanksBanner'] },
  { sectionId: 'modal', label: 'モーダル', targets: ['modalPreview'] },
];

export const THEME_MAIN_COLOR_HELPER =
  'メインカラーを変更しても個別設定は自動では上書きされません。セクションごとに「デフォルトに戻す」で再計算できます。';

export const THEME_SECTIONS = [
  {
    id: 'mainWindow',
    title: 'メインカラー・チャットウィンドウ',
    fields: [
      { fieldType: 'mainColor', label: 'メインカラー' },
      { key: 'chatWindowBgColor', label: 'チャットウィンドウ背景色' },
      { fieldType: 'helperText', text: THEME_MAIN_COLOR_HELPER, fullWidth: true },
    ],
  },
  {
    id: 'header',
    title: 'ヘッダー',
    fields: [
      { fieldType: 'groupLabel', label: 'タイトル' },
      { key: 'headerTitleTextColor', label: '文字色' },
      { key: 'headerTitleFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'headerTitleBold', label: '太字', fieldType: 'checkbox' },
      { fieldType: 'groupLabel', label: 'サブタイトル' },
      {
        key: 'headerSubtitleVisible',
        label: '表示',
        fieldType: 'checkbox',
      },
      {
        key: 'headerSubtitleTextColor',
        label: '文字色',
        visibleWhen: { key: 'headerSubtitleVisible', value: true },
      },
      {
        key: 'headerSubtitleFontSize',
        label: 'フォントサイズ',
        fieldType: 'fontSize',
        visibleWhen: { key: 'headerSubtitleVisible', value: true },
      },
      {
        key: 'headerSubtitleBold',
        label: '太字',
        fieldType: 'checkbox',
        visibleWhen: { key: 'headerSubtitleVisible', value: true },
      },
      { fieldType: 'groupLabel', label: 'ヘッダー見た目' },
      {
        key: 'headerChrome',
        label: '表示',
        fieldType: 'headerChromeSelect',
      },
      {
        key: 'headerTitleAlignment',
        label: '配置',
        fieldType: 'headerTitleAlignmentSelect',
      },
      {
        key: 'headerCloseIcon',
        label: '閉じるアイコン',
        fieldType: 'headerCloseIconSelect',
      },
      { key: 'headerCloseIconColor', label: '閉じるアイコンの色' },
      { key: 'headerBgColor', label: '背景色' },
      {
        key: 'headerHeight',
        label: '高さ',
        fieldType: 'pxSize',
        min: 34,
        max: 120,
      },
    ],
  },
  {
    id: 'progress',
    title: 'プログレスバー',
    fields: [
      {
        key: 'progressBarStyle',
        label: 'スタイル',
        fieldType: 'progressBarStyleSelect',
      },
      {
        key: 'progressLabelMode',
        label: 'フォーマット',
        fieldType: 'progressLabelModeSelect',
      },
      {
        key: 'progressBarAboveText',
        label: '表示テキスト',
        fieldType: 'text',
        fullWidth: true,
        visibleWhen: { key: 'progressBarStyle', value: 'style2' },
      },
      {
        key: 'progressBarCompletedHtml',
        label: '完了時メッセージ（HTML）',
        fieldType: 'textarea',
        fullWidth: true,
      },
      { key: 'progressBarContainerBgColor', label: 'コンテナ背景色' },
      { key: 'progressBarBgColor', label: '背景色' },
      { key: 'progressBarFillColor', label: '塗り色' },
      { key: 'progressBarTextColor', label: '文字色' },
      { key: 'progressBarFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'progressBarBold', label: '太字', fieldType: 'checkbox' },
      {
        key: 'progressBarHeight',
        label: '高さ',
        fieldType: 'pxSize',
        min: 4,
        max: 40,
      },
      {
        key: 'progressBarRadius',
        label: '角丸',
        fieldType: 'pxSize',
        min: 0,
        max: 40,
      },
    ],
  },
  {
    id: 'messages',
    title: 'メッセージ',
    fields: [
      { fieldType: 'groupLabel', label: 'ボット' },
      { key: 'botMessageBgColor', label: '背景色' },
      { key: 'botMessageTextColor', label: '文字色' },
      { key: 'botMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'botMessageBold', label: '太字', fieldType: 'checkbox' },
      {
        key: 'botMessageBorderStyle',
        label: '枠スタイル',
        fieldType: 'messageBorderStyleSelect',
      },
      { fieldType: 'groupLabel', label: 'ユーザー' },
      { key: 'userMessageBgColor', label: '背景色' },
      { key: 'userMessageTextColor', label: '文字色' },
      { key: 'userMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'userMessageBold', label: '太字', fieldType: 'checkbox' },
      {
        key: 'userMessageBorderStyle',
        label: '枠スタイル',
        fieldType: 'messageBorderStyleSelect',
      },
    ],
  },
  {
    id: 'fields',
    title: '入力・プルダウン',
    fields: [
      { key: 'fieldFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'fieldTextBold', label: '入力文字の太字', fieldType: 'checkbox' },
      { fieldType: 'groupLabel', label: 'タイトル' },
      { key: 'fieldTitleFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'fieldTitleBold', label: '太字', fieldType: 'checkbox' },
      {
        key: 'fieldTitleLetterSpacing',
        label: '字間',
        fieldType: 'pxSize',
        min: 0,
        max: 10,
      },
      { fieldType: 'groupLabel', label: 'プレースホルダー' },
      {
        key: 'fieldPlaceholderStyle',
        label: 'スタイル',
        fieldType: 'placeholderStyleSelect',
      },
      { key: 'fieldPlaceholderFontSize', label: '通常サイズ', fieldType: 'fontSize' },
      { key: 'fieldPlaceholderBold', label: '太字', fieldType: 'checkbox' },
      {
        key: 'fieldPlaceholderFocusFontSize',
        label: 'フォーカス時サイズ',
        fieldType: 'fontSize',
        visibleWhen: { key: 'fieldPlaceholderStyle', value: 'float' },
      },
      { fieldType: 'groupLabel', label: 'フォーカス時' },
      { key: 'fieldFocusBorderColor', label: '枠線色' },
      { key: 'fieldFocusBorderWidth', label: '枠線の太さ', fieldType: 'borderWidth' },
      { key: 'fieldFocusBgColor', label: '背景色' },
      {
        key: 'fieldFocusBgEffect',
        label: '効果',
        fieldType: 'effectSelect',
      },
      { fieldType: 'groupLabel', label: '通常時' },
      { key: 'fieldUnfocusBorderColor', label: '枠線色' },
      { key: 'fieldUnfocusBorderWidth', label: '枠線の太さ', fieldType: 'borderWidth' },
      { key: 'fieldUnfocusBgColor', label: '背景色' },
    ],
  },
  {
    id: 'validation',
    title: 'バリデーション・必須ラベル',
    fields: [
      { fieldType: 'groupLabel', label: 'バリデーションメッセージ' },
      { key: 'validationMessageBgColor', label: '背景色' },
      { key: 'validationMessageTextColor', label: 'テキスト色' },
      { key: 'validationMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { fieldType: 'groupLabel', label: '必須ラベル' },
      { key: 'requiredLabelTextColor', label: 'テキスト色' },
      { key: 'requiredLabelFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
    ],
  },
  {
    id: 'buttons',
    title: 'ボタン',
    fields: [
      { key: 'buttonFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { key: 'buttonBold', label: '太字', fieldType: 'checkbox' },
      {
        key: 'buttonBorderStyle',
        label: '枠線スタイル',
        fieldType: 'borderStyleSelect',
      },
      {
        key: 'buttonEffect',
        label: '効果',
        fieldType: 'effectSelect',
        effectOptions: 'buttonBounce',
      },
      { key: 'buttonWidth', label: '幅', fieldType: 'dimension', unit: '%' },
      {
        key: 'buttonPadding',
        label: 'パディング',
        fieldType: 'dimension',
        unitOptions: ['%', 'px'],
      },
      { key: 'buttonPosition', label: 'ボタン位置', fieldType: 'positionSelect' },
      { fieldType: 'groupLabel', label: '通常時' },
      { key: 'buttonNormalBgColor', label: '背景色' },
      { key: 'buttonNormalTextColor', label: '文字色' },
      { fieldType: 'groupLabel', label: '押下時' },
      { key: 'buttonPressedBgColor', label: '背景色' },
      { key: 'buttonPressedTextColor', label: '文字色' },
      { fieldType: 'groupLabel', label: '無効時' },
      { key: 'buttonDisabledBgColor', label: '背景色' },
      { key: 'buttonDisabledTextColor', label: '文字色' },
    ],
  },
  {
    id: 'checkbox',
    title: 'チェックボックス',
    fields: [
      { key: 'checkboxFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { fieldType: 'groupLabel', label: '未選択' },
      { key: 'checkboxUncheckedBgColor', label: '背景色' },
      { key: 'checkboxUncheckedBorderColor', label: '枠線色' },
      { fieldType: 'groupLabel', label: '選択時' },
      { key: 'checkboxCheckedBgColor', label: '背景色' },
      { key: 'checkboxCheckedBorderColor', label: '枠線色' },
      {
        key: 'checkboxCheckedBorderEffect',
        label: '効果',
        fieldType: 'effectSelect',
        effectOptions: 'borderTwinkle',
      },
    ],
  },
  {
    id: 'radio',
    title: 'ラジオボタン',
    fields: [
      { key: 'radioFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      { fieldType: 'groupLabel', label: '未選択' },
      { key: 'radioUnselectedBgColor', label: '背景色' },
      { key: 'radioUnselectedBorderColor', label: '枠線色' },
      { fieldType: 'groupLabel', label: '選択時' },
      { key: 'radioSelectedBgColor', label: '背景色' },
      { key: 'radioSelectedBorderColor', label: '枠線色' },
      {
        key: 'radioSelectedBorderEffect',
        label: '効果',
        fieldType: 'effectSelect',
        effectOptions: 'borderTwinkle',
      },
      { fieldType: 'groupLabel', label: '入力欄' },
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
      { key: 'errorMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
    ],
  },
  {
    id: 'thanks',
    title: 'サンクスメッセージ',
    fields: [
      { key: 'thanksMessageBgColor', label: '背景色' },
      { key: 'thanksMessageTextColor', label: '文字色' },
      { key: 'thanksMessageFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
    ],
  },
  {
    id: 'modal',
    title: 'モーダル',
    fields: [
      { key: 'modalBgColor', label: '背景色' },
      { fieldType: 'groupLabel', label: 'タイトル' },
      { key: 'modalTitleTextColor', label: '文字色' },
      { key: 'modalTitleFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
      {
        key: 'modalTitleAlignment',
        label: '配置',
        fieldType: 'modalTitleAlignmentSelect',
      },
      { fieldType: 'groupLabel', label: 'ボタン' },
      { key: 'modalCancelButtonBgColor', label: 'キャンセル背景色' },
      { key: 'modalCancelButtonTextColor', label: 'キャンセル文字色' },
      { key: 'modalCancelButtonBorderColor', label: 'キャンセル枠線色' },
      { key: 'modalCloseButtonBgColor', label: '閉じる背景色' },
      { key: 'modalCloseButtonTextColor', label: '閉じる文字色' },
      { key: 'modalButtonFontSize', label: 'フォントサイズ', fieldType: 'fontSize' },
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
export const THEME_RESET_SECTION_LABEL = 'デフォルトに戻す';
export const THEME_SECTION_NAV_ARIA_LABEL = 'テーマ設定セクション';
export const THEME_COLOR_TEXT_PLACEHOLDER = '例: 0 0 0 2px rgba(50,122,237,0.3)';
export const THEME_IMAGE_FILE_ACCEPT = 'image/*';
export const THEME_IMAGE_SELECT_LABEL = '画像を選択';
export const THEME_IMAGE_REMOVE_LABEL = '削除';
export const THEME_IMAGE_UPLOAD_ALT = 'header logo';
export const THEME_PREVIEW_PROCESS_FRACTION_LABEL = '1/6';
export const THEME_PREVIEW_PROCESS_REMAINING_LABEL = 'あと6問';
export const HEADER_CHROME_TITLE_ONLY = 'title_only';
export const HEADER_CHROME_ICON_AND_TITLE = 'icon_and_title';
export const HEADER_CLOSE_ICON_CHEVRON = 'chevron';
export const HEADER_CLOSE_ICON_TIMES = 'times';
export const FIELD_PLACEHOLDER_STYLE_FLOAT = 'float';
export const PROGRESS_LABEL_MODE_FRACTION = 'fraction';
export const PROGRESS_LABEL_MODE_REMAINING = 'remaining';
export const PROGRESS_BAR_STYLE_1 = 'style1';
export const PROGRESS_BAR_STYLE_2 = 'style2';

export { CAMEL_TO_SNAKE_THEME } from 'v2/utils/designThemeCore';
