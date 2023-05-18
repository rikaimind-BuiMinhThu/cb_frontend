import React, { useEffect, useState } from "react";
import { Space, notification, Table, Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import api from "api/api-management";
import { tokenExpired } from "api/tokenExpired";
import SavePushMessageDialog from "./SavePushMessageDialog";

const columns = [
  {
    title: "No.",
    dataIndex: "no",
  },
  {
    title: "プッシュメッセージ名",
    dataIndex: "title",
  },
  {
    title: "送信方法",
    dataIndex: "sending_method",
  },
  {
    title: "開始日時",
    dataIndex: "started_at",
  },
  {
    title: "状態",
    dataIndex: "status",
  },
  {
    title: "アクション",
    dataIndex: "action",
  },
];

const PushMessageList = ({ tick }) => {
  const { botId } = useParams();
  const [list, setList] = useState([]);
  const [updateItem, setUpdateItem] = useState(null);
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    api
      .get(`/api/v1/managements/push_messages?chatbot_id=${botId}&page=all`)
      .then((res) => {
        if (res.data.code === 1) {
          const list = res.data.data.map(createRenderItem);
          setList(list);
        } else if (res.data.code == 2) {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data.code == 0) {
          tokenExpired();
        }
      });
  }, [tick]);

  const onDelete = (id) => {
    api
      .delete(`/api/v1/managements/push_messages/${id}`)
      .then((res) => {
        if (res.data.code == 1) {
          openDeleteNotification("success", "正常に削除しました。");
          setList((pre) =>
            pre
              .filter((each) => each.id !== res.data.message.id)
              .map(createRenderItem)
          );
        } else if (res.data.code == 2) {
          openDeleteNotification("warning", res.data.message);
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response.data.code == 0) {
          tokenExpired();
        }
      });
  };

  const onChangeStatus = (item) => () => {
    if (!item) {
      return;
    }
    const url =
      item.subscribe_status === "subscribe"
        ? `/api/v1/managements/push_messages/${item?.id}/unsubscribe`
        : `/api/v1/managements/push_messages/${item?.id}/subscribe`;
    const newStatus =
      item.subscribe_status === "subscribe" ? "unsubscribe" : "subscribe";
    api
      .patch(url)
      .then((res) => {
        if (res.data.code == 1) {
          openDeleteNotification(
            "success",
            "プッシュメッセージを正常に保存しました。"
          );
          setList((pre) =>
            pre.map((each, index) => {
              if (each.id === item.id) {
                each.subscribe_status = newStatus;
                return createRenderItem(each, index);
              }
              return each;
            })
          );
        } else if (res.data.code == 2) {
          openDeleteNotification("warning", res.data.message);
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response.data.code == 0) {
          tokenExpired();
        }
      });
  };

  const openDeleteNotification = (type, message) => {
    notificationApi[type]({
      message: message || "",
      description: "",
      placement: "top",
    });
  };

  const showDeleteConfirm = (id) => () => {
    Modal.confirm({
      title: "確認",
      icon: <ExclamationCircleFilled />,
      content: "本当に削除しますか。",
      okText: "削除",
      okType: "danger",
      cancelText: "閉じる",
      onOk() {
        onDelete(id);
      },
    });
  };

  const onClickUpdate = (item) => () => {
    setUpdateItem(item);
  };

  const createRenderItem = (item, index) => {
    return {
      ...item,
      no: index + 1,
      started_at: item.started_at.substring(0, 19).replaceAll("T", " "),
      status: item.subscribe_status === "subscribe" ? "配信予約中" : "配信停止",
      sending_method: item.sending_method === "email" ? "メール" : "SMS",
      action: (
        <Space>
          {item.subscribe_status === "subscribe" ? (
            <Button danger onClick={onChangeStatus(item)}>
              配信停止
            </Button>
          ) : (
            <Button onClick={onChangeStatus(item)}>配信する</Button>
          )}
          <Button type="primary" onClick={onClickUpdate(item)}>
            編集
          </Button>
          <Button danger onClick={showDeleteConfirm(item.id)}>
            削除
          </Button>
        </Space>
      ),
    };
  };

  const handleUpdateSuccess = (item) => {
    item &&
      setList((pre) =>
        pre.map((each, index) =>
          each.id === item.id
            ? createRenderItem(item, index)
            : createRenderItem(each, index)
        )
      );
    setUpdateItem(null);
  };

  const handleCancelUpdate = () => {
    setUpdateItem(null);
  };

  return (
    <div>
      {contextHolder}
      <Table columns={columns} dataSource={list} />
      {updateItem && (
        <SavePushMessageDialog
          botId={botId}
          resolver={handleUpdateSuccess}
          item={updateItem}
          onCancel={handleCancelUpdate}
        />
      )}
    </div>
  );
};

export default PushMessageList;
