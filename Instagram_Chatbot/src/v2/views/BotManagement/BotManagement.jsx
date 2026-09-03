import React, { useCallback, useEffect, useState } from 'react';
import { Button, message, Space, Switch } from 'antd';
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
import 'v2/views/BotManagement/styles/bot-list.css';
import {
  ADD_BOT_PATH,
  API_SUCCESS_CODE,
  API_WARNING_CODE,
  AUTH_FALSE_VALUE,
  BOT_ID_COOKIE_KEY,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
  CANCEL_TEXT,
  CHATBOTS_API_PATH,
  COL_ACTIONS,
  COL_ACTIONS_WIDTH,
  COL_BOT_NAME,
  COL_NUMBER,
  COL_NUMBER_WIDTH,
  COL_OWNER_NAME,
  COL_PERMISSION,
  COL_PERMISSION_WIDTH,
  COL_STATUS,
  COL_STATUS_WIDTH,
  CONFIRM_BOT_DELETE,
  CONFIRM_BOT_OFF,
  CONFIRM_BOT_ON,
  CREATE_BOT_LABEL,
  DEMO_BOT_PATH_PREFIX,
  DEMO_LABEL,
  DUPLICATE_PATH_SUFFIX,
  FILTER_ALL_LABEL,
  FILTER_STATUS_KEY,
  FILTER_STATUS_LABEL,
  INITIAL_PAGE,
  IS_AUTH_COOKIE_KEY,
  NO_TEXT,
  PAGE_SIZE,
  ROLE_OWNER_LABEL,
  SCENARIO_LIST_PATH,
  SEARCH_PLACEHOLDER,
  STATUS_ALL,
  STATUS_OFF,
  STATUS_OFF_LABEL,
  STATUS_ON,
  STATUS_ON_LABEL,
  SUCCESS_DELETED,
  SUCCESS_DUPLICATED,
  SUCCESS_STATUS_CHANGED,
  TOKEN_COOKIE_KEY,
  TOKEN_EXPIRED_CODE,
} from './constants';

