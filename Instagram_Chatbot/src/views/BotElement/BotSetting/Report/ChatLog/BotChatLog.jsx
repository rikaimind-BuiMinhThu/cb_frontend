import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import api from "api/api-management";
import ja from "date-fns/locale/ja";
import Cookies from "js-cookie";
import { format } from "date-fns";
import "assets/css/bot/bot-chat-log.css";
import $ from "jquery";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import { isBoolean } from "lodash";
import moment from "moment";
registerLocale("ja", ja);

function BotChatLog() {
  const botId = Cookies.get("bot_id");
  const [scenarios, setScenarios] = useState([]);
  const [chats, setChats] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [selectScenario, setSelectScenario] = useState(null);
  const [selectUserId, setSelectUserId] = useState(null);

  const [searchUserId, setSearchUserId] = useState(null);
  const [searchScenarioId, setSearchScenarioId] = useState(null);
  const [searchDate, setSearchDate] = useState(null);
  const [searchStartDate, setSearchStartDate] = useState(null);
  const [searchEndDate, setSearchEndDate] = useState(null);
  const [isDisableEndDate, setIsDisableEndDate] = useState(true);

  useEffect(() => {
    if (
      Cookies.get("token") === undefined ||
      Cookies.get("token") == null ||
      Cookies.get("token") === ""
    ) {
      window.location.href = "/";
    }
    if (Cookies.get("is_auth") === "false") {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const params = {
      sc_id: searchScenarioId ? parseInt(searchScenarioId) : null,
      user_id: searchUserId,
      date: searchDate ? searchDate : null,
    };
    api
      .get(`/api/v1/managements/chat_log/${botId}/list`, params)
      .then((res) => {
        if (res.data.code === 1) {
          setScenarios(res.data.scenarios);
          var chatLength = res.data.chats.length;
          for (var i = 0; i < chatLength; i++) {
            res.data.chats[i].name = "ユーザー " + (chatLength - i);
          }
          setChats(res.data.chats);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onScenarioSearch(event) {
    if (event.target.value === "all") setSearchScenarioId(null);
    else setSearchScenarioId(event.target.value);
  }

  function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  function pressSearchButton() {
    const params = {
      sc_id: searchScenarioId ? parseInt(searchScenarioId) : null,
      user_id: searchUserId,
      date: searchDate ? formatDate(searchDate) : null,
      start_date: searchStartDate ? formatDate(searchStartDate) : null,
      end_date: searchEndDate ? formatDate(searchEndDate) : null
    };
    api
      .get(`/api/v1/managements/chat_log/${botId}/list`, {params})
      .then((res) => {
        if (res.data.code === 1) {
          setScenarios(res.data.scenarios);
          var chatLength = res.data.chats.length;
          for (var i = 0; i < chatLength; i++) {
            res.data.chats[i].name = "ユーザー " + (chatLength - i);
          }
          setChats(res.data.chats);
        }
      });
  }

  const [botInfor, setBotInfor] = useState();
  const [dataMessages, setDataMessages] = useState([]);
  const [dataVariables, setDataVariables] = useState([]);
  const [variables, setVariables] = useState([]);

  const [messageUser, setMessageUser] = useState([]);
  const [indexMessageRender, setIndexMessageRender] = useState(0);
  const [renderMessageArr, setRenderMessageArr] = useState([]);
  const [indexUser, setIndexUser] = useState(0);
  const [captcha, setCaptcha] = useState([]);
  const [dataPrefectures, setDataPrefectures] = useState([]);

  let SCAN_REGEX = /\{\{(.*?)\}\}/g;

  const [objParam, setObjParam] = useState(() => {
    let dataObj = {
      current_url: window.location.href,
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

  function changeStartDate(date) {
    if (!date) {
      setSearchEndDate(null);
      setIsDisableEndDate(true);
    } else {
      setIsDisableEndDate(false);
    }
    setSearchStartDate(date);
  }

  function onSelectChat(item) {
    setSelectUserId(item.user_input_id);
    var sc = scenarios.find((s) => s.id === item.scenario_id);
    sc.conversations = JSON.parse(sc.conversation).messages.sort(
      (a, b) => a.id - b.id
    );
    setSelectScenario(sc);
    api
      .get(
        `/api/v1/managements/chat_log/${item.scenario_id}/${item.user_input_id}`
      )
      .then((response) => {
        if (response.data.code === 1) {
          var conversations = response.data.conversations;
          for (var i = 0; i < conversations.length; i++) {
            if (
              ["data_name", "zip_code_address", "birth_date"].includes(
                conversations[i].data_input_name
              )
            ) {
              let str;
              if (conversations[i].string_value) {
                str = conversations[i].string_value.replaceAll(SCAN_REGEX);
              } else if (conversations[i].text_value) {
                str = conversations[i].text_value.replaceAll(SCAN_REGEX);
              }

              conversations[i].content = JSON.parse(str ?? "");
            }
            conversations[i].value =
              conversations[i].content ??
              conversations[i].boolean_value ??
              conversations[i].string_value ??
              conversations[i].text_value ??
              conversations[i].integer_value;
          }
          setConversions(conversations);

          api
            .get(
              `/api/v1/managements/chatbots/${botId}/scenarios/${item.scenario_id}/preview`
            )
            .then(async (res) => {
              if (res.data.code === 1) {
                let messageArr = [];
                if (res.data.data?.conversation?.messages?.length > 0) {
                  messageArr = [...res.data.data?.conversation?.messages];
                }
                let variablesAll = res.data?.all_variables || [];
                setDataVariables(variablesAll);
                setDataMessages(messageArr);
                if (res.data.chatbot) {
                  let opacity_color, message_color, font_color;
                  if (res.data.chatbot.main_color === "blue") {
                    opacity_color = "#D6E0EF";
                    message_color = "#3CACEF";
                    font_color = "#fff";
                  } else if (res.data.chatbot.main_color === "green") {
                    opacity_color = "#DEEADB";
                    message_color = "#9DDB7C";
                    font_color = "#fff";
                  } else if (res.data.chatbot.main_color === "orange") {
                    opacity_color = "#F4E5DA";
                    message_color = "#EF8D2F";
                    font_color = "#fff";
                  } else if (res.data.chatbot.main_color === "yellow") {
                    opacity_color = "#F0EFEB";
                    message_color = "#F3AA2D";
                    res.data.chatbot.main_color = "#F6CA21";
                    font_color = "#fff";
                  } else if (res.data.chatbot.main_color === "pink") {
                    opacity_color = "#EBDDE3";
                    message_color = "#E65B83";
                    res.data.chatbot.main_color = "#F170AA";
                    font_color = "#fff";
                  } else if (res.data.chatbot.main_color === "purple") {
                    opacity_color = "#E9E8F1";
                    message_color = "#AF82D5";
                    res.data.chatbot.main_color = "#8C66D9";
                    font_color = "#fff";
                  } else if (res.data.chatbot.main_color === "black") {
                    opacity_color = "#ECEDE8";
                    message_color = "#fff";
                    font_color = "#333333";
                  } else if (res.data.chatbot.main_color === "white") {
                    opacity_color = "#fff";
                    message_color = "#F5F5F5";
                    font_color = "#000";
                  }
                  res.data.chatbot.opacity_color = opacity_color;
                  res.data.chatbot.message_color = message_color;
                  res.data.chatbot.font_color = font_color;
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
                const userMessageLength = messageArr.filter(
                  (e) => e.belong_to === "user"
                ).length;

                for (let i = 0; i < messageArr.length; i++) {
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
                            objParam[conditionItem.nameCondition] ===
                            conditionItem.inputCondition;
                        } else if (conditionItem.condition === "not_include") {
                          checked = !objParam[
                            conditionItem.nameCondition
                          ].includes(conditionItem.inputCondition);
                        } else if (conditionItem.condition === "is_not") {
                          checked =
                            objParam[conditionItem.nameCondition] !==
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
                            objParam[conditionItem.nameCondition] ===
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
                            objParam[conditionItem.nameCondition] !==
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
                            objParam[conditionItem.nameCondition] ===
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
                            objParam[conditionItem.nameCondition] !==
                              conditionItem.inputCondition;
                        }
                      }
                    }
                    if (checked === false) {
                      if (messageArr[i].belong_to === "user")
                        setIndexUser((prev) => prev + 1);
                      // continue;
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
                        }).then(() => {
                          setIndexMessageRender(i);
                          renderMessage.pop();
                          renderMessage.push({});
                          setRenderMessageArr([...renderMessage]);
                        });
                      } else {
                        setIndexMessageRender(i);
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
                      renderMessage.push({});
                      setRenderMessageArr([...renderMessage]);
                      setIndexMessageRender(i);
                      setVariables([...variables]);
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
                      messageArr[i]?.message_content[0]?.type ===
                      "clear_variable"
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
                            });
                          // break;
                        }
                      }

                      renderMessage.push(messageArr[i]);
                      setIndexMessageRender(i);
                      setRenderMessageArr([...renderMessage]);
                      setIndexUser((prev) => prev + 1);
                      index = i;
                      // break;
                    } else {
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

                      setIndexMessageRender(i);
                      renderMessage.push(messageArr[i]);
                      setRenderMessageArr([...renderMessage]);
                    }
                  }
                  if (messageArr[i]?.belong_to === "user") {
                    if (conversations.length === 0) {
                      break;
                    }
                    for (
                      let msIndex = 0;
                      msIndex < messageArr[i].message_content.length;
                      msIndex++
                    ) {
                      const element = messageArr[i].message_content[msIndex];
                      //TODO: find message type
                      let chats = conversations.filter(
                        (c) => c?.message_id === messageArr[i].id
                      );
                      let chat = chats.find(
                        (c) =>
                          c?.data_input_name ===
                          element[element.type]?.save_input_content
                      );
                      if (!chat) {
                        chat = chats.find((c) => c?.ui_type === element.type);
                      }
                      conversations = conversations.filter(
                        (el) => el.id !== chat.id
                      );
                      const subElement = element[element.type];
                      if (element.type === "text_input") {
                        if (subElement.type === "text") {
                          if (element[element.type].isSplitInput) {
                            element[element.type][subElement.type].valueLeft =
                              chat.valueLeft;
                            element[element.type][subElement.type].valueRight =
                              chat.valueRight;
                          } else
                            element[element.type][subElement.type].value =
                              chat.value;
                        }
                        if (subElement.type === "phone_number") {
                          if (subElement.withHyphen) {
                          } else
                            element[element.type][subElement.type].value =
                              chat.value;
                        }
                        if (subElement.type === "password") {
                          element[element.type][subElement.type].password =
                            "********";
                        }
                        if (
                          ["urls", "email_address"].includes(subElement.type)
                        ) {
                          element[element.type][subElement.type].value =
                            chat.value;
                        }
                        if (subElement.type === "email_confirmation") {
                          element[element.type][subElement.type].value =
                            chat.value;
                          element[element.type][subElement.type].valueConfirm =
                            chat.value;
                        }
                        if (subElement.type === "password_confirmation") {
                          element[element.type][subElement.type].password =
                            "********";
                          element[element.type][
                            subElement.type
                          ].confirm_password = "********";
                        }
                      }
                      if (element.type === "radio_button") {
                        element[element.type].initial_selection = chat.value;
                        // if(subElement.type==="default"){
                        //   element[element.type].initial_selection = chat.value;
                        // }
                      }
                      if (element.type === "checkbox") {
                        element[element.type][subElement.type].checkedValue =
                          chat.value;
                        element[element.type][
                          subElement.type
                        ].initial_selection_picture = chat.value;
                      }
                      if (element.type === "pull_down") {
                        element[element.type][subElement.type].value =
                          chat.value;

                        element[element.type][subElement.type].valueLeft =
                          chat.valueLeft;
                        element[element.type][subElement.type].valueRight =
                          chat.valueRight;

                        if (subElement.type === "time_hm") {
                          element[element.type][subElement.type].valueHour =
                            chat.valueHour;
                          element[element.type][subElement.type].valueMinute =
                            chat.valueMinute;
                        }
                        if (
                          [
                            "date_ym",
                            "date_ymd_hm",
                            "dob_ym",
                            "date_md",
                            "date_ymd",
                            "dob_ymd",
                          ].includes(subElement.type)
                        ) {
                          element[element.type][subElement.type].valueYear =
                            chat.valueYear;
                          element[element.type][subElement.type].valueMonth =
                            chat.valueMonth;
                          element[element.type][subElement.type].valueDay =
                            chat.valueDay;
                        }
                        if (subElement.type === "timezone_from_to") {
                          element[element.type][subElement.type].valueHour1 =
                            chat.valueHour1;
                          element[element.type][subElement.type].valueMinute1 =
                            chat.valueMinute1;
                          element[element.type][subElement.type].valueHour2 =
                            chat.valueHour2;
                          element[element.type][subElement.type].valueMinute2 =
                            chat.valueMinute2;
                        }
                        if (subElement.type === "period_from_to") {
                          element[element.type][subElement.type].valueYear1 =
                            chat.valueYear1;
                          element[element.type][subElement.type].valueMonth1 =
                            chat.valueMonth1;
                          element[element.type][subElement.type].valueDay1 =
                            chat.valueDay1;
                          element[element.type][subElement.type].valueYear2 =
                            chat.valueYear2;
                          element[element.type][subElement.type].valueMonth2 =
                            chat.valueMonth2;
                          element[element.type][subElement.type].valueDay2 =
                            chat.valueDay2;
                        }
                        if (subElement.type === "up_to_municipality") {
                          element[element.type][subElement.type].prefecture =
                            chat.prefecture;
                          element[element.type][subElement.type].city =
                            chat.city;
                        }
                      }
                      if (element.type === "zip_code_address") {
                        element[element.type].value_address =
                          chat.content?.value_address;
                        element[element.type].value_building_name =
                          chat.content?.value_building_name;
                        element[element.type].value_municipality =
                          chat.content?.value_municipality;
                        element[element.type].value_post_code =
                          chat.content?.value_post_code;
                        element[element.type].value_post_code_left =
                          chat.content?.value_post_code_left;
                        element[element.type].value_post_code_right =
                          chat.content?.value_post_code_right;
                        element[element.type].value_prefecture =
                          chat.content?.value_prefecture;
                      }

                      if (element.type === "calendar") {
                        if (
                          ["date_selection", "embedded"].includes(
                            subElement.type
                          )
                        ) {
                          element[element.type][subElement.type].date_select =
                            chat.date_select;
                        }
                        if (subElement.type === "start_end_date") {
                          element[element.type][
                            subElement.type
                          ].start_date_select = chat.start_date_select;
                          element[element.type][
                            subElement.type
                          ].end_date_select = chat.end_date_select;
                        }
                      }

                      if (element.type === "card_payment_radio_button") {
                        if (subElement.type === "default") {
                          element[element.type].initial_selection = chat.value;
                        }
                      }
                      if (element.type === "capture") {
                        element[element.type][subElement.type].value =
                          chat.value;
                      }
                      if (
                        [
                          "product_purchase",
                          "product_purchase_radio_button",
                        ].includes(element.type)
                      ) {
                        if (subElement.multiple_item_purchase) {
                          subElement.initial_selection = chat.value;
                        } else {
                          subElement.initial_selection = [chat.value];
                        }
                      }

                      if (element.type === "slider") {
                        element[element.type][subElement.type].value =
                          chat.value;
                      }
                      if (element.type === "agree_term") {
                        element[element.type].isAgree = true;
                      }
                      element.updated_at = chat.updated_at;
                    }
                    setRenderMessageArr(messageArr);
                  }
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col>
            <Card>
              <CardHeader>
              <Row className="bot-chat-log">
                <Col md="12">
                  <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0px' }}>
                    <div className="div-add-bot--search wrap-bot-search">
                      <div className="d-flex">
                        <div className="bm_status-filter" style={{ width: '357px', minWidth: '358px', marginRight: "30px" }}>
                          <label style={{ margin: '0px 5px 0px 0px', color: '#2c2c2c', fontSize: '14px', width: '70px' }}>シナリオ</label>
                          <select
                            style={{
                              borderRadius: "5px",
                              border: "1px solid #7186a0",
                              padding: "5px 10px",
                              width: "283px",
                              height: "34px"
                            }}
                            className="input-field"
                            defaultValue="all"
                            name="scenarioSearch"
                            id="scenarioSearch"
                            onChange={onScenarioSearch}
                          >
                            <option value="all">すべて</option>
                            {scenarios.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="bm_status-filter" style={{ width: '368px', minWidth: '368px' }}>
                        <label style={{ margin: '0px 5px 0px 0px', color: '#2c2c2c', fontSize: '14px', width: '70px' }}>ユーザーID</label>
                        <input
                          style={{ width: 'calc(100% - 85px)' }}
                          type="text"
                          placeholder="ボット名 ..."
                          onChange={(e) => {
                            if (e.target.value) {
                              setSearchUserId(e.target.value);
                            } else {
                              setSearchUserId(null);
                            }
                          }}
                        />
                      </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="d-flex justify-content-between align-items-center filter-from-to">
                    <div className="div-add-bot--search">

                    <div className="bm_status-filter" style={{ marginRight: "15px" }}>
                        <label style={{ margin: '0px 5px 0px 0px', color: '#2c2c2c', fontSize: '14px', width: '70px' }}>から</label>
                        <div style={{ width: '283px' }}>
                          <DatePicker
                            selected={searchStartDate && searchStartDate}
                            onChange={(date) => changeStartDate(date)}
                            dateFormat="yyyy/MM/dd"
                            locale="ja"
                            placeholderText="yyyy/mm/dd"
                          />
                        </div>
                      </div>
                      <div className="bm_status-filter">
                        <label style={{ margin: '0px 26px 0px 14px', color: '#2c2c2c', fontSize: '14px', width: '50px' }}>まで</label>
                        <div style={{ width: '283px' }}>
                          <DatePicker
                            selected={searchEndDate}
                            onChange={(date) => setSearchEndDate(date)}
                            dateFormat="yyyy/MM/dd"
                            locale="ja"
                            disabled={isDisableEndDate}
                            placeholderText="yyyy/mm/dd"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <Button
                    style={{ backgroundColor: "#66615b", margin: "0px" }}
                    onClick={(e) => pressSearchButton()}
                  >
                    検索
                  </Button>
                </Col>
              </Row>
              <hr />
              </CardHeader>
              <CardBody
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "stretch",
                  width: "100%",
                  height: "700px",
                  padding: "10px 15px",
                }}
              >
                <div className="left-column">
                  <div
                    style={{
                      backgroundColor: "#f2f2f6",
                      padding: "5px 0px",
                      borderBottom: ".5px solid #dbdbdb",
                    }}
                  >
                    <span
                      id="user_header_title"
                      style={{ marginLeft: "10px", border: "" }}
                    >
                      会話（{chats.length}人）
                    </span>
                  </div>
                  <div style={{ overflowY: "scroll", maxHeight: "647px" }}>
                    <ul
                      style={{ listStyle: "none", paddingInlineStart: "5px" }}
                    >
                      {chats.map((item) => (
                        <li
                          key={item.scenario_id + "_" + item.user_input_id}
                          style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "2px",
                            minWidth: "180px",
                          }}
                        >
                          <button
                            className="button"
                            onClick={(e) => onSelectChat(item)}
                            style={
                              item.scenario_id === selectScenario?.id &&
                              item.user_input_id === selectUserId
                                ? {
                                    borderLeft: "2px solid #57c8f1",
                                    backgroundColor: "#fafafa",
                                  }
                                : { paddingLeft: "2px" }
                            }
                          >
                            <div style={{ display: "grid" }}>
                              <p style={{ marginBottom: "1px" }}>{item.name}</p>
                              <p style={{ marginBottom: "1px" }}>
                                {" "}
                                {format(
                                  new Date(item.newest),
                                  "yyyy-MM-dd HH:mm"
                                )}{" "}
                              </p>
                            </div>
                            <div className="info">
                              <i
                                className="fa fa-info-circle fa-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              ></i>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="right-column">
                  {selectScenario ? (
                    <>
                      <div
                        id="csp-body"
                        className="sp-body csp-body chat-area"
                        // style={{ backgroundColor: botInfor?.opacity_color }}
                      >
                        {renderMessageArr.map((message, indexMessage) => {
                          return (
                            <React.Fragment key={indexMessage}>
                              {message.belong_to === "bot" &&
                                message?.message_content.map(
                                  (content, index) => {
                                    return (
                                      <BotMessage
                                        key={index}
                                        content={content}
                                        index={index}
                                        botInfor={botInfor}
                                      />
                                    );
                                  }
                                )}
                              {message.belong_to === "user" && (
                                <div
                                  className="sp-body-user-side csp-body-user-side slideLeft"
                                  style={{
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <p
                                    style={{
                                      marginTop: "1em",
                                      marginBottom: "0px",
                                      marginRight: "20px",
                                    }}
                                  >
                                    {message.message_content[0].updated_at ? format(
                                      new Date(message.message_content[0].updated_at),
                                      "yyyy-MM-dd HH:mm",
                                      
                                    ): ''}
                                  </p>
                                  <div className="sp-body-user-side-messages csp-body-user-side-messages">
                                    <UserMessage
                                      captcha={captcha}
                                      messageContentProps={
                                        message.message_content
                                      }
                                      disabled={message.disabled}
                                      onChangeValue={(
                                        indexContent,
                                        contentType,
                                        value,
                                        field,
                                        subFiled,
                                        name
                                      ) => {}}
                                      indexMessageRender={indexMessageRender}
                                      indexMessage={indexMessage}
                                      displayButtonNext={(value) => {
                                        dataMessages[
                                          indexMessage
                                        ].is_display_button_next = value;
                                        setDataMessages([...dataMessages]);
                                      }}
                                      dataPrefectures={[...dataPrefectures]}
                                      variables={variables}
                                    />
                                    {(dataMessages[indexMessage]
                                      ?.is_display_button_next !== undefined
                                      ? dataMessages[indexMessage]
                                          .is_display_button_next
                                      : true) && (
                                      <div className="sp-user-message-button-action">
                                        <Button
                                          disabled={true}
                                          style={{
                                            backgroundColor:
                                              botInfor?.main_color,
                                            borderRadius: "25px",
                                          }}
                                          className="ss-user-message__action-btn"
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
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default BotChatLog;
