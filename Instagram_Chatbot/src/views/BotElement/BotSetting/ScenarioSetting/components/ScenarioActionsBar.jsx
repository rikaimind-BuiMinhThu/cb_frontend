import React from 'react';
import { Button } from 'reactstrap';
import { useScenarioEditor } from '../context/ScenarioEditorContext';

const ScenarioActionsBar = () => {
  const { actions } = useScenarioEditor();
  const { onClickSaveScenario, onClickSavePreview } = actions;

  return (
    <div className="ss-actions">
      <Button onClick={() => onClickSaveScenario()}>保存</Button>
      <Button onClick={() => onClickSavePreview()}>保存してプレビュー</Button>
    </div>
  );
};

export default ScenarioActionsBar;
