import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ERR_MSG_MODES = {
  JS: 'js',
  SELECTOR: 'selector',
};

const ScenarioErrMsgView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const {
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
  } = state;
  const {
    setErrMsgJsCode,
    setErrMsgSettingMode,
    setErrMsgFieldSelectors,
    setErrMsgFormSelectors,
  } = actions;

  const isJsMode = errMsgSettingMode !== ERR_MSG_MODES.SELECTOR;

  return (
    <div className="ss-settings-err-msg-view">
      <div className="ss-settings-radio-group">
        <label className="ss-settings-radio-option">
          <input
            type="radio"
            name="errMsgSettingMode"
            checked={isJsMode}
            onChange={() => setErrMsgSettingMode(ERR_MSG_MODES.JS)}
          />
          JSコードで設定
        </label>
        {isJsMode && (
          <ScenarioFormRow
            label="JSコード"
            tooltip={SCENARIO_MODAL_TOOLTIPS.errMsgJsCode}
            alignTop
          >
            <textarea
              className="ss-settings-textarea"
              style={{ height: '150px' }}
              placeholder="ここにJSコードを入力してください"
              value={errMsgJsCode}
              onChange={(e) => setErrMsgJsCode(e.target.value)}
            />
          </ScenarioFormRow>
        )}

        <label className="ss-settings-radio-option">
          <input
            type="radio"
            name="errMsgSettingMode"
            checked={!isJsMode}
            onChange={() => setErrMsgSettingMode(ERR_MSG_MODES.SELECTOR)}
          />
          セレクターで設定
        </label>
        {!isJsMode && (
          <>
            <ScenarioFormRow
              label="フィールドエラーセレクター"
              tooltip={SCENARIO_MODAL_TOOLTIPS.errMsgFieldSelectors}
            >
              <input
                type="text"
                className="ss-input-value ss-user-setting-item"
                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                placeholder="例: .formErrorContent, .field-error"
                value={errMsgFieldSelectors}
                onChange={(e) => setErrMsgFieldSelectors(e.target.value)}
              />
            </ScenarioFormRow>
            <ScenarioFormRow
              label="フォームエラーセレクター"
              tooltip={SCENARIO_MODAL_TOOLTIPS.errMsgFormSelectors}
            >
              <input
                type="text"
                className="ss-input-value ss-user-setting-item"
                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                placeholder="例: #alert-box, .form-errors"
                value={errMsgFormSelectors}
                onChange={(e) => setErrMsgFormSelectors(e.target.value)}
              />
            </ScenarioFormRow>
          </>
        )}
      </div>

      <ScenarioModalFooter
        onClose={onBack}
        onConfirm={onBack}
      />
    </div>
  );
};

export default ScenarioErrMsgView;
