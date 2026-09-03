import IconManDefault from 'v2/assets/img/bot-icon/man1_new.png';
import IconWomenDefault from 'v2/assets/img/bot-icon/women1_new.png';
import IconWomen4 from 'v2/assets/img/bot-icon/women4_new.png';
import IconWomen5 from 'v2/assets/img/bot-icon/women5_new.png';
import IconWomen6 from 'v2/assets/img/bot-icon/women6_new.png';
import IconWomen7 from 'v2/assets/img/bot-icon/women7_new.png';
import IconWomen8 from 'v2/assets/img/bot-icon/women8_new.png';
import IconWomen9 from 'v2/assets/img/bot-icon/women9_new.png';
import IconWomen10 from 'v2/assets/img/bot-icon/women10_new.png';
import IconWomen11 from 'v2/assets/img/bot-icon/women11_new.png';
import {
  API_SUCCESS_CODE,
  BOT_ID_COOKIE_KEY,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
} from 'v2/api/constants';

export {
  API_SUCCESS_CODE,
  BOT_ID_COOKIE_KEY,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
};

export const TAB_BASIC = 1;
export const TAB_DESIGN = 2;

export { TAB_THEME } from './designThemeConstants';

export const OPEN_ANIMATION_DURATION_MS_DEFAULT = 1000;
export const OPEN_ANIMATION_DURATION_MS_MIN = 0;
export const OPEN_ANIMATION_DURATION_MS_MAX = 10000;

export const OPEN_ANIMATION_STYLE_SLIDE_UP = 'slide_up';
export const OPEN_ANIMATION_STYLE_FADE_IN = 'fade_in';
export const OPEN_ANIMATION_STYLE_ZOOM_IN = 'zoom_in';
export const OPEN_ANIMATION_STYLE_SLIDE_FROM_RIGHT = 'slide_from_right';
export const OPEN_ANIMATION_STYLE_EXPAND_FROM_CORNER = 'expand_from_corner';
export const OPEN_ANIMATION_STYLE_DEFAULT = OPEN_ANIMATION_STYLE_SLIDE_UP;

export const OPEN_ANIMATION_STYLES = [
  { value: OPEN_ANIMATION_STYLE_SLIDE_UP, label: 'スライドアップ' },
  { value: OPEN_ANIMATION_STYLE_FADE_IN, label: 'フェードイン' },
  { value: OPEN_ANIMATION_STYLE_ZOOM_IN, label: 'ズームイン' },
  { value: OPEN_ANIMATION_STYLE_SLIDE_FROM_RIGHT, label: '右からスライド' },
  { value: OPEN_ANIMATION_STYLE_EXPAND_FROM_CORNER, label: '角から拡大する' },
];

export const CHAT_BODY_VERSION_1 = '1.0';
export const CHAT_BODY_VERSION_2 = '2.0';
export const CHAT_BODY_VERSION_DEFAULT = CHAT_BODY_VERSION_2;

export const CHAT_BODY_VERSIONS = [
  { value: CHAT_BODY_VERSION_1, label: '1.0' },
  { value: CHAT_BODY_VERSION_2, label: '2.0' },
];

export const MAIN_COLORS = [
  '#327AED',
  '#26B197',
  '#fC7E02',
  '#F6CA21',
  '#F16FAA',
  '#8C66D9',
  '#7C8290',
  '#D8E2EF',
];

export const COLOR_MAP = {
  blue: '#327AED',
  green: '#26B197',
  orange: '#fC7E02',
  yellow: '#F6CA21',
  pink: '#F16FAA',
  purple: '#8C66D9',
  black: '#7C8290',
  white: '#D8E2EF',
};

export const DESIGN_TYPE_POP = 'pop';
export const DESIGN_TYPE_FLAT = 'flat';
export const DESIGN_TYPE_MATERIAL = 'material';
export const DESIGN_TYPE_DEFAULT = DESIGN_TYPE_FLAT;

export const DESIGN_TYPES = [
  { value: DESIGN_TYPE_POP, label: 'ポップ' },
  { value: DESIGN_TYPE_FLAT, label: 'フラット' },
  { value: DESIGN_TYPE_MATERIAL, label: 'マテリアル' },
];

export const DEFAULT_IMAGES = [
  IconManDefault,
  IconWomenDefault,
  IconWomen4,
  IconWomen5,
  IconWomen6,
  IconWomen7,
  IconWomen8,
  IconWomen9,
  IconWomen10,
  IconWomen11,
];

export const VALIDATION_MESSAGES = {
  title: 'タイトルは、必ず指定してください。',
  subtitle: 'サブタイトルは、必ず指定してください。',
  botName: 'ボット名は、必ず指定してください。',
  botImage: '画像を選択してください。',
};

export const DEFAULT_MAIN_COLOR = '#327AED';

