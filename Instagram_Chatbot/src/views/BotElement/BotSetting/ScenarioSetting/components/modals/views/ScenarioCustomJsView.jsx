import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioCodeTextarea from '../shared/ScenarioCodeTextarea';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ScenarioCustomJsView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { headCustomJsCode, topBodyCustomJsCode, bottomBodyCustomJsCode } = state;
  const { setHeadCustomJsCode, setTopBodyCustomJsCode, setBottomBodyCustomJsCode } = actions;

  const handleOnCancelCustomJsCode = () => {
    setHeadCustomJsCode((prev) => ({ ...prev, temp: prev.final }));
    setTopBodyCustomJsCode((prev) => ({ ...prev, temp: prev.final }));
    setBottomBodyCustomJsCode((prev) => ({ ...prev, temp: prev.final }));
    onBack();
  };

  const handleOnConfirmCustomJsCode = () => {
    setHeadCustomJsCode((prev) => ({ ...prev, final: prev.temp }));
    setTopBodyCustomJsCode((prev) => ({ ...prev, final: prev.temp }));
    setBottomBodyCustomJsCode((prev) => ({ ...prev, final: prev.temp }));
    onBack();
  };

  return (
    <div>
      <ScenarioFormRow
        label="ヘッド内のJS"
        tooltip={SCENARIO_MODAL_TOOLTIPS.headJsContent}
        alignTop
      >
        <ScenarioCodeTextarea
          placeholder="ここにヘッド内のJSコードを入力してください"
          value={headCustomJsCode.temp}
          onChange={(value) => setHeadCustomJsCode((prevState) => ({ ...prevState, temp: value }))}
          language="javascript"
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="上部の本文JS"
        tooltip={SCENARIO_MODAL_TOOLTIPS.topBodyJsContent}
        alignTop
      >
        <ScenarioCodeTextarea
          placeholder="ここに上部の本文のJSコードを入力してください"
          value={topBodyCustomJsCode.temp}
          onChange={(value) => setTopBodyCustomJsCode((prevState) => ({ ...prevState, temp: value }))}
          language="javascript"
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="下部の本文JS"
        tooltip={SCENARIO_MODAL_TOOLTIPS.bottomBodyJsContent}
        alignTop
      >
        <ScenarioCodeTextarea
          placeholder="ここに下部の本文のJSコードを入力してください"
          value={bottomBodyCustomJsCode.temp}
          onChange={(value) => setBottomBodyCustomJsCode((prevState) => ({ ...prevState, temp: value }))}
          language="javascript"
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={handleOnCancelCustomJsCode}
        onConfirm={handleOnConfirmCustomJsCode}
      />
    </div>
  );
};

export default ScenarioCustomJsView;
