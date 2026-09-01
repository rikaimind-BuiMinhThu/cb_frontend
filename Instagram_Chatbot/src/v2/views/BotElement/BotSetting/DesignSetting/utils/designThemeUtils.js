import { COLOR_MAP, DEFAULT_MAIN_COLOR } from '../constants/designChatbotConstants';
import { resolveMainColorContext } from './designChatbotUtils';
import {
  BORDER_TWINKLE_EFFECT_IDS,
  BUTTON_BORDER_STYLE_IDS,
  BUTTON_EFFECT_IDS,
  BUTTON_POSITION_IDS,
  CAMEL_TO_SNAKE_THEME,
  FIELD_FOCUS_EFFECT_IDS,
  MESSAGE_BORDER_STYLE_IDS,
  MODAL_TITLE_ALIGNMENT_IDS,
  THEME_FIELD_KEYS,
} from '../constants/designThemeConstants';

const VALID_EFFECT_IDS = new Set(FIELD_FOCUS_EFFECT_IDS);
const VALID_BORDER_TWINKLE_IDS = new Set(BORDER_TWINKLE_EFFECT_IDS);
const VALID_BUTTON_BORDER_STYLE_IDS = new Set(BUTTON_BORDER_STYLE_IDS);
const VALID_BUTTON_EFFECT_IDS = new Set(BUTTON_EFFECT_IDS);
const VALID_BUTTON_POSITION_IDS = new Set(BUTTON_POSITION_IDS);
const VALID_MESSAGE_BORDER_STYLE_IDS = new Set(MESSAGE_BORDER_STYLE_IDS);
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

