const CHATBOT_ACTIONS = {
  CLICK_BUTTON: 'clickButton',
  EXCUTE_JS: 'excuteJS',
  FUKUSHASHIKI: 'fukushashiki',
  INJECT_CUSTOM_JS: 'injectCustomJS',
  GET_ERROR_MESSAGE: 'getErrorMessage',
  CRAWL_DATA: 'crawlData',
  OPEN_PREVIEW: 'openPreview',
  GET_PREVIEW_ORDER_CONTENT: 'getPreviewOrderContent',
  SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE: 'setChatbotConversionParamsToLocalStorage',
};

const CUSTOM_JS_CODE_POSITION = {
  HEAD: 'head',
  TOP_BODY: 'top_body',
  BOTTOM_BODY: 'bottom_body',
};

const CONVERSION_PARAMS_STORAGE_KEYS = {
  SCENARIO_ID: 'ecChatbotScenarioId',
  BOT_TYPE: 'ecChatbotBotType',
  USER_INPUT_ID: 'ecChatbotUserInputId',
  ENV: 'ecChatbotEnv',
};

const SEARCH_MODES = {
  ID: 1,
  CSS_SELECTOR: 2,
  XPATH: 3,
};

const CRAWL_ELEMENT_TYPES = {
  SELECT: 'select',
  FROM_JS: 'from_js'
};

const ELEMENT_TAGS = {
  SELECT: "SELECT",
  INPUT: "INPUT",
};

const MESSAGE_CONTENT_TYPES = {
  PULLDOWN: {
    LP_INTEGRATION_OPTION: 'lp_integration_option',
    FROM_JS: 'from_js_result',
    CUSTOMIZATION: 'customization',
    TIME_HM: 'time_hm',
    DATE_YMD: 'date_ymd',
    DATE_MD: 'date_md',
    DATE_YM: 'date_ym',
    DATE_YMD_HM: 'date_ymd_hm',
    DOB_YMD: 'dob_ymd',
    DOB_YM: 'dob_ym',
    TIMEZONE_FROM_TO: 'timezone_from_to',
    PERIOD_FROM_TO: 'period_from_to',
    PREFECTURES: 'prefectures',
    UP_TO_MUNICIPALITY: 'up_to_municipality',
    CONSUME_API_RESPONSE: 'comsume_api_response',
  },
};

const botId = sessionStorage.getItem("bot_id");
const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
let chatbotBottom = sessionStorage.getItem("chatbotBottom");
let chatbotH = sessionStorage.getItem("chatbotH");
let chatbotRight = sessionStorage.getItem("chatbotRight");
let chatbotW = sessionStorage.getItem("chatbotW");
let scenarioId = "";

if (typeof window.jQuery === 'undefined') {
  let head = document.getElementsByTagName("head")[0];
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
  head.appendChild(script);
}

const getEnvFromScriptSrc  = () => {
  try {
    if (window.getSdkEnv) return window.sdkEnv;
  
    window.getSdkEnv = true;
  
    const SRC_PARSER = {
      "ec-chatbot1.com": "staging",
      "ec-chatbot.com": "production",
      "localhost:3001": "local",
    }
  
    const src = document.currentScript?.src || "";
  
    if (!src) return null;
  
    const host = new URL(src).host;
  
  
    const sdkEnv = SRC_PARSER[host];
  
    if (sdkEnv) {
      window.sdkEnv = sdkEnv;
      return sdkEnv;
    }
  
    return null;
  } catch {
    return null;
  }
}

const getEnvironment = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.env || getEnvFromScriptSrc() || "production";
}

const getDebugFlag = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.debug || true;
}

const getParam = (paramName) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params[paramName];
}

