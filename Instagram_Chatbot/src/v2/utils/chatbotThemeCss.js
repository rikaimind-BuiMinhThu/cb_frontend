import {
  mergeThemeWithDefaults,
  normalizeMessageBorderStyle,
  resolveBorderTwinkleEffect,
  resolveButtonBorderRadius,
  resolveButtonBounceEffect,
  resolveButtonPaddingCss,
  resolveButtonPositionJustify,
  resolveButtonWidthCss,
  resolveFieldFocusEffect,
  resolveHeaderTitleJustify,
  resolveModalTitleTextAlign,
  resolveMainColorContext,
  hasExplicitThemeValue,
  CAMEL_TO_SNAKE_THEME,
} from './designThemeCore';
import { buildDesignTypeChromeCss } from './designTypeChrome';

const LIVE_THEME_ROOTS = ['#sp-container1', '.sp-container1', '#sp-container', '.sp-container'];
const LIVE_THEME_SCOPE = LIVE_THEME_ROOTS.join(', ');

const toScopeIs = (scopeSelector) => {
  const roots = scopeSelector.split(',').map((s) => s.trim()).filter(Boolean);
  if (roots.length <= 1) return roots[0] || '';
  return `:is(${roots.join(', ')})`;
};

const scopedDescendant = (scopeSelector, suffix) => {
  const trimmed = suffix.trim();
  if (!scopeSelector) return trimmed.startsWith('.') || trimmed.startsWith('#') || trimmed.startsWith('[')
    ? trimmed
    : `.${trimmed}`;
  const root = toScopeIs(scopeSelector);
  return `${root} ${trimmed}`;
};

const scopedClass = (scopeSelector, className) =>
  scopedDescendant(scopeSelector, className.startsWith('.') ? className : `.${className}`);

const USER_MESSAGE_TITLE_CLASSES = [
  '.ss-message__content--user-text-input-title',
  '.ss-message__content--user-label-title',
  '.ss-message__content--user-textarea-title',
  '.ss-message__content--user-radio_button-title',
  '.ss-message__content--user-checkbox-title',
  '.ss-message__content--user-pull_down-title',
  '.ss-message__content--user-zip-code-address-post-code-label',
  '.ss-message__content--user-zip-code-address-label',
  '.ss-message__content--user-calender-title',
  '.ss-message__content--user-agree_to_term-title',
  '.ss-message__content--user-shipping-address-title',
];

const USER_MESSAGE_FIELD_LABEL_CLASSES = [
  '.ss-input-custom-label',
  '.select-custom-label',
  '.ss-message__content--user-field-label',
];

const USER_MESSAGE_BUBBLE_LABEL_SELECTORS = [
  '.ss-message__content--user-checkbox > label',
  '.ss-message__content--user-checkbox--block_style > span',
  '.ss-message__content--user-radio_button > label',
  '.ss-message__content--user-radio_button--block_style > span',
  '.theme-customize-preview__checkbox-option > label',
  '.theme-customize-preview__radio-default > label',
];

const AGREE_TERM_DESIGN_CLASS = '.ss-agree-term-design';

const buildAgreeTermDesignOverrideRules = (spBodySelector) => {
  const root = `${spBodySelector} ${AGREE_TERM_DESIGN_CLASS}`;
  return `
${root} .ss-agree-term-design__title {
  color: var(--agree-term-title-color) !important;
  font-weight: 400 !important;
}

${root} .ss-agree-term-design__title--bold {
  font-weight: 700 !important;
}

${root} .ss-agree-term-design__label {
  color: var(--agree-term-label-color) !important;
  font-size: var(--agree-term-label-size) !important;
  font-weight: 400 !important;
}

${root} .ss-agree-term-design__label--bold {
  font-weight: 700 !important;
}

${root} .ant-checkbox-inner {
  width: var(--agree-term-checkbox-size) !important;
  height: var(--agree-term-checkbox-size) !important;
  background-color: var(--agree-term-checkbox-bg) !important;
  border-style: solid !important;
  border-color: var(--agree-term-checkbox-border-color) !important;
  border-width: var(--agree-term-checkbox-border-width) !important;
}

${root} .ant-checkbox-checked .ant-checkbox-inner,
${root} .ant-checkbox-wrapper:hover .ant-checkbox-inner,
${root} .ant-checkbox:hover .ant-checkbox-inner,
${root} .ant-checkbox-checked:hover .ant-checkbox-inner {
  background-color: var(--agree-term-checkbox-bg) !important;
  border-color: var(--agree-term-checkbox-border-color) !important;
}

${root} .ant-checkbox-checked .ant-checkbox-inner::after {
  width: calc(var(--agree-term-checkbox-size) * 0.35) !important;
  height: calc(var(--agree-term-checkbox-size) * 0.55) !important;
  border-style: solid !important;
  border-color: var(--agree-term-tick-color) !important;
  border-top-width: 0 !important;
  border-left-width: 0 !important;
  border-right-width: var(--agree-term-tick-width) !important;
  border-bottom-width: var(--agree-term-tick-width) !important;
}

${root} .ant-checkbox-disabled .ant-checkbox-inner,
${root} .ant-checkbox-disabled:hover .ant-checkbox-inner,
${root} .ant-checkbox-wrapper:hover .ant-checkbox-disabled .ant-checkbox-inner {
  background-color: var(--agree-term-checkbox-bg) !important;
  border-color: var(--agree-term-checkbox-border-color) !important;
}

${root} .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: var(--agree-term-tick-color) !important;
}
`;
};

const buildUserMessageTitleSelectors = (scopeSelector) => (
  USER_MESSAGE_TITLE_CLASSES
    .map((className) => scopedDescendant(scopeSelector, className))
    .join(',\n')
);

const buildUserMessageFieldLabelSelectors = (scopeSelector) => (
  USER_MESSAGE_FIELD_LABEL_CLASSES
    .map((className) => scopedDescendant(scopeSelector, className))
    .join(',\n')
);

const buildUserBubbleTextSelectors = (scopeSelector) => {
  const wrapperPrefix = '.ss-user-message__content-wrapper';
  const titleSelectors = USER_MESSAGE_TITLE_CLASSES.map(
    (className) => scopedDescendant(scopeSelector, `${wrapperPrefix} ${className}`),
  );
  const labelSelectors = USER_MESSAGE_BUBBLE_LABEL_SELECTORS.map(
    (selector) => scopedDescendant(scopeSelector, `${wrapperPrefix} ${selector}`),
  );
  return [...titleSelectors, ...labelSelectors].join(',\n');
};

const withPseudoOnEach = (selectorList, pseudo) =>
  selectorList
    .split(',')
    .map((selector) => `${selector.trim()}${pseudo}`)
    .join(', ');

/** Prefix each selector so mobile field font can beat the theme 14px !important rule. */
const withMobileBody = (selectorList) =>
  selectorList
    .split(',')
    .map((selector) => selector.trim())
    .filter(Boolean)
    .map((selector) => `body.is_mobile ${selector}`)
    .join(',\n');

const buildFieldTextSelectors = (spBodySelector) => `
${spBodySelector} input[type="text"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="email"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="tel"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="number"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="password"]:not(.theme-preview--field-focus),
${spBodySelector} textarea:not(.theme-preview--field-focus),
${spBodySelector} .ss-input-value:not(.ss-bot-chat-detail-content):not(.theme-preview--field-focus),
${spBodySelector} .ss-input-custom-field:not(.ss-bot-chat-detail-content)
`.trim();

const buildFieldSelectSelectors = (spBodySelector) => `
${spBodySelector} select:not(.theme-preview--field-focus),
${spBodySelector} .select-custom-native:not(.theme-preview--field-focus),
${spBodySelector} .ant-select-selector
`.trim();

const buildFieldPlaceholderSelectors = (spBodySelector) => `
${spBodySelector} input[type="text"]::placeholder,
${spBodySelector} input[type="email"]::placeholder,
${spBodySelector} input[type="tel"]::placeholder,
${spBodySelector} input[type="number"]::placeholder,
${spBodySelector} input[type="password"]::placeholder,
${spBodySelector} textarea::placeholder,
${spBodySelector} .ss-input-value:not(.ss-bot-chat-detail-content)::placeholder,
${spBodySelector} .ss-input-custom-field:not(.ss-bot-chat-detail-content)::placeholder,
${spBodySelector} .ant-input-number-input::placeholder,
${spBodySelector} .ant-input-number-input::-webkit-input-placeholder,
${spBodySelector} .ant-select-selection-search-input::placeholder
`.trim();

