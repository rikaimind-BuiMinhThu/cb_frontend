import { useState } from 'react';
import { message } from 'antd';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import {
  API_WARNING_CODE,
  API_WARNING_CODE_STRING,
  EMAIL_TAKEN_TOKEN,
  SUCCESS_USER_ADDED,
  SUCCESS_USER_DELETED,
  SUCCESS_USER_UPDATED,
  USER_REGISTRATIONS_PATH,
  USERS_API_PATH,
  WARNING_EMAIL_EXISTS,
} from '../constants';

const isWarningCode = (code) => code === API_WARNING_CODE || code === API_WARNING_CODE_STRING;
const isSuccessCode = (code) => code === API_SUCCESS_CODE || code === String(API_SUCCESS_CODE);

const useUserMutations = ({ reloadList, page }) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [idDeleteUser, setIdDeleteUser] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => {
    setIsOpenAdd(true);
  };

  const openEdit = (item) => {
    setEditingUser(item);
    setIsOpenEdit(true);
  };

  const confirmDelete = (id) => {
    setIdDeleteUser(id);
    setIsOpenDelete(true);
  };

  const deleteUser = () => {
    setDeleting(true);
    api
      .delete(`${USERS_API_PATH}/${idDeleteUser}`)
      .then(() => {
        reloadList(page);
        message.success(SUCCESS_USER_DELETED);
        setIsOpenDelete(false);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setDeleting(false));
  };

  const updateUser = (values) => {
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
      .patch(`${USERS_API_PATH}/${editingUser.id}`, payload)
      .then(() => {
        reloadList(page);
        message.success(SUCCESS_USER_UPDATED);
        setIsOpenEdit(false);
        setEditingUser(null);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setSubmitting(false));
  };

  const addUser = (values) => {
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
      .post(USER_REGISTRATIONS_PATH, newUser)
      .then((res) => {
        if (isSuccessCode(res.data?.code)) {
          reloadList(page);
          message.success(SUCCESS_USER_ADDED);
          setIsOpenAdd(false);
        } else if (isWarningCode(res.data?.code)) {
          if (res.data?.message?.includes(EMAIL_TAKEN_TOKEN)) {
            message.warning(WARNING_EMAIL_EXISTS);
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
  };

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
};

export default useUserMutations;
