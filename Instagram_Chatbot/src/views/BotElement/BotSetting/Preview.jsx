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
      api.get(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`).then(res => {
        console.log(res.data);
        if (res.data.code == 1) {
          let messageArr = [...res.data.data?.conversation?.messages];
          console.log(messageArr, 'check messageArr');
          setDataMessages(messageArr);
          let renderMessage = [];
          let index;
          let delayRender;

          for (let i = 0; i < messageArr.length; i++) {
            console.log(messageArr[i])
            if (messageArr[0].belong_to === 'bot') {
              if (messageArr[i]?.message_content[0].type === 'delay') {
                console.log(parseInt(messageArr[i]?.message_content[0].delay.content.split(' ')[0]))
                let promise = new Promise((resolve) => (
                  delayRender = setTimeout(() => {
                    resolve({ ...messageArr[i + 1] })
                  }, parseInt(messageArr[i]?.message_content[0].delay.content.split(' ')[0]) * 1000)
                ))
                promise.then(res => {
                  console.log(res)
                  // renderMessage.push(res);         
                  console.log(i)
                  setRenderMessageArr([
                    ...renderMessage,
                    res
                  ]);
                  renderMessage.push(res);
                  index = i;
                  console.log(i);
                  return renderMessage;
                }).then((renderMessage) => {
                  console.log(renderMessage);
                  for (let j = i + 1; j < messageArr.length; j++) {
                    console.log(messageArr[i], 'check messageArr[i]');
                    if (messageArr[j].belong_to !== 'bot') {
                      renderMessage.push(messageArr[j]);
                      index = i;
                      break;
                    } else {
                      renderMessage.push(messageArr[i]);
                    }
                  }
                  setRenderMessageArr(renderMessage);
                });
                break;
                // setIndexMessageRender(i);
              } else if (messageArr[i].belong_to !== 'bot') {
                renderMessage.push(messageArr[i]);
                index = i;
                break;
              } else {
                renderMessage.push(messageArr[i]);
              }
            } else if (messageArr[0].belong_to === 'user') {
              if (messageArr[i].belong_to !== 'user') {
                renderMessage.push(messageArr[i]);
                index = i;
                break;
              } else {
                renderMessage.push(messageArr[i]);
              }
            }
          }
          console.log(renderMessage);

          setIndexMessageRender(index);
          setRenderMessageArr(renderMessage);
          return () => {
            clearTimeout(delayRender);
          }
        }
      }).catch(err => console.log(err));
    }
  }, [scenarioId])

  useEffect(() => {
    console.log(indexMessageRender, 'chcek indexMessageRender', renderMessageArr)
    if (indexMessageRender && indexMessageRender !== 0) {

    }
  }, [indexMessageRender])

  const onClickNext = (indexMessage) => {
    renderMessageArr[indexMessage].disabled = true;
    let dataRender = [];
    console.log();
    if(!dataMessages[indexMessage + 1]) return;
    if (dataMessages[indexMessage + 1].belong_to === 'bot') {
      for (let i = indexMessage + 1; i < dataMessages.length; i++) {
        console.log(dataMessages[i]);
        dataRender.push(dataMessages[i]);
        if (dataMessages[i].belong_to === 'user') break;
      }
      console.log(dataRender, ' check dataRender')
      setRenderMessageArr([
        ...renderMessageArr,
        ...dataRender
      ]);
    } else {
      setRenderMessageArr([
        ...renderMessageArr,
        dataMessages[indexMessage + 1]
      ]);
    }

    // renderMessageArr
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
                        />
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
      {content.type === 'text_input' && (
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
                  {(content[content.type]?.content.includes('jpeg') || content[content.type]?.content.includes('png')) ?
                    <img
                      src={content[content.type]?.content}
                      alt=""
                      style={{ width: '27%' }} /> :
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

const UserMessage = ({ messageContent, onChangeValue }) => {
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
        console.log(content, 'check content')
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
                        <input
                          className="ss-message__content--user-text-input ss-input-value"
                          placeholder={textInput.text?.placeholderLeft}
                          style={{ width: '49%', marginBottom: '0px' }}

                        ></input>
                        {/* <InputCustom
                          value={textInput}
                        /> */}
                        <input
                          className="ss-message__content--user-text-input ss-input-value"
                          placeholder={textInput.text?.placeholderRight}
                          style={{ width: '49%' }}
                        ></input>
                      </div> :
                      <React.Fragment>
                        <input
                          className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: '0px' }}
                          placeholder={textInput[textInput.type]?.placeholderLeft}
                        ></input>
                        {textInput.text?.placeholderRight &&
                          <span style={{ fontWeight: '400', color: 'black', fontSize: '12px', marginLeft: '18px' }}>{textInput.text?.placeholderRight}</span>
                        }
                      </React.Fragment>
                    )
                  }
                  {(textInput.type === 'phone_number') &&
                    <React.Fragment>
                      {textInput.phone_number.withHyphen === false ?
                        <input
                          className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: '0px' }}
                          placeholder={textInput[textInput.type]?.number}
                        ></input> :
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <input
                            className="ss-message__content--user-text-input ss-input-value"
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number1}
                          ></input>
                          <input
                            className="ss-message__content--user-text-input ss-input-value"
                            readOnly
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number2}
                          ></input>
                          <input
                            className="ss-message__content--user-text-input ss-input-value"
                            style={{ marginBottom: '0px', width: '32%' }}
                            placeholder={textInput[textInput.type]?.number3}
                          ></input>
                        </div>
                      }
                    </React.Fragment>
                  }
                  {(textInput.type === 'password') &&
                    <React.Fragment>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        style={{ marginBottom: '0px' }}
                        placeholder={textInput[textInput.type]?.password}
                        disabled
                      ></input>
                    </React.Fragment>
                  }
                  {(textInput.type === 'urls' ||
                    textInput.type === 'email_address') &&
                    <React.Fragment>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        style={{ marginBottom: '0px' }}
                        placeholder={textInput[textInput.type]}
                        disabled
                      ></input>
                    </React.Fragment>
                  }
                  {(textInput.type === 'email_confirmation') &&
                    (<>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].cfEmlAdd_email}
                      ></input>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
                      ></input>
                    </>
                    )}
                  {(textInput.type === 'password_confirmation') &&
                    (<>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].password}
                      ></input>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        placeholder={textInput[textInput.type].confirm_password}
                      ></input>
                    </>
                    )}
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
                        className="ss-message__content--user-textarea ss-input-value"
                        placeholder={textarea[textarea.type]?.content}
                        rows={3}
                      ></textarea>
                    )}
                  {textarea?.type === 'consume_api_response' && (
                    <textarea
                      className="ss-message__content--user-textarea ss-input-value"
                      value={'入力値の検証にAPIを利用する'}
                      rows={3}
                    ></textarea>
                  )}
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
                            type="radio"
                            name="ss-message__content--user-radio_button"
                            id="ss-message__content--user-radio_button"
                            checked={radioButton.initial_selection === item.id}
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
                            type="radio"
                            name="ss-message__content--user-radio_button--radio_button_img"
                            id="ss-message__content--user-radio_button--radio_button_img"
                            checked={radioButton.initial_selection === item.id}
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
                            type="checkbox"
                            name="ss-message__content--user-checkbox"
                            id="ss-message__content--user-checkbox"
                            checked={checkbox.all_item_checked}
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
                          <input
                            type="checkbox"
                            name="ss-message__content--user-checkbox--checkbox_img"
                            id="ss-message__content--user-checkbox--checkbox_img"
                            checked={checkbox.all_item_checked}
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
                                    data={pullDown[pullDown.type].options_without_comment}
                                    keyValue="value"
                                    style={{ width: '100%' }}
                                    placeholder={pullDown[pullDown.type].display_unselected}
                                    nameValue="text"
                                  />
                                </div> :
                                <div className="ss-message__content--user-pull_down-col col-12" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <SelectCustom
                                    data={pullDown[pullDown.type].options_with_comment}
                                    keyValue="value"
                                    style={{ width: '49%' }}
                                    placeholder={pullDown[pullDown.type].display_unselected}
                                    nameValue="text"
                                  />
                                  <SelectCustom
                                    data={pullDown[pullDown.type].options_with_comment}
                                    keyValue="value2"
                                    style={{ width: '49%' }}
                                    placeholder={pullDown[pullDown.type].display_unselected}
                                    nameValue="text2"
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
                              data={dataHour}
                              placeholder="Time"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '32%' }}
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
                                data={dataYear}
                                placeholder="Year"
                                style={{ width: '32%' }}
                              />
                              <SelectCustom
                                data={dataMonth}
                                placeholder="Month"
                                style={{ width: '32%' }}
                              />
                              <SelectCustom
                                data={dataDay}
                                placeholder="Day"
                                style={{ width: '32%' }}
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
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%' }}
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
                                data={dataYear}
                                placeholder="Year"
                                style={{ width: '32%' }}
                              />
                              <SelectCustom
                                data={dataMonth}
                                placeholder="Month"
                                style={{ width: '32%' }}
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
                              data={dataYear}
                              placeholder="Year"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%', marginBottom: '10px' }}
                            />
                            <SelectCustom
                              data={dataHour}
                              placeholder="Time"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '32%' }}
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
                              data={dataHour}
                              placeholder="Time"
                              style={{ width: '49%' }}
                            />
                            <SelectCustom
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '49%' }}
                            />
                          </div>
                          <div style={{ textAlign: 'center' }}>~</div>
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              data={dataHour}
                              placeholder="Time"
                              style={{ width: '49%' }}
                            />
                            <SelectCustom
                              data={dataMinutes}
                              placeholder="Minutes"
                              style={{ width: '49%' }}
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
                              data={dataYear}
                              placeholder="Year"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%' }}
                            />
                          </div>
                          <div style={{ textAlign: 'center' }}>~</div>
                          <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <SelectCustom
                              data={dataYear}
                              placeholder="Year"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataMonth}
                              placeholder="Month"
                              style={{ width: '32%' }}
                            />
                            <SelectCustom
                              data={dataDay}
                              placeholder="Day"
                              style={{ width: '32%' }}
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
                          data={dataPrefectures}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          keyValue="id"
                          nameValue="name"
                        />
                      </React.Fragment>
                    )}
                    {pullDown.type === 'up_to_municipality' && (
                      <div>
                        <div style={{ fontWeight: '400', fontSize: '12px' }}>{pullDown[pullDown.type].prefecture_comment}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <SelectCustom
                            data={dataPrefectures}
                            placeholder="Select prefecture"
                            style={{ width: '45%' }}
                            keyValue="id"
                            nameValue="name"
                          />
                          <span>~</span>
                          <SelectCustom
                            data={dataCity}
                            placeholder="Select city"
                            style={{ width: '45%' }}
                            keyValue="id"
                            nameValue="name"
                          />
                        </div>
                        <div style={{ fontWeight: '400', fontSize: '12px' }}>{pullDown[pullDown.type].city_comment}</div>
                      </div>
                    )}
                  </div>
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
                          disabled={true}
                          style={{ width: '100%' }}
                        /> :
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <InputCustom
                            placeholder={zipCodeAddress.post_code_left}
                            disabled={true}
                            style={{ width: '49%' }}
                          />
                          <InputCustom
                            placeholder={zipCodeAddress.post_code_right}
                            disabled={true}
                            style={{ width: '49%' }}
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
                        disabled={true}
                        style={{ width: '100%' }}
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
                        disabled={true}
                        style={{ width: '100%' }}
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
                        disabled={true}
                        style={{ width: '100%' }}
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
                        disabled={true}
                        style={{ width: '100%' }}
                      />
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
                        ></textarea>
                        <CheckboxCustom
                          onChange={value => console.log(value)}
                          label={agreeTerm.term}
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
                        onChange={value => console.log(value)}
                        label={agreeTerm.term}
                      />
                    </div>
                  )}
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