import React from 'react';
import { useScenarioOverviewBindings } from '../hooks/useScenarioOverviewBindings';
import OverviewEmptyState from './overview/OverviewEmptyState';
import OverviewMessageList from './overview/OverviewMessageList';

const ScenarioMessageOverviewList = () => {
  const bindings = useScenarioOverviewBindings();

  return (
    <>
      <OverviewEmptyState
        dataMessages={bindings.dataMessages}
        onCreateStatement={bindings.onClickCreateStatement}
      />
      <OverviewMessageList {...bindings} />
    </>
  );
};

export default ScenarioMessageOverviewList;
