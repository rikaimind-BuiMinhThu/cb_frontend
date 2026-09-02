import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

// Common field validators that can be used for both zip code and shipping address
const validateFields = {
  postCode: (data) => {
    if (data.split_postal_code) {
      return !stringNullOrEmpty(data.value_post_code_left) && !stringNullOrEmpty(data.value_post_code_right);
    }
    return !stringNullOrEmpty(data.value_post_code);
  },
  
  prefecture: (data) => {
    return !stringNullOrEmpty(data.value_prefecture) || !data.hasOwnProperty('prefecture');
  },
  
  municipality: (data) => {
    return !stringNullOrEmpty(data.value_municipality) || !data.hasOwnProperty('municipality');
  },
  
  address: (data) => {
    if ((data.compact_municipality_and_address && !data.is_display_address_field) || data.compact_municipality_and_address_and_building_name) return true;

    return !stringNullOrEmpty(data.value_address) || !data.hasOwnProperty('address');
  },
  
  building_name: (data) => {
    return !stringNullOrEmpty(data.value_building_name) || !data.hasOwnProperty('building_name');
  },
  
  name: (data) => {
    return !stringNullOrEmpty(data.value_name_left) && !stringNullOrEmpty(data.value_name_right);
  },
  
  kana_name: (data) => {
    return !stringNullOrEmpty(data.value_kana_left) && !stringNullOrEmpty(data.value_kana_right);
  },
  
  number: (data) => {
    return !stringNullOrEmpty(data.value_number1) && 
           !stringNullOrEmpty(data.value_number2) && 
           !stringNullOrEmpty(data.value_number3);
  },
  
  compact_municipality_and_address: (data, requireBuildingName = true) => {
    return (data.municipality === undefined || validateFields.municipality(data)) &&
           (!requireBuildingName || data.building_name === undefined || validateFields.building_name(data));
  },
  
  compact_municipality_and_address_and_building_name: (data) => {
    return data.municipality === undefined || validateFields.municipality(data);
  }
};

// Zip code address: isCheckRequire === "set_required_for_each_item" (postCodeRequired, prefectureRequired, …)
const validateSetRequiredForEachItemAddressFields = (data) => {
  let isValid = true;

  if (data.postCodeRequired && data.post_code !== undefined && !validateFields.postCode(data)) {
    isValid = false;
  }
  if (data.prefectureRequired && data.prefecture !== undefined && !validateFields.prefecture(data)) {
    isValid = false;
  }
  if (data.municipalityRequired && data.municipality !== undefined && !validateFields.municipality(data)) {
    isValid = false;
  }

  const addressOrBuildingRequired = data.addressRequired || data.buildingNameRequired;
  if (addressOrBuildingRequired) {
    if (data.compact_municipality_and_address_and_building_name) {
      if (!validateFields.compact_municipality_and_address_and_building_name(data)) {
        isValid = false;
      }
    } else if (data.compact_municipality_and_address) {
      const requireBuildingName = !!(data.buildingNameRequired && data.building_name !== undefined);
      if (!validateFields.compact_municipality_and_address(data, requireBuildingName)) {
        isValid = false;
      }
      if (data.addressRequired && data.is_display_address_field && data.address !== undefined && !validateFields.address(data)) {
        isValid = false;
      }
    } else {
      if (data.addressRequired && data.address !== undefined && !validateFields.address(data)) {
        isValid = false;
      }
      if (data.buildingNameRequired && data.building_name !== undefined && !validateFields.building_name(data)) {
        isValid = false;
      }
    }
  }

  return isValid;
};

// Common validation logic for address fields
const validateAddressFields = (data, isCheckRequire) => {
  let isValid = true;
  
  if (isCheckRequire === "require") {
    if (data.post_code !== undefined && !validateFields.postCode(data)) isValid = false;
    if (data.prefecture !== undefined && !validateFields.prefecture(data)) isValid = false;
    if (data.municipality !== undefined && !validateFields.municipality(data)) isValid = false;
    if (data.compact_municipality_and_address && !validateFields.compact_municipality_and_address(data)) isValid = false;
    else if (data.compact_municipality_and_address_and_building_name && !validateFields.compact_municipality_and_address_and_building_name(data)) isValid = false;
    else if (data.address !== undefined && !validateFields.address(data)) isValid = false;
  } else if (isCheckRequire === "all_items_require") {
    if (data.post_code !== undefined && !validateFields.postCode(data)) isValid = false;
    if (data.prefecture !== undefined && (!validateFields.prefecture(data) && data.hasOwnProperty('prefecture'))) isValid = false;
    if (data.municipality !== undefined && (!validateFields.municipality(data) && data.hasOwnProperty('municipality'))) isValid = false;
    if (data.compact_municipality_and_address && !validateFields.compact_municipality_and_address(data)) isValid = false;
    else if (data.compact_municipality_and_address_and_building_name && !validateFields.compact_municipality_and_address_and_building_name(data)) isValid = false;
    else if (data.address !== undefined && !validateFields.address(data)) isValid = false;
  } else if (isCheckRequire === "set_required_for_each_item") {
    if (!validateSetRequiredForEachItemAddressFields(data)) isValid = false;
  }
  
  return isValid;
};

// Validation logic for shipping address specific fields
const validateShippingAddressFields = (data, isCheckRequire) => {
  let isValid = true;
  
  if (isCheckRequire === "all_items_require") {
    if (data.name !== undefined && !validateFields.name(data)) isValid = false;
    if (data.kana_name !== undefined && !validateFields.kana_name(data)) isValid = false;
    if (data.post_code !== undefined && !validateFields.postCode(data)) isValid = false;
    if (data.prefecture !== undefined && !validateFields.prefecture(data)) isValid = false;
    if (data.municipality !== undefined && !validateFields.municipality(data)) isValid = false;
    if (!data.compact_municipality_and_address_and_building_name && data.address !== undefined && !validateFields.address(data)) isValid = false;
    if (!data.compact_municipality_and_address_and_building_name && data.building_name !== undefined && !validateFields.building_name(data)) isValid = false;
    if (data.number !== undefined && !validateFields.number(data)) isValid = false;
  }
  
  return isValid;
};

const validateZipCodeAddress = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;

  const isValid = validateAddressFields(contentType, contentType.isCheckRequire);

  if (!isValid) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

const validateShippingAddress = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;

  const isValid = validateShippingAddressFields(contentType, contentType.isCheckRequire);

  if (!isValid) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};


export { validateZipCodeAddress, validateShippingAddress, validateFields };
