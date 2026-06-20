import { MESSAGE_TYPES } from '../constants/messageTypes';
import { CHOICE_MODES, PROFILE_FIELDS } from '../constants/buttonTypes';
import { resolveMessageImageUrl } from './resolveMessageImageUrl';

export function buildPreviewItems(messages, draft) {
  const rows = (messages || []).flatMap((message) => messageToPreviewRows(message));

  if (draft && !draft.isComplete) {
    rows.push(...draftToPreviewRows(draft));
  }

  return rows;
}

function buildTextRow(content, meta = {}) {
  if (!content) return [];
  return [{ kind: 'text', content, ...meta }];
}

function buildImageRow(url, meta = {}) {
  if (!url) return [];
  return [{ kind: 'image', content: url, ...meta }];
}

function buildButtonRows(buttons, meta = {}) {
  const titles = (buttons || [])
    .map((btn) => btn.title || btn.label)
    .filter((title) => title && String(title).trim());
  if (!titles.length) return [];
  return [{
    kind: 'buttons',
    buttons: titles.map((title) => ({ title: String(title).trim() })),
    ...meta,
  }];
}

function getProfilePlaceholder(profileFieldKey) {
  const field = PROFILE_FIELDS.find((item) => item.apiKey === profileFieldKey);
  return field?.placeholder || '';
}

function messageToPreviewRows(message) {
  const meta = { messageId: message.id };

  if (message.message_type === MESSAGE_TYPES.IMG) {
    return buildImageRow(resolveMessageImageUrl(message), meta);
  }

  if (message.message_type === MESSAGE_TYPES.IMG_MSG) {
    return [
      ...buildTextRow(message.message_value, meta),
      ...buildImageRow(resolveMessageImageUrl(message), meta),
    ];
  }

  if (message.message_type === MESSAGE_TYPES.PAST_POST) {
    return buildImageRow(message.preview_past_post_url || message.message_value, meta);
  }

  if (message.message_type === MESSAGE_TYPES.PROFILE_MSG) {
    const formatCheck = message.free_input?.format_check;
    const content = message.message_value || getProfilePlaceholder(formatCheck);
    return buildTextRow(content, meta);
  }

  const rows = buildTextRow(message.message_value, meta);
  if (message.message_buttons?.length) {
    rows.push(...buildButtonRows(message.message_buttons, meta));
  }
  return rows;
}

function draftToPreviewRows(draft) {
  const meta = { messageId: draft.id || 'draft', draft: true };

  if (draft.messageType === MESSAGE_TYPES.IMG) {
    return buildImageRow(draft.previewUrl || draft.imgValue, meta);
  }

  if (draft.messageType === MESSAGE_TYPES.IMG_MSG) {
    return [
      ...buildTextRow(draft.messageValue, meta),
      ...buildImageRow(draft.previewUrl || draft.imgValue, meta),
    ];
  }

  if (draft.messageType === MESSAGE_TYPES.PAST_POST) {
    return buildImageRow(draft.previewPastPostUrl, meta);
  }

  if (draft.messageType === MESSAGE_TYPES.PROFILE_MSG) {
    const content = draft.messageValue || getProfilePlaceholder(draft.profileFieldKey);
    return buildTextRow(content, meta);
  }

  const rows = buildTextRow(draft.messageValue, meta);
  if (
    draft.choiceMode === CHOICE_MODES.SINGLE ||
    draft.choiceMode === CHOICE_MODES.THREE
  ) {
    rows.push(...buildButtonRows(draft.choiceData?.buttons, meta));
  }
  return rows;
}

export function messageFromApiToDraft(message) {
  const draft = {
    id: message.id,
    messageType: message.message_type,
    messageValue: message.message_value || '',
    imgValue: '',
    previewUrl: resolveMessageImageUrl(message),
    previewPastPostUrl: message.preview_past_post_url || '',
    pastPostId: message.message_value,
    choiceMode: 'none',
    choiceData: { buttons: [] },
    freeInput: { labels: [''], formatCheck: 'no_validate', formatCheckMessage: '' },
    profileFieldKey: '',
    isComplete: true,
    isEditing: true,
  };

  if (message.free_input) {
    const labels = (message.free_input.free_input_labels || []).map((l) => l.label_name);
    const formatCheck = message.free_input.format_check;
    if (['real_name', 'company_name', 'company_role', 'website', 'propose', 'know_product_in'].includes(formatCheck)) {
      draft.messageType = MESSAGE_TYPES.PROFILE_MSG;
      draft.profileFieldKey = formatCheck;
    } else {
      draft.choiceMode = CHOICE_MODES.FREE_INPUT;
      draft.freeInput = {
        labels: labels.length ? labels : [''],
        formatCheck: formatCheck || 'no_validate',
        formatCheckMessage: message.free_input.format_check_message || '',
      };
    }
  } else if (message.message_buttons?.length) {
    draft.choiceMode = message.message_buttons.length === 1 ? CHOICE_MODES.SINGLE : CHOICE_MODES.THREE;
    draft.choiceData = {
      buttons: message.message_buttons.map((btn) => ({
        buttonType: btn.button_type,
        title: btn.title || '',
        content: btn.content || '',
        messageBagId: btn.message_bag_id || '',
        labels: (btn.message_button_labels || []).map((l) => l.label_name),
      })),
    };
  }

  return draft;
}

export function createEmptyDraft(messageType) {
  return {
    id: null,
    messageType,
    messageValue: '',
    imgValue: '',
    previewUrl: '',
    previewPastPostUrl: '',
    pastPostId: '',
    choiceMode: CHOICE_MODES.NONE,
    choiceData: {
      buttons: [
        { buttonType: 'mess', title: '', content: '', messageBagId: '', labels: [''] },
      ],
    },
    freeInput: { labels: [''], formatCheck: 'no_validate', formatCheckMessage: '' },
    profileFieldKey: '',
    isComplete: false,
    isEditing: false,
  };
}
