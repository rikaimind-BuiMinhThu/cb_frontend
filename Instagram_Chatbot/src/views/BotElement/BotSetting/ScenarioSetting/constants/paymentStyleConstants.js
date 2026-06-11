export const PAYMENT_LAYOUT_HORIZONTAL = 'horizontal';
export const PAYMENT_LAYOUT_VERTICAL = 'vertical';
export const DEFAULT_PAYMENT_LAYOUT = PAYMENT_LAYOUT_VERTICAL;

export const DEFAULT_DISPLAY_STYLE = {
  selected_bg_color: '',
  selected_border_color: '',
  unselected_bg_color: '',
  unselected_border_color: '',
};

export const PAYMENT_DISPLAY_STYLE_FIELDS = [
  { key: 'selected_bg_color', label: '選択された時の背景色' },
  { key: 'selected_border_color', label: '選択された時のBorder色' },
  { key: 'unselected_bg_color', label: '選択されない時の背景色' },
  { key: 'unselected_border_color', label: '選択されない時のBorder色' },
];

export const PAYMENT_OPTION_IMAGE_FIELDS = [
  { key: 'selected_image', label: '選択時の画像' },
  { key: 'unselected_image', label: '未選択時の画像' },
];
