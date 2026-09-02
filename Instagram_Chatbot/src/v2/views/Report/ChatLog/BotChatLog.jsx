import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, Empty, Select, Space, Tabs, Typography, message } from 'antd';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import 'v2/views/Report/styles/bot-chat-log.css';
import 'v2/assets/css/bot/report.css';
import 'v2/views/Report/styles/chat-log.css';
import $ from 'jquery';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';
import { findLastIndex } from 'lodash';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import BotChatStatistic from './BotChatStatistic';
import { AdminPage, AdminActionButton } from 'v2/components/AdminShell';
import { getSignInPath } from 'v2/variables/constants';
import {
  CHAT_LOG_DATE_FORMAT,
  CHAT_LOG_DATE_PICKER_FORMAT,
  CHAT_LOG_DISPLAY_DATE_FORMAT,
  CHAT_LOG_LIST_PATH,
  CHAT_LOG_LOAD_ERROR,
  CHAT_LOG_CAPTCHA_ERROR,
  CHAT_LOG_NEXT_BUTTON,
  CHAT_LOG_PASSWORD_MASK,
  CHAT_LOG_SCENARIO_LABEL,
  CHAT_LOG_SCENARIO_PLACEHOLDER,
  CHAT_LOG_SELECT_CONVERSATION,
  CHAT_LOG_STATUS_DONE,
  CHAT_LOG_STATUS_NOT_DONE,
  CHAT_LOG_STATISTIC_PATH,
  CHAT_LOG_TAB_LOGS,
  CHAT_LOG_TAB_LOGS_LABEL,
  CHAT_LOG_TAB_STATISTIC,
  CHAT_LOG_TAB_STATISTIC_LABEL,
  EMPTY_STRING,
  formatChatLogConversationHeader,
  formatChatLogUserName,
} from 'v2/views/Report/constants';

const SCAN_REGEX = /\{\{(.*?)\}\}/g;

const assignUserNamesToChats = (chats) =>
  chats.map((chat, index) => ({
    ...chat,
    name: formatChatLogUserName(index, chats.length),
  }));

const normalizeConversationEntry = (conversation) => {
  const next = { ...conversation };
  if (
    ['data_name', 'zip_code_address', 'birth_date'].includes(
      next.data_input_name,
    )
  ) {
    const str = next.string_value
      ? next.string_value.replaceAll(SCAN_REGEX)
      : next.text_value
        ? next.text_value.replaceAll(SCAN_REGEX)
        : undefined;
    next.content = JSON.parse(str ?? '');
  }
  next.value =
    next.content ??
    next.boolean_value ??
    next.string_value ??
    next.text_value ??
    next.integer_value;
  return next;
};