const log = (message) =>{
  let debugFlag = getDebugFlag();

  if (debugFlag) {
    console.log(message);
  }
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const WAIT_OPTION_TYPES = {
  WAIT_FOR_LOADING: "WAIT_FOR_LOADING",
  WAIT_FOR_SETTING_VALUE: "WAIT_FOR_SETTING_VALUE",
};

const waitForElement = (mode, address, options = {type: "WAIT_FOR_LOADING"}, callback = () => {}) => {
  let count = 0;
  const poops = setInterval(function(){
    count ++;
    log(`Waiting for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(options)}: ${count} times`);
    if (count > 50) {
      clearInterval(poops);
      console.log(`Timeout for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(options)}`);
      return;
    }

    const element = getElementByAddress(mode, address);
    if (!element) return;
    switch (options.type) {
      case WAIT_OPTION_TYPES.WAIT_FOR_LOADING:
        clearInterval(poops);
        callback();
        break;
      case WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE:
        const yearsValue = `20${options.value}`;
        const isNullOption = options.value === 'NULL_OPTION';

        if (isNullOption || (element.value != options.value && element.value != removeLeadingZero(options.value) && element.value != yearsValue)) {
          setValueToElement(element, options.value);
          break;
        }

        clearInterval(poops);
        callback();
        break;
      default:
        throw new Error(`Invalid wait option type ${options.type}`);
    }
  }, 500);
}

const movePaymentMethodToTop = (data) => {
  const index = data.findIndex(item => item.type === "payment_method_id");
  if (index !== -1) {
      const [paymentMethod] = data.splice(index, 1);      
      // await component in LP to set value after payment method setted
      data.unshift(paymentMethod, { additionalType: "await" });
  }
  return data;
}

const getEcChatBotApiServerBaseUrl = () => {
  // Comment out below line if you want to connect the staging backend API server
  return "https://ec-chatbot-test.com";
  const environment = getEnvironment();
  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot-test1.com";
    case "production":
      return "https://ec-chatbot-test.com";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
}

const getEcChatBotFrontEndBaseUrl = () => {
  // Comment out below line if you want to use the local frontend
  return "http://localhost:3001";
  const environment = getEnvironment();

  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot1.com";
    case "production":
      return "https://ec-chatbot.com";
    case "local":
      return "http://localhost:3001";
    default:
      return "http://localhost:3001";
  }
}

const setChatbotConversionParamsToLocalStorage = (data) => {
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.SCENARIO_ID, data.scenarioId);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.BOT_TYPE, data.botType);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.USER_INPUT_ID, data.userInputId);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.ENV, data.env);
}

let globalIframe;

const sendMessageToChatbot = (contentMessage, action) => {
  let data = {action: action, actionData: contentMessage};

  globalIframe.contentWindow.postMessage(data, "*");
}

