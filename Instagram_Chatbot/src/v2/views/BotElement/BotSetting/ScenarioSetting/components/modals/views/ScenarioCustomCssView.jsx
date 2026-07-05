import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioCodeTextarea from '../shared/ScenarioCodeTextarea';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ScenarioCustomCssView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { customCssContent } = state;
  const { setCustomCssContent } = actions;

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
        <ScenarioCodeTextarea
          placeholder="ここにカスタムCSSコンテンツを入力してください"
          value={customCssContent.temp}
          onChange={(value) => setCustomCssContent((prevState) => ({
            ...prevState,
            temp: value,
          }))}
          language="css"
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
