import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  EMPTY_STATES,
  PREVIEW_LABELS,
} from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

function PreviewTextRow({ content }) {
  return (
    <div className="cb-preview-message-row">
      <div className="cb-preview-bubble">{content}</div>
    </div>
  );
}

function PreviewImageRow({ content }) {
  return (
    <div className="cb-preview-message-row">
      <img src={content} alt="preview" className="cb-preview-image" />
    </div>
  );
}

function PreviewButtonsRow({ buttons }) {
  return (
    <div className="cb-preview-message-row cb-preview-message-row--buttons">
      <div className="cb-preview-buttons">
        {buttons.map((button, index) => (
          <span key={`${button.title}-${index}`} className="cb-preview-button-chip">
            {button.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewRow({ row }) {
  if (row.kind === 'image') {
    return <PreviewImageRow content={row.content} />;
  }
  if (row.kind === 'buttons') {
    return <PreviewButtonsRow buttons={row.buttons} />;
  }
  return <PreviewTextRow content={row.content} />;
}

export default function MessagePreviewPanel({ onPreviewVisibleChange }) {
  const { previewItems } = useChatbotEditor();
  const [visible, setVisible] = useState(true);

  const handleToggle = () => {
    const next = !visible;
    setVisible(next);
    onPreviewVisibleChange?.(next);
  };

  return (
    <div className={`cb-preview-section${visible ? '' : ' cb-preview-section--hidden'}`}>
      <div className="ss-layout-preview-toggle-bar">
        <span className="ss-layout-preview-toggle-bar__label">{PREVIEW_LABELS.TITLE}</span>
        <button
          type="button"
          className="ss-layout-preview-toggle-bar__btn"
          onClick={handleToggle}
          aria-pressed={visible}
        >
          {visible ? PREVIEW_LABELS.HIDE : PREVIEW_LABELS.SHOW}
        </button>
      </div>
      <div className={`cb-preview-body${visible ? '' : ' cb-preview-body--hidden'}`}>
        <div className="cb-phone-stage">
          <div className="cb-phone-frame">
            <div className="cb-phone-screen">
              <div className="cb-preview-messages">
                {previewItems.length === 0 && (
                  <div className="cb-empty-state">{PREVIEW_LABELS.EMPTY}</div>
                )}
                {previewItems.map((row, index) => (
                  <PreviewRow
                    key={`${row.messageId}-${row.kind}-${index}`}
                    row={row}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MessagePreviewPanel.propTypes = {
  onPreviewVisibleChange: PropTypes.func,
};

MessagePreviewPanel.defaultProps = {
  onPreviewVisibleChange: undefined,
};
