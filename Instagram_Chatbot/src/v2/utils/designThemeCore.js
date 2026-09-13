const COLOR_MAP = {
  blue: '#327AED',
  green: '#26B197',
  orange: '#fC7E02',
  yellow: '#F6CA21',
  pink: '#F16FAA',
  purple: '#8C66D9',
  black: '#7C8290',
  white: '#D8E2EF',
};

const DEFAULT_MAIN_COLOR = '#327AED';

const FIELD_FOCUS_EFFECT_IDS = ['none', 'outline_soft', 'outline_strong', 'border_twinkle'];
const BORDER_TWINKLE_EFFECT_IDS = ['none', 'twinkle'];
const BUTTON_BORDER_STYLE_IDS = ['square', 'rounded', 'pill'];
const BUTTON_EFFECT_IDS = ['none', 'bounce'];
const BUTTON_POSITION_IDS = ['left', 'center', 'right'];
const MESSAGE_BORDER_STYLE_IDS = ['with_tail', 'no_tail'];
const MODAL_TITLE_ALIGNMENT_IDS = ['left', 'center', 'right'];

export const THEME_FIELD_KEYS = [
  'headerTitleTextColor',
  'headerTitleFontSize',
  'headerSubtitleTextColor',
  'headerSubtitleFontSize',
  'progressBarBgColor',
  'progressBarTextColor',
  'progressBarFontSize',
  'chatWindowBgColor',
  'botMessageBgColor',
  'botMessageTextColor',
  'botMessageFontSize',
  'botMessageBorderStyle',
  'userMessageBgColor',
  'userMessageTextColor',
  'userMessageFontSize',
  'userMessageBorderStyle',
  'fieldFocusBorderColor',
  'fieldFocusBgColor',
  'fieldFocusBgEffect',
  'fieldUnfocusBorderColor',
  'fieldUnfocusBgColor',
  'fieldFontSize',
  'validationMessageBgColor',
  'validationMessageTextColor',
  'validationMessageFontSize',
  'requiredLabelTextColor',
  'requiredLabelFontSize',
  'buttonNormalBgColor',
  'buttonNormalTextColor',
  'buttonPressedBgColor',
  'buttonPressedTextColor',
  'buttonDisabledBgColor',
  'buttonDisabledTextColor',
  'buttonFontSize',
  'buttonBorderStyle',
  'buttonEffect',
  'buttonWidth',
  'buttonPadding',
  'buttonPosition',
  'checkboxUncheckedBgColor',
  'checkboxUncheckedBorderColor',
  'checkboxCheckedBgColor',
  'checkboxCheckedBorderColor',
  'checkboxCheckedBorderEffect',
  'checkboxFontSize',
  'radioUnselectedBgColor',
  'radioSelectedBgColor',
  'radioUnselectedBorderColor',
  'radioSelectedBorderColor',
  'radioSelectedBorderEffect',
  'radioInputUnselectedColor',
  'radioInputSelectedColor',
  'radioFontSize',
  'errorMessageBgColor',
  'errorMessageTextColor',
  'errorMessageFontSize',
  'modalBgColor',
  'modalTitleTextColor',
  'modalTitleFontSize',
  'modalTitleAlignment',
  'modalCancelButtonBgColor',
  'modalCancelButtonTextColor',
  'modalCancelButtonBorderColor',
  'modalCloseButtonBgColor',
  'modalCloseButtonTextColor',
  'modalButtonFontSize',
];

