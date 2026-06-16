import React from 'react';
import { Button } from 'reactstrap';
import { useScenarioEditor } from '../context/ScenarioEditorContext';

const ScenarioActionsBar = () => {
  const { actions } = useScenarioEditor();
  const { onClickSaveScenario } = actions;

  return (
    <div className="ss-actions">
      <Button onClick={() => onClickSaveScenario()}>保存</Button>
    </div>
  );
};

export default ScenarioActionsBar;
