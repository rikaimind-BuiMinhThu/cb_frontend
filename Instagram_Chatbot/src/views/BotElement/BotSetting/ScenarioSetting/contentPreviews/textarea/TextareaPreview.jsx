import React from 'react';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { TEXTAREA_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS, TEXTAREA_LABELS } from '../../constants/scenarioSettingLabels';
import '../../styles/contentPreviews/textarea.css';

const TextareaPreview = ({ textarea }) => {
  const renderHeader = () => {
    if (!textarea.title_require && !textarea.require) return null;
    return (
      <div className="ss-message__content--user-textarea-top ss-textarea-preview__header">
        {textarea.title_require && (
          <span className="ss-message__content--user-textarea-title">
            {textarea.title}
          </span>
        )}
        {textarea.require === true && textarea?.type === TEXTAREA_TYPES.TEXT_INPUT && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    );
  };

  const renderInputBody = () => {
    switch (textarea?.type) {
      case TEXTAREA_TYPES.TEXT_INPUT:
      case TEXTAREA_TYPES.INVALID_INPUT:
        return (
          <textarea
            className="ss-message__content--user-textarea ss-input-value"
            readOnly
            placeholder={textarea[textarea.type]?.content}
            rows={3}
            value={textarea?.type === TEXTAREA_TYPES.INVALID_INPUT ? textarea[textarea.type]?.content : ''}
          />
        );
      case TEXTAREA_TYPES.CONSUME_API_RESPONSE:
        return (
          <textarea
            className="ss-message__content--user-textarea ss-input-value"
            readOnly
            value={TEXTAREA_LABELS.apiValidationNote}
            rows={3}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ContentPreviewShell className="ss-textarea-preview">
      {renderHeader()}
      {renderInputBody()}
    </ContentPreviewShell>
  );
};

export default TextareaPreview;
