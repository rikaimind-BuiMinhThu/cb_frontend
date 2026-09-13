import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { ScenarioEditorProvider } from './context/ScenarioEditorContext';
import ScenarioEditorContent from './ScenarioEditorContent';
import { getSignInPath } from 'v2/variables/constants';

const ScenarioTemplateEditor = () => {
  useEffect(() => {
    const userRole = Cookies.get('user_role');
    if (!userRole || userRole !== 'admin_deel') {
      window.location.href = getSignInPath();
    }
  }, []);

  return (
    <ScenarioEditorProvider mode="template">
      <ScenarioEditorContent />
    </ScenarioEditorProvider>
  );
};

export default ScenarioTemplateEditor;
