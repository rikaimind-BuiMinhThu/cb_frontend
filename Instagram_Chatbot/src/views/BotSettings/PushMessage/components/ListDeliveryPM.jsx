import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import api from "../../../../api/api-management";
import Cookies from "js-cookie";
import PushMessageTable from "./PushMessageTable";

const ListDeliveryPM = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDateSearch, setStartDateSearch] = useState(new Date());
  const [endDateSearch, setEndDateSearch] = useState(new Date());
  const [deliveryPMs, setDeliverPMs] = useState([]);

  const handleGetListDeliveryPM = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/push_message_histories?page=all&chatbot_id=${bot_id}`
      );
      if (res.data.code === 1) {
        setDeliverPMs(res.data.data);
      }
    } catch (error) {
      if (error?.response?.data.code === 0) {
      }
    }
  };

  const handleGetListDeliveryPMBySearchDate = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/push_message_histories?page=all&chatbot_id=${bot_id}&start_date=${startDateSearch}&end_date=${endDateSearch}`
      );
      if (res.data.code === 1) {
        setDeliverPMs(res.data.data);
      }
    } catch (error) {
      if (error?.response?.data.code === 0) {
      }
    }
  };

  const convertToDateTime = (date) => {
    const [day, hour] = date?.split("T");
    const [exactHOur, timeZone] = hour?.split(".");
    return `${day} ${exactHOur}`;
  };

  useEffect(() => {
    handleGetListDeliveryPM();
  }, []);

  const columnsDelivery = [
    {
      title: "NO.",
      dataIndex: "index",
    },
    { title: "ブッシュメッセージ名", dataIndex: "title" },
    {
      title: "配信日時",
      dataIndex: "delivery_date_time",
      render: (item, record) => (
        <>{convertToDateTime(record.delivery_date_time)}</>
      ),
    },
    { title: "SMS送信済みの件数", dataIndex: "destination" },
    { title: "SMS送信失敗の件数", dataIndex: "number_of_failed_transmissions" },
  ];
  return (
    <div id="ListDeliveryPM">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4
          style={{
            margin: "0",
            fontWeight: "400",
            fontSize: "1.2em",
          }}
        >
          集計期間
        </h4>
        <div style={{ borderRadius: "5px", padding: "5px" }}>
          <DatePicker
            className="push-message-date"
            selected={startDateSearch}
            onChange={(date) => setStartDateSearch(date)}
            dateFormat="yyyy-MM-dd"
            locale="ja"
            value={startDate}
          />
        </div>
        <h4
          style={{
            margin: "0",
            fontWeight: "400",
            fontSize: "1.2em",
          }}
        >
          から
        </h4>
        <div style={{ borderRadius: "5px", padding: "5px" }}>
          <DatePicker
            className="push-message-date"
            selected={endDateSearch}
            onChange={(date) => setEndDateSearch(date)}
            dateFormat="yyyy-MM-dd"
            locale="ja"
            value={endDateSearch}
          />
        </div>
        まで &emsp;
        <button
          className="push-message-btn-search"
          onClick={handleGetListDeliveryPMBySearchDate}
        >
          検索
        </button>
      </div>
      <div className="delivery-main-body">
        <PushMessageTable columns={columnsDelivery} dataSource={deliveryPMs} />
      </div>
    </div>
  );
};

export default ListDeliveryPM;
