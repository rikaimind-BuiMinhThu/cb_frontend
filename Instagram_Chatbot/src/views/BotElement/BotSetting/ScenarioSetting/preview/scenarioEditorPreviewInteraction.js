const MESSAGE_CONTAINER_SELECTORS = '.sp-body-user-side, .sp-body-bot-side';
const INTERACTIVE_SELECTOR = 'button, input, textarea, select, a, label, .ant-picker, .ant-checkbox, .ant-radio, .ant-select';

export const parseMessageIdFromElement = (element) => {
  const container = element?.closest?.(MESSAGE_CONTAINER_SELECTORS);
  if (!container?.id?.startsWith('msg_id_')) return null;

  const rawId = container.id.replace('msg_id_', '');
  const messageId = parseInt(rawId, 10);
  return Number.isNaN(messageId) ? null : messageId;
};

export const applyEditorMessageHighlight = (messageId) => {
  document.querySelectorAll('.scenario-editor-message--selected').forEach((el) => {
    el.classList.remove('scenario-editor-message--selected');
  });

  if (messageId == null) return;

  const el = document.getElementById(`msg_id_${messageId}`);
  if (el) {
    el.classList.add('scenario-editor-message--selected');
  }
};

export const applyEditorRadioOptionHighlight = (selection) => {
  document.querySelectorAll('.scenario-editor-radio-option--selected').forEach((el) => {
    el.classList.remove('scenario-editor-radio-option--selected');
  });

  if (!selection) return;

  const { indexContent, optionId } = selection;
  if (indexContent == null || optionId == null) return;

  const selector = `[data-editor-radio-option="${indexContent}-${optionId}"]`;
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add('scenario-editor-radio-option--selected');
  });
};

export const setupEditorMessageClickListener = (onSelectMessage) => {
  const handleClick = (event) => {
    const spBody = document.getElementById('sp-body');
    if (!spBody || !spBody.contains(event.target)) return;
    if (event.target.closest(INTERACTIVE_SELECTOR)) return;

    const messageId = parseMessageIdFromElement(event.target);
    if (messageId == null) return;

    onSelectMessage(messageId);
  };

  document.addEventListener('click', handleClick, true);
  return () => document.removeEventListener('click', handleClick, true);
};
