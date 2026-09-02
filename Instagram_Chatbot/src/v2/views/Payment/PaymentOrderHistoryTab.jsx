import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Select, Space, Typography } from 'antd';
import { AdminTable, AdminActionButton } from 'v2/components/AdminShell';
import {
  BOT_LABEL,
  CLIENT_FILTER_DEEL,
  CLIENT_LABEL,
  COL_MODE,
  COL_NO,
  COL_ORDERED_AT,
  COL_ORDER_NUMBER,
  COL_PRICE,
  COL_PRODUCT_NAME,
  COL_QUANTITY,
  COL_SETTLEMENT_FEE,
  COL_SHIPPING_FEE,
  COL_STATUS,
  COL_TAX,
  COL_TOTAL,
  COL_UNIT_PRICE,
  COL_USER_ID,
  DATE_FORMAT,
  DEEL_LABEL,
  EMPTY_ORDERS_DESCRIPTION,
  ORDER_DATETIME_LABEL,
  ORDER_TABLE_SCROLL_X,
  SELECT_BOT_PLACEHOLDER,
} from './paymentConstants';

const ORDER_COLUMNS = [
  { title: COL_NO, dataIndex: 'no', key: 'no', width: 60 },
  { title: COL_USER_ID, dataIndex: 'userId', key: 'userId', width: 100 },
  { title: COL_ORDER_NUMBER, dataIndex: 'orderNumber', key: 'orderNumber', width: 110 },
  { title: COL_PRODUCT_NAME, dataIndex: 'productName', key: 'productName', width: 140, ellipsis: true },
  { title: COL_UNIT_PRICE, dataIndex: 'unitPrice', key: 'unitPrice', width: 90, align: 'right' },
  { title: COL_QUANTITY, dataIndex: 'quantity', key: 'quantity', width: 70, align: 'right' },
  { title: COL_PRICE, dataIndex: 'price', key: 'price', width: 90, align: 'right' },
  { title: COL_TAX, dataIndex: 'tax', key: 'tax', width: 90, align: 'right' },
  { title: COL_SETTLEMENT_FEE, dataIndex: 'settlementFee', key: 'settlementFee', width: 130, align: 'right' },
  { title: COL_SHIPPING_FEE, dataIndex: 'shippingFee', key: 'shippingFee', width: 110, align: 'right' },
  { title: COL_TOTAL, dataIndex: 'total', key: 'total', width: 110, align: 'right' },
  { title: COL_MODE, dataIndex: 'mode', key: 'mode', width: 90 },
  { title: COL_STATUS, dataIndex: 'status', key: 'status', width: 90 },
  { title: COL_ORDERED_AT, dataIndex: 'orderedAt', key: 'orderedAt', width: 150 },
];

const PaymentOrderHistoryTab = ({
  startDate,
  endDate,
  dateError,
  isAdminDeel,
  allClient,
  allBot,
  currentClientId,
  onDateChange,
  onSearch,
  onSelectClient,
}) => {
  const clientOptions = useMemo(
    () => [
      { value: CLIENT_FILTER_DEEL, label: DEEL_LABEL },
      ...allClient.map((client) => ({
        value: client.id,
        label: client.name,
      })),
    ],
    [allClient]
  );

  const botOptions = useMemo(
    () =>
      allBot.map((item) => ({
        value: item.id,
        label: item.bot_name,
      })),
    [allBot]
  );

  return (
    <>
      <div className="report-filter-panel">
        <Space wrap size={12} className="report-filter-toolbar">
          <Space size={4}>
            <Typography.Text type="secondary">{ORDER_DATETIME_LABEL}</Typography.Text>
            <DatePicker.RangePicker
              value={[startDate, endDate]}
              onChange={(dates) => onDateChange(dates?.[0] ?? null, dates?.[1] ?? null)}
              format={DATE_FORMAT}
            />
          </Space>
          {isAdminDeel && (
            <Space size={4}>
              <Typography.Text type="secondary">{CLIENT_LABEL}</Typography.Text>
              <Select
                value={currentClientId}
                onChange={onSelectClient}
                options={clientOptions}
                className="payment-filter-select"
              />
            </Space>
          )}
          {currentClientId !== CLIENT_FILTER_DEEL && botOptions.length > 0 && (
            <Space size={4}>
              <Typography.Text type="secondary">{BOT_LABEL}</Typography.Text>
              <Select
                options={botOptions}
                className="payment-filter-select--bot"
                placeholder={SELECT_BOT_PLACEHOLDER}
              />
            </Space>
          )}
          <AdminActionButton action="search" onClick={onSearch} />
        </Space>
        {dateError && (
          <Typography.Text type="danger" className="report-date-error">
            {dateError}
          </Typography.Text>
        )}
      </div>
      <div className="payment-order-table-wrap">
        <AdminTable
          columns={ORDER_COLUMNS}
          dataSource={[]}
          rowKey="no"
          scroll={{ x: ORDER_TABLE_SCROLL_X }}
          pagination={false}
          emptyDescription={EMPTY_ORDERS_DESCRIPTION}
        />
      </div>
    </>
  );
};

PaymentOrderHistoryTab.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  dateError: PropTypes.string,
  isAdminDeel: PropTypes.bool,
  allClient: PropTypes.array,
  allBot: PropTypes.array,
  currentClientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onDateChange: PropTypes.func,
  onSearch: PropTypes.func,
  onSelectClient: PropTypes.func,
};

export default PaymentOrderHistoryTab;
