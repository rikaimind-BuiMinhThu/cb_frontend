import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useForm } from "react-hook-form";
import api from "../../../api/api-management";
import { tokenExpired } from "api/tokenExpired";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../validates/CreateTableSchema";
import ExclusiveTime from "./ExclusiveTime";
import PushMessageVariable from "./PushMessageVariable";
import LastDateTimeSince from "./LastDateTImeSince";

const CreatePushMessageModal = ({
  openModal,
  saveForm,
  closeModal,
  itemUpdate,
}) => {
  const [emailList, setEmailList] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [sendingMethodText, setSendingMethodText] = useState("email");
  const [isChecked, setIsChecked] = useState(false);
  const [alternateSendTime, setAlternateSendTime] = useState([]);
  const [customDiv, setCustomDiv] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: itemUpdate
      ? {
          title: itemUpdate.title,
          email_id: itemUpdate.email_id,
          last_message_datetime_since: itemUpdate.last_message_datetime_since,
          alternate_send_time: itemUpdate.has_timezone_exclusion
            ? itemUpdate.alternate_send_time
            : 0,
          excluded_time_from: itemUpdate.has_timezone_exclusion
            ? itemUpdate.excluded_time_from
            : 0,
          excluded_time_to: itemUpdate.has_timezone_exclusion
            ? itemUpdate.excluded_time_to
            : 0,
        }
      : {
          last_message_datetime_since: 1,
        },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (errors && Object.keys(errors) > 0) return;
    if (!startDate) return;
    const { checkVar, newData } = resolveDataVariable(data);
    const result = {
      ...newData,
      email_id: newData.email_id || emailList[0]?.id,
      started_at: startDate,
      last_message_datetime_since: newData.last_message_datetime_since || "1",
      variables: Object.values(checkVar),
    };
    saveForm({ push_message: result });
  };

  const resolveDataVariable = (data) => {
    const checkVar = {};
    const keys = Object.keys(data);
    keys.forEach((key, index) => {
      if (key.indexOf("___") >= 0) {
        const [item, i] = key.split("___");
        if (!checkVar[i]) {
          checkVar[i] = {};
        }
        checkVar[i][item] = data[key];
        delete data[key];
      }
    });
    Object.keys(checkVar).forEach((keyVariable) => {
      console.log(checkVar[keyVariable].value);
      if (!checkVar[keyVariable].value) {
        console.log(true);
        delete checkVar[keyVariable];
      }
    });
    return { checkVar, newData: data };
  };

  const getEmailList = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/emails?page=all&chatbot_id=${bot_id}`
      );
      if (res.data.code == 1) {
        setEmailList(res.data.data);
      }
    } catch (error) {
      if (error?.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  const handleChangeDate = (date) => {
    if (date == null) {
      if (date.getTime() > Date.now()) {
        setStartDate(startDate);
        setIsChecked(isChecked);
      }
    } else {
      setStartDate(date);
    }
  };

  const handleAddDiv = () => {
    const temp = [...customDiv, 1];
    setCustomDiv(temp);
  };

  const handleRemoveDiv = (i) => {
    const temp = [...customDiv.slice(0, i), ...customDiv.slice(i + 1)];
    setCustomDiv(temp);
  };

  const handleChangeSendingMethod = (e) => {
    const sendingMethod = e.target.value;
    setSendingMethodText(sendingMethod);
  };

  useEffect(() => {
    let listAlternateTime = Array.from(Array(36), (_, i) => i + 1);
    setAlternateSendTime(listAlternateTime);
  }, []);

  useEffect(() => {
    getEmailList();
  }, []);

  useEffect(() => {
    if (itemUpdate) {
      setStartDate(new Date(itemUpdate.started_at));
      setIsChecked(itemUpdate.has_timezone_exclusion === "yes");
      setCustomDiv(itemUpdate.variables);
    }
  }, [itemUpdate]);

  return (
    <>
      <Modal
        style={{ zIndex: 1000 }}
        open={openModal}
        onCancel={closeModal}
        title={itemUpdate ? "編集" : "追加"}
        footer={[
          <>
            <div className="d-flex justify-content-between">
              <button className="btn-pm--back" onClick={closeModal}>
                キャンセル
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="my-1 btn-pm--save"
              >
                保存
              </button>
            </div>
          </>,
        ]}
      >
        <form className="form-modal d-flex flex-column justify-content-center align-items-center h-100 px-5">
          <div className="w-100 d-flex justify-content-between align-items-start my-3">
            <label className="push-message-span-form">
              ブッシュメッセージ名<span style={{ color: "red" }}>*</span>
            </label>
            <div className="d-flex flex-column" style={{ width: "70%" }}>
              <input
                className="push-message-input-form w-100"
                type="text"
                placeholder="Name"
                {...register("title")}
              />
              {errors && errors.title && (
                <p style={{ color: "#f00" }}>
                  ブッシュメッセージ名は、必ず指定してください。
                </p>
              )}
            </div>
          </div>

          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <label className="push-message-span-form">送信方法</label>
            <select
              className="push-message-input-form"
              {...register("sending_method")}
              onChange={handleChangeSendingMethod}
            >
              <option value="email">メール</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          {sendingMethodText === "email" && (
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <label className="push-message-span-form">
                {sendingMethodText === "email" ? "メール" : "SMS"}
                <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="push-message-input-form"
                {...register("email_id")}
              >
                {emailList?.length &&
                  emailList.map((x, i) => (
                    <option
                      key={i}
                      value={x.id}
                      selected={itemUpdate && itemUpdate.email_id === x.id}
                    >
                      {x.email_template_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {errors && errors.name && (
            <p style={{ color: "#f00" }}>{errors.email_id.message}</p>
          )}
          <div className="push-message-add-form w-100 d-flex justify-content-between align-items-start my-3">
            <span className="push-message-span-form">
              開始日時
              <span style={{ color: "red" }}>*</span>
            </span>
            <div
              className="push-message-input-form d-flex flex-column"
              style={{ height: "auto" }}
            >
              <DatePicker
                className="pm_date_pick"
                name="started_at"
                id="startDateTime"
                locale="ja"
                selected={startDate}
                onChange={(date) => handleChangeDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="時刻"
                dateFormat="yyyy-MM-dd HH:mm:ss"
              />
              {Date.now() > startDate.getTime() && (
                <p style={{ color: "#f00" }} className="my-3">
                  は、必ず指定してください。
                </p>
              )}
            </div>
          </div>
          <div className="push-message-add-form ">
            <span className="push-message-span-form"></span>
            <span className="push-message-input-form">
              ※プッシュメッセージを送信する日時を指定します。 <br />
            </span>
          </div>
          <div className="push-message-add-form w-100 d-flex align-items-center my-3">
            <span className="push-message-span-form">
              自動送信プッシュの時間帯除外
            </span>
            <span>
              <input
                id="has_timezone_exclusion"
                className="ml-4"
                name="has_timezone_exclusion"
                {...register("has_timezone_exclusion")}
                onChange={(e) => setIsChecked(!isChecked)}
                type="checkbox"
                checked={isChecked}
                style={{ marginTop: "15px" }}
              />
            </span>
          </div>
          {isChecked && <ExclusiveTime register={register} />}
          <div
            className="d-flex footer-var flex-column w-100"
            style={{ borderTop: "1px solid #aaa", padding: "20px 0px" }}
          >
            <div>
              <span>対象者指定</span>
              <p>
                ※条件を加えることでプッシュメッセージを送信する対象者を絞り込むことができます。
              </p>
              <p>
                現在、配信対象者は0名です。.
                <span style={{ color: "blue" }}> [更新]</span>
              </p>
            </div>
            <LastDateTimeSince register={register} alternateSendTime={alternateSendTime} handleAddDiv={handleAddDiv} />
            <div className="d-flex flex-column justify-content-center align-items-center">
              {customDiv.map((item, i) => (
                <div
                  id={`newCDiv${i}`}
                  style={{ width: "100%", display: "flex" }}
                  key={i}
                >
                  <PushMessageVariable
                    item={item}
                    i={i}
                    handleRemoveDiv={handleRemoveDiv}
                    register={register}
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePushMessageModal;
