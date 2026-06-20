import React, { useEffect, useState } from 'react';
import { Button, Select, Space } from 'antd';
import { useReleaseEditor } from '../context/ReleaseEditorContext';
import { REPLY_MODES } from '../constants';
import MessageBagPicker from './MessageBagPicker';
import SectionCard from './SectionCard';

export default function CommentReplySection({ sectionKey, sectionConfig }) {
  const { connect, settings, keywords, notify } = useReleaseEditor();
  const initial = settings.sectionState(sectionConfig);
  const [enabled, setEnabled] = useState(initial.enabled);
  const [replyMode, setReplyMode] = useState(initial.replyMode);
  const [groupId, setGroupId] = useState(initial.groupId);
  const [bagId, setBagId] = useState(initial.bagId);
  const [keywordId, setKeywordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const disabled = !connect.isConnected;

  useEffect(() => {
    const next = settings.sectionState(sectionConfig);
    setEnabled(next.enabled);
    setReplyMode(next.replyMode);
    setGroupId(next.groupId);
    setBagId(next.bagId);
  }, [sectionConfig, settings.setting, settings.sectionState]);

  const sectionKeywords = keywords.keywordsForSection(sectionConfig.keywordFlag);

  const handleToggle = async (checked) => {
    setEnabled(checked);
    try {
      await settings.saveStatus({
        [sectionConfig.statusField]: checked ? replyMode : 'off',
      });
    } catch (error) {
      setEnabled(!checked);
      notify(error.message, 'error');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (replyMode === 'direct_message') {
        if (!bagId) {
          notify('メッセージバッグを選択してください。', 'error');
          return;
        }
        await settings.saveBagAssignment({ [sectionConfig.bagField]: bagId });
        if (enabled) {
          await settings.saveStatus({ [sectionConfig.statusField]: 'direct_message' });
        }
      } else if (keywordId) {
        await keywords.activateKeywordForSection(keywordId, sectionConfig);
        if (enabled) {
          await settings.saveStatus({ [sectionConfig.statusField]: 'keyword' });
        }
      } else {
        notify('キーワードを選択してください。', 'error');
        return;
      }
      notify(sectionConfig.savedMessage);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      title={sectionConfig.title}
      enabled={enabled}
      onToggle={handleToggle}
      disabled={disabled}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Select
          style={{ minWidth: 220 }}
          value={replyMode}
          disabled={disabled}
          onChange={setReplyMode}
          options={REPLY_MODES}
        />

        {replyMode === 'direct_message' ? (
          <MessageBagPicker
            groups={settings.groups}
            groupId={groupId}
            bagId={bagId}
            disabled={disabled}
            onGroupChange={(nextGroupId) => {
              setGroupId(nextGroupId);
              setBagId(null);
            }}
            onBagChange={setBagId}
          />
        ) : (
          <Select
            style={{ minWidth: 220 }}
            placeholder="キーワード選択..."
            value={keywordId || undefined}
            disabled={disabled}
            onChange={setKeywordId}
            options={sectionKeywords.map((keyword) => ({
              value: keyword.id,
              label: keyword.title,
            }))}
          />
        )}

        <Button type="primary" loading={saving} disabled={disabled} onClick={handleSave}>
          保存
        </Button>
      </Space>
    </SectionCard>
  );
}
