import React from 'react';
import ContentPreviewShell from './shared/ContentPreviewShell';
import '../styles/contentPreviews/label.css';

const LabelPreview = ({ label }) => {
  if (!label?.lbl_content) return null;

  const renderRequired = () => {
    if (label?.require !== true) return null;
    return (
      <span className="ss-message__content--user-required">
        ※必須
      </span>
    );
  };

  return (
    <ContentPreviewShell className="ss-label-preview">
      <div className="ss-message__content--user-label-top">
        <span className="ss-message__content--user-label-title">
          {label.lbl_content}
        </span>
        {renderRequired()}
      </div>
    </ContentPreviewShell>
  );
};

export default LabelPreview;
