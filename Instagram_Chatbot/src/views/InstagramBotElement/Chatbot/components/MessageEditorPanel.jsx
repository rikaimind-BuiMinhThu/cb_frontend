import React from 'react';
import { Button } from 'antd';
import {
  ACTION_LABELS,
  EMPTY_STATES,
  MESSAGE_TYPES,
} from '../constants';
import { useChatbotEditor } from '../context/ChatbotEditorContext';
import TextMessageForm from './messages/TextMessageForm';
import ImageMessageForm from './messages/ImageMessageForm';
import ImageTextMessageForm from './messages/ImageTextMessageForm';
import PastPostMessageForm from './messages/PastPostMessageForm';
import ProfileMessageForm from './messages/ProfileMessageForm';
import { MessageTypeToolbar } from './overview/MessageOverviewList';

function renderForm(draft) {
  if (!draft) return null;
  switch (draft.messageType) {
    case MESSAGE_TYPES.IMG:
      return <ImageMessageForm />;
    case MESSAGE_TYPES.IMG_MSG:
      return <ImageTextMessageForm />;
    case MESSAGE_TYPES.PAST_POST:
      return <PastPostMessageForm />;
    case MESSAGE_TYPES.PROFILE_MSG:
      return <ProfileMessageForm />;
    case MESSAGE_TYPES.MSG:
    default:
      return <TextMessageForm />;
  }
}

export default function MessageEditorPanel() {
  const { drafts, mutations, messages, bags } = useChatbotEditor();
  const { draft, clearDraft, hasActiveDraft } = drafts;

  if (!bags.selectedBagId) {
    return <div className="cb-empty-state">{EMPTY_STATES.SELECT_BAG_TO_EDIT}</div>;
  }

  const handleSave = async () => {
    if (!draft) return;
    if (draft.isEditing && draft.id) {
      const message = messages.messages.find((m) => m.id === draft.id);
      if (message) {
        await mutations.updateExisting(message, draft);
        clearDraft();
        messages.setSelectedMessageId(null);
      }
      return;
    }
    await mutations.saveDraft(draft);
  };

  const handleDelete = async () => {
    if (draft?.id) {
      await mutations.removeMessage(draft.id);
      clearDraft();
      messages.setSelectedMessageId(null);
    } else {
      clearDraft();
    }
  };

  const handleCancel = () => {
    clearDraft();
    messages.setSelectedMessageId(null);
  };

  return (
    <div>
      <MessageTypeToolbar />
      {renderForm(draft)}
      {(draft || hasActiveDraft) && (
        <div className="cb-form-actions">
          <Button onClick={handleCancel}>{ACTION_LABELS.CANCEL}</Button>
          {draft?.isEditing && draft?.id && (
            <Button danger onClick={handleDelete}>
              {ACTION_LABELS.DELETE}
            </Button>
          )}
          <Button type="primary" onClick={handleSave}>
            {ACTION_LABELS.SAVE}
          </Button>
        </div>
      )}
    </div>
  );
}
