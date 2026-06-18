export const SCENARIO_PREVIEW_MESSAGES = {
  EDITOR_DRAFT: 'SCENARIO_EDITOR_DRAFT',
  EDITOR_CUSTOM_CSS: 'SCENARIO_EDITOR_CUSTOM_CSS',
  PREVIEW_READY: 'SCENARIO_PREVIEW_READY',
  PREVIEW_CONTENT_READY: 'SCENARIO_PREVIEW_CONTENT_READY',
  SELECT_MESSAGE: 'SCENARIO_EDITOR_SELECT_MESSAGE',
  HIGHLIGHT_MESSAGE: 'SCENARIO_EDITOR_HIGHLIGHT_MESSAGE',
  HIGHLIGHT_RADIO_OPTION: 'SCENARIO_EDITOR_HIGHLIGHT_RADIO_OPTION',
  HIGHLIGHT_CHECKBOX_OPTION: 'SCENARIO_EDITOR_HIGHLIGHT_CHECKBOX_OPTION',
  PREVIEW_BOT_META: 'SCENARIO_PREVIEW_BOT_META',
};

export const isSameOriginMessage = (event) => {
  if (!event?.origin) return false;
  return event.origin === window.location.origin;
};

export const postToIframe = (iframe, message) => {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(message, window.location.origin);
};

export const postToParent = (message) => {
  if (window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
};

export const buildScenarioPreviewIframeSrc = ({ scenarioId, scenarioType, botId }) => {
  const params = new URLSearchParams({
    editor_preview: '1',
    scenario_id: scenarioId || '',
    scenario_type: scenarioType || 'payment',
  });
  if (botId) {
    params.set('bot_id', botId);
  }
  return `/preview-scenario-editor?${params.toString()}`;
};
