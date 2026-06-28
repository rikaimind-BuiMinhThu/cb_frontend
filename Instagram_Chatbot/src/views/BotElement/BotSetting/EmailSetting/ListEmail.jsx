import React, { useEffect, useState } from 'react';
import { Button, Collapse, message, Space } from 'antd';
import api from './../../../../api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'api/tokenExpired';
import { AdminPage, AdminConfirmModal, AdminActionButton, useAdminHeaderActions } from '../../../../components/AdminShell';
import '../../../../assets/css/bot/email/list-email.css';

const { Panel } = Collapse;

function ListEmail() {
  const [emailList, setEmailList] = useState([]);
  const [clientEmail, setClientEmail] = useState(null);
  const [isOpenDuplicate, setIsOpenDuplicate] = useState(false);
  const [idEmail, setIdEmail] = useState();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEmails = (pgIndex) => {
    const bot_id = Cookies.get('bot_id');
    if (!bot_id) return;
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
      });
  };

  useEffect(() => {
    fetchEmails(1);
    return () => setEmailList([]);
  }, []);

  function duplicateEmail() {
    api
      .post(`/api/v1/managements/emails/${idEmail}/duplicate`)
      .then((res) => {
        setIsOpenDuplicate(false);
        if (res.data.code == 1) {
          message.success('正常に複製されました！');
          fetchEmails(page);
        } else if (res.data.code == 2) {
          message.warning(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  function deleteEmail() {
    api
      .delete(`/api/v1/managements/emails/${idEmail}`)
      .then((res) => {
        setIsOpenDelete(false);
        if (res.data.code == 1) {
          message.success('正常に削除されました！');
          fetchEmails(page);
        } else if (res.data.code == 2) {
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
      label="新メール追加"
      onClick={() => { window.location.href = '/admin/create-email'; }}
    />
  );

  return (
    <>
      <AdminPage>
        <div className="email-list-page">
          <Collapse accordion className="email-list-collapse">
            {emailList?.map((item) => (
              <Panel
                header={item?.email_template_name || item?.subject || 'メール'}
                key={item.id}
              >
                <table className="email-list-detail-table">
                  <tbody>
                    <tr>
                      <th>差出人</th>
                      <td>{item?.sender_name || '—'}</td>
                    </tr>
                    <tr>
                      <th>宛先</th>
                      <td>
                        {item?.to || '—'}
                        {clientEmail != null ? ` (${clientEmail})` : ''}
                      </td>
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
                    <tr>
                      <th>件名</th>
                      <td>{item?.subject || '—'}</td>
                    </tr>
                    <tr>
                      <th>テンプレート名</th>
                      <td>{item?.email_template_name || '—'}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="email-content-preview">
                  <div className="email-content-preview__header">メール内容</div>
                  <pre className="email-content-preview__body">{item?.content || '—'}</pre>
                </div>

                <Space className="email-list-actions admin-table-actions">
                  <AdminActionButton
                    action="edit"
                    onClick={() => { window.location.href = `/admin/edit-email/${item?.id}`; }}
                  />
                  <AdminActionButton
                    action="duplicate"
                    onClick={() => { setIsOpenDuplicate(true); setIdEmail(item.id); }}
                  />
                  <AdminActionButton
                    action="delete"
                    onClick={() => { setIsOpenDelete(true); setIdEmail(item.id); }}
                  />
                </Space>
              </Panel>
            ))}
          </Collapse>

          {total > 25 && (
            <div className="email-list-pagination">
              <Button disabled={page <= 1} onClick={() => { setPage(page - 1); fetchEmails(page - 1); }}>
                前へ
              </Button>
              <span style={{ margin: '0 16px' }}>{page} / {Math.ceil(total / 25)}</span>
              <Button
                disabled={page >= Math.ceil(total / 25)}
                onClick={() => { setPage(page + 1); fetchEmails(page + 1); }}
              >
                次へ
              </Button>
            </div>
          )}
        </div>
      </AdminPage>

      <AdminConfirmModal open={isOpenDuplicate} message="本当に複製しますか。" onOk={duplicateEmail} onCancel={() => setIsOpenDuplicate(false)} />
      <AdminConfirmModal open={isOpenDelete} message="本当に削除しますか。" onOk={deleteEmail} onCancel={() => setIsOpenDelete(false)} danger />
    </>
  );
}

export default ListEmail;