export const TAB_BASIC_LABEL = '基本情報';
export const TAB_DESIGN_LABEL = 'デザインカスタマイズ';
export const TAB_THEME_LABEL = 'テーマカスタマイズ';
export const SCL_BUTTON_LABEL = 'SCL';
export const SCENARIO_LIST_PATH = '/v2/admin/scenario-list';
export const BOT_LIST_PATH = '/v2/admin/bot';

export const MODE_EDIT = 'edit';
export const MODE_CREATE = 'create';
export const CREATE_BOT_LABEL = 'ボット作成';
export const CREATE_BOT_SUCCESS = 'ボットを正常に作成されました！';
export const CREATE_REDIRECT_DELAY_MS = 1500;
export const DEFAULT_ICON_PRESET_INDEX = 0;

export const START_BUTTON_PLACEHOLDER = '開始ボタン（準備中）';
export const CHAT_BODY_PLACEHOLDER = 'チャット本文（準備中）';

export const CHATBOTS_API_PATH = '/api/v1/managements/chatbots';
export const CHATBOTS_API_PATH_RELATIVE = 'api/v1/managements/chatbots';
export const DESIGN_SETTINGS_SUFFIX = 'design_settings';

export const API_SUCCESS_CODE_STRING = '1';
export const API_WARNING_CODE = 2;
export const API_WARNING_CODE_STRING = '2';
export const TOKEN_EXPIRED_CODE = 0;

export const NOTIFICATION_SUCCESS_MS = 1500;
export const NOTIFICATION_WARNING_MS = 0;

export const IMAGE_TYPE_PNG = 'image/png';
export const IMAGE_TYPE_JPEG = 'image/jpeg';
export const IMAGE_TYPE_JPG = 'image/jpg';

export const ICON_LOAD_ERROR = 'アイコンの読み込みに失敗しました。';
export const SAVE_BOT_SUCCESS = 'ボットを正常に保存されました！';
export const SAVE_DESIGN_SUCCESS = 'ボット設定を正常に保存されました！';

export const BASIC_INFO_SECTION_TITLE = 'ボット設定';
export const LABEL_BOT_NAME = 'ボット名称';
export const LABEL_CHAT_BODY_VERSION = 'チャット本体バージョン';
export const LABEL_OPEN_ANIMATION_DURATION = '起動アニメーション速度';
export const LABEL_OPEN_ANIMATION_STYLE = '起動アニメーションスタイル';
export const LABEL_TITLE = 'タイトル';
export const LABEL_SUBTITLE = 'サブタイトル';
export const LABEL_DESIGN_TYPE = 'デザインタイプ';
export const DURATION_UNIT_MS = 'ms';

export const PLACEHOLDER_BOT_NAME = 'サンプルボット...';
export const PLACEHOLDER_TITLE = 'サービス名など（例：BOTCHAN）';
export const PLACEHOLDER_SUBTITLE = 'フォームの目的（例：資料請求フォーム）';
export const BOT_NAME_HINT = '※EC-CHAT管理用の名称です。ボット内で表示されることはありません。';
export const CHAT_BODY_VERSION_HINT =
  '※古いバージョンに変更すると、新しく実装された機能が正しく動作しない可能性があります。';

export const PREVIEW_CLOSED_TITLE = 'チャットを閉じたとき';
export const PREVIEW_OPEN_TITLE = 'チャットを開いたとき';
export const PREVIEW_REPLAY_LABEL = '再生';
export const PREVIEW_ICON_PLACEHOLDER = 'アイコン';
export const PREVIEW_TITLE_FALLBACK = 'タイトル';
export const PREVIEW_SUBTITLE_FALLBACK = 'サブタイトル';

export const DEVICE_PC = 'pc';
export const DEVICE_SP = 'sp';
export const WIDTH_UNIT_PX = 'px';
export const WIDTH_UNIT_PERCENT = '%';
export const PC_PANEL_TITLE = 'PC';
export const SP_PANEL_TITLE = 'スマートフォン';

export const DISPLAY_TYPE_RELOAD = 1;
export const DISPLAY_TYPE_HIDDEN = 2;
export const DISPLAY_TYPE_BUTTON = 3;
export const POSITION_BOTTOM = 1;
export const POSITION_RIGHT = 2;
export const BUTTON_TYPE_WITH_TITLE = 1;
export const BUTTON_TYPE_ONLY = 2;

export const DISPLAY_TYPE_OPTIONS = [
  { value: DISPLAY_TYPE_RELOAD, label: 'リロード' },
  { value: DISPLAY_TYPE_HIDDEN, label: '非表示' },
  { value: DISPLAY_TYPE_BUTTON, label: 'ボタン押下' },
];

