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