export const CAMEL_TO_SNAKE_THEME = {
  headerTitleTextColor: 'header_title_text_color',
  headerTitleFontSize: 'header_title_font_size',
  headerSubtitleTextColor: 'header_subtitle_text_color',
  headerSubtitleFontSize: 'header_subtitle_font_size',
  progressBarBgColor: 'progress_bar_bg_color',
  progressBarTextColor: 'progress_bar_text_color',
  progressBarFontSize: 'progress_bar_font_size',
  chatWindowBgColor: 'chat_window_bg_color',
  botMessageBgColor: 'bot_message_bg_color',
  botMessageTextColor: 'bot_message_text_color',
  botMessageFontSize: 'bot_message_font_size',
  botMessageBorderStyle: 'bot_message_border_style',
  userMessageBgColor: 'user_message_bg_color',
  userMessageTextColor: 'user_message_text_color',
  userMessageFontSize: 'user_message_font_size',
  userMessageBorderStyle: 'user_message_border_style',
  fieldFocusBorderColor: 'field_focus_border_color',
  fieldFocusBgColor: 'field_focus_bg_color',
  fieldFocusBgEffect: 'field_focus_bg_effect',
  fieldUnfocusBorderColor: 'field_unfocus_border_color',
  fieldUnfocusBgColor: 'field_unfocus_bg_color',
  fieldFontSize: 'field_font_size',
  validationMessageBgColor: 'validation_message_bg_color',
  validationMessageTextColor: 'validation_message_text_color',
  validationMessageFontSize: 'validation_message_font_size',
  requiredLabelTextColor: 'required_label_text_color',
  requiredLabelFontSize: 'required_label_font_size',
  buttonNormalBgColor: 'button_normal_bg_color',
  buttonNormalTextColor: 'button_normal_text_color',
  buttonPressedBgColor: 'button_pressed_bg_color',
  buttonPressedTextColor: 'button_pressed_text_color',
  buttonDisabledBgColor: 'button_disabled_bg_color',
  buttonDisabledTextColor: 'button_disabled_text_color',
  buttonFontSize: 'button_font_size',
  buttonBorderStyle: 'button_border_style',
  buttonEffect: 'button_effect',
  buttonWidth: 'button_width',
  buttonPadding: 'button_padding',
  buttonPosition: 'button_position',
  checkboxUncheckedBgColor: 'checkbox_unchecked_bg_color',
  checkboxUncheckedBorderColor: 'checkbox_unchecked_border_color',
  checkboxCheckedBgColor: 'checkbox_checked_bg_color',
  checkboxCheckedBorderColor: 'checkbox_checked_border_color',
  checkboxCheckedBorderEffect: 'checkbox_checked_border_effect',
  checkboxFontSize: 'checkbox_font_size',
  radioUnselectedBgColor: 'radio_unselected_bg_color',
  radioSelectedBgColor: 'radio_selected_bg_color',
  radioUnselectedBorderColor: 'radio_unselected_border_color',
  radioSelectedBorderColor: 'radio_selected_border_color',
  radioSelectedBorderEffect: 'radio_selected_border_effect',
  radioInputUnselectedColor: 'radio_input_unselected_color',
  radioInputSelectedColor: 'radio_input_selected_color',
  radioFontSize: 'radio_font_size',
  errorMessageBgColor: 'error_message_bg_color',
  errorMessageTextColor: 'error_message_text_color',
  errorMessageFontSize: 'error_message_font_size',
  modalBgColor: 'modal_bg_color',
  modalTitleTextColor: 'modal_title_text_color',
  modalTitleFontSize: 'modal_title_font_size',
  modalTitleAlignment: 'modal_title_alignment',
  modalCancelButtonBgColor: 'modal_cancel_button_bg_color',
  modalCancelButtonTextColor: 'modal_cancel_button_text_color',
  modalCancelButtonBorderColor: 'modal_cancel_button_border_color',
  modalCloseButtonBgColor: 'modal_close_button_bg_color',
  modalCloseButtonTextColor: 'modal_close_button_text_color',
  modalButtonFontSize: 'modal_button_font_size',
};

const resolveMainColorFromApi = (apiColor) => {
  if (!apiColor) return null;
  if (COLOR_MAP[apiColor]) return COLOR_MAP[apiColor];
  return apiColor;
};

export const resolveMainColorContext = (chatbot) => {
  const apiColorKey = chatbot?.main_color && !String(chatbot.main_color).startsWith('#')
    ? chatbot.main_color
    : null;
  const mainColorHex = chatbot?.main_color_other
    || resolveMainColorFromApi(chatbot?.main_color)
    || chatbot?.main_color
    || DEFAULT_MAIN_COLOR;

  return { apiColorKey, mainColorHex };
};

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
    botMessageBorderStyle: 'with_tail',
    userMessageBgColor: '#ffffff',
    userMessageTextColor: '#333333',
    userMessageFontSize: '14px',
    userMessageBorderStyle: 'no_tail',
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
    modalCancelButtonBgColor: '#ffffff',
    modalCancelButtonTextColor: '#333333',
    modalCancelButtonBorderColor: '#D0D6DC',
    modalCloseButtonBgColor: '#d9534f',
    modalCloseButtonTextColor: '#ffffff',
    modalButtonFontSize: '14px',
  };
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
