export const EDITOR_PREVIEW_FALLBACK_BOT_INFOR = {
  title: '簡単90秒で注文完了',
  subtitle: '',
  titleBubble: '簡単90秒で注文完了',
  main_color: '#327AED',
  main_color_other: '#327AED',
  opacity_color: '#f6fbff',
};

export const isEditorPreviewIframe = () => {
  try {
    return new URLSearchParams(window.location.search).get('editor_preview') === '1';
  } catch {
    return false;
  }
};

export const resolveEditorPreviewBotInfor = (botInfor) => {
  if (botInfor?.title || botInfor?.main_color || botInfor?.main_color_other) {
    return botInfor;
  }
  return EDITOR_PREVIEW_FALLBACK_BOT_INFOR;
};

export const hasEditorPreviewDraftContent = (state) => (
  Boolean(state?.hasEditorPreviewDraftApplied || state?.renderMessagesList?.length > 0)
);

export const canRenderEditorPreviewBody = ({
  editorPreview,
  effectiveIsOpen,
  state,
}) => {
  if (!editorPreview || !effectiveIsOpen) return false;
  return hasEditorPreviewDraftContent(state);
};
