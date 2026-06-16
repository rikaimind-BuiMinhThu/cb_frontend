import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import { useScenarioEditor } from '../context/ScenarioEditorContext';

const ScenarioOverviewPanel = () => {
  const { state, actions } = useScenarioEditor();
  const {
    scenarioName,
    scenarioType,
    errorScenarioName,
  } = state;
  const {
    setScenarioName,
    setScenarioType,
    setIsOpenScenarioSettingsModal,
  } = actions;

  return (
    <div className="ss-layout-overview-panel">
      <section className="ss-layout-form-section ss-layout-basic-settings">
        <h3 className="ss-layout-form-section__title">基本設定</h3>
        <div className="ss-layout-basic-settings-row">
          <div className="ss-layout-basic-settings-name">
            <InputCustom
              value={scenarioName}
              onChange={value => setScenarioName(value)}
              placeholder="シナリオ名入力"
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
        </div>
        {errorScenarioName && (
          <span style={{ fontSize: '12px', color: '#FF621D' }}>{errorScenarioName}</span>
        )}
        <div className="ss-layout-basic-settings-actions">
          <button
            type="button"
            className="ss-layout-settings-open-btn"
            onClick={() => setIsOpenScenarioSettingsModal(true)}
          >
            シナリオ設定
          </button>
        </div>
      </section>
    </div>
  );
};

export default ScenarioOverviewPanel;
