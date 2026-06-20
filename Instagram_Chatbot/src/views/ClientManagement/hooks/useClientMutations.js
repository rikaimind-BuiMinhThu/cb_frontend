import api from '../../../api/api-management';
import { tokenExpired } from 'api/tokenExpired';
import {
  buildClientPayload,
  validateAddClient,
  validateUpdateClient,
} from '../utils/clientValidation';

export default function useClientMutations({
  form,
  reloadListClient,
  page,
  setMsgNoti,
  setIsOpenNoti,
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

    api
      .patch(`/api/v1/managements/clients/${updateId}`, { client: obj })
      .then(() => {
        reloadListClient(page);
        setMsgNoti('クライアント更新しました!');
        setIsOpen(false);
        setIsOpenNoti(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
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

    api
      .post(`/api/v1/managements/clients`, { client: obj, user: usr })
      .then((res) => {
        if (res.data.code === 1 || res.data.code === '1') {
          reloadListClient();
          setMsgNoti('クライアント追加しました!');
          setIsOpenAddUser(false);
          setIsOpenNoti(true);
        } else if (res.data?.code === 2 || res.data?.code === '2') {
          if (res.data.message.includes('Client name has')) {
            setMsgNoti('クライアント名は既に存在しています。');
          } else if (res.data.message.includes('Duplicate entry')) {
            setMsgNoti('メールアドレスはは既に存在しています。');
          } else if (res.data.message.includes("Password confirmation doesn't match Password")) {
            setMsgNoti('パスワードが一致しません。もう一度ご入力ください。');
          } else {
            setMsgNoti(res.data.message);
          }
          setIsOpenAddUser(false);
          setIsOpenNoti(true);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function deleteClientUser() {
    api
      .delete(`/api/v1/managements/clients/${idDeleteClient}`)
      .then(() => {
        setIsOpenDeleteClient(false);
        reloadListClient(page);
        setMsgNoti('削除しました!');
        setIsOpenNoti(true);
        setTimeout(() => {
          setMsgNoti('');
          setIsOpenNoti(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  return { updateClient, addClient, deleteClientUser };
}
