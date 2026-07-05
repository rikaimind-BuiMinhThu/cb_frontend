import { MESSAGE_CONTENT_TYPES } from '../PreviewComponent/Constants.jsx';
import { removeLeadingZero } from '../PreviewComponent/Utils.js';

const convertTextInputTextObject = (content) => {
  const {
    text_input: {text: {value, valueLeft, valueRight, isSplitInput}},
    left_fukushashiki_search_mode: leftSearchMode,
    right_fukushashiki_search_mode: rightSearchMode,
    fukushashiki_search_mode: searchMode,
    left_fukushashiki_search_value: leftSearchValue,
    right_fukushashiki_search_value: rightSearchValue,
    fukushashiki_search_value: searchValue
  } = content;

  if (!value && !valueLeft && !valueRight) {
    return [];
  }
  const result = [];
  if (isSplitInput == true) {
    const fukuObjectLeft = {
      type: content.type,
      bindingMode: leftSearchMode,
      bindingAddress: leftSearchValue,
      bindingValue: valueLeft,
    };
    const fukuObjectRight = {
      type: content.type,
      bindingMode: rightSearchMode,
      bindingAddress: rightSearchValue,
      bindingValue: valueRight,
    };
    result.push(fukuObjectLeft);
    result.push(fukuObjectRight);
  }

  if (searchValue?.includes(',')) {
      let address = searchValue.split(',');
    address.forEach(value => {
      const fukuObject = {
        type: content.type,
        bindingMode: searchMode,
        bindingAddress: value,
        bindingValue: value,
      };
      result.push(fukuObject);
    });
  }
  else {
    const fukuObject = {
      type: content.type,
      bindingMode: searchMode,
      bindingAddress: searchValue,
      bindingValue: value,
    };
    result.push(fukuObject);
  }
  return result;
}

const convertTextInputPhoneNumberObject = (content) => {
  const { value, withHyphen } = content.text_input.phone_number;

  if (withHyphen === false) {
    if (!value) return [];
    return [{
      type: content.type,
      bindingMode: content.fukushashiki_search_mode,
      bindingAddress: content.fukushashiki_search_value,
      bindingValue: value,
    }];
  }

  const disableRemoveLeadingZero = !!content.text_input?.phone_number?.disable_remove_leading_zero;

  const dataInforFukushashiki = Object.fromEntries(
    Object.entries(content).filter(([key]) => key.includes("fukushashiki"))
  );

  const types = ["value1", "value2", "value3"];
  const result = types
    .filter(type => {
      const value = content.text_input.phone_number?.[type];
      return value !== null && value !== undefined;
    })
    .map((type) => {
      const row = {
        type: content.type,
        bindingMode: dataInforFukushashiki[`${type}_fukushashiki_search_mode`],
        bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
        bindingValue: content.text_input.phone_number[`${type}`] || "",
      };
      if (disableRemoveLeadingZero) {
        row.disableRemoveLeadingZero = true;
      }
      return row;
    });

  return result;
}

const convertTextInputValueObject = (content) => {
  const type = content.text_input.type;
  const htmlAddresses = content.fukushashiki_search_value?.split(',') || [content.fukushashiki_search_value];
  let result = [];

  htmlAddresses.forEach(htmlAddress => {
    const bindingValue = content.text_input[type]?.value;
    if (bindingValue !== null && bindingValue !== undefined) {
      result.push({
        type: content.type,
        bindingMode: content.fukushashiki_search_mode,
        bindingAddress: htmlAddress?.trim() || "",
        bindingValue: bindingValue,
      });
    }
  });

  return result;
}

const convertTextInputConfirmationObject = (content) => {
  const type = content.text_input.type;

  return [
    {
      type: content.type,
      bindingMode: content.value_fukushashiki_search_mode,
      bindingAddress: content.value_fukushashiki_search_value,
      bindingValue: content.text_input[type]?.value || "",
    },
    {
      type: content.type,
      bindingMode: content.valueConfirm_fukushashiki_search_mode,
      bindingAddress: content.valueConfirm_fukushashiki_search_value,
      bindingValue: content.text_input[type]?.valueConfirm || "",
    },
  ];
}

