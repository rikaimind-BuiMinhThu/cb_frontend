import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Space, Tag, message } from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminConfirmModal, AdminTable, AdminActionButton } from 'v2/components/AdminShell';
import SavePushMessageDialog from './SavePushMessageDialog';
import {
  PUSH_MESSAGES_PATH,
  SUCCESS_DELETE,
  SUCCESS_SAVE,
  COL_NO,
  COL_TITLE,
  COL_SENDING_METHOD,
  COL_STARTED_AT,
  COL_STATUS,
  COL_ACTION,
  TAG_EMAIL,
  TAG_SMS,
  TAG_SUBSCRIBE,
  TAG_UNSUBSCRIBE,
  BTN_PAUSE,
  BTN_RESUME,
  EMPTY_CELL,
  EMPTY_LIST,
  DELETE_CONFIRM,
  DELETE_OK,
  METHOD_EMAIL,
  STATUS_SUBSCRIBE,
  STATUS_UNSUBSCRIBE,
} from './constants';

const PushMessageList = ({ tick }) => {
  const { botId } = useParams();
  const [list, setList] = useState([]);
  const [updateItem, setUpdateItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(() => {
    setLoading(true);
    api
      .get(`${PUSH_MESSAGES_PATH}?chatbot_id=${botId}&page=all`)
      .then((res) => {
        if (res.data.code === 1) {
          setList(res.data.data);
        } else if (res.data.code === 2) {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [botId]);

  useEffect(() => {
    fetchList();
  }, [fetchList, tick]);

  const onDelete = () => {
    api
      .delete(`${PUSH_MESSAGES_PATH}/${deleteId}`)
      .then((res) => {
        if (res.data.code === 1) {
          message.success(SUCCESS_DELETE);
          setList((pre) => pre.filter((each) => each.id !== deleteId));
          setDeleteId(null);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const onChangeStatus = (item) => {
    const url =
      item.subscribe_status === STATUS_SUBSCRIBE
        ? `${PUSH_MESSAGES_PATH}/${item.id}/unsubscribe`
        : `${PUSH_MESSAGES_PATH}/${item.id}/subscribe`;
    const newStatus =
      item.subscribe_status === STATUS_SUBSCRIBE ? STATUS_UNSUBSCRIBE : STATUS_SUBSCRIBE;

    api
      .patch(url)
      .then((res) => {
        if (res.data.code === 1) {
          message.success(SUCCESS_SAVE);
          setList((pre) =>
            pre.map((each) =>
              each.id === item.id
                ? { ...each, subscribe_status: newStatus }
                : each
            )
          );
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const handleUpdateSuccess = (item) => {
    if (item) {
      setList((pre) =>
        pre.map((each) => (each.id === item.id ? { ...each, ...item } : each))
      );
    }
    setUpdateItem(null);
  };

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
        dataIndex: 'title',
        ellipsis: true,
      },
      {
        title: COL_SENDING_METHOD,
        dataIndex: 'sending_method',
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
        title: COL_STARTED_AT,
        dataIndex: 'started_at',
        width: 180,
        render: (value) =>
          value ? value.substring(0, 19).replaceAll('T', ' ') : EMPTY_CELL,
      },
      {
        title: COL_STATUS,
        dataIndex: 'subscribe_status',
        width: 130,
        align: 'center',
        render: (status) =>
          status === STATUS_SUBSCRIBE ? (
            <Tag color="success">{TAG_SUBSCRIBE}</Tag>
          ) : (
            <Tag>{TAG_UNSUBSCRIBE}</Tag>
          ),
      },
      {
        title: COL_ACTION,
        align: 'right',
        width: 260,
        render: (_, row) => (
          <Space size={4} className="admin-table-actions">
            {row.subscribe_status === STATUS_SUBSCRIBE ? (
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => onChangeStatus(row)}
              >
                {BTN_PAUSE}
              </Button>
            ) : (
              <Button
                size="small"
                type="primary"
                ghost
                icon={<PlayCircleOutlined />}
                onClick={() => onChangeStatus(row)}
              >
                {BTN_RESUME}
              </Button>
            )}
            <AdminActionButton action="edit" iconOnly onClick={() => setUpdateItem(row)} />
            <AdminActionButton action="delete" iconOnly onClick={() => setDeleteId(row.id)} />
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
        emptyDescription={EMPTY_LIST}
      />

      <AdminConfirmModal
        open={Boolean(deleteId)}
        message={DELETE_CONFIRM}
        okText={DELETE_OK}
        danger
        onOk={onDelete}
        onCancel={() => setDeleteId(null)}
      />

      {updateItem && (
        <SavePushMessageDialog
          botId={botId}
          resolver={handleUpdateSuccess}
          item={updateItem}
          onCancel={() => setUpdateItem(null)}
        />
      )}
    </>
  );
};

PushMessageList.propTypes = {
  tick: PropTypes.number,
};

export default PushMessageList;
