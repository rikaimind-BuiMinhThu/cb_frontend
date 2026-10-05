import React from 'react';
import { KeywordSettingsProvider } from './context/KeywordSettingsContext';
import KeywordSettingsContent from './KeywordSettingsContent';

function KeywordPage() {
  return (
    <KeywordSettingsProvider>
      <KeywordSettingsContent />
    </KeywordSettingsProvider>
  );
}

export default KeywordPage;
