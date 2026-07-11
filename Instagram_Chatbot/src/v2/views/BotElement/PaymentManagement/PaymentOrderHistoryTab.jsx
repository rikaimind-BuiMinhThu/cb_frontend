import React, { useMemo } from 'react';
import { Button, DatePicker, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AdminTable } from '../../../components/AdminShell';

const ORDER_COLUMNS = [
  { title: '番号', dataIndex: 'no', key: 'no', width: 60 },
  { title: 'ユーザID', dataIndex: 'userId', key: 'userId', width: 100 },
  { title: '注文番号', dataIndex: 'orderNumber', key: 'orderNumber', width: 110 },
  { title: '商品名', dataIndex: 'productName', key: 'productName', width: 140, ellipsis: true },
  { title: '単価', dataIndex: 'unitPrice', key: 'unitPrice', width: 90, align: 'right' },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 70, align: 'right' },
  { title: '価格', dataIndex: 'price', key: 'price', width: 90, align: 'right' },
  { title: '消費税', dataIndex: 'tax', key: 'tax', width: 90, align: 'right' },
  { title: '決済手数料（税込）', dataIndex: 'settlementFee', key: 'settlementFee', width: 130, align: 'right' },
  { title: '送料（税込）', dataIndex: 'shippingFee', key: 'shippingFee', width: 110, align: 'right' },
  { title: '合計（税込）', dataIndex: 'total', key: 'total', width: 110, align: 'right' },
  { title: 'モード', dataIndex: 'mode', key: 'mode', width: 90 },
  { title: '状態', dataIndex: 'status', key: 'status', width: 90 },
  { title: '注文日時', dataIndex: 'orderedAt', key: 'orderedAt', width: 150 },
];

function PaymentOrderHistoryTab({
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
}) {
  const clientOptions = useMemo(
    () => [
      { value: 'deel', label: 'Deel' },
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
            <Typography.Text type="secondary">注文日時</Typography.Text>
            <DatePicker.RangePicker
              value={[startDate, endDate]}
              onChange={(dates) => onDateChange(dates?.[0] ?? null, dates?.[1] ?? null)}
              format="YYYY-MM-DD"
            />
          </Space>
          {isAdminDeel && (
            <Space size={4}>
              <Typography.Text type="secondary">クライアント</Typography.Text>
              <Select
                value={currentClientId}
                onChange={onSelectClient}
                options={clientOptions}
                style={{ minWidth: 140 }}
              />
            </Space>
          )}
          {currentClientId !== 'deel' && botOptions.length > 0 && (
            <Space size={4}>
              <Typography.Text type="secondary">ボット</Typography.Text>
              <Select options={botOptions} style={{ minWidth: 160 }} placeholder="ボットを選択" />
            </Space>
          )}
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            検索
          </Button>
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
          scroll={{ x: 1400 }}
          pagination={false}
          emptyDescription="注文データがありません"
        />
      </div>
    </>
  );
}

export default PaymentOrderHistoryTab;
