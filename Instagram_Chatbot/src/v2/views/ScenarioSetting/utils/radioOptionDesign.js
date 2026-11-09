import { BORDER_TWINKLE_EFFECT_IDS } from 'v2/views/DesignSetting/constants/designThemeConstants';
import {
  mergeThemeWithDefaults,
  resolveMainColorContext,
} from 'v2/utils/designThemeCore';
import { parseThemeFromDesignSettings } from 'v2/utils/chatbotThemeCss';
import { RADIO_BUTTON_TYPES } from '../constants/contentTypeConstants';
import { isGenderRadio } from './radioButtonGenderUtils';
import { isRadioOptionInitiallySelected } from './radioButtonSelectionUtils';

const RADIO_PREVIEW_THEME_FALLBACK_HEX = '#327AED';
const CLIENT_SESSION_KEY = 'client';

export const RADIO_OPTION_DESIGN_STATES = {
  NORMAL: 'normal',
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
};

export const RADIO_OPTION_DESIGN_TYPES = {
  DEFAULT: RADIO_BUTTON_TYPES.DEFAULT,
  GENDER: RADIO_BUTTON_TYPES.GENDER,
  RADIO_BUTTON_IMG: RADIO_BUTTON_TYPES.RADIO_BUTTON_IMG,
  UPSELL_BUTTON: RADIO_BUTTON_TYPES.UPSELL_BUTTON,
};

export const RADIO_OPTION_DESIGN_PX = 'px';

export const RADIO_OPTION_BORDER_WIDTH_MIN = 0;
export const RADIO_OPTION_BORDER_WIDTH_MAX = 8;
export const RADIO_OPTION_PADDING_MIN = 0;
export const RADIO_OPTION_PADDING_MAX = 48;
export const RADIO_OPTION_TEXT_SIZE_MIN = 10;
export const RADIO_OPTION_TEXT_SIZE_MAX = 32;
export const RADIO_OPTION_HEIGHT_MIN = 24;
export const RADIO_OPTION_HEIGHT_MAX = 200;

export const RADIO_OPTION_BORDER_EFFECT_NONE = 'none';
export const RADIO_OPTION_BORDER_EFFECT_TWINKLE = 'twinkle';

export const RADIO_OPTION_DESIGN_COMMON_KEY = 'common';

/** Size fields stored in design.common (also readable from legacy per-state). */
export const RADIO_OPTION_COMMON_SIZE_FIELDS = [
  'height',
  'border_width',
  'padding',
  'text_size',
];

const SHARED_FIELDS = [
  'border_color',
  'border_width',
  'border_effect',
  'padding',
  'background_color',
];
const TEXT_FIELDS = ['text_size', 'text_color'];
const IMAGE_FIELDS = ['image'];

// Keep border_width/padding/text_size on per-state matrix for legacy read (M2).
export const RADIO_OPTION_DESIGN_FIELD_MATRIX = {
  [RADIO_OPTION_DESIGN_TYPES.DEFAULT]: [...SHARED_FIELDS, ...TEXT_FIELDS],
  [RADIO_OPTION_DESIGN_TYPES.GENDER]: [...SHARED_FIELDS, ...TEXT_FIELDS, ...IMAGE_FIELDS],
  [RADIO_OPTION_DESIGN_TYPES.RADIO_BUTTON_IMG]: [...SHARED_FIELDS, ...IMAGE_FIELDS],
  [RADIO_OPTION_DESIGN_TYPES.UPSELL_BUTTON]: [...SHARED_FIELDS, ...IMAGE_FIELDS],
};

