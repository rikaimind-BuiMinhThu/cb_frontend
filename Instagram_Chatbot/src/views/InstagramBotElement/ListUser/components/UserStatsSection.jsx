import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function formatPercent(value) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return '0.0';
  return num.toFixed(1);
}

function ChangeIndicator({ value }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;

  return (
    <span className={`list-user-stat-change ${isPositive ? 'positive' : 'negative'}`}>
      <Icon />
      {formatPercent(Math.abs(value))}%
    </span>
  );
}

function UserStatsSection({
  loading,
  error,
  periodMessageTotal,
  messageChangePercent,
  ecUserPercent,
  ecNewUserPercent,
}) {
  const userGrowthPercent =
    ecUserPercent + ecNewUserPercent > 0
      ? (ecNewUserPercent / (ecUserPercent + ecNewUserPercent)) * 100
      : 0;

  return (
    <div className="admin-page-card list-user-section">
      <div className="list-user-section-body">
        <Spin spinning={loading}>
          {error && <div className="list-user-date-error">{error}</div>}
          <div className="list-user-stats-grid">
            <div className="list-user-stat-card">
              <div className="list-user-stat-value">
                {periodMessageTotal ?? 0}
                <ChangeIndicator value={messageChangePercent} />
              </div>
              <p className="list-user-stat-label">メッセージ数</p>
            </div>
            <div className="list-user-stat-card">
              <div className="list-user-stat-value">
                {formatPercent(ecUserPercent)}
                <ChangeIndicator value={userGrowthPercent} />
              </div>
              <p className="list-user-stat-label">ユーザー数</p>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default UserStatsSection;
