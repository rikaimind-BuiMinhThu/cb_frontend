import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ScenarioCustomJsView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { headCustomJsCode, topBodyCustomJsCode, bottomBodyCustomJsCode } = state;
  const { setHeadCustomJsCode, setTopBodyCustomJsCode, setBottomBodyCustomJsCode } = actions;

  const handleOnChangeValueCustomJsCode = (fieldType) => (e) => {
    e.preventDefault();
    const value = e.target.value;

    if (fieldType === 'head') {
      setHeadCustomJsCode((prevState) => ({ ...prevState, temp: value }));
    } else if (fieldType === 'top_body') {
      setTopBodyCustomJsCode((prevState) => ({ ...prevState, temp: value }));
    } else if (fieldType === 'bottom_body') {
      setBottomBodyCustomJsCode((prevState) => ({ ...prevState, temp: value }));
    }
  };

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
        <textarea
          className="ss-settings-textarea"
          placeholder="ここにヘッド内のJSコードを入力してください"
          value={headCustomJsCode.temp}
          onChange={handleOnChangeValueCustomJsCode('head')}
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="上部の本文JS"
        tooltip={SCENARIO_MODAL_TOOLTIPS.topBodyJsContent}
        alignTop
      >
        <textarea
          className="ss-settings-textarea"
          placeholder="ここに上部の本文のJSコードを入力してください"
          value={topBodyCustomJsCode.temp}
          onChange={handleOnChangeValueCustomJsCode('top_body')}
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="下部の本文JS"
        tooltip={SCENARIO_MODAL_TOOLTIPS.bottomBodyJsContent}
        alignTop
      >
        <textarea
          className="ss-settings-textarea"
          placeholder="ここに下部の本文のJSコードを入力してください"
          value={bottomBodyCustomJsCode.temp}
          onChange={handleOnChangeValueCustomJsCode('bottom_body')}
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
