import React, { useEffect, useRef, useReducer, useState } from "react";
import "assets/css/bot/preview-chat-bot.css";
import api from "api/api-management";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import { Button } from "reactstrap";
import ModalPreviewBot from '../../Popup/ModalPreviewBot';
import CustomButton from "./CustomButton";
import { UserMessage, BotMessage } from "./PreviewComponent";
import PreviewFukushashikiReducer from "./PreviewFukushashiki/PreviewFukushashikiReducer";
import { Row, Col } from "antd";
import moment from "moment";
import $ from "jquery";
import { EC_CHATBOT_URL } from "variables/constants";
import "moment/locale/zh-cn";
import iconMessageBlue from "assets/img/icon-mess/icon-message-chat-blue.png";
import iconMessageGreen from "assets/img/icon-mess/icon-message-chat-green.png";
import iconMessageOrange from "assets/img/icon-mess/icon-message-chat-orange.png";
import iconMessageYellow from "assets/img/icon-mess/icon-message-chat-yellow.png";
import iconMessagePink from "assets/img/icon-mess/icon-message-chat-pink.png";
import iconMessagePurple from "assets/img/icon-mess/icon-message-chat-purple.png";
import iconMessageBlack from "assets/img/icon-mess/icon-message-chat-black.png";
import iconMessageWhite from "assets/img/icon-mess/icon-message-chat-white.png";
import {
  CHATBOT_ACTIONS,
  SESSION_STORAGE_KEY,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  CUSTOM_JS_CODE_POSITION,
  TIMER_MAP_VARIABLES_FIELD,
  TIMER_TYPES,
  RENDER_CHATBOT_CONFIG,
  CART_SYSTEM,
  TIMER_DELAY_RENDER,
  CONVERSTION_RESPONSE_STATUS,
  CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE,
  PREVIEW_ACTIONS
} from "./PreviewComponent/Constants";
import {
  getAllUrlParams,
  lightenColor,
  isMobile,
  sendCountRequest,
  sendCreateOrderData,
  getPrefectures,
  getScenarioPreviewData,
  getChatBotSetting,
  sleep,
  stringNullOrEmpty,
  appendParamsToUrl,
  findItem,
  changeElementAttributeById,
  scrollToPosition,
  createStatusConversion,
  updateStatusConversion,
  createScenarioUserResponseMessageHistory,
  userEntryScenario,
  isDislayingLoginForm,
  isUserMessage,
  isDelayBotMessage,
  getElementMessageById,
  getNextUserMsg,
  sendOpenChatbotCountRequest,
} from "./PreviewComponent/Utils";
import Withdrawal from "./PreviewComponent/Withdrawal";
import ProcessBar from "./PreviewComponent/ProcessBar";
import ZipCodePopUp from "./PreviewComponent/ZipCodePopUp";
import _ from "lodash";
import Timer from "./Timer";
import {
  setConversionParamToLocalStorage, fukushashikiSavedStateToLp, fukushashikiToLP,
  executeLpJsCode, injectCustomJsCode, postMessageToParent
} from "./PreviewFukushashiki/LPUtils";
import { convertToFukushashikiObject } from "./PreviewFukushashiki/FukushashikiDataConverterUtils";
import { handleValidateField } from "./PreviewFukushashiki/ValidationUtils";

