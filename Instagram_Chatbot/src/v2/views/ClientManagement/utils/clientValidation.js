import {
  collectFieldErrors,
  isKatakanaValid,
  isValidImageFile,
  mergeFieldErrors,
  validateDateRange,
  validateField,
  validateNameField,
  validatePasswordField,
  validatePhoneNumber,
  validatePickStatus,
  validatePrice,
  validateZipCode,
} from './clientFormHelpers';
import {
  ASCII_AT,
  CART_SYSTEM_SHOPIFY,
  DATE_SLICE_LENGTH,
  EMAIL_FORMAT,
  EMAIL_MAX_LENGTH,
  EMAIL_REQUIRED,
  FULLWIDTH_AT,
  KATAKANA_INVALID,
  LABEL_ADDRESS,
  LABEL_BUILDING,
  LABEL_CART_SYSTEM,
  LABEL_COMPANY_TYPE,
  LABEL_COMPANY_TYPE_2,
  LABEL_DEPARTMENT,
  LABEL_EMAIL,
  LABEL_MANAGER,
  LABEL_MANAGER_KATAKANA,
  LABEL_NAME,
  LABEL_NAME_KATAKANA,
  LABEL_PASSWORD,
  LABEL_PASSWORD_CONFIRM,
  LABEL_PREFECTURE,
  LABEL_TITLE_VALIDATE,
  LABEL_URL,
  MAIL_FORMAT,
  NAME_MAX_LENGTH,
  PASSWORD_CONFIRM_MISMATCH,
  PASSWORD_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SELECT_IMAGE,
  SHOPIFY_FIELDS_REQUIRED,
} from '../constants';

export const formatDateValue = (date) => {
  if (!date) return '';
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, DATE_SLICE_LENGTH);
  }
  return String(date);
};

const validateCommonFields = (values) => {
  const errors = collectFieldErrors([
    ['name', validateNameField(values.name, LABEL_NAME)],
    ['name_katakana', validateNameField(values.name_katakana, LABEL_NAME_KATAKANA)],
    ['enterprise_type', validateField(values.enterprise_type, LABEL_COMPANY_TYPE)],
    ['enterprise_type_2', validateField(values.enterprise_type_2, LABEL_COMPANY_TYPE_2)],
    ['cart_system', validateField(values.cart_system, LABEL_CART_SYSTEM)],
    ['department_name', validateNameField(values.department_name, LABEL_DEPARTMENT)],
    ['title', validateField(values.title, LABEL_TITLE_VALIDATE)],
    ['responsible_person', validateNameField(values.responsible_person, LABEL_MANAGER)],
    ['responsible_person_katakana', validateNameField(values.responsible_person_katakana, LABEL_MANAGER_KATAKANA)],
    ['url', validateField(values.url, LABEL_URL)],
    ['address', validateField(values.address, LABEL_ADDRESS)],
    ['municipality', validateField(values.municipality, LABEL_PREFECTURE)],
    ['zip_code', validateZipCode(values.zip_code)],
    ['prefecture', validateField(values.prefecture, LABEL_PREFECTURE)],
    ['building_name', validateField(values.building_name, LABEL_BUILDING)],
    ['email', validateNameField(values.email, LABEL_EMAIL)],
    ['phone_number', validatePhoneNumber(values.phone_number)],
    ['price', validatePrice(values.price)],
  ]);

  if (values.name_katakana && !isKatakanaValid(values.name_katakana)) {
    errors.name_katakana = KATAKANA_INVALID;
  }
  if (values.responsible_person_katakana && !isKatakanaValid(values.responsible_person_katakana)) {
    errors.responsible_person_katakana = KATAKANA_INVALID;
  }

  return errors;
};

const validateEmailValue = (email) => {
  if (!email) {
    return EMAIL_REQUIRED;
  }
  if (email.length > NAME_MAX_LENGTH) {
    return EMAIL_MAX_LENGTH;
  }
  if (!email.match(MAIL_FORMAT)) {
    return EMAIL_FORMAT;
  }
  return null;
};

