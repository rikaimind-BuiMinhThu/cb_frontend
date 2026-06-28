import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../scenarioComon/InputCustom';
import { useScenarioEditor } from '../context/ScenarioEditorContext';

const ScenarioOverviewPanel = ({ onOpenPreview }) => {
  const { state, actions } = useScenarioEditor();
  const {
    scenarioName,
    scenarioType,
    errorScenarioName,
    editorMode,
  } = state;
  const isTemplateMode = editorMode === 'template';
  const {
    setScenarioName,
    setScenarioType,
    openScenarioSettingsModal,
  } = actions;

  return (
    <div className="ss-layout-overview-panel">
      <section className="ss-layout-form-section ss-layout-basic-settings">
        <div className="ss-layout-preview-toggle-bar ss-layout-basic-settings-header">
          <h3 className="ss-layout-form-section__title ss-layout-basic-settings-header__title">
            基本設定
          </h3>
          {onOpenPreview && (
            <button
              type="button"
              className="ss-layout-preview-toggle-bar__btn"
              onClick={onOpenPreview}
            >
              プレビューを開く
            </button>
          )}
        </div>
        <div className="ss-layout-basic-settings-row">
          <div className="ss-layout-basic-settings-name">
            <InputCustom
              value={scenarioName}
              onChange={value => setScenarioName(value)}
              placeholder={isTemplateMode ? 'テンプレート名入力' : 'シナリオ名入力'}
            />
          </div>
          <div className="ss-layout-basic-settings-type">
            <select
              className="ss-input-value ss-layout-scenario-type"
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              aria-label="シナリオタイプ"
            >
              <option value="payment">Payment</option>
              <option value="faq">FAQ</option>
            </select>
          </div>
          <div className="ss-layout-basic-settings-action">
            <button
              type="button"
              className="ss-layout-settings-open-btn"
              onClick={openScenarioSettingsModal}
            >
              {isTemplateMode ? 'テンプレート設定' : 'シナリオ設定'}
            </button>
          </div>
        </div>
        {errorScenarioName && (
          <span style={{ fontSize: '12px', color: '#FF621D' }}>{errorScenarioName}</span>
        )}
      </section>
    </div>
  );
};

ScenarioOverviewPanel.propTypes = {
  onOpenPreview: PropTypes.func,
};

ScenarioOverviewPanel.defaultProps = {
  onOpenPreview: undefined,
};

export default ScenarioOverviewPanel;
