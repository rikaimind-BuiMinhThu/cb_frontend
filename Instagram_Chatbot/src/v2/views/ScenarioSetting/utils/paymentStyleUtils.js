import {
  DEFAULT_DISPLAY_STYLE,
  DEFAULT_PAYMENT_LAYOUT,
} from '../constants/paymentStyleConstants';

export const normalizePaymentConfig = (cardPaymentRadioButton = {}) => ({
  layout: cardPaymentRadioButton.layout || DEFAULT_PAYMENT_LAYOUT,
  display_style: {
    ...DEFAULT_DISPLAY_STYLE,
    ...(cardPaymentRadioButton.display_style || {}),
  },
});

export const getPaymentOptionImage = (item, isSelected) => {
  if (isSelected && item?.selected_image) return item.selected_image;
  if (!isSelected && item?.unselected_image) return item.unselected_image;
  return null;
};

export const ensureRadioContentStyleFields = (item = {}) => ({
  ...item,
  selected_image: item.selected_image || '',
  unselected_image: item.unselected_image || '',
});
