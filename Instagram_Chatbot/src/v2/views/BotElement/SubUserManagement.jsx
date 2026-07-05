import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, useAdminHeaderActions } from '../../components/AdminShell';

function SubUserManagement() {
  const [subUsers, setSubUsers] = useState([]);
  const [detailUser, setDetailUser] = useState({});
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    api
      .get(`/api/v1/managements/user_chatbots?chatbot_id=${Cookies.get('bot_id')}`)
      .then((res) => {
        if (res.data.code === 1) {
          setSubUsers(res.data.data.user_chatbots);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  function handleDelete() {
    api
      .delete(`/api/v1/managements/user_chatbots/${detailUser.id}`)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に削除されました！');
          setIsOpenPopupDelete(false);
          loadData();
        } else if (res.data.code === 2) {
          message.warning(res.data.message || res.data.data);
          setIsOpenPopupDelete(false);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  function openPopupEdit(user) {
    setDetailUser(user);
    form.setFieldsValue({ full_name: user.full_name, role: user.role });
    setIsOpenEdit(true);
  }

  function handleEdit() {
    form.validateFields().then((values) => {
      api
        .patch(`/api/v1/managements/user_chatbots/${detailUser.id}`, { user_chatbot: { role: values.role } })
        .then((res) => {
          if (res.data.code === 1) {
            message.success('正常に編集されました！');
            loadData();
            setIsOpenEdit(false);
          } else if (res.data.code === 2) {
            message.warning(res.data.message || res.data.data);
            setIsOpenEdit(false);
          }
        })
        .catch((err) => {
          if (err.response?.data.code === 0) tokenExpired();
        });
    });
  }

  const columns = [
    { title: 'NO.', dataIndex: 'id', width: 80 },
    { title: '氏名', dataIndex: 'full_name' },
    { title: 'メールアドレス', dataIndex: 'email' },
    { title: '権限', dataIndex: 'role', width: 120 },
    {
      title: 'アクション',
      width: 160,
      render: (_, user) => (
        <Space className="admin-table-actions">
          <AdminActionButton action="edit" onClick={() => openPopupEdit(user)} />
          <AdminActionButton action="delete" onClick={() => { setDetailUser(user); setIsOpenPopupDelete(true); }} />
        </Space>
      ),
    },
  ];

  useAdminHeaderActions(
    <Link to="/v2/admin/add-sub-user">
      <AdminActionButton action="create" label="ユーザー招待" />
    </Link>
  );

  return (
    <>
      <AdminPage
        description="利用中のプランのボットの管理者として追加されているユーザーを表示します。EC-CHATBOTのアカウントを持たないユーザーを管理者に追加したい場合は、招待ボタンからユーザーを招待してからボットの管理者を追加してください。"
      >
        <AdminTable columns={columns} dataSource={subUsers} rowKey="id" pagination={false} />
      </AdminPage>

      <Modal
        title="サブユーザ編集"
        open={isOpenEdit}
        onOk={handleEdit}
        onCancel={() => setIsOpenEdit(false)}
        okText="編集"
        cancelText="キャンセル"
        width={480}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="氏名">
            <Input disabled value={detailUser.full_name} />
          </Form.Item>
          <Form.Item label="権限" name="role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'bot_admin', label: '管理者' },
                { value: 'editor', label: '編集者' },
                { value: 'reader', label: '観覧者' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <AdminConfirmModal
        open={isOpenPopupDelete}
        message="本当にこのサブユーザーを削除しますか?"
        onOk={handleDelete}
        onCancel={() => setIsOpenPopupDelete(false)}
        danger
      />
    </>
  );
}

export default SubUserManagement;
