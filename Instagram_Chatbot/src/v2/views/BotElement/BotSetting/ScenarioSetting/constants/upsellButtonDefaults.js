import { RADIO_IMG_LAYOUT_VERTICAL } from './radioButtonImgLayoutConstants';
import { RADIO_BUTTON_TYPES } from './contentTypeConstants';

export const UPSELL_BUTTON_OPTION_COUNT = 2;

export const UPSELL_BUTTON_OPTION_LABELS = [
  'アップセルする',
  'そのまま注文する',
];

export function createUpsellButtonPlaceholderImage(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80">
    <rect width="100%" height="100%" fill="#f5f5f5" stroke="#dddddd" stroke-width="1"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-family="sans-serif" fill="#333333">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getDefaultUpsellButtonOptions() {
  return UPSELL_BUTTON_OPTION_LABELS.map((label, index) => ({
    id: index + 1,
    value: label,
    img: createUpsellButtonPlaceholderImage(label),
  }));
}

export function getDefaultUpsellButtonLayout() {
  return {
    type: RADIO_IMG_LAYOUT_VERTICAL,
    custom_widths: ['100'],
  };
}

export function ensureUpsellButtonDefaults(radioButton) {
  const defaults = getDefaultUpsellButtonOptions();
  const existing = radioButton?.[RADIO_BUTTON_TYPES.UPSELL_BUTTON];

  if (!Array.isArray(existing) || existing.length !== UPSELL_BUTTON_OPTION_COUNT) {
    return {
      ...radioButton,
      [RADIO_BUTTON_TYPES.UPSELL_BUTTON]: defaults,
      img_layout: radioButton?.img_layout?.type
        ? radioButton.img_layout
        : getDefaultUpsellButtonLayout(),
    };
  }

  const normalized = defaults.map((defaultOption, index) => {
    const current = existing[index] || {};
    return {
      id: current.id ?? defaultOption.id,
      value: current.value ?? defaultOption.value,
      img: current.img ?? defaultOption.img,
    };
  });

  return {
    ...radioButton,
    [RADIO_BUTTON_TYPES.UPSELL_BUTTON]: normalized,
    img_layout: radioButton?.img_layout?.type
      ? radioButton.img_layout
      : getDefaultUpsellButtonLayout(),
  };
}