const buildFieldInputNumberSelectors = (spBodySelector) => `
${spBodySelector} .ant-input-number.ss-input-value .ant-input-number-input,
${spBodySelector} .ant-input-number-input
`.trim();

const buildFieldSelectValueSelectors = (spBodySelector) => `
${spBodySelector} .ant-select-selection-item,
${spBodySelector} .ant-select-selection-search-input
`.trim();

const buildFieldSelectOptionSelectors = (spBodySelector) => `
${spBodySelector} .ant-select-item-option,
${spBodySelector} .ant-select-item-option-content
`.trim();

const buildNativeSelectPlaceholderSelectors = (spBodySelector) => `
${spBodySelector} select.select-custom-native:has(option[value=""]:checked)
`.trim();

const buildFieldFocusSelectors = (spBodySelector) => `
${spBodySelector} input[type="text"]:focus,
${spBodySelector} input[type="email"]:focus,
${spBodySelector} input[type="tel"]:focus,
${spBodySelector} input[type="number"]:focus,
${spBodySelector} input[type="password"]:focus,
${spBodySelector} textarea:focus,
${spBodySelector} select:focus,
${spBodySelector} .ss-input-value:not(.ss-bot-chat-detail-content):focus,
${spBodySelector} .ss-input-custom-field:not(.ss-bot-chat-detail-content):focus,
${spBodySelector} .select-custom-native:focus,
${spBodySelector} .ant-select-focused .ant-select-selector
`.trim();

const buildFieldScopeSelectors = (scopeSelector) => [
  scopeSelector ? scopedDescendant(scopeSelector, '.sp-body') : '.sp-body',
  scopeSelector
    ? scopedDescendant(scopeSelector, '.sp-popup-zip-code-address')
    : '.sp-popup-zip-code-address',
];

const combineScopedFieldSelectors = (scopeSelector, builder) =>
  buildFieldScopeSelectors(scopeSelector)
    .map((fieldScope) => builder(fieldScope))
    .join(',\n');

const themeIsBold = (value) => value === true || value === 'true' || value === 1 || value === '1';

const themeIsOff = (value) => value === false || value === 'false' || value === 0 || value === '0';

const buildThemeVariables = (theme) => {
  const buttonWidth = resolveButtonWidthCss(theme.buttonWidth);
  const buttonPadding = resolveButtonPaddingCss(theme.buttonPadding);
  const buttonBorderRadius = resolveButtonBorderRadius(theme.buttonBorderStyle);
  const buttonPositionJustify = resolveButtonPositionJustify(theme.buttonPosition);
  const headerTitleJustify = resolveHeaderTitleJustify(theme.headerTitleAlignment);

  return `
  --c-header-title-text: ${theme.headerTitleTextColor};
  --c-header-title-font-size: ${theme.headerTitleFontSize};
  --c-header-title-weight: ${themeIsBold(theme.headerTitleBold) ? 700 : 400};
  --c-header-subtitle-text: ${theme.headerSubtitleTextColor};
  --c-header-subtitle-font-size: ${theme.headerSubtitleFontSize};
  --c-header-subtitle-weight: ${themeIsBold(theme.headerSubtitleBold) ? 700 : 400};
  --c-header-title-justify: ${headerTitleJustify};
  --c-header-close-icon: ${theme.headerCloseIconColor || '#ffffff'};
  --c-header-bg: ${theme.headerBgColor || 'transparent'};
  --c-header-logo-image: ${theme.headerLogoImage ? `url("${theme.headerLogoImage}")` : 'none'};
  ${theme.headerHeight ? `--c-header-height: ${theme.headerHeight};` : ''}
  --c-progress-container-bg: ${theme.progressBarContainerBgColor || 'transparent'};
  --c-progress-bg: ${theme.progressBarBgColor};
  --c-progress-text: ${theme.progressBarTextColor};
  --c-progress-font-size: ${theme.progressBarFontSize};
  --c-progress-weight: ${themeIsBold(theme.progressBarBold) ? 700 : 400};
  --c-progress-height: ${theme.progressBarHeight || '20px'};
  --c-progress-radius: ${theme.progressBarRadius || '0px'};
  --c-progress-fill: ${theme.progressBarFillColor || 'transparent'};
  --c-chat-window-bg: ${theme.chatWindowBgColor};
  --c-bot-msg-bg: ${theme.botMessageBgColor};
  --c-bot-msg-text: ${theme.botMessageTextColor};
  --c-bot-msg-font-size: ${theme.botMessageFontSize};
  --c-bot-msg-weight: ${themeIsBold(theme.botMessageBold) ? 700 : 400};
  --c-user-msg-bg: ${theme.userMessageBgColor};
  --c-user-msg-text: ${theme.userMessageTextColor};
  --c-user-msg-font-size: ${theme.userMessageFontSize};
  --c-user-msg-weight: ${themeIsBold(theme.userMessageBold) ? 700 : 400};
  --c-field-focus-border: ${theme.fieldFocusBorderColor};
  --c-field-focus-border-width: ${theme.fieldFocusBorderWidth || '1px'};
  --c-field-focus-bg: ${theme.fieldFocusBgColor};
  --c-field-unfocus-border: ${theme.fieldUnfocusBorderColor};
  --c-field-unfocus-border-width: ${theme.fieldUnfocusBorderWidth || '1px'};
  --c-field-unfocus-bg: ${theme.fieldUnfocusBgColor};
  --c-field-font-size: ${theme.fieldFontSize};
  --c-field-text-weight: ${themeIsBold(theme.fieldTextBold) ? 700 : 400};
  --c-field-placeholder-weight: ${themeIsBold(theme.fieldPlaceholderBold) ? 700 : 400};
  --c-field-placeholder-size: ${theme.fieldPlaceholderFontSize || theme.fieldFontSize || '14px'};
  --c-field-placeholder-focus-size: ${theme.fieldPlaceholderFocusFontSize || '10px'};
  --c-field-title-weight: ${themeIsBold(theme.fieldTitleBold) ? 700 : 400};
  --c-field-title-size: ${theme.fieldTitleFontSize || theme.fieldFontSize || '14px'};
  --c-field-title-tracking: ${theme.fieldTitleLetterSpacing || '0px'};
  --c-validation-bg: ${theme.validationMessageBgColor};
  --c-validation-text: ${theme.validationMessageTextColor};
  --c-validation-font-size: ${theme.validationMessageFontSize};
  --c-required-label-text: ${theme.requiredLabelTextColor};
  --c-required-label-font-size: ${theme.requiredLabelFontSize};
  --c-btn-normal-bg: ${theme.buttonNormalBgColor};
  --c-btn-normal-text: ${theme.buttonNormalTextColor};
  --c-btn-pressed-bg: ${theme.buttonPressedBgColor};
  --c-btn-pressed-text: ${theme.buttonPressedTextColor};
  --c-btn-disabled-bg: ${theme.buttonDisabledBgColor};
  --c-btn-disabled-text: ${theme.buttonDisabledTextColor};
  --c-btn-font-size: ${theme.buttonFontSize};
  --c-btn-weight: ${themeIsBold(theme.buttonBold) ? 700 : 500};
  --c-btn-border-radius: ${buttonBorderRadius};
  --c-btn-width: ${buttonWidth};
  --c-btn-padding: ${buttonPadding};
  --c-btn-position-justify: ${buttonPositionJustify};
  --c-checkbox-unchecked-bg: ${theme.checkboxUncheckedBgColor};
  --c-checkbox-unchecked-border: ${theme.checkboxUncheckedBorderColor};
  --c-checkbox-checked-bg: ${theme.checkboxCheckedBgColor};
  --c-checkbox-checked-border: ${theme.checkboxCheckedBorderColor};
  --c-checkbox-font-size: ${theme.checkboxFontSize};
  --c-radio-unselected-bg: ${theme.radioUnselectedBgColor};
  --c-radio-selected-bg: ${theme.radioSelectedBgColor};
  --c-radio-unselected-border: ${theme.radioUnselectedBorderColor};
  --c-radio-selected-border: ${theme.radioSelectedBorderColor};
  --c-radio-input-unselected: ${theme.radioInputUnselectedColor};
  --c-radio-input-selected: ${theme.radioInputSelectedColor};
  --c-radio-font-size: ${theme.radioFontSize};
  --c-error-bg: ${theme.errorMessageBgColor};
  --c-error-text: ${theme.errorMessageTextColor};
  --c-error-font-size: ${theme.errorMessageFontSize};
  --c-thanks-bg: ${theme.thanksMessageBgColor};
  --c-thanks-text: ${theme.thanksMessageTextColor};
  --c-thanks-font-size: ${theme.thanksMessageFontSize};
  --c-modal-bg: ${theme.modalBgColor};
  --c-modal-title-text: ${theme.modalTitleTextColor};
  --c-modal-title-font-size: ${theme.modalTitleFontSize};
  --c-modal-title-align: ${resolveModalTitleTextAlign(theme.modalTitleAlignment)};
  --c-modal-cancel-btn-bg: ${theme.modalCancelButtonBgColor};
  --c-modal-cancel-btn-text: ${theme.modalCancelButtonTextColor};
  --c-modal-cancel-btn-border: ${theme.modalCancelButtonBorderColor};
  --c-modal-close-btn-bg: ${theme.modalCloseButtonBgColor};
  --c-modal-close-btn-text: ${theme.modalCloseButtonTextColor};
  --c-modal-btn-font-size: ${theme.modalButtonFontSize};
`;
};

