import { BORDER_TWINKLE_EFFECT_IDS } from 'v2/views/DesignSetting/constants/designThemeConstants';
import { RADIO_BUTTON_TYPES } from '../constants/contentTypeConstants';
import { isGenderRadio } from './radioButtonGenderUtils';
import { isRadioOptionInitiallySelected } from './radioButtonSelectionUtils';

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

export const RADIO_OPTION_BORDER_EFFECT_NONE = 'none';
export const RADIO_OPTION_BORDER_EFFECT_TWINKLE = 'twinkle';

const SHARED_FIELDS = [
  'border_color',
  'border_width',
  'border_effect',
  'padding',
  'background_color',
];
const TEXT_FIELDS = ['text_size', 'text_color'];
const IMAGE_FIELDS = ['image'];

export const RADIO_OPTION_DESIGN_FIELD_MATRIX = {
  [RADIO_OPTION_DESIGN_TYPES.DEFAULT]: [...SHARED_FIELDS, ...TEXT_FIELDS],
  [RADIO_OPTION_DESIGN_TYPES.GENDER]: [...SHARED_FIELDS, ...TEXT_FIELDS, ...IMAGE_FIELDS],
  [RADIO_OPTION_DESIGN_TYPES.RADIO_BUTTON_IMG]: [...SHARED_FIELDS, ...IMAGE_FIELDS],
  [RADIO_OPTION_DESIGN_TYPES.UPSELL_BUTTON]: [...SHARED_FIELDS, ...IMAGE_FIELDS],
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

const normalizeSparseField = (key, value) => {
  if (value === undefined || value === null || value === '') return null;
  if (key === 'border_color' || key === 'text_color' || key === 'background_color') {
    if (!isHexColor(value)) return null;
    return value.toLowerCase();
  }
  if (key === 'border_width') {
    return clampNumber(value, RADIO_OPTION_BORDER_WIDTH_MIN, RADIO_OPTION_BORDER_WIDTH_MAX);
  }
  if (key === 'padding') {
    return clampNumber(value, RADIO_OPTION_PADDING_MIN, RADIO_OPTION_PADDING_MAX);
  }
  if (key === 'text_size') {
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

const sparseStateFromSource = (sourceState, allowedFields) => {
  const source = asObject(sourceState);
  return allowedFields.reduce((acc, key) => {
    const normalized = normalizeSparseField(key, source[key]);
    if (normalized === null) return acc;
    return { ...acc, [key]: normalized };
  }, {});
};

export const sanitizeRadioOptionDesign = (design, designType) => {
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const source = asObject(design);
  const next = {};

  Object.values(RADIO_OPTION_DESIGN_STATES).forEach((stateKey) => {
    const sparseState = sparseStateFromSource(source[stateKey], allowedFields);
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

const resolveFieldValue = ({
  design,
  legacyDesign,
  field,
  selectionState,
  themeFallback,
}) => {
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
}) => {
  const designType = getRadioOptionDesignType(radioButton);
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const selectionState = selectionStateArg || getRadioOptionDesignState(radioButton, option);
  const sparseDesign = sanitizeRadioOptionDesign(option?.design, designType);
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
  }, designType);

  const themeFallback = themeFallbacksForState(theme, selectionState);
  const resolved = { selectionState, designType };

  allowedFields.forEach((field) => {
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
