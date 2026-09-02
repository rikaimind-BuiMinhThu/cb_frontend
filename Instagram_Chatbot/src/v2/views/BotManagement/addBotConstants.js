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

export const DEFAULT_BOT_ICON = IconManDefault;

export const BOT_ICONS = [
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

export const CHATBOTS_API_PATH = '/api/v1/managements/chatbots';
export const SCENARIO_LIST_PATH = '/v2/admin/scenario-list';
export const BOT_LIST_PATH = '/v2/admin/bot';
export const CREATE_REDIRECT_DELAY_MS = 1500;

export const DEFAULT_MAIN_COLOR = '#327AED';
export const CUSTOM_COLOR_INDEX = 999;
export const DEFAULT_COLOR_INDEX = 0;
export const DEFAULT_ICON_INDEX = 0;

export const DESIGN_TYPE_POP = 'pop';
export const DESIGN_TYPE_FLAT = 'flat';
export const DESIGN_TYPE_MATERIAL = 'material';
export const DEFAULT_DESIGN_TYPE = DESIGN_TYPE_FLAT;

export const IMAGE_TYPE_PNG = 'image/png';
export const IMAGE_TYPE_JPEG = 'image/jpeg';
export const IMAGE_TYPE_JPG = 'image/jpg';
export const ACCEPT_IMAGE = 'image/png, image/jpeg';
export const DATA_URL_PNG_TOKEN = 'image/png;base64';

export const API_SUCCESS_CODE_STRING = '1';
export const API_WARNING_CODE = 2;
export const API_WARNING_CODE_STRING = '2';
export const TOKEN_EXPIRED_CODE = 0;

export const INPUT_ID_TITLE = 'bot-title';
export const INPUT_ID_SUBTITLE = 'bot-subtitle';
export const INPUT_ID_BOT_NAME = 'bot-name';
export const INPUT_ID_BOT_IMAGE = 'bot_image';
export const INPUT_NAME_TITLE = 'title';
export const INPUT_NAME_BOT_IMAGE = 'bot_image';

export const LABEL_TITLE = 'タイトル';
export const LABEL_SUBTITLE = 'サブタイトル';
export const LABEL_DESIGN_TYPE = 'デザインタイプ';
export const LABEL_MAIN_COLOR = 'メインカラー';
export const LABEL_ICON = 'アイコン';
export const LABEL_BOT_NAME = 'ボット名称';
export const LABEL_CUSTOM_COLOR = 'カスタム';
export const PREVIEW_BUTTON = 'プレビュー';
export const CREATE_BOT_LABEL = 'ボット作成';
export const SCL_BUTTON_LABEL = 'SCL';

export const DESIGN_TYPE_POP_LABEL = 'ポップ';
export const DESIGN_TYPE_FLAT_LABEL = 'フラット';
export const DESIGN_TYPE_MATERIAL_LABEL = 'マテリアル';

export const PLACEHOLDER_TITLE = 'サービス名など（例：BOTCHAN）';
export const PLACEHOLDER_SUBTITLE = 'フォームの目的（例：資料請求フォーム）';
export const PLACEHOLDER_BOT_NAME = 'サンプルボット...';
export const BOT_NAME_HINT = '※EC-CHAT管理用の名称です。ボット内で表示されることはありません。';

export const ERROR_TITLE_REQUIRED = 'タイトルは、必ず指定してください。';
export const ERROR_SUBTITLE_REQUIRED = 'サブタイトルは、必ず指定してください。';
export const ERROR_BOT_NAME_REQUIRED = 'ボット名は、必ず指定してください。';
export const ERROR_BOT_IMAGE_REQUIRED = '画像を選択してください。';
export const SUCCESS_BOT_CREATED = 'ボットを正常に作成されました！';

export const ADD_ICON_PLUS = '+';
export const EMPTY_STRING = '';
export const CSS_VAR_BOT_MAIN_COLOR = '--bot-main-color';
