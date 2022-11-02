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

let dataHourFixed = [];
for (let i = 1; i <= 24; i++) {
  dataHourFixed.push({
    key: i + '',
    value: i + ''
  });
}

let dataMinutes = [];
for (let i = 1; i <= 59; i++) {
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

function Preview({ onOpenPreview, isOpen, scenarioId }) {

  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [botInfor, setBotInfor] = useState();
  const [dataMessages, setDataMessages] = useState([]);
  const [indexMessageRender, setIndexMessageRender] = useState(0);
  const [renderMessageArr, setRenderMessageArr] = useState([]);
  const [messageBot, setMessageBot] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/api/v1/managements/chatbots/${botId}`).then(res => {
      console.log(res.data);
      if (res.data.code == 1) {
        setBotInfor(res.data.data);
      }
    }).catch(err => console.log(err));
  }, [])

  useEffect(() => {
    if (scenarioId) {
      api.get(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/preview`).then(res => {
        console.log(res.data);
        if (res.data.code == 1) {
          let messageArr = [...res.data.data?.conversation?.messages];
          console.log(messageArr, 'check messageArr');
          setDataMessages(messageArr);
          let renderMessage = [];
          let index;
          let delayRender;

          for (let i = 0; i < messageArr.length; i++) {
            if (messageArr[0].belong_to === 'bot') {
              console.log(messageArr[i], 'check messageArr[i]');
              if (messageArr[i]?.message_content[0].type === 'delay') {
                let promise = new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    resolve();
                  }, (parseInt(messageArr[i]?.message_content[0].delay.content.split(' ')[0]) * 1000 + (i + 1) * 1000) || 2000);
                });
                index = i;
                console.log(parseInt(messageArr[i]?.message_content[0].delay.content.split(' ')[0]) * 1000 + (i + 1) * 1000)
                // promise.then(data => {
                //   console.log(data, 'check dataaaa1');
                //   renderMessage.push(data);
                //   setRenderMessageArr([
                //     ...renderMessage
                //   ]);
                // })
              } else if (messageArr[i].belong_to !== 'bot') {
                let promise = new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    resolve({ ...messageArr[i] });
                  }, (i + 1) * 1000);
                })
                promise.then(data => {
                  renderMessage.push(data);
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                })
                index = i;
                break;
              } else {
                let promise = new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    resolve({ ...messageArr[i] });
                  }, (i + 1) * 1000);
                })
                promise.then(data => {
                  console.log(data, 'check dataaaa3');
                  renderMessage.push(data);
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                })
                index = i;
              }
            } else if (messageArr[0].belong_to === 'user') {
              if (messageArr[i].belong_to !== 'user') {
                let promise = new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    resolve({ ...messageArr[i] });
                  }, (i + 1) * 1000);
                })
                promise.then(data => {
                  console.log(data, 'check dataaaa4');
                  renderMessage.push(data);
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                })
                index = i;
              } else {
                let promise = new Promise((resolve) => {
                  return delayRender = setTimeout(() => {
                    resolve({ ...messageArr[i] });
                  }, (i + 1) * 1000);
                })
                promise.then(data => {
                  console.log(data, 'check dataaaa5');
                  renderMessage.push(data);
                  setRenderMessageArr([
                    ...renderMessage
                  ]);
                })
                index = i;
                break;
              }
            }
          }

          console.log(renderMessage);

          setIndexMessageRender(index);
          // setRenderMessageArr(renderMessage);
          return () => {
            clearTimeout(delayRender);
          }
        }
      }).catch(err => console.log(err));
    }
  }, [scenarioId])

  // useEffect(() => {
  //   console.log(indexMessageRender, 'chcek indexMessageRender', renderMessageArr)
  //   if (indexMessageRender && indexMessageRender !== 0) {

  //   }
  // }, [indexMessageRender])

  const stringNullOrEmpty = (string) => {
    if (string === undefined || string === null || string === "") return true
    return false
  }

  const handleValidateField = () => {
    let contentArr = [...dataMessages[indexMessageRender].message_content];
    let isValid = true;
    let errors = {};
    let isValidSum = true;

    let messageError = "These are required fields."
    for (let i = 0; i < contentArr.length; i++) {
      let contentType = contentArr[i][contentArr[i].type];
      if (contentType.require) {
        console.log(contentType)
        if (contentType.type === 'text') {
          if (contentType[contentType.type].isSplitInput) {
            if (stringNullOrEmpty(contentType[contentType.type].valueLeft) || stringNullOrEmpty(contentType[contentType.type].valueRight)) {
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            isValid = false;
          }
        } else if (contentType.type === 'phone_number') {
          if (contentType[contentType.type].withHyphen) {
            if (stringNullOrEmpty(contentType[contentType.type].value1) || stringNullOrEmpty(contentType[contentType.type].value2)) {
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            isValid = false;
          }
        } else if (contentType.type === 'email_confirmation' || contentType.type === 'password_confirmation') {
          if (stringNullOrEmpty(contentType[contentType.type].value) || stringNullOrEmpty(contentType[contentType.type].valueConfirm)) {
            isValid = false;
          }
        } else if (contentType.type === 'customization') {
          if (contentType[contentType.type].is_comment) {
            if (stringNullOrEmpty(contentType[contentType.type].valueLeft) || stringNullOrEmpty(contentType[contentType.type].valueRight)) {
              isValid = false;
            }
          } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
            isValid = false;
          }
        } else if (contentType.type === 'time_hm') {
          if (stringNullOrEmpty(contentType[contentType.type].valueHour) || stringNullOrEmpty(contentType[contentType.type].valueMinute)) {
            isValid = false;
          }
        } else if (contentType.type === 'date_ymd'
          || contentType.type === 'dob_ymd') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear) || stringNullOrEmpty(contentType[contentType.type].valueMonth)
            || stringNullOrEmpty(contentType[contentType.type].valueDay)) {
            isValid = false;
          }
        } else if (contentType.type === 'date_md') {
          if (stringNullOrEmpty(contentType[contentType.type].valueMonth) || stringNullOrEmpty(contentType[contentType.type].valueDay)) {
            isValid = false;
          }
        } else if (contentType.type === 'date_ym'
          || contentType.type === 'dob_ym') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear) || stringNullOrEmpty(contentType[contentType.type].valueMonth)) {
            isValid = false;
          }
        } else if (contentType.type === 'date_ymd_hm') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear)
            || stringNullOrEmpty(contentType[contentType.type].valueMonth)
            || stringNullOrEmpty(contentType[contentType.type].valueDay)
            || stringNullOrEmpty(contentType[contentType.type].valueHour)
            || stringNullOrEmpty(contentType[contentType.type].valueMinutes)) {
            isValid = false;
          }
        } else if (contentType.type === 'timezone_from_to') {
          if (stringNullOrEmpty(contentType[contentType.type].valueHour1)
            || stringNullOrEmpty(contentType[contentType.type].valueMinutes1)
            || stringNullOrEmpty(contentType[contentType.type].valueHour2)
            || stringNullOrEmpty(contentType[contentType.type].valueMinutes2)) {
            isValid = false;
          }
        } else if (contentType.type === 'period_from_to') {
          if (stringNullOrEmpty(contentType[contentType.type].valueYear1)
            || stringNullOrEmpty(contentType[contentType.type].valueMonth1)
            || stringNullOrEmpty(contentType[contentType.type].valueDay1)
            || stringNullOrEmpty(contentType[contentType.type].valueYear2)
            || stringNullOrEmpty(contentType[contentType.type].valueMonth2)
            || stringNullOrEmpty(contentType[contentType.type].valueDay2)) {
            isValid = false;
          }
        } else if (contentType.type === 'up_to_municipality') {
          if (stringNullOrEmpty(contentType[contentType.type].prefecture)
            || stringNullOrEmpty(contentType[contentType.type].city)) {
            isValid = false;
          }
        } else if (contentArr[i].type === 'zip_code_address') {
          if (contentType.post_code) {
            if (contentType.split_postal_code) {
              if (stringNullOrEmpty(contentType.value_post_code_left)
                || stringNullOrEmpty(contentType.value_post_code_right)) {
                isValid = false;
              }
            } else if (stringNullOrEmpty(contentType.value_post_code)) {
              isValid = false;
            }
          }
          if (contentType.prefecture && stringNullOrEmpty(contentType.value_prefecture)) {
            isValid = false;
          }
          if (contentType.municipality && stringNullOrEmpty(contentType.value_municipality)) {
            isValid = false;
          }
          if (contentType.address && stringNullOrEmpty(contentType.value_address)) {
            isValid = false;
          }
          if (contentType.building_name && stringNullOrEmpty(contentType.value_building_name)) {
            isValid = false;
          }
          if (isValid === false) {
            errors[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValid = true;
            isValidSum = false;
          }
        } else if (contentArr[i].type === 'attaching_file') {

        } else if (contentArr[i].type === 'agree_term') {
          if (stringNullOrEmpty(contentType.isAgree) || contentType.isAgree === false) {
            errors[`message${indexMessageRender}_content${i}_${contentArr[i].type}`] = messageError;
            isValidSum = false;
          }
        } else if (stringNullOrEmpty(contentType[contentType.type].value)) {
          isValid = false;
        }
      }
      if (!isValid) {
        errors[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = messageError;
        isValidSum = false;
      } else {
        errors[`message${indexMessageRender}_content${i}_${contentArr[i].type}_${contentType.type}`] = '';
      }
      isValid = true;
    }
    // if (!isValid) {
    //   errors[`error_${indexMessageRender}`] = 'These are required fields.';
    // } else {
    //   errors[`error_${indexMessageRender}`] = '';
    // }    
    console.log(errors)
    setErrors(errors);
    return isValidSum;
  }

  const onClickNext = (indexMessage) => {
    if (!handleValidateField()) {
      return;
    }
    renderMessageArr[indexMessage].disabled = true;
    let renderMessage = [...renderMessageArr];
    let delayRender;
    let index;

    console.log(dataMessages, indexMessage, indexMessageRender);
    if (!dataMessages[indexMessageRender + 1]) return;
    if (dataMessages[indexMessageRender + 1].belong_to === 'bot') {
      for (let i = indexMessageRender + 1; i < dataMessages.length; i++) {
        if (dataMessages[i].belong_to === 'bot') {
          let promise = new Promise((resolve) => {
            return delayRender = setTimeout(() => {
              resolve({ ...dataMessages[i] });
            }, (i - indexMessageRender) * 1000);
          })
          promise.then(data => {
            console.log(data, 'check dataaaa2');
            renderMessage.push(data);
            setRenderMessageArr([
              ...renderMessage
            ]);
          })
          index = i;
        } else if (dataMessages[i].belong_to === 'user') {
          console.log(dataMessages[i], i - indexMessageRender)
          let promise = new Promise((resolve) => {
            return delayRender = setTimeout(() => {
              resolve({ ...dataMessages[i] });
            }, (i - indexMessageRender) * 1000);
          })
          promise.then(data => {
            console.log(data, 'check dataaaa2');
            renderMessage.push(data);
            setRenderMessageArr([
              ...renderMessage
            ]);
          })
          index = i;
          break;
        }
      }
      console.log(renderMessage, ' check dataRender');
      setIndexMessageRender(index);
      setRenderMessageArr([
        ...renderMessage
      ]);
    } else {
      setRenderMessageArr([
        ...renderMessage,
        dataMessages[indexMessageRender + 1]
      ]);
      setIndexMessageRender(indexMessageRender + 1);
    }

    // clearTimeout(delayRender);

    // renderMessageArr
  }

  const onChangeValue = (indexContent, contentType, value, field, subFiled) => {
    if (subFiled) {
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
    setDataMessages([...dataMessages]);
  }

  return (
    scenarioId &&
    <React.Fragment>
      <div id="cp-container" className="cp-container">
        <div id="cp-header" className="cp-header" onClick={() => onOpenPreview(!isOpen)}>
          <div className="cp-header-left">
            <div className="cp-header-left-avatar cp-avatar">
              <img src={"https://ec-chatbot-test1.com/" + botInfor?.icon?.url} />
            </div>
            <div className="cp-header-left-label">
              <div className="cp-header-left-label-sub-title">{botInfor?.subtitle}</div>
              <div className="cp-header-left-label-title">{botInfor?.title}</div>
            </div>
          </div>
          <div className="cp-header-right">
            <div className="cp-header-right-arrow">
              {isOpen ? <MDBIcon fas icon="chevron-down" /> : <MDBIcon fas icon="chevron-up" />}
            </div>
          </div>
        </div>
        <div id="cp-process-bar" className="cp-process-bar">
          <div className="cp-process-bar-color">
            5 tasks rest
          </div>
        </div>
        <div id="cp-body" className="cp-body">
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
                    <div className="cp-body-user-side">
                      <div className="cp-body-user-side-messages">
                        <UserMessage
                          messageContent={message.message_content}
                          disabled={message.disabled}
                          onChangeValue={(indexContent, contentType, value, field, subFiled) => onChangeValue(indexContent, contentType, value, field, subFiled)}
                          indexMessageRender={indexMessageRender}
                          errors={errors}
                        />
                        {/* {errors[`error_${indexMessageRender}`] &&
                          <div style={{ color: '#FF7E00', fontSize: '12px', marginTop: '-8px', marginBottom: '10px' }}>
                            {errors[`error_${indexMessageRender}`]}
                          </div>
                        } */}
                        {message?.message_content.length !== 0 &&
                          <div className="ss-user-message__action-wrapper">
                            <Button disabled={message.disabled} className="ss-user-message__action-btn" onClick={() => onClickNext(indexMessage)}>
                              To the next
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
    </React.Fragment>
  )
}

const BotMessage = ({ content, index, botInfor }) => {
  const handleDownloadFile = (file) => {
    console.log(file);
    let link = document.createElement('a');
    link.href = file;
    link.download = "file";
    document.body.appendChild(link);

    link.click();
    link.remove();
  }

  return (
    <div key={index} className="cp-body-bot-side">
      {(content.type === 'text_input' || content.type === 'file') && (
        <div className="cp-body-bot-side-avatar cp-avatar">
          <img src={"https://ec-chatbot-test1.com/" + botInfor?.icon?.url} />
        </div>
      )}
      <div className="cp-body-bot-side-messages">
        {/* <img className="ss-bot-ava" src={icon} alt="" /> */}
        {content &&
          <React.Fragment>
            {/* bot: type == 'text_input' */}
            {content.type === 'text_input' && (
              <textarea
                className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                value={content[content.type]?.content || ''}
                // onChange={() => onChangeValueMessageContent(indexMessageSelect, index, content.type, value, 'content')}
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
                      style={{ color: '#089BE5', fontSize: '17px' }}
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
          </React.Fragment>}
      </div>
    </div>
  )
}

const UserMessage = ({ messageContent, onChangeValue, disabled = false, indexMessageRender, errors }) => {
  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataCity, setDataCity] = useState([]);
  const [dataPrefectures, setDataPrefectures] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    api.get(`/api/v1/prefectures`).then((res) => {
      // console.log(res.data.data);
      setDataPrefectures(res.data.data);
    }).catch((error) => { console.error(error) });
  }, [])

  const onChangeValueCheckbox = (indexContent, contentType, value, field) => {
    messageContent[indexContent][contentType][field] = value;
  }

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent.map((content, indexContent) => {
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
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number1}
                            onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value1')}
                            value={textInput[textInput.type]?.value1}
                          ></InputCustom>
                          <InputCustom
                            disabled={disabled}
                            className="ss-message__content--user-text-input ss-input-value"
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number2}
                            onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value2')}
                            value={textInput[textInput.type]?.value2}
                          ></InputCustom>
                          <InputCustom
                            disabled={disabled}
                            // className="ss-message__content--user-text-input ss-input-value"
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number3}
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
                      {/* <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].cfEmlAdd_email}
                        onChange={onChangeValue(indexContent, content.type, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      ></input> */}
                      <InputCustom
                        disabled={disabled}
                        placeholder={textInput[textInput.type].cfEmlAdd_email}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      />
                      {/* <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
                        onChange={onChangeValue(indexContent, content.type, textInput.type, 'valueConfirm')}
                        value={textInput[textInput.type]?.valueConfirm}
                      ></input> */}
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
                      {/* <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].password}
                        onChange={onChangeValue(indexContent, content.type, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      ></input> */}
                      {/* <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].confirm_password}
                        onChange={onChangeValue(indexContent, content.type, textInput.type, 'valueConfirm')}
                        value={textInput[textInput.type]?.valueConfirm}
                      ></input> */}
                      <InputCustom
                        disabled={disabled}
                        placeholder={textInput[textInput.type].password}
                        onChange={value => onChangeValue(indexContent, content.type, value, textInput.type, 'value')}
                        value={textInput[textInput.type]?.value}
                      />
                      <InputCustom
                        disabled={disabled}
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
                      {textarea.require === true &&
                        <span className="ss-message__content--user-text-input-required">
                          * required
                        </span>
                      }
                    </div>
                  }
                  {(textarea?.type === 'text_input' ||
                    textarea?.type === 'invalid_input') && (
                      <textarea
                        disabled={disabled}
                        className="ss-message__content--user-textarea ss-input-value"
                        placeholder={textarea[textarea.type]?.content}
                        rows={3}
                        onChange={e => onChangeValue(indexContent, content.type, e.target.value, textarea?.type, 'value')}
                        value={textarea[textarea.type]?.value}
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
                            name="ss-message__content--user-radio_button"
                            id="ss-message__content--user-radio_button"
                            checked={radioButton.value ? radioButton.value === item.id : radioButton.initial_selection === item.id}
                            onChange={() => onChangeValue(indexContent, content.type, item.id, 'value')}
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
                            checked={radioButton.value === item.id}
                            onChange={() => onChangeValue(indexContent, content.type, item.id, 'value')}
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
                        return item.text && <div style={{ marginBottom: '10px' }} key={index} className="ss-message__content--user-radio_button--block_style">
                          <span>{item.text}</span>
                        </div>
                      })
                    )}
                  </div>
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${radioButton.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${radioButton.type}`]}
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
                      checkbox[checkbox.type].map((item, index) => {
                        return <div key={index} className="ss-message__content--user-checkbox">
                          <input
                            disabled={disabled}
                            type="checkbox"
                            name="ss-message__content--user-checkbox"
                            id="ss-message__content--user-checkbox"
                          // onChange={() => onChangeValueCheckbox(indexContent, content.type, item.id, 'value')}
                          // value={checkbox.checkedValue.includes(item.id)}
                          />
                          <label htmlFor="ss-message__content--user-checkbox">
                            {item.text}
                          </label>
                        </div>
                      })
                    )}
                    {checkbox.type === 'checkbox_img' && (
                      checkbox[checkbox.type].map((item, index) => {
                        return <div key={index} className="ss-message__content--user-checkbox--checkbox_img" style={{ marginBottom: '10px' }}>
                          <CheckboxCustom
                            disabled={disabled}
                            onChange={() => onChangeValueCheckbox(indexContent, content.type, item.id, 'value')}
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
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${checkbox.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${checkbox.type}`]}
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
                        <div className="ss-message__content--user-pull_down--time_hm">
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              disabled={disabled}
                              data={dataHour}
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
                                data={dataYear}
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
                                data={dataYear}
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
                              data={dataYear}
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
                              data={dataHour}
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
                              data={dataHour}
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
                              data={dataHour}
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
                              data={dataYear}
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
                              data={dataYear}
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
                          keyValue="id"
                          nameValue="name"
                          onChange={value => onChangeValue(indexContent, content.type, value, pullDown.type, 'value')}
                          value={pullDown[pullDown.type].value}
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
                  {!attachingFile.file_content && <span style={{ fontWeight: '400', fontSize: '12px' }}>Not selected</span>}
                  <div className="ss-message__content--user-attaching_file">
                    <Button className="ss-message__content--user-attaching_file-btn" style={{ backgroundColor: '#A3B1BF', marginTop: '0px' }}>
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
                      <div className="ss-message__content--user-calender-date_selection" style={{ backgroundColor: '#FAFAFA', height: '36px', border: '1px solid gray' }}>
                        {/* <MDBIcon
                                                        fas
                                                        icon="calendar"
                                                      /> */}
                        <MDBIcon far icon="calendar-alt"
                          className="ss-message__content--user-calender-icon-date_selection"
                        />
                      </div>
                    </React.Fragment>
                  )}
                  {/* calendar: type = 'embedded' */}
                  {calendar.type === 'embedded' && (
                    <React.Fragment>
                      <div className="ss-message__content--user-calender-embedded">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          inline
                        />
                      </div>
                    </React.Fragment>
                  )}
                  {/* calendar: type = 'start_end_date' */}
                  {calendar.type === 'start_end_date' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="ss-message__content--user-calender-date_selection" style={{ width: '49%', backgroundColor: '#FAFAFA', height: '36px', border: '1px solid gray' }}>
                        {/* <MDBIcon
                                                        fas
                                                        icon="calendar"
                                                      /> */}
                        <MDBIcon far icon="calendar-alt"
                          className="ss-message__content--user-calender-icon-date_selection"
                        />
                      </div>
                      <div className="ss-message__content--user-calender-date_selection" style={{ width: '49%', backgroundColor: '#FAFAFA', height: '36px', border: '1px solid gray' }}>
                        {/* <MDBIcon
                                                        fas
                                                        icon="calendar"
                                                      /> */}
                        <MDBIcon far icon="calendar-alt"
                          className="ss-message__content--user-calender-icon-date_selection"
                        />
                      </div>
                    </div>
                  )}
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${calendar.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${calendar.type}`]}
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
                  {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${agreeTerm.type}`] &&
                    <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                      {errors?.[`message${indexMessageRender}_content${indexContent}_${content.type}_${agreeTerm.type}`]}
                    </div>
                  }
                </div>
              )
            }
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Preview