export const getAllowedRadioOptionCommonFields = (designType) => {
  if (
    designType === RADIO_OPTION_DESIGN_TYPES.DEFAULT
    || designType === RADIO_OPTION_DESIGN_TYPES.GENDER
  ) {
    return [...RADIO_OPTION_COMMON_SIZE_FIELDS];
  }
  // Image/upsell: shared sizes without height/text (grid layout owns tile size).
  return RADIO_OPTION_COMMON_SIZE_FIELDS.filter(
    (field) => field !== 'height' && field !== 'text_size',
  );
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const VALID_BORDER_EFFECT = new Set(BORDER_TWINKLE_EFFECT_IDS);

const asObject = (value) => {
  if (!value || typeof value !== 'object') return {};
  return value;
};

const isHexColor = (value) => typeof value === 'string' && HEX_COLOR.test(value);

const clampNumber = (value, min, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, parsed));
};

const normalizeBorderEffect = (value) => {
  if (!value || !VALID_BORDER_EFFECT.has(value)) return null;
  if (value === RADIO_OPTION_BORDER_EFFECT_NONE) return RADIO_OPTION_BORDER_EFFECT_NONE;
  return value;
};

const parseFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeSparseField = (key, value, clampNumbers = true) => {
  if (value === undefined || value === null || value === '') return null;
  if (key === 'border_color' || key === 'text_color' || key === 'background_color') {
    if (!isHexColor(value)) return null;
    return value.toLowerCase();
  }
  if (key === 'height') {
    if (!clampNumbers) return parseFiniteNumber(value);
    return clampNumber(value, RADIO_OPTION_HEIGHT_MIN, RADIO_OPTION_HEIGHT_MAX);
  }
  if (key === 'border_width') {
    if (!clampNumbers) return parseFiniteNumber(value);
    return clampNumber(value, RADIO_OPTION_BORDER_WIDTH_MIN, RADIO_OPTION_BORDER_WIDTH_MAX);
  }
  if (key === 'padding') {
    if (!clampNumbers) return parseFiniteNumber(value);
    return clampNumber(value, RADIO_OPTION_PADDING_MIN, RADIO_OPTION_PADDING_MAX);
  }
  if (key === 'text_size') {
    if (!clampNumbers) return parseFiniteNumber(value);
    return clampNumber(value, RADIO_OPTION_TEXT_SIZE_MIN, RADIO_OPTION_TEXT_SIZE_MAX);
  }
  if (key === 'border_effect') {
    return normalizeBorderEffect(value);
  }
  if (key === 'image') {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed;
  }
  return null;
};

export const getRadioOptionDesignType = (radioButton) => {
  if (isGenderRadio(radioButton)) return RADIO_OPTION_DESIGN_TYPES.GENDER;
  const type = radioButton?.type;
  if (type === RADIO_OPTION_DESIGN_TYPES.RADIO_BUTTON_IMG) {
    return RADIO_OPTION_DESIGN_TYPES.RADIO_BUTTON_IMG;
  }
  if (type === RADIO_OPTION_DESIGN_TYPES.UPSELL_BUTTON) {
    return RADIO_OPTION_DESIGN_TYPES.UPSELL_BUTTON;
  }
  return RADIO_OPTION_DESIGN_TYPES.DEFAULT;
};

export const getAllowedRadioOptionDesignFields = (designType) => (
  RADIO_OPTION_DESIGN_FIELD_MATRIX[designType] || RADIO_OPTION_DESIGN_FIELD_MATRIX.default
);

export const hasRadioGroupSelection = (radioButton) => {
  const selection = radioButton?.initial_selection;
  if (selection === undefined || selection === null) return false;
  return String(selection) !== '';
};

export const getRadioOptionDesignState = (radioButton, item) => {
  if (!hasRadioGroupSelection(radioButton)) {
    return RADIO_OPTION_DESIGN_STATES.NORMAL;
  }
  if (isRadioOptionInitiallySelected(radioButton, item)) {
    return RADIO_OPTION_DESIGN_STATES.SELECTED;
  }
  return RADIO_OPTION_DESIGN_STATES.UNSELECTED;
};

