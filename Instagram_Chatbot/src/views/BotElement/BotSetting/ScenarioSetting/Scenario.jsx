import '../../../../assets/css/bot/scenario/scenario-single.css';
import React, { useEffect, useState } from 'react';
import {
  Col, Row, Card, CardBody, Button
} from 'reactstrap';
import icon from '../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

let data = [
  {
    belong_to: 'bot',
    id: '1',
    type: 'text',
  },
  {
    belong_to: 'user',
    id: '2',
    type: 'text_input',
    message_detail: {
      type: 'text',
    },
  },
];

let dropDownTitle = [
  {
    key: 'yes',
    value: 'No title'
  },
  {
    key: 'no',
    value: 'With title'
  }
]

let rangeText = [
  {
    key: 'no_input',
    value: 'No input limit'
  },
  {
    key: 'alphabet',
    value: 'Alphabet only'
  },
  {
    key: 'single_byte',
    value: 'Single-byte numbers'
  },
  {
    key: 'alphanumeric_hyphen',
    value: 'Alphanumeric and hyphen'
  },
  {
    key: 'alphanumeric',
    value: "Alphanumeric ('AZ';'az';0-9')"
  },
  {
    key: 'double_byte',
    value: 'Double-byte characters'
  },
  {
    key: 'double_byte_hiragana',
    value: 'Double-byte hiragana'
  },
  {
    key: 'full_width_katakana',
    value: 'Full-width katakana'
  }
]

