import api from "api/api-management";
import { tokenExpired } from "v2/api/tokenExpired";
import {
  CHATBOT_SERVER,
  CURRENCY_UNITS,
  GET_CAPTCHA_PATH,
  CONVERSION_RESPONSE_SUBMIT_TYPE,
  CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE,
  MESSAGE_CONTENT_TYPES,
} from "./Constants";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const stringNullOrEmpty = (string) => {
  return !string || (string + "").trim() === "";
};

const getAllUrlParams = (url) => {
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split("#")[0];
    var arr = queryString.split("&");
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split("=");
      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];
      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string")
        paramValue = paramValue.toLowerCase();
      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, "");
        if (!obj[key]) obj[key] = [];
        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
};

const lightenColor = (hex, opacity) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const isMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

const removeLeadingZero = (value) => {
  let strValue = value.toString();
  let result = strValue.replace(/^0+/, '');
  return typeof value === 'number' ? Number(result) : result;
};

const postToChatBotServer = (url, data) => {
  return new Promise((resolve, reject) => {
    api
      .post(url, data)
      .then((res) => {
        if (resolve) resolve(res);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) tokenExpired();
        if (reject) reject(error);
        console.error(error);
      });
  });
};

const patchToChatBotServer = (url, data) => {
  return new Promise((resolve, reject) => {
    api
      .patch(url, data)
      .then((res) => {
        if (resolve) resolve(res);
      })
      .catch((error) => {
        if (reject) reject(error);
        console.error(error);
      });
  });
};

const getToChatBotServer = (url) => {
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((res) => {
        if (resolve) resolve(res);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) tokenExpired();
        if (reject) reject(error);
        console.error(error);
      });
  });
};

const sendUserInteractionData = (data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.SCENARIO_USER_RESPONSE_PATH,
    data
  );
};

const sendCreateOrderData = (data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.SCENARIO_CREATE_ORDER_PATH,
    data
  );
};

const sendCountRequest = (scenarioId, data) => {
  return patchToChatBotServer(
    CHATBOT_SERVER.CONVERSION_PATH.replace(":scenario_id", scenarioId),
    data
  );
};

const sendOpenChatbotCountRequest = (scenarioId, deviceReceive) => {
  const data = { scenario_data: `${deviceReceive}_open_chatbot_window` };
  return sendCountRequest(scenarioId, data);
};

const sendCloseChatbotCountRequest = (scenarioId, deviceReceive) => {
  const data = { scenario_data: `${deviceReceive}_close_chatbot_window` };
  return sendCountRequest(scenarioId, data);
};

const sendLogMessageToServer = (submitData, submitType) => {
  const { message, ...data } = submitData;
  const dataLog = sendScenarioUserResponse(submitData);

  const convertType = {
    [CONVERSION_RESPONSE_SUBMIT_TYPE.ADD]: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.ADD,
    [CONVERSION_RESPONSE_SUBMIT_TYPE.UPDATE]: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.RETRY,
    [CONVERSION_RESPONSE_SUBMIT_TYPE.ERROR]: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.ERROR,
  }

  const messageSubmitType = convertType[submitType];
  
  if (!messageSubmitType) return;

  createScenarioUserResponseMessageHistory({
    ...data,
    msgs: [{ id: message.id, type: messageSubmitType }],
  });

  return dataLog;
}

const sendAppearLogToServer = (data) => {
  return createScenarioUserResponseMessageHistory({
    scenario_id: data.scenario_id,
    user_id: data.user_id,
    msgs: [{ id: data.message.id, type: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.APPEAR }],
  });
};

const sendErrorLogToServer = (submitData) => {
  return sendLogMessageToServer(submitData, CONVERSION_RESPONSE_SUBMIT_TYPE.ERROR);
}

const getPrefectures = () => {
  return getToChatBotServer(CHATBOT_SERVER.GET_PREFECTURES_PATH);
};

const getCitiesByPrefecture = (prefectureJisCode) => {
  return getToChatBotServer(
    CHATBOT_SERVER.GET_CITIES_PATH.replace(":prefecture_jis_code", prefectureJisCode)
  );
};

const getTownsByCity = (cityJisCode) => {
  return getToChatBotServer(
    CHATBOT_SERVER.GET_TOWNS_PATH.replace(":city_jis_code", cityJisCode)
  );
};

const getScenarioPreviewData = (botId, scenarioId) => {
  return getToChatBotServer(
    CHATBOT_SERVER.GET_SCENARIO_PREVIEW_DATA_PATH
      .replace(":scenario_id", scenarioId)
      .replace(":bot_id", botId)
  );
};

const getChatBotSetting = (botId) => {
  return getToChatBotServer(
    CHATBOT_SERVER.GET_CHATBOT_SETTING_PATH.replace(":bot_id", botId)
  );
}

