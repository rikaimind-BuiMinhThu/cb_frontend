import React, { useMemo } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { AdminSearchBar, AdminTable } from '../../../../components/AdminShell';

function MessageGroupsSection({
  isAdminDeel,
  items,
  total,
  page,
  pageSize,
  loading,
  error,
  searchValue,
  setSearchValue,
  handleSearch,
  handlePageChange,
  handleExport,
  exportingKey,
}) {
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'グループ名',
        dataIndex: 'group_name',
        key: 'group_name',
      },
    ];

    if (isAdminDeel) {
      baseColumns.push({
        title: 'クライアント名',
        dataIndex: 'client_name',
        key: 'client_name',
      });
    }

    baseColumns.push(
      {
        title: '作成/日付更新',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (value) => value?.slice(0, 10) || '-',
      },
      {
        title: 'チャット内容',
        key: 'chat_export',
        align: 'center',
        render: (_, record) => (
          <Button
            type="link"
            icon={<DownloadOutlined />}
            loading={exportingKey === `${record.id}-chat`}
            onClick={() => handleExport(record.id, 'chat')}
          />
        ),
      },
      {
        title: 'インスタグラムユーザー詳細',
        key: 'user_export',
        align: 'center',
        render: (_, record) => (
          <Button
            type="link"
            icon={<DownloadOutlined />}
            loading={exportingKey === `${record.id}-user`}
            onClick={() => handleExport(record.id, 'user')}
          />
        ),
      }
    );

    return baseColumns;
  }, [exportingKey, handleExport, isAdminDeel]);

  return (
    <div className="admin-page-card data-analyst-section">
      <div className="data-analyst-section-header">
        <h2>メッセージグループ</h2>
      </div>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={items}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        toolbar={
          <>
            {isAdminDeel && (
              <AdminSearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearch={handleSearch}
                searchPlaceholder="クライアント名入力..."
              />
            )}
            {error && <div className="data-analyst-date-error">{error}</div>}
          </>
        }
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}

export default MessageGroupsSection;
