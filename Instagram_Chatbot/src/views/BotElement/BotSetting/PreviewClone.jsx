import React, { useEffect, useState, useRef, useReducer } from "react";
import "../../../assets/css/bot/preview-chat-bot.css";
import api from "../../../api/api-management";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import SelectCustom from "./ScenarioSetting/scenarioComon/SelectCustom";
import { Button } from "reactstrap";
import ModalPreviewBot from '../../../views/Popup/ModalPreviewBot';
import CustomButton from "./CustomButton";
import { UserMessage, BotMessage } from "./PreviewComponent";
import {
  Row,
  Col
} from "antd";
import moment from "moment";
import $, { } from "jquery";
import { tokenExpired } from "api/tokenExpired";
import { EC_CHATBOT_URL } from "../../../variables/constants";
import "moment/locale/zh-cn";
import iconMessageBlue from "../../../assets/img/icon-mess/icon-message-chat-blue.png";
import iconMessageGreen from "../../../assets/img/icon-mess/icon-message-chat-green.png";
import iconMessageOrange from "../../../assets/img/icon-mess/icon-message-chat-orange.png";
import iconMessageYellow from "../../../assets/img/icon-mess/icon-message-chat-yellow.png";
import iconMessagePink from "../../../assets/img/icon-mess/icon-message-chat-pink.png";
import iconMessagePurple from "../../../assets/img/icon-mess/icon-message-chat-purple.png";
import iconMessageBlack from "../../../assets/img/icon-mess/icon-message-chat-black.png";
import iconMessageWhite from "../../../assets/img/icon-mess/icon-message-chat-white.png";
import { SCAN_REGEX } from "./PreviewComponent/Constants";
import { getAllUrlParams, lightenColor, mobileCheck, removeLeadingZero, sendConversionCountRequest, sendCreateOrderData, sendUserInteractionData } from "./PreviewComponent/Utils";
import Withdrawal from "./PreviewComponent/Withdrawal";
import ProcessBar from "./PreviewComponent/ProcessBar";
import ZipCodePopUp from "./PreviewComponent/ZipCodePopUp";

sessionStorage.setItem("prevOpenStatus", "0");
let previewOrderInfor = {};
let isDisplayOrderPreview = false;
let previewContent = ``
let globalLpOptionData = {};

var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn');

const previewInitialState = {
  isOpen: false,
  urlSend: "",
  urlReceive: "",
  deviceReceive: "",
  uuid: params.get("uuid"),
  botId: Cookies.get("bot_id"),
  scenarioId: params.get("scenario_id"),
  botInfor: {},
  dataMessages: [],
  urlThanksPage: "",
  indexMessageRender: 0,
  renderMessageArr: [],
  indexUser: 0,
  messageUser: [],
  errors: {},
  variables: [],
  isDisplayButtonNext: false,
  captcha: [],
  withdrawal: {},
  dataVariables: [],
  dataPrefectures: [],
  dataCities: [],
  dataTowns: [],
  prefectures: "",
  cities: "",
  towns: "",
  zipcode: "",
  indexContentZipcode: "",
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
  }
};

const PREVIEW_ACTIONS = {
  UPDATE_MULTI_STATE: "UPDATE_MULTI_STATE",
};

const PreviewReducer = (state, action) => {
  switch (action.type) {
    case PREVIEW_ACTIONS.UPDATE_MULTI_STATE:
      return { ...state, ...(action.payload) };
  }

  return state;
}

