import React, { useMemo } from 'react';
import { Input, Space } from 'antd';
import { AdminSearchBar, AdminTable } from '../../../../components/AdminShell';

function boolLabel(value) {
  return value === 'true' || value === true ? 'はい' : 'いいえ';
}

function formatDate(value) {
  if (!value) return '-';
  return value.slice(0, 19).replaceAll('T', ' ').replaceAll('-', '/');
}

function UserTableSection({
  isAdminDeel,
  items,
  total,
  page,
  pageSize,
  loading,
  error,
  usernameSearch,
  setUsernameSearch,
  clientSearch,
  setClientSearch,
  handleSearch,
  handlePageChange,
}) {
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'ユーザー名',
        dataIndex: 'username',
        key: 'username',
        render: (value) =>
          value ? (
            <a href={`https://www.instagram.com/${value}`} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          ) : (
            '-'
          ),
      },
      {
        title: '名前',
        dataIndex: 'full_name',
        key: 'full_name',
        render: (value) => value || '-',
      },
      {
        title: 'フォロワー数',
        dataIndex: 'follower_count',
        key: 'follower_count',
        align: 'center',
        render: (value) => value ?? '-',
      },
      {
        title: 'インスタグラムID',
        dataIndex: 'instagram_id',
        key: 'instagram_id',
        render: (value) => value || '-',
      },
      {
        title: 'フォローしている',
        dataIndex: 'is_user_follow_business',
        key: 'is_user_follow_business',
        align: 'center',
        render: (value) => boolLabel(value),
      },
      {
        title: 'フォローされている',
        dataIndex: 'is_business_follow_user',
        key: 'is_business_follow_user',
        align: 'center',
        render: (value) => boolLabel(value),
      },
      {
        title: 'メッセージ数',
        dataIndex: 'num_of_messages_sent',
        key: 'num_of_messages_sent',
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'コンバージョン数',
        dataIndex: 'num_of_conversions',
        key: 'num_of_conversions',
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: '作成日',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value) => formatDate(value),
      },
    ];

    if (isAdminDeel) {
      baseColumns.splice(1, 0, {
        title: 'クライアント名',
        dataIndex: 'client_name',
        key: 'client_name',
        render: (value) => value || '-',
      });
    }

    return baseColumns;
  }, [isAdminDeel]);

  return (
    <div className="admin-page-card list-user-section">
      <div className="list-user-section-header">
        <h2>ユーザー一覧</h2>
      </div>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={items}
        rowKey={(record) => record.id || record.instagram_id || record.username}
        scroll={{ x: 'max-content' }}
        toolbar={
          <>
            <Space wrap>
              <AdminSearchBar
                searchValue={usernameSearch}
                onSearchChange={setUsernameSearch}
                onSearch={handleSearch}
                searchPlaceholder="ユーザー名で検索..."
              />
              {isAdminDeel && (
                <Input
                  placeholder="クライアント名..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  onPressEnter={handleSearch}
                  allowClear
                  style={{ width: 180 }}
                />
              )}
            </Space>
            {error && <div className="list-user-date-error">{error}</div>}
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

export default UserTableSection;
