import { CAMEL_TO_SNAKE_THEME } from '../views/BotElement/BotSetting/DesignSetting/constants/designThemeConstants';
import {
  mergeThemeWithDefaults,
  resolveFieldFocusEffect,
} from '../views/BotElement/BotSetting/DesignSetting/utils/designThemeUtils';

const buildFieldSelectors = (spBodySelector) => `
${spBodySelector} input[type="text"],
${spBodySelector} input[type="email"],
${spBodySelector} input[type="tel"],
${spBodySelector} input[type="number"],
${spBodySelector} input[type="password"],
${spBodySelector} textarea,
${spBodySelector} select,
${spBodySelector} .ss-input-value,
${spBodySelector} .ant-select-selector
`.trim();

const buildFieldFocusSelectors = (spBodySelector) => `
${spBodySelector} input[type="text"]:focus,
${spBodySelector} input[type="email"]:focus,
${spBodySelector} input[type="tel"]:focus,
${spBodySelector} input[type="number"]:focus,
${spBodySelector} input[type="password"]:focus,
${spBodySelector} textarea:focus,
${spBodySelector} select:focus,
${spBodySelector} .ss-input-value:focus,
${spBodySelector} .ant-select-focused .ant-select-selector
`.trim();

const buildThemeVariables = (theme) => `
  --c-header-text: ${theme.headerTextColor};
  --c-progress-bg: ${theme.progressBarBgColor};
  --c-progress-text: ${theme.progressBarTextColor};
  --c-chat-window-bg: ${theme.chatWindowBgColor};
  --c-bot-msg-bg: ${theme.botMessageBgColor};
  --c-bot-msg-text: ${theme.botMessageTextColor};
  --c-user-msg-bg: ${theme.userMessageBgColor};
  --c-user-msg-text: ${theme.userMessageTextColor};
  --c-field-focus-border: ${theme.fieldFocusBorderColor};
  --c-field-focus-bg: ${theme.fieldFocusBgColor};
  --c-field-unfocus-border: ${theme.fieldUnfocusBorderColor};
  --c-field-unfocus-bg: ${theme.fieldUnfocusBgColor};
  --c-btn-normal-bg: ${theme.buttonNormalBgColor};
  --c-btn-normal-text: ${theme.buttonNormalTextColor};
  --c-btn-pressed-bg: ${theme.buttonPressedBgColor};
  --c-btn-pressed-text: ${theme.buttonPressedTextColor};
  --c-btn-disabled-bg: ${theme.buttonDisabledBgColor};
  --c-btn-disabled-text: ${theme.buttonDisabledTextColor};
  --c-checkbox-unchecked-bg: ${theme.checkboxUncheckedBgColor};
  --c-checkbox-unchecked-border: ${theme.checkboxUncheckedBorderColor};
  --c-checkbox-checked-bg: ${theme.checkboxCheckedBgColor};
  --c-checkbox-checked-border: ${theme.checkboxCheckedBorderColor};
`;

const buildFieldFocusStyles = (fieldFocusSelectors, focusEffect, previewFocusSelector = '') => {
  const transitionRule = focusEffect.fieldTransition !== 'none'
    ? `transition: ${focusEffect.fieldTransition};`
    : '';
  const animationRule = focusEffect.focusAnimation !== 'none'
    ? `animation: ${focusEffect.focusAnimation};`
    : '';

  const focusRules = `
${fieldFocusSelectors} {
  border-color: var(--c-field-focus-border, #327AED) !important;
  background-color: var(--c-field-focus-bg, #fff) !important;
  box-shadow: ${focusEffect.boxShadow} !important;
  ${animationRule}
}`;

  const previewRules = previewFocusSelector ? `
${previewFocusSelector} {
  border-color: var(--c-field-focus-border, #327AED) !important;
  background-color: var(--c-field-focus-bg, #fff) !important;
  box-shadow: ${focusEffect.boxShadow} !important;
  ${animationRule}
}` : '';

  return { transitionRule, focusRules, previewRules };
};

