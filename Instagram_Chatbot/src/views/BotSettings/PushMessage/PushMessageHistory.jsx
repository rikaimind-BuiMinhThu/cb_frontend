import { Space, DatePicker, Button, Typography, Tooltip, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "api/api-management";
import { tokenExpired } from "api/tokenExpired";

const columns = [
  {
    title: "No.",
    dataIndex: "no",
  },
  {
    title: "プッシュメッセージ名",
    dataIndex: "name",
  },
  {
    title: "送信方法",
    dataIndex: "sending_method",
  },
  {
    title: "配信日時",
    dataIndex: "sent_time",
  },
  {
    title: "状態",
    dataIndex: "status",
  },
  {
    title: "行き先",
    dataIndex: "destination",
  },
  {
    title: "送信失敗の件数",
    dataIndex: "number_of_failed_transmissions",
  },
];

const PushMessageHistory = () => {
  const { botId } = useParams();
  const [sentTimeFrom, setSentTimeFrom] = useState(null);
  const [sentTimeTo, setSentTimeTo] = useState(null);
  const [list, setList] = useState([]);
  const [tick, setTick] = useState(1);

  useEffect(() => {
    api
      .get(`/api/v1/managements/push_message_histories`, {
        params: {
          chatbot_id: botId,
          page: "all",
          sent_time_from: sentTimeFrom,
          sent_time_to: sentTimeTo,
        },
      })
      .then((res) => {
        if (res.data.code === 1) {
          const list = res.data.data.map((each, index) => ({
            ...each,
            no: index + 1,
            name: each.push_message.title,
            status:
              each.push_message.status === "success" ? "サクセス" : "失敗した",
            sending_method:
              each.push_message.sending_method === "email" ? "メール" : "SMS",
            sent_time: each.sent_time.substring(0, 19).replaceAll("T", " "),
          }));
          setList(list);
        }
        if (res.data.code == 2) {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data.code == 0) {
          tokenExpired();
        }
      });
  }, [botId, tick]);

  return (
    <div>
      <Space align="center" size={8}>
        <Typography.Text>集計期間</Typography.Text>
        <DatePicker.RangePicker
          format="YYYY-MM-DD"
          onChange={(_, options) => {
            setSentTimeFrom(options[0]);
            setSentTimeTo(options[1]);
          }}
        />
        <Tooltip title="検索">
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => setTick((pre) => ++pre)}
          />
        </Tooltip>
      </Space>
      <Table columns={columns} dataSource={list} />
    </div>
  );
};

export default PushMessageHistory;