const patchWithDrawalPreview = (botId, data) => {
  return patchToChatBotServer(
    CHATBOT_SERVER.WITHDRAWAL_RESPONSE.replace(":bot_id", botId), data
  )
} 

const sendEmailRequest = (emailId, data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.SEND_EMAIL_PATH.replace(":email_id", emailId),
    data
  );
}

const sendConvertTextJapaneseRequest = (text) => {
  return postToChatBotServer(
    CHATBOT_SERVER.CONVERT_TEXT_JAPANESE_PATH,
    { text }
  );
}

const sendScenarioUserResponse = (data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.SEND_SCENARIO_USER_RESPONSE,
    data
  );
}

const createStatusConversion = (data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.CREATE_STATUS_CONVERSION_USER_RESPONSE,
    data
  );
}

const updateStatusConversion = (data) => {
  return patchToChatBotServer(
    CHATBOT_SERVER.UPDATE_STATUS_CONVERSION_USER_RESPONSE,
    data
  );
}

const createScenarioUserResponseMessageHistory = (data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.CREATE_USER_SCENARIO_RESPONSE_MESSAGE_HISTORY,
    data,
  );
}

const userEntryScenario = (data) => {
  return postToChatBotServer(
    CHATBOT_SERVER.USER_ENTRY_SCENARIO,
    data,
  );
}