const BotChatLog = () => {
  const botId = Cookies.get("bot_id");
  const [scenarios, setScenarios] = useState([]);
  const [chats, setChats] = useState([]);
  const [, setConversions] = useState([]);
  const [selectScenario, setSelectScenario] = useState(null);
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectTab, setSelectTab] = useState(CHAT_LOG_TAB_LOGS);

  const [searchScenarioId, setSearchScenarioId] = useState(null);
  const [searchDate] = useState(null);
  const [searchStartDate, setSearchStartDate] = useState(null);
  const [searchEndDate, setSearchEndDate] = useState(null);

  useEffect(() => {
    if (
      Cookies.get("token") === undefined ||
      Cookies.get("token") == null ||
      Cookies.get("token") === ""
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get("is_auth") === "false") {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    const request = { cancelled: false };
    const params = {
      sc_id: searchScenarioId ? parseInt(searchScenarioId) : null,
      date: searchDate ? searchDate : null,
    };
    api
      .get(`${CHAT_LOG_LIST_PATH}/${botId}/list`, params)
      .then((res) => {
        if (request.cancelled) return;
        if (res.data.code === 1) {
          setScenarios(res.data.scenarios);
          setChats(assignUserNamesToChats(res.data.chats));
        }
      })
      .catch(() => {
        if (request.cancelled) return;
        message.error(CHAT_LOG_LOAD_ERROR);
      });
    getScenarioStatistic({sc_id: searchScenarioId ? parseInt(searchScenarioId) : null, bot_id: botId});
    return () => {
      request.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scenarioOptions = useMemo(
    () =>
      scenarios.map((scenario) => ({
        value: scenario.id,
        label: scenario.name,
      })),
    [scenarios]
  );

  const formatDate = (date) => {
    return moment(date).format(CHAT_LOG_DATE_FORMAT);
  };

  const searchLog = (params) => {
    api
      .get(`${CHAT_LOG_LIST_PATH}/${botId}/list`, {params})
      .then((res) => {
        if (res.data.code === 1) {
          setScenarios(res.data.scenarios);
          setChats(assignUserNamesToChats(res.data.chats));
        }
      })
      .catch(() => {
        message.error(CHAT_LOG_LOAD_ERROR);
      });

  }

  const pressSearchButton = () => {
    const params = {
      sc_id: searchScenarioId ? parseInt(searchScenarioId) : null,
      date: searchDate ? formatDate(searchDate) : null,
      start_date: searchStartDate ? formatDate(searchStartDate) : null,
      end_date: searchEndDate ? formatDate(searchEndDate) : null
    };

    setRenderMessageArr([]);
    setRenderMessageStatisticArr([]);
    setSelectUserId(null);

    searchLog(params)
    getScenarioStatistic({...params, bot_id: botId});
  }

  const [botInfor, setBotInfor] = useState();
  const [dataMessages, setDataMessages] = useState([]);
  const [, setDataVariables] = useState([]);
  const [variables, setVariables] = useState([]);

  const [, setMessageUser] = useState([]);
  const [indexMessageRender, setIndexMessageRender] = useState(0);
  const [renderMessageArr, setRenderMessageArr] = useState([]);
  const [renderMessageStatisticArr, setRenderMessageStatisticArr] = useState([]);
  const [, setIndexUser] = useState(0);
  const [captcha, setCaptcha] = useState([]);
  const [dataPrefectures] = useState([]);
  const [statistic, setStatistic] = useState([]);
  const [overall, setOverall] = useState({});

  const [objParam, setObjParam] = useState(() => {
    const dataObj = {
      current_url: window.location.href,
      current_url_title: document.title,
      user_id: Cookies.get('user_id'),
      bot_id: Cookies.get('bot_id'),
    };
    $.getJSON('https://api.ipregistry.co/?key=tryout', (data) => {
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

  const onSelectChat = (item) => {
    setSelectUserId(item.user_input_id);
    const sc = scenarios.find((s) => s.id === item.scenario_id);
    if (!sc) return;
    const conversations = [...JSON.parse(sc.conversation).messages].sort(
      (a, b) => a.id - b.id
    );
    setSelectScenario({ ...sc, conversations });
    setRenderMessageArr([]);

    getMessageData(item)
  }

  const getScenarioMessages = (botId, scenario_id, conversion = [], options = {}) => {
    const messageArr = [];
    const conversationState = { list: conversion };

    const { saveMsgRender = true, saveMsgStatistic = true } = options;

    api
      .get(
        `/api/v1/managements/chatbots/${botId}/scenarios/${scenario_id}/preview`
      )
      .then(async (res) => {
        if (res.data.code === 1) {
          if (res.data.data?.conversation?.messages?.length > 0) {
            messageArr.push(...res.data.data.conversation.messages);
          }
          const variablesAll = res.data?.all_variables || [];
          setDataVariables(variablesAll);
          setDataMessages(messageArr);
          if (res.data.chatbot) {
            const colorState = { opacity_color: null, message_color: null, font_color: null };
            if (res.data.chatbot.main_color === 'blue') {
              colorState.opacity_color = '#D6E0EF';
              colorState.message_color = '#3CACEF';
              colorState.font_color = '#fff';
            } else if (res.data.chatbot.main_color === 'green') {
              colorState.opacity_color = '#DEEADB';
              colorState.message_color = '#9DDB7C';
              colorState.font_color = '#fff';
            } else if (res.data.chatbot.main_color === 'orange') {
              colorState.opacity_color = '#F4E5DA';
              colorState.message_color = '#EF8D2F';
              colorState.font_color = '#fff';
            } else if (res.data.chatbot.main_color === 'yellow') {
              colorState.opacity_color = '#F0EFEB';
              colorState.message_color = '#F3AA2D';
              res.data.chatbot.main_color = '#F6CA21';
              colorState.font_color = '#fff';
            } else if (res.data.chatbot.main_color === 'pink') {
              colorState.opacity_color = '#EBDDE3';
              colorState.message_color = '#E65B83';
              res.data.chatbot.main_color = '#F170AA';
              colorState.font_color = '#fff';
            } else if (res.data.chatbot.main_color === 'purple') {
              colorState.opacity_color = '#E9E8F1';
              colorState.message_color = '#AF82D5';
              res.data.chatbot.main_color = '#8C66D9';
              colorState.font_color = '#fff';
            } else if (res.data.chatbot.main_color === 'black') {
              colorState.opacity_color = '#ECEDE8';
              colorState.message_color = '#fff';
              colorState.font_color = '#333333';
            } else if (res.data.chatbot.main_color === 'white') {
              colorState.opacity_color = '#fff';
              colorState.message_color = '#F5F5F5';
              colorState.font_color = '#000';
            } else {
              colorState.opacity_color = res.data.chatbot.main_color_other;
              colorState.message_color = res.data.chatbot.main_color_other;
              colorState.font_color = res.data.chatbot.font_color;
            }
            res.data.chatbot.opacity_color = colorState.opacity_color;
            res.data.chatbot.message_color = colorState.message_color;
            res.data.chatbot.font_color = colorState.font_color;
          }

          setBotInfor(res.data.chatbot);
          if (res.data.variables) {
            setVariables([...res.data.variables, ...variablesAll]);
            res.data.variables.forEach((item) => {
              objParam[item.variable_name] = item.default_value;
            });
          }
          setObjParam({ ...objParam });
          const variables = [...res.data.variables];
          const messageUserVar = messageArr.filter(
            (item) =>
              item.belong_to === "user" && item.message_content.length > 0
          );
          setMessageUser([...messageUserVar]);
          const renderMessage = [];

          if (!conversion.length) {
            return;
          }

          for (const [i] of messageArr.entries()) {
            if (messageArr[i].conditions?.length > 0) {
              const checkState = { checked: true };
              for (const [j] of messageArr[i].conditions.entries()) {
                const conditionItem = messageArr[i].conditions[j];
                if (j === 0) {
                  if (conditionItem.condition === "include") {
                    checkState.checked = objParam[
                      conditionItem.nameCondition
                    ].includes(conditionItem.inputCondition);
                  } else if (conditionItem.condition === "is") {
                    checkState.checked =
                      objParam[conditionItem.nameCondition] ===
                      conditionItem.inputCondition;
                  } else if (conditionItem.condition === "not_include") {
                    checkState.checked = !objParam[
                      conditionItem.nameCondition
                    ].includes(conditionItem.inputCondition);
                  } else if (conditionItem.condition === "is_not") {
                    checkState.checked =
                      objParam[conditionItem.nameCondition] !==
                      conditionItem.inputCondition;
                  }
                } else if (conditionItem?.linkCondition === "and") {
                  if (conditionItem.condition === "include") {
                    checkState.checked =
                      checkState.checked &&
                      objParam[conditionItem.nameCondition].includes(
                        conditionItem.inputCondition
                      );
                  } else if (conditionItem.condition === "is") {
                    checkState.checked =
                      checkState.checked &&
                      objParam[conditionItem.nameCondition] ===
                        conditionItem.inputCondition;
                  } else if (conditionItem.condition === "not_include") {
                    checkState.checked =
                      checkState.checked &&
                      !objParam[conditionItem.nameCondition].includes(
                        conditionItem.inputCondition
                      );
                  } else if (conditionItem.condition === "is_not") {
                    checkState.checked =
                      checkState.checked &&
                      objParam[conditionItem.nameCondition] !==
                        conditionItem.inputCondition;
                  }
                } else if (conditionItem?.linkCondition === "or") {
                  if (conditionItem.condition === "include") {
                    checkState.checked =
                      checkState.checked ||
                      objParam[conditionItem.nameCondition].includes(
                        conditionItem.inputCondition
                      );
                  } else if (conditionItem.condition === "is") {
                    checkState.checked =
                      checkState.checked ||
                      objParam[conditionItem.nameCondition] ===
                        conditionItem.inputCondition;
                  } else if (conditionItem.condition === "not_include") {
                    checkState.checked =
                      checkState.checked ||
                      !objParam[conditionItem.nameCondition].includes(
                        conditionItem.inputCondition
                      );
                  } else if (conditionItem.condition === "is_not") {
                    checkState.checked =
                      checkState.checked ||
                      objParam[conditionItem.nameCondition] !==
                        conditionItem.inputCondition;
                  }
                }
              }
              if (checkState.checked === false) {
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
                  const rows = messageArr;
                  await new Promise((resolve) => {
                    renderMessage.push({ ...rows[i] });
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
              } else if (
                messageArr[i]?.message_content[0]?.type === "email"
              ) {
                const variablesData = {};
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
              } else if (
                messageArr[i]?.message_content[0]?.type === "variable_set"
              ) {
                if (variables.length !== 0) {
                  const dataVarExist =
                    messageArr[i]?.message_content[0][
                      messageArr[i]?.message_content[0].type
                    ].variables;
                  variables.forEach((item) => {
                    for (const [z] of dataVarExist.entries()) {
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
              } else if (
                messageArr[i]?.message_content[0]?.type ===
                "clear_variable"
              ) {
                if (variables.length !== 0) {
                  const dataVarExist =
                    messageArr[i]?.message_content[0][
                      messageArr[i]?.message_content[0].type
                    ].variables;
                  variables.forEach((item) => {
                    for (const [z] of dataVarExist.entries()) {
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
              } else if (
                messageArr[i]?.message_content[0]?.type === "pause"
              ) {
                renderMessage.push({});
                setRenderMessageArr([...renderMessage]);
                setIndexMessageRender(i);
                break;
              } else if (messageArr[i].belong_to !== "bot") {
                for (const [j] of messageArr[i].message_content.entries()) {
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
                      .catch(() => {
                        message.error(CHAT_LOG_CAPTCHA_ERROR);
                      });
                    // break;
                  }
                }

                renderMessage.push(messageArr[i]);
                setIndexMessageRender(i);
                setRenderMessageArr([...renderMessage]);
                setIndexUser((prev) => prev + 1);
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
                          const valueVarRef = { value: '' };
                          for (const [j] of variables.entries()) {
                            if (variables[j].variable_name === variable) {
                              valueVarRef.value = variables[j].default_value;
                            }
                          }
                          return valueVarRef.value;
                        } else {
                          return EMPTY_STRING;
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
              if (conversationState.list.length === 0) {
                break;
              }
              for (const [msIndex] of messageArr[i].message_content.entries()) {
                const element = messageArr[i].message_content[msIndex];
                //TODO: find message type
                const rows = messageArr;
                const chats = conversationState.list.filter(
                  (c) => c?.message_id === rows[i].id
                  && (c?.message_child_id >= 0 ? c.message_child_id === element.id : true)
                );

                const lastIndexChatByName = findLastIndex(chats, (c) =>
                  c?.data_input_name ===
                  element[element.type]?.save_input_content && element[element.type]?.save_input_content);
                const lastIndexChat = lastIndexChatByName < 0
                  ? findLastIndex(chats, (c) => c?.ui_type === element.type)
                  : lastIndexChatByName;

                const chat = chats[lastIndexChat];
                if (!chat) {
                  continue;
                }

                conversationState.list = conversationState.list.filter((c) => !(
                  c?.message_id === chat.message_id 
                  && (c?.message_child_id >= 0 ? c.message_child_id === chat.message_child_id : true)
                ));

                const subElement = element[element.type];
                if (element.type === "text_input") {
                  if (subElement.type === 'text') {
                    const dataState = { value: chat };
                    try {
                      dataState.value = JSON.parse(chat.value);
                    } catch (error) {
                      dataState.value = chat;
                    }
                    if (element[element.type][subElement.type].isSplitInput) {
                      element[element.type][subElement.type].valueLeft = dataState.value.valueLeft;
                      element[element.type][subElement.type].valueRight = dataState.value.valueRight;
                    } else {
                      element[element.type][subElement.type].value = dataState.value?.value;
                    }
                  }
                  if (subElement.type === "phone_number") {
                    if (subElement[subElement.type]?.withHyphen) {
                      const parsedValuesState = {
                        value1: '',
                        value2: '',
                        value3: '',
                      };

                      try {
                        Object.assign(parsedValuesState, JSON.parse(chat.value));
                      } catch {
                        Object.assign(parsedValuesState, {
                          value1: '',
                          value2: '',
                          value3: '',
                        });
                      }

                      element[element.type][subElement.type] = {
                        ...element[element.type][subElement.type],
                        ...parsedValuesState,
                      };
                    } else {
                      element[element.type][subElement.type].value =
                        chat.value;
                    }
                  }
                  if (subElement.type === "password") {
                    element[element.type][subElement.type].password =
                      CHAT_LOG_PASSWORD_MASK;
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
                      CHAT_LOG_PASSWORD_MASK;
                    element[element.type][
                      subElement.type
                    ].confirm_password = CHAT_LOG_PASSWORD_MASK;
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
                  chat?.value?.toString();

                  element[element.type][subElement.type].valueLeft =
                    chat?.valueLeft ? chat.valueLeft : chat?.content?.valueLeft;
                  element[element.type][subElement.type].valueRight =
                    chat?.valueRight ? chat.valueRight : chat?.content?.valueRight;

                  if (subElement.type === "time_hm") {
                    element[element.type][subElement.type].valueHour =
                      chat.valueHour ? chat.valueHour : chat?.content?.valueHour;;
                    element[element.type][subElement.type].valueMinute =
                      chat.valueMinute ? chat.valueMinute : chat?.content?.valueMinute;;
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
                      chat?.valueYear ? chat.valueYear : chat?.content?.valueYear;
                    element[element.type][subElement.type].valueMonth =
                      chat?.valueMonth ? chat.valueMonth : chat?.content?.valueMonth;
                    element[element.type][subElement.type].valueDay =
                      chat?.valueDay ? chat.valueDay : chat?.content?.valueDay;
                  }
                  if (subElement.type === "timezone_from_to") {
                    element[element.type][subElement.type].valueHour1 =
                      chat?.valueHour1 ? chat.valueHour1 : chat?.content?.valueHour1;
                    element[element.type][subElement.type].valueMinute1 =
                      chat?.valueMinute1 ? chat.valueMinute1 : chat?.content?.valueMinute1;
                    element[element.type][subElement.type].valueHour2 =
                      chat?.valueHour2 ? chat.valueHour2 : chat?.content?.valueHour2;
                    element[element.type][subElement.type].valueMinute2 =
                      chat?.valueMinute2 ? chat.valueMinute2 : chat?.content?.valueMinute2;
                  }
                  if (subElement.type === "period_from_to") {
                    element[element.type][subElement.type].valueYear1 =
                      chat?.valueYear1 ? chat.valueYear1 : chat?.content?.valueYear1;
                    element[element.type][subElement.type].valueMonth1 =
                      chat?.valueMonth1 ? chat.valueMonth1 : chat?.content?.valueMonth1;
                    element[element.type][subElement.type].valueDay1 =
                      chat?.valueDay1 ? chat.valueDay1 : chat?.content?.valueDay1;
                    element[element.type][subElement.type].valueYear2 =
                      chat?.valueYear2 ? chat.valueYear2 : chat?.content?.valueYear2;
                    element[element.type][subElement.type].valueMonth2 =
                      chat?.valueMonth2 ? chat.valueMonth2 : chat?.content?.valueMonth2;
                    element[element.type][subElement.type].valueDay2 =
                      chat?.valueDay2 ? chat.valueDay2 : chat?.content?.valueDay2;
                  }
                  if (subElement.type === "up_to_municipality") {
                    element[element.type][subElement.type].prefecture =
                      chat?.prefecture ? chat.prefecture : chat?.content?.prefecture;
                    element[element.type][subElement.type].city =
                      chat?.city ? chat.city : chat?.content?.prefecture;
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
                      chat?.date_select ? chat.date_select : chat?.content?.date_select;
                  }
                  if (subElement.type === "start_end_date") {
                    element[element.type][
                      subElement.type
                    ].start_date_select = chat?.start_date_select ? chat.start_date_select : chat?.content?.start_date_select;
                    element[element.type][
                      subElement.type
                    ].end_date_select = chat?.end_date_select ? chat.end_date_select : chat?.content?.end_date_select;
                  }
                }

                if (element.type === "card_payment_radio_button") {
                  if (subElement.type === "default") {
                    // Regex valueChat matches JWT format
                    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
                    if (jwtRegex.test(chat?.value)) {
                      const decoded = jwt_decode(chat?.value);
                      try {
                        const data = JSON.parse(decoded?.data);
                        element[element.type].initial_selection = data?.initial_selection;
                        element[element.type].card_number = data?.card_number;
                        element[element.type].card_holder = data?.card_holder;
                        element[element.type].year = data?.year;
                        element[element.type].month = data?.month;
                        element[element.type].cvc = data?.cvc;
                      } catch (error) {
                        element[element.type].initial_selection = decoded?.data;
                      }
                    } else {
                      element[element.type].initial_selection = chat?.value;
                    }
                    
                  }
                }
                if (element.type === "capture") {
                  element[element.type][subElement.type].value =
                    chat.value;
                }
                if (element.type === "product_purchase_radio_button") {
                  try {
                    const resultPurchase = JSON.parse(chat?.value);
                    element[element.type].value = resultPurchase;
                    element[element.type].initial_selection = resultPurchase.initial_selection;
                  } catch (error) {
                    element[element.type].initial_selection = chat?.value;
                  }
                }
                if (
                  [
                    "product_purchase"
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
                element.updated_at = chat?.updated_at;
              }
            }
          }
        }
      })
      .catch(() => {
        message.error(CHAT_LOG_LOAD_ERROR);
      })
      .finally(() => {
        if (saveMsgStatistic) {
          setRenderMessageStatisticArr(messageArr)
        } 
        if (saveMsgRender) {
          setRenderMessageArr(messageArr);
        }
      });
  }

  const getMessageData = (item) => {
    api
      .get(
        `${CHAT_LOG_LIST_PATH}/${item.scenario_id}/${item.user_input_id}`
      )
      .then((response) => {
        if (response.data.code === 1) {
          const conversations = response.data.conversations.map(normalizeConversationEntry);
          setConversions(conversations);

          getScenarioMessages(botId, item.scenario_id, conversations, { saveMsgRender: true });
        }
      })
      .catch(() => {
        message.error(CHAT_LOG_LOAD_ERROR);
      });
  }

  const getScenarioStatistic = async (params) => {
    api.get(CHAT_LOG_STATISTIC_PATH, { params })
      .then((response) => {
        if (response.data.code === 1) {
          setStatistic(response.data.statistic);
          setOverall(response.data.overall);
          getScenarioMessages(botId, params.sc_id, [], { saveMsgStatistic: true });
        }
      })
      .catch(() => {
        message.error(CHAT_LOG_LOAD_ERROR);
      });
  }

  const filterToolbar = (
    <Space wrap size={12} className="report-filter-toolbar">
      <Space size={4}>
        <Typography.Text type="secondary">{CHAT_LOG_SCENARIO_LABEL}</Typography.Text>
        <Select
          allowClear
          placeholder={CHAT_LOG_SCENARIO_PLACEHOLDER}
          value={searchScenarioId ?? undefined}
          onChange={(value) => setSearchScenarioId(value ?? null)}
          options={scenarioOptions}
          className="chat-log-scenario-select"
        />
      </Space>
      <DatePicker.RangePicker
        value={[
          searchStartDate ? moment(searchStartDate) : null,
          searchEndDate ? moment(searchEndDate) : null,
        ]}
        onChange={(dates) => {
          setSearchStartDate(dates?.[0]?.toDate() ?? null);
          setSearchEndDate(dates?.[1]?.toDate() ?? null);
        }}
        format={CHAT_LOG_DATE_PICKER_FORMAT}
      />
      <AdminActionButton action="search" onClick={pressSearchButton} />
    </Space>
  );

  const logsTabContent = (
    <div className="chat-log-content">
      <div className="chat-log-user-list">
        <div className="chat-log-user-list-header">
          {formatChatLogConversationHeader(chats.length)}
        </div>
        <div className="chat-log-user-list-body">
          <ul className="chat-log-user-list-items">
            {chats.map((item) => {
              const isActive =
                item.scenario_id === selectScenario?.id &&
                item.user_input_id === selectUserId;

              return (
                <li
                  key={item.scenario_id + "_" + item.user_input_id}
                  className="chat-log-user-item"
                >
                  <button
                    type="button"
                    className={`chat-log-user-button${
                      isActive ? " chat-log-user-button--active" : ""
                    }`}
                    onClick={() => onSelectChat(item)}
                  >
                    <div className="chat-log-user-meta">
                      <p className="chat-log-user-name">{item.name}</p>
                      <p className="chat-log-user-date">
                        {format(new Date(item.newest), CHAT_LOG_DISPLAY_DATE_FORMAT)}
                      </p>
                    </div>
                    <span
                      className={`is-done_label ${item.is_done ? "finished" : ""}`}
                    >
                      {item.is_done ? CHAT_LOG_STATUS_DONE : CHAT_LOG_STATUS_NOT_DONE}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="chat-log-preview">
        {selectScenario ? (
          <div id="csp-body" className="sp-body csp-body chat-area">
            {renderMessageArr.map((messageItem, indexMessage) => (
              <React.Fragment key={messageItem.id ?? indexMessage}>
                {messageItem.belong_to === "bot" &&
                  messageItem?.message_content.map((content, index) => (
                    <BotMessage
                      key={content.id ?? index}
                      content={content}
                      index={index}
                      botInfor={botInfor}
                    />
                  ))}
                {messageItem.belong_to === "user" && (
                  <div className="sp-body-user-side csp-body-user-side slideLeft chat-log-user-side">
                    <p className="chat-log-user-message-time">
                      {messageItem.message_content[0].updated_at
                        ? format(
                            new Date(messageItem.message_content[0].updated_at),
                            CHAT_LOG_DISPLAY_DATE_FORMAT,
                          )
                        : ""}
                    </p>
                    <div className="sp-body-user-side-messages csp-body-user-side-messages">
                      <UserMessage
                        captcha={captcha}
                        messageContentProps={messageItem.message_content}
                        disabled={messageItem.disabled}
                        onChangeValue={() => {}}
                        indexMessageRender={indexMessageRender}
                        indexMessage={indexMessage}
                        displayButtonNext={(value) => {
                          setDataMessages((prev) => prev.map((msg, idx) => (
                            idx === indexMessage
                              ? { ...msg, is_display_button_next: value }
                              : msg
                          )));
                        }}
                        dataPrefectures={[...dataPrefectures]}
                        variables={variables}
                      />
                      {(dataMessages[indexMessage]?.is_display_button_next !==
                      undefined
                        ? dataMessages[indexMessage].is_display_button_next
                        : true) && (
                        <div className="sp-user-message-button-action">
                          <button
                            type="button"
                            disabled
                            className="chat-log-action-btn"
                            style={{
                              '--chat-log-action-bg': botInfor?.main_color,
                            }}
                          >
                            {messageItem.buttonName || CHAT_LOG_NEXT_BUTTON}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="chat-log-preview-empty">
            <Empty description={CHAT_LOG_SELECT_CONVERSATION} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AdminPage className="admin-page--chat-log" card={false}>
      <div id="screenAll" className="admin-page-card chat-log-page-card">
        <div className="report-filter-panel">{filterToolbar}</div>
        <Tabs
          activeKey={selectTab}
          onChange={setSelectTab}
          className="admin-page-tabs"
          items={[
            {
              key: CHAT_LOG_TAB_LOGS,
              label: CHAT_LOG_TAB_LOGS_LABEL,
              children: logsTabContent,
            },
            {
              key: CHAT_LOG_TAB_STATISTIC,
              label: CHAT_LOG_TAB_STATISTIC_LABEL,
              children: (
                <BotChatStatistic
                  overall={overall}
                  botInfor={botInfor}
                  messages={renderMessageStatisticArr}
                  dataMessages={dataMessages}
                  statistic={statistic}
                />
              ),
            },
          ]}
        />
      </div>
    </AdminPage>
  );
};

export default BotChatLog;
