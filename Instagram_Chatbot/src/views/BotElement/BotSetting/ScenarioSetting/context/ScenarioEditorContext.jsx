import React, { createContext, useContext } from 'react';
import useScenario from '../hooks/useScenario';
import useScenarioMessages from '../hooks/useScenarioMessages';

const ScenarioEditorContext = createContext(null);

export const ScenarioEditorProvider = ({ children }) => {
  const { state, actions } = useScenario();
  const { dataMessages } = state;
  const { setDataMessages, setDataHour, setDataYear } = actions;

  const messageActions = useScenarioMessages({
    dataMessages,
    setDataMessages,
    setDataHour,
    setDataYear,
  });

  const client = JSON.parse(sessionStorage.getItem('client') || 'null');

  const value = {
    scenario: state,
    state,
    actions,
    messages: messageActions,
    client,
  };

  return (
    <ScenarioEditorContext.Provider value={value}>
      {children}
    </ScenarioEditorContext.Provider>
  );
};

export const useScenarioEditor = () => {
  const context = useContext(ScenarioEditorContext);
  if (!context) {
    throw new Error('useScenarioEditor must be used within ScenarioEditorProvider');
  }
  return context;
};
