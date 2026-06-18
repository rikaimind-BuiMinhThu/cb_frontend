import {
  DEFAULT_RADIO_IMG_CUSTOM_WIDTHS,
  DEFAULT_RADIO_IMG_LAYOUT_TYPE,
  DEFAULT_RADIO_IMG_OPTION_MARGIN,
  DEFAULT_RADIO_IMG_OPTION_PADDING,
  RADIO_IMG_DIRECTION_HORIZONTAL,
  RADIO_IMG_DIRECTION_VERTICAL,
  RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2,
  RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3,
  RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2,
  RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3,
  RADIO_IMG_LAYOUT_VERTICAL,
  RADIO_IMG_WIDTH_MODE_CUSTOM,
  RADIO_IMG_WIDTH_MODE_EQUAL,
} from '../constants/radioButtonImgLayoutConstants';

const EQUAL_WIDTHS = {
  [RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2]: ['50', '50'],
  [RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3]: ['33.33', '33.33', '33.34'],
};

const CUSTOM_LAYOUT_COLUMN_COUNT = {
  [RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2]: 2,
  [RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3]: 3,
};

export const isCustomWidthLayout = (layoutType) =>
  layoutType === RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2
  || layoutType === RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3;

export const getLayoutColumnCount = (layoutType) => {
  switch (layoutType) {
    case RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2:
    case RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2:
      return 2;
    case RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3:
    case RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3:
      return 3;
    case RADIO_IMG_LAYOUT_VERTICAL:
      return 1;
    default:
      return 2;
  }
};

export const decodeLayoutType = (layoutType) => {
  switch (layoutType) {
    case RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL };
    case RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '3', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL };
    case RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_CUSTOM };
    case RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '3', widthMode: RADIO_IMG_WIDTH_MODE_CUSTOM };
    case RADIO_IMG_LAYOUT_VERTICAL:
    default:
      return { direction: RADIO_IMG_DIRECTION_VERTICAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL };
  }
};

export const encodeLayoutType = ({ direction, columns, widthMode }) => {
  if (direction === RADIO_IMG_DIRECTION_VERTICAL) {
    return RADIO_IMG_LAYOUT_VERTICAL;
  }
  if (columns === '3') {
    return widthMode === RADIO_IMG_WIDTH_MODE_CUSTOM
      ? RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3
      : RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3;
  }
  return widthMode === RADIO_IMG_WIDTH_MODE_CUSTOM
    ? RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2
    : RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2;
};

export const resizeCustomWidths = (layoutType, existingWidths = [], resetToDefaults = false) => {
  if (!isCustomWidthLayout(layoutType)) {
    return [...(DEFAULT_RADIO_IMG_CUSTOM_WIDTHS[RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2] || ['50', '50'])];
  }

  const defaults = [...(DEFAULT_RADIO_IMG_CUSTOM_WIDTHS[layoutType] || ['50', '50'])];
  const expectedCount = defaults.length;

  if (resetToDefaults) {
    return defaults;
  }

  if (!Array.isArray(existingWidths) || existingWidths.length !== expectedCount) {
    return defaults;
  }

  return existingWidths.map(String);
};

export const normalizePxValue = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  const trimmed = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
};

export const normalizeOptionImgLayout = (contentData = {}) => {
  const layoutType = contentData?.img_layout?.type || DEFAULT_RADIO_IMG_LAYOUT_TYPE;
  const customWidths = resizeCustomWidths(
    layoutType,
    contentData?.img_layout?.custom_widths,
    false,
  );

  return {
    type: layoutType,
    custom_widths: customWidths,
    option_padding: normalizePxValue(contentData?.option_padding, DEFAULT_RADIO_IMG_OPTION_PADDING),
    option_margin: normalizePxValue(contentData?.option_margin, DEFAULT_RADIO_IMG_OPTION_MARGIN),
  };
};

export const normalizeRadioButtonImgLayout = (radioButton = {}) =>
  normalizeOptionImgLayout(radioButton);

export const normalizeCheckboxImgLayout = (checkbox = {}) =>
  normalizeOptionImgLayout(checkbox);

export const getColumnWidths = (layout) => {
  if (layout.type === RADIO_IMG_LAYOUT_VERTICAL) {
    return ['100'];
  }
  if (isCustomWidthLayout(layout.type)) {
    const count = CUSTOM_LAYOUT_COLUMN_COUNT[layout.type] || 2;
    return layout.custom_widths.slice(0, count).map((width) => String(width).replace(/%$/, ''));
  }
  return EQUAL_WIDTHS[layout.type] || EQUAL_WIDTHS[RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2];
};

export const getRadioImgGridStyle = (radioButton) => {
  const layout = normalizeRadioButtonImgLayout(radioButton);
  const style = {
    '--radio-option-margin': layout.option_margin,
    '--radio-option-padding': layout.option_padding,
  };

  if (layout.type === RADIO_IMG_LAYOUT_VERTICAL) {
    return {
      ...style,
      gridTemplateColumns: '1fr',
    };
  }

  const widths = getColumnWidths(layout);
  return {
    ...style,
    gridTemplateColumns: widths.map((width) => `${parseFloat(width) || 1}fr`).join(' '),
  };
};

export const getRadioImgOptionStyle = (radioButton) => {
  const layout = normalizeRadioButtonImgLayout(radioButton);
  return {
    padding: layout.option_padding,
    boxSizing: 'border-box',
  };
};

export const getCheckboxImgGridStyle = (checkbox) => {
  const layout = normalizeCheckboxImgLayout(checkbox);
  const style = {
    '--checkbox-option-margin': layout.option_margin,
    '--checkbox-option-padding': layout.option_padding,
  };

  if (layout.type === RADIO_IMG_LAYOUT_VERTICAL) {
    return {
      ...style,
      gridTemplateColumns: '1fr',
    };
  }

  const widths = getColumnWidths(layout);
  return {
    ...style,
    gridTemplateColumns: widths.map((width) => `${parseFloat(width) || 1}fr`).join(' '),
  };
};

export const getCheckboxImgOptionStyle = (checkbox) => {
  const layout = normalizeCheckboxImgLayout(checkbox);
  return {
    padding: layout.option_padding,
    boxSizing: 'border-box',
  };
};

export const getCustomWidthColumnCount = (layoutType) =>
  CUSTOM_LAYOUT_COLUMN_COUNT[layoutType] || 0;

export const sumCustomWidths = (widths) =>
  widths.reduce((sum, value) => sum + (parseFloat(String(value).replace(/%$/, '')) || 0), 0);

export const buildImgLayoutPayload = (layoutType, customWidths, resetWidths = false) => ({
  type: layoutType,
  custom_widths: resizeCustomWidths(layoutType, customWidths, resetWidths),
});
