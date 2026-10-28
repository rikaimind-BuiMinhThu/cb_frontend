import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioCodeTextarea from '../shared/ScenarioCodeTextarea';
import { SCENARIO_MODAL_TOOLTIPS, CSS_TEXTAREA_HEIGHT } from '../shared/scenarioModalTooltips';

const ScenarioThanksMessageView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { thanksMessageHtml } = state;
  const { setThanksMessageHtml } = actions;

  const handleOnCancelThanksMessage = () => {
    setThanksMessageHtml((prevState) => ({
      ...prevState,
      temp: prevState.final,
    }));
    onBack();
  };

  const handleOnConfirmThanksMessage = () => {
    setThanksMessageHtml((prevState) => ({
      ...prevState,
      final: prevState.temp,
    }));
    onBack();
  };

  return (
    <div>
      <ScenarioFormRow
        label="サンクスメッセージ HTML"
        tooltip={SCENARIO_MODAL_TOOLTIPS.thanksMessageHtml}
        alignTop
      >
        <ScenarioCodeTextarea
          placeholder="ここにサンクスメッセージのHTMLを入力してください"
          value={thanksMessageHtml.temp}
          onChange={(value) => setThanksMessageHtml((prevState) => ({
            ...prevState,
            temp: value,
          }))}
          language="html"
          height={CSS_TEXTAREA_HEIGHT}
          resizable
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={handleOnCancelThanksMessage}
        onConfirm={handleOnConfirmThanksMessage}
      />
    </div>
  );
};

export default ScenarioThanksMessageView;
