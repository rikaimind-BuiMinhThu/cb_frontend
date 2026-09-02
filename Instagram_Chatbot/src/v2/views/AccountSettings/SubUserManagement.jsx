import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select, Space } from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE, BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  ADMIN_PATHS,
  CONFIRM_CANCEL,
  LAYOUT_HORIZONTAL,
  TABLE_ROW_KEY,
} from 'v2/components/AdminShell/constants';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  API_WARNING_CODE,
  ROLE_LABEL,
  ROLE_OPTIONS,
} from './addSubUserConstants';
import { EMAIL_LABEL, FULL_NAME_LABEL } from './basicSettingConstants';
import { API_EXPIRED_CODE } from './constants';
import {
  COL_ACTIONS,
  COL_ACTIONS_WIDTH,
  COL_ID_WIDTH,
  COL_NUMBER,
  COL_ROLE_WIDTH,
  DELETE_CONFIRM_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  EDIT_MODAL_TITLE,
  EDIT_MODAL_WIDTH,
  EDIT_SUCCESS_MESSAGE,
  FORM_LABEL_COL,
  FORM_WRAPPER_COL,
  getUserChatbotItemPath,
  getUserChatbotsByBotPath,
  INVITE_USER_LABEL,
  LABEL_ALIGN_LEFT,
  PAGE_DESCRIPTION,
  ROLE_REQUIRED_MESSAGE,
  UPDATE_BUTTON_LABEL,
} from './subUserConstants';

const SubUserManagement = () => {
  const [subUsers, setSubUsers] = useState([]);
  const [detailUser, setDetailUser] = useState({});
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    api
      .get(getUserChatbotsByBotPath(Cookies.get(BOT_ID_COOKIE_KEY)))
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          setSubUsers(res.data.data.user_chatbots);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === API_EXPIRED_CODE) tokenExpired();
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = () => {
    api
      .delete(getUserChatbotItemPath(detailUser.id))
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(DELETE_SUCCESS_MESSAGE);
          setIsOpenPopupDelete(false);
          loadData();
        } else if (res.data.code === API_WARNING_CODE) {
          message.warning(res.data.message || res.data.data);
          setIsOpenPopupDelete(false);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === API_EXPIRED_CODE) tokenExpired();
      });
  };

  const openPopupEdit = (user) => {
    setDetailUser(user);
    form.setFieldsValue({ full_name: user.full_name, role: user.role });
    setIsOpenEdit(true);
  };

  const handleEdit = () => {
    form.validateFields().then((values) => {
      api
        .patch(getUserChatbotItemPath(detailUser.id), { user_chatbot: { role: values.role } })
        .then((res) => {
          if (res.data.code === API_SUCCESS_CODE) {
            message.success(EDIT_SUCCESS_MESSAGE);
            loadData();
            setIsOpenEdit(false);
          } else if (res.data.code === API_WARNING_CODE) {
            message.warning(res.data.message || res.data.data);
            setIsOpenEdit(false);
          }
        })
        .catch((err) => {
          if (err.response?.data.code === API_EXPIRED_CODE) tokenExpired();
        });
    });
  };

  useAdminHeaderActions(
    <Link to={getAdminRoutePath(ADMIN_PATHS.ADD_SUB_USER)}>
      <AdminActionButton action="create" label={INVITE_USER_LABEL} />
    </Link>
  );

  const columns = [
    { title: COL_NUMBER, dataIndex: TABLE_ROW_KEY, width: COL_ID_WIDTH },
    { title: FULL_NAME_LABEL, dataIndex: 'full_name' },
    { title: EMAIL_LABEL, dataIndex: 'email' },
    { title: ROLE_LABEL, dataIndex: 'role', width: COL_ROLE_WIDTH },
    {
      title: COL_ACTIONS,
      width: COL_ACTIONS_WIDTH,
      render: (_, user) => (
        <Space className="admin-table-actions">
          <AdminActionButton action="edit" iconOnly onClick={() => openPopupEdit(user)} />
          <AdminActionButton action="delete" iconOnly onClick={() => { setDetailUser(user); setIsOpenPopupDelete(true); }} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminPage description={PAGE_DESCRIPTION}>
        <AdminTable loading={loading} columns={columns} dataSource={subUsers} rowKey={TABLE_ROW_KEY} pagination={false} />
      </AdminPage>

      <Modal
        title={EDIT_MODAL_TITLE}
        open={isOpenEdit}
        onOk={handleEdit}
        onCancel={() => setIsOpenEdit(false)}
        okText={UPDATE_BUTTON_LABEL}
        cancelText={CONFIRM_CANCEL}
        width={EDIT_MODAL_WIDTH}
      >
        <Form
          form={form}
          layout={LAYOUT_HORIZONTAL}
          colon={false}
          labelAlign={LABEL_ALIGN_LEFT}
          labelCol={FORM_LABEL_COL}
          wrapperCol={FORM_WRAPPER_COL}
        >
          <Form.Item label={FULL_NAME_LABEL}>
            <Input disabled value={detailUser.full_name} />
          </Form.Item>
          <Form.Item label={ROLE_LABEL} name="role" rules={[{ required: true, message: ROLE_REQUIRED_MESSAGE }]}>
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>

      <AdminConfirmModal
        open={isOpenPopupDelete}
        message={DELETE_CONFIRM_MESSAGE}
        onOk={handleDelete}
        onCancel={() => setIsOpenPopupDelete(false)}
        danger
      />
    </>
  );
};

export default SubUserManagement;
