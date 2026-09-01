import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, Select, Tag } from 'antd';
import { useHistory } from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/ja_JP';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable } from '../../../../components/AdminShell';
import { formatDateTime, formatStep, STATUS_LABELS, statusColor } from './botOrderFormat';

const PAGE_SIZE = 25;

const PATH_OPTIONS = [
  { value: 'first_time', label: 'はじめて' },
  { value: 'new', label: '新規会員' },
  { value: 'existing', label: '既存会員' },
];

function BotOrderList() {
  const history = useHistory();
  const botId = Cookies.get('bot_id');
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [path, setPath] = useState(null);
  const [range, setRange] = useState(null);

  const fetchRows = useCallback((pageIndex) => {
    setLoading(true);
    const params = { page: pageIndex, chatbot_id: botId };
    if (result) params.result = result;
    if (path) params.path = path;
    if (range?.[0]) params.start_date = range[0].format('YYYY-MM-DD');
    if (range?.[1]) params.end_date = range[1].format('YYYY-MM-DD');
    api
      .get('/api/v1/managements/selenium_results', { params })
      .then((res) => {
        if (res.data.code === 1) {
          setRows(res.data.data || []);
          setTotal(res.data.total || 0);
        } else if (res.data.code === 2) {
          history.push('/v2/admin/scenario-list');
        }
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          history.push('/v2/admin/scenario-list');
        } else if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [botId, history, path, range, result]);

  useEffect(() => {
    fetchRows(page);
  }, [fetchRows, page]);

  const resetToFirstPage = (updater) => (value) => {
    updater(value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        title: '受付日時',
        dataIndex: 'created_at',
        render: (value) => formatDateTime(value),
      },
      {
        title: 'ステータス',
        dataIndex: 'result',
        render: (value) => <Tag color={statusColor(value)}>{STATUS_LABELS[value] || value}</Tag>,
      },
      { title: '注文タイプ', dataIndex: 'path_label', render: (value) => value || '—' },
      { title: '支払い', dataIndex: 'payment_label', render: (value) => value || '—' },
      { title: 'メール', dataIndex: 'email', render: (value) => value || '—' },
      { title: 'SKU', dataIndex: 'sku', render: (value) => value || '—' },
      { title: 'レキシカ注文ID', dataIndex: 'lexica_order_id', render: (value) => value || '—' },
      { title: '最終ステップ', dataIndex: 'last_step_description', render: (value) => formatStep(value) },
    ],
    [],
  );

  return (
    <AdminPage>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => history.push(`/v2/admin/bot-orders/${record.id}`),
          style: { cursor: 'pointer' },
        })}
        pagination={{ current: page, pageSize: PAGE_SIZE, total, onChange: setPage }}
        toolbar={(
          <>
            <Select
              allowClear
              placeholder="ステータス"
              style={{ width: 140 }}
              value={result}
              onChange={resetToFirstPage(setResult)}
              options={[
                { value: 'running', label: '処理中' },
                { value: 'done', label: '完了' },
                { value: 'error', label: 'エラー' },
              ]}
            />
            <Select
              allowClear
              placeholder="注文タイプ"
              style={{ width: 160 }}
              value={path}
              onChange={resetToFirstPage(setPath)}
              options={PATH_OPTIONS}
            />
            <DatePicker.RangePicker
              locale={locale}
              value={range}
              onChange={resetToFirstPage(setRange)}
              format="YYYY/MM/DD"
            />
          </>
        )}
      />
    </AdminPage>
  );
}

export default BotOrderList;
