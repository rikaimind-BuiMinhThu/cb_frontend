import React from 'react';
import ava from '../../../Popup/ava.png';
import StatusPipeline from './StatusPipeline';
import { boolLabel, formatDateTime } from '../utils/formatters';

const PROFILE_FIELDS = [
  { key: 'email', label: 'メール' },
  { key: 'phone_number', label: '電話番号' },
  { key: 'real_name', label: '名前' },
  { key: 'company_name', label: '企業' },
  { key: 'company_role', label: '役割' },
  { key: 'website', label: 'ウェブサイト' },
  { key: 'propose', label: '用途（ニーズ）' },
  { key: 'know_product_in', label: '認知経路' },
];

function UserProfilePanel({ user, onStatusChange, statusUpdating }) {
  if (!user) return null;

  return (
    <div className="crm-profile-panel">
      <img src={ava} alt="" className="crm-profile-panel__avatar" />
      <StatusPipeline
        currentStatus={user.status}
        onStatusChange={(status) => onStatusChange(user.id, status)}
        disabled={statusUpdating}
      />
      <div className="crm-profile-panel__fields">
        {PROFILE_FIELDS.map(({ key, label }) => {
          const value = user[key];
          if (value == null || value === '') return null;
          return (
            <div key={key} className="crm-profile-panel__field">
              <span className="crm-profile-panel__field-label">{label}: </span>
              {value}
            </div>
          );
        })}
        <div className="crm-profile-panel__field">
          <span className="crm-profile-panel__field-label">フォローしている: </span>
          {boolLabel(user.is_user_follow_business)}
        </div>
        <div className="crm-profile-panel__field">
          <span className="crm-profile-panel__field-label">フォローされている: </span>
          {boolLabel(user.is_business_follow_user)}
        </div>
        <div className="crm-profile-panel__field">
          <span className="crm-profile-panel__field-label">開始日: </span>
          {formatDateTime(user.created_at)}
        </div>
        <div className="crm-profile-panel__field">
          <span className="crm-profile-panel__field-label">最終更新: </span>
          {formatDateTime(user.updated_at)}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePanel;