const convertPasswordConfirmationObject = (content) => {
  return [
    {
      type: content.type,
      bindingMode: content.fukushashiki_search_mode,
      bindingAddress: content.fukushashiki_search_value,
      bindingValue: content.text_input.password_confirmation.value,
    },
    {
      type: content.type,
      bindingMode: content.confirm_fukushashiki_search_mode,
      bindingAddress: content.confirm_fukushashiki_search_value,
      bindingValue: content.text_input.password_confirmation.valueConfirm,
    }
  ];
}

// Helper functions for each message type
const convertTextInputObject = (content) => {
  // convert for text_input text type
  const result = [];
  let fukuData = [];
  switch (content.text_input.type) {
    case 'text':
      fukuData = convertTextInputTextObject(content);
      break;
    case 'phone_number':
      fukuData = convertTextInputPhoneNumberObject(content);
      break;
    case 'email_address':
    case 'urls':
    case 'password':
      fukuData = convertTextInputValueObject(content);
      break;
    
    case 'email_confirmation':
      fukuData = convertTextInputConfirmationObject(content);
      break;
    case 'password_confirmation':
      fukuData = convertPasswordConfirmationObject(content);
      break;
    default:
      break;
  }
  if (fukuData.length > 0) {
    result.push(fukuData);
  }

  return result.flat();
};

const convertAgreeTermObject = (content) => {
  let searchValue = content.fukushashiki_search_value;
  if (!searchValue) return [];

  const result = [];
  
  if (searchValue.includes(',')) {
    let values = searchValue.split(',');
    values.forEach(value => {
      let trimmedValue = value.trim();
      const fukuObject = {
        type: content.type,
        bindingMode: content.fukushashiki_search_mode,
        bindingAddress: trimmedValue,
        bindingValue: content.agree_term.isAgree,
      };
      result.push(fukuObject);
    });
  } else {
    const fukuObject = {
      type: content.type,
      bindingMode: content.fukushashiki_search_mode,
      bindingAddress: content.fukushashiki_search_value,
      bindingValue: content.agree_term.isAgree,
    };
    result.push(fukuObject);
  }
  
  return result;
};

const convertSliderObject = (content) => {
  const result = [];
  const fukuObject = {
    type: content.type,
    bindingMode: content.fukushashiki_search_mode,
    bindingAddress: content.fukushashiki_search_value,
    bindingValue: content.slider.value,
  };
  result.push(fukuObject);
  return result;
};

const convertPullDownObject = (content) => {
  const result = [];
  // Handle customization
  if (content.pull_down?.customization.length != 0) {
    const textInDropdown = content.pull_down.customization.value || content.pull_down.initial_selection;
    if (content.pull_down.customization.is_comment == true) {
      // Handle comment case
    }
    else {
      content.pull_down.customization.options_without_comment.forEach((item) => {
        if (!!textInDropdown && item.value == textInDropdown) {
          const fukuObject = {
            type: content.type,
            bindingMode: content.fukushashiki_search_mode,
            bindingAddress: content.fukushashiki_search_value,
            bindingValue: item.value
          };
          result.push(fukuObject);
        }
      })
    }
  }

  // Handle LP integration option
  if (content.pull_down?.type == "lp_integration_option") {
    if (content.pull_down.lp_integration_option.value != "") {
      const fukuObject = {
        type: content.type,
        pulldownType: content.pull_down.type,
        bindingMode: content.pull_down.lp_element_search_mode,
        bindingAddress: content.pull_down.lp_element_search_value,
        bindingValue: content.pull_down.lp_integration_option.value
      };
      result.push(fukuObject);
    }
  }

  // Handle from JS result
  if (content.pull_down?.type == MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) {
    if (content.pull_down.from_js_result.value?.toString() != "") {
      const fukuObject = {
        type: content.type,
        pulldownType: content.pull_down.type,
        bindingMode: content.pull_down.from_js_result_target_search_mode,
        bindingAddress: content.pull_down.from_js_result_target_search_value,
        bindingValue: content.pull_down.from_js_result.value
      };
      result.push(fukuObject);
    }
  }

  // Handle date/time values
  const userInputData = Object.fromEntries(
    Object.entries(content.pull_down?.date_md || {}).filter(([key]) => key.includes("value"))
  );

  const additionalKeys = [
    'time_hm',
    'date_ymd',
    'date_ym',
    'date_ymd_hm',
    'dob_ymd',
    'dob_ym',
    'timezone_from_to',
    'period_from_to',
    'up_to_municipality',
    'prefectures'
  ];

  additionalKeys.forEach(key => {
    const entries = Object.entries(content.pull_down?.[key] || {}).filter(([k]) => k.includes("value"));
    Object.assign(userInputData, Object.fromEntries(entries));
  });

  const dataInforFukushashiki = Object.fromEntries(
    Object.entries(content).filter(([key]) => key.includes("fukushashiki"))
  );

  const types = ["day", "month", "year", "hour", "minute", "Day", "Month", "Year", "Hour", "Minute", "valueDay", "valueMonth", "valueYear", "valueHour", "valueMinute"];
  const typesResult = types
    .filter(type => `${type}` in userInputData)
    .map(type => ({
      type: "pull_down",
      bindingMode: dataInforFukushashiki[`${type}_fukushashiki_search_mode`],
      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
      bindingValue: removeLeadingZero(userInputData[`${type}`]),
    }));
  result.push(...typesResult);

  return result;
};

