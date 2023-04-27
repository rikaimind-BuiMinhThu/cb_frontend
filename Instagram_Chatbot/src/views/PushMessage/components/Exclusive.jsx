import React, { useEffect, useState } from "react";

const Exclusive = ({ register }) => {
  const [startTimeExcept, setStartTimeException] = useState(null);
  const [endTimeExcept, setEndTimeException] = useState(null);
  const [alternateSendTimeValue, setAlternateSendTimeValue] = useState(null);
  const [listExcludedTimeAlt, setListExcluedTimeAlt] = useState([]);

  useEffect(() => {
    let listExcludedTimeAltEx = Array.from(Array(24), (_, i) => i);
    setListExcluedTimeAlt(listExcludedTimeAltEx);
  }, []);

  return (
    <>
      <div
        id="excludedTime"
        className="w-100 d-flex flex-column align-items-start my-3"
      >
        <div className="push-message-add-form w-100 d-flex align-items-center my-3">
          <span className="push-message-span-form">
            除外時間
            <span style={{ color: "red" }}>*</span>
          </span>
          <span style={{ display: "flex", width: "80%" }}>
            <select
              id="excluded_time_from"
              name="excluded_time_from"
              className="push-message-input-form"
              style={{ width: "35%" }}
              {...register("excluded_time_from")}
              onChange={(e) => setStartTimeException(e.target.value)}
            >
              {listExcludedTimeAlt.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            &ensp; <span>~</span> &ensp;
            <select
              id="excluded_time_to"
              name="excluded_time_to"
              className="push-message-input-form"
              style={{ width: "35%" }}
              {...register("excluded_time_to")}
              onChange={(e) => setEndTimeException(e.target.value)}
            >
              {listExcludedTimeAlt.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </span>
        </div>
        {+endTimeExcept <= +startTimeExcept && (
          <p style={{ color: "#f00", marginLeft: "24%" }}>
            開始時間は、終了時間より前です。
          </p>
        )}
        <div className="push-message-add-form w-100 d-flex align-items-center my-3">
          <span className="push-message-span-form">
            代替送信時間
            <span style={{ color: "red" }}>*</span>
          </span>
          <span style={{ display: "flex", width: "80%" }}>
            <select
              id="alternate_send_time"
              name="alternate_send_time"
              className="push-message-input-form"
              style={{ width: "35%" }}
              {...register("alternate_send_time")}
              onChange={(e) => setAlternateSendTimeValue(e.target.value)}
            >
              {listExcludedTimeAlt.map((item, i) => (
                <option key={i} value={item}>
                  {listExcludedTimeAlt[i]}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>
      {+alternateSendTimeValue >= +startTimeExcept &&
        +alternateSendTimeValue <= +endTimeExcept && (
          <p style={{ color: "#f00", marginRight: "6%" }}>
            自動送信プッシュの時間帯除外を入力してください
          </p>
        )}
    </>
  );
};

export default Exclusive;
