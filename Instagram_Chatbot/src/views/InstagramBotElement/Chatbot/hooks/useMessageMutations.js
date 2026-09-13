import { useCallback } from 'react';
import { message as antMessage } from 'antd';
import {
  createMessage,
  deleteMessage,
  updateMessage,
} from '../api/messageManagementApi';
import { TOAST_MESSAGES } from '../constants';
import { buildCreatePayload, buildUpdatePayload } from '../utils/buildMessagePayload';

export default function useMessageMutations({ selectedBagId, loadMessages, markDraftComplete }) {
  const saveDraft = useCallback(async (draft) => {
    if (!selectedBagId) return false;
    const payload = buildCreatePayload(selectedBagId, draft);
    await createMessage(payload);
    antMessage.success(TOAST_MESSAGES.MESSAGE_ADDED);
    markDraftComplete();
    await loadMessages();
    return true;
  }, [selectedBagId, loadMessages, markDraftComplete]);

  const updateExisting = useCallback(async (message, draft) => {
    const payload = buildUpdatePayload(message, draft);
    await updateMessage(message.id, payload);
    antMessage.success(TOAST_MESSAGES.MESSAGE_UPDATED);
    await loadMessages();
    return true;
  }, [loadMessages]);

  const removeMessage = useCallback(async (messageId) => {
    await deleteMessage(messageId);
    antMessage.success(TOAST_MESSAGES.MESSAGE_DELETED);
    await loadMessages();
  }, [loadMessages]);

  return {
    saveDraft,
    updateExisting,
    removeMessage,
  };
}
