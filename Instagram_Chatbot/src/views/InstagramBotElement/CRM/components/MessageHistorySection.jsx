import React from 'react';
import { formatHistoryDate, messageDirectionLabel } from '../utils/formatters';

function MessageHistorySection({ histories }) {
  return (
    <div className="crm-message-history">
      <div className="crm-message-history__header">メッセージ履歴</div>
      <div className="crm-custom-data-section__divider" />
      <div className="crm-message-history__list">
        {histories.length === 0 && (
          <div className="crm-profile-panel__field">履歴がありません</div>
        )}
        {histories.map((item) => (
          <div key={item.id || item.created_at} className="crm-message-history__item">
            <div className="crm-message-history__time">
              {formatHistoryDate(item.created_at)}
            </div>
            <div className="crm-message-history__content">
              {messageDirectionLabel(item.usage_type)}: {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageHistorySection;
