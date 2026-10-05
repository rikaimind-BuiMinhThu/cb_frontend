import { useState } from 'react';
import { message } from 'antd';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import {
  buildClientPayload,
  validateAddClient,
  validateUpdateClient,
} from 'v2/views/ClientManagement/utils/clientValidation';
import {
  API_WARNING_CODE,
  API_WARNING_CODE_STRING,
  CLIENTS_API_PATH,
  DUPLICATE_CLIENT_NAME_TOKEN,
  DUPLICATE_ENTRY_TOKEN,
  PASSWORD_MISMATCH_TOKEN,
  SUCCESS_CLIENT_ADDED,
  SUCCESS_CLIENT_DELETED,
  SUCCESS_CLIENT_UPDATED,
  WARNING_CLIENT_NAME_EXISTS,
  WARNING_EMAIL_EXISTS,
  WARNING_PASSWORD_MISMATCH,
} from '../constants';

const isWarningCode = (code) => code === API_WARNING_CODE || code === API_WARNING_CODE_STRING;
const isSuccessCode = (code) => code === API_SUCCESS_CODE || code === String(API_SUCCESS_CODE);

const useClientMutations = ({
  form,
  reloadListClient,
  page,
}) => {
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

  const getValidationContext = (isAdd) => ({
    contract,
    startDate: isAdd ? inputStartDateAdd : inputStartDate,
    endDate: isAdd ? inputEndDateAdd : inputEndDate,
    shopUrl,
    clientId,
    clientSecret,
    avatarFile,
    updateImageChange,
  });

  const updateClient = () => {
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
      .patch(`${CLIENTS_API_PATH}/${updateId}`, { client: obj })
      .then((res) => {
        if (isWarningCode(res.data?.code)) {
          message.warning(res.data.message);
          return;
        }
        reloadListClient(page);
        message.success(SUCCESS_CLIENT_UPDATED);
        setIsOpen(false);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const addClient = () => {
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
      .post(CLIENTS_API_PATH, { client: obj, user: usr })
      .then((res) => {
        if (isSuccessCode(res.data.code)) {
          reloadListClient();
          message.success(SUCCESS_CLIENT_ADDED);
          setIsOpenAddUser(false);
        } else if (isWarningCode(res.data?.code)) {
          if (res.data.message.includes(DUPLICATE_CLIENT_NAME_TOKEN)) {
            message.warning(WARNING_CLIENT_NAME_EXISTS);
          } else if (res.data.message.includes(DUPLICATE_ENTRY_TOKEN)) {
            message.warning(WARNING_EMAIL_EXISTS);
          } else if (res.data.message.includes(PASSWORD_MISMATCH_TOKEN)) {
            message.warning(WARNING_PASSWORD_MISMATCH);
          } else {
            message.warning(res.data.message);
          }
        }
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const deleteClientUser = () => {
    setDeleting(true);
    api
      .delete(`${CLIENTS_API_PATH}/${idDeleteClient}`)
      .then(() => {
        setIsOpenDeleteClient(false);
        reloadListClient(page);
        message.success(SUCCESS_CLIENT_DELETED);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return { updateClient, addClient, deleteClientUser, submitting, deleting };
};

export default useClientMutations;
