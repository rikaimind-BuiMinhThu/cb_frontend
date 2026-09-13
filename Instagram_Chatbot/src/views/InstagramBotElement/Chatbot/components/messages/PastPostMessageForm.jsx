import React from 'react';
import { EMPTY_STATES, MESSAGE_TYPES } from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

export default function PastPostMessageForm() {
  const { drafts } = useChatbotEditor();
  const { draft } = drafts;

  if (!draft || draft.messageType !== MESSAGE_TYPES.PAST_POST) return null;

  return (
    <div className="cb-editor-form">
      {draft.previewPastPostUrl ? (
        <div className="cb-image-preview-wrap cb-image-preview-wrap--compact">
          <img
            src={draft.previewPastPostUrl}
            alt="past post"
            className="cb-image-preview"
          />
        </div>
      ) : (
        <div className="cb-empty-state">{EMPTY_STATES.NO_PAST_POST}</div>
      )}
    </div>
  );
}
