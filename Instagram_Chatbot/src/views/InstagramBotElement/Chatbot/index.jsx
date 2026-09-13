import React from 'react';
import { ChatbotEditorProvider } from './context/ChatbotEditorContext';
import ChatbotEditorContent from './ChatbotEditorContent';

function ChatbotPage() {
  return (
    <ChatbotEditorProvider>
      <ChatbotEditorContent />
    </ChatbotEditorProvider>
  );
}

export default ChatbotPage;
