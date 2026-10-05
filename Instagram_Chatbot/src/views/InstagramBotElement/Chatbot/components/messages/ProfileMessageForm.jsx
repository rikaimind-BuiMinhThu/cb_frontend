import React from 'react';
import { Input } from 'antd';
import { PROFILE_FIELDS } from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

export default function ProfileMessageForm() {
  const { drafts } = useChatbotEditor();
  const { draft, setDraft } = drafts;

  if (!draft?.profileFieldKey) return null;

  const field = PROFILE_FIELDS.find((f) => f.apiKey === draft.profileFieldKey);

  return (
    <div className="cb-editor-form">
      <div className="cb-profile-field-label">{field?.label}</div>
      <Input.TextArea
        rows={3}
        placeholder={field?.placeholder}
        value={draft.messageValue}
        onChange={(e) => setDraft((prev) => ({ ...prev, messageValue: e.target.value }))}
      />
    </div>
  );
}
