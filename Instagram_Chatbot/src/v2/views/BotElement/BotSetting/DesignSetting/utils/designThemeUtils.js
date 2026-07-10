import { COLOR_MAP } from '../constants/designChatbotConstants';
import { resolveMainColorContext } from './designChatbotUtils';
import {
  BORDER_TWINKLE_EFFECT_IDS,
  BUTTON_BORDER_STYLE_IDS,
  BUTTON_EFFECT_IDS,
  BUTTON_POSITION_IDS,
  CAMEL_TO_SNAKE_THEME,
  FIELD_FOCUS_EFFECT_IDS,
  MODAL_TITLE_ALIGNMENT_IDS,
  THEME_FIELD_KEYS,
} from '../constants/designThemeConstants';

const VALID_EFFECT_IDS = new Set(FIELD_FOCUS_EFFECT_IDS);
const VALID_BORDER_TWINKLE_IDS = new Set(BORDER_TWINKLE_EFFECT_IDS);
const VALID_BUTTON_BORDER_STYLE_IDS = new Set(BUTTON_BORDER_STYLE_IDS);
const VALID_BUTTON_EFFECT_IDS = new Set(BUTTON_EFFECT_IDS);
const VALID_BUTTON_POSITION_IDS = new Set(BUTTON_POSITION_IDS);
const VALID_MODAL_TITLE_ALIGNMENT_IDS = new Set(MODAL_TITLE_ALIGNMENT_IDS);

const BUTTON_BOUNCE_ANIMATION = 'themeButtonBounce 1.2s ease-in-out infinite';

const BUTTON_BORDER_RADIUS_BY_STYLE = {
  square: '0',
  rounded: '4px',
  pill: '9999px',
};

const BUTTON_POSITION_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const MODAL_TITLE_TEXT_ALIGN = {
  left: 'left',
  center: 'center',
  right: 'right',
};

const TWINKLE_ANIMATION_BY_ELEMENT = {
  field: 'themeFieldBorderTwinkle 1.2s ease-in-out infinite',
  checkbox: 'themeCheckboxBorderTwinkle 1.2s ease-in-out infinite',
  radio: 'themeRadioBorderTwinkle 1.2s ease-in-out infinite',
};

export const buildFieldBorderTwinkleKeyframes = (focusBorderColor = '#327AED') => `
@keyframes themeFieldBorderTwinkle {
  0%, 100% { box-shadow: 0 0 0 2px ${focusBorderColor}; }
  50% { box-shadow: 0 0 0 2px transparent; }
}`;

export const buildCheckboxBorderTwinkleKeyframes = (checkedBorderColor = '#327AED') => `
@keyframes themeCheckboxBorderTwinkle {
  0%, 100% { box-shadow: 0 0 0 1px ${checkedBorderColor}; }
  50% { box-shadow: 0 0 0 1px transparent; }
}`;

export const buildRadioBorderTwinkleKeyframes = (selectedBorderColor = '#327AED') => `
@keyframes themeRadioBorderTwinkle {
  0%, 100% { box-shadow: 0 0 0 1px ${selectedBorderColor}; }
  50% { box-shadow: 0 0 0 1px transparent; }
}`;

const buildTwinkleKeyframesForElement = (elementType, theme) => {
  switch (elementType) {
    case 'field':
      return buildFieldBorderTwinkleKeyframes(theme.fieldFocusBorderColor || '#327AED');
    case 'checkbox':
      return buildCheckboxBorderTwinkleKeyframes(theme.checkboxCheckedBorderColor || '#327AED');
    case 'radio':
      return buildRadioBorderTwinkleKeyframes(theme.radioSelectedBorderColor || '#327AED');
    default:
      return '';
  }
};

export const normalizeBorderTwinkleEffect = (value) => {
  if (!value) return 'none';
  if (VALID_BORDER_TWINKLE_IDS.has(value)) return value;
  return 'none';
};

export const normalizeButtonBorderStyle = (value) => {
  if (!value) return 'rounded';
  if (VALID_BUTTON_BORDER_STYLE_IDS.has(value)) return value;
  return 'rounded';
};

export const normalizeButtonEffect = (value) => {
  if (!value) return 'none';
  if (VALID_BUTTON_EFFECT_IDS.has(value)) return value;
  return 'none';
};

