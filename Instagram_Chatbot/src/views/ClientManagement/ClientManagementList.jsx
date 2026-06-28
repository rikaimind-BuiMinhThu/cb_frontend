import React, { useMemo } from 'react';
import { DatePicker as AntDatePicker, Space } from 'antd';
import locale from 'antd/es/date-picker/locale/ja_JP';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminActionButton,
  useAdminHeaderActions,
} from '../../components/AdminShell';
import { PAGE_SIZE } from './constants';
import { createClientColumns } from './clientManagementColumns';
import { gotoPaymentDetail } from './utils/clientManagementUtils';

function ClientManagementList({
  clients,
  total,
  page,
  loading,
  conversionRange,
  dateRangeError,
  namesearch,
  setNamesearch,
  plans,
  handleSearch,
  handlePageChange,
  handleConversionDateChange,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () =>
      createClientColumns({
        plans,
        onPayment: gotoPaymentDetail,
        onView,
        onEdit,
        onDelete,
      }),
    [plans, onView, onEdit, onDelete]
  );

  useAdminHeaderActions(
    <AdminActionButton action="create" label="クライアント追加" onClick={onAdd} />
  );

  return (
    <AdminPage>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={clients}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        rowClassName={(record) =>
          record.status === 'pause' || record.status === 'ended' ? 'admin-client-row--inactive' : ''
        }
        toolbar={
          <>
            <AdminSearchBar
              searchValue={namesearch}
              onSearchChange={setNamesearch}
              onSearch={handleSearch}
              searchPlaceholder="クライアント名 ..."
              extra={
                <Space size={4} wrap>
                  <span style={{ color: '#6b7280', fontSize: 13 }}>コンバージョン数</span>
                  <AntDatePicker.RangePicker
                    locale={locale}
                    value={conversionRange}
                    onChange={handleConversionDateChange}
                    format="YYYY/MM/DD"
                  />
                </Space>
              }
            />
            {dateRangeError && (
              <div style={{ color: '#ff4d4f', fontSize: 13, width: '100%' }}>{dateRangeError}</div>
            )}
          </>
        }
        pagination={{
          current: page,
          total,
          pageSize: PAGE_SIZE,
          onChange: handlePageChange,
        }}
      />
    </AdminPage>
  );
}

export default ClientManagementList;
