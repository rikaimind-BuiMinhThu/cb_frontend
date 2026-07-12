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
    setIsOpenDelete(false);
    api
      .delete(`/api/v1/managements/users/${idDeleteUser}`)
      .then(() => {
        reloadList(page);
        message.success('削除しました!');
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
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
      });
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
          setIsOpenAdd(false);
        }
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  return {
    isOpenAdd,
    setIsOpenAdd,
    isOpenEdit,
    setIsOpenEdit,
    isOpenDelete,
    setIsOpenDelete,
    editingUser,
    openAdd,
    openEdit,
    confirmDelete,
    deleteUser,
    updateUser,
    addUser,
  };
}
