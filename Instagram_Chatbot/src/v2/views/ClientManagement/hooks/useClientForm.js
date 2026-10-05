import { useCallback, useRef, useState } from 'react';
import { Form } from 'antd';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { EC_CHATBOT_URL } from '../../../variables/constants';
import {
  isValidImageFile,
  validateDateRange,
  validateField,
  validateNameField,
  validatePasswordField,
  validatePhoneNumber,
  validatePrice,
  validateStartDate,
  validateZipCode,
} from 'v2/views/ClientManagement/utils/clientFormHelpers';
import {
  BOOLEAN_STRING_FALSE,
  CART_SYSTEM_NONE,
  CLIENTS_API_PATH,
  DETAIL_TITLE,
  EDIT_CLIENT_TITLE,
  FORM_MODE_ADD,
  FORM_MODE_EDIT,
  FORM_MODE_VIEW,
  SELECT_IMAGE,
  STATUS_REQUIRED,
} from '../constants';

const DEFAULT_FORM_VALUES = {
  cart_system: CART_SYSTEM_NONE,
  is_instagram: BOOLEAN_STRING_FALSE,
  is_line: BOOLEAN_STRING_FALSE,
  is_tiktok: BOOLEAN_STRING_FALSE,
  is_web: BOOLEAN_STRING_FALSE,
  reply_smtp_gmail: '',
  reply_smtp_gmail_app_password: '',
};

