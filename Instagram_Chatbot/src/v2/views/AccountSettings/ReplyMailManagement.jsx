import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Input, Modal, Space, message } from 'antd';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminFormRow,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { EMAIL_LABEL, EMPTY_VALUE } from './basicSettingConstants';
import { API_EXPIRED_CODE } from './constants';
import {
  ADD_BUTTON_LABEL,
  ADD_EMAIL_INPUT_ID,
  ADD_MAIL_TITLE,
  ADD_PASSWORD_INPUT_ID,
  ADD_REPLY_MAIL_LABEL,
  ALIGN_CENTER,
  CLIENT_EMAILS_PATH,
  CLIENT_FILTER_LABEL,
  CLIENT_NAMES_PATH,
  CLIENT_SELECT_PLACEHOLDER,
  COL_ACTIONS,
  COL_ACTIONS_WIDTH,
  COL_CLIENT_NAME,
  COL_PASSWORD,
  CREATE_SUCCESS_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  EMAIL_INPUT_PLACEHOLDER,
  EMAIL_REGEX,
  EMAIL_REQUIRED_MESSAGE,
  EMPTY_COUNT,
  EMPTY_FIELD_ERRORS,
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FILTER_KEY_CLIENT,
  FIRST_PAGE,
  getClientEmailItemPath,
  getClientEmailsPagePath,
  INPUT_TYPE_PASSWORD,
  INPUT_TYPE_TEXT,
  MAIN_PANEL_SELECTOR,
  PAGE_SIZE,
  PASSWORD_INPUT_PLACEHOLDER,
  PASSWORD_LABEL,
  PASSWORD_REQUIRED_MESSAGE,
  SCROLL_ORIGIN,
  UPDATE_BUTTON_LABEL,
  UPDATE_SUCCESS_MESSAGE,
} from './replyMailConstants';

