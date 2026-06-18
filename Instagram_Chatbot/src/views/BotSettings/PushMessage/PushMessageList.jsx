import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Space, Tag, message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import api from 'api/api-management';
import { tokenExpired } from 'api/tokenExpired';
import { AdminConfirmModal, AdminTable } from '../../../components/AdminShell';
import SavePushMessageDialog from './SavePushMessageDialog';

const PushMessageList = ({ tick }) => {
  const { botId } = useParams();
  const [list, setList] = useState([]);
  const [updateItem, setUpdateItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/v1/managements/push_messages?chatbot_id=${botId}&page=all`)
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
      .delete(`/api/v1/managements/push_messages/${deleteId}`)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に削除しました。');
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
      item.subscribe_status === 'subscribe'
        ? `/api/v1/managements/push_messages/${item.id}/unsubscribe`
        : `/api/v1/managements/push_messages/${item.id}/subscribe`;
    const newStatus =
      item.subscribe_status === 'subscribe' ? 'unsubscribe' : 'subscribe';

    api
      .patch(url)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('プッシュメッセージを正常に保存しました。');
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
        title: 'No.',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'プッシュメッセージ名',
        dataIndex: 'title',
        ellipsis: true,
      },
      {
        title: '送信方法',
        dataIndex: 'sending_method',
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
        title: '開始日時',
        dataIndex: 'started_at',
        width: 180,
        render: (value) =>
          value ? value.substring(0, 19).replaceAll('T', ' ') : '—',
      },
      {
        title: '状態',
        dataIndex: 'subscribe_status',
        width: 130,
        align: 'center',
        render: (status) =>
          status === 'subscribe' ? (
            <Tag color="success">配信予約中</Tag>
          ) : (
            <Tag>配信停止</Tag>
          ),
      },
      {
        title: 'アクション',
        align: 'right',
        width: 260,
        render: (_, row) => (
          <Space size={4} className="admin-table-actions">
            {row.subscribe_status === 'subscribe' ? (
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => onChangeStatus(row)}
              >
                配信停止
              </Button>
            ) : (
              <Button
                size="small"
                type="primary"
                ghost
                icon={<PlayCircleOutlined />}
                onClick={() => onChangeStatus(row)}
              >
                配信する
              </Button>
            )}
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => setUpdateItem(row)}
            >
              編集
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteId(row.id)}
            >
              削除
            </Button>
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
        emptyDescription="プッシュメッセージがありません"
      />

      <AdminConfirmModal
        open={Boolean(deleteId)}
        message="本当に削除しますか。"
        okText="削除"
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

export default PushMessageList;
