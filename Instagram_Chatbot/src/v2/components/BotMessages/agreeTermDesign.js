export const AGREE_TERM_CONTENT_TYPE = 'agree_term';
export const AGREE_TERM_DETAIL_TYPE = 'detail_content';
export const AGREE_TERM_POST_LINK_TYPE = 'post_link_only';
export const AGREE_TERM_VALUE_FIELD = 'isAgree';

export const AGREE_TERM_ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

export const AGREE_TERM_PX = 'px';

export const AGREE_TERM_TITLE_COLOR = '#000000';
export const AGREE_TERM_LABEL_COLOR = '#767676';
export const AGREE_TERM_POST_LINK_KEY_PREFIX = 'agree-term-link-';
export const AGREE_TERM_CHECKBOX_BACKGROUND = '#ffffff';
export const AGREE_TERM_CHECKBOX_BORDER_COLOR = '#d9d9d9';
export const AGREE_TERM_TICK_COLOR = '#0175ff';

export const AGREE_TERM_BORDER_WIDTH = 1;
export const AGREE_TERM_BORDER_WIDTH_MIN = 0;
export const AGREE_TERM_BORDER_WIDTH_MAX = 8;

export const AGREE_TERM_CHECKBOX_SIZE = 16;
export const AGREE_TERM_CHECKBOX_SIZE_MIN = 12;
export const AGREE_TERM_CHECKBOX_SIZE_MAX = 48;

export const AGREE_TERM_TICK_WIDTH = 2;
export const AGREE_TERM_TICK_WIDTH_MIN = 1;
export const AGREE_TERM_TICK_WIDTH_MAX = 6;

export const AGREE_TERM_LABEL_FONT_SIZE = 14;
export const AGREE_TERM_LABEL_FONT_SIZE_MIN = 10;
export const AGREE_TERM_LABEL_FONT_SIZE_MAX = 32;

export const AGREE_TERM_LONG_CONTENT_LENGTH = 200;
export const AGREE_TERM_TEXTAREA_ROWS = 5;
export const AGREE_TERM_TEXTAREA_ROWS_LONG = 8;
export const AGREE_TERM_TEXTAREA_NAME = 'ss-message__content--user-agree_to_term-detail_content';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export const AGREE_TERM_DESIGN_DEFAULTS = {
  title: {
    color: AGREE_TERM_TITLE_COLOR,
    bold: false,
  },
  collapse: {
    enabled: false,
    default_collapsed: false,
  },
  checkbox: {
    background_color: AGREE_TERM_CHECKBOX_BACKGROUND,
    border_color: AGREE_TERM_CHECKBOX_BORDER_COLOR,
    border_width: AGREE_TERM_BORDER_WIDTH,
    size: AGREE_TERM_CHECKBOX_SIZE,
    tick_color: AGREE_TERM_TICK_COLOR,
    tick_width: AGREE_TERM_TICK_WIDTH,
  },
  label: {
    font_size: AGREE_TERM_LABEL_FONT_SIZE,
    bold: false,
    color: AGREE_TERM_LABEL_COLOR,
  },
  align: AGREE_TERM_ALIGN.LEFT,
};

const asObject = (value) => {
  if (!value || typeof value !== 'object') return {};
  return value;
};

const colorOr = (value, fallback) => {
  if (typeof value !== 'string' || !HEX_COLOR.test(value)) return fallback;
  return value.toLowerCase();
};

const boolOr = (value, fallback) => {
  if (typeof value !== 'boolean') return fallback;
  return value;
};

