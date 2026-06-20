import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  EMPTY_STATES,
  PREVIEW_LABELS,
} from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

function PreviewBubble({ item }) {
  if (item.kind === 'image') {
    return (
      <div className="cb-preview-bubble">
        {item.content && <img src={item.content} alt="preview" />}
      </div>
    );
  }

  if (item.kind === 'image-text') {
    return (
      <div className="cb-preview-bubble">
        {item.image && <img src={item.image} alt="preview" />}
        {item.text && <div>{item.text}</div>}
      </div>
    );
  }

  return <div className="cb-preview-bubble">{item.content}</div>;
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
                {previewItems.map((item, index) => (
                  <PreviewBubble key={`${item.kind}-${index}`} item={item} />
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
