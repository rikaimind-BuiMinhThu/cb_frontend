import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validatePullDown = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}_${contentType.type}`;

  switch (contentType.type) {
    case "customization":
      return validateCustomizationType(contentType, key, errorsMess);
    case "time_hm":
      return validateTimeHMType(contentType, key, errorsMess);
    case "date_ymd":
    case "dob_ymd":
      return validateDateYMDType(contentType, key, errorsMess);
    case "date_md":
      return validateDateMDType(contentType, key, errorsMess);
    case "date_ym":
    case "dob_ym":
      return validateDateYMType(contentType, key, errorsMess);
    case "date_ymd_hm":
      return validateDateYMDHMType(contentType, key, errorsMess);
    case "timezone_from_to":
      return validateTimezoneFromToType(contentType, key, errorsMess);
    case "period_from_to":
      return validatePeriodFromToType(contentType, key, errorsMess);
    case "up_to_municipality":
      return validateUpToMunicipalityType(contentType, key, errorsMess);
    case "prefectures":
    case "lp_integration_option":
    case "from_js_result":
      return validateValueField(contentType, key, errorsMess);
    case "consume_api_response":
      return validateConsumeApiResponseType(contentType, key, errorsMess);
    default:
      return validateValueField(contentType, key, errorsMess);
  }
};

const validateCustomizationType = (contentType, key, errorsMess) => {
  const subContent = contentType[contentType.type];
  const { value, is_comment } = subContent;

  if (is_comment === false) {
    if (contentType.require && stringNullOrEmpty(value)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }
  } else if (contentType.require) {
    const fields = ["valueLeft", "valueRight"];
    return validateMultipleValueField(contentType, key, errorsMess, fields);
  }

  return true;
};

const validateTimeHMType = (contentType, key, errorsMess) => {
  const fields = ["valueHour", "valueMinute"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validateDateYMDType = (contentType, key, errorsMess) => {
  const fields = ["valueYear", "valueMonth", "valueDay"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validateDateMDType = (contentType, key, errorsMess) => {
  const fields = ["valueMonth", "valueDay"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validateDateYMType = (contentType, key, errorsMess) => {
  const fields = ["valueYear", "valueMonth"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validateDateYMDHMType = (contentType, key, errorsMess) => {
  const fields = ["valueYear", "valueMonth", "valueDay", "valueHour", "valueMinute"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validateTimezoneFromToType = (contentType, key, errorsMess) => {
  const fields = ["valueHour1", "valueMinute1", "valueHour2", "valueMinute2"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validatePeriodFromToType = (contentType, key, errorsMess) => {
  const fields = ["valueYear1", "valueMonth1", "valueDay1", "valueYear2", "valueMonth2", "valueDay2"];
  return validateMultipleValueField(contentType, key, errorsMess, fields);
};

const validateUpToMunicipalityType = (contentType, key, errorsMess) => {
  const data = contentType[contentType.type] || {};
  const { prefecture, city } = data;

  if (contentType.require && (stringNullOrEmpty(prefecture) || stringNullOrEmpty(city))) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }
  return true;
};

const validateValueField = (contentType, key, errorsMess) => {
  const subContent = contentType[contentType.type];
  const { value } = subContent;
  if (contentType.require && stringNullOrEmpty(value)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }
  return true;
};

const validateMultipleValueField = (contentType, key, errorsMess, fields) => {
  const subContent = contentType[contentType.type];
  const values = fields.map(field => subContent[field]);

  if (contentType.require) {
    if (values.some(stringNullOrEmpty)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }
  } else {
    const isAllFieldsEmpty = values.every(stringNullOrEmpty);
    const isAllFieldsNotEmpty = values.every(value => !stringNullOrEmpty(value));

    if (isAllFieldsEmpty || isAllFieldsNotEmpty) return true;
    
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};
  


const validateConsumeApiResponseType = (contentType, key, errorsMess) => {
  throw new Error("Not implemented");
};


export { validatePullDown };
