import React from 'react';
import { useScenarioEditor } from '../context/ScenarioEditorContext';

const ScenarioMessageOverview = ({ children }) => {
  const { state } = useScenarioEditor();
  const { errorScenarioName } = state;

  return (
    <div style={{ height: `calc(80% - ${errorScenarioName ? '30' : '10'}px)`, backgroundColor: '#f6fbff' }}>
      <div className="ss-overview-detail">
        {children}
      </div>
    </div>
  );
};

export default ScenarioMessageOverview;
