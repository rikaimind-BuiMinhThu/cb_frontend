import React from 'react';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';
import ScenarioFormRow from './shared/ScenarioFormRow';
import ScenarioModalFooter from './shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from './shared/scenarioModalTooltips';

const AddVariableModalContent = ({ onClose, onSave }) => {
  const { state, actions } = useScenarioEditor();
  const { errorVariable } = state;
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
          style={{ width: '100%', padding: '8px', fontSize: '14px', boxSizing: 'border-box' }}
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
          style={{ width: '100%', padding: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          onChange={(e) => setDefaultValue(e.target.value)}
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={onClose}
        onConfirm={onSave}
      />
    </div>
  );
};

export default AddVariableModalContent;