const validateShopifyFields = (values, context) => {
  if (values.cart_system !== CART_SYSTEM_SHOPIFY) {
    return {};
  }
  if (context.shopUrl && context.clientId && context.clientSecret) {
    return {};
  }
  return { cart_system: SHOPIFY_FIELDS_REQUIRED };
};

export const validateAddClient = (values, context) => {
  const fieldErrors = mergeFieldErrors(
    validateCommonFields(values),
    collectFieldErrors([
      ['status', validatePickStatus(context.contract)],
      ['password', validatePasswordField(values.password, LABEL_PASSWORD)],
      ['password_confirmation', validateField(values.password_confirmation, LABEL_PASSWORD_CONFIRM)],
      ['email', validateEmailValue(values.email)],
    ]),
    validateShopifyFields(values, context),
  );

  const password = values.password || '';
  const cfPassword = values.password_confirmation || '';
  if (password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH && cfPassword !== password) {
    fieldErrors.password_confirmation = PASSWORD_CONFIRM_MISMATCH;
  } else if (password && (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH)) {
    fieldErrors.password = PASSWORD_LENGTH;
  }

  if (!context.avatarFile) {
    fieldErrors.logo = SELECT_IMAGE;
  } else if (!isValidImageFile(context.avatarFile)) {
    fieldErrors.logo = SELECT_IMAGE;
  }

  const dateRangeError = validateDateRange(context.startDate, context.endDate);
  if (dateRangeError) {
    fieldErrors.subscription_end_at = dateRangeError;
  }

  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
};

export const validateUpdateClient = (values, context) => {
  const fieldErrors = mergeFieldErrors(
    validateCommonFields(values),
    collectFieldErrors([['email', validateEmailValue(values.email)]]),
    validateShopifyFields(values, context),
  );

  if (context.updateImageChange && context.avatarFile && !isValidImageFile(context.avatarFile)) {
    fieldErrors.logo = SELECT_IMAGE;
  }

  const dateRangeError = validateDateRange(context.startDate, context.endDate);
  if (dateRangeError) {
    fieldErrors.subscription_end_at = dateRangeError;
  }

  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
};

export const buildClientPayload = (values, context) => {
  const payload = {
    plan: values.plan,
    price: values.price,
    is_instagram: values.is_instagram,
    is_line: values.is_line,
    is_tiktok: values.is_tiktok,
    is_web: values.is_web,
    note: values.note || '',
    name: values.name,
    name_katakana: values.name_katakana,
    enterprise_type: values.enterprise_type,
    enterprise_type_2: values.enterprise_type_2,
    department_name: values.department_name,
    title: values.title,
    responsible_person: values.responsible_person,
    responsible_person_katakana: values.responsible_person_katakana,
    url: values.url,
    zip_code: values.zip_code,
    prefecture: values.prefecture,
    municipality: values.municipality,
    address: values.address,
    building_name: values.building_name,
    email: values.email,
    phone_number: values.phone_number,
    reply_smtp_gmail: (values.reply_smtp_gmail || '').trim().replace(new RegExp(FULLWIDTH_AT, 'g'), ASCII_AT),
    cart_system: values.cart_system,
    status: context.contract,
    subscription_start_at: formatDateValue(context.startDate),
    subscription_end_at: formatDateValue(context.endDate),
  };

  if ((values.reply_smtp_gmail_app_password || '').trim()) {
    payload.reply_smtp_gmail_app_password = values.reply_smtp_gmail_app_password.trim();
  }

  if (values.cart_system === CART_SYSTEM_SHOPIFY) {
    payload.shop_url = context.shopUrl;
    payload.client_id = context.clientId;
    payload.client_secret = context.clientSecret;
  }

  return payload;
};