const BotManagement = () => {
  const [botList, setBotList] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const [msgConfirm, setMsgConfirm] = useState('');
  const [isStop, setIsStop] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [statusSelected, setStatusSelected] = useState('');
  const [search, setSearch] = useState('');
  const [isActiveSearch, setIsActiveSearch] = useState(STATUS_ALL);

  useEffect(() => {
    if (
      Cookies.get(TOKEN_COOKIE_KEY) === undefined ||
      Cookies.get(TOKEN_COOKIE_KEY) === null ||
      Cookies.get(TOKEN_COOKIE_KEY) === ''
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
    }
  }, []);

  const fetchList = useCallback((pgIndex, status = isActiveSearch, name = search) => {
    setLoading(true);
    api
      .get(`${CHATBOTS_API_PATH}?page=${pgIndex}&name=${name}&status=${status}`)
      .then((res) => {
        setBotList(res.data?.data || []);
        setTotal(res.data?.total || 0);
      })
      .catch((error) => {
        if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [isActiveSearch, search]);

  useEffect(() => {
    fetchList(INITIAL_PAGE);
  }, [fetchList]);

  const handleSearch = () => {
    setPage(INITIAL_PAGE);
    fetchList(INITIAL_PAGE);
  };

  const openBotSetting = (id) => {
    Cookies.remove(BOT_ID_COOKIE_KEY);
    Cookies.set(BOT_TYPE_COOKIE_KEY, BOT_TYPE_BOT);
    Cookies.set(BOT_ID_COOKIE_KEY, `${id}`);
    window.location.href = SCENARIO_LIST_PATH;
  };

  const duplicateBot = (id) => {
    api
      .post(`${CHATBOTS_API_PATH}/${id}/${DUPLICATE_PATH_SUFFIX}`)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(SUCCESS_DUPLICATED);
          fetchList(page);
        } else if (res.data.code === API_WARNING_CODE) {
          message.warning(res.data?.message);
        }
      })
      .catch((error) => {
        if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  };

  const confirmAction = () => {
    if (isStop) {
      api
        .patch(`${CHATBOTS_API_PATH}/${idSelected}`, {
          chatbot: { status: statusSelected === STATUS_OFF ? STATUS_ON : STATUS_OFF },
        })
        .then((res) => {
          if (res.data?.code === API_SUCCESS_CODE) {
            message.success(SUCCESS_STATUS_CHANGED);
            setIsStop(false);
            setIsOpenPopupConfirm(false);
            fetchList(page);
          } else if (res.data?.code === API_WARNING_CODE) {
            message.warning(res.data?.message);
            setIsStop(false);
            setIsOpenPopupConfirm(false);
          }
        })
        .catch((error) => {
          if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
            tokenExpired();
          }
        });
    }
    if (isDelete) {
      api
        .delete(`${CHATBOTS_API_PATH}/${idSelected}`)
        .then((res) => {
          if (res.data?.code === API_SUCCESS_CODE) {
            message.success(SUCCESS_DELETED);
            setIsDelete(false);
            setIsOpenPopupConfirm(false);
            fetchList(INITIAL_PAGE);
            setPage(INITIAL_PAGE);
          } else if (res.data?.code === API_WARNING_CODE) {
            message.warning(res.data?.message);
            setIsDelete(false);
            setIsOpenPopupConfirm(false);
          }
        })
        .catch((error) => {
          if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
            tokenExpired();
          }
        });
    }
  };

  const handleStopBot = (id, status) => {
    setIsStop(true);
    setIsDelete(false);
    setIsOpenPopupConfirm(true);
    setMsgConfirm(status === STATUS_ON ? CONFIRM_BOT_OFF : CONFIRM_BOT_ON);
    setIdSelected(id);
    setStatusSelected(status);
  };

  const handleDeleteBot = (id) => {
    setIsDelete(true);
    setIsStop(false);
    setIsOpenPopupConfirm(true);
    setMsgConfirm(CONFIRM_BOT_DELETE);
    setIdSelected(id);
  };

  useAdminHeaderActions(
    <Link to={ADD_BOT_PATH}>
      <AdminActionButton action="create" label={CREATE_BOT_LABEL} />
    </Link>
  );

  const columns = [
    {
      title: COL_STATUS,
      dataIndex: 'status',
      width: COL_STATUS_WIDTH,
      render: (status, record) => (
        <Switch
          checked={status === STATUS_ON}
          checkedChildren={STATUS_ON_LABEL}
          unCheckedChildren={STATUS_OFF_LABEL}
          onChange={() => handleStopBot(record.id, status)}
        />
      ),
    },
    {
      title: COL_NUMBER,
      width: COL_NUMBER_WIDTH,
      render: (_, __, index) => index + 1 + PAGE_SIZE * (page - 1),
    },
    {
      title: COL_BOT_NAME,
      dataIndex: 'bot_name',
      render: (name, record) => (
        <Button type="link" onClick={() => openBotSetting(record.id)} className="bot-name-link">
          {name}
        </Button>
      ),
    },
    {
      title: COL_OWNER_NAME,
      dataIndex: 'owner_name',
    },
    {
      title: COL_PERMISSION,
      width: COL_PERMISSION_WIDTH,
      render: () => ROLE_OWNER_LABEL,
    },
    {
      title: COL_ACTIONS,
      width: COL_ACTIONS_WIDTH,
      render: (_, record) => (
        <Space wrap className="admin-table-actions">
          <AdminActionButton action="edit" iconOnly onClick={() => openBotSetting(record.id)} />
          <AdminActionButton action="duplicate" iconOnly onClick={() => duplicateBot(record.id)} />
          <Link
            to={`${DEMO_BOT_PATH_PREFIX}/${record.id}`}
            onClick={() => Cookies.set(BOT_ID_COOKIE_KEY, `${record.id}`)}
          >
            <AdminActionButton action="preview" label={DEMO_LABEL} iconOnly />
          </Link>
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
              searchPlaceholder={SEARCH_PLACEHOLDER}
              filters={[
                {
                  key: FILTER_STATUS_KEY,
                  label: FILTER_STATUS_LABEL,
                  value: isActiveSearch,
                  onChange: setIsActiveSearch,
                  options: [
                    { value: STATUS_ALL, label: FILTER_ALL_LABEL },
                    { value: STATUS_ON, label: STATUS_ON_LABEL },
                    { value: STATUS_OFF, label: STATUS_OFF_LABEL },
                  ],
                },
              ]}
            />
          }
          pagination={{
            current: page,
            total,
            pageSize: PAGE_SIZE,
            onChange: (nextPage) => {
              setPage(nextPage);
              fetchList(nextPage);
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
        cancelText={isDelete ? CANCEL_TEXT : NO_TEXT}
      />
    </>
  );
};

export default BotManagement;
