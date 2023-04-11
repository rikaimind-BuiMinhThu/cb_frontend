import React, { useEffect, useState } from "react";
import { Card, CardHeader, Row, Col, CardBody } from "reactstrap";
import api from "../../api/api-management";
import { tokenExpired } from "api/tokenExpired";
import Cookies from "js-cookie";
import CreatePushMessageModal from "./components/CreatePushMessageModal";
import "../../assets/css/bot/push-message.css";
import PushMessageTable from "./components/PushMessageTable";
import AlertDialogSlide from "./components/AlertDialog";
import SimpleDialog from "./components/AlertSuccess";
import ListDeliveryPM from "./components/ListDeliveryPM";
import './styles/PushMessage.scss'

const PushMessageDashboard = () => {
  const [tabListPushMessage, setTabListPushMessage] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [startDateSearch, setStartDateSearch] = useState(new Date());
  const [msgNoti, setMsgNoti] = useState("");
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [listPushMessage, setListPushMessage] = useState([]);
  const [columnListPushMessage, setColumnListPushMessage] = useState([]);
  const [itemUpdate, setItemUpdate] = useState(null);
  const [itemDelete, setItemDelete] = useState(null);

  const handleOpenUpdatePM = (e) => {
    setOpenModal(true);
    setItemUpdate(e);
  };

  const reloadListPM = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/push_messages?chatbot_id=${bot_id}&page=1`
      );
      if (res.data.code === 1) {
        setListPushMessage(res.data.data);
      }
    } catch (error) {
      if (error?.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  const savePM = async ({ push_message }) => {
    const bot_id = Cookies.get("bot_id");
    if (!itemUpdate) {
      const res = await api.post(
        `/api/v1/managements/push_messages?chatbot_id=${bot_id}`,
        { push_message }
      );
      setOpenModal(false);
      if (res.data.code === 1) {
        setMsgNoti("正常にブッシュメッセージを追加されました！");
        setIsOpenNoti(true);
        setTimeout(() => {
          setIsOpenNoti(false);
          setMsgNoti("");
          reloadListPM();
        }, 2000);
      }
    }
    // const res = await api.patch(`/api/v1/managements/push_messages/${idPMUpdate}`, { push_message })
  };

  const handleChangeStatus = async (item) => {
    if (item?.subscribe_status === "subscribe") {
      try {
        const res = await api.patch(
          `/api/v1/managements/push_messages/${item?.id}/unsubscribe`
        );
        if (res) {
          setIsOpenNoti(true);
          setMsgNoti(`正常に更新されました！`);
          reloadListPM();
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        }
      } catch (err) {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      }
    } else {
      try {
        const res = await api.patch(
          `/api/v1/managements/push_messages/${item.id}/subscribe`
        );
        if (res) {
          setIsOpenNoti(true);
          setMsgNoti(`正常に更新されました！`);
          reloadListPM();
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        }
      } catch (err) {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      }
    }
  };

  const deletePM = async (idDelete) => {
    try {
      const res = await api.delete(
        `/api/v1/managements/push_messages/${idDelete}`
      );
      if (res.data.code === 1) {
        setMsgNoti("正常にブッシュメッセージを削除されました！");
        setIsOpenNoti(true);
        setTimeout(() => {
          setMsgNoti("");
          setIsOpenNoti(false);
          reloadListPM();
        }, 1500);
      }
      setIsOpenDelete(false);
    } catch (error) {
      if (error?.response.data.code === 0) {
        tokenExpired();
      }
      setIsOpenDelete(false);
    }
  };

  const getListPushMessage = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/push_messages?chatbot_id=${bot_id}&page=1`
      );
      if (res.data.code === 1) {
        setListPushMessage(res.data.data);
        const columns = [
          {
            title: "NO.",
            dataIndex: "index",
          },
          { title: "ブッシュメッセージ名", dataIndex: "title" },
          {
            title: "配信方法",
            dataIndex: "sending_method",
            render: (item, record) => (
              <p style={{ textTransform: "capitalize" }}>
                {record.sending_method}
              </p>
            ),
          },
          { title: "開始時間", dataIndex: "started_at" },
          {
            title: "状態",
            dataIndex: "id",
            render: (item, record) => (
              <>
                {record.subscribe_status === "subscribe"
                  ? "配信予約中"
                  : "配信停止"}
              </>
            ),
          },
          {
            title: "アクション",
            dataIndex: "id",
            render: (item, record) => (
              <div className="d-flex justify-content-center">
                <button
                  className={
                    record.subscribe_status === "subscribe"
                      ? "btn action_unsub"
                      : "btn action_sub"
                  }
                  onClick={() => handleChangeStatus(record)}
                >
                  {record.subscribe_status === "subscribe"
                    ? "配信停止"
                    : "配信する"}
                </button>
                <button
                  className="btn action_edit"
                  onClick={() => handleOpenUpdatePM(record)}
                >
                  編集
                </button>
                <button
                  className="btn action_delete"
                  onClick={() => handleOpenDeleteDialog(record)}
                >
                  削除
                </button>
              </div>
            ),
          },
        ];
        setColumnListPushMessage(columns);
      }
    } catch (error) {
      if (error?.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  const handleCloseCreateModal = () => {
    setOpenModal(false);
    setItemUpdate(null);
  };

  const handleOpenDeleteDialog = (e) => {
    setIsOpenDelete(true);
    setItemDelete(e);
  };

  const handleCloseDeleteDialog = () => {
    setIsOpenDelete(false);
    setItemDelete(null);
  };

  useEffect(() => {
    getListPushMessage();
  }, []);

  useEffect(() => {
    const date = new Date();
    setStartDateSearch(new Date(date.setDate(1)));
  }, []);

  return (
    <>
      {isOpenDelete && (
        <AlertDialogSlide
          openDialog={isOpenDelete}
          handleClose={handleCloseDeleteDialog}
          message="本当にこのプッシュメッセージを削除しますか。"
          resolver={deletePM}
          itemDelete={itemDelete}
        />
      )}
      {isOpenNoti && msgNoti && (
        <SimpleDialog
          open={isOpenNoti}
          message={msgNoti}
          handleClose={() => setIsOpenNoti(false)}
        />
      )}
      {openModal && (
        <CreatePushMessageModal
          openModal={openModal}
          saveForm={savePM}
          closeModal={handleCloseCreateModal}
          itemUpdate={itemUpdate}
        />
      )}
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center mt-3">
                <h4 className="mb-0">ブッシュメッセージ</h4>
                <div className="text-center mr-5">
                  <button
                    className="push-message-btn-adddition btn btn-success"
                    onClick={() => setOpenModal(true)}
                  >
                    追加
                  </button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="push-message-option" id="push-message-tab">
                  <div
                    id="payment_management_setting"
                    style={{ color: tabListPushMessage ? "#43b8af" : '#000' }}
                    className="push-message-option-item"
                    onClick={() => setTabListPushMessage(true)}
                  >
                    ブッシュメッセージ一覧
                  </div>
                  <div
                    id="payment_management_order_his"
                    style={{ color: !tabListPushMessage ? "#43b8af" : '#000' }}
                    className="push-message-option-item"
                    onClick={() => setTabListPushMessage(false)}
                  >
                    配信履歴
                  </div>
                </div>
                {tabListPushMessage ? <PushMessageTable
                  columns={columnListPushMessage}
                  dataSource={listPushMessage}
                /> : <ListDeliveryPM />}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PushMessageDashboard;
