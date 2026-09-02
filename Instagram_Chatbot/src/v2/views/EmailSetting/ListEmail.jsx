import React, { useEffect, useState } from 'react';
import { Space, message } from 'antd';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'v2/api/tokenExpired';
import { BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import {
  AdminPage,
  AdminTable,
  AdminConfirmModal,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  EMAILS_PATH,
  PAGE_SIZE,
  EMPTY_CELL,
  CREATE_EMAIL_LABEL,
  DELETE_CONFIRM,
  DUPLICATE_CONFIRM,
  DUPLICATE_SUCCESS,
  DELETE_SUCCESS,
  COL_TEMPLATE_NAME,
  COL_SUBJECT,
  COL_TO,
  LABEL_SENDER,
  LABEL_CC,
  LABEL_BCC,
  LABEL_REPLY_TO,
  LABEL_ACTION,
  EXPAND_CONTENT_HEADER,
} from './constants';
import 'v2/assets/css/bot/email/list-email.css';

const ListEmail = () => {
  const [emailList, setEmailList] = useState([]);
  const [clientEmail, setClientEmail] = useState(null);
  const [isOpenDuplicate, setIsOpenDuplicate] = useState(false);
  const [idEmail, setIdEmail] = useState();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchEmails = (pgIndex) => {
    const bot_id = Cookies.get(BOT_ID_COOKIE_KEY);
    if (!bot_id) return;
    setLoading(true);
    api
      .get(`${EMAILS_PATH}?page=${pgIndex}&chatbot_id=${bot_id}`)
      .then((res) => {
        if (res.data?.code === 1) {
          setEmailList(res.data?.data || []);
          setTotal(res.data.total || 0);
          setClientEmail(res?.data?.client_email);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmails(1);
    return () => setEmailList([]);
  }, []);

  const duplicateEmail = () => {
    api
      .post(`${EMAILS_PATH}/${idEmail}/duplicate`)
      .then((res) => {
        setIsOpenDuplicate(false);
        if (res.data.code === 1) {
          message.success(DUPLICATE_SUCCESS);
          fetchEmails(page);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  };

  const deleteEmail = () => {
    api
      .delete(`${EMAILS_PATH}/${idEmail}`)
      .then((res) => {
        setIsOpenDelete(false);
        if (res.data.code === 1) {
          message.success(DELETE_SUCCESS);
          fetchEmails(page);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  };

  useAdminHeaderActions(
    <AdminActionButton
      action="create"
      label={CREATE_EMAIL_LABEL}
      onClick={() => { window.location.href = getAdminRoutePath('/create-email'); }}
    />
  );

  const columns = [
    {
      title: COL_TEMPLATE_NAME,
      dataIndex: 'email_template_name',
      render: (value) => value || EMPTY_CELL,
    },
    {
      title: COL_SUBJECT,
      dataIndex: 'subject',
      render: (value) => value || EMPTY_CELL,
    },
    {
      title: COL_TO,
      dataIndex: 'to',
      render: (value) => `${value || EMPTY_CELL}${clientEmail != null ? ` (${clientEmail})` : ''}`,
    },
    {
      title: LABEL_ACTION,
      width: 180,
      render: (_, item) => (
        <Space className="admin-table-actions">
          <AdminActionButton
            action="edit"
            iconOnly
            onClick={() => { window.location.href = getAdminRoutePath(`/edit-email/${item?.id}`); }}
          />
          <AdminActionButton
            action="duplicate"
            iconOnly
            onClick={() => { setIsOpenDuplicate(true); setIdEmail(item.id); }}
          />
          <AdminActionButton
            action="delete"
            iconOnly
            onClick={() => { setIsOpenDelete(true); setIdEmail(item.id); }}
          />
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
          dataSource={emailList}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: (p) => {
              setPage(p);
              fetchEmails(p);
            },
          }}
          expandable={{
            expandedRowRender: (item) => (
              <div className="email-list-page">
                <table className="email-list-detail-table">
                  <tbody>
                    <tr>
                      <th>{LABEL_SENDER}</th>
                      <td>{item?.sender_name || EMPTY_CELL}</td>
                    </tr>
                    <tr>
                      <th>{LABEL_CC}</th>
                      <td>
                        {item?.cc?.length
                          ? item.cc.map((cc, ic) => <div key={ic}>{cc?.to}</div>)
                          : EMPTY_CELL}
                      </td>
                    </tr>
                    <tr>
                      <th>{LABEL_BCC}</th>
                      <td>
                        {item?.bcc?.length
                          ? item.bcc.map((bcc, ib) => <div key={ib}>{bcc?.to}</div>)
                          : EMPTY_CELL}
                      </td>
                    </tr>
                    <tr>
                      <th>{LABEL_REPLY_TO}</th>
                      <td>{item?.reply_to || EMPTY_CELL}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="email-content-preview">
                  <div className="email-content-preview__header">{EXPAND_CONTENT_HEADER}</div>
                  <pre className="email-content-preview__body">{item?.content || EMPTY_CELL}</pre>
                </div>
              </div>
            ),
          }}
        />
      </AdminPage>

      <AdminConfirmModal open={isOpenDuplicate} message={DUPLICATE_CONFIRM} onOk={duplicateEmail} onCancel={() => setIsOpenDuplicate(false)} />
      <AdminConfirmModal open={isOpenDelete} message={DELETE_CONFIRM} onOk={deleteEmail} onCancel={() => setIsOpenDelete(false)} danger />
    </>
  );
};

export default ListEmail;
