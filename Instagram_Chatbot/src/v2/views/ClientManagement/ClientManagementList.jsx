import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as AntDatePicker, Space } from 'antd';
import locale from 'antd/es/date-picker/locale/ja_JP';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import {
  ADD_CLIENT_TITLE,
  CONVERSION_COUNT_LABEL,
  DATE_FORMAT,
  INACTIVE_ROW_CLASS,
  PAGE_SIZE,
  SEARCH_PLACEHOLDER,
  STATUS_ENDED,
  STATUS_PAUSE,
  TABLE_SCROLL_X,
} from './constants';
import { createClientColumns } from './clientManagementColumns';
import { gotoPaymentDetail } from './utils/clientManagementUtils';

const ClientManagementList = ({
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
}) => {
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
    <AdminActionButton action="create" label={ADD_CLIENT_TITLE} onClick={onAdd} />
  );

  return (
    <AdminPage>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={clients}
        rowKey="id"
        scroll={{ x: TABLE_SCROLL_X }}
        rowClassName={(record) =>
          record.status === STATUS_PAUSE || record.status === STATUS_ENDED ? INACTIVE_ROW_CLASS : ''
        }
        toolbar={
          <>
            <AdminSearchBar
              searchValue={namesearch}
              onSearchChange={setNamesearch}
              onSearch={handleSearch}
              searchPlaceholder={SEARCH_PLACEHOLDER}
              extra={
                <Space size={4} wrap>
                  <span className="admin-search-bar-filter-label">{CONVERSION_COUNT_LABEL}</span>
                  <AntDatePicker.RangePicker
                    locale={locale}
                    value={conversionRange}
                    onChange={handleConversionDateChange}
                    format={DATE_FORMAT}
                  />
                </Space>
              }
            />
            {dateRangeError && (
              <div className="admin-search-bar-error">{dateRangeError}</div>
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
};

ClientManagementList.propTypes = {
  clients: PropTypes.array,
  total: PropTypes.number,
  page: PropTypes.number,
  loading: PropTypes.bool,
  conversionRange: PropTypes.array,
  dateRangeError: PropTypes.string,
  namesearch: PropTypes.string,
  setNamesearch: PropTypes.func,
  plans: PropTypes.array,
  handleSearch: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleConversionDateChange: PropTypes.func,
  onAdd: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ClientManagementList;
