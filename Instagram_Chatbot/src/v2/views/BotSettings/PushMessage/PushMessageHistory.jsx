import { Button, DatePicker, Space, Tag, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminTable } from '../../../components/AdminShell';

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
      .get('/api/v1/managements/push_message_histories', {
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
        if (res.data.code === 2) {
          console.log(res.data.message);
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
        title: '番号',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'プッシュメッセージ名',
        dataIndex: ['push_message', 'title'],
        ellipsis: true,
      },
      {
        title: '送信方法',
        dataIndex: ['push_message', 'sending_method'],
        width: 110,
        align: 'center',
        render: (method) =>
          method === 'email' ? (
            <Tag color="purple">メール</Tag>
          ) : (
            <Tag color="blue">SMS</Tag>
          ),
      },
      {
        title: '配信日時',
        dataIndex: 'sent_time',
        width: 180,
        render: (value) =>
          value ? value.substring(0, 19).replaceAll('T', ' ') : '—',
      },
      {
        title: '状態',
        dataIndex: ['push_message', 'status'],
        width: 110,
        align: 'center',
        render: (status) =>
          status === 'success' ? (
            <Tag color="success">成功</Tag>
          ) : (
            <Tag color="error">失敗</Tag>
          ),
      },
      {
        title: '行き先',
        dataIndex: 'destination',
        ellipsis: true,
      },
      {
        title: '送信失敗の件数',
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
      <Typography.Text type="secondary">集計期間</Typography.Text>
      <DatePicker.RangePicker
        format="YYYY-MM-DD"
        onChange={(_, options) => {
          setDateRange([options[0] || null, options[1] || null]);
        }}
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
      >
        検索
      </Button>
    </Space>
  );

  return (
    <AdminTable
      loading={loading}
      toolbar={searchToolbar}
      columns={columns}
      dataSource={list}
      rowKey="id"
      emptyDescription="配信履歴がありません"
    />
  );
};

export default PushMessageHistory;
