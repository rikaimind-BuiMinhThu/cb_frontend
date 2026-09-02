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
  RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_1,
  RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_2,
  RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_3,
  RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_4,
  RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_5,
  RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_6,
  RADIO_IMG_LAYOUT_VERTICAL,
  RADIO_IMG_SCROLL_ENABLED,
  RADIO_IMG_SCROLL_NONE,
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

const SCROLL_LAYOUT_COLUMN_COUNT = {
  [RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_1]: 1,
  [RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_2]: 2,
  [RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_3]: 3,
  [RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_4]: 4,
  [RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_5]: 5,
  [RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_6]: 6,
};

const SCROLL_LAYOUT_BY_COLUMN = {
  1: RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_1,
  2: RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_2,
  3: RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_3,
  4: RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_4,
  5: RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_5,
  6: RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_6,
};

const DEFAULT_SCROLL_COLUMN_COUNT = 4;

const getScrollLayoutColumnCount = (layoutType) =>
  SCROLL_LAYOUT_COLUMN_COUNT[layoutType] ?? null;

export const isScrollLayout = (layoutType) =>
  getScrollLayoutColumnCount(layoutType) !== null;

export const isCustomWidthLayout = (layoutType) =>
  layoutType === RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2
  || layoutType === RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3;

export const getLayoutColumnCount = (layoutType) => {
  const scrollColumnCount = getScrollLayoutColumnCount(layoutType);
  if (scrollColumnCount !== null) {
    return scrollColumnCount;
  }

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
  const scrollColumnCount = getScrollLayoutColumnCount(layoutType);
  if (scrollColumnCount !== null) {
    return {
      direction: RADIO_IMG_DIRECTION_HORIZONTAL,
      columns: String(scrollColumnCount),
      widthMode: RADIO_IMG_WIDTH_MODE_EQUAL,
      scroll: RADIO_IMG_SCROLL_ENABLED,
    };
  }

  switch (layoutType) {
    case RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL, scroll: RADIO_IMG_SCROLL_NONE };
    case RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_3:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '3', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL, scroll: RADIO_IMG_SCROLL_NONE };
    case RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_2:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_CUSTOM, scroll: RADIO_IMG_SCROLL_NONE };
    case RADIO_IMG_LAYOUT_HORIZONTAL_CUSTOM_3:
      return { direction: RADIO_IMG_DIRECTION_HORIZONTAL, columns: '3', widthMode: RADIO_IMG_WIDTH_MODE_CUSTOM, scroll: RADIO_IMG_SCROLL_NONE };
    case RADIO_IMG_LAYOUT_VERTICAL:
      return { direction: RADIO_IMG_DIRECTION_VERTICAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL, scroll: RADIO_IMG_SCROLL_NONE };
    default:
      return { direction: RADIO_IMG_DIRECTION_VERTICAL, columns: '2', widthMode: RADIO_IMG_WIDTH_MODE_EQUAL, scroll: RADIO_IMG_SCROLL_NONE };
  }
};

export const encodeLayoutType = ({ direction, columns, widthMode, scroll = RADIO_IMG_SCROLL_NONE }) => {
  if (direction === RADIO_IMG_DIRECTION_VERTICAL) {
    return RADIO_IMG_LAYOUT_VERTICAL;
  }
  if (scroll === RADIO_IMG_SCROLL_ENABLED) {
    const parsedColumns = parseInt(columns, 10);
    const columnCount = Number.isFinite(parsedColumns)
      ? Math.min(6, Math.max(1, parsedColumns))
      : DEFAULT_SCROLL_COLUMN_COUNT;
    return SCROLL_LAYOUT_BY_COLUMN[columnCount] ?? RADIO_IMG_LAYOUT_HORIZONTAL_SCROLL_4;
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
  if (isScrollLayout(layout.type)) {
    const count = getScrollLayoutColumnCount(layout.type) ?? DEFAULT_SCROLL_COLUMN_COUNT;
    const equalWidth = (100 / count).toFixed(2);
    return Array.from({ length: count }, () => equalWidth);
  }
  if (isCustomWidthLayout(layout.type)) {
    const count = CUSTOM_LAYOUT_COLUMN_COUNT[layout.type] || 2;
    return layout.custom_widths.slice(0, count).map((width) => String(width).replace(/%$/, ''));
  }
  return EQUAL_WIDTHS[layout.type] || EQUAL_WIDTHS[RADIO_IMG_LAYOUT_HORIZONTAL_EQUAL_2];
};

const buildImgGridColumns = (layout) => {
  if (isScrollLayout(layout.type)) {
    return 'none';
  }
  if (layout.type === RADIO_IMG_LAYOUT_VERTICAL) {
    return '1fr';
  }
  return getColumnWidths(layout)
    .map((width) => `${parseFloat(width) || 1}fr`)
    .join(' ');
};

export const getRadioImgGridStyle = (radioButton) => {
  const layout = normalizeRadioButtonImgLayout(radioButton);
  return {
    '--radio-option-margin': layout.option_margin,
    '--radio-option-padding': layout.option_padding,
    '--scroll-visible-columns': getLayoutColumnCount(layout.type),
    '--preview-grid-columns': buildImgGridColumns(layout),
  };
};

export const getCheckboxImgGridStyle = (checkbox) => {
  const layout = normalizeCheckboxImgLayout(checkbox);
  return {
    '--checkbox-option-margin': layout.option_margin,
    '--checkbox-option-padding': layout.option_padding,
    '--scroll-visible-columns': getLayoutColumnCount(layout.type),
    '--preview-grid-columns': buildImgGridColumns(layout),
  };
};

export const getCustomWidthColumnCount = (layoutType) =>
  CUSTOM_LAYOUT_COLUMN_COUNT[layoutType] || 0;

export const sumCustomWidths = (widths) =>
  widths.reduce((sum, value) => sum + (parseFloat(String(value).replace(/%$/, '')) || 0), 0);

export const getImgGridClassName = (baseClassName, layoutType) => {
  if (isScrollLayout(layoutType)) {
    return `${baseClassName} ${baseClassName}--scroll`;
  }
  return baseClassName;
};

export const buildImgLayoutPayload = (layoutType, customWidths, resetWidths = false) => ({
  type: layoutType,
  custom_widths: resizeCustomWidths(layoutType, customWidths, resetWidths),
});
