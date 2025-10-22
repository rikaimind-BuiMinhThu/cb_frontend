import { findItem } from '../PreviewComponent/Utils';
import { MESSAGE_CONTENT_TYPES, SCAN_REGEX } from '../PreviewComponent/Constants';

const getTextInputValue = (subContent, field) => {
  switch (subContent.type) {
    case "text": {
      const text = subContent.text;
      if (text.isSplitInput) {
        return `${text.valueLeft} ${text.valueRight}`;
      } else {
        return text.value;
      }
    }
    case "phone_number": {
      const phoneNumber = subContent.phone_number;

      if (phoneNumber.withHyphen === false) {
        return phoneNumber.value;
      } else {
        return `${phoneNumber.value1}-${phoneNumber.value2}-${phoneNumber.value3}`;
      }
    }
    case "urls":
    case "email_address":
    case "password": {
      const container = subContent[field];
      return container.value;
    }
    case "email_confirmation": 
    case "password_confirmation": {
      throw new Error("getTextInputValue: email_confirmation or password_confirmation is not supported");
    }
    default:
      return "";
  }
}

const getPulldownValue = (subContent, field, value) => {
  const pullDown = subContent[subContent.type];

  switch (subContent.type) {
    case "customization": {
      if (pullDown.is_comment === false) {
        return pullDown.options_without_comment.find(item => item.value === value)?.text;
      } else {
        return pullDown.options_with_comment.find(item => item.value === value)?.text;
      }
    }
    case "time_hm":
      return `${pullDown.valueHour}:${pullDown.valueMinute}`;
    case "date_ymd":
    case "dob_ymd": {
      return `${pullDown.valueYear}-${pullDown.valueMonth}-${pullDown.valueDay}`;
    }
    case "date_md":
      return `${pullDown.valueMonth}-${pullDown.valueDay}`;
    case "date_ym":
    case "dob_ym": {
      return `${pullDown.valueYear}-${pullDown.valueMonth}`;
    }
    case "date_ymd_hm":
      return `${pullDown.valueYear}-${pullDown.valueMonth}-${pullDown.valueDay} ${pullDown.valueHour}:${pullDown.valueMinute}`;
    case "timezone_from_to": {
      return `${pullDown.valueHour1}:${pullDown.valueMinute1}-${pullDown.valueHour2}:${pullDown.valueMinute2}`;
    }
    case "period_from_to": {
      return `${pullDown.valueYear1}-${pullDown.valueMonth1}-${pullDown.valueDay1} ~ ${pullDown.valueYear2}-${pullDown.valueMonth2}-${pullDown.valueDay2}`;
    }
    case "prefectures": {
      // TODO: Need check to find text from value
      return value;
    }
    case "up_to_municipality": {
      return `${pullDown.prefecture}${pullDown.city}`;
    }
    case "consume_api_response": {
      throw new Error("getPulldownValue: consume_api_response is not supported");
    }
    case "lp_integration_option": {
      // TODO: Need check to find text from value
      return value;
    }
    case "from_js_result": {
      // TODO: Need check to find text from value
      return value;
    }
    default:
      return "";
  }
}

const getRadioButtonDefaultValue = (subContent, value) => {
  const radioButton = subContent.radio_button;
  switch (subContent.type) {
    case "default":
      return radioButton.default.find(item => item.value === value)?.text;
    case "radio_button_img":
      return radioButton.radio_button_img.find(item => item.value === value)?.text;
    case "consume_api_response":
      throw new Error("getRadioButtonDefaultValue: consume_api_response is not supported");
    case "block_style":
      return radioButton.block_style.find(item => item.value === value)?.text;
    default:
      return "";
  }
}

const getCheckboxValue = (subContent, field, value) => {
  const checkbox = subContent.checkbox;
  switch (subContent.type) {
    case "default":
      return checkbox.default.find(item => item.checkedValue === value)?.text;
    case "checkbox_img":
      return checkbox.initial_selection_picture.find(item => item.initial_selection_picture === value)?.text;
    case "consume_api_response":
      throw new Error("getCheckboxDefaultValue: consume_api_response is not supported");
    default:
      return "";
  }
}

