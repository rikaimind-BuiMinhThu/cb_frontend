import React, { useEffect, useState } from "react";
import "../../../assets/css/bot/preview-chat-bot.css";
import api from "../../../api/api-management";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import SelectCustom from "./ScenarioSetting/scenarioComon/SelectCustom";
import CheckboxCustom from "./ScenarioSetting/scenarioComon/CheckboxCustom";
import InputCustom from "./ScenarioSetting/scenarioComon/InputCustom";
import { Button } from "reactstrap";
import ModalNoti from "../../../views/Popup/ModalNoti";
import ModalPreviewBot from '../../../views/Popup/ModalPreviewBot';
import {
  Checkbox,
  Radio,
  Slider,
  Calendar,
  Row,
  Select,
  Typography,
  Col,
  Input,
} from "antd";
import moment from "moment";
import cvcIcon from "../../../assets/img/cvc-icon.png";
import messageTypingGif from "../../../assets/img/icons8-dots-loading.gif";
import $ from "jquery";
import DatePickerCustom from "./ScenarioSetting/scenarioComon/DatePickerCustom";
import InputNum from "./ScenarioSetting/scenarioComon/InputNum";
import { tokenExpired } from "api/tokenExpired";
import american_express from "../../../assets/img/payment-method/american_express.png";
import diner_club from "../../../assets/img/payment-method/diner_club.png";
import discover from "../../../assets/img/payment-method/discover.png";
import jcb from "../../../assets/img/payment-method/jcb.png";
import master_card from "../../../assets/img/payment-method/master_card.png";
import visa from "../../../assets/img/payment-method/visa.png";
import { SHORTEN_URL, EC_CHATBOT_URL, log } from "../../../variables/constants";
import locale from "antd/es/date-picker/locale/ja_JP";
import "moment/locale/zh-cn";
import { rgbToHex } from "@material-ui/core";
import iconMessageBlue from "../../../assets/img/icon-mess/icon-message-chat-blue.png";
import iconMessageGreen from "../../../assets/img/icon-mess/icon-message-chat-green.png";
import iconMessageOrange from "../../../assets/img/icon-mess/icon-message-chat-orange.png";
import iconMessageYellow from "../../../assets/img/icon-mess/icon-message-chat-yellow.png";
import iconMessagePink from "../../../assets/img/icon-mess/icon-message-chat-pink.png";
import iconMessagePurple from "../../../assets/img/icon-mess/icon-message-chat-purple.png";
import iconMessageBlack from "../../../assets/img/icon-mess/icon-message-chat-black.png";
import iconMessageWhite from "../../../assets/img/icon-mess/icon-message-chat-white.png";

const _ = require("lodash");

let dataHourFixed = [];
for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    dataHourFixed.push({
      key: `0${i}` + "",
      value: `0${i}` + "",
    });
  } else {
    dataHourFixed.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataMinutes = [];
for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    dataMinutes.push({
      key: `0${i}` + "",
      value: `0${i}` + "",
    });
  } else {
    dataMinutes.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataYearFixed = [];
for (let i = 1935; i <= 2072; i++) {
  dataYearFixed.push({
    key: i + "",
    value: i + "",
  });
}

let dataMonth = [];
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    dataMonth.push({
      key: `0${i}` + "",
      value: `0${i}` + "",
    });
  } else {
    dataMonth.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataDay = [];
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    dataDay.push({
      key: `0${i}` + "",
      value: `0${i}` + "",
    });
  } else {
    dataDay.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataEveryMinute = [
  {
    key: "00",
    value: "00",
  },
  {
    key: "05",
    value: "05",
  },
  {
    key: "10",
    value: "10",
  },
  {
    key: "15",
    value: "15",
  },
  {
    key: "30",
    value: "30",
  },
];

let dataPaymentMethod = [
  {
    key: "visa",
    value: <img src={visa} />,
  },
  {
    key: "jcb",
    value: <img src={jcb} />,
  },
  {
    key: "master_card",
    value: <img src={master_card} />,
  },
  {
    key: "american_express",
    value: <img src={american_express} />,
  },
  {
    key: "diner_club",
    value: <img src={diner_club} />,
  },
  {
    key: "discover",
    value: <img src={discover} />,
  },
];

let SCAN_REGEX = /\{\{(.*?)\}\}/g;

var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);

