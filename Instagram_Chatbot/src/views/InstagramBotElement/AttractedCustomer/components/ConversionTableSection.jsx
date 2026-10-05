import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { AdminTable } from '../../../../components/AdminShell';

function ConversionTableSection({ loading, error, tableRows }) {
  const columns = useMemo(
    () => [
      {
        title: 'タイトル',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'ユーザー数',
        dataIndex: 'userCount',
        key: 'userCount',
        align: 'center',
      },
      {
        title: 'メッセージ数',
        dataIndex: 'messageCount',
        key: 'messageCount',
        align: 'center',
      },
      {
        title: '平均メッセージ数',
        dataIndex: 'averageMessages',
        key: 'averageMessages',
        align: 'center',
      },
      {
        title: 'コンバージョン数',
        dataIndex: 'conversionCount',
        key: 'conversionCount',
        align: 'center',
      },
      {
        title: 'コンバージョン率',
        dataIndex: 'conversionRate',
        key: 'conversionRate',
        align: 'center',
      },
    ],
    []
  );

  return (
    <div className="admin-page-card attracted-customer-section">
      <div className="attracted-customer-section-header">
        <h2>チャネル別コンバージョン</h2>
      </div>
      <Spin spinning={loading}>
        {error && <div className="attracted-customer-section-error">{error}</div>}
        <AdminTable
          columns={columns}
          dataSource={tableRows}
          rowKey="key"
          pagination={false}
        />
      </Spin>
    </div>
  );
}

export default ConversionTableSection;