const getZipCodeAddressValue = (subContent, prefecturesList) => {
  const zipCodeAddress = subContent.zip_code_address; 
  if (!zipCodeAddress) return "";
  const postCode = !zipCodeAddress.split_postal_code
    ? zipCodeAddress?.value_post_code
    : `${zipCodeAddress.value_post_code_left}${zipCodeAddress.value_post_code_right}`;
  const prefecture = zipCodeAddress?.value_prefecture || "";
  const municipality = zipCodeAddress?.value_municipality || "";
  const address = zipCodeAddress?.value_address || "";
  const buildingName = zipCodeAddress?.value_building_name || "";

  // Safe parse prefecture name in case of using dropdown
  const fixedPrefecture = findItem(prefecturesList, { 
    keys: 'id', 
    value: prefecture, 
    callbackValue: prefecture,
    onSuccess: (item) => item.name,
  });
  return `〒${postCode} ${fixedPrefecture}${municipality} ${address}${buildingName}`;
}

const getShippingAddressValue = (subContent, prefecturesList) => {
  const shippingAddress = subContent.shipping_address;
  const nameLeft = shippingAddress?.value_name_left || "";
  const nameRight = shippingAddress?.value_name_right || "";
  const kanaLeft = shippingAddress?.value_kana_left || "";
  const kanaRight = shippingAddress?.value_kana_right || "";

  const name = `${nameLeft} ${nameRight}`;
  const kana = `${kanaLeft} ${kanaRight}`;

  const prefecture = shippingAddress?.value_prefecture || "";
  const municipality = shippingAddress?.value_municipality || "";
  const address = shippingAddress?.value_address || "";
  const buildingName = shippingAddress?.value_building_name || "";

  const fixedPrefecture = findItem(prefecturesList, { 
    keys: 'id', 
    value: prefecture, 
    callbackValue: prefecture,
    onSuccess: (item) => item.name,
  });
  return `${name} ${kana} ${fixedPrefecture}${municipality} ${address}${buildingName}`;
}

const getCardPaymentRadioButtonValue = (subContent, value, field) => {
  switch (subContent.type) {
    case "default":
    case "customized_style": {
      return subContent.radio_contents.find(item => item.value === value)?.text;
    }
    case "picture_radio": {
      return subContent.radio_contents_img.find(item => item.initial_selection_picture === value)?.text;
    }
    default:
      return "";
  }
}

const getCarouselDefaultValue = (subContent,value) => {
  // TODO: Need check to find value
  return value;
  // let default_value = subContent[
  //   subContent.carousel
  // ].contents.find((item) => item.id === value).title;
  // return default_value;
}

const getDefaultValue = (subContent, contentType, value, field, prefecturesList) => {
  switch (contentType) {
    case MESSAGE_CONTENT_TYPES.TEXT_INPUT:
      return getTextInputValue(subContent, field);
    case MESSAGE_CONTENT_TYPES.TEXT_AREA:
      return value;
    case MESSAGE_CONTENT_TYPES.RADIO_BUTTON:
      return getRadioButtonDefaultValue(subContent, value);
    case MESSAGE_CONTENT_TYPES.CHECKBOX:
      return getCheckboxValue(subContent, field);
    case MESSAGE_CONTENT_TYPES.PULL_DOWN:
      return getPulldownValue(subContent, field, value);
    case MESSAGE_CONTENT_TYPES.CAROUSEL:
      return getCarouselDefaultValue(subContent, value);
    case MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS:
      return getZipCodeAddressValue(subContent, prefecturesList);
    case MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS:
      return getShippingAddressValue(subContent, prefecturesList);
    case MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_SELECT_OPTION:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    case MESSAGE_CONTENT_TYPES.ATTACHMENT:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    case MESSAGE_CONTENT_TYPES.CALENDAR:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    case MESSAGE_CONTENT_TYPES.AGREE_TERM:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    case MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    case MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON:
      return getCardPaymentRadioButtonValue(subContent, field, value);
    case MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    case MESSAGE_CONTENT_TYPES.IMAGE:
    case MESSAGE_CONTENT_TYPES.LABEL:
    case MESSAGE_CONTENT_TYPES.LABEL_NO_TRANSITION:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
    default:
      throw new Error(`getDefaultValue: ${contentType} is not supported`);
  }
}

const replaceVariables = (contentText, variables) => {
  return (contentText || "").replaceAll(SCAN_REGEX, (_, variable) => {
    return variables.find(item => item.variable_name === variable)?.default_value || "";
  });
}

export { getDefaultValue, replaceVariables };