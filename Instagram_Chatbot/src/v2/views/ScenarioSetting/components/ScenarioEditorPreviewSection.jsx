import React from 'react';
import PropTypes from 'prop-types';
import ScenarioEditorPreviewPanel from './ScenarioEditorPreviewPanel';
import 'v2/views/ScenarioSetting/styles/scenario-editor-preview.css';

const ScenarioEditorPreviewSection = ({ onClosePreview }) => {
  return (
    <div className="scenario-editor-preview-section">
      <div className="ss-layout-preview-toggle-bar">
        <span className="ss-layout-preview-toggle-bar__label">プレビュー</span>
        <button
          type="button"
          className="ss-layout-preview-toggle-bar__btn"
          onClick={onClosePreview}
          aria-pressed
        >
          基本設計を開く
        </button>
      </div>
      <div className="ss-layout-overview-preview-body">
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
  onClosePreview: PropTypes.func.isRequired,
};

export default ScenarioEditorPreviewSection;
