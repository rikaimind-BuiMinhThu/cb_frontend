import React from 'react';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const PullDownPreviewHeader = ({ pullDown }) => {
  if (!pullDown.title_require && !pullDown.require) {
    return null;
  }

  return (
    <div className="ss-message__content--user-pull_down-top ss-pull-down-preview__header">
      {pullDown.title_require && (
        <span className="ss-message__content--user-pull_down-title">
          {pullDown.title}
        </span>
      )}
      {pullDown.require === true && (
        <span className="ss-message__content--user-text-input-required">
          {PULL_DOWN_LABELS.requiredMark}
        </span>
      )}
    </div>
  );
};

export default PullDownPreviewHeader;
