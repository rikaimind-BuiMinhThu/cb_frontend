import React from 'react';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';
import ScenarioFormRow from './shared/ScenarioFormRow';
import ScenarioModalFooter from './shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from './shared/scenarioModalTooltips';

const AddVariableModalContent = ({ onClose, onSave, saving = false }) => {
  const { state, actions } = useScenarioEditor();
  const { errorVariable, variableName, defaultValue } = state;
  const { setErrorVariable, setVariableName, setDefaultValue } = actions;

  return (
    <div>
      <ScenarioFormRow
        label="変数名"
        tooltip={SCENARIO_MODAL_TOOLTIPS.variableName}
        required
        error={errorVariable}
        htmlFor="scenario-variable-name"
      >
        <input
          id="scenario-variable-name"
          type="text"
          className="ss-input-value ss-user-setting-item"
          value={variableName}
          onChange={(e) => {
            setErrorVariable('');
            setVariableName(e.target.value);
          }}
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="デフォルト名"
        tooltip={SCENARIO_MODAL_TOOLTIPS.variableDefault}
      >
        <input
          type="text"
          className="ss-input-value ss-user-setting-item"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={onClose}
        onConfirm={onSave}
        confirmDisabled={saving}
      />
    </div>
  );
};

export default AddVariableModalContent;
