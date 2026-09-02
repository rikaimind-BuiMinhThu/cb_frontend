import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Input, Modal, Space, message } from 'antd';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminFormRow,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';

const PAGE_SIZE = 25;
const EMAIL_REGEX =
  /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

function ReplyMailManagement() {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [replyMails, setReplyMails] = useState([]);
  const [clientNames, setClientNames] = useState([]);
  const [currentClientId, setCurrentClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpenAddPopup, setIsOpenAddPopup] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addErrors, setAddErrors] = useState({ email: '', password: '' });
  const [adding, setAdding] = useState(false);
  const [rowDrafts, setRowDrafts] = useState({});
  const [rowErrors, setRowErrors] = useState({});

  const applyMailList = (data, itemTotal) => {
    const list = data || [];
    setReplyMails(list);
    setTotal(itemTotal || 0);
    setRowDrafts((prev) => {
      const next = {};
      list.forEach((mail) => {
        next[mail.client_id] = {
          email: mail.email || '',
          password: prev[mail.client_id]?.password || '',
        };
      });
      return next;
    });
  };

  const reloadReplyMails = useCallback((pageIndex = 1) => {
    setLoading(true);
    api
      .get(`/api/v1/managements/client_emails?page=${pageIndex}`)
      .then((res) => {
        if (res.data?.code === 1) {
          applyMailList(res.data?.data, res.data?.total);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reloadReplyMails(1);
    return () => {
      setReplyMails([]);
      setTotal(0);
    };
  }, [reloadReplyMails]);

  useEffect(() => {
    api
      .get('/api/v1/managements/get_client_with_name')
      .then((res) => {
        if (res.data?.code === 1) {
          setClientNames(res.data?.data || []);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });

    return () => {
      setClientNames([]);
    };
  }, []);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    reloadReplyMails(nextPage);
    document.querySelector('.main-panel')?.scrollTo(0, 0);
  };

  const openAddPopup = () => {
    setAddEmail('');
    setAddPassword('');
    setAddErrors({ email: '', password: '' });
    setShowAddPassword(false);
    setIsOpenAddPopup(true);
  };

  const closeAddPopup = useCallback(() => {
    setIsOpenAddPopup(false);
  }, []);

  const handleAddMail = () => {
    const email = addEmail.trim();
    const password = addPassword;
    const nextErrors = { email: '', password: '' };

    if (!email) {
      nextErrors.email = 'メールアドレスは、必ず指定してください。';
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = 'メールの正しい形式で入力してください：abc@abc.com';
    }
    if (!password) {
      nextErrors.password = 'パスワードは、必ず指定してください。';
    }
    if (nextErrors.email || nextErrors.password) {
      setAddErrors(nextErrors);
      return;
    }

    setAdding(true);
    api
      .post('/api/v1/managements/client_emails', {
        email: { email, password },
        client_id: currentClientId,
      })
      .then((res) => {
        if (res.data?.code === 1) {
          message.success('作成しました。');
          closeAddPopup();
          reloadReplyMails(page);
        } else {
          message.warning(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setAdding(false);
      });
  };

  const updateRowDraft = (clientId, field, value) => {
    setRowDrafts((prev) => ({
      ...prev,
      [clientId]: {
        email: prev[clientId]?.email || '',
        password: prev[clientId]?.password || '',
        [field]: value,
      },
    }));
    setRowErrors((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [field]: '',
      },
    }));
  };

  const handleUpdateBtnClick = useCallback((clientId, id) => {
    const draft = rowDrafts[clientId] || {};
    const email = (draft.email || '').trim();
    const password = draft.password || '';
    const nextErrors = { email: '', password: '' };

    if (!email) {
      nextErrors.email = 'メールアドレスは、必ず指定してください。';
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = 'メールの正しい形式で入力してください：abc@abc.com';
    }
    if (!password) {
      nextErrors.password = 'パスワードは、必ず指定してください。';
    }
    if (nextErrors.email || nextErrors.password) {
      setRowErrors((prev) => ({ ...prev, [clientId]: nextErrors }));
      return;
    }

    api
      .patch(`/api/v1/managements/client_emails/${id}`, {
        email: { email, password },
      })
      .then((res) => {
        if (res.data?.code === 1) {
          setRowDrafts((prev) => ({
            ...prev,
            [clientId]: { email, password: '' },
          }));
          message.success('更新しました。');
          closeAddPopup();
          reloadReplyMails(page);
        } else {
          message.warning(res.data?.data);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [rowDrafts, page, reloadReplyMails, closeAddPopup]);

  useAdminHeaderActions(
    <AdminActionButton
      action="create"
      label="返事メール追加"
      onClick={openAddPopup}
      disabled={!currentClientId}
    />
  );

  const columns = useMemo(
    () => [
      {
        title: 'クライアント名',
        dataIndex: 'full_name',
      },
      {
        title: '返事メール追加',
        render: (_, mail) => (
          <div>
            <Input
              placeholder="メール入力"
              value={rowDrafts[mail.client_id]?.email || ''}
              onChange={(e) => updateRowDraft(mail.client_id, 'email', e.target.value)}
            />
            {rowErrors[mail.client_id]?.email && (
              <div className="admin-client-form-error">{rowErrors[mail.client_id].email}</div>
            )}
          </div>
        ),
      },
      {
        title: 'パスワード',
        render: (_, mail) => (
          <div>
            <Input
              placeholder="パスワード入力"
              value={rowDrafts[mail.client_id]?.password || ''}
              onChange={(e) => updateRowDraft(mail.client_id, 'password', e.target.value)}
            />
            {rowErrors[mail.client_id]?.password && (
              <div className="admin-client-form-error">{rowErrors[mail.client_id].password}</div>
            )}
          </div>
        ),
      },
      {
        title: 'アクション',
        width: 120,
        render: (_, mail) => (
          <Space className="admin-table-actions">
            <AdminActionButton
              action="save"
              label="更新"
              iconOnly
              onClick={() => handleUpdateBtnClick(mail.client_id, mail.id)}
            />
          </Space>
        ),
      },
    ],
    [rowDrafts, rowErrors, handleUpdateBtnClick]
  );

  return (
    <>
      <AdminPage>
        <AdminTable
          loading={loading}
          columns={columns}
          dataSource={replyMails}
          rowKey={(mail) => mail.id ?? mail.client_id}
          toolbar={
            <AdminSearchBar
              filters={[
                {
                  key: 'client',
                  label: 'クライアント',
                  value: currentClientId || undefined,
                  onChange: (value) => setCurrentClientId(value || ''),
                  placeholder: 'クライアントを選択してください。',
                  options: clientNames.map((client) => ({
                    value: client.id,
                    label: client.name,
                  })),
                },
              ]}
            />
          }
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: handlePageChange,
          }}
        />
      </AdminPage>

      <Modal
        title="メール追加"
        open={isOpenAddPopup}
        onCancel={closeAddPopup}
        centered
        destroyOnClose
        footer={
          <div className="admin-form-actions">
            <AdminActionButton action="cancel" onClick={closeAddPopup} />
            <AdminActionButton action="create" label="追加" loading={adding} onClick={handleAddMail} />
          </div>
        }
      >
        <AdminFormRow label="メールアドレス" required error={addErrors.email} htmlFor="add-reply-email">
          <Input
            id="add-reply-email"
            placeholder="メール入力"
            value={addEmail}
            onChange={(e) => {
              setAddEmail(e.target.value);
              setAddErrors((prev) => ({ ...prev, email: '' }));
            }}
          />
        </AdminFormRow>
        <AdminFormRow label="パスワード" required error={addErrors.password} htmlFor="add-reply-password">
          <Space align="center">
            <Input
              id="add-reply-password"
              placeholder="パスワード入力"
              type={showAddPassword ? 'text' : 'password'}
              value={addPassword}
              onChange={(e) => {
                setAddPassword(e.target.value);
                setAddErrors((prev) => ({ ...prev, password: '' }));
              }}
            />
            <Checkbox
              checked={showAddPassword}
              onChange={(e) => setShowAddPassword(e.target.checked)}
            />
          </Space>
        </AdminFormRow>
      </Modal>
    </>
  );
}

export default ReplyMailManagement;
