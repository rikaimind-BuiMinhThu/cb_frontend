import React from 'react';
import { Button, Tag } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { MAX_LABELS } from '../constants';

function LabelsSection({
  labels,
  isEditing,
  isAdminDeel,
  onAddClick,
  onDelete,
}) {
  const canAdd = isAdminDeel && isEditing && labels.length < MAX_LABELS;

  return (
    <div className="crm-labels-section">
      <div className="crm-labels-section__header">ラベル</div>
      <div className="crm-labels-section__divider" />
      <div className="crm-labels-section__tags">
        {labels.map((item) => {
          if (!item.name) return null;
          const tagClass = item.is_admin_add
            ? 'crm-labels-section__tag--admin'
            : 'crm-labels-section__tag--user';

          return (
            <Tag
              key={item.id}
              className={`crm-labels-section__tag ${tagClass}`}
              closable={isAdminDeel && isEditing}
              closeIcon={<CloseOutlined className="crm-labels-section__delete" />}
              onClose={(e) => {
                e.preventDefault();
                onDelete?.(item.id);
              }}
            >
              {item.name}
            </Tag>
          );
        })}
        {canAdd && (
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={onAddClick}
          >
            追加
          </Button>
        )}
      </div>
    </div>
  );
}

export default LabelsSection;
