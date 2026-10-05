export const RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2 = 'horizontal_equal_2';
export const RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3 = 'horizontal_equal_3';
export const RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2 = 'horizontal_custom_2';
export const RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3 = 'horizontal_custom_3';
export const RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_1 = 'horizontal_scroll_1';
export const RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_2 = 'horizontal_scroll_2';
export const RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_3 = 'horizontal_scroll_3';
export const RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_4 = 'horizontal_scroll_4';
export const RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_5 = 'horizontal_scroll_5';
export const RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_6 = 'horizontal_scroll_6';
export const RADIO_IMG_LAYOUT_VERTICAL = 'vertical';

export const DEFAULT_RADIO_IMG_LAYOUT_TYPE = RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2;

export const DEFAULT_RADIO_IMG_OPTION_PADDING = '0px';
export const DEFAULT_RADIO_IMG_OPTION_MARGIN = '5px';

export const RADIO_IMG_DIRECTION_HORIZONTAL = 'horizontal';
export const RADIO_IMG_DIRECTION_VERTICAL = 'vertical';

export const RADIO_IMG_WIDTH_MODE_EQUAL = 'equal';
export const RADIO_IMG_WIDTH_MODE_CUSTOM = 'custom';

export const RADIO_IMG_SCROLL_NONE = 'none';
export const RADIO_IMG_SCROLL_ENABLED = 'enabled';

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

export const RADIO_IMG_SCROLL_COLUMN_OPTIONS = [
  { key: '1', value: '1列' },
  { key: '2', value: '2列' },
  { key: '3', value: '3列' },
  { key: '4', value: '4列' },
  { key: '5', value: '5列' },
  { key: '6', value: '6列' },
];

export const RADIO_IMG_SCROLL_OPTIONS = [
  { key: RADIO_IMG_SCROLL_NONE, value: 'スクロールなし' },
  { key: RADIO_IMG_SCROLL_ENABLED, value: 'スクロールあり' },
];

export const RADIO_IMG_WIDTH_MODE_OPTIONS = [
  { key: RADIO_IMG_WIDTH_MODE_EQUAL, value: '等幅' },
  { key: RADIO_IMG_WIDTH_MODE_CUSTOM, value: '%指定' },
];

export const RADIO_IMG_LAYOUT_SECTION_LABELS = {
  title: 'レイアウト設定',
  direction: '方向',
  scroll: 'スクロール',
  columns: '列数',
  widthMode: '幅',
  customWidths: '列幅（%）',
  customWidthsHint: '合計が100%になるように設定してください',
  optionPadding: 'オプションのPadding',
  optionMargin: 'オプション間のMargin',
};