const numberOr = (value, fallback, min, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const alignOr = (value) => {
  if (value === AGREE_TERM_ALIGN.CENTER) return AGREE_TERM_ALIGN.CENTER;
  if (value === AGREE_TERM_ALIGN.RIGHT) return AGREE_TERM_ALIGN.RIGHT;
  return AGREE_TERM_ALIGN.LEFT;
};

export const canEnableAgreeTermCollapse = (agreeTerm) => {
  if (!agreeTerm || agreeTerm.title_require !== true) return false;
  const titleText = agreeTerm.title ?? '';
  return titleText.trim() !== '';
};

export const resolveAgreeTermDesign = (design) => {
  const source = asObject(design);
  const title = asObject(source.title);
  const collapse = asObject(source.collapse);
  const checkbox = asObject(source.checkbox);
  const label = asObject(source.label);
  const defaults = AGREE_TERM_DESIGN_DEFAULTS;

  return {
    title: {
      color: colorOr(title.color, defaults.title.color),
      bold: boolOr(title.bold, defaults.title.bold),
    },
    collapse: {
      enabled: boolOr(collapse.enabled, defaults.collapse.enabled),
      default_collapsed: boolOr(collapse.default_collapsed, defaults.collapse.default_collapsed),
    },
    checkbox: {
      background_color: colorOr(checkbox.background_color, defaults.checkbox.background_color),
      border_color: colorOr(checkbox.border_color, defaults.checkbox.border_color),
      border_width: numberOr(
        checkbox.border_width,
        defaults.checkbox.border_width,
        AGREE_TERM_BORDER_WIDTH_MIN,
        AGREE_TERM_BORDER_WIDTH_MAX,
      ),
      size: numberOr(
        checkbox.size,
        defaults.checkbox.size,
        AGREE_TERM_CHECKBOX_SIZE_MIN,
        AGREE_TERM_CHECKBOX_SIZE_MAX,
      ),
      tick_color: colorOr(checkbox.tick_color, defaults.checkbox.tick_color),
      tick_width: numberOr(
        checkbox.tick_width,
        defaults.checkbox.tick_width,
        AGREE_TERM_TICK_WIDTH_MIN,
        AGREE_TERM_TICK_WIDTH_MAX,
      ),
    },
    label: {
      font_size: numberOr(
        label.font_size,
        defaults.label.font_size,
        AGREE_TERM_LABEL_FONT_SIZE_MIN,
        AGREE_TERM_LABEL_FONT_SIZE_MAX,
      ),
      bold: boolOr(label.bold, defaults.label.bold),
      color: colorOr(label.color, defaults.label.color),
    },
    align: alignOr(source.align),
  };
};

const hasPostLinkId = (item) => item?.id != null && item.id !== '';

export const stampAgreeTermPostLinkIds = (links) => {
  const source = Array.isArray(links) ? links : [];
  const maxId = source.reduce((max, item) => {
    const id = Number(item?.id);
    if (!Number.isFinite(id)) return max;
    return Math.max(max, id);
  }, 0);
  const stamped = source.reduce((state, item) => {
    if (hasPostLinkId(item)) {
      return {
        nextId: state.nextId,
        items: [...state.items, item],
      };
    }
    return {
      nextId: state.nextId + 1,
      items: [...state.items, { ...item, id: state.nextId }],
    };
  }, { nextId: maxId + 1, items: [] });
  return stamped.items;
};

export const agreeTermPostLinkKey = (item) => `${AGREE_TERM_POST_LINK_KEY_PREFIX}${item.id}`;

const toPx = (value) => `${value}${AGREE_TERM_PX}`;

export const buildAgreeTermDesignVars = (design) => {
  const resolved = resolveAgreeTermDesign(design);
  return {
    '--agree-term-title-color': resolved.title.color,
    '--agree-term-checkbox-bg': resolved.checkbox.background_color,
    '--agree-term-checkbox-border-color': resolved.checkbox.border_color,
    '--agree-term-checkbox-border-width': toPx(resolved.checkbox.border_width),
    '--agree-term-checkbox-size': toPx(resolved.checkbox.size),
    '--agree-term-tick-color': resolved.checkbox.tick_color,
    '--agree-term-tick-width': toPx(resolved.checkbox.tick_width),
    '--agree-term-label-color': resolved.label.color,
    '--agree-term-label-size': toPx(resolved.label.font_size),
  };
};
