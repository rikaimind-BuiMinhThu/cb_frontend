export const RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2 = 'horizontal_equal_2';
export const RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3 = 'horizontal_equal_3';
export const RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2 = 'horizontal_custom_2';
export const RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3 = 'horizontal_custom_3';
export const RADIO_IMG_LAYOUT_VERTICAL = 'vertical';

export const DEFAULT_RADIO_IMG_LAYOUT_TYPE = RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2;

export const DEFAULT_RADIO_IMG_OPTION_PADDING = '0px';
export const DEFAULT_RADIO_IMG_OPTION_MARGIN = '5px';

export const RADIO_IMG_DIRECTION_HORIZONTAL = 'horizontal';
export const RADIO_IMG_DIRECTION_VERTICAL = 'vertical';

export const RADIO_IMG_WIDTH_MODE_EQUAL = 'equal';
export const RADIO_IMG_WIDTH_MODE_CUSTOM = 'custom';

export const DEFAULT_RADIO_IMG_CUSTOM_WIDTHS = {
  [RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2]: ['50', '50'],
  [RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3]: ['33', '33', '34'],
};

export const RADIO_IMG_DIRECTION_OPTIONS = [
  { key: RADIO_IMG_DIRECTION_HORIZONTAL, value: '横並び' },
  { key: RADIO_IMG_DIRECTION_VERTICAL, value: '縦並び' },
];

export const RADIO_IMG_COLUMN_OPTIONS = [
  { key: '2', value: '2列' },
  { key: '3', value: '3列' },
];

export const RADIO_IMG_WIDTH_MODE_OPTIONS = [
  { key: RADIO_IMG_WIDTH_MODE_EQUAL, value: '等幅' },
  { key: RADIO_IMG_WIDTH_MODE_CUSTOM, value: '%指定' },
];

export const RADIO_IMG_LAYOUT_SECTION_LABELS = {
  title: 'レイアウト設定',
  direction: '方向',
  columns: '列数',
  widthMode: '幅',
  customWidths: '列幅（%）',
  customWidthsHint: '合計が100%になるように設定してください',
  optionPadding: 'オプションのPadding',
  optionMargin: 'オプション間のMargin',
};