const convertTextareaObject = (content) => {
  const result = [];
  if (content.textarea.text_input.value != undefined) {
    const fukuObject = {
      type: content.type,
      bindingMode: content.fukushashiki_search_mode,
      bindingAddress: content.fukushashiki_search_value,
      bindingValue: content.textarea.text_input.value,
    };
    result.push(fukuObject);
  }
  return result;
};

const convertZipCodeAddressObject = (content) => {
  const result = [];
  const userInputData = Object.fromEntries(
    Object.entries(content.zip_code_address).filter(([key]) => key.includes("value_"))
  );
  const dataInforFukushashiki = Object.fromEntries(
    Object.entries(content).filter(([key]) => key.includes("fukushashiki"))
  );
  const types = [
    "post_code",
    "post_code_left",
    "post_code_right",
    "await",
    "prefecture",
    "address",
    "building_name",
    "municipality"
  ];              
  const typesResult = types
    .filter(type => type === "await" || `value_${type}` in userInputData)
    .map(type => {
      const bindingMode = dataInforFukushashiki[`${type}_fukushashiki_search_mode`];

      if (bindingMode === undefined && type !== "await") {
        return null;
      }

      return {
        type: content.zip_code_address.is_use_dropdown ? "dropdown_prefecture" : "zip_code_address",
        bindingMode: bindingMode,
        additionalType: type,
        bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
        bindingValue: userInputData[`value_${type}`] || null
      };
    })
    .filter(item => item !== null);
  result.push(...typesResult);
  return result;
};

const convertShippingAddressObject = (content) => {
  const result = [];
  const userInputData = Object.fromEntries(
    Object.entries(content.shipping_address).filter(([key]) => key.includes("value_"))
  );
  const dataInforFukushashiki = Object.fromEntries(
    Object.entries(content).filter(([key]) => key.includes("fukushashiki"))
  );
  const types = ["number1", "number2", "number3", "number", "name_left", "name_right", "kana_left", "kana_right", "building_name", "address", "municipality", "prefecture", "post_code", "post_code_left", "post_code_right", "initial_selection"];
  const typesResult = types
    .filter(type => `value_${type}` in userInputData)
    .map(type => {
      const bindingMode = dataInforFukushashiki[`${type}_fukushashiki_search_mode`];
      const bindingValue = dataInforFukushashiki[`${type}_fukushashiki_search_value`];
      if (bindingMode === undefined || bindingValue == undefined || bindingValue.length == 0) {
        return null;
      }
      if (type == "initial_selection") {
        const objA = {
          type: "initial_selection",
          bindingMode,
          bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
          bindingValue: userInputData[`value_${type}`]
        };
        result.push(objA)
      }
      if (type == "address") {
        const objA = {
          type: "zip_code_address",
          bindingMode,
          bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
          bindingValue: userInputData[`value_${type}`]
        };
        result.push(objA)
      }
      return {
        type: content.shipping_address.is_use_dropdown ? "dropdown_prefecture" : "shipping_address",
        bindingMode: bindingMode,
        bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
        bindingValue: userInputData[`value_${type}`]
      };
    })
    .filter(item => item !== null);
  result.push(...typesResult);
  return result;
};