export const presetConfigToDesign = (presetConfig) => {
  const preset = asObject(asObject(presetConfig).preset);
  const button = asObject(preset.button);
  const icon = asObject(preset.icon);
  const defaultBg = isHexColor(button.default) ? button.default.toLowerCase() : null;
  const selectedBg = isHexColor(button.selected) ? button.selected.toLowerCase() : null;
  const image = typeof icon.url === 'string' && icon.url.trim() ? icon.url.trim() : null;

  const design = {};
  if (defaultBg || image) {
    design.normal = {};
    design.unselected = {};
    if (defaultBg) {
      design.normal.background_color = defaultBg;
      design.unselected.background_color = defaultBg;
    }
    if (image) {
      design.normal.image = image;
      design.unselected.image = image;
    }
  }
  if (selectedBg || image) {
    design.selected = {};
    if (selectedBg) design.selected.background_color = selectedBg;
    if (image) design.selected.image = image;
  }
  return design;
};

const sparseStateFromSource = (sourceState, allowedFields, clampNumbers = true) => {
  const source = asObject(sourceState);
  return allowedFields.reduce((acc, key) => {
    const normalized = normalizeSparseField(key, source[key], clampNumbers);
    if (normalized === null) return acc;
    return { ...acc, [key]: normalized };
  }, {});
};

export const sanitizeRadioOptionDesign = (design, designType, options = {}) => {
  const clampNumbers = options.clampNumbers !== false;
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const allowedCommonFields = getAllowedRadioOptionCommonFields(designType);
  const source = asObject(design);
  const next = {};

  const commonSparse = sparseStateFromSource(
    source[RADIO_OPTION_DESIGN_COMMON_KEY],
    allowedCommonFields,
    clampNumbers,
  );
  if (Object.keys(commonSparse).length > 0) {
    next[RADIO_OPTION_DESIGN_COMMON_KEY] = commonSparse;
  }

  Object.values(RADIO_OPTION_DESIGN_STATES).forEach((stateKey) => {
    const sparseState = sparseStateFromSource(
      source[stateKey],
      allowedFields,
      clampNumbers,
    );
    if (Object.keys(sparseState).length === 0) return;
    next[stateKey] = sparseState;
  });

  return next;
};

export const setRadioOptionDesignImage = (design, designState, imageUrl, designType) => {
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  if (!allowedFields.includes('image')) return sanitizeRadioOptionDesign(design, designType);

  const next = sanitizeRadioOptionDesign(design, designType);
  const normalized = normalizeSparseField('image', imageUrl);
  const statePatch = { ...asObject(next[designState]) };
  if (normalized === null) {
    delete statePatch.image;
  } else {
    statePatch.image = normalized;
  }
  if (Object.keys(statePatch).length === 0) {
    delete next[designState];
  } else {
    next[designState] = statePatch;
  }
  return next;
};

export const mirrorRadioOptionNormalImage = (option, imageUrl, designType) => {
  const nextDesign = setRadioOptionDesignImage(
    option?.design,
    RADIO_OPTION_DESIGN_STATES.NORMAL,
    imageUrl,
    designType,
  );
  return {
    ...option,
    img: typeof imageUrl === 'string' ? imageUrl : '',
    design: nextDesign,
  };
};

const readSparseField = (design, stateKey, field) => {
  const state = asObject(asObject(design)[stateKey]);
  return normalizeSparseField(field, state[field]);
};

const readCommonField = (design, field) => {
  const common = asObject(asObject(design)[RADIO_OPTION_DESIGN_COMMON_KEY]);
  return normalizeSparseField(field, common[field]);
};

const isCommonSizeField = (field) => RADIO_OPTION_COMMON_SIZE_FIELDS.includes(field);

