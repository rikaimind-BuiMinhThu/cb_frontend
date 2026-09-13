import React from 'react';
import { Select } from 'antd';
import { AdminActionButton } from '../../../../components/AdminShell';
import { useKeywordSettings } from '../context/KeywordSettingsContext';
import {
  ACTION_LABELS,
  FORM_PLACEHOLDERS,
  SECTION_TITLES,
} from '../constants';

function DefaultReplySection() {
  const { defaultReply } = useKeywordSettings();
  const {
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
  } = defaultReply;

  return (
    <section className="keyword-settings-section">
      <h2 className="keyword-settings-section-title">{SECTION_TITLES.DEFAULT_REPLY}</h2>
      <div className="keyword-default-reply-row">
        <div className="keyword-default-reply-selects">
          <Select
            placeholder={FORM_PLACEHOLDERS.SELECT_GROUP}
            value={defaultReplyGroupId || undefined}
            onChange={handleGroupChange}
            loading={loading}
            options={groups.map((group) => ({
              value: group.id,
              label: group.group_name,
            }))}
            allowClear
          />
          <Select
            placeholder={FORM_PLACEHOLDERS.SELECT_BAG}
            value={defaultReplyBagId || undefined}
            onChange={handleBagChange}
            loading={loading}
            disabled={!defaultReplyGroupId}
            options={defaultReplyBags.map((bag) => ({
              value: bag.id,
              label: bag.bag_name,
            }))}
            allowClear
            status={bagError ? 'error' : undefined}
          />
        </div>
        <AdminActionButton
          action="save"
          label={ACTION_LABELS.SAVE}
          loading={saving}
          onClick={saveDefaultReply}
        />
      </div>
      {bagError && (
        <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 8 }}>{bagError}</div>
      )}
    </section>
  );
}

export default DefaultReplySection;
