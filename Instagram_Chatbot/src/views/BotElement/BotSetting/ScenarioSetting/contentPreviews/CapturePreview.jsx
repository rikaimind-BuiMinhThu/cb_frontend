import React from 'react';
import ContentPreviewShell from './shared/ContentPreviewShell';
import '../styles/contentPreviews/capture.css';

const CapturePreview = ({ content }) => {
  if (content.type !== 'capture') return null;

  const renderLabel = () => (
    <div className="ss-capture-preview-label">キャプチャ</div>
  );

  return <ContentPreviewShell>{renderLabel()}</ContentPreviewShell>;
};

export default CapturePreview;
