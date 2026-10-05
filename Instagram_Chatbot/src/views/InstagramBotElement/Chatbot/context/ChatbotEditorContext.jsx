import React, { createContext, useContext, useMemo } from 'react';
import Cookies from 'js-cookie';
import { ensureInstagramSettings } from '../api/messageManagementApi';
import useMessageGroups from '../hooks/useMessageGroups';
import useMessageBags from '../hooks/useMessageBags';
import useMessages from '../hooks/useMessages';
import useMessageDrafts from '../hooks/useMessageDrafts';
import useMessageMutations from '../hooks/useMessageMutations';
import useHotTemplates from '../hooks/useHotTemplates';
import useChatbotModals from '../hooks/useChatbotModals';
import { buildPreviewItems, messageFromApiToDraft } from '../utils/previewBuilder';

const ChatbotEditorContext = createContext(null);

export function ChatbotEditorProvider({ children }) {
  const userRole = Cookies.get('user_role');
  const isAdminDeel = userRole === 'admin_deel';

  const groups = useMessageGroups();
  const bags = useMessageBags(groups.selectedGroupId);
  const messages = useMessages(bags.selectedBagId);
  const drafts = useMessageDrafts();
  const modals = useChatbotModals();

  const mutations = useMessageMutations({
    selectedBagId: bags.selectedBagId,
    loadMessages: messages.loadMessages,
    markDraftComplete: drafts.markDraftComplete,
  });

  const hotTemplates = useHotTemplates(groups.loadGroups);

  React.useEffect(() => {
    ensureInstagramSettings().catch(console.error);
  }, []);

  const previewItems = useMemo(
    () => buildPreviewItems(messages.messages, drafts.hasActiveDraft ? drafts.draft : null),
    [messages.messages, drafts.draft, drafts.hasActiveDraft]
  );

  const selectGroup = (groupId) => {
    groups.setSelectedGroupId(groupId);
    bags.setSelectedBagId(null);
    drafts.clearDraft();
    messages.setSelectedMessageId(null);
  };

  const selectBag = (bagId) => {
    bags.setSelectedBagId(bagId);
    drafts.clearDraft();
    messages.setSelectedMessageId(null);
  };

  const selectMessage = (message) => {
    messages.setSelectedMessageId(message.id);
    drafts.loadDraftFromMessage(messageFromApiToDraft(message));
  };

  const value = useMemo(
    () => ({
      userRole,
      isAdminDeel,
      groups,
      bags,
      messages,
      drafts,
      mutations,
      hotTemplates,
      modals,
      previewItems,
      selectGroup,
      selectBag,
      selectMessage,
    }),
    [
      userRole,
      isAdminDeel,
      groups,
      bags,
      messages,
      drafts,
      mutations,
      hotTemplates,
      modals,
      previewItems,
    ]
  );

  return (
    <ChatbotEditorContext.Provider value={value}>
      {children}
    </ChatbotEditorContext.Provider>
  );
}

export function useChatbotEditor() {
  const context = useContext(ChatbotEditorContext);
  if (!context) {
    throw new Error('useChatbotEditor must be used within ChatbotEditorProvider');
  }
  return context;
}