const resolveFieldValue = ({
  design,
  legacyDesign,
  field,
  selectionState,
  themeFallback,
}) => {
  // Precedence for size fields: common → per-state (legacy) → theme.
  if (isCommonSizeField(field)) {
    const fromCommon = readCommonField(design, field);
    if (fromCommon !== null) return fromCommon;
  }

  const fromState = readSparseField(design, selectionState, field);
  if (fromState !== null) return fromState;

  if (selectionState === RADIO_OPTION_DESIGN_STATES.NORMAL) {
    const fromUnselected = readSparseField(design, RADIO_OPTION_DESIGN_STATES.UNSELECTED, field);
    if (fromUnselected !== null) return fromUnselected;
  }

  const fromLegacyState = readSparseField(legacyDesign, selectionState, field);
  if (fromLegacyState !== null) return fromLegacyState;

  if (selectionState === RADIO_OPTION_DESIGN_STATES.NORMAL) {
    const fromLegacyUnselected = readSparseField(
      legacyDesign,
      RADIO_OPTION_DESIGN_STATES.UNSELECTED,
      field,
    );
    if (fromLegacyUnselected !== null) return fromLegacyUnselected;
  }

  if (field === 'image') {
    return null;
  }

  return themeFallback === undefined ? null : themeFallback;
};

const themeFallbacksForState = (theme, selectionState) => {
  const source = asObject(theme);
  if (selectionState === RADIO_OPTION_DESIGN_STATES.SELECTED) {
    return {
      background_color: source.radioSelectedBgColor || null,
      border_color: source.radioSelectedBorderColor || null,
      border_effect: source.radioSelectedBorderEffect || RADIO_OPTION_BORDER_EFFECT_NONE,
      text_size: source.radioFontSize ? Number.parseInt(source.radioFontSize, 10) : null,
    };
  }
  return {
    background_color: source.radioUnselectedBgColor || null,
    border_color: source.radioUnselectedBorderColor || null,
    border_effect: RADIO_OPTION_BORDER_EFFECT_NONE,
    text_size: source.radioFontSize ? Number.parseInt(source.radioFontSize, 10) : null,
  };
};

export const resolveRadioOptionDesign = ({
  option,
  radioButton,
  theme,
  selectionState: selectionStateArg,
  clampNumbers = true,
}) => {
  const designType = getRadioOptionDesignType(radioButton);
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const selectionState = selectionStateArg || getRadioOptionDesignState(radioButton, option);
  const sanitizeOptions = { clampNumbers };
  const sparseDesign = sanitizeRadioOptionDesign(
    option?.design,
    designType,
    sanitizeOptions,
  );
  const legacyFromPreset = presetConfigToDesign(option?.preset_config);
  const legacyDesign = sanitizeRadioOptionDesign({
    ...legacyFromPreset,
    normal: {
      ...asObject(legacyFromPreset.normal),
      ...(option?.img ? { image: option.img } : {}),
    },
    selected: {
      ...asObject(legacyFromPreset.selected),
      ...(option?.img ? { image: option.img } : {}),
    },
    unselected: {
      ...asObject(legacyFromPreset.unselected),
      ...(option?.img ? { image: option.img } : {}),
    },
  }, designType, sanitizeOptions);

  const themeFallback = themeFallbacksForState(theme, selectionState);
  const resolved = { selectionState, designType };
  const allowedCommonFields = getAllowedRadioOptionCommonFields(designType);
  const fieldsToResolve = Array.from(new Set([
    ...allowedFields,
    ...allowedCommonFields,
  ]));

  fieldsToResolve.forEach((field) => {
    resolved[field] = resolveFieldValue({
      design: sparseDesign,
      legacyDesign,
      field,
      selectionState,
      themeFallback: themeFallback[field],
    });
  });

  if (!allowedFields.includes('image')) {
    resolved.image = null;
  } else if (!resolved.image) {
    const normalImage = resolveFieldValue({
      design: sparseDesign,
      legacyDesign,
      field: 'image',
      selectionState: RADIO_OPTION_DESIGN_STATES.NORMAL,
      themeFallback: null,
    });
    resolved.image = normalImage;
  }

  return resolved;
};

const toPx = (value) => `${value}${RADIO_OPTION_DESIGN_PX}`;

