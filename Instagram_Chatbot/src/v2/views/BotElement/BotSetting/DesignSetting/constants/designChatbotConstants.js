import IconManDefault from '../../../../../assets/img/bot-icon/man1_new.png';
import IconWomenDefault from '../../../../../assets/img/bot-icon/women1_new.png';
import IconWomen4 from '../../../../../assets/img/bot-icon/women4_new.png';
import IconWomen5 from '../../../../../assets/img/bot-icon/women5_new.png';
import IconWomen6 from '../../../../../assets/img/bot-icon/women6_new.png';
import IconWomen7 from '../../../../../assets/img/bot-icon/women7_new.png';
import IconWomen8 from '../../../../../assets/img/bot-icon/women8_new.png';
import IconWomen9 from '../../../../../assets/img/bot-icon/women9_new.png';
import IconWomen10 from '../../../../../assets/img/bot-icon/women10_new.png';
import IconWomen11 from '../../../../../assets/img/bot-icon/women11_new.png';

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

export const DEFAULT_MAIN_COLOR = '#327AED'; // Bug #4 / #8: restore Header → Main Color test case.
export const DEFAULT_MAIN_COLOR_KEY = 'blue';

export const MAIN_COLORS = [
  DEFAULT_MAIN_COLOR,
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

export const DESIGN_TYPES = [
  { value: 'pop', label: 'ポップ' },
  { value: 'flat', label: 'フラット' },
  { value: 'material', label: 'マテリアル' },
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
  subtitle: 'サブタイトルは、必ず指定ください。',
  botName: 'ボット名は、必ず指定してください。',
  botImage: '画像を選択してください。',
};

export const SELECT_STYLE = {
  height: '40px',
  width: '100%',
  border: '1px solid #333',
  borderRadius: '5px',
  padding: '0 15px',
};
