import React, { createContext, useContext } from 'react';
import useScenario from '../hooks/useScenario';
import useScenarioMessages from '../hooks/useScenarioMessages';
import { useScenarioMessageActions } from '../hooks/useScenarioMessageActions';
import { useScenarioRenderers } from '../hooks/useScenarioRenderers';

const ScenarioEditorContext = createContext(null);

export const ScenarioEditorProvider = ({ children }) => {
  const { state, actions } = useScenario();
  const { dataMessages } = state;
  const { setDataMessages, setDataHour, setDataYear } = actions;

  const baseMessageActions = useScenarioMessages({
    dataMessages,
    setDataMessages,
    setDataHour,
    setDataYear,
  });

  const messageActions = useScenarioMessageActions({
    state,
    actions,
    messages: baseMessageActions,
  });

  const messages = {
    ...baseMessageActions,
    ...messageActions,
  };

  const renderers = useScenarioRenderers({ state, actions, messages });

  const client = JSON.parse(sessionStorage.getItem('client') || 'null');

  const value = {
    scenario: state,
    state,
    actions,
    messages,
    renderers,
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
