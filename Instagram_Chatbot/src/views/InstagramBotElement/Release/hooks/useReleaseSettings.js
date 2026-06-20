import { useCallback, useEffect, useState } from 'react';
import {
  changeInstagramSettingStatus,
  fetchInstagramSettings,
  fetchMessageGroups,
  updateInstagramSetting,
} from '../api/releaseApi';

function resolveGroupAndBag(setting, groups, bagField, groupIdField, groupNameField) {
  const defaultGroup = groups[0];
  const bagId = setting?.[bagField] || null;
  const groupId = setting?.[groupIdField] || defaultGroup?.id || null;
  const groupName = setting?.[groupNameField] || defaultGroup?.group_name || '';

  return { bagId, groupId, groupName };
}

export default function useReleaseSettings() {
  const [setting, setSetting] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsList, groupList] = await Promise.all([
        fetchInstagramSettings(),
        fetchMessageGroups(),
      ]);
      setGroups(groupList);
      setSetting(settingsList[0] || null);
    } catch (error) {
      console.error(error);
      setSetting(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveBagAssignment = useCallback(async (bagFields) => {
    if (!setting?.id) return null;
    const payload = {
      instagram_setting: {
        post_comment_bag_id: bagFields.post_comment_bag_id ?? setting.post_comment_bag_id,
        story_comment_bag_id: bagFields.story_comment_bag_id ?? setting.story_comment_bag_id,
        live_comment_bag_id: bagFields.live_comment_bag_id ?? setting.live_comment_bag_id,
        default_reply_bag_id: setting.default_reply_bag_id,
      },
    };
    const result = await updateInstagramSetting(setting.id, payload);
    setSetting(result.data);
    return result.data;
  }, [setting]);

  const saveStatus = useCallback(async (statusFields) => {
    if (!setting?.id) return null;
    const payload = { instagram_setting: statusFields };
    const result = await changeInstagramSettingStatus(setting.id, payload);
    setSetting(result.data);
    return result.data;
  }, [setting]);

  const sectionState = useCallback((sectionConfig) => {
    if (!setting) return { enabled: false, replyMode: 'off', groupId: null, bagId: null };

    const status = setting[sectionConfig.statusField] || 'off';
    const { bagId, groupId } = resolveGroupAndBag(
      setting,
      groups,
      sectionConfig.bagField,
      sectionConfig.groupIdField,
      sectionConfig.groupNameField
    );

    return {
      enabled: status !== 'off',
      replyMode: status === 'off' ? 'direct_message' : status,
      groupId,
      bagId,
    };
  }, [groups, setting]);

  return {
    setting,
    groups,
    loading,
    load,
    saveBagAssignment,
    saveStatus,
    sectionState,
  };
}
