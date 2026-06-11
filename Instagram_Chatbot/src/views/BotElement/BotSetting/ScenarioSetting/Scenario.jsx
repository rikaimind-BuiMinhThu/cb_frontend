import '../../../../assets/css/bot/scenario/scenario-single.css';
import React from 'react';
import { ScenarioEditorProvider } from './context/ScenarioEditorContext';
import ScenarioEditorContent from './ScenarioEditorContent';

const Scenario = () => (
  <ScenarioEditorProvider>
    <ScenarioEditorContent />
  </ScenarioEditorProvider>
);

export default Scenario;
