import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, Select, Tag } from 'antd';
import { useHistory } from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/ja_JP';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE, BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable } from 'v2/components/AdminShell';
import { ADMIN_PATHS } from 'v2/components/AdminShell/constants';
import { getAdminRoutePath } from 'v2/variables/constants';
import { formatDateTime, formatStep, statusColor } from './botOrderFormat';
import {
  COL_CREATED_AT,
  COL_EMAIL,
  COL_LAST_STEP,
  COL_LEXICA_ORDER_ID,
  COL_PATH,
  COL_PAYMENT,
  COL_SKU,
  API_WARNING_CODE,
  COL_STATUS,
  DASH,
  DATE_FORMAT,
  DATE_PARAM_FORMAT,
  FILTER_PATH_PLACEHOLDER,
  FILTER_STATUS_PLACEHOLDER,
  ORDERS_API_PATH,
  PAGE_SIZE,
  PATH_OPTIONS,
  RESULT_OPTIONS,
  STATUS_LABELS,
} from './constants';
import './styles/bot-orders.css';

const BotOrderList = () => {
  const history = useHistory();
  const botId = Cookies.get(BOT_ID_COOKIE_KEY);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [path, setPath] = useState(null);
  const [range, setRange] = useState(null);
  const listPath = getAdminRoutePath(ADMIN_PATHS.BOT_ORDERS);
  const scenarioListPath = getAdminRoutePath(ADMIN_PATHS.SCENARIO_LIST);

  const fetchRows = useCallback((pageIndex) => {
    setLoading(true);
    const params = { page: pageIndex, chatbot_id: botId };
    if (result) params.result = result;
    if (path) params.path = path;
    if (range?.[0]) params.start_date = range[0].format(DATE_PARAM_FORMAT);
    if (range?.[1]) params.end_date = range[1].format(DATE_PARAM_FORMAT);
    api
      .get(ORDERS_API_PATH, { params })
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          setRows(res.data.data || []);
          setTotal(res.data.total || 0);
          return;
        }
        if (res.data.code === API_WARNING_CODE) {
          history.push(scenarioListPath);
        }
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          history.push(scenarioListPath);
          return;
        }
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [botId, history, path, range, result, scenarioListPath]);

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
        title: COL_CREATED_AT,
        dataIndex: 'created_at',
        render: (value) => formatDateTime(value),
      },
      {
        title: COL_STATUS,
        dataIndex: 'result',
        render: (value) => <Tag color={statusColor(value)}>{STATUS_LABELS[value] || value}</Tag>,
      },
      { title: COL_PATH, dataIndex: 'path_label', render: (value) => value || DASH },
      { title: COL_PAYMENT, dataIndex: 'payment_label', render: (value) => value || DASH },
      { title: COL_EMAIL, dataIndex: 'email', render: (value) => value || DASH },
      { title: COL_SKU, dataIndex: 'sku', render: (value) => value || DASH },
      { title: COL_LEXICA_ORDER_ID, dataIndex: 'lexica_order_id', render: (value) => value || DASH },
      { title: COL_LAST_STEP, dataIndex: 'last_step_description', render: (value) => formatStep(value) },
    ],
    [],
  );

  return (
    <AdminPage>
      <div className="bot-orders-page">
        <div className="bot-orders-table">
          <AdminTable
            loading={loading}
            columns={columns}
            dataSource={rows}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => history.push(`${listPath}/${record.id}`),
            })}
            pagination={{ current: page, pageSize: PAGE_SIZE, total, onChange: setPage }}
            toolbar={(
              <>
                <Select
                  allowClear
                  placeholder={FILTER_STATUS_PLACEHOLDER}
                  className="bot-orders-filter-status"
                  value={result}
                  onChange={resetToFirstPage(setResult)}
                  options={RESULT_OPTIONS}
                />
                <Select
                  allowClear
                  placeholder={FILTER_PATH_PLACEHOLDER}
                  className="bot-orders-filter-path"
                  value={path}
                  onChange={resetToFirstPage(setPath)}
                  options={PATH_OPTIONS}
                />
                <DatePicker.RangePicker
                  locale={locale}
                  value={range}
                  onChange={resetToFirstPage(setRange)}
                  format={DATE_FORMAT}
                />
              </>
            )}
          />
        </div>
      </div>
    </AdminPage>
  );
};

export default BotOrderList;
