import React, { useEffect, useRef, useReducer, useState } from "react";
import "assets/css/bot/preview-chat-bot.css";
import api from "api/api-management";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import { Button } from "reactstrap";
import ModalPreviewBot from '../../Popup/ModalPreviewBot';
import CustomButton from "./CustomButton";
import { UserMessage, BotMessage } from "./PreviewComponent";
import {
  Row,
  Col
} from "antd";
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
  MESSAGE_CONTENT_TYPES,
  SESSION_STORAGE_KEY,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  CUSTOM_JS_CODE_POSITION,
  BOT_MESSAGE_TYPES,
  TIMER_MAP_VARIABLES_FIELD,
  TIMER_TYPES
} from "./PreviewComponent/Constants";
import {
  getAllUrlParams,
  lightenColor,
  mobileCheck,
  removeLeadingZero,
  sendCountRequest,
  sendCreateOrderData,
  sendUserInteractionData,
  getPrefectures,
  getScenarioPreviewData,
  getChatBotSetting,
  sendEmailRequest,
  sleep,
  stringNullOrEmpty,
  appendParamsToUrl,
  checkMessageCondition,
} from "./PreviewComponent/Utils";
import Withdrawal from "./PreviewComponent/Withdrawal";
import ProcessBar from "./PreviewComponent/ProcessBar";
import ZipCodePopUp from "./PreviewComponent/ZipCodePopUp";
import * as wanakana from "wanakana";
import _ from "lodash";
import Timer from "./Timer";

sessionStorage.setItem("prevOpenStatus", "0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
let isLoadedCssContent = false;
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
  errMsgJsCode: ''
};

const PREVIEW_ACTIONS = {
  UPDATE_RENDER_MESSAGES: "UPDATE_RENDER_MESSAGES",
  UPDATE_MULTI_STATE: "UPDATE_MULTI_STATE",
  ADD_LP_OPTION_DATA: "ADD_LP_OPTION_DATA",
  UPDATE_PREVIEW_ORDER_CONTENT: "UPDATE_PREVIEW_ORDER_CONTENT",
  UPDATE_OPEN_PREVIEW: "UPDATE_OPEN_PREVIEW",
  UPDATE_SUBMIT_ERROR_MESSAGE: "UPDATE_SUBMIT_ERROR_MESSAGE",
  UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG: "UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG"
};

const PreviewFukushashikiReducer = (state, action) => {
  switch (action.type) {
    case PREVIEW_ACTIONS.UPDATE_MULTI_STATE:
      return { ...state, ...(action.payload) };

    case PREVIEW_ACTIONS.ADD_LP_OPTION_DATA:
      return { ...state, lpOptionData: { ...state.lpOptionData, ...action.payload } };
    case PREVIEW_ACTIONS.UPDATE_PREVIEW_ORDER_CONTENT:
      return { ...state, previewOrderContent: action.payload };
    case PREVIEW_ACTIONS.UPDATE_OPEN_PREVIEW:
      return { ...state, isOpen: action.payload.isOpen, showPopupCloseBot: action.payload.showPopupCloseBot };
    case PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES:
      return {
        ...state,
        renderMessagesList: state.messagesList.slice(action.payload.startIndex, action.payload.endIndex)
      };
    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE: {
      let messagesList = _.cloneDeep(state.messagesList);

      if (action.payload === GETTING_ERROR_NOTIFICATION) {
        return state;
      }

      if (stringNullOrEmpty(action.payload)) {
        messagesList = messagesList.map((message, index) => {
          if (message.message_content.find(content => content.type === 'getting_error_notification' || content.type === 'delay') && index < state.currentMsgIndex) {
            message.hidden = true;
          } else if (message.not_display_when_have_error) {
            const result = checkMessageCondition(message, state.objParam);
            message.hidden = !result;;
          }
          return message;
        });
      } else {
        messagesList = messagesList.map((message, index) => {
          if (!message.hidden) {
            message.hidden = action.payload && message.not_display_when_have_error;
          }
          return message;
        });
      }

      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1)
      const userMessagesList = messagesList.filter(message => message.belong_to === 'user' && message.message_content.length > 0);
      return { ...state,
        messagesList: messagesList,
        renderMessagesList: renderMessagesList,
        userMessagesList: userMessagesList,
        submitErrorMessage: action.payload
      };
    }

    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG: {
      let messagesList = _.cloneDeep(state.messagesList);

      if ((action.payload.displayMsg || []).length > 0) {
        messagesList = messagesList.map((message, index) => {
          if (action.payload.displayMsg.includes(message.name?.trim())) {
            message.hidden = false;
          }
          return message;
        });
      }
      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1)
      const userMessagesList = messagesList.filter(message => message.belong_to === 'user' && message.message_content.length > 0);
      return { ...state,
        messagesList: messagesList,
        renderMessagesList: renderMessagesList,
        userMessagesList: userMessagesList,
        submitErrorMessage: action.payload.error
      };
    }
  }

  return state;
}