export const buildRadioOptionDesignVars = (resolved) => {
  const vars = {};
  const isSelected = resolved.selectionState === RADIO_OPTION_DESIGN_STATES.SELECTED;

  if (resolved.background_color) {
    if (isSelected) {
      vars['--c-radio-selected-bg'] = resolved.background_color;
    } else {
      vars['--c-radio-unselected-bg'] = resolved.background_color;
    }
  }

  if (resolved.border_color) {
    if (isSelected) {
      vars['--c-radio-selected-border'] = resolved.border_color;
    } else {
      vars['--c-radio-unselected-border'] = resolved.border_color;
    }
    vars['--c-radio-twinkle-color'] = resolved.border_color;
  }

  if (resolved.border_width !== null && resolved.border_width !== undefined) {
    vars['--c-radio-border-width'] = toPx(resolved.border_width);
  }

  if (resolved.padding !== null && resolved.padding !== undefined) {
    vars['--c-radio-padding'] = toPx(resolved.padding);
  }

  if (resolved.height !== null && resolved.height !== undefined) {
    vars['--c-radio-height'] = toPx(resolved.height);
  }

  if (resolved.text_size !== null && resolved.text_size !== undefined) {
    vars['--c-radio-font-size'] = toPx(resolved.text_size);
  }

  if (resolved.text_color) {
    vars['--c-radio-text-color'] = resolved.text_color;
  }

  return vars;
};

export const shouldApplyRadioOptionTwinkle = (resolved) => (
  resolved?.border_effect === RADIO_OPTION_BORDER_EFFECT_TWINKLE
);

export const getRadioOptionNormalImage = (option) => {
  const fromDesign = asObject(asObject(option?.design).normal).image;
  if (typeof fromDesign === 'string' && fromDesign.trim()) return fromDesign;
  if (typeof option?.img === 'string') return option.img;
  return '';
};

/**
 * Fill missing per-state images from the option's current image (img / normal design).
 * Does not overwrite an explicit state image. Used for modal draft defaults only.
 */
export const seedRadioOptionDesignImagesFromOption = (design, optionImage, designType) => {
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const next = sanitizeRadioOptionDesign(design, designType, { clampNumbers: false });
  if (!allowedFields.includes('image')) return next;

  const fallback = typeof optionImage === 'string' ? optionImage.trim() : '';
  if (!fallback) return next;

  Object.values(RADIO_OPTION_DESIGN_STATES).forEach((stateKey) => {
    const state = asObject(next[stateKey]);
    if (state.image) return;
    next[stateKey] = { ...state, image: fallback };
  });
  return next;
};

export const resolveRadioPreviewTheme = () => {
  try {
    const client = JSON.parse(sessionStorage.getItem(CLIENT_SESSION_KEY) || 'null');
    const { apiColorKey, mainColorHex } = resolveMainColorContext(client || {});
    const rawTheme = parseThemeFromDesignSettings(client?.design_settings);
    return mergeThemeWithDefaults(
      rawTheme,
      mainColorHex || RADIO_PREVIEW_THEME_FALLBACK_HEX,
      apiColorKey,
    );
  } catch (error) {
    // Keep preview usable when sessionStorage/client JSON is corrupt.
    // eslint-disable-next-line no-console
    console.error('resolveRadioPreviewTheme failed', error);
    return mergeThemeWithDefaults(
      null,
      RADIO_PREVIEW_THEME_FALLBACK_HEX,
      null,
    );
  }
};

