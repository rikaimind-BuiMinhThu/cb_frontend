import React, { useEffect, useState } from 'react';
import { Select, Space } from 'antd';
import { fetchMessageGroup } from '../api/releaseApi';

export default function MessageBagPicker({
  groups,
  groupId,
  bagId,
  onGroupChange,
  onBagChange,
  disabled = false,
}) {
  const [bags, setBags] = useState([]);
  const [loadingBags, setLoadingBags] = useState(false);

  useEffect(() => {
    if (!groupId) {
      setBags([]);
      return;
    }

    setLoadingBags(true);
    fetchMessageGroup(groupId)
      .then((data) => setBags(data.message_bags || []))
      .catch(() => setBags([]))
      .finally(() => setLoadingBags(false));
  }, [groupId]);

  return (
    <Space wrap className="release-message-bag-picker">
      <Select
        style={{ minWidth: 180 }}
        placeholder="グループ"
        value={groupId || undefined}
        disabled={disabled}
        allowClear
        onChange={(value) => {
          onGroupChange(value ?? null);
          if (value == null) {
            onBagChange(null);
          }
        }}
        options={groups.map((group) => ({ value: group.id, label: group.group_name }))}
      />
      <Select
        style={{ minWidth: 180 }}
        placeholder="メッセージバッグ"
        value={bagId || undefined}
        disabled={disabled || !groupId}
        allowClear
        loading={loadingBags}
        onChange={(value) => onBagChange(value ?? null)}
        options={bags.map((bag) => ({ value: bag.id, label: bag.bag_name }))}
      />
    </Space>
  );
}