const Preview = () => {
  const [state, dispatch] = useReducer(PreviewReducer, previewInitialState);
  const containerRef = useRef(null);
  const [variables, setVariables] = useState([]);
  const [captcha, setCaptcha] = useState([]);
  const [withdrawal, setWithdrawal] = useState({});
  const [dataVariables, setDataVariables] = useState([]);
  const isFromScenario = false;
  const [dataPrefectures, setDataPrefectures] = useState([]);
  const [dataCities, setDataCities] = useState([]);
  const [dataTowns, setDataTowns] = useState([]);
  const [prefectures, setPrefectures] = useState();
  const [cities, setCities] = useState();
  const [towns, setTowns] = useState();
  const [zipcode, setZipcode] = useState();
  const [indexContentZipcode, setContentZipcode] = useState();
  //new
  const [buttonTypePc, setButtonTypePc] = useState("1");
  const [positionPc, setPositionPc] = useState("1");
  const [widthPc, setWidthPc] = useState(450);
  const [heightPc, setHeightPc] = useState(700);
  const [widthSp, setWidthSp] = useState(100);
  const [heightSp, setHeightSp] = useState(100);
  const [rightPcTitle, setRightPcTitle] = useState("");
  const [positionSp, setPositionSp] = useState("1");
  const [buttonTypeSp, setButtonTypeSp] = useState("1");
  const [rightMarginPc, setRightMarginPc] = useState(10);
  const [bottomMarginPc, setBottomMarginPc] = useState(10);
  const [displayType, setDisplayType] = useState(1);
  const [rightSpTitle, setRightSpTitle] = useState("");
  const [rightMarginSp, setRightMarginSp] = useState(10);
  const [bottomMarginSp, setBottomMarginSp] = useState(10);
  const [showPopupCloseBot, setShowPopupCloseBot] = useState(false);
  const [activePopupCloseBot, setActivePopupCloseBot] = useState(true);
  const [titleBubble, setTitleBubble] = useState("");
  const [styleModal, setStyleModal] = useState({});
  const [scenarioUserResponses, setScenarioUserResponses] = useState([])
  const [checkoutUrl, setCheckoutUrl] = useState("")

  const [objParam, setObjParam] = useState(() => {
    let dataObj = {
      current_url: window.location.href,
      current_url_param: getAllUrlParams(window.location.href),
      current_url_title: document.title,
      user_id: Cookies.get("user_id"),
      bot_id: Cookies.get("bot_id"),
    };
    $.getJSON("https://api.ipregistry.co/?key=tryout", function (data) {
      dataObj.user_ip_address = data.ip;
      dataObj.user_country = data.location.country.name;
      dataObj.user_city = data.location.city;
      dataObj.user_device = data.user_agent.device.type;
      dataObj.user_browser = data.user_agent.name;
      dataObj.user_agent = data.user_agent.header;
      dataObj.start_datetime = new Date();
    });
    return dataObj;
  });

  function handleStyleModal() {
    if (mobileCheck()) {
      return {
        bottom: "0px",
        right: "0px",
        width: widthSp ? `${widthSp}%` : "100%%",
        height: heightSp ? `${heightSp}%` : "100%"
      }
    } else {
      return {
        bottom: bottomMarginPc ? `${bottomMarginPc}px` : "0px",
        right: rightMarginPc ? `${rightMarginPc}px` : "30px",
        width: widthPc ? `${widthPc}px` : "450px",
        height: heightPc ? `${heightPc}px` : "700px"
      }
    }
  }

  const updateVariableValues = (variables, dataMessages, index, action = "") => {
    if (variables.length === 0) return variables;
  
    const messageContent = dataMessages[index]?.message_content[0];
    const dataVarExist = messageContent[messageContent.type].variables;
  
    variables.forEach((variable) => {
      dataVarExist.forEach((dataVar) => {
        if (variable.variable_name === dataVar.key) {
          variable.default_value = action !== "clear_variable" ? dataVar.value : "";
        }
      });
    });
  
    return [...variables];
  }

  //get chat bot setting
  useEffect(() => {
    console.log("useEffect getBotSetting: " + params.get("bot_id"));
    if (!state.botId && params.get("bot_id")) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { botId: params.get("bot_id") } });
      return;
    }
    api.get(`/api/v1/managements/chatbots/${state.botId}`).then((response) => {
      if (response.data.data) {
        const result = JSON.parse(response.data.data?.design_settings);
        const newStateAttributes = {
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
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: newStateAttributes });
      }
    });
  }, [state.botId]);

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data === 'openPreview' && state.isOpen !== true) {
          onOpenPreview(true)
        }
        if (event.data.text != undefined && event.data.text.trim().length > 0) {
          dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { submitErrorMessage: event.data.text } });
          return;
        }

        if (event.data && event.data.objectSend) {
          previewOrderInfor = event.data.objectSend;
          previewContent = event.data.objectSend;
          isDisplayOrderPreview = true;
        }

        if (event.data && event.data.crawJsonObject) {
          let receiveOptionData = {};
          receiveOptionData[event.data.crawJsonObject.options.search_value] = event.data.crawJsonObject.dates;
          const newLpOptionData = Object.assign({}, globalLpOptionData, receiveOptionData);
          globalLpOptionData = newLpOptionData;
          dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { lpOptionData: newLpOptionData } });
          return;
        }
      },
      false,
    );
  }, [])


  useEffect(() => {
    if (mobileCheck()) {
      document.body.classList.add('is_mobile');
    }
  }, [])

  useEffect(() => {
    if (window && window.parent) {
      window.parent.postMessage({
        isOpen: state.isOpen,
        widthPc: widthPc,
        heightPc: heightPc,
        widthSp: widthSp,
        heightSp: heightSp,
        chatbotRight: rightMarginPc,
        chatbotBottom: bottomMarginPc,
      }, state.urlReceive);
    }
  }, [state.isOpen, state.urlReceive])


  function handleCloseBot() {
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

  const checkMessageCondition = (message, buildParam) => {
    if (message.conditions.length === 0) return true;

    let checked = false;
    for (let j = 0; j < message.conditions.length; j++) {
      let conditionItem = message.conditions[j];
      if (j === 0) {
        if (conditionItem.condition === "include") {
          checked = buildParam[
            conditionItem.nameCondition
          ].includes(conditionItem.inputCondition);
        } else if (conditionItem.condition === "is") {
          checked =
            buildParam[conditionItem.nameCondition] ==
            conditionItem.inputCondition;
        } else if (conditionItem.condition === "not_include") {
          checked = !buildParam[
            conditionItem.nameCondition
          ].includes(conditionItem.inputCondition);
        } else if (conditionItem.condition === "is_not") {
          checked =
            buildParam[conditionItem.nameCondition] !=
            conditionItem.inputCondition;
        }
      } else if (conditionItem?.linkCondition === "and") {
        if (conditionItem.condition === "include") {
          checked =
            checked &&
            buildParam[conditionItem.nameCondition].includes(
              conditionItem.inputCondition
            );
        } else if (conditionItem.condition === "is") {
          checked =
            checked &&
            buildParam[conditionItem.nameCondition] ==
            conditionItem.inputCondition;
        } else if (conditionItem.condition === "not_include") {
          checked =
            checked &&
            !buildParam[conditionItem.nameCondition].includes(
              conditionItem.inputCondition
            );
        } else if (conditionItem.condition === "is_not") {
          checked =
            checked &&
            buildParam[conditionItem.nameCondition] !=
            conditionItem.inputCondition;
        }
      } else if (conditionItem?.linkCondition === "or") {
        if (conditionItem.condition === "include") {
          checked =
            checked ||
            buildParam[conditionItem.nameCondition].includes(
              conditionItem.inputCondition
            );
        } else if (conditionItem.condition === "is") {
          checked =
            checked ||
            buildParam[conditionItem.nameCondition] ==
            conditionItem.inputCondition;
        } else if (conditionItem.condition === "not_include") {
          checked =
            checked ||
            !buildParam[conditionItem.nameCondition].includes(
              conditionItem.inputCondition
            );
        } else if (conditionItem.condition === "is_not") {
          checked =
            checked ||
            buildParam[conditionItem.nameCondition] !=
            conditionItem.inputCondition;
        }
      }
    }

    return checked;
  }

  function onOpenPreview(opening) {
    const receiveDeviceParam = params.get("deviceReceive");
    if (state.isOpen && activePopupCloseBot) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { showPopupCloseBot: true } });
      return;
    }

    if (state.isOpen && !activePopupCloseBot) {
      const element = document.getElementById('sp-container1');
      if (mobileCheck()) {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { isOpen: !state.isOpen } });
      } else {
        element.classList.remove('slideUp');
        element.classList.add('slideDown');
        setTimeout(() => {
          dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { isOpen: !state.isOpen } });
        }, 680)
      }
    } else {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { isOpen: !state.isOpen } });
    }
    const prevOpenStatus = sessionStorage.getItem("prevOpenStatus");
    if (prevOpenStatus == "0" && opening) {
      sessionStorage.setItem("prevOpenStatus", "1");
      const openChatbotCountApiParams = {
        scenario_data: `${receiveDeviceParam}_open_chatbot_window`,
      };
      const apiUrl = `/api/v1/analytics/scenario_counts/${state.scenarioId}`;
      api.patch(apiUrl, openChatbotCountApiParams)
        .catch(err => {
          console.log(err)
        })
    }

    if (document.getElementById("sp-container1")) {
      if (state.isOpen && activePopupCloseBot) {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { showPopupCloseBot: true } });
        return;
      }
      if (state.isOpen && !state.activePopupCloseBot) {
        Cookies.set("openPre", true);
        if (window && window.parent) {
          window.parent.postMessage({
            isOpen: true,
            widthPc: widthPc,
            heightPc: heightPc,
            widthSp: widthSp,
            heightSp: heightSp,
            chatbotRight: rightMarginPc,
            chatbotBottom: bottomMarginPc,
          }, state.urlReceive);
        }
        document.getElementById("sp-container1").style.height = heightPc
          ? `${heightPc}px`
          : "600px";
        document.getElementById("sp-header").style.position = "static";
        document.getElementById("sp-header").style.borderBottomLeftRadius =
          "0px";
        document.getElementById("sp-header").style.borderBottomRightRadius =
          "0px";
        document.getElementById("sp-header").style.borderTopLeftRadius = mobileCheck() ? "0px" : "5px";
        document.getElementById("sp-header").style.borderTopRightRadius = mobileCheck() ? "0px" : "5px";

        document.getElementById("sp-process-bar").style.display = "block";
        document.getElementById("sp-process-bar").style.marginTop = "1px";

        document.getElementById("sp-body").style.display = "block";
      }
    }
  }

  function createObjParamObject(dataMessage) {
    let result = {};
    let contents = dataMessage.message_content;

    contents.forEach((content) => {
      switch (content.type) {
        case "pull_down":
          if (content.pull_down.is_save_input_content) {
            if (content.pull_down.type === "customization") {
              const variableName = content.pull_down.save_input_content;
              const variableValue = content.pull_down.customization.value;
              result[variableName] = variableValue;
            }
          }
          break;
      }
    });

    return result;
  }

  const setPulldownValue = (field, dataContentType) => {
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

  function setDefaultValue(item, dataContentType, contentType, value, field) {
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
        item.default_value = setPulldownValue(field, dataContentType);
        break;
      case "carousel":
        item.default_value = setCarouselDefaultValue(dataContentType, value);
        break;
      case "text_input":
        if (field === 'text' && dataContentType[field].isSplitInput) {
          item.default_value = setTextInputDefaultValue(dataContentType, field);
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

  const redirectToThanksPage = () => {
    if (!state.urlThanksPage) return;
    setTimeout(() => {
      window.parent.location.href = state.urlThanksPage;
    }, 2000);
  }

  useEffect(() => {
    api
      .get(`/api/v1/prefectures`)
      .then((res) => {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { dataPrefectures: res.data.data } });
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  const buildObjParamFromDataMessage = (messsages) => {
    let result = {
      current_url: window.location.href,
      current_url_param: getAllUrlParams(window.location.href),
      current_url_title: document.title,
      user_id: Cookies.get("user_id"),
      bot_id: Cookies.get("bot_id"),
    };

    if (!result.user_agent) {
      // $.getJSON("https://api.ipregistry.co/?key=tryout", function (data) {
      //   result.user_ip_address = data.ip;
      //   result.user_country = data.location.country.name;
      //   result.user_city = data.location.city;
      //   result.user_device = data.user_agent.device.type;
      //   result.user_browser = data.user_agent.name;
      //   result.user_agent = data.user_agent.header;
      //   result.start_datetime = new Date();
      // });
    }

    messsages.forEach(message => {
      const builtParam = createObjParamObject(message);
      result = { ...result, ...builtParam };
    });

    return result;
  }

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
      // opacity_color = lightenColor(res.data.chatbot.main_color_other, 0.1);
      opacity_color = lightenColor(res.data.chatbot.main_color_other, 0.1);
      message_color = res.data.chatbot.main_color_other;
      font_color = "#fff";
    }

    return {
      opacity_color,
      message_color,
      font_color,
      icon_mess,
      main_color: res.data.chatbot.main_color
    };
  }

  useEffect(() => {
    let delayRender;
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

    api
      .get(
        `/api/v1/managements/chatbots/${state.botId}/scenarios/${state.scenarioId}/preview`
      )
      .then(async (res) => {
        if (!res || !res.data || res.data.code !== 1) return;
        let newState = {
          botInfor: getBotInforFromPreviewResponse(res)
        };

        const messagesList = res.data.data.conversation.messages || [];
        const btnSubmitItem = messagesList.find(x => x.message_content.find(y => y.type == "button_submit"));

        if (btnSubmitItem) {
          const btnSubmitItemContent = btnSubmitItem.message_content[0];
          const errorObject = {
            isDisplay: btnSubmitItemContent.button_submit.is_display_error_message,
            seachMode: btnSubmitItemContent.error_message_display_element_search_type,
            searchValue: btnSubmitItemContent.error_message_display_element_search_value,
          };
          window.parent.postMessage(
            {
              isOpen: true,
              widthPc: widthPc,
              heightPc: heightPc,
              widthSp: widthSp,
              heightSp: heightSp,
              chatbotRight: rightMarginPc,
              chatbotBottom: bottomMarginPc,
              fukushashikiResponse: undefined,
              getErrorMessage: errorObject,
            },
            '*'
          );
          newState.isDisplayErrorMessage = btnSubmitItemContent.button_submit.is_display_error_message;
        }

        if (res.data.design_settings.display_type == 1 && prevOpenStatus == "0") {
          sessionStorage.setItem("prevOpenStatus", "1");
          const openChatbotCountApiParams = {
            scenario_data: `${receiveDeviceParam}_open_chatbot_window`,
          };
          const apiUrl = `/api/v1/analytics/scenario_counts/${state.scenarioId}`;
          api.patch(apiUrl, openChatbotCountApiParams)
            .catch(err => {
              console.log(err)
            });
        }
        let messageArr = [];
        if (res.data.data?.conversation?.messages?.length > 0) {
          messageArr = [...res.data.data?.conversation?.messages.filter(x => !x.hidden)];
          if (isLoggedIn === "true") {
            messageArr = messageArr.filter(x => !x.not_display_when_logged_in);
          }
        }

        let urlThanks = res.data.data?.conversation?.urlThanksPage || "";
        let variablesAll = res.data?.all_variables || [];
        newState.dataVariables = variablesAll;
        newState.dataMessages = messageArr;
        newState.urlThanksPage = urlThanks;

        checkUpdateMessagesSessionStorage(res.data.data.updated_at)

        if (res.data.variables) {
          newState.variables = [...res.data.variables, ...variablesAll];
          res.data.variables.forEach((item) => {
            objParam[item.variable_name] = item.default_value;
          });
        }

        newState.objParam = { ...objParam };
        let variables = [...res.data.variables];
        let messageUserVar = messageArr.filter(
          (item) =>
            item.belong_to === "user" && item.message_content.length > 0
        );
        newState.messageUser = messageUserVar;
        let renderMessage = [];
        let index;
        let isPauseScroll = false;
        for (let i = 0; i < messageArr.length; i++) {
          if (messageArr[i].hidden !== true) {
            if (messageArr[i].conditions?.length > 0) {
              const checked = checkMessageCondition(messageArr[i], objParam);

              if (!checked && messageArr[i].belong_to === "user") {
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: { indexUser: state.indexUser + 1 }
                });
                continue;
              }
            }
            if (
              messageArr[0].belong_to === "bot" &&
              messageArr[i].message_content.length > 0
            ) {
              if (messageArr[i]?.message_content[0]?.type === "delay") {
                if (messageArr[i]?.message_content[0]?.delay.typing_on) {
                  await new Promise((resolve) => {
                    renderMessage.push({ ...messageArr[i] });
                    dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { renderMessageArr: [...renderMessage] } });
                    resolve();
                  })
                    .then(async () => {
                      await new Promise((resolve) => {
                        delayRender = setTimeout(() => {
                          resolve();
                        }, messageArr[i]?.message_content[0].delay.content * 1000);
                      });
                    })
                    .then(() => {
                      renderMessage.pop();
                      renderMessage.push({});
                      dispatch({
                        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
                          renderMessageArr: [...renderMessage],
                          indexMessageRender: i,
                        }
                      });
                    })
                    .then(() => {
                      if (messageArr.length - 1 === i && state.urlThanks) {
                        let aTag = document.createElement("a");
                        aTag.href = state.urlThanks;
                        aTag.target = "_blank";

                        setTimeout(() => {
                          aTag.click();
                        }, 2000);
                      }
                    });
                } else {
                  await new Promise((resolve) => {
                    return (delayRender = setTimeout(() => {
                      resolve();
                    }, messageArr[i]?.message_content[0]?.delay?.content * 1000));
                  })
                    .then(() => {
                      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { indexMessageRender: i } });
                    })
                    .then(() => {
                      if (messageArr.length - 1 === i && state.urlThanks) {
                        let aTag = document.createElement("a");
                        aTag.href = state.urlThanks;
                        aTag.target = "_blank";

                        setTimeout(() => {
                          aTag.click();
                        }, 2000);
                      }
                    });
                }
                index = i;
              } else if (
                messageArr[i]?.message_content[0]?.type === "email"
              ) {
                let emailId =
                  messageArr[i]?.message_content[0][
                    messageArr[i]?.message_content[0].type
                  ].contentId;
                let variablesData = {};
                variablesAll.forEach((item) => {
                  variablesData[item.variable_name] = item.default_value;
                });

                variables.forEach((item) => {
                  variablesData[item.variable_name] = item.default_value;
                });

                let data = {
                  variables: variablesData,
                };

                api
                  .post(
                    `/api/v1/managements/emails/${emailId}/send_email`,
                    data
                  )
                  .then(() => { })
                  .catch((error) => {
                    console.log(error);
                    if (error.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
                renderMessage.push({});
                index = i;
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
                    renderMessageArr: [...renderMessage],
                    indexMessageRender: i,
                  }
                });

              } else if (
                messageArr[i]?.message_content[0]?.type === "variable_set"
              ) {
                if (variables.length !== 0) {
                  let dataVarExist =
                    messageArr[i]?.message_content[0][
                      messageArr[i]?.message_content[0].type
                    ].variables;
                  variables.forEach((item) => {
                    for (let z = 0; z < dataVarExist.length; z++) {
                      if (item.variable_name === dataVarExist[z].key) {
                        item.default_value = dataVarExist[z].value;
                      }
                    }
                  });
                  newState.variables = [...variables];
                }
                renderMessage.push({});
                newState.renderMessageArr = [...renderMessage];
                newState.indexMessageRender = i;
                index = i;
              } else if (
                messageArr[i]?.message_content[0]?.type === "clear_variable"
              ) {
                if (variables.length !== 0) {
                  let dataVarExist =
                    messageArr[i]?.message_content[0][
                      messageArr[i]?.message_content[0].type
                    ].variables;
                  variables.forEach((item) => {
                    for (let z = 0; z < dataVarExist.length; z++) {
                      if (item.variable_name === dataVarExist[z]) {
                        item.default_value = "";
                      }
                    }
                  });
                  newState.variables = [...variables];
                }
                renderMessage.push({});
                newState.renderMessageArr = [...renderMessage];
                newState.indexMessageRender = i;
                index = i;
              } else if (
                messageArr[i]?.message_content[0]?.type === "pause"
              ) {
                renderMessage.push({});
                newState.renderMessageArr = [...renderMessage];
                newState.indexMessageRender = i;
                index = i;
                break;
              } else if (messageArr[i].belong_to !== "bot") {
                await new Promise((resolve) => {
                  return (delayRender = setTimeout(() => {
                    for (
                      let j = 0;
                      j < messageArr[i].message_content.length;
                      j++
                    ) {
                      if (
                        messageArr[i].message_content[j].type === "capture"
                      ) {
                        api
                          .get(
                            `https://svg-captcha-nodejs.vercel.app/captcha?size=${messageArr[i].message_content[j][
                              messageArr[i].message_content[j].type
                            ].length
                            }${messageArr[i].message_content[j][
                              messageArr[i].message_content[j].type
                            ].colour
                              ? "&color=true"
                              : ""
                            }&charPreset=${messageArr[i].message_content[j][
                              messageArr[i].message_content[j].type
                            ].type
                            }`
                          )
                          .then((res) => {
                            captcha.push({
                              index: i,
                              indexContent: j,
                              ...res.data,
                            });
                            setCaptcha([...captcha]);
                          })
                          .catch((error) => {
                            console.log(error);
                            if (error.response?.data.code === 0) {
                              tokenExpired();
                            }
                          });
                        // break;
                      }
                    }
                    resolve({ ...messageArr[i] });
                  }, 1000));
                })
                  .then((data) => {
                    renderMessage.push(data);
                    dispatch({
                      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
                        renderMessageArr: [...renderMessage],
                        indexMessageRender: i,
                      }
                    });
                    if (isPauseScroll === false) {
                      scrollToBottom();
                    }
                  })
                  .then(() => {
                    // document.getElementById(`sp-body-user-side-${i}`).style.animation = 'moveRight 2s linear';
                  })
                  .catch((error) => {
                    console.log(error);
                    if (error.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
                index = i;
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: { indexUser: state.indexUser + 1 }
                });
                
                break;
              } else {
                await new Promise((resolve) => {
                  return (delayRender = setTimeout(() => {
                    if (
                      messageArr[i].message_content[0]?.type ===
                      "text_input" &&
                      messageArr[i].message_content[0].text_input.content
                    ) {
                      messageArr[i].message_content[0].text_input.content =
                        messageArr[
                          i
                        ].message_content[0].text_input.content.replaceAll(
                          SCAN_REGEX,
                          (text, variable) => {
                            if (variables.length !== 0) {
                              let valueVar = "";
                              for (let j = 0; j < variables.length; j++) {
                                if (
                                  variables[j].variable_name === variable
                                ) {
                                  valueVar = variables[j].default_value;
                                }
                              }
                              return valueVar;
                            } else {
                              return "";
                            }
                          }
                        );
                    }
                    resolve({ ...messageArr[i] });
                  }, 1000));
                })
                  .then((data) => {
                    renderMessage.push(data);
                    dispatch({
                      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
                        renderMessageArr: [...renderMessage],
                        indexMessageRender: i,
                      }
                    });
                    if (isPauseScroll === false) {
                      scrollToBottom();
                    }
                    if (
                      data.message_content[0]?.type !== "delay" &&
                      data.message_content[0][data.message_content[0]?.type]
                        .scroll_auto === true
                    ) {
                      isPauseScroll = true;
                    }
                  })
                  .then(() => {
                    if (messageArr.length - 1 === i && urlThanks) {
                      let aTag = document.createElement("a");
                      aTag.href = urlThanks;
                      aTag.target = "_blank";

                      setTimeout(() => {
                        aTag.click();
                      }, 2000);
                    }
                  });
                index = i;
              }
            } else if (
              messageArr[0].belong_to === "user" &&
              messageArr[i].message_content.length > 0
            ) {
              // if (messageArr[i].belong_to !== 'user') {
              //   await new Promise((resolve) => {
              //     return delayRender = setTimeout(() => {
              //       if (messageArr[i].message_content[0]?.type === 'text_input') {
              //         messageArr[i].message_content[0].text_input.content = messageArr[i].message_content[0].text_input.content.replaceAll(SCAN_REGEX, (text, variable) => {
              //           for (let j = 0; j < variables.length; j++) {
              //             if (variables[j].variable_name === variable) {
              //               return variables[j].default_value;
              //             }
              //           }
              //         });
              //       }
              //       resolve({ ...messageArr[i] });
              //     }, 1000);
              //   }).then(data => {
              //     renderMessage.push(data);
              //     setRenderMessageArr([
              //       ...renderMessage
              //     ]);
              //     setIndexMessageRender(i);
              //     if (isPauseScroll === false) {
              //       scrollToBottom();
              //     }
              //     if (data.message_content[0]?.type !== 'delay' && data.message_content[0][data.message_content[0]?.type].scroll_auto === true) {
              //       isPauseScroll = true;
              //     }
              //   })
              //   index = i;
              // } else {
              await new Promise((resolve) => {
                return (delayRender = setTimeout(() => {
                  for (
                    let j = 0;
                    j < messageArr[i].message_content.length;
                    j++
                  ) {
                    if (
                      messageArr[i].message_content[j].type === "capture"
                    ) {
                      api
                        .get(
                          `https://svg-captcha-nodejs.vercel.app/captcha?size=${messageArr[i].message_content[j][
                            messageArr[i].message_content[j].type
                          ].length
                          }${messageArr[i].message_content[j][
                            messageArr[i].message_content[j].type
                          ].colour
                            ? "&color=true"
                            : ""
                          }&charPreset=${messageArr[i].message_content[j][
                            messageArr[i].message_content[j].type
                          ].type
                          }`
                        )
                        .then((res) => {
                          captcha.push({
                            index: i,
                            indexContent: j,
                            ...res.data,
                          });
                          setCaptcha([...captcha]);
                        })
                        .catch((error) => {
                          console.log(error);
                          if (error.response?.data.code === 0) {
                            tokenExpired();
                          }
                        });
                    }
                  }
                  resolve({ ...messageArr[i] });
                }, 1000));
              }).then((data) => {
                renderMessage.push(data);
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
                    renderMessageArr: [...renderMessage],
                    indexMessageRender: i,
                  }
                });
                if (isPauseScroll === false) {
                  scrollToBottom();
                }
              });
              index = i;
              dispatch({
                type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                payload: { indexUser: state.indexUser + 1 }
              });
              break;
            }
          }
        }

        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: newState });
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
        console.error(error);
      });

    return () => {
      clearTimeout(delayRender);
    };
  }, [state.botId, state.urlSend, state.urlReceive, state.deviceReceive, state.scenarioId]);

  useEffect(() => {
    try {
      if (state.isDisplayErrorMessage == true && state.submitErrorMessage.trim().length > 0) {
        const dataMessageInLocalStorage = getMessagesSessionStorage() || [];
        if (dataMessageInLocalStorage.length > 0) {
          const builtObjParam = buildObjParamFromDataMessage(dataMessageInLocalStorage);
          let filteredMessages = dataMessageInLocalStorage.filter(x => {
            return x.hidden !== true && (isLoggedIn && !x.not_display_when_logged_in) &&
              checkMessageCondition(x, builtObjParam);
          });
          // I want to remove all dupplicate data of filedredMessage by id then sort them
          filteredMessages = filteredMessages.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
            .sort((a, b) => a.id - b.id);
          const userMessages = filteredMessages.filter(x => x.belong_to === 'user');

          setTimeout(() => {
            const buttons = document.querySelectorAll('button.ss-user-message__action-btn.btn.btn-secondary');
            if (buttons.length > 0) {
              const lastButton = buttons[buttons.length - 1];
              lastButton.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
              }));
            }
          }, 8000);
          setTimeout(() => {
            userMessages.forEach(data => {
              window.parent.postMessage({
                isOpen: true,
                widthPc: widthPc,
                heightPc: heightPc,
                widthSp: widthSp,
                heightSp: heightSp,
                chatbotRight: rightMarginPc,
                chatbotBottom: bottomMarginPc,
                fukushashikiResponse: getObjectFukushashiki({ message: data })
              }, '*');
            });
          }, 1000);

          const payload = {
            isOpen: true,
            objParam: builtObjParam,
            renderMessageArr: filteredMessages,
            indexMessageRender: filteredMessages.length - 1,
            messageUser: userMessages,
            indexUser: userMessages.length,
          };
          dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: payload });
        }
      }
    }
    catch (ex) {
      console.error(ex);
    }
    scrollToBottom();
  }, [state.submitErrorMessage, state.isDisplayErrorMessage]);

  // useEffect(() => {
  //   return () => {
  //     setIsContinuePromise(false);
  //   }
  // }, [])

  const scrollToBottom = () => {
    if (document.getElementById("sp-body")) {
      document.getElementById("sp-body").scrollTo({
        top: document.getElementById("sp-body").scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleValidateField = (index) => {
    let contentArr = [...state.renderMessageArr[index].message_content];
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
          //  else if (contentType.type === 'password_confirmation' &&
          //   (contentType[contentType.type].value.length < limitFrom
          //     || contentType[contentType.type].value.length > limitTo
          //     || contentType[contentType.type].valueConfirm.length < limitFrom
          //     || contentType[contentType.type].valueConfirm.length > limitTo)) {
          //   errorsMess[`message${index}_content${i}_${contentArr[i].type}_${contentType.type}`] = `${limitFrom}文字以上${limitTo}文字以下にしてください。`;
          //   isValid = false;
          // }
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
            captcha
              .filter(
                (item) =>
                  item.index === index && item.indexContent === i
              )?.[0]
              ?.text.toLowerCase() !== contentType.value.toLowerCase()
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
              stringNullOrEmpty(contentType.value_prefecture)
            ) {
              isValidZipCode = false;
            }
            if (
              contentType.municipality !== undefined &&
              stringNullOrEmpty(contentType.value_municipality)
            ) {
              isValidZipCode = false;
            }
            if (
              contentType.address !== undefined &&
              stringNullOrEmpty(contentType.value_address)
            ) {
              isValidZipCode = false;
            }
            if (
              contentType.address !== undefined &&
              stringNullOrEmpty(contentType.value_building_name)
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
              contentType.address !== undefined &&
              stringNullOrEmpty(contentType.value_address)
            ) {
              isValidShippingAddress = false;
            }
            if (
              contentType.address !== undefined &&
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
    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
      payload: {
        errors: errorsMess,
      },
    });
    return isValid;
  };

  const setMessagesSessionStorage = (data) => {
    const temp = getMessagesSessionStorage()
    const bot_id = objParam.bot_id || Number(objParam?.current_url_param?.bot_id)
    sessionStorage.setItem(`messages_bot_${bot_id}`, JSON.stringify(state.dataMessages.map(x => {
      if (x.id === data.id) {
        return { ...data }
      }
      return temp && temp.find(o => o.id === x.id) ? temp.find(o => o.id === x.id) : { ...x }
    })))
  }

  const getMessagesSessionStorage = () => {
    const bot_id = objParam.bot_id || Number(objParam?.current_url_param?.bot_id)
    const data = sessionStorage.getItem(`messages_bot_${bot_id}`)
    if (!data) return null;
    return JSON.parse(data)
  }

  const checkUpdateMessagesSessionStorage = (updated_at) => {
    const temp = sessionStorage.getItem("bot_update_at")
    const bot_id = objParam.bot_id || Number(objParam?.current_url_param?.bot_id)
    if (temp !== updated_at) {
      sessionStorage.removeItem(`messages_bot_${bot_id}`)
      sessionStorage.setItem("bot_update_at", updated_at)
    }
  }

  const createOrAddLinesCart = async (res) => {
    const newArr = scenarioUserResponses.concat(res.data?.data || [])
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

  function getObjectFukushashiki(obj) {
    if (
      obj &&
      obj.message.message_content &&
      obj.message.message_content.length > 0
    ) {
      const messageArray = obj.message.message_content;
      const listFukuObject = [];
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
                  listFukuObject.push(fukuObjectLeft);
                  listFukuObject.push(fukuObjectRight);
                }
                else {
                  if (message.fukushashiki_search_value.includes(',')) {
                    let address = message.fukushashiki_search_value.split(',');
                    address.forEach(value => {
                      const fukuObject = {
                        type: message.type,
                        bindingMode: message.fukushashiki_search_mode,
                        bindingAddress: value,
                        bindingValue: message.text_input.text.value,
                      };
                      listFukuObject.push(fukuObject);
                    });
                  }
                  else {
                    const fukuObject = {
                      type: message.type,
                      bindingMode: message.fukushashiki_search_mode,
                      bindingAddress: message.fukushashiki_search_value,
                      bindingValue: message.text_input.text.value,
                    };
                    listFukuObject.push(fukuObject);
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
                listFukuObject.push(fukuObject);
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
                listFukuObject.push(...result);
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
                  listFukuObject.push(fukuObject);
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
                  listFukuObject.push(...result);
                }
              }

              if (Object.keys(message.text_input.email_address).length != 0 && message.text_input.email_address != undefined) {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.text_input.email_address.value,
                };
                listFukuObject.push(fukuObject);
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
                    listFukuObject.push(fukuObject);
                  });
                }
                else {
                  const fukuObject = {
                    type: 'password',
                    bindingMode: message.fukushashiki_search_mode,
                    bindingAddress: message.fukushashiki_search_value,
                    bindingValue: message.text_input.password.value,
                  };
                  listFukuObject.push(fukuObject);
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
                listFukuObject.push(fukuObject1);
                listFukuObject.push(fukuObject2);
              }
            }
            break;
          case 'agree_term':
            {
              let searchValue = message.fukushashiki_search_value;
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
                  listFukuObject.push(fukuObject);
                });
              } else {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.fukushashiki_search_mode,
                  bindingAddress: message.fukushashiki_search_value,
                  bindingValue: message.agree_term.isAgree,
                };
                listFukuObject.push(fukuObject);
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
              listFukuObject.push(fukuObject);

              break;
            }

          case "pull_down":
            {
              if (message.pull_down?.customization.length != 0) {
                const textInDropdown = message.pull_down.customization.value
                if (message.pull_down.customization.is_comment == true) {

                }
                else {
                  message.pull_down.customization.options_without_comment.forEach((item) => {
                    if (item.value == textInDropdown) {
                      const fukuObject = {
                        type: message.type,
                        bindingMode: message.fukushashiki_search_mode,
                        bindingAddress: message.fukushashiki_search_value,
                        bindingValue: item.value
                      };
                      listFukuObject.push(fukuObject);
                    }

                  })
                }
              }

              if (message.pull_down?.type == "lp_integration_option") {
                if (message.pull_down.lp_integration_option.value != "") {
                  const fukuObject = {
                    type: message.type,
                    bindingMode: message.pull_down.lp_element_search_mode,
                    bindingAddress: message.pull_down.lp_element_search_value,
                    bindingValue: message.pull_down.lp_integration_option.value
                  };
                  listFukuObject.push(fukuObject);
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
              listFukuObject.push(...result);

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
                listFukuObject.push(fukuObject);
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
              const types = ["building_name", "address", "municipality", "prefecture", "post_code", "post_code_left", "post_code_right"];
              const result = types
                .filter(type => `value_${type}` in userInputData)
                .map(type => {
                  const bindingMode = dataInforFukushashiki[`${type}_fukushashiki_search_mode`];
                  if (bindingMode === undefined) {
                    return null;
                  }
                  return {
                    type: message.zip_code_address.is_use_dropdown ? "dropdown_prefecture" : "zip_code_address",
                    bindingMode: bindingMode,
                    bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                    bindingValue: userInputData[`value_${type}`]
                  };
                })
                .filter(item => item !== null);

              listFukuObject.push(...result);
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
                    listFukuObject.push(objA)
                  }
                  if (type == "address") {
                    const objA = {
                      type: "zip_code_address",
                      bindingMode,
                      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                      bindingValue: userInputData[`value_${type}`]
                    };
                    listFukuObject.push(objA)
                  }
                  return {
                    type: message.shipping_address.is_use_dropdown ? "dropdown_prefecture" : "shipping_address",
                    bindingMode: bindingMode,
                    bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                    bindingValue: userInputData[`value_${type}`]
                  };
                })
                .filter(item => item !== null);
              listFukuObject.push(...result);
              break;
            }

          case 'radio_button':
            {
              const initialSelection = message.radio_button.initial_selection;
              const selectedElement = message.radio_button.default.find(item => item.value === initialSelection);
              if (selectedElement) {
                const value = selectedElement.value;
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.initial_selection_fukushashiki_search_mode,
                  bindingAddress: message.initial_selection_fukushashiki_search_value,
                  bindingValue: value.toString()
                };
                listFukuObject.push(fukuObject);
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
                listFukuObject.push(fukuObject);
              }
              else {
                const fukuObject = {
                  type: message.type,
                  bindingMode: message.checkedValue_fukushashiki_search_mode,
                  bindingAddress: message.checkedValue_fukushashiki_search_value,
                  bindingValue: false
                };
                listFukuObject.push(fukuObject);
              }
              break;
            }

          case 'card_payment_radio_button':
            {
              const keysToExtract = [
                "initial_selection",
                "card_holder1",
                "card_holder2",
                "card_number1",
                "card_number2",
                "card_number3",
                "card_number4",
                "card_holder",
                "card_number",
                "year",
                "month",
                "cvc",
                "installment"
              ];
              const userInputData = keysToExtract.reduce((result, key) => {
                if (message.card_payment_radio_button[key] !== undefined) {
                  result[key] = message.card_payment_radio_button[key];
                }
                return result;
              }, {});
              const dataInforFukushashiki = Object.fromEntries(
                Object.entries(message).filter(([key]) => key.includes("fukushashiki"))
              );
              const types = ["card_number", "card_holder1", "card_holder2", "card_holder", "year", "month", "cvc", "card_number1", "card_number2", "card_number3", "card_number4", "installment", "initial_selection"];
              const result = types
                .filter(type => `${type}` in userInputData)
                .map(type => {
                  const bindingMode = dataInforFukushashiki[`${type}_fukushashiki_search_mode`];
                  const bindingValue = userInputData[`${type}`];
                  if (type == "initial_selection") {
                    return {
                      type: "initial_selection",
                      bindingMode,
                      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                      bindingValue
                    };
                  }
                  if (type == "card_number") {
                    return {
                      type: "card_number",
                      bindingMode,
                      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                      bindingValue
                    };
                  }
                  if (bindingMode !== undefined && bindingValue !== undefined) {
                    return {
                      type: "card_payment_radio_button",
                      bindingMode,
                      bindingAddress: dataInforFukushashiki[`${type}_fukushashiki_search_value`],
                      bindingValue
                    };
                  } else {
                    return null;
                  }
                })
                .filter(item => item !== null);
              listFukuObject.push(...result);
            }
          default:
            {
              return;
            }
        }
      })
      return listFukuObject;
    }
  }

  const postMessageForRunJsCode = (jsCode) => {
    window.parent.postMessage({
      isOpen: true,
      widthPc: 450,
      heightPc: 700,
      widthSp: 100,
      heightSp: 100,
      chatbotRight: 10,
      chatbotBottom: 10,
      action: 'excuteJS',
      jscode: jsCode,
      is_use_js: true
    }, '*');
  }

  const fukushashikiToLP = (fukushashikiData) => {
    window.parent.postMessage({
      isOpen: true,
      widthPc: state.widthPc,
      heightPc: state.heightPc,
      widthSp: state.widthSp,
      heightSp: state.heightSp,
      chatbotRight: state.rightMarginPc,
      chatbotBottom: state.bottom,
      action: 'fukushashiki',
      fukushashiki: fukushashikiData
    }, '*');
  }

  const processClickCreateOrder = (data) => {
    sendUserInteractionData(
      data,
      async (res) => {
        fukushashikiToLP(getObjectFukushashiki(data));
        setMessagesSessionStorage(state.renderMessageArr[indexMessage])
        await createOrAddLinesCart(res)
      }
    ).then(() => {
      sendCreateOrderData(
        data_submit,
        (res) => console.log(res)
      ).then(() => {
        if (params.get('cartSystem') === 'shopify') return;
        const conversion = {
          scenario_data: `${state.deviceReceive}_conversion`,
        };
        sendCountRequest(conversion)
          .then(res => {
            console.log(res);
            redirectToThanksPage();
          });
      });
    });
  }

  const onClickNext = async (indexMessage, message) => {
    let newState = { ...state };
    let indexClickLocation = newState.dataMessages.findIndex((msg) => msg?.id === message?.id);
    if (indexClickLocation < 0) indexClickLocation = newState.indexMessageRender;

    if (message.button_jscode == true && message.jscode?.length > 0) {
      postMessageForRunJsCode();
    }

    if (!handleValidateField(indexMessage)) {
      return;
    }
    let renderMessage = [...state.renderMessageArr];
    newState.renderMessageArr[indexMessage].disabled = newState.submitErrorMessage.length > 0 ? false : true;
    newState.renderMessageArr = state.renderMessageArr.sort((a, b) => a.id - b.id);

    let index;
    let isPauseScroll = false;
    let delayRender;
    if (indexClickLocation === state.indexMessageRender)
      newState.indexUser = newState.indexUser + 1;

    let data_submit = {
      scenario_id: state.scenarioId,
      message: state.renderMessageArr[indexMessage],
      user_id: state.uuid,
      bot_type: "web"
    };

    if (state.dataMessages[indexClickLocation]?.message_content?.[0]?.text_input?.save_input_content === "create_order" || state.dataMessages.length - 1 === indexClickLocation) {
      return processClickCreateOrder(data_submit);
    }

    sendUserInteractionData(
      data,
      async (res) => {
        fukushashikiToLP(getObjectFukushashiki(data));
        setMessagesSessionStorage(state.renderMessageArr[indexMessage])
        await createOrAddLinesCart(res)
      }
    );

    if (!state.dataMessages[state.indexMessageRender + 1] || state.indexMessageRender > indexClickLocation) {
      newMessage.renderMessageArr[indexMessage].disabled = false;
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: {
          renderMessageArr: renderMessage
        }
      });
      return;
    }

    if (state.dataMessages[state.indexMessageRender + 1].belong_to === 'user' || state.dataMessages[state.indexMessageRender + 1].belong_to === 'bot') {
      for (let i = state.indexMessageRender + 1; i < state.dataMessages.length; i++) {
        if (state.dataMessages[i].hidden !== true) {
          if (state.dataMessages[i].conditions) {
            var checked = true;
            for (let j = 0; j < state.dataMessages[i].conditions.length; j++) {
              let conditionItem = state.dataMessages[i].conditions[j];
              if (j === 0) {
                if (conditionItem.condition === "include") {
                  checked = objParam[conditionItem.nameCondition].includes(
                    conditionItem.inputCondition
                  );
                } else if (conditionItem.condition === "is") {
                  checked =
                    objParam[conditionItem.nameCondition] ==
                    conditionItem.inputCondition;
                } else if (conditionItem.condition === "not_include") {
                  checked = !objParam[conditionItem.nameCondition].includes(
                    conditionItem.inputCondition
                  );
                } else if (conditionItem.condition === "is_not") {
                  checked =
                    objParam[conditionItem.nameCondition] !=
                    conditionItem.inputCondition;
                }
              } else if (conditionItem?.linkCondition === "and") {
                if (conditionItem.condition === "include") {
                  checked =
                    checked &&
                    objParam[conditionItem.nameCondition].includes(
                      conditionItem.inputCondition
                    );
                } else if (conditionItem.condition === "is") {
                  checked =
                    checked &&
                    objParam[conditionItem.nameCondition] ==
                    conditionItem.inputCondition;
                } else if (conditionItem.condition === "not_include") {
                  checked =
                    checked &&
                    !objParam[conditionItem.nameCondition].includes(
                      conditionItem.inputCondition
                    );
                } else if (conditionItem.condition === "is_not") {
                  checked =
                    checked &&
                    objParam[conditionItem.nameCondition] !=
                    conditionItem.inputCondition;
                }
              } else if (conditionItem?.linkCondition === "or") {
                if (conditionItem.condition === "include") {
                  checked =
                    checked ||
                    objParam[conditionItem.nameCondition].includes(
                      conditionItem.inputCondition
                    );
                } else if (conditionItem.condition === "is") {
                  checked =
                    checked ||
                    objParam[conditionItem.nameCondition] ==
                    conditionItem.inputCondition;
                } else if (conditionItem.condition === "not_include") {
                  checked =
                    checked ||
                    !objParam[conditionItem.nameCondition].includes(
                      conditionItem.inputCondition
                    );
                } else if (conditionItem.condition === "is_not") {
                  checked =
                    checked ||
                    objParam[conditionItem.nameCondition] !=
                    conditionItem.inputCondition;
                }
              }
            }
            if (checked === false && state.dataMessages[i].belong_to === "user") {
              newState.indexUser = newState.indexUser + 1;
              continue;
            }
          }
          if (state.dataMessages[i].belong_to === "bot") {
            if (state.dataMessages[i]?.message_content[0].type === "delay") {
              if (state.dataMessages[i]?.message_content[0]?.delay.typing_on) {
                await new Promise((resolve) => {
                  renderMessage.push({ ...state.dataMessages[i] });
                  dispatch({
                    type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                    payload: {
                      renderMessageArr: [...renderMessage]
                    }
                  });
                  resolve();
                })
                  .then(async () => {
                    await new Promise((resolve) => {
                      delayRender = setTimeout(() => {
                        resolve();
                      }, state.dataMessages[i]?.message_content[0].delay.content * 1000);
                    });
                  })
                  .then(() => {
                    renderMessage.pop();
                    renderMessage.push({});
                    renderMessage[indexMessage].disabled = false;
                    state.renderMessageArr[indexMessage].disabled = false;
                    dispatch({
                      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                      payload: {
                        indexMessageRender: i,
                        renderMessageArr: [...renderMessage],
                      }
                    });
                  })
                  .then(() => {
                    if (state.dataMessages.length - 1 === i && state.urlThanksPage) {
                      let aTag = document.createElement("a");
                      aTag.href = state.urlThanksPage;
                      aTag.target = "_blank";

                      setTimeout(() => {
                        aTag.click();
                      }, 2000);
                    }
                  });
              } else {
                await new Promise((resolve) => {
                  return (delayRender = setTimeout(() => {
                    resolve();
                  }, state.dataMessages[i]?.message_content[0]?.delay?.content * 1000));
                }).then(() => {
                  if (state.dataMessages.length - 1 === i && state.urlThanksPage) {
                    let aTag = document.createElement("a");
                    aTag.href = state.urlThanksPage;
                    aTag.target = "_blank";

                    setTimeout(() => {
                      aTag.click();
                    }, 2000);
                  }
                });
              }
            } else if (state.dataMessages[i]?.message_content[0]?.type === "email") {
              let emailId =
                state.dataMessages[i]?.message_content[0][
                  state.dataMessages[i]?.message_content[0].type
                ].contentId;
              let variablesData = {};
              dataVariables.forEach((item) => {
                variablesData[item.variable_name] = item.default_value;
              });

              state.variables.forEach((item) => {
                variablesData[item.variable_name] = item.default_value;
              });

              let data = {
                variables: variablesData,
              };
              renderMessage[indexMessage].disabled = false;
              state.renderMessageArr[indexMessage].disabled = false;
              renderMessage.push({});

              api
                .post(`/api/v1/managements/emails/${emailId}/send_email`, data)
                .then(() => { })
                .catch((error) => {
                  console.log(error);
                  if (error.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
              index = i;
              dispatch({
                type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                payload: {
                  indexMessageRender: i,
                  renderMessageArr: [...renderMessage],
                }
              });
            } else if (state.dataMessages[i]?.message_content[0]?.type === "variable_set") {
              if (state.variables.length !== 0) {
                newState.variables = updateVariableValues(state.variables, state.dataMessages, i);
              }
              renderMessage.push({});
              index = i;
              dispatch({
                type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                payload: {
                  indexMessageRender: i,
                  renderMessageArr: [...renderMessage],
                  ...newState,
                }
              });
            } else if (state.dataMessages[i]?.message_content[0]?.type === "clear_variable") {
              if (state.variables.length !== 0) {
                newState.variables = updateVariableValues(state.variables, state.dataMessages, i, "clear_variable");
              }
              renderMessage[indexMessage].disabled = false;
              state.renderMessageArr[indexMessage].disabled = false;
              renderMessage.push({});
              index = i;
              dispatch({
                type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                payload: {
                  indexMessageRender: i,
                  renderMessageArr: [...renderMessage],
                  ...newState,
                }
              });
            } else if (state.dataMessages[i]?.message_content[0]?.type === "pause") {
              renderMessage.push({});
              index = i;
              dispatch({
                type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                payload: {
                  indexMessageRender: i,
                  renderMessageArr: [...renderMessage],
                }
              });
              break;
            } else {
              await new Promise((resolve) => {
                return (delayRender = setTimeout(() => {
                  if (
                    state.dataMessages[i].message_content[0].type === "text_input" &&
                    state.dataMessages[i].message_content[0].text_input.content
                  ) {
                    state.dataMessages[i].message_content[0].text_input.content =
                      state.dataMessages[
                        i
                      ].message_content[0].text_input.content.replaceAll(
                        SCAN_REGEX,
                        (text, variable) => {
                          if (state.variables.length !== 0) {
                            let valueVar = "";
                            for (let j = 0; j < state.variables.length; j++) {
                              if (state.variables[j].variable_name === variable) {
                                valueVar = state.variables[j].default_value;
                              }
                            }
                            return valueVar;
                          } else {
                            return "";
                          }
                        }
                      );
                  }
                  resolve({ ...state.dataMessages[i] });
                }, 1000));
              })
                .then((data) => {
                  renderMessage[indexMessage].disabled = false;
                  state.renderMessageArr[indexMessage].disabled = false;
                  renderMessage.push(data);
                  dispatch({
                    type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                    payload: {
                      indexMessageRender: i,
                      renderMessageArr: [...renderMessage],
                    }
                  });
                  if (isPauseScroll === false) {
                    scrollToBottom();
                  }
                  if (
                    data.message_content[0][data.message_content[0]?.type]
                      ?.scroll_auto === true
                  ) {
                    isPauseScroll = true;
                  }
                })
                .then(() => {
                  if (state.dataMessages[i].message_content[0]?.text_input?.save_input_content === "create_order") {
                    data_submit = {
                      scenario_id: state.scenarioId,
                      user_id: state.uuid,
                    };

                    api
                      .post(
                        `/api/v1/scenario_users/scenario_user_responses/create_order`,
                        data_submit
                      )
                      .then(() => { })
                      .catch((error) => {
                        console.log(error);
                        if (error.response?.data.code === 0) {
                          tokenExpired();
                        }
                      });

                  }
                  if (state.dataMessages.length - 1 === i) {
                    data_submit = {
                      scenario_id: state.scenarioId,
                      user_id: state.uuid,
                    };
                    api
                      .post(
                        `/api/v1/scenario_users/scenario_user_responses/create_order`,
                        data_submit
                      )
                      .then(() => {
                        // api.post(`/api/v1/managements/payment_histories`, data_submit).then((res)=>{}).catch((err) => {
                        //   console.log(err);
                        // if (err.response?.data.code === 0) {
                        //   tokenExpired();
                        // }
                        // })
                      })
                      .catch((error) => {
                        console.error(error);
                        if (error.response?.data.code === 0) {
                          tokenExpired();
                        }
                      });

                    if (state.urlThanksPage) {
                      let aTag = document.createElement("a");
                      aTag.href = state.urlThanksPage;
                      aTag.target = "_blank";

                      setTimeout(() => {
                        aTag.click();
                      }, 2000);
                    }
                  }
                });
              index = i;
            }
          } else if (
            state.dataMessages[i].belong_to === "user" &&
            state.dataMessages[i].message_content.length > 0
          ) {
            await new Promise((resolve) => {
              return (delayRender = setTimeout(() => {
                for (
                  let j = 0;
                  j < state.dataMessages[i].message_content.length;
                  j++
                ) {
                  if (state.dataMessages[i].message_content[j].type === "capture") {
                    api
                      .get(
                        `https://svg-captcha-nodejs.vercel.app/captcha?size=${state.dataMessages[i].message_content[j][
                          state.dataMessages[i].message_content[j].type
                        ].length
                        }${state.dataMessages[i].message_content[j][
                          state.dataMessages[i].message_content[j].type
                        ].colour
                          ? "&color=true"
                          : ""
                        }&charPreset=${state.dataMessages[i].message_content[j][
                          state.dataMessages[i].message_content[j].type
                        ].type
                        }`
                      )
                      .then((res) => {
                        captcha.push({
                          index: i,
                          indexContent: j,
                          ...res.data,
                        });
                        setCaptcha([...captcha]);
                      })
                      .catch((error) => {
                        console.log(error);
                        if (error.response?.data.code === 0) {
                          tokenExpired();
                        }
                      });
                  } else if (state.dataMessages[i].message_content[j].type === "label" &&
                    state.dataMessages[i].message_content[j].label.lbl_content) {
                    state.dataMessages[i].message_content[j].label.lbl_content =
                      state.dataMessages[
                        i
                      ].message_content[j].label.lbl_content.replaceAll(
                        SCAN_REGEX,
                        (text, variable) => {
                          if (state.variables.length !== 0) {
                            let valueVar = "";
                            for (let k = 0; k < state.variables.length; k++) {
                              if (state.variables[k].variable_name === variable) {
                                valueVar = state.variables[k].default_value;
                              }
                            }
                            return valueVar;
                          } else {
                            return "";
                          }
                        }
                      );
                  }
                }
                resolve({ ...state.dataMessages[i] });
              }, 1000));
            }).then((data) => {

              const dataSessionStorage = getMessagesSessionStorage()
              if (dataSessionStorage) {
                const temp = dataSessionStorage.find(x => x.id === data.id)
                if (temp) data.message_content = [...temp.message_content]
              }
              try {
                renderMessage[indexMessage].disabled = false;
                state.renderMessageArr[indexMessage].disabled = false;
                const isIdExist = state.renderMessageArr.some((message) => message.id === data.id);

                if (isIdExist) {
                  return;
                }
                renderMessage.push(data);
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: {
                    indexMessageRender: i, renderMessageArr: [...renderMessage]
                  }
                });
                if (isPauseScroll === false) {
                  scrollToBottom();
                }
              }
              catch { }
            });
            index = i;
            break;
          }
        }
      }
      // setIndexMessageRender(index);
      // setRenderMessageArr([
      //   ...renderMessage
      // ]);
    } else {
      // handle check message_content for user
      //if message_content.length !== 0 => show message
      if (
        state.dataMessages[state.indexMessageRender + 1].message_content.length > 0 &&
        state.dataMessages[state.indexMessageRender + 1].hidden !== true
      ) {
        await new Promise((resolve) => {
          return (delayRender = setTimeout(() => {
            for (
              let j = 0;
              j < state.dataMessages[state.indexMessageRender + 1].message_content.length;
              j++
            ) {
              if (
                state.dataMessages[state.indexMessageRender + 1].message_content[j].type ===
                "capture"
              ) {
                api
                  .get(
                    `https://svg-captcha-nodejs.vercel.app/captcha?size=${state.dataMessages[state.indexMessageRender + 1].message_content[j][
                      state.dataMessages[state.indexMessageRender + 1].message_content[j]
                        .type
                    ].length
                    }${state.dataMessages[state.indexMessageRender + 1].message_content[j][
                      state.dataMessages[state.indexMessageRender + 1].message_content[j]
                        .type
                    ].colour
                      ? "&color=true"
                      : ""
                    }&charPreset=${state.dataMessages[state.indexMessageRender + 1].message_content[j][
                      state.dataMessages[state.indexMessageRender + 1].message_content[j]
                        .type
                    ].type
                    }`
                  )
                  .then((res) => {
                    captcha.push({
                      index: state.indexMessageRender + 1,
                      indexContent: j,
                      ...res.data,
                    });
                    setCaptcha([...captcha]);
                  })
                  .catch((error) => {
                    console.log(error);
                    if (error.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
              }
            }
            function replaceVariable(content) {
              content = content.replaceAll(SCAN_REGEX, (text, variable) => {
                if (state.variables.length !== 0) {
                  let valueVar = "";
                  for (let j = 0; j < state.variables.length; j++) {
                    if (state.variables[j].variable_name === variable) {
                      valueVar = state.variables[j].default_value;
                    }
                  }
                  return valueVar;
                } else {
                  return "";
                }
              })
              return content;
            }
            state.dataMessages[state.indexMessageRender + 1].message_content.forEach((item, index) => {
              const dataMessageType = item.type;
              if (dataMessageType == 'label' && item.label && item.label.lbl_content) {
                item.label.lbl_content = replaceVariable(item.label.lbl_content);
              }
              if (dataMessageType == 'textarea' && item.textarea && item.textarea.invalid_input && item.textarea.invalid_input.content) {
                item.textarea.invalid_input.content = replaceVariable(item.textarea.invalid_input.content);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.urls && item.text_input.urls.placeholder) {
                item.text_input.urls.placeholder = replaceVariable(item.text_input.urls.placeholder);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.text && item.text_input.text.placeholderLeft) {
                item.text_input.text.placeholderLeft = replaceVariable(item.text_input.text.placeholderLeft);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.text && item.text_input.text.placeholderRight) {
                item.text_input.text.placeholderRight = replaceVariable(item.text_input.text.placeholderRight);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.email_address && item.text_input.email_address.placeholder) {
                item.text_input.email_address.placeholder = replaceVariable(item.text_input.email_address.placeholder);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.email_confirmation && item.text_input.email_confirmation.cfEmlAdd_confirm_email) {
                item.text_input.email_confirmation.cfEmlAdd_confirm_email = replaceVariable(item.text_input.email_confirmation.cfEmlAdd_confirm_email);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.email_confirmation && item.text_input.email_confirmation.cfEmlAdd_email) {
                item.text_input.email_confirmation.cfEmlAdd_email = replaceVariable(item.text_input.email_confirmation.cfEmlAdd_email);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.phone_number && item.text_input.phone_number.number) {
                item.text_input.phone_number.number = replaceVariable(item.text_input.phone_number.number);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.phone_number && item.text_input.phone_number.number1) {
                item.text_input.phone_number.number1 = replaceVariable(item.text_input.phone_number.number1);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.phone_number && item.text_input.phone_number.number2) {
                item.text_input.phone_number.number2 = replaceVariable(item.text_input.phone_number.number2);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.phone_number && item.text_input.phone_number.number3) {
                item.text_input.phone_number.number3 = replaceVariable(item.text_input.phone_number.number3);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.password && item.text_input.password.password) {
                item.text_input.password.password = replaceVariable(item.text_input.password.password);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.password_confirmation && item.text_input.password_confirmation.password) {
                item.text_input.password_confirmation.password = replaceVariable(item.text_input.password_confirmation.password);
              }
              if (dataMessageType == 'text_input' && item.text_input && item.text_input.password_confirmation && item.text_input.password_confirmation.confirm_password) {
                item.text_input.password_confirmation.confirm_password = replaceVariable(item.text_input.password_confirmation.confirm_password);
              }
              state.dataMessages[state.indexMessageRender + 1].message_content[index] = item;
            })
            resolve({ ...state.dataMessages[state.indexMessageRender + 1] });
          }, 1000));
        }).then((data) => {
          renderMessage[indexMessage].disabled = false;
          state.renderMessageArr[indexMessage].disabled = false;
          renderMessage.push(data);
          dispatch({
            type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
            payload: {
              indexMessageRender: state.indexMessageRender + 1,
              renderMessageArr: [...renderMessage],
            }
          });
          if (isPauseScroll === false) {
            scrollToBottom();
          }
        });
        // index = indexMessageRender + 1;
      }
      //if message_content.length === 0 => loop until meet message have message_content.length !== 0 => show message
      else {
        for (let i = state.indexMessageRender + 1; i < state.dataMessages.length; i++) {
          if (
            state.dataMessages[i].message_content.length > 0 &&
            state.dataMessages[i].hidden !== true
          ) {
            if (state.dataMessages[i].belong_to === "user") {
              await new Promise((resolve) => {
                return (delayRender = setTimeout(() => {
                  for (
                    let j = 0;
                    j < state.dataMessages[i].message_content.length;
                    j++
                  ) {
                    if (state.dataMessages[i].message_content[j].type === "capture") {
                      api
                        .get(
                          `https://svg-captcha-nodejs.vercel.app/captcha?size=${state.dataMessages[i].message_content[j][
                            state.dataMessages[i].message_content[j].type
                          ].length
                          }${state.dataMessages[i].message_content[j][
                            state.dataMessages[i].message_content[j].type
                          ].colour
                            ? "&color=true"
                            : ""
                          }&charPreset=${state.dataMessages[i].message_content[j][
                            state.dataMessages[i].message_content[j].type
                          ].type
                          }`
                        )
                        .then((res) => {
                          captcha.push({
                            index: i,
                            indexContent: j,
                            ...res.data,
                          });
                          setCaptcha([...captcha]);
                        })
                        .catch((error) => {
                          console.log(error);
                          if (error.response?.data.code === 0) {
                            tokenExpired();
                          }
                        });
                    }
                  }
                  resolve({ ...state.dataMessages[i] });
                }, 1000));
              }).then((data) => {
                renderMessage[indexMessage].disabled = false;
                state.renderMessageArr[indexMessage].disabled = false;
                renderMessage.push(data);
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: {
                    indexMessageRender: i,
                    renderMessageArr: [...renderMessage],
                  }
                });
                if (isPauseScroll === false) {
                  scrollToBottom();
                }
              });
              index = i;
              break;
            } else {
              if (state.dataMessages[i]?.message_content[0].type === "delay") {
                if (state.dataMessages[i]?.message_content[0]?.delay.typing_on) {
                  await new Promise((resolve) => {
                    renderMessage[indexMessage].disabled = false;
                    state.renderMessageArr[indexMessage].disabled = false;
                    renderMessage.push({ ...state.dataMessages[i] });
                    dispatch({
                      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                      payload: {
                        renderMessageArr: [...renderMessage]
                      }
                    });
                    resolve();
                  })
                    .then(async () => {
                      await new Promise((resolve) => {
                        delayRender = setTimeout(() => {
                          resolve();
                        }, state.dataMessages[i]?.message_content[0].delay.content * 1000);
                      });
                    })
                    .then(() => {
                      renderMessage.pop();
                      renderMessage.push({});
                      dispatch({
                        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                        payload: {
                          indexMessageRender: i,
                          renderMessageArr: [...renderMessage],
                        }
                      });
                    });
                } else {
                  await new Promise((resolve) => {
                    return (delayRender = setTimeout(() => {
                      resolve();
                    }, state.dataMessages[i]?.message_content[0]?.delay?.content * 1000));
                  });
                }
                index = i;
              } else if (
                state.dataMessages[i]?.message_content[0]?.type === "email"
              ) {
                let emailId =
                  state.dataMessages[i]?.message_content[0][
                    state.dataMessages[i]?.message_content[0].type
                  ].contentId;
                let variablesData = {};
                dataVariables.forEach((item) => {
                  variablesData[item.variable_name] = item.default_value;
                });

                state.variables.forEach((item) => {
                  variablesData[item.variable_name] = item.default_value;
                });

                let data = {
                  variables: variablesData,
                };
                renderMessage.push({});

                api
                  .post(
                    `/api/v1/managements/emails/${emailId}/send_email`,
                    data
                  )
                  .then(() => { })
                  .catch((error) => {
                    console.log(error);
                    if (error.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
                index = i;
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: {
                    indexMessageRender: i,
                    renderMessageArr: [...renderMessage],
                  }
                });
              } else if (
                state.dataMessages[i]?.message_content[0]?.type === "variable_set"
              ) {
                newState.variables = updateVariableValues(state.variables, state.dataMessages, i);
                renderMessage[indexMessage].disabled = false;
                renderMessage.push({});
                index = i;
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: {
                    ...newState,
                    indexMessageRender: i,
                    renderMessageArr: [...renderMessage],
                  }
                });
              } else if (
                state.dataMessages[i]?.message_content[0]?.type === "clear_variable"
              ) {
                newState.variables = updateVariableValues(state.variables, state.dataMessages, i, "clear_variable");
                renderMessage[indexMessage].disabled = false;
                state.renderMessageArr[indexMessage].disabled = false;
                renderMessage.push({});
                index = i;
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: {
                    ...newState,
                    indexMessageRender: i,
                    renderMessageArr: [...renderMessage],
                  }
                });
              } else if (
                state.dataMessages[i]?.message_content[0]?.type === "pause"
              ) {
                renderMessage[indexMessage].disabled = false;
                renderMessage.push({});
                index = i;
                dispatch({
                  type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                  payload: {
                    indexMessageRender: i,
                    renderMessageArr: [...renderMessage],
                  }
                });
                break;
              } else {
                await new Promise((resolve) => {
                  return (delayRender = setTimeout(() => {
                    if (
                      state.dataMessages[i].message_content[0].type ===
                      "text_input" &&
                      state.dataMessages[i].message_content[0].text_input.content
                    ) {
                      state.dataMessages[i].message_content[0].text_input.content =
                        state.dataMessages[
                          i
                        ].message_content[0].text_input.content.replaceAll(
                          SCAN_REGEX,
                          (text, variable) => {
                            if (state.variables.length !== 0) {
                              let valueVar = "";
                              for (let j = 0; j < state.variables.length; j++) {
                                if (state.variables[j].variable_name === variable) {
                                  valueVar = state.variables[j].default_value;
                                }
                              }
                              return valueVar;
                            } else {
                              return "";
                            }
                          }
                        );
                    }
                    resolve({ ...state.dataMessages[i] });
                  }, 1000));
                }).then((data) => {
                  renderMessage[indexMessage].disabled = false;
                  renderMessage.push(data);
                  dispatch({
                    type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                    payload: {
                      indexMessageRender: i,
                      renderMessageArr: [...renderMessage],
                    }
                  });
                  if (isPauseScroll === false) {
                    scrollToBottom();
                  }
                });
              }
            }
          } else {
            renderMessage[indexMessage].disabled = false;
            state.renderMessageArr[indexMessage].disabled = false;
            renderMessage.push({});
            dispatch({
              type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
              payload: {
                renderMessageArr: [...renderMessage]
              }
            });
          }
        }
      }
    }
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
    let newState = { ...state };
    let messageContentTypeData = newState.dataMessages[index].message_content[indexContent][contentType];
    let index = state.indexMessageRender

    if (message) {
      const foundMessage = state.dataMessages.find((msg) => msg?.id === message?.id);
      if (foundMessage) {
        index = state.dataMessages.indexOf(foundMessage);
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

    if (
      contentType === "product_purchase" &&
      field === "initial_selection" &&
      value.length > 0
    ) {
      let dataContentType = {
        ...state.dataMessages[index].message_content[indexContent][contentType],
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
        ...state.dataMessages[index].message_content[indexContent][
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
      state.dataMessages[index].message_content[indexContent][contentType].is_save_input_content
    ) {
      let isSaveParam = false;
      newState.variables = state.variables.map((item) => {
        let dataContentType = {
          ...state.dataMessages[index].message_content[indexContent][contentType],
        };
      
        if (state.dataMessages[index].message_content[indexContent][contentType].save_input_content === item.variable_name) {
          setDefaultValue(item, dataContentType, contentType, value, field);
          isSaveParam = true;
        }
      
        return item;
      });
      
      if (isSaveParam) {
        newState.objParam[state.dataMessages[index].message_content[indexContent][contentType].save_input_content] = value;
      }
    }

    setMessagesSessionStorage(state.dataMessages[index])

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
      payload: {
        ...newState,
        dataMessages: [...state.dataMessages],
        renderMessageArr: state.renderMessageArr.map(x => {
          if (x?.id === state.dataMessages[index]?.id) return { ...state.dataMessages[index] }
          return { ...x }
        })
      }
    });
  };

  const handleOpenWithDrawal = () => {
    if (activePopupCloseBot) {
      setShowPopupCloseBot(true)
      return
    }
    if (state.botInfor && state.botInfor.withdrawal_prevention_status === "invalid") {
      sessionStorage.removeItem("cart")
      setScenarioUserResponses([])
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { indexUser: 0 }
      });
      let indexTiming = 0;
      let i;
      for (i = state.indexMessageRender; i < state.dataMessages.length; i++) {
        if (
          state.dataMessages[i].belong_to === "user" ||
          i === state.dataMessages.length - 1
        )
          break;
        if (
          state.dataMessages[i].belong_to === "bot" &&
          state.dataMessages[i].message_content[0].type === "delay"
        ) {
          indexTiming += state.dataMessages[i].message_content[0].delay.content;
        }
      }
      if (!isFromScenario) dispatch({ type: PREVIEW_ACTIONS.SET_IS_OPEN, payload: { scenarioId: null } });
      setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.SET_IS_OPEN, payload: { renderMessageArr: [] } });
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
      }, (indexTiming + i - state.indexMessageRender - 1) * 1000);
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
    if (isOpen === true) {
      setPrefectures(null);
      setCities(null);
      setTowns(null);
      setZipcode(null);
      document.getElementById("sp-withdrawal-container").style.display =
        "block";
      document.getElementById("sp-popup-zip-code-address").style.display =
        "block";
    } else {
      document.getElementById("sp-withdrawal-container").style.display = "none";
      document.getElementById("sp-popup-zip-code-address").style.display =
        "none";
    }
    if (indexContent !== undefined) {
      setContentZipcode(indexContent);
    }
  };

  const isPopUpZipCodeShippingAddress = (isOpen, indexContent) => {
    if (isOpen === true) {
      setPrefectures(null);
      setCities(null);
      setTowns(null);
      setZipcode(null);
      document.getElementById("sp-withdrawal-container").style.display =
        "block";
      document.getElementById("sp-popup-zip-code-address2").style.display =
        "block";
    } else {
      document.getElementById("sp-withdrawal-container").style.display = "none";
      document.getElementById("sp-popup-zip-code-address2").style.display =
        "none";
    }
    if (indexContent !== undefined) {
      setContentZipcode(indexContent);
    }
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
    if (!message || !message.belong_to !== "bot" || !Array.isArray(message?.message_content)) return null;

    return message.messageContent.map((content, index) => (
      <BotMessage
        key={indexMessage}
        content={content}
        index={index}
        botInfor={state.botInfor}
        checkoutUrl={state.checkoutUrl}
        previewOrder={previewContent}
      />
    ));
  }

  const renderUserMessageContent = (message, indexMessage) => {
    if (!message || !message.belong_to !== "user") return null;
    if (!Array.isArray(message?.message_content) || message.messageContent.length === 0) return null;

    return (
      <div className="sp-body-user-side slideLeft">
        <div className="sp-body-user-side-messages">
          <UserMessage
            captcha={captcha}
            messageContentProps={message.message_content}
            disabled={state.submitErrorMessage.length > 0 ? false : message.disabled}
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
            indexMessageRender={state.indexMessageRender}
            onClickNext={() => onClickNext(indexMessage, message)}
            indexMessage={indexMessage}
            errorsProps={state.errors}
            displayButtonNext={(value) => {
              if (!state.dataMessages[state.indexMessageRender]) return;
              let newDataMessages = [...state.dataMessages];
              newDataMessages[state.indexMessageRender].is_display_button_next = value;
              dispatch({
                type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
                payload: {
                  dataMessages: [...newDataMessages],
                }
              });
            }}
            dataPrefectures={[...dataPrefectures]}
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
            submitErrorMessage={state.submitErrorMessage}
          />
          {message.message_content[0]?.type !== "button_submit" && (
            <div className="sp-user-message-button-action">
              <CustomButton
                disabled={state.submitErrorMessage.length > 0 ? false : message.disabled}
                style={{
                  backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
                  borderRadius: "25px",
                }}
                className="ss-user-message__action-btn"
                onClick={() => onClickNext(indexMessage, message)}
                autoClick={state.submitErrorMessage.trim().length > 0 ? true : false}
                messsagetype={message.message_content[0]?.type}
              >
                {message.buttonName || (
                  state.submitErrorMessage.length > 0
                    ? "更新"
                    : (userIndexMessage >= userMessageArray.length ? "次へ" : "更新")
                )}
              </CustomButton>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderMessages = () => {
    return state.renderMessageArr.map((message, indexMessage) => {
      return (
        <React.Fragment key={indexMessage}>
          {renderBotMessageContent(message, indexMessage)}
          {renderUserMessageContent(message, indexMessage)}
        </React.Fragment>
      );
    })
  };

  const userMessageArray = state.renderMessageArr.filter(x => x.belong_to === 'user');
  let userIndexMessage = 0;

  ///body container
  if (state.scenarioId && state.botInfor && state.isOpen) {
    return (
      <div
        ref={containerRef}
        id="sp-container1"
        className={`sp-container1 ${mobileCheck() ? 'slideUpSp' : 'slideUp'}`}
        style={{
          position: 'fixed',
          bottom: "0px",
          right: mobileCheck() === true ? state.isOpen ? 0 : `${rightMarginSp}px` : `${rightMarginPc}px`,
          width: mobileCheck() === true ? `${widthSp}%` : `${widthPc}px`,
          height: mobileCheck() === true ? `${heightSp}%` : `${heightPc}px`,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white"
        }}
      >
        <Withdrawal botInfor={state.botInfor}
          delayTimeInSecond={i - state.indexMessageRender}
          deviceReceive={state.deviceReceive}
          scenarioId={state.scenarioId}
          onOpenPreview={onOpenPreview}
        />
        <ZipCodePopUp
          isPopUpZipCode={isPopUpZipCode}
          prefecturesList={dataPrefectures}
          message={state.dataMessages[state.indexMessageRender]}
          messageIndex={state.indexMessageRender}
          indexContentZipcode={state.indexContentZipcode}
          onChangeValue={onChangeValue}
          onChangeErrors={onChangeErrors}
          errors={state.errors}
        />
        {/* popup for shipping address can be used instead of ZipCodePopUp -> remove */}
        <div
          id="sp-header"
          style={
            (state.botInfor?.main_color || state.botInfor?.main_color_other) &&
            {
              backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
              borderTopLeftRadius: mobileCheck() ? "0px" : "5px",
              borderTopRightRadius: mobileCheck() ? "0px" : "5px",
            }
          }
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
              <div className="sp-header-left-label-title">{state.botInfor?.title}</div>
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
        {activePopupCloseBot ?
          <ModalPreviewBot
            isMobile={mobileCheck()}
            styleBot={handleStyleModal()}
            open={showPopupCloseBot} isAdmin={false} onClose={() => setShowPopupCloseBot(false)}>
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
                <Button
                  className="btn-close__modal-bot"
                  onClick={() => handleCloseBot()}
                >
                  閉じる
                </Button>
              </Col>
            </Row>
          </ModalPreviewBot>
          : ""}
        <ProcessBar botInfor={state.botInfor}
          currentIndex={state.indexUser}
          maxIndex={state.messageUser.length}
        />
        <div
          id="sp-body"
          className="sp-body"
          style={{ backgroundColor: state.botInfor?.opacity_color, flex: 1 }}
        >
          {renderMessages()}
        </div>
      </div>
    )
  } else if (state.isOpen === false && mobileCheck() === false && Number(positionPc) === 1 && Number(buttonTypePc) === 2) {
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
          bottom: bottomMarginPc ? `${bottomMarginPc}px` : '10px',
          right: rightMarginPc ? `${rightMarginPc}px` : '0px',
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
  } else if (state.isOpen === false && mobileCheck() === false && Number(positionPc) === 1 && Number(buttonTypePc) === 1) {
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
          bottom: bottomMarginPc ? `${bottomMarginPc}px` : '10px',
          right: rightMarginPc ? `${rightMarginPc}px` : '0px',
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
            <span style={{ fontSize: '18px', fontWeight: 900 }}>{titleBubble}</span>
          </div>
        </div>
        <div className="sp-header-right-arrow" style={{ marginRight: '8px' }}>
          <MDBIcon fas icon="chevron-circle-up" />
        </div>
      </div>
    )
  } else if (state.isOpen === false && mobileCheck() === false && Number(positionPc) === 2) {
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
          bottom: bottomMarginPc ? `${parseInt(bottomMarginPc) + widthPc / 2}px` : '20px',
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
            <div className="sp-header-left-label-title">{rightPcTitle}</div>
          </div>
        </div>
      </div>)
  } else if (state.isOpen === false && mobileCheck() === true && Number(positionSp) === 1 && Number(buttonTypeSp) === 2) {
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
          bottom: bottomMarginSp ? `${bottomMarginSp}px` : '20px',
          right: rightMarginSp ? `${rightMarginSp}px` : '20px',
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
  } else if (state.isOpen === false && mobileCheck() === true && Number(positionSp) === 1 && Number(buttonTypeSp) === 1) {
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
          bottom: bottomMarginSp ? `${bottomMarginSp}px` : '10px',
          right: rightMarginSp ? `${rightMarginSp}px` : '10px'
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
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{titleBubble}</span>
            </div>
          </div>
          <div className="sp-header-right-arrow" style={{ marginLeft: 'auto' }}>
            <MDBIcon fas icon="chevron-circle-up" />
          </div>
        </div>
      </div>
    )
  } else if (state.isOpen === false && mobileCheck() === true && Number(positionSp) === 2) {
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
          bottom: bottomMarginSp ? `${parseInt(bottomMarginSp) + widthPc / 2}px` : '20px',
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
            <div className="sp-header-left-label-title">{rightSpTitle}</div>
          </div>
        </div>
      </div>)
  }

  return (<div></div>);
}

export default Preview;
