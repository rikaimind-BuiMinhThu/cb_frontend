import React, { useMemo } from 'react';
import { Button, Input, Space, Switch } from 'antd';
import { AdminSearchBar, AdminTable } from '../../../../components/AdminShell';
import { boolLabel, formatDateTime } from '../utils/formatters';

function CrmUserTable({
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
  supportingUsers,
  setSupportingUsers,
  handleSearch,
  handlePageChange,
  onViewDetail,
  onAutoReply,
}) {
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'ユーザー名',
        dataIndex: 'username',
        key: 'username',
        render: (value) =>
          value ? (
            <a
              href={`https://www.instagram.com/${value}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
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
        title: '作成日',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value) => formatDateTime(value),
      },
      {
        title: '更新日',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (value) => formatDateTime(value),
      },
      {
        title: '詳細',
        key: 'actions',
        align: 'center',
        width: 220,
        render: (_, record) => (
          <Space size="small" wrap>
            <Button type="primary" size="small" onClick={() => onViewDetail(record.id)}>
              詳細
            </Button>
            {record.need_support && (
              <Button danger size="small" onClick={() => onAutoReply(record.id)}>
                自動応答
              </Button>
            )}
          </Space>
        ),
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
  }, [isAdminDeel, onAutoReply, onViewDetail]);

  return (
    <AdminTable
      loading={loading}
      columns={columns}
      dataSource={items}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      toolbar={
        <>
          <Space wrap align="center">
            <AdminSearchBar
              searchValue={usernameSearch}
              onSearchChange={setUsernameSearch}
              onSearch={handleSearch}
              searchPlaceholder="インスタグラムユーザー..."
              extra={
                <>
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
                  <span className="crm-toolbar-extra">友人切り替え中</span>
                  <Switch checked={supportingUsers} onChange={setSupportingUsers} />
                </>
              }
            />
          </Space>
          {error && <div className="crm-error">{error}</div>}
        </>
      }
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: handlePageChange,
      }}
    />
  );
}

export default CrmUserTable;