sessionStorage.setItem("prevOpenStatus", "0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
const previewInitialState = {
  isOpen: false,
  urlSend: "",
  urlReceive: "",
  deviceReceive: "",
  uuid: params.get("uuid"),
  botId: Cookies.get("bot_id"),
  scenarioId: params.get("scenario_id"),
  botInfor: {},
  messagesList: [],
  urlThanksPage: "",
  urlCartConfirmPage: "",
  isUsedCartConfirmPage: false,
  currentMsgIndex: 0,
  renderMessagesList: [],
  currentUserMsgIndex: 0,
  passedUserMsgCount: 0,
  userMessagesList: [],
  errors: {},
  variables: [],
  isDisplayButtonNext: false,
  captcha: [],
  withdrawal: {},
  variablesList: [],
  prefecturesList: [],
  dataCities: [],
  dataTowns: [],
  prefectures: "",
  cities: "",
  towns: "",
  zipcode: "",
  zipcodeContentIndex: "",
  zipcodeIndex: -1,
  buttonTypePc: "1",
  positionPc: "1",
  widthPc: 450,
  heightPc: 700,
  widthSp: 100,
  heightSp: 100,
  rightPcTitle: "",
  positionSp: "1",
  buttonTypeSp: "1",
  rightMarginPc: 10,
  bottomMarginPc: 10,
  displayType: 1,
  rightSpTitle: "",
  rightMarginSp: 10,
  bottomMarginSp: 10,
  showPopupCloseBot: false,
  activePopupCloseBot: true,
  titleBubble: "",
  styleModal: {},
  scenarioUserResponses: [],
  checkoutUrl: "",
  lpOptionData: {},
  submitErrorMessage: '',
  isDisplayErrorMessage: false,
  objParam: {
    current_url: window.location.href,
    current_url_param: getAllUrlParams(window.location.href),
    current_url_title: document.title,
    user_id: Cookies.get("user_id"),
    bot_id: Cookies.get("bot_id")
  },
  previewOrderContent: null,
  // loadedStateFromSession has 2 values: "wait", "loaded"
  loadedStateFromSession: false,
  isUsedErrMsgByJs: false,
  errMsgJsCode: '',
  isProcessing: false,
  conversionStatus: null,
};


const PreviewFukushashiki = () => {
  const [state, dispatch] = useReducer(PreviewFukushashikiReducer, previewInitialState);
  const [timerChanges, setTimerChanges] = useState({ timeLeft: -1, config: null });
  const containerRef = useRef(null);
  const isFromScenario = false;
  const hasSentCustomJs = useRef(false);
  const timeoutConfrmMsgRef = useRef(null);

  const setShowPopupCloseBot = (value) => {
    dispatch({ type: PREVIEW_ACTIONS.SET_SHOW_POPUP_CLOSE_BOT, payload: value });
  };

  const setCheckoutUrl = (value) => {
    dispatch({ type: PREVIEW_ACTIONS.SET_CHECKOUT_URL, payload: value });
  };
  const setScenarioUserResponses = (scenarioUserResponses) => {
    dispatch({ type: PREVIEW_ACTIONS.SET_SCENARIO_USER_RESPONSES, payload: scenarioUserResponses });
  };

  const getBotModalStyle = () => {
    if (isMobile())
      return {
        bottom: "0px",
        right: "0px",
        width: `${state.widthSp || 100}%`,
        height: `${state.heightSp || 100}%`,
      }

    return {
      bottom: `${state.bottomMarginPc || 0}px`,
      right: `${state.rightMarginPc || 30}px`,
      width: `${state.widthPc || 450}px`,
      height: `${state.heightPc || 700}px`,
    };
  }

  // get default obj params
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (!state.objParam?.ip) return;

    $.getJSON("https://api.ipregistry.co/?key=tryout", (data) => {
      const defaultObjParam = {
        user_ip_address: data.ip,
        user_country: data.location.country.name,
        user_city: data.location.city,
        user_device: data.user_agent.device.type,
        user_browser: data.user_agent.name,
        user_agent: data.user_agent.header,
        start_datetime: new Date(),
      };
      dispatch({
        type: PREVIEW_ACTIONS.SET_OBJ_PARAM,
        payload: { ...state.objParam, ...defaultObjParam }
      });
    });
  }, [state.objParam?.ip, state.loadedStateFromSession]);

  // Get chat bot setting
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (!state.botId && params.get("bot_id")) {
      dispatch({ type: PREVIEW_ACTIONS.SET_BOT_ID, payload: params.get("bot_id") });
      return;
    }

    if (state.displayType !== undefined && state.displayType !== null) return;

    getChatBotSetting(state.botId)
      .then((response) => {
        if (!response.data.data) return;

        const result = JSON.parse(response.data.data?.design_settings);
        const newState = {
          activePopupCloseBot: result?.popup_close_bot ? true : false,
          titleBubble: result?.title_bubble ? result?.title_bubble : "簡単90秒で注文完了",
          displayType: result?.display_type,
          widthPc: result?.width_pc ? result?.width_pc : 450,
          heightPc: result?.height_pc ? result?.height_pc : 700,
          widthSp: result?.width_sp ? result?.width_sp : 100,
          heightSp: result?.height_sp ? result?.height_sp : 100,
          positionPc: result?.position_pc ? result?.position_pc : "1",
          isOpen: result?.display_type && Number(result?.display_type) === 1,
          rightPcTitle: result?.right_position_pc_title,
          buttonTypePc: result?.button_type_pc ? result?.button_type_pc : "1",
          rightMarginPc: result?.right_margin_pc ? result?.right_margin_pc : 10,
          bottomMarginPc: result?.bottom_margin_pc ? result?.bottom_margin_pc : 0,
          positionSp: result?.position_sp ? result?.position_sp : "1",
          buttonTypeSp: result?.button_type_sp ? result?.button_type_sp : "1",
          rightSpTitle: JSON.parse(response.data.data?.design_settings)?.right_position_sp_title,
          rightMarginSp: result?.right_margin_sp,
          bottomMarginSp: result?.bottom_margin_sp,
        };

        sessionStorage.setItem("chatbotH", result?.height_pc ? result?.height_pc : 700);
        sessionStorage.setItem("chatbotBottom", result?.bottom_margin_pc ? result?.bottom_margin_pc : 10);
        sessionStorage.setItem("chatbotW", result?.width_pc ? result?.width_pc : 450);
        sessionStorage.setItem("chatbotRight", result?.right_margin_pc ? result?.right_margin_pc : 30);
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: newState });
      });
  }, [state.botId, state.loadedStateFromSession, state.displayType]);

  const eventHandler = async (event) => {
    if (!event.data || !event.data.actionData) return;
    const actionData = event.data.actionData;

    switch (event.data.action) {
      case CHATBOT_ACTIONS.CRAWL_DATA:
        let receiveOptionData = {};
        receiveOptionData[actionData.searchAddress] = actionData.result;

        return dispatch({
          type: PREVIEW_ACTIONS.ADD_LP_OPTION_DATA,
          payload: receiveOptionData
        });

      case CHATBOT_ACTIONS.GET_ERROR_MESSAGE_WITH_DISPLAY_MSG: {
        const error = actionData.error === NO_ERROR ? "" : actionData.error;
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG,
          payload: {
            error: error,
            displayMsg: actionData.displayMsg
          }
        });
      }

      case CHATBOT_ACTIONS.GET_ERROR_MESSAGE:
        await sleep(1000);
        const error = actionData === NO_ERROR ? "" : actionData;
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE,
          payload: error
        });

      case CHATBOT_ACTIONS.OPEN_PREVIEW:
        if (!state.isOpen)
          return onOpenPreview(true);
        break;

      case CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT:
      case CHATBOT_ACTIONS.PREVIEW_OBJECT:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_PREVIEW_ORDER_CONTENT,
          payload: actionData
        });

      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA,
          payload: actionData,
        });

      default:
        // TODO
        break;
    }
  };

  // Add event listener to receive message from parent window
  useEffect(() => {
    window.addEventListener("message", eventHandler, false);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [state.isOpen])

  // Add style to body tag if it's mobile
  useEffect(() => {
    if (isMobile()) {
      document.body.classList.add('is_mobile');
    }
  }, [])

  // post message to parent window
  useEffect(() => {
    if (!state.urlReceive) return;
    const options = {
      isOpen: state.isOpen,
      widthPc: state.widthPc,
      heightPc: state.heightPc,
      widthSp: state.widthSp,
      heightSp: state.heightSp,
      chatbotRight: state.rightMarginPc,
      chatbotBottom: state.bottomMarginPc,
    };
    postMessageToParent(options, state);
  }, [
    state.urlReceive,
    state.isOpen,
    state.widthPc,
    state.heightPc,
    state.widthSp,
    state.heightSp,
    state.rightMarginPc,
    state.bottomMarginPc
  ]);

  // Get prefectures
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (state.prefecturesList.length !== 0) return;

    getPrefectures()
      .then((res) => {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_PREFECTURES_LIST, payload: { prefecturesList: res.data.data } });
      })
  }, [state.prefecturesList, state.loadedStateFromSession]);

    // For run errorJsCode
  useEffect(() => {
    if (!state.isUsedErrMsgByJs || !state.errMsgJsCode) return;
    executeLpJsCode(state.errMsgJsCode, state);
  }, [state.errMsgJsCode, state.isUsedErrMsgByJs]);

  // For run injectCustomJsCode
  useEffect(() => {
    if (!state.isUsedCustomJsCode) return;

    injectCustomJsCode(hasSentCustomJs, state, {
      head: { jsCode: state.headCustomJsCode, position: CUSTOM_JS_CODE_POSITION.HEAD },
      top_body: { jsCode: state.topBodyCustomJsCode, position: CUSTOM_JS_CODE_POSITION.TOP_BODY },
      bottom_body: { jsCode: state.bottomBodyCustomJsCode, position: CUSTOM_JS_CODE_POSITION.BOTTOM_BODY },
    });
  }, [state.isUsedCustomJsCode, state.headCustomJsCode, state.topBodyCustomJsCode, state.bottomBodyCustomJsCode]);

  // For add custom css
  useEffect(() => {
    if (!state.isUsedCustomCss || !state.customCssContent) return;

    const style = document.createElement('style');
    style.id = "custom-css";
    style.innerHTML = state.customCssContent;
    document.head.appendChild(style);
  }, [state.isUsedCustomCss, state.customCssContent]);

  const handleCloseBot = () => {
    const element = document.getElementById('sp-container1');
    if (isMobile()) {
      dispatch({ type: PREVIEW_ACTIONS.CLOSE_BOT });
    } else {
      element.classList.remove('slideUp');
      element.classList.add('slideDown');
      setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.CLOSE_BOT });
      }, 680)
    }
  }

  const startRenderWithDelay = (newState, options = {}) => {
    const { 
      delayTime = RENDER_CHATBOT_CONFIG.DELAY_START_RENDER,
      scrollToBottom = true,
    } = options;

    userEntryScenario({
      scenario_id: newState.scenarioId,
      user_id: newState.uuid,
    });

    new Promise((resolve) => {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { renderMessagesList: [], isDelaying: true },
      });

      sleep(delayTime).then(resolve);
    }).then(async () => {
      if (newState.useNewProcess) {
        renderMessageInRange(0, newState.currentMsgIndex, newState, newState.currentUserMsgIndex, { isPassDelay: true, appearFromStart: true })
        .then(() => {
          dispatch({ type: PREVIEW_ACTIONS.SET_DELAYING, payload: false });
        });
      } else {
        const listMsgAppear = newState.renderMessagesList.filter(i => isUserMessage(i) && !i.hidden).map(i => ({ id: i.id, type: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.APPEAR }));

        if (listMsgAppear.length) {
          createScenarioUserResponseMessageHistory({
            scenario_id: newState.scenarioId,
            user_id: newState.uuid,
            msgs: listMsgAppear,
          });
        }
        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: { renderMessagesList: newState.renderMessagesList, isDelaying: false },
        });
      }

      if (scrollToBottom) {
        await sleep(RENDER_CHATBOT_CONFIG.DELAY_BEFORE_SCROLL_TO_BOTTOM);
        scrollToPosition({ position: "b", selector: "#sp-body" });
      }
    });
  }

  const onOpenPreview = (opening) => {
    const deviceReceive = state.deviceReceive || params.get("deviceReceive");
    if (!deviceReceive) return;

    // Send data to count open chatbot window
    const prevOpenStatus = sessionStorage.getItem("prevOpenStatus");
    if (prevOpenStatus == "0" && opening) {
      sessionStorage.setItem("prevOpenStatus", "1");
      sendOpenChatbotCountRequest(state.scenarioId, deviceReceive);
    }
    
    const timerChatbotStorage = getTimerSessionStorage();
    setTimerChanges((timerChanges) => timerChatbotStorage || timerChanges);

    // post message to parent window
    postMessageToParent({isOpen: opening}, state);

    if (state.alreadyOpenFirstTime) {
      if (!opening) {
        if (state.activePopupCloseBot) {
          return dispatch({
            type: PREVIEW_ACTIONS.UPDATE_OPEN_PREVIEW,
            payload: {
              isOpen: false,
              showPopupCloseBot: true,
            }
          });
        }
      }
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_OPEN_PREVIEW,
        payload: {
          isOpen: opening,
          showPopupCloseBot: false,
        }
      });

      if (opening) {
        return startRenderWithDelay(state, { delayTime: RENDER_CHATBOT_CONFIG.DELAY_START_RENDER });
      }

      return
    }

    state.alreadyOpenFirstTime = true;
    state.isOpen = true;
    state.currentUserMsgIndex = state.messagesList.findIndex(getNextUserMsg());
    
    // For the first time, we need to render to the first user message
    if (state.currentUserMsgIndex >= 0) {
      state.currentMsgIndex = state.currentUserMsgIndex;
    }

    return renderMessagesWithDelay(state, 0, state.currentMsgIndex, { setNewState: false });
  }

  const handleCloseChatbotWhenUseWithDrawal = () => {
    if (!state.isOpen) return; 
    onOpenPreview(false) 
    const enabledStatus = new Set(["standard_exit_popup", "image_popup"])
    const isWithDrawalEnabled = state.botInfor && enabledStatus.has(state.botInfor.withdrawal_prevention_status)
    if (isWithDrawalEnabled) {
      handleOpenWithDrawal();
      return ;
    }
  }

  const setPulldownValue = (dataContentType, field, value) => {
    switch (field) {
      case "customization":
      case "prefectures":
        return value;
      case "up_to_municipality":
        return `${dataContentType[field].prefecture}${dataContentType[field].city}`;
      case "timezone_from_to":
        return `${dataContentType[field]?.valueHour1}:${dataContentType[field]?.valueMinute1}-${dataContentType[field]?.valueHour2}:${dataContentType[field]?.valueMinute2}`;
      case "date_ym":
        return `${dataContentType[field]?.valueYear}-${dataContentType[field]?.valueMonth}`;
      case "period_from_to":
        return `${dataContentType[field]?.valueYear1}-${dataContentType[field]?.valueMonth1}-${dataContentType[field]?.valueDay1} ~ ${dataContentType[field]?.valueYear2}-${dataContentType[field]?.valueMonth2}-${dataContentType[field]?.valueDay2}`;
      default:
        return `${dataContentType[field]?.valueYear || dataContentType[field]?.valueMonth || dataContentType[field]?.valueDay
          ? `${dataContentType[field]?.valueYear}-${dataContentType[field]?.valueMonth}-${dataContentType[field]?.valueDay}`
          : ""
        } ${dataContentType[field]?.valueHour || dataContentType[field]?.valueMinute
          ? `${dataContentType[field]?.valueHour}:${dataContentType[field]?.valueMinute}`
          : ""
        }`;
    }
  }

  const setTextInputValue = (dataContentType, field) => {
    return `${dataContentType[field]?.valueLeft} ${dataContentType[field]?.valueRight}`;
  }

  const setRadioButtonDefaultValue = (dataContentType, value) => {
    return dataContentType[dataContentType.type].find(item => item.value === value)?.text;
  }
  
  const setCheckboxDefaultValue = (dataContentType, field) => {
    let dataTextChecked = [];
    switch (field) {
      case "checkedValue":
        break;
      case "initial_selection_picture":
        break;
    }
    if (field === "checkedValue") {
      if (dataContentType.checkedValue.length > 0) {
        dataTextChecked = dataContentType.checkedValue.map((itemChecked) => {
          return dataContentType[dataContentType.type].find((item) => itemChecked === item.id)?.text;
        });
      }
    } else if (field === "initial_selection_picture" && dataContentType.initial_selection_picture.length > 0) {
      dataTextChecked = dataContentType.initial_selection_picture.map((itemChecked) => {
        let dataReturn;
        dataContentType[dataContentType.type].forEach((item) => {
          item.contents.forEach((subItem) => {
            if (itemChecked === `${item.id}-${subItem.id}`) {
              dataReturn = subItem.text;
            }
          });
        });
        return dataReturn;
      });
    }
    return dataTextChecked.length > 0 ? dataTextChecked.join(",") : "";
  }

  const setZipCodeAddressDefaultValue = (dataContentType) => {
    let dataPostCode = !dataContentType.split_postal_code
      ? dataContentType?.value_post_code
      : `${dataContentType.value_post_code_left}${dataContentType.value_post_code_right}`;
    const prefecture = dataContentType?.value_prefecture || "";
    const municipality = dataContentType?.value_municipality || "";
    const address = dataContentType?.value_address || "";
    const buildingName = dataContentType?.value_building_name || "";

    // Safe parse prefecture name in case of using dropdown
    let fixedPrefecture = findItem(state.prefecturesList, { 
      keys: 'id', 
      value: prefecture, 
      callbackValue: prefecture,
      onSuccess: (item) => item.name,
    });
    return `〒${dataPostCode} ${fixedPrefecture}${municipality} ${address}${buildingName}`;
  }

  const setCardPaymentRadioButtonDefaultValue = (dataContentType, field, value) => {
    let checkedOptionText = "";
    if (field === "initial_selection") {
      checkedOptionText = dataContentType.radio_contents.find((item) => value === item.value)?.text;
    } else if (field === "initial_selection_picture") {
      dataContentType.radio_contents_img.forEach((item) => {
        item.contents.forEach((subItem) => {
          if (value === `${item.id}-${subItem.id}`) {
            checkedOptionText = subItem.text;
          }
        });
      });
    }
    return checkedOptionText;
  }

  const setCarouselDefaultValue=(dataContentType,value) => {
    let default_value = dataContentType[
      dataContentType.carousel
    ].contents.find((item) => item.id === value).title;
    return default_value;
  }

  const setDefaultValue = (item, dataContentType, contentType, value, field) => {
    switch (contentType) {
      case "zip_code_address":
        item.default_value = setZipCodeAddressDefaultValue(dataContentType);
        break;
      case "radio_button":
        item.default_value = setRadioButtonDefaultValue(dataContentType, value);
        break;
      case "checkbox":
        item.default_value = setCheckboxDefaultValue(dataContentType, field);
        break;
      case "card_payment_radio_button":
        item.default_value = setCardPaymentRadioButtonDefaultValue(dataContentType, field, value);
        break;
      case "pull_down":
        item.default_value = setPulldownValue(dataContentType, field, value);
        break;
      case "carousel":
        item.default_value = setCarouselDefaultValue(dataContentType, value);
        break;
      case "text_input":
        if (field === 'text' && dataContentType[field].isSplitInput) {
          item.default_value = setTextInputValue(dataContentType, field);
        } else if (!dataContentType[field].isSplitInput) {
          item.default_value = dataContentType[field].value;
        }
        break;
      default:
        if (dataContentType.type === "embedded") {
          item.default_value = `${moment(value).format("YYYY-MM-DD")}`;
        } else if (field === "phone_number" && dataContentType[field].withHyphen) {
          item.default_value = setPhoneNumberDefaultValue(dataContentType, field);
        } else if (field === "start_date_select" || field === "end_date_select") {
          item.default_value = setDateSelectDefaultValue(dataContentType);
        } else if (contentType !== "credit_card_payment") {
          item.default_value = value;
        }
        break;
    }
  }

  const setPhoneNumberDefaultValue = () => {
    // TODO: Implement this function
  }

  const setDateSelectDefaultValue = () => {
    // TODO: Implement this function
  }

  const getProductDetailsForProductPurchaseRadioButton = (dataContentType, value) => {
    let valueCode, valueName, valuePrice;
  
    const product = dataContentType.products?.find(product => product.id === value);
    if (product) {
      valueCode = product.item_number;
      valueName = product.title;
      valuePrice = product.item_price;
    }
  
    return { valueCode, valueName, valuePrice };
  }

  const getProductDetailsForProductPurchase = (dataContentType, value) => {
    let arrayCode = [];
    let arrayName = [];
    let arrayPrice = [];
    let arrayOrderQuantity = [];
  
    dataContentType.products?.forEach((product) => {
      value.forEach((val) => {
        if (product.id === val) {
          arrayCode.push(product.item_number);
          arrayName.push(product.title);
          arrayPrice.push(product.item_price);
          arrayOrderQuantity.push(product?.quantity_select);
        }
      });
    });
  
    return { arrayCode, arrayName, arrayPrice, arrayOrderQuantity };
  }

  const redirectToCartPage = () => {
    const params = {
      scenario_id: state.scenarioId,
      bot_type: "web",
      user_input_id: state.uuid,
    };
    let redirectRurl = null;
  
    if (state.isUsedCartConfirmPage && state.urlCartConfirmPage) {
      redirectRurl = appendParamsToUrl(state.urlCartConfirmPage, params);
    } else if (state.urlThanksPage) {
      redirectRurl = appendParamsToUrl(state.urlThanksPage, params);
    }

    if (!redirectRurl) return;

    setTimeout(() => {
      window.parent.location.href = redirectRurl;
    }, 2000);
  }; 

  const getBotInforFromPreviewResponse = (res) => {
    if (!res || !res.data || !res.data.chatbot) return {};

    let opacity_color, message_color, font_color, icon_mess;
    if (res.data.chatbot.main_color === "blue") {
      opacity_color = "#D6E0EF";
      message_color = "#3CACEF";
      font_color = "#fff";
      icon_mess = iconMessageBlue;
    } else if (res.data.chatbot.main_color === "green") {
      opacity_color = "#DEEADB";
      message_color = "#9DDB7C";
      font_color = "#fff";
      icon_mess = iconMessageGreen;
    } else if (res.data.chatbot.main_color === "orange") {
      opacity_color = "#F4E5DA";
      message_color = "#EF8D2F";
      font_color = "#fff";
      icon_mess = iconMessageOrange;

    } else if (res.data.chatbot.main_color === "yellow") {
      opacity_color = "#F0EFEB";
      message_color = "#F3AA2D";
      res.data.chatbot.main_color = "#F6CA21";
      font_color = "#fff";
      icon_mess = iconMessageYellow;
    } else if (res.data.chatbot.main_color === "pink") {
      opacity_color = "#EBDDE3";
      message_color = "#E65B83";
      res.data.chatbot.main_color = "#F170AA";
      font_color = "#fff";
      icon_mess = iconMessagePink;
    } else if (res.data.chatbot.main_color === "purple") {
      opacity_color = "#E9E8F1";
      message_color = "#AF82D5";
      res.data.chatbot.main_color = "#8C66D9";
      font_color = "#fff";
      icon_mess = iconMessagePurple;
    } else if (res.data.chatbot.main_color === "black") {
      opacity_color = "#ecede8";
      message_color = "#c3c3c3";
      font_color = "#000";
      icon_mess = iconMessageBlack;
    } else if (res.data.chatbot.main_color === "white") {
      opacity_color = "#fff";
      message_color = "#F5F5F5";
      font_color = "#000";
      icon_mess = iconMessageWhite;
    } else if (res.data.chatbot.main_color_other) {
      opacity_color = lightenColor(res.data.chatbot.main_color_other, 0.1);
      message_color = res.data.chatbot.main_color_other;
      font_color = "#fff";
    }

    return {
      ...res.data.chatbot,
      opacity_color,
      message_color,
      font_color,
      icon_mess,
      main_color: res.data.chatbot.main_color || res.data.chatbot.main_color_other,
      main_color_other: res.data.chatbot.main_color_other,
      titleBubble:res.data.design_settings.title_bubble
    };
  }

  const renderMessagesWithDelay = (theState, startMsgIndex, endMsgIndex, options = {}) => {
    const {
      setNewState = true,
      isPassDelay = false,
    } = options;
    
    userEntryScenario({
      scenario_id: theState.scenarioId,
      user_id: theState.uuid,
    });

    return new Promise(async (resolve) => {
      const listMsgAppear = [];
      for (let i = startMsgIndex; i <= endMsgIndex; i++) {
        theState.renderMessagesList = theState.messagesList.slice(0, i + 1);
        if (isDelayBotMessage(theState.messagesList[i])) {
          if (!isPassDelay) {
            await sleep(theState.messagesList[i].message_content[0].delay.content * 1000);
            theState.messagesList[i].hidden = true;
            continue;
          }
        }
        
        // update state with theState except prefecturesList
        const { prefecturesList, ...rest } = theState;
        dispatch({ 
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, 
          payload: {
            ...rest,
            renderMessagesList: theState.renderMessagesList,
            messagesList: theState.messagesList,
          },
        });

        if (isUserMessage(theState.messagesList[i]) && !theState.messagesList[i]?.hidden) {
          listMsgAppear.push({ id: theState.messagesList[i].id, type: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.APPEAR });
        }

        scrollToPosition({ position: "b", selector: "#sp-body" });
        await sleep(RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE);
      }
      resolve({ listMsgAppear });
    }).then(({ listMsgAppear }) => {
      if(setNewState) {
        theState.renderMessagesList = theState.messagesList.slice(0, theState.currentMsgIndex + 1);
        theState.passedUserMsgCount = theState.renderMessagesList?.filter(msg => isUserMessage(msg))?.length;
  
        // update state with theState except prefecturesList
        const { prefecturesList, ...rest } = theState;
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: rest });
      }

      if (listMsgAppear.length) {
        createScenarioUserResponseMessageHistory({
          scenario_id: theState.scenarioId,
          user_id: theState.uuid,
          msgs: listMsgAppear,
        });
      }
    });
  }

  const extractStateFromPreviewResponse = async (res) => {
    if (!res || !res.data || res.data.code !== 1) return;

    const designSetting = res.data.design_settings;
    const chatbot = res.data.chatbot;
    const conversation = res.data.data?.conversation;
    let newState = {
      ...state,
      botInfor: getBotInforFromPreviewResponse(res),
      objParam: {},
      loadedStateFromSession: true,
      messagesList: conversation?.messages || [],
      isOpen: state.isOpen || Number(designSetting.display_type) === 1,
      activePopupCloseBot: Boolean(designSetting?.popup_close_bot),
      titleBubble: designSetting?.title_bubble || "簡単90秒で注文完了",
      displayType: designSetting?.display_type,
      widthPc: designSetting?.width_pc || 450,
      heightPc: designSetting?.height_pc || 700,
      widthSp: designSetting?.width_sp || 100,
      heightSp: designSetting?.height_sp || 100,
      positionPc: designSetting?.position_pc || "1",
      rightPcTitle: designSetting?.right_position_pc_title,
      buttonTypePc: designSetting?.button_type_pc || "1",
      rightMarginPc: designSetting?.right_margin_pc || 10,
      bottomMarginPc: designSetting?.bottom_margin_pc || 0,
      positionSp: designSetting?.position_sp || "1",
      buttonTypeSp: designSetting?.button_type_sp || "1",
      rightSpTitle: designSetting?.right_position_sp_title,
      rightMarginSp: designSetting?.right_margin_sp,
      bottomMarginSp: designSetting?.bottom_margin_sp,
      isUsedErrMsgByJs: chatbot?.is_used_err_msg_by_js,
      errMsgJsCode: chatbot?.err_msg_js_code,
      useNewProcess: chatbot?.client_cart_system === CART_SYSTEM.EC_FORCE,
      isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
      isProcessing: false,
      useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
      isUsedCustomJsCode: !!chatbot?.is_used_custom_js_code,
      headCustomJsCode: chatbot?.head_custom_js_code,
      topBodyCustomJsCode: chatbot?.top_body_custom_js_code,
      bottomBodyCustomJsCode: chatbot?.bottom_body_custom_js_code,
      isUsedCustomCss: !!chatbot?.is_used_custom_css,
      customCssContent: chatbot?.custom_css_content,
    };

    if (chatbot?.timer_config?.enable) {
      const timerConfig = chatbot.timer_config;
      setTimerChanges({ timeLeft: calculateTimerConfigDuration(timerConfig.type, timerConfig.duration), config: timerConfig });
    }

    const prevOpenStatus = sessionStorage.getItem("prevOpenStatus");

    if (designSetting.display_type == 1 && prevOpenStatus == "0") {
      sessionStorage.setItem("prevOpenStatus", "1");
      sendOpenChatbotCountRequest(state.scenarioId, state.deviceReceive);
    }

    setConversionParamToLocalStorage(
      newState.scenarioId,
      'web',
      newState.userInputId || params.get("uuid"),
      params.get("env") || "production",
      state
    );

    checkUpdateMessagesSessionStorage(res.data.data.updated_at);

    dispatch({
      type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER,
      payload: {
        responseData: res.data,
        botInfor: getBotInforFromPreviewResponse(res),
        isLoggedIn: isLoggedIn,
      },
    });
  }

  const getTimerSessionStorage = () => {
    const timerChatbotStorage = sessionStorage.getItem(SESSION_STORAGE_KEY.TIMER_CHATBOT);
    
    if (!timerChatbotStorage?.trim().length) {
      return null;
    }
    
    return JSON.parse(timerChatbotStorage);
  }

  const handleOnCounting = (config) => (timer) => {
    const timerChanges = { timeLeft: timer, config };
    sessionStorage.setItem(SESSION_STORAGE_KEY.TIMER_CHATBOT, JSON.stringify(timerChanges));
    setTimerChanges(timerChanges);
  }

  const getTimerConfigVariable = (configVariables) => {
    const variables = Object.values(configVariables)
      .reduce((acc, key) => !TIMER_MAP_VARIABLES_FIELD[key] ? acc : [...acc, { ...TIMER_MAP_VARIABLES_FIELD[key], name: key }], []);

    return variables;
  }

  const calculateTimerConfigDuration = (type, duration, options = {}) => {  
    const { timerLeft = 0, useTimerLeft = false } = options;

    if (!duration || !type) return 0;

    const durationConfig = duration[type];
    if (!durationConfig) {
      return 0;
    }

    switch(type) {
      case TIMER_TYPES.COUNTING_DOWN: {
        if (useTimerLeft) {
          return timerLeft;
        }

        const { hour = 0, minute = 0, second = 0 } = duration[type];
        return (hour * 60 + minute) * 60 + second;
      }

      default: {
        return 0;
      }
    }
  }

  // Get Preview Scenario Data
  useEffect(() => {
    if (!state.loadedStateFromSession) {
      let savedState = getStateFromSessionStorage();
      if (savedState) {
        setConversionParamToLocalStorage(
          savedState.scenarioId,
          'web',
          savedState.userInputId || params.get("uuid"),
          params.get("env") || "production",
          state
        );

        if (isLoggedIn) {
          return dispatch({
            type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE,
            payload: {
              savedState,
              isLoggedIn: isLoggedIn,
              isUsingAmazonPay: params.get('is_using_amazon_pay')
            }
          });
        }        

        const timerConfig = getTimerSessionStorage();
        if (timerConfig) {
          setTimerChanges({ timeLeft: calculateTimerConfigDuration(timerConfig?.config?.type, timerConfig?.config?.duration, { timerLeft: timerConfig.timeLeft, useTimerLeft: true }), config: timerConfig });
        }

        return fukushashikiSavedStateToLp(savedState, params, state).then(async () => {
          return dispatch({
            type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE,
            payload: {
              savedState,
              isLoggedIn: isLoggedIn,
              isUsingAmazonPay: params.get('is_using_amazon_pay')
            }
          });
        });
      }
    }

    if (state.loadedStateFromSession && state.botId)
      return;

    if (!state.botId) {
      dispatch({ type: PREVIEW_ACTIONS.SET_BOT_ID, payload: params.get("bot_id") });
      return;
    }

    if (!state.urlSend) {
      dispatch({ type: PREVIEW_ACTIONS.SET_URL_SEND, payload: window.location.href });
      return;
    }

    if (!state.urlReceive) {
      dispatch({ type: PREVIEW_ACTIONS.SET_URL_RECEIVE, payload: params.get("urlReceive") });
      return;
    }

    if (!state.deviceReceive) {
      dispatch({ type: PREVIEW_ACTIONS.SET_DEVICE_RECEIVE, payload: params.get("deviceReceive") });
      return;
    }

    if (!state.scenarioId) {
      dispatch({ type: PREVIEW_ACTIONS.SET_SCENARIO_ID, payload: params.get("scenario_id") });
      return;
    }

    return getScenarioPreviewData(state.botId, state.scenarioId)
      .then(extractStateFromPreviewResponse);
  }, [
    state.botId, state.urlSend, state.urlReceive,
    state.deviceReceive, state.scenarioId,
    state.isDisplayErrorMessage, state.loadedStateFromSession
  ]);

  useEffect(async () => {
    if (!state.isOpen) return;
    
    scrollToPosition({ position: "b", selector: "#sp-body" });
  }, [state.isOpen, state.renderMessagesList?.length, state.submitErrorMessage]);

  const setStateToSessionStorage = (data) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY.CHAT_BOT_STATE, JSON.stringify(data));
  };

  const getStateFromSessionStorage = () => {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY.CHAT_BOT_STATE);
    if (!data) return null;
    return JSON.parse(data);
  };

  const checkUpdateMessagesSessionStorage = (updated_at) => {
    const temp = sessionStorage.getItem("bot_update_at");

    if (temp !== updated_at) {
      sessionStorage.removeItem(`messages_bot_${state.botId}`);
      sessionStorage.setItem("bot_update_at", updated_at);
    }
  }

  const createOrAddLinesCart = async (res) => {
    const newArr = state.scenarioUserResponses.concat(res.data?.data || [])
    setScenarioUserResponses([...newArr])

    const products = JSON.parse(newArr.findLast(x => x.data_input_name === "text_with_thumbnail_image")?.text_value || null)
    const quantity = newArr.findLast(x => x.data_input_name === "quantity")?.integer_value || 1
    const product = products?.products?.findLast(x => x?.id === products?.initial_selection || x?.productVariantId === products?.value)

    const email = newArr.findLast(x => x.data_input_name === "email")?.string_value || null
    const phone = newArr.findLast(x => x.data_input_name === "phone_number")?.string_value || null
    const user_name = newArr.findLast(x => x.data_input_name === "user_name")?.string_value || null
    const user_name_kana = newArr.findLast(x => x.data_input_name === "user_name_kana")?.string_value || null

    const zip_code_address = newArr.findLast(x => x.data_input_name === "zip_code_address")?.text_value || null

    if (product && quantity && user_name && user_name_kana && email && zip_code_address) {
      let phoneNumber;
      try {
        phoneNumber = `${JSON.parse(phone)?.value1 || ""}${JSON.parse(phone)?.value2 || ""}${JSON.parse(phone)?.value3 || ""}`
      } catch (e) {
        phoneNumber = phone || ""
      }
      await api
        .post('/api/v1/shopify/cart_create', {
          first_name: JSON.parse(user_name)?.valueRight || JSON.parse(user_name_kana)?.valueRight,
          last_name: JSON.parse(user_name)?.valueLeft || JSON.parse(user_name_kana)?.valueLeft,
          email: email || "example@gmail.com",
          phone: phoneNumber,
          zip: JSON.parse(zip_code_address)?.value_post_code || (JSON.parse(zip_code_address)?.value_post_code_left + JSON.parse(zip_code_address)?.value_post_code_right),
          province: JSON.parse(zip_code_address)?.value_prefecture,
          city: JSON.parse(zip_code_address)?.value_municipality,
          address1: JSON.parse(zip_code_address)?.value_address,
          address2: JSON.parse(zip_code_address)?.value_building_name,
          lines: [
            {
              "merchandiseId": product.productVariantId,
              "quantity": quantity
            }
          ],
          scenario_id: state.scenarioId,
          uuid: state.uuid
        })
        .then(async res => {
          sessionStorage.setItem("cart", JSON.stringify(res?.data?.data))
          setCheckoutUrl(res?.data?.data?.cartCreate?.cart?.checkoutUrl)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }


  const postMessageForGetPreviewOrderContent = async (jsCode, options = {}) => {
    const { isNewProcess = false, stopRender } = options;

    if (isNewProcess && stopRender) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: {
          stopRender,
          previewOrderContent: null,
        },
      });
    }

    postMessageToParent({
      action: CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT,
      actionData: jsCode,
      is_use_js: true,
      isOpen: true,
      isNewProcess,
    }, state);

    if (isNewProcess) return;
    await sleep(2000);
  }


  const renderMessageInRange = async (startIndex, endIndex, newState, nextUserMsgIndex, options = {}) => { 
    const { 
      isUpdateClick = false, 
      isPassDelay = false,
      lastConfirmMessageIdx = -1,
      appearFromStart = false,
    } = options;
    const listMsgAppear = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const confirmMessage = newState.messagesList[i].message_content?.find(x => x.text_input?.use_for_confirm_message);
      if (confirmMessage?.text_input?.jscode && !newState.stopRender?.isActive && lastConfirmMessageIdx !== i) {
        const nextUserMessage = newState.messagesList[nextUserMsgIndex];
        const isNextUserMessageButtonSubmit = nextUserMessage?.message_content?.[0]?.type === "button_submit";

        if (!isNextUserMessageButtonSubmit) {
          continue;
        }

        newState.stopRender = {
          index: i,
          finalIndex: newState.currentMsgIndex,
          timeout: 30,
          start: new Date(),
          isActive: true,
        };

        newState.previewOrderContent = null;

        postMessageForGetPreviewOrderContent(
          confirmMessage.text_input.jscode,
          { isNewProcess: newState.useNewProcess, stopRender: newState.stopRender },
        );
        break;
      }

      newState.renderMessagesList = newState.messagesList.slice(0, i + 1);
      if (isDelayBotMessage(newState.messagesList[i])) {
        // render delay item so typing GIF appears, then wait
        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
          payload: {
            startIndex: 0,
            endIndex: i + 1
          }
        });
        if (!isPassDelay) {
          await sleep(newState.messagesList[i].message_content[0].delay?.content * 1000 || TIMER_DELAY_RENDER);
        }
        const newRender = newState.renderMessagesList.slice(0, i + 1).map(msg => isDelayBotMessage(msg) ? {...msg, hidden: true} : msg);
        newState.renderMessagesList[i].hidden = true;
        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: {
            messagesList: newState.messagesList,
            renderMessagesList: newRender,
          }
        })

        newState.messagesList[i].hidden = true;
        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: {
            messagesList: newState.messagesList,
            renderMessagesList: newRender,
          }
        })

        continue;
      }

      if ((appearFromStart ? true : i !== startIndex ) && isUserMessage(newState.messagesList[i]) && !newState.messagesList[i]?.hidden) {
        listMsgAppear.push({ id: newState.messagesList[i].id, type: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.APPEAR });
      }
      
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
        payload: {
          startIndex: 0,
          endIndex: i + 1
        }
      });

      if (!isPassDelay) {
        await sleep(RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE);
      }
    }
    if (!isUpdateClick) {
      newState.passedUserMsgCount++;
    } else {
      newState.passedUserMsgCount = newState.renderMessagesList.filter((item) => isUserMessage(item) && !item.hidden).length - 1 ;
    }

    if (listMsgAppear.length) {
      createScenarioUserResponseMessageHistory({
        scenario_id: state.scenarioId,
        user_id: state.uuid,
        msgs: listMsgAppear,
      });
    }

    return newState;
  }

  useEffect(() => {
    if (state.currentMsgIndex <= state.nextStopMsgIndex) return;

    setTimeout(() => {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
        payload: {
          startIndex: 0,
          endIndex: state.nextStopMsgIndex
        }
      });
    }, 1000);
  }, [state.currentMsgIndex, state.nextStopMsgIndex]);

  const onClickNext = (clickedMsgIndex, clickedMsg) => {
    // tại onclick next này thì chỉ muốn: 
    //   + chạy các script của message được click next thôi
    //   + set data vào trong sessionStorage
    //   + fukushashiki sang trang LP
    //   + gửi log message lên server
    //   + validate data
    // Việc update state, update render message và các giá trị trong state thì sẽ chạy ở trong reducer

    setStateToSessionStorage(state);

    const data = {
      scenario_id: state.scenarioId,
      message: clickedMsg,
      user_id: state.uuid,
      bot_type: "web"
    };

    const validationResult = handleValidateField(clickedMsg, clickedMsgIndex);
    
    if (!validationResult.isValid) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_ERRORS,
        payload: validationResult.errors
      });
      // return sendErrorLogToServer(data);
      return;
    }
    
    if (clickedMsg.button_jscode && clickedMsg.jscode.length > 0) {
      executeLpJsCode(clickedMsg.jscode, state);
    }

    // For GINZA AIRA
    if (isDislayingLoginForm(clickedMsg)) return;

    fukushashikiToLP(convertToFukushashikiObject(data, []), state);

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON,
      payload: { clickedMsgIndex, clickedMsg, isLoggedIn: isLoggedIn }
    });
  };

  const onChangeValue = (
    indexContent,
    contentType,
    value,
    field,
    subFiled,
    name,
    message
  ) => {
    // Early returns for invalid states
    if (!state.messagesList.length) return;
    
    const msgIndex = state.messagesList.findIndex((msg) => msg.id === message.id);
    if (msgIndex === -1) return;
    
    const newState = { ...state };
    const messageContentTypeData = newState.messagesList[msgIndex].message_content[indexContent][contentType];
    if (!messageContentTypeData) return;

    // Update message content data based on field hierarchy
    updateMessageContentData(messageContentTypeData, value, field, subFiled, name);

    // Handle specific content type logic
    const contentHandlers = {
      zip_code_address: () => handleZipCodeAddress(messageContentTypeData, value, field),
      product_purchase: () => handleProductPurchase(newState, msgIndex, indexContent, contentType, field, value),
      product_purchase_radio_button: () => handleProductPurchaseRadioButton(newState, msgIndex, indexContent, contentType, field, value)
    };

    if (contentHandlers[contentType]) {
      contentHandlers[contentType]();
    }

    // Handle save input content
    handleSaveInputContent(newState, msgIndex, indexContent, contentType, field, value);

    // Update render messages and dispatch
    updateRenderMessagesAndDispatch(newState);
  };

  // Helper functions
  const updateMessageContentData = (messageContentTypeData, value, field, subFiled, name) => {
    if (name) {
      messageContentTypeData[field] = messageContentTypeData[field] || {};
      messageContentTypeData[field][subFiled] = messageContentTypeData[field][subFiled] || {};
      messageContentTypeData[field][subFiled][name] = value;
    } else if (subFiled) {
      messageContentTypeData[field] = messageContentTypeData[field] || {};
      messageContentTypeData[field][subFiled] = value;
    } else if (field) {
      messageContentTypeData[field] = value;
    }
  };

  const handleZipCodeAddress = (messageContentTypeData, value, field) => {
    // Set prefecture type based on dropdown usage
    messageContentTypeData.value_prefecture_type = messageContentTypeData.is_use_dropdown ? "id" : "name";

    if (typeof value === "object") {
      const transformField = {
        value_prefecture: (value) => {
          if (messageContentTypeData.value_prefecture_type === "id") {
            return value;
          }
          return findItem(state.prefecturesList, { 
            keys: 'id', 
            value: value, 
            callbackValue: value,
            onSuccess: (item) => item.name,
          });
        }
      };
      
      Object.keys(value).forEach((key) => {
        messageContentTypeData[key] = transformField[key] ? transformField[key](value[key]) : value[key];
      });
    } else {
      messageContentTypeData[field] = value;
    }
  };

  const handleProductPurchase = (newState, msgIndex, indexContent, contentType, field, value) => {
    if (field !== "initial_selection" || !value.length) return;

    const dataContentType = { ...state.messagesList[msgIndex].message_content[indexContent][contentType] };
    const { arrayCode, arrayName, arrayPrice, arrayOrderQuantity } = getProductDetailsForProductPurchase(dataContentType, value);

    const productVariables = [
      { variable_name: "product_code", default_value: arrayCode.join(",") },
      { variable_name: "product_name", default_value: arrayName.join(",") },
      { variable_name: "product_unit_price", default_value: arrayPrice.join(",") },
      { variable_name: "order_quantity", default_value: arrayOrderQuantity.join(",") }
    ];

    newState.variables.push(...productVariables);
    newState.objParam = {
      ...newState.objParam,
      product_code: arrayCode.join(","),
      product_name: arrayName.join(","),
      product_unit_price: arrayPrice.join(","),
      order_quantity: arrayOrderQuantity.join(","),
    };
  };

  const handleProductPurchaseRadioButton = (newState, msgIndex, indexContent, contentType, field, value) => {
    if (field !== "initial_selection") return;

    const dataContentType = { ...state.messagesList[msgIndex].message_content[indexContent][contentType] };
    const { valueCode, valueName, valuePrice } = getProductDetailsForProductPurchaseRadioButton(dataContentType, value);

    const productVariables = [
      { variable_name: "product_code", default_value: valueCode },
      { variable_name: "product_name", default_value: valueName },
      { variable_name: "product_unit_price", default_value: valuePrice }
    ];

    newState.variables.push(...productVariables);
    newState.objParam = {
      ...newState.objParam,
      product_code: valueCode,
      product_name: valueName,
      product_unit_price: valuePrice,
    };
  };

  const handleSaveInputContent = (newState, msgIndex, indexContent, contentType, field, value) => {
    const messageContent = state.messagesList[msgIndex].message_content[indexContent][contentType];
    if (!messageContent.is_save_input_content) return;

    let isSaveParam = false;
    const saveInputContentName = messageContent.save_input_content;

    newState.variables = state.variables.map((item) => {
      if (item.variable_name === saveInputContentName) {
        isSaveParam = true;
        const dataContentType = { ...messageContent };

        // Handle special case for card_payment_radio_button
        if (contentType === 'card_payment_radio_button') {
          const allowFields = ['initial_selection', 'initial_selection_picture'];
          isSaveParam = allowFields.includes(field);
        }

        if (isSaveParam) {
          setDefaultValue(item, dataContentType, contentType, value, field);
        }
      }
      return item;
    });
    
    if (isSaveParam) {
      newState.objParam[saveInputContentName] = value;
    }
  };

  const updateRenderMessagesAndDispatch = (newState) => {
    newState.renderMessagesList = newState.messagesList
      .slice(0, newState.currentMsgIndex + 1)
      .map((msg) => isDelayBotMessage(msg) ? { ...msg, hidden: true } : msg);
    
    setStateToSessionStorage(newState);
    
    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
      payload: newState
    });
  };

  const handleOpenWithDrawal = () => {
    if (state.activePopupCloseBot) {
      setShowPopupCloseBot(true)
      return
    }
    if (state.botInfor && state.botInfor.withdrawal_prevention_status === "invalid") {
      sessionStorage.removeItem("cart")
      setScenarioUserResponses([])
      dispatch({ type: PREVIEW_ACTIONS.SET_CURRENT_USER_MSG_INDEX, payload: 0 });
      let indexTiming = 0;
      let i;
      for (i = state.currentMsgIndex; i < state.messagesList.length; i++) {
        if (
          state.messagesList[i].belong_to === "user" ||
          i === state.messagesList.length - 1
        )
          break;
        if (
          state.messagesList[i].belong_to === "bot" &&
          state.messagesList[i].message_content[0].type === "delay"
        ) {
          indexTiming += state.messagesList[i].message_content[0].delay.content;
        }
      }
      if (!isFromScenario) dispatch({ type: PREVIEW_ACTIONS.SET_IS_OPEN, payload: { scenarioId: null } });
      setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.SET_IS_OPEN, payload: { renderMessagesList: [] } });
        if (!isFromScenario)
          dispatch({ type: PREVIEW_ACTIONS.SET_IS_OPEN, payload: { scenarioId: params.get("scenario_id") } });
        if (document.getElementById("action-bd")) {
          document.getElementById("action-bd").click();
        } else {
          onOpenPreview(false);
        }
        let withdrawal = {
          scenario_data: `${state.deviceReceive}_close_chatbot_window`,
        };
        api.patch(`/api/v1/analytics/scenario_counts/${state.scenarioId}`, withdrawal).then(() => {
        }).catch(err => {
          console.log(err)
        })
      }, (indexTiming + i - state.currentMsgIndex - 1) * 1000);
    } else if (
      state.botInfor?.withdrawal_prevention_status === "standard_exit_popup" ||
      state.botInfor?.withdrawal_prevention_status === "image_popup"
    ) {
      changeElementAttributeById([
        { id: "sp-withdrawal-container", style: { display: "block" }},
        { id: "sp-withdrawal-content", style: { display: "block" }}
      ]);
    }
  };

  const onOpenZipCodePopup = (isOpen, indexContent, indexMessage) => {
    let newState = {};

    if (indexContent !== undefined) {
      newState.zipcodeContentIndex = indexContent;
    }
    if (indexMessage !== undefined) {
      newState.zipcodeIndex = indexMessage;
    }

    if (isOpen) {
      changeElementAttributeById([
        { id: "sp-withdrawal-container", style: { display: "block" }},
        { id: "sp-popup-zip-code-address", style: { display: "block" }}
      ]);

      newState = {
        ...newState,
        prefectures: null,
        cities: null,
        towns: null,
        zipcode: null,
      };
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { ...newState }
      });
      return;
    }

    changeElementAttributeById([
      { id: "sp-withdrawal-container", style: { display: "none" }},
      { id: "sp-popup-zip-code-address", style: { display: "none" }}
    ]);
  };

  const onChangeErrors = (field, value) => {
    let newErrors = { ...state.errors };
    newErrors[field] = value;
    dispatch({ type: PREVIEW_ACTIONS.SET_ERRORS, payload: { newErrors } });
  };

  const renderBotMessageContent = (message, indexMessage) => {
    if (!message || message.belong_to !== "bot" || !Array.isArray(message?.message_content)) return null;

    return message.message_content.map((content, index) => (
      <BotMessage
        messageId={message.id}
        key={indexMessage}
        content={content}
        index={index}
        botInfor={state.botInfor}
        checkoutUrl={state.checkoutUrl}
        previewOrderContent={state.previewOrderContent}
        executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
      />
    ));
  };

  const renderNextButton = (message, indexMessage) => {
    const isUpdate = indexMessage >= state.renderMessagesList.length - 1;
    const firstMsgContent = message?.message_content?.[0];
    const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;
    const isAutoClick = !isDisplayBtnNext && isUpdate;

    if (!message || message.belong_to !== "user") return null;
    if (message.message_content[0]?.type === "button_submit") return null;

    let btnText = message.buttonName;
    if (!btnText) {
      btnText = isUpdate ? "次へ" : "更新";
    }
    return (
      <div className="sp-user-message-button-action" style={{ display: isDisplayBtnNext ? "flex" : "none" }}>
        <CustomButton
          disabled={state.submitErrorMessage.length > 0 ? false : message.disabled}
          style={{
            backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          }}
          className="ss-user-message__action-btn"
          onClick={() => {
            onClickNext(indexMessage, message)
          }}
          autoClick={isAutoClick && !state.isExtractFromSession}
          messsagetype={message.message_content[0]?.type}
        >
          {btnText}
        </CustomButton>
      </div>
    );
  };

  const renderUserMessageContent = (message, indexMessage) => {
    if (!message || message.belong_to !== "user") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    return (
      <div className="sp-body-user-side slideLeft" id={getElementMessageById(message.id)}>
        <div className="sp-body-user-side-messages">
          <UserMessage
            postMessageToParent={(options) => postMessageToParent(options, state)}
            message={message}
            captcha={state.captcha}
            messageContentProps={message.message_content}
            disabled={(state.submitErrorMessage.length > 0 && state.submitErrorMessage !== GETTING_ERROR_NOTIFICATION) ? false : message.disabled}
            onChangeValue={(
              indexContent,
              contentType,
              value,
              field,
              subFiled,
              name
            ) =>
              onChangeValue(
                indexContent,
                contentType,
                value,
                field,
                subFiled,
                name,
                message
              )
            }
            currentMsgIndex={state.currentMsgIndex}
            onClickNext={() => {
              onClickNext(indexMessage, message)}
            }
            indexMessage={indexMessage}
            errorsProps={state.errors}
            prefecturesList={[...state.prefecturesList]}
            onOpen={(isOpen, indexContent) => {
              onOpenZipCodePopup(isOpen, indexContent, Math.min(state.currentMsgIndex, indexMessage));
            }}
            onChangeErrors={(field, value) =>
              onChangeErrors(field, value)
            }
            variables={state.variables}
            lpOptionData={state.lpOptionData}
            submitErrorMessage={state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "" : state.submitErrorMessage}
            botId={state.botId}
            isProcessing={!!state.isProcessing}
          />
          {renderNextButton(message, indexMessage)}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    return (state.renderMessagesList || []).map((message, indexMessage) => {
      if (message.hidden && !stringNullOrEmpty(message.hidden)) return null;
      return (
        <React.Fragment key={indexMessage}>
          {renderBotMessageContent(message, indexMessage)}
          {renderUserMessageContent(message, indexMessage)}
        </React.Fragment>
      );
    })
  };

  const renderErrorMessages = () => {
    if (!state.isUsedErrMsgByJs || !state.submitErrorMessage) return null;

    let backgroundColor = "#ffebee";
    let color = "#d32f2f";
    let text = state.submitErrorMessage;
    let borderColor = "#f44336";
    if (state.submitErrorMessage === GETTING_ERROR_NOTIFICATION) {
      backgroundColor = "#0000FF";
      color = "#FFFFFF";
      text = "処理中...";
      borderColor = "#8bc34a";
    }
    return (
      <div className="ss-user-setting__item-text_input-top">
        <div
          style={{
            border: `1px solid ${borderColor}`,
            backgroundColor: backgroundColor,
            color: color,
          }}
          id="error-message"
          className="error-message-modal"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    );   
  }

  const getOpeningBotStyle = () => {
    let containerStyle = {
      position: 'fixed',
      bottom: "0px",
      right: isMobile() ? state.isOpen ? 0 : `${state.rightMarginSp}px` : `${state.rightMarginPc}px`,
      width: isMobile() ? `${state.widthSp}%` : `${state.widthPc}px`,
      height: isMobile() ? `${state.heightSp}%` : `${state.heightPc}px`,
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white"
    };
    let headerStyle = {
      borderTopLeftRadius: isMobile() ? "0px" : "5px",
      borderTopRightRadius: isMobile() ? "0px" : "5px",
    };
    let bodyStyle = {
      backgroundColor: state.botInfor?.opacity_color,
      flex: 1,
    };

    if (state.botInfor?.main_color || state.botInfor?.main_color_other) {
      headerStyle.backgroundColor = state.botInfor?.main_color || state.botInfor?.main_color_other;
    }

    if (!state.activePopupCloseBot) {
      containerStyle.height = isMobile() ? `${state.heightSp || 100}%` : `${state.heightPc || 600}px`;
      headerStyle = {
        ...headerStyle,
        position: "static",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
      };
      bodyStyle.display = "block";
    }

    return {
      containerStyle,
      headerStyle,
      bodyStyle,
    };
  };

  useEffect(() => {
    if (state.conversionStatus === null && !!state.uuid && !!state.scenarioId && state.isOpen) {
      createStatusConversion({
        scenario_id: state.scenarioId, 
        user_input_id: state.uuid, 
        status: CONVERSTION_RESPONSE_STATUS.UN_FINISH,
      })
      .then((res) => {
        const status = res?.data?.data?.status;

        if (status) {
          dispatch({ type: PREVIEW_ACTIONS.SET_CONVERSION_STATUS, payload: status });
        }
      });
    }
  }, [state.uuid, state.scenarioId, state.conversionStatus, state.isOpen])

  useEffect(() => {
    if (!state.stopRender || state.isDelaying || !state.useNewProcess) return;
    
    const renderContinueMessages = async () => {
      const { isActive, index, finalIndex, timeout } = state.stopRender;

      if (isActive) {
        if (!state.previewOrderContent) {
          timeoutConfrmMsgRef.current = setTimeout(async () => {
            renderMessageInRange(index, finalIndex, state, { lastConfirmMessageIdx: index }).then(() => {
              dispatch({
                type: PREVIEW_ACTIONS.SET_STOP_RENDER,
                payload: { ...state.stopRender, isActive: false },
              });
            });
          }, timeout * 1000);

          return;
        }

        clearTimeout(timeoutConfrmMsgRef.current);

        renderMessageInRange(index, finalIndex, state, { lastConfirmMessageIdx: index });
        dispatch({
          type: PREVIEW_ACTIONS.SET_STOP_RENDER,
          payload: {
            ...state.stopRender,
            isActive: false,
          },
        });

        return;
      }

      clearTimeout(timeoutConfrmMsgRef.current);

      renderMessageInRange(index, finalIndex, state, { lastConfirmMessageIdx: index });
    } 

    renderContinueMessages();

    return () => clearTimeout(timeoutConfrmMsgRef.current);
  }, [
    state.stopRender, 
    state.previewOrderContent, 
    state.isDelaying,
    state.useNewProcess,
  ]);

  const getBotHeaderIcon = () => {
    if (state.isOpen) {
      return state.botInfor?.opening_bot_icon?.url || state.botInfor?.icon?.url;
    }
    return state.botInfor?.closing_bot_icon?.url || state.botInfor?.icon?.url;
  }

  // body container
  if (state.scenarioId && state.botInfor && state.isOpen) {
    const { containerStyle, headerStyle, bodyStyle } = getOpeningBotStyle();
    return (
      <div
        ref={containerRef}
        id="sp-container1"
        className={`sp-container1 ${isMobile() ? 'slideUpSp' : 'slideUp'}`}
        style={containerStyle}
      >
        <Withdrawal
          botInfor={state.botInfor}
          deviceReceive={state.deviceReceive}
          scenarioId={state.scenarioId}
          onOpenPreview={onOpenPreview}
        />
        <ZipCodePopUp
          onOpen={onOpenZipCodePopup}
          prefecturesList={state.prefecturesList}
          message={state.messagesList[state.zipcodeIndex]}
          messageIndex={state.currentMsgIndex}
          zipcodeContentIndex={state.zipcodeContentIndex}
          onChangeValue={onChangeValue}
          onChangeErrors={onChangeErrors}
          errors={state.errors}
        />
        {/* popup for shipping address can be used instead of ZipCodePopUp -> remove */}
        <div
          id="sp-header"
          style={headerStyle}
          className="sp-header"
        >
          <div className="sp-header-left" onClick={handleCloseChatbotWhenUseWithDrawal}>
            <div className="sp-body-bot-side-avatar sp-avatar-bt">
              <img src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`} alt="bot-header-icon"/>
            </div>
            <div className="sp-header-left-label">
              <div className="sp-header-left-label-sub-title">
                {state.botInfor?.subtitle}
              </div>
              <div className="sp-header-left-label-title">{state.botInfor?.titleBubble}</div>
            </div>
          </div>
          <div
            className="sp-header-right"
            onClick={() => {
              state.isOpen ? handleOpenWithDrawal() : onOpenPreview(true);
            }}
          >
            <div className="sp-header-right-arrow">
              {state.isOpen ? (
                <MDBIcon fas icon="chevron-circle-down" />
              ) : (
                <MDBIcon fas icon="chevron-circle-up" />
              )}
            </div>
          </div>
        </div>
        {state.activePopupCloseBot ?
          <ModalPreviewBot
            isMobile={isMobile()}
            styleBot={getBotModalStyle()}
            open={state.showPopupCloseBot} isAdmin={false} onClose={() => setShowPopupCloseBot(false)}>
            <Row>
              <Col md="12">
                <span className="title-bot-modal">本当に閉じますか？</span>
              </Col>
            </Row>

            <Row className="justify-content-around">
              <Col md="6">
                <Button
                  className="btn-cancel__modal-bot"
                  onClick={() => setShowPopupCloseBot(false)}
                >
                  チャットに戻る
                </Button>
              </Col>
              <Col md="6">
                <Button className="btn-close__modal-bot" onClick={() => handleCloseBot()}
                >
                  閉じる
                </Button>
              </Col>
            </Row>
          </ModalPreviewBot>
          : ""}
        
        {!!state.botInfor?.timer_config?.enable
          && 
          <div className="chatbot_timer_holder" style={{
            backgroundColor: bodyStyle.backgroundColor,
          }}>
            <Timer
              duration={calculateTimerConfigDuration(state.botInfor.timer_config.type, state.botInfor.timer_config.duration)}
              timeLeft={timerChanges.timeLeft}
              countMsg={state.botInfor.timer_config.messages.counting}
              finishMsg={state.botInfor.timer_config.messages.finish}
              variables={getTimerConfigVariable(state.botInfor.timer_config.variables)}
              startCount={state.isOpen}
              onCounting={handleOnCounting(state.botInfor.timer_config)}
            />
          </div>
        }

        <ProcessBar botInfor={state.botInfor}
          currentIndex={state.passedUserMsgCount}
          maxIndex={state.userMessagesList.length}
        />
        <div id="sp-body" className="sp-body" style={bodyStyle}
        >
          {renderMessages()}
          {renderErrorMessages()}
        </div>
      </div>
    )
  } else if (!state.isOpen && isMobile() === false && Number(state.positionPc) === 1 && Number(state.buttonTypePc) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: "56px",
          height: "56px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'fixed',
          bottom: state.bottomMarginPc ? `${state.bottomMarginPc}px` : '10px',
          right: state.rightMarginPc ? `${state.rightMarginPc}px` : '0px',
        }}
      >
        <img
          style={{ width: "96%", height: "96%", borderRadius: "30px" }}
          src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
          alt="bot-header-icon"
        />
      </div>
    )
  } else if (!state.isOpen && isMobile() === false && Number(state.positionPc) === 1 && Number(state.buttonTypePc) === 1) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          // width: `${widthPc}px`,
          width: `360px`,
          height: "66px",
          borderRadius: '35px',
          display: "flex",
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '3px',
          paddingRight: '3px',
          position: 'fixed',
          padding: 'auto',
          bottom: state.bottomMarginPc ? `${state.bottomMarginPc}px` : '10px',
          right: state.rightMarginPc ? `${state.rightMarginPc}px` : '0px',
        }}
      >
        <div className="sp-header-left-bt" onClick={() => onOpenPreview(!state.isOpen)}>
          <div className="sp-header-left-avatar sp-avatar-bt">
            <img src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`} alt="bot-header-icon" />
          </div>
        </div>
        <div style={{ alignItems: 'center', justifyContent: "center", padding: 'auto' }}>
          <div id="comment_bubble" style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px', paddingTop: '3px' }}>
            <span style={{ fontSize: '18px', fontWeight: 900 }}>{state.botInfor.title}</span>
          </div>
        </div>
        <div className="sp-header-right-arrow" style={{ marginRight: '8px' }}>
          <MDBIcon fas icon="chevron-circle-up" />
        </div>
      </div>
    )
  } else if (!state.isOpen && isMobile() === false && Number(state.positionPc) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: '300px',
          height: "65px",
          borderRadius: "0px",
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          transform: ' rotate(-90deg)',
          bottom: state.bottomMarginPc ? `${parseInt(state.bottomMarginPc) + state.widthPc / 2}px` : '20px',
          right: `${-120}px`,
        }}
      >
        <div className="sp-header-left" onClick={() => onOpenPreview(!state.isOpen)}>
          <div className="sp-header-left-avatar sp-avatar">
            <img src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`} alt="bot-header-icon" />
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightPcTitle}</div>
          </div>
        </div>
      </div>)
  } else if (!state.isOpen && isMobile() === true && Number(state.positionSp) === 1 && Number(state.buttonTypeSp) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: "56px",
          height: "56px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'fixed',
          bottom: state.bottomMarginSp ? `${state.bottomMarginSp}px` : '20px',
          right: state.rightMarginSp ? `${state.rightMarginSp}px` : '20px',
        }}
      >
        <img
          style={{ width: "96%", height: "96%", borderRadius: "30px" }}
          src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
          alt="bot-header-icon"
        />
      </div>
    )
  } else if (!state.isOpen && isMobile() === true && Number(state.positionSp) === 1 && Number(state.buttonTypeSp) === 1) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        className={state.useFullWidthChatbotMobile ? "fullwidth_mobile_chatbot" : ""}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: state.useFullWidthChatbotMobile ? "calc(100vw - 30px)" : "240px",
          height: state.useFullWidthChatbotMobile ? "75px" : "48px",
          borderRadius: state.useFullWidthChatbotMobile ? "45px" :'35px',
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          bottom: state.bottomMarginSp ? `${state.bottomMarginSp}px` : '10px',
          right: (state.useFullWidthChatbotMobile) ? "15px" : (state.rightMarginSp ? `${state.rightMarginSp}px` : '10px')
        }}
      >
        <div className="sp-header-left" onClick={() => onOpenPreview(!state.isOpen)} style={{ width: '100%', padding: state.useFullWidthChatbotMobile ? "15px" : '4px' }}>
          <div className={state.useFullWidthChatbotMobile ? "fullwidth_mobile_chatbot sp-header-left-avatar sp-avatar" :"sp-header-left-avatar sp-avatar"} style={{ width: state.useFullWidthChatbotMobile ? "58px"  :'38px' }}>
            <img
              src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
              alt="bot-header-icon"
            />
          </div>
          <div>
            <div id="comment_bubble" className="sp-bubble">
              <span style={{ fontSize: state.useFullWidthChatbotMobile ? "17px" :'14px', fontWeight: 700 }}>{state.botInfor.title}</span>
            </div>
          </div>
          <div className="sp-header-right-arrow" style={{ marginLeft: 'auto' }}>
            <MDBIcon fas icon="chevron-circle-up" />
          </div>
        </div>
      </div>
    )
  } else if (!state.isOpen && isMobile() === true && Number(state.positionSp) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: '300px',
          height: "60px",
          borderRadius: "0px",
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          transform: ' rotate(-90deg)',
          bottom: state.bottomMarginSp ? `${parseInt(state.bottomMarginSp) + state.widthPc / 2}px` : '20px',
          right: `${-120}px`,
        }}
      >
        <div className="sp-header-left" onClick={() => onOpenPreview(!state.isOpen)}>
          <div className="sp-header-left-avatar sp-avatar">
            <img
              src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
              alt="bot-header-icon"
            />
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightSpTitle}</div>
          </div>
        </div>
      </div>)
  }

  return (<div></div>);
}

export default PreviewFukushashiki;
