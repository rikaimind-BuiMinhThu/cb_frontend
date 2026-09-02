import React from 'react';
import ContentPreviewShell from './shared/ContentPreviewShell';
import { PREVIEW_LABELS } from '../constants/scenarioSettingLabels';
import { CONTENT_SETTING_TYPES } from '../constants/contentTypeConstants';
import '../styles/contentPreviews/capture.css';

const CapturePreview = ({ content }) => {
  if (content.type !== CONTENT_SETTING_TYPES.CAPTURE) return null;

  const renderLabel = () => (
    <div className="ss-capture-preview-label">{PREVIEW_LABELS.capture}</div>
  );

  return <ContentPreviewShell>{renderLabel()}</ContentPreviewShell>;
};

export default CapturePreview;
