import { MESSAGE_TYPES } from '../constants/messageTypes';
import { BUTTON_TYPES, CHOICE_MODES } from '../constants/buttonTypes';
import { isNewImageUpload } from './resolveMessageImageUrl';

function labelsToPayload(labels) {
  return (labels || [])
    .filter((label) => label && String(label).trim())
    .map((label_name) => ({ label_name: String(label_name).trim() }));
}

function buildButtons(choiceMode, choiceData) {
  if (choiceMode === CHOICE_MODES.SINGLE) {
    const btn = choiceData.buttons[0];
    if (btn.buttonType === BUTTON_TYPES.MESS) {
      return [
        {
          button_type: BUTTON_TYPES.MESS,
          title: btn.title,
          message_bag_id: String(btn.messageBagId),
          message_button_labels: labelsToPayload(btn.labels),
        },
      ];
    }
    return [
      {
        button_type: BUTTON_TYPES.WEB_URL,
        title: btn.title,
        content: btn.content,
        message_button_labels: labelsToPayload(btn.labels),
      },
    ];
  }

  if (choiceMode === CHOICE_MODES.THREE) {
    return choiceData.buttons.map((btn) => {
      if (btn.buttonType === BUTTON_TYPES.MESS) {
        return {
          button_type: BUTTON_TYPES.MESS,
          title: btn.title,
          message_bag_id: String(btn.messageBagId),
          message_button_labels: labelsToPayload(btn.labels),
        };
      }
      return {
        button_type: BUTTON_TYPES.WEB_URL,
        title: btn.title,
        content: btn.content,
        message_button_labels: labelsToPayload(btn.labels),
      };
    });
  }

  return [];
}

export function buildCreatePayload(messageBagId, draft) {
  const base = {
    message_bag_id: messageBagId,
    img_value: '',
  };

  if (draft.messageType === MESSAGE_TYPES.IMG) {
    return {
      message: {
        ...base,
        message_value: '',
        message_type: MESSAGE_TYPES.IMG,
        img_value: draft.imgValue,
      },
    };
  }

  if (draft.messageType === MESSAGE_TYPES.IMG_MSG) {
    return {
      message: {
        ...base,
        message_value: draft.messageValue,
        message_type: MESSAGE_TYPES.IMG_MSG,
        img_value: draft.imgValue,
      },
    };
  }

  if (draft.messageType === MESSAGE_TYPES.PAST_POST) {
    const payload = {
      message: {
        ...base,
        message_value: String(draft.pastPostId),
        message_type: MESSAGE_TYPES.PAST_POST,
        preview_past_post_url: draft.previewPastPostUrl,
      },
    };
    if (draft.choiceMode === CHOICE_MODES.FREE_INPUT) {
      payload.message.free_input = {
        message_bag_id: '1',
        free_input_labels: labelsToPayload(draft.freeInput.labels),
        format_check: draft.freeInput.formatCheck,
        format_check_message: draft.freeInput.formatCheckMessage,
      };
    } else if (draft.choiceMode !== CHOICE_MODES.NONE) {
      payload.message.message_buttons = buildButtons(draft.choiceMode, draft.choiceData);
    }
    return payload;
  }

  if (draft.messageType === MESSAGE_TYPES.PROFILE_MSG) {
    return {
      message: {
        ...base,
        message_value: draft.messageValue,
        message_type: MESSAGE_TYPES.MSG,
        free_input: {
          message_bag_id: '1',
          free_input_labels: '',
          format_check: draft.profileFieldKey,
          format_check_message: '',
        },
      },
    };
  }

  const payload = {
    message: {
      ...base,
      message_value: draft.messageValue,
      message_type: MESSAGE_TYPES.MSG,
    },
  };

  if (draft.choiceMode === CHOICE_MODES.FREE_INPUT) {
    payload.message.free_input = {
      message_bag_id: '1',
      free_input_labels: labelsToPayload(draft.freeInput.labels),
      format_check: draft.freeInput.formatCheck,
      format_check_message: draft.freeInput.formatCheckMessage,
    };
  } else if (draft.choiceMode !== CHOICE_MODES.NONE) {
    payload.message.message_buttons = buildButtons(draft.choiceMode, draft.choiceData);
  }

  return payload;
}

export function buildUpdatePayload(message, draft) {
  const payload = buildCreatePayload(message.message_bag_id, draft);
  const isImageMessage =
    draft.messageType === MESSAGE_TYPES.IMG ||
    draft.messageType === MESSAGE_TYPES.IMG_MSG;
  if (isImageMessage && !isNewImageUpload(draft.imgValue)) {
    delete payload.message.img_value;
  }
  return payload;
}
