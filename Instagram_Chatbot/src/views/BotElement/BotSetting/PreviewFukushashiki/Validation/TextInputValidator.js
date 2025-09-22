import {
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  RANGE_VALIDATION_MESSAGES,
  RANGE_VALIDATION_PATTERNS,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validateTextInput = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}_${contentType.type}`;
  const limitFrom = contentType[contentType.type]?.character_limit_from || 0;
  const limitTo = contentType[contentType.type]?.character_limit_to || Number.MAX_SAFE_INTEGER;

  // Validate required field
  if (contentType.require) {
    if (contentType[contentType.type].isSplitInput) {
      if (stringNullOrEmpty(contentType[contentType.type].valueLeft) || 
          stringNullOrEmpty(contentType[contentType.type].valueRight)) {
        return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
      }
    } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }
  }

  // Switch case theo contentType.type
  switch (contentType.type) {
    case "text":
      return validateTextType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "password":
      return validatePasswordType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "email_address":
      return validateEmailType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "phone_number":
      return validatePhoneType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "urls":
      return validateUrlType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "email_confirmation":
    case "password_confirmation":
      return validateConfirmationType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "customization":
      return validateCustomizationType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "time_hm":
      return validateTimeHMType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "date_ymd":
    case "dob_ymd":
      return validateDateYMDType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "date_md":
      return validateDateMDType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "date_ym":
    case "dob_ym":
      return validateDateYMType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "date_ymd_hm":
      return validateDateYMDHMType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "timezone_from_to":
      return validateTimezoneFromToType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "period_from_to":
      return validatePeriodFromToType(contentType, key, errorsMess, limitFrom, limitTo);
    
    case "up_to_municipality":
      return validateUpToMunicipalityType(contentType, key, errorsMess, limitFrom, limitTo);
    
    default:
      return true;
  }
};

// Helper functions for each input type
const validateTextType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value, valueLeft, valueRight, isSplitInput } = data;

  // Character limit validation
  if (isSplitInput) {
    if ((!stringNullOrEmpty(valueLeft) || !stringNullOrEmpty(valueRight)) &&
        (valueLeft?.length < limitFrom || valueRight?.length < limitFrom)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
    }
    if ((!stringNullOrEmpty(valueLeft) || !stringNullOrEmpty(valueRight)) &&
        (valueLeft?.length > limitTo || valueRight?.length > limitTo)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
    }
  } else {
    if (!stringNullOrEmpty(value) && value?.length < limitFrom) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
    }
    if (!stringNullOrEmpty(value) && value?.length > limitTo) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
    }
  }

  // Text range validation
  return validateTextRange(contentType, key, errorsMess);
};

const validatePasswordType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value } = data;

  // Character limit validation
  if (!stringNullOrEmpty(value) && value?.length < limitFrom) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
  }
  if (!stringNullOrEmpty(value) && value?.length > limitTo) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
  }

  // Password pattern validation
  if (!stringNullOrEmpty(value) && !REGEX_PATTERNS.PASSWORD.test(value)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.PASSWORD_PATTERN);
  }

  return true;
};

const validateEmailType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value } = data;

  // Character limit validation
  if (!stringNullOrEmpty(value) && value?.length < limitFrom) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
  }
  if (!stringNullOrEmpty(value) && value?.length > limitTo) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
  }

  // Email validation
  if (!stringNullOrEmpty(value) && !REGEX_PATTERNS.EMAIL.test(value)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.EMAIL_INVALID);
  }

  return true;
};

const validatePhoneType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value, withHyphen, value1, value2, value3 } = data;

  // Character limit validation
  if (!stringNullOrEmpty(value) && value?.length < limitFrom) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
  }
  if (!stringNullOrEmpty(value) && value?.length > limitTo) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
  }

  // Phone validation
  if (!stringNullOrEmpty(value)) {
    if (withHyphen) {
      const fullPhone = `${value1}${value2}${value3}`;
      if (!REGEX_PATTERNS.PHONE.test(fullPhone)) {
        return addErrorMessage(errorsMess, key, ERROR_MESSAGES.PHONE_INVALID);
      }
    } else if (!REGEX_PATTERNS.PHONE.test(value)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.PHONE_INVALID);
    }
  }

  return true;
};

const validateUrlType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value } = data;

  // Character limit validation
  if (!stringNullOrEmpty(value) && value?.length < limitFrom) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
  }
  if (!stringNullOrEmpty(value) && value?.length > limitTo) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
  }

  // URL validation
  if (!stringNullOrEmpty(value) && !REGEX_PATTERNS.URLS.test(value)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.URL_INVALID);
  }

  return true;
};

const validateConfirmationType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value, valueConfirm } = data;

  // Character limit validation
  if ((!stringNullOrEmpty(value) || !stringNullOrEmpty(valueConfirm)) &&
      (value?.length < limitFrom || valueConfirm?.length < limitFrom)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
  }
  if ((!stringNullOrEmpty(value) || !stringNullOrEmpty(valueConfirm)) &&
      (value?.length > limitTo || valueConfirm?.length > limitTo)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
  }

  // Pattern validation
  if (contentType.type === "email_confirmation") {
    if (!stringNullOrEmpty(value) && !REGEX_PATTERNS.EMAIL.test(value)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.EMAIL_INVALID);
    }
    if (!stringNullOrEmpty(valueConfirm) && !REGEX_PATTERNS.EMAIL.test(valueConfirm)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.EMAIL_INVALID);
    }
    if (!stringNullOrEmpty(value) && !stringNullOrEmpty(valueConfirm) && value !== valueConfirm) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.EMAIL_MISMATCH);
    }
  } else if (contentType.type === "password_confirmation") {
    if (!stringNullOrEmpty(value) && !REGEX_PATTERNS.PASSWORD.test(value)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.PASSWORD_PATTERN);
    }
    if (!stringNullOrEmpty(valueConfirm) && !REGEX_PATTERNS.PASSWORD.test(valueConfirm)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.PASSWORD_PATTERN);
    }
    if (!stringNullOrEmpty(value) && !stringNullOrEmpty(valueConfirm) && value !== valueConfirm) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.PASSWORD_MISMATCH);
    }
  }

  return true;
};

const validateCustomizationType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { value, valueLeft, valueRight, is_comment } = data;

  if (is_comment) {
    if (stringNullOrEmpty(valueLeft) || stringNullOrEmpty(valueRight)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }
  } else if (stringNullOrEmpty(value)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateTimeHMType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueHour, valueMinute } = data;

  if (stringNullOrEmpty(valueHour) || stringNullOrEmpty(valueMinute)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateDateYMDType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueYear, valueMonth, valueDay } = data;

  if (stringNullOrEmpty(valueYear) || stringNullOrEmpty(valueMonth) || stringNullOrEmpty(valueDay)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateDateMDType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueMonth, valueDay } = data;

  if (stringNullOrEmpty(valueMonth) || stringNullOrEmpty(valueDay)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateDateYMType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueYear, valueMonth } = data;

  if (stringNullOrEmpty(valueYear) || stringNullOrEmpty(valueMonth)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateDateYMDHMType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueYear, valueMonth, valueDay, valueHour, valueMinute } = data;

  if (stringNullOrEmpty(valueYear) || stringNullOrEmpty(valueMonth) || 
      stringNullOrEmpty(valueDay) || stringNullOrEmpty(valueHour) || 
      stringNullOrEmpty(valueMinute)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateTimezoneFromToType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueHour1, valueMinute1, valueHour2, valueMinute2 } = data;

  if (stringNullOrEmpty(valueHour1) || stringNullOrEmpty(valueMinute1) ||
      stringNullOrEmpty(valueHour2) || stringNullOrEmpty(valueMinute2)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validatePeriodFromToType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { valueYear1, valueMonth1, valueDay1, valueYear2, valueMonth2, valueDay2 } = data;

  if (stringNullOrEmpty(valueYear1) || stringNullOrEmpty(valueMonth1) || 
      stringNullOrEmpty(valueDay1) || stringNullOrEmpty(valueYear2) ||
      stringNullOrEmpty(valueMonth2) || stringNullOrEmpty(valueDay2)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateUpToMunicipalityType = (contentType, key, errorsMess, limitFrom, limitTo) => {
  const data = contentType[contentType.type];
  const { prefecture, city } = data;

  if (stringNullOrEmpty(prefecture) || stringNullOrEmpty(city)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateTextRange = (contentType, key, errorsMess) => {
  const data = contentType[contentType.type];
  const { range, isSplitInput, value, valueLeft, valueRight } = data;

  if (!range || range === "no_input") {
    return true;
  }

  let regexp = "";
  let messageLog = "";
  
  if (RANGE_VALIDATION_PATTERNS[range]) {
    regexp = RANGE_VALIDATION_PATTERNS[range];
    messageLog = RANGE_VALIDATION_MESSAGES[range];
  }

  if (!regexp) return true;

  if (isSplitInput && (regexp.test(valueLeft) || regexp.test(valueRight))) {
    return addErrorMessage(errorsMess, key, messageLog);
  }
  if (!isSplitInput && regexp.test(value)) {
    return addErrorMessage(errorsMess, key, messageLog);
  }

  return true;
};

export { validateTextInput };