const displayPopup = async () => {
  const device =
    !tabletCheck() && !mobileCheck()
      ? "pc"
      : tabletCheck()
        ? "tablet"
        : "smartphone";
  const response = await fetch(
    `${getEcChatBotApiServerBaseUrl()}/api/v1/managements/chatbots/${botId}/get_scenario_selected`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  scenarioId = data.data.id;
  
  let iframe = document.createElement("iframe");

  if (mobileCheck()) {
    iframe.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.right = "0";
  } else {
    iframe.width =
      chatbotW && chatbotRight
        ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px`
        : "360px";
    iframe.style.right = "10px";
  }

  iframe.id = "previewSdk";
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.height =
    chatbotH && chatbotBottom
      ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px`
      : "0px";

  iframe.style.border = "none";
  iframe.style.padding = "0";
  iframe.style.margin = "0";
  iframe.style.borderRadius = "0px";
  // iframe.style.display = "none";
  iframe.style.zIndex = "999999";
  iframe.src = `${getEcChatBotFrontEndBaseUrl()}/preview-customer-fukushashiki?bot_id=${botId}&scenario_id=${scenarioId}&urlReceive=${window.location.origin
    }&deviceReceive=${device}&uuid=${uuid}&env=${getEnvironment()}&debug=${getDebugFlag()}&cartSystem=${data.cart_system}&isLoggedIn=${window.logged_in}`;

  // only for amazon
  // add param amazonCheckoutSessionId to iframe src
  if (getParam('amazonCheckoutSessionId')) {
    iframe.src += `&is_using_amazon_pay=true`;
    // only for subscstore cart system, torizen san
    // loop for waiting data is filled to lp form
    // wait 20 times
    let count = 0;
    const interval = setInterval(() => {
      if (document.querySelector("input#jsUkProfileFamilyName").value && count < 20) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
      count++;
    }, 200);
  } else {
    appendIframeToBody(iframe);
  }

  window.addEventListener(
    "message",
    async (e) => {
      if (typeof e.data !== 'object') return;
      if (e.data.source !== 'ec-chatbot') return;
      chatbotW = e.data.widthPc;
      chatbotH = e.data.heightPc;
      chatbotRight = e.data.chatbotRight;
      chatbotBottom = e.data.chatbotBottom;

      switch (e.data.action) {
        case CHATBOT_ACTIONS.FUKUSHASHIKI:
          e.data.actionData = movePaymentMethodToTop(e.data.actionData);
          await fillDataFromMessage(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.GET_ERROR_MESSAGE:
          processGetErrorMessage(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.EXCUTE_JS:
          excuteJSCode(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.CRAWL_DATA:
          await sleep(500);
          await crawlDataAndSendMessage(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.CLICK_BUTTON:
          const button = document.getElementById(e.data.id_value);
          if (!button) throw new Error(`Button not found: id ${e.data.id_value}`);
          button.click();
          break;
        case CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT:
          const { isNewProcess = false } = e.data;

          if (!isNewProcess) {
            await sleep(2000);
          }
          excuteJSCode(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE:
          setChatbotConversionParamsToLocalStorage(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.INJECT_CUSTOM_JS:
          injectCustomJS(e.data.actionData);
          break;
      };

      if (e.data.isOpen && mobileCheck()) {
        iframe.width = "100%";
        // iframe.height = "620px";
        iframe.height = "100%";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (e.data.isOpen) {
        iframe.width =
          chatbotW && (chatbotRight !== null)
            ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px`
            : "460px";
        iframe.height =
          chatbotH && (chatbotBottom !== null)
            ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px`
            : "700px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen && mobileCheck()) {
        const useMoblieFullwidth = (typeof e.data.useMoblieFullwidth === 'boolean')
          ? e.data.useMoblieFullwidth
          : (sessionStorage.getItem("useFullwidthChatbotMobile") === "true");
        iframe.width = useMoblieFullwidth ? "100%" : "250px";
        iframe.height = useMoblieFullwidth ? "85px" : "58px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen) {
        iframe.width =
          chatbotRight
            ? `${parseInt(chatbotRight) + 360}px`
            : "360px";
        iframe.height = chatbotBottom ? `${parseInt(chatbotBottom) + 77}px` : "77px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      }
      if (e.data.isOpen && mobileCheck()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'scroll';
      }
      globalIframe = iframe;
    },
    false
  );

  log("device: ", device);
  setTimeout(() => {
    const checkDevice = { scenario_data: device };
    getUser(`${getEcChatBotApiServerBaseUrl()}/api/v1/analytics/scenario_counts/${scenarioId}`, checkDevice)
  }, 5000);
}

const crawl = async (options) => {
  const targetElement = getElementByAddress(options.searchMode, options.searchAddress);
  if (!targetElement) {
    throw new Error('Element not found');
  };

  switch (options.targetElementType) {
    case CRAWL_ELEMENT_TYPES.SELECT:
      return extractSelectOptions(targetElement, options);
    case CRAWL_ELEMENT_TYPES.FROM_JS:
      return transformJsResultArray({
        data: await extractFromJs(options),
        fields: ['id', 'value', 'text'],
      });
    default:
      throw new Error(`Not support target element type ${options.targetElementType}`);
  }
}

const crawlDataAndSendMessage = async (options) => {
  if (!options.searchAddress || !options.searchMode) return;

  const message = {
    ...options,
    result: await crawl(options),
  };
  
  sendMessageToChatbot(message, CHATBOT_ACTIONS.CRAWL_DATA);
}

const excuteJSCode = (jscode) => {
  if (!jscode) return;
  const func = new Function(jscode);
  func();
}

const extractSelectOptions = (selectElement) => {
  if (!selectElement || selectElement.tagName !== "SELECT") return null;

  return Array.from(selectElement.options)
    .map((option, index) => ({
      id: index + 1,
      text: option.innerText,
      value: option.value || 'NULL_OPTION'
    }));
}

const extractFromJs = async (options) => {
  const { searchJsCode: jsCode } = options;
  if (!jsCode) return;

  try {
    const func = new Function(jsCode);
    const result = await func();

    return result;
  } catch (error) {
    console.error("[EXTRACT_FROM_JS]", error);

    return null;
  }
};

const transformJsResultArray = ({ data, fields, skipOnError = true }) => {
  if (!Array.isArray(fields) || !Array.isArray(data)) return [];

  const result = data.filter(item => {
    const isValid = fields.every(field => item[field]);
    return isValid || !skipOnError;
  });

  return skipOnError ? result : result.length === data.length ? result : [];
};

const processGetErrorMessage = (data) => {
  if (!data.isDisplay) return;

  const element = getElementByAddress(data.seachMode, data.searchValue)

  if (!element) {
    console.log(`Element ${data.searchValue} not found`);
    return;
  }
  sendMessageToChatbot(element.innerHTML, CHATBOT_ACTIONS.GET_ERROR_MESSAGE);
}

const isDisabledElement = (element) => {
  // For check GINZA AIRA
  if (element.classList.contains('disabled-input-ec')) return true;

  // For check torizen san with amazon pay
  if (getParam('amazonCheckoutSessionId') && element.getAttribute('disabled')) return true;

  // For other customer
  return element.disabled;
}

const fillDataFromMessage = async (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    if (item.additionalType === "await") {
      await sleep(1500);
      continue;
    }

    let element = getElementByAddress(item.bindingMode, item.bindingAddress);
    if (!element) continue;

    if (isDisabledElement(element)) continue;

    switch (item.type) {
      case "zip_code_address":
      case "card_number":
      case "card_payment_radio_button":
      case "credit_card_payment":
      case "text_input":
      case "textarea":
      case "slider": {
        waitForElement(
          item.bindingMode, item.bindingAddress,
          {type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue});
        break;
      }

      case "payment_method_id": {
        setValuePaymentMethodToElement(element, item.bindingValue);
        break;
      }

      case 'dropdown_prefecture': {
        if (element.tagName === ELEMENT_TAGS.SELECT) {
          const acceptableValues = [item.bindingValue.toString(), removeLeadingZero(item.bindingValue).toString()];
          const selectedOption = Array.from(element.options).find(option => acceptableValues.includes(option.value.toString()));
          if (!selectedOption) item.bindingValue = '';
        };
        waitForElement(
          item.bindingMode, item.bindingAddress,
          {type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue});
        break;
      }

      case "agree_term":
      case 'checkbox': {
        setCheckToCheckboxElement(element, item.bindingValue);
        break;
      }

      case 'pull_down': {
        if (item.pulldownType === 'lp_integration_option') {
          const isNullOption = item.bindingValue === 'NULL_OPTION';
          if (isNullOption) item.bindingValue = '';

          const hasOption = Array.from(element.options).some(option => option.value === item.bindingValue);
          if (!hasOption) item.bindingValue = '';
        }
        
        waitForElement(
          item.bindingMode, item.bindingAddress,
          {type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue});
        break;
      }

      case "radio_button": {
        if (element.tagName === ELEMENT_TAGS.SELECT) {
          setValueToElement(element, item.bindingValue);
          break;
        }

        setRadioValue(element, item.bindingValue);
        break;
      }

      case "password": {
        element.setRangeText(item.bindingValue, 0, element.value.length);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
      default:
        break;
    }
  }
}

const getElementByAddress = (mode, address) => {
  if (!mode || !address) return null;
  switch (mode) {
    case SEARCH_MODES.ID:
      return document.getElementById(address);
    case SEARCH_MODES.CSS_SELECTOR:
      return document.querySelector(address);
    case SEARCH_MODES.XPATH:
      return document.evaluate(address, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    default:
      throw new Error(`Invalid search mode ${mode}, address: ${address}`);
  }
}

const removeLeadingZero = (value) => {
  let strValue = value?.toString() || "";
  let result = strValue.replace(/^0+/, '');
  return typeof value === 'number' ? Number(result) : result;
}

const removeFirstTwoChars = (input) => {
  const str = input?.toString() || "";
  if (str.length > 2) {
    return str.slice(2);
  } else {
    return '';
  }
}

const setCheckToCheckboxElement = (element, value) => {
  if (!element.type === 'checkbox') return;
  const currentValue = element.checked;
  if (currentValue === value) return;

  element.checked = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

const setValueToElement = (element, value) => {
  let newElementValue = value;

  if (element.tagName === ELEMENT_TAGS.SELECT) {
    const acceptableValues = [value.toString(), removeLeadingZero(value).toString(), `20${value}`];
    newElementValue = acceptableValues.find(v => {
      return Array.from(element.options).some(option => option.value === v);
    });

    if (!newElementValue && newElementValue !== '') {
      console.error(`Option not found: ${value}, element: ${element.id}`);
    }
  }

  element.value = newElementValue;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

const setValuePaymentMethodToElement = (element, value) => {
  const radioButtons = [...element.querySelectorAll('input[type="radio"]')];
  
  if (radioButtons.length > 0) {
    setRadioValue(element, value);
  } else {
    setValueToElement(element, value);
  }
};

const setRadioValue = (element, value) => {
  const radioButtons = [...element.querySelectorAll('input[type="radio"]')];
  const selectedRadio = radioButtons.find(radio => radio.value === value);
  if (!selectedRadio) return;
  selectedRadio.checked = true;
  selectedRadio.dispatchEvent(new Event('input', { bubbles: true }));
  selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
};

const getUser = async (url, datacount) => {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datacount),
  });
  const data = await response.json();
  log(data);
}

const tabletCheck = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent
    );
  log("isTablet: " + isTablet);
  return isTablet;
}

const mobileCheck = () => {
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
}

const injectCustomJS = (injectCustomJsCodes) => {
  for(const { jsCode, position } of injectCustomJsCodes)
  {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = jsCode;

    switch (position) {
      case CUSTOM_JS_CODE_POSITION.HEAD:
        document.head.appendChild(script);
        break;
      case CUSTOM_JS_CODE_POSITION.TOP_BODY:
        document.body.insertBefore(script, document.body.firstChild);
        break;
      case CUSTOM_JS_CODE_POSITION.BOTTOM_BODY:
        document.body.appendChild(script);
        break;
      default:
        console.error("Invalid position: " + position);
    }
  }
}

const appendIframeToBody = (iframe) => {
  globalIframe = iframe;
  document.body.appendChild(iframe);
}

displayPopup();