const useClientForm = (plans) => {
  const [antdForm] = Form.useForm();
  const avatarInputRef = useRef(null);
  const [detailData, setDetailData] = useState({});
  const [detailUpdateTitle, setDetailUpdateTitle] = useState();
  const [disableInput, setDisableInput] = useState();
  const [isOpenDeleteClient, setIsOpenDeleteClient] = useState(false);
  const [idDeleteClient, setIdDeleteClient] = useState();
  const [contract, setContract] = useState();
  const [inputEndDate, setInputEndDate] = useState();
  const [inputEndDateAdd, setInputEndDateAdd] = useState('');
  const [inputStartDate, setInputStartDate] = useState();
  const [inputStartDateAdd, setInputStartDateAdd] = useState('');
  const [inputImage, setInputImage] = useState('');
  const [urlLogo, setUrlLogo] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [updateId, setUpdateId] = useState();
  const [updateImageChange, setUpdateImageChange] = useState(false);
  const [shopUrl, setShopUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [formMode, setFormMode] = useState(FORM_MODE_EDIT);

  const clearFieldError = useCallback((key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const setFieldError = useCallback((key, message) => {
    setFieldErrors((prev) => {
      if (!message) {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: message };
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const validateAndSetField = useCallback(
    (key, message) => {
      if (message) {
        setFieldError(key, message);
      } else {
        clearFieldError(key);
      }
    },
    [clearFieldError, setFieldError],
  );

  const resetFormState = () => {
    clearAllFieldErrors();
    setAvatarFile(null);
    setInputImage('');
    setUpdateImageChange(false);
  };

  const mapDataToFormValues = (data) => ({
    plan: data.plan,
    price: data.price,
    is_instagram: String(data.is_instagram),
    is_line: String(data.is_line),
    is_tiktok: String(data.is_tiktok),
    is_web: String(data.is_web),
    note: data.note || '',
    name: data.name,
    name_katakana: data.name_katakana,
    enterprise_type: data.enterprise_type,
    enterprise_type_2: data.enterprise_type_2,
    department_name: data.department_name,
    title: data.title,
    responsible_person: data.responsible_person,
    responsible_person_katakana: data.responsible_person_katakana,
    url: data.url,
    zip_code: data.zip_code,
    prefecture: data.prefecture,
    municipality: data.municipality !== null ? data.municipality : '',
    address: data.address,
    building_name: data.building_name,
    email: data.email,
    phone_number: data.phone_number,
    reply_smtp_gmail: data.reply_smtp_gmail || '',
    reply_smtp_gmail_app_password: '',
    has_reply_smtp_password: !!data.has_reply_smtp_password,
    cart_system: data.cart_system || CART_SYSTEM_NONE,
  });

  const populateClientForm = (data, { mode, title: modalTitle }) => {
    resetFormState();
    setDetailData(data);
    setUpdateId(data.id);
    setDetailUpdateTitle(modalTitle);
    setFormMode(mode);
    setContract(data.status);
    setInputStartDate(data.subscription_start_at != null ? new Date(data.subscription_start_at) : '');
    setInputEndDate(data.subscription_end_at != null ? new Date(data.subscription_end_at) : '');
    setShopUrl(data.shop_url || '');
    setClientId(data.client_id || '');
    setClientSecret(data.client_secret || '');
    setUrlLogo(data.logo_url?.url ? `${EC_CHATBOT_URL}/${data.logo_url.url}` : '');
    setDisableInput(mode === FORM_MODE_VIEW);
    antdForm.setFieldsValue(mapDataToFormValues(data));
    setIsOpen(true);
  };

  const openDetail = (item) => {
    api
      .get(`${CLIENTS_API_PATH}/${item.id}`)
      .then((res) => populateClientForm(res.data.data, { mode: FORM_MODE_VIEW, title: DETAIL_TITLE }))
      .catch((error) => {
        if (error.response?.data.code === 0) tokenExpired();
      });
  };

  const openEdit = (item) => {
    api
      .get(`${CLIENTS_API_PATH}/${item.id}`)
      .then((res) => populateClientForm(res.data.data, { mode: FORM_MODE_EDIT, title: EDIT_CLIENT_TITLE }))
      .catch((error) => {
        if (error.response?.data.code === 0) tokenExpired();
      });
  };

  const openAdd = () => {
    resetFormState();
    setFormMode(FORM_MODE_ADD);
    setContract('');
    setInputStartDate('');
    setInputEndDate('');
    setInputStartDateAdd('');
    setInputEndDateAdd('');
    setShopUrl('');
    setClientId('');
    setClientSecret('');
    setUrlLogo('');
    antdForm.resetFields();
    antdForm.setFieldsValue(DEFAULT_FORM_VALUES);
    setIsOpenAddUser(true);
  };

  const checkInputDate = (inputdate) => {
    setInputStartDate(inputdate);
    validateAndSetField('subscription_start_at', validateStartDate(inputdate));
    validateAndSetField(
      'subscription_end_at',
      validateDateRange(inputdate, inputEndDate),
    );
  };

  const checkInputDateAdd = (inputdate) => {
    setInputStartDateAdd(inputdate);
    validateAndSetField('subscription_start_at', validateStartDate(inputdate));
    validateAndSetField(
      'subscription_end_at',
      validateDateRange(inputdate, inputEndDateAdd),
    );
  };

  const checkEndDate = (endDateIn) => {
    setInputEndDate(endDateIn);
    validateAndSetField(
      'subscription_end_at',
      validateDateRange(inputStartDate, endDateIn),
    );
  };

  const checkEndDateAdd = (endDateIn) => {
    setInputEndDateAdd(endDateIn);
    validateAndSetField(
      'subscription_end_at',
      validateDateRange(inputStartDateAdd, endDateIn),
    );
  };

  const handleImageChange = (event, isAdd) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setFieldError('logo', SELECT_IMAGE);
      return;
    }

    setAvatarFile(file);
    clearFieldError('logo');
    setUrlLogo(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setInputImage(reader.result);
    };
    reader.readAsDataURL(file);

    if (!isAdd) {
      setUpdateImageChange(true);
    }
  };

  const handleSelectImageClick = (event) => {
    event.preventDefault();
    avatarInputRef.current?.click();
  };

  const onSelectPlan = (planCode) => {
    const selected = plans.find((o) => o.code === planCode);
    if (selected) {
      antdForm.setFieldsValue({ price: selected.price });
      clearFieldError('price');
    }
  };

  const handleContractChange = (value) => {
    setContract(value);
    validateAndSetField('status', value ? null : STATUS_REQUIRED);
  };

  const deleteClientPopup = (id) => {
    setIsOpenDeleteClient(true);
    setIdDeleteClient(id);
  };

  const isAddMode = formMode === FORM_MODE_ADD;
  const startDate = isAddMode ? inputStartDateAdd : inputStartDate;
  const endDate = isAddMode ? inputEndDateAdd : inputEndDate;
  const onStartDateChange = isAddMode ? checkInputDateAdd : checkInputDate;
  const onEndDateChange = isAddMode ? checkEndDateAdd : checkEndDate;

  const formBodyProps = {
    plans,
    contract,
    setContract: handleContractChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    urlLogo,
    shopUrl,
    setShopUrl,
    clientId,
    setClientId,
    clientSecret,
    setClientSecret,
    onSelectPlan,
    fieldErrors,
    avatarInputRef,
    validateAndSetField,
    validateNameField,
    validateField,
    validatePasswordField,
    validatePrice,
    validateZipCode,
    validatePhoneNumber,
  };

  return {
    antdForm,
    detailData,
    detailUpdateTitle,
    disableInput,
    isOpenDeleteClient,
    setIsOpenDeleteClient,
    idDeleteClient,
    isOpen,
    setIsOpen,
    isOpenAddUser,
    setIsOpenAddUser,
    formMode,
    updateId,
    updateImageChange,
    inputImage,
    avatarFile,
    contract,
    inputStartDate,
    inputEndDate,
    inputStartDateAdd,
    inputEndDateAdd,
    shopUrl,
    clientId,
    clientSecret,
    fieldErrors,
    setFieldErrors,
    clearAllFieldErrors,
    openDetail,
    openEdit,
    openAdd,
    deleteClientPopup,
    formBodyProps,
    handleImageChange,
    handleSelectImageClick,
  };
};

export default useClientForm;
