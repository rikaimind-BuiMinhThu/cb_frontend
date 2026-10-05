import { useCallback, useEffect, useState } from 'react';
import { message as antMessage } from 'antd';
import { fetchMessageBag, reorderMessages } from '../api/messageManagementApi';
import { TOAST_MESSAGES } from '../constants';

export default function useMessages(selectedBagId) {
  const [messages, setMessages] = useState([]);
  const [bagMeta, setBagMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const loadMessages = useCallback(async (bagId = selectedBagId) => {
    if (!bagId) {
      setMessages([]);
      setBagMeta(null);
      setSelectedMessageId(null);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMessageBag(bagId);
      setBagMeta(data.message_bag);
      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
      setMessages([]);
      setBagMeta(null);
    } finally {
      setLoading(false);
    }
  }, [selectedBagId]);

  useEffect(() => {
    loadMessages(selectedBagId);
  }, [selectedBagId, loadMessages]);

  useEffect(() => {
    if (selectedMessageId && !messages.some((msg) => msg.id === selectedMessageId)) {
      setSelectedMessageId(null);
    }
  }, [messages, selectedMessageId]);

  const moveMessage = useCallback(async (dragId, dropId) => {
    const ids = messages.map((m) => m.id);
    const dragIndex = ids.indexOf(dragId);
    const dropIndex = ids.indexOf(dropId);
    if (dragIndex < 0 || dropIndex < 0) return;

    const next = [...ids];
    next[dragIndex] = dropId;
    next[dropIndex] = dragId;

    await reorderMessages(dragId, next);
    antMessage.success(TOAST_MESSAGES.MESSAGE_MOVED);
    await loadMessages();
  }, [messages, loadMessages]);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || null;

  return {
    messages,
    bagMeta,
    loading,
    selectedMessageId,
    setSelectedMessageId,
    selectedMessage,
    loadMessages,
    moveMessage,
  };
}
