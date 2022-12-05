import React, { useEffect, useState } from 'react';
import '../../../assets/css/bot/preview-chat-bot.css';
import api from '../../../api/api-management';
import Cookies from 'js-cookie';
import { MDBIcon } from 'mdbreact';
import SelectCustom from './ScenarioSetting/scenarioComon/SelectCustom';
import CheckboxCustom from './ScenarioSetting/scenarioComon/CheckboxCustom';
import InputCustom from './ScenarioSetting/scenarioComon/InputCustom';
import DatePicker from 'react-datepicker';
import {
  Button
} from 'reactstrap';
import { Checkbox, Radio, Slider, Calendar } from 'antd';
import moment from 'moment';
import cvcIcon from '../../../assets/img/cvc-icon.png';
import messageTypingGif from '../../../assets/img/icons8-dots-loading.gif';
import $ from 'jquery';
import DatePickerCustom from './ScenarioSetting/scenarioComon/DatePickerCustom';
import InputNum from './ScenarioSetting/scenarioComon/InputNum';
import { tokenExpired } from 'api/tokenExpired';
import american_express from '../../../assets/img/payment-method/american_express.png';
import diner_club from '../../../assets/img/payment-method/diner_club.png';
import discover from '../../../assets/img/payment-method/discover.png';
import jcb from '../../../assets/img/payment-method/jcb.png';
import master_card from '../../../assets/img/payment-method/master_card.png';
import visa from '../../../assets/img/payment-method/visa.png';

const _ = require('lodash');

let dataHourFixed = [];
for (let i = 0; i <= 23; i++) {
  dataHourFixed.push({
    key: i + '',
    value: i + ''
  });
}

let dataMinutes = [];
for (let i = 0; i <= 59; i++) {
  dataMinutes.push({
    key: i + '',
    value: i + ''
  });
}

let dataYearFixed = [];
for (let i = 1935; i <= 2072; i++) {
  dataYearFixed.push({
    key: i + '',
    value: i + ''
  });
}

let dataMonth = [];
for (let i = 1; i <= 12; i++) {
  dataMonth.push({
    key: i + '',
    value: i + ''
  });
}

let dataDay = [];
for (let i = 1; i <= 31; i++) {
  dataDay.push({
    key: i + '',
    value: i + ''
  });
}

let dataEveryMinute = [
  {
    key: '00',
    value: '00'
  },
  {
    key: '05',
    value: '05'
  },
  {
    key: '10',
    value: '10'
  },
  {
    key: '15',
    value: '15'
  },
  {
    key: '30',
    value: '30'
  },
];

let dataPaymentMethod = [
  {
    key: 'visa',
    value: <img src={visa} />
  },
  {
    key: 'jcb',
    value: <img src={jcb} />
  },
  {
    key: 'master_card',
    value: <img src={master_card} />
  },
  {
    key: 'american_express',
    value: <img src={american_express} />
  },
  {
    key: 'diner_club',
    value: <img src={diner_club} />
  },
  {
    key: 'discover',
    value: <img src={discover} />
  }
]

let SCAN_REGEX = /\{\{(.*?)\}\}/g;