export const POSITION_OPTIONS = [
  { value: POSITION_BOTTOM, label: '底辺に設置' },
  { value: POSITION_RIGHT, label: '右辺に設置' },
];

export const BUTTON_TYPE_OPTIONS = [
  { value: BUTTON_TYPE_WITH_TITLE, label: 'ボタンとタイトル' },
  { value: BUTTON_TYPE_ONLY, label: 'ボタンのみ' },
];

export const LABEL_DISPLAY_TYPE = '表示タイプ';
export const LABEL_SIZE = 'サイズ';
export const LABEL_POSITION = '設置場所';
export const LABEL_RIGHT_TITLE_PC = '右のタイトル';
export const LABEL_RIGHT_TITLE_SP = 'タイトル';
export const LABEL_BUTTON_CONTENT = 'ボタン内容';
export const LABEL_RIGHT_MARGIN = '右マージン';
export const LABEL_BOTTOM_MARGIN = '下マージン';
export const PLACEHOLDER_WIDTH = '幅';
export const PLACEHOLDER_HEIGHT = '高さ';
export const PLACEHOLDER_TITLE_FIELD = 'タイトル';
export const PLACEHOLDER_RIGHT_MARGIN = '右マージン';
export const PLACEHOLDER_BOTTOM_MARGIN = '下マージン';

export const BUBBLE_SECTION_TITLE = 'バブル設定';
export const LABEL_BUBBLE_TITLE = 'タイトル';
export const PLACEHOLDER_BUBBLE_TITLE = '簡単90秒で注文完了';

export const PRESET_COLOR_CUSTOM_LABEL = 'カスタム';
export const PRESET_COLOR_INPUT_ID_PREFIX = 'preset-color-';

export const THEME_PREVIEW_SAMPLE_TITLE = 'サンプルタイトル';
export const THEME_PREVIEW_SAMPLE_SUBTITLE = 'サンプルサブタイトル';
export const THEME_PREVIEW_PROCESS_LABEL = '1 / 3';
export const THEME_PREVIEW_HEADER_ICON_ALT = 'bot-header-icon';
export const THEME_CSS_VAR_MAIN_COLOR = '--theme-main-color';
export const THEME_CSS_VAR_PROGRESS_WIDTH = '--progress-bar-width';
export const THEME_CSS_VAR_ANIMATION_DURATION = '--chatbot-open-animation-duration';

export const REQUIRED_BADGE = '必須';
export const SELECT_ICON_LABEL = 'アイコンを選択';
export const MESSAGE_ICON_LABEL = 'メッセージアイコン';
export const OPENING_ICON_LABEL = '開く時のボットアイコン';
export const CLOSING_ICON_LABEL = '閉じる時のボットアイコン';
export const ICON_ADD_PLUS = '+';

export const PREVIEW_BOT_MESSAGE = 'ボットからのメッセージです';
export const PREVIEW_USER_MESSAGE = 'ユーザーのメッセージです';
export const PREVIEW_LABEL_TEXT = 'ラベルテキスト';
export const PREVIEW_FIELD_TITLE = 'フィールドタイトル';
export const PREVIEW_REQUIRED_FIELD = '必須フィールド';
export const PREVIEW_REQUIRED_MARK = '※必須';
export const PREVIEW_INPUT_PLACEHOLDER = 'テキスト入力';
export const PREVIEW_INPUT_BLUR_PLACEHOLDER = 'テキスト入力（非フォーカス）';
export const PREVIEW_INPUT_FOCUS_PLACEHOLDER = 'テキスト入力（フォーカス）';
export const PREVIEW_VALIDATION_MESSAGE = '入力してください';
export const PREVIEW_PULLDOWN_BLUR = 'プルダウン（非フォーカス）';
export const PREVIEW_PULLDOWN_FOCUS = 'プルダウン（フォーカス）';
export const PREVIEW_OPTION_ONE = '選択肢 1';
export const PREVIEW_OPTION_VALUE = '1';
export const PREVIEW_CHECKBOX_UNCHECKED = '未チェック';
export const PREVIEW_CHECKBOX_CHECKED = 'チェック済み';
export const PREVIEW_RADIO_UNSELECTED = '未選択';
export const PREVIEW_RADIO_SELECTED = '選択済み';
export const PREVIEW_BUTTON_NORMAL = '通常';
export const PREVIEW_BUTTON_PRESSED = '押下';
export const PREVIEW_BUTTON_DISABLED = '無効';
export const PREVIEW_SAMPLE_ERROR = '入力内容に誤りがあります。ご確認ください。';
export const PREVIEW_PROCESS_PERCENT = 33;

export const MODAL_CLOSE_CONFIRM = '本当に閉じますか？';
export const MODAL_BACK_TO_CHAT = 'チャットに戻る';
export const MODAL_CLOSE = '閉じる';
