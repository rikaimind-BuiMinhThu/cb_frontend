import { useState } from 'react';
import { message } from 'antd';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';

export default function useUserMutations({ reloadList, page }) {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [idDeleteUser, setIdDeleteUser] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openAdd() {
    setIsOpenAdd(true);
  }

  function openEdit(item) {
    setEditingUser(item);
    setIsOpenEdit(true);
  }

  function confirmDelete(id) {
    setIdDeleteUser(id);
    setIsOpenDelete(true);
  }

  function deleteUser() {
    setDeleting(true);
    api
      .delete(`/api/v1/managements/users/${idDeleteUser}`)
      .then(() => {
        reloadList(page);
        message.success('削除しました!');
        setIsOpenDelete(false);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setDeleting(false));
  }

  function updateUser(values) {
    const payload = {
      user: {
        full_name: values.full_name,
        email: values.email,
        client_id: values.client_id,
        role: values.role,
      },
    };
    if (values.password) {
      payload.user.password = values.password;
      payload.user.password_confirmation = values.password_confirmation;
    }

    setSubmitting(true);
    return api
      .patch(`/api/v1/managements/users/${editingUser.id}`, payload)
      .then(() => {
        reloadList(page);
        message.success('ユーザーを更新しました!');
        setIsOpenEdit(false);
        setEditingUser(null);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setSubmitting(false));
  }

  function addUser(values) {
    const newUser = {
      user: {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        client_id: values.client_id,
        role: values.role,
      },
    };

    setSubmitting(true);
    return api
      .post(`/api/v1/users/registrations`, newUser)
      .then((res) => {
        if (res.data?.code === 1 || res.data?.code === '1') {
          reloadList(page);
          message.success('ユーザーを追加しました!');
          setIsOpenAdd(false);
        } else if (res.data?.code === 2 || res.data?.code === '2') {
          if (res.data?.message?.includes('Email has already been taken')) {
            message.warning('メールアドレスはは既に存在しています。');
          } else {
            message.warning(res.data?.message);
          }
        }
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setSubmitting(false));
  }

  return {
    isOpenAdd,
    setIsOpenAdd,
    isOpenEdit,
    setIsOpenEdit,
    isOpenDelete,
    setIsOpenDelete,
    editingUser,
    submitting,
    deleting,
    openAdd,
    openEdit,
    confirmDelete,
    deleteUser,
    updateUser,
    addUser,
  };
}
