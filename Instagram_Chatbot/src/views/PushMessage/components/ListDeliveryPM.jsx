import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import api from "../../../api/api-management";
import Cookies from "js-cookie";

const ListDeliveryPM = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDateSearch, setStartDateSearch] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deliveryPMs, setDeliverPMs] = useState([]);

  const handleGetListDeliveryPM = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/delivery_push_message?page=all&chatbot_id=${bot_id}`
      );
      if (res.data.code === 1) {
        setDeliverPMs(res.data.data);
      }
    } catch (error) {
      if (error?.response?.data.code === 0) {
      }
    }
  };

  useEffect(() => {
    handleGetListDeliveryPM();
  }, []);
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
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            locale="ja"
            value={endDate}
          />
        </div>
        まで &emsp;<button className="push-message-btn-search">検索</button>
      </div>
      <span
        id="push-message-err"
        style={{ color: "red", margin: " 0 0 20px 75px", display: "none" }}
      ></span>
    </div>
  );
};

export default ListDeliveryPM;