function Preview() {
  const [isOpen, setIsOpen] = useState(false);
  const [urlSend, setUrlSend] = useState();
  const [urlReceive, setUrlReceive] = useState();
  const [deviceReceive, setDeviceReceive] = useState();
  const [uuid, setUuid] = useState(params.get("uuid"));
  const [botId, setBotId] = useState(Cookies.get("bot_id"));
  const [scenarioId, setScenarioId] = useState(params.get("scenario_id"));
  const [botInfor, setBotInfor] = useState();
  const [dataMessages, setDataMessages] = useState([]);
  const [urlThanksPage, setUrlThanksPage] = useState();
  const [indexMessageRender, setIndexMessageRender] = useState(0);
  const [renderMessageArr, setRenderMessageArr] = useState([]);
  const [indexUser, setIndexUser] = useState(0);
  const [messageUser, setMessageUser] = useState([]);
  const [errors, setErrors] = useState({});
  const [variables, setVariables] = useState([]);
  const [isDisplayButtonNext, setIsDisplayButtonNext] = useState(false);
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
  const [widthPc, setWidthPc] = useState(380);
  const [heightPc, setHeightPc] = useState(600);
  const [widthSp, setWidthSp] = useState(100);
  const [heightSp, setHeightSp] = useState(600);
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
          width: widthSp ? `${widthSp}%` : "80%",
          height: heightSp ? `${heightSp}px` : "580px"
       }
    } else {
      return {
        bottom: bottomMarginPc ? `${bottomMarginPc}px` : "10px",
        right: rightMarginPc ? `${rightMarginPc}px` : "30px",
        width: widthPc ? `${widthPc}px` : "380px",
        height: heightPc ? `${heightPc}px` : "600px"
     }
    }
  }

  function mobileCheck() {
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

  //get chat bot setting
  useEffect(() => {
    let botIdGet = params.get("bot_id");
    api.get(`/api/v1/managements/chatbots/${botIdGet}`).then((response) => {
      if (response.data.data) {
        const result = JSON.parse(response.data.data?.design_settings);
        setActivePopupCloseBot(result?.popup_close_bot ? true : false);
        setTitleBubble(result?.title_bubble ? result?.title_bubble : "簡単90秒で注文完了");
        setDisplayType(result?.display_type);
        setWidthPc(result?.width_pc? result?.width_pc: 380);
        setHeightPc(result?.height_pc? result?.height_pc:600);
        setWidthSp(result?.width_sp?result?.width_sp:80);
        setHeightSp(result?.height_sp?result?.height_sp:580);
        setPositionPc(result?.position_pc ? result?.position_pc : "1");
        if (result?.display_type && result?.display_type ==='1'){
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
        sessionStorage.setItem("chatbotH", result?.height_pc? result?.height_pc: 600);
        sessionStorage.setItem("chatbotBottom", result?.bottom_margin_pc? result?.bottom_margin_pc:10);
        sessionStorage.setItem("chatbotW", result?.width_pc? result?.width_pc:380);
        sessionStorage.setItem("chatbotRight", result?.right_margin_pc? result?.right_margin_pc : 30);
        setRightPcTitle(result?.right_position_pc_title);
        setButtonTypePc(result?.button_type_pc? result?.button_type_pc: "1");
        setRightMarginPc(result?.right_margin_pc?result?.right_margin_pc:10);
        setBottomMarginPc(result?.bottom_margin_pc?result?.bottom_margin_pc:0);
        setPositionSp(result?.position_sp? result?.position_sp:"1");
        setButtonTypeSp(result?.button_type_sp?result?.button_type_sp:"2");
        setRightSpTitle(
          JSON.parse(response.data.data?.design_settings)
            ?.right_position_sp_title
        );
        setRightMarginSp(result?.right_margin_sp);
        setBottomMarginSp(result?.bottom_margin_sp);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data === 'openPreview') {
          onOpenPreview(true)
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
      window.parent.postMessage(isOpen, urlReceive);
    }
  }, [isOpen, urlReceive])

  function getAllUrlParams(url) {
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
  }

  function handleCloseBot() {
    if (document.getElementById("sp-container1")) {
      
      Cookies.set("openPre", true);
      if (window && window.parent) {
        window.parent.postMessage(false, urlReceive);
      }
      document.getElementById("sp-container1").style.height = heightPc
        ? `${heightPc}px`
        : "600px";
      document.getElementById("sp-header").style.position = "static";
      document.getElementById("sp-header").style.borderBottomLeftRadius =
        "0px";
      document.getElementById("sp-header").style.borderBottomRightRadius =
        "0px";
      document.getElementById("sp-header").style.borderTopLeftRadius = "2px";
      document.getElementById("sp-header").style.borderTopRightRadius = "2px";
      document.getElementById("sp-process-bar").style.display = "block";
      document.getElementById("sp-body").style.display = "block";
    } 
    setIsOpen(false);
    setShowPopupCloseBot(false);
  }

  function onOpenPreview() {
    if (document.getElementById("sp-container1")) {
      if (activePopupCloseBot) {
        setShowPopupCloseBot(true)
        return;
      }
      if (isOpen && !activePopupCloseBot) {
        Cookies.set("openPre", true);
        if (window && window.parent) {
          window.parent.postMessage(true, urlReceive);
        }
        document.getElementById("sp-container1").style.height = heightPc
          ? `${heightPc}px`
          : "600px";
        document.getElementById("sp-header").style.position = "static";
        document.getElementById("sp-header").style.borderBottomLeftRadius =
          "0px";
        document.getElementById("sp-header").style.borderBottomRightRadius =
          "0px";
        document.getElementById("sp-header").style.borderTopLeftRadius = "2px";
        document.getElementById("sp-header").style.borderTopRightRadius = "2px";
        document.getElementById("sp-process-bar").style.display = "block";
        document.getElementById("sp-body").style.display = "block";
      } 
      }
    setIsOpen(!isOpen);
  }

  // useEffect(() => {
  //   api.get(`/api/v1/managements/chatbots/${botId}`).then(res => {
  //     if (res.data.code == 1) {
  //       setBotInfor(res.data.data);
  //     }
  //   }).catch(err => console.log(err));
  // }, [])

  useEffect(() => {
    api
      .get(`/api/v1/prefectures`)
      .then((res) => {
        setDataPrefectures(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  useEffect(() => {
    let delayRender;
    if (scenarioId) {
      // var url = new URL(window.location.href)
      // let params = new URLSearchParams(url.search);
      let botIdGet = params.get("bot_id"); // 'chrome-instant'
      let urlRe = params.get("urlReceive"); // 'chrome-instant'
      let deviceRe = params.get("deviceReceive"); // 'chrome-instant'
      let scenarioIdGet = params.get("scenario_id"); // 'mdn query string'
      setUrlSend(url.href);
      setUrlReceive(urlRe);
      setDeviceReceive(deviceRe);
      setBotId(botIdGet);
      // setScenarioId(scenarioIdGet)
      api
        .get(
          `/api/v1/managements/chatbots/${botIdGet}/scenarios/${scenarioIdGet}/preview`
        )
        .then(async (res) => {
          if (res.data.code == 1) {
            let messageArr = [];
            if (res.data.data?.conversation?.messages?.length > 0) {
              messageArr = [...res.data.data?.conversation?.messages];
            }
            let urlThanks = res.data.data?.conversation?.urlThanksPage || "";

            let variablesAll = res.data?.all_variables || [];
            setDataVariables(variablesAll);

            setDataMessages(messageArr);
            setUrlThanksPage(urlThanks);
            if (res.data.chatbot) {
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
                opacity_color = "#ECEDE8";
                message_color = "#fff";
                font_color = "#333333";
                icon_mess = iconMessageBlack;
              } else if (res.data.chatbot.main_color === "white") {
                opacity_color = "#fff";
                message_color = "#F5F5F5";
                font_color = "#000";
                icon_mess = iconMessageWhite;
              }
              res.data.chatbot.opacity_color = opacity_color;
              res.data.chatbot.message_color = message_color;
              res.data.chatbot.font_color = font_color;
              res.data.chatbot.icon_mess = icon_mess;
            }

            setBotInfor(res.data.chatbot);
            if (res.data.variables) {
              setVariables([...res.data.variables, ...variablesAll]);
              res.data.variables.forEach((item) => {
                objParam[item.variable_name] = item.default_value;
              });
            }

            setObjParam({ ...objParam });
            let variables = [...res.data.variables];
            let messageUserVar = messageArr.filter(
              (item) =>
                item.belong_to === "user" && item.message_content.length > 0
            );
            setMessageUser([...messageUserVar]);
            let renderMessage = [];
            let index;
            let isPauseScroll = false;
            for (let i = 0; i < messageArr.length; i++) {
              if (messageArr[i].hidden !== true) {
                if (messageArr[i].conditions?.length > 0) {
                  var checked = true;
                  for (let j = 0; j < messageArr[i].conditions.length; j++) {
                    let conditionItem = messageArr[i].conditions[j];
                    if (j === 0) {
                      if (conditionItem.condition === "include") {
                        checked = objParam[
                          conditionItem.nameCondition
                        ].includes(conditionItem.inputCondition);
                      } else if (conditionItem.condition === "is") {
                        checked =
                          objParam[conditionItem.nameCondition] ==
                          conditionItem.inputCondition;
                      } else if (conditionItem.condition === "not_include") {
                        checked = !objParam[
                          conditionItem.nameCondition
                        ].includes(conditionItem.inputCondition);
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
                  if (checked === false) {
                    if (messageArr[i].belong_to === "user")
                      setIndexUser((prev) => prev + 1);
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
                        setRenderMessageArr([...renderMessage]);
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
                          setIndexMessageRender(i);
                          renderMessage.pop();
                          renderMessage.push({});
                          setRenderMessageArr([...renderMessage]);
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
                    } else {
                      await new Promise((resolve) => {
                        return (delayRender = setTimeout(() => {
                          resolve();
                        }, messageArr[i]?.message_content[0]?.delay?.content * 1000));
                      })
                        .then(() => {
                          setIndexMessageRender(i);
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
                      .then((res) => {})
                      .catch((error) => {
                        console.log(error);
                        if (error.response?.data.code === 0) {
                          tokenExpired();
                        }
                      });
                    renderMessage.push({});
                    setRenderMessageArr([...renderMessage]);
                    setIndexMessageRender(i);
                    index = i;
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
                      setVariables([...variables]);
                    }
                    renderMessage.push({});
                    setRenderMessageArr([...renderMessage]);
                    setIndexMessageRender(i);
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
                      setVariables([...variables]);
                    }
                    renderMessage.push({});
                    setRenderMessageArr([...renderMessage]);
                    setIndexMessageRender(i);
                    index = i;
                  } else if (
                    messageArr[i]?.message_content[0]?.type === "pause"
                  ) {
                    renderMessage.push({});
                    setRenderMessageArr([...renderMessage]);
                    setIndexMessageRender(i);
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
                                `https://svg-captcha-nodejs.vercel.app/captcha?size=${
                                  messageArr[i].message_content[j][
                                    messageArr[i].message_content[j].type
                                  ].length
                                }${
                                  messageArr[i].message_content[j][
                                    messageArr[i].message_content[j].type
                                  ].colour
                                    ? "&color=true"
                                    : ""
                                }&charPreset=${
                                  messageArr[i].message_content[j][
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
                        setIndexMessageRender(i);
                        setRenderMessageArr([...renderMessage]);
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
                    setIndexUser((prev) => prev + 1);
                    index = i;
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
                        setIndexMessageRender(i);
                        renderMessage.push(data);
                        setRenderMessageArr([...renderMessage]);
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
                              `https://svg-captcha-nodejs.vercel.app/captcha?size=${
                                messageArr[i].message_content[j][
                                  messageArr[i].message_content[j].type
                                ].length
                              }${
                                messageArr[i].message_content[j][
                                  messageArr[i].message_content[j].type
                                ].colour
                                  ? "&color=true"
                                  : ""
                              }&charPreset=${
                                messageArr[i].message_content[j][
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
                    setIndexMessageRender(i);
                    renderMessage.push(data);
                    setRenderMessageArr([...renderMessage]);
                    if (isPauseScroll === false) {
                      scrollToBottom();
                    }
                  });
                  setIndexUser((prev) => prev + 1);
                  index = i;
                  break;
                }
                // }
              }
            }
            // setIndexMessageRender(index);
            // setRenderMessageArr(renderMessage);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
    return () => {
      clearTimeout(delayRender);
    };
  }, [scenarioId]);

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

  const stringNullOrEmpty = (string) => {
    if (
      string === undefined ||
      string === null ||
      (string && (string + "")?.trim() === "") ||
      string === ""
    )
      return true;
    return false;
  };

  const handleValidateField = (index) => {
    let contentArr = [...renderMessageArr[index].message_content];
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
            // else if (contentType[contentType.type].valueLeft?.length < limitFrom
            //   || contentType[contentType.type].valueLeft?.length > limitTo
            //   || contentType[contentType.type].valueRight?.length < limitFrom
            //   || contentType[contentType.type].valueRight?.length > limitTo) {
            //   errorsMess[`message${index}_content${i}_${contentArr[i].type}_${contentType.type}`] = `${limitFrom}文字以上${limitTo}文字以下にしてください。`;
            //   isValid = false;
            // }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[
              `message${index}_content${i}_${contentArr[i].type}_${contentType.type}`
            ] = messageError;
            isValid = false;
          }
          //  else if (contentType[contentType.type].value.length < limitFrom || contentType[contentType.type].value.length > limitTo) {
          //   errorsMess[`message${index}_content${i}_${contentArr[i].type}_${contentType.type}`] = `${limitFrom}文字以上${limitTo}文字以下にしてください。`;
          //   isValid = false;
          // }
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
          errors[
            `message${index}_content${i}_${contentArr[i].type}`
          ] &&
          errors[
            `message${index}_content${i}_${contentArr[i].type}`
          ] !== messageError
        ) {
          errorsMess[
            `message${index}_content${i}_${contentArr[i].type}`
          ] =
            errors[
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
              } else if (stringNullOrEmpty(contentType.value_post_code) ) {
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
              `${contentType[contentType.type].value1}${
                contentType[contentType.type].value2
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
        errors[`message${index}_content${i}_${contentArr[i].type}`]
      ) {
        errorsMess[
          `message${index}_content${i}_${contentArr[i].type}`
        ] =
          errors[
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
            messageLog = "数字を入力してください。";
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
            REGEX_CHECK = /[^ァ-ンぁ-んｧ-ﾝﾞﾟ]+$/;
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
    setErrors({
      ...errorsMess,
    });
    return isValid;
  };

  const setMessagesSessionStorage = (data) => {
    const temp = getMessagesSessionStorage()
    const bot_id = objParam.bot_id || Number(objParam?.current_url_param?.bot_id)
    sessionStorage.setItem(`messages_bot_${bot_id}`, JSON.stringify(dataMessages.map(x => {
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

  const onClickNext = async (indexMessage, message) => {
    let indexClickLocation = indexMessageRender
    for (let i = 0; i < dataMessages.length; i++) {
      if (dataMessages[i]?.id === message?.id) {
        indexClickLocation = i
        break
      }
    }

    if (!handleValidateField(indexClickLocation)) {
      return;
    }
    let renderMessage = [...renderMessageArr];
    renderMessageArr[indexMessage].disabled = true;
    setRenderMessageArr(renderMessageArr)
    let index;
    let isPauseScroll = false;
    let delayRender;
    if (indexClickLocation === indexMessageRender) setIndexUser(prev => prev + 1);
    let data_submit = {
      scenario_id: scenarioId,
      message: renderMessageArr[indexMessage],
      user_id: uuid,
      bot_type: "web"
    };
    if (dataMessages[indexClickLocation].message_content[0]?.text_input?.save_input_content === "create_order") {
      await new Promise((resolve) => {
        api
          .post(`/api/v1/scenario_users/scenario_user_responses`, data_submit)
          .then((res) => {
            setMessagesSessionStorage(renderMessageArr[indexMessage])
            resolve();
          })
          .catch((error) => {
            console.log(error);
            if (error.response?.data.code === 0) {
              tokenExpired();
            }
          });
      }).then(() => {
        api
          .post(
            `/api/v1/scenario_users/scenario_user_responses/create_order`,
            data_submit
          )
          .then((res) => {
            const conversion = {
              scenario_data: `${deviceReceive}_conversion`,
            };
            api.patch(`/api/v1/analytics/scenario_counts/${scenarioId}`, conversion).then(res => {
            }).catch(err => {
              console.log(err)
            })
          })
          .catch((error) => {
            console.log(error);
            if (error.response?.data.code === 0) {
              tokenExpired();
            }
          });
      });
    }
    if (dataMessages.length - 1 === indexClickLocation) {
      await new Promise((resolve) => {
        api
          .post(`/api/v1/scenario_users/scenario_user_responses`, data_submit)
          .then((res) => {
            setMessagesSessionStorage(renderMessageArr[indexMessage])
            resolve();
          })
          .catch((error) => {
            console.log(error);
            if (error.response?.data.code === 0) {
              tokenExpired();
            }
          });
      }).then(() => {
        api
          .post(
            `/api/v1/scenario_users/scenario_user_responses/create_order`,
            data_submit
          )
          .then((res) => {
            const conversion = {
              scenario_data: `${deviceReceive}_conversion`,
            };
            api.patch(`/api/v1/analytics/scenario_counts/${scenarioId}`, conversion).then(res => {
            }).catch(err => {
              console.log(err)
            })
          
            // api.post(`/api/v1/managements/payment_histories`, data_submit).then((res)=>{}).catch((err) => {
            //   console.log(err);
            // if (err.response?.data.code === 0) {
            //   tokenExpired();
            // }
            // })
          })
          .catch((error) => {
            console.log(error);
            if (error.response?.data.code === 0) {
              tokenExpired();
            }
          });
      });
      if (urlThanksPage) {
        setTimeout(() => {
          window.parent.location.href = urlThanksPage;
        }, 2000);
      }

      for (let i = 0; i < renderMessage.length; i++) {
        renderMessage[i].disabled = true;
      }
      return setRenderMessageArr(renderMessage)
    }
    await api
      .post(`/api/v1/scenario_users/scenario_user_responses`, data_submit)
      .then((res) => {
        setMessagesSessionStorage(renderMessageArr[indexMessage])
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });

    if (!dataMessages[indexMessageRender + 1] || indexMessageRender > indexClickLocation) {
      renderMessage[indexMessage].disabled = false
      setRenderMessageArr(renderMessage)
      return;
    }

    if (dataMessages[indexMessageRender + 1].belong_to === 'user' || dataMessages[indexMessageRender + 1].belong_to === 'bot') {
      for (let i = indexMessageRender + 1; i < dataMessages.length; i++) {
        if (dataMessages[i].hidden !== true) {
          if (dataMessages[i].conditions) {
            var checked = true;
            for (let j = 0; j < dataMessages[i].conditions.length; j++) {
              let conditionItem = dataMessages[i].conditions[j];
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
            if (checked === false) {
              if (dataMessages[i].belong_to === "user")
                setIndexUser((prev) => prev + 1);
              continue;
            }
          }
          if (dataMessages[i].belong_to === "bot") {
            if (dataMessages[i]?.message_content[0].type === "delay") {
              if (dataMessages[i]?.message_content[0]?.delay.typing_on) {
                await new Promise((resolve) => {
                  renderMessage.push({ ...dataMessages[i] });
                  setRenderMessageArr([...renderMessage]);
                  resolve();
                })
                  .then(async () => {
                    await new Promise((resolve) => {
                      delayRender = setTimeout(() => {
                        resolve();
                      }, dataMessages[i]?.message_content[0].delay.content * 1000);
                    });
                  })
                  .then(() => {
                    setIndexMessageRender(i);
                    renderMessage.pop();
                    renderMessage.push({});
                    setRenderMessageArr([...renderMessage]);
                  })
                  .then(() => {
                    if (dataMessages.length - 1 === i && urlThanksPage) {
                      let aTag = document.createElement("a");
                      aTag.href = urlThanksPage;
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
                  }, dataMessages[i]?.message_content[0]?.delay?.content * 1000));
                }).then(() => {
                  if (dataMessages.length - 1 === i && urlThanksPage) {
                    let aTag = document.createElement("a");
                    aTag.href = urlThanksPage;
                    aTag.target = "_blank";

                    setTimeout(() => {
                      aTag.click();
                    }, 2000);
                  }
                });
              }
              // promise.then(data => {
              //   renderMessage.push(data);
              //   setRenderMessageArr([
              //     ...renderMessage
              //   ]);
              // })
            } else if (dataMessages[i]?.message_content[0]?.type === "email") {
              let emailId =
                dataMessages[i]?.message_content[0][
                  dataMessages[i]?.message_content[0].type
                ].contentId;
              let variablesData = {};
              dataVariables.forEach((item) => {
                variablesData[item.variable_name] = item.default_value;
              });

              variables.forEach((item) => {
                variablesData[item.variable_name] = item.default_value;
              });

              let data = {
                variables: variablesData,
              };
              renderMessage.push({});
              setRenderMessageArr([...renderMessage]);

              api
                .post(`/api/v1/managements/emails/${emailId}/send_email`, data)
                .then((res) => {})
                .catch((error) => {
                  console.log(error);
                  if (error.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
              setIndexMessageRender(i);
              index = i;
            } else if (
              dataMessages[i]?.message_content[0]?.type === "variable_set"
            ) {
              if (variables.length !== 0) {
                let dataVarExist =
                  dataMessages[i]?.message_content[0][
                    dataMessages[i]?.message_content[0].type
                  ].variables;
                variables.forEach((item) => {
                  for (let z = 0; z < dataVarExist.length; z++) {
                    if (item.variable_name === dataVarExist[z].key) {
                      item.default_value = dataVarExist[z].value;
                    }
                  }
                });
                setVariables([...variables]);
              }
              renderMessage.push({});
              setRenderMessageArr([...renderMessage]);
              setIndexMessageRender(i);
              index = i;
            } else if (
              dataMessages[i]?.message_content[0]?.type === "clear_variable"
            ) {
              if (variables.length !== 0) {
                let dataVarExist =
                  dataMessages[i]?.message_content[0][
                    dataMessages[i]?.message_content[0].type
                  ].variables;
                variables.forEach((item) => {
                  for (let z = 0; z < dataVarExist.length; z++) {
                    if (item.variable_name === dataVarExist[z]) {
                      item.default_value = "";
                    }
                  }
                });
                setVariables([...variables]);
              }
              renderMessage.push({});
              setRenderMessageArr([...renderMessage]);
              setIndexMessageRender(i);
              index = i;
            } else if (dataMessages[i]?.message_content[0]?.type === "pause") {
              renderMessage.push({});
              setRenderMessageArr([...renderMessage]);
              setIndexMessageRender(i);
              index = i;
              break;
            } else {
              await new Promise((resolve) => {
                return (delayRender = setTimeout(() => {
                  if (
                    dataMessages[i].message_content[0].type === "text_input" &&
                    dataMessages[i].message_content[0].text_input.content
                  ) {
                    dataMessages[i].message_content[0].text_input.content =
                      dataMessages[
                        i
                      ].message_content[0].text_input.content.replaceAll(
                        SCAN_REGEX,
                        (text, variable) => {
                          if (variables.length !== 0) {
                            let valueVar = "";
                            for (let j = 0; j < variables.length; j++) {
                              if (variables[j].variable_name === variable) {
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
                  resolve({ ...dataMessages[i] });
                }, 1000));
              })
                .then((data) => {
                  setIndexMessageRender(i);
                  renderMessage.push(data);
                  setRenderMessageArr([...renderMessage]);
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
                  if (dataMessages[i].message_content[0]?.text_input?.save_input_content === "create_order") {
                    data_submit = {
                      scenario_id: scenarioId,
                      user_id: uuid,
                    };

                    api
                      .post(
                        `/api/v1/scenario_users/scenario_user_responses/create_order`,
                        data_submit
                      )
                      .then((res) => {})
                      .catch((error) => {
                        console.log(error);
                        if (error.response?.data.code === 0) {
                          tokenExpired();
                        }
                      });

                  }
                  if (dataMessages.length - 1 === i) {
                    data_submit = {
                      scenario_id: scenarioId,
                      user_id: uuid,
                    };
                    api
                      .post(
                        `/api/v1/scenario_users/scenario_user_responses/create_order`,
                        data_submit
                      )
                      .then((res) => {
                        // api.post(`/api/v1/managements/payment_histories`, data_submit).then((res)=>{}).catch((err) => {
                        //   console.log(err);
                        // if (err.response?.data.code === 0) {
                        //   tokenExpired();
                        // }
                        // })
                      })
                      .catch((error) => {
                        console.log(error);
                        if (error.response?.data.code === 0) {
                          tokenExpired();
                        }
                      });

                    if (urlThanksPage) {
                      let aTag = document.createElement("a");
                      aTag.href = urlThanksPage;
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
            dataMessages[i].belong_to === "user" &&
            dataMessages[i].message_content.length > 0
          ) {
            await new Promise((resolve) => {
              return (delayRender = setTimeout(() => {
                for (
                  let j = 0;
                  j < dataMessages[i].message_content.length;
                  j++
                ) {
                  if (dataMessages[i].message_content[j].type === "capture") {
                    api
                      .get(
                        `https://svg-captcha-nodejs.vercel.app/captcha?size=${
                          dataMessages[i].message_content[j][
                            dataMessages[i].message_content[j].type
                          ].length
                        }${
                          dataMessages[i].message_content[j][
                            dataMessages[i].message_content[j].type
                          ].colour
                            ? "&color=true"
                            : ""
                        }&charPreset=${
                          dataMessages[i].message_content[j][
                            dataMessages[i].message_content[j].type
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
                  } else if (dataMessages[i].message_content[j].type === "label" &&
                    dataMessages[i].message_content[j].label.lbl_content) {
                    dataMessages[i].message_content[j].label.lbl_content =
                      dataMessages[
                        i
                      ].message_content[j].label.lbl_content.replaceAll(
                        SCAN_REGEX,
                        (text, variable) => {
                          if (variables.length !== 0) {
                            let valueVar = "";
                            for (let k = 0; k < variables.length; k++) {
                              if (variables[k].variable_name === variable) {
                                valueVar = variables[k].default_value;
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
                resolve({ ...dataMessages[i] });
              }, 1000));
            }).then((data) => {
              setIndexMessageRender(i);
              const dataSessionStorage = getMessagesSessionStorage()
              if (dataSessionStorage) {
                const temp = dataSessionStorage.find(x => x.id === data.id)
                if (temp) data.message_content = [...temp.message_content]
              }
              renderMessage.push(data);
              setRenderMessageArr([...renderMessage]);
              if (isPauseScroll === false) {
                scrollToBottom();
              }
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
        dataMessages[indexMessageRender + 1].message_content.length > 0 &&
        dataMessages[indexMessageRender + 1].hidden !== true
      ) {
        await new Promise((resolve) => {
          return (delayRender = setTimeout(() => {
            for (
              let j = 0;
              j < dataMessages[indexMessageRender + 1].message_content.length;
              j++
            ) {
              if (
                dataMessages[indexMessageRender + 1].message_content[j].type ===
                "capture"
              ) {
                api
                  .get(
                    `https://svg-captcha-nodejs.vercel.app/captcha?size=${
                      dataMessages[indexMessageRender + 1].message_content[j][
                        dataMessages[indexMessageRender + 1].message_content[j]
                          .type
                      ].length
                    }${
                      dataMessages[indexMessageRender + 1].message_content[j][
                        dataMessages[indexMessageRender + 1].message_content[j]
                          .type
                      ].colour
                        ? "&color=true"
                        : ""
                    }&charPreset=${
                      dataMessages[indexMessageRender + 1].message_content[j][
                        dataMessages[indexMessageRender + 1].message_content[j]
                          .type
                      ].type
                    }`
                  )
                  .then((res) => {
                    captcha.push({
                      index: indexMessageRender + 1,
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
                  if (variables.length !== 0) {
                      let valueVar = "";
                      for (let j = 0; j < variables.length; j++) {
                          if (variables[j].variable_name === variable) {
                              valueVar = variables[j].default_value;
                          }
                      }
                      return valueVar;
                  } else {
                      return "";
                  }
              })
              return content;
            }
            dataMessages[indexMessageRender + 1].message_content.forEach((item, index) => {
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
              dataMessages[indexMessageRender + 1].message_content[index] = item;
            })
            resolve({ ...dataMessages[indexMessageRender + 1] });
          }, 1000));
        }).then((data) => {
          setIndexMessageRender(indexMessageRender + 1);
          renderMessage.push(data);
          setRenderMessageArr([...renderMessage]);
          if (isPauseScroll === false) {
            scrollToBottom();
          }
        });
        // index = indexMessageRender + 1;
      }
      //if message_content.length === 0 => loop until meet message have message_content.length !== 0 => show message
      else {
        for (let i = indexMessageRender + 1; i < dataMessages.length; i++) {
          if (
            dataMessages[i].message_content.length > 0 &&
            dataMessages[i].hidden !== true
          ) {
            if (dataMessages[i].belong_to === "user") {
              await new Promise((resolve) => {
                return (delayRender = setTimeout(() => {
                  for (
                    let j = 0;
                    j < dataMessages[i].message_content.length;
                    j++
                  ) {
                    if (dataMessages[i].message_content[j].type === "capture") {
                      api
                        .get(
                          `https://svg-captcha-nodejs.vercel.app/captcha?size=${
                            dataMessages[i].message_content[j][
                              dataMessages[i].message_content[j].type
                            ].length
                          }${
                            dataMessages[i].message_content[j][
                              dataMessages[i].message_content[j].type
                            ].colour
                              ? "&color=true"
                              : ""
                          }&charPreset=${
                            dataMessages[i].message_content[j][
                              dataMessages[i].message_content[j].type
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
                  resolve({ ...dataMessages[i] });
                }, 1000));
              }).then((data) => {
                setIndexMessageRender(i);
                renderMessage.push(data);
                setRenderMessageArr([...renderMessage]);
                if (isPauseScroll === false) {
                  scrollToBottom();
                }
              });
              index = i;
              break;
            } else {
              if (dataMessages[i]?.message_content[0].type === "delay") {
                if (dataMessages[i]?.message_content[0]?.delay.typing_on) {
                  await new Promise((resolve) => {
                    renderMessage.push({ ...dataMessages[i] });
                    setRenderMessageArr([...renderMessage]);
                    resolve();
                  })
                    .then(async () => {
                      await new Promise((resolve) => {
                        delayRender = setTimeout(() => {
                          resolve();
                        }, dataMessages[i]?.message_content[0].delay.content * 1000);
                      });
                    })
                    .then(() => {
                      setIndexMessageRender(i);
                      renderMessage.pop();
                      renderMessage.push({});
                      setRenderMessageArr([...renderMessage]);
                    });
                } else {
                  await new Promise((resolve) => {
                    return (delayRender = setTimeout(() => {
                      resolve();
                    }, dataMessages[i]?.message_content[0]?.delay?.content * 1000));
                  });
                }
                index = i;
              } else if (
                dataMessages[i]?.message_content[0]?.type === "email"
              ) {
                let emailId =
                  dataMessages[i]?.message_content[0][
                    dataMessages[i]?.message_content[0].type
                  ].contentId;
                let variablesData = {};
                dataVariables.forEach((item) => {
                  variablesData[item.variable_name] = item.default_value;
                });

                variables.forEach((item) => {
                  variablesData[item.variable_name] = item.default_value;
                });

                let data = {
                  variables: variablesData,
                };
                renderMessage.push({});
                setRenderMessageArr([...renderMessage]);

                api
                  .post(
                    `/api/v1/managements/emails/${emailId}/send_email`,
                    data
                  )
                  .then((res) => {})
                  .catch((error) => {
                    console.log(error);
                    if (error.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
                setIndexMessageRender(i);
                index = i;
              } else if (
                dataMessages[i]?.message_content[0]?.type === "variable_set"
              ) {
                if (variables.length !== 0) {
                  let dataVarExist =
                    dataMessages[i]?.message_content[0][
                      dataMessages[i]?.message_content[0].type
                    ].variables;
                  variables.forEach((item) => {
                    for (let z = 0; z < dataVarExist.length; z++) {
                      if (item.variable_name === dataVarExist[z].key) {
                        item.default_value = dataVarExist[z].value;
                      }
                    }
                  });
                  setVariables([...variables]);
                }
                renderMessage.push({});
                setRenderMessageArr([...renderMessage]);
                setIndexMessageRender(i);
                index = i;
              } else if (
                dataMessages[i]?.message_content[0]?.type === "clear_variable"
              ) {
                if (variables.length !== 0) {
                  let dataVarExist =
                    dataMessages[i]?.message_content[0][
                      dataMessages[i]?.message_content[0].type
                    ].variables;
                  variables.forEach((item) => {
                    for (let z = 0; z < dataVarExist.length; z++) {
                      if (item.variable_name === dataVarExist[z]) {
                        item.default_value = "";
                      }
                    }
                  });
                  setVariables([...variables]);
                }
                renderMessage.push({});
                setRenderMessageArr([...renderMessage]);
                setIndexMessageRender(i);
                index = i;
              } else if (
                dataMessages[i]?.message_content[0]?.type === "pause"
              ) {
                renderMessage.push({});
                setRenderMessageArr([...renderMessage]);
                setIndexMessageRender(i);
                index = i;
                break;
              } else {
                await new Promise((resolve) => {
                  return (delayRender = setTimeout(() => {
                    if (
                      dataMessages[i].message_content[0].type ===
                        "text_input" &&
                      dataMessages[i].message_content[0].text_input.content
                    ) {
                      dataMessages[i].message_content[0].text_input.content =
                        dataMessages[
                          i
                        ].message_content[0].text_input.content.replaceAll(
                          SCAN_REGEX,
                          (text, variable) => {
                            if (variables.length !== 0) {
                              let valueVar = "";
                              for (let j = 0; j < variables.length; j++) {
                                if (variables[j].variable_name === variable) {
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
                    resolve({ ...dataMessages[i] });
                  }, 1000));
                }).then((data) => {
                  setIndexMessageRender(i);
                  renderMessage.push(data);
                  setRenderMessageArr([...renderMessage]);
                  if (isPauseScroll === false) {
                    scrollToBottom();
                  }
                });
              }
            }
          } else {
            renderMessage.push({});
            setRenderMessageArr([...renderMessage]);
          }
        }
      }
    }

    renderMessageArr[indexMessage].disabled = false;
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
    let index = indexMessageRender

    if (message) {
      for (let i = 0; i < dataMessages.length; i++) {
        if (dataMessages[i]?.id === message?.id) {
          index = i
          break
        }
      }
    }

    if (name) {
      if (
        dataMessages[index].message_content[indexContent][
          contentType
        ][field][subFiled] === undefined
      ) {
        dataMessages[index].message_content[indexContent][
          contentType
        ][field][subFiled] = {};
      }
      dataMessages[index].message_content[indexContent][
        contentType
      ][field][subFiled][name] = value;
    } else if (subFiled) {
      if (
        dataMessages[index].message_content[indexContent][
          contentType
        ][field] === undefined
      ) {
        dataMessages[index].message_content[indexContent][
          contentType
        ][field] = {};
      }
      dataMessages[index].message_content[indexContent][
        contentType
      ][field][subFiled] = value;
    } else if (field) {
      if (
        dataMessages[index].message_content[indexContent][
          contentType
        ] === undefined
      ) {
        dataMessages[index].message_content[indexContent][
          contentType
        ] = {};
      }
      dataMessages[index].message_content[indexContent][
        contentType
      ][field] = value;
    }

    if (
      contentType === "product_purchase" &&
      field === "initial_selection" &&
      value.length > 0
    ) {
      let dataContentType = {
        ...dataMessages[index].message_content[indexContent][
          contentType
        ],
      };

      let arrayCode = [];
      let arrayName = [];
      let arrayPrice = [];
      let arrayOrderQuantity = [];

      for (let i = 0; i < dataContentType.products?.length; i++) {
        for (let j = 0; j < value.length; j++) {
          if (dataContentType.products[i].id === value[j]) {
            arrayCode.push(dataContentType.products[i].item_number);
            arrayName.push(dataContentType.products[i].title);
            arrayPrice.push(dataContentType.products[i].item_price);
            arrayOrderQuantity.push(
              dataContentType.products[i]?.quantity_select
            );
          }
        }
      }

      variables.push(
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
      setVariables([...variables]);
      objParam.product_code = arrayCode.join(",");
      objParam.product_name = arrayName.join(",");
      objParam.product_unit_price = arrayPrice.join(",");
      objParam.order_quantity = arrayOrderQuantity.join(",");
      setObjParam({ ...objParam });
    } else if (
      contentType === "product_purchase_radio_button" &&
      field === "initial_selection"
    ) {
      let dataContentType = {
        ...dataMessages[index].message_content[indexContent][
          contentType
        ],
      };

      let valueCode;
      let valueName;
      let valuePrice;

      for (let i = 0; i < dataContentType.products?.length; i++) {
        if (dataContentType.products[i].id === value) {
          valueCode = dataContentType.products[i].item_number;
          valueName = dataContentType.products[i].title;
          valuePrice = dataContentType.products[i].item_price;
        }
      }

      variables.push(
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
      setVariables([...variables]);
      objParam.product_code = valueCode;
      objParam.product_name = valueName;
      objParam.product_unit_price = valuePrice;
      setObjParam({ ...objParam });
    }

    if (
      dataMessages[index].message_content[indexContent][
        contentType
      ].is_save_input_content
    ) {
      let isSaveParam = false;
      variables.forEach((item) => {
        let dataContentType = {
          ...dataMessages[index].message_content[indexContent][
            contentType
          ],
        };
        if (
          dataMessages[index].message_content[indexContent][
            contentType
          ].save_input_content === item.variable_name
        ) {
          if (contentType === "zip_code_address") {
            let dataPostCode = !dataContentType.split_postal_code
              ? dataContentType?.value_post_code
              : `${dataContentType.value_post_code_left}${dataContentType.value_post_code_right}`;
            item.default_value = `〒${dataPostCode} ${
              dataContentType?.value_prefecture || ""
            }${dataContentType?.value_municipality || ""} ${
              dataContentType?.value_address || ""
            }${dataContentType?.value_building_name || ""}`;
            isSaveParam = true;
          } else if (
            field === "start_date_select" ||
            field === "end_date_select"
          ) {
            item.default_value = `${
              dataContentType?.start_date_select || "start date"
            } ~ ${dataContentType?.end_date_select || "end date"}`;
            isSaveParam = true;
          } else if (contentType === "radio_button") {
            item.default_value =
              dataContentType[dataContentType.type].find(
                (item) => item.value === value
              )?.text || item.default_value;
            isSaveParam = true;
          } else if (contentType === "checkbox") {
            let dataTextChecked;
            if (
              field === "checkedValue" &&
              dataContentType.checkedValue.length > 0
            ) {
              dataTextChecked = dataContentType.checkedValue.map(
                (itemChecked) => {
                  return dataContentType[dataContentType.type].find(
                    (item) => itemChecked === item.id
                  )?.text;
                }
              );
              isSaveParam = true;
            } else if (
              field === "initial_selection_picture" &&
              dataContentType.initial_selection_picture.length > 0
            ) {
              dataTextChecked = dataContentType.initial_selection_picture.map(
                (itemChecked) => {
                  let dataReturn;
                  dataContentType[dataContentType.type].forEach((item) => {
                    item.contents.forEach((subItem) => {
                      if (itemChecked === `${item.id}-${subItem.id}`) {
                        dataReturn = subItem.text;
                      }
                    });
                  });
                  return dataReturn;
                }
              );
              isSaveParam = true;
            } else {
              dataTextChecked = [];
            }
            item.default_value =
              dataTextChecked.join(",") ?? item.default_value;
          } else if (contentType === "card_payment_radio_button") {
            let dataTextChecked;
            if (field === "initial_selection") {
              dataTextChecked = dataContentType.radio_contents.find(
                (item) => value === item.value
              )?.text;
              isSaveParam = true;
            } else if (field === "initial_selection_picture") {
              dataContentType.radio_contents_img.forEach((item) => {
                item.contents.forEach((subItem) => {
                  if (value === `${item.id}-${subItem.id}`) {
                    dataTextChecked = subItem.text;
                  }
                });
              });
              isSaveParam = true;
            }
            item.default_value = dataTextChecked || item.default_value;
          } else if (contentType === "pull_down") {
            if (field === "customization" || field === "prefectures") {
              item.default_value = value;
              isSaveParam = true;
            } else if (field === "up_to_municipality") {
              item.default_value = `${dataContentType[field].prefecture}${dataContentType[field].city}`;
              isSaveParam = true;
            } else if (field === "timezone_from_to") {
              item.default_value = `${dataContentType[field]?.valueHour1}:${dataContentType[field]?.valueMinute1}-${dataContentType[field]?.valueHour2}:${dataContentType[field]?.valueMinute2}`;
              isSaveParam = true;
            } else if (field === "date_ym") {
              item.default_value = `${dataContentType[field]?.valueYear}-${dataContentType[field]?.valueMonth}`;
              isSaveParam = true;
            } else if (field === "period_from_to") {
              item.default_value = `${dataContentType[field]?.valueYear1}-${dataContentType[field]?.valueMonth1}-${dataContentType[field]?.valueDay1} ~ ${dataContentType[field]?.valueYear2}-${dataContentType[field]?.valueMonth2}-${dataContentType[field]?.valueDay2}`;
              isSaveParam = true;
            } else {
              item.default_value = `${
                dataContentType[field]?.valueYear ||
                dataContentType[field]?.valueMonth ||
                dataContentType[field]?.valueDay
                  ? `${dataContentType[field]?.valueYear}-${dataContentType[field]?.valueMonth}-${dataContentType[field]?.valueDay}`
                  : ""
              } ${
                dataContentType[field]?.valueHour ||
                dataContentType[field]?.valueMinute
                  ? `${dataContentType[field]?.valueHour}:${dataContentType[field]?.valueMinute}`
                  : ""
              }`;
              isSaveParam = true;
            }
          } else if (dataContentType.type === "embedded") {
            item.default_value = `${moment(value).format("YYYY-MM-DD")}`;
            isSaveParam = true;
          } else if (
            field === "phone_number" &&
            dataContentType[field].withHyphen
          ) {
            item.default_value = `${dataContentType[field]?.value1}-${dataContentType[field]?.value2}-${dataContentType[field]?.value3}`;
            isSaveParam = true;
          } else if (contentType === "carousel") {
            item.default_value = dataContentType[
              dataContentType.type
            ].contents.find((item) => item.id === value).title;
            isSaveParam = true;
          } else if (field === 'text' && contentType === 'text_input' && dataContentType[field].isSplitInput) {
              item.default_value = `${dataContentType[field]?.valueLeft} ${dataContentType[field]?.valueRight}`
              isSaveParam = true;
          } else if (contentType !== "credit_card_payment") {
            item.default_value = value;
            isSaveParam = true;
          }
        }
      });
      setVariables([...variables]);
      if (isSaveParam) {
        objParam[
          dataMessages[index].message_content[indexContent][
            contentType
          ].save_input_content
        ] = value;
        setObjParam({ ...objParam });
      }
    }

    setMessagesSessionStorage(dataMessages[index])
    setDataMessages([...dataMessages]);
    setRenderMessageArr(renderMessageArr.map(x => {
      if (x?.id === dataMessages[index]?.id) return {...dataMessages[index]}
      return {...x}
    }))
  };

  const handleOpenWithDrawal = () => {
    if (botInfor && botInfor.withdrawal_prevention_status === "invalid") {
      setIndexUser(0);
      let indexTiming = 0;
      let i;
      for (i = indexMessageRender; i < dataMessages.length; i++) {
        if (
          dataMessages[i].belong_to === "user" ||
          i === dataMessages.length - 1
        )
          break;
        if (
          dataMessages[i].belong_to === "bot" &&
          dataMessages[i].message_content[0].type === "delay"
        ) {
          indexTiming += dataMessages[i].message_content[0].delay.content;
        }
      }
      if (!isFromScenario) setScenarioId(null);
      setTimeout(() => {
        setRenderMessageArr([]);
        if (!isFromScenario) setScenarioId(params.get("scenario_id"));
        if (document.getElementById("action-bd")) {
          document.getElementById("action-bd").click();
        } else {
          onOpenPreview(false);
        }
        let withdrawal = {
          scenario_data: `${deviceReceive}_close_chatbot_window`,
        };
        api.patch(`/api/v1/analytics/scenario_counts/${scenarioId}`, withdrawal).then(res => {
        }).catch(err => {
          console.log(err)
        })
      }, (indexTiming + i - indexMessageRender - 1) * 1000);
    } else if (
      botInfor?.withdrawal_prevention_status === "standard_exit_popup" ||
      botInfor?.withdrawal_prevention_status === "image_popup"
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

  const onChangeErrors = (field, value) => {
    errors[field] = value;
    setErrors({
      ...errors,
    });
  };

  ///body container
if (scenarioId && botInfor && isOpen  ){
  return  (
    <div
      id="sp-container1"
      className="sp-container1 slideUp"
      style={{
        position:'fixed',
        bottom: "0px",
        right: mobileCheck()===true ? isOpen ? 0 : `${rightMarginSp}px`: `${rightMarginPc}px`,
        width: mobileCheck()===true ? `${widthSp}%` : `${widthPc}px`,
        height: mobileCheck()===true ? `${heightSp}px` :  `${heightPc}px`,
        zIndex: 999,
      }}
    >
      <div
        id="sp-withdrawal-container"
        className="sp-withdrawal-container"
      ></div>
      <div id="sp-withdrawal-content" className="sp-withdrawal-content">
        <div className="sp-withdrawal-content-body">
          {botInfor &&
            botInfor.withdrawal_prevention_status === "standard_exit_popup" && (
              <div>ウィンドウを閉じますか。</div>
            )}
          {botInfor && botInfor.withdrawal_prevention_status === "image_popup" && (
            <a
              href={botInfor.withdrawal_prevention_link_url || ""}
              target="_blank"
            >
              <img
                src={botInfor.withdrawal_prevention_image_url}
                style={{ maxHeight: "217px", width: "100%" }}
              />
            </a>
          )}
        </div>
        <div className="sp-withdrawal-content-footer">
          <div
            className="sp-withdrawal-content-footer-button sp-withdrawal-content-footer-button-back"
            onClick={() => {
              document.getElementById("sp-withdrawal-container").style.display =
                "none";
              document.getElementById("sp-withdrawal-content").style.display =
                "none";
            }}
          >
            チャットに戻る
          </div>
          <div
            className="sp-withdrawal-content-footer-button sp-withdrawal-content-footer-button-exit"
            onClick={() => {
              document.getElementById("sp-withdrawal-container").style.display =
                "none";
              document.getElementById("sp-withdrawal-content").style.display =
                "none";
              setIndexUser(0);
              let i;
              for (i = indexMessageRender; i < dataMessages.length; i++) {
                if (
                  dataMessages[i].belong_to === "user" ||
                  i === dataMessages.length - 1
                )
                  break;
              }
              setScenarioId(null);
              setTimeout(() => {
                setScenarioId(params.get("scenario_id"));
                setRenderMessageArr([]);
                if (document.getElementById("action-bd")) {
                  document.getElementById("action-bd").click();
                  let withdrawal = {
                    scenario_data: `${deviceReceive}_close_chatbot_window`,
                  };
                  api.patch(`/api/v1/analytics/scenario_counts/${scenarioId}`, withdrawal).then(res => {
                  }).catch(err => {
                    console.log(err)
                  })
                } else {
                  let withdrawal = {
                    scenario_data: `${deviceReceive}_close_chatbot_window`,
                  };
                  api.patch(`/api/v1/analytics/scenario_counts/${scenarioId}`, withdrawal).then(res => {
                  }).catch(err => {
                    console.log(err)
                  })
                  onOpenPreview(false);
                }
              }, (i - indexMessageRender) * 1000);
            }}
          >
            閉じる
          </div>
        </div>
      </div>
      <div id="sp-popup-zip-code-address" className="sp-popup-zip-code-address">
        <div className="sp-popup-zip-code-address-header">
          <div className="sp-popup-zip-code-address-header-left">
            住所で郵便番号を検索する
          </div>
          <div className="sp-popup-zip-code-address-header-right">
            <MDBIcon
              style={{ width: "5%", marginLeft: "3px", cursor: "pointer" }}
              fas
              onClick={() => isPopUpZipCode(false)}
              icon="times"
              className={"sp-plus-circle-option-icon-times-custom"}
            />
          </div>
        </div>
        <div className="sp-popup-zip-code-address-body">
          <div className="sp-popup-zip-code-address-body-form">
            <SelectCustom
              style={{ width: "100%", marginBottom: "7px" }}
              keyValue="name"
              nameValue="name"
              placeholder="都道府県を選択してください"
              data={dataPrefectures}
              onChange={async (value) => {
                setPrefectures(value);
                setCities(null);
                setTowns(null);
                setZipcode(null);
                if (value) {
                  let prefecture_jis_code = dataPrefectures.find(
                    (item) => item.name === value
                  ).prefecture_jis_code;
                  api
                    .get(
                      `/api/v1/cities?prefecture_jis_code=${prefecture_jis_code}`
                    )
                    .then((res) => {
                      if (res.data.code === 1) {
                        setDataCities(res.data.data);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      if (error.response?.data.code === 0) {
                        tokenExpired();
                      }
                    });
                }
              }}
              value={prefectures}
            />
            <SelectCustom
              style={{ width: "100%", marginBottom: "7px" }}
              keyValue="city_name"
              nameValue="city_name"
              placeholder="市区を選択してください"
              data={dataCities || []}
              onChange={async (value) => {
                setCities(value);
                setTowns(null);
                setZipcode(null);

                if (value) {
                  let city_jis_code = dataCities.find(
                    (item) => item.city_name === value
                  ).city_jis_code;
                  api
                    .get(`/api/v1/towns?city_jis_code=${city_jis_code}`)
                    .then((res) => {
                      if (res.data.code === 1) {
                        setDataTowns(res.data.data);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      if (error.response?.data.code === 0) {
                        tokenExpired();
                      }
                    });
                }
              }}
              value={cities}
            />
            <SelectCustom
              style={{ width: "100%", marginBottom: "7px" }}
              keyValue="town_name"
              nameValue="town_name"
              placeholder="町村を選択してください"
              data={dataTowns || []}
              onChange={(value) => {
                setTowns(value);
                if (value) {
                  let zipcode = dataTowns.find(
                    (item) => item.town_name === value
                  ).zip_code;
                  setZipcode(zipcode);
                } else {
                  setZipcode(null);
                }
              }}
              value={towns}
            />
            {zipcode && (
              <div className="sp-popup-zip-code-address-body-form-content">
                〒{zipcode}
              </div>
            )}
          </div>
          <div className="sp-popup-zip-code-address-body-button">
            <div
              className="sp-popup-zip-code-address-body-button-cancel"
              onClick={() => isPopUpZipCode(false)}
            >
              キャンセル
            </div>
            <div
              className="sp-popup-zip-code-address-body-button-selection"
              style={zipcode ? {} : { opacity: "0.5" }}
              onClick={() => {
                if (
                  zipcode &&
                  indexContentZipcode !== undefined &&
                  !dataMessages[indexMessageRender].message_content[
                    indexContentZipcode
                  ].zip_code_address.split_postal_code
                ) {
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    zipcode,
                    "value_post_code"
                  );
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    prefectures,
                    "value_prefecture"
                  );
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    `${cities}${towns}`,
                    "value_municipality"
                  );
                  errors[
                    `message${indexMessageRender}_content${indexContentZipcode}_zip_code_address`
                  ] = "";
                  setErrors({ ...errors });
                  document.getElementById(
                    "sp-withdrawal-container"
                  ).style.display = "none";
                  document.getElementById(
                    "sp-popup-zip-code-address"
                  ).style.display = "none";
                } else if (
                  zipcode &&
                  indexContentZipcode !== undefined &&
                  dataMessages[indexMessageRender].message_content[
                    indexContentZipcode
                  ].zip_code_address.split_postal_code
                ) {
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    zipcode.slice(0, 3),
                    "value_post_code_left"
                  );
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    zipcode.slice(3),
                    "value_post_code_right"
                  );
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    prefectures,
                    "value_prefecture"
                  );
                  onChangeValue(
                    indexContentZipcode,
                    "zip_code_address",
                    `${cities}${towns}`,
                    "value_municipality"
                  );
                  errors[
                    `message${indexMessageRender}_content${indexContentZipcode}_zip_code_address`
                  ] = "";
                  setErrors({ ...errors });
                  document.getElementById(
                    "sp-withdrawal-container"
                  ).style.display = "none";
                  document.getElementById(
                    "sp-popup-zip-code-address"
                  ).style.display = "none";
                }
                document.getElementById("ss-user-input-address").focus();
                document.getElementById("ss-user-input-address").select();
              }}
            >
              選択
            </div>
          </div>
        </div>
      </div>
      <div
        id="sp-header"
        style={
          botInfor?.main_color && { backgroundColor: botInfor?.main_color }
        }
        className="sp-header"
      >
        <div className="sp-header-left" onClick={() => onOpenPreview(!isOpen)}>
          <div className="sp-header-left-avatar sp-avatar">
            <img
              src={
                botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
              }
            />
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-sub-title">
              {botInfor?.subtitle}
            </div>
            <div className="sp-header-left-label-title">{botInfor?.title}</div>
          </div>
        </div>
        <div
          className="sp-header-right"
          onClick={() => {
            isOpen ? handleOpenWithDrawal() : onOpenPreview(true);
          }}
        >
          <div className="sp-header-right-arrow">
            {isOpen ? (
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
      : "" }
      <div
          id="sp-process-bar"
          className="sp-process-bar"
          style={{ backgroundColor: botInfor?.opacity_color }}
        >
          <div
            className="sp-process-bar-color animation"
            style={{
              width: indexUser
                ? `${
                    ((indexUser - 1 < 0 ? 0 : indexUser - 1) * 100) /
                    messageUser.length
                  }%`
                : "100%",
              ...(botInfor?.main_color && {
                backgroundColor: botInfor?.main_color,
              }),
            }}
          >
            {indexUser
              ? messageUser.length !== indexUser - 1
                ? `あと${messageUser.length - indexUser + 1}間`
                : "完了しました。"
              : `あと${messageUser.length}間`}
          </div>
        </div>
        <div
          id="sp-body"
          className="sp-body"
          style={{ backgroundColor: botInfor?.opacity_color }}
        >
          {renderMessageArr.map((message, indexMessage) => {
            return (
              <React.Fragment key={indexMessage}>
                {message.belong_to === "bot" &&
                  message?.message_content.map((content, index) => {
                    return (
                      <BotMessage
                        key={index}
                        content={content}
                        index={index}
                        botInfor={botInfor}
                      />
                    );
                  })}
                {message.belong_to === "user" && (
                  <div
                    // id={`sp-body-user-side-${indexMessage}`}
                    className="sp-body-user-side slideLeft"
                  >
                    <div className="sp-body-user-side-messages">
                      <UserMessage
                        captcha={captcha}
                        messageContentProps={message.message_content}
                        disabled={message.disabled}
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
                        indexMessageRender={indexMessageRender}
                        onClickNext={() => onClickNext(indexMessage, message)}
                        indexMessage={indexMessage}
                        errorsProps={errors}
                        displayButtonNext={(value) => {
                          dataMessages[indexMessage].is_display_button_next =
                            value;
                          setDataMessages([...dataMessages]);
                        }}
                        dataPrefectures={[...dataPrefectures]}
                        isPopUpZipCode={(isOpen, indexContent) =>
                          isPopUpZipCode(isOpen, indexContent)
                        }
                        onChangeErrors={(field, value) =>
                          onChangeErrors(field, value)
                        }
                        variables={variables}
                      />
                      {(dataMessages[indexMessage].is_display_button_next !==
                      undefined
                        ? dataMessages[indexMessage].is_display_button_next
                        : true) && (
                        <div className="sp-user-message-button-action">
                          <Button
                            disabled={message.disabled}
                            style={{
                              backgroundColor: botInfor?.main_color,
                              borderRadius: "25px",
                            }}
                            className="ss-user-message__action-btn"
                            onClick={() => onClickNext(indexMessage, message)}
                          >
                            {message.buttonName || "次へ"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
  ) } else if (isOpen===false &&mobileCheck()===false && positionPc ==='1' && buttonTypePc==='2'){ return (
      <div
    onClick={() => onOpenPreview(!isOpen)}
    style={{
      backgroundColor: botInfor?.main_color && botInfor?.main_color,
      width: "56px",
      height: "56px",
      borderRadius: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position:'fixed',
      bottom:bottomMarginPc? `${bottomMarginPc}px`: '10px',
      right:rightMarginPc? `${rightMarginPc}px`: '0px',
    }}
  >
    <img
      style={{ width: "96%", height: "96%", borderRadius: "30px" }}
      src={
        botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
      }
    />
  </div>

  )} else if (isOpen===false &&mobileCheck()===false && positionPc ==='1' && buttonTypePc==='1') {
    return (
      <div
    onClick={() => onOpenPreview(!isOpen)}
    style={{
      backgroundColor: botInfor?.main_color && botInfor?.main_color,
      // width: `${widthPc}px`,
      width: `360px`,
      height: "66px",
      borderRadius:'35px',
      display: "flex",
      justifyContent: 'space-between',
      alignItems:'center',
      paddingLeft:'3px',
      paddingRight:'3px',
      position:'fixed',
      padding:'auto',
      bottom:bottomMarginPc? `${bottomMarginPc}px`: '10px',
      right:rightMarginPc? `${rightMarginPc}px`: '0px',
    }}
  >
     <div className="sp-header-left-bt" onClick={() => onOpenPreview(!isOpen)}>
          <div className="sp-header-left-avatar sp-avatar-bt">
            <img
              src={
                botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
              }
            />
          </div>
        </div>
        <div style={{ alignItems:'center', justifyContent:"center", padding:'auto'}}>
            {/* <div className="sp-header-left-label-sub-title">
              {botInfor?.subtitle}
            </div>
            <div className="sp-header-left-label-title">{botInfor?.title}</div> */}
            <div id="comment_bubble" style={{display:'flex', alignItems:'center', paddingLeft:'20px', paddingTop: '3px'}}>
              <span style={{ fontSize:'18px', fontWeight:900}}>{titleBubble}</span>
            </div>
          </div>
          <div className="sp-header-right-arrow" style={{marginRight:'8px'}}>
              <MDBIcon fas icon="chevron-circle-up" />
          </div>
  </div>
    )
  } else if (isOpen===false &&mobileCheck()===false && positionPc ==='2'){
    return (
    <div
    onClick={() => onOpenPreview(!isOpen)}
    style={{
      backgroundColor: botInfor?.main_color && botInfor?.main_color,
      width:'300px',
      height: "65px",
      borderRadius: "0px",
      display: "flex",
      justifyContent: "left",
      position:'fixed',
      transform:' rotate(-90deg)',
      bottom: bottomMarginPc ? `${parseInt(bottomMarginPc) + widthPc/2}px`: '20px',
      right: `${-120}px`,
    }}
  >
     <div className="sp-header-left" onClick={() => onOpenPreview(!isOpen)}>
          <div className="sp-header-left-avatar sp-avatar">
            <img
              src={
                botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
              }
            />
          </div>
          <div className="sp-header-left-label">
           
            <div className="sp-header-left-label-title">{rightPcTitle}</div>
          </div>
        </div>
  </div>)
  } else if (isOpen===false && mobileCheck()===true && positionSp ==='1' && buttonTypeSp==='2'){ return (
    <div
  onClick={() => onOpenPreview(!isOpen)}
  style={{
    backgroundColor: botInfor?.main_color && botInfor?.main_color,
    width: "56px",
    height: "56px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position:'fixed',
    bottom:bottomMarginSp? `${bottomMarginSp}px`: '20px',
    right:rightMarginSp? `${rightMarginSp}px`: '20px',
  }}
>
  <img
    style={{ width: "96%", height: "96%", borderRadius: "30px" }}
    src={
      botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
    }
  />
</div>

)} else if (isOpen===false && mobileCheck()===true && positionSp ==='1' && buttonTypeSp==='1') {
  return (
    <div
      onClick={() => onOpenPreview(!isOpen)}
      style={{
        backgroundColor: botInfor?.main_color && botInfor?.main_color,
        width: '240px',
        height: "48px",
        borderRadius:'35px',
        display: "flex",
        justifyContent: "left",
        position:'fixed',
        bottom:bottomMarginSp? `${bottomMarginSp}px`: '10px',
        right:rightMarginSp? `${rightMarginSp}px`: '10px',
      }}
    >
      <div className="sp-header-left" onClick={() => onOpenPreview(!isOpen)} style={{width: '100%', padding: '4px'}}>
        <div className="sp-header-left-avatar sp-avatar" style={{width: '38px'}}>
          <img
            src={
              botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
            }
            alt="bot-avatar"
          />
        </div>
        <div>
          <div id="comment_bubble" className="sp-bubble">
            <span style={{ fontSize:'14px', fontWeight:700}}>{titleBubble}</span>
          </div>
        </div>
        <div className="sp-header-right-arrow" style={{marginLeft: 'auto'}}>
            <MDBIcon fas icon="chevron-circle-up" />
        </div>
      </div>
    </div>
  )
}else if (isOpen===false && mobileCheck()===true&& positionSp ==='2'){
  return (
  <div
  onClick={() => onOpenPreview(!isOpen)}
  style={{
    backgroundColor: botInfor?.main_color && botInfor?.main_color,
    width:'300px',
    height: "60px",
    borderRadius: "0px",
    display: "flex",
    justifyContent: "left",
    position:'fixed',
    transform:' rotate(-90deg)',
    bottom: bottomMarginSp ? `${parseInt(bottomMarginSp) + widthPc/2}px`: '20px',
    right: `${-120}px`,
  }}
>
   <div className="sp-header-left" onClick={() => onOpenPreview(!isOpen)}>
        <div className="sp-header-left-avatar sp-avatar">
          <img
            src={
              botInfor?.icon?.url && EC_CHATBOT_URL + "" + botInfor?.icon?.url
            }
          />
        </div>
        <div className="sp-header-left-label">
         
          <div className="sp-header-left-label-title">{rightSpTitle}</div>
        </div>
      </div>
</div>)
}
else {
    return (
      <div></div>
    )
  }
}

const BotMessage = ({ content, index, botInfor }) => {
  const handleDownloadFile = (file) => {
    let link = document.createElement("a");
    link.href = file;
    link.download = "file";
    link.target = "_blank";
    document.body.appendChild(link);

    link.click();
    link.remove();
  };

  return (
    <div key={index} className="sp-body-bot-side slideRight">
      {(content.type === "text_input" ||
        content.type === "file" ||
        content.type === "delay") && (
        <div className="sp-body-bot-side-avatar sp-avatar">
          <img src={EC_CHATBOT_URL + "/" + botInfor?.icon?.url} />
        </div>
      )}
      <div className="sp-body-bot-side-messages">
        {/* <img className="ss-bot-ava" src={icon} alt="" /> */}
        {content && (
          <React.Fragment>
            {/* bot: type == 'text_input' */}
            {content.type === "text_input" && (
              <div className="position-relative">
                <div
                  className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value position-relative`}
                  style={{
                    overflowWrap: "break-word",
                    backgroundColor: botInfor?.message_color,
                    color: botInfor?.font_color,
                    height: "auto",
                    border: "none",
                    borderRadius: "20px",
                  }}

                  dangerouslySetInnerHTML={{
                    __html: content[content.type]?.content,
                  }}
                  // value={content[content.type]?.content || ''}
                  // onChange={() => onChangeValue(indexMessageSelect, index, content.type, value, 'content')}
                >
                  {/* {content[content.type]?.content || ''} */}
                  {/* <div
                    dangerouslySetInnerHTML={{
                      __html: content[content.type]?.content,
                    }}
                  /> */}
                </div>
              <div
                style={{
                  content: " ",
                  display: "block",
                  position: "absolute",
                  bottom: 0,
                  left: "-3px",
                  width: "12px",
                  height: "18px",
                  backgroundColor: botInfor?.message_color,
                  background: `url(${botInfor?.icon_mess})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              </div>
            )}
            {content.type === "file" &&
              (content[content.type]?.content ? (
                <React.Fragment>
                  {(content[content.type]?.content.includes("jpeg") ||
                    content[content.type]?.content.includes("png") ||
                    content[content.type]?.content.includes("jpg")) && (
                    <img
                      src={content[content.type]?.content}
                      alt=""
                      style={{ width: "100%" }}
                    />
                  )}
                  {content[content.type]?.content.includes("pdf") && (
                    <span
                      style={{
                        color: "#089BE5",
                        fontSize: "17px",
                        display: "block",
                        height: "50px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleDownloadFile(content[content.type]?.content)
                      }
                    >
                      ファイルをダウンロード
                    </span>
                  )}
                  {content[content.type]?.content.includes("mp4") && (
                    <div>
                      <video
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "2px",
                        }}
                        src={content[content.type]?.content}
                        autoPlay
                        controls
                      />
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <textarea
                  className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                  value={""}
                  readOnly
                  style={{
                    backgroundColor: botInfor?.message_color,
                    border: "none",
                    borderRadius: "20px",
                    color: botInfor?.font_color,
                  }}
                ></textarea>
              ))}
            {content.type === "delay" && (
              <img
                src={messageTypingGif}
                style={{
                  backgroundColor: "#EBF7FF",
                  height: "40px",
                  borderRadius: "10px",
                }}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const UserMessage = ({
  messageContentProps,
  onChangeValue,
  disabled = false,
  indexMessageRender,
  errorsProps,
  indexMessage,
  captcha,
  onClickNext,
  displayButtonNext,
  isPopUpZipCode,
  onChangeErrors,
  dataPrefectures,
  variables
}) => {
  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataCity, setDataCity] = useState([]);
  // const [dataPrefectures, setDataPrefectures] = useState([...dataPrefectures]);
  const [startDate, setStartDate] = useState(new Date());
  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);
  const [checked, setChecked] = useState([]);
  const [bot_id, setBotId] = useState(Cookies.get("bot_id"));
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState("");

  function loadCaptcha(indexContent) {
    if (
      document.getElementById(`captcha-${indexMessage}-${indexContent}`) &&
      captcha.length !== 0
    )
      document.getElementById(
        `captcha-${indexMessage}-${indexContent}`
      ).innerHTML =
        captcha.filter(
          (item) =>
            item.index === indexMessage && item.indexContent === indexContent
        )?.[0]?.data || "";
  }

  const stringNullOrEmpty = (string) => {
    if (
      string === undefined ||
      string === null ||
      (string && (string + "")?.trim() === "") ||
      string === ""
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (messageContent.length === 1) {
      let message = messageContent[0];
      if (
        (message.type === "card_payment_radio_button" &&
          stringNullOrEmpty(message?.[message.type]?.initial_selection) &&
          stringNullOrEmpty(
            message?.[message.type]?.initial_selection_picture
          )) ||
        message.type === "product_purchase_radio_button" ||
        (message.type === "card_payment_radio_button" &&
          (message?.[message.type].type !== "picture_radio"
            ? stringNullOrEmpty(message?.[message.type]?.initial_selection) &&
              !message?.[message.type]?.card_linked_setting.includes(message?.[message.type]?.initial_selection)
            : stringNullOrEmpty(
                message?.[message.type]?.initial_selection_picture
              ) &&
              message?.[message.type]?.card_linked_setting_picture !==
                message?.[message.type]?.initial_selection_picture)) ||
        (message.type === "carousel" && message?.[message.type].require) ||
        (message.type === "radio_button" &&
          !message[message.type].initial_selection)
      ) {
        displayButtonNext(false);
      } else {
        displayButtonNext(true);
      }
    } else {
      displayButtonNext(true);
    }
  }, []);

  useEffect(() => {
    setErrors(errorsProps);
  }, [errorsProps]);

  useEffect(() => {
    setMessageContent(messageContentProps);
  }, [messageContentProps]);

  useEffect(() => {
    messageContent.forEach((content, indexContent) => {
      if (content.type === "calendar") {
        let calendar = content.calendar;
        if (calendar.initial_selection && calendar.type !== "start_end_date") {
          let i = 0;
          let date_select = "";

          date_select = moment().add(i, "days").format("YYYY-MM-DD");
          while (handleDisableDateCalendar(moment().add(i, "days"), calendar)) {
            if (i === 100) {
              date_select = null;
              break;
            }
            date_select = moment()
              .add(i + 1, "days")
              .format("YYYY-MM-DD");
            i++;
          }
          // calendar.date_select = date_select;
          onChangeValue(indexContent, content.type, date_select, "date_select");
        } else if (
          calendar.initial_selection &&
          calendar.type === "start_end_date"
        ) {
          let i = 0;
          calendar.start_date_select = moment();
          calendar.end_date_select = moment().add(1, "days");
          while (handleDisableDateCalendar(moment().add(i, "days"), calendar)) {
            if (i === 100) {
              calendar.start_date_select = null;
              calendar.end_date_select = null;
              break;
            }
            calendar.start_date_select = moment().add(i + 1, "days");
            calendar.end_date_select = moment().add(i + 1, "days");
            i++;
          }
        }
      } else if (content.type === "checkbox") {
        let checkbox = content.checkbox;
        if (checkbox.all_item_checked && checkbox.type !== "checkbox_img") {
          checkbox[checkbox.type].forEach((item) => {
            checkbox.checkedValue.push(item.id);
          });
          onChangeValue(
            indexContent,
            content.type,
            checkbox.checkedValue,
            "checkedValue"
          );
        } else if (
          checkbox.all_item_checked &&
          checkbox.type === "checkbox_img"
        ) {
          checkbox[checkbox.type].forEach((item) => {
            item.contents.forEach((itemContent) => {
              checkbox.initial_selection_picture.push(
                `${item.id}-${itemContent.id}`
              );
            });
          });
          onChangeValue(
            indexContent,
            content.type,
            checkbox.initial_selection_picture,
            "initial_selection_picture"
          );
        }
      } else if (content.type === "radio_button") {
        let radioButton = content.radio_button;
        if (radioButton.initial_selection) {
          onChangeValue(
            indexContent,
            content.type,
            radioButton.initial_selection,
            "initial_selection"
          );
        }
      } else if (content.type === "card_payment_radio_button") {
        let cardPaymentRadioButton = content.card_payment_radio_button;
        if (
          cardPaymentRadioButton.type !== "picture_radio" &&
          cardPaymentRadioButton.initial_selection
        ) {
          onChangeValue(
            indexContent,
            content.type,
            cardPaymentRadioButton.initial_selection,
            "initial_selection"
          );
        } else if (cardPaymentRadioButton.initial_selection_picture) {
          onChangeValue(
            indexContent,
            content.type,
            cardPaymentRadioButton.initial_selection_picture,
            "initial_selection_picture"
          );
        }
      } else if (content.type === "product_purchase") {
        let productPurchase = content.product_purchase;
        onChangeValue(
          indexContent,
          content.type,
          productPurchase.initial_selection,
          "initial_selection"
        );
      }
    });
  }, []);

  function botUploadFile() {
    document.getElementById("ss-bot-file-upload-preview").click();
  }

  function getBaseUrl(event, indexContent) {
    var file = event.target.files[0];
    const type = file.name.slice(file.name.lastIndexOf(".") + 1);
    if (
      messageContent[indexContent].attaching_file.file_type.length > 0 &&
      !messageContent[indexContent].attaching_file.file_type.includes(
        type.toLowerCase()
      )
    ) {
      onChangeErrors(
        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
        `ファイルには${messageContent[
          indexContent
        ].attaching_file.file_type.join(
          ", "
        )}タイプのファイルを指定してください。`
      );
      return;
    } else if (file.size / 1024 / 1024 >= 2) {
      onChangeErrors(
        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
        "ファイルサイズは2MB以下です。"
      );
      return;
    } else {
      onChangeErrors(
        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
        ""
      );
    }
    // if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
    // var reader = new FileReader(file);

    // messageContent[indexContent].attaching_file.value = file.name;
    let urlFile = URL.createObjectURL(file);
    onChangeValue(indexContent, "attaching_file", file.name, "value");
    onChangeValue(indexContent, "attaching_file", urlFile, "linkFile");
    // var baseString;
    // var imgUrl = URL.createObjectURL(event.target.files[0]);
    // if (
    //   file?.type === 'image/png' ||
    //   file?.type === 'image/jpeg' ||
    //   file?.type === 'image/jpg' ||
    //   file?.type === 'image/gif' ||
    //   file?.type === 'image/img'
    // ) {
    //   document.getElementById(`bot-file-upload-img`).style.display = 'block';
    //   document.getElementById(`bot-file-upload-img`).src = imgUrl;
    // } else {
    //   document.getElementById(`bot-file-upload-img`).style.display = 'none';
    //   document.getElementById(`bot-file-upload-img`).src = '';
    // }

    // reader.onloadend = function () {
    //   baseString = reader.result;
    //   // setInputImage(baseString);
    //   // document.getElementById('ss-bot-file-upload-name').innerHTML = event.target.files[0].name;
    //   if (baseString !== undefined || baseString !== '') {
    //     // document.getElementById('newClientImgLogoErrMsg').style.display = 'none';

    //   }

    // };
    // reader.readAsDataURL(file);
  }

  const handleDisableDateCalendar = (current, calendar) => {
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      calendar?.non_select_date_time?.length !== 0 ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to ||
      calendar.end_date_select
    ) {
      return (
        moment(current, "YYYY-MM-DD") >=
          moment(calendar.end_date, "YYYY-MM-DD").add(1, "days") ||
        moment(current, "YYYY-MM-DD") <
          moment(calendar.start_date, "YYYY-MM-DD") ||
        (calendar.type === "start_end_date" &&
          moment(current, "YYYY-MM-DD").isSameOrAfter(
            moment(calendar.end_date_select, "YYYY-MM-DD")
          )) ||
        calendar.fixed_date?.find(
          (date) => date === moment(current).format("YYYY-MM-DD")
        ) ||
        moment(current) <
          (calendar.aggregation_target_period_from !== null &&
          calendar.aggregation_target_period_from !== undefined
            ? moment().add(calendar.aggregation_target_period_from - 1, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current) >
          (calendar.aggregation_target_period_to
            ? moment().add(calendar.aggregation_target_period_to, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        calendar.non_select_date_time?.find((type) => {
          if (type === "today") {
            return (
              moment().format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "tomorrow") {
            return (
              moment().add(1, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "day_after_tomorrow") {
            return (
              moment().add(2, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "past") {
            return (
              moment(current).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "future") {
            return (
              moment(current).format("YYYY-MM-DD") >
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "moon") {
            return moment(current).day() === 1;
          } else if (type === "fire") {
            return moment(current).day() === 2;
          } else if (type === "water") {
            return moment(current).day() === 3;
          } else if (type === "wood") {
            return moment(current).day() === 4;
          } else if (type === "money") {
            return moment(current).day() === 5;
          } else if (type === "soil") {
            return moment(current).day() === 6;
          } else if (type === "day") {
            return moment(current).day() === 0;
          }
        })
      );
    }
  };

  const handleDisableEndDateCalendar = (current, calendar) => {
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      calendar?.non_select_date_time?.length !== 0 ||
      calendar.start_date_select ||
      calendar.specified_period_from ||
      calendar.specified_period_to ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to
    ) {
      return (
        moment(current, "YYYY-MM-DD").isSameOrAfter(
          moment(calendar.end_date, "YYYY-MM-DD").add(1, "days")
        ) ||
        moment(current, "YYYY-MM-DD") <
          moment(calendar.start_date, "YYYY-MM-DD") ||
        (calendar.type === "start_end_date" &&
          moment(current, "YYYY-MM-DD").isSameOrBefore(
            moment(calendar.start_date_select, "YYYY-MM-DD")
          )) ||
        calendar.fixed_date?.find(
          (date) => date === moment(current).format("YYYY-MM-DD")
        ) ||
        moment(current) <
          (calendar.aggregation_target_period_from !== null &&
          calendar.aggregation_target_period_from !== undefined
            ? moment().add(calendar.aggregation_target_period_from - 1, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current) >
          (calendar.aggregation_target_period_to
            ? moment().add(calendar.aggregation_target_period_to, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current, "YYYY-MM-DD") <
          (calendar[calendar.type].specified_period_from
            ? moment(calendar.start_date_select, "YYYY-MM-DD").add(
                calendar[calendar.type].specified_period_from,
                "days"
              )
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current, "YYYY-MM-DD") >
          (calendar[calendar.type].specified_period_to
            ? moment(calendar.start_date_select, "YYYY-MM-DD").add(
                calendar[calendar.type].specified_period_to,
                "days"
              )
            : moment(undefined, "YYYY-MM-DD")) ||
        calendar.non_select_date_time?.find((type) => {
          if (type === "today") {
            return (
              moment().format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "tomorrow") {
            return (
              moment().add(1, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "day_after_tomorrow") {
            return (
              moment().add(2, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "past") {
            return (
              moment(current).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "future") {
            return (
              moment(current).format("YYYY-MM-DD") >
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "moon") {
            return moment(current).day() === 1;
          } else if (type === "fire") {
            return moment(current).day() === 2;
          } else if (type === "water") {
            return moment(current).day() === 3;
          } else if (type === "wood") {
            return moment(current).day() === 4;
          } else if (type === "money") {
            return moment(current).day() === 5;
          } else if (type === "soil") {
            return moment(current).day() === 6;
          } else if (type === "day") {
            return moment(current).day() === 0;
          }
        })
      );
    }
  };

  const handleClickCarousel = (urls, use_shortened_urls) => {
    let data = {
      history_click_url: {
        origin_url: urls,
      },
    };
    api
      .post(`/api/v1/managements/history_click_urls?chatbot_id=${bot_id}`, data)
      .then((response) => {
        if (response.data.code === 1) {
          let message = response.data.message;
          let link = document.createElement("a");
          link.href = use_shortened_urls
            ? SHORTEN_URL + message.shorten_code
            : message.origin_url;
          link.target = "_blank";
          link.click();
        } else if (response.data.code === 2) {
          setMessageNoti(response.data.message[0]);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMessageNoti(``);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  function checkLoadCalendar() {
    // if (document.getElementsByClassName('ant-picker-calendar-year-select')) {
    //   const divs = document.querySelectorAll('.ant-picker-calendar-year-select');
    //   divs.forEach(el => el.addEventListener('click', event => {
    //     alert('Please select')
    //   }));
    // }
  }

  function replaceVariable(content) {
    content = content.replaceAll(SCAN_REGEX, (text, variable) => {
      if (variables.length !== 0) {
          let valueVar = "";
          for (let j = 0; j < variables.length; j++) {
            if (variables[j].variable_name === variable) {
              valueVar = variables[j].default_value;
            }
          }
          return valueVar;
      } else {
          return "";
      }
    })
    return content;
  }

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent?.map((content, indexContent) => {
        let textInput = content.text_input;
        let label = content.label;
        let textarea = content.textarea;
        let radioButton = content.radio_button;
        let checkbox = content.checkbox;
        let pullDown = content.pull_down;
        let zipCodeAddress = content.zip_code_address;
        let attachingFile = content.attaching_file;
        let calendar = content.calendar;
        let agreeTerm = content.agree_term;
        let carousel = content.carousel;
        let creditCardPayment = content.credit_card_payment;
        let capture = content.capture;
        let productPurchase = content.product_purchase;
        let productPurchaseRadioButton = content.product_purchase_radio_button;
        let smsVerify = content.sms_verify;
        let afteePaymentModule = content.AFTEE_payment_module;
        let slider = content.slider;
        let cardPaymentRadioButton = content.card_payment_radio_button;
        let variableSet = content.variable_set;
        let labelNoTransition = content.label_no_transition;

        if (content.type == 'textarea' && content.textarea && content.textarea.invalid_input && content.textarea.invalid_input.content) {
            content.textarea.invalid_input.content = replaceVariable(content.textarea.invalid_input.content);
        }

        return (
          <React.Fragment key={indexContent}>
            {/* type == 'text_input' */}
            {content.type === "text_input" && (
              <div style={{ marginBottom: "10px" }}>
                {(textInput.title_require || textInput.require) && (
                  <div
                    className="ss-message__content--user-text-input-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {textInput.title_require && (
                      <span className="ss-message__content--user-text-input-title">
                        {textInput.title}
                      </span>
                    )}
                    {textInput.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {textInput.type === "text" &&
                  (textInput.text.isSplitInput ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <InputCustom
                        disabled={disabled}
                        placeholder={textInput.text?.placeholderLeft}
                        style={{ width: "49%", marginBottom: "0px" }}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "valueLeft"
                          )
                        }
                        value={textInput[textInput.type]?.valueLeft}
                      ></InputCustom>
                      <InputCustom
                        disabled={disabled}
                        placeholder={textInput.text?.placeholderRight}
                        style={{ width: "49%" }}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "valueRight"
                          )
                        }
                        value={textInput[textInput.type]?.valueRight}
                      ></InputCustom>
                    </div>
                  ) : (
                    <React.Fragment>
                      <InputCustom
                        disabled={disabled}
                        style={{ marginBottom: "0px" }}
                        placeholder={textInput[textInput.type]?.placeholderLeft}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "value"
                          )
                        }
                        value={textInput[textInput.type]?.value}
                      ></InputCustom>
                      {textInput.text?.placeholderRight && (
                        <span
                          style={{
                            fontWeight: "400",
                            color: "black",
                            fontSize: "12px",
                            marginLeft: "18px",
                          }}
                        >
                          {textInput.text?.placeholderRight}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                {textInput.type === "phone_number" && (
                  <React.Fragment>
                    {textInput.phone_number.withHyphen === false ? (
                      <InputCustom
                        disabled={disabled}
                        // className="ss-message__content--user-text-input ss-input-value"
                        style={{ marginBottom: "0px" }}
                        placeholder={textInput[textInput.type]?.number}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "value"
                          )
                        }
                        value={textInput[textInput.type]?.value}
                      ></InputCustom>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <InputCustom
                          disabled={disabled}
                          className="ss-message__content--user-text-input ss-input-value"
                          maxLength={3}
                          style={{ marginBottom: "0px", width: "32%" }}
                          placeholder={textInput[textInput.type]?.number1}
                          onChange={(value) => {
                            if (value.length === 3) {
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_2"
                                )
                                .focus();
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_2"
                                )
                                .select();
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value1"
                            );
                          }}
                          value={textInput[textInput.type]?.value1}
                        ></InputCustom>
                        <InputCustom
                          id="ss-user-message-phone_number_2"
                          disabled={disabled}
                          className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: "0px", width: "32%" }}
                          maxLength={4}
                          placeholder={textInput[textInput.type]?.number2}
                          onChange={(value) => {
                            if (value.length === 4) {
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_3"
                                )
                                .focus();
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_3"
                                )
                                .select();
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value2"
                            );
                          }}
                          value={textInput[textInput.type]?.value2}
                        ></InputCustom>
                        <InputCustom
                          id="ss-user-message-phone_number_3"
                          disabled={disabled}
                          // className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: "0px", width: "32%" }}
                          placeholder={textInput[textInput.type]?.number3}
                          maxLength={4}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value3"
                            )
                          }
                          value={textInput[textInput.type]?.value3}
                        ></InputCustom>
                      </div>
                    )}
                  </React.Fragment>
                )}
                {textInput.type === "password" && (
                  <React.Fragment>
                    <InputCustom
                      disabled={disabled}
                      type="password"
                      // className="ss-message__content--user-text-input ss-input-value"
                      style={{ marginBottom: "0px" }}
                      placeholder={textInput[textInput.type]?.password}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    ></InputCustom>
                  </React.Fragment>
                )}
                {(textInput.type === "urls" ||
                  textInput.type === "email_address") && (
                  <React.Fragment>
                    <InputCustom
                      disabled={disabled}
                      // className="ss-message__content--user-text-input ss-input-value"
                      style={{ marginBottom: "0px" }}
                      placeholder={textInput[textInput.type].placeholder}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    ></InputCustom>
                  </React.Fragment>
                )}
                {textInput.type === "email_confirmation" && (
                  <>
                    <InputCustom
                      style={{ marginBottom: "5px" }}
                      disabled={disabled}
                      placeholder={textInput[textInput.type].cfEmlAdd_email}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    />
                    <InputCustom
                      disabled={disabled}
                      placeholder={
                        textInput[textInput.type].cfEmlAdd_confirm_email
                      }
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "valueConfirm"
                        )
                      }
                      value={textInput[textInput.type]?.valueConfirm}
                    />
                  </>
                )}
                {textInput.type === "password_confirmation" && (
                  <>
                    <InputCustom
                      style={{ marginBottom: "5px" }}
                      disabled={disabled}
                      type="password"
                      placeholder={textInput[textInput.type].password}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    />
                    <InputCustom
                      disabled={disabled}
                      type="password"
                      placeholder={textInput[textInput.type].confirm_password}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "valueConfirm"
                        )
                      }
                      value={textInput[textInput.type]?.valueConfirm}
                    />
                  </>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'label' */}
            {content.type === "label" && label.lbl_content && (
              <div style={{ marginBottom: "10px" }}>
                <div className="ss-message__content--user-label-top">
                  <span className="ss-message__content--user-label-title">
                    {label.lbl_content}
                  </span>
                  {label?.require === true && (
                    <span className="ss-message__content--user-required">
                      ※必須
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* type == 'textarea' */}
            {content.type === "textarea" && (
              <div style={{ marginBottom: "10px" }}>
                {(textarea.title_require || textarea.require) && (
                  <div
                    className="ss-message__content--user-textarea-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {textarea.title_require && (
                      <span className="ss-message__content--user-textarea-title">
                        {textarea.title}
                      </span>
                    )}
                    {textarea.require === true &&
                      textarea?.type === "text_input" && (
                        <span className="ss-message__content--user-text-input-required">
                          ※必須
                        </span>
                      )}
                  </div>
                )}
                {(textarea?.type === "text_input" ||
                  textarea?.type === "invalid_input") && (
                  <textarea
                    disabled={disabled || textarea?.type === "invalid_input"}
                    className="ss-message__content--user-textarea ss-input-value"
                    placeholder={textarea[textarea.type]?.content}
                    rows={3}
                    onChange={(e) =>
                      onChangeValue(
                        indexContent,
                        content.type,
                        e.target.value,
                        textarea?.type,
                        "value"
                      )
                    }
                    value={
                      textarea?.type === "invalid_input"
                        ? textarea[textarea.type]?.content
                        : textarea[textarea.type]?.value
                    }
                  ></textarea>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'radio_button' */}
            {content.type === "radio_button" && (
              <div style={{ marginBottom: "10px" }}>
                {(radioButton.title_require || radioButton.require) && (
                  <div
                    className="ss-message__content--user-radio_button-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {radioButton.title_require && (
                      <span className="ss-message__content--user-radio_button-title">
                        {radioButton.title}
                      </span>
                    )}
                    {radioButton.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div className="ss-message__content--user-radio_button-wrapper">
                  {radioButton.type === "default" &&
                    radioButton[radioButton.type].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ss-message__content--user-radio_button"
                        >
                          <input
                            disabled={disabled}
                            type="radio"
                            id="ss-message__content--user-radio_button"
                            checked={radioButton.initial_selection === item.id}
                            onChange={() => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                item.id,
                                "initial_selection"
                              );
                              if (messageContent.length === 1) onClickNext();
                            }}
                          />
                          {item.text && (
                            <label htmlFor="ss-message__content--user-radio_button">
                              {item.text}
                            </label>
                          )}
                        </div>
                      );
                    })}
                  {radioButton.type === "radio_button_img" &&
                    radioButton[radioButton.type].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ss-message__content--user-radio_button--radio_button_img"
                        >
                          <input
                            disabled={disabled}
                            type="radio"
                            name="ss-message__content--user-radio_button--radio_button_img"
                            id="ss-message__content--user-radio_button--radio_button_img"
                            checked={radioButton.initial_selection === item.id}
                            onChange={() => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                item.id,
                                "initial_selection"
                              );
                              if (messageContent.length === 1) onClickNext();
                            }}
                          />
                          <img src={item.img} alt="" />
                          {item.text && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {item.text}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {radioButton.type === "consume_api_response" && (
                    <>
                      <div className="ss-message__content--user-radio_button">
                        <input
                          type="radio"
                          name="ss-message__content--user-radio_button"
                          id="ss-message__content--user-radio_button"
                        />
                        <label htmlFor="ss-message__content--user-radio_button">
                          ラベル
                        </label>
                      </div>
                      <div className="ss-message__content--user-radio_button">
                        <input
                          type="radio"
                          name="ss-message__content--user-radio_button"
                          id="ss-message__content--user-radio_button"
                        />
                        <label htmlFor="ss-message__content--user-radio_button">
                          ラベル
                        </label>
                      </div>
                    </>
                  )}
                  {radioButton.type === "block_style" &&
                    radioButton[radioButton.type].map((item, index) => {
                      return (
                        item.text && (
                          <div
                            style={{
                              marginBottom: "10px",
                              cursor: "pointer",
                              backgroundColor: radioButton.value
                                ? radioButton.value === item.id
                                  ? "#347AED"
                                  : ""
                                : radioButton.initial_selection === item.id
                                ? "#347AED"
                                : "",
                            }}
                            key={index}
                            className="ss-message__content--user-radio_button--block_style"
                            onClick={() => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                item.id,
                                "initial_selection"
                              );
                              if (messageContent.length === 1) onClickNext();
                            }}
                          >
                            <span>{item.text}</span>
                          </div>
                        )
                      );
                    })}
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'checkbox' */}
            {content.type === "checkbox" && (
              <div style={{ marginBottom: "10px" }}>
                {(checkbox.title_require || checkbox.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {checkbox.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {checkbox.title}
                      </span>
                    )}
                    {checkbox.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {checkbox.type === "default" && (
                    <Checkbox.Group
                      style={{ width: "100%" }}
                      disabled={disabled}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "checkedValue"
                        )
                      }
                      value={checkbox.checkedValue}
                    >
                      {checkbox[checkbox.type].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="ss-message__content--user-checkbox"
                          >
                            <Checkbox value={item.id}>
                              <label htmlFor="ss-message__content--user-checkbox">
                                {item.text}
                              </label>
                            </Checkbox>
                          </div>
                        );
                      })}
                    </Checkbox.Group>
                  )}
                  {/* {checkbox.type === 'checkbox_img' && (
                      checkbox[checkbox.type].map((item, index) => {
                        return <div key={index} className="ss-message__content--user-checkbox--checkbox_img" style={{ marginBottom: '10px' }}>
                          <CheckboxCustom
                            disabled={disabled}
                            onChange={() => onChangeValueCheckbox(indexContent, content.type, item.id, 'checkedValue')}
                            value={checkbox.checkedValue.includes(item.id)}
                            isOnChange={false}
                          />
                          <img
                            src={item.img}
                            alt=""
                          />
                          <div style={{ textAlign: 'center' }}>{item.text}</div>
                        </div>
                      })
                    )} */}
                  {checkbox.type === "checkbox_img" && checkbox[checkbox.type] && (
                    <Checkbox.Group
                      disabled={disabled}
                      style={{ width: "100%", fontSize: "14px" }}
                      className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width"
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "initial_selection_picture"
                        )
                      }
                      value={checkbox.initial_selection_picture}
                    >
                      {checkbox[checkbox.type].map(
                        (itemCheckboxImg, indexCheckboxImg) => {
                          return (
                            <div
                              key={indexCheckboxImg}
                              style={{ color: "#6789A6", display: "flex" }}
                            >
                              {itemCheckboxImg.contents &&
                                itemCheckboxImg.contents.map(
                                  (itemCheckContent, indexCheckboxContent) => {
                                    return (
                                      <Checkbox
                                        value={`${itemCheckboxImg.id}-${itemCheckContent.id}`}
                                        key={indexCheckboxContent}
                                        style={{ marginRight: "0px" }}
                                      >
                                        <img
                                          src={itemCheckContent.file_url}
                                        ></img>
                                        <div
                                          style={{
                                            textAlign: "center",
                                            fontSize: "14px",
                                            color: "#6789A6",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {itemCheckContent.text}
                                        </div>
                                      </Checkbox>
                                    );
                                  }
                                )}
                            </div>
                          );
                        }
                      )}
                    </Checkbox.Group>
                  )}
                  {checkbox.type === "consume_api_response" && (
                    <>
                      <div className="ss-message__content--user-checkbox">
                        <input
                          type="checkbox"
                          name="ss-message__content--user-checkbox"
                          id="ss-message__content--user-checkbox"
                        />
                        <label htmlFor="ss-message__content--user-checkbox">
                          ラベル
                        </label>
                      </div>
                      <div className="ss-message__content--user-checkbox">
                        <input
                          type="checkbox"
                          name="ss-message__content--user-checkbox"
                          id="ss-message__content--user-checkbox"
                        />
                        <label htmlFor="ss-message__content--user-checkbox">
                          ラベル
                        </label>
                      </div>
                    </>
                  )}
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'pull_down' */}
            {content.type === "pull_down" && (
              <div style={{ marginBottom: "10px" }}>
                {(pullDown.title_require || pullDown.require) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {pullDown.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {pullDown.title}
                      </span>
                    )}
                    {pullDown.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div className="ss-message__content--user-pull_down-wrapper">
                  {pullDown.type === "customization" && (
                    <>
                      <div className="ss-message__content--user-pull_down--customization">
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginBottom: "4px" }}
                        >
                          <span>{pullDown[pullDown.type].title_comment}</span>
                        </div>
                        <div className="">
                          {pullDown[pullDown.type].is_comment === false ? (
                            <div className="ss-message__content--user-pull_down-col col-12">
                              <SelectCustom
                                disabled={disabled}
                                data={
                                  pullDown[pullDown.type]
                                    .options_without_comment
                                }
                                keyValue="text"
                                style={{ width: "100%" }}
                                placeholder={
                                  pullDown[pullDown.type].display_unselected
                                }
                                nameValue="text"
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "value"
                                  )
                                }
                                value={pullDown[pullDown.type].value}
                              />
                            </div>
                          ) : (
                            <div
                              className="ss-message__content--user-pull_down-col col-12"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <SelectCustom
                                disabled={disabled}
                                data={
                                  pullDown[pullDown.type].options_with_comment
                                }
                                keyValue="text"
                                style={{ width: "49%" }}
                                placeholder={
                                  pullDown[pullDown.type].display_unselected
                                }
                                nameValue="text"
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueLeft"
                                  )
                                }
                                value={pullDown[pullDown.type].valueLeft}
                              />
                              <SelectCustom
                                disabled={disabled}
                                data={
                                  pullDown[pullDown.type].options_with_comment
                                }
                                keyValue="text2"
                                style={{ width: "49%" }}
                                placeholder={
                                  pullDown[pullDown.type].display_unselected
                                }
                                nameValue="text2"
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueRight"
                                  )
                                }
                                value={pullDown[pullDown.type].valueRight}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginTop: "4px" }}
                        >
                          <span>{pullDown[pullDown.type].comment}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {pullDown.type === "time_hm" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {(pullDown.type === "date_ymd" ||
                    pullDown.type === "dob_ymd") && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "date_md" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {(pullDown.type === "date_ym" ||
                    pullDown.type === "dob_ym") && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "date_ymd_hm" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%", marginBottom: "10px" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "timezone_from_to" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour1"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour1}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute1"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute1}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>~</div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour2"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour2}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute2"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute2}
                          />
                        </div>
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginTop: "4px", width: "32%" }}
                        >
                          <span>{pullDown[pullDown.type].comment}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "period_from_to" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear1"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear1}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth1"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth1}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay1"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay1}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>~</div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={disabled}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear2"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear2}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth2"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth2}
                          />
                          <SelectCustom
                            disabled={disabled}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay2"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay2}
                          />
                        </div>
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginTop: "4px", width: "32%" }}
                        >
                          <span>{pullDown[pullDown.type].comment}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "prefectures" && (
                    <React.Fragment>
                      <SelectCustom
                        disabled={disabled}
                        data={dataPrefectures}
                        placeholder="選択してください。"
                        style={{ width: "100%" }}
                        keyValue="name"
                        nameValue="name"
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            pullDown.type,
                            "value"
                          )
                        }
                        value={pullDown[pullDown.type]?.value}
                      />
                    </React.Fragment>
                  )}
                  {pullDown.type === "up_to_municipality" && (
                    <div>
                      <div style={{ fontWeight: "400", fontSize: "12px" }}>
                        {pullDown[pullDown.type].prefecture_comment}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <SelectCustom
                          disabled={disabled}
                          data={dataPrefectures}
                          placeholder="都道府県を選択"
                          style={{ width: "45%" }}
                          keyValue="name"
                          nameValue="name"
                          onChange={async (value) => {
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              pullDown.type,
                              "prefecture"
                            );
                            if (value) {
                              let prefecture_jis_code = dataPrefectures.find(
                                (item) => item.name === value
                              ).prefecture_jis_code;
                              api
                                .get(
                                  `/api/v1/cities?prefecture_jis_code=${prefecture_jis_code}`
                                )
                                .then((res) => {
                                  if (res.data.code === 1) {
                                    setDataCity(res.data.data);
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                  if (error.response?.data.code === 0) {
                                    tokenExpired();
                                  }
                                });
                            } else {
                              onChangeValue(
                                indexContent,
                                content.type,
                                null,
                                pullDown.type,
                                "city"
                              );
                              setDataCity([]);
                            }
                          }}
                          value={pullDown[pullDown.type].prefecture}
                        />
                        <span>~</span>
                        <SelectCustom
                          disabled={disabled}
                          data={dataCity}
                          placeholder="市区町村を選択"
                          style={{ width: "45%" }}
                          keyValue="city_name"
                          nameValue="city_name"
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              pullDown.type,
                              "city"
                            )
                          }
                          value={pullDown[pullDown.type].city}
                        />
                      </div>
                      <div style={{ fontWeight: "400", fontSize: "12px" }}>
                        {pullDown[pullDown.type].city_comment}
                      </div>
                    </div>
                  )}
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}_${pullDown.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}_${pullDown.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'zip_code_address' */}
            {content.type === "zip_code_address" && (
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    marginBottom: "10px",
                    textDecoration: "underline",
                    ...(!disabled ? { color: "#2c76f0" } : { color: "gray" }),
                    textAlign: "right",
                  }}
                >
                  <span
                    style={!disabled ? { cursor: "pointer" } : {}}
                    onClick={() => {
                      if (disabled !== true) isPopUpZipCode(true, indexContent);
                    }}
                  >
                    〒検索はこちら
                  </span>
                </div>
                {(zipCodeAddress.title_require ||
                  zipCodeAddress.isCheckRequire) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {zipCodeAddress.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {zipCodeAddress.title}
                      </span>
                    )}
                    {(zipCodeAddress.isCheckRequire === "all_items_require" ||
                      zipCodeAddress.isCheckRequire === "require") && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {zipCodeAddress.post_code !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "5px",
                      }}
                    >
                      郵便番号
                    </div>
                    {zipCodeAddress.split_postal_code !== true ? (
                      <InputCustom
                        type="number"
                        placeholder={zipCodeAddress.post_code}
                        disabled={disabled}
                        // controls={false}
                        // className="ss-user-setting-input-limit-character"
                        // maxLength={7}
                        onKeyPress={(e) => {
                          if (e.target.value.length >= 7) e.preventDefault();
                        }}
                        style={{ width: "100%", marginLeft: "0px" }}
                        onChange={async (value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "value_post_code"
                          );
                          if ((value + "").length === 7) {
                            api
                              .get(
                                `/api/v1/get_address_from_zip_code?zip_code=${value}`
                              )
                              .then((res) => {
                                if (res.data && res.data.code === 1) {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    res.data.data.prefecture_name,
                                    "value_prefecture"
                                  );
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    `${res.data.data.city_name}${res.data.data.town_name}`,
                                    "value_municipality"
                                  );
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    ""
                                  );
                                  document
                                    .getElementById("ss-user-input-address")
                                    .focus();
                                  document
                                    .getElementById("ss-user-input-address")
                                    .select();
                                } else {
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    "無効な郵便番号です。"
                                  );
                                }
                              })
                              .catch((error) => {
                                onChangeErrors(
                                  `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                  "無効な郵便番号です。"
                                );
                                if (error.response?.data.code === 0) {
                                  tokenExpired();
                                }
                              });
                          } else if ((value + "").length !== 0) {
                            onChangeErrors(
                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                              "無効な郵便番号です。"
                            );
                          } else {
                            onChangeErrors(
                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                              ""
                            );
                          }
                        }}
                        value={zipCodeAddress.value_post_code}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <InputCustom
                          type="number"
                          placeholder={zipCodeAddress.post_code_left}
                          disabled={disabled}
                          style={{ width: "49%" }}
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 3) e.preventDefault();
                          }}
                          onChange={async (value) => {
                            if ((value + "").length === 3) {
                              document
                                .getElementById("ss-user-post-code-right-input")
                                .focus();
                              document
                                .getElementById("ss-user-post-code-right-input")
                                .select();
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_post_code_left"
                            );
                            if (
                              (value + "").length === 3 &&
                              zipCodeAddress.value_post_code_right &&
                              (zipCodeAddress.value_post_code_right + "")
                                .length === 4
                            ) {
                              api
                                .get(
                                  `/api/v1/get_address_from_zip_code?zip_code=${value}${zipCodeAddress.value_post_code_right}`
                                )
                                .then((res) => {
                                  if (res.data && res.data.code === 1) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      res.data.data.prefecture_name,
                                      "value_prefecture"
                                    );
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      `${res.data.data.city_name}${res.data.data.town_name}`,
                                      "value_municipality"
                                    );
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      ""
                                    );
                                    document
                                      .getElementById("ss-user-input-address")
                                      .focus();
                                    document
                                      .getElementById("ss-user-input-address")
                                      .select();
                                  } else {
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      "無効な郵便番号です。"
                                    );
                                  }
                                })
                                .catch((error) => {
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    "無効な郵便番号です。"
                                  );
                                  if (error.response?.data.code === 0) {
                                    tokenExpired();
                                  }
                                });
                            } else if (
                              (value + "").length !== 0 ||
                              (zipCodeAddress.value_post_code_right + "")
                                .length !== 0
                            ) {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                "無効な郵便番号です。"
                              );
                            } else {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                ""
                              );
                            }
                          }}
                          value={zipCodeAddress.value_post_code_left}
                        />
                        <InputCustom
                          type="number"
                          placeholder={zipCodeAddress.post_code_right}
                          disabled={disabled}
                          id="ss-user-post-code-right-input"
                          style={{ width: "49%" }}
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 4) e.preventDefault();
                          }}
                          onChange={async (value) => {
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_post_code_right"
                            );
                            if (
                              (value + "").length === 4 &&
                              zipCodeAddress.value_post_code_left &&
                              (zipCodeAddress.value_post_code_left + "")
                                .length === 3
                            ) {
                              api
                                .get(
                                  `/api/v1/get_address_from_zip_code?zip_code=${zipCodeAddress.value_post_code_left}${value}`
                                )
                                .then((res) => {
                                  if (res.data && res.data.code === 1) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      res.data.data.prefecture_name,
                                      "value_prefecture"
                                    );
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      `${res.data.data.city_name}${res.data.data.town_name}`,
                                      "value_municipality"
                                    );
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      ""
                                    );
                                    document
                                      .getElementById("ss-user-input-address")
                                      .focus();
                                    document
                                      .getElementById("ss-user-input-address")
                                      .select();
                                  } else {
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      "無効な郵便番号です。"
                                    );
                                  }
                                })
                                .catch((error) => {
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    "無効な郵便番号です。"
                                  );
                                  if (error.response?.data.code === 0) {
                                    tokenExpired();
                                  }
                                });
                            } else if (
                              (value + "").length !== 0 ||
                              (zipCodeAddress.value_post_code_left + "")
                                .length !== 0
                            ) {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                "無効な郵便番号です。"
                              );
                            } else {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                ""
                              );
                            }
                          }}
                          value={zipCodeAddress.value_post_code_right}
                        />
                      </div>
                    )}
                  </div>
                )}
                {zipCodeAddress.prefecture !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      都道府県
                    </div>
                    {zipCodeAddress.is_use_dropdown ? (
                      <SelectCustom
                        style={{ width: "100%" }}
                        value={zipCodeAddress?.value_prefecture}
                        data={dataPrefectures}
                        keyValue="name"
                        nameValue="name"
                        placeholder={zipCodeAddress.prefecture}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "value_prefecture"
                          )
                        }
                      />
                    ) : (
                      <InputCustom
                        placeholder={zipCodeAddress.prefecture}
                        disabled={disabled}
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "value_prefecture"
                          )
                        }
                        value={zipCodeAddress.value_prefecture}
                      />
                    )}
                  </div>
                )}
                {zipCodeAddress.municipality !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      市区町村
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.municipality}
                      disabled={disabled}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_municipality"
                        )
                      }
                      value={zipCodeAddress.value_municipality}
                    />
                  </div>
                )}
                {zipCodeAddress.address !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      番地
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.address}
                      id="ss-user-input-address"
                      disabled={disabled}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_address"
                        )
                      }
                      value={zipCodeAddress.value_address}
                    />
                  </div>
                )}
                {zipCodeAddress.building_name !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      建物名
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.building_name}
                      id="ss-user-input-building"
                      disabled={disabled}
                      style={{ width: "100%" }}
                      onChange={(value) =>{
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_building_name"
                        );
                        
                      }
                      }
                      
                      value={zipCodeAddress.value_building_name}
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'attaching_file' */}
            {content.type === "attaching_file" && (
              <div style={{ marginBottom: "10px" }}>
                {attachingFile.require && (
                  <div className="ss-message__content--user-attaching_file-top">
                    {attachingFile.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div className="ss-message__content--user-attaching_file">
                  <div style={{ position: "relative" }}>
                    <InputCustom
                      value={attachingFile.value || "未選択"}
                      disabled={true}
                    />
                    <MDBIcon
                      fas
                      icon="times-circle"
                      className={`ss-message-custom-icon-times ${
                        disabled && "ss-message-custom-icon-times-disabled"
                      }`}
                      onClick={() => {
                        if (!disabled) {
                          onChangeValue(
                            indexContent,
                            content.type,
                            "",
                            "value"
                          );
                        }
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    id="ss-bot-file-upload-preview"
                    name="bot-file-upload"
                    hidden
                    onChange={(e) => getBaseUrl(e, indexContent)}
                  />
                  <Button
                    id={`sp-button-upload-${indexContent}`}
                    className="ss-message__content--user-attaching_file-btn"
                    style={{
                      backgroundColor: "#A3B1BF",
                      marginTop: "3px",
                      width: "100%",
                    }}
                    disabled={disabled}
                    onClick={botUploadFile}
                  >
                    ファイルを選択
                  </Button>
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'calendar' */}
            {content.type === "calendar" && (
              <div style={{ marginBottom: "10px" }}>
                {(calendar.title_require || calendar.require) && (
                  <div
                    className="ss-message__content--user-calender-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {calendar.title_require && (
                      <span className="ss-message__content--user-calender-title">
                        {calendar.title}
                      </span>
                    )}
                    {calendar.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {/* calendar: type = 'date_selection' */}
                {calendar.type === "date_selection" && (
                  <React.Fragment>
                    <DatePickerCustom
                      disabled={disabled}
                      locale={locale}
                      format={"YYYY-MM-DD"}
                      style={{ width: "99%", marginTop: "5px" }}
                      value={
                        calendar.date_select
                          ? moment(calendar.date_select, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date, dateString) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          dateString,
                          "date_select"
                        )
                      }
                      disabledDate={(current) =>
                        handleDisableDateCalendar(current, calendar)
                      }
                    />
                  </React.Fragment>
                )}
                {/* calendar: type = 'embedded' */}
                {calendar.type === "embedded" && (
                  <React.Fragment>
                    <div
                      className="ss-message__content--user-calender-embedded"
                      style={{ marginTop: "5px" }}
                    >
                      <Calendar
                        // onLoad={
                        //   checkLoadCalendar()
                        // }
                        disabled={disabled}
                        className="ss-custom-calendar"
                        fullscreen={false}
                        locale={locale}
                        // format={"YYYY-MM-DD"}
                        headerRender={({
                          value,
                          type,
                          onChange,
                          onTypeChange,
                        }) => {
                          const start = 0;
                          const end = 12;
                          const monthOptions = [];
                          value = value ? value : moment();
                          let current = value.clone();
                          const localeData = value.localeData();
                          const months = [];
                          for (let i = 0; i < 12; i++) {
                            current = current.month(i);
                            months.push(localeData.monthsShort(current));
                          }

                          for (let i = start; i < end; i++) {
                            monthOptions.push(
                              <Select.Option
                                key={i}
                                value={i}
                                className="month-item"
                              >
                                {months[i]}
                              </Select.Option>
                            );
                          }

                          const year = value.year();
                          const month = value.month();
                          const options = [];
                          for (let i = year - 50; i < year + 50; i += 1) {
                            options.push(
                              <Select.Option
                                key={i}
                                value={i}
                                className="year-item"
                              >
                                {i}
                              </Select.Option>
                            );
                          }
                          return (
                            <div style={{ padding: 8 }}>
                              <Row gutter={8}>
                                <Col>
                                  <Select
                                    size="small"
                                    dropdownMatchSelectWidth={false}
                                    className="my-year-select"
                                    value={year}
                                    onChange={(newYear) => {
                                      const now = value.clone().year(newYear);
                                      onChange(now);
                                    }}
                                  >
                                    {options}
                                  </Select>
                                </Col>
                                <Col>
                                  <Select
                                    size="small"
                                    dropdownMatchSelectWidth={false}
                                    value={month}
                                    onChange={(newMonth) => {
                                      const now = value.clone().month(newMonth);
                                      onChange(now);
                                    }}
                                  >
                                    {monthOptions}
                                  </Select>
                                </Col>
                                <Col>
                                  <Radio.Group
                                    size="small"
                                    onChange={(e) =>
                                      onTypeChange(e.target.value)
                                    }
                                    value={type}
                                  >
                                    <Radio.Button value="month">
                                      月
                                    </Radio.Button>
                                    <Radio.Button value="year">年</Radio.Button>
                                  </Radio.Group>
                                </Col>
                              </Row>
                            </div>
                          );
                        }}
                        style={{
                          top: "20px",
                          width: "300px",
                          border: "1px solid grey",
                        }}
                        value={
                          calendar.date_select
                            ? moment(calendar.date_select, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "date_select"
                          )
                        }
                        disabledDate={(current) =>
                          handleDisableDateCalendar(current, calendar)
                        }
                      />
                    </div>
                  </React.Fragment>
                )}
                {/* calendar: type = 'start_end_date' */}
                {calendar.type === "start_end_date" && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <DatePickerCustom
                      disabled={disabled}
                      style={{ width: "49%", marginTop: "5px" }}
                      disabledDate={(current) =>
                        handleDisableDateCalendar(current, calendar)
                      }
                      value={
                        calendar.start_date_select
                          ? moment(calendar.start_date_select, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date, dateString) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          dateString,
                          "start_date_select"
                        )
                      }
                    />
                    <DatePickerCustom
                      disabled={disabled}
                      style={{ width: "49%", marginTop: "5px" }}
                      disabledDate={(current) =>
                        handleDisableEndDateCalendar(current, calendar)
                      }
                      value={
                        calendar.end_date_select
                          ? moment(calendar.end_date_select, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date, dateString) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          dateString,
                          "end_date_select"
                        )
                      }
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'agree_term' */}
            {content.type === "agree_term" && (
              <div style={{ marginBottom: "10px" }}>
                {/* {(agreeTerm.title_require || agreeTerm.require) && */}
                <div
                  className="ss-message__content--user-agree_to_term-top"
                  style={{ marginBottom: "0px" }}
                >
                  {agreeTerm.title_require && (
                    <span className="ss-message__content--user-agree_to_term-title">
                      {agreeTerm.title}
                    </span>
                  )}
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                </div>
                {/* } */}
                {/* agreeTerm: type = 'detail_content' */}
                {agreeTerm.type === "detail_content" && (
                  <React.Fragment>
                    <div className="ss-message__content--user-agree_to_term-detail_content">
                      <textarea
                        name="ss-message__content--user-agree_to_term-detail_content"
                        id=""
                        rows={
                          agreeTerm[agreeTerm.type].content?.length > 200
                            ? 8
                            : 5
                        }
                        value={agreeTerm[agreeTerm.type].content}
                        className="ss-input-value"
                        readOnly
                      ></textarea>
                      <CheckboxCustom
                        disabled={disabled}
                        label={agreeTerm.term}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "isAgree"
                          )
                        }
                        value={agreeTerm.isAgree}
                      />
                    </div>
                  </React.Fragment>
                )}
                {/* agreeTerm: type = 'post_link_only' */}
                {agreeTerm.type === "post_link_only" && (
                  <div>
                    {agreeTerm[agreeTerm.type].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ss-message__content--user-agree_to_term-post_link_only"
                        >
                          <span style={{ marginRight: "8px" }}>
                            {item.title_comment}
                          </span>
                          <a href={item.urls} target="_blank">
                            {item.title}
                          </a>
                          <span style={{ marginLeft: "8px" }}>
                            {item.url_comment}
                          </span>
                        </div>
                      );
                    })}
                    <CheckboxCustom
                      disabled={disabled}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "isAgree"
                        )
                      }
                      value={agreeTerm.isAgree}
                      label={agreeTerm.term}
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'carousel' */}
            {content.type === "carousel" && (
              <div style={{ marginBottom: "10px" }}>
                {(carousel.title_require || carousel.require) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {carousel.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {carousel.title}
                      </span>
                    )}
                    {carousel.require && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {/* carousel: type = 'default' */}
                {carousel.type === "default" && (
                  <div className="sp-carousel-container-preivew">
                    {carousel[carousel.type].contents &&
                      carousel[carousel.type].contents.map(
                        (itemCarousel, indexCarousel) => {
                          return (
                            <div
                              className="sp-carousel-container-block-item"
                              key={indexCarousel}
                            >
                              <div
                                className="sp-carousel-container-block-item-infor"
                                onClick={() =>
                                  handleClickCarousel(
                                    itemCarousel.urls,
                                    carousel.use_shortened_urls
                                  )
                                }
                              >
                                <div className="sp-carousel-preview-img">
                                  <img
                                    src={itemCarousel.fileUrl}
                                    style={{ width: "100%" }}
                                  />
                                </div>
                                <div className="sp-carousel-preview-title">
                                  {itemCarousel.title}
                                </div>
                                <div className="sp-carousel-preview-sub-title">
                                  {itemCarousel.subtitle}
                                </div>
                              </div>
                              <div
                                className="sp-carousel-preview-button"
                                style={
                                  carousel.initial_selection === itemCarousel.id
                                    ? { backgroundColor: "white" }
                                    : disabled
                                    ? { backgroundColor: "#B2B0AE" }
                                    : {}
                                }
                                onClick={() => {
                                  if (
                                    carousel.initial_selection !==
                                      itemCarousel.id &&
                                    !disabled
                                  ) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      itemCarousel.id,
                                      "initial_selection"
                                    );
                                    if (
                                      carousel.require &&
                                      messageContent.length === 1
                                    )
                                      onClickNext();
                                  }
                                }}
                              >
                                {itemCarousel.buttonTitle || "選択"}
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'credit_card_payment' */}
            {content.type === "credit_card_payment" && (
              <div style={{ marginBottom: "10px" }}>
                {(creditCardPayment.title_require ||
                  creditCardPayment.require) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {creditCardPayment.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {creditCardPayment.title}
                      </span>
                    )}
                    {creditCardPayment.require && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {creditCardPayment.payment_method.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "5px 0px",
                    }}
                  >
                    {creditCardPayment.payment_method.map(
                      (itemPayment, index) => {
                        return (
                          <div
                            key={index}
                            style={{ width: `${15.6667}%`, marginRight: "1%" }}
                            className="ss-img-list-bank"
                          >
                            {
                              dataPaymentMethod.find(
                                (item) => item.key === itemPayment
                              ).value
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                {creditCardPayment.separate_type === false ? (
                  <div className="ss-user-setting__item-bottom">
                    <InputCustom
                      styleLabel={{ width: "100%" }}
                      id="sp_credit_card_payment"
                      label="カード番号"
                      type="number"
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 16) e.preventDefault();
                      }}
                      disabled={disabled}
                      onPaste={(e) => {
                        // Get the pasted value and remove all white space
                        const value = e.clipboardData
                          .getData("text")
                          .replace(/[^0-9]/g, "")
                          .slice(0, 16);
                        setTimeout(() => {
                          document.getElementById(
                            "sp_credit_card_payment"
                          ).value = value;
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number"
                          );
                        }, 10);
                        // Set the value of the input to the pasted value
                        // return value;
                      }}
                      // max={9999999999999999}
                      style={{ width: "100%", marginLeft: "0px" }}
                      value={creditCardPayment.card_number}
                      placeholder={creditCardPayment.card_number_placeholder}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "card_number"
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className="ss-user-setting__item-bottom">
                    <div style={{ width: "100%" }}>カード番号</div>
                    <div
                      className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type"
                      style={{ width: "100%" }}
                    >
                      <InputNum
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "0px" }}
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number1}
                        placeholder={creditCardPayment.card_number_placeholder1}
                        onChange={(value) => {
                          if ((value + "").length === 4) {
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input2"
                              )
                              .focus();
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input2"
                              )
                              .select();
                          }
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number1"
                          );
                        }}
                      />
                      <InputNum
                        max={9999}
                        id="ss-user-card-number-radio-input2"
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number2}
                        placeholder={creditCardPayment.card_number_placeholder2}
                        onChange={(value) => {
                          if ((value + "").length === 4) {
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input3"
                              )
                              .focus();
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input3"
                              )
                              .select();
                          }
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number2"
                          );
                        }}
                      />
                      <InputNum
                        id="ss-user-card-number-radio-input3"
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number3}
                        placeholder={creditCardPayment.card_number_placeholder3}
                        onChange={(value) => {
                          if ((value + "").length === 4) {
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input4"
                              )
                              .focus();
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input4"
                              )
                              .select();
                          }
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number3"
                          );
                        }}
                      />
                      <InputNum
                        id="ss-user-card-number-radio-input4"
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number4}
                        placeholder={creditCardPayment.card_number_placeholder4}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number4"
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                {creditCardPayment.is_hide_card_name !== true && (
                  <div className="ss-user-setting__item-bottom">
                    <InputCustom
                      styleLabel={{ width: "100%" }}
                      label="カード名義"
                      inline={false}
                      disabled={disabled}
                      value={creditCardPayment.card_holder}
                      placeholder={creditCardPayment.card_holder_placeholder}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "card_holder"
                        )
                      }
                    />
                  </div>
                )}
                <div className="ss-user-setting__item-bottom">
                  <div style={{ width: "100%" }}>有効期限</div>
                  {creditCardPayment.type_date_of_expiry === "ym" && (
                    <div style={{ display: "flex", width: "100%" }}>
                      <SelectCustom
                        style={{ width: "33%" }}
                        value={creditCardPayment.year}
                        disabled={disabled}
                        placeholder={creditCardPayment.year_placeholder}
                        data={dataYearFixed.filter(
                          (item) =>
                            item.key >= new Date().getFullYear() &&
                            item.key <= new Date().getFullYear() + 10
                        )}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "year"
                          )
                        }
                      />
                      <SelectCustom
                        style={{ width: "33%", marginLeft: "10px" }}
                        value={creditCardPayment.month}
                        placeholder={creditCardPayment.month_placeholder}
                        data={dataMonth}
                        disabled={disabled}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "month"
                          )
                        }
                      />
                    </div>
                  )}
                  {creditCardPayment.type_date_of_expiry === "my" && (
                    <div style={{ display: "flex", width: "100%" }}>
                      <SelectCustom
                        style={{ width: "33%" }}
                        value={creditCardPayment.month}
                        placeholder={creditCardPayment.month_placeholder}
                        data={dataMonth}
                        disabled={disabled}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "month"
                          )
                        }
                      />
                      <SelectCustom
                        style={{ width: "33%", marginLeft: "10px" }}
                        value={creditCardPayment.year}
                        disabled={disabled}
                        placeholder={creditCardPayment.year_placeholder}
                        data={dataYearFixed.filter(
                          (item) =>
                            item.key >= new Date().getFullYear() &&
                            item.key <= new Date().getFullYear() + 10
                        )}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "year"
                          )
                        }
                      />
                    </div>
                  )}
                </div>
                {creditCardPayment.is_hide_cvc !== true && (
                  <div
                    className="ss-user-setting__item-bottom"
                    style={{ display: "block" }}
                  >
                    <InputNum
                      style={{ marginLeft: "0px", width: "33%" }}
                      className="ss-user-setting-input-limit-character"
                      max={9999}
                      maxLength={4}
                      disabled={disabled}
                      controls={false}
                      label={
                        <span style={{ fontWeight: "400" }}>
                          CVC <img style={{ width: "8%" }} src={cvcIcon} />
                        </span>
                      }
                      value={creditCardPayment.cvc}
                      placeholder={creditCardPayment.cvc_placeholder}
                      onChange={(value) =>
                        onChangeValue(indexContent, content.type, value, "cvc")
                      }
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'capture' */}
            {content.type === "capture" && (
              <div style={{ marginBottom: "10px" }}>
                <div
                  className="ss-message__content--user-pull_down-top"
                  style={{ marginBottom: "-5px" }}
                >
                  {capture.title_require && (
                    <span className="ss-message__content--user-pull_down-title">
                      {capture.title}
                    </span>
                  )}
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                </div>
                <div
                  className="ss-user-setting__item-bottom"
                  style={{ marginBottom: "0px" }}
                >
                  <InputCustom
                    disabled={disabled}
                    style={{ width: "50%" }}
                    value={capture.value}
                    onChange={(value) =>
                      onChangeValue(indexContent, content.type, value, "value")
                    }
                  />
                  {/* {new DOMParser().parseFromString(capture.img, "text/xml").innerHTML} */}
                  <div
                    id={`captcha-${indexMessageRender}-${indexContent}`}
                    style={{ width: "50%" }}
                    onLoad={loadCaptcha(indexContent)}
                  ></div>
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'product_purchase' */}
            {content.type === "product_purchase" && (
              <div style={{ marginBottom: "10px" }}>
                {(productPurchase.title_require || productPurchase.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {productPurchase.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {productPurchase.title}
                      </span>
                    )}
                    {productPurchase.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {productPurchase.type === "text_with_thumbnail_image" &&
                    (productPurchase.multiple_item_purchase ? (
                      <React.Fragment>
                        <Checkbox.Group
                          className="ss-user-preivew-product-purchase-checkbox-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={productPurchase.initial_selection}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  key={indexProduct}
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <Checkbox
                                    value={itemProduct.id}
                                    style={{ border: "none", padding: "0px" }}
                                    onChange={() => {
                                      let selectArr = [
                                        ...productPurchase.initial_selection,
                                      ];
                                      if (selectArr.includes(itemProduct.id)) {
                                        selectArr = [
                                          ...selectArr.filter(
                                            (item) => item !== itemProduct.id
                                          ),
                                        ];
                                      } else {
                                        selectArr.push(itemProduct.id);
                                      }
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        selectArr,
                                        "initial_selection"
                                      );
                                      // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container">
                                      <div className="ss-user-preivew-product-purchase-img">
                                        <img src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-preivew-product-purchase-infor">
                                          {productPurchase.product_name_display &&
                                            itemProduct.title && (
                                              <div className="ss-user-overview-product-purchase-infor-title">
                                                {itemProduct.title}
                                              </div>
                                            )}
                                          {productPurchase.product_number_display &&
                                            itemProduct.item_number && (
                                              <div className="ss-user-overview-product-purchase-infor-item-number">
                                                商品番号:{" "}
                                                {itemProduct.item_number}
                                              </div>
                                            )}
                                          {itemProduct.price_display_custom ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              {itemProduct.price_display_custom}
                                            </div>
                                          ) : (
                                            productPurchase.price_display &&
                                            itemProduct.item_price && (
                                              <div className="ss-user-overview-product-purchase-infor-price">
                                                値段: {itemProduct.item_price}{" "}
                                                円
                                              </div>
                                            )
                                          )}
                                          {(productPurchase.quantity_designation_all ||
                                            itemProduct.is_quantity_designation) &&
                                          itemProduct.quantity_limit ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              数量：最大
                                              {itemProduct.quantity_limit}個まで
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </Checkbox>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        style={{
                                          width: "46%",
                                          marginLeft: "177px",
                                        }}
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            selectArr.push(itemProduct.id);
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              selectArr,
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        min={1}
                                        disabled={disabled}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                            width: "46%",
                                            marginLeft: "137px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={productPurchase.initial_selection[0]}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                  key={indexProduct}
                                >
                                  <Radio
                                    value={itemProduct.id}
                                    style={{ border: "none", padding: "0px" }}
                                    onChange={() => {
                                      let selectArr = [
                                        ...productPurchase.initial_selection,
                                      ];
                                      let dataValue;
                                      if (selectArr.includes(itemProduct.id)) {
                                        dataValue = [];
                                      } else {
                                        dataValue = [itemProduct.id];
                                      }
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        dataValue,
                                        "initial_selection"
                                      );
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container">
                                      <div className="ss-user-preivew-product-purchase-img">
                                        <img src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-preivew-product-purchase-infor">
                                          {productPurchase.product_name_display &&
                                            itemProduct.title && (
                                              <div className="ss-user-overview-product-purchase-infor-title">
                                                {itemProduct.title}
                                              </div>
                                            )}
                                          {productPurchase.product_number_display &&
                                            itemProduct.item_number && (
                                              <div className="ss-user-overview-product-purchase-infor-item-number">
                                                商品番号:{" "}
                                                {itemProduct.item_number}
                                              </div>
                                            )}
                                          {itemProduct.price_display_custom ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              {itemProduct.price_display_custom}
                                            </div>
                                          ) : (
                                            productPurchase.price_display &&
                                            itemProduct.item_price && (
                                              <div className="ss-user-overview-product-purchase-infor-price">
                                                値段: {itemProduct.item_price}{" "}
                                                円
                                              </div>
                                            )
                                          )}
                                          {(productPurchase.quantity_designation_all ||
                                            itemProduct.is_quantity_designation) &&
                                          itemProduct.quantity_limit ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              数量：最大
                                              {itemProduct.quantity_limit}個まで
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {/* {productPurchase.multiple_item_purchase &&
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          Multiple item purchase
                                        </div>
                                      } */}
                                        </div>
                                      )}
                                    </div>
                                  </Radio>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        style={{
                                          width: "46%",
                                          marginLeft: "177px",
                                        }}
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              [itemProduct.id],
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        disabled={disabled}
                                        min={1}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                            width: "46%",
                                            marginLeft: "137px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Radio.Group>
                      </React.Fragment>
                    ))}
                  {productPurchase.type === "text_with_image" &&
                    (productPurchase.multiple_item_purchase ? (
                      <React.Fragment>
                        <Checkbox.Group
                          className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={productPurchase.initial_selection}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  key={indexProduct}
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <Checkbox
                                    key={indexProduct}
                                    value={itemProduct.id}
                                    onChange={() => {
                                      let selectArr = [
                                        ...productPurchase.initial_selection,
                                      ];
                                      if (selectArr.includes(itemProduct.id)) {
                                        selectArr = [
                                          ...selectArr.filter(
                                            (item) => item !== itemProduct.id
                                          ),
                                        ];
                                      } else {
                                        selectArr.push(itemProduct.id);
                                      }
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        selectArr,
                                        "initial_selection"
                                      );
                                      // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container-type-text_image">
                                      <div className="ss-user-overview-product-purchase-img-type-text_image">
                                        <img src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          {productPurchase.product_name_display &&
                                          itemProduct.title
                                            ? itemProduct.title
                                            : ""}{" "}
                                          {productPurchase.product_number_display &&
                                          itemProduct.item_number
                                            ? itemProduct.item_number
                                            : ""}{" "}
                                          {itemProduct.price_display_custom
                                            ? itemProduct.price_display_custom
                                            : productPurchase.price_display &&
                                              itemProduct.item_price
                                            ? `${itemProduct.item_price} 円`
                                            : ""}
                                        </div>
                                      )}
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) &&
                                      itemProduct.quantity_limit ? (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          数量：最大{itemProduct.quantity_limit}
                                          個まで
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Checkbox>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            selectArr.push(itemProduct.id);
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              selectArr,
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        min={1}
                                        disabled={disabled}
                                        style={{ width: "46%" }}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
                          onChange={(e) => {
                            let selectArr = [
                              ...productPurchase.initial_selection,
                            ];
                            let dataValue;
                            if (selectArr.includes(e.target.value)) {
                              dataValue = [];
                            } else {
                              dataValue = [e.target.value];
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              dataValue,
                              "initial_selection"
                            );
                          }}
                          value={productPurchase.initial_selection[0]}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                  key={indexProduct}
                                >
                                  <Radio
                                    value={itemProduct.id}
                                    key={indexProduct}
                                  >
                                    <div className="ss-user-overview-product-purchase-container-type-text_image">
                                      <div className="ss-user-overview-product-purchase-img-type-text_image">
                                        <img src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          {productPurchase.product_name_display &&
                                          itemProduct.title
                                            ? itemProduct.title
                                            : ""}{" "}
                                          {productPurchase.product_number_display &&
                                          itemProduct.item_number
                                            ? itemProduct.item_number
                                            : ""}{" "}
                                          {itemProduct.price_display_custom
                                            ? itemProduct.price_display_custom
                                            : productPurchase.price_display &&
                                              itemProduct.item_price
                                            ? `${itemProduct.item_price} 円`
                                            : ""}
                                        </div>
                                      )}
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) &&
                                      itemProduct.quantity_limit ? (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          数量：最大{itemProduct.quantity_limit}
                                          個まで
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Radio>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        style={{ width: "46%" }}
                                        disabled={disabled}
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              [itemProduct.id],
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        min={1}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Radio.Group>
                      </React.Fragment>
                    ))}
                  {productPurchase.type === "consume_api_response" && <></>}
                  {errors?.[
                    `message${indexMessage}_content${indexContent}_${content.type}`
                  ] && (
                    <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                      {
                        errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* type == 'product_purchase_radio_button' */}
            {content.type === "product_purchase_radio_button" && (
              <div style={{ marginBottom: "10px" }}>
                {(productPurchaseRadioButton.title_require ||
                  productPurchaseRadioButton.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {productPurchaseRadioButton.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {productPurchaseRadioButton.title}
                      </span>
                    )}
                    {productPurchaseRadioButton.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {productPurchaseRadioButton.type ===
                    "text_with_thumbnail_image" && (
                    <React.Fragment>
                      <Radio.Group
                        className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                        style={{ width: "100%" }}
                        disabled={disabled}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value.target.value,
                            "initial_selection"
                          );
                          if (messageContent.length === 1) onClickNext();
                        }}
                        value={productPurchaseRadioButton.initial_selection}
                      >
                        {productPurchaseRadioButton.products.map(
                          (itemProduct, indexProduct) => {
                            return (
                              <Radio
                                value={itemProduct.id}
                                key={indexProduct}
                                // onChange={() => {
                                //   let selectArr = [...productPurchaseRadioButton.initial_selection];
                                //   let dataValue;
                                //   if (selectArr.includes(itemProduct.id)) {
                                //     dataValue = [];
                                //   } else {
                                //     dataValue = [itemProduct.id];
                                //   }
                                //   onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                //   onClickNext();
                                // }}
                              >
                                <div className="ss-user-overview-product-purchase-container">
                                  <div className="ss-user-preivew-product-purchase-img">
                                    <img src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchaseRadioButton.product_name_display ||
                                    productPurchaseRadioButton.price_display ||
                                    productPurchaseRadioButton.product_number_display) && (
                                    <div className="ss-user-preivew-product-purchase-infor">
                                      {productPurchaseRadioButton.product_name_display &&
                                        itemProduct.title && (
                                          <div className="ss-user-overview-product-purchase-infor-title">
                                            {itemProduct.title}
                                          </div>
                                        )}
                                      {productPurchaseRadioButton.product_number_display &&
                                        itemProduct.item_number && (
                                          <div className="ss-user-overview-product-purchase-infor-item-number">
                                            商品番号: {itemProduct.item_number}
                                          </div>
                                        )}
                                      {itemProduct.price_display_custom ? (
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          {itemProduct.price_display_custom}
                                        </div>
                                      ) : (
                                        productPurchaseRadioButton.price_display &&
                                        itemProduct.item_price && (
                                          <div className="ss-user-overview-product-purchase-infor-price">
                                            値段: {itemProduct.item_price} 円
                                          </div>
                                        )
                                      )}
                                      {/* {productPurchaseRadioButton.multiple_item_purchase &&
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          Multiple item purchase
                                        </div>
                                      } */}
                                    </div>
                                  )}
                                </div>
                              </Radio>
                            );
                          }
                        )}
                      </Radio.Group>
                    </React.Fragment>
                  )}
                  {productPurchaseRadioButton.type === "text_with_image" && (
                    <React.Fragment>
                      <Radio.Group
                        className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                        style={{ width: "100%" }}
                        disabled={disabled}
                        value={productPurchaseRadioButton.initial_selection}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value.target.value,
                            "initial_selection"
                          );
                          if (messageContent.length === 1) onClickNext();
                        }}
                      >
                        {productPurchaseRadioButton.products.map(
                          (itemProduct, indexProduct) => {
                            return (
                              <Radio
                                value={itemProduct.id}
                                key={indexProduct}
                                // onChange={() => {
                                //   let selectArr = [...productPurchaseRadioButton.initial_selection];
                                //   let dataValue;
                                //   if (selectArr.includes(itemProduct.id)) {
                                //     dataValue = [];
                                //   } else {
                                //     dataValue = [itemProduct.id];
                                //   }
                                //   onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                //   onClickNext();
                                // }}
                              >
                                <div className="ss-user-overview-product-purchase-container-type-text_image">
                                  <div className="ss-user-overview-product-purchase-img-type-text_image">
                                    <img src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchaseRadioButton.product_name_display ||
                                    productPurchaseRadioButton.price_display ||
                                    productPurchaseRadioButton.product_number_display) && (
                                    <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                      {productPurchaseRadioButton.product_name_display &&
                                      itemProduct.title
                                        ? itemProduct.title
                                        : ""}{" "}
                                      {productPurchaseRadioButton.product_number_display &&
                                      itemProduct.item_number
                                        ? itemProduct.item_number
                                        : ""}{" "}
                                      {itemProduct.price_display_custom
                                        ? itemProduct.price_display_custom
                                        : productPurchaseRadioButton.price_display &&
                                          itemProduct.item_price
                                        ? `${itemProduct.item_price} 円`
                                        : ""}
                                    </div>
                                  )}
                                </div>
                              </Radio>
                            );
                          }
                        )}
                      </Radio.Group>
                    </React.Fragment>
                  )}
                  {productPurchaseRadioButton.type ===
                    "consume_api_response" && <></>}
                  {errors?.[
                    `message${indexMessage}_content${indexContent}_${content.type}`
                  ] && (
                    <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                      {
                        errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* type == 'slider' */}
            {content.type === "slider" && (
              <div style={{ marginBottom: "10px" }}>
                {(slider.title_require || slider.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {slider.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {slider.title}
                      </span>
                    )}
                    {slider.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <Slider
                    disabled={disabled}
                    value={slider.value}
                    onChange={(value) =>
                      onChangeValue(indexContent, content.type, value, "value")
                    }
                    trackStyle={{ backgroundColor: slider.color || "#2C75F0" }}
                    min={
                      slider.type === "discrete_type"
                        ? parseInt(slider.min_value)
                        : 0
                    }
                    max={
                      slider.type === "discrete_type"
                        ? parseInt(slider.max_value)
                        : 100
                    }
                    dots={slider.type === "discrete_type"}
                    step={slider.type !== "discrete_type" && 0.1}
                    marks={
                      slider.type === "discrete_type"
                        ? {
                            [slider.min_value]: slider.min_label,
                            [slider.max_value]: slider.max_label,
                          }
                        : {
                            0: slider.min_label,
                            100: slider.max_label,
                          }
                    }
                  />
                  {errors?.[
                    `message${indexMessage}_content${indexContent}_${content.type}`
                  ] && (
                    <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                      {
                        errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* type == 'card_payment_radio_button' */}
            {content.type === "card_payment_radio_button" && (
              <div style={{ marginBottom: "10px" }}>
                {(cardPaymentRadioButton.title_require ||
                  cardPaymentRadioButton.require) && (
                  <div
                    className="ss-message__content--user-text-input-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {cardPaymentRadioButton.title_require && (
                      <span className="ss-message__content--user-text-input-title">
                        {cardPaymentRadioButton.title}
                      </span>
                    )}
                    {cardPaymentRadioButton.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {cardPaymentRadioButton.type === "default" && (
                  <Radio.Group
                    style={{ width: "100%", fontSize: "14px" }}
                    disabled={disabled}
                    value={cardPaymentRadioButton.initial_selection}
                  >
                    {cardPaymentRadioButton.radio_contents &&
                      cardPaymentRadioButton.radio_contents.map(
                        (itemPayment, indexPayment) => {
                          return (
                            <Radio
                              value={itemPayment.value}
                              key={indexPayment}
                              style={{
                                backgroundColor: "#ECF5FA",
                                marginBottom: "5px",
                                padding: "5px",
                                width: "100%",
                              }}
                              onChange={() => {
                                let dataValue;
                                if (
                                  cardPaymentRadioButton.initial_selection !==
                                  itemPayment.value
                                ) {
                                  dataValue = itemPayment.value;
                                } else {
                                  dataValue = "";
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );

                                if (
                                  cardPaymentRadioButton.card_linked_setting.includes(dataValue)
                                ) {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    true,
                                    "is_display_card_payment"
                                  );
                                  displayButtonNext(true);
                                } else {
                                  displayButtonNext(false);
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    false,
                                    "is_display_card_payment"
                                  );
                                  if (messageContent.length === 1)
                                    onClickNext();
                                }
                              }}
                            >
                              {itemPayment.text}
                            </Radio>
                          );
                        }
                      )}
                  </Radio.Group>
                )}
                {cardPaymentRadioButton.type === "customized_style" && (
                  <Radio.Group
                    style={{ width: "100%", fontSize: "14px" }}
                    disabled={disabled}
                    value={cardPaymentRadioButton.initial_selection}
                    buttonStyle="solid"
                  >
                    {cardPaymentRadioButton.radio_contents &&
                      cardPaymentRadioButton.radio_contents.map(
                        (itemPayment, indexPayment) => {
                          return (
                            <Radio.Button
                              value={itemPayment.value}
                              key={indexPayment}
                              style={{
                                marginBottom: "5px",
                                padding: "5px",
                                width: "100%",
                                textAlign: "center",
                                lineHeight: "22px",
                              }}
                              onChange={() => {
                                let dataValue;
                                if (
                                  cardPaymentRadioButton.initial_selection !==
                                  itemPayment.value
                                ) {
                                  dataValue = itemPayment.value;
                                } else {
                                  dataValue = "";
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );

                                // if (cardPaymentRadioButton.card_linked_setting !== dataValue && messageContent.length === 1) {
                                //   onClickNext();
                                // }
                                if (
                                  cardPaymentRadioButton.card_linked_setting(dataValue)
                                ) {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    true,
                                    "is_display_card_payment"
                                  );
                                  displayButtonNext(true);
                                } else {
                                  displayButtonNext(false);
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    false,
                                    "is_display_card_payment"
                                  );
                                  if (messageContent.length === 1)
                                    onClickNext();
                                }
                              }}
                            >
                              {itemPayment.text}
                            </Radio.Button>
                          );
                        }
                      )}
                  </Radio.Group>
                )}
                {cardPaymentRadioButton.type === "picture_radio" &&
                  cardPaymentRadioButton.radio_contents_img &&
                  cardPaymentRadioButton.radio_contents_img.map(
                    (itemPaymentImg, indexPaymentImg) => {
                      return (
                        <div key={indexPaymentImg} style={{ color: "#6789A6" }}>
                          <Radio.Group
                            disabled={disabled}
                            style={{
                              width: "100%",
                              fontSize: "14px",
                              display: "flex",
                            }}
                            className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                            value={
                              cardPaymentRadioButton.initial_selection_picture
                            }
                          >
                            {itemPaymentImg.contents &&
                              itemPaymentImg.contents.map(
                                (itemPaymentContent, indexPaymentContent) => {
                                  return (
                                    <Radio
                                      value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                                      key={indexPaymentContent}
                                      style={{ marginRight: "0px" }}
                                      onChange={() => {
                                        let dataValue;
                                        if (
                                          cardPaymentRadioButton.initial_selection_picture !==
                                          `${itemPaymentImg.id}-${itemPaymentContent.id}`
                                        ) {
                                          dataValue = `${itemPaymentImg.id}-${itemPaymentContent.id}`;
                                        } else {
                                          dataValue = "";
                                        }
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          dataValue,
                                          "initial_selection_picture"
                                        );
                                        // if (cardPaymentRadioButton.card_linked_setting_picture !== dataValue && messageContent.length === 1) {
                                        //   onClickNext();
                                        // }
                                        if (
                                          cardPaymentRadioButton.card_linked_setting_picture ===
                                          dataValue
                                        ) {
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            true,
                                            "is_display_card_payment"
                                          );
                                          displayButtonNext(true);
                                        } else {
                                          displayButtonNext(false);
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            false,
                                            "is_display_card_payment"
                                          );
                                          if (messageContent.length === 1)
                                            onClickNext();
                                        }
                                      }}
                                    >
                                      <img
                                        src={itemPaymentContent.file_url}
                                      ></img>
                                      <div
                                        style={{
                                          textAlign: "center",
                                          fontSize: "14px",
                                          color: "#6789A6",
                                          fontWeight: "700",
                                        }}
                                      >
                                        {itemPaymentContent.text}
                                      </div>
                                    </Radio>
                                  );
                                }
                              )}
                          </Radio.Group>
                        </div>
                      );
                    }
                  )}
                {(cardPaymentRadioButton.type !== "picture_radio"
                  ? cardPaymentRadioButton.card_linked_setting.length > 0 &&
                    cardPaymentRadioButton.card_linked_setting.includes(cardPaymentRadioButton.initial_selection)
                  : cardPaymentRadioButton.card_linked_setting_picture &&
                    cardPaymentRadioButton.card_linked_setting_picture ===
                      cardPaymentRadioButton.initial_selection_picture) && (
                  <React.Fragment>
                    {cardPaymentRadioButton.payment_method.length !== 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          margin: "5px 0px",
                        }}
                      >
                        {cardPaymentRadioButton.payment_method.map(
                          (itemPayment, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  width: `${15.6667}%`,
                                  marginRight: "1%",
                                }}
                                className="ss-img-list-bank"
                              >
                                {
                                  dataPaymentMethod.find(
                                    (item) => item.key === itemPayment
                                  ).value
                                }
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                    {cardPaymentRadioButton.separate_type === false ? (
                      <div className="ss-user-setting__item-bottom">
                        {/* <InputNum
                            styleLabel={{ width: '100%' }}
                            className="ss-user-setting-input-limit-character"
                            label="カード番号"
                            controls={false}
                            max={Number.MAX_SAFE_INTEGER}
                            maxLength={16}
                            onPaste={e => {
                              // Get the pasted value and remove all white space
                              const value = e.clipboardData.getData('text').replace(/\s/g, '');
                              // Set the value of the input to the pasted value
                              onChangeValue(indexContent, content.type, value, 'card_number');
                              e.target.value = value;
                            }}
                            formatter={(value) => value.replace(/\s/g, "")}
                            parser={(value) => value.replace(/\s/g, "")}
                            disabled={disabled}
                            style={{ width: '100%', marginLeft: '0px' }}
                            value={cardPaymentRadioButton.card_number}
                            placeholder={cardPaymentRadioButton.card_number_placeholder}
                            onChange={value => onChangeValue(indexContent, content.type, value, 'card_number')}
                          /> */}
                        <InputCustom
                          styleLabel={{ width: "100%" }}
                          id="sp_credit_card_payment"
                          label="カード番号"
                          type="number"
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 16) e.preventDefault();
                          }}
                          disabled={disabled}
                          onPaste={(e) => {
                            // Get the pasted value and remove all white space
                            const value = e.clipboardData
                              .getData("text")
                              .replace(/[^0-9]/g, "")
                              .slice(0, 16);
                            setTimeout(() => {
                              document.getElementById(
                                "sp_credit_card_payment"
                              ).value = value;
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number"
                              );
                            }, 10);
                            // Set the value of the input to the pasted value
                            // return value;
                          }}
                          // max={9999999999999999}
                          style={{ width: "100%", marginLeft: "0px" }}
                          value={cardPaymentRadioButton.card_number}
                          placeholder={
                            cardPaymentRadioButton.card_number_placeholder
                          }
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "card_number"
                            )
                          }
                        />
                      </div>
                    ) : (
                      <div className="ss-user-setting__item-bottom">
                        <div style={{ width: "100%" }}>カード番号</div>
                        <div
                          style={{ width: "100%" }}
                          className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type"
                        >
                          <InputNum
                            max={9999}
                            controls={false}
                            style={{ marginLeft: "0px" }}
                            disabled={disabled}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number1}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder1
                            }
                            onChange={(value) => {
                              if ((value + "").length === 4) {
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input2"
                                  )
                                  .focus();
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input2"
                                  )
                                  .select();
                              }
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number1"
                              );
                            }}
                          />
                          <InputNum
                            max={9999}
                            id="ss-user-card-number-radio-input2"
                            controls={false}
                            style={{ marginLeft: "7px" }}
                            disabled={disabled}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number2}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder2
                            }
                            onChange={(value) => {
                              if ((value + "").length === 4) {
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input3"
                                  )
                                  .focus();
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input3"
                                  )
                                  .select();
                              }
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number2"
                              );
                            }}
                          />
                          <InputNum
                            id="ss-user-card-number-radio-input3"
                            max={9999}
                            controls={false}
                            style={{ marginLeft: "7px" }}
                            disabled={disabled}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number3}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder3
                            }
                            onChange={(value) => {
                              if ((value + "").length === 4) {
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input4"
                                  )
                                  .focus();
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input4"
                                  )
                                  .select();
                              }
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number3"
                              );
                            }}
                          />
                          <InputNum
                            id="ss-user-card-number-radio-input4"
                            max={9999}
                            controls={false}
                            style={{ marginLeft: "7px" }}
                            disabled={disabled}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number4}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder4
                            }
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number4"
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                    {cardPaymentRadioButton.is_hide_card_name === false && (
                      <div className="ss-user-setting__item-bottom">
                        <InputCustom
                          className="ss-user-setting-input-overview"
                          styleLabel={{ width: "100%" }}
                          label="カード名義"
                          inline={false}
                          disabled={disabled}
                          value={cardPaymentRadioButton.card_holder}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "card_holder"
                            )
                          }
                          placeholder={
                            cardPaymentRadioButton.card_holder_placeholder
                          }
                        />
                      </div>
                    )}
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ width: "100%" }}>有効期限</div>
                      {cardPaymentRadioButton.type_date_of_expiry === "ym" && (
                        <div style={{ display: "flex", width: "100%" }}>
                          <SelectCustom
                            style={{ width: "33%" }}
                            value={cardPaymentRadioButton.year}
                            disabled={disabled}
                            placeholder={"年"}
                            data={dataYearFixed.filter(
                              (item) =>
                                item.key >= new Date().getFullYear() &&
                                item.key <= new Date().getFullYear() + 10
                            )}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "year"
                              )
                            }
                          />
                          <SelectCustom
                            style={{ width: "33%", marginLeft: "10px" }}
                            value={cardPaymentRadioButton.month}
                            placeholder={"月"}
                            data={dataMonth}
                            disabled={disabled}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "month"
                              )
                            }
                          />
                        </div>
                      )}
                      {cardPaymentRadioButton.type_date_of_expiry === "my" && (
                        <div style={{ display: "flex", width: "100%" }}>
                          <SelectCustom
                            style={{ width: "33%" }}
                            value={cardPaymentRadioButton.month}
                            placeholder={"月"}
                            data={dataMonth}
                            disabled={disabled}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "month"
                              )
                            }
                          />
                          <SelectCustom
                            style={{ width: "33%", marginLeft: "10px" }}
                            value={cardPaymentRadioButton.year}
                            disabled={disabled}
                            placeholder={"年"}
                            data={dataYearFixed.filter(
                              (item) =>
                                item.key >= new Date().getFullYear() &&
                                item.key <= new Date().getFullYear() + 10
                            )}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "year"
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                    {cardPaymentRadioButton.is_hide_cvc === false && (
                      <div
                        className="ss-user-setting__item-bottom"
                        style={{ display: "block" }}
                      >
                        <InputNum
                          style={{ marginLeft: "0px", width: "33%" }}
                          className="ss-user-setting-input-limit-character"
                          max={9999}
                          maxLength={4}
                          disabled={disabled}
                          controls={false}
                          label={
                            <span style={{ fontWeight: "400" }}>
                              CVC <img style={{ width: "8%" }} src={cvcIcon} />
                            </span>
                          }
                          value={cardPaymentRadioButton.cvc}
                          placeholder={cardPaymentRadioButton.cvc_placeholder}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "cvc"
                            )
                          }
                        />
                      </div>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
            {/* type == 'label_no_transition' */}
            {content.type === "label_no_transition" && (
              <div style={{ marginBottom: "10px" }}>
                {labelNoTransition.value}
              </div>
            )}
          </React.Fragment>
        );
      })}
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
          <span style={{ fontSize: "16px" }}>{messageNoti}</span>
        </div>
      </ModalNoti>
    </div>
  );
};

export default Preview;