const Scenario = () => {
  // states
  const [scenarioName, setScenarioName] = useState('');
  const [belongTo, setBelongTo] = useState('bot');
  const [messageType, setMessageType] = useState('text');
  const [idMessageSelect, setIdMessageSelect] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  // bot setting values
  const [botTextValue, setBotTextValue] = useState('');
  const [botScriptValue, setBotScriptValue] = useState('');
  const [botDelayValue, setBotDelayValue] = useState(1);
  const [botIsScrollAuto, setBotIsScrollAuto] = useState(false);
  const [botIsTurnOnTyping, setBotIsTurnOnTyping] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);


  // user setting values

  // side effects
  useEffect(() => {
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

  function botUploadFile() {
    document.getElementById('ss-bot-file-upload').click();
  }

  function getBaseUrl(event) {
    var file = document.querySelector('input[type=file]')['files'][0];
    // if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
    var reader = new FileReader();
    var baseString;
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

    reader.onloadend = function () {
      baseString = reader.result;
      // setInputImage(baseString);
      console.log(event.target.files[0].name);
      document.getElementById('ss-bot-file-upload-name').innerHTML = event.target.files[0].name;
      if (baseString !== undefined || baseString !== '') {
        // document.getElementById('newClientImgLogoErrMsg').style.display = 'none';
        console.log('No file selected');
      }
    };
    reader.readAsDataURL(file);
  }

  // handle select message
  const handleSelectMessage = (id, type, belongTo) => {
    setMessageType(type);
    setBelongTo(belongTo);
    setIdMessageSelect(id);
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (!ele.classList.contains(`ss-edit-option-wrapper-${id}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });
    document.querySelectorAll('.ss-message').forEach((ele) => {
      ele.classList.remove('ss-message--select');
      ele.classList.remove('ss-message--error');
    });
    document.querySelector(`.ss-message-${id}`).classList.add('ss-message--select');
  };

  // handle edit icon click
  const handleEditIconClick = (id) => {
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (!ele.classList.contains(`ss-edit-option-wrapper-${id}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });
    document
      .querySelector(`.ss-edit-option-wrapper-${id}`)
      .classList.toggle('ss-edit-option-wrapper--select');
  };

  // handle change bot statement type
  const handleChangeBotStatementType = (e) => {
    setMessageType(e.target.value);
    data.forEach((message) => {
      if (idMessageSelect && message.id === idMessageSelect) {
        message.type = e.target.value;
      }
    });
  };

  const handleAddMessageSetting = () => {

  }

  return (
    <div className="content">
      <div className="ss-actions">
        <Button>Save</Button>
        <Button>Save and preview</Button>
      </div>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="ss-sc-setting">
                {/* ss overview */}
                <div className="ss-sc-content ss-overview">
                  {/* Input name of scenario */}
                  <input
                    className="ss-scenario-name ss-input-value"
                    type="text"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="Enter scenario name"
                  ></input>

                  {/* Overview scenario */}
                  <div className="ss-overview-detail">
                    {data.map((message) =>
                      message.belong_to === 'bot' ? (
                        <div key={message.id} className="ss-bot-chat-wrapper ss-message-wrapper">
                          <div
                            className={`ss-bot-chat ss-message ss-message--select ss-message-${message.id}`}
                          >
                            <div
                              className="ss-bot-chat-detail ss-message__detail"
                              onClick={() =>
                                handleSelectMessage(message.id, message.type, message.belong_to)
                              }
                            >
                              <img className="ss-bot-ava" src={icon} alt="" />

                              {/* bot: type == 'text' */}
                              {message.type === 'text' && (
                                <textarea
                                  className="ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value"
                                  value={botTextValue}
                                  readOnly
                                ></textarea>
                              )}
                              {/* bot: type == 'file' */}
                              {/* file type: jpeg, jpg, png */}
                              {/* {message.type === 'file' && (
                                <div className="ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-img">
                                  <img
                                    src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/63354faaba626.jpg"
                                    alt=""
                                  />
                                </div>
                              )} */}

                              {/* file type: gif, mp4 */}
                              {/* {message.type === 'file' && (
                                <div className="ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-video">
                                  <video
                                    src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/633551125f613.mp4"
                                    controls="controls"
                                  ></video>
                                </div>
                              )} */}

                              {/* file type: pdf */}
                              {message.type === 'file' && (
                                // <textarea
                                //   className="ss-bot-chat-detail-content ss-message__content--bot-file-pdf ss-input-value"
                                //   value={
                                //     'https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/6335523536dd4.pdf'
                                //   }
                                //   readOnly
                                // ></textarea>
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    color: 'blue',
                                    fontWeight: '400',
                                    fontSize: '15px',
                                  }}
                                >
                                  Download this file
                                </span>
                              )}

                              {/* bot: type == 'email' */}
                              {message.type === 'email' && (
                                <textarea
                                  className="ss-bot-chat-detail-content ss-message__content--bot-email ss-input-value"
                                  value={''}
                                  readOnly
                                ></textarea>
                              )}

                              {/* bot: type == 'script' */}
                              {message.type === 'script' && (
                                <textarea
                                  className="ss-bot-chat-detail-content ss-message__content--bot-script ss-input-value"
                                  value={botScriptValue}
                                  readOnly
                                ></textarea>
                              )}

                              {/* bot: type == 'delay' */}
                              {message.type === 'delay' && (
                                <textarea
                                  className="ss-bot-chat-detail-content ss-message__content--bot-delay ss-input-value"
                                  value={`${botDelayValue} 秒`}
                                  readOnly
                                ></textarea>
                              )}

                              <div className="ss-chat-option">
                                <MDBIcon
                                  fas
                                  icon="pencil-alt"
                                  // style={{ marginTop: '10px' }}
                                  onClick={() => handleEditIconClick(message.id)}
                                ></MDBIcon>
                                <MDBIcon
                                  fas
                                  icon="grip-vertical"
                                  style={{ marginTop: '10px' }}
                                ></MDBIcon>
                                <div
                                  className={`ss-edit-option-wrapper ss-edit-option-wrapper-${message.id}`}
                                >
                                  <div className="ss-option-wrapper">
                                    <MDBIcon
                                      fas
                                      icon="copy"
                                      className="ss-add-option-icon"
                                    ></MDBIcon>
                                    <span>Copy</span>
                                  </div>
                                  <div className="ss-option-wrapper">
                                    <MDBIcon
                                      fas
                                      icon="eye-slash"
                                      className="ss-add-option-icon"
                                    ></MDBIcon>
                                    <span>Hidden</span>
                                  </div>
                                  <div className="ss-option-wrapper">
                                    <MDBIcon
                                      fas
                                      icon="trash"
                                      className="ss-add-option-icon"
                                    ></MDBIcon>
                                    <span>Delete</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ss-add-action-wrapper">
                              <MDBIcon fas icon="plus-circle" className="ss-add-icon"></MDBIcon>
                              <div className="ss-add-message-option-wrapper">
                                <div className="ss-option-wrapper">
                                  <MDBIcon
                                    fas
                                    icon="comment"
                                    className="ss-add-option-icon"
                                  ></MDBIcon>
                                  <span>Bot statement</span>
                                </div>
                                <div className="ss-option-wrapper">
                                  <MDBIcon
                                    fas
                                    icon="comment"
                                    className="ss-add-option-icon"
                                  ></MDBIcon>
                                  <span>User input</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className="ss-user-chat-wrapper ss-message-wrapper">
                          <div
                            className={`ss-user-chat ss-message ss-message--error ss-message-${message.id}`}
                          >
                            <div
                              className="ss-user-chat-detail ss-message__detail"
                              onClick={() =>
                                handleSelectMessage(message.id, message.type, message.belong_to)
                              }
                            >
                              <div className="ss-user-chat-detail-content">
                                <div className="ss-user-message__content-wrapper">
                                  {/* type == 'text_input' */}
                                  {message.type === 'text_input' && (
                                    <>
                                      <div className="ss-message__content--user-text-input-top">
                                        <span className="ss-message__content--user-text-input-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-text-input-required">
                                          * required
                                        </span>
                                      </div>
                                      {(message.message_detail.type === 'text' ||
                                        message.message_detail.type === 'urls' ||
                                        message.message_detail.type === 'email_address' ||
                                        message.message_detail.type === 'phone_number' ||
                                        message.message_detail.type === 'password') && (
                                          <input
                                            className="ss-message__content--user-text-input ss-input-value"
                                            readOnly
                                            value={''}
                                            disabled
                                          ></input>
                                        )}
                                      {(message.message_detail.type === 'email_confirmation' ||
                                        message.message_detail.type ===
                                        'password_confirmation') && (
                                          <>
                                            <input
                                              className="ss-message__content--user-text-input ss-input-value"
                                              readOnly
                                              value={''}
                                              disabled
                                            ></input>
                                            <input
                                              className="ss-message__content--user-text-input ss-input-value"
                                              readOnly
                                              value={''}
                                              disabled
                                            ></input>
                                          </>
                                        )}
                                    </>
                                  )}
                                  {/* type == 'label' */}
                                  {message.type === 'label' && (
                                    <>
                                      <div className="ss-message__content--user-label-top">
                                        <span className="ss-message__content--user-label-title">
                                          Label
                                        </span>
                                        <span className="ss-message__content--user-label-required">
                                          * required
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {/* type == 'textarea' */}
                                  {message.type === 'textarea' && (
                                    <>
                                      <div className="ss-message__content--user-textarea-top">
                                        <span className="ss-message__content--user-textarea-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-textarea-required">
                                          * required
                                        </span>
                                      </div>
                                      {(message.message_detail.type === 'text_input' ||
                                        message.message_detail.type === 'invalid_input') && (
                                          <textarea
                                            className="ss-message__content--user-textarea ss-input-value"
                                            readOnly
                                            value={''}
                                            rows={3}
                                          ></textarea>
                                        )}
                                      {message.message_detail.type === 'consume_api_response' && (
                                        <textarea
                                          className="ss-message__content--user-textarea ss-input-value"
                                          readOnly
                                          value={'入力値の検証にAPIを利用する'}
                                          rows={3}
                                        ></textarea>
                                      )}
                                    </>
                                  )}
                                  {/* type == 'radio_button' */}
                                  {message.type === 'radio_button' && (
                                    <>
                                      <div className="ss-message__content--user-radio_button-top">
                                        <span className="ss-message__content--user-radio_button-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-radio_button-required">
                                          * required
                                        </span>
                                      </div>
                                      <div className="ss-message__content--user-radio_button-wrapper">
                                        {message.message_detail.type === 'default' && (
                                          <>
                                            <div className="ss-message__content--user-radio_button">
                                              <input
                                                type="radio"
                                                name="ss-message__content--user-radio_button"
                                                id="ss-message__content--user-radio_button"
                                                disabled
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
                                                disabled
                                              />
                                              <label htmlFor="ss-message__content--user-radio_button">
                                                label
                                              </label>
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'radio_button_img' && (
                                          <>
                                            <div className="ss-message__content--user-radio_button--radio_button_img">
                                              <input
                                                type="radio"
                                                name="ss-message__content--user-radio_button--radio_button_img"
                                                id="ss-message__content--user-radio_button--radio_button_img"
                                                disabled
                                              />
                                              <img
                                                src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/63355263374d1.jpg"
                                                alt=""
                                              />
                                            </div>
                                            <div className="ss-message__content--user-radio_button--radio_button_img">
                                              <input
                                                type="radio"
                                                name="ss-message__content--user-radio_button--radio_button_img"
                                                id="ss-message__content--user-radio_button--radio_button_img"
                                                disabled
                                              />
                                              <img
                                                src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/63355263374d1.jpg"
                                                alt=""
                                              />
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'consume_api_response' && (
                                          <>
                                            <div className="ss-message__content--user-radio_button">
                                              <input
                                                type="radio"
                                                name="ss-message__content--user-radio_button"
                                                id="ss-message__content--user-radio_button"
                                                disabled
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
                                                disabled
                                              />
                                              <label htmlFor="ss-message__content--user-radio_button">
                                                label
                                              </label>
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'block_style' && (
                                          <>
                                            <div className="ss-message__content--user-radio_button--block_style">
                                              <span>label</span>
                                            </div>
                                            <div className="ss-message__content--user-radio_button--block_style">
                                              <span>label</span>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {/* type == 'checkbox' */}
                                  {message.type === 'checkbox' && (
                                    <>
                                      <div className="ss-message__content--user-checkbox-top">
                                        <span className="ss-message__content--user-checkbox-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-checkbox-required">
                                          * required
                                        </span>
                                      </div>
                                      <div className="ss-message__content--user-checkbox-wrapper">
                                        {message.message_detail.type === 'default' && (
                                          <>
                                            <div className="ss-message__content--user-checkbox">
                                              <input
                                                type="checkbox"
                                                name="ss-message__content--user-checkbox"
                                                id="ss-message__content--user-checkbox"
                                                disabled
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
                                                disabled
                                              />
                                              <label htmlFor="ss-message__content--user-checkbox">
                                                label
                                              </label>
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'checkbox_img' && (
                                          <>
                                            <div className="ss-message__content--user-checkbox--checkbox_img">
                                              <input
                                                type="checkbox"
                                                name="ss-message__content--user-checkbox--checkbox_img"
                                                id="ss-message__content--user-checkbox--checkbox_img"
                                                disabled
                                              />
                                              <img
                                                src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/63355263374d1.jpg"
                                                alt=""
                                              />
                                            </div>
                                            <div className="ss-message__content--user-checkbox--checkbox_img">
                                              <input
                                                type="checkbox"
                                                name="ss-message__content--user-checkbox--checkbox_img"
                                                id="ss-message__content--user-checkbox--checkbox_img"
                                                disabled
                                              />
                                              <img
                                                src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/63355263374d1.jpg"
                                                alt=""
                                              />
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'consume_api_response' && (
                                          <>
                                            <div className="ss-message__content--user-checkbox">
                                              <input
                                                type="checkbox"
                                                name="ss-message__content--user-checkbox"
                                                id="ss-message__content--user-checkbox"
                                                disabled
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
                                                disabled
                                              />
                                              <label htmlFor="ss-message__content--user-checkbox">
                                                label
                                              </label>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {/* type == 'pull_down' */}
                                  {message.type === 'pull_down' && (
                                    <>
                                      <div className="ss-message__content--user-pull_down-top">
                                        <span className="ss-message__content--user-pull_down-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-pull_down-required">
                                          * required
                                        </span>
                                      </div>
                                      <div className="ss-message__content--user-pull_down-wrapper">
                                        {message.message_detail.type === 'customization' && (
                                          <>
                                            <div className="ss-message__content--user-pull_down--customization">
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginBottom: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-12">
                                                  <select
                                                    name="ss-message__content--user-pull_down--customization"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginTop: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                        {(message.message_detail.type === 'time_hm' ||
                                          message.message_detail.type === 'date_md' ||
                                          message.message_detail.type === 'date_ym' ||
                                          message.message_detail.type === 'dob_ym') && (
                                            <>
                                              <div className="ss-message__content--user-pull_down--time_hm">
                                                <div className="ss-message__content--user-pull_down-row">
                                                  <div className="ss-message__content--user-pull_down-col col-6">
                                                    <select
                                                      name="ss-message__content--user-pull_down--time_hm"
                                                      defaultValue={'default'}
                                                      className="ss-input-value"
                                                    >
                                                      <option value="default" hidden disabled>
                                                        Please select
                                                      </option>
                                                      <option value="option1">Option 1</option>
                                                    </select>
                                                  </div>
                                                  <div className="ss-message__content--user-pull_down-col col-6">
                                                    <select
                                                      name="ss-message__content--user-pull_down--time_hm"
                                                      defaultValue={'default'}
                                                      className="ss-input-value"
                                                    >
                                                      <option value="default" hidden disabled>
                                                        Please select
                                                      </option>
                                                      <option value="option1">Option 1</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div
                                                  className="ss-message__content--user-pull_down-comment"
                                                  style={{ marginTop: '4px' }}
                                                >
                                                  <span>comment</span>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        {(message.message_detail.type === 'date_ymd' ||
                                          message.message_detail.type === 'dob_ymd') && (
                                            <>
                                              <div className="ss-message__content--user-pull_down--date_ymd">
                                                <div className="ss-message__content--user-pull_down-row">
                                                  <div className="ss-message__content--user-pull_down-col col-4">
                                                    <select
                                                      name="ss-message__content--user-pull_down--date_ymd"
                                                      defaultValue={'default'}
                                                      className="ss-input-value"
                                                    >
                                                      <option value="default" hidden disabled>
                                                        Please select
                                                      </option>
                                                      <option value="option1">Option 1</option>
                                                    </select>
                                                  </div>
                                                  <div className="ss-message__content--user-pull_down-col col-4">
                                                    <select
                                                      name="ss-message__content--user-pull_down--date_ymd"
                                                      defaultValue={'default'}
                                                      className="ss-input-value"
                                                    >
                                                      <option value="default" hidden disabled>
                                                        Please select
                                                      </option>
                                                      <option value="option1">Option 1</option>
                                                    </select>
                                                  </div>
                                                  <div className="ss-message__content--user-pull_down-col col-4">
                                                    <select
                                                      name="ss-message__content--user-pull_down--date_ymd"
                                                      defaultValue={'default'}
                                                      className="ss-input-value"
                                                    >
                                                      <option value="default" hidden disabled>
                                                        Please select
                                                      </option>
                                                      <option value="option1">Option 1</option>
                                                    </select>
                                                  </div>
                                                </div>
                                                <div
                                                  className="ss-message__content--user-pull_down-comment"
                                                  style={{ marginTop: '4px' }}
                                                >
                                                  <span>comment</span>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        {/* {message.message_detail.type === 'date_md' && <></>} */}
                                        {/* {message.message_detail.type === 'date_ym' && <></>} */}
                                        {message.message_detail.type === 'date_ym_hm' && (
                                          <>
                                            <div className="ss-message__content--user-pull_down--date_ym_hm">
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--date_ym_hm"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--date_ym_hm"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--date_ym_hm"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--date_ym_hm"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--date_ym_hm"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginTop: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                        {/* {message.message_detail.type === 'dob_ymd' && <></>} */}
                                        {/* {message.message_detail.type === 'dob_ym' && <></>} */}
                                        {message.message_detail.type === 'timezone_from_to' && (
                                          <>
                                            <div className="ss-message__content--user-pull_down--timezone_from_to">
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-6">
                                                  <select
                                                    name="ss-message__content--user-pull_down--timezone_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-6">
                                                  <select
                                                    name="ss-message__content--user-pull_down--timezone_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div style={{ textAlign: 'center' }}>
                                                <span
                                                  style={{ fontWeight: '400', fontSize: '14px' }}
                                                >
                                                  ~
                                                </span>
                                              </div>
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-6">
                                                  <select
                                                    name="ss-message__content--user-pull_down--timezone_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-6">
                                                  <select
                                                    name="ss-message__content--user-pull_down--timezone_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginTop: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'period_from_to' && (
                                          <>
                                            <div className="ss-message__content--user-pull_down--period_from_to">
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--period_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--period_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--period_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div style={{ textAlign: 'center' }}>
                                                <span
                                                  style={{ fontWeight: '400', fontSize: '14px' }}
                                                >
                                                  ~
                                                </span>
                                              </div>
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--period_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--period_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                                <div className="ss-message__content--user-pull_down-col col-4">
                                                  <select
                                                    name="ss-message__content--user-pull_down--period_from_to"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginTop: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'prefectures' && (
                                          <>
                                            <div className="ss-message__content--user-pull_down--prefectures">
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-12">
                                                  <select
                                                    name="ss-message__content--user-pull_down--prefectures"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                        {message.message_detail.type === 'up_to_municipality' && (
                                          <>
                                            <div className="ss-message__content--user-pull_down--up_to_municipality">
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginBottom: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-12">
                                                  <select
                                                    name="ss-message__content--user-pull_down--up_to_municipality"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div style={{ textAlign: 'center' }}>
                                                <span
                                                  style={{ fontWeight: '400', fontSize: '14px' }}
                                                >
                                                  ~
                                                </span>
                                              </div>
                                              <div className="ss-message__content--user-pull_down-row">
                                                <div className="ss-message__content--user-pull_down-col col-12">
                                                  <select
                                                    name="ss-message__content--user-pull_down--up_to_municipality"
                                                    defaultValue={'default'}
                                                    className="ss-input-value"
                                                  >
                                                    <option value="default" hidden disabled>
                                                      Please select
                                                    </option>
                                                    <option value="option1">Option 1</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div
                                                className="ss-message__content--user-pull_down-comment"
                                                style={{ marginTop: '4px' }}
                                              >
                                                <span>comment</span>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {/* type == 'zip_code_address' */}
                                  {message.type === 'zip_code_address' && (
                                    <>
                                      <div className="ss-message__content--user-zip_code_address-field">
                                        <div className="ss-message__content--user-zip_code_address-top">
                                          <span className="ss-message__content--user-zip_code_address-required">
                                            * required
                                          </span>
                                          <span className="ss-message__content--user-zip_code_address-title">
                                            Post code
                                          </span>
                                        </div>
                                        <input
                                          className="ss-message__content--user-zip_code_address ss-input-value"
                                          readOnly
                                          value={''}
                                          disabled
                                        ></input>
                                      </div>
                                      <div className="ss-message__content--user-zip_code_address-field">
                                        <div className="ss-message__content--user-zip_code_address-top">
                                          <span className="ss-message__content--user-zip_code_address-required">
                                            * required
                                          </span>
                                          <span className="ss-message__content--user-zip_code_address-title">
                                            Prefectures
                                          </span>
                                        </div>
                                        {/* use_drop_down: 'no' */}
                                        {/* <input
                                          className="ss-message__content--user-zip_code_address ss-input-value"
                                          readOnly
                                          value={''}
                                          disabled
                                        ></input> */}
                                        {/* use_drop_down: 'yes' */}
                                        <select
                                          name="ss-message__content--user-zip_code_address"
                                          className="ss-message__content--user-zip_code_address ss-input-value"
                                        >
                                          <option value="default" disabled hidden>
                                            Select prefectures
                                          </option>
                                          <option value="1">Prefecture 1</option>
                                        </select>
                                      </div>
                                      <div className="ss-message__content--user-zip_code_address-field">
                                        <div className="ss-message__content--user-zip_code_address-top">
                                          <span className="ss-message__content--user-zip_code_address-required">
                                            * required
                                          </span>
                                          <span className="ss-message__content--user-zip_code_address-title">
                                            Municipalities
                                          </span>
                                        </div>
                                        <input
                                          className="ss-message__content--user-zip_code_address ss-input-value"
                                          readOnly
                                          value={''}
                                          disabled
                                        ></input>
                                      </div>
                                      <div className="ss-message__content--user-zip_code_address-field">
                                        <div className="ss-message__content--user-zip_code_address-top">
                                          <span className="ss-message__content--user-zip_code_address-required">
                                            * required
                                          </span>
                                          <span className="ss-message__content--user-zip_code_address-title">
                                            Address
                                          </span>
                                        </div>
                                        <input
                                          className="ss-message__content--user-zip_code_address ss-input-value"
                                          readOnly
                                          value={''}
                                          disabled
                                        ></input>
                                      </div>
                                      <div className="ss-message__content--user-zip_code_address-field">
                                        <div className="ss-message__content--user-zip_code_address-top">
                                          <span className="ss-message__content--user-zip_code_address-required">
                                            * required
                                          </span>
                                          <span className="ss-message__content--user-zip_code_address-title">
                                            Building name
                                          </span>
                                        </div>
                                        <input
                                          className="ss-message__content--user-zip_code_address ss-input-value"
                                          readOnly
                                          value={''}
                                          disabled
                                        ></input>
                                      </div>
                                    </>
                                  )}
                                  {/* type == 'attaching_file' */}
                                  {message.type === 'attaching_file' && (
                                    <>
                                      <div className="ss-message__content--user-attaching_file-top">
                                        <span className="ss-message__content--user-attaching_file-required">
                                          * required
                                        </span>
                                      </div>
                                      <div className="ss-message__content--user-attaching_file">
                                        <Button className="ss-message__content--user-attaching_file-btn">
                                          Select file
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  {/* type == 'calender' */}
                                  {message.type === 'calender' && (
                                    <>
                                      <div className="ss-message__content--user-calender-top">
                                        <span className="ss-message__content--user-calender-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-calender-required">
                                          * required
                                        </span>
                                      </div>
                                      {/* calendar: type = 'date_selection' */}
                                      {message.message_detail.type === 'date_selection' && (
                                        <>
                                          <div className="ss-message__content--user-calender-date_selection">
                                            <MDBIcon
                                              fas
                                              icon="calendar"
                                              className="ss-message__content--user-calender-icon-date_selection"
                                            />
                                          </div>
                                        </>
                                      )}
                                      {/* calendar: type = 'embedded' */}
                                      {message.message_detail.type === 'embedded' && (
                                        <>
                                          <div className="ss-message__content--user-calender-embedded">
                                            <DatePicker
                                              selected={startDate}
                                              onChange={(date) => setStartDate(date)}
                                              inline
                                            />
                                          </div>
                                        </>
                                      )}
                                      {/* calendar: type = 'start_end_date' */}
                                      {message.message_detail.type === 'start_end_date' && (
                                        <>
                                          <div
                                            style={{
                                              display: 'flex',
                                              flexWrap: 'wrap',
                                              marginLeft: '-4px',
                                              marginRight: '-4px',
                                            }}
                                          >
                                            <div
                                              style={{
                                                paddingLeft: '4px',
                                                paddingRight: '4px',
                                                flex: '50%',
                                                maxWidth: '50%',
                                              }}
                                            >
                                              <div className="ss-message__content--user-calender-date_selection">
                                                <MDBIcon
                                                  fas
                                                  icon="calendar"
                                                  className="ss-message__content--user-calender-icon-date_selection"
                                                />
                                              </div>
                                            </div>
                                            <div
                                              style={{
                                                paddingLeft: '4px',
                                                paddingRight: '4px',
                                                flex: '50%',
                                                maxWidth: '50%',
                                              }}
                                            >
                                              <div className="ss-message__content--user-calender-date_selection">
                                                <MDBIcon
                                                  fas
                                                  icon="calendar"
                                                  className="ss-message__content--user-calender-icon-date_selection"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                  {/* type == 'agree_to_term' */}
                                  {message.type === 'agree_to_term' && (
                                    <>
                                      <div className="ss-message__content--user-agree_to_term-top">
                                        <span className="ss-message__content--user-agree_to_term-title">
                                          Title
                                        </span>
                                        <span className="ss-message__content--user-agree_to_term-required">
                                          * required
                                        </span>
                                      </div>
                                      {/* agree_to_term: type = 'detail_content' */}
                                      {message.message_detail.type === 'detail_content' && (
                                        <>
                                          <div className="ss-message__content--user-agree_to_term-detail_content">
                                            <textarea
                                              name="ss-message__content--user-agree_to_term-detail_content"
                                              id=""
                                              rows="5"
                                              value={'Some terms'}
                                              className="ss-input-value"
                                              readOnly
                                            ></textarea>
                                          </div>
                                        </>
                                      )}
                                      {/* agree_to_term: type = 'post_link_only' */}
                                      {message.message_detail.type === 'post_link_only' && (
                                        <>
                                          <div className="ss-message__content--user-agree_to_term-post_link_only">
                                            <span style={{ marginRight: '8px' }}>comment</span>
                                            <Link to={(location) => location}>Term link</Link>
                                            <span style={{ marginLeft: '8px' }}>comment</span>
                                          </div>
                                        </>
                                      )}
                                      <div className="ss-message__content--user-agree_to_term-bottom">
                                        <input
                                          type="checkbox"
                                          name="ss-message__content--user-agree_to_term-bottom"
                                        />
                                        <span>I agree to these terms</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="ss-user-message__action-wrapper">
                                  <Button className="ss-user-message__action-btn">
                                    To the next
                                  </Button>
                                </div>
                              </div>

                              <div className="ss-chat-option">
                                <MDBIcon
                                  fas
                                  icon="pencil-alt"
                                  // style={{ marginTop: '10px' }}
                                  onClick={() => handleEditIconClick(message.id)}
                                ></MDBIcon>
                                <MDBIcon
                                  fas
                                  icon="grip-vertical"
                                  style={{ marginTop: '10px' }}
                                ></MDBIcon>
                                <div
                                  className={`ss-edit-option-wrapper ss-edit-option-wrapper-${message.id}`}
                                >
                                  <div className="ss-option-wrapper">
                                    <MDBIcon
                                      fas
                                      icon="copy"
                                      className="ss-add-option-icon"
                                    ></MDBIcon>
                                    <span>Copy</span>
                                  </div>
                                  <div className="ss-option-wrapper">
                                    <MDBIcon
                                      fas
                                      icon="eye-slash"
                                      className="ss-add-option-icon"
                                    ></MDBIcon>
                                    <span>Hidden</span>
                                  </div>
                                  <div className="ss-option-wrapper">
                                    <MDBIcon
                                      fas
                                      icon="trash"
                                      className="ss-add-option-icon"
                                    ></MDBIcon>
                                    <span>Delete</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ss-add-action-wrapper">
                              <MDBIcon fas icon="plus-circle" className="ss-add-icon"></MDBIcon>
                              <div className="ss-add-message-option-wrapper">
                                <div className="ss-option-wrapper">
                                  <MDBIcon
                                    fas
                                    icon="comment"
                                    className="ss-add-option-icon"
                                  ></MDBIcon>
                                  <span>Bot statement</span>
                                </div>
                                <div className="ss-option-wrapper">
                                  <MDBIcon
                                    fas
                                    icon="comment"
                                    className="ss-add-option-icon"
                                  ></MDBIcon>
                                  <span>User input</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* ss setting */}
                <div className="ss-sc-content ss-setting-wrapper">
                  {belongTo === 'bot' && (
                    <div id="bot-statement" className="ss-bot-statement-detail-setting">
                      {/* Bot setting detail below */}
                      <div style={{ padding: '10px' }}>
                        <label htmlFor="ss-bot-statement-title">Type</label>
                        <select
                          name="bot_statement_type"
                          id="ss-bot-statement-type"
                          className="ss-bot-statement-type ss-input-value"
                          value={messageType}
                          onChange={handleChangeBotStatementType}
                        >
                          <option value="text">Text</option>
                          <option value="file">File</option>
                          <option value="email">Email</option>
                          <option value="script">Script</option>
                          <option value="delay">Delay</option>
                          {/* <option value="api_link_age">Text</option> Pending */}
                        </select>

                        {/* type: text */}
                        {messageType === 'text' && (
                          <div className="ss-bot-statement-wrapper">
                            <div
                              id="ss-bot-statement-type-text"
                              className="ss-bot-statement-type-text ss-bot-statement-type"
                            >
                              <textarea
                                name="bot-statement-type-text-content"
                                id="bot-statement-type-text-content"
                                className="ss-bot-statement-type-text-content ss-input-value"
                                rows={5}
                                placeholder="Input..."
                                value={botTextValue}
                                onChange={(e) => setBotTextValue(e.target.value)}
                              ></textarea>
                            </div>
                            <div className="ss-bot-checkbox-scroll-auto">
                              <input
                                type="checkbox"
                                id="ss-bot-text-scroll-auto"
                                name="bot-text-scroll-auto"
                                checked={botIsScrollAuto}
                                onChange={(e) => setBotIsScrollAuto(!botIsScrollAuto)}
                              />
                              <label
                                htmlFor="ss-bot-text-scroll-auto"
                                className="ss-bot-statement-type-text__label"
                              >
                                Do not scroll automatically
                              </label>
                            </div>
                          </div>
                        )}

                        {/* type: file */}
                        {messageType === 'file' && (
                          <div className="ss-bot-statement-wrapper">
                            <div
                              id="ss-bot-statement-type-file"
                              className="ss-bot-statement-type-file ss-bot-statement-type"
                            >
                              {/* <img
                                src=""
                                id="bot-file-upload-img"
                                className="ss-bot-file-upload-img"
                                alt=""
                              /> */}
                              <textarea
                                name="bot-statement-type-file-content"
                                id="ss-bot-statement-type-file-content"
                                className="ss-bot-statement-type-file-content ss-input-value"
                                rows={5}
                                placeholder="File URL"
                              ></textarea>
                              <input
                                type="file"
                                id="ss-bot-file-upload"
                                name="bot-file-upload"
                                hidden
                                onChange={(e) => getBaseUrl(e)}
                              />
                              <div className="ss-file-upload-wrapper">
                                <span id="ss-bot-file-upload-name"></span>
                                <button className="ss-bot-file-upload-btn" onClick={botUploadFile}>
                                  Upload
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* type: email */}
                        {messageType === 'email' && (
                          <div className="ss-bot-statement-wrapper">
                            <div
                              id="ss-bot-statement-type-email"
                              className="ss-bot-statement-type-email ss-bot-statement-type"
                            >
                              <select
                                name="ss-bot-statement-type-email-select"
                                id="ss-bot-statement-type-email-select"
                                defaultValue={'default'}
                                className="ss-bot-statement-type-email-select ss-input-value"
                              >
                                <option value="default">Default</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* type: script */}
                        {messageType === 'script' && (
                          <div className="ss-bot-statement-wrapper">
                            <div
                              id="ss-bot-statement-type-script"
                              className="ss-bot-statement-type-script ss-bot-statement-type"
                            >
                              <textarea
                                name="bot-statement-type-script-content"
                                id="bot-statement-type-script-content"
                                className="ss-bot-statement-type-script-content ss-input-value"
                                rows={5}
                                placeholder="Script..."
                                value={botScriptValue}
                                onChange={(e) => setBotScriptValue(e.target.value)}
                              ></textarea>
                            </div>
                          </div>
                        )}

                        {/* type: delay */}
                        {messageType === 'delay' && (
                          <div className="ss-bot-statement-wrapper">
                            <div
                              id="ss-bot-statement-type-delay"
                              className="ss-bot-statement-type-delay ss-bot-statement-type"
                            >
                              <div className="ss-bot-statement-type-delay-wrapper">
                                <div className="ss-bot-statement-type-delay__value-wrapper">
                                  <span>Delay (seconds)</span>
                                  <input
                                    type="number"
                                    name="ss-bot-statement-type-delay__num"
                                    id="ss-bot-statement-type-delay__num"
                                    className="ss-bot-statement-type-delay__num ss-input-value"
                                    min={'0'}
                                    max={'10'}
                                    value={botDelayValue}
                                    onChange={(e) => setBotDelayValue(e.target.value)}
                                  />
                                </div>
                                <div className="ss-bot-statement-type-delay__checkbox-wrapper">
                                  <input
                                    type="checkbox"
                                    id="ss-bot-statement-type-delay__checkbox"
                                    name="ss-bot-statement-type-delay__checkbox"
                                    checked={botIsTurnOnTyping}
                                    onChange={(e) => setBotIsTurnOnTyping(!botIsTurnOnTyping)}
                                  />
                                  <label
                                    htmlFor="ss-bot-statement-type-delay__checkbox"
                                    className="ss-bot-statement-type-delay__checkbox-label"
                                  >
                                    Turn on typing index
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {belongTo === 'user' && (
                    <div id="user-chat" className="ss-user-chat-detail-setting ss-user-setting">
                      <div className="ss-user-setting__top">
                        <div className="ss-user-setting__name-wrapper">
                          <span>Name</span>
                          <input
                            type="text"
                            name="ss-user-setting__name"
                            placeholder="Enter chat name"
                            className="ss-user-setting__name-input ss-input-value"
                          />
                          <span className="ss-user-setting__name-error">* required</span>
                        </div>
                      </div>
                      <div className="ss-user-setting__main">
                        {data
                          .filter((message) => message.belong_to === 'user')
                          .map((message) => (
                            <>
                              <div className="ss-user-setting__item ss-user-setting__item--active">
                                <MDBIcon
                                  fas
                                  icon="times-circle"
                                  className="ss-user-setting__item-delete-btn"
                                />
                                {/* user: type = 'text_input' */}
                                {message.type === 'text_input' && (
                                  <>
                                    <div className="ss-user-setting__item-text_input-top">
                                      <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                        <input
                                          type="checkbox"
                                          name="ss-user-setting__item-text_input-save-variable"
                                        />
                                        <span>Save the input contents in a variable.</span>
                                      </div>
                                      <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                        <div>
                                          <input
                                            type="checkbox"
                                            name="ss-user-setting__item-text_input-use-api"
                                          />
                                          <span>Use APIs to validate input values.</span>
                                        </div>
                                        <div className="ss-user-setting__item-text_input-use-api-required">
                                          <input
                                            type="checkbox"
                                            name="ss-user-setting__item-text_input-use-api"
                                          />
                                          <span>Required</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-user-setting__item-select-bottom-wrapper">
                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                          <div className="ss-user-setting__item-select-bottom">
                                            <SelectCustom
                                              id="title"
                                              data={dropDownTitle}
                                              onChange={e => console.log(e)}
                                              keyValue="value"
                                            />
                                          </div>
                                          <div className="ss-user-setting__item-select-bottom">
                                            <SelectCustom
                                              id="type"
                                              data={rangeText}
                                              onChange={e => console.log(e)}
                                              keyValue="key"
                                            />
                                          </div>
                                        </div>
                                        <div className="ss-user-setting__item-select-bottom">
                                          <SelectCustom
                                            id="range"
                                            defaultValue="no_input"
                                            data={rangeText}
                                            onChange={e => console.log(e)}
                                            keyValue="key"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ss-user-setting__item-bottom-flex-start">
                                      <span className="ss-user-setting-lable">character limit</span>
                                      <input
                                        type="number"
                                        name="ss-user-setting__name"
                                        placeholder="0000"
                                        className="ss-user-setting-input-limit-character ss-input-value"
                                      />
                                      <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                      <input
                                        type="number"
                                        name="ss-user-setting__name"
                                        placeholder="0000"
                                        className="ss-user-setting-input-limit-character ss-input-value"
                                      />
                                    </div>
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-user-setting__item-select-bottom-wrapper">
                                        <input
                                          type="text"
                                          name="ss-user-setting__name"
                                          placeholder="Enter chat name"
                                          className="ss-user-setting__item-input-bottom ss-input-value"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          ))}
                      </div>
                      <div className="ss-user-setting__bottom">
                        <div className="ss-user-setting__select-wrapper">
                          <select
                            name="ss-user-setting__select-type"
                            id="ss-user-setting__select-type"
                            defaultValue={'text_input'}
                            onChange={(e) => setMessageType(e.target.value)}
                            className="ss-input-value"
                          >
                            <option value="text_input">Text input</option>
                            <option value="label">Label</option>
                            <option value="textarea">Textarea</option>
                            <option value="radio_button">Radio buttons</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="pull_down">Pull down</option>
                            <option value="zip_code_address">Zip code and address</option>
                            <option value="attaching_file">Attaching file</option>
                            <option value="calender">Calendar</option>
                            <option value="agree_to_term">Agree to terms</option>
                          </select>
                          <Button className="ss-user-setting__select-btn-add">Addition</Button>
                        </div>
                        <div className="ss-user-setting__checkbox-wrapper">
                          <input type="checkbox" name="ss-user-setting__checkbox" />
                          <span>Align to the beginning and stop</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const SelectCustom = ({ id, data, defaultValue, onChange, keyValue }) => {
  const [valueSelected, setValueSelected] = useState(() => {
    if (keyValue === 'key') {
      let value = data.find(value => value.key === defaultValue)?.value;
      return value;
    } else {
      return defaultValue;
    }
  });
  const [isToggleSelect, setIsToggleSelect] = useState(false);
  const [indexCurSelected, setIndexCurSelected] = useState('');
  const [keySelected, setKeySelected] = useState('');

  function handleClickSelect(e) {
    setIsToggleSelect(prevState => !prevState);
    e.stopPropagation();
  }

  function handleClickOutSelect() {
    setIsToggleSelect(false);
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutSelect);
    // document.getElementById(`ss-select-custom-${id}`).addEventListener('click', handleClickSelect);
  }, []);

  const onChangeSelectValue = (value, key) => {
    setValueSelected(value);
    keyValue === 'value' ? onChange(value) : onChange(key);
  }

  const handleHoverSelect = (index, value) => {
    if (valueSelected !== value) {
      document.querySelector(`.ss-select-item-${index}`).style.backgroundColor = '#DDDDDD';
      document.querySelector(`.ss-select-item-${index}`).style.color = 'black';
    }
  }

  const handleOutSelect = (index, value) => {
    if (valueSelected !== value) {
      document.querySelector(`.ss-select-item-${index}`).style.backgroundColor = '#5997FB';
      document.querySelector(`.ss-select-item-${index}`).style.color = '#fff';
    }
  }

  return (
    <React.Fragment>
      <div
        onClick={(e) => handleClickSelect(e)}
        id={`ss-select-custom-${id}`} className="ss-select-custom">
        <input
          name="ss-user-setting__select-type"
          id="ss-user-setting__select-type"
          className="ss-input-value"
          value={valueSelected}
          readOnly
        ></input>
        <i className="ss-custom-arrow-select arrow down"></i>
        <div style={!isToggleSelect ? { display: 'none' } : {}} className="ss-select-value-dropdown">
          <ul className="ss-select-value-items">
            {data.map(({ value, key }, index) => {
              return (
                <li
                  // onMouseOver={() => handleHoverSelect(index === value, value)}
                  // onMouseOut={() => handleOutSelect(index, value)}
                  className={`ss-select-item-${index}`}
                  onClick={() => onChangeSelectValue(value, key)}
                  style={valueSelected === value ? { backgroundColor: '#DDDDDD', color: 'black' } : {}}
                  key={index}
                  value={key}
                >
                  {value}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Scenario;
