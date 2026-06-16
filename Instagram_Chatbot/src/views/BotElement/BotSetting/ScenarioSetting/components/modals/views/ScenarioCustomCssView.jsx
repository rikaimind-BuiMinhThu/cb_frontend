import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ScenarioCustomCssView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { customCssContent } = state;
  const { setCustomCssContent } = actions;

  const handleOnChangeValueCustomCss = (e) => {
    e.preventDefault();
    setCustomCssContent((prevState) => ({
      ...prevState,
      temp: e.target.value,
    }));
  };

  const handleOnCancelCustomCss = () => {
    setCustomCssContent((prevState) => ({
      ...prevState,
      temp: prevState.final,
    }));
    onBack();
  };

  const handleOnConfirmCustomCss = () => {
    setCustomCssContent((prevState) => ({
      ...prevState,
      final: prevState.temp,
    }));
    onBack();
  };

  return (
    <div>
      <ScenarioFormRow
        label="CSSコンテンツ"
        tooltip={SCENARIO_MODAL_TOOLTIPS.cssContent}
        alignTop
      >
        <textarea
          className="ss-settings-textarea"
          style={{ height: '150px' }}
          placeholder="ここにカスタムCSSコンテンツを入力してください"
          value={customCssContent.temp}
          onChange={handleOnChangeValueCustomCss}
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={handleOnCancelCustomCss}
        onConfirm={handleOnConfirmCustomCss}
      />
    </div>
  );
};

export default ScenarioCustomCssView;