export const normalizeButtonPosition = (value) => {
  if (!value) return 'right';
  if (VALID_BUTTON_POSITION_IDS.has(value)) return value;
  return 'right';
};

export const normalizeModalTitleAlignment = (value) => {
  if (!value) return 'left';
  if (VALID_MODAL_TITLE_ALIGNMENT_IDS.has(value)) return value;
  return 'left';
};

export const resolveModalTitleTextAlign = (alignmentId) => {
  const alignment = normalizeModalTitleAlignment(alignmentId);
  return MODAL_TITLE_TEXT_ALIGN[alignment] || MODAL_TITLE_TEXT_ALIGN.left;
};

export const resolveButtonBorderRadius = (styleId) => {
  const style = normalizeButtonBorderStyle(styleId);
  return BUTTON_BORDER_RADIUS_BY_STYLE[style] || BUTTON_BORDER_RADIUS_BY_STYLE.rounded;
};

export const buildButtonBounceKeyframes = () => `
@keyframes themeButtonBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}`;

export const resolveButtonBounceEffect = (effectId) => {
  if (normalizeButtonEffect(effectId) !== 'bounce') {
    return { animation: 'none', keyframesCss: '' };
  }

  return {
    animation: BUTTON_BOUNCE_ANIMATION,
    keyframesCss: buildButtonBounceKeyframes(),
  };
};

export const resolveButtonWidthCss = (widthValue) => {
  if (!widthValue || typeof widthValue !== 'string') return 'auto';
  const trimmed = widthValue.trim();
  return trimmed || 'auto';
};

export const resolveButtonPaddingCss = (paddingValue) => {
  if (!paddingValue || typeof paddingValue !== 'string') return '4px 10px';
  const trimmed = paddingValue.trim();
  return trimmed || '4px 10px';
};

export const resolveButtonPositionJustify = (positionId) => {
  const position = normalizeButtonPosition(positionId);
  return BUTTON_POSITION_JUSTIFY[position] || BUTTON_POSITION_JUSTIFY.right;
};

export const resolveBorderTwinkleEffect = (effectId, elementType, theme = null) => {
  if (normalizeBorderTwinkleEffect(effectId) !== 'twinkle') {
    return { animation: 'none', keyframesCss: '' };
  }

  return {
    animation: TWINKLE_ANIMATION_BY_ELEMENT[elementType] || 'none',
    keyframesCss: theme
      ? buildTwinkleKeyframesForElement(elementType, theme)
      : buildTwinkleKeyframesForElement(elementType, deriveThemeDefaults()),
  };
};

const isLegacyFocusEffectValue = (value) => typeof value === 'string' && (
  value.includes('px')
  || value.includes('rgba')
  || value.includes('rgb')
);

export const normalizeFieldFocusEffect = (value) => {
  if (!value) return 'outline_soft';
  if (value === 'twinkle') return 'border_twinkle';
  if (value === 'border_fade' || value === 'border_pulse') return 'none';
  if (VALID_EFFECT_IDS.has(value)) return value;
  if (isLegacyFocusEffectValue(value)) return 'outline_soft';
  return 'outline_soft';
};

const PRESET_DERIVED = {
  blue: { opacity: '#D6E0EF', message: '#3CACEF', font: '#fff' },
  green: { opacity: '#DEEADB', message: '#9DDB7C', font: '#fff' },
  orange: { opacity: '#F4E5DA', message: '#EF8D2F', font: '#fff' },
  yellow: { opacity: '#F0EFEB', message: '#F3AA2D', font: '#fff' },
  pink: { opacity: '#EBDDE3', message: '#E65B83', font: '#fff' },
  purple: { opacity: '#E9E8F1', message: '#AF82D5', font: '#fff' },
  black: { opacity: '#ecede8', message: '#c3c3c3', font: '#000' },
  white: { opacity: '#fff', message: '#F5F5F5', font: '#000' },
};

