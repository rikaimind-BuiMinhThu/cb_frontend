import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { ScenarioEditorProvider } from './context/ScenarioEditorContext';
import ScenarioEditorContent from './ScenarioEditorContent';

const ScenarioTemplateEditor = () => {
  useEffect(() => {
    const userRole = Cookies.get('user_role');
    if (!userRole || userRole !== 'admin_deel') {
      window.location.href = '/';
    }
  }, []);

  return (
    <ScenarioEditorProvider mode="template">
      <ScenarioEditorContent />
    </ScenarioEditorProvider>
  );
};

export default ScenarioTemplateEditor;
