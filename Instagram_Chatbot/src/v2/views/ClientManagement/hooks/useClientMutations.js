import { useState } from 'react';
import { message } from 'antd';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  buildClientPayload,
  validateAddClient,
  validateUpdateClient,
} from 'v2/views/ClientManagement/utils/clientValidation';

export default function useClientMutations({
  form,
  reloadListClient,
  page,
}) {
  const {
    antdForm,
    updateId,
    updateImageChange,
    inputImage,
    inputEndDate,
    inputStartDate,
    inputEndDateAdd,
    inputStartDateAdd,
    shopUrl,
    clientId,
    clientSecret,
    contract,
    avatarFile,
    setIsOpen,
    setIsOpenAddUser,
    setFieldErrors,
    idDeleteClient,
    setIsOpenDeleteClient,
  } = form;

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function getValidationContext(isAdd) {
    return {
      contract,
      startDate: isAdd ? inputStartDateAdd : inputStartDate,
      endDate: isAdd ? inputEndDateAdd : inputEndDate,
      shopUrl,
      clientId,
      clientSecret,
      avatarFile,
      updateImageChange,
    };
  }

  function updateClient() {
    const values = antdForm.getFieldsValue(true);
    const context = getValidationContext(false);
    const { valid, fieldErrors } = validateUpdateClient(values, context);

    setFieldErrors(fieldErrors);
    if (!valid) {
      return;
    }

    const obj = buildClientPayload(values, context);
    if (updateImageChange) {
      obj.logo_url = inputImage;
    }

    setSubmitting(true);
    api
      .patch(`/api/v1/managements/clients/${updateId}`, { client: obj })
      .then((res) => {
        if (res.data?.code === 2 || res.data?.code === '2') {
          message.warning(res.data.message);
          return;
        }
        reloadListClient(page);
        message.success('クライアント更新しました!');
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  function addClient() {
    const values = antdForm.getFieldsValue(true);
    const context = getValidationContext(true);
    const { valid, fieldErrors } = validateAddClient(values, context);

    setFieldErrors(fieldErrors);
    if (!valid) {
      return;
    }

    const obj = buildClientPayload(values, context);
    obj.logo_url = inputImage;

    const usr = {
      password: values.password,
      password_confirmation: values.password_confirmation,
    };

    setSubmitting(true);
    api
      .post(`/api/v1/managements/clients`, { client: obj, user: usr })
      .then((res) => {
        if (res.data.code === 1 || res.data.code === '1') {
          reloadListClient();
          message.success('クライアント追加しました!');
          setIsOpenAddUser(false);
        } else if (res.data?.code === 2 || res.data?.code === '2') {
          if (res.data.message.includes('Client name has')) {
            message.warning('クライアント名は既に存在しています。');
          } else if (res.data.message.includes('Duplicate entry')) {
            message.warning('メールアドレスはは既に存在しています。');
          } else if (res.data.message.includes("Password confirmation doesn't match Password")) {
            message.warning('パスワードが一致しません。もう一度ご入力ください。');
          } else {
            message.warning(res.data.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  function deleteClientUser() {
    setDeleting(true);
    api
      .delete(`/api/v1/managements/clients/${idDeleteClient}`)
      .then(() => {
        setIsOpenDeleteClient(false);
        reloadListClient(page);
        message.success('削除しました!');
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  }

  return { updateClient, addClient, deleteClientUser, submitting, deleting };
}
