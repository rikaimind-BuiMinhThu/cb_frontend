import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker as AntDatePicker, InputNumber, Space, message } from 'antd';
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
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';

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

  const [lexicaMaxChrome, setLexicaMaxChrome] = useState(10);
  const [savingChrome, setSavingChrome] = useState(false);

  useEffect(() => {
    api
      .get('/api/v1/managements/system_settings')
      .then((res) => {
        if (res.data.code === 1) {
          setLexicaMaxChrome(res.data.data.lexica_max_chrome);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) tokenExpired();
      });
  }, []);

  const saveLexicaMaxChrome = (value) => {
    setSavingChrome(true);
    api
      .patch('/api/v1/managements/system_settings', { lexica_max_chrome: value })
      .then((res) => {
        if (res.data.code === 1) {
          setLexicaMaxChrome(res.data.data.lexica_max_chrome);
          message.success('同時 Chromium 数を保存しました。');
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) tokenExpired();
      })
      .finally(() => setSavingChrome(false));
  };

  useAdminHeaderActions(
    <AdminActionButton action="create" label="クライアント追加" onClick={onAdd} />
  );

  return (
    <AdminPage>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#6b7280', fontSize: 13 }}>レキシカ 同時 Chromium 数（全体）</span>
        <InputNumber
          min={1}
          max={20}
          value={lexicaMaxChrome}
          disabled={savingChrome}
          onChange={setLexicaMaxChrome}
          onBlur={() => saveLexicaMaxChrome(lexicaMaxChrome)}
        />
      </div>
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