const PreviewFukushashiki = () => {
  const [state, dispatch] = useReducer(PreviewFukushashikiReducer, previewInitialState);
  const [timerChanges, setTimerChanges] = useState({ timeLeft: -1, config: null });
  const containerRef = useRef(null);
  const isFromScenario = false;

  const setShowPopupCloseBot = (value) => {
    dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { showPopupCloseBot: value } });
  };

  const setCheckoutUrl = (value) => {
    dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { checkoutUrl: value } });
  };

  const setScenarioUserResponses = (sursArr) => {
    dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { scenarioUserResponses: sursArr } });
  };

  const getBotModalStyle = () => {
    if (mobileCheck())
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
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { objParam: { ...state.objParam, ...defaultObjParam } }
      });
    });
  }, [state.objParam.ip, state.loadedStateFromSession]);

  // Get chat bot setting
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (!state.botId && params.get("bot_id")) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { botId: params.get("bot_id") } });
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
  }, [])

  // Add style to body tag if it's mobile
  useEffect(() => {
    if (mobileCheck()) {
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
    postMessageToParent(options);
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
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { prefecturesList: res.data.data } });
      })
  }, [state.prefecturesList, state.loadedStateFromSession]);

  const handleCloseBot = () => {
    const element = document.getElementById('sp-container1');
    if (mobileCheck()) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { showPopupCloseBot: false, isOpen: false } });
    } else {
      element.classList.remove('slideUp');
      element.classList.add('slideDown');
      setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { showPopupCloseBot: false, isOpen: false } });
      }, 680)
    }
  }

  const onOpenPreview = (opening) => {
    const deviceReceive = state.deviceReceive || params.get("deviceReceive");
    if (!deviceReceive) return;

    // Send data to count open chatbot window
    const prevOpenStatus = sessionStorage.getItem("prevOpenStatus");
    if (prevOpenStatus == "0" && opening) {
      sessionStorage.setItem("prevOpenStatus", "1");
      const openChatbotCountApiParams = {
        scenario_data: `${deviceReceive}_open_chatbot_window`,
      };
      sendCountRequest(state.scenarioId, openChatbotCountApiParams);
    }

    // post message to parent window
    postMessageToParent({isOpen: opening});

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
      return dispatch({
        type: PREVIEW_ACTIONS.UPDATE_OPEN_PREVIEW,
        payload: {
          isOpen: opening,
          showPopupCloseBot: false,
        }
      });
    }
    
    state.alreadyOpenFirstTime = true;
    state.isOpen = true;
    state.currentUserMsgIndex = state.messagesList.findIndex((item) => {
      const firstMsgContent = item?.message_content?.[0];
      const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;

      return !item.hidden && isUserMessage(item) && isDisplayBtnNext;
    });
    
    const timerChatbotStorage = getTimerSessionStorage();
    setTimerChanges((timerChanges) => timerChatbotStorage || timerChanges);

    // For the first time, we need to render to the first user message
    if (state.currentUserMsgIndex >= 0) {
      state.currentMsgIndex = state.currentUserMsgIndex;
    }

    return renderMessagesWithDelay(state, 0, state.currentMsgIndex);
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
    return `〒${dataPostCode} ${prefecture}${municipality} ${address}${buildingName}`;
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

  const processBotDelayMessage = async (messagesList, i, newState) => {
    if (messagesList[i]?.message_content[0]?.delay?.typing_on) {
      // TODO: Need display typing on
      // return new Promise(async (resolve) => {
      //   const newRenderMessagesList = [...state.renderMessagesList, messagesList[i]];
      //   dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { renderMessagesList: newRenderMessagesList } });
      //   await sleep(messagesList[i].message_content[0].delay.content * 1000);
      //   resolve();
      // }).then(() => {
      //   let messagesList = state.messagesList;
      //   messagesList[i].hidden = true;
      //   let newRenderMessagesList = [...state.renderMessagesList];
      //   newRenderMessagesList[i].hidden = true;
        
      //   if (isLastMessageInCreateOrderFlow() && state.urlThanksPage)
      //     return redirectToThanksPage();

      //   return dispatch({
      //     type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
      //       renderMessagesList: [...newRenderMessagesList],
      //       messagesList: messagesList,
      //       currentMsgIndex: i,
      //     }
      //   });
      // });
    }
    if (state.renderMessagesList.length - 1 === i) {
      await sleep(messagesList[i].message_content[0].delay.content * 1000);
    }
    if (isLastMessageInCreateOrderFlow())
      return redirectToCartPage();
    newState.currentMsgIndex = i;
    newState.messagesList[i].hidden = true;
    return newState;
  }

  const processBotEmailMessage = (messagesList, i, newState) => {
    const msgContent = messagesList[i]?.message_content?.[0];
    const emailId = msgContent[msgContent.type].contentId;
    let variablesData = {};

    newState.variablesList.forEach((item) => {
      variablesData[item.variable_name] = item.default_value;
    });

    sendEmailRequest(emailId, {variables: variablesData})
      then((res) => {console.log(res)});

    newState.renderMessagesList.push({});
    newState.currentMsgIndex = i;
    return newState;
  }

  const processBotPauseMessage = (messagesList, i, newState) => {
    newState.renderMessagesList.push({});
    newState.currentMsgIndex = i;
  }

  const processForBotVariableSetMessage = (messagesList, i, newState, options = {forceEmpty: false}) => {
    const msgContent = messagesList[i]?.message_content?.[0];
    if (!msgContent) return newState;

    if (newState.variables.length !== 0) {
      const msgVariables = msgContent[msgContent.type].variables;

      newState.variables.forEach((item) => {
        const matchingVariable = msgVariables.find(variable => item.variable_name === variable.key);
        if (matchingVariable) {
          item.default_value = options.forceEmpty ? "" : matchingVariable.value;
        }
      });
    }

    newState.renderMessagesList.push({});
    newState.currentMsgIndex = i;
    return newState;
  }

  const processForBotDefaultMessage = async (messagesList, i, newState, isUpdateSourceContent) => {
    const msgContent = messagesList[i]?.message_content?.[0];
    if (!msgContent) return newState;

    // await sleep(1000);
    const applyVariables = (section) => {
      if (!section?.content || newState.variables.length === 0) return false;

      if (isUpdateSourceContent) section.sourceContent = section.content;

      section.content = newState.variables.reduce(
        (s, { variable_name, default_value }) =>
          s.replaceAll(`{{${variable_name}}}`, default_value),
        section.sourceContent ?? section.content
      );
      return true;
    };

    const updated =
      (msgContent.type === "text_input" &&
        applyVariables(msgContent.text_input)) ||
      (msgContent.type === BOT_MESSAGE_TYPES.HTML_CODE &&
        applyVariables(msgContent.html_code));

    if (updated) messagesList[i].message_content[0] = msgContent;

    newState.renderMessagesList.push(messagesList[i]);
    newState.currentMsgIndex = i;
    scrollToBottom();

    if (isLastMessageInCreateOrderFlow())
      return redirectToCartPage();

    return newState;
  }

  const processForBotMessage = async (messagesList, i, newState, isUpdateSourceContent =+ false) => {
    const firstMsgType = messagesList[i]?.message_content[0]?.type;

    switch (firstMsgType) {
      case "delay":
        return await processBotDelayMessage(messagesList, i, newState);
      case "email":
        return processBotEmailMessage(messagesList, i, newState);
      case "variable_set":
        return processForBotVariableSetMessage(messagesList, i, newState);
      case "clear_variable":
        return processForBotVariableSetMessage(messagesList, i, newState, {forceEmpty: ""});
      case "pause":
        return processBotPauseMessage(messagesList, i, newState);
      default:
        return processForBotDefaultMessage(messagesList, i, newState, isUpdateSourceContent);
    }
  }

  const processForUserCaptchaMessage = (messagesList, i, msgContentIndex, newState) => {
    const msgContent = messagesList[i]?.message_content?.[msgContentIndex];
    const msgContentType = msgContent.type;
    if (!msgContent) return newState;

    const size = msgContent[msgContentType].length;
    const color = msgContent[msgContentType].colour ? "true" : "";
    const charPreset = msgContent[msgContentType].type;

    getCaptcha(size, color, charPreset)
      .then((res) => {
        let newCaptcha = [...state.captcha];
        newCaptcha.push({index: i, indexContent: j, ...res.data});
        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: {
            captcha: [...newCaptcha]
          }
        });
      });
  }

  const processForUserMessage = (messagesList, i, newState) => {
    for (
      let j = 0;
      j < messagesList[i].message_content.length;
      j++
    ) {
      if (messagesList[i].message_content[j].type === "capture") {
        processForUserCaptchaMessage(messagesList, i, j, newState);
      }
    }

    newState.renderMessagesList.push(messagesList[i]);
    newState.currentMsgIndex = i;
    newState.currentUserMsgIndex++;

    scrollToBottom();

    return newState;
  }

  const setConversionParamToLocalStorage = (scenarioId, botType, userInputId, env) => {
    postMessageToParent({
      isOpen: true,
      action: CHATBOT_ACTIONS.SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE,
      actionData: {
        scenarioId, botType, userInputId, env
      }
    });
  }

  const renderMessagesWithDelay = (theState, startMsgIndex, endMsgIndex) => {
    return new Promise(async (resolve) => {
      for (let i = startMsgIndex; i <= endMsgIndex; i++) {
        theState.renderMessagesList = theState.messagesList.slice(0, i + 1);
        if (isDelayBotMessage(theState.messagesList[i])) {
          await sleep(theState.messagesList[i].message_content[0].delay.content * 1000);
          theState.messagesList[i].hidden = true;
          continue;
        }
        
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: theState });
        await sleep(1000);
      }
      resolve();
    }).then(() => {
      theState.renderMessagesList = theState.messagesList.slice(0, theState.currentMsgIndex + 1);
      theState.passedUserMsgCount = theState.renderMessagesList?.filter(msg => isUserMessage(msg))?.length;
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: theState });
    });
  }

  const extractStateFromPreviewResponse = async (res) => {
    if (!res || !res.data || res.data.code !== 1) return;
    
    const designSetting = res.data.design_settings;
    let newState = {
      ...state,
      botInfor: getBotInforFromPreviewResponse(res),
      objParam: {},
      loadedStateFromSession: true,
      messagesList: res.data.data?.conversation?.messages || [],
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
      isUsedErrMsgByJs: res.data?.chatbot?.is_used_err_msg_by_js,
      errMsgJsCode: res.data?.chatbot?.err_msg_js_code,
    };

    if (newState.isUsedErrMsgByJs && newState.errMsgJsCode) {
      postMessageForExecuteJs(newState.errMsgJsCode);
    }

    if (res.data?.chatbot?.is_used_custom_css && res.data?.chatbot?.custom_css_content.length > 0) {
      const style = document.createElement('style');
      style.innerHTML = res.data.chatbot.custom_css_content;
      document.head.appendChild(style);
    }

    if (res.data?.chatbot?.is_used_custom_js_code) {
      sendCustomJsToParent({
        head: { jsCode: res.data?.chatbot?.head_custom_js_code, position: CUSTOM_JS_CODE_POSITION.HEAD },
        top_body: { jsCode: res.data?.chatbot?.top_body_custom_js_code, position: CUSTOM_JS_CODE_POSITION.TOP_BODY },
        bottom_body: { jsCode: res.data?.chatbot?.bottom_body_custom_js_code, position: CUSTOM_JS_CODE_POSITION.BOTTOM_BODY },
      });
    }

    if (res.data?.chatbot?.timer_config?.enable) {
      const timerConfig = res.data.chatbot.timer_config;
      setTimerChanges({ timeLeft: calculateTimerConfigDuration(timerConfig.type, timerConfig.duration), config: timerConfig });
    }

    const prevOpenStatus = sessionStorage.getItem("prevOpenStatus");

    if (res.data.design_settings.display_type == 1 && prevOpenStatus == "0") {
      sessionStorage.setItem("prevOpenStatus", "1");
      const openChatbotCountApiParams = {
        scenario_data: `${state.deviceReceive}_open_chatbot_window`,
      };
      sendCountRequest(state.scenarioId, openChatbotCountApiParams);
    }

    if (res.data.variables) {
      newState.variables = [
        ...res.data.variables,
        ...res.data.all_variables,
      ];

      newState.variables.forEach((item) => {
        newState.objParam[item.variable_name] = item.default_value;
      });
    }

    if (isLoggedIn) {
      newState.messagesList.forEach((x) => x.hidden = x.not_display_when_logged_in);
    }
    
    newState.variablesList = res.data?.all_variables || [];
    newState.urlThanksPage = res.data.data?.conversation?.urlThanksPage || "";
    newState.urlCartConfirmPage = res.data.data?.conversation?.urlCartConfirmPage || "";
    newState.isUsedCartConfirmPage = res.data.data?.conversation?.isUsedCartConfirmPage || false;

    setConversionParamToLocalStorage(
      newState.scenarioId,
      'web',
      newState.userInputId || params.get("uuid"),
      params.get("env") || "production"
    );

    checkUpdateMessagesSessionStorage(res.data.data.updated_at)
    
    newState.userMessagesList = newState.messagesList.filter((item) => isUserMessage(item));
    for (let i = 0; i < newState.messagesList.length; i++) {
      if (newState.messagesList[i].conditions?.length > 0) {
        const result = checkMessageCondition(newState.messagesList[i], newState.objParam);

        if (!result && isUserMessage(newState.messagesList[i])) {
          newState.currentUserMsgIndex++;
          continue;
        }
      }
      if (isBotMessage(newState.messagesList[i])) {
        newState = {
          ...newState,
          ...(await processForBotMessage(newState.messagesList, i, newState, true))
        };
      } else if (isUserMessage(newState.messagesList[i])) {
        newState = {
          ...newState,
          ...processForUserMessage(newState.messagesList, i, newState)
        };
      }
    }

    newState.currentUserMsgIndex = newState.messagesList.findIndex((item) => {
      const firstMsgContent = item?.message_content?.[0];
      const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;

      return !item.hidden && isUserMessage(item) && isDisplayBtnNext;
    });

    // For the first time, we need to render to the first user message
    if (newState.currentUserMsgIndex >= 0) {
      newState.currentMsgIndex = newState.currentUserMsgIndex;
    }

    newState.renderMessagesList = newState.renderMessagesList.map((msg) => {
      return isDelayBotMessage(msg) ? {...msg, hidden: true} : msg;
    });

    if (newState.isOpen) {
      return renderMessagesWithDelay(newState, 0, newState.currentMsgIndex);
    } else {
      newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
      newState.passedUserMsgCount = newState.renderMessagesList?.filter(msg => isUserMessage(msg))?.length;
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: newState });
    }
  }

  const fukushashikiSavedStateToLp = (savedState) => {
    return new Promise((resolve) => {
      let fukuDataList = [];
      savedState.userMessagesList.forEach((message) => {
        fukuDataList.push(...convertToFukushashikiObject({message: message}));
      });
      fukushashikiToLP(fukuDataList);
      resolve();
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

  const calculateTimerConfigDuration = (type, duration) => {
    if (!duration || !type) return 0;

    const durationConfig = duration[type];
    if (!durationConfig) {
      return 0;
    }

    switch(type) {
      case TIMER_TYPES.COUNTING_DOWN: {
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
          params.get("env") || "production"
        );
        if (!isLoadedCssContent && savedState?.botInfor?.is_used_custom_css && savedState?.botInfor?.custom_css_content.length > 0) {
          const style = document.createElement('style');
          style.innerHTML = savedState?.botInfor?.custom_css_content;
          document.head.appendChild(style);
        }

        if (savedState?.botInfor?.is_used_custom_js_code) {
          sendCustomJsToParent({
            head: { jsCode: savedState?.botInfor?.head_custom_js_code, position: CUSTOM_JS_CODE_POSITION.HEAD },
            top_body: { jsCode: savedState?.botInfor?.top_body_custom_js_code, position: CUSTOM_JS_CODE_POSITION.TOP_BODY },
            bottom_body: { jsCode: savedState?.botInfor?.bottom_body_custom_js_code, position: CUSTOM_JS_CODE_POSITION.BOTTOM_BODY }
          });
        }

        if (savedState.isUsedErrMsgByJs && savedState.errMsgJsCode) {
          postMessageForExecuteJs(savedState.errMsgJsCode);
        }
        if (isLoggedIn) {
          savedState.messagesList.forEach((x) => x.hidden = !!x?.not_display_when_logged_in);
          savedState.currentMsgIndex = savedState.messagesList.findIndex((item) => isUserMessage(item) && item.hidden == false);
          savedState.renderMessagesList = savedState.messagesList.slice(0, savedState.currentMsgIndex + 1);
          savedState.renderMessagesList = savedState.renderMessagesList.map((msg) => {
            return isDelayBotMessage(msg) ? {...msg, hidden: true} : msg;
          });
          return dispatch({
            type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
            payload: {
              ...savedState,
              isOpen: true
            }
          });
        }        
        const renderMessagesList = savedState.renderMessagesList.map((msg) => {
          return isDelayBotMessage(msg) ? {...msg, hidden: true} : msg;
        });

        const btnSubmitItem = renderMessagesList.find(x => x.message_content.find(y => y.type == "button_submit"));

        if (btnSubmitItem) {
          const btnSubmitItemContent = btnSubmitItem.message_content[0];
          const actionData = {
            isDisplay: btnSubmitItemContent.button_submit.is_display_error_message,
            seachMode: btnSubmitItemContent.error_message_display_element_search_type,
            searchValue: btnSubmitItemContent.error_message_display_element_search_value,
          };
          savedState.isDisplayErrorMessage = btnSubmitItemContent.button_submit.is_display_error_message;
          postMessageToParent({
            isOpen: true,
            action: CHATBOT_ACTIONS.GET_ERROR_MESSAGE,
            actionData: actionData
          });
        }

        return fukushashikiSavedStateToLp(savedState).then(async () => {
          dispatch({
            type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
            payload: {
              ...savedState,
              isOpen: true,
              loadedStateFromSession: true,
            }
          });
          await sleep(2000);
          // GetPreviewOrderContent
          const botConfirmMessage = savedState.messagesList.find(msg => {
            return !!msg.message_content.find(x => x.text_input?.use_for_confirm_message)
          });
          if (botConfirmMessage) {
            const botConfirmJsCode = botConfirmMessage.message_content
              .find(x => x.text_input?.use_for_confirm_message)
              ?.text_input?.jscode;
            if (botConfirmJsCode && botConfirmJsCode.length > 0) {
              postMessageForGetPreviewOrderContent(botConfirmJsCode);
            }
          }
        });
      }
    }

    if (state.loadedStateFromSession && state.botId)
      return;

    if (!state.botId) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { botId: params.get("bot_id") } });
      return;
    }

    if (!state.urlSend) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { urlSend: window.location.href } });
      return;
    }

    if (!state.urlReceive) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { urlReceive: params.get("urlReceive") } });
      return;
    }

    if (!state.deviceReceive) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { deviceReceive: params.get("deviceReceive") } });
      return;
    }

    if (!state.scenarioId) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { scenarioId: params.get("scenario_id") } });
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

    const renderUserMessagesList = state.renderMessagesList.filter(message => {
      const firstMsgContent = message?.message_content?.[0];
      const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;
      return isUserMessage(message) && isDisplayBtnNext && !message.hidden;
    });

    if (renderUserMessagesList.length > 1) {
      scrollToBottom(false);
    } else {
      scrollToTop();
    }
  }, [state.isOpen, state.renderMessagesList.length, state.submitErrorMessage]);

  const scrollToBottom = (forceScroll = false) => {
    if (document.getElementById("sp-body")) {
      document.getElementById("sp-body").scrollTo({
        top: document.getElementById("sp-body").scrollHeight,
        behavior: forceScroll ? "auto" : "smooth"
      });
    }
  };

  const scrollToTop = () => {
    if (document.getElementById("sp-body")) {
      document.getElementById("sp-body").scrollTo({
        top: 0,
        behavior: "auto"
      });
    }
  }

  const handleValidateField = (index) => {
    let contentArr = [...state.renderMessagesList[index].message_content];
    let isValid = true;
    let errorsMess = {};

    let messageError = "この項目は必須です。";
    for (let i = 0; i < contentArr.length; i++) {
      let contentType = contentArr[i][contentArr[i].type];
      let limitFrom = contentType[contentType.type]?.character_limit_from || 0;
      let limitTo =
        contentType[contentType.type]?.character_limit_to ||
        Number.MAX_SAFE_INTEGER;
      if (contentType.require) {
        if (contentType.type === "text" || contentType.type === "password") {
          if (contentType[contentType.type].isSplitInput) {
            if (
              stringNullOrEmpty(contentType[contentType.type].valueLeft) ||
              stringNullOrEmpty(contentType[contentType.type].valueRight)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
              ] = messageError;
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "phone_number") {
          if (contentType[contentType.type].withHyphen) {
            if (
              stringNullOrEmpty(contentType[contentType.type].value1) ||
              stringNullOrEmpty(contentType[contentType.type].value2) ||
              stringNullOrEmpty(contentType[contentType.type].value3)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
              ] = messageError;
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentType.type === "email_confirmation" ||
          contentType.type === "password_confirmation"
        ) {
          if (
            stringNullOrEmpty(contentType[contentType.type].value) ||
            stringNullOrEmpty(contentType[contentType.type].valueConfirm)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "customization") {
          if (contentType[contentType.type].is_comment) {
            if (
              stringNullOrEmpty(contentType[contentType.type].valueLeft) ||
              stringNullOrEmpty(contentType[contentType.type].valueRight)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
              ] = messageError;
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "time_hm") {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueHour) ||
            stringNullOrEmpty(contentType[contentType.type].valueMinute)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentType.type === "date_ymd" ||
          contentType.type === "dob_ymd"
        ) {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueYear) ||
            stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
            stringNullOrEmpty(contentType[contentType.type].valueDay)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "date_md") {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
            stringNullOrEmpty(contentType[contentType.type].valueDay)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentType.type === "date_ym" ||
          contentType.type === "dob_ym"
        ) {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueYear) ||
            stringNullOrEmpty(contentType[contentType.type].valueMonth)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "date_ymd_hm") {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueYear) ||
            stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
            stringNullOrEmpty(contentType[contentType.type].valueDay) ||
            stringNullOrEmpty(contentType[contentType.type].valueHour) ||
            stringNullOrEmpty(contentType[contentType.type].valueMinute)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "timezone_from_to") {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueHour1) ||
            stringNullOrEmpty(contentType[contentType.type].valueMinute1) ||
            stringNullOrEmpty(contentType[contentType.type].valueHour2) ||
            stringNullOrEmpty(contentType[contentType.type].valueMinute2)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "period_from_to") {
          if (
            stringNullOrEmpty(contentType[contentType.type].valueYear1) ||
            stringNullOrEmpty(contentType[contentType.type].valueMonth1) ||
            stringNullOrEmpty(contentType[contentType.type].valueDay1) ||
            stringNullOrEmpty(contentType[contentType.type].valueYear2) ||
            stringNullOrEmpty(contentType[contentType.type].valueMonth2) ||
            stringNullOrEmpty(contentType[contentType.type].valueDay2)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "up_to_municipality") {
          if (
            stringNullOrEmpty(contentType[contentType.type].prefecture) ||
            stringNullOrEmpty(contentType[contentType.type].city)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "attaching_file") {
          if (stringNullOrEmpty(contentType.value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentType.type === "date_selection" ||
          contentType.type === "embedded"
        ) {
          if (stringNullOrEmpty(contentType.date_select)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "start_end_date") {
          if (
            stringNullOrEmpty(contentType.start_date_select) ||
            stringNullOrEmpty(contentType.end_date_select)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "agree_term") {
          if (
            stringNullOrEmpty(contentType.isAgree) ||
            contentType.isAgree === false
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "radio_button") {
          if (stringNullOrEmpty(contentType.initial_selection)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "checkbox") {
          if (contentType.type !== "checkbox_img") {
            if (
              contentType.checkedValue &&
              contentType.checkedValue.length === 0
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}`
              ] = messageError;
              isValid = false;
            } else if (
              contentType.selection_limit_from &&
              contentType.checkedValue.length <
              parseInt(contentType.selection_limit_from)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}`
              ] = `この項目は、${contentType.selection_limit_from}個以上選択してください。`;
              isValid = false;
            } else if (
              contentType.selection_limit_to &&
              contentType.checkedValue.length >
              parseInt(contentType.selection_limit_to)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}`
              ] = `この項目は、${contentType.selection_limit_to}個以下選択してください。`;
              isValid = false;
            }
          } else {
            if (
              contentType.initial_selection_picture &&
              contentType.initial_selection_picture.length === 0
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}`
              ] = messageError;
              isValid = false;
            } else if (
              contentType.selection_limit_from &&
              contentType.initial_selection_picture.length <
              parseInt(contentType.selection_limit_from)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}`
              ] = `この項目は、${contentType.selection_limit_from}個以上選択してください。`;
              isValid = false;
            } else if (
              contentType.selection_limit_to &&
              contentType.initial_selection_picture.length >
              parseInt(contentType.selection_limit_to)
            ) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}`
              ] = `この項目は、${contentType.selection_limit_to}個以下選択してください。`;
              isValid = false;
            }
          }
        } else if (contentArr[i].type === "carousel") {
          if (stringNullOrEmpty(contentType.initial_selection)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "capture") {
          if (stringNullOrEmpty(contentType.value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          } else if (
            state.captcha.filter(
              (item) => item.index === index && item.indexContent === i
            )?.[0]?.text.toLowerCase() !== contentType.value.toLowerCase()
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = "認証コードが間違っています。";
            isValid = false;
          }
        } else if (contentArr[i].type === "product_purchase") {
          if (contentType.initial_selection.length === 0) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "slider") {
          if (stringNullOrEmpty(contentType.value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "product_purchase_radio_button") {
          if (contentType.initial_selection.length === 0) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'product_purchase_select_option') {
          if (stringNullOrEmpty(contentType.value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "card_payment_radio_button") {
          if (
            contentType.type !== "picture_radio" &&
            stringNullOrEmpty(contentType.initial_selection)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          } else if (
            contentType.type === "picture_radio" &&
            stringNullOrEmpty(contentType.initial_selection_picture)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === "textarea") {
          if (
            contentType.type === "text_input" &&
            stringNullOrEmpty(contentType[contentType.type].value)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentArr[i].type !== "credit_card_payment" &&
          stringNullOrEmpty(contentType[contentType.type].value)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = messageError;
          isValid = false;
        } else if (
          (limitFrom || limitTo) &&
          (contentType[contentType.type]?.value?.length < limitFrom ||
            contentType[contentType.type]?.value?.length > limitTo)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `${limitFrom}文字以上${limitTo}文字以下にしてください。`;
          isValid = false;
        }
      } else {
        if (contentArr[i].type === "checkbox") {
          if (
            contentType.type !== "checkbox_img" &&
            contentType.selection_limit_to &&
            contentType.checkedValue.length >
            parseInt(contentType.selection_limit_to)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = `この項目は、${contentType.selection_limit_to}個以下選択してください。`;
            isValid = false;
          } else if (
            contentType.type === "checkbox_img" &&
            contentType.selection_limit_to &&
            contentType.initial_selection_picture.length >
            parseInt(contentType.selection_limit_to)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = `この項目は、${contentType.selection_limit_to}個以下選択してください。`;
            isValid = false;
          }
        } else if (
          contentType.type === "phone_number" &&
          contentType[contentType.type].withHyphen
        ) {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].value1) ||
              !stringNullOrEmpty(contentType[contentType.type].value2) ||
              !stringNullOrEmpty(contentType[contentType.type].value3)) &&
            (stringNullOrEmpty(contentType[contentType.type].value1) ||
              stringNullOrEmpty(contentType[contentType.type].value2) ||
              stringNullOrEmpty(contentType[contentType.type].value3))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "time_hm") {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueHour) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMinute)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueMinute) ||
              stringNullOrEmpty(contentType[contentType.type].valueHour))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentType.type === "date_ymd" ||
          contentType.type === "dob_ymd"
        ) {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueYear) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
              !stringNullOrEmpty(contentType[contentType.type].valueDay)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueYear) ||
              stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
              stringNullOrEmpty(contentType[contentType.type].valueDay))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "date_md") {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
              !stringNullOrEmpty(contentType[contentType.type].valueDay)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
              stringNullOrEmpty(contentType[contentType.type].valueDay))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (
          contentType.type === "date_ym" ||
          contentType.type === "dob_ym"
        ) {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueYear) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMonth)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueYear) ||
              stringNullOrEmpty(contentType[contentType.type].valueMonth))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "date_ymd_hm") {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueYear) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
              !stringNullOrEmpty(contentType[contentType.type].valueDay) ||
              !stringNullOrEmpty(contentType[contentType.type].valueHour) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMinute)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueYear) ||
              stringNullOrEmpty(contentType[contentType.type].valueMonth) ||
              stringNullOrEmpty(contentType[contentType.type].valueDay) ||
              stringNullOrEmpty(contentType[contentType.type].valueHour) ||
              stringNullOrEmpty(contentType[contentType.type].valueMinute))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "timezone_from_to") {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueHour1) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMinute1) ||
              !stringNullOrEmpty(contentType[contentType.type].valueHour2) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMinute2)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueHour1) ||
              stringNullOrEmpty(contentType[contentType.type].valueMinute1) ||
              stringNullOrEmpty(contentType[contentType.type].valueHour2) ||
              stringNullOrEmpty(contentType[contentType.type].valueMinute2))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "period_from_to") {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueYear1) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMonth1) ||
              !stringNullOrEmpty(contentType[contentType.type].valueDay1) ||
              !stringNullOrEmpty(contentType[contentType.type].valueYear2) ||
              !stringNullOrEmpty(contentType[contentType.type].valueMonth2) ||
              !stringNullOrEmpty(contentType[contentType.type].valueDay2)) &&
            (stringNullOrEmpty(contentType[contentType.type].valueYear1) ||
              stringNullOrEmpty(contentType[contentType.type].valueMonth1) ||
              stringNullOrEmpty(contentType[contentType.type].valueDay1) ||
              stringNullOrEmpty(contentType[contentType.type].valueYear2) ||
              stringNullOrEmpty(contentType[contentType.type].valueMonth2) ||
              stringNullOrEmpty(contentType[contentType.type].valueDay2))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        } else if (contentType.type === "up_to_municipality") {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].prefecture) ||
              !stringNullOrEmpty(contentType[contentType.type].city)) &&
            (stringNullOrEmpty(contentType[contentType.type].prefecture) ||
              stringNullOrEmpty(contentType[contentType.type].city))
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
        }
      }
      let REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let REGEX_PASSWORD = /^[A-Za-z0-9 ]+$/;

      if (contentType.type === "text" || contentType.type === "password") {
        if (contentType[contentType.type].isSplitInput) {
          if (
            (!stringNullOrEmpty(contentType[contentType.type].valueLeft) ||
              !stringNullOrEmpty(contentType[contentType.type].valueRight)) &&
            (contentType[contentType.type].valueLeft?.length < limitFrom ||
              contentType[contentType.type].valueRight?.length < limitFrom)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = `${limitFrom}文字以上入力してください。`;
            isValid = false;
          } else if (
            (!stringNullOrEmpty(contentType[contentType.type].valueLeft) ||
              !stringNullOrEmpty(contentType[contentType.type].valueRight)) &&
            (contentType[contentType.type].valueLeft?.length > limitTo ||
              contentType[contentType.type].valueRight?.length > limitTo)
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = `${limitTo}文字以下入力してください。`;
            isValid = false;
          }
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          contentType[contentType.type].value?.length < limitFrom
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `${limitFrom}文字以上入力してください。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          contentType[contentType.type].value?.length > limitTo
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `${limitTo}文字以下入力してください。`;
          isValid = false;
        } else if (
          contentType.type === "password" &&
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          !REGEX_PASSWORD.test(contentType[contentType.type].value)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `英数字('A-Z','a-z','0-9')が使用できます。`;
          isValid = false;
        }
      } else if (
        contentArr[i].type === "product_purchase" &&
        contentType.initial_selection.length !== 0
      ) {
        contentType.initial_selection.forEach((item, index) => {
          contentType.products.forEach((itemProduct, indexProduct) => {
            if (item === itemProduct.id && !itemProduct.quantity_select) {
              errorsMess[
                `message${index}_content${i}_${contentArr[i].type}_${indexProduct}`
              ] = messageError;
              isValid = false;
            }
          });
        });
      } else if (contentType.type === "password_confirmation") {
        if (
          (!stringNullOrEmpty(contentType[contentType.type].value) ||
            !stringNullOrEmpty(contentType[contentType.type].valueConfirm)) &&
          (contentType[contentType.type].value?.length < limitFrom ||
            contentType[contentType.type].valueConfirm?.length < limitFrom)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `${limitFrom}文字以上入力してください。`;
          isValid = false;
        } else if (
          (!stringNullOrEmpty(contentType[contentType.type].value) ||
            !stringNullOrEmpty(contentType[contentType.type].valueConfirm)) &&
          (contentType[contentType.type].value?.length > limitTo ||
            contentType[contentType.type].valueConfirm?.length > limitTo)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `${limitTo}文字以下入力してください。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          !REGEX_PASSWORD.test(contentType[contentType.type].value)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `英数字('A-Z','a-z','0-9')が使用できます。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].valueConfirm) &&
          !REGEX_PASSWORD.test(contentType[contentType.type].valueConfirm)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `英数字('A-Z','a-z','0-9')が使用できます。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          !stringNullOrEmpty(contentType[contentType.type].valueConfirm) &&
          contentType[contentType.type].value !==
          contentType[contentType.type].valueConfirm
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = "パスワードとパスワード確認が一致しません。";
          isValid = false;
        }
      } else if (
        contentArr[i].type === "textarea" &&
        contentType.type === "text_input"
      ) {
        if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          contentType[contentType.type].value.length < limitFrom
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = `${limitFrom}文字以上入力してください。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          contentType[contentType.type].value.length > limitTo
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = `${limitTo}文字以下入力してください。`;
          isValid = false;
        }
      } else if (contentArr[i].type === "zip_code_address") {
        if (
          state.errors[
          `message${index}_content${i}_${contentArr[i].type}`
          ] &&
          state.errors[
          `message${index}_content${i}_${contentArr[i].type}`
          ] !== messageError
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] =
          state.errors[
            `message${index}_content${i}_${contentArr[i].type}`
            ];
          isValid = false;
        } else {
          let isValidZipCode = true;
          if (contentType.isCheckRequire === "require") {
            if (contentType.post_code !== undefined) {
              if (contentType.split_postal_code) {
                if (
                  stringNullOrEmpty(contentType.value_post_code_left) ||
                  stringNullOrEmpty(contentType.value_post_code_right)
                ) {
                  isValidZipCode = false;
                }
              } else if (stringNullOrEmpty(contentType.value_post_code)) {
                isValidZipCode = false;
              }

              if (
                contentType.prefecture !== undefined &&
                stringNullOrEmpty(contentType.value_prefecture) && contentType.hasOwnProperty('prefecture')
              ) {
                isValidZipCode = false;
              }
              if (
                contentType.municipality !== undefined &&
                stringNullOrEmpty(contentType.value_municipality) && contentType.hasOwnProperty('municipality')
              ) {
                isValidZipCode = false;
              }
              if (
                !contentType.compact_municipality_and_address_and_building_name &&
                contentType.address !== undefined &&
                stringNullOrEmpty(contentType.value_address) && contentType.hasOwnProperty('address')
              ) {
                isValidZipCode = false;
              }
            }
          } else if (contentType.isCheckRequire === "all_items_require") {
            if (contentType.post_code !== undefined) {
              if (contentType.split_postal_code) {
                if (
                  stringNullOrEmpty(contentType.value_post_code_left) ||
                  stringNullOrEmpty(contentType.value_post_code_right)
                ) {
                  isValidZipCode = false;
                }
              } else if (stringNullOrEmpty(contentType.value_post_code)) {
                isValidZipCode = false;
              }
            }
            if (
              contentType.prefecture !== undefined &&
              stringNullOrEmpty(contentType.value_prefecture) && contentType.hasOwnProperty('prefecture')
            ) {
              isValidZipCode = false;
            }
            if (
              contentType.municipality !== undefined &&
              stringNullOrEmpty(contentType.value_municipality) && contentType.hasOwnProperty('municipality')
            ) {
              isValidZipCode = false;
            }
            if (
              !contentType.compact_municipality_and_address_and_building_name &&
              contentType.address !== undefined &&
              stringNullOrEmpty(contentType.value_address) && contentType.hasOwnProperty('address')
            ) {
              isValidZipCode = false;
            }
            if (
              !contentType.compact_municipality_and_address_and_building_name &&
              contentType.building_name !== undefined &&
              stringNullOrEmpty(contentType.value_building_name) && contentType.hasOwnProperty('building_name')
            ) {
              isValidZipCode = false;
            }
          }
          if (isValidZipCode === false) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        }
      } else if (contentArr[i].type === "shipping_address") {
        if (
          state.errors[
          `message${index}_content${i}_${contentArr[i].type}`
          ] &&
          state.errors[
          `message${index}_content${i}_${contentArr[i].type}`
          ] !== messageError
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] =
          state.errors[
            `message${index}_content${i}_${contentArr[i].type}`
            ];
          isValid = false;
        } else {
          let isValidShippingAddress = true;
          if (contentType.isCheckRequire === "all_items_require") {
            if (
              contentType.name !== undefined &&
              stringNullOrEmpty(contentType.value_name_left) ||
              stringNullOrEmpty(contentType.value_name_right)
            ) {
              isValidShippingAddress = false;
            }
            if (
              contentType.kana_name !== undefined &&
              stringNullOrEmpty(contentType.value_kana_left) ||
              stringNullOrEmpty(contentType.value_kana_right)
            ) {
              isValidShippingAddress = false;
            }
            if (contentType.post_code !== undefined) {
              if (contentType.split_postal_code) {
                if (
                  stringNullOrEmpty(contentType.value_post_code_left) ||
                  stringNullOrEmpty(contentType.value_post_code_right)
                ) {
                  isValidShippingAddress = false;
                }
              } else if (stringNullOrEmpty(contentType.value_post_code)) {
                isValidShippingAddress = false;
              }
            }
            if (
              contentType.prefecture !== undefined &&
              stringNullOrEmpty(contentType.value_prefecture)
            ) {
              isValidShippingAddress = false;
            }
            if (
              contentType.municipality !== undefined &&
              stringNullOrEmpty(contentType.value_municipality)
            ) {
              isValidShippingAddress = false;
            }
            if (
              !contentType.compact_municipality_and_address_and_building_name &&
              contentType.address !== undefined &&
              stringNullOrEmpty(contentType.value_address)
            ) {
              isValidShippingAddress = false;
            }
            if (
              !contentType.compact_municipality_and_address_and_building_name &&
              contentType.building_name !== undefined &&
              stringNullOrEmpty(contentType.value_building_name)
            ) {
              isValidShippingAddress = false;
            }
            if (
              contentType.number !== undefined &&
              (stringNullOrEmpty(contentType.value_number1) ||
                stringNullOrEmpty(contentType.value_number2) ||
                stringNullOrEmpty(contentType.value_number3))
            ) {
              isValidShippingAddress = false
            }
          }
          if (isValidShippingAddress === false) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}`
            ] = messageError;
            isValid = false;
          }
        }
      } else if (
        contentType.type === "phone_number" &&
        !errorsMess[
        `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
        ]
      ) {
        let REGEX_PHONE = /^0\d{9}$|^0\d{10}$/;
        if (contentType[contentType.type].withHyphen) {
          if (
            !stringNullOrEmpty(contentType[contentType.type].value1) &&
            !stringNullOrEmpty(contentType[contentType.type].value2) &&
            !stringNullOrEmpty(contentType[contentType.type].value3) &&
            !REGEX_PHONE.test(
              `${contentType[contentType.type].value1}${contentType[contentType.type].value2
              }${contentType[contentType.type].value3}`
            )
          ) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = "入力形式が正しくありません。";
            isValid = false;
          }
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          !REGEX_PHONE.test(contentType[contentType.type].value)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = "入力形式が正しくありません。";
          isValid = false;
        }
      } else if (
        contentType.type === "urls" &&
        !stringNullOrEmpty(contentType[contentType.type].value)
      ) {
        let REGEX_URLS =
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        if (!REGEX_URLS.test(contentType[contentType.type].value)) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `有効なURL形式で指定してください。`;
          isValid = false;
        }
      } else if (
        contentType.type === "email_address" &&
        !stringNullOrEmpty(contentType[contentType.type].value)
      ) {
        if (!REGEX_EMAIL.test(contentType[contentType.type].value)) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `有効なメールアドレス形式で指定してください。`;
          isValid = false;
        }
      } else if (contentType.type === "email_confirmation") {
        if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          !REGEX_EMAIL.test(contentType[contentType.type].value)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `有効なメールアドレス形式で指定してください。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].valueConfirm) &&
          !REGEX_EMAIL.test(contentType[contentType.type].valueConfirm)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `有効なメールアドレス形式で指定してください。`;
          isValid = false;
        } else if (
          !stringNullOrEmpty(contentType[contentType.type].value) &&
          !stringNullOrEmpty(contentType[contentType.type].valueConfirm) &&
          contentType[contentType.type].value !==
          contentType[contentType.type].valueConfirm
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
          ] = `メールアドレスとメールアドレス確認が一致しません。`;
          isValid = false;
        }
      } else if (
        contentArr[i].type === "attaching_file" &&
        state.errors[`message${index}_content${i}_${contentArr[i].type}`]
      ) {
        errorsMess[
          `message${index}_content${i}_${contentArr[i].type}`
        ] =
          state.errors[
            `message${index}_content${i}_${contentArr[i].type}`
            ];
        isValid = false;
      } else if (contentArr[i].type === "credit_card_payment") {
        if (
          (contentType.is_hide_card_name !== true &&
            stringNullOrEmpty(contentType.card_holder)) ||
          (contentType.is_hide_cvc !== true &&
            stringNullOrEmpty(contentType.cvc)) ||
          (contentType.separate_type === true &&
            (stringNullOrEmpty(contentType.card_number1) ||
              stringNullOrEmpty(contentType.card_number2) ||
              stringNullOrEmpty(contentType.card_number3) ||
              stringNullOrEmpty(contentType.card_number4))) ||
          (contentType.separate_type === false &&
            stringNullOrEmpty(contentType.card_number)) ||
          (contentType.is_hide_cvc !== true &&
            stringNullOrEmpty(contentType.cvc)) ||
          stringNullOrEmpty(contentType.year) ||
          stringNullOrEmpty(contentType.month)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = messageError;
          isValid = false;
        } else if (
          (contentType.card_number &&
            ((contentType.card_number + "").length !== 16 ||
              /[^0-9]+/.test(contentType.card_number))) ||
          (!stringNullOrEmpty(contentType.card_number1) &&
            !stringNullOrEmpty(contentType.card_number2) &&
            !stringNullOrEmpty(contentType.card_number3) &&
            !stringNullOrEmpty(contentType.card_number4) &&
            ((contentType.card_number1 + "").length !== 4 ||
              (contentType.card_number2 + "").length !== 4 ||
              (contentType.card_number3 + "").length !== 4 ||
              (contentType.card_number4 + "").length !== 4))
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = "クレジットカード番号は無効です。";
          isValid = false;
        } else if (
          moment(
            `${contentType.year}-${contentType.month}}`,
            "YYYY-MM"
          ).isBefore(moment().format("YYYY-MM"))
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = "有効期限に誤りがあるために、決済を完了できませんでした。";
          isValid = false;
        }
      } else if (
        contentArr[i].type === "card_payment_radio_button" &&
        errorsMess[
        `message${index}_content${i}_${contentArr[i].type}`
        ] !== messageError &&
        (((contentType?.initial_selection ||
          contentType?.card_linked_setting.length > 0) &&
          contentType?.card_linked_setting.includes(contentType?.initial_selection)
        ) ||
          ((contentType?.initial_selection_picture ||
            contentType?.card_linked_setting_picture) &&
            contentType?.initial_selection_picture ===
            contentType?.card_linked_setting_picture))
      ) {
        if (
          contentType.is_hide_card_name !== true &&
          (contentType.separate_name === false
            ? stringNullOrEmpty(contentType.card_holder)
            : (stringNullOrEmpty(contentType.card_holder1),
              stringNullOrEmpty(contentType.card_holder2))) ||
          (contentType.is_hide_cvc !== true &&
            stringNullOrEmpty(contentType.cvc)) ||
          (contentType.separate_type === true &&
            (stringNullOrEmpty(contentType.card_number1) ||
              stringNullOrEmpty(contentType.card_number2) ||
              stringNullOrEmpty(contentType.card_number3) ||
              stringNullOrEmpty(contentType.card_number4))) ||
          (contentType.separate_type === false &&
            stringNullOrEmpty(contentType.card_number)) ||
          (contentType.is_hide_cvc !== true &&
            stringNullOrEmpty(contentType.cvc)) ||
          stringNullOrEmpty(contentType.year) ||
          stringNullOrEmpty(contentType.month)
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = messageError;
          isValid = false;
        } else if (
          (contentType.card_number &&
            ((contentType.card_number + "").length !== 16 ||
              /[^0-9]+/.test(contentType.card_number))) ||
          (!stringNullOrEmpty(contentType.card_number1) &&
            !stringNullOrEmpty(contentType.card_number2) &&
            !stringNullOrEmpty(contentType.card_number3) &&
            !stringNullOrEmpty(contentType.card_number4) &&
            ((contentType.card_number1 + "").length !== 4 ||
              (contentType.card_number2 + "").length !== 4 ||
              (contentType.card_number3 + "").length !== 4 ||
              (contentType.card_number4 + "").length !== 4))
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = "クレジットカード番号は無効です。";
          isValid = false;
        } else if (
          moment(
            `${contentType.year}-${contentType.month}}`,
            "YYYY-MM"
          ).isBefore(moment().format("YYYY-MM"))
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = "有効期限に誤りがあるために、決済を完了できませんでした。";
          isValid = false;
        } else if (contentType.cvc && (contentType.cvc.toString().length < 3 || contentType.cvc.toString().length > 4)) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] = "CVCは3桁か4桁で入力してください。";
          isValid = false;
        }
      }
      if (
        contentArr[i].type === "text_input" &&
        contentType[contentType.type].range &&
        contentType[contentType.type].range !== "no_input" &&
        (!stringNullOrEmpty(contentType[contentType.type].value) ||
          !stringNullOrEmpty(contentType[contentType.type].valueLeft) ||
          !stringNullOrEmpty(contentType[contentType.type].valueRight))
      ) {
        let REGEX_CHECK;
        let messageLog = "";
        switch (contentType[contentType.type].range) {
          case "alphabet":
            REGEX_CHECK = /[^A-Za-z ]+/;
            messageLog = "アルファベッドのみ使用できます。";
            break;
          case "single_byte":
            REGEX_CHECK = /[^0-9 ]+/;
            messageLog = "半角数字で入力してください";
            break;
          case "alphanumeric_hyphen":
            REGEX_CHECK = /[^A-Za-z0-9-_ ]+/;
            messageLog =
              "英数字('A-Z','a-z','0-9')とハイフンと下線('-','_')が使用できます。";
            break;
          case "alphanumeric":
            REGEX_CHECK = /[^A-Za-z0-9 ]+/;
            messageLog = "英数字('A-Z','a-z','0-9')が使用できます。";
            break;
          case "double_byte_hiragana":
            REGEX_CHECK = /[^ぁ-ん]+/;
            messageLog = "全角ひらがなを入力してください。";
            break;
          case "full_width_katakana":
            REGEX_CHECK = /[^ァ-ン]+/;
            messageLog = "全角カタカナを入力してください。";
            break;
          case "double_byte":
            // REGEX_CHECK = /[^ァ-ンぁ-んｧ-ﾝﾞﾟ]+$/;
            REGEX_CHECK = /[^ァ-ンぁ-ん一-龥]+$/;
            messageLog = "全角文字を入力してください。";
            break;
          default:
            REGEX_CHECK = "";
            break;
        }
        if (REGEX_CHECK !== "") {
          if (
            contentType[contentType.type].isSplitInput &&
            (REGEX_CHECK.test(contentType[contentType.type].valueLeft) ||
              REGEX_CHECK.test(contentType[contentType.type].valueRight))
          ) {
            isValid = false;
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageLog;
          } else if (!contentType[contentType.type].isSplitInput && REGEX_CHECK.test(contentType[contentType.type].value)) {
            isValid = false;
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageLog;
          }
        }
      }
    }
    if (isValid) {
      errorsMess = {};
    }
    
    state.errors = errorsMess;
    if (!isValid) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: state,                                                          
      });
    }
    return isValid;
  };

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

  const convertToFukushashikiObject = (obj) => {
    if (
      obj &&
      obj.message.message_content &&
      obj.message.message_content.length > 0
    ) {
      const messageArray = obj.message.message_content;
      const fukuDataList = [];
      messageArray.forEach((message) => {
        switch (message.type) {
          case 'text_input':
            {
              if (message.text_input?.text?.value != undefined || message.text_input?.text?.valueLeft != undefined || message.text_input?.text?.valueRight != undefined) {
                if (message.text_input?.text?.isSplitInput == true) {
                  const fukuObjectLeft = {
                    type: message.type,
                    bindingMode: message.left_fukushashiki_search_mode,
                    bindingAddress: message.left_fukushashiki_search_value,
                    bindingValue: message.text_input.text.valueLeft,
                  };

                  const fukuObjectRight = {
                    type: message.type,
                    bindingMode: message.right_fukushashiki_search_mode,
                    bindingAddress: message.right_fukushashiki_search_value,
                    bindingValue: message.text_input.text.valueRight,
                  };
                  fukuDataList.push(fukuObjectLeft);
                  fukuDataList.push(fukuObjectRight);
                }
                else {
                  if (message.fukushashiki_search_value?.includes(',')) {
                    let address = message.fukushashiki_search_value.split(',');
                    address.forEach(value => {
                      const fukuObject = {
                        type: message.type,
                        bindingMode: message.fukushashiki_search_mode,
                        bindingAddress: value,
                        bindingValue: message.text_input.text.value,
                      };
                      fukuDataList.push(fukuObject);
                    });
                  }
                  else {
                    const fukuObject = {
                      type: message.type,
                      bindingMode: message.fukushashiki_search_mode,
                      bindingAddress: message.fukushashiki_search_value,
                      bindingValue: message.text_input.text.value,
                    };
                    fukuDataList.push(fukuObject);
                  }
                }
              }

              if (Object.keys(message.text_input.urls).length != 0 && message.text_input.urls.value != undefined) {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.text_input.urls.value,
                };
                fukuDataList.push(fukuObject);
              }

              if (Object.keys(message.text_input.email_confirmation).length != 0 && message.text_input.email_confirmation != undefined) {
                const userInputData = Object.fromEntries(
                  Object.entries(message.text_input.email_confirmation).filter(([key]) => key.includes("value"))
                );
                const dataInforFukushashiki = Object.fromEntries(
                  Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
                );
                const types = ["value", "valueConfirm"];
                const result = types
                  .filter(type => `${type}` in userInputData)
                  .map(type => ({
                    type: message.type,
                    bindingMode: dataInforFukushashiki[`${type}_fukushashiki_search_mode`],
                    bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                    bindingValue: userInputData[`${type}`]
                  }));
                fukuDataList.push(...result);
              }

              if (message.text_input?.phone_number.value != undefined ||
                message.text_input?.phone_number.value1 != undefined ||
                message.text_input?.phone_number.value2 != undefined ||
                message.text_input?.phone_number.value3 != undefined) {

                if (message.text_input.phone_number.withHyphen == false) {
                  const fukuObject = {
                    type: message.type,
                    bindingMode: message.fukushashiki_search_mode,
                    bindingAddress: message.fukushashiki_search_value,
                    bindingValue: message.text_input.phone_number.value,
                  };
                  fukuDataList.push(fukuObject);
                }
                else {
                  const userInputData = Object.fromEntries(
                    Object.entries(message.text_input.phone_number).filter(([key]) => key.includes("value"))
                  );
                  const dataInforFukushashiki = Object.fromEntries(
                    Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
                  );
                  const types = ["value1", "value2", "value3"];
                  const result = types
                    .filter(type => `${type}` in userInputData)
                    .map(type => ({
                      type: message.type,
                      bindingMode: dataInforFukushashiki[`${type}_fukushashiki_search_mode`],
                      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                      bindingValue: userInputData[`${type}`]
                    }));
                  fukuDataList.push(...result);
                }
              }

              if (Object.keys(message.text_input.email_address).length !== 0 && message.text_input.email_address !== undefined) {
                const addresses = message.fukushashiki_search_value?.split(',') || [message.fukushashiki_search_value];
                addresses.forEach(value => {
                  const fukuObject = {
                    type: message.type,
                    bindingMode: message.fukushashiki_search_mode,
                    bindingAddress: value.trim(),
                    bindingValue: message.text_input.email_address.value,
                  };
                  fukuDataList.push(fukuObject);
                });
              }

              if (Object.keys(message.text_input.password).length != 0 && message.text_input.password != undefined) {
                if (message.fukushashiki_search_value.includes(',')) {
                  let address = message.fukushashiki_search_value.split(',');
                  address.forEach(value => {
                    const fukuObject = {
                      type: 'password',
                      bindingMode: message.fukushashiki_search_mode,
                      bindingAddress: value,
                      bindingValue: message.text_input.password.value,
                    };
                    fukuDataList.push(fukuObject);
                  });
                }
                else {
                  const fukuObject = {
                    type: 'password',
                    bindingMode: message.fukushashiki_search_mode,
                    bindingAddress: message.fukushashiki_search_value,
                    bindingValue: message.text_input.password.value,
                  };
                  fukuDataList.push(fukuObject);
                }
              }

              if (Object.keys(message.text_input.password_confirmation).length != 0 && message.text_input.password_confirmation != undefined) {
                const fukuObject1 = {
                  type: 'password_confirmation',
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.text_input.password_confirmation.value,
                };

                const fukuObject2 = {
                  type: 'password_confirmation',
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.text_input.password_confirmation.valueConfirm,
                };
                fukuDataList.push(fukuObject1);
                fukuDataList.push(fukuObject2);
              }
            }
            break;
          case 'agree_term':
            {
              let searchValue = message.fukushashiki_search_value;
              if (!searchValue) break;
              if (searchValue.includes(',')) {
                let values = searchValue.split(',');
                values.forEach(value => {
                  let trimmedValue = value.trim();
                  const fukuObject = {
                    type: message.type,
                    bindingMode: message.fukushashiki_search_mode,
                    bindingAddress: trimmedValue,
                    bindingValue: message.agree_term.isAgree,
                  };
                  fukuDataList.push(fukuObject);
                });
              } else {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.agree_term.isAgree,
                };
                fukuDataList.push(fukuObject);
              }
              break;
            }
          case 'slider':
            {
              const fukuObject = {
                type: message.type,
                bindingMode: message.fukushashiki_search_mode,
                bindingAddress: message.fukushashiki_search_value,
                bindingValue: message.slider.value,
              };
              fukuDataList.push(fukuObject);

              break;
            }

          case "pull_down":
            {
              if (message.pull_down?.customization.length != 0) {
                const textInDropdown = message.pull_down.customization.value || message.pull_down.initial_selection;
                if (message.pull_down.customization.is_comment == true) {

                }
                else {
                  message.pull_down.customization.options_without_comment.forEach((item) => {
                    if (!!textInDropdown && item.value == textInDropdown) {
                      const fukuObject = {
                        type: message.type,
                        bindingMode: message.fukushashiki_search_mode,
                        bindingAddress: message.fukushashiki_search_value,
                        bindingValue: item.value
                      };
                      fukuDataList.push(fukuObject);
                    }

                  })
                }
              }

              if (message.pull_down?.type == "lp_integration_option") {
                if (message.pull_down.lp_integration_option.value != "") {
                  const fukuObject = {
                    type: message.type,
                    pulldownType: message.pull_down.type,
                    bindingMode: message.pull_down.lp_element_search_mode,
                    bindingAddress: message.pull_down.lp_element_search_value,
                    bindingValue: message.pull_down.lp_integration_option.value
                  };
                  fukuDataList.push(fukuObject);
                }
              }

              if (message.pull_down?.type == MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) {
                if (message.pull_down.from_js_result.value?.toString() != "") {
                  const fukuObject = {
                    type: message.type,
                    pulldownType: message.pull_down.type,
                    bindingMode: message.pull_down.from_js_result_target_search_mode,
                    bindingAddress: message.pull_down.from_js_result_target_search_value,
                    bindingValue: message.pull_down.from_js_result.value
                  };
                  fukuDataList.push(fukuObject);
                }
              }

              const userInputData = Object.fromEntries(
                Object.entries(message.pull_down?.date_md || {}).filter(([key]) => key.includes("value"))
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
                const entries = Object.entries(message.pull_down?.[key] || {}).filter(([k]) => k.includes("value"));
                Object.assign(userInputData, Object.fromEntries(entries));
              });

              const dataInforFukushashiki = Object.fromEntries(
                Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
              );

              const types = ["day", "month", "year", "hour", "minute", "Day", "Month", "Year", "Hour", "Minute", "valueDay", "valueMonth", "valueYear", "valueHour", "valueMinute"];
              const result = types
                .filter(type => `${type}` in userInputData)
                .map(type => ({
                  type: "pull_down",
                  bindingMode: dataInforFukushashiki[`${type}_fukushashiki_search_mode`],
                  bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                  bindingValue: removeLeadingZero(userInputData[`${type}`]),
                }));
              fukuDataList.push(...result);

              break;
            }
          case 'textarea':
            {
              if (message.textarea.text_input.value != undefined) {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.textarea.text_input.value,
                };
                fukuDataList.push(fukuObject);
              }
              break;
            }
          case 'zip_code_address':
            {
              const userInputData = Object.fromEntries(
                Object.entries(message.zip_code_address).filter(([key]) => key.includes("value_"))
              );
              const dataInforFukushashiki = Object.fromEntries(
                Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
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
              const result = types
                .filter(type => type === "await" || `value_${type}` in userInputData)
                .map(type => {
                  const bindingMode = dataInforFukushashiki[`${type}_fukushashiki_search_mode`];

                  if (bindingMode === undefined && type !== "await") {
                    return null;
                  }

                  return {
                    type: message.zip_code_address.is_use_dropdown ? "dropdown_prefecture" : "zip_code_address",
                    bindingMode: bindingMode,
                    additionalType: type,
                    bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                    bindingValue: userInputData[`value_${type}`] || null
                  };
                })
                .filter(item => item !== null);
              fukuDataList.push(...result);
              break;
            }
          case 'shipping_address':
            {
              const userInputData = Object.fromEntries(
                Object.entries(message.shipping_address).filter(([key]) => key.includes("value_"))
              );
              const dataInforFukushashiki = Object.fromEntries(
                Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
              );
              const types = ["number1", "number2", "number3", "number", "name_left", "name_right", "kana_left", "kana_right", "building_name", "address", "municipality", "prefecture", "post_code", "post_code_left", "post_code_right", "initial_selection"];
              const result = types
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
                    fukuDataList.push(objA)
                  }
                  if (type == "address") {
                    const objA = {
                      type: "zip_code_address",
                      bindingMode,
                      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                      bindingValue: userInputData[`value_${type}`]
                    };
                    fukuDataList.push(objA)
                  }
                  return {
                    type: message.shipping_address.is_use_dropdown ? "dropdown_prefecture" : "shipping_address",
                    bindingMode: bindingMode,
                    bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                    bindingValue: userInputData[`value_${type}`]
                  };
                })
                .filter(item => item !== null);
              fukuDataList.push(...result);
              break;
            }

          case 'radio_button':
            {
              const initialSelection = message.radio_button.initial_selection;
              let selectedElement = message.radio_button.default.find(item => item.value === initialSelection);
              if (!selectedElement) {
                selectedElement = message.radio_button.radio_button_img.find(item => item.value === initialSelection);
              }
              if (selectedElement) {
                const value = selectedElement.value;
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.initial_selection_fukushashiki_search_mode,
                  bindingAddress: message.initial_selection_fukushashiki_search_value,
                  bindingValue: value.toString()
                };
                fukuDataList.push(fukuObject);
              }

              break;
            }
          case 'checkbox':
            {
              if (message.checkbox.checkedValue.length > 0) {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.checkedValue_fukushashiki_search_mode,
                  bindingAddress: message.checkedValue_fukushashiki_search_value,
                  bindingValue: true
                };
                fukuDataList.push(fukuObject);
              }
              else {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.checkedValue_fukushashiki_search_mode,
                  bindingAddress: message.checkedValue_fukushashiki_search_value,
                  bindingValue: false
                };
                fukuDataList.push(fukuObject);
              }
              break;
            }

          case 'card_payment_radio_button':
          case 'credit_card_payment': {
            const keysToExtract = [
              "initial_selection", "card_holder1", "card_holder2",
              "card_number1", "card_number2", "card_number3", "card_number4",
              "card_holder", "card_number",
              "year", "month", "cvc", "installment"
            ];
            const userInputData = keysToExtract.reduce((result, key) => {
              if (message[message.type]?.[key] !== undefined) {
                result[key] = message[message.type][key];
              }
              return result;
            }, {});
            const dataInforFukushashiki = Object.fromEntries(
              Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
            );
            const types = ["card_number", "card_holder1", "card_holder2",
              "card_holder", "year", "month",
              "cvc", "card_number1", "card_number2", "card_number3",
              "card_number4", "installment", "initial_selection"];
            const result = types
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
                return { type: message.type, ...fukuData };
              })
              .filter(item => item);
            fukuDataList.push(...result);
          }
          default: 
            break;
        }
      })
      return fukuDataList;
    }
  }

  const postMessageForExecuteJs = (jsCode) => {
    postMessageToParent({
      action: CHATBOT_ACTIONS.EXCUTE_JS,
      actionData: jsCode,
      is_use_js: true
    });
  }

  const postMessageForGetPreviewOrderContent = async (jsCode) => {
    postMessageToParent({
      action: CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT,
      actionData: jsCode,
      is_use_js: true,
      isOpen: true
    });

    await sleep(2000);
  }

  const fukushashikiToLP = (fukushashikiData) => {
    postMessageToParent({
      action: 'fukushashiki',
      actionData: fukushashikiData,
      isOpen: true
    });
  }

  const sendCustomJsToParent = ({ head, top_body, bottom_body } = {}) => {
    const items = [ head, top_body, bottom_body ].filter(item => !!item?.jsCode?.trim() && !!item?.position?.trim() )
      postMessageToParent({
        action: CHATBOT_ACTIONS.INJECT_CUSTOM_JS,
        actionData: items,
        isOpen: true
      });
  }

  const postMessageToParent = (options) => {
    if (!window || !window.parent) return;
    
    const defaultOptions = {
      isOpen: state.isOpen,
      source: 'ec-chatbot',
      // widthPc: state.widthPc,
      // heightPc: state.heightPc,
      // widthSp: state.widthSp,
      // heightSp: state.heightSp,
      // chatbotRight: state.rightMarginPc,
      // chatbotBottom: state.bottomMarginPc,
    };
    
    window.parent.postMessage({
      ...defaultOptions,
      ...options,
    }, state.urlReceive || '*');
  }

  const processClickCreateOrder = (data) => {
    sendUserInteractionData(
      data,
    ).then(async (res) => {
      // Process for non-Shopify
      setStateToSessionStorage(state);
      const content = data?.message?.message_content?.[0];
      if (params.get('cartSystem') !== 'shopify') {
        postMessageToParent({
          action: CHATBOT_ACTIONS.CLICK_BUTTON,
          id_value: content.button_submit_id
        });
        redirectToCartPage();
        return;
      }

      // Process for Shopify
      fukushashikiToLP(convertToFukushashikiObject(data));
      await createOrAddLinesCart(res);
      sendCreateOrderData(
        data,
        (res) => console.log(res)
      ).then(() => {
        if (params.get('cartSystem') === 'shopify') return;
        const conversion = {
          scenario_data: `${state.deviceReceive}_conversion`,
        };
        sendCountRequest(conversion)
          .then(res => {
            console.log(res);
            redirectToCartPage();
          });
      });
    });
  }

  const isLastMessageInCreateOrderFlow = () => {
    return state.currentMsgIndex === state.messagesList.length - 1;
  };

  const isBotMessage = (message) => {
    return message.belong_to === 'bot' && message.message_content.length > 0;
  }

  const isDelayBotMessage = (message) => {
    return message.belong_to === 'bot' && message.message_content[0]?.type === "delay";
  }

  const isUserMessage = (message) => {
    return message.belong_to === 'user' && message.message_content.length > 0;
  }

  const onClickNext = async (indexMessage, message) => {
    let newState = _.omit(state, ['submitErrorMessage']);
    let clickedMsgIndex = newState.messagesList.findIndex((msg) => msg?.id === message?.id);
    if (clickedMsgIndex < 0) clickedMsgIndex = newState.currentMsgIndex;
    newState.userMessagesList = newState.messagesList.filter((item) => isUserMessage(item));
    const clickedMsg = newState.messagesList[clickedMsgIndex];

    if (!handleValidateField(indexMessage)) {
      return;
    }

    newState.errors = {};

    const submitData = {
      scenario_id: state.scenarioId,
      message: clickedMsg,
      user_id: state.uuid,
      bot_type: "web"
    };
    
    const isClickedCreateOrder = state.messagesList[clickedMsgIndex]?.message_content?.[0]?.type === "button_submit";
    const isClickedLastMessage = state.messagesList.length - 1 === clickedMsgIndex;

    if (isClickedCreateOrder) {
      setStateToSessionStorage(newState);
      return processClickCreateOrder(submitData);
    }

    if (isClickedLastMessage) {
      newState.messagesList[clickedMsgIndex].disabled = false;
      return dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: newState
      });
    }

    fukushashikiToLP(convertToFukushashikiObject(submitData));

    if (clickedMsg.button_jscode && clickedMsg.jscode.length > 0) {
      postMessageForExecuteJs(clickedMsg.jscode);
    }

    if (isDislayingLoginForm(clickedMsg)) {
      // For GINZA AIRA,
      setStateToSessionStorage(newState);
      return;
    }

    if (isLoggedIn) {
      newState.messagesList.forEach(x => x.hidden = x.not_display_when_logged_in);
    }

    // Update next messages list after clicked next
    const nextMessage = newState.messagesList[clickedMsgIndex + 1];
    for (let i = 0; i < newState.messagesList.length; i++) {
      if (newState.messagesList[i].conditions?.length > 0) {
        const result = checkMessageCondition(newState.messagesList[i], newState.objParam);
        if (!result && isUserMessage(newState.messagesList[i])) {
          newState.messagesList[i].hidden = true;
          continue;
        }

        // if (newState.messagesList[i].not_display_when_have_error) {
        //   newState.messagesList[i].hidden = newState.submitErrorMessage.length > 0;
        // }
      }
    }
    if (isUserMessage(nextMessage) || isBotMessage(nextMessage)) {
      for (let i = clickedMsgIndex + 1; i < newState.messagesList.length; i++) {
        if (newState.messagesList[i].conditions.length !== 0) {
          const result = checkMessageCondition(newState.messagesList[i], newState.objParam);
          newState.messagesList[i].hidden = !result;
        }
        if (newState.messagesList[i].hidden && !stringNullOrEmpty(newState.messagesList[i].hidden)) continue;

        if (isBotMessage(newState.messagesList[i])) {
          newState = {
            ...newState,
            ...processForBotMessage(newState.messagesList, i, newState)
          };
        } else if (isUserMessage(newState.messagesList[i])) {
          newState = {
            ...newState,
            ...processForUserMessage(newState.messagesList, i, newState)
          };
        }
      }
    }

    newState.currentUserMsgIndex = newState.messagesList.findIndex((item, index) => !item.hidden && isUserMessage(item) && index > clickedMsgIndex);
    if (newState.currentUserMsgIndex === -1)
      newState.currentMsgIndex = newState.messagesList.length - 1;
    else
      newState.currentMsgIndex = newState.currentUserMsgIndex;
    
    const isBtnUpdateClick = indexMessage < newState.renderMessagesList.length - 1;

    new Promise(async (resolve) => {
      for (let i = clickedMsgIndex + 1; i <= newState.currentMsgIndex; i++) {
        newState.renderMessagesList = newState.messagesList.slice(0, i + 1);
        if (isDelayBotMessage(newState.messagesList[i])) {
          await sleep(newState.messagesList[i].message_content[0].delay.content * 1000);
          continue;
        }
        
        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
          payload: {
            startIndex: 0,
            endIndex: i + 1
          }
        });
        await sleep(100);
      }
      resolve();
    }).then(() => {
      newState.renderMessagesList = newState.renderMessagesList.map((msg) => {
        return isDelayBotMessage(msg) ? {...msg, hidden: true} : msg;
      }); 
  
      if (!isBtnUpdateClick) {
        newState.passedUserMsgCount++;
      } else {
        newState.passedUserMsgCount = newState.renderMessagesList.filter((item) => isUserMessage(item)).length - 1 ;
      }
  
      const botConfirmMessage = newState.messagesList.find(msg => {
        return !!msg.message_content?.find(x => x.text_input?.use_for_confirm_message)
      });
  
      const botConfirmJsCode = botConfirmMessage?.message_content
        ?.find(x => x.text_input?.use_for_confirm_message)
        ?.text_input?.jscode;
      const nextUserMessage = newState.messagesList[newState.currentUserMsgIndex];
      const isNextUserMessageButtonSubmit = nextUserMessage?.message_content?.[0]?.type === "button_submit";

      if (botConfirmJsCode && botConfirmJsCode.length > 0 && isNextUserMessageButtonSubmit) {
        postMessageForGetPreviewOrderContent(botConfirmJsCode);
      }
  
      setStateToSessionStorage(newState);
      return dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: newState
      });
    });
  };

  const isDislayingLoginForm = (message) => {
    const loginMessageNames = ["ログイン", "Login", "login", "LOGIN"];
    return loginMessageNames.includes(message.message_name);
  }

  function convertTextJapanese(text, targetType) {
    switch (targetType.toLowerCase()) {
      case "hiragana":
        return wanakana.toHiragana(text);
      case "katakana":
        return wanakana.toKatakana(text);
      case "romaji":
        return wanakana.toRomaji(text);
      default:
        throw new Error("Loại chuyển đổi không hợp lệ! Chọn 'hiragana', 'katakana' hoặc 'romaji'.");
    }
  }

  function containsKanji(input) {
    return [...input].some(char => wanakana.isKanji(char));
  }

  const onChangeValue = (
    indexContent,
    contentType,
    value,
    field,
    subFiled,
    name,
    message
  ) => {
    let newState = { ...state };
    const msgIndex = state.messagesList.findIndex((msg) => msg.id === message.id);
    if (newState.messagesList.length == 0) return;
    let messageContentTypeData = newState.messagesList[msgIndex].message_content[indexContent][contentType];
    if (messageContentTypeData?.isUseConvertText && contentType === "text_input") {
      const convertType = newState.messagesList[msgIndex].message_content[indexContent][contentType].convertTextTypeValue;
      const textConvertedValue = convertTextJapanese(value, convertType);
      if (textConvertedValue && !containsKanji(textConvertedValue)) {
        switch (subFiled) {
          case "valueLeft": {
            newState.messagesList[msgIndex].message_content[indexContent + 1][contentType].text.valueLeft = textConvertedValue;
            break;
          }
          case "valueRight": {
            newState.messagesList[msgIndex].message_content[indexContent + 1][contentType].text.valueRight = textConvertedValue;
            break;
          }
          case "value": {
            newState.messagesList[msgIndex].message_content[indexContent + 1][contentType].text.value = textConvertedValue;
            break;
          }
        }
      }
    }

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

    if (contentType === "zip_code_address") {
      Object.keys(value).forEach((key) => {
        messageContentTypeData[key] = value[key];
      });
    }

    if (
      contentType === "product_purchase" &&
      field === "initial_selection" &&
      value.length > 0
    ) {
      let dataContentType = {
        ...state.messagesList[msgIndex].message_content[indexContent][contentType],
      };
      
      const { arrayCode, arrayName, arrayPrice, arrayOrderQuantity } = getProductDetailsForProductPurchase(dataContentType, value);

      newState.variables.push(
        {
          variable_name: "product_code",
          default_value: arrayCode.join(","),
        },
        {
          variable_name: "product_name",
          default_value: arrayName.join(","),
        },
        {
          variable_name: "product_unit_price",
          default_value: arrayPrice.join(","),
        },
        {
          variable_name: "order_quantity",
          default_value: arrayOrderQuantity.join(","),
        }
      );
      newState.objParam = {
        ...newState.objParam,
        product_code: arrayCode.join(","),
        product_name: arrayName.join(","),
        product_unit_price: arrayPrice.join(","),
        order_quantity: arrayOrderQuantity.join(","),
      };
    } else if (
      contentType === "product_purchase_radio_button" &&
      field === "initial_selection"
    ) {
      let dataContentType = {
        ...state.messagesList[msgIndex].message_content[indexContent][
        contentType
        ],
      };

      const { valueCode, valueName, valuePrice } = getProductDetailsForProductPurchaseRadioButton(dataContentType, value);

      newState.variables.push(
        {
          variable_name: "product_code",
          default_value: valueCode,
        },
        {
          variable_name: "product_name",
          default_value: valueName,
        },
        {
          variable_name: "product_unit_price",
          default_value: valuePrice,
        }
      );
      newState.objParam = {
        ...newState.objParam,
        product_code: valueCode,
        product_name: valueName,
        product_unit_price: valuePrice,
      }
    }

    if (
      state.messagesList[msgIndex].message_content[indexContent][contentType].is_save_input_content
    ) {
      let isSaveParam = false;
      newState.variables = state.variables.map((item) => {
        let dataContentType = {
          ...state.messagesList[msgIndex].message_content[indexContent][contentType],
        };
      
        if (state.messagesList[msgIndex].message_content[indexContent][contentType].save_input_content === item.variable_name) {
          isSaveParam = true;

          // TODO: need refactor (card_payment_radio_button use only)
          // Reason: Contents render inside of each types of radio button will change saveParams like "is_display_card_payment"
          if (contentType === 'card_payment_radio_button') {
            const allowFields = ['initial_selection', 'initial_selection_picture'];
            isSaveParam = allowFields.includes(field);

            if (isSaveParam) {
              setDefaultValue(item, dataContentType, contentType, value, field);
            }
          } else {
            setDefaultValue(item, dataContentType, contentType, value, field);
          }
        }
      
        return item;
      });
      
      if (isSaveParam) {
        newState.objParam[state.messagesList[msgIndex].message_content[indexContent][contentType].save_input_content] = value;
      }
    }

    newState.messagesList = state.messagesList;
    newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
    newState.renderMessagesList = newState.renderMessagesList.map((msg) => {
      return isDelayBotMessage(msg) ? {...msg, hidden: true} : msg;
    });
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
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { currentUserMsgIndex: 0 }
      });
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
      document.getElementById("sp-withdrawal-container").style.display =
        "block";
      document.getElementById("sp-withdrawal-content").style.display = "block";
    }
  };

  const isPopUpZipCode = (isOpen, indexContent) => {
    let newState = {};

    if (indexContent !== undefined) {
      newState.zipcodeContentIndex = indexContent;
    }

    if (isOpen) {
      document.getElementById("sp-withdrawal-container").style.display = "block";
      document.getElementById("sp-popup-zip-code-address").style.display = "block";

      newState = {
        ...state,
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

    document.getElementById("sp-withdrawal-container").style.display = "none";
    document.getElementById("sp-popup-zip-code-address").style.display = "none";
  };

  const isPopUpZipCodeShippingAddress = (isOpen, indexContent) => {
    // TODO: Check to remove
    // if (isOpen === true) {
    //   setPrefectures(null);
    //   setCities(null);
    //   setTowns(null);
    //   setZipcode(null);
    //   document.getElementById("sp-withdrawal-container").style.display =
    //     "block";
    //   document.getElementById("sp-popup-zip-code-address2").style.display =
    //     "block";
    // } else {
    //   document.getElementById("sp-withdrawal-container").style.display = "none";
    //   document.getElementById("sp-popup-zip-code-address2").style.display =
    //     "none";
    // }
    // if (indexContent !== undefined) {
    //   setContentZipcode(indexContent);
    // }
  };

  const onChangeErrors = (field, value) => {
    let newErrors = { ...state.errors };
    newErrors[field] = value;
    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
      payload: {
        errors: newErrors,
      }
    });
  };

  const renderBotMessageContent = (message, indexMessage) => {
    if (!message || message.belong_to !== "bot" || !Array.isArray(message?.message_content)) return null;

    return message.message_content.map((content, index) => (
      <BotMessage
        key={indexMessage}
        content={content}
        index={index}
        botInfor={state.botInfor}
        checkoutUrl={state.checkoutUrl}
        previewOrderContent={state.previewOrderContent}
        postMessageForExecuteJs={postMessageForExecuteJs}
      />
    ));
  };

  const renderNextButton = (message, indexMessage) => {
    const firstMsgContent = message?.message_content?.[0];
    const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;
    const isAutoClick = !isDisplayBtnNext && indexMessage >= state.renderMessagesList.length - 1;

    if (!message || message.belong_to !== "user") return null;
    if (message.message_content[0]?.type === "button_submit") return null;

    let btnText = message.buttonName;
    if (!btnText) {
      btnText = indexMessage >= state.renderMessagesList.length - 1 ? "次へ" : "更新";
    }
    return (
      <div className="sp-user-message-button-action" style={{ display: isDisplayBtnNext ? "flex" : "none" }}>
        <CustomButton
          disabled={state.submitErrorMessage.length > 0 ? false : message.disabled}
          style={{
            backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
            borderRadius: "25px",
          }}
          className="ss-user-message__action-btn"
          onClick={() => {
            onClickNext(indexMessage, message)
          }}
          autoClick={isAutoClick}
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
      <div className="sp-body-user-side slideLeft">
        <div className="sp-body-user-side-messages">
          <UserMessage
            postMessageToParent={postMessageToParent}
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
            displayButtonNext={(value) => {
              // dispatch({
              //   type: PREVIEW_ACTIONS.UPDATE_DISPLAY_BUTTON_NEXT,
              //   payload: {
              //     nextButtonStatus: value,
              //     msgIndex: indexMessage
              //   }
              // });
              // // if (!state.messagesList[state.currentMsgIndex]) return;
              // // let newMessagesList = [...state.messagesList];
              // // newMessagesList[state.currentMsgIndex].is_display_button_next = value;
              // // dispatch({
              // //   type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
              // //   payload: {
              // //     messagesList: [...newMessagesList],
              // //   }
              // // });
            }}
            prefecturesList={[...state.prefecturesList]}
            isPopUpZipCode={(isOpen, indexContent) =>
              isPopUpZipCode(isOpen, indexContent)
            }
            isPopUpZipCodeShippingAddress={(isOpen, indexContent) =>
              isPopUpZipCodeShippingAddress(isOpen, indexContent)
            }
            onChangeErrors={(field, value) =>
              onChangeErrors(field, value)
            }
            variables={state.variables}
            lpOptionData={state.lpOptionData}
            submitErrorMessage={state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "" : state.submitErrorMessage}
            botId={state.botId}
          />
          {renderNextButton(message, indexMessage)}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    return state.renderMessagesList.map((message, indexMessage) => {
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
            width: "95%",
            padding: "5px",
            border: `1px solid ${borderColor}`,
            backgroundColor: backgroundColor,
            color: color,
            borderRadius: "5px",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            position: "fixed",
            top: "12.5%",
            left: "1%"
          }}
          id="error-message"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    );   
  }

  const getOpeningBotStyle = () => {
    let containerStyle = {
      position: 'fixed',
      bottom: "0px",
      right: mobileCheck() ? state.isOpen ? 0 : `${state.rightMarginSp}px` : `${state.rightMarginPc}px`,
      width: mobileCheck() ? `${state.widthSp}%` : `${state.widthPc}px`,
      height: mobileCheck() ? `${state.heightSp}%` : `${state.heightPc}px`,
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white"
    };
    let headerStyle = {
      borderTopLeftRadius: mobileCheck() ? "0px" : "5px",
      borderTopRightRadius: mobileCheck() ? "0px" : "5px",
    };
    let bodyStyle = {
      backgroundColor: state.botInfor?.opacity_color,
      flex: 1,
    };

    if (state.botInfor?.main_color || state.botInfor?.main_color_other) {
      headerStyle.backgroundColor = state.botInfor?.main_color || state.botInfor?.main_color_other;
    }

    if (!state.activePopupCloseBot) {
      containerStyle.height = mobileCheck() ? `${state.heightSp || 100}%` : `${state.heightPc || 600}px`;
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

  ///body container
  if (state.scenarioId && state.botInfor && state.isOpen) {
    const { containerStyle, headerStyle, bodyStyle } = getOpeningBotStyle();
    return (
      <div
        ref={containerRef}
        id="sp-container1"
        className={`sp-container1 ${mobileCheck() ? 'slideUpSp' : 'slideUp'}`}
        style={containerStyle}
      >
        <Withdrawal
          // botInfor={state.botInfor}
          deviceReceive={state.deviceReceive}
          scenarioId={state.scenarioId}
          onOpenPreview={onOpenPreview}
        />
        <ZipCodePopUp
          isPopUpZipCode={isPopUpZipCode}
          prefecturesList={state.prefecturesList}
          message={state.messagesList[state.currentMsgIndex]}
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
          <div className="sp-header-left" onClick={() => onOpenPreview(!state.isOpen)}>
            <div className="sp-header-left-avatar sp-avatar">
              <img
                src={
                  state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
                }
              />
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
            isMobile={mobileCheck()}
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
  } else if (!state.isOpen && mobileCheck() === false && Number(state.positionPc) === 1 && Number(state.buttonTypePc) === 2) {
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
          src={
            state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
          }
        />
      </div>
    )
  } else if (!state.isOpen && mobileCheck() === false && Number(state.positionPc) === 1 && Number(state.buttonTypePc) === 1) {
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
            <img
              src={
                state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
              }
            />
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
  } else if (!state.isOpen && mobileCheck() === false && Number(state.positionPc) === 2) {
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
            <img
              src={
                state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
              }
            />PreviewComp
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightPcTitle}</div>
          </div>
        </div>
      </div>)
  } else if (!state.isOpen && mobileCheck() === true && Number(state.positionSp) === 1 && Number(state.buttonTypeSp) === 2) {
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
          src={
            state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
          }
        />
      </div>
    )
  } else if (!state.isOpen && mobileCheck() === true && Number(state.positionSp) === 1 && Number(state.buttonTypeSp) === 1) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: '240px',
          height: "48px",
          borderRadius: '35px',
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          bottom: state.bottomMarginSp ? `${state.bottomMarginSp}px` : '10px',
          right: state.rightMarginSp ? `${state.rightMarginSp}px` : '10px'
        }}
      >
        <div className="sp-header-left" onClick={() => onOpenPreview(!state.isOpen)} style={{ width: '100%', padding: '4px' }}>
          <div className="sp-header-left-avatar sp-avatar" style={{ width: '38px' }}>
            <img
              src={
                state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
              }
              alt="bot-avatar"
            />
          </div>
          <div>
            <div id="comment_bubble" className="sp-bubble">
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{state.botInfor.title}</span>
            </div>
          </div>
          <div className="sp-header-right-arrow" style={{ marginLeft: 'auto' }}>
            <MDBIcon fas icon="chevron-circle-up" />
          </div>
        </div>
      </div>
    )
  } else if (!state.isOpen && mobileCheck() === true && Number(state.positionSp) === 2) {
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
              src={
                state.botInfor?.icon?.url && EC_CHATBOT_URL + "" + state.botInfor?.icon?.url
              }
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
