import { CAMEL_TO_SNAKE_THEME } from '../views/BotElement/BotSetting/DesignSetting/constants/designThemeConstants';
import { resolveMainColorContext } from '../views/BotElement/BotSetting/DesignSetting/utils/designChatbotUtils';
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
  resolveModalTitleTextAlign,
} from '../views/BotElement/BotSetting/DesignSetting/utils/designThemeUtils';

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

const USER_MESSAGE_BUBBLE_LABEL_SELECTORS = [
  '.ss-message__content--user-checkbox > label',
  '.ss-message__content--user-checkbox--block_style > span',
  '.ss-message__content--user-radio_button > label',
  '.ss-message__content--user-radio_button--block_style > span',
  '.theme-customize-preview__checkbox-option > label',
  '.theme-customize-preview__radio-default > label',
];

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

const buildFieldSelectors = (spBodySelector) => `
${spBodySelector} input[type="text"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="email"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="tel"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="number"]:not(.theme-preview--field-focus),
${spBodySelector} input[type="password"]:not(.theme-preview--field-focus),
${spBodySelector} textarea:not(.theme-preview--field-focus),
${spBodySelector} select:not(.theme-preview--field-focus),
${spBodySelector} .ss-input-value:not(.ss-bot-chat-detail-content):not(.theme-preview--field-focus),
${spBodySelector} .ss-input-custom-field:not(.ss-bot-chat-detail-content),
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
${spBodySelector} .ss-input-custom-field:not(.ss-bot-chat-detail-content)::placeholder
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

const buildThemeVariables = (theme) => {
  const buttonWidth = resolveButtonWidthCss(theme.buttonWidth);
  const buttonPadding = resolveButtonPaddingCss(theme.buttonPadding);
  const buttonBorderRadius = resolveButtonBorderRadius(theme.buttonBorderStyle);
  const buttonPositionJustify = resolveButtonPositionJustify(theme.buttonPosition);

  return `
  /* Bug #6: header dùng headerBgColor, không còn bind nhầm buttonNormalBgColor. */
  --c-header-bg: ${theme.headerBgColor || '#327AED'};
  --c-header-title-text: ${theme.headerTitleTextColor};
  --c-header-title-font-size: ${theme.headerTitleFontSize};
  --c-header-subtitle-text: ${theme.headerSubtitleTextColor};
  --c-header-subtitle-font-size: ${theme.headerSubtitleFontSize};
  --c-progress-bg: ${theme.progressBarBgColor};
  /* Bug #7: progress fill độc lập với Main color header. */
  --c-progress-fill: ${theme.progressBarFillColor || '#327AED'};
  --c-progress-text: ${theme.progressBarTextColor};
  --c-progress-font-size: ${theme.progressBarFontSize};
  --c-chat-window-bg: ${theme.chatWindowBgColor};
  --c-bot-msg-bg: ${theme.botMessageBgColor};
  --c-bot-msg-text: ${theme.botMessageTextColor};
  --c-bot-msg-font-size: ${theme.botMessageFontSize};
  --c-user-msg-bg: ${theme.userMessageBgColor};
  --c-user-msg-text: ${theme.userMessageTextColor};
  --c-user-msg-font-size: ${theme.userMessageFontSize};
  --c-field-focus-border: ${theme.fieldFocusBorderColor};
  --c-field-focus-bg: ${theme.fieldFocusBgColor};
  --c-field-unfocus-border: ${theme.fieldUnfocusBorderColor};
  --c-field-unfocus-bg: ${theme.fieldUnfocusBgColor};
  --c-field-font-size: ${theme.fieldFontSize};
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
#portal .ss-bot-prevent-exit-chatbot-modal,
.ss-bot-prevent-exit-root .ss-bot-prevent-exit-chatbot-modal {
  background-color: var(--c-modal-bg, #FFF) !important;
}

#portal .ss-bot-prevent-exit-modal-title-col,
.ss-bot-prevent-exit-root .ss-bot-prevent-exit-modal-title-col {
  flex: 0 0 100% !important;
  max-width: 100% !important;
  text-align: var(--c-modal-title-align, left) !important;
}

#portal .title-bot-modal,
.ss-bot-prevent-exit-root .title-bot-modal {
  display: block !important;
  width: 100% !important;
  color: var(--c-modal-title-text, #333) !important;
  font-size: var(--c-modal-title-font-size, 16px) !important;
  text-align: var(--c-modal-title-align, left) !important;
}

${buildModalButtonRules('#portal')}
${buildModalButtonRules('.ss-bot-prevent-exit-root')}`.trim();

const buildButtonLayoutRules = (hasExplicitWidth) => {
  const widthRule = hasExplicitWidth
    ? 'width: var(--c-btn-width) !important; min-width: 0 !important;'
    : 'width: auto; min-width: 70px !important;';

  return `
  border-radius: var(--c-btn-border-radius, 4px) !important;
  padding: var(--c-btn-padding, 4px 10px) !important;
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
  const animationRule = focusEffect.focusAnimation !== 'none'
    ? `animation: ${focusEffect.focusAnimation} !important;`
    : '';
  const focusBorderRule = focusEffect.useFocusBorderShorthand
    ? 'border: 1px solid var(--c-field-focus-border, #327AED) !important;'
    : 'border-color: var(--c-field-focus-border, #327AED) !important;';
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
    ? 'border: 1px solid var(--c-field-focus-border, #327AED) !important;'
    : 'border-color: var(--c-field-focus-border, #327AED) !important;';
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

// Bug #10: Unselected style (radio) không apply — accent-color không tô được vòng chưa chọn;
// vẽ radio native bằng appearance:none, border = --c-radio-input-unselected.
const buildNativeRadioInputRules = (radioSelectors) => {
  const selectors = Array.isArray(radioSelectors) ? radioSelectors : [radioSelectors];
  const baseSelector = selectors.join(',\n');
  const checkedSelector = selectors.map((selector) => `${selector}:checked`).join(',\n');

  return `
${baseSelector} {
  -webkit-appearance: none !important;
  appearance: none !important;
  width: 19px !important;
  height: 19px !important;
  min-width: 19px !important;
  min-height: 19px !important;
  margin: 0 !important;
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
  border-radius: 50% !important;
  background-color: #fff !important;
  background-image: none !important;
  border: 2px solid var(--c-radio-input-unselected, #cccccc) !important;
  box-shadow: none !important;
  cursor: pointer;
}

${checkedSelector} {
  border-color: var(--c-radio-input-selected, #327AED) !important;
  background-color: #fff !important;
  background-image: radial-gradient(
    circle,
    var(--c-radio-input-selected, #327AED) 38%,
    #fff 42%
  ) !important;
}`;
};

const buildThemeRules = (theme, scopeSelector = '') => {
  const fieldScopeSelectors = buildFieldScopeSelectors(scopeSelector);
  const spBodySelector = fieldScopeSelectors[0];
  const fieldSelectors = combineScopedFieldSelectors(scopeSelector, buildFieldSelectors);
  const fieldPlaceholderSelectors = combineScopedFieldSelectors(
    scopeSelector,
    buildFieldPlaceholderSelectors,
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

  const btnSelector = scopeSelector
    ? [
      scopedDescendant(scopeSelector, '.btn-preview-bot'),
      scopedDescendant(scopeSelector, '.sp-body .btn-new-bot'),
      scopedDescendant(scopeSelector, '.sp-body .ss-user-message__action-btn'),
    ].join(', ')
    : '.btn-preview-bot, .sp-body .btn-new-bot, .sp-body .ss-user-message__action-btn';
  const nextButtonSelector = scopeSelector
    ? scopedDescendant(scopeSelector, '.sp-body .sp-user-message-button-action .ss-user-message__action-btn')
    : '.sp-body .sp-user-message-button-action .ss-user-message__action-btn';
  const nextButtonActionSelector = scopeSelector
    ? scopedDescendant(scopeSelector, '.sp-body .sp-user-message-button-action')
    : '.sp-body .sp-user-message-button-action';
  const buttonPositionRules = `
${nextButtonActionSelector} {
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
  const botMessageTailRules = botMessageBorderStyle === 'no_tail' ? `
${botMessageTailHideSelectors} {
  display: none !important;
}` : '';

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
  background-color: var(--c-btn-normal-bg) !important;
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
  background-color: var(--c-btn-pressed-bg) !important;
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

  return `
${twinkleKeyframesCss}
/* Bug #1 / #6: header thật và preview cùng chuỗi fallback với preview-chat-bot.css.
   --c-header-bg (theme) → --pof-header-bg (SDK/embedded) → #327AED. */
${scopedClass(scopeSelector, '.sp-header')},
${scopedClass(scopeSelector, '.preview-open-frame__header')} {
  background-color: var(--c-header-bg, var(--pof-header-bg, #327AED)) !important;
}

${scopedClass(scopeSelector, '.sp-header-left-label')} {
  min-width: 0;
  overflow: hidden;
}

${scopedClass(scopeSelector, '.sp-header-left-label-title')} {
  color: var(--c-header-title-text, #fff) !important;
  font-size: var(--c-header-title-font-size, 15px) !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${scopedClass(scopeSelector, '.sp-header-left-label-sub-title')} {
  color: var(--c-header-subtitle-text, #fff) !important;
  font-size: var(--c-header-subtitle-font-size, 14px) !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${scopedClass(scopeSelector, '.sp-header-right-arrow')} {
  color: var(--c-header-title-text, #fff) !important;
}

${scopedClass(scopeSelector, '.sp-process-bar')} {
  background-color: var(--c-progress-bg, #EBF7FF) !important;
}

${scopedClass(scopeSelector, '.sp-process-bar-color')} {
  color: var(--c-progress-text, #fff) !important;
  font-size: var(--c-progress-font-size, 13px) !important;
  background-color: var(--c-progress-fill, #70A5FC) !important;
}

${scopeSelector ? spBodySelector : '#sp-body.sp-body, .sp-body'} {
  background-color: var(--c-chat-window-bg, #EBF7FF) !important;
}

${scopedClass(scopeSelector, '.ss-bot-message__content-wrapper')},
${scopedDescendant(scopeSelector, '.ss-bot-message .ss-bot-message__content')} {
  background-color: var(--c-bot-msg-bg, #3CACEF) !important;
  color: var(--c-bot-msg-text, #fff) !important;
  font-size: var(--c-bot-msg-font-size, 14px) !important;
}

${fieldSelectors} {
  border: 1px solid var(--c-field-unfocus-border, #ccc) !important;
  background-color: var(--c-field-unfocus-bg, #fff) !important;
  font-size: var(--c-field-font-size, 14px) !important;
  ${transitionRule}
}

${fieldPlaceholderSelectors} {
  font-size: var(--c-field-font-size, 14px) !important;
}

${fieldScopeSelectors.map((fieldScope) => `${fieldScope} .ant-select-selection-placeholder`).join(',\n')} {
  font-size: var(--c-field-font-size, 14px) !important;
}
${focusRules}
${previewRules}
${twinkleFieldOverrideRules}${previewFieldFontSizeRule}

${scopedClass(scopeSelector, '.ss-bot-chat-detail-content')},
${scopedClass(scopeSelector, '.ss-bot-chat-text-input.ss-bot-chat-detail-content')} {
  background-color: var(--c-bot-msg-bg, #3CACEF) !important;
  color: var(--c-bot-msg-text, #fff) !important;
  font-size: var(--c-bot-msg-font-size, 14px) !important;
  border: none !important;
}

${scopedDescendant(scopeSelector, '.ss-bot-chat-text-input-bot-icon path')} {
  fill: var(--c-bot-msg-bg, #3CACEF) !important;
}

${scopedClass(scopeSelector, '.sp-body-user-side-messages')} {
  background-color: transparent !important;
}

${userMessageWrapperSelector} {
  background-color: var(--c-user-msg-bg, #fff) !important;
  color: var(--c-user-msg-text, #333) !important;
  font-size: var(--c-user-msg-font-size, 14px) !important;
}

${userMessageWrapperDirectChildSelector} {
  padding: 10px;
  border-radius: 20px;
}
${botMessageTailRules}
${userMessageTailRules}

${buttonPositionRules}
${previewButtonPositionRule}

${btnSelector},
${withPseudoOnEach(btnSelector, ':hover')},
${withPseudoOnEach(btnSelector, ':focus')},
${withPseudoOnEach(btnSelector, ':focus-visible')} {
  background-color: var(--c-btn-normal-bg) !important;
  color: var(--c-btn-normal-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  border: none !important;
  box-shadow: none !important;
  ${buttonLayoutRules}
  ${buttonBounceAnimation}
}

${withPseudoOnEach(btnSelector, ':active')} {
  background-color: var(--c-btn-pressed-bg) !important;
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
  min-height: 36px !important;
  font-weight: 500 !important;
  background-color: var(--c-btn-normal-bg) !important;
  color: var(--c-btn-normal-text, #fff) !important;
  font-size: var(--c-btn-font-size, 14px) !important;
  border: none !important;
  box-shadow: none !important;
  ${buttonLayoutRules}
  ${buttonBounceAnimation}
}

${withPseudoOnEach(nextButtonSelector, ':active')} {
  background-color: var(--c-btn-pressed-bg) !important;
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

${buildNativeRadioInputRules([
    `${spBodySelector} .ss-message__content--user-radio_button:not(.ss-message__content--user-radio_button--radio_button_img) input[type="radio"]:not(.ss-radio-button-img-input--hidden)`,
    scopedDescendant(scopeSelector, '.theme-customize-preview__radio-default input[type="radio"]'),
  ])}

${spBodySelector} .ss-message__content--user-radio_button > label,
${spBodySelector} .ss-message__content--user-radio_button--block_style > span,
${scopedDescendant(scopeSelector, '.theme-customize-preview__radio-default > label')} {
  font-size: var(--c-radio-font-size, 14px) !important;
}

${userBubbleTextSelectors} {
  color: var(--c-user-msg-text, #333) !important;
  font-size: var(--c-user-msg-font-size, 14px) !important;
}

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

const buildThemeCss = (theme, scopeSelector = '') => {
  const variablesBlock = scopeSelector
    ? `${scopeSelector} {${buildThemeVariables(theme)}\n}`
    : `#sp-container, .sp-container, #sp-container1, .sp-container1 {${buildThemeVariables(theme)}\n}`;

  const isLiveBotScope = scopeSelector.includes('sp-container');
  const portalVariablesBlock = isLiveBotScope
    ? `\n\n#portal {${buildPortalModalVariables(theme)}\n}`
    : '';
  const portalRules = isLiveBotScope ? `\n\n${buildPortalModalRules()}` : '';

  return `${variablesBlock}${portalVariablesBlock}\n\n${buildThemeRules(theme, scopeSelector)}${portalRules}`.trim();
};

export const generateThemeCss = (rawTheme, mainColorHex, apiColorKey) => {
  const theme = mergeThemeWithDefaults(rawTheme, mainColorHex, apiColorKey);
  return buildThemeCss(theme, LIVE_THEME_SCOPE);
};

export const generateScopedThemeCss = (
  rawTheme,
  mainColorHex,
  apiColorKey,
  scopeSelector = '#theme-customize-preview',
) => {
  const theme = mergeThemeWithDefaults(rawTheme, mainColorHex, apiColorKey);
  return buildThemeCss(theme, scopeSelector);
};

export const injectBotThemeCss = (rawTheme, mainColorHex, apiColorKey) => {
  const existing = document.getElementById('bot-theme-vars');
  if (existing) existing.remove();

  if (!rawTheme && !mainColorHex) return;

  const style = document.createElement('style');
  style.id = 'bot-theme-vars';
  style.innerHTML = generateThemeCss(rawTheme, mainColorHex, apiColorKey);
  document.head.appendChild(style);
};

export const applyPreviewThemeCss = (botInfor, themeSettings) => {
  // Bug #9: botInfor={} vẫn truthy nên từng inject palette default trước khi API về → flash xanh dương.
  const hasBotColor = Boolean(botInfor?.main_color || botInfor?.main_color_other);
  const hasTheme = Boolean(themeSettings && typeof themeSettings === 'object'
    && Object.keys(themeSettings).length > 0);
  if (!hasBotColor && !hasTheme) return;

  const { apiColorKey, mainColorHex } = resolveMainColorContext(botInfor);
  injectBotThemeCss(themeSettings, mainColorHex, apiColorKey);
};

export const parseThemeFromDesignSettings = (designSettings) => {
  if (!designSettings) return null;
  const parsed = typeof designSettings === 'string'
    ? JSON.parse(designSettings)
    : designSettings;
  return parsed?.theme || null;
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
