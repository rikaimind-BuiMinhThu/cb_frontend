import React from 'react';
import { Button } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { MAX_CUSTOM_ITEMS } from '../constants';

function CustomDataSection({
  items,
  isEditing,
  isAdminDeel,
  onAddClick,
  onDelete,
}) {
  const canAdd = isAdminDeel && isEditing && items.length < MAX_CUSTOM_ITEMS;

  return (
    <div className="crm-custom-data-section">
      <div className="crm-custom-data-section__header">顧客データ</div>
      <div className="crm-custom-data-section__divider" />
      <div className="crm-custom-data-grid">
        {items.map((item) => (
          <div key={item.id} className="crm-custom-data-item">
            <div className="crm-custom-data-item__row">
              <div className="crm-custom-data-item__cell crm-custom-data-item__cell--title">
                {item.title}
              </div>
              <div className="crm-custom-data-item__cell crm-custom-data-item__cell--value">
                {item.value}
              </div>
            </div>
            {isAdminDeel && isEditing && (
              <Button
                type="text"
                size="small"
                className="crm-custom-data-item__delete"
                icon={<CloseOutlined />}
                onClick={() => onDelete?.(item.id)}
              />
            )}
          </div>
        ))}
        {canAdd && (
          <div className="crm-custom-data-item crm-custom-data-add" onClick={onAddClick} role="button" tabIndex={0}>
            <PlusOutlined /> データ追加
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomDataSection;
