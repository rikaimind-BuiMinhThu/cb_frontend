import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ScenarioEditorPreviewPanel from './ScenarioEditorPreviewPanel';
import '../../../../../assets/css/bot/scenario/scenario-editor-preview.css';

const ScenarioEditorPreviewSection = ({ onPreviewVisibleChange }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const handleToggle = () => {
    const next = !isPreviewVisible;
    setIsPreviewVisible(next);
    onPreviewVisibleChange?.(next);
  };

  return (
    <div
      className={`scenario-editor-preview-section${
        isPreviewVisible ? '' : ' scenario-editor-preview-section--hidden'
      }`}
    >
      <div className="ss-layout-preview-toggle-bar">
        <span className="ss-layout-preview-toggle-bar__label">プレビュー</span>
        <button
          type="button"
          className="ss-layout-preview-toggle-bar__btn"
          onClick={handleToggle}
          aria-pressed={isPreviewVisible}
        >
          {isPreviewVisible ? '非表示' : '表示'}
        </button>
      </div>
      <div
        className={`ss-layout-overview-preview-body${
          isPreviewVisible ? '' : ' ss-layout-overview-preview-body--hidden'
        }`}
      >
        <div className="scenario-editor-phone-stage">
          <div className="scenario-editor-phone-frame">
            <div className="scenario-editor-phone-frame__screen">
              <ScenarioEditorPreviewPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ScenarioEditorPreviewSection.propTypes = {
  onPreviewVisibleChange: PropTypes.func,
};

ScenarioEditorPreviewSection.defaultProps = {
  onPreviewVisibleChange: undefined,
};

export default ScenarioEditorPreviewSection;
