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
import SelectCustom from './scenarioComon/Select';
import InputNum from './scenarioComon/InputNum';
import DataAnalyst from 'views/InstagramBotElement/DataAnalyst';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

let data = [
  {
    belong_to: 'bot',
    id: '1',
    message_content: [
      {
        name: '',

      }
    ]
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

let dataClone = {
  name: '',
  messages: [
    {
      id: '1',
      hidden: true,
      belong_to: 'user',
      message_content: [
        {
          id: 1,
          type: 'text',
          text_input: {
            //txtIn: text_input
            save_input_content: 'yes', // yes-no
            use_api_input_value: 'yes', // yes-no
            require: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'text', // 7 values: text, urls, email_address,
            //email_confirmation, phone_number, password, password_confirmation
            text: {
              range: '', // 8 values: no_input, alphabet, single_byte, alphanumeric_hyphen,
              //alphanumeric, double_byte, double_byte_hiragana, full_width_katakana
              character_limit_from: 1, //number
              character_limit_to: 1000, //number
              placeholder: '', //string
              comment: '', //string
            },
            url: '', //string
            email_address: '', //string
            email_confirmation: {
              cfEmlAdd_email: '', //string
              cfEmlAdd_confirm_email: '', //string
            },
            phone_number: '', //string
            password: {
              character_limit_from: 1, //number
              character_limit_to: 30, //number
              password: '', //string
            },
            confirm_password: {
              character_limit_from: 1, //number
              character_limit_to: 30, //number
              password: '', //string
              confirm_password: '', //string
            },
          },
          label: {
            lbl_content: '', //string
          },
          textarea: {
            save_input_content: '', //string
            required: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'text_input', // 3 values: text_input, invalid_input, consume_api_response(Pending)
            text_input: {
              character_limit_from: 1, //number
              character_limit_to: 30, //number
              content: '', //string
            },
            invalid_input_content: '', //string
          },
          radio_button: {
            save_input_content: 'yes', //yes-no
            required: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'default', //4 values: default, radio_button_img, block_style,consume_api_response(Pending)
            default: {
              default_text: '', //string
              default_value: '', //string
              initial_selection: 'yes', //yes-no
            },
            radio_button_img: {
              img: '', //base64
              img_title: '', //string
              img_value: '', //string
              initial_selection: 'yes', // yes-no
            },
            consume_api_response: '', //Pending
            block_style: {
              text: '', //string
              value: '', //string
              initial_selection: 'yes', // yes-no
            },
          },
          checkbox: {
            save_input_content: 'yes', //yes-no
            required: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            all_item_checked: 'yes', //yes-no
            type: 'default', // 3 values: default, checkbox_img, consume_api_response(Pending)
            default: {
              default_text: '', //string
              default_value: '', //string
            },
            checkbox_img: {
              img: '', //base64
              checkbox_img_title: '', //string
              checkbox_img_value: '', //string
            },
            consume_api_response: '', //(Pending)
          },
          pull_down: {
            save_input_content: '', //string
            required: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'customization', // 12 values: customization, time_hm, date_ymd, date_md, date_ym, date_ym_hm,dob_ymd,dob_ym, timezone_from_to, period_from_to,prefectures, up_to_municipality,
            customization: {
              time_from_to_comment: '', //string
              time_from_to: 'yes', //yes-no
              times: [
                {
                  from: '', //string,
                  to: '', //string
                },
              ],
              comment: '', //string
            },
            time_hm: {
              start_at: 2, //number
              end_at: 5, //number
              time: 2, //number
              minute: 30, //number
              every_minute: '0', //6 values: 0, 5, 10, 15, 30
              comment: '', //string
            },
            date_ymd: {
              start_year: 2022, //number
              end_year: 2022, //number
              year: 2022, //number
              month: 10, //number
              day: 25, //number
              comment: '', //string
            },
            date_md: {
              month: '', //string
              day: '', //string
              comment: '', //string
            },
            date_ym: {
              start_year: 2022, //number
              end_year: 2022, //number
              year: 2022, //number
              month: 10, //number
              comment: '', //string
            },
            date_ym_hm: {
              year: 2022, //string
              month: 10, //number
              day: 25, //number
              start_at: 2, //number
              end_at: 5, //number
              time: 2, //number
              minute: 30, //number
              every_minute: '0', //6 values: 0, 5, 10, 15, 30
              comment: '', //string
            },
            dob_ymd: {
              start_year: 2022, //number
              end_year: 2022, //number
              sort: 'asc', //asc-desc
              year: 2022, //number
              month: 10, //number
              day: 25, //number
              comment: '', //string
            },
            dob_ym: {
              start_year: 2022, //number
              end_year: 2022, //number
              sort: 'asc', //asc-desc
              year: 2022, //number
              month: 10, //number
              comment: '', //string
            },
            timezone_from_to: {
              range_start: 2, //number
              range_end: 5, //number
              hour_start_at: 2, //number
              hour_end_at: 3, //number
              minute_start_at: 10, //number
              minute_end_at: 15, //number
              every_minute_start_at: '5', //6 values: 0, 5, 10, 15, 30
              every_minute_end_at: '10', //6 values: 0, 5, 10, 15, 30
              comment: '', //string
            },
            period_from_to: {
              year_start_at: 2022, //number
              year_end_at: 2022, //number
              month_start_at: 10, //number
              month_end_at: 11, //number
              day_start_at: 25, //number
              day_end_at: 25, //number
              comment: '', //string
            },
            prefectures: '', //string
            up_to_municipality: {
              prefecture_comment: '', //string
              prefecture: '', //string
              city: '', //string
              city_comment: '', //string
            },
            comsume_api_response: '', //(Pending)
          },
          zip_code_address: {
            save_input_content: 'yes', // yes-no
            use_api_input_value: 'yes', // yes-no
            require: 'yes', //yes-no
            all_item_checked: 'yes', //yes-no
            split_postal_code: 'yes', //yes-no
            post_code: '', //string
            use_drop_down: 'yes', //yes-no
            prefecture: '', //string
            municipality: '', //string
            address: '', //string
            building_name: '', //string
          },
          attaching_file: {
            save_input_content: 'yes', // yes-no
            require: 'yes', //yes-no
            multifile_upload: 'yes', //yes-no
            file_type: [
              'jpg',
              'png', //.....
            ],
            file_content: '', //base64
          },
          calendar: {
            save_input_content: 'yes', // yes-no
            required: 'yes', //yes-no
            use_api_input_value: 'yes', // yes-no
            initial_selection: 'yes', // yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            start_date: '', //string
            end_date: '', //string
            non_select_date_time: '', //string
            fixed_date: [
              '2022/09/27',
              '2022/09/28', //...
            ],
            aggregation_target_period_from: 2, //number
            aggregation_target_period_to: 6, //number
            type: 'date_selection', //3 values: date_selection, embedded, start_end_date
            date_selection: {
              date_select: '', //string
            },
            embedded: {
              date_select: '', //string
            },
            start_end_date: {
              date_select: '', //string
              specified_period_from: 5, //number
              specified_period_to: 10, //number
            },
          },
          agree_term: {
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'detail_content', //2 values: detail_content, post_link_only
            term: '', //string
            detail_content: {
              content: '', //string
            },
            post_link_only: {
              title_comment: '', //string
              title: '', //string
              urls: '', //string
              url_comment: '', //string
            },
          },
        },
        {
          id: 2,
          type: 'label',
          textarea: {
            save_input_content: '', //string
            required: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'text_input', // 3 values: text_input, invalid_input, consume_api_response(Pending)
            text_input: {
              character_limit_from: 1, //number
              character_limit_to: 30, //number
              content: '', //string
            },
            invalid_input_content: '', //string
          },
        },
        {
          id: 3,
          type: 'textarea',
          textarea: {
            save_input_content: '', //string
            required: 'yes', //yes-no
            title_require: 'yes', //yes-no
            title: '', //string
            type: 'text_input', // 3 values: text_input, invalid_input, consume_api_response(Pending)
            text_input: {
              character_limit_from: 1, //number
              character_limit_to: 30, //number
              content: '', //string
            },
            invalid_input_content: '', //string
          },
        }
      ]
    },
    {
      id: '2',
      hidden: true,
      belong_to: 'bot',
      message_content: [
        {
          type: 'text',
          text: {
            content: '', //string
            scroll_auto: 'yes', //yes-no
          },
          email: {
            email_id: '', //id get from list email
          },
          file: {
            file_upload: '', //base64
            scroll_auto: 'yes', //yes-no
            file_type: '', //string
          },
          script: {
            script_content: '', //string
          },
          delay: {
            delay_second: 1, // number(range: 1-10)
            typing_on: 'yes', //yes-no
          },
          api_link_age: {
            //Pending
            api_id: '', // get from api list(pending)
          },
        }
      ]
    }
  ]
}

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
];

let type = [
  {
    key: 'text',
    value: 'text'
  },
  {
    key: 'urls',
    value: 'URLs'
  },
  {
    key: 'email_address',
    value: 'Email address'
  },
  {
    key: 'email_confirmation',
    value: 'Email address (with confirmation)'
  },
  {
    key: 'phone_number',
    value: 'Phone number'
  },
  {
    key: 'password',
    value: 'Password'
  },
  {
    key: 'password_confirmation',
    value: 'Password (with confirmation)'
  }
]

const Scenario = () => {
  // states
  const [scenarioName, setScenarioName] = useState('');
  const [belongTo, setBelongTo] = useState('bot');
  const [messageType, setMessageType] = useState('text');
  const [indexMessageSelect, setIndexMessageSelect] = useState('');
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
  const [dataMessages, setDataMessages] = useState([]);
  // side effects
  useEffect(() => {
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setDataMessages(dataClone.messages);
  }, [])

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
      document.getElementById('ss-bot-file-upload-name').innerHTML = event.target.files[0].name;
      if (baseString !== undefined || baseString !== '') {
        // document.getElementById('newClientImgLogoErrMsg').style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }

  // handle select message
  const handleSelectMessage = (index, belongTo, type) => {
    console.log(type, 'check type');
    Array.isArray(type) ? setMessageType(type[type.length - 1]?.type) : setMessageType(type);
    setBelongTo(belongTo);
    setIndexMessageSelect(index);
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (!ele.classList.contains(`ss-edit-option-wrapper-${index}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });
    document.querySelectorAll('.ss-message').forEach((ele) => {
      ele.classList.remove('ss-message--select');
      ele.classList.remove('ss-message--error');
    });
    document.querySelector(`.ss-message-${index}`).classList.add('ss-message--select');
  };

  // handle edit icon click
  const handleEditIconClick = (index) => {
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (!ele.classList.contains(`ss-edit-option-wrapper-${index}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });
    document
      .querySelector(`.ss-edit-option-wrapper-${index}`)
      .classList.toggle('ss-edit-option-wrapper--select');
  };

  // handle change bot statement type
  const handleChangeBotStatementType = (e) => {
    setMessageType(e.target.value);
    dataMessages.forEach((message, index) => {
      console.log(index, indexMessageSelect, 'checklkkkkasdlahjs');
      if (indexMessageSelect && index === indexMessageSelect) {
        message.message_content[0].type = e.target.value;
      }
    });
  };

  const handleAddItemSetting = () => {
    setDataMessages([
      ...dataMessages]);
  }

  const handleCopyMessage = (index) => {
    let messageCopy = dataMessages[index];
    setDataMessages([
      ...dataMessages,
      messageCopy]);

  }

  const handleRemoveMessageContent = (indexMessage, indexContent) => {
    // console.log(dataMessages[indexMessage].message_content.splice(indexContent, 1), indexMessage, indexContent);
    let arrMessage = [...dataMessages[indexMessage].message_content];
    let startArr = arrMessage.slice(0, indexContent);
    let lastArr = arrMessage.slice(indexContent + 1, arrMessage.length);
    console.log(arrMessage, [...startArr, ...lastArr]);
    for (let i = 0; i < dataMessages.length; i++) {
      if (indexMessage === i) {
        dataMessages[i].message_content = [...startArr, ...lastArr];
      }
    }
    console.log(dataMessages)
    setDataMessages([...dataMessages]);
  }

  const handleDragEnd = (result) => {
    console.log(result);
    let messageArr = dataMessages.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content;
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    for (let i = 0; i < dataMessages.length; i++) {
      if (indexMessageSelect === i) {
        dataMessages[i].message_content = items;
      }
    }
    setDataMessages([...dataMessages]);
  }

  console.log(dataMessages);

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
                  <div style={{ height: 'calc(100% - 44px)', backgroundColor: '#f6fbff' }}>
                    <div className="ss-overview-detail">
                      {console.log(dataMessages)}
                      {dataMessages.map((message, index) => {
                        let content;
                        if (message.belong_to === 'bot') content = message.message_content[0];

                        return message.belong_to === 'bot' ? (
                          <div key={index} className="ss-bot-chat-wrapper ss-message-wrapper">
                            <div
                              className={`ss-bot-chat ss-message ss-message--select ss-message-${index}`}
                            >
                              <div
                                className="ss-bot-chat-detail ss-message__detail"
                                onClick={() =>
                                  handleSelectMessage(index, message.belong_to, content.type)
                                }
                              >
                                <img className="ss-bot-ava" src={icon} alt="" />
                                {/* bot: type == 'text' */}
                                {content.type === 'text' && (
                                  <textarea
                                    className="ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value"
                                    value={botTextValue}
                                    readOnly
                                  ></textarea>
                                )}
                                {/* bot: type == 'file' */}
                                {/* file type: jpeg, jpg, png */}
                                {/* {content.type === 'file' && (
                                <div className="ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-img">
                                  <img
                                    src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/63354faaba626.jpg"
                                    alt=""
                                  />
                                </div>
                              )} */}

                                {/* file type: gif, mp4 */}
                                {/* {content.type === 'file' && (
                                <div className="ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-video">
                                  <video
                                    src="https://botchan.blob.core.windows.net/production/uploads/633180955bab416b487596eb/633551125f613.mp4"
                                    controls="controls"
                                  ></video>
                                </div>
                              )} */}

                                {/* file type: pdf */}
                                {content.type === 'file' && (
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
                                {content.type === 'email' && (
                                  <textarea
                                    className="ss-bot-chat-detail-content ss-message__content--bot-email ss-input-value"
                                    value={''}
                                    readOnly
                                  ></textarea>
                                )}

                                {/* bot: type == 'script' */}
                                {content.type === 'script' && (
                                  <textarea
                                    className="ss-bot-chat-detail-content ss-message__content--bot-script ss-input-value"
                                    value={botScriptValue}
                                    readOnly
                                  ></textarea>
                                )}
                                {/* bot: type == 'delay' */}
                                {content.type === 'delay' && (
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
                                    onClick={() => handleEditIconClick(index)}
                                  ></MDBIcon>
                                  <MDBIcon
                                    fas
                                    icon="grip-vertical"
                                    style={{ marginTop: '10px' }}
                                  ></MDBIcon>
                                  <div
                                    className={`ss-edit-option-wrapper ss-edit-option-wrapper-${index}`}
                                  >
                                    <div onClick={() => handleCopyMessage(index)} className="ss-option-wrapper">
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
                          <div key={index} className="ss-user-chat-wrapper ss-message-wrapper">
                            <div
                              className={`ss-user-chat ss-message ss-message--error ss-message-${index}`}
                            >
                              <div
                                className="ss-user-chat-detail ss-message__detail"
                                onClick={() =>
                                  handleSelectMessage(index, message.belong_to, message?.message_content)
                                }
                              >
                                <div className="ss-user-chat-detail-content">
                                  <div className="ss-user-message__content-wrapper">
                                    {message?.message_content.map((content, index) => {
                                      let textInput = content.text_input;
                                      let label = content.label;
                                      let textarea = content.textarea;
                                      let radioButton = content.radio_button;
                                      let checkbox = content.checkbox;
                                      let pullDown = content.pull_down;
                                      let zipCodeAddress = content.zip_code_address;
                                      let attachingFile = content.attaching_file;
                                      let calender = content.calendar;
                                      let agreeTerm = content.agree_term;

                                      return (
                                        <React.Fragment>
                                          {/* type == 'text_input' */}
                                          {
                                            content.type === 'text' && (
                                              <>
                                                <div className="ss-message__content--user-text-input-top">
                                                  <span className="ss-message__content--user-text-input-title">
                                                    {textInput.title}
                                                  </span>
                                                  {textInput.require === 'yes' &&
                                                    <span className="ss-message__content--user-text-input-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                {(textInput.type === 'text' ||
                                                  textInput.type === 'urls' ||
                                                  textInput.type === 'email_address' ||
                                                  textInput.type === 'phone_number' ||
                                                  textInput.type === 'password') && (
                                                    <input
                                                      className="ss-message__content--user-text-input ss-input-value"
                                                      readOnly
                                                      value={''}
                                                      disabled
                                                    ></input>
                                                  )}
                                                {(textInput.type === 'email_confirmation' ||
                                                  textInput.type === 'password_confirmation') &&
                                                  (<>
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
                                            )
                                          }
                                          {/* type == 'label' */}
                                          {
                                            content.type === 'label' && (
                                              <>
                                                <div className="ss-message__content--user-label-top">
                                                  {/* <span className="ss-message__content--user-label-title">
                                                    Label
                                                  </span> */}
                                                  {label?.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                              </>
                                            )
                                          }
                                          {/* type == 'textarea' */}
                                          {
                                            content.type === 'textarea' && (
                                              <>
                                                <div className="ss-message__content--user-textarea-top">
                                                  <span className="ss-message__content--user-textarea-title">
                                                    Title
                                                  </span>
                                                  {textarea.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                {(textarea?.type === 'text_input' ||
                                                  textarea?.type === 'invalid_input') && (
                                                    <textarea
                                                      className="ss-message__content--user-textarea ss-input-value"
                                                      readOnly
                                                      value={''}
                                                      rows={3}
                                                    ></textarea>
                                                  )}
                                                {textarea?.type === 'consume_api_response' && (
                                                  <textarea
                                                    className="ss-message__content--user-textarea ss-input-value"
                                                    readOnly
                                                    value={'入力値の検証にAPIを利用する'}
                                                    rows={3}
                                                  ></textarea>
                                                )}
                                              </>
                                            )
                                          }
                                          {/* type == 'radio_button' */}
                                          {
                                            message.type === 'radio_button' && (
                                              <>
                                                <div className="ss-message__content--user-radio_button-top">
                                                  <span className="ss-message__content--user-radio_button-title">
                                                    Title
                                                  </span>
                                                  {radioButton.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                <div className="ss-message__content--user-radio_button-wrapper">
                                                  {radioButton.type === 'default' && (
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
                                                  {radioButton.type === 'radio_button_img' && (
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
                                                  {radioButton.type === 'consume_api_response' && (
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
                                                  {radioButton.type === 'block_style' && (
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
                                            )
                                          }
                                          {/* type == 'checkbox' */}
                                          {
                                            message.type === 'checkbox' && (
                                              <>
                                                <div className="ss-message__content--user-checkbox-top">
                                                  <span className="ss-message__content--user-checkbox-title">
                                                    Title
                                                  </span>
                                                  {checkbox.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                <div className="ss-message__content--user-checkbox-wrapper">
                                                  {checkbox.type === 'default' && (
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
                                                  {checkbox.type === 'checkbox_img' && (
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
                                                  {checkbox.type === 'consume_api_response' && (
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
                                            )
                                          }
                                          {/* type == 'pull_down' */}
                                          {
                                            message.type === 'pull_down' && (
                                              <>
                                                <div className="ss-message__content--user-pull_down-top">
                                                  <span className="ss-message__content--user-pull_down-title">
                                                    Title
                                                  </span>
                                                  {pullDown.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                <div className="ss-message__content--user-pull_down-wrapper">
                                                  {pullDown.type === 'customization' && (
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
                                                  {(pullDown.type === 'time_hm' ||
                                                    pullDown.type === 'date_md' ||
                                                    pullDown.type === 'date_ym' ||
                                                    pullDown.type === 'dob_ym') && (
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
                                                  {(pullDown.type === 'date_ymd' ||
                                                    pullDown.type === 'dob_ymd') && (
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
                                                  {/* {pullDown.type === 'date_md' && <></>} */}
                                                  {/* {pullDown.type === 'date_ym' && <></>} */}
                                                  {pullDown.type === 'date_ym_hm' && (
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
                                                  {/* {pullDown === 'dob_ymd' && <></>} */}
                                                  {/* {pullDown === 'dob_ym' && <></>} */}
                                                  {pullDown.type === 'timezone_from_to' && (
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
                                                  {pullDown.type === 'period_from_to' && (
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
                                                  {pullDown.type === 'prefectures' && (
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
                                                  {pullDown.type === 'up_to_municipality' && (
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
                                            )
                                          }
                                          {/* type == 'zip_code_address' */}
                                          {
                                            message.type === 'zip_code_address' && (
                                              <>
                                                <div className="ss-message__content--user-zip_code_address-field">
                                                  <div className="ss-message__content--user-zip_code_address-top">
                                                    {zipCodeAddress.require === 'yes' &&
                                                      <span className="ss-message__content--user-required">
                                                        * required
                                                      </span>
                                                    }
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
                                                    {zipCodeAddress.require === 'yes' &&
                                                      <span className="ss-message__content--user-required">
                                                        * required
                                                      </span>
                                                    }
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
                                                    {zipCodeAddress.require === 'yes' &&
                                                      <span className="ss-message__content--user-required">
                                                        * required
                                                      </span>
                                                    }
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
                                                    {zipCodeAddress.require === 'yes' &&
                                                      <span className="ss-message__content--user-required">
                                                        * required
                                                      </span>
                                                    }
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
                                                    {zipCodeAddress.require === 'yes' &&
                                                      <span className="ss-message__content--user-required">
                                                        * required
                                                      </span>
                                                    }
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
                                            )
                                          }
                                          {/* type == 'attaching_file' */}
                                          {
                                            message.type === 'attaching_file' && (
                                              <>
                                                <div className="ss-message__content--user-attaching_file-top">
                                                  {attachingFile.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                <div className="ss-message__content--user-attaching_file">
                                                  <Button className="ss-message__content--user-attaching_file-btn">
                                                    Select file
                                                  </Button>
                                                </div>
                                              </>
                                            )
                                          }
                                          {/* type == 'calender' */}
                                          {
                                            message.type === 'calender' && (
                                              <>
                                                <div className="ss-message__content--user-calender-top">
                                                  <span className="ss-message__content--user-calender-title">
                                                    Title
                                                  </span>
                                                  {calender.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                {/* calendar: type = 'date_selection' */}
                                                {calender.type === 'date_selection' && (
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
                                                {calender.type === 'embedded' && (
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
                                                {calender.type === 'start_end_date' && (
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
                                            )
                                          }
                                          {/* type == 'agree_to_term' */}
                                          {
                                            message.type === 'agree_to_term' && (
                                              <>
                                                <div className="ss-message__content--user-agree_to_term-top">
                                                  <span className="ss-message__content--user-agree_to_term-title">
                                                    {agreeTerm.title}
                                                  </span>
                                                  {agreeTerm.require === 'yes' &&
                                                    <span className="ss-message__content--user-required">
                                                      * required
                                                    </span>
                                                  }
                                                </div>
                                                {/* agreeTerm: type = 'detail_content' */}
                                                {agreeTerm.type === 'detail_content' && (
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
                                                {/* agreeTerm: type = 'post_link_only' */}
                                                {agreeTerm.type === 'post_link_only' && (
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
                                            )
                                          }
                                        </React.Fragment>
                                      )
                                    })}
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
                                    onClick={() => handleEditIconClick(index)}
                                  ></MDBIcon>
                                  <MDBIcon
                                    fas
                                    icon="grip-vertical"
                                    style={{ marginTop: '10px' }}
                                  ></MDBIcon>
                                  <div
                                    className={`ss-edit-option-wrapper ss-edit-option-wrapper-${index}`}
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
                      })}

                    </div>
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
                          <div>
                            <span>Name</span>
                            <span className="ss-user-setting__name-error" style={{ marginLeft: '5px' }}>* required</span>
                          </div>
                          <input
                            type="text"
                            name="ss-user-setting__name"
                            placeholder="Enter chat name"
                            className="ss-user-setting__name-input ss-input-value"
                          />
                        </div>
                      </div>
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId='messages'>
                          {(provided) => (
                            <div className="ss-user-setting__main" {...provided.droppableProps} ref={provided.innerRef}>
                              {
                                dataMessages
                                  .filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
                                  .map((content, indexContent) => {
                                    console.log(content, indexContent)
                                    return (
                                      <Draggable draggable={true} key={content.id} draggableId={content.id + ''} index={indexContent}>
                                        {(provided) => (
                                          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} style={{ marginBottom: '10px' }}>
                                            <div className="ss-user-setting__item ss-user-setting__item--active">
                                              <MDBIcon
                                                fas
                                                icon="times-circle"
                                                className="ss-user-setting__item-delete-btn"
                                                onClick={() => handleRemoveMessageContent(indexMessageSelect, indexContent)}
                                              />
                                              {/* user: type = 'text_input' */}
                                              {content.type === 'text' && (
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
                                                            value="yes"
                                                            data={dropDownTitle}
                                                            onChange={e => console.log(e)}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-select-bottom">
                                                          <SelectCustom
                                                            id="type"
                                                            value="password"
                                                            data={type}
                                                            onChange={e => console.log(e)}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-select-bottom">
                                                        <SelectCustom
                                                          id="range"
                                                          value="no_input"
                                                          data={rangeText}
                                                          onChange={e => console.log(e)}
                                                          keyValue="key"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="ss-user-setting__item-bottom-flex-start">
                                                    <span className="ss-user-setting-label">character limit</span>
                                                    <InputNum
                                                      placeholder="0000"
                                                      className="ss-user-setting-input-limit-character"
                                                      min={1}
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
                                              {/* user: type = 'label' */}
                                              {content.type === 'label' && (
                                                <>
                                                  <div className="ss-user-setting__item-bottom">
                                                    <textarea
                                                      className="ss-user-setting-item-textarea-label ss-input-value"
                                                      placeholder="input"
                                                      rows="5"
                                                    ></textarea>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  })
                              }
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <div className="ss-user-setting__bottom">
                        <div className="ss-user-setting__select-wrapper">
                          <select
                            name="ss-user-setting__select-type"
                            id="ss-user-setting__select-type"
                            defaultValue={'text_input'}
                            onChange={(e) => setMessageType(e.target.value)}
                            className="ss-input-value"
                            value={messageType}
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
                          <Button className="ss-user-setting__select-btn-add" onClick={() => handleAddItemSetting(messageType)}>Addition</Button>
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

export default Scenario;