const convertRadioButtonObject = (content) => {
  const result = [];
  const initialSelection = content.radio_button.initial_selection;
  let selectedElement = content.radio_button.default.find(item => item.value === initialSelection);
  if (!selectedElement) {
    selectedElement = content.radio_button.radio_button_img.find(item => item.value === initialSelection);
  }
  if (selectedElement) {
    const value = selectedElement.value;
    const fukuObject = {
      type: content.type,
      bindingMode: content.initial_selection_fukushashiki_search_mode,
      bindingAddress: content.initial_selection_fukushashiki_search_value,
      bindingValue: value.toString()
    };
    result.push(fukuObject);
  }
  return result;
};

const convertCheckboxObject = (content) => {
  const result = [];
  if (content.checkbox.checkedValue.length > 0) {
    const fukuObject = {
      type: content.type,
      bindingMode: content.checkedValue_fukushashiki_search_mode,
      bindingAddress: content.checkedValue_fukushashiki_search_value,
      bindingValue: true
    };
    result.push(fukuObject);
  }
  else {
    const fukuObject = {
      type: content.type,
      bindingMode: content.checkedValue_fukushashiki_search_mode,
      bindingAddress: content.checkedValue_fukushashiki_search_value,
      bindingValue: false
    };
    result.push(fukuObject);
  }
  return result;
};

const convertCardPaymentObject = (content) => {
  const result = [];
  const keysToExtract = [
    "initial_selection", "card_holder1", "card_holder2",
    "card_number1", "card_number2", "card_number3", "card_number4",
    "card_holder", "card_number",
    "year", "month", "cvc", "installment"
  ];
  const userInputData = keysToExtract.reduce((res, key) => {
    if (content[content.type]?.[key] !== undefined) {
      res[key] = content[content.type][key];
    }
    return res;
  }, {});
  const dataInforFukushashiki = Object.fromEntries(
    Object.entries(content).filter(([key]) => key.includes("fukushashiki"))
  );
  const types = ["card_number", "card_holder1", "card_holder2",
    "card_holder", "year", "month",
    "cvc", "card_number1", "card_number2", "card_number3",
    "card_number4", "installment", "initial_selection"];
  const typesResult = types
    .filter(type => type in userInputData)
    .map(type => {
      const fukuData = {
        bindingMode: dataInforFukushashiki[`${type}_fukushashiki_search_mode`],
        bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
        bindingValue: userInputData[`${type}`]
      }

      if (!fukuData.bindingMode || !fukuData.bindingValue || !fukuData.bindingAddress) return;

      if (type == "initial_selection") {
        return { type: "payment_method_id", ...fukuData }
      }
      if (type == "card_number") {
        return { type: "card_number", ...fukuData };
      }
      return { type: content.type, ...fukuData };
    })
    .filter(item => item);
  result.push(...typesResult);
  return result;
};

const convertToFukushashikiObject = (obj) => {
  const result = [];
  if (
    obj &&
    obj.message.message_content &&
    obj.message.message_content.length > 0
  ) {
    const messageContents = obj.message.message_content;
    messageContents.forEach((content) => {
      switch (content.type) {
        case 'text_input':
          result.push(...convertTextInputObject(content));
          break;
        case 'agree_term':
          result.push(...convertAgreeTermObject(content));
          break;
        case 'slider':
          result.push(...convertSliderObject(content));
          break;
        case "pull_down":
          result.push(...convertPullDownObject(content));
          break;
        case 'textarea':
          result.push(...convertTextareaObject(content));
          break;
        case 'zip_code_address':
          result.push(...convertZipCodeAddressObject(content));
          break;
        case 'shipping_address':
          result.push(...convertShippingAddressObject(content));
          break;
        case 'radio_button':
          result.push(...convertRadioButtonObject(content));
          break;
        case 'checkbox':
          result.push(...convertCheckboxObject(content));
          break;
        case 'card_payment_radio_button':
        case 'credit_card_payment':
          result.push(...convertCardPaymentObject(content));
          break;
        default: 
          break;
      }
    })
    return result.flat();
  }
}

export {
  convertToFukushashikiObject
}