const buildModalButtonVariables = (theme) => `
  --c-modal-cancel-btn-bg: ${theme.modalCancelButtonBgColor};
  --c-modal-cancel-btn-text: ${theme.modalCancelButtonTextColor};
  --c-modal-cancel-btn-border: ${theme.modalCancelButtonBorderColor};
  --c-modal-close-btn-bg: ${theme.modalCloseButtonBgColor};
  --c-modal-close-btn-text: ${theme.modalCloseButtonTextColor};
  --c-modal-btn-font-size: ${theme.modalButtonFontSize};
`;

const buildModalButtonRules = (scopePrefix) => `
${scopePrefix} .btn-cancel__modal-bot {
  background-color: var(--c-modal-cancel-btn-bg, #fff) !important;
  color: var(--c-modal-cancel-btn-text, #333) !important;
  border: 1px solid var(--c-modal-cancel-btn-border, #D0D6DC) !important;
  font-size: var(--c-modal-btn-font-size, 14px) !important;
}

${scopePrefix} .btn-cancel__modal-bot:hover {
  background-color: var(--c-modal-cancel-btn-bg, #fff) !important;
  color: var(--c-modal-cancel-btn-text, #333) !important;
  border: 1px solid var(--c-modal-cancel-btn-border, #D0D6DC) !important;
}

${scopePrefix} .btn-close__modal-bot {
  background-color: var(--c-modal-close-btn-bg, #d9534f) !important;
  color: var(--c-modal-close-btn-text, #fff) !important;
  font-size: var(--c-modal-btn-font-size, 14px) !important;
}

${scopePrefix} .btn-close__modal-bot:hover {
  background-color: var(--c-modal-close-btn-bg, #d9534f) !important;
  color: var(--c-modal-close-btn-text, #fff) !important;
}`.trim();

const buildPortalModalVariables = (theme) => `
  --c-modal-bg: ${theme.modalBgColor};
  --c-modal-title-text: ${theme.modalTitleTextColor};
  --c-modal-title-font-size: ${theme.modalTitleFontSize};
  --c-modal-title-align: ${resolveModalTitleTextAlign(theme.modalTitleAlignment)};
${buildModalButtonVariables(theme)}`;

const buildPortalModalRules = () => `
#portal .ss-bot-prevent-exit-chatbot-modal {
  background-color: var(--c-modal-bg, #FFF) !important;
}

#portal .ss-bot-prevent-exit-modal-title-col {
  flex: 0 0 100% !important;
  max-width: 100% !important;
  text-align: var(--c-modal-title-align, left) !important;
}

#portal .title-bot-modal {
  display: block !important;
  width: 100% !important;
  color: var(--c-modal-title-text, #333) !important;
  font-size: var(--c-modal-title-font-size, 16px) !important;
  text-align: var(--c-modal-title-align, left) !important;
}

${buildModalButtonRules('#portal')}`.trim();

const buildButtonLayoutRules = (hasExplicitWidth) => {
  const widthRule = hasExplicitWidth
    ? 'width: var(--c-btn-width) !important; min-width: 0 !important;'
    : 'width: auto; min-width: 90px !important;';

  return `
  border-radius: var(--c-btn-border-radius, 4px) !important;
  padding: var(--c-btn-padding, 1px 8px) !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  ${widthRule}
  box-sizing: border-box !important;`;
};

const buildButtonBounceAnimationRule = (effectId) => {
  const { animation } = resolveButtonBounceEffect(effectId);
  return animation !== 'none' ? `animation: ${animation} !important;` : '';
};

const buildFieldFocusStyles = (fieldFocusSelectors, focusEffect, previewFocusSelector = '') => {
  const transitionRule = focusEffect.fieldTransition !== 'none'
    ? `transition: ${focusEffect.fieldTransition};`
    : '';

  // v1 has no dedicated focus chrome; skip injected focus rules when effect is none.
  if (focusEffect.skipFocusStyle) {
    return { transitionRule, focusRules: '', previewRules: '' };
  }

  const animationRule = focusEffect.focusAnimation !== 'none'
    ? `animation: ${focusEffect.focusAnimation} !important;`
    : '';
  const focusBorderRule = focusEffect.useFocusBorderShorthand
    ? 'border: var(--c-field-focus-border-width, 1px) solid var(--c-field-focus-border, #327AED) !important;'
    : 'border-width: var(--c-field-focus-border-width, 1px) !important; border-color: var(--c-field-focus-border, #327AED) !important;';
  const boxShadowRule = focusEffect.useAnimatedBoxShadow
    ? ''
    : `box-shadow: ${focusEffect.boxShadow} !important;`;

  const focusRules = `
${fieldFocusSelectors} {
  outline: none !important;
  ${focusBorderRule}
  background-color: var(--c-field-focus-bg, #fff) !important;
  ${boxShadowRule}
  ${animationRule}
}`;

  const previewRules = previewFocusSelector ? `
${previewFocusSelector} {
  outline: none !important;
  ${focusBorderRule}
  background-color: var(--c-field-focus-bg, #fff) !important;
  ${boxShadowRule}
  ${animationRule}
}` : '';

  return { transitionRule, focusRules, previewRules };
};

const buildTwinkleFieldOverrideRules = (spBodySelector, focusEffect) => {
  if (!focusEffect.useAnimatedBoxShadow) return '';

  const animationRule = focusEffect.focusAnimation !== 'none'
    ? `animation: ${focusEffect.focusAnimation} !important;`
    : '';
  const focusBorderRule = focusEffect.useFocusBorderShorthand
    ? 'border: var(--c-field-focus-border-width, 1px) solid var(--c-field-focus-border, #327AED) !important;'
    : 'border-width: var(--c-field-focus-border-width, 1px) !important; border-color: var(--c-field-focus-border, #327AED) !important;';
  const twinkleOverrideSelectors = `
${spBodySelector} .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector,
${spBodySelector} .select-custom-native:focus,
${spBodySelector} .ss-input-value:not(.ss-bot-chat-detail-content):focus,
${spBodySelector} .ss-input-custom-field:not(.ss-bot-chat-detail-content):focus
`.trim();

  return `
${twinkleOverrideSelectors} {
  outline: none !important;
  ${focusBorderRule}
  background-color: var(--c-field-focus-bg, #fff) !important;
  ${animationRule}
}`;
};

const buildTwinkleAnimationRule = (effectId, elementType, theme) => {
  const { animation } = resolveBorderTwinkleEffect(effectId, elementType, theme);
  return animation !== 'none' ? `animation: ${animation} !important;` : '';
};