export const buildRadioPreviewPaneVars = (theme) => {
  const source = asObject(theme);
  const vars = {};
  if (source.radioSelectedBgColor) {
    vars['--c-radio-selected-bg'] = source.radioSelectedBgColor;
  }
  if (source.radioUnselectedBgColor) {
    vars['--c-radio-unselected-bg'] = source.radioUnselectedBgColor;
  }
  if (source.radioSelectedBorderColor) {
    vars['--c-radio-selected-border'] = source.radioSelectedBorderColor;
    vars['--c-radio-twinkle-color'] = source.radioSelectedBorderColor;
  }
  if (source.radioUnselectedBorderColor) {
    vars['--c-radio-unselected-border'] = source.radioUnselectedBorderColor;
  }
  if (source.radioFontSize) {
    const fontSize = String(source.radioFontSize).replace(/px$/i, '');
    vars['--c-radio-font-size'] = `${fontSize}${RADIO_OPTION_DESIGN_PX}`;
  }
  return vars;
};

export const areRadioOptionDesignsEqual = (left, right, designType) => (
  JSON.stringify(sanitizeRadioOptionDesign(left, designType))
  === JSON.stringify(sanitizeRadioOptionDesign(right, designType))
);

/**
 * Lift legacy per-state size fields into design.common for modal draft editing.
 * Snapshot must stay unlifted so Cancel is not dirty.
 * First-wins across normal → unselected → selected; other states' size values
 * are discarded from the draft and will be gone after Save.
 */
export const liftRadioOptionDesignCommonForDraft = (design, designType) => {
  const next = sanitizeRadioOptionDesign(design, designType, { clampNumbers: false });
  const allowedCommonFields = getAllowedRadioOptionCommonFields(designType);
  const common = { ...asObject(next[RADIO_OPTION_DESIGN_COMMON_KEY]) };
  const stateOrder = [
    RADIO_OPTION_DESIGN_STATES.NORMAL,
    RADIO_OPTION_DESIGN_STATES.UNSELECTED,
    RADIO_OPTION_DESIGN_STATES.SELECTED,
  ];

  allowedCommonFields.forEach((field) => {
    if (common[field] !== undefined && common[field] !== null && common[field] !== '') {
      return;
    }
    stateOrder.some((stateKey) => {
      const state = asObject(next[stateKey]);
      if (state[field] === undefined || state[field] === null || state[field] === '') {
        return false;
      }
      common[field] = state[field];
      return true;
    });
  });

  Object.values(RADIO_OPTION_DESIGN_STATES).forEach((stateKey) => {
    const state = asObject(next[stateKey]);
    if (Object.keys(state).length === 0) return;
    const cleaned = { ...state };
    allowedCommonFields.forEach((field) => {
      delete cleaned[field];
    });
    if (Object.keys(cleaned).length === 0) {
      delete next[stateKey];
    } else {
      next[stateKey] = cleaned;
    }
  });

  if (Object.keys(common).length > 0) {
    next[RADIO_OPTION_DESIGN_COMMON_KEY] = common;
  } else {
    delete next[RADIO_OPTION_DESIGN_COMMON_KEY];
  }

  return sanitizeRadioOptionDesign(next, designType, { clampNumbers: false });
};

/**
 * Merge source design into sibling, preserving sibling per-state images.
 * Source images are stripped. Does not touch option.img.
 */
export const mergeRadioOptionDesignExceptImage = (sourceDesign, siblingDesign, designType) => {
  const source = sanitizeRadioOptionDesign(sourceDesign, designType);
  const sibling = sanitizeRadioOptionDesign(siblingDesign, designType);
  const next = {};

  if (source[RADIO_OPTION_DESIGN_COMMON_KEY]) {
    next[RADIO_OPTION_DESIGN_COMMON_KEY] = {
      ...asObject(source[RADIO_OPTION_DESIGN_COMMON_KEY]),
    };
  }

  Object.values(RADIO_OPTION_DESIGN_STATES).forEach((stateKey) => {
    const sourceState = { ...asObject(source[stateKey]) };
    delete sourceState.image;
    const siblingImage = asObject(sibling[stateKey]).image;
    const merged = { ...sourceState };
    if (siblingImage) {
      merged.image = siblingImage;
    }
    if (Object.keys(merged).length === 0) return;
    next[stateKey] = merged;
  });

  return sanitizeRadioOptionDesign(next, designType);
};
