import { COLOR_MAP } from '../constants/designChatbotConstants';
import { resolveMainColorContext } from './designChatbotUtils';
import {
  BORDER_TWINKLE_EFFECT_IDS,
  CAMEL_TO_SNAKE_THEME,
  FIELD_FOCUS_EFFECT_IDS,
  THEME_FIELD_KEYS,
} from '../constants/designThemeConstants';

const VALID_EFFECT_IDS = new Set(FIELD_FOCUS_EFFECT_IDS);
const VALID_BORDER_TWINKLE_IDS = new Set(BORDER_TWINKLE_EFFECT_IDS);

const FIELD_BORDER_TWINKLE_KEYFRAMES = `
@keyframes themeFieldBorderTwinkle {
  0%, 100% { box-shadow: 0 0 0 2px var(--c-field-focus-border, #327AED); }
  50% { box-shadow: 0 0 0 2px transparent; }
}`;

const CHECKBOX_BORDER_TWINKLE_KEYFRAMES = `
@keyframes themeCheckboxBorderTwinkle {
  0%, 100% { box-shadow: 0 0 0 1px var(--c-checkbox-checked-border); }
  50% { box-shadow: 0 0 0 1px transparent; }
}`;

const RADIO_BORDER_TWINKLE_KEYFRAMES = `
@keyframes themeRadioBorderTwinkle {
  0%, 100% { box-shadow: 0 0 0 1px var(--c-radio-selected-border, transparent); }
  50% { box-shadow: 0 0 0 1px transparent; }
}`;

const TWINKLE_KEYFRAMES_BY_ELEMENT = {
  field: FIELD_BORDER_TWINKLE_KEYFRAMES,
  checkbox: CHECKBOX_BORDER_TWINKLE_KEYFRAMES,
  radio: RADIO_BORDER_TWINKLE_KEYFRAMES,
};

const TWINKLE_ANIMATION_BY_ELEMENT = {
  field: 'themeFieldBorderTwinkle 1.2s ease-in-out infinite',
  checkbox: 'themeCheckboxBorderTwinkle 1.2s ease-in-out infinite',
  radio: 'themeRadioBorderTwinkle 1.2s ease-in-out infinite',
};

export const normalizeBorderTwinkleEffect = (value) => {
  if (!value) return 'none';
  if (VALID_BORDER_TWINKLE_IDS.has(value)) return value;
  return 'none';
};

export const resolveBorderTwinkleEffect = (effectId, elementType) => {
  if (normalizeBorderTwinkleEffect(effectId) !== 'twinkle') {
    return { animation: 'none', keyframesCss: '' };
  }

  return {
    animation: TWINKLE_ANIMATION_BY_ELEMENT[elementType] || 'none',
    keyframesCss: TWINKLE_KEYFRAMES_BY_ELEMENT[elementType] || '',
  };
};

const isLegacyFocusEffectValue = (value) => typeof value === 'string' && (
  value.includes('px')
  || value.includes('rgba')
  || value.includes('rgb')
);

export const normalizeFieldFocusEffect = (value) => {
  if (!value) return 'outline_soft';
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
    case 'border_fade':
      return {
        boxShadow: 'none',
        fieldTransition: 'border-color 0.3s ease',
        focusAnimation: 'none',
        keyframesCss: '',
      };
    case 'border_pulse':
      return {
        boxShadow: 'none',
        fieldTransition: 'none',
        focusAnimation: 'themeFieldBorderPulse 1.2s ease-in-out infinite',
        keyframesCss: `
@keyframes themeFieldBorderPulse {
  0%, 100% { border-color: var(--c-field-unfocus-border, #ccc); }
  50% { border-color: var(--c-field-focus-border, #327AED); }
}`,
      };
    case 'border_twinkle':
      return {
        boxShadow: 'none',
        fieldTransition: 'none',
        focusAnimation: TWINKLE_ANIMATION_BY_ELEMENT.field,
        keyframesCss: FIELD_BORDER_TWINKLE_KEYFRAMES,
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
    buttonNormalBgColor: mainColorHex,
    buttonNormalTextColor: '#ffffff',
    buttonPressedBgColor: pressedColor,
    buttonPressedTextColor: '#ffffff',
    buttonDisabledBgColor: '#e0e0e0',
    buttonDisabledTextColor: '#999999',
    buttonFontSize: '14px',
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
    if (value !== undefined && value !== '') {
      payload[snakeKey] = value;
    }
  });
  return payload;
};

export const themeSettingsToSnakeCase = buildThemePayload;
