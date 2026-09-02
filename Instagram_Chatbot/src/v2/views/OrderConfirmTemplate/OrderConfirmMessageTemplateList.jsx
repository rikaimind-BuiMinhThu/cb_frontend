import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import api from 'v2/api/api-management';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, AdminFormRow, useAdminHeaderActions } from 'v2/components/AdminShell';
import { getAdminRoutePath, getSignInPath } from 'v2/variables/constants';
import {
  API_SUCCESS_CODE,
  API_WARNING_CODE,
  CANCEL_TEXT,
  COL_ACTIONS,
  COL_TEMPLATE_NAME,
  COL_UPDATED_AT,
  CREATE_OK_TEXT,
  CREATE_TEMPLATE_BUTTON,
  CREATE_TEMPLATE_TITLE,
  DATE_FORMAT,
  DELETE_CONFIRM_MESSAGE,
  HINT_TEMPLATE_NAME,
  LABEL_TEMPLATE_NAME,
  NAME_MAX,
  NAME_MAX_LENGTH,
  NAME_REQUIRED,
  NEW_TEMPLATE_NAME_ID,
  ROLE_ADMIN_DEEL,
  SUCCESS_ADDED,
  SUCCESS_DELETED,
  TEMPLATE_ID_COOKIE_KEY,
  TEMPLATE_SETTING_PATH,
  TEMPLATES_API_PATH,
  USER_ROLE_COOKIE_KEY,
} from './constants';

const OrderConfirmMessageTemplateList = () => {
  const history = useHistory();
  const [isOpenCreateTemplate, setIsOpenCreateTemplate] = useState(false);
  const [isOpenDeleteTemplate, setIsOpenDeleteTemplate] = useState(false);
  const [listTemplate, setListTemplate] = useState([]);
  const [templateSelectId, setTemplateSelectId] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [nameError, setNameError] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const getListTemplate = () => {
    setLoading(true);
    api
      .get(TEMPLATES_API_PATH)
      .then((res) => {
        setListTemplate(res?.data?.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (!userRole || userRole !== ROLE_ADMIN_DEEL) {
      window.location.href = getSignInPath();
      return;
    }
    window.scrollTo(0, 0);
    getListTemplate();
  }, []);

  useAdminHeaderActions(
    <AdminActionButton action="create" label={CREATE_TEMPLATE_BUTTON} onClick={() => setIsOpenCreateTemplate(true)} />
  );

  const checkInputTemplateName = (templateName) => {
    if (templateName.length === 0) {
      setNameError(NAME_REQUIRED);
      return false;
    }
    if (templateName.length > NAME_MAX_LENGTH) {
      setNameError(NAME_MAX);
      return false;
    }
    setNameError('');
    return true;
  };

  const createTemplate = () => {
    if (!checkInputTemplateName(newTemplateName)) return;
    setCreating(true);
    api
      .post(TEMPLATES_API_PATH, {
        order_confirm_message_template: { name: newTemplateName },
      })
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(SUCCESS_ADDED);
          Cookies.set(TEMPLATE_ID_COOKIE_KEY, res.data.data.id);
          setIsOpenCreateTemplate(false);
          setNewTemplateName('');
          setNameError('');
          history.push(getAdminRoutePath(TEMPLATE_SETTING_PATH));
        } else if (res.data.code === API_WARNING_CODE) {
          message.warning(res.data.message);
        }
        getListTemplate();
      })
      .finally(() => setCreating(false));
  };

  const handleDeleteTemplate = (id) => {
    setIsOpenDeleteTemplate(true);
    setTemplateSelectId(id);
  };

  const deleteTemplate = () => {
    setDeleting(true);
    api
      .delete(`${TEMPLATES_API_PATH}/${templateSelectId}`)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) message.success(SUCCESS_DELETED);
        else if (res.data.code === API_WARNING_CODE) message.warning(res.data.message);
        getListTemplate();
        setIsOpenDeleteTemplate(false);
      })
      .finally(() => setDeleting(false));
  };

  const onclickEditTemplate = (id) => {
    Cookies.set(TEMPLATE_ID_COOKIE_KEY, id);
  };

  const columns = [
    { title: COL_TEMPLATE_NAME, dataIndex: 'name' },
    {
      title: COL_UPDATED_AT,
      dataIndex: 'updated_at',
      render: (value) => moment(value).format(DATE_FORMAT),
    },
    {
      title: COL_ACTIONS,
      width: 140,
      render: (_, template) => (
        <Space className="admin-table-actions">
          <Link to={getAdminRoutePath(TEMPLATE_SETTING_PATH)}>
            <AdminActionButton action="edit" iconOnly onClick={() => onclickEditTemplate(template.id)} />
          </Link>
          <AdminActionButton action="delete" iconOnly onClick={() => handleDeleteTemplate(template.id)} />
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
          dataSource={listTemplate}
          rowKey="id"
          pagination={false}
        />
      </AdminPage>

      <Modal
        title={CREATE_TEMPLATE_TITLE}
        open={isOpenCreateTemplate}
        onOk={createTemplate}
        onCancel={() => {
          setIsOpenCreateTemplate(false);
          setNewTemplateName('');
          setNameError('');
        }}
        okText={CREATE_OK_TEXT}
        cancelText={CANCEL_TEXT}
        confirmLoading={creating}
      >
        <AdminFormRow
          label={LABEL_TEMPLATE_NAME}
          htmlFor={NEW_TEMPLATE_NAME_ID}
          required
          error={nameError}
          hint={HINT_TEMPLATE_NAME}
        >
          <Input
            id={NEW_TEMPLATE_NAME_ID}
            value={newTemplateName}
            onChange={(e) => {
              setNewTemplateName(e.target.value);
              checkInputTemplateName(e.target.value);
            }}
          />
        </AdminFormRow>
      </Modal>

      <AdminConfirmModal
        open={isOpenDeleteTemplate}
        message={DELETE_CONFIRM_MESSAGE}
        onOk={deleteTemplate}
        onCancel={() => setIsOpenDeleteTemplate(false)}
        danger
        loading={deleting}
      />
    </>
  );
};

export default OrderConfirmMessageTemplateList;
