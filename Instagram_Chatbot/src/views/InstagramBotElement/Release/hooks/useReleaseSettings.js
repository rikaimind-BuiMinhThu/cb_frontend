import { useCallback, useEffect, useState } from 'react';
import {
  changeInstagramSettingStatus,
  fetchInstagramSettings,
  fetchMessageGroups,
  updateInstagramSetting,
} from '../api/releaseApi';

function resolveGroupAndBag(setting, groups, bagField, groupIdField, groupNameField) {
  const bagId = setting?.[bagField] || null;
  const groupId = bagId
    ? (setting?.[groupIdField] || groups[0]?.id || null)
    : (setting?.[groupIdField] || null);
  const groupName = bagId
    ? (setting?.[groupNameField] || groups[0]?.group_name || '')
    : (setting?.[groupNameField] || '');

  return { bagId, groupId, groupName };
}

export default function useReleaseSettings() {
  const [setting, setSetting] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveBagAssignment = useCallback(async (bagFields) => {
    if (!setting?.id) return null;
    const resolveBagId = (field) => (
      Object.prototype.hasOwnProperty.call(bagFields, field)
        ? bagFields[field]
        : setting[field]
    );
    const payload = {
      instagram_setting: {
        post_comment_bag_id: resolveBagId('post_comment_bag_id'),
        story_comment_bag_id: resolveBagId('story_comment_bag_id'),
        live_comment_bag_id: resolveBagId('live_comment_bag_id'),
        default_reply_bag_id: setting.default_reply_bag_id,
      },
    };
    await updateInstagramSetting(setting.id, payload);
    await load({ silent: true });
  }, [load, setting]);

  const saveStatus = useCallback(async (statusFields) => {
    if (!setting?.id) return null;
    const payload = { instagram_setting: statusFields };
    await changeInstagramSettingStatus(setting.id, payload);
    await load({ silent: true });
  }, [load, setting]);

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
