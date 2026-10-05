import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputNum from '../../../scenarioComon/InputNum';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ScenarioGlobalDelayView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { globalDelayTime } = state;
  const { setGlobalDelayTime } = actions;

  return (
    <div className="ss-settings-global-delay-view">
      <div className="modal_timer_config-content">
        <ScenarioFormRow
          label="待ち時間 (秒)"
          tooltip={SCENARIO_MODAL_TOOLTIPS.globalDelayTime}
        >
          <InputNum
            step={0.1}
            min={0}
            max={10}
            placeholder="1.0"
            className="ss-user-setting-input-delay"
            value={globalDelayTime}
            onChange={(value) => setGlobalDelayTime(value)}
          />
        </ScenarioFormRow>
      </div>

      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioGlobalDelayView;