const buildThemeRules = (theme, scopeSelector = '') => {
  const scopePrefix = scopeSelector ? `${scopeSelector} ` : '';
  const spBodySelector = scopeSelector ? `${scopeSelector} .sp-body` : '.sp-body';
  const fieldSelectors = buildFieldSelectors(spBodySelector);
  const fieldFocusSelectors = buildFieldFocusSelectors(spBodySelector);
  const focusEffect = resolveFieldFocusEffect(theme.fieldFocusBgEffect, theme);
  const previewFocusSelector = scopeSelector ? `${scopeSelector} .theme-preview--field-focus` : '';
  const { transitionRule, focusRules, previewRules } = buildFieldFocusStyles(
    fieldFocusSelectors,
    focusEffect,
    previewFocusSelector,
  );

  const submitBtnSelector = scopeSelector
    ? `${scopeSelector} #chatbot-submit-button, ${scopeSelector} .chatbot-submit-button, ${scopeSelector} [id^="chatbot-submit-button-"]`
    : '#chatbot-submit-button, .chatbot-submit-button, [id^="chatbot-submit-button-"]';
  const btnSelector = scopeSelector
    ? `${submitBtnSelector}, ${scopeSelector} .btn-preview-bot, ${scopeSelector} .sp-body .btn-new-bot`
    : `${submitBtnSelector}, .btn-preview-bot, .sp-body .btn-new-bot`;

  const previewBtnPressedRule = scopeSelector ? `
${scopeSelector} .theme-preview--btn-pressed.btn-new-bot {
  background-color: var(--c-btn-pressed-bg) !important;
  color: var(--c-btn-pressed-text, #fff) !important;
}` : '';

  return `
${focusEffect.keyframesCss}
${scopePrefix}.sp-header-left-label,
${scopePrefix}.sp-header-left-label-title,
${scopePrefix}.sp-header-left-label-sub-title {
  color: var(--c-header-text, #fff) !important;
}

${scopePrefix}.sp-process-bar {
  background-color: var(--c-progress-bg, #EBF7FF) !important;
}

${scopePrefix}.sp-process-bar-color {
  color: var(--c-progress-text, #fff) !important;
}

${scopeSelector ? `${scopeSelector} .sp-body` : '#sp-body.sp-body, .sp-body'} {
  background-color: var(--c-chat-window-bg, #EBF7FF) !important;
}

${scopePrefix}.ss-bot-message__content-wrapper,
${scopePrefix}.ss-bot-message .ss-bot-message__content {
  background-color: var(--c-bot-msg-bg) !important;
  color: var(--c-bot-msg-text) !important;
}

${scopePrefix}.sp-body-user-side-messages .ss-user-message__content-wrapper,
${scopePrefix}.ss-user-message__content-wrapper {
  background-color: var(--c-user-msg-bg, #fff) !important;
  color: var(--c-user-msg-text, #333) !important;
}

${fieldSelectors} {
  border: 1px solid var(--c-field-unfocus-border, #ccc) !important;
  background-color: var(--c-field-unfocus-bg, #fff) !important;
  ${transitionRule}
}
${focusRules}
${previewRules}

${btnSelector} {
  background-color: var(--c-btn-normal-bg) !important;
  color: var(--c-btn-normal-text, #fff) !important;
}

${btnSelector}:active {
  background-color: var(--c-btn-pressed-bg) !important;
  color: var(--c-btn-pressed-text, #fff) !important;
}

${btnSelector}:disabled {
  background-color: var(--c-btn-disabled-bg, #e0e0e0) !important;
  color: var(--c-btn-disabled-text, #999) !important;
}

${spBodySelector} .ant-checkbox-inner {
  background-color: var(--c-checkbox-unchecked-bg, #fff) !important;
  border-color: var(--c-checkbox-unchecked-border, #ccc) !important;
}

${spBodySelector} .ant-checkbox-checked .ant-checkbox-inner {
  background-color: var(--c-checkbox-checked-bg) !important;
  border-color: var(--c-checkbox-checked-border) !important;
}${previewBtnPressedRule}`.trim();
};

const buildThemeCss = (theme, scopeSelector = '') => {
  const variablesBlock = scopeSelector
    ? `${scopeSelector} {${buildThemeVariables(theme)}\n}`
    : `#sp-container, .sp-container {${buildThemeVariables(theme)}\n}`;

  return `${variablesBlock}\n\n${buildThemeRules(theme, scopeSelector)}`.trim();
};

export const generateThemeCss = (rawTheme, mainColorHex, apiColorKey) => {
  const theme = mergeThemeWithDefaults(rawTheme, mainColorHex, apiColorKey);
  return buildThemeCss(theme);
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

export const parseThemeFromDesignSettings = (designSettings) => {
  if (!designSettings) return null;
  const parsed = typeof designSettings === 'string'
    ? JSON.parse(designSettings)
    : designSettings;
  return parsed?.theme || null;
};

export { CAMEL_TO_SNAKE_THEME };
