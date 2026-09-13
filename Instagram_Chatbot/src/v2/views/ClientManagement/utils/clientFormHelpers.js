import {
  DATE_SLICE_LENGTH,
  END_DATE_BEFORE_START,
  FIELD_MAX_LENGTH,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_PNG,
  INTEGER_REGEX,
  MAX_FIELD_LENGTH,
  MAX_NAME_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_LENGTH,
  PASSWORD_MAX_LENGTH,
  PHONE_FORMAT,
  PHONE_REGEX,
  PHONE_REQUIRED,
  POSITIVE_NUMBER,
  PRICE_INTEGER,
  START_DATE_REQUIRED_FIELD,
  STATUS_ACTIVE,
  STATUS_ENDED,
  STATUS_PAUSE,
  STATUS_REQUIRED,
  STATUS_TRIAL,
  ZIP_INTEGER,
  ZIP_REQUIRED,
  requiredMessage,
} from '../constants';

export const validatePickStatus = (contract) => {
  if ([STATUS_ACTIVE, STATUS_PAUSE, STATUS_ENDED, STATUS_TRIAL].includes(contract)) {
    return null;
  }
  return STATUS_REQUIRED;
};

export const validateNameField = (value, fieldLabel) => {
  if (value === '' || value == null) {
    return requiredMessage(fieldLabel);
  }
  if (value.length > NAME_MAX_LENGTH) {
    return MAX_NAME_LENGTH;
  }
  return null;
};

export const validateField = (value, fieldLabel) => {
  if (value === '' || value == null) {
    return requiredMessage(fieldLabel);
  }
  if (value.length > FIELD_MAX_LENGTH) {
    return MAX_FIELD_LENGTH;
  }
  return null;
};

export const validatePasswordField = (value, fieldLabel) => {
  if (value === '' || value == null) {
    return requiredMessage(fieldLabel);
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return PASSWORD_LENGTH;
  }
  return null;
};

export const validateZipCode = (value) => {
  if (value === '' || value == null) {
    return ZIP_REQUIRED;
  }
  if (!INTEGER_REGEX.test(String(value))) {
    return ZIP_INTEGER;
  }
  if (Number(value) <= 0) {
    return POSITIVE_NUMBER;
  }
  return null;
};

export const validatePrice = (value) => {
  if (value === '' || value == null) {
    return POSITIVE_NUMBER;
  }
  if (!INTEGER_REGEX.test(String(value))) {
    return PRICE_INTEGER;
  }
  if (Number(value) <= 0) {
    return POSITIVE_NUMBER;
  }
  return null;
};

export const validatePhoneNumber = (value) => {
  if (value === '' || value == null) {
    return PHONE_REQUIRED;
  }
  if (PHONE_REGEX.test(value) === false || parseInt(Number(value), 10) !== Number(value)) {
    return PHONE_FORMAT;
  }
  return null;
};

export const validateStartDate = (date) => {
  if (!date) {
    return START_DATE_REQUIRED_FIELD;
  }
  return null;
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return null;
  }

  const startStr =
    startDate instanceof Date
      ? startDate.toISOString().slice(0, DATE_SLICE_LENGTH)
      : String(startDate).slice(0, DATE_SLICE_LENGTH);
  const endStr =
    endDate instanceof Date ? endDate.toISOString().slice(0, DATE_SLICE_LENGTH) : String(endDate).slice(0, DATE_SLICE_LENGTH);

  const start = parseInt(startStr.replaceAll('-', ''), 10);
  const end = parseInt(endStr.replaceAll('-', ''), 10);

  if (start > end) {
    return END_DATE_BEFORE_START;
  }
  return null;
};

export const isKatakanaValid = (value) => {
  if (!value) return false;
  const bytes = encodeURI(value).split(/%..|./).length - 1;
  return bytes === value.length * 3;
};

export const isValidImageFile = (file) =>
  Boolean(file && (file.type === IMAGE_TYPE_PNG || file.type === IMAGE_TYPE_JPEG));

export const mergeFieldErrors = (...errorMaps) => Object.assign({}, ...errorMaps.filter(Boolean));

export const collectFieldErrors = (entries) =>
  entries.reduce((errors, [key, message]) => {
    if (message) {
      errors[key] = message;
    }
    return errors;
  }, {});
