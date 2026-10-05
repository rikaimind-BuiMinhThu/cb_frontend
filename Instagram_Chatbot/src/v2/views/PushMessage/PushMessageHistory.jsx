import { DatePicker, Space, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminTable, AdminActionButton } from 'v2/components/AdminShell';
import {
  PUSH_MESSAGE_HISTORIES_PATH,
  COL_NO,
  COL_TITLE,
  COL_SENDING_METHOD,
  COL_SENT_TIME,
  COL_STATUS,
  COL_DESTINATION,
  COL_FAILED_COUNT,
  TAG_EMAIL,
  TAG_SMS,
  TAG_SUCCESS,
  TAG_FAILURE,
  EMPTY_CELL,
  EMPTY_HISTORY,
  HISTORY_PERIOD_LABEL,
  DATE_FORMAT,
  METHOD_EMAIL,
  STATUS_SUCCESS,
} from './constants';

const PushMessageHistory = () => {
  const { botId } = useParams();
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchRange, setSearchRange] = useState([null, null]);
  const [list, setList] = useState([]);
  const [tick, setTick] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setSearchRange(dateRange);
    setTick((pre) => pre + 1);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(PUSH_MESSAGE_HISTORIES_PATH, {
        params: {
          chatbot_id: botId,
          page: 'all',
          sent_time_from: searchRange[0],
          sent_time_to: searchRange[1],
        },
      })
      .then((res) => {
        if (res.data.code === 1) {
          setList(res.data.data);
        }
      })
      .catch((error) => {
        if (error?.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [botId, tick, searchRange]);

  const columns = useMemo(
    () => [
      {
        title: COL_NO,
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: COL_TITLE,
        dataIndex: ['push_message', 'title'],
        ellipsis: true,
      },
      {
        title: COL_SENDING_METHOD,
        dataIndex: ['push_message', 'sending_method'],
        width: 110,
        align: 'center',
        render: (method) =>
          method === METHOD_EMAIL ? (
            <Tag color="purple">{TAG_EMAIL}</Tag>
          ) : (
            <Tag color="blue">{TAG_SMS}</Tag>
          ),
      },
      {
        title: COL_SENT_TIME,
        dataIndex: 'sent_time',
        width: 180,
        render: (value) =>
          value ? value.substring(0, 19).replaceAll('T', ' ') : EMPTY_CELL,
      },
      {
        title: COL_STATUS,
        dataIndex: ['push_message', 'status'],
        width: 110,
        align: 'center',
        render: (status) =>
          status === STATUS_SUCCESS ? (
            <Tag color="success">{TAG_SUCCESS}</Tag>
          ) : (
            <Tag color="error">{TAG_FAILURE}</Tag>
          ),
      },
      {
        title: COL_DESTINATION,
        dataIndex: 'destination',
        ellipsis: true,
      },
      {
        title: COL_FAILED_COUNT,
        dataIndex: 'number_of_failed_transmissions',
        width: 140,
        align: 'center',
        render: (count) => count ?? 0,
      },
    ],
    []
  );

  const searchToolbar = (
    <Space align="center" size={12} wrap>
      <Typography.Text type="secondary">{HISTORY_PERIOD_LABEL}</Typography.Text>
      <DatePicker.RangePicker
        format={DATE_FORMAT}
        onChange={(_, options) => {
          setDateRange([options[0] || null, options[1] || null]);
        }}
      />
      <AdminActionButton action="search" onClick={handleSearch} />
    </Space>
  );

  return (
    <AdminTable
      loading={loading}
      toolbar={searchToolbar}
      columns={columns}
      dataSource={list}
      rowKey="id"
      emptyDescription={EMPTY_HISTORY}
    />
  );
};

export default PushMessageHistory;
