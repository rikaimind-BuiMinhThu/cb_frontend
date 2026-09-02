import React, { useCallback, useEffect, useState } from 'react';
import { Button, message, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getSignInPath } from 'v2/variables/constants';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminConfirmModal,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';

function BotManagement() {
  const [botList, setBotList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const [msgConfirm, setMsgConfirm] = useState('');
  const [isStop, setIsStop] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [statusSelected, setStatusSelected] = useState('');
  const [search, setSearch] = useState('');
  const [isActiveSearch, setIsActiveSearch] = useState('all');

  useEffect(() => {
    if (
      Cookies.get('token') === undefined ||
      Cookies.get('token') === null ||
      Cookies.get('token') === ''
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get('is_auth') === 'false') {
      window.location.href = getSignInPath();
    }
  }, []);

  const fetchList = useCallback((pgIndex, status = isActiveSearch, name = search) => {
    setLoading(true);
    api
      .get(`/api/v1/managements/chatbots?page=${pgIndex}&name=${name}&status=${status}`)
      .then((res) => {
        setBotList(res.data?.data || []);
        setTotal(res.data?.total || 0);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [isActiveSearch, search]);

  useEffect(() => {
    fetchList(1);
  }, [fetchList]);

  function handleSearch() {
    setPage(1);
    fetchList(1);
  }

  function openBotSetting(id) {
    Cookies.remove('bot_id');
    Cookies.set('bot_type', 'bot');
    Cookies.set('bot_id', `${id}`);
    window.location.href = '/v2/admin/scenario-list';
  }

  function duplicateBot(id) {
    api
      .post(`/api/v1/managements/chatbots/${id}/duplicate`)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に複製されました！');
          fetchList(page);
        } else if (res.data.code === 2) {
          message.warning(res.data?.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  const confirmAction = () => {
    if (isStop) {
      api
        .patch(`/api/v1/managements/chatbots/${idSelected}`, {
          chatbot: { status: statusSelected === 'off' ? 'on' : 'off' },
        })
        .then((res) => {
          if (res.data?.code === 1) {
            message.success('正常に変更されました！');
            setIsStop(false);
            setIsOpenPopupConfirm(false);
            fetchList(page);
          } else if (res.data?.code === 2) {
            message.warning(res.data?.message);
            setIsStop(false);
            setIsOpenPopupConfirm(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
    if (isDelete) {
      api
        .delete(`/api/v1/managements/chatbots/${idSelected}`)
        .then((res) => {
          if (res.data?.code === 1) {
            message.success('正常に削除されました！');
            setIsDelete(false);
            setIsOpenPopupConfirm(false);
            fetchList(1);
            setPage(1);
          } else if (res.data?.code === 2) {
            message.warning(res.data?.message);
            setIsDelete(false);
            setIsOpenPopupConfirm(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
  };

  const handleStopBot = (id, status) => {
    setIsStop(true);
    setIsDelete(false);
    setIsOpenPopupConfirm(true);
    setMsgConfirm(status === 'on' ? '本当にボットをOFFにしますか。' : '本当にボットをONにしますか。');
    setIdSelected(id);
    setStatusSelected(status);
  };

  const handleDeleteBot = (id) => {
    setIsDelete(true);
    setIsStop(false);
    setIsOpenPopupConfirm(true);
    setMsgConfirm('本当にボットを削除しますか。');
    setIdSelected(id);
  };

  useAdminHeaderActions(
    <Link to="/v2/admin/add-bot-management">
      <AdminActionButton action="create" label="ボット作成" />
    </Link>
  );

  const columns = [
    {
      title: '番号',
      width: 70,
      render: (_, __, index) => index + 1 + 10 * (page - 1),
    },
    {
      title: 'ボット名',
      dataIndex: 'bot_name',
      render: (name, record) => (
        <Button type="link" onClick={() => openBotSetting(record.id)} style={{ padding: 0 }}>
          {name}
        </Button>
      ),
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'on' ? 'green' : 'default'}>{status?.toUpperCase()}</Tag>
      ),
    },
    {
      title: '所有者名',
      dataIndex: 'owner_name',
    },
    {
      title: '自分の権限',
      width: 120,
      render: () => '所有者',
    },
    {
      title: 'アクション',
      width: 320,
      render: (_, record) => (
        <Space wrap className="admin-table-actions">
          <AdminActionButton action="edit" iconOnly onClick={() => openBotSetting(record.id)} />
          <AdminActionButton action="duplicate" iconOnly onClick={() => duplicateBot(record.id)} />
          <Link
            to={`/v2/admin/demo-bot/${record.id}`}
            onClick={() => Cookies.set('bot_id', `${record.id}`)}
          >
            <AdminActionButton action="preview" label="デモ" iconOnly />
          </Link>
          <Button type="link" size="small" onClick={() => handleStopBot(record.id, record.status)}>
            {record.status === 'off' ? 'ON' : 'OFF'}
          </Button>
          <AdminActionButton action="delete" iconOnly onClick={() => handleDeleteBot(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminPage>
        <AdminTable
          loading={loading}
          columns={columns}
          dataSource={botList}
          rowKey="id"
          toolbar={
            <AdminSearchBar
              searchValue={search}
              onSearchChange={setSearch}
              onSearch={handleSearch}
              searchPlaceholder="ボット名 ..."
              filters={[
                {
                  key: 'status',
                  label: 'ボットステータス',
                  value: isActiveSearch,
                  onChange: setIsActiveSearch,
                  options: [
                    { value: 'all', label: 'すべて' },
                    { value: 'on', label: 'ON' },
                    { value: 'off', label: 'OFF' },
                  ],
                },
              ]}
            />
          }
          pagination={{
            current: page,
            total,
            pageSize: 10,
            onChange: (p) => {
              setPage(p);
              fetchList(p);
              window.scrollTo(0, 0);
            },
          }}
        />
      </AdminPage>

      <AdminConfirmModal
        open={isOpenPopupConfirm}
        message={msgConfirm}
        onOk={confirmAction}
        onCancel={() => {
          setIsOpenPopupConfirm(false);
          setIsStop(false);
          setIsDelete(false);
        }}
        danger={isDelete}
        cancelText={isDelete ? 'キャンセル' : 'いいえ'}
      />
    </>
  );
}

export default BotManagement;
