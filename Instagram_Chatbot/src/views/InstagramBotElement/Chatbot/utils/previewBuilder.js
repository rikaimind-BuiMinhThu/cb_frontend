import { MESSAGE_TYPES } from '../constants/messageTypes';

export function buildPreviewItems(messages, draft) {
  const items = (messages || []).map((message) => messageToPreviewItem(message));

  if (draft && !draft.isComplete) {
    items.push(draftToPreviewItem(draft));
  }

  return items;
}

function messageToPreviewItem(message) {
  if (message.message_type === MESSAGE_TYPES.IMG) {
    return { kind: 'image', content: message.img_value?.url || message.img_value };
  }
  if (message.message_type === MESSAGE_TYPES.IMG_MSG) {
    return {
      kind: 'image-text',
      image: message.img_value?.url || message.img_value,
      text: message.message_value,
    };
  }
  if (message.message_type === MESSAGE_TYPES.PAST_POST) {
    return {
      kind: 'image',
      content: message.preview_past_post_url || message.message_value,
    };
  }
  return { kind: 'text', content: message.message_value };
}

function draftToPreviewItem(draft) {
  if (draft.messageType === MESSAGE_TYPES.IMG) {
    return { kind: 'image', content: draft.previewUrl || draft.imgValue, draft: true };
  }
  if (draft.messageType === MESSAGE_TYPES.IMG_MSG) {
    return {
      kind: 'image-text',
      image: draft.previewUrl || draft.imgValue,
      text: draft.messageValue,
      draft: true,
    };
  }
  if (draft.messageType === MESSAGE_TYPES.PAST_POST) {
    return { kind: 'image', content: draft.previewPastPostUrl, draft: true };
  }
  return { kind: 'text', content: draft.messageValue, draft: true };
}

export function messageFromApiToDraft(message) {
  const draft = {
    id: message.id,
    messageType: message.message_type,
    messageValue: message.message_value || '',
    imgValue: message.img_value?.url || message.img_value || '',
    previewUrl: message.img_value?.url || message.img_value || '',
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
      draft.choiceMode = 'free_input';
      draft.freeInput = {
        labels: labels.length ? labels : [''],
        formatCheck: formatCheck || 'no_validate',
        formatCheckMessage: message.free_input.format_check_message || '',
      };
    }
  } else if (message.message_buttons?.length) {
    draft.choiceMode = message.message_buttons.length === 1 ? 'single_choice' : 'three_choice';
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
    choiceMode: 'none',
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