export const normalizeMessageBorderStyle = (value, fallback = 'with_tail') => {
  if (!value) return fallback;
  if (VALID_MESSAGE_BORDER_STYLE_IDS.has(value)) return value;
  return fallback;
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

export const expandHexColor = (value) => {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  // Bug #4: Restore to default / picker hỏng với hex 3 ký tự (vd #fff) — expand thành 6 ký tự.
  const shortMatch = /^#([0-9a-fA-F]{3})$/.exec(trimmed);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  const longMatch = /^#([0-9a-fA-F]{6})$/.exec(trimmed);
  if (longMatch) return `#${longMatch[1]}`.toLowerCase();
  return trimmed;
};

export const isCssHexColor = (value) => /^#[0-9a-f]{6}$/.test(expandHexColor(value));

export const hexColorsEqual = (left, right) => {
  const leftHex = expandHexColor(left);
  const rightHex = expandHexColor(right);
  return Boolean(leftHex) && leftHex === rightHex && isCssHexColor(leftHex);
};

const PRESET_DERIVED = {
  // Bug #8: Màu default từng section lệch test case — palette cố định (Bot bubble #3CACEF, không derive từ header).
  blue: { opacity: '#D6E0EF', message: '#3CACEF', font: '#ffffff' },
  green: { opacity: '#DEEADB', message: '#9DDB7C', font: '#ffffff' },
  orange: { opacity: '#F4E5DA', message: '#EF8D2F', font: '#ffffff' },
  yellow: { opacity: '#F0EFEB', message: '#F3AA2D', font: '#ffffff' },
  pink: { opacity: '#EBDDE3', message: '#E65B83', font: '#ffffff' },
  purple: { opacity: '#E9E8F1', message: '#AF82D5', font: '#ffffff' },
  black: { opacity: '#ECEDE8', message: '#C3C3C3', font: '#000000' },
  white: { opacity: '#ffffff', message: '#F5F5F5', font: '#000000' },
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
  const hexEntry = Object.entries(COLOR_MAP).find(
    ([, value]) => hexColorsEqual(value, mainColorHex),
  );
  if (hexEntry) return hexEntry[0];
  if (apiColorKey && PRESET_DERIVED[apiColorKey]) return apiColorKey;
  return null;
};

export const deriveThemeDefaults = (mainColorHex = DEFAULT_MAIN_COLOR, apiColorKey = null) => {
  const normalizedMain = expandHexColor(mainColorHex) || DEFAULT_MAIN_COLOR;
  const presetKey = resolvePresetKey(normalizedMain, apiColorKey);
  const preset = presetKey ? PRESET_DERIVED[presetKey] : null;
  const opacityColor = preset?.opacity || lightenHex(normalizedMain, 0.1);
  const messageColor = preset?.message || normalizedMain;
  const fontColor = preset?.font || '#ffffff';
  const pressedColor = presetKey === 'black' || presetKey === 'white'
    ? normalizedMain
    : lightenHex(normalizedMain, -0.08) || normalizedMain;
  const radioSelectedBg = lightenHex(normalizedMain, 0.15) || opacityColor;

  // Bug #4 / #8: default từng section khớp test case (Header #327AED, Bot #3CACEF, User #fff/#333, ...).
  return {
    headerBgColor: normalizedMain,
    headerTitleTextColor: '#ffffff',
    headerTitleFontSize: '15px',
    headerSubtitleTextColor: '#ffffff',
    headerSubtitleFontSize: '14px',
    progressBarBgColor: opacityColor,
    progressBarFillColor: normalizedMain,
    progressBarTextColor: '#ffffff',
    progressBarFontSize: '13px',
    chatWindowBgColor: opacityColor,
    botMessageBgColor: messageColor,
    botMessageTextColor: fontColor,
    botMessageFontSize: '14px',
    botMessageBorderStyle: 'with_tail',
    userMessageBgColor: '#ffffff',
    userMessageTextColor: '#333333',
    userMessageFontSize: '14px',
    userMessageBorderStyle: 'no_tail',
    fieldFocusBorderColor: normalizedMain,
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
    buttonNormalBgColor: normalizedMain,
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
    checkboxCheckedBgColor: normalizedMain,
    checkboxCheckedBorderColor: normalizedMain,
    checkboxCheckedBorderEffect: 'none',
    checkboxFontSize: '14px',
    radioUnselectedBgColor: opacityColor,
    radioSelectedBgColor: radioSelectedBg,
    radioUnselectedBorderColor: 'transparent',
    radioSelectedBorderColor: normalizedMain,
    radioSelectedBorderEffect: 'none',
    radioInputUnselectedColor: '#cccccc',
    radioInputSelectedColor: normalizedMain,
    radioFontSize: '14px',
    errorMessageBgColor: '#ffebee',
    errorMessageTextColor: '#d32f2f',
    errorMessageFontSize: '14px',
    modalBgColor: '#ffffff',
    modalTitleTextColor: '#333333',
    modalTitleFontSize: '16px',
    modalTitleAlignment: 'left',
    modalCancelButtonBgColor: '#ffffff',
    modalCancelButtonTextColor: '#333333',
    modalCancelButtonBorderColor: '#D0D6DC',
    modalCloseButtonBgColor: '#d9534f',
    modalCloseButtonTextColor: '#ffffff',
    modalButtonFontSize: '14px',
  };
};

export const createEmptyThemeSettings = () => Object.fromEntries(
  THEME_FIELD_KEYS.map((key) => [key, '']),
);

// Bug #1 / #6: header chatbot/preview lấy headerBgColor (hoặc header_bg_color từ API), không lấy màu nút.
export const resolveHeaderBgColor = (theme, mainColorHex = DEFAULT_MAIN_COLOR) => {
  const raw = theme?.headerBgColor || theme?.header_bg_color;
  if (raw && isCssHexColor(raw)) {
    return expandHexColor(raw);
  }
  if (isCssHexColor(mainColorHex)) {
    return expandHexColor(mainColorHex);
  }
  return DEFAULT_MAIN_COLOR;
};

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
  merged.botMessageBorderStyle = normalizeMessageBorderStyle(
    merged.botMessageBorderStyle,
    'with_tail',
  );
  merged.userMessageBorderStyle = normalizeMessageBorderStyle(
    merged.userMessageBorderStyle,
    'no_tail',
  );
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

export const resolveUserMessageTheme = (themeSettings, botInfor) => {
  const { apiColorKey, mainColorHex } = resolveMainColorContext(botInfor);
  const theme = mergeThemeWithDefaults(themeSettings, mainColorHex, apiColorKey);
  return {
    bgColor: theme.userMessageBgColor,
    textColor: theme.userMessageTextColor,
    fontSize: theme.userMessageFontSize,
    showTail: normalizeMessageBorderStyle(theme.userMessageBorderStyle, 'no_tail') === 'with_tail',
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
    if (key === 'botMessageBorderStyle' && value) {
      value = normalizeMessageBorderStyle(value, 'with_tail');
    }
    if (key === 'userMessageBorderStyle' && value) {
      value = normalizeMessageBorderStyle(value, 'no_tail');
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
