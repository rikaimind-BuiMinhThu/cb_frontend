import { useCallback, useEffect, useState } from 'react';
import { message as antMessage } from 'antd';
import {
  copyMessageGroup,
  createHotTemplate,
  deleteHotTemplate,
  fetchHotTemplates,
  updateHotTemplate,
} from '../api/messageManagementApi';
import { TOAST_MESSAGES } from '../constants';

export default function useHotTemplates(loadGroups) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHotTemplates();
      setTemplates(data);
    } catch (error) {
      console.error(error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const saveTemplate = useCallback(async ({ title, description, messageGroupId }) => {
    await createHotTemplate({
      hot_template: { title, description, message_group_id: messageGroupId },
    });
    antMessage.success(TOAST_MESSAGES.TEMPLATE_SAVED);
    await loadTemplates();
  }, [loadTemplates]);

  const editTemplate = useCallback(async (id, { title, description, messageGroupId }) => {
    await updateHotTemplate(id, {
      hot_template: { title, description, message_group_id: messageGroupId },
    });
    antMessage.success(TOAST_MESSAGES.TEMPLATE_UPDATED);
    await loadTemplates();
  }, [loadTemplates]);

  const removeTemplate = useCallback(async (id) => {
    await deleteHotTemplate(id);
    antMessage.success(TOAST_MESSAGES.TEMPLATE_DELETED);
    await loadTemplates();
  }, [loadTemplates]);

  const applyTemplate = useCallback(async (messageGroupId) => {
    await copyMessageGroup(messageGroupId);
    antMessage.success(TOAST_MESSAGES.TEMPLATE_APPLIED);
    await loadGroups?.();
  }, [loadGroups]);

  return {
    templates,
    loading,
    loadTemplates,
    saveTemplate,
    editTemplate,
    removeTemplate,
    applyTemplate,
  };
}
