import React from 'react';
import { Input, Select } from 'antd';
import {
  CHOICE_LABELS,
  CHOICE_MODES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORMAT_CHECKS,
} from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';
import ChoiceEditorForm from '../choices/ChoiceEditorForm';

export default function TextMessageForm() {
  const { drafts } = useChatbotEditor();
  const { draft, setDraft } = drafts;

  if (!draft) return null;

  const setChoiceMode = (mode) => {
    setDraft((prev) => ({
      ...prev,
      choiceMode: mode,
      choiceData:
        mode === CHOICE_MODES.THREE
          ? {
              buttons: [
                { buttonType: 'mess', title: '', content: '', messageBagId: '', messageGroupId: '', labels: [''] },
                { buttonType: 'mess', title: '', content: '', messageBagId: '', messageGroupId: '', labels: [''] },
                { buttonType: 'mess', title: '', content: '', messageBagId: '', messageGroupId: '', labels: [''] },
              ],
            }
          : {
              buttons: [
                { buttonType: 'mess', title: '', content: '', messageBagId: '', messageGroupId: '', labels: [''] },
              ],
            },
    }));
  };

  return (
    <div className="cb-editor-form">
      <Input.TextArea
        rows={3}
        placeholder={FORM_PLACEHOLDERS.REPLY}
        value={draft.messageValue}
        onChange={(e) => setDraft((prev) => ({ ...prev, messageValue: e.target.value }))}
      />
      <div className="cb-choice-toolbar">
        <button
          type="button"
          className={`cb-choice-btn${draft.choiceMode === CHOICE_MODES.SINGLE ? ' is-active' : ''}`}
          onClick={() => setChoiceMode(CHOICE_MODES.SINGLE)}
        >
          {CHOICE_LABELS.SINGLE}
        </button>
        <button
          type="button"
          className={`cb-choice-btn${draft.choiceMode === CHOICE_MODES.THREE ? ' is-active' : ''}`}
          onClick={() => setChoiceMode(CHOICE_MODES.THREE)}
        >
          {CHOICE_LABELS.THREE}
        </button>
        <button
          type="button"
          className={`cb-choice-btn${draft.choiceMode === CHOICE_MODES.FREE_INPUT ? ' is-active' : ''}`}
          onClick={() => setChoiceMode(CHOICE_MODES.FREE_INPUT)}
        >
          {CHOICE_LABELS.FREE_INPUT}
        </button>
      </div>
      {(draft.choiceMode === CHOICE_MODES.SINGLE ||
        draft.choiceMode === CHOICE_MODES.THREE) && <ChoiceEditorForm />}
      {draft.choiceMode === CHOICE_MODES.FREE_INPUT && (
        <div className="cb-form-block">
          <label className="cb-form-label">{FORM_LABELS.FORMAT_CHECK}</label>
          <Select
            className="cb-field"
            value={draft.freeInput.formatCheck}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                freeInput: { ...prev.freeInput, formatCheck: value },
              }))
            }
            options={FORMAT_CHECKS}
          />
          <Input
            className="cb-field-block"
            placeholder={FORM_PLACEHOLDERS.VALIDATION_MESSAGE}
            value={draft.freeInput.formatCheckMessage}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                freeInput: { ...prev.freeInput, formatCheckMessage: e.target.value },
              }))
            }
          />
          <Input
            className="cb-field-block"
            placeholder={FORM_PLACEHOLDERS.LABEL}
            value={draft.freeInput.labels[0] || ''}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                freeInput: { ...prev.freeInput, labels: [e.target.value] },
              }))
            }
          />
        </div>
      )}
    </div>
  );
}