const lightenHex = (hex, amount = 0.1) => {
  if (!hex || !hex.startsWith('#')) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.floor((num >> 16) + 255 * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00ff) + 255 * amount));
  const b = Math.min(255, Math.floor((num & 0x0000ff) + 255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const resolveFieldFocusEffect = (effectId, theme) => {
  const effect = normalizeFieldFocusEffect(effectId);
  const focusBorder = theme.fieldFocusBorderColor || '#327AED';
  const softGlow = lightenHex(focusBorder, 0.35);

  switch (effect) {
    case 'none':
      return {
        boxShadow: 'none',
        fieldTransition: 'none',
        focusAnimation: 'none',
        keyframesCss: '',
      };
    case 'outline_strong':
      return {
        boxShadow: `0 0 0 3px ${focusBorder}`,
        fieldTransition: 'none',
        focusAnimation: 'none',
        keyframesCss: '',
      };
    case 'border_twinkle':
      return {
        boxShadow: 'none',
        fieldTransition: 'none',
        focusAnimation: TWINKLE_ANIMATION_BY_ELEMENT.field,
        keyframesCss: buildFieldBorderTwinkleKeyframes(focusBorder),
        useFocusBorderShorthand: true,
        useAnimatedBoxShadow: true,
      };
    case 'outline_soft':
    default:
      return {
        boxShadow: `0 0 0 2px ${softGlow}`,
        fieldTransition: 'none',
        focusAnimation: 'none',
        keyframesCss: '',
      };
  }
};

const resolvePresetKey = (mainColorHex, apiColorKey) => {
  if (apiColorKey && PRESET_DERIVED[apiColorKey]) return apiColorKey;
  const entry = Object.entries(COLOR_MAP).find(([, value]) => value === mainColorHex);
  return entry?.[0] || null;
};

export const deriveThemeDefaults = (mainColorHex = '#327AED', apiColorKey = null) => {
  const presetKey = resolvePresetKey(mainColorHex, apiColorKey);
  const preset = presetKey ? PRESET_DERIVED[presetKey] : null;
  const opacityColor = preset?.opacity || lightenHex(mainColorHex, 0.1);
  const messageColor = preset?.message || mainColorHex;
  const fontColor = preset?.font || '#fff';
  const pressedColor = presetKey === 'black' || presetKey === 'white'
    ? mainColorHex
    : lightenHex(mainColorHex, -0.08) || mainColorHex;

  return {
    headerTitleTextColor: '#ffffff',
    headerTitleFontSize: '15px',
    headerSubtitleTextColor: '#ffffff',
    headerSubtitleFontSize: '14px',
    progressBarBgColor: opacityColor,
    progressBarTextColor: '#ffffff',
    progressBarFontSize: '13px',
    chatWindowBgColor: opacityColor,
    botMessageBgColor: messageColor,
    botMessageTextColor: fontColor,
    botMessageFontSize: '14px',
    userMessageBgColor: '#ffffff',
    userMessageTextColor: '#333333',
    userMessageFontSize: '14px',
    fieldFocusBorderColor: mainColorHex,
    fieldFocusBgColor: '#ffffff',
    fieldFocusBgEffect: 'outline_soft',
    fieldUnfocusBorderColor: '#cccccc',
    fieldUnfocusBgColor: '#ffffff',
    fieldFontSize: '14px',
    validationMessageBgColor: 'transparent',
    validationMessageTextColor: '#FF7E00',
    validationMessageFontSize: '12px',
    requiredLabelTextColor: '#FF7E00',
    requiredLabelFontSize: '12px',
    buttonNormalBgColor: mainColorHex,
    buttonNormalTextColor: '#ffffff',
    buttonPressedBgColor: pressedColor,
    buttonPressedTextColor: '#ffffff',
    buttonDisabledBgColor: '#e0e0e0',
    buttonDisabledTextColor: '#999999',
    buttonFontSize: '14px',
    buttonBorderStyle: 'rounded',
    buttonEffect: 'none',
    buttonWidth: '',
    buttonPadding: '4px 10px',
    buttonPosition: 'right',
    checkboxUncheckedBgColor: '#ffffff',
    checkboxUncheckedBorderColor: '#cccccc',
    checkboxCheckedBgColor: mainColorHex,
    checkboxCheckedBorderColor: mainColorHex,
    checkboxCheckedBorderEffect: 'none',
    checkboxFontSize: '14px',
    radioUnselectedBgColor: opacityColor,
    radioSelectedBgColor: lightenHex(mainColorHex, 0.15) || opacityColor,
    radioUnselectedBorderColor: 'transparent',
    radioSelectedBorderColor: mainColorHex,
    radioSelectedBorderEffect: 'none',
    radioInputUnselectedColor: '#cccccc',
    radioInputSelectedColor: mainColorHex,
    radioFontSize: '14px',
    errorMessageBgColor: '#ffebee',
    errorMessageTextColor: '#d32f2f',
    errorMessageFontSize: '14px',
    modalBgColor: '#ffffff',
    modalTitleTextColor: '#333333',
    modalTitleFontSize: '16px',
    modalTitleAlignment: 'left',
  };
};

export const createEmptyThemeSettings = () => Object.fromEntries(
  THEME_FIELD_KEYS.map((key) => [key, '']),
);

export const mergeThemeWithDefaults = (rawTheme, mainColorHex, apiColorKey) => {
  const defaults = deriveThemeDefaults(mainColorHex, apiColorKey);
  const merged = { ...defaults };

  if (!rawTheme || typeof rawTheme !== 'object') {
    return merged;
  }

  THEME_FIELD_KEYS.forEach((key) => {
    const snakeKey = CAMEL_TO_SNAKE_THEME[key];
    const value = rawTheme[key] ?? rawTheme[snakeKey];
    if (value !== undefined && value !== null && value !== '') {
      merged[key] = value;
    }
  });

  merged.fieldFocusBgEffect = normalizeFieldFocusEffect(merged.fieldFocusBgEffect);
  merged.checkboxCheckedBorderEffect = normalizeBorderTwinkleEffect(
    merged.checkboxCheckedBorderEffect,
  );
  merged.radioSelectedBorderEffect = normalizeBorderTwinkleEffect(
    merged.radioSelectedBorderEffect,
  );
  merged.buttonBorderStyle = normalizeButtonBorderStyle(merged.buttonBorderStyle);
  merged.buttonEffect = normalizeButtonEffect(merged.buttonEffect);
  merged.buttonPosition = normalizeButtonPosition(merged.buttonPosition);
  merged.modalTitleAlignment = normalizeModalTitleAlignment(merged.modalTitleAlignment);

  const legacyHeaderColor = rawTheme.headerTextColor ?? rawTheme.header_text_color;
  if (legacyHeaderColor) {
    if (!rawTheme.headerTitleTextColor && !rawTheme.header_title_text_color) {
      merged.headerTitleTextColor = legacyHeaderColor;
    }
    if (!rawTheme.headerSubtitleTextColor && !rawTheme.header_subtitle_text_color) {
      merged.headerSubtitleTextColor = legacyHeaderColor;
    }
  }

  return merged;
};

export const parseThemeSettings = (rawTheme, mainColorHex, apiColorKey) => mergeThemeWithDefaults(
  rawTheme,
  mainColorHex,
  apiColorKey,
);

export const resolveBotMessageTheme = (themeSettings, botInfor) => {
  const { apiColorKey, mainColorHex } = resolveMainColorContext(botInfor);
  const theme = mergeThemeWithDefaults(themeSettings, mainColorHex, apiColorKey);
  return {
    bgColor: theme.botMessageBgColor,
    textColor: theme.botMessageTextColor,
    fontSize: theme.botMessageFontSize,
  };
};

export const buildThemePayload = (themeSettings) => {
  const payload = {};
  THEME_FIELD_KEYS.forEach((key) => {
    const snakeKey = CAMEL_TO_SNAKE_THEME[key];
    let value = themeSettings[key];
    if (key === 'fieldFocusBgEffect' && value) {
      value = normalizeFieldFocusEffect(value);
    }
    if (key === 'checkboxCheckedBorderEffect' && value) {
      value = normalizeBorderTwinkleEffect(value);
    }
    if (key === 'radioSelectedBorderEffect' && value) {
      value = normalizeBorderTwinkleEffect(value);
    }
    if (key === 'buttonBorderStyle' && value) {
      value = normalizeButtonBorderStyle(value);
    }
    if (key === 'buttonEffect' && value) {
      value = normalizeButtonEffect(value);
    }
    if (key === 'buttonPosition' && value) {
      value = normalizeButtonPosition(value);
    }
    if (key === 'modalTitleAlignment' && value) {
      value = normalizeModalTitleAlignment(value);
    }
    if (value !== undefined && value !== '') {
      payload[snakeKey] = value;
    }
  });
  return payload;
};

export const themeSettingsToSnakeCase = buildThemePayload;
