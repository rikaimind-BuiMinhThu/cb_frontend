import {
  CAMEL_TO_SNAKE_THEME,
  THEME_FIELD_KEYS,
  mergeThemeWithDefaults,
  normalizeBorderTwinkleEffect,
  normalizeButtonBorderStyle,
  normalizeButtonEffect,
  normalizeButtonPosition,
  normalizeFieldFocusEffect,
  normalizeMessageBorderStyle,
  normalizeModalTitleAlignment,
} from 'v2/utils/designThemeCore';

export {
  buildFieldBorderTwinkleKeyframes,
  buildCheckboxBorderTwinkleKeyframes,
  buildRadioBorderTwinkleKeyframes,
  normalizeBorderTwinkleEffect,
  normalizeButtonBorderStyle,
  normalizeMessageBorderStyle,
  normalizeButtonEffect,
  normalizeButtonPosition,
  normalizeModalTitleAlignment,
  resolveModalTitleTextAlign,
  resolveButtonBorderRadius,
  buildButtonBounceKeyframes,
  resolveButtonBounceEffect,
  resolveButtonWidthCss,
  resolveButtonPaddingCss,
  resolveButtonPositionJustify,
  resolveBorderTwinkleEffect,
  normalizeFieldFocusEffect,
  resolveFieldFocusEffect,
  deriveThemeDefaults,
  mergeThemeWithDefaults,
  CAMEL_TO_SNAKE_THEME,
  resolveBotMessageTheme,
  resolveUserMessageTheme,
} from 'v2/utils/designThemeCore';

export const createEmptyThemeSettings = () => Object.fromEntries(
  THEME_FIELD_KEYS.map((key) => [key, '']),
);

export const parseThemeSettings = (rawTheme, mainColorHex, apiColorKey) => mergeThemeWithDefaults(
  rawTheme,
  mainColorHex,
  apiColorKey,
);

const THEME_VALUE_NORMALIZERS = {
  fieldFocusBgEffect: (value) => (value ? normalizeFieldFocusEffect(value) : value),
  checkboxCheckedBorderEffect: (value) => (value ? normalizeBorderTwinkleEffect(value) : value),
  radioSelectedBorderEffect: (value) => (value ? normalizeBorderTwinkleEffect(value) : value),
  buttonBorderStyle: (value) => (value ? normalizeButtonBorderStyle(value) : value),
  botMessageBorderStyle: (value) => (value ? normalizeMessageBorderStyle(value, 'with_tail') : value),
  userMessageBorderStyle: (value) => (value ? normalizeMessageBorderStyle(value, 'no_tail') : value),
  buttonEffect: (value) => (value ? normalizeButtonEffect(value) : value),
  buttonPosition: (value) => (value ? normalizeButtonPosition(value) : value),
  modalTitleAlignment: (value) => (value ? normalizeModalTitleAlignment(value) : value),
};

export const buildThemePayload = (themeSettings) => {
  const payload = {};
  THEME_FIELD_KEYS.forEach((key) => {
    const snakeKey = CAMEL_TO_SNAKE_THEME[key];
    const rawValue = themeSettings[key];
    const normalize = THEME_VALUE_NORMALIZERS[key];
    const value = normalize ? normalize(rawValue) : rawValue;
    if (value !== undefined && value !== '') {
      payload[snakeKey] = value;
    }
  });
  return payload;
};

export const themeSettingsToSnakeCase = buildThemePayload;