const getCaptcha = (size, color, charPreset) => {
  const url = GET_CAPTCHA_PATH.replace(":size", size)
    .replace(":color", color)
    .replace(":char_preset", charPreset);

  return new Promise((resolve, reject) => {
    api
      .get(url, data)
      .then((res) => {
        if (resolve) resolve(res);
      })
      .catch((error) => {
        if (reject) reject(error);
        console.error(error);
      });
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Append query parameters to URL
 * @param {string} url - Base URL to append parameters to
 * @param {Object} params - Object containing parameters to append
 * @returns {string} URL with appended parameters
 */
const appendParamsToUrl = (url, params) => {
  if (!url) return '';

  const queryString = Object.entries(params)
    .filter(([_, value]) => value != null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  if (!queryString) return url;

  return url.includes('?')
    ? `${url}&${queryString}`
    : `${url}?${queryString}`;
};

const checkMessageCondition = (message, buildParam) => {
  if (message.conditions.length === 0) return true;

  let checked = false;
  for (let j = 0; j < message.conditions.length; j++) {
    const conditionItem = message.conditions[j];
    const buildParamValue = buildParam[conditionItem.nameCondition];

    let subCheck = false;

    switch (conditionItem.condition) {
      case "include":
        subCheck = buildParamValue && buildParamValue.includes(conditionItem.inputCondition);
        break;
      case "is":
        subCheck = buildParamValue && buildParamValue == conditionItem.inputCondition;
        break;
      case "not_include":
        subCheck = !buildParamValue || !buildParamValue.includes(conditionItem.inputCondition);
        break;
      case "is_not":
        subCheck = !buildParamValue || buildParamValue != conditionItem.inputCondition;
        break;
      default:
        break;
    }
    if (j === 0) {
      checked = subCheck;
    } else if (conditionItem?.linkCondition === "and") {
      checked = checked && subCheck;
    } else if (conditionItem?.linkCondition === "or") {
      checked = checked || subCheck;
    }
  }

  return checked;
}

const checkFaqMessageCondition = (message, buildParam, loopCount) => {
  if (message.conditions.length === 0) return true;

  let checked = false;
  for (let j = 0; j < message.conditions.length; j++) {
    const conditionItem = message.conditions[j];
    const nameCondition = loopCount > 0 ? `${loopCount}_${conditionItem.nameCondition}` : conditionItem.nameCondition;
    const buildParamValue = buildParam[nameCondition];

    let subCheck = false;

    switch (conditionItem.condition) {
      case "include":
        subCheck = buildParamValue && buildParamValue.includes(conditionItem.inputCondition);
        break;
      case "is":
        subCheck = buildParamValue && buildParamValue == conditionItem.inputCondition;
        break;
      case "not_include":
        subCheck = !buildParamValue || !buildParamValue.includes(conditionItem.inputCondition);
        break;
      case "is_not":
        subCheck = !buildParamValue || buildParamValue != conditionItem.inputCondition;
        break;
      default:
        break;
    }
    if (j === 0) {
      checked = subCheck;
    } else if (conditionItem?.linkCondition === "and") {
      checked = checked && subCheck;
    } else if (conditionItem?.linkCondition === "or") {
      checked = checked || subCheck;
    }
  }

  return checked;
}

const getAddressFromZipCode = (zipCode) => {
  return getToChatBotServer(
    CHATBOT_SERVER.GET_ADDRESS_FROM_ZIP_CODE_PATH.replace(":zip_code", zipCode)
  );
}

export const buildConditionParams = (theState) => {
  const result = _.cloneDeep(theState.objParam);
  const currentUrlParams = getAllUrlParams(window.location.search);
  return { ...result, current_url: Object.keys(currentUrlParams) };
}

/**
 * 
 * @param {*} format using dd || hh || mm || ss || ms
 */
const secondToDatetime =(
  sec, 
  format = "{{dd}}:{{hh}}:{{mm}}:{{ss}}:{{ms}}",
  omitLeadingZero = true,
) => {
  let paramsSec = sec < 0 ? 0 : (sec || 0);

  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;     
  const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;   
  const MILISECONDS_IN_SECOND = 1000; 

  const timeParts = {
    dd: Math.floor(paramsSec / SECONDS_IN_DAY) || 0,
    hh: Math.floor((paramsSec % SECONDS_IN_DAY) / SECONDS_IN_HOUR) || 0,
    mm: Math.floor((paramsSec % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE) || 0,
    ss: Math.floor((paramsSec % SECONDS_IN_MINUTE)) || 0,
    ms: Math.floor((paramsSec % 1) * MILISECONDS_IN_SECOND).toString().slice(-2) || 0, 
  };

  const pad = (n) => String(n).padStart(2, '0');

  const regex = /{{(dd|hh|mm|ss||ms)}}[^{{}]*/g;
  const matches = [...format.matchAll(regex)];

  let formatted = "";

  let firstNonZeroIndex = 0;
  
  if (omitLeadingZero) {
    firstNonZeroIndex = matches.findIndex(([match, key]) => timeParts[key] > 0);

    if (firstNonZeroIndex === -1) firstNonZeroIndex = matches.length - 1;
  }

  for (let i = firstNonZeroIndex; i < matches.length; i++) {
    const [match, key] = matches[i];
    const value = pad(timeParts[key]);

    formatted += match.replace(`{{${key}}}`, value);
  }

  return formatted;
}
const isUndefined = (value) => {
  return value === undefined;
}

/**
 * keys can use . to access nested object
 */
const findItem = (array, { keys, value, onSuccess = (v) => v, callbackValue = null }) => {
  if (!array || !keys) return callbackValue;
  let keysArray = [];

  if (typeof keys === 'string') {
    keysArray = keys.split('.');
  } else if (Array.isArray(keys)) {
    keysArray = keys;
  } else {
    return callbackValue;
  }


  if (keysArray.length === 0) return callbackValue;

  if (typeof array !== 'object' || !Array.isArray(array)) return callbackValue;

  const foundItem = array.find(item => {
    const itemValue = keysArray.reduce((acc, key) => isUndefined(acc) ? acc : acc[key], item);
    return itemValue === value;
  });

  let returnValue = foundItem;

  if (onSuccess && foundItem) {
    try {
      returnValue = onSuccess(foundItem);
    } catch {
      return callbackValue;
    }
  }

  return returnValue || callbackValue;
} 
const toCamelCase = (str = "") => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

const changeElementAttributeById = (ids = []) => {
  for (const { id, ...attributes } of ids) {
    const element = document.getElementById(id);
    if (!element) continue;
    
    for (const [key, value] of Object.entries(attributes)) {
      try {
      if (key === "style" && typeof value === "object") {
        Object.entries(value).forEach(([styleKey, styleValue]) => {
          element.style[toCamelCase(styleKey)] = styleValue;
        });
      } else {
        element.setAttribute(key, value);
      }
      } catch {
        continue;
      }
    }
  }
}

const scrollToPosition = (options = {}) => {
  const {
    selector = null,
    forceScroll = false,
    position = "b",
  } = options;

  if (!selector) return;

  const element = document.querySelector(selector);
  if (!element) return;

  let top = 0;

  switch (position) {
    case "b":
      top = element.scrollHeight;
      break;
    case "t":
      top = 0;
  }

  element.scrollTo({
    top,
    behavior: forceScroll ? "auto" : "smooth",
  });
}

const removeSpace = (text, trim = true) => {
  const replacedText = text.replace(/ /g, "");
  return trim ? replacedText.trim() : replacedText;
}

const getColor = (color, options = {}) => {
  const { toUpperCase = false, trim = true, addHash = true, ignoreEmpty } = options;
  
  let baseColor = color;

  if (toUpperCase) {
    baseColor = baseColor.toUpperCase();
  }

  if (trim) {
    baseColor = baseColor.trim();
  }

  if (addHash && !baseColor.startsWith("#")) {
    if (!ignoreEmpty || baseColor !== "") {
      baseColor = `#${baseColor}`;
    }
  }

  return baseColor;
};

const hideMessageOnError = (message) => {
  if (!message.hidden && message.not_display_when_have_error) {
    return { ...message, hidden: true };
  }
  return message;
};

const processMessagesForErrorState = (payload) => {
  const processedPayload = { ...(payload || {}) };
  
  if (processedPayload.messagesList) {
    processedPayload.messagesList = processedPayload.messagesList.map(hideMessageOnError);
  }

  if (processedPayload.renderMessagesList) {
    processedPayload.renderMessagesList = processedPayload.renderMessagesList.map(hideMessageOnError);
  }

  return processedPayload;
};

const createTempDelay = (seconds = 0.5, prefix) => {
  return {
    id: `${prefix || ''}${Date.now()}`,
    belong_to: 'bot',
    message_name: 'delay',
    message_content: [{ type: 'delay', delay: { content: Number(seconds)}}],
  }
}
const parseQuantity = (quantity = 0) => {
  for (const { value, symbol } of CURRENCY_UNITS) {
    if (quantity >= value) {
      return (
        (quantity / value).toFixed(1).replace(/\.0$/, "") + symbol
      );
    }
  }
  return (quantity || 0).toLocaleString("ja-JP"); 
};

export const isDislayingLoginForm = (message) => {
  const loginMessageNames = ["ログイン", "Login", "login", "LOGIN"];
  return loginMessageNames.includes(message.message_name);
}

export const isBotMessage = (message) => {
  return message.belong_to === 'bot' && message.message_content.length > 0;
}

export const isDelayBotMessage = (message) => {
  if (!message) return false;
  return message.belong_to === 'bot' && message.message_content[0]?.type === "delay";
}

export const isUserMessage = (message) => {
  return message.belong_to === 'user' && message.message_content.length > 0;
}

export const isCombineMessage = (message) => {
  return message.belong_to === 'combine' && message.message_content.length > 0;
}

export const isInteractiveMessage = (message) => {
  return isUserMessage(message) || isCombineMessage(message);
}

export const isCreditCardPaymentMessage = (message) => {
  return message.message_content.some(content => content.type === MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT);
}

export const isTempDelay = (message, prefix) => {
  return message.id && `${message.id}`.startsWith(prefix || '');
}

const isButtonSubmitMessage = (message) => {
  return message.message_content[0]?.type === "button_submit";
}

const getNextUserMsg = (ext = null) => (item, index) => {
  const firstMsgContent = item?.message_content?.at(0);
  const isDisplayBtnNext = (item?.message_content?.length === 1 && firstMsgContent?.type != "image") || firstMsgContent?.image?.displayButtonNext != false;

  const conds = !item.hidden && isInteractiveMessage(item) && isDisplayBtnNext;

  if (ext && typeof ext === "function") {
    return conds && ext(item, index);
  }

  return conds;
}

export const getElementMessageById = (id) => {
  if (!id) return;
  
  return `msg_id_${id}`;
};

// Device detection utilities
const isAndroid = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/i.test(userAgent);
};

const getBotMessageDelay = (message, isUseGlobalDelay, globalDelayTime, fallbackDelay = 1000) => {
  if (isUseGlobalDelay) {
    return (globalDelayTime !== undefined && globalDelayTime !== null ? globalDelayTime : 1.0) * 1000;
  }
  const firstContent = message?.message_content?.[0];
  if (firstContent?.is_use_custom_delay && firstContent?.custom_delay_time !== undefined && firstContent?.custom_delay_time !== null) {
    return firstContent.custom_delay_time * 1000;
  }
  return fallbackDelay;
};

const moveToNext = (nextId) => {
  setTimeout(() => {
    const nextInput = document.getElementById(nextId);
    if (nextInput) {
      nextInput.focus();
    }
  }, 50);
};

export {
  toNumber,
  stringNullOrEmpty, getAllUrlParams, lightenColor,
  isMobile, removeLeadingZero, sendUserInteractionData,
  sendCreateOrderData, sendCountRequest,
  getCitiesByPrefecture, getTownsByCity, getPrefectures,
  getScenarioPreviewData, getChatBotSetting, sendEmailRequest,
  sleep, getCaptcha, appendParamsToUrl, checkMessageCondition, checkFaqMessageCondition,
  getAddressFromZipCode, secondToDatetime, findItem, isUndefined,
  changeElementAttributeById, toCamelCase, sendConvertTextJapaneseRequest,
  scrollToPosition, removeSpace, getColor, processMessagesForErrorState, hideMessageOnError, createTempDelay,
  patchWithDrawalPreview, sendScenarioUserResponse, createStatusConversion, updateStatusConversion, parseQuantity,
  createScenarioUserResponseMessageHistory, userEntryScenario, isAndroid, isButtonSubmitMessage,
  sendErrorLogToServer, sendLogMessageToServer,
  moveToNext, getNextUserMsg,
  sendOpenChatbotCountRequest, sendCloseChatbotCountRequest, sendAppearLogToServer,
  getBotMessageDelay,
};