const ReplyMailManagement = () => {
  const [total, setTotal] = useState(EMPTY_COUNT);
  const [page, setPage] = useState(FIRST_PAGE);
  const [replyMails, setReplyMails] = useState([]);
  const [clientNames, setClientNames] = useState([]);
  const [currentClientId, setCurrentClientId] = useState(EMPTY_VALUE);
  const [loading, setLoading] = useState(false);
  const [isOpenAddPopup, setIsOpenAddPopup] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addEmail, setAddEmail] = useState(EMPTY_VALUE);
  const [addPassword, setAddPassword] = useState(EMPTY_VALUE);
  const [addErrors, setAddErrors] = useState(EMPTY_FIELD_ERRORS);
  const [adding, setAdding] = useState(false);
  const [rowDrafts, setRowDrafts] = useState({});
  const [rowErrors, setRowErrors] = useState({});

  const applyMailList = (data, itemTotal) => {
    const list = data || [];
    setReplyMails(list);
    setTotal(itemTotal || EMPTY_COUNT);
    setRowDrafts((prev) => {
      const next = {};
      list.forEach((mail) => {
        next[mail.client_id] = {
          email: mail.email || EMPTY_VALUE,
          password: prev[mail.client_id]?.password || EMPTY_VALUE,
        };
      });
      return next;
    });
  };

  const reloadReplyMails = useCallback((pageIndex = FIRST_PAGE) => {
    setLoading(true);
    api
      .get(getClientEmailsPagePath(pageIndex))
      .then((res) => {
        if (res.data?.code === API_SUCCESS_CODE) {
          applyMailList(res.data?.data, res.data?.total);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === API_EXPIRED_CODE) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reloadReplyMails(FIRST_PAGE);
    return () => {
      setReplyMails([]);
      setTotal(EMPTY_COUNT);
    };
  }, [reloadReplyMails]);

  useEffect(() => {
    api
      .get(CLIENT_NAMES_PATH)
      .then((res) => {
        if (res.data?.code === API_SUCCESS_CODE) {
          setClientNames(res.data?.data || []);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === API_EXPIRED_CODE) {
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
    document.querySelector(MAIN_PANEL_SELECTOR)?.scrollTo(SCROLL_ORIGIN, SCROLL_ORIGIN);
  };

  const openAddPopup = () => {
    setAddEmail(EMPTY_VALUE);
    setAddPassword(EMPTY_VALUE);
    setAddErrors(EMPTY_FIELD_ERRORS);
    setShowAddPassword(false);
    setIsOpenAddPopup(true);
  };

  const closeAddPopup = useCallback(() => {
    setIsOpenAddPopup(false);
  }, []);

  const handleAddMail = () => {
    const email = addEmail.trim();
    const password = addPassword;
    const nextErrors = { ...EMPTY_FIELD_ERRORS };

    if (!email) {
      nextErrors.email = EMAIL_REQUIRED_MESSAGE;
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = EMAIL_FORMAT_MESSAGE;
    }
    if (!password) {
      nextErrors.password = PASSWORD_REQUIRED_MESSAGE;
    }
    if (nextErrors.email || nextErrors.password) {
      setAddErrors(nextErrors);
      return;
    }

    setAdding(true);
    api
      .post(CLIENT_EMAILS_PATH, {
        email: { email, password },
        client_id: currentClientId,
      })
      .then((res) => {
        if (res.data?.code === API_SUCCESS_CODE) {
          message.success(CREATE_SUCCESS_MESSAGE);
          closeAddPopup();
          reloadReplyMails(page);
        } else {
          message.warning(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === API_EXPIRED_CODE) {
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
        email: prev[clientId]?.email || EMPTY_VALUE,
        password: prev[clientId]?.password || EMPTY_VALUE,
        [field]: value,
      },
    }));
    setRowErrors((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [field]: EMPTY_VALUE,
      },
    }));
  };

  const handleUpdateBtnClick = useCallback((clientId, id) => {
    const draft = rowDrafts[clientId] || {};
    const email = (draft.email || EMPTY_VALUE).trim();
    const password = draft.password || EMPTY_VALUE;
    const nextErrors = { ...EMPTY_FIELD_ERRORS };

    if (!email) {
      nextErrors.email = EMAIL_REQUIRED_MESSAGE;
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = EMAIL_FORMAT_MESSAGE;
    }
    if (!password) {
      nextErrors.password = PASSWORD_REQUIRED_MESSAGE;
    }
    if (nextErrors.email || nextErrors.password) {
      setRowErrors((prev) => ({ ...prev, [clientId]: nextErrors }));
      return;
    }

    api
      .patch(getClientEmailItemPath(id), {
        email: { email, password },
      })
      .then((res) => {
        if (res.data?.code === API_SUCCESS_CODE) {
          setRowDrafts((prev) => ({
            ...prev,
            [clientId]: { email, password: EMPTY_VALUE },
          }));
          message.success(UPDATE_SUCCESS_MESSAGE);
          closeAddPopup();
          reloadReplyMails(page);
        } else {
          message.warning(res.data?.data);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === API_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, [rowDrafts, page, reloadReplyMails, closeAddPopup]);

  useAdminHeaderActions(
    <AdminActionButton
      action="create"
      label={ADD_REPLY_MAIL_LABEL}
      onClick={openAddPopup}
      disabled={!currentClientId}
    />
  );

  const columns = useMemo(
    () => [
      {
        title: COL_CLIENT_NAME,
        dataIndex: 'full_name',
      },
      {
        title: ADD_REPLY_MAIL_LABEL,
        render: (_, mail) => (
          <div>
            <Input
              placeholder={EMAIL_INPUT_PLACEHOLDER}
              value={rowDrafts[mail.client_id]?.email || EMPTY_VALUE}
              onChange={(e) => updateRowDraft(mail.client_id, FIELD_EMAIL, e.target.value)}
            />
            {rowErrors[mail.client_id]?.email && (
              <div className="admin-client-form-error">{rowErrors[mail.client_id].email}</div>
            )}
          </div>
        ),
      },
      {
        title: COL_PASSWORD,
        render: (_, mail) => (
          <div>
            <Input
              placeholder={PASSWORD_INPUT_PLACEHOLDER}
              value={rowDrafts[mail.client_id]?.password || EMPTY_VALUE}
              onChange={(e) => updateRowDraft(mail.client_id, FIELD_PASSWORD, e.target.value)}
            />
            {rowErrors[mail.client_id]?.password && (
              <div className="admin-client-form-error">{rowErrors[mail.client_id].password}</div>
            )}
          </div>
        ),
      },
      {
        title: COL_ACTIONS,
        width: COL_ACTIONS_WIDTH,
        render: (_, mail) => (
          <Space className="admin-table-actions">
            <AdminActionButton
              action="save"
              label={UPDATE_BUTTON_LABEL}
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
                  key: FILTER_KEY_CLIENT,
                  label: CLIENT_FILTER_LABEL,
                  value: currentClientId || undefined,
                  onChange: (value) => setCurrentClientId(value || EMPTY_VALUE),
                  placeholder: CLIENT_SELECT_PLACEHOLDER,
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
        title={ADD_MAIL_TITLE}
        open={isOpenAddPopup}
        onCancel={closeAddPopup}
        centered
        destroyOnClose
        footer={
          <div className="admin-form-actions">
            <AdminActionButton action="cancel" onClick={closeAddPopup} />
            <AdminActionButton action="create" label={ADD_BUTTON_LABEL} loading={adding} onClick={handleAddMail} />
          </div>
        }
      >
        <AdminFormRow label={EMAIL_LABEL} required error={addErrors.email} htmlFor={ADD_EMAIL_INPUT_ID}>
          <Input
            id={ADD_EMAIL_INPUT_ID}
            placeholder={EMAIL_INPUT_PLACEHOLDER}
            value={addEmail}
            onChange={(e) => {
              setAddEmail(e.target.value);
              setAddErrors((prev) => ({ ...prev, email: EMPTY_VALUE }));
            }}
          />
        </AdminFormRow>
        <AdminFormRow label={PASSWORD_LABEL} required error={addErrors.password} htmlFor={ADD_PASSWORD_INPUT_ID}>
          <Space align={ALIGN_CENTER}>
            <Input
              id={ADD_PASSWORD_INPUT_ID}
              placeholder={PASSWORD_INPUT_PLACEHOLDER}
              type={showAddPassword ? INPUT_TYPE_TEXT : INPUT_TYPE_PASSWORD}
              value={addPassword}
              onChange={(e) => {
                setAddPassword(e.target.value);
                setAddErrors((prev) => ({ ...prev, password: EMPTY_VALUE }));
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
};

export default ReplyMailManagement;
