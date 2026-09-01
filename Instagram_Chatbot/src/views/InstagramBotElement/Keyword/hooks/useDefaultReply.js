import { useCallback, useEffect, useState } from 'react';
import { message as antMessage } from 'antd';
import { fetchMessageGroup, fetchMessageGroups } from '../../Chatbot/api/messageManagementApi';
import {
  fetchInstagramSettings,
  updateDefaultReply,
} from '../api/keywordSettingsApi';
import { TOAST_MESSAGES } from '../constants';

export default function useDefaultReply() {
  const [instagramSetting, setInstagramSetting] = useState(null);
  const [groups, setGroups] = useState([]);
  const [defaultReplyGroupId, setDefaultReplyGroupId] = useState(null);
  const [defaultReplyBagId, setDefaultReplyBagId] = useState(null);
  const [defaultReplyBags, setDefaultReplyBags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bagError, setBagError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [settings, groupResult] = await Promise.all([
          fetchInstagramSettings(),
          fetchMessageGroups(1),
        ]);
        if (cancelled) return;

        setInstagramSetting(settings);
        setGroups(groupResult.data);
        setDefaultReplyGroupId(settings?.default_reply_group_id ?? null);
        setDefaultReplyBagId(settings?.default_reply_bag_id ?? null);

        if (settings?.default_reply_group_id) {
          const groupData = await fetchMessageGroup(settings.default_reply_group_id);
          if (!cancelled) {
            setDefaultReplyBags(groupData.message_bags || []);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGroupChange = useCallback(async (groupId) => {
    setDefaultReplyGroupId(groupId ?? null);
    setDefaultReplyBagId(null);
    setBagError('');
    if (!groupId) {
      setDefaultReplyBags([]);
      return;
    }
    try {
      const groupData = await fetchMessageGroup(groupId);
      setDefaultReplyBags(groupData.message_bags || []);
    } catch (error) {
      console.error(error);
      setDefaultReplyBags([]);
    }
  }, []);

  const handleBagChange = useCallback((bagId) => {
    setDefaultReplyBagId(bagId ?? null);
    setBagError('');
  }, []);

  const saveDefaultReply = useCallback(async () => {
    if (!instagramSetting?.id) {
      return false;
    }

    setSaving(true);
    try {
      await updateDefaultReply(
        instagramSetting.id,
        instagramSetting,
        defaultReplyBagId
      );
      antMessage.success(TOAST_MESSAGES.DEFAULT_REPLY_SAVED);
      setBagError('');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [defaultReplyBagId, instagramSetting]);

  return {
    instagramSetting,
    groups,
    defaultReplyGroupId,
    defaultReplyBagId,
    defaultReplyBags,
    loading,
    saving,
    bagError,
    handleGroupChange,
    handleBagChange,
    saveDefaultReply,
  };
}
