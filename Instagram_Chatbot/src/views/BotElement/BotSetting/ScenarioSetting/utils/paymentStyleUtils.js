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

export const getPaymentGroupStyle = (layout) => ({
  width: '100%',
  display: 'flex',
  flexDirection: layout === 'horizontal' ? 'row' : 'column',
  flexWrap: layout === 'horizontal' ? 'wrap' : 'nowrap',
  gap: '8px',
});

export const getPaymentOptionStyle = (isSelected, displayStyle = {}) => {
  const style = {
    padding: '8px 12px',
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  if (isSelected) {
    if (displayStyle.selected_bg_color) style.backgroundColor = displayStyle.selected_bg_color;
    if (displayStyle.selected_border_color) style.borderColor = displayStyle.selected_border_color;
  } else {
    if (displayStyle.unselected_bg_color) style.backgroundColor = displayStyle.unselected_bg_color;
    if (displayStyle.unselected_border_color) style.borderColor = displayStyle.unselected_border_color;
  }

  return style;
};

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