function Preview({ onOpenPreview, isOpen }) {

  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [scenarioId, setScenarioId] = useState(Cookies.get('scenario_id'));
  const [botInfor, setBotInfor] = useState();
  const [dataMessages, setDataMessages] = useState([]);
  const [indexMessageRender, setIndexMessageRender] = useState(0);
  const [renderMessageArr, setRenderMessageArr] = useState([]);
  const [indexUser, setIndexUser] = useState(0);
  const [messageUser, setMessageUser] = useState([]);
  const [errors, setErrors] = useState({});
  const [variables, setVariables] = useState([]);
  const [isDisplayButtonNext, setIsDisplayButtonNext] = useState(false);
  const [captcha, setCaptcha] = useState([]);
  const [objParam, setObjParam] = useState(() => {
    let dataObj = {
      current_url: window.location.href,
      current_url_param: getAllUrlParams(window.location.href),
      current_url_title: document.title,
      user_id: Cookies.get('user_id'),
      bot_id: Cookies.get('bot_id')
    };
    $.getJSON('https://api.ipregistry.co/?key=tryout', function (data) {
      console.log(data);
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

  function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
      queryString = queryString.split('#')[0];
      var arr = queryString.split('&');
      for (var i = 0; i < arr.length; i++) {
        var a = arr[i].split('=');
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
        if (paramName.match(/\[(\d+)?\]$/)) {
          var key = paramName.replace(/\[(\d+)?\]/, '');
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
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
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

  // useEffect(() => {
  //   api.get(`/api/v1/managements/chatbots/${botId}`).then(res => {
  //     if (res.data.code == 1) {
  //       setBotInfor(res.data.data);
  //     }
  //   }).catch(err => console.log(err));
  // }, [])

  useEffect(() => {
    if (scenarioId) {
      api.get(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/preview`).then(async res => {
        if (res.data.code == 1) {
          let messageArr = [...res.data.data?.conversation?.messages];
          setDataMessages(messageArr);
          setVariables([...res.data.variables]);
          setBotInfor(res.data.chatbot);
          res.data.variables.forEach(item => {
            objParam[item.variable_name] = item.default_value;
          });
          setObjParam({ ...objParam });
          console.log(objParam, 'ceghckkkkkkkkkkkkkkk objParam')
          let variables = [...res.data.variables];
          let messageUserVar = messageArr.filter(item => item.belong_to === 'user' && item.message_content.length > 0);
          setMessageUser([...messageUserVar]);
          let renderMessage = [];
          let index;
          let delayRender;
          let isPauseScroll = false;
          for (let i = 0; i < messageArr.length; i++) {
            if (messageArr[i].hidden !== true) {
              if (messageArr[i].conditions?.length > 0) {
                var checked = true;
                console.log(messageArr[i].conditions, 'check conditions')
                for (let j = 0; j < messageArr[i].conditions.length; j++) {
                  let conditionItem = messageArr[i].conditions[j];
                  if (j === 0) {
                    if (conditionItem.condition === 'include') {
                      checked = objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition);
                    } else if (conditionItem.condition === 'is') {
                      checked = (objParam[conditionItem.nameCondition] == conditionItem.inputCondition);
                    } else if (conditionItem.condition === 'not_include') {
                      checked = (!objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition));
                    } else if (conditionItem.condition === 'is_not') {
                      checked = (objParam[conditionItem.nameCondition] != conditionItem.inputCondition);
                    }
                  } else if (conditionItem?.linkCondition === 'and') {
                    if (conditionItem.condition === 'include') {
                      checked = checked && objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition);
                    } else if (conditionItem.condition === 'is') {
                      checked = checked && (objParam[conditionItem.nameCondition] == conditionItem.inputCondition);
                    } else if (conditionItem.condition === 'not_include') {
                      checked = checked && (!objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition));
                    } else if (conditionItem.condition === 'is_not') {
                      checked = checked && (objParam[conditionItem.nameCondition] != conditionItem.inputCondition);
                    }
                  } else if (conditionItem?.linkCondition === 'or') {
                    if (conditionItem.condition === 'include') {
                      checked = checked || objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition);
                    } else if (conditionItem.condition === 'is') {
                      checked = checked || (objParam[conditionItem.nameCondition] == conditionItem.inputCondition);
                    } else if (conditionItem.condition === 'not_include') {
                      checked = checked || (!objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition));
                    } else if (conditionItem.condition === 'is_not') {
                      checked = checked || (objParam[conditionItem.nameCondition] != conditionItem.inputCondition);
                    }
                  }
                }
                if (checked === false) {
                  if (messageArr[i].belong_to === 'user') setIndexUser(prev => prev + 1);
                  continue;
                }
              }
              if (messageArr[0].belong_to === 'bot' && messageArr[i].message_content.length > 0) {
                console.log(i, 'check index message')
                if (messageArr[i]?.message_content[0]?.type === 'delay') {
                  if (messageArr[i]?.message_content[0]?.delay.typing_on) {
                    await new Promise((resolve) => {
                      renderMessage.push({ ...messageArr[i] });
                      setRenderMessageArr([
                        ...renderMessage
                      ]);
                      resolve();
                    }).then(async () => {
                      await new Promise((resolve) => {
                        delayRender = setTimeout(() => {
                          resolve();
                        }, (messageArr[i]?.message_content[0].delay.content * 1000));
                      });
                    }).then(() => {
                      setIndexMessageRender(i);
                      renderMessage.pop();
                      setRenderMessageArr([
                        ...renderMessage
                      ]);
                    });
                  } else {
                    await new Promise((resolve) => {
                      return delayRender = setTimeout(() => {
                        resolve();
                      }, messageArr[i]?.message_content[0]?.delay?.content * 1000);
                    }).then(() => {
                      setIndexMessageRender(i);
                    })
                  }
                  index = i;
                } else if (messageArr[i]?.message_content[0]?.type === 'variable_set') {
                  // console.log(dataVariables, 'checkkkk variables')                
                  if (variables.length !== 0) {
                    let dataVarExist = messageArr[i]?.message_content[0][messageArr[i]?.message_content[0].type].variables;
                    variables.forEach(item => {
                      for (let z = 0; z < dataVarExist.length; z++) {
                        if (item.variable_name === dataVarExist[z].key) {
                          item.default_value = dataVarExist[z].value;
                        }
                      }
                    });
                    console.log(variables, 'checkkkk variables');
                    setVariables([...variables]);
                  }
                  setIndexMessageRender(i);
                  index = i;
                } else if (messageArr[i]?.message_content[0]?.type === 'clear_variable') {
                  // console.log(dataVariables, 'checkkkk variables')                
                  if (variables.length !== 0) {
                    let dataVarExist = messageArr[i]?.message_content[0][messageArr[i]?.message_content[0].type].variables;
                    variables.forEach(item => {
                      for (let z = 0; z < dataVarExist.length; z++) {
                        if (item.variable_name === dataVarExist[z]) {
                          item.default_value = "";
                        }
                      }
                    });
                    console.log(variables, 'checkkkk variables');
                    setVariables([...variables]);
                  }
                  setIndexMessageRender(i);
                  index = i;
                } else if (messageArr[i].belong_to !== 'bot') {
                  await new Promise((resolve) => {
                    return delayRender = setTimeout(() => {
                      for (let j = 0; j < messageArr[i].message_content.length; j++) {
                        if (messageArr[i].message_content[j].type === 'capture') {
                          api.get(`https://svg-captcha.herokuapp.com/captcha?size=${messageArr[i].message_content[j][messageArr[i].message_content[j].type].length}${messageArr[i].message_content[j][messageArr[i].message_content[j].type].colour ? '&color=true' : ''}&charPreset=${messageArr[i].message_content[j][messageArr[i].message_content[j].type].type}`).then(res => {
                            console.log(res);
                            captcha.push({
                              index: i,
                              indexContent: j,
                              ...res.data
                            })
                            setCaptcha([...captcha]);
                          })
                          // break;
                        }
                      }
                      resolve({ ...messageArr[i] });
                    }, 1000);
                  }).then(data => {
                    renderMessage.push(data);
                    console.log(renderMessage);
                    setRenderMessageArr([
                      ...renderMessage
                    ]);
                    setIndexMessageRender(i);
                    if (isPauseScroll === false) {
                      scrollToBottom();
                    }
                  }).catch((error) => {
                    console.log(error);
                    if (error.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
                  setIndexUser(prev => prev + 1);
                  index = i;
                  break;
                } else {
                  await new Promise((resolve) => {
                    return delayRender = setTimeout(() => {
                      if (messageArr[i].message_content[0]?.type === 'text_input' && messageArr[i].message_content[0].text_input.content) {
                        messageArr[i].message_content[0].text_input.content = messageArr[i].message_content[0].text_input.content.replaceAll(SCAN_REGEX, (text, variable) => {
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
                        });
                      }
                      resolve({ ...messageArr[i] });
                    }, 1000);
                  }).then(data => {
                    renderMessage.push(data);
                    console.log(data);
                    setRenderMessageArr([
                      ...renderMessage
                    ]);
                    setIndexMessageRender(i);
                    if (isPauseScroll === false) {
                      scrollToBottom();
                    }
                    if (data.message_content[0]?.type !== 'delay' && data.message_content[0][data.message_content[0]?.type].scroll_auto === true) {
                      isPauseScroll = true;
                    }
                  })
                  index = i;
                }
              } else if (messageArr[0].belong_to === 'user' && messageArr[i].message_content.length > 0) {
                // if (messageArr[i].belong_to !== 'user') {
                //   await new Promise((resolve) => {
                //     return delayRender = setTimeout(() => {
                //       if (messageArr[i].message_content[0]?.type === 'text_input') {
                //         messageArr[i].message_content[0].text_input.content = messageArr[i].message_content[0].text_input.content.replaceAll(SCAN_REGEX, (text, variable) => {
                //           for (let j = 0; j < variables.length; j++) {
                //             if (variables[j].variable_name === variable) {
                //               console.log(variables[j].variable_name, 'cehckkkkk')
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
                  return delayRender = setTimeout(() => {
                    for (let j = 0; j < messageArr[i].message_content.length; j++) {
                      if (messageArr[i].message_content[j].type === 'capture') {
                        api.get(`https://svg-captcha.herokuapp.com/captcha?size=${messageArr[i].message_content[j][messageArr[i].message_content[j].type].length}${messageArr[i].message_content[j][messageArr[i].message_content[j].type].colour ? '&color=true' : ''}&charPreset=${messageArr[i].message_content[j][messageArr[i].message_content[j].type].type}`).then(res => {
                          console.log(res);
                          captcha.push({
                            index: i,
                            indexContent: j,
                            ...res.data
                          })
                          setCaptcha([...captcha]);
                        })
                      }
                    }
                    resolve({ ...messageArr[i] });
                  }, 1000);
                }).then(data => {
                  renderMessage.push(data);
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                  setIndexMessageRender(i);
                  if (isPauseScroll === false) {
                    scrollToBottom();
                  }
                })
                setIndexUser(prev => prev + 1);
                index = i;
                break;
              }
              // }
            }
          }
          // setIndexMessageRender(index);
          // setRenderMessageArr(renderMessage);
          return () => {
            clearTimeout(delayRender);
          }
        }
      }).catch(err => console.log(err));
    }
  }, [scenarioId])

  const scrollToBottom = () => {
    if (document.getElementById('sp-body')) {
      document.getElementById('sp-body').scrollTo({
        top: document.getElementById('sp-body').scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  const stringNullOrEmpty = (string) => {
    if (string === undefined || string === null || (string && (string + "")?.trim() === "") || string === "") return true
    return false
  }

  const handleValidateField = () => {
    let contentArr = [...dataMessages[indexMessageRender].message_content];
    let isValid = true;
    let errorsMess = {};

    let messageError = "These are required fields."
    for (let i = 0; i < contentArr.length; i++) {

      let contentType = contentArr[i][contentArr[i].type];
      let limitFrom = contentType[contentType.type]?.character_limit_from;
      let limitTo = contentType[contentType.type]?.character_limit_to || Number.MAX_SAFE_INTEGER;
      if (contentType.require) {
        console.log(contentType.type, contentType.date_select)
        if (contentType.type === 'text' || contentType.type === 'password') {
          if (contentType[contentType.type].isSplitInput) {
            if (stringNullOrEmpty(contentType[contentType.type].valueLeft) || stringNullOrEmpty(contentType[contentType.type].valueRight)) {
              errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
              isValid = false;
            } else if (contentType[contentType.type].valueLeft.length < limitFrom
              || contentType[contentType.type].valueLeft.length > limitTo
              || contentType[contentType.type].valueRight.length < limitFrom
              || contentType[contentType.type].valueRight.length > limitTo) {
              errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `characters cannot exceed ${limitFrom} ~ ${limitTo}`;
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          } else if (contentType[contentType.type].value.length < limitFrom || contentType[contentType.type].value.length > limitTo) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `characters cannot exceed ${limitFrom} ~ ${limitTo}`;
            isValid = false;
          }
        } else if (contentType.type === 'phone_number') {
          if (contentType[contentType.type].withHyphen) {
            if (stringNullOrEmpty(contentType[contentType.type].value1) || stringNullOrEmpty(contentType[contentType.type].value2)) {
              errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'email_confirmation' || contentType.type === 'password_confirmation') {
          let limitFrom = contentType[contentType.type]?.character_limit_from;
          let limitTo = contentType[contentType.type]?.character_limit_to;
          if (stringNullOrEmpty(contentType[contentType.type].value) || stringNullOrEmpty(contentType[contentType.type].valueConfirm)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          } else if (contentType.type === 'password_confirmation' &&
            (contentType[contentType.type].value.length < limitFrom
              || contentType[contentType.type].value.length > limitTo
              || contentType[contentType.type].valueConfirm.length < limitFrom
              || contentType[contentType.type].valueConfirm.length > limitTo)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `characters cannot exceed ${limitFrom} ~ ${limitTo}`;
            isValid = false;
          }
        } else if (contentType.type === 'customization') {
          if (contentType[contentType.type].is_comment) {
            if (stringNullOrEmpty(contentType[contentType.type].valueLeft) || stringNullOrEmpty(contentType[contentType.type].valueRight)) {
              errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'time_hm') {
          if (stringNullOrEmpty(contentType[contentType.type].valueHour) || stringNullOrEmpty(contentType[contentType.type].valueMinute)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'date_ymd'
          || contentType.type === 'dob_ymd') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear) || stringNullOrEmpty(contentType[contentType.type].valueMonth)
            || stringNullOrEmpty(contentType[contentType.type].valueDay)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'date_md') {
          if (stringNullOrEmpty(contentType[contentType.type].valueMonth) || stringNullOrEmpty(contentType[contentType.type].valueDay)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'date_ym'
          || contentType.type === 'dob_ym') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear) || stringNullOrEmpty(contentType[contentType.type].valueMonth)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'date_ymd_hm') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear)
            || stringNullOrEmpty(contentType[contentType.type].valueMonth)
            || stringNullOrEmpty(contentType[contentType.type].valueDay)
            || stringNullOrEmpty(contentType[contentType.type].valueHour)
            || stringNullOrEmpty(contentType[contentType.type].valueMinutes)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'timezone_from_to') {
          if (stringNullOrEmpty(contentType[contentType.type].valueHour1)
            || stringNullOrEmpty(contentType[contentType.type].valueMinutes1)
            || stringNullOrEmpty(contentType[contentType.type].valueHour2)
            || stringNullOrEmpty(contentType[contentType.type].valueMinutes2)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'period_from_to') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear1)
            || stringNullOrEmpty(contentType[contentType.type].valueMonth1)
            || stringNullOrEmpty(contentType[contentType.type].valueDay1)
            || stringNullOrEmpty(contentType[contentType.type].valueYear2)
            || stringNullOrEmpty(contentType[contentType.type].valueMonth2)
            || stringNullOrEmpty(contentType[contentType.type].valueDay2)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'up_to_municipality') {
          if (stringNullOrEmpty(contentType[contentType.type].prefecture)
            || stringNullOrEmpty(contentType[contentType.type].city)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'attaching_file') {
          if (stringNullOrEmpty(contentType.content)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'date_selection' || contentType.type === 'embedded') {
          if (stringNullOrEmpty(contentType.date_select)) {
            console.log(contentType.date_select, 'checckkkk')
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'start_end_date') {
          if (stringNullOrEmpty(contentType.start_date_select) || stringNullOrEmpty(contentType.end_date_select)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'agree_term') {
          if (stringNullOrEmpty(contentType.isAgree) || contentType.isAgree === false) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'radio_button') {
          if (stringNullOrEmpty(contentType.initial_selection)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'checkbox') {
          if (contentType.checkedValue && contentType.checkedValue.length === 0) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          } else if ((contentType.selection_limit_from || contentType.selection_limit_to) && (contentType.checkedValue.length < parseInt(contentType.selection_limit_from || 0) || contentType.checkedValue.length > parseInt(contentType.selection_limit_to))) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = `Please select from ${contentType.selection_limit_from || 0} to ${contentType.selection_limit_to} for this item.`;
            isValid = false;
          }
        } else if (contentArr[i].type === 'capture') {
          console.log(contentArr[i].type, contentType, 'chechkkkkk');
          if (stringNullOrEmpty(contentType.value)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          } else if (captcha.filter(item => item.index === indexMessageRender && item.indexContent === i)?.[0]?.text.toLowerCase() !== contentType.value.toLowerCase()) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = "Wrong authorization code";
            isValid = false;
          }
        } else if (contentArr[i].type === 'credit_card_payment') {
          if ((contentType.is_hide_card_name !== true && stringNullOrEmpty(contentType.card_holder))
            || (contentType.is_hide_cvc !== true && stringNullOrEmpty(contentType.cvc))
            || (contentType.separate_type === true && (stringNullOrEmpty(contentType.card_number1) || stringNullOrEmpty(contentType.card_number2) || stringNullOrEmpty(contentType.card_number3) || stringNullOrEmpty(contentType.card_number4)))
            || (contentType.separate_type === false && stringNullOrEmpty(contentType.card_number))
            || (contentType.is_hide_cvc !== true && stringNullOrEmpty(contentType.cvc))
            || (stringNullOrEmpty(contentType.year))
            || (stringNullOrEmpty(contentType.month))
          ) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          } else if ((contentType.card_number && (contentType.card_number + "").length !== 16) ||
            ((!stringNullOrEmpty(contentType.card_number1) && !stringNullOrEmpty(contentType.card_number2) && !stringNullOrEmpty(contentType.card_number3) && !stringNullOrEmpty(contentType.card_number4)) &&
              ((contentType.card_number1 + "").length !== 4 || (contentType.card_number2 + "").length !== 4 || (contentType.card_number3 + "").length !== 4 || (contentType.card_number4 + "").length !== 4))) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = "Credit card number is invalid.";
            isValid = false;
          }
        } else if (contentArr[i].type === 'product_purchase') {
          console.log(contentType.initial_selection)
          if (contentType.initial_selection.length === 0) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'slider') {
          if (stringNullOrEmpty(contentType.value)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'product_purchase_radio_button') {
          console.log(contentType.initial_selection)
          if (contentType.initial_selection.length === 0) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentArr[i].type === 'card_payment_radio_button') {
          console.log(contentType.initial_selection)
          if (contentType.type !== 'picture_radio' && stringNullOrEmpty(contentType.initial_selection)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          } else if (contentType.type === 'picture_radio' && stringNullOrEmpty(contentType.initial_selection_picture)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = false;
          }
        } else if (contentType.type === 'invalid_input') {

        } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
          isValid = false;
        } else if ((limitFrom || limitTo) && (contentType[contentType.type]?.value?.length < limitFrom || contentType[contentType.type]?.value?.length > limitTo)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `characters cannot exceed ${limitFrom} ~ ${limitTo}`;
          isValid = false;
        }
      } else {
        if (contentType.type === 'text' || contentType.type === 'password') {
          if (contentType[contentType.type].isSplitInput
            && (!stringNullOrEmpty(contentType[contentType.type].valueLeft) || !stringNullOrEmpty(contentType[contentType.type].valueRight))
            && (contentType[contentType.type].valueLeft.length >= limitTo || contentType[contentType.type].valueRight.length >= limitTo)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `characters cannot exceed ${limitFrom} ~ ${limitTo}`;
            isValid = false;
          } else if (!stringNullOrEmpty(contentType[contentType.type].value)
            && contentType[contentType.type].value.length >= limitTo) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `characters cannot exceed ${limitFrom} ~ ${limitTo}`;
            isValid = false;
          }
        }
        if (contentArr[i].type === 'checkbox') {
          if (contentType.selection_limit_to && contentType.checkedValue.length > parseInt(contentType.selection_limit_to)) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = `Please select not over ${contentType.selection_limit_to} items.`;
            isValid = false;
          }
        }
      }
      if (contentArr[i].type === 'zip_code_address') {
        if (contentType.isCheckRequire === "require") {
          if (contentType.post_code !== undefined) {
            if (contentType.split_postal_code) {
              if (stringNullOrEmpty(contentType.value_post_code_left)
                || stringNullOrEmpty(contentType.value_post_code_right)) {
                isValid = false;
              }
            } else if (stringNullOrEmpty(contentType.value_post_code)) {
              isValid = false;
            }
          }
        } else if (contentType.isCheckRequire === "all_items_require") {
          if (contentType.post_code !== undefined) {
            if (contentType.split_postal_code) {
              if (stringNullOrEmpty(contentType.value_post_code_left)
                || stringNullOrEmpty(contentType.value_post_code_right)) {
                isValid = false;
              }
            } else if (stringNullOrEmpty(contentType.value_post_code)) {
              isValid = false;
            }
          }
          if (contentType.prefecture !== undefined && stringNullOrEmpty(contentType.value_prefecture)) {
            isValid = false;
          }
          if (contentType.municipality !== undefined && stringNullOrEmpty(contentType.value_municipality)) {
            isValid = false;
          }
          if (contentType.address !== undefined && stringNullOrEmpty(contentType.value_address)) {
            isValid = false;
          }
        }
        if (isValid === false) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
        }
      }

      if (contentType.type === 'phone_number') {
        let REGEX_PHONE = /^\d{10}$|^\d{11}$/;
        if (contentType[contentType.type].withHyphen) {
          if (!stringNullOrEmpty(contentType[contentType.type].value1)
            && !stringNullOrEmpty(contentType[contentType.type].value2)
            && !stringNullOrEmpty(contentType[contentType.type].value3)
            && (!REGEX_PHONE.test(`${contentType[contentType.type].value1}${contentType[contentType.type].value2}${contentType[contentType.type].value3}`))) {
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Incorrect format.";
            isValid = false;
          }
        } else if (!stringNullOrEmpty(contentType[contentType.type].value) && !REGEX_PHONE.test(contentType[contentType.type].value)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Incorrect format.";
          isValid = false;
        }
      }
      if (contentType.type === 'urls' && !stringNullOrEmpty(contentType[contentType.type].value)) {
        let REGEX_URLS = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        console.log(REGEX_URLS.test(contentType[contentType.type].value));
        if (!REGEX_URLS.test(contentType[contentType.type].value)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Please specify in valid URL format.`;
          isValid = false;
        }
      }
      let REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (contentType.type === 'email_address' && !stringNullOrEmpty(contentType[contentType.type].value)) {
        console.log(REGEX_EMAIL.test(contentType[contentType.type].value));
        if (!REGEX_EMAIL.test(contentType[contentType.type].value)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Please specify in the format a valid email address.`;
          isValid = false;
        }
      }
      let REGEX_PASSWORD = /[A-Za-z0-9 ]+/;
      if (contentType.type === 'password' && !stringNullOrEmpty(contentType[contentType.type].value) && !REGEX_PASSWORD.test(contentType[contentType.type].value)) {
        errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.`;
        isValid = false;
      }
      if (contentType.type === 'password_confirmation') {
        if (!stringNullOrEmpty(contentType[contentType.type].value) && !REGEX_PASSWORD.test(contentType[contentType.type].value)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.`;
          isValid = false;
        } else if (!stringNullOrEmpty(contentType[contentType.type].valueConfirm) && !REGEX_PASSWORD.test(contentType[contentType.type].valueConfirm)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.`;
          isValid = false;
        } else if (!stringNullOrEmpty(contentType[contentType.type].value) && !stringNullOrEmpty(contentType[contentType.type].valueConfirm) && contentType[contentType.type].value !== contentType[contentType.type].valueConfirm) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Your password and password confirmation do not match.";
          isValid = false;
        }
      }
      if (contentType.type === 'email_confirmation') {
        if (!stringNullOrEmpty(contentType[contentType.type].value) && !REGEX_EMAIL.test(contentType[contentType.type].value)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Please specify in the format a valid email address.`;
          isValid = false;
        } else if (!stringNullOrEmpty(contentType[contentType.type].valueConfirm) && !REGEX_EMAIL.test(contentType[contentType.type].valueConfirm)) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Please specify in the format a valid email address.`;
          isValid = false;
        } else if (!stringNullOrEmpty(contentType[contentType.type].value) && !stringNullOrEmpty(contentType[contentType.type].valueConfirm) && contentType[contentType.type].value !== contentType[contentType.type].valueConfirm) {
          errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = `Your email address and email address confirmation do not match.`;
          isValid = false;
        }
      }
      if (contentArr[i].type === 'attaching_file' && errors[`message${indexMessageRender}_content${i}_${contentArr[i].type}`]) {
        errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = errors[`message${indexMessageRender}_content${i}_${contentArr[i].type}`];
        isValid = false;
      }
      if (contentArr[i].type === 'text_input' && contentType[contentType.type].range && contentType[contentType.type].range !== 'no_input'
        && (!stringNullOrEmpty(contentType[contentType.type].value) || !stringNullOrEmpty(contentType[contentType.type].valueLeft) || !stringNullOrEmpty(contentType[contentType.type].valueRight))) {
        let REGEX_CHECK;
        let messageLog = '';
        switch (contentType[contentType.type].range) {
          case 'alphabet':
            REGEX_CHECK = /[^A-Za-z ]+/;
            messageLog = "Only alphabets are allowed.";
            break;
          case 'single_byte':
            REGEX_CHECK = /[^0-9 ]+/;
            messageLog = "Please enter a number.";
            break;
          case 'alphanumeric_hyphen':
            REGEX_CHECK = /[^A-Za-z0-9-_ ]+/;
            messageLog = "Alphanumeric characters ('A-Z', 'a-z', '0-9'), hyphens and underscores ('-', '_') can be used.";
            break;
          case 'alphanumeric':
            REGEX_CHECK = /[^A-Za-z0-9 ]+/;
            messageLog = "Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.";
            break;
          // case 'double_byte_hiragana':
          //   REGEX_CHECK = /[\u3040-\u309F]+/;
          //   messageLog = "Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.";
          //   break;
          // case 'full_width_katakana':
          //   REGEX_CHECK = /[\u30A0-\u30FF]+/;
          //   messageLog = "Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.";
          //   break;
          // case 'double_byte':
          //   REGEX_CHECK = /%{2}/;
          //   messageLog = "Alphanumeric characters ('A-Z', 'a-z', '0-9') can be used.";
          //   break;         
          default:
            REGEX_CHECK = "";
            break;
        }
        console.log(contentType[contentType.type].range, REGEX_CHECK);
        if (REGEX_CHECK !== "") {
          if (contentType[contentType.type].isSplitInput && (REGEX_CHECK.test(contentType[contentType.type].valueLeft)
            || REGEX_CHECK.test(contentType[contentType.type].valueRight))) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageLog;
          } else if (REGEX_CHECK.test(contentType[contentType.type].value)) {
            console.log(REGEX_CHECK)
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageLog;
          }
        } else if (REGEX_CHECK === "" && !contentType[contentType.type].isSplitInput) {
          if (contentType[contentType.type].range === 'double_byte' && !isDoubleByte(contentType[contentType.type].value)) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Please enter in double-byte characters.";
          } else if (contentType[contentType.type].range === 'full_width_katakana' && mbStrWidth(contentType[contentType.type].value) === 2) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Please enter in full-width katakana characters.";
          } else if (contentType[contentType.type].range === 'double_byte_hiragana' && !isDoubleByte(contentType[contentType.type].value)) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Please enter in double-byte hiragana characters.";
          }
        } else if (REGEX_CHECK === "" && contentType[contentType.type].isSplitInput) {
          if (contentType[contentType.type].range === 'double_byte'
            && (!isDoubleByte(contentType[contentType.type].valueLeft) || !isDoubleByte(contentType[contentType.type].valueRight))) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Please enter in double-byte characters.";
          } else if (contentType[contentType.type].range === 'full_width_katakana' &&
            (mbStrWidth(contentType[contentType.type].valueLeft) === 2 || mbStrWidth(contentType[contentType.type].valueRight) === 2)) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Please input katakana type.";
          } else if (contentType[contentType.type].range === 'double_byte_hiragana' &&
            (!isDoubleByte(contentType[contentType.type].valueLeft) || !isDoubleByte(contentType[contentType.type].valueRight))) {
            isValid = false;
            errorsMess[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = "Please input hiragana type.";
          }
        }
      }
    }

    if (isValid) {
      errorsMess = {};
    }
    setErrors({
      ...errorsMess
    });
    return isValid;
  }

  function mbStrWidth(input) {
    let len = 0;
    for (let i = 0; i < input.length; i++) {
      let code = input.charCodeAt(i);
      if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
        len += 1;
      } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
        len += 2;
      } else {
        len += 0;
      }
    }
    return len;
  }

  function isDoubleByte(str) {
    for (var i = 0, n = str.length; i < n; i++) {
      if (str.charCodeAt(i) > 255) { return true; }
    }
    return false;
  }

  function ucs2ToBinaryString(str) {
    var escstr = encodeURIComponent(str)
    var binstr = escstr.replace(/%([0-9A-F]{2})/ig, function (match, hex) {
      var i = parseInt(hex, 16)
      return String.fromCharCode(i)
    })
    return binstr
  }

  const onClickNext = async (indexMessage) => {
    if (!handleValidateField()) {
      return;
    }
    renderMessageArr[indexMessage].disabled = true;
    let renderMessage = [...renderMessageArr];
    let index;
    let isPauseScroll = false;
    let delayRender;
    setIndexUser(prev => prev + 1);

    if (!dataMessages[indexMessageRender + 1]) return;
    if (dataMessages[indexMessageRender + 1].belong_to === 'bot') {
      for (let i = indexMessageRender + 1; i < dataMessages.length; i++) {
        if (dataMessages[i].hidden !== true) {
          if (dataMessages[i].conditions) {
            var checked = true;
            for (let j = 0; j < dataMessages[i].conditions.length; j++) {
              let conditionItem = dataMessages[i].conditions[j];
              if (j === 0) {
                if (conditionItem.condition === 'include') {
                  checked = objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition);
                } else if (conditionItem.condition === 'is') {
                  checked = (objParam[conditionItem.nameCondition] == conditionItem.inputCondition);
                } else if (conditionItem.condition === 'not_include') {
                  checked = (!objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition));
                } else if (conditionItem.condition === 'is_not') {
                  checked = (objParam[conditionItem.nameCondition] != conditionItem.inputCondition);
                }
              } else if (conditionItem?.linkCondition === 'and') {
                if (conditionItem.condition === 'include') {
                  checked = checked && objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition);
                } else if (conditionItem.condition === 'is') {
                  checked = checked && (objParam[conditionItem.nameCondition] == conditionItem.inputCondition);
                } else if (conditionItem.condition === 'not_include') {
                  checked = checked && (!objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition));
                } else if (conditionItem.condition === 'is_not') {
                  checked = checked && (objParam[conditionItem.nameCondition] != conditionItem.inputCondition);
                }
              } else if (conditionItem?.linkCondition === 'or') {
                if (conditionItem.condition === 'include') {
                  checked = checked || objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition);
                } else if (conditionItem.condition === 'is') {
                  checked = checked || (objParam[conditionItem.nameCondition] == conditionItem.inputCondition);
                } else if (conditionItem.condition === 'not_include') {
                  checked = checked || (!objParam[conditionItem.nameCondition].includes(conditionItem.inputCondition));
                } else if (conditionItem.condition === 'is_not') {
                  checked = checked || (objParam[conditionItem.nameCondition] != conditionItem.inputCondition);
                }
              }
            }
            if (checked === false) {
              if (dataMessages[i].belong_to === 'user') setIndexUser(prev => prev + 1);
              continue;
            }
          }
          console.log(dataMessages[i])
          if (dataMessages[i].belong_to === 'bot') {
            if (dataMessages[i]?.message_content[0].type === 'delay') {
              if (dataMessages[i]?.message_content[0]?.delay.typing_on) {
                await new Promise((resolve) => {
                  renderMessage.push({ ...dataMessages[i] });
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                  resolve();
                }).then(async () => {
                  await new Promise((resolve) => {
                    delayRender = setTimeout(() => {
                      resolve();
                    }, (dataMessages[i]?.message_content[0].delay.content * 1000));
                  });
                }).then(() => {
                  renderMessage.pop();
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                });
              } else {
                await new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    resolve();
                  }, dataMessages[i]?.message_content[0]?.delay?.content * 1000);
                })
              }
              index = i;
              // promise.then(data => {
              //   renderMessage.push(data);
              //   setRenderMessageArr([
              //     ...renderMessage
              //   ]);
              // })
            } else if (dataMessages[i]?.message_content[0]?.type === 'variable_set') {
              // console.log(dataVariables, 'checkkkk variables')                
              if (variables.length !== 0) {
                let dataVarExist = dataMessages[i]?.message_content[0][dataMessages[i]?.message_content[0].type].variables;
                variables.forEach(item => {
                  for (let z = 0; z < dataVarExist.length; z++) {
                    if (item.variable_name === dataVarExist[z].key) {
                      item.default_value = dataVarExist[z].value;
                    }
                  }
                });
                console.log(variables, 'checkkkk variables');
                setVariables([...variables]);
              }
              setIndexMessageRender(i);
              index = i;
            } else if (dataMessages[i]?.message_content[0]?.type === 'clear_variable') {
              // console.log(dataVariables, 'checkkkk variables')                
              if (variables.length !== 0) {
                let dataVarExist = dataMessages[i]?.message_content[0][dataMessages[i]?.message_content[0].type].variables;
                variables.forEach(item => {
                  for (let z = 0; z < dataVarExist.length; z++) {
                    if (item.variable_name === dataVarExist[z]) {
                      item.default_value = "";
                    }
                  }
                });
                console.log(variables, 'checkkkk variables');
                setVariables([...variables]);
              }
              setIndexMessageRender(i);
              index = i;
            } else {
              await new Promise((resolve) => {
                return delayRender = setTimeout(() => {
                  if (dataMessages[i].message_content[0].type === 'text_input' && dataMessages[i].message_content[0].text_input.content) {
                    dataMessages[i].message_content[0].text_input.content = dataMessages[i].message_content[0].text_input.content.replaceAll(SCAN_REGEX, (text, variable) => {
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
                  }
                  resolve({ ...dataMessages[i] });
                }, 1000);
              }).then(data => {
                renderMessage.push(data);
                console.log(data)
                setRenderMessageArr([
                  ...renderMessage
                ]);
                if (isPauseScroll === false) {
                  scrollToBottom();
                }
                if (data.message_content[0][data.message_content[0]?.type]?.scroll_auto === true) {
                  isPauseScroll = true;
                }
              })
              index = i;
            }
          } else if (dataMessages[i].belong_to === 'user' && dataMessages[i].message_content.length > 0) {
            await new Promise((resolve) => {
              return delayRender = setTimeout(() => {
                for (let j = 0; j < dataMessages[i].message_content.length; j++) {
                  if (dataMessages[i].message_content[j].type === 'capture') {
                    api.get(`https://svg-captcha.herokuapp.com/captcha?size=${dataMessages[i].message_content[j][dataMessages[i].message_content[j].type].length}${dataMessages[i].message_content[j][dataMessages[i].message_content[j].type].colour ? '&color=true' : ''}&charPreset=${dataMessages[i].message_content[j][dataMessages[i].message_content[j].type].type}`).then(res => {
                      console.log(res);
                      captcha.push({
                        index: i,
                        indexContent: j,
                        ...res.data
                      })
                      setCaptcha([...captcha]);
                    })
                  }
                }
                resolve({ ...dataMessages[i] });
              }, 1000);
            }).then(data => {
              renderMessage.push(data);
              setRenderMessageArr([
                ...renderMessage
              ]);
              if (isPauseScroll === false) {
                scrollToBottom();
              }
            })
            index = i;
            break;
          }
        }
      }
      setIndexMessageRender(index);
      setRenderMessageArr([
        ...renderMessage
      ]);
    } else {
      // handle check message_content for user 
      //if message_content.length !== 0 => show message
      if (dataMessages[indexMessageRender + 1].message_content.length > 0 && dataMessages[indexMessageRender + 1].hidden !== true) {
        await new Promise((resolve) => {
          return delayRender = setTimeout(() => {
            for (let j = 0; j < dataMessages[indexMessageRender + 1].message_content.length; j++) {
              if (dataMessages[indexMessageRender + 1].message_content[j].type === 'capture') {
                api.get(`https://svg-captcha.herokuapp.com/captcha?size=${dataMessages[indexMessageRender + 1].message_content[j][dataMessages[indexMessageRender + 1].message_content[j].type].length}${dataMessages[indexMessageRender + 1].message_content[j][dataMessages[indexMessageRender + 1].message_content[j].type].colour ? '&color=true' : ''}&charPreset=${dataMessages[indexMessageRender + 1].message_content[j][dataMessages[indexMessageRender + 1].message_content[j].type].type}`).then(res => {
                  console.log(res);
                  captcha.push({
                    index: indexMessageRender + 1,
                    indexContent: j,
                    ...res.data
                  })
                  setCaptcha([...captcha]);
                })
              }
            }
            resolve({ ...dataMessages[indexMessageRender + 1] });
          }, 1000);
        }).then(data => {
          renderMessage.push(data);
          console.log(data)
          setRenderMessageArr([
            ...renderMessage
          ]);
          if (isPauseScroll === false) {
            scrollToBottom();
          }
        });
        index = indexMessageRender + 1;
      }
      //if message_content.length === 0 => loop until meet message have message_content.length !== 0 => show message
      else {
        for (let i = indexMessageRender + 1; i < dataMessages.length; i++) {
          if (dataMessages[i].message_content.length > 0 && dataMessages[i].hidden !== true) {
            if (dataMessages[i].belong_to === 'user') {
              await new Promise((resolve) => {
                return delayRender = setTimeout(() => {
                  for (let j = 0; j < dataMessages[i].message_content.length; j++) {
                    if (dataMessages[i].message_content[j].type === 'capture') {
                      api.get(`https://svg-captcha.herokuapp.com/captcha?size=${dataMessages[i].message_content[j][dataMessages[i].message_content[j].type].length}${dataMessages[i].message_content[j][dataMessages[i].message_content[j].type].colour ? '&color=true' : ''}&charPreset=${dataMessages[i].message_content[j][dataMessages[i].message_content[j].type].type}`).then(res => {
                        console.log(res);
                        captcha.push({
                          index: i,
                          indexContent: j,
                          ...res.data
                        })
                        setCaptcha([...captcha]);
                      })
                    }
                  }
                  resolve({ ...dataMessages[i] });
                }, 1000);
              }).then(data => {
                renderMessage.push(data);
                console.log(data)
                setRenderMessageArr([
                  ...renderMessage
                ]);
                if (isPauseScroll === false) {
                  scrollToBottom();
                }
              });
              index = i;
              break;
            } else {
              if (dataMessages[i]?.message_content[0].type === 'delay') {
                if (dataMessages[i]?.message_content[0]?.delay.typing_on) {
                  await new Promise((resolve) => {
                    renderMessage.push({ ...dataMessages[i] });
                    setRenderMessageArr([
                      ...renderMessage
                    ]);
                    resolve();
                  }).then(async () => {
                    await new Promise((resolve) => {
                      delayRender = setTimeout(() => {
                        resolve();
                      }, (dataMessages[i]?.message_content[0].delay.content * 1000));
                    });
                  }).then(() => {
                    renderMessage.pop();
                    setRenderMessageArr([
                      ...renderMessage
                    ]);
                  });
                } else {
                  await new Promise((resolve) => {
                    return delayRender = setTimeout(() => {
                      resolve();
                    }, dataMessages[i]?.message_content[0]?.delay?.content * 1000);
                  })
                }
                index = i;
              } else if (dataMessages[i]?.message_content[0]?.type === 'variable_set') {
                if (variables.length !== 0) {
                  let dataVarExist = dataMessages[i]?.message_content[0][dataMessages[i]?.message_content[0].type].variables;
                  variables.forEach(item => {
                    for (let z = 0; z < dataVarExist.length; z++) {
                      if (item.variable_name === dataVarExist[z].key) {
                        item.default_value = dataVarExist[z].value;
                      }
                    }
                  });
                  console.log(variables, 'checkkkk variables');
                  setVariables([...variables]);
                }
                setIndexMessageRender(i);
                index = i;
              } else if (dataMessages[i]?.message_content[0]?.type === 'clear_variable') {
                // console.log(dataVariables, 'checkkkk variables')                
                if (variables.length !== 0) {
                  let dataVarExist = dataMessages[i]?.message_content[0][dataMessages[i]?.message_content[0].type].variables;
                  variables.forEach(item => {
                    for (let z = 0; z < dataVarExist.length; z++) {
                      if (item.variable_name === dataVarExist[z]) {
                        item.default_value = "";
                      }
                    }
                  });
                  console.log(variables, 'checkkkk variables');
                  setVariables([...variables]);
                }
                setIndexMessageRender(i);
                index = i;
              } else {
                await new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    if (dataMessages[i].message_content[0].type === 'text_input' && dataMessages[i].message_content[0].text_input.content) {
                      dataMessages[i].message_content[0].text_input.content = dataMessages[i].message_content[0].text_input.content.replaceAll(SCAN_REGEX, (text, variable) => {
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
                    }
                    resolve({ ...dataMessages[i] });
                  }, 1000);
                }).then(data => {
                  renderMessage.push(data);
                  console.log(data)
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                  if (isPauseScroll === false) {
                    scrollToBottom();
                  }
                });
              }
            }
          }
        }
      }
      setIndexMessageRender(index);
      // setIndexUser(prev => prev );
    }

    // clearTimeout(delayRender);

    // renderMessageArr
  }

  const onChangeValue = (indexContent, contentType, value, field, subFiled, name) => {
    console.log(dataMessages[indexMessageRender].message_content[indexContent], indexContent, contentType, value, field, subFiled, name);
    if (name) {
      if (dataMessages[indexMessageRender].message_content[indexContent][contentType][field][subFiled] === undefined) {
        dataMessages[indexMessageRender].message_content[indexContent][contentType][field][subFiled] = {}
      }
      dataMessages[indexMessageRender].message_content[indexContent][contentType][field][subFiled][name] = value;
    } else if (subFiled) {
      if (dataMessages[indexMessageRender].message_content[indexContent][contentType][field] === undefined) {
        dataMessages[indexMessageRender].message_content[indexContent][contentType][field] = {}
      }
      dataMessages[indexMessageRender].message_content[indexContent][contentType][field][subFiled] = value;
    } else if (field) {
      if (dataMessages[indexMessageRender].message_content[indexContent][contentType] === undefined) {
        dataMessages[indexMessageRender].message_content[indexContent][contentType] = {}
      }
      dataMessages[indexMessageRender].message_content[indexContent][contentType][field] = value;
    }

    if (dataMessages[indexMessageRender].message_content[indexContent][contentType].is_save_input_content) {
      variables.forEach(item => {
        if (dataMessages[indexMessageRender].message_content[indexContent][contentType].save_input_content === item.variable_name) {
          let dataContentType = { ...dataMessages[indexMessageRender].message_content[indexContent][contentType] };
          if (contentType === 'zip_code_address') {
            console.log(dataContentType, 'checkkkk value');
            item.default_value = `〒 ${dataContentType?.value_post_code} ${dataContentType?.value_prefecture}${dataContentType?.value_municipality} ${dataContentType?.value_address}${dataContentType?.value_building_name}`;
          } else if (field === 'start_date_select' || field === 'end_date_select') {
            item.default_value = `${dataContentType?.start_date_select || "start date"} ~ ${dataContentType?.end_date_select || "end date"}`;
          } else if (contentType === 'radio_button') {
            item.default_value = dataContentType[dataContentType.type].find(item => item.id === value).text || item.default_value;
          } else if (contentType === 'checkbox') {
            let dataTextChecked = dataContentType.checkedValue.map(itemChecked => {
              return dataContentType[dataContentType.type].find(item => itemChecked === item.id).text;
            })
            item.default_value = dataTextChecked.join(',') || item.default_value;
          } else {
            item.default_value = value;
          }
        }
      });
      objParam[dataMessages[indexMessageRender].message_content[indexContent][contentType].save_input_content] = value;
      setObjParam({ ...objParam });
    }
    setDataMessages([...dataMessages]);
  }

  return (
    scenarioId ?
      <React.Fragment>
        <div id="sp-container" className="sp-container">
          <div id="sp-header" style={botInfor?.main_color && { backgroundColor: botInfor?.main_color }} className="sp-header" onClick={() => onOpenPreview(!isOpen)}>
            <div className="sp-header-left">
              <div className="sp-header-left-avatar sp-avatar">
                <img src={botInfor?.icon?.url && ("https://ec-chatbot-test1.com/" + botInfor?.icon?.url)} />
              </div>
              <div className="sp-header-left-label">
                <div className="sp-header-left-label-sub-title">{botInfor?.subtitle}</div>
                <div className="sp-header-left-label-title">{botInfor?.title}</div>
              </div>
            </div>
            <div className="sp-header-right">
              <div className="sp-header-right-arrow">
                {isOpen ? <MDBIcon fas icon="chevron-down" /> : <MDBIcon fas icon="chevron-up" />}
              </div>
            </div>
          </div>
          <div id="sp-process-bar" className="sp-process-bar">
            <div className="sp-process-bar-color" style={{ width: `${((indexUser - 1) < 0 ? 0 : (indexUser - 1)) * 100 / messageUser.length}%` }}>
              {messageUser.length !== (indexUser - 1) ? `${messageUser.length - indexUser + 1} tasks rest` : "Completed!"}
            </div>
          </div>
          <div id="sp-body" className="sp-body">
            {
              renderMessageArr.map((message, indexMessage) => {
                return (
                  <React.Fragment key={indexMessage}>
                    {message.belong_to === 'bot' &&
                      message?.message_content.map((content, index) => {
                        return <BotMessage
                          key={index}
                          content={content}
                          index={index}
                          botInfor={botInfor}
                        />
                      })
                    }
                    {message.belong_to === 'user' &&
                      <div className="sp-body-user-side">
                        <div className="sp-body-user-side-messages">
                          <UserMessage
                            captcha={captcha}
                            messageContentProps={message.message_content}
                            disabled={message.disabled}
                            onChangeValue={(indexContent, contentType, value, field, subFiled, name) => onChangeValue(indexContent, contentType, value, field, subFiled, name)}
                            indexMessageRender={indexMessageRender}
                            onClickNext={() => onClickNext(indexMessage)}
                            indexMessage={indexMessage}
                            errorsProps={errors}
                            displayButtonNext={(value) => setIsDisplayButtonNext(value)}
                          />
                          {(message?.message_content.length !== 1 || (message?.message_content[0].type !== 'card_payment_radio_button' && message?.message_content[0].type !== 'product_purchase_radio_button') || (message?.message_content[0]?.[message?.message_content[0].type].type !== "picture_radio" ? (message?.message_content[0]?.[message?.message_content[0].type]?.card_linked_setting && message?.message_content[0]?.[message?.message_content[0].type]?.card_linked_setting === message?.message_content[0]?.[message?.message_content[0].type]?.initial_selection) : (message?.message_content[0]?.[message?.message_content[0].type]?.card_linked_setting_picture && message?.message_content[0]?.[message?.message_content[0].type]?.card_linked_setting_picture === message?.message_content[0]?.[message?.message_content[0].type]?.initial_selection_picture))) &&
                            <div className="ss-user-message__action-wrapper">
                              <Button disabled={message.disabled} className="ss-user-message__action-btn" onClick={() => onClickNext(indexMessage)}>
                                {message.buttonName || "To the next"}
                              </Button>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </React.Fragment>
                )

              })
            }
          </div>
        </div>
      </React.Fragment> :
      <React.Fragment />
  )
}

const BotMessage = ({ content, index, botInfor }) => {

  const handleDownloadFile = (file) => {
    let link = document.createElement('a');
    link.href = file;
    link.download = "file";
    link.target = "_blank"
    document.body.appendChild(link);

    link.click();
    link.remove();
  }

  return (
    <div key={index} className="sp-body-bot-side">
      {(content.type === 'text_input' || content.type === 'file' || content.type === 'delay') && (
        <div className="sp-body-bot-side-avatar sp-avatar">
          <img src={"https://ec-chatbot-test1.com/" + botInfor?.icon?.url} />
        </div>
      )}
      <div className="sp-body-bot-side-messages">
        {/* <img className="ss-bot-ava" src={icon} alt="" /> */}
        {content &&
          <React.Fragment>
            {/* bot: type == 'text_input' */}
            {content.type === 'text_input' && (
              <textarea
                className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                value={content[content.type]?.content || ''}
                // onChange={() => onChangeValue(indexMessageSelect, index, content.type, value, 'content')}
                readOnly
              ></textarea>
            )}
            {content.type === 'file' && (
              content[content.type]?.content ? (
                <React.Fragment>
                  {(content[content.type]?.content.includes('jpeg') || content[content.type]?.content.includes('png') || content[content.type]?.content.includes('jpg')) ?
                    <img
                      src={content[content.type]?.content}
                      alt=""
                      style={{ width: '50%', marginLeft: '8px' }} /> :
                    <span
                      style={{ color: '#089BE5', fontSize: '17px', display: 'block', height: '50px', cursor: 'pointer' }}
                      onClick={() => handleDownloadFile(content[content.type]?.content)}
                    >Download this file</span>}
                </React.Fragment>
              ) :
                <textarea
                  className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                  value={''}
                  readOnly
                ></textarea>
            )}
            {content.type === 'delay' && (
              <img src={messageTypingGif} style={{ backgroundColor: '#EBF7FF', height: '40px' }} />
            )}
          </React.Fragment>}
      </div>
    </div>
  )
}

const UserMessage = ({ messageContentProps, onChangeValue, disabled = false, indexMessageRender, errorsProps, indexMessage, captcha, onClickNext, displayButtonNext }) => {
  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataCity, setDataCity] = useState([]);
  const [dataPrefectures, setDataPrefectures] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);
  const [checked, setChecked] = useState([]);

  function loadCaptcha(indexContent) {
    console.log('load captcha');
    console.log(captcha, indexMessage, indexMessageRender, captcha.filter(item => item.index === indexMessage))
    if (document.getElementById(`captcha-${indexMessage}-${indexContent}`) && captcha.length !== 0)
      document.getElementById(`captcha-${indexMessage}-${indexContent}`).innerHTML = captcha.filter(item => item.index === indexMessage && item.indexContent === indexContent)?.[0]?.data || "";
  }

  useEffect(() => {
    setErrors(errorsProps);
  }, [errorsProps])

  useEffect(() => {
    setMessageContent(messageContentProps);
  }, [messageContentProps])

  useEffect(() => {
    api.get(`/api/v1/prefectures`).then((res) => {
      setDataPrefectures(res.data.data);
    }).catch((error) => { console.error(error) });
  }, [])

  useEffect(() => {

  }, [])

  useEffect(() => {
    messageContent.forEach((content, indexContent) => {
      console.log(content)
      if (content.type === "calendar") {
        let calendar = content.calendar;
        if (calendar.initial_selection && calendar.type !== "start_end_date") {
          let i = 0;
          let date_select = "";
          console.log(handleDisableDateCalendar(moment().add(1, 'days'), calendar));
          while (handleDisableDateCalendar(moment().add(i, 'days'), calendar)) {
            date_select = moment().add(i + 1, 'days').format("YYYY/MM/DD");
            console.log(handleDisableDateCalendar(moment().add(i, 'days'), calendar));
            i++;
          }
          calendar.date_select = date_select;
        } else if (calendar.initial_selection && calendar.type === "start_end_date") {
          let i = 0;
          console.log(handleDisableDateCalendar(moment().add(1, 'days'), calendar));
          while (handleDisableDateCalendar(moment().add(i, 'days'), calendar)) {
            calendar.start_date_select = moment().add(i + 1, 'days');
            calendar.end_date_select = moment().add(i + 1, 'days');
            console.log(handleDisableDateCalendar(moment().add(i, 'days'), calendar));
            i++;
          }
        }
      } else if (content.type === "checkbox") {
        let checkbox = content.checkbox;
        if (checkbox.all_item_checked) {
          checkbox[checkbox.type].forEach(item => {
            checkbox.checkedValue.push(item.id);
          })
          onChangeValue(indexContent, content.type, checkbox.checkedValue, 'checkedValue');
          console.log(checkbox.checkedValue)
        }
      }
    })
  }, [])

  const onChangeValueCheckbox = (checkbox, indexContent, contentType, value, field) => {
    // setChecked(prev => {
    //   const isChecked = checked.includes(value);
    //   console.log(checked);
    //   if (isChecked) {
    //     onChangeValue(indexContent, contentType, [...checked.filter(item => item !== value)], field);
    //     // messageContent[indexContent][contentType][field] = [...checked.filter(item => item !== value)];
    //     // setMessageContent([...messageContent])
    //     return checked.filter(item => item !== value);
    //   } else {
    //     onChangeValue(indexContent, contentType, [...prev, value], field);
    //     // messageContent[indexContent][contentType][field] = [...prev, value];
    //     // setMessageContent([...messageContent])
    //     return [...prev, value];
    //   }
    // })

    setMessageContent(prev => {
      let checkedArray = [...messageContent[indexContent][contentType].checkedValue];
      const isChecked = checkedArray.includes(value);
      if (isChecked) {
        checkedArray = checkedArray.filter(item => item !== value);
        console.log(checkedArray);
        prev[indexContent][contentType].checkedValue = checkedArray;
        return prev;
      } else {
        checkedArray.push(value);
        prev[indexContent][contentType].checkedValue = checkedArray;
        return prev;
      }
    })


    // console.log(checkbox, indexContent, contentType, value, field);
    // let checkboxClone = _.cloneDeep(checkbox);
    // const isChecked = checkboxClone.checkedValue.includes(value);
    // console.log(isChecked);
    // if (isChecked) {
    //   checkboxClone.checkedValue = checkboxClone.checkedValue.filter(item => item !== value);
    //   console.log(checkboxClone.checkedValue)
    //   onChangeValue(indexContent, contentType, checkboxClone.checkedValue, field);
    // } else {
    //   checkboxClone.checkedValue.push(value);
    //   onChangeValue(indexContent, contentType, checkboxClone.checkedValue, field);
    // }
  }

  function botUploadFile() {
    document.getElementById('ss-bot-file-upload').click();
  }

  function getBaseUrl(event, indexContent) {
    var file = document.querySelector('input[type=file]')['files'][0];
    const type = file.name.slice(file.name.lastIndexOf('.') + 1);
    if (messageContent[indexContent].attaching_file.file_type.length > 0 && !messageContent[indexContent].attaching_file.file_type.includes(type)) {
      errors[`message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`] = `Please specify a ${messageContent[indexContent].attaching_file.file_type.join(", ")} type file for the file.`;
      setErrors({ ...errors });
      return;
    } else {
      errors[`message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`] = "";
      setErrors({ ...errors });
    }
    // if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
    // var reader = new FileReader(file);

    // messageContent[indexContent].attaching_file.value = file.name;
    onChangeValue(indexContent, 'attaching_file', file.name, "value");
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
    console.log(calendar.fixed_date?.find(date => date === moment(current).format("YYYY/MM/DD")))
    if (calendar.end_date || calendar.start_date
      || calendar?.fixed_date?.length !== 0 || calendar?.non_select_date_time?.length !== 0
      || calendar.aggregation_target_period_from || calendar.aggregation_target_period_to
      || calendar.end_date_select) {
      return (moment(current, 'YYYY/MM/DD') > moment(calendar.end_date, 'YYYY/MM/DD')
        || moment(current, 'YYYY/MM/DD') < moment(calendar.start_date, 'YYYY/MM/DD')
        || (calendar.type === "start_end_date" && moment(current, 'YYYY/MM/DD') > moment(calendar.end_date_select, 'YYYY/MM/DD'))
        || calendar.fixed_date?.find(date => date === moment(current).format("YYYY/MM/DD"))
        || moment(current) < (calendar.aggregation_target_period_from ? moment().add(calendar.aggregation_target_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current) > (calendar.aggregation_target_period_to ? moment().add(calendar.aggregation_target_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || calendar.non_select_date_time?.find(type => {
          if (type === 'today') {
            return (moment().format("YYYY/MM/DD") === moment(current).format("YYYY/MM/DD"));
          } else if (type === 'tomorrow') {
            return moment().add(1, 'days').format("YYYY/MM/DD") === moment(current).format("YYYY/MM/DD");
          } else if (type === 'day_after_tomorrow') {
            return moment().add(2, 'days').format("YYYY/MM/DD") === moment(current).format("YYYY/MM/DD");
          } else if (type === 'past') {
            return moment(current).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD");
          } else if (type === 'future') {
            return moment(current).format("YYYY/MM/DD") > moment().format("YYYY/MM/DD");
          } else if (type === 'moon') {
            return moment(current).day() === 1;
          } else if (type === 'fire') {
            return moment(current).day() === 2;
          } else if (type === 'water') {
            return moment(current).day() === 3;
          } else if (type === 'wood') {
            return moment(current).day() === 4;
          } else if (type === 'money') {
            return moment(current).day() === 5;
          } else if (type === 'soil') {
            return moment(current).day() === 6;
          } else if (type === 'day') {
            return moment(current).day() === 0;
          }
        }))
    }
  }

  const handleDisableEndDateCalendar = (current, calendar) => {
    console.log(calendar.start_date, calendar[calendar.type].specified_period_from, calendar[calendar.type].specified_period_to)
    if (calendar.end_date || calendar.start_date
      || calendar?.fixed_date?.length !== 0 || calendar?.non_select_date_time?.length !== 0
      || calendar.start_date_select || calendar.specified_period_from
      || calendar.specified_period_to || calendar.aggregation_target_period_from
      || calendar.aggregation_target_period_to) {
      return (moment(current, 'YYYY/MM/DD') > moment(calendar.end_date, 'YYYY/MM/DD')
        || moment(current, 'YYYY/MM/DD') < moment(calendar.start_date, 'YYYY/MM/DD')
        || (calendar.type === "start_end_date" && moment(current, 'YYYY/MM/DD') < moment(calendar.start_date_select, 'YYYY/MM/DD'))
        || calendar.fixed_date?.find(date => date === moment(current).format("YYYY/MM/DD"))
        || moment(current) < (calendar.aggregation_target_period_from ? moment().add(calendar.aggregation_target_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current) > (calendar.aggregation_target_period_to ? moment().add(calendar.aggregation_target_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current, 'YYYY/MM/DD') < (calendar[calendar.type].specified_period_from ? moment(calendar.start_date_select, 'YYYY/MM/DD').add(calendar[calendar.type].specified_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current, 'YYYY/MM/DD') > (calendar[calendar.type].specified_period_to ? moment(calendar.start_date_select, 'YYYY/MM/DD').add(calendar[calendar.type].specified_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || calendar.non_select_date_time?.find(type => {
          if (type === 'today') {
            return (moment().format("YYYY/MM/DD") === moment(current).format("YYYY/MM/DD"));
          } else if (type === 'tomorrow') {
            return moment().add(1, 'days').format("YYYY/MM/DD") === moment(current).format("YYYY/MM/DD");
          } else if (type === 'day_after_tomorrow') {
            return moment().add(2, 'days').format("YYYY/MM/DD") === moment(current).format("YYYY/MM/DD");
          } else if (type === 'past') {
            return moment(current).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD");
          } else if (type === 'future') {
            return moment(current).format("YYYY/MM/DD") > moment().format("YYYY/MM/DD");
          } else if (type === 'moon') {
            return moment(current).day() === 1;
          } else if (type === 'fire') {
            return moment(current).day() === 2;
          } else if (type === 'water') {
            return moment(current).day() === 3;
          } else if (type === 'wood') {
            return moment(current).day() === 4;
          } else if (type === 'money') {
            return moment(current).day() === 5;
          } else if (type === 'soil') {
            return moment(current).day() === 6;
          } else if (type === 'day') {
            return moment(current).day() === 0;
          }
        }))
    }
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

        return (
          <React.Fragment key={indexContent}>
            {/* type == 'text_input' */}
            {
              content.type === 'text_input' && (
                <div style={{ marginBottom: '10px' }}>
                  {(textInput.title_require || textInput.require) &&
                    <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                      {textInput.title_require &&
                        <span className="ss-message__content--user-text-input-title">
                          {textInput.title}
                        </span>
                      }
                      {textInput.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {(textInput.type === 'text') &&
                    (textInput.text.isSplitInput ?
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <InputCustom
                          disabled={disabled}
                          placeholder={textInput.text?.placeholderLeft}
                          style={{ width: '49%', marginBottom: '0px' }}
                          onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'valueLeft')}
                          value={textInput[textInput.type]?.valueLeft}
                        ></InputCustom>
                        <InputCustom
                          disabled={disabled}
                          placeholder={textInput.text?.placeholderRight}
                          style={{ width: '49%' }}
                          onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'valueRight')}
                          value={textInput[textInput.type]?.valueRight}
                        ></InputCustom>
                      </div> :
                      <React.Fragment>
                        <InputCustom
                          disabled={disabled}
                          style={{ marginBottom: '0px' }}
                          placeholder={textInput[textInput.type]?.placeholderLeft}
                          onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                          value={textInput[textInput.type]?.value}
                        ></InputCustom>
                        {textInput.text?.placeholderRight &&
                          <span style={{ fontWeight: '400', color: 'black', fontSize: '12px', marginLeft: '18px' }}>{textInput.text?.placeholderRight}</span>
                        }
                      </React.Fragment>
                    )
                  }
                  {(textInput.type === 'phone_number') &&
                    <React.Fragment>
                      {textInput.phone_number.withHyphen === false ?
                        <InputCustom
                          disabled={disabled}
                          // className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: '0px' }}
                          placeholder={textInput[textInput.type]?.number}
                          onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                          value={textInput[textInput.type]?.value}
                        ></InputCustom> :
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <InputCustom
                            disabled={disabled}
                            className="ss-message__content--user-text-input ss-input-value"
                            maxLength={3}
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number1}
                            onChange={value => {
                              if (value.length === 3) {
                                document.getElementById('ss-user-message-phone_number_2').focus();
                                document.getElementById('ss-user-message-phone_number_2').select();
                              }
                              onChangeValue(indexContent, content.type, value, textInput.type, 'value1')
                            }}
                            value={textInput[textInput.type]?.value1}
                          ></InputCustom>
                          <InputCustom
                            id="ss-user-message-phone_number_2"
                            disabled={disabled}
                            className="ss-message__content--user-text-input ss-input-value"
                            style={{ marginBottom: '0px', width: '32%' }}
                            maxLength={4}
                            placeholder={textInput[textInput.type]?.number2}
                            onChange={value => {
                              if (value.length === 4) {
                                document.getElementById('ss-user-message-phone_number_3').focus();
                                document.getElementById('ss-user-message-phone_number_3').select();
                              }
                              onChangeValue(indexContent, content.type, value, textInput.type, 'value2')
                            }}
                            value={textInput[textInput.type]?.value2}
                          ></InputCustom>
                          <InputCustom
                            id="ss-user-message-phone_number_3"
                            disabled={disabled}
                            // className="ss-message__content--user-text-input ss-input-value"
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number3}
                            maxLength={4}
                            onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value3')}
                            value={textInput[textInput.type]?.value3}
                          ></InputCustom>
                        </div>
                      }
                    </React.Fragment>
                  }
                  {(textInput.type === 'password') &&
                    <React.Fragment>
                      <InputCustom
                        disabled={disabled}
                        type="password"
                        // className="ss-message__content--user-text-input ss-input-value"
                        style={{ marginBottom: '0px' }}
                        placeholder={textInput[textInput.type]?.password}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      ></InputCustom>
                    </React.Fragment>
                  }
                  {(textInput.type === 'urls' ||
                    textInput.type === 'email_address') &&
                    <React.Fragment>
                      <InputCustom
                        disabled={disabled}
                        // className="ss-message__content--user-text-input ss-input-value"
                        style={{ marginBottom: '0px' }}
                        placeholder={textInput[textInput.type].placeholder}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      ></InputCustom>
                    </React.Fragment>
                  }
                  {(textInput.type === 'email_confirmation') &&
                    (<>
                      <InputCustom
                        style={{ marginBottom: '5px' }}
                        disabled={disabled}
                        placeholder={textInput[textInput.type].cfEmlAdd_email}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      />
                      <InputCustom
                        disabled={disabled}
                        placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'valueConfirm')}
                        value={textInput[textInput.type]?.valueConfirm}
                      />
                    </>
                    )}
                  {(textInput.type === 'password_confirmation') &&
                    (<>
                      <InputCustom
                        style={{ marginBottom: '5px' }}
                        disabled={disabled}
                        type="password"
                        placeholder={textInput[textInput.type].password}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      />
                      <InputCustom
                        disabled={disabled}
                        type="password"
                        placeholder={textInput[textInput.type].confirm_password}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'valueConfirm')}
                        value={textInput[textInput.type]?.valueConfirm}
                      />
                    </>
                    )}
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${textInput.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${textInput.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'label' */}
            {
              (content.type === 'label' && label.lbl_content) && (
                <div style={{ marginBottom: '10px' }}>
                  <div className="ss-message__content--user-label-top">
                    <span className="ss-message__content--user-label-title">
                      {label.lbl_content}
                    </span>
                    {label?.require === true &&
                      <span className="ss-message__content--user-required">
                        * required
                      </span>
                    }
                  </div>
                </div>
              )
            }
            {/* type == 'textarea' */}
            {
              content.type === 'textarea' && (
                <div style={{ marginBottom: '10px' }}>
                  {(textarea.title_require || textarea.require) &&
                    <div className="ss-message__content--user-textarea-top" style={{ marginBottom: '0px' }}>
                      {textarea.title_require &&
                        <span className="ss-message__content--user-textarea-title">
                          {textarea.title}
                        </span>
                      }
                      {textarea.require === true && textarea?.type === 'text_input' &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {(textarea?.type === 'text_input' ||
                    textarea?.type === 'invalid_input') && (
                      <textarea
                        disabled={disabled || textarea?.type === 'invalid_input'}
                        className="ss-message__content--user-textarea ss-input-value"
                        placeholder={textarea[textarea.type]?.content}
                        rows={3}
                        onChange={e => onChangeValue(indexContent, content.type, e.target.value, textarea?.type, 'value')}
                        value={textarea?.type === 'invalid_input' ? textarea[textarea.type]?.content : textarea[textarea.type]?.value}
                      ></textarea>
                    )}
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${textarea.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${textarea.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'radio_button' */}
            {
              content.type === 'radio_button' && (
                <div style={{ marginBottom: '10px' }}>
                  {(radioButton.title_require || radioButton.require) &&
                    <div className="ss-message__content--user-radio_button-top" style={{ marginBottom: '0px' }}>
                      {radioButton.title_require &&
                        <span className="ss-message__content--user-radio_button-title">
                          {radioButton.title}
                        </span>
                      }
                      {radioButton.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div className="ss-message__content--user-radio_button-wrapper">
                    {radioButton.type === 'default' && (
                      radioButton[radioButton.type].map((item, index) => {
                        return <div key={index} className="ss-message__content--user-radio_button">
                          <input
                            disabled={disabled}
                            type="radio"
                            id="ss-message__content--user-radio_button"
                            checked={radioButton.initial_selection === item.id}
                            onChange={() => onChangeValue(indexContent, content.type, item.id, 'initial_selection')}
                          />
                          {item.text &&
                            <label htmlFor="ss-message__content--user-radio_button">
                              {item.text}
                            </label>
                          }
                        </div>
                      })
                    )}
                    {radioButton.type === 'radio_button_img' && (
                      radioButton[radioButton.type].map((item, index) => {
                        return <div key={index} className="ss-message__content--user-radio_button--radio_button_img">
                          <input
                            disabled={disabled}
                            type="radio"
                            name="ss-message__content--user-radio_button--radio_button_img"
                            id="ss-message__content--user-radio_button--radio_button_img"
                            checked={radioButton.initial_selection === item.id}
                            onChange={() => onChangeValue(indexContent, content.type, item.id, 'initial_selection')}
                          />
                          <img
                            src={item.img}
                            alt=""
                          />
                          {item.text &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              {item.text}
                            </div>
                          }
                        </div>
                      })
                    )}
                    {radioButton.type === 'consume_api_response' && (
                      <>
                        <div className="ss-message__content--user-radio_button">
                          <input
                            type="radio"
                            name="ss-message__content--user-radio_button"
                            id="ss-message__content--user-radio_button"
                          />
                          <label htmlFor="ss-message__content--user-radio_button">
                            label
                          </label>
                        </div>
                        <div className="ss-message__content--user-radio_button">
                          <input
                            type="radio"
                            name="ss-message__content--user-radio_button"
                            id="ss-message__content--user-radio_button"
                          />
                          <label htmlFor="ss-message__content--user-radio_button">
                            label
                          </label>
                        </div>
                      </>
                    )}
                    {radioButton.type === 'block_style' && (
                      radioButton[radioButton.type].map((item, index) => {
                        return item.text && <div
                          style={{ marginBottom: '10px', cursor: 'pointer', backgroundColor: radioButton.value ? (radioButton.value === item.id ? '#347AED' : '') : (radioButton.initial_selection === item.id ? '#347AED' : '') }}
                          key={index}
                          className="ss-message__content--user-radio_button--block_style"
                          onClick={() => onChangeValue(indexContent, content.type, item.id, 'initial_selection')}
                        >
                          <span>{item.text}</span>
                        </div>
                      })
                    )}
                  </div>
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'checkbox' */}
            {
              content.type === 'checkbox' && (
                <div style={{ marginBottom: '10px' }}>
                  {(checkbox.title_require || checkbox.require) &&
                    <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                      {checkbox.title_require &&
                        <span className="ss-message__content--user-checkbox-title">
                          {checkbox.title}
                        </span>
                      }
                      {checkbox.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div className="ss-message__content--user-checkbox-wrapper">
                    {checkbox.type === 'default' && (
                      <Checkbox.Group
                        style={{ width: "100%" }}
                        disabled={disabled}
                        onChange={(value) => onChangeValue(indexContent, content.type, value, 'checkedValue')}
                        value={checkbox.checkedValue}
                      >
                        {checkbox[checkbox.type].map((item, index) => {
                          console.log(checkbox.checkedValue, 'checkkkk box')
                          return <div key={index} className="ss-message__content--user-checkbox">
                            <Checkbox
                              value={item.id}
                            >
                              <label htmlFor="ss-message__content--user-checkbox">
                                {item.text}
                              </label>
                            </Checkbox>
                          </div>
                        })}
                      </Checkbox.Group>
                    )}
                    {checkbox.type === 'checkbox_img' && (
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
                    )}
                    {checkbox.type === 'consume_api_response' && (
                      <>
                        <div className="ss-message__content--user-checkbox">
                          <input
                            type="checkbox"
                            name="ss-message__content--user-checkbox"
                            id="ss-message__content--user-checkbox"
                          />
                          <label htmlFor="ss-message__content--user-checkbox">
                            label
                          </label>
                        </div>
                        <div className="ss-message__content--user-checkbox">
                          <input
                            type="checkbox"
                            name="ss-message__content--user-checkbox"
                            id="ss-message__content--user-checkbox"
                          />
                          <label htmlFor="ss-message__content--user-checkbox">
                            label
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'pull_down' */}
            {
              content.type === 'pull_down' && (
                <div style={{ marginBottom: '10px' }}>
                  {(pullDown.title_require || pullDown.require) &&
                    <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                      {pullDown.title_require &&
                        <span className="ss-message__content--user-pull_down-title">
                          {pullDown.title}
                        </span>
                      }
                      {pullDown.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div className="ss-message__content--user-pull_down-wrapper">
                    {pullDown.type === 'customization' && (
                      <>
                        <div className="ss-message__content--user-pull_down--customization">
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginBottom: '4px' }}
                          >
                            <span>{pullDown[pullDown.type].title_comment}</span>
                          </div>
                          <div className="">
                            {
                              pullDown[pullDown.type].is_comment === false ?
                                <div className="ss-message__content--user-pull_down-col col-12">
                                  <SelectCustom
                                    disabled={disabled}
                                    data={pullDown[pullDown.type].options_without_comment}
                                    keyValue="value"
                                    style={{ width: '100%' }}
                                    placeholder={pullDown[pullDown.type].display_unselected}
                                    nameValue="text"
                                    onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'value')}
                                    value={pullDown[pullDown.type].value}
                                  />
                                </div> :
                                <div className="ss-message__content--user-pull_down-col col-12" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <SelectCustom
                                    disabled={disabled}
                                    data={pullDown[pullDown.type].options_with_comment}
                                    keyValue="value"
                                    style={{ width: '49%' }}
                                    placeholder={pullDown[pullDown.type].display_unselected}
                                    nameValue="text"
                                    onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueLeft')}
                                    value={pullDown[pullDown.type].valueLeft}
                                  />
                                  <SelectCustom
                                    disabled={disabled}
                                    data={pullDown[pullDown.type].options_with_comment}
                                    keyValue="value2"
                                    style={{ width: '49%' }}
                                    placeholder={pullDown[pullDown.type].display_unselected}
                                    nameValue="text2"
                                    onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueRight')}
                                    value={pullDown[pullDown.type].valueRight}
                                  />
                                </div>
                            }
                          </div>
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: '4px' }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </>
                    )}
                    {(pullDown.type === 'time_hm') && (
                      <React.Fragment>
                        {console.log(dataHour, pullDown[pullDown.type].start_at, pullDown[pullDown.type].end_at)}
                        <div className="ss-message__content--user-pull_down--time_hm">
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataHour.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_at) || "0") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_at) || "23"))}
                              placeholder="Time"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueHour')}
                              value={pullDown[pullDown.type].valueHour}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMinute')}
                              value={pullDown[pullDown.type].valueMinute}
                            />
                            <div
                              className="ss-message__content--user-pull_down-comment"
                              style={{ marginTop: '4px', width: '32%' }}
                            >
                              <span>{pullDown[pullDown.type].comment}</span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                    {(pullDown.type === 'date_ymd' ||
                      pullDown.type === 'dob_ymd') && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div className="" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                              <SelectCustom
                                disabled={disabled}
                                data={dataYear.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_year) || "1935") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_year) || "2072"))}
                                placeholder="Year"
                                style={{ width: '32%' }}
                                onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueYear')}
                                value={pullDown[pullDown.type].valueYear}
                              />
                              <SelectCustom
                                disabled={disabled}
                                data={dataMonth}
                                placeholder="Month"
                                style={{ width: '32%' }}
                                onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMonth')}
                                value={pullDown[pullDown.type].valueMonth}
                              />
                              <SelectCustom
                                disabled={disabled}
                                data={dataDay}
                                placeholder="Day"
                                style={{ width: '32%' }}
                                onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueDay')}
                                value={pullDown[pullDown.type].valueDay}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment"
                                style={{ marginTop: '4px', width: '32%' }}
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                    {(pullDown.type === 'date_md') && (
                      <React.Fragment>
                        <div className="ss-message__content--user-pull_down--time_hm">
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMonth')}
                              value={pullDown[pullDown.type].valueMonth}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueDay')}
                              value={pullDown[pullDown.type].valueDay}
                            />
                            <div
                              className="ss-message__content--user-pull_down-comment"
                              style={{ marginTop: '4px', width: '32%' }}
                            >
                              <span>{pullDown[pullDown.type].comment}</span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                    {(pullDown.type === 'date_ym' ||
                      pullDown.type === 'dob_ym') && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <SelectCustom
                                disabled={disabled}
                                data={dataYear.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_year) || "1935") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_year) || "2072"))}
                                placeholder="Year"
                                style={{ width: '32%' }}
                                onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueYear')}
                                value={pullDown[pullDown.type].valueYear}
                              />
                              <SelectCustom
                                disabled={disabled}
                                data={dataMonth}
                                placeholder="Month"
                                style={{ width: '32%' }}
                                onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMonth')}
                                value={pullDown[pullDown.type].valueMonth}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment"
                                style={{ marginTop: '4px', width: '32%' }}
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                    {(pullDown.type === 'date_ymd_hm') && (
                      <React.Fragment>
                        <div className="ss-message__content--user-pull_down--time_hm">
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataYear.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_year) || "1935") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_year) || "2072"))}
                              placeholder="Year"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueYear')}
                              value={pullDown[pullDown.type].valueYear}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMonth')}
                              value={pullDown[pullDown.type].valueMonth}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%', marginBottom: '10px' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueDay')}
                              value={pullDown[pullDown.type].valueDay}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataHour.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_at) || "0") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_at) || "23"))}
                              placeholder="Time"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueHour')}
                              value={pullDown[pullDown.type].valueHour}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMinutes')}
                              value={pullDown[pullDown.type].valueMinutes}
                            />
                            <div
                              className="ss-message__content--user-pull_down-comment"
                              style={{ marginTop: '4px', width: '32%' }}
                            >
                              <span>{pullDown[pullDown.type].comment}</span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                    {pullDown.type === 'timezone_from_to' && (
                      <React.Fragment>
                        <div className="ss-message__content--user-pull_down--time_hm">
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataHour.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_at) || "0") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_at) || "23"))}
                              placeholder="Time"
                              style={{ width: '49%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueHour1')}
                              value={pullDown[pullDown.type].valueHour1}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '49%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMinutes1')}
                              value={pullDown[pullDown.type].valueMinutes1}
                            />
                          </div>
                          <div style={{ textAlign: 'center' }}>~</div>
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataHour.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_at) || "0") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_at) || "23"))}
                              placeholder="Time"
                              style={{ width: '49%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueHour2')}
                              value={pullDown[pullDown.type].valueHour2}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '49%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMinutes2')}
                              value={pullDown[pullDown.type].valueMinutes2}
                            />
                          </div>
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: '4px', width: '32%' }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                    {pullDown.type === 'period_from_to' && (
                      <React.Fragment>
                        <div className="ss-message__content--user-pull_down--time_hm">
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataYear.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_year) || "1935") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_year) || "2072"))}
                              placeholder="Year"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueYear1')}
                              value={pullDown[pullDown.type].valueYear1}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMonth1')}
                              value={pullDown[pullDown.type].valueMonth1}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueDay1')}
                              value={pullDown[pullDown.type].valueDay1}
                            />
                          </div>
                          <div style={{ textAlign: 'center' }}>~</div>
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataYear.filter(item => parseInt(item.value) >= (parseInt(pullDown[pullDown.type].start_year) || "1935") && parseInt(item.value) <= (parseInt(pullDown[pullDown.type].end_year) || "2072"))}
                              placeholder="Year"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueYear2')}
                              value={pullDown[pullDown.type].valueYear2}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueMonth2')}
                              value={pullDown[pullDown.type].valueMonth2}
                            />
                            <SelectCustom
                              disabled={disabled}
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%' }}
                              onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'valueDay2')}
                              value={pullDown[pullDown.type].valueDay2}
                            />
                          </div>
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: '4px', width: '32%' }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                    {pullDown.type === 'prefectures' && (
                      <React.Fragment>
                        <SelectCustom
                          disabled={disabled}
                          data={dataPrefectures}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          keyValue="name"
                          nameValue="name"
                          onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'value')}
                          value={pullDown[pullDown.type]?.value}
                        />
                      </React.Fragment>
                    )}
                    {pullDown.type === 'up_to_municipality' && (
                      <div>
                        <div style={{ fontWeight: '400', fontSize: '12px' }}>{pullDown[pullDown.type].prefecture_comment}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <SelectCustom
                            disabled={disabled}
                            data={dataPrefectures}
                            placeholder="Select prefecture"
                            style={{ width: '45%' }}
                            keyValue="id"
                            nameValue="name"
                            onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'prefecture')}
                            value={pullDown[pullDown.type].prefecture}
                          />
                          <span>~</span>
                          <SelectCustom
                            disabled={disabled}
                            data={dataCity}
                            placeholder="Select city"
                            style={{ width: '45%' }}
                            keyValue="id"
                            nameValue="name"
                            onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'city')}
                            value={pullDown[pullDown.type].city}
                          />
                        </div>
                        <div style={{ fontWeight: '400', fontSize: '12px' }}>{pullDown[pullDown.type].city_comment}</div>
                      </div>
                    )}
                  </div>
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${pullDown.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${pullDown.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'zip_code_address' */}
            {
              content.type === 'zip_code_address' && (
                <div style={{ marginBottom: '10px' }}>
                  {(zipCodeAddress.title_require || zipCodeAddress.isCheckRequire) &&
                    <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                      {zipCodeAddress.title_require &&
                        <span className="ss-message__content--user-pull_down-title">
                          {zipCodeAddress.title}
                        </span>
                      }
                      {(zipCodeAddress.isCheckRequire === 'all_items_require' ||
                        zipCodeAddress.isCheckRequire === 'require') &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {zipCodeAddress.post_code !== undefined && (
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ fontWeight: '400', fontSize: '10px', width: '100%', marginBottom: '5px' }}>
                        Post code
                      </div>
                      {zipCodeAddress.split_postal_code !== true ?
                        <InputCustom
                          placeholder={zipCodeAddress.post_code}
                          disabled={disabled}
                          style={{ width: '100%' }}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'value_post_code')}
                          value={zipCodeAddress.value_post_code}
                        /> :
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <InputCustom
                            placeholder={zipCodeAddress.post_code_left}
                            disabled={disabled}
                            style={{ width: '49%' }}
                            onChange={value => onChangeValue(indexContent, content.type, value, 'value_post_code_left')}
                            value={zipCodeAddress.value_post_code_left}
                          />
                          <InputCustom
                            placeholder={zipCodeAddress.post_code_right}
                            disabled={disabled}
                            style={{ width: '49%' }}
                            onChange={value => onChangeValue(indexContent, content.type, value, 'value_post_code_right')}
                            value={zipCodeAddress.value_post_code_right}
                          />
                        </div>
                      }
                    </div>
                  )}
                  {zipCodeAddress.prefecture !== undefined &&
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ fontWeight: '400', fontSize: '10px', width: '100%', marginBottom: '3px' }}>
                        Prefectures
                      </div>
                      <InputCustom
                        placeholder={zipCodeAddress.prefecture}
                        disabled={disabled}
                        style={{ width: '100%' }}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'value_prefecture')}
                        value={zipCodeAddress.value_prefecture}
                      />
                    </div>
                  }
                  {zipCodeAddress.municipality !== undefined &&
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ fontWeight: '400', fontSize: '10px', width: '100%', marginBottom: '3px' }}>
                        Municipalities
                      </div>
                      <InputCustom
                        placeholder={zipCodeAddress.municipality}
                        disabled={disabled}
                        style={{ width: '100%' }}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'value_municipality')}
                        value={zipCodeAddress.value_municipality}
                      />
                    </div>
                  }
                  {zipCodeAddress.address !== undefined &&
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ fontWeight: '400', fontSize: '10px', width: '100%', marginBottom: '3px' }}>
                        Address
                      </div>
                      <InputCustom
                        placeholder={zipCodeAddress.address}
                        disabled={disabled}
                        style={{ width: '100%' }}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'value_address')}
                        value={zipCodeAddress.value_address}
                      />
                    </div>
                  }
                  {zipCodeAddress.building_name !== undefined &&
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ fontWeight: '400', fontSize: '10px', width: '100%', marginBottom: '3px' }}>
                        Building name
                      </div>
                      <InputCustom
                        placeholder={zipCodeAddress.building_name}
                        disabled={disabled}
                        style={{ width: '100%' }}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'value_building_name')}
                        value={zipCodeAddress.value_building_name}
                      />
                    </div>
                  }
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'attaching_file' */}
            {
              content.type === 'attaching_file' && (
                <div style={{ marginBottom: '10px' }}>
                  {(attachingFile.require) &&
                    <div className="ss-message__content--user-attaching_file-top">
                      {attachingFile.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div className="ss-message__content--user-attaching_file">
                    <div style={{ position: 'relative' }}>
                      <InputCustom
                        value={attachingFile.value}
                        disabled={true}
                      />
                      <MDBIcon fas icon="times-circle"
                        className="ss-message-custom-icon-times"
                        style={{ position: 'absolute', top: '23%', right: '2%', fontSize: '20px', cursor: 'pointer' }}
                        onClick={() => onChangeValue(indexContent, content.type, "", 'value')} />
                    </div>
                    <input
                      type="file"
                      id="ss-bot-file-upload"
                      name="bot-file-upload"
                      hidden
                      onChange={(e) => getBaseUrl(e, indexContent)}
                    />
                    <Button id={`sp-button-upload-${indexContent}`} className="ss-message__content--user-attaching_file-btn" style={{ backgroundColor: '#A3B1BF', marginTop: '3px', width: '100%' }}
                      disabled={disabled}
                      onClick={botUploadFile}>
                      Select file
                    </Button>
                  </div>
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'calendar' */}
            {
              content.type === 'calendar' && (
                <div style={{ marginBottom: '10px' }}>
                  {(calendar.title_require || calendar.require) &&
                    <div className="ss-message__content--user-calender-top" style={{ marginBottom: '0px' }}>
                      {calendar.title_require &&
                        <span className="ss-message__content--user-calender-title">
                          {calendar.title}
                        </span>
                      }
                      {calendar.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {/* calendar: type = 'date_selection' */}
                  {calendar.type === 'date_selection' && (
                    <React.Fragment>
                      <DatePickerCustom
                        disabled={disabled}
                        style={{ width: '99%', marginTop: '5px' }}
                        value={calendar.date_select ? moment(calendar.date_select) : null}
                        onChange={(date, dateString) => onChangeValue(indexContent, content.type, dateString, 'date_select')}
                        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                      />
                    </React.Fragment>
                  )}
                  {/* calendar: type = 'embedded' */}
                  {calendar.type === 'embedded' && (
                    <React.Fragment>
                      {console.log(calendar.date_select)}
                      <div className="ss-message__content--user-calender-embedded" style={{ marginTop: '5px' }}>
                        <Calendar
                          disabled={disabled}
                          className="ss-custom-calendar"
                          fullscreen={false}
                          onPanelChange={(value, mode) => console.log(value)}
                          style={{ top: '20px', width: '300px', border: '1px solid grey' }}
                          value={calendar.date_select ? moment(calendar.date_select, "YYYY/MM/DD") : null}
                          onChange={value => onChangeValue(indexContent, content.type, value.format("YYYY/MM/DD"), 'date_select')}
                          disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                        />
                      </div>
                    </React.Fragment>
                  )}
                  {/* calendar: type = 'start_end_date' */}
                  {calendar.type === 'start_end_date' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <DatePickerCustom
                        disabled={disabled}
                        style={{ width: '49%', marginTop: '5px' }}
                        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                        value={calendar.start_date_select ? moment(calendar.start_date_select) : null}
                        onChange={(date, dateString) => onChangeValue(indexContent, content.type, dateString, 'start_date_select')}
                      />
                      <DatePickerCustom
                        disabled={disabled}
                        style={{ width: '49%', marginTop: '5px' }}
                        disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
                        value={calendar.end_date_select ? moment(calendar.end_date_select) : null}
                        onChange={(date, dateString) => onChangeValue(indexContent, content.type, dateString, 'end_date_select')}
                      />
                    </div>
                  )}
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'agree_term' */}
            {
              content.type === 'agree_term' && (
                <div style={{ marginBottom: '10px' }}>
                  {/* {(agreeTerm.title_require || agreeTerm.require) && */}
                  <div className="ss-message__content--user-agree_to_term-top" style={{ marginBottom: '0px' }}>
                    {agreeTerm.title_require &&
                      <span className="ss-message__content--user-agree_to_term-title">
                        {agreeTerm.title}
                      </span>
                    }
                    <span className="ss-message__content--user-text-input-required">
                      * required
                    </span>
                  </div>
                  {/* } */}
                  {/* agreeTerm: type = 'detail_content' */}
                  {agreeTerm.type === 'detail_content' && (
                    <React.Fragment>
                      <div className="ss-message__content--user-agree_to_term-detail_content">
                        <textarea
                          name="ss-message__content--user-agree_to_term-detail_content"
                          id=""
                          rows="5"
                          value={agreeTerm[agreeTerm.type].content}
                          className="ss-input-value"
                          readOnly
                        ></textarea>
                        <CheckboxCustom
                          disabled={disabled}
                          label={agreeTerm.term}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'isAgree')}
                          value={agreeTerm.isAgree}
                        />
                      </div>
                    </React.Fragment>
                  )}
                  {/* agreeTerm: type = 'post_link_only' */}
                  {agreeTerm.type === 'post_link_only' && (
                    <div>
                      {agreeTerm[agreeTerm.type].map((item, index) => {
                        return <div key={index} className="ss-message__content--user-agree_to_term-post_link_only">
                          <span style={{ marginRight: '8px' }}>{item.title_comment}</span>
                          <a href={item.urls} target="_blank">{item.title}</a>
                          <span style={{ marginLeft: '8px' }}>{item.url_comment}</span>
                        </div>
                      })}
                      <CheckboxCustom
                        disabled={disabled}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'isAgree')}
                        value={agreeTerm.isAgree}
                        label={agreeTerm.term}
                      />
                    </div>
                  )}
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'carousel' */}
            {
              content.type === 'carousel' && (
                <div style={{ marginBottom: '10px' }}>
                  {(carousel.title_require || carousel.isCheckRequire) &&
                    <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                      {carousel.title_require &&
                        <span className="ss-message__content--user-pull_down-title">
                          {carousel.title}
                        </span>
                      }
                      {(carousel.isCheckRequire === 'all_items_require' ||
                        carousel.isCheckRequire === 'require') &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {/* carousel: type = 'default' */}
                  {carousel.type === 'default' && (
                    <div className="sp-carousel-container-preivew">
                      {carousel[carousel.type].contents && carousel[carousel.type].contents.map((itemCarousel, indexCarousel) => {
                        return <div className="sp-carousel-container-block-item" key={indexCarousel}>
                          <div className="sp-carousel-container-block-item-infor">
                            <div className="sp-carousel-preview-img">
                              <img src={itemCarousel.fileUrl} style={{ width: '100%' }} />
                            </div>
                            <div className="sp-carousel-preview-title">
                              {itemCarousel.title}
                            </div>
                            <div className="sp-carousel-preview-sub-title">
                              {itemCarousel.subtitle}
                            </div>
                          </div>
                          <a className="sp-carousel-preview-button" href={itemCarousel.urls} target="_blank">
                            {itemCarousel.buttonTitle || "Select"}
                          </a>
                        </div>
                      })}
                    </div>
                  )}
                </div>
              )
            }
            {/* type == 'credit_card_payment' */}
            {
              content.type === 'credit_card_payment' && (
                <div style={{ marginBottom: '10px' }}>
                  {(creditCardPayment.title_require || creditCardPayment.require) &&
                    <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                      {creditCardPayment.title_require &&
                        <span className="ss-message__content--user-pull_down-title">
                          {creditCardPayment.title}
                        </span>
                      }
                      {(creditCardPayment.require) &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {creditCardPayment.payment_method.map((itemPayment, index, array) => {
                      return <div key={index} style={{width: `${100/array.length - 3}%`}} className="ss-img-list-bank">
                        {dataPaymentMethod.find(item => item.key === itemPayment).value}
                      </div>
                    })}
                  </div>
                  {creditCardPayment.separate_type === false ?
                    <div className="ss-user-setting__item-bottom">
                      <InputNum
                        styleLabel={{ width: '100%' }}
                        className="ss-user-setting-input-limit-character"
                        label="Card number"
                        controls={false}
                        max={9999999999999999}
                        disabled={disabled}
                        style={{ width: '100%', marginLeft: '0px' }}
                        value={creditCardPayment.card_number}
                        placeholder={creditCardPayment.card_number_placeholder}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'card_number')}
                      />
                    </div> :
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ width: '100%' }}>Card number</div>
                      <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type" style={{ width: '100%' }}>
                        <InputNum
                          max={9999}
                          controls={false}
                          style={{ marginLeft: '0px' }}
                          disabled={disabled}
                          className="ss-user-setting-input-limit-character"
                          value={creditCardPayment.card_number1}
                          placeholder={creditCardPayment.card_number_placeholder1}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'card_number1')}
                        />
                        <InputNum
                          max={9999}
                          controls={false}
                          style={{ marginLeft: '7px' }}
                          disabled={disabled}
                          className="ss-user-setting-input-limit-character"
                          value={creditCardPayment.card_number2}
                          placeholder={creditCardPayment.card_number_placeholder2}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'card_number2')}
                        />
                        <InputNum
                          max={9999}
                          controls={false}
                          style={{ marginLeft: '7px' }}
                          disabled={disabled}
                          className="ss-user-setting-input-limit-character"
                          value={creditCardPayment.card_number3}
                          placeholder={creditCardPayment.card_number_placeholder3}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'card_number3')}
                        />
                        <InputNum
                          max={9999}
                          controls={false}
                          style={{ marginLeft: '7px' }}
                          disabled={disabled}
                          className="ss-user-setting-input-limit-character"
                          value={creditCardPayment.card_number4}
                          placeholder={creditCardPayment.card_number_placeholder4}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'card_number4')}
                        />
                      </div>
                    </div>
                  }
                  {creditCardPayment.is_hide_card_name !== true &&
                    <div className="ss-user-setting__item-bottom">
                      <InputCustom
                        styleLabel={{ width: '100%' }}
                        label="Card holder"
                        inline={false}
                        disabled={disabled}
                        value={creditCardPayment.card_holder}
                        placeholder={creditCardPayment.card_holder_placeholder}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'card_holder')}
                      />
                    </div>
                  }
                  <div className="ss-user-setting__item-bottom">
                    <div style={{ width: '100%' }}>Date of expiry</div>
                    {creditCardPayment.type_date_of_expiry === 'ym' &&
                      <div style={{ display: 'flex', width: '100%' }}>
                        <SelectCustom
                          style={{ width: '33%' }}
                          value={creditCardPayment.year}
                          disabled={disabled}
                          placeholder={creditCardPayment.year_placeholder}
                          data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'year')}
                        />
                        <SelectCustom
                          style={{ width: '33%', marginLeft: '10px' }}
                          value={creditCardPayment.month}
                          placeholder={creditCardPayment.month_placeholder}
                          data={dataMonth}
                          disabled={disabled}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'month')}
                        />
                      </div>
                    }
                    {creditCardPayment.type_date_of_expiry === 'my' &&
                      <div style={{ display: 'flex', width: '100%' }}>
                        <SelectCustom
                          style={{ width: '33%' }}
                          value={creditCardPayment.month}
                          placeholder={creditCardPayment.month_placeholder}
                          data={dataMonth}
                          disabled={disabled}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'month')}
                        />
                        <SelectCustom
                          style={{ width: '33%', marginLeft: '10px' }}
                          value={creditCardPayment.year}
                          disabled={disabled}
                          placeholder={creditCardPayment.year_placeholder}
                          data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'year')}
                        />
                      </div>
                    }
                  </div>
                  {creditCardPayment.is_hide_cvc !== true &&
                    <div className="ss-user-setting__item-bottom" style={{ display: 'block' }}>
                      <InputNum
                        style={{ marginLeft: '0px', width: '33%' }}
                        className="ss-user-setting-input-limit-character"
                        max={9999}
                        disabled={disabled}
                        controls={false}
                        label={<span style={{ fontWeight: '400' }}>CVC <img style={{ width: '8%' }} src={cvcIcon} /></span>}
                        value={creditCardPayment.cvc}
                        placeholder={creditCardPayment.cvc_placeholder}
                        onChange={value => onChangeValue(indexContent, content.type, value, 'cvc')}
                      />
                    </div>
                  }
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'capture' */}
            {
              content.type === 'capture' && (
                <div style={{ marginBottom: '10px' }}>
                  <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '-5px' }}>
                    {capture.title_require &&
                      <span className="ss-message__content--user-pull_down-title">
                        {capture.title}
                      </span>
                    }
                    <span className="ss-message__content--user-text-input-required">
                      * required
                    </span>
                  </div>
                  <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                    <InputCustom
                      disabled={disabled}
                      style={{ width: '50%' }}
                      value={capture.value}
                      onChange={value => onChangeValue(indexContent, content.type, value, 'value')}
                    />
                    {console.log(capture)}
                    {new DOMParser().parseFromString(capture.img, "text/xml").innerHTML}
                    <div id={`captcha-${indexMessage}-${indexContent}`} style={{ width: '50%' }} onLoad={loadCaptcha(indexContent)}></div>
                  </div>
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                    </div>
                  }
                </div>
              )
            }
            {/* type == 'product_purchase' */}
            {
              content.type === 'product_purchase' && (
                <div style={{ marginBottom: '10px' }}>
                  {(productPurchase.title_require || productPurchase.require) &&
                    <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                      {productPurchase.title_require &&
                        <span className="ss-message__content--user-checkbox-title">
                          {productPurchase.title}
                        </span>
                      }
                      {productPurchase.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div>
                    {productPurchase.type === 'text_with_thumbnail_image' && (
                      productPurchase.multiple_item_purchase ? (
                        <React.Fragment>
                          <Checkbox.Group
                            className="ss-user-preivew-product-purchase-checkbox-group ss-user-preivew-product-purchase-style-width"
                            style={{ width: "100%" }}
                            disabled={disabled}
                            onChange={(value) => console.log(value)}
                            value={productPurchase.initial_selection}
                          >
                            {productPurchase.products.map((itemProduct, indexProduct) => {
                              return <React.Fragment key={indexProduct}>
                                <Checkbox value={itemProduct.id}
                                  onChange={() => {
                                    let selectArr = [...productPurchase.initial_selection];
                                    if (selectArr.includes(itemProduct.id)) {
                                      selectArr = [...selectArr.filter(item => item !== itemProduct.id)];
                                      console.log(selectArr, itemProduct.id, 'cehckkkkk');
                                    } else {
                                      selectArr.push(itemProduct.id);
                                    }
                                    onChangeValue(indexContent, content.type, selectArr, 'initial_selection');
                                    // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                  }}>
                                  <div className="ss-user-overview-product-purchase-container">
                                    <div className="ss-user-preivew-product-purchase-img">
                                      <img src={itemProduct.img_url} />
                                    </div>
                                    {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                      <div className="ss-user-preivew-product-purchase-infor">
                                        {productPurchase.product_name_display && itemProduct.title &&
                                          <div className="ss-user-overview-product-purchase-infor-title">
                                            {itemProduct.title}
                                          </div>
                                        }
                                        {productPurchase.product_number_display && itemProduct.item_number &&
                                          <div className="ss-user-overview-product-purchase-infor-item-number">
                                            Item number: {itemProduct.item_number}
                                          </div>
                                        }
                                        {itemProduct.price_display_custom ?
                                          <div className="ss-user-overview-product-purchase-infor-price">
                                            {itemProduct.price_display_custom}
                                          </div> :
                                          productPurchase.price_display && itemProduct.item_price &&
                                          <div className="ss-user-overview-product-purchase-infor-price">
                                            Price: {itemProduct.item_price} 円
                                          </div>
                                        }
                                        {(productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) &&
                                          <InputNum
                                            value={itemProduct.quantity_select}
                                            onChange={value => onChangeValue(indexContent, content.type, value, 'products', indexProduct, 'quantity_select')}
                                            controls={false}
                                            min={1}
                                            max={itemProduct.quantity_limit}
                                            addonAfter={<div
                                              style={{ padding: '4px 11px' }}
                                              onClick={() => {
                                                if (itemProduct.quantity_select < itemProduct.quantity_limit) {
                                                  onChangeValue(indexContent, content.type, itemProduct.quantity_select + 1, 'products', indexProduct, 'quantity_select')
                                                }
                                              }}
                                            >+</div>}
                                            addonBefore={<div
                                              style={{ padding: '4px 11px' }}
                                              onClick={() => {
                                                if (itemProduct.quantity_select > 1) {
                                                  onChangeValue(indexContent, content.type, itemProduct.quantity_select - 1, 'products', indexProduct, 'quantity_select')
                                                }
                                              }}
                                            >-</div>}
                                          />
                                        }
                                        {/* {productPurchase.multiple_item_purchase &&
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          Multiple item purchase
                                        </div>
                                      } */}
                                      </div>
                                    }
                                  </div>
                                </Checkbox>
                              </React.Fragment>
                            })}
                          </Checkbox.Group>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Radio.Group
                            className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                            style={{ width: "100%" }}
                            disabled={disabled}
                            onChange={(value) => console.log(value)}
                            value={productPurchase.initial_selection[0]}
                          >
                            {productPurchase.products.map((itemProduct, indexProduct) => {
                              return <Radio value={itemProduct.id} key={indexProduct}
                                onChange={() => {
                                  let selectArr = [...productPurchase.initial_selection];
                                  let dataValue;
                                  if (selectArr.includes(itemProduct.id)) {
                                    dataValue = [];
                                  } else {
                                    dataValue = [itemProduct.id];
                                  }
                                  onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                }}
                              >
                                <div className="ss-user-overview-product-purchase-container">
                                  <div className="ss-user-preivew-product-purchase-img">
                                    <img src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                    <div className="ss-user-preivew-product-purchase-infor">
                                      {productPurchase.product_name_display && itemProduct.title &&
                                        <div className="ss-user-overview-product-purchase-infor-title">
                                          {itemProduct.title}
                                        </div>
                                      }
                                      {productPurchase.product_number_display && itemProduct.item_number &&
                                        <div className="ss-user-overview-product-purchase-infor-item-number">
                                          Item number: {itemProduct.item_number}
                                        </div>
                                      }
                                      {itemProduct.price_display_custom ?
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          {itemProduct.price_display_custom}
                                        </div> :
                                        productPurchase.price_display && itemProduct.item_price &&
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          Price: {itemProduct.item_price} 円
                                        </div>
                                      }
                                      {/* {productPurchase.multiple_item_purchase &&
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          Multiple item purchase
                                        </div>
                                      } */}
                                      {(productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) &&
                                        <InputNum
                                          value={itemProduct.quantity_select}
                                          onChange={value => onChangeValue(indexContent, content.type, value, 'products', indexProduct, 'quantity_select')}
                                          controls={false}
                                          min={1}
                                          max={itemProduct.quantity_limit}
                                          addonAfter={<div
                                            style={{ padding: '4px 11px' }}
                                            onClick={() => {
                                              if (itemProduct.quantity_select < itemProduct.quantity_limit) {
                                                onChangeValue(indexContent, content.type, itemProduct.quantity_select + 1, 'products', indexProduct, 'quantity_select')
                                              }
                                            }}
                                          >+</div>}
                                          addonBefore={<div
                                            style={{ padding: '4px 11px' }}
                                            onClick={() => {
                                              if (itemProduct.quantity_select > 1) {
                                                onChangeValue(indexContent, content.type, itemProduct.quantity_select - 1, 'products', indexProduct, 'quantity_select')
                                              }
                                            }}
                                          >-</div>}
                                        />
                                      }
                                    </div>
                                  }
                                </div>
                              </Radio>
                            })}
                          </Radio.Group>
                        </React.Fragment>
                      )
                    )}
                    {productPurchase.type === 'text_with_image' && (
                      productPurchase.multiple_item_purchase ? (
                        <React.Fragment>
                          <Checkbox.Group
                            className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-preivew-product-purchase-style-width"
                            style={{ width: "100%" }}
                            disabled={disabled}
                            onChange={(value) => console.log(value)}
                            value={productPurchase.initial_selection}
                          >
                            {productPurchase.products.map((itemProduct, indexProduct) => {
                              return <Checkbox key={indexProduct} value={itemProduct.id}
                                onChange={() => {
                                  let selectArr = [...productPurchase.initial_selection];
                                  if (selectArr.includes(itemProduct.id)) {
                                    selectArr = [...selectArr.filter(item => item !== itemProduct.id)];
                                    console.log(selectArr, itemProduct.id, 'cehckkkkk');
                                  } else {
                                    selectArr.push(itemProduct.id);
                                  }
                                  onChangeValue(indexContent, content.type, selectArr, 'initial_selection');
                                  // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                }}>
                                <div className="ss-user-overview-product-purchase-container-type-text_image">
                                  <div className="ss-user-overview-product-purchase-img-type-text_image">
                                    <img src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                    <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                      {productPurchase.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchase.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchase.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                                    </div>
                                  }
                                  {(productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) &&
                                    <InputNum
                                      value={itemProduct.quantity_select}
                                      onChange={value => onChangeValue(indexContent, content.type, value, 'products', indexProduct, 'quantity_select')}
                                      controls={false}
                                      min={1}
                                      style={{ width: '50%' }}
                                      max={itemProduct.quantity_limit}
                                      addonAfter={<div
                                        style={{ padding: '4px 11px' }}
                                        onClick={() => {
                                          if (itemProduct.quantity_select < itemProduct.quantity_limit) {
                                            onChangeValue(indexContent, content.type, itemProduct.quantity_select + 1, 'products', indexProduct, 'quantity_select')
                                          }
                                        }}
                                      >+</div>}
                                      addonBefore={<div
                                        style={{ padding: '4px 11px' }}
                                        onClick={() => {
                                          if (itemProduct.quantity_select > 1) {
                                            onChangeValue(indexContent, content.type, itemProduct.quantity_select - 1, 'products', indexProduct, 'quantity_select')
                                          }
                                        }}
                                      >-</div>}
                                    />
                                  }
                                </div>
                              </Checkbox>
                            })}
                          </Checkbox.Group>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Radio.Group
                            className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                            style={{ width: "100%" }}
                            disabled={disabled}
                            onChange={(e) => {
                              let selectArr = [...productPurchase.initial_selection];
                              let dataValue;
                              console.log(selectArr, e.target.value, selectArr.includes(e.target.value))
                              if (selectArr.includes(e.target.value)) {
                                dataValue = [];
                              } else {
                                dataValue = [e.target.value];
                              }
                              onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                            }}
                            value={productPurchase.initial_selection[0]}
                          >
                            {productPurchase.products.map((itemProduct, indexProduct) => {
                              return <Radio value={itemProduct.id} key={indexProduct}>
                                <div className="ss-user-overview-product-purchase-container-type-text_image">
                                  <div className="ss-user-overview-product-purchase-img-type-text_image">
                                    <img src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                    <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                      {productPurchase.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchase.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchase.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                                    </div>
                                  }
                                  {(productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) &&
                                    <InputNum
                                      value={itemProduct.quantity_select}
                                      onChange={value => onChangeValue(indexContent, content.type, value, 'products', indexProduct, 'quantity_select')}
                                      controls={false}
                                      min={1}
                                      style={{ width: '50%' }}
                                      max={itemProduct.quantity_limit}
                                      addonAfter={<div
                                        style={{ padding: '4px 11px' }}
                                        onClick={() => {
                                          if (itemProduct.quantity_select < itemProduct.quantity_limit) {
                                            onChangeValue(indexContent, content.type, itemProduct.quantity_select + 1, 'products', indexProduct, 'quantity_select')
                                          }
                                        }}
                                      >+</div>}
                                      addonBefore={<div
                                        style={{ padding: '4px 11px' }}
                                        onClick={() => {
                                          if (itemProduct.quantity_select > 1) {
                                            onChangeValue(indexContent, content.type, itemProduct.quantity_select - 1, 'products', indexProduct, 'quantity_select')
                                          }
                                        }}
                                      >-</div>}
                                    />
                                  }
                                </div>
                              </Radio>
                            })}
                          </Radio.Group>
                        </React.Fragment>
                      )
                    )}
                    {productPurchase.type === 'consume_api_response' && (
                      <>
                      </>
                    )}
                    {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                      <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                        {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                      </div>
                    }
                  </div>
                </div>
              )
            }
            {/* type == 'product_purchase_radio_button' */}
            {
              content.type === 'product_purchase_radio_button' && (
                <div style={{ marginBottom: '10px' }}>
                  {(productPurchaseRadioButton.title_require || productPurchaseRadioButton.require) &&
                    <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                      {productPurchaseRadioButton.title_require &&
                        <span className="ss-message__content--user-checkbox-title">
                          {productPurchaseRadioButton.title}
                        </span>
                      }
                      {productPurchaseRadioButton.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div>
                    {productPurchaseRadioButton.type === 'text_with_thumbnail_image' && (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
                          onChange={(value) => console.log(value)}
                          value={productPurchaseRadioButton.initial_selection[0]}
                        >
                          {productPurchaseRadioButton.products.map((itemProduct, indexProduct) => {
                            return <Radio value={itemProduct.id} key={indexProduct}
                              onChange={() => {
                                let selectArr = [...productPurchaseRadioButton.initial_selection];
                                let dataValue;
                                if (selectArr.includes(itemProduct.id)) {
                                  dataValue = [];
                                } else {
                                  dataValue = [itemProduct.id];
                                }
                                onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                onClickNext();
                              }}
                            >
                              <div className="ss-user-overview-product-purchase-container">
                                <div className="ss-user-preivew-product-purchase-img">
                                  <img src={itemProduct.img_url} />
                                </div>
                                {(productPurchaseRadioButton.product_name_display || productPurchaseRadioButton.price_display || productPurchaseRadioButton.product_number_display) &&
                                  <div className="ss-user-preivew-product-purchase-infor">
                                    {productPurchaseRadioButton.product_name_display && itemProduct.title &&
                                      <div className="ss-user-overview-product-purchase-infor-title">
                                        {itemProduct.title}
                                      </div>
                                    }
                                    {productPurchaseRadioButton.product_number_display && itemProduct.item_number &&
                                      <div className="ss-user-overview-product-purchase-infor-item-number">
                                        Item number: {itemProduct.item_number}
                                      </div>
                                    }
                                    {itemProduct.price_display_custom ?
                                      <div className="ss-user-overview-product-purchase-infor-price">
                                        {itemProduct.price_display_custom}
                                      </div> :
                                      productPurchaseRadioButton.price_display && itemProduct.item_price &&
                                      <div className="ss-user-overview-product-purchase-infor-price">
                                        Price: {itemProduct.item_price} 円
                                      </div>
                                    }
                                    {/* {productPurchaseRadioButton.multiple_item_purchase &&
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          Multiple item purchase
                                        </div>
                                      } */}
                                  </div>
                                }
                              </div>
                            </Radio>
                          })}
                        </Radio.Group>
                      </React.Fragment>
                    )}
                    {productPurchaseRadioButton.type === 'text_with_image' && (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={productPurchaseRadioButton.initial_selection[0]}
                        >
                          {productPurchaseRadioButton.products.map((itemProduct, indexProduct) => {
                            return <Radio value={itemProduct.id} key={indexProduct}
                              onChange={() => {
                                let selectArr = [...productPurchaseRadioButton.initial_selection];
                                let dataValue;
                                if (selectArr.includes(itemProduct.id)) {
                                  dataValue = [];
                                } else {
                                  dataValue = [itemProduct.id];
                                }
                                onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                onClickNext();
                              }}>
                              <div className="ss-user-overview-product-purchase-container-type-text_image">
                                <div className="ss-user-overview-product-purchase-img-type-text_image">
                                  <img src={itemProduct.img_url} />
                                </div>
                                {(productPurchaseRadioButton.product_name_display || productPurchaseRadioButton.price_display || productPurchaseRadioButton.product_number_display) &&
                                  <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                    {productPurchaseRadioButton.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchaseRadioButton.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchaseRadioButton.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                                  </div>
                                }
                              </div>
                            </Radio>
                          })}
                        </Radio.Group>
                      </React.Fragment>
                    )}
                    {productPurchaseRadioButton.type === 'consume_api_response' && (
                      <>
                      </>
                    )}
                    {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                      <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                        {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                      </div>
                    }
                  </div>
                </div>
              )
            }
            {/* type == 'slider' */}
            {
              content.type === 'slider' && (
                <div style={{ marginBottom: '10px' }}>
                  {(slider.title_require || slider.require) &&
                    <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                      {slider.title_require &&
                        <span className="ss-message__content--user-checkbox-title">
                          {slider.title}
                        </span>
                      }
                      {slider.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  <div>
                    <Slider
                      disabled={disabled}
                      value={slider.value}
                      onChange={value => onChangeValue(indexContent, content.type, value, 'value')}
                      trackStyle={{ backgroundColor: slider.color || '#2C75F0' }}
                      min={slider.type === 'discrete_type' ? parseInt(slider.min_value) : 0}
                      max={slider.type === 'discrete_type' ? parseInt(slider.max_value) : 10}
                      dots={slider.type === 'discrete_type'}
                      marks={
                        slider.type === 'discrete_type' ?
                          {
                            [slider.min_value]: slider.min_label,
                            [slider.max_value]: slider.max_label
                          } :
                          {
                            0: slider.min_label,
                            10: slider.max_label
                          }
                      }
                    />
                    {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                      <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                        {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                      </div>
                    }
                  </div>
                </div>
              )
            }
            {/* type == 'card_payment_radio_button' */}
            {
              content.type === 'card_payment_radio_button' && (
                <div style={{ marginBottom: '10px' }}>
                  {(cardPaymentRadioButton.title_require || cardPaymentRadioButton.require) &&
                    <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                      {cardPaymentRadioButton.title_require &&
                        <span className="ss-message__content--user-text-input-title">
                          {cardPaymentRadioButton.title}
                        </span>
                      }
                      {cardPaymentRadioButton.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {console.log(cardPaymentRadioButton, 'checkkkkk')}
                  {cardPaymentRadioButton.type === 'default' &&
                    <Radio.Group
                      style={{ width: "100%", fontSize: '14px' }}
                      onChange={(value) => console.log(value)}
                      disabled={disabled}
                      value={cardPaymentRadioButton.initial_selection}
                    >
                      {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
                        console.log(itemPayment)
                        return <Radio value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%' }}
                          onChange={() => {
                            let dataValue;
                            if (cardPaymentRadioButton.initial_selection !== itemPayment.id) {
                              dataValue = itemPayment.id;
                            } else {
                              dataValue = "";
                            }
                            console.log(cardPaymentRadioButton.card_linked_setting, itemPayment.id)
                            onChangeValue(indexContent, content.type, dataValue, 'initial_selection');

                            if (cardPaymentRadioButton.card_linked_setting === dataValue) {
                              onChangeValue(indexContent, content.type, true, 'is_display_card_payment');
                              displayButtonNext(true);
                            } else {
                              displayButtonNext(false);
                              onChangeValue(indexContent, content.type, false, 'is_display_card_payment');
                              onClickNext();
                            }
                          }}>
                          {itemPayment.text}
                        </Radio>
                      })}
                    </Radio.Group>
                  }
                  {cardPaymentRadioButton.type === 'customized_style' &&
                    <Radio.Group
                      style={{ width: "100%", fontSize: '14px' }}
                      onChange={(value) => console.log(value)}
                      disabled={disabled}
                      value={cardPaymentRadioButton.initial_selection}
                      buttonStyle="solid"
                    >
                      {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
                        console.log(itemPayment)
                        return <Radio.Button value={itemPayment.id} key={indexPayment} style={{ marginBottom: '5px', padding: '5px', width: '100%', textAlign: 'center', lineHeight: '22px' }}
                          onChange={() => {
                            let dataValue;
                            if (cardPaymentRadioButton.initial_selection !== itemPayment.id) {
                              dataValue = itemPayment.id;
                            } else {
                              dataValue = "";
                            }
                            console.log(cardPaymentRadioButton.card_linked_setting, itemPayment.id)
                            onChangeValue(indexContent, content.type, dataValue, 'initial_selection');

                            if (cardPaymentRadioButton.card_linked_setting !== dataValue) {
                              onClickNext();
                            }
                          }}>
                          {itemPayment.text}
                        </Radio.Button>
                      })}
                    </Radio.Group>
                  }
                  {cardPaymentRadioButton.type === 'picture_radio' && cardPaymentRadioButton.radio_contents_img &&
                    cardPaymentRadioButton.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => {
                      return <div key={indexPaymentImg} style={{ color: '#6789A6' }}>
                        <Radio.Group
                          disabled={disabled}
                          style={{ width: "100%", fontSize: '14px', display: 'flex' }}
                          className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                          onChange={(value) => console.log(value)}
                          value={cardPaymentRadioButton.initial_selection_picture}
                        >
                          {itemPaymentImg.contents && itemPaymentImg.contents.map((itemPaymentContent, indexPaymentContent) => {
                            return <Radio value={`${itemPaymentImg.id}-${itemPaymentContent.id}`} key={indexPaymentContent} style={{ marginRight: '0px' }}
                              onChange={() => {
                                let dataValue;
                                if (cardPaymentRadioButton.initial_selection_picture !== `${itemPaymentImg.id}-${itemPaymentContent.id}`) {
                                  dataValue = `${itemPaymentImg.id}-${itemPaymentContent.id}`;
                                } else {
                                  dataValue = "";
                                }
                                onChangeValue(indexContent, content.type, dataValue, 'initial_selection_picture');
                                if (cardPaymentRadioButton.card_linked_setting_picture !== dataValue) {
                                  console.log(cardPaymentRadioButton.card_linked_setting_picture !== dataValue, cardPaymentRadioButton.card_linked_setting_picture, dataValue)
                                  onClickNext();
                                }
                              }}>
                              <img src={itemPaymentContent.file_url}></img>
                              <div style={{ textAlign: 'center', fontSize: '14px', color: '#6789A6', fontWeight: '700' }}>{itemPaymentContent.text}</div>
                            </Radio>
                          })}
                        </Radio.Group>
                      </div>
                    })
                  }
                  {console.log(cardPaymentRadioButton.card_linked_setting, cardPaymentRadioButton.initial_selection, cardPaymentRadioButton.card_linked_setting_picture, cardPaymentRadioButton.initial_selection_picture)}
                  {(cardPaymentRadioButton.type !== "picture_radio" ? (cardPaymentRadioButton.card_linked_setting && cardPaymentRadioButton.card_linked_setting === cardPaymentRadioButton.initial_selection) : (cardPaymentRadioButton.card_linked_setting_picture && cardPaymentRadioButton.card_linked_setting_picture === cardPaymentRadioButton.initial_selection_picture)) &&
                    <React.Fragment>
                      {cardPaymentRadioButton.separate_type === false ?
                        <div className="ss-user-setting__item-bottom">
                          <InputCustom
                            className="ss-user-setting-input-overview"
                            styleLabel={{ width: '100%' }}
                            label="Card number"
                            inline={false}
                            value={cardPaymentRadioButton.card_number}
                            onChange={value => onChangeValue(indexContent, content.type, value, 'card_number')}
                            disabled={disabled}
                            placeholder={cardPaymentRadioButton.card_number_placeholder}
                          />
                        </div> :
                        <div className="ss-user-setting__item-bottom">
                          <div style={{ width: '100%' }}>Card number</div>
                          <div style={{ width: '100%' }} className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                            <InputCustom
                              disabled={disabled}
                              value={cardPaymentRadioButton.card_number1}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'card_number1')}
                              placeholder={cardPaymentRadioButton.card_number_placeholder1}
                            />
                            <InputCustom
                              value={cardPaymentRadioButton.card_number2}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'card_number2')}
                              disabled={disabled}
                              placeholder={cardPaymentRadioButton.card_number_placeholder2}
                            />
                            <InputCustom
                              value={cardPaymentRadioButton.card_number3}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'card_number3')}
                              disabled={disabled}
                              placeholder={cardPaymentRadioButton.card_number_placeholder3}
                            />
                            <InputCustom
                              value={cardPaymentRadioButton.card_number4}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'card_number4')}
                              disabled={disabled}
                              placeholder={cardPaymentRadioButton.card_number_placeholder4}
                            />
                          </div>
                        </div>
                      }
                      {cardPaymentRadioButton.is_hide_card_name === false &&
                        <div className="ss-user-setting__item-bottom">
                          <InputCustom
                            className="ss-user-setting-input-overview"
                            styleLabel={{ width: '100%' }}
                            label="Card holder"
                            inline={false}
                            disabled={disabled}
                            value={cardPaymentRadioButton.card_holder}
                            onChange={value => onChangeValue(indexContent, content.type, value, 'card_holder')}
                            placeholder={cardPaymentRadioButton.card_holder_placeholder}
                          />
                        </div>
                      }
                      <div className="ss-user-setting__item-bottom">
                        <div style={{ width: '100%' }}>Date of expiry</div>
                        {cardPaymentRadioButton.type_date_of_expiry === 'ym' &&
                          <div style={{ display: 'flex', width: '100%' }}>
                            <SelectCustom
                              style={{ width: '33%' }}
                              value={cardPaymentRadioButton.year}
                              disabled={disabled}
                              placeholder={"year"}
                              data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'year')}
                            />
                            <SelectCustom
                              style={{ width: '33%', marginLeft: '10px' }}
                              value={cardPaymentRadioButton.month}
                              placeholder={"month"}
                              data={dataMonth}
                              disabled={disabled}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'month')}
                            />
                          </div>
                        }
                        {cardPaymentRadioButton.type_date_of_expiry === 'my' &&
                          <div style={{ display: 'flex', width: '100%' }}>
                            <SelectCustom
                              style={{ width: '33%' }}
                              value={cardPaymentRadioButton.month}
                              placeholder={"month"}
                              data={dataMonth}
                              disabled={disabled}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'month')}
                            />
                            <SelectCustom
                              style={{ width: '33%', marginLeft: '10px' }}
                              value={cardPaymentRadioButton.year}
                              disabled={disabled}
                              placeholder={"year"}
                              data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'year')}
                            />
                          </div>
                        }
                      </div>
                      {cardPaymentRadioButton.is_hide_cvc === false &&
                        <div className="ss-user-setting__item-bottom">
                          <InputCustom
                            className="ss-user-setting-input-overview"
                            styleLabel={{ width: '100%' }}
                            label="CVC"
                            inline={false}
                            disabled={disabled}
                            value={cardPaymentRadioButton.cvc}
                            onChange={value => onChangeValue(indexContent, content.type, value, 'cvc')}
                            placeholder={cardPaymentRadioButton.cvc_placeholder}
                          />
                        </div>
                      }
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`] &&
                        <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                          {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}`]}
                        </div>
                      }
                    </React.Fragment>
                  }
                </div>
              )
            }
            {/* type == 'label_no_transition' */}
            {
              content.type === 'label_no_transition' && (
                <div style={{ marginBottom: '10px' }}>
                  {labelNoTransition.value}
                </div>
              )
            }
          </React.Fragment>
        )
      })}
    </div >
  )
}

export default Preview