const buildThemeRules = (theme, scopeSelector = '', options = {}) => {
  const fieldScopeSelectors = buildFieldScopeSelectors(scopeSelector);
  const spBodySelector = fieldScopeSelectors[0];
  const fieldTextSelectors = combineScopedFieldSelectors(scopeSelector, buildFieldTextSelectors);
  const fieldSelectSelectors = combineScopedFieldSelectors(scopeSelector, buildFieldSelectSelectors);
  const fieldPlaceholderSelectors = combineScopedFieldSelectors(
    scopeSelector,
    buildFieldPlaceholderSelectors,
  );
  const fieldInputNumberSelectors = combineScopedFieldSelectors(
    scopeSelector,
    buildFieldInputNumberSelectors,
  );
  const fieldSelectValueSelectors = combineScopedFieldSelectors(
    scopeSelector,
    buildFieldSelectValueSelectors,
  );
  const fieldSelectOptionSelectors = combineScopedFieldSelectors(
    scopeSelector,
    buildFieldSelectOptionSelectors,
  );
  const nativeSelectPlaceholderSelectors = combineScopedFieldSelectors(
    scopeSelector,
    buildNativeSelectPlaceholderSelectors,
  );
  const fieldFocusSelectors = combineScopedFieldSelectors(scopeSelector, buildFieldFocusSelectors);
  const focusEffect = resolveFieldFocusEffect(theme.fieldFocusBgEffect, theme);
  const previewFocusSelector = scopeSelector
    ? `${spBodySelector} input.theme-customize-preview__field.ss-input-value.theme-preview--field-focus, ${spBodySelector} select.theme-customize-preview__field.ss-input-value.theme-preview--field-focus, ${spBodySelector} textarea.theme-customize-preview__field.ss-input-value.theme-preview--field-focus`
    : '';
  const previewFieldSelector = scopeSelector
    ? `${spBodySelector} input.theme-customize-preview__field, ${spBodySelector} select.theme-customize-preview__field, ${spBodySelector} textarea.theme-customize-preview__field`
    : '';
  const { transitionRule, focusRules, previewRules } = buildFieldFocusStyles(
    fieldFocusSelectors,
    focusEffect,
    previewFocusSelector,
  );
  const twinkleFieldOverrideRules = fieldScopeSelectors
    .map((fieldScope) => buildTwinkleFieldOverrideRules(fieldScope, focusEffect))
    .filter(Boolean)
    .join('\n');

  const checkboxTwinkleAnimation = buildTwinkleAnimationRule(
    theme.checkboxCheckedBorderEffect,
    'checkbox',
    theme,
  );
  const radioTwinkleAnimation = buildTwinkleAnimationRule(
    theme.radioSelectedBorderEffect,
    'radio',
    theme,
  );

  const checkboxTwinkleKeyframes = resolveBorderTwinkleEffect(
    theme.checkboxCheckedBorderEffect,
    'checkbox',
    theme,
  ).keyframesCss;
  const radioTwinkleKeyframes = resolveBorderTwinkleEffect(
    theme.radioSelectedBorderEffect,
    'radio',
    theme,
  ).keyframesCss;
  const buttonBounceEffect = resolveButtonBounceEffect(theme.buttonEffect);
  const buttonBounceAnimation = buildButtonBounceAnimationRule(theme.buttonEffect);
  const hasExplicitButtonWidth = resolveButtonWidthCss(theme.buttonWidth) !== 'auto';
  const buttonLayoutRules = buildButtonLayoutRules(hasExplicitButtonWidth);

  const twinkleKeyframesCss = [...new Set([
    focusEffect.keyframesCss,
    checkboxTwinkleKeyframes,
    radioTwinkleKeyframes,
    buttonBounceEffect.keyframesCss,
  ].filter(Boolean))].join('\n');

  const textSubmitButtonThemeSelector = [
    '.chatbot-submit-button:not(.chatbot-submit-button--image)',
    '#chatbot-submit-button:not(.chatbot-submit-button--image)',
    '[id^="chatbot-submit-button-"]:not(.chatbot-submit-button--image)',
  ];
  const btnSelector = scopeSelector
    ? [
      scopedDescendant(scopeSelector, '.btn-preview-bot'),
      scopedDescendant(scopeSelector, '.sp-body .btn-new-bot'),
      scopedDescendant(scopeSelector, '.sp-body .ss-user-message__action-btn'),
      ...textSubmitButtonThemeSelector.map(
        (selector) => scopedDescendant(scopeSelector, `.sp-body ${selector}`),
      ),
    ].join(', ')
    : [
      '.btn-preview-bot',
      '.sp-body .btn-new-bot',
      '.sp-body .ss-user-message__action-btn',
      ...textSubmitButtonThemeSelector.map((selector) => `.sp-body ${selector}`),
    ].join(', ');
  const nextButtonSelector = scopeSelector
    ? [
      scopedDescendant(scopeSelector, '.sp-body .sp-user-message-button-action .ss-user-message__action-btn'),
      ...textSubmitButtonThemeSelector.map(
        (selector) => scopedDescendant(scopeSelector, `.sp-body ${selector}`),
      ),
    ].join(', ')
    : [
      '.sp-body .sp-user-message-button-action .ss-user-message__action-btn',
      ...textSubmitButtonThemeSelector.map((selector) => `.sp-body ${selector}`),
    ].join(', ');
  const nextButtonActionSelector = scopeSelector
    ? scopedDescendant(scopeSelector, '.sp-body .sp-user-message-button-action')
    : '.sp-body .sp-user-message-button-action';
  const buttonPositionRules = `
${nextButtonActionSelector}:not(.sp-user-message-button-action--hidden) {
  display: flex !important;
  justify-content: var(--c-btn-position-justify, flex-end) !important;
}`;
  const previewButtonGroupSelector = scopeSelector
    ? scopedDescendant(scopeSelector, '.theme-customize-preview__button-group')
    : '';
  const previewButtonPositionRule = previewButtonGroupSelector ? `
${previewButtonGroupSelector} {
  justify-content: var(--c-btn-position-justify, flex-end) !important;
}` : '';

  const userMessageWrapperSelector = [
    scopedDescendant(scopeSelector, '.sp-body-user-side-messages .ss-user-message__content-wrapper'),
    scopedClass(scopeSelector, '.ss-user-message__content-wrapper'),
  ].join(',\n');
  const userMessageWrapperDirectChildSelector = scopedDescendant(
    scopeSelector,
    '.sp-body-user-side-messages > .ss-user-message__content-wrapper',
  );
  const userBubbleTextSelectors = buildUserBubbleTextSelectors(scopeSelector);
  const userMessageTitleSelectors = buildUserMessageTitleSelectors(scopeSelector);
  const userMessageFieldLabelSelectors = buildUserMessageFieldLabelSelectors(scopeSelector);

  const botMessageBorderStyle = normalizeMessageBorderStyle(
    theme.botMessageBorderStyle,
    'with_tail',
  );
  const userMessageBorderStyle = normalizeMessageBorderStyle(
    theme.userMessageBorderStyle,
    'no_tail',
  );

  const botMessageTailHideSelectors = [
    scopedDescendant(scopeSelector, '.ss-bot-chat-text-input-bot-icon'),
    scopedDescendant(scopeSelector, '.html-code-message-icon'),
    scopedDescendant(scopeSelector, '.theme-customize-preview__bot-bubble-tail'),
  ].join(',\n');
  const botMessageTailShowSelectors = [
    scopedDescendant(scopeSelector, '.ss-bot-chat-text-input-bot-icon'),
    scopedDescendant(scopeSelector, '.html-code-message-icon'),
    scopedDescendant(scopeSelector, '.theme-customize-preview__bot-bubble-tail'),
  ].join(',\n');
  const botMessageTailShellSelectors = [
    scopedDescendant(scopeSelector, '.ss-bot-chat-text-input-shell'),
    scopedDescendant(scopeSelector, '.sp-body-bot-side-messages'),
  ].join(',\n');
  const botMessageTailRules = botMessageBorderStyle === 'no_tail' ? `
${botMessageTailHideSelectors} {
  display: none !important;
}` : `
${botMessageTailShellSelectors} {
  overflow: visible !important;
}
${botMessageTailShowSelectors} {
  display: flex !important;
}`;

  const userMessageShellSelector = scopedDescendant(
    scopeSelector,
    '.sp-body-user-side > .sp-body-user-side-messages',
  );
  const userMessageDirectWrapperSelector = scopedDescendant(
    scopeSelector,
    '.sp-body-user-side > .sp-body-user-side-messages > .ss-user-message__content-wrapper',
  );
  const userMessageTailIconSelector = [
    scopedDescendant(scopeSelector, '.ss-user-chat-text-input-user-icon'),
    scopedDescendant(scopeSelector, '.theme-customize-preview__user-bubble-tail'),
  ].join(',\n');
  const userMessageTailPathSelector = [
    scopedDescendant(scopeSelector, '.ss-user-chat-text-input-user-icon path'),
    scopedDescendant(scopeSelector, '.theme-customize-preview__user-bubble-tail path'),
  ].join(',\n');
  const textSubmitButtonSelector = [
    '.chatbot-submit-button:not(.chatbot-submit-button--image)',
    '#chatbot-submit-button:not(.chatbot-submit-button--image)',
    '[id^="chatbot-submit-button-"]:not(.chatbot-submit-button--image)',
  ].map((selector) => (
    scopeSelector ? scopedDescendant(scopeSelector, `.sp-body ${selector}`) : `.sp-body ${selector}`
  )).join(',\n');
  const textSubmitButtonRules = `
${textSubmitButtonSelector},
${withPseudoOnEach(textSubmitButtonSelector, ':hover')},
${withPseudoOnEach(textSubmitButtonSelector, ':focus')},
${withPseudoOnEach(textSubmitButtonSelector, ':focus-visible')},
${withPseudoOnEach(textSubmitButtonSelector, ':active')} {
  padding: 15px 30px !important;
  font-size: 20px !important;
  font-weight: bold !important;
  border-radius: 25px !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}`;

  const userMessageTailRules = userMessageBorderStyle === 'with_tail' ? `
${userMessageShellSelector} {
  position: relative !important;
  overflow: visible !important;
  background-color: var(--c-user-msg-bg, #fff) !important;
  color: var(--c-user-msg-text, #333) !important;
  font-size: var(--c-user-msg-font-size, 14px) !important;
  border-radius: 20px !important;
  padding: 10px !important;
}
${userMessageDirectWrapperSelector} {
  background-color: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
}
${userMessageTailIconSelector} {
  display: flex !important;
}
${userMessageTailPathSelector} {
  fill: var(--c-user-msg-bg, #fff) !important;
}` : `
${userMessageTailIconSelector} {
  display: none !important;
}`;

  const previewButtonBase = scopeSelector
    ? scopedDescendant(scopeSelector, '.theme-customize-preview__button-group .btn-new-bot')
    : '';
  const previewButtonNormalSelector = scopeSelector
    ? scopedDescendant(
      scopeSelector,
      '.theme-customize-preview__button-group .btn-new-bot:not(.theme-preview--btn-pressed):not(:disabled)',
    )
    : '';
  const previewButtonPressedSelector = scopeSelector
    ? scopedDescendant(
      scopeSelector,
      '.theme-customize-preview__button-group .theme-preview--btn-pressed.btn-new-bot',
    )
    : '';
  const previewButtonDisabledSelector = scopeSelector
    ? [
      `${previewButtonBase}:disabled`,
      `${previewButtonBase}:disabled:hover`,
      `${previewButtonBase}:disabled:focus`,
      `${previewButtonBase}:disabled:focus-visible`,
    ].join(', ')
    : '';
  const previewButtonRules = scopeSelector ? `
${previewButtonNormalSelector},
${withPseudoOnEach(previewButtonNormalSelector, ':hover')},
${withPseudoOnEach(previewButtonNormalSelector, ':focus')},
${withPseudoOnEach(previewButtonNormalSelector, ':focus-visible')} {
  background: var(--c-btn-normal-bg, #327AED) !important;
  color: var(--c-btn-normal-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  border: none !important;
  box-shadow: none !important;
  ${buttonLayoutRules}
  ${buttonBounceAnimation}
}

${previewButtonPressedSelector},
${withPseudoOnEach(previewButtonPressedSelector, ':hover')},
${withPseudoOnEach(previewButtonPressedSelector, ':focus')},
${withPseudoOnEach(previewButtonPressedSelector, ':focus-visible')} {
  background: var(--c-btn-pressed-bg, #2A68D1) !important;
  color: var(--c-btn-pressed-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  border: none !important;
  box-shadow: none !important;
  ${buttonLayoutRules}
}

${previewButtonDisabledSelector} {
  background-color: var(--c-btn-disabled-bg, #e0e0e0) !important;
  color: var(--c-btn-disabled-text, #999) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  opacity: 1 !important;
  border: none !important;
  box-shadow: none !important;
  animation: none !important;
  ${buttonLayoutRules}
}` : '';
  const previewFieldPlaceholderSelector = previewFieldSelector
    ? `${previewFieldSelector}::placeholder`
    : '';
  const previewFieldFontSizeRule = previewFieldSelector ? `
${previewFieldSelector} {
  font-size: var(--c-field-font-size, 14px) !important;
}
${previewFieldPlaceholderSelector} {
  font-size: var(--c-field-font-size, 14px) !important;
}` : '';

  const headerBgOverride = theme.headerBgColor
    ? `
${scopedClass(scopeSelector, '.preview-open-frame__header')},
${scopedClass(scopeSelector, '.sp-header')},
${scopedClass(scopeSelector, '.theme-customize-preview__header')} {
  background-color: ${theme.headerBgColor} !important;
}`
    : '';
  const headerHeightOverride = theme.headerHeight
    ? `
${scopedClass(scopeSelector, '.sp-header')},
${scopedClass(scopeSelector, '.preview-open-frame .sp-header')},
${scopedClass(scopeSelector, '.preview-open-frame__header')},
${scopedClass(scopeSelector, '.theme-customize-preview__header')},
${scopedClass(scopeSelector, '.sp-header--logo')},
${scopedClass(scopeSelector, '.preview-open-frame__header.sp-header--logo')},
${scopedClass(scopeSelector, '.theme-customize-preview__header.sp-header--logo')} {
  height: var(--c-header-height) !important;
  min-height: var(--c-header-height) !important;
}`
    : '';
  const progressFillOverride = theme.progressBarFillColor
    ? `
${scopedClass(scopeSelector, '.sp-process-bar-color')} {
  --sp-process-bar-color: ${theme.progressBarFillColor};
  background-color: ${theme.progressBarFillColor} !important;
}`
    : '';

  return `
${twinkleKeyframesCss}
${headerBgOverride}
${scopedClass(scopeSelector, '.sp-header-left')} {
  justify-content: var(--c-header-title-justify, flex-start) !important;
}

${scopedClass(scopeSelector, '.sp-header-left-label-title')} {
  color: var(--c-header-title-text, #fff) !important;
  font-size: var(--c-header-title-font-size, 15px) !important;
  font-weight: var(--c-header-title-weight, 400) !important;
}

${scopedClass(scopeSelector, '.sp-header-left-label-sub-title')} {
  color: var(--c-header-subtitle-text, #fff) !important;
  font-size: var(--c-header-subtitle-font-size, 14px) !important;
  font-weight: var(--c-header-subtitle-weight, 400) !important;
  ${themeIsOff(theme.headerSubtitleVisible) ? 'display: none !important;' : ''}
}

${scopedClass(scopeSelector, '.preview-open-frame__header .sp-header-right-arrow')},
${scopedClass(scopeSelector, '.theme-customize-preview__header .sp-header-right-arrow')} {
  color: var(--c-header-close-icon, #fff) !important;
}

${scopedClass(scopeSelector, '.sp-header--title-only .sp-avatar-bt')},
${scopedClass(scopeSelector, '.preview-open-frame__header.sp-header--title-only .sp-avatar-bt')},
${scopedClass(scopeSelector, '.theme-customize-preview__header.sp-header--title-only .sp-avatar-bt')} {
  display: none !important;
}

${scopedClass(scopeSelector, '.sp-header--logo')},
${scopedClass(scopeSelector, '.preview-open-frame__header.sp-header--logo')},
${scopedClass(scopeSelector, '.theme-customize-preview__header.sp-header--logo')} {
  background-image: var(--c-header-logo-image, none) !important;
  background-position: center !important;
  background-size: 25% !important;
  background-repeat: no-repeat !important;
  height: 34px !important;
  min-height: 34px !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

${headerHeightOverride}

${scopedClass(scopeSelector, '.sp-header--logo .sp-avatar-bt')},
${scopedClass(scopeSelector, '.sp-header--logo .sp-header-left-label')},
${scopedClass(scopeSelector, '.theme-customize-preview__header.sp-header--logo .sp-avatar-bt')},
${scopedClass(scopeSelector, '.theme-customize-preview__header.sp-header--logo .sp-header-left-label')} {
  display: none !important;
}

${scopedClass(scopeSelector, '.sp-process-bar')} {
  background-color: var(--c-progress-bg, #D6E0EF) !important;
  border-radius: var(--c-progress-radius, 0px) !important;
  overflow: hidden !important;
}

${scopedClass(scopeSelector, '.sp-process-bar-color')} {
  color: var(--c-progress-text, #fff) !important;
  font-size: var(--c-progress-font-size, 13px) !important;
  font-weight: var(--c-progress-weight, 400) !important;
  height: var(--c-progress-height, 20px) !important;
  border-radius: var(--c-progress-radius, 0px) !important;
  line-height: var(--c-progress-height, 20px) !important;
}

${scopedClass(scopeSelector, '.sp-process-bar--fraction')} {
  background-color: var(--c-progress-container-bg, transparent) !important;
  overflow: visible !important;
  border-radius: 0 !important;
  min-height: 0 !important;
  padding: 6px 20px 10px !important;
  box-sizing: border-box !important;
}

${scopedClass(scopeSelector, '.sp-process-bar--fraction .sp-process-bar__meta')} {
  position: relative !important;
}

${scopedClass(scopeSelector, '.sp-process-bar--fraction .sp-process-bar__step')} {
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  display: inline !important;
  width: auto !important;
  color: var(--c-progress-text, #F48879) !important;
  font-size: var(--c-progress-font-size, 12px) !important;
  font-weight: var(--c-progress-weight, 700) !important;
  text-align: left !important;
}

${scopedClass(scopeSelector, '.sp-process-bar--fraction .sp-process-bar__above')} {
  position: absolute !important;
  left: 50% !important;
  top: 0 !important;
  transform: translateX(-50%) !important;
  color: var(--c-progress-text, #F48879) !important;
  font-size: var(--c-progress-font-size, 12px) !important;
  font-weight: var(--c-progress-weight, 700) !important;
  text-align: center !important;
  white-space: nowrap !important;
}

${scopedClass(scopeSelector, '.sp-process-bar--fraction .sp-process-bar__track')} {
  background-color: var(--c-progress-bg, #FFFFFF) !important;
  border-radius: var(--c-progress-radius, 20px) !important;
  height: var(--c-progress-height, 10px) !important;
  overflow: hidden !important;
}

${scopedClass(scopeSelector, '.sp-process-bar--fraction .sp-process-bar-color')} {
  height: 100% !important;
  min-width: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}
${progressFillOverride}

${options.applyChatWindowBg ? `${scopeSelector ? spBodySelector : '#sp-body.sp-body, .sp-body'} {
  background-color: var(--c-chat-window-bg, #D6E0EF) !important;
}` : ''}

${scopedClass(scopeSelector, '.ss-bot-message__content-wrapper')},
${scopedDescendant(scopeSelector, '.ss-bot-message .ss-bot-message__content')} {
  background-color: var(--c-bot-msg-bg, #3CACEF) !important;
  color: var(--c-bot-msg-text, #fff) !important;
  font-size: var(--c-bot-msg-font-size, 14px) !important;
  font-weight: var(--c-bot-msg-weight, 400) !important;
}

${fieldTextSelectors} {
  border: var(--c-field-unfocus-border-width, 1px) solid var(--c-field-unfocus-border, gray) !important;
  background-color: var(--c-field-unfocus-bg, #EFF4FD) !important;
  font-size: var(--c-field-font-size, 14px) !important;
  font-weight: var(--c-field-text-weight, 400) !important;
  ${transitionRule}
}

${fieldSelectSelectors} {
  border: var(--c-field-unfocus-border-width, 1px) solid var(--c-field-unfocus-border, gray) !important;
  background-color: #ffffff !important;
  font-size: var(--c-field-font-size, 14px) !important;
  font-weight: var(--c-field-text-weight, 400) !important;
  ${transitionRule}
}

${fieldPlaceholderSelectors} {
  font-size: var(--c-field-placeholder-size, var(--c-field-font-size, 14px)) !important;
  font-weight: var(--c-field-placeholder-weight, 400) !important;
}

${scopedClass(scopeSelector, '.field-float')} {
  position: relative !important;
  display: block !important;
  width: 100% !important;
}

${scopedDescendant(scopeSelector, '.ss-message__split-row > .field-float')} {
  flex: 0 0 49% !important;
  width: 49% !important;
  max-width: 49% !important;
  min-width: 0 !important;
}

${scopedDescendant(scopeSelector, '.ss-message__split-row > .field-float > .ss-input-custom-container')} {
  width: 100% !important;
}

${scopedClass(scopeSelector, '.field-float__label')} {
  position: absolute !important;
  left: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  font-size: var(--c-field-placeholder-size, 16px) !important;
  font-weight: var(--c-field-placeholder-weight, 400) !important;
  color: #999 !important;
  pointer-events: none !important;
  transition: top 0.15s ease, transform 0.15s ease, font-size 0.15s ease !important;
  z-index: 1 !important;
  line-height: 1.2 !important;
}

${scopedClass(scopeSelector, '.field-float:focus-within .field-float__label')},
${scopedClass(scopeSelector, '.field-float--filled .field-float__label')} {
  top: 6px !important;
  transform: translateY(0) !important;
  font-size: var(--c-field-placeholder-focus-size, 10px) !important;
}

${scopedClass(scopeSelector, '.field-float .ss-input-value')},
${scopedClass(scopeSelector, '.field-float textarea')} {
  padding: 8px 12px !important;
  font-size: var(--c-field-placeholder-size, var(--c-field-font-size, 16px)) !important;
  line-height: 1.4 !important;
  box-sizing: border-box !important;
  min-height: 55px !important;
  height: 55px !important;
}

${scopedClass(scopeSelector, '.field-float .ss-input-custom-field--with-clear')} {
  padding-right: 30px !important;
}

${scopedClass(scopeSelector, '.field-float:focus-within .ss-input-value')},
${scopedClass(scopeSelector, '.field-float:focus-within textarea')},
${scopedClass(scopeSelector, '.field-float--filled .ss-input-value')},
${scopedClass(scopeSelector, '.field-float--filled textarea')} {
  padding-top: 18px !important;
  padding-bottom: 6px !important;
}

${fieldScopeSelectors.map((fieldScope) => `${fieldScope} .ant-select-selection-placeholder`).join(',\n')} {
  font-size: var(--c-field-font-size, 14px) !important;
  font-weight: var(--c-field-placeholder-weight, 400) !important;
}

${scopedClass(scopeSelector, '.ss-address-field')} {
  overflow: visible !important;
}

${scopedDescendant(scopeSelector, '.ss-address-field .ant-select-selector')},
${scopedDescendant(scopeSelector, '.ss-address-field .select-custom-native')} {
  background-color: var(--c-field-unfocus-bg, #EFF4FD) !important;
  font-size: var(--c-field-font-size, 14px) !important;
  font-weight: var(--c-field-text-weight, 400) !important;
  box-sizing: border-box !important;
}

${scopedDescendant(scopeSelector, '.ss-address-field .ant-select-selection-placeholder')},
${scopedDescendant(scopeSelector, '.ss-address-field .select-custom-native:has(option[value=""]:checked)')} {
  font-size: var(--c-field-placeholder-size, 16px) !important;
  font-weight: var(--c-field-placeholder-weight, 400) !important;
}

${scopedDescendant(scopeSelector, '.ss-address-field.field-float .ant-select-selector')},
${scopedDescendant(scopeSelector, '.ss-address-field.field-float .select-custom-native')} {
  min-height: 55px !important;
  height: 55px !important;
  padding: 8px 12px !important;
  display: flex !important;
  align-items: center !important;
}

${scopedDescendant(scopeSelector, '.ss-address-field.field-float:focus-within .ant-select-selector')},
${scopedDescendant(scopeSelector, '.ss-address-field.field-float--filled .ant-select-selector')},
${scopedDescendant(scopeSelector, '.ss-address-field.field-float:focus-within .select-custom-native')},
${scopedDescendant(scopeSelector, '.ss-address-field.field-float--filled .select-custom-native')} {
  padding-top: 18px !important;
  padding-bottom: 6px !important;
  align-items: flex-end !important;
}

${scopedDescendant(scopeSelector, '.ss-address-field.field-float .ant-select-selection-item')},
${scopedDescendant(scopeSelector, '.ss-address-field.field-float .ant-select-selection-placeholder')} {
  font-size: var(--c-field-placeholder-size, var(--c-field-font-size, 16px)) !important;
  line-height: 1.4 !important;
}

${scopedDescendant(scopeSelector, '.ss-address-field .ant-select-dropdown')} {
  min-width: 100% !important;
}

${nativeSelectPlaceholderSelectors} {
  font-weight: var(--c-field-placeholder-weight, 400) !important;
}

${fieldInputNumberSelectors},
${fieldSelectValueSelectors},
${fieldSelectOptionSelectors} {
  font-size: var(--c-field-font-size, 14px) !important;
  font-weight: var(--c-field-text-weight, 400) !important;
}

${withMobileBody([
  fieldTextSelectors,
  fieldSelectSelectors,
  fieldPlaceholderSelectors,
  fieldInputNumberSelectors,
  fieldSelectValueSelectors,
  fieldSelectOptionSelectors,
  fieldScopeSelectors.map((fieldScope) => `${fieldScope} .ant-select-selection-placeholder`).join(',\n'),
].join(',\n'))} {
  font-size: max(16px, var(--c-field-font-size, 16px)) !important;
}
${focusRules}
${previewRules}
${twinkleFieldOverrideRules}${previewFieldFontSizeRule}

${scopedClass(scopeSelector, '.ss-bot-chat-detail-content')},
${scopedClass(scopeSelector, '.ss-bot-chat-text-input.ss-bot-chat-detail-content')} {
  background-color: var(--c-bot-msg-bg, #3CACEF) !important;
  color: var(--c-bot-msg-text, #fff) !important;
  font-size: var(--c-bot-msg-font-size, 14px) !important;
  font-weight: var(--c-bot-msg-weight, 400) !important;
  border: none !important;
}

${scopedDescendant(scopeSelector, '.ss-bot-chat-text-input-bot-icon path')},
${scopedDescendant(scopeSelector, '.html-code-message-icon path')} {
  fill: var(--c-bot-msg-bg, #3CACEF) !important;
}

${scopedClass(scopeSelector, '.sp-body-user-side-messages')} {
  background-color: transparent !important;
}

${userMessageWrapperSelector} {
  background-color: var(--c-user-msg-bg, #fff) !important;
  color: var(--c-user-msg-text, #333) !important;
  font-size: var(--c-user-msg-font-size, 14px) !important;
  font-weight: var(--c-user-msg-weight, 400) !important;
}

${userMessageWrapperDirectChildSelector} {
  padding: 10px;
  border-radius: 20px;
}

${userMessageWrapperDirectChildSelector}:has(.ss-message__content--user-zip-code-address-search-link) {
  padding: 20px;
}
${botMessageTailRules}
${userMessageTailRules}

${buttonPositionRules}
${previewButtonPositionRule}

${btnSelector},
${withPseudoOnEach(btnSelector, ':hover')},
${withPseudoOnEach(btnSelector, ':focus')},
${withPseudoOnEach(btnSelector, ':focus-visible')} {
  background: var(--c-btn-normal-bg, #327AED) !important;
  color: var(--c-btn-normal-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  font-weight: var(--c-btn-weight, 500) !important;
  border: none !important;
  box-shadow: none !important;
  ${buttonLayoutRules}
  ${buttonBounceAnimation}
}

${withPseudoOnEach(btnSelector, ':active')} {
  background: var(--c-btn-pressed-bg, #2A68D1) !important;
  color: var(--c-btn-pressed-text, #fff) !important;
  animation: none !important;
}

${withPseudoOnEach(btnSelector, ':disabled')},
${withPseudoOnEach(btnSelector, '.disabled')} {
  background-color: var(--c-btn-disabled-bg, #e0e0e0) !important;
  color: var(--c-btn-disabled-text, #999) !important;
  opacity: 1 !important;
  animation: none !important;
}

${nextButtonSelector},
${withPseudoOnEach(nextButtonSelector, ':hover')},
${withPseudoOnEach(nextButtonSelector, ':focus')},
${withPseudoOnEach(nextButtonSelector, ':focus-visible')} {
  min-height: 42px !important;
  font-weight: var(--c-btn-weight, 500) !important;
  background: var(--c-btn-normal-bg, #327AED) !important;
  color: var(--c-btn-normal-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  border: none !important;
  box-shadow: none !important;
  ${buttonLayoutRules}
  ${buttonBounceAnimation}
}

${withPseudoOnEach(nextButtonSelector, ':active')} {
  background: var(--c-btn-pressed-bg, #2A68D1) !important;
  color: var(--c-btn-pressed-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  animation: none !important;
}

${withPseudoOnEach(nextButtonSelector, ':disabled')},
${withPseudoOnEach(nextButtonSelector, '.disabled')} {
  background-color: var(--c-btn-disabled-bg, #e0e0e0) !important;
  color: var(--c-btn-disabled-text, #999) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  opacity: 1 !important;
  animation: none !important;
}
${hasExplicitButtonWidth ? '' : `
${[
  '.chatbot-submit-button:not(.chatbot-submit-button--image)',
  '#chatbot-submit-button:not(.chatbot-submit-button--image)',
  '[id^="chatbot-submit-button-"]:not(.chatbot-submit-button--image)',
].map((selector) => (scopeSelector ? scopedDescendant(scopeSelector, `.sp-body ${selector}`) : `.sp-body ${selector}`)).join(',\n')} {
  width: 100% !important;
  max-width: 100% !important;
}`}
${textSubmitButtonRules}

${spBodySelector} .ant-checkbox-inner {
  background-color: var(--c-checkbox-unchecked-bg, #fff) !important;
  border-color: var(--c-checkbox-unchecked-border, #ccc) !important;
}

${spBodySelector} .ant-checkbox-checked .ant-checkbox-inner {
  background-color: var(--c-checkbox-checked-bg) !important;
  border-color: var(--c-checkbox-checked-border) !important;
}

${spBodySelector} .ss-message__content--user-checkbox {
  background-color: var(--c-checkbox-unchecked-bg, #fff) !important;
  border: 1px solid var(--c-checkbox-unchecked-border, #ccc) !important;
}

${spBodySelector} .ss-message__content--user-checkbox--selected,
${spBodySelector} .ss-message__content--user-checkbox:has(input[type="checkbox"]:checked),
${spBodySelector} .ss-message__content--user-checkbox--checkbox_img-item.ss-message__content--user-checkbox--selected,
${spBodySelector} .ss-message__content--user-checkbox--checkbox_img-item:has(input[type="checkbox"]:checked) {
  background-color: var(--c-checkbox-checked-bg) !important;
  border-color: var(--c-checkbox-checked-border) !important;
  ${checkboxTwinkleAnimation}
}

${spBodySelector} .ss-message__content--user-checkbox > label,
${spBodySelector} .ss-message__content--user-checkbox--block_style > span,
${scopedDescendant(scopeSelector, '.theme-customize-preview__checkbox-option > label')} {
  font-size: var(--c-checkbox-font-size, 14px) !important;
}

${spBodySelector} .ss-message__content--user-radio_button,
${scopedClass(scopeSelector, '.theme-customize-preview__radio-default')} {
  background-color: var(--c-radio-unselected-bg, #ebf7ff) !important;
  border: 1px solid var(--c-radio-unselected-border, transparent) !important;
}

${spBodySelector} .ss-message__content--user-radio_button--selected,
${spBodySelector} .ss-message__content--user-radio_button:has(input[type="radio"]:checked),
${scopedClass(scopeSelector, '.theme-customize-preview__radio-default--selected')} {
  background-color: var(--c-radio-selected-bg, #ebf7ff) !important;
  border-color: var(--c-radio-selected-border, transparent) !important;
  ${radioTwinkleAnimation}
}

${spBodySelector} .ss-message__content--user-radio_button--radio_button_img {
  background-color: var(--c-radio-unselected-bg, transparent) !important;
  border: 1px solid var(--c-radio-unselected-border, transparent) !important;
}

${spBodySelector} .ss-message__content--user-radio_button--radio_button_img.ss-message__content--user-radio_button--selected,
${spBodySelector} .ss-message__content--user-radio_button--radio_button_img:has(input[type="radio"]:checked),
${scopedClass(scopeSelector, '.theme-customize-preview__radio-img--selected')} {
  background-color: var(--c-radio-selected-bg, transparent) !important;
  border-color: var(--c-radio-selected-border, transparent) !important;
  ${radioTwinkleAnimation}
}

${spBodySelector} .ss-message__content--user-radio_button:not(.ss-message__content--user-radio_button--radio_button_img) input[type="radio"],
${scopedDescendant(scopeSelector, '.theme-customize-preview__radio-default input[type="radio"]')} {
  accent-color: var(--c-radio-input-selected, #327AED) !important;
}

${spBodySelector} .ss-message__content--user-radio_button:not(.ss-message__content--user-radio_button--radio_button_img) input[type="radio"]:not(:checked),
${scopedDescendant(scopeSelector, '.theme-customize-preview__radio-default input[type="radio"]:not(:checked)')} {
  accent-color: var(--c-radio-input-unselected, #ccc) !important;
}

${spBodySelector} .ss-message__content--user-radio_button > label,
${spBodySelector} .ss-message__content--user-radio_button--block_style > span,
${scopedDescendant(scopeSelector, '.theme-customize-preview__radio-default > label')} {
  font-size: var(--c-radio-font-size, 14px) !important;
}

${userMessageTitleSelectors},
${userMessageFieldLabelSelectors},
${spBodySelector} .ss-input-custom-label,
${spBodySelector} .select-custom-label,
${spBodySelector} .ss-message__content--user-field-label {
  font-weight: var(--c-field-title-weight, 400) !important;
  font-size: var(--c-field-title-size, var(--c-field-font-size, 14px)) !important;
  letter-spacing: var(--c-field-title-tracking, 0px) !important;
}

${userBubbleTextSelectors} {
  color: var(--c-user-msg-text, #333) !important;
  font-size: var(--c-user-msg-font-size, 14px) !important;
}

${buildAgreeTermDesignOverrideRules(spBodySelector)}

${spBodySelector} .validation-error-message,
${scopedDescendant(scopeSelector, '.validation-error-message')} {
  background-color: var(--c-validation-bg, transparent) !important;
  color: var(--c-validation-text, #FF7E00) !important;
  font-size: var(--c-validation-font-size, 12px) !important;
}

${spBodySelector} .ss-message__content--user-text-input-required,
${spBodySelector} .ss-message__content--user-required,
${scopedDescendant(scopeSelector, '.ss-message__content--user-text-input-required')},
${scopedDescendant(scopeSelector, '.ss-message__content--user-required')} {
  color: var(--c-required-label-text, #FF7E00) !important;
  font-size: var(--c-required-label-font-size, 12px) !important;
}

${scopedClass(scopeSelector, '.ss-bot-submit-error-message')},
${scopedDescendant(scopeSelector, '.error-container .emsg_holder')},
${scopedDescendant(scopeSelector, '.error-container .error_each')} {
  background-color: var(--c-error-bg, #ffebee) !important;
  color: var(--c-error-text, #d32f2f) !important;
  font-size: var(--c-error-font-size, 14px) !important;
}

${scopedClass(scopeSelector, '.ss-bot-submit-error-message')} {
  border: 1px solid var(--c-error-text, #f44336) !important;
}

${scopedClass(scopeSelector, '.ss-bot-submit-thanks-message')} {
  background-color: var(--c-thanks-bg, #e8f5e9) !important;
  color: var(--c-thanks-text, #2e7d32) !important;
  font-size: var(--c-thanks-font-size, 14px) !important;
  border: 1px solid var(--c-thanks-text, #2e7d32) !important;
}

${scopedClass(scopeSelector, '.sp-popup-zip-code-address')} {
  background-color: var(--c-modal-bg, #fff) !important;
}

${scopedClass(scopeSelector, '.sp-popup-zip-code-address-header')} {
  background-color: var(--c-modal-bg, #FAFAFA) !important;
}

${scopedClass(scopeSelector, '.sp-popup-zip-code-address-header-left')} {
  color: var(--c-modal-title-text, #333) !important;
  font-size: var(--c-modal-title-font-size, 16px) !important;
  text-align: var(--c-modal-title-align, left) !important;
  flex: 1 !important;
}

${scopedClass(scopeSelector, '.ss-bot-prevent-exit-chatbot-modal')} {
  background-color: var(--c-modal-bg, #FFF) !important;
}

${scopedClass(scopeSelector, '.theme-customize-preview__modal-title-col')} {
  text-align: var(--c-modal-title-align, left) !important;
  flex: 0 0 100% !important;
  max-width: 100% !important;
}

${scopedClass(scopeSelector, '.title-bot-modal')} {
  display: block !important;
  width: 100% !important;
  color: var(--c-modal-title-text, #333) !important;
  font-size: var(--c-modal-title-font-size, 16px) !important;
  text-align: var(--c-modal-title-align, left) !important;
}

${buildModalButtonRules(toScopeIs(scopeSelector) || scopeSelector)}${previewButtonRules}`.trim();
};

const resolveApplyChatWindowBg = (rawTheme, options = {}) => (
  typeof options.applyChatWindowBg === 'boolean'
    ? options.applyChatWindowBg
    : hasExplicitThemeValue(rawTheme, 'chatWindowBgColor')
);

const buildThemeCss = (theme, scopeSelector = '', designType, options = {}) => {
  const variablesBlock = scopeSelector
    ? `${scopeSelector} {${buildThemeVariables(theme)}\n}`
    : `#sp-container, .sp-container, #sp-container1, .sp-container1 {${buildThemeVariables(theme)}\n}`;

  const isLiveBotScope = scopeSelector.includes('sp-container');
  const portalVariablesBlock = isLiveBotScope
    ? `\n\n#portal {${buildPortalModalVariables(theme)}\n}`
    : '';
  const portalRules = isLiveBotScope ? `\n\n${buildPortalModalRules()}` : '';
  const chromeCss = `\n\n${buildDesignTypeChromeCss(designType, scopeSelector)}`;

  return `${variablesBlock}${portalVariablesBlock}\n\n${buildThemeRules(theme, scopeSelector, options)}${portalRules}${chromeCss}`.trim();
};

export const generateThemeCss = (rawTheme, mainColorHex, apiColorKey, designType, options = {}) => {
  const theme = mergeThemeWithDefaults(rawTheme, mainColorHex, apiColorKey);
  return buildThemeCss(
    theme,
    LIVE_THEME_SCOPE,
    designType,
    { applyChatWindowBg: resolveApplyChatWindowBg(rawTheme, options) },
  );
};

export const generateScopedThemeCss = (
  rawTheme,
  mainColorHex,
  apiColorKey,
  scopeSelector = '#theme-customize-preview',
  designType,
  options = {},
) => {
  const theme = mergeThemeWithDefaults(rawTheme, mainColorHex, apiColorKey);
  return buildThemeCss(
    theme,
    scopeSelector,
    designType,
    { applyChatWindowBg: resolveApplyChatWindowBg(rawTheme, options) },
  );
};

export const injectBotThemeCss = (rawTheme, mainColorHex, apiColorKey, designType, options = {}) => {
  const existing = document.getElementById('bot-theme-vars');
  if (existing) existing.remove();

  if (!rawTheme && !mainColorHex) return;

  const style = document.createElement('style');
  style.id = 'bot-theme-vars';
  style.innerHTML = generateThemeCss(rawTheme, mainColorHex, apiColorKey, designType, options);
  document.head.appendChild(style);
};

export const parseThemeFromDesignSettings = (designSettings) => {
  if (!designSettings) return null;
  const parsed = typeof designSettings === 'string'
    ? JSON.parse(designSettings)
    : designSettings;
  return parsed?.theme || null;
};

export const applyPreviewThemeCss = (botInfor, themeSettings) => {
  if (!botInfor) return;
  const { apiColorKey, mainColorHex } = resolveMainColorContext(botInfor);
  const savedTheme = parseThemeFromDesignSettings(botInfor.design_settings);
  const rawTheme = {
    ...(savedTheme || {}),
    ...(themeSettings || {}),
    fieldTitleBold: themeIsBold(themeSettings?.fieldTitleBold)
      || themeIsBold(savedTheme?.field_title_bold)
      || themeIsBold(savedTheme?.fieldTitleBold),
    fieldPlaceholderBold: themeIsBold(themeSettings?.fieldPlaceholderBold)
      || themeIsBold(savedTheme?.field_placeholder_bold)
      || themeIsBold(savedTheme?.fieldPlaceholderBold),
    fieldTextBold: themeIsBold(themeSettings?.fieldTextBold)
      || themeIsBold(savedTheme?.field_text_bold)
      || themeIsBold(savedTheme?.fieldTextBold),
  };
  injectBotThemeCss(rawTheme, mainColorHex, apiColorKey, botInfor.design_type, {
    applyChatWindowBg: hasExplicitThemeValue(savedTheme, 'chatWindowBgColor'),
  });
};

export const getErrorThemeStyles = (rawTheme, mainColorHex, apiColorKey) => {
  const theme = mergeThemeWithDefaults(rawTheme, mainColorHex, apiColorKey);
  return {
    bgColor: theme.errorMessageBgColor,
    textColor: theme.errorMessageTextColor,
    fontSize: theme.errorMessageFontSize,
  };
};

export { CAMEL_TO_SNAKE_THEME };
