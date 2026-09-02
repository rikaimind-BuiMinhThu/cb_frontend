import React, { useEffect, useState } from 'react';
import { Space, message } from 'antd';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminPage,
  AdminTable,
  AdminConfirmModal,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  CREATE_EMAIL_LABEL,
  DELETE_CONFIRM,
  DUPLICATE_CONFIRM,
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
    const bot_id = Cookies.get('bot_id');
    if (!bot_id) return;
    setLoading(true);
    api
      .get(`/api/v1/managements/emails?page=${pgIndex}&chatbot_id=${bot_id}`)
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
      .post(`/api/v1/managements/emails/${idEmail}/duplicate`)
      .then((res) => {
        setIsOpenDuplicate(false);
        if (res.data.code === 1) {
          message.success('正常に複製されました！');
          fetchEmails(page);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  const deleteEmail = () => {
    api
      .delete(`/api/v1/managements/emails/${idEmail}`)
      .then((res) => {
        setIsOpenDelete(false);
        if (res.data.code === 1) {
          message.success('正常に削除されました！');
          fetchEmails(page);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  useAdminHeaderActions(
    <AdminActionButton
      action="create"
      label={CREATE_EMAIL_LABEL}
      onClick={() => { window.location.href = getAdminRoutePath('/create-email'); }}
    />
  );

  const columns = [
    {
      title: 'テンプレート名',
      dataIndex: 'email_template_name',
      render: (value) => value || '—',
    },
    {
      title: '件名',
      dataIndex: 'subject',
      render: (value) => value || '—',
    },
    {
      title: '宛先',
      dataIndex: 'to',
      render: (value) => `${value || '—'}${clientEmail != null ? ` (${clientEmail})` : ''}`,
    },
    {
      title: 'アクション',
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
            pageSize: 25,
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
                      <th>差出人</th>
                      <td>{item?.sender_name || '—'}</td>
                    </tr>
                    <tr>
                      <th>CC</th>
                      <td>
                        {item?.cc?.length
                          ? item.cc.map((cc, ic) => <div key={ic}>{cc?.to}</div>)
                          : '—'}
                      </td>
                    </tr>
                    <tr>
                      <th>BCC</th>
                      <td>
                        {item?.bcc?.length
                          ? item.bcc.map((bcc, ib) => <div key={ib}>{bcc?.to}</div>)
                          : '—'}
                      </td>
                    </tr>
                    <tr>
                      <th>Reply-To</th>
                      <td>{item?.reply_to || '—'}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="email-content-preview">
                  <div className="email-content-preview__header">メール内容</div>
                  <pre className="email-content-preview__body">{item?.content || '—'}</pre>
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
