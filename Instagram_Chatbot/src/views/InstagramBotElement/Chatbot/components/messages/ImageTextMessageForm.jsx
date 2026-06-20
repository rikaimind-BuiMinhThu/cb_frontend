import React, { useState } from 'react';
import { Input, Upload } from 'antd';
import { ACTION_LABELS, FORM_PLACEHOLDERS } from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';
import { readFileAsDataUrl, validateImageFile } from '../../utils/chatbotValidation';

export default function ImageTextMessageForm() {
  const { drafts } = useChatbotEditor();
  const { draft, setDraft } = drafts;
  const [error, setError] = useState('');

  if (!draft) return null;

  const handleFile = async (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return false;
    }
    setError('');
    const dataUrl = await readFileAsDataUrl(file);
    setDraft((prev) => ({
      ...prev,
      imgValue: dataUrl,
      previewUrl: URL.createObjectURL(file),
    }));
    return false;
  };

  return (
    <div className="cb-editor-form">
      <Upload beforeUpload={handleFile} showUploadList={false} accept="image/*">
        <button type="button" className="cb-choice-btn">
          {ACTION_LABELS.SELECT_IMAGE}
        </button>
      </Upload>
      {error && <div className="cb-error-text">{error}</div>}
      {(draft.previewUrl || draft.imgValue) && (
        <div className="cb-image-preview-wrap">
          <img
            src={draft.previewUrl || draft.imgValue}
            alt="preview"
            className="cb-image-preview"
          />
        </div>
      )}
      <Input.TextArea
        className="cb-field-block"
        rows={3}
        placeholder={FORM_PLACEHOLDERS.CAPTION}
        value={draft.messageValue}
        onChange={(e) => setDraft((prev) => ({ ...prev, messageValue: e.target.value }))}
      />
    </div>
  );
}
