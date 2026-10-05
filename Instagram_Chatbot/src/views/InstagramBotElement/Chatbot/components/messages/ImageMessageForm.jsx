import React, { useState } from 'react';
import { Upload } from 'antd';
import { ACTION_LABELS } from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';
import { readFileAsDataUrl, validateImageFile } from '../../utils/chatbotValidation';
import { resolveMessageImageUrl } from '../../utils/resolveMessageImageUrl';

export default function ImageMessageForm() {
  const { drafts } = useChatbotEditor();
  const { draft, setDraft } = drafts;
  const [error, setError] = useState('');

  if (!draft) return null;

  const imageSrc = draft.previewUrl || draft.imgValue || resolveMessageImageUrl(draft);

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
      {imageSrc && (
        <div className="cb-image-preview-wrap">
          <img
            src={imageSrc}
            alt="preview"
            className="cb-image-preview"
          />
        </div>
      )}
    </div>
  );
}
