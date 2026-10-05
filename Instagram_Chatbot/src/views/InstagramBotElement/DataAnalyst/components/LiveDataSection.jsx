import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { AdminSearchBar, AdminTable } from '../../../../components/AdminShell';
import { downloadLiveCsv } from '../utils/csvBuilders';

function LiveDataSection({
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
}) {
  const [exportingId, setExportingId] = useState(null);

  const handleDownload = async (record) => {
    const exportKey = record.media_start_at;
    setExportingId(exportKey);
    try {
      downloadLiveCsv(record);
    } finally {
      setExportingId(null);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'ライブ日',
        dataIndex: 'media_start_at',
        key: 'media_start_at',
        render: (value) => value?.slice(0, 10) || '-',
      },
    ];

    if (isAdminDeel) {
      baseColumns.push({
        title: 'クライアント名',
        dataIndex: 'client_name',
        key: 'client_name',
        render: (value) => value || '-',
      });
    }

    baseColumns.push(
      {
        title: 'コメントしたユーザー数',
        dataIndex: 'user_count',
        key: 'user_count',
        align: 'center',
      },
      {
        title: 'コメント数',
        dataIndex: 'comment_count',
        key: 'comment_count',
        align: 'center',
      },
      {
        title: 'ダウンロード',
        key: 'download',
        align: 'center',
        render: (_, record) => (
          <Button
            type="link"
            icon={<DownloadOutlined />}
            loading={exportingId === record.media_start_at}
            onClick={() => handleDownload(record)}
          />
        ),
      }
    );

    return baseColumns;
  }, [exportingId, isAdminDeel]);

  return (
    <div className="admin-page-card data-analyst-section">
      <div className="data-analyst-section-header">
        <h2>ライブデータ</h2>
      </div>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={items}
        rowKey={(record) => record.media_start_at}
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

export default LiveDataSection;
