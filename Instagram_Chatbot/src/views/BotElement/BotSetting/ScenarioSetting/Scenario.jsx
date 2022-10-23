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
import SelectCustom from './scenarioComon/SelectCustom';
import CheckboxCustom from './scenarioComon/CheckboxCustom';
import InputNum from './scenarioComon/InputNum';
import InputDouble from './scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from './scenarioComon/InputCustom';
import moment from 'moment';
import api from '../../../../api/api-management';
import Cookies from 'js-cookie';
import ModalNoti from '../../../../views/Popup/ModalNoti';
import ModalShort from '../../../Popup/ModalShort';
const _ = require('lodash');

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

let dataHour = [];
for (let i = 1; i <= 24; i++) {
  dataHour.push({
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

let dataYear = [];
for (let i = 1935; i <= 2072; i++) {
  dataYear.push({
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


let dataClone = {
  name: '',
  messages: [
    {
      id: 1,
      name: '',
      hidden: false,
      belong_to: 'user',
      message_content: [
        {
          id: 11,
          type: 'pull_down',
          pull_down: {
            save_input_content: '', //string
            required: true, //yes-no
            title_require: true, //yes-no
            title: '', //string
            type: 'customization', // 12 values: customization, time_hm, date_ymd, date_md, date_ym, date_ymd_hm, dob_ymd, dob_ym, timezone_from_to, period_from_to,prefectures, up_to_municipality,
            customization: {
              title_comment: '', //string
              comment: '', //string
              is_comment: true, //yes-no,
              display_unselected: '',
              options_with_comment: [
                {
                  id: 1,
                  text: '',
                  value: '',
                  text2: '',
                  value2: ''
                }
              ],
              options_without_comment: [
                {
                  id: 1,
                  text: '',
                  value: ''
                }
              ],
            },
            time_hm: {
              start_at: '2', //number
              end_at: '5', //number
              time: '2', //number
              minute: '30', //number
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
            date_ymd_hm: {
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
        },
        {
          id: 10,
          type: 'agree_term',
          agree_term: {
            title_require: true, //yes-no
            title: '', //string
            type: 'detail_content', //2 values: detail_content, post_link_only
            term: '', //string
            detail_content: {
              content: '', //string
            },
            post_link_only: [
              {
                title_comment: '', //string
                title: '', //string
                urls: '', //string
                url_comment: '', //string
              },
            ],
          },
        },
        {
          id: 9,
          type: 'calendar',
          calendar: {
            save_input_content: true, // yes-no
            required: true, //yes-no
            use_api_input_value: true, // yes-no
            initial_selection: true, // yes-no
            title_require: true, //yes-no
            title: '', //string
            start_date: '', //string
            end_date: '', //string
            non_select_date_time: [], //string
            aggregation_target_period_from: 2, //number
            aggregation_target_period_to: 6, //number
            type: 'date_selection', //3 values: date_selection, embedded, start_end_date
            fixed_date: [
              '2022/09/27',
              '2022/09/28', //...
            ],
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
          }
        },
        {
          id: 8,
          type: 'attaching_file',
          attaching_file: {
            save_input_content: true, // yes-no
            require: true, //yes-no
            multifile_upload: true, //yes-no
            file_type: [
              'jpg',
              'png', //.....
            ],
            file_content: '', //base64
          },
        },
        {
          id: 7,
          type: 'zip_code_address',
          zip_code_address: {
            save_input_content: true, // yes-no
            use_api_input_value: true, // yes-no
            require: true, //yes-no
            all_items_require: true, //yes-no
            split_postal_code: true, //yes-no
            post_code: '', //string
            use_drop_down: true, //yes-no
            prefecture: '', //string
            municipality: '', //string
            address: '', //string
            building_name: '', //string
          },
        },
        {
          id: 6,
          type: 'checkbox',
          checkbox: {
            save_input_content: true, //yes-no
            required: true, //yes-no
            title_require: true, //yes-no
            title: '', //string
            all_item_checked: true, //yes-no
            type: 'default', // 3 values: default, checkbox_img, consume_api_response(Pending)
            default: [
              {
                default_text: '', //string
                default_value: '', //string
              }
            ],
            checkbox_img: [
              {
                img: '', //base64
                checkbox_img_title: '', //string
                checkbox_img_value: '', //string
              }
            ],
            consume_api_response: '', //(Pending)
          },
        },
        {
          id: 5,
          type: 'radio_button',
          radio_button: {
            save_input_content: true, //true-false
            required: true, //true-false
            title_require: true, //true-false
            title: '', //string
            type: 'default', //4 values: default, radio_button_img, block_style,consume_api_response(Pending)
            default: [
              {
                id: 1,
                default_text: '', //string
                default_value: '', //string
                initial_selection: true, //true-false
              },
              {
                id: 2,
                default_text: '', //string
                default_value: '', //string
                initial_selection: true, //true-false
              }
            ],
            radio_button_img: [
              {
                id: 1,
                img: '', //base64
                img_title: '', //string
                img_value: '', //string
                initial_selection: true, // true-false
              },
              {
                id: 2,
                img: '', //base64
                img_title: '', //string
                img_value: '', //string
                initial_selection: true, // true-false
              },
            ],
            consume_api_response: '', //Pending            
          },
        },
        {
          id: 1,
          type: 'text_input',
          text_input: {
            //txtIn: text_input
            save_input_content: true, // yes-no
            use_api_input_value: true, // yes-no
            require: true, //yes-no
            title_require: true, //yes-no
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
            phone_number: {
              withHyphen: true,
              number: '' //string
            }, //string
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
            required: true, //yes-no
            title_require: true, //yes-no
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
            save_input_content: true, //yes-no
            required: true, //yes-no
            title_require: true, //yes-no
            title: '', //string
            type: 'default', //4 values: default, radio_button_img, block_style,consume_api_response(Pending)
            default: {
              default_text: '', //string
              default_value: '', //string
              initial_selection: true, //yes-no
            },
            radio_button_img: {
              img: '', //base64
              img_title: '', //string
              img_value: '', //string
              initial_selection: true, // yes-no
            },
            consume_api_response: '', //Pending
            block_style: {
              text: '', //string
              value: '', //string
              initial_selection: true, // yes-no
            },
          },
          checkbox: {
            save_input_content: true, //yes-no
            required: true, //yes-no
            title_require: true, //yes-no
            title: '', //string
            all_item_checked: true, //yes-no
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
            required: true, //yes-no
            title_require: true, //yes-no
            title: '', //string
            type: 'customization', // 12 values: customization, time_hm, date_ymd, date_md, date_ym, date_ym_hm,dob_ymd,dob_ym, timezone_from_to, period_from_to,prefectures, up_to_municipality,
            customization: {
              time_from_to_comment: '', //string
              time_from_to: true, //yes-no
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
            save_input_content: true, // yes-no
            use_api_input_value: true, // yes-no
            require: true, //yes-no
            all_item_checked: true, //yes-no
            split_postal_code: true, //yes-no
            post_code: '', //string
            use_drop_down: true, //yes-no
            prefecture: '', //string
            municipality: '', //string
            address: '', //string
            building_name: '', //string
          },
          attaching_file: {
            save_input_content: true, // yes-no
            require: true, //yes-no
            multifile_upload: true, //yes-no
            file_type: [
              'jpg',
              'png', //.....
            ],
            file_content: '', //base64
          },
          calendar: {
            save_input_content: true, // yes-no
            required: true, //yes-no
            use_api_input_value: true, // yes-no
            initial_selection: true, // yes-no
            title_require: true, //yes-no
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
            title_require: true, //yes-no
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
          id: 3,
          type: 'textarea',
          textarea: {
            save_input_content: true,
            required: true, //yes-no
            title_require: true, //yes-no
            title: '', //string
            type: 'text', // 3 values: text_input, invalid_input, consume_api_response(Pending)
            text_input: {
              character_limit_from: 1, //number
              character_limit_to: 30, //number
              content: '', //string
            },
            invalid_input_content: '', //string
          },
        },
        {
          id: 2,
          type: 'label',
          label: {
            lbl_content: '', //string
          },
        },
        {
          id: 4,
          type: 'text_input',
          text_input: {
            //txtIn: text_input
            save_input_content: true, // yes-no
            use_api_input_value: true, // yes-no
            require: true, //yes-no
            title_require: true, //yes-no
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
            phone_number: {
              withHyphen: true,
              number: '' //string
            }, //string
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
          }
        }
      ]
    },
    {
      id: 2,
      hidden: false,
      belong_to: 'bot',
      message_content: [
        {
          type: 'text_input',
          text_input: {
            content: '', //string
            scroll_auto: true, //yes-no
          },
          email: {
            email_id: '', //id get from list email
          },
          file: {
            file_upload: '', //base64
            scroll_auto: true, //yes-no
            file_type: '', //string
          },
          script: {
            script_content: '', //string
          },
          delay: {
            delay_second: 1, // number(range: 1-10)
            typing_on: true, //yes-no
          },
          api_link_age: {
            //Pending
            api_id: '', // get from api list(pending)
          },
        }
      ]
    },
    {
      id: 3,
      hidden: false,
      belong_to: 'bot',
      message_content: [
        {
          type: 'text_input',
          text_input: {
            content: '', //string
            scroll_auto: true, //yes-no
          },
          email: {
            email_id: '', //id get from list email
          },
          file: {
            file_upload: '', //base64
            scroll_auto: true, //yes-no
            file_type: '', //string
          },
          script: {
            script_content: '', //string
          },
          delay: {
            delay_second: 1, // number(range: 1-10)
            typing_on: true, //yes-no
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

let dataConsumeApiResponse = [];

let agreeTermType = [
  {
    key: 'detail_content',
    value: 'Detail content display',
  },
  {
    key: 'post_link_only',
    value: 'Post link only',
  },
]

let dataTypeFile = [
  {
    key: 'jpegs',
    value: 'jpegs',
  },
  {
    key: 'jpg',
    value: 'jpg',
  },
  {
    key: 'png',
    value: 'png',
  },
  {
    key: 'gifs',
    value: 'gifs',
  },
  {
    key: 'zip',
    value: 'zip',
  },
  {
    key: 'rar',
    value: 'rar',
  },
  {
    key: 'doc',
    value: 'doc',
  },
  {
    key: 'docx',
    value: 'docx',
  },
  {
    key: 'numbers',
    value: 'numbers',
  },
  {
    key: 'pdf',
    value: 'pdf',
  },
  {
    key: 'mp4',
    value: 'mp4',
  },
  {
    key: 'webm',
    value: 'webm',
  },
  {
    key: 'ogv',
    value: 'ogv',
  },
  {
    key: 'csv',
    value: 'csv',
  },
  {
    key: 'xlsm',
    value: 'xlsm',
  },
  {
    key: 'xlsx',
    value: 'xlsx',
  },
  {
    key: 'xls',
    value: 'xls',
  },
  {
    key: 'TXT',
    value: 'TXT',
  },
  {
    key: 'ppt',
    value: 'ppt',
  },
  {
    key: 'pptx',
    value: 'pptx',
  },
  {
    key: 'pages',
    value: 'pages',
  },
  {
    key: 'key',
    value: 'key',
  },
  {
    key: 'odds',
    value: 'odds',
  },
  {
    key: 'odt',
    value: 'odt',
  },
  {
    key: 'odp',
    value: 'odp',
  },
]

let inputContentVar = [

]

let typeCalendar = [
  {
    key: 'date_selection',
    value: 'Date selection'
  },
  {
    key: 'embedded',
    value: 'Embedded'
  },
  {
    key: 'start_end_date',
    value: 'Start date to end date'
  }
]

let dropDownTitle = [
  {
    key: false,
    value: 'No title'
  },
  {
    key: true,
    value: 'With title'
  }
];

let typeTextarea = [
  {
    key: 'text_input',
    value: 'Text input'
  },
  {
    key: 'invalid_input',
    value: 'Invalid input'
  },
  {
    key: 'consume_api_response',
    value: 'Consume API response'
  },
]

let typeRadio = [
  {
    key: 'default',
    value: 'Default'
  },
  {
    key: 'radio_button_img',
    value: 'Radio button with image'
  },
  {
    key: 'consume_api_response',
    value: 'Consume API response'
  },
  {
    key: 'block_style',
    value: 'Block style'
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

let hyphenPhoneNumber = [
  {
    key: false,
    value: 'No hyphen'
  },
  {
    key: true,
    value: 'With hyphens'
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
];

let typeCheckbox = [
  {
    key: 'default',
    value: 'Default'
  },
  {
    key: 'checkbox_img',
    value: 'Checkbox with image'
  },
  {
    key: 'consume_api_response',
    value: 'Consume API response'
  }
]

let dataSelectDateTime = [
  {
    key: 'today',
    value: 'Today'
  },
  {
    key: 'tomorrow',
    value: 'Tomorrow'
  },
  {
    key: 'day_after_tomorrow',
    value: 'Day after tomorrow'
  },
  {
    key: 'past',
    value: 'Past'
  },
  {
    key: 'future',
    value: 'Future'
  },
  {
    key: 'moon',
    value: 'Moon'
  },
  {
    key: 'fire',
    value: 'Fire'
  },
  {
    key: 'water',
    value: 'Water'
  },
  {
    key: 'wood',
    value: 'Wood'
  },
  {
    key: 'money',
    value: 'Money'
  },
  {
    key: 'soil',
    value: 'Soil'
  },
  {
    key: 'day',
    value: 'Day'
  }
];

let dataTypePullDown = [
  {
    key: 'customization',
    value: 'Customization'
  },
  {
    key: 'time_hm',
    value: 'Time (H:m)'
  },
  {
    key: 'date_ymd',
    value: 'Date (Ymd)'
  },
  {
    key: 'date_md',
    value: 'Date (Md)'
  },
  {
    key: 'date_ym',
    value: 'Date (Ym)'
  },
  {
    key: 'date_ymd_hm',
    value: 'Date and time (Ymd H:m)'
  },
  {
    key: 'dob_ymd',
    value: 'Date of birth (Ymd)'
  },
  {
    key: 'dob_ym',
    value: 'Date of birth (Ym)'
  },
  {
    key: 'timezone_from_to',
    value: 'Time zone (H:m to H:m)'
  },
  {
    key: 'period_from_to',
    value: 'Period (Ymd to Ymd)'
  },
  {
    key: 'prefectures',
    value: 'Prefectures'
  },
  {
    key: 'up_to_municipality',
    value: 'Up to municipality'
  },
  {
    key: 'comsume_api_response',
    value: 'Consume API response'
  }
];

let dataCondition = [
  {
    key: 'current_url',
    value: 'current_url'
  },
  {
    key: 'current_url_param',
    value: 'current_url_param'
  },
  {
    key: 'current_url_title',
    value: 'current_url_title'
  },
  {
    key: 'user_id',
    value: 'user_id'
  },
  {
    key: 'bot_id',
    value: 'bot_id'
  },
  {
    key: 'preview_flg',
    value: 'preview_flg'
  },
  {
    key: 'user_ip_address',
    value: 'user_ip_address'
  },
  {
    key: 'user_country',
    value: 'user_country'
  },
  {
    key: 'user_city',
    value: 'user_city'
  },
  {
    key: 'user_device',
    value: 'user_device'
  },
  {
    key: 'user_browser',
    value: 'user_browser'
  },
  {
    key: 'user_agent',
    value: 'user_agent'
  },
  {
    key: 'cv_flg',
    value: 'cv_flg'
  },
  {
    key: 'start_datetime',
    value: 'start_datetime'
  },
  {
    key: 'user_referer_firstopen',
    value: 'user_referer_firstopen'
  },
  {
    key: 'user_referer_current',
    value: 'user_referer_current'
  },
  {
    key: 'churn_block_passed',
    value: 'churn_block_passed'
  },
  {
    key: 'prevention_block_passed',
    value: 'prevention_block_passed'
  },
  {
    key: 'churn_request_flag',
    value: 'churn_request_flag'
  },
  {
    key: 'Phone number_hyphen',
    value: 'Phone number_hyphen'
  },
  {
    key: 'Address_zip code 1',
    value: 'Address_zip code 1'
  },
  {
    key: 'Address_Building name',
    value: 'Address_Building name'
  },
  {
    key: 'address',
    value: 'address'
  },
  {
    key: 'email address',
    value: 'email address'
  },
  {
    key: 'phone number',
    value: 'phone number'
  },
  {
    key: 'sex',
    value: 'sex'
  },
  {
    key: 'date of birth',
    value: 'date of birth'
  },
  {
    key: 'Address_zip code',
    value: 'Address_zip code'
  },
  {
    key: 'Address_postal code with hyphens',
    value: 'Address_postal code with hyphens'
  },
  {
    key: 'Address_zip code 1h',
    value: 'Address_zip code 1h'
  },
  {
    key: 'Address_zip code 2',
    value: 'Address_zip code 2'
  },
  {
    key: 'Address_Prefecture',
    value: 'Address_Prefecture'
  },
  {
    key: 'Address_City',
    value: 'Address_City'
  },
  {
    key: 'street address',
    value: 'street address'
  }
];

let dataSubCondition = [
  {
    key: 'is',
    value: 'is'
  },
  {
    key: 'is_not',
    value: 'is not'
  },
  {
    key: 'include',
    value: 'include'
  },
  {
    key: 'not_include',
    value: 'not include'
  }
]

const Scenario = () => {
  // states
  const [scenarioName, setScenarioName] = useState('');
  const [belongTo, setBelongTo] = useState('bot');
  const [messageType, setMessageType] = useState('text_input');
  const [indexMessageSelect, setIndexMessageSelect] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [indexMessageContentSelect, setIndexMessageContentSelect] = useState('');
  const [dataSelecteFixed, setDataSelecteFixed] = useState(new Date());
  const [checkInitialRaido, setCheckInitialRaido] = useState();
  // bot setting values
  const [botTextValue, setBotTextValue] = useState('');
  const [isOpenAddVariable, setIsOpenAddVariable] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [isClickPlus, setIsClickPlus] = useState(false);

  const [startDateClone, setStartDateClone] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // user setting values
  const [dataMessages, setDataMessages] = useState([]);

  const [dataPrefectures, setDataPrefectures] = useState([]);
  const [dataCity, setDataCity] = useState([]);

  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [scenarioId, setScenarioId] = useState(Cookies.get('scenario_id'));

  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState('');
  const [dataEmail, setDataEmail] = useState([]);

  const [isConditionUp, setIsConditionUp] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [variableName, setVariableName] = useState('');
  const [defaultName, setDefaultName] = useState('');
  // side effects

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
    setScenarioId(Cookies.get('scenario_id'));
  }, [])

  useEffect(() => {
    handleGetMessage();
  }, [])


  // useEffect(() => {
  //   setDataMessages(dataClone.messages);
  // }, [])

  useEffect(() => {
    api.get(`/api/v1/prefectures`).then((res) => {
      // console.log(res.data.data);
      setDataPrefectures(res.data.data);
    }).catch((error) => { console.error(error) });
  }, [])

  useEffect(() => {
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

  const handleGetMessage = () => {
    api.get(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`).then((res) => {
      console.log(res.data.data);
      setDataMessages(res.data.data?.conversation?.messages);
      setScenarioName(res.data.data?.conversation?.scenarioName || '');
    }).catch((error) => { console.error(error) });
  }

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
    console.log(index, type, 'check type');
    if (type) {
      Array.isArray(type) ? setMessageType(type[type.length - 1]?.type) : setMessageType(type);
    };
    let indexLastEle = dataMessages[index].message_content.length - 1;

    setBelongTo(belongTo);
    setMessageType(dataMessages[index].message_content[indexLastEle]?.type || 'text_input');
    setIndexMessageSelect(index);
    setIsConditionUp(false);
    if (belongTo === 'bot' && document.querySelector('.ss-bot-setting-condition-container')) {
      document.querySelector('.ss-bot-setting-condition-container').style.height = '20%';
    } else if (belongTo === 'user' && document.querySelector('.ss-user-setting__main')) {
      document.querySelector('.ss-user-setting__main').style.height = '57%';
    }

    //Change border color for last ele message content
    document.querySelector(`.ss-user-setting__item-${indexLastEle}`) && document.querySelector(`.ss-user-setting__item-${indexLastEle}`).classList.add('ss-user-setting__item--active');

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

  const handleHiddenMessage = (index) => {
    dataMessages[index].hidden = !dataMessages[index].hidden;

    document.querySelectorAll('.ss-bot-chat-detail-content').forEach((ele) => {
      if (ele.classList.contains(`ss-bot-chat-overview-${index}`)) {
        if (!dataMessages[index].hidden) ele.style.opacity = '1'
        if (dataMessages[index].hidden) ele.style.opacity = '0.4'
      }
    });
    setDataMessages([...dataMessages]);
  }

  const handleSelectContentMessage = (indexContent, contentType) => {
    console.log(indexContent, contentType);
    // setIndexMessageContentSelect(indexContent);
    setMessageType(contentType);
    document.querySelectorAll('.ss-user-setting__item').forEach((ele) => {
      if (!ele.classList.contains(`ss-user-setting__item-${indexContent}`)) {
        ele.classList.remove('ss-user-setting__item--active');
      }
    });
    document.querySelector(`.ss-user-setting__item-${indexContent}`).classList.add('ss-user-setting__item--active');
  }

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
  }

  // handle change bot statement type
  const handleChangeBotStatementType = (value) => {
    setMessageType(value);
    // dataMessages && dataMessages.forEach((message, index) => {
    //   console.log(index, indexMessageSelect, value, message, 'checklkkkkasdlahjs');
    //   if (indexMessageSelect && index === indexMessageSelect) {
    //     message.message_content[0].type = value;
    //   }
    // });
    let data = [...dataMessages];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (indexMessageSelect !== undefined && i === indexMessageSelect) {
          console.log(i, indexMessageSelect, value, 'checklkkkkasdlahjs');
          data[i].message_content[0].type = value;
        }
      }
    }
    console.log(data, 'chekckkkajsdlajsld');
    // setDataMessages([...data]);
  };

  const handleAddItemSetting = (messageType) => {
    let arrMess = [...dataMessages[indexMessageSelect].message_content];
    let idMax;
    if (arrMess.length !== 0) {
      idMax = Math.max(...arrMess.map(item => item.id)) + 1;
    } else {
      idMax = 1;
    }
    let subType;
    console.log(arrMess, idMax, messageType);
    if (messageType === 'zip_code_address') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            post_code: '',
            is_use_dropdown: false,
            prefecture: null,
            municipality: '',
            address: '',
            building_name: '',
            split_postal_code: false
          }
        }
      );
    } else if (messageType === 'radio_button') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'default',
            default: [{ id: 1 }],
            radio_button_img: [{ id: 1 }],
            block_style: [{ id: 1 }]
          }
        }
      );
    } else if (messageType === 'text_input') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'text',
            text: {
              range: 'no_input',
              isSplitInput: false
            },
            url: '', //string
            email_address: '', //string
            email_confirmation: {},
            phone_number: {
              withHyphen: false,
            },
            password: {},
            password_confirmation: {}
          }
        }
      );
    } else if (messageType === 'checkbox') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'default',
            default: [{ id: 1 }],
            checkbox_img: [{ id: 1 }],
          }
        }
      );
    } else if (messageType === 'pull_down') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'customization',
            customization: {
              display_unselected: '選択してください',
              is_comment: false,
              options_with_comment: [],
              options_without_comment: []
            },
            time_hm: {},
            date_ymd: {},
            date_md: {},
            date_ym: {},
            date_ymd_hm: {},
            dob_ymd: {},
            dob_ym: {},
            timezone_from_to: {},
            period_from_to: {},
            up_to_municipality: {},

          }
        }
      );
    } else if (messageType === 'attaching_file') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            file_type: []
          },
        }
      );
    } else if (messageType === 'calendar') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'date_selection',
            fixed_date: [],
            date_selection: {},
            embedded: {},
            start_end_date: {}
          }
        }
      );
    } else if (messageType === 'agree_term') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'detail_content',
            detail_content: {},
            post_link_only: [
              {}
            ]
          }
        }
      );
    } else if (messageType === 'textarea') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'text_input',
            text_input: {}
          }
        }
      );
    } else {
      if (messageType === 'text_input') subType = 'text';
      if (messageType === 'agree_term') subType = 'detail_content';

      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: subType,
            [subType]: {

            }
          }
        }
      );
    }

    setDataMessages([
      ...dataMessages]);
  }

  const handleCopyMessage = (index) => {
    console.log(index);
    let idMax = Math.max(...dataMessages.map(item => item.id)) + 1;
    let arrMessage = _.cloneDeep(dataMessages[index]);
    arrMessage.id = idMax;

    dataMessages.splice(index, 0, arrMessage);
    console.log(arrMessage, dataMessages[index]);
    setDataMessages([...dataMessages]);

  }

  const handleDeleteMessageContent = (indexMessage, indexContent) => {
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
    console.log(messageType);
    setDataMessages([...dataMessages]);
  }

  const handleDeleteMessage = (index) => {
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (ele.classList.contains(`ss-edit-option-wrapper-${index}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });

    let startArr = dataMessages.slice(0, index);
    let lastArr = dataMessages.slice(index + 1, dataMessages.length);
    setDataMessages([...startArr, ...lastArr]);
  }

  const handleAddItemRadioCheckbox = (indexMessage, indexContent, type, contentType) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    console.log(arr, contentType);
    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][type][contentType] = [];
      arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    }
    let idMax;
    if (arr.length !== 0) {
      idMax = Math.max(...arr.map(item => item.id)) + 1;
    } else {
      idMax = 1;
    }
    if (type === 'radio_button') {
      arr.push({
        id: idMax,
      });
    } else {
      arr.push({
        id: idMax
      });
    }
    setDataMessages([...dataMessages]);
  }

  const handleAddItemCustomizePullDown = (indexMessage, indexContent, contentType, pullDownType, name) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name];
    console.log(arr, contentType);
    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name] = [];
      arr = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name];
    }
    let idMax;
    if (arr.length !== 0) {
      idMax = Math.max(...arr.map(item => item.id)) + 1;
    } else {
      idMax = 1;
    }

    arr.push({
      id: idMax
    });
    setDataMessages([...dataMessages]);
  }

  const handleAddItemAgreeTerm = (indexMessage, indexContent, type, contentType) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][type][contentType] = [];
      arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    }

    arr.push({
      title_comment: '', //string
      title: '', //string
      urls: '', //string
      url_comment: '', //string
    });
    setDataMessages([...dataMessages]);
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    let messageArr = dataMessages.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content;
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dataMessages[indexMessageSelect].message_content = items;
    setDataMessages([...dataMessages]);
  }

  const handleDragEndMessageOverview = (result) => {
    if (!result.destination) return;
    let messageArr = [...dataMessages];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDataMessages([...items]);
  }

  const handleDragEndRadioCheckbox = (result, idContent, type, contentType) => {
    if (!result.destination) return;
    let messageArr = dataMessages.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
      .filter(content => content.id === idContent)[0][type][contentType];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let indexItem;
    for (let i = 0; i < dataMessages[indexMessageSelect].message_content.length; i++) {
      if (dataMessages[indexMessageSelect].message_content[i].id === idContent) {
        indexItem = i;
      }
    }
    dataMessages[indexMessageSelect].message_content[indexItem][type][contentType] = items;
    setDataMessages([...dataMessages]);
  }

  const handleDragEndPullDown = (result, idContent, type, contentType, subContentType) => {
    console.log(result)
    if (!result.destination) return;
    // let messageArr = dataMessages.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
    //   .filter(content => content.id === idContent)[0][type][contentType];
    let messageArr = dataMessages[indexMessageSelect].message_content.filter(content => content.id === idContent)[0][type][contentType][subContentType]
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let indexItem;
    for (let i = 0; i < dataMessages[indexMessageSelect].message_content.length; i++) {
      if (dataMessages[indexMessageSelect].message_content[i].id === idContent) {
        indexItem = i;
      }
    }
    dataMessages[indexMessageSelect].message_content[indexItem][type][contentType][subContentType] = items;
    setDataMessages([...dataMessages]);
  }

  const onChangeValueMessageContent = (indexMessage, indexContent, type, value, name, subField, indexSubField, subName) => {
    console.log(indexMessage, indexContent, type, name, subField, indexSubField, value);

    if (subName) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] = {}
      }
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] = value;
    } else if (indexSubField) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name][subField] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name][subField] = {}
      }
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] = value;
    } else if (subField) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name] = {}
      }
      dataMessages[indexMessage].message_content[indexContent][type][name][subField] = value;
    } else if (name) {
      if (dataMessages[indexMessage].message_content[indexContent][type] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type] = {}
      }
      dataMessages[indexMessage].message_content[indexContent][type][name] = value;
    } else {
      dataMessages[indexMessage].message_content[indexContent][type] = value;
    }
    console.log(dataMessages, 'checkkk message onCHange')
    setDataMessages([...dataMessages]);
  }

  const onChangeFixedDate = (indexMessage, indexContent, type, value, name) => {

    dataMessages[indexMessage].message_content[indexContent][type][name].push(moment(value).format('YYYY/MM/DD'));
    console.log(dataMessages[indexMessage].message_content[indexContent][type][name])
    dataMessages[indexMessage].message_content[indexContent][type].select_fixed_date = value;
    setDataMessages([...dataMessages]);
  }

  const handleChangeValueRequireZipCode = (indexMessage, indexContent, type, value, name) => {
    console.log(indexMessage, indexContent, type, value, name);
    if (value === true && name === 'require') {
      onChangeValueMessageContent(indexMessage, indexContent, type, false, 'all_items_require');
      onChangeValueMessageContent(indexMessage, indexContent, type, value, 'require');
    } else if (value === true && name === 'all_items_require') {
      onChangeValueMessageContent(indexMessage, indexContent, type, false, 'require');
      onChangeValueMessageContent(indexMessage, indexContent, type, value, 'all_items_require');
    } else {
      onChangeValueMessageContent(indexMessage, indexContent, type, value, name);
    }
  }

  const handleRemoveItemContent = (indexMessage, indexContent, type, contentType, indexItem) => {
    let newArrRadio = dataMessages[indexMessage].message_content[indexContent][type][contentType].filter((item, index) => index !== indexItem);
    dataMessages[indexMessage].message_content[indexContent][type][contentType] = newArrRadio;
    setDataMessages([...dataMessages]);
  }

  const handleRemoveItemCustomizePullDown = (indexMessage, indexContent, contentType, pullDownType, name, indexPullDown) => {
    let newArrRadio = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name].filter((item, index) => index !== indexPullDown);
    dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name] = newArrRadio;
    setDataMessages([...dataMessages]);
  }

  const handleRemoveItemZipCodeAddress = (indexMessage, indexContent, contentType, field) => {
    console.log(indexMessage, indexContent, contentType, field);
    let newArr = dataMessages[indexMessage].message_content[indexContent][contentType];
    delete newArr[field];
    console.log(newArr);
    dataMessages[indexMessage].message_content[indexContent][contentType] = newArr;
    setDataMessages([...dataMessages]);
  }

  const onChangeValueNameMessage = (indexMessage, vari, value) => {
    dataMessages[indexMessage][vari] = value;
    setDataMessages([...dataMessages]);
  }

  const createVariable = () => {
    inputContentVar.push({
      name: variableName,
      key: defaultName
    });
    setIsOpenAddVariable(false);
  }

  const onClickSaveScenario = () => {
    console.log('asads');
    let data = {
      conversation: {
        messages: [...dataMessages],
        scenarioName
      }
    }
    api.post(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`, data).then(res => {
      console.log(res.data);
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti('Save scenario successfully');
      } else if (res.data.code === 2) {
        setMessageNoti(res.data.message);
      }
      handleGetMessage();
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    })
  }

  const onClickCreateStatement = (belongTo, indexMessage) => {
    let dataMessagesClone = [...dataMessages];
    console.log(dataMessagesClone, indexMessage);
    if (indexMessage === undefined && belongTo === 'bot') {
      dataMessagesClone = [
        {
          id: 1,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          message_content: [
            {
              id: 1,
              type: 'text_input'
            }
          ]
        }
      ];
    } else if (indexMessage === undefined && belongTo === 'user') {
      dataMessagesClone = [
        {
          id: 1,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          message_content: []
        }
      ];
    } else if (belongTo === 'bot') {
      let idMax = Math.max(...dataMessagesClone.map(item => item.id)) + 1;
      dataMessagesClone.splice(indexMessage + 1, 0,
        {
          id: idMax,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          message_content: [
            {
              id: 1,
              type: 'text_input',
              text_input: {
                text: {},
                email_confirmation: {},
                phone_number: {},
                password: {},
                password_confirmation: {},
              }
            }
          ]
        }
      )
    } else if (belongTo === 'user') {
      let idMax = Math.max(...dataMessagesClone.map(item => item.id)) + 1;
      dataMessagesClone.splice(indexMessage + 1, 0,
        {
          id: idMax,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          message_content: []
        }
      )
    }
    console.log(dataMessagesClone)
    setDataMessages([...dataMessagesClone]);
  }

  const handlePannelCondition = (isUpCondition, role = 'bot') => {
    console.log(isUpCondition);
    setIsConditionUp(isUpCondition);
    if (role === 'bot') {
      if (isUpCondition) {
        document.querySelector('.ss-bot-setting-condition-container').style.height = '52%';
      } else {
        document.querySelector('.ss-bot-setting-condition-container').style.height = '20%';
      }
    } else if (role === 'user') {
      if (isUpCondition) {
        document.querySelector('.ss-user-setting__main').style.height = '25%';
      } else {
        document.querySelector('.ss-user-setting__main').style.height = '57%';
      }
    }
  }

  const onChangeValueCondition = (index, value, name) => {
    dataMessages[indexMessageSelect].conditions[index][name] = value;
    setConditions([...conditions])
  }

  const onClickAddCondition = () => {
    console.log('onClickAddCondition')
    dataMessages[indexMessageSelect].conditions.push({
      linkCondition: 'and',
      condition: 'is',
      nameCondition: 'current_url',
      inputCondition: ''
    });
    setDataMessages([...dataMessages]);
  }

  const handleDeleteCondition = (indexCondition) => {
    let dataMessageClone = [...dataMessages];
    let dataConditionFilter = dataMessageClone[indexMessageSelect].conditions.filter((item, index) => index !== indexCondition);
    dataMessageClone[indexMessageSelect].conditions = dataConditionFilter;
    setDataMessages([...dataMessages]);
  }

  return (
    <div className="content">
      <div className="ss-actions">
        <Button onClick={() => onClickSaveScenario()}>Save</Button>
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
                      {(!dataMessages || dataMessages.length === 0) &&
                        <div className="ss-add-action-wrapper-empty-data">
                          <MDBIcon fas icon="plus-circle" className="ss-add-icon"></MDBIcon>
                          <div className="ss-add-message-option-wrapper">
                            <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('bot')}>
                              <MDBIcon
                                fas
                                icon="comment"
                                className="ss-add-option-icon"
                              ></MDBIcon>
                              <span>Bot statement</span>
                            </div>
                            <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('user')}>
                              <MDBIcon
                                fas
                                icon="comment"
                                className="ss-add-option-icon"
                              ></MDBIcon>
                              <span>User input</span>
                            </div>
                          </div>
                        </div>
                      }
                      <DragDropContext onDragEnd={handleDragEndMessageOverview}>
                        <Droppable droppableId="messages-overview">
                          {(provided) => (
                            <div className="" {...provided.droppableProps} ref={provided.innerRef}>
                              {dataMessages && dataMessages.map((message, index, arr) => {
                                let content;
                                if (message.belong_to === 'bot') content = message.message_content[0];
                                return message.belong_to === 'bot' ? (
                                  <Draggable key={message.id} draggableId={message.id.toString()} index={index}>
                                    {(provided) => (
                                      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} id={`message_${index}`} key={index} className="ss-bot-chat-wrapper ss-message-wrapper">
                                        <div
                                          className={`ss-bot-chat ss-message ss-message--select ss-message-${index}`}
                                        >
                                          {content.type !== 'text_input' && <span style={{ marginLeft: '49px' }}>{content.type}</span>}
                                          <div
                                            className="ss-bot-chat-detail ss-message__detail"
                                            onClick={() =>
                                              handleSelectMessage(index, message.belong_to, content?.type)
                                            }
                                          >
                                            <img className="ss-bot-ava" src={icon} alt="" />
                                            {content ?
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
                                                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                    value={content[content.type]?.content || ''}
                                                    readOnly
                                                  ></textarea>
                                                )}

                                                {/* bot: type == 'script' */}
                                                {content.type === 'script' && (
                                                  <textarea
                                                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                    value={content[content.type]?.content || ''}
                                                    readOnly
                                                  ></textarea>
                                                )}
                                                {/* bot: type == 'delay' */}
                                                {content.type === 'delay' && (
                                                  <textarea
                                                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                    value={`${content[content.type]?.content || 0} 秒`}
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
                                                    <div className="ss-option-wrapper" onClick={() => handleHiddenMessage(index, 'bot')}>
                                                      {message.hidden ?
                                                        <React.Fragment>
                                                          <MDBIcon
                                                            fas
                                                            icon="angle-double-up"
                                                            className="ss-add-option-icon"
                                                          ></MDBIcon>
                                                          <span>To enable</span>
                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                          <MDBIcon
                                                            fas
                                                            icon="eye-slash"
                                                            className="ss-add-option-icon"
                                                          ></MDBIcon>
                                                          <span>Hidden</span>
                                                        </React.Fragment>
                                                      }
                                                    </div>
                                                    <div className="ss-option-wrapper" onClick={() => handleDeleteMessage(index)}>
                                                      <MDBIcon
                                                        fas
                                                        icon="trash"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>Delete</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </React.Fragment> :
                                              <React.Fragment>
                                                <textarea
                                                  className="ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value"
                                                  value={botTextValue}
                                                  readOnly
                                                ></textarea>
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
                                              </React.Fragment>
                                            }
                                          </div>
                                          <div className="ss-add-action-wrapper">
                                            <MDBIcon fas icon="plus-circle" className="ss-add-icon"></MDBIcon>
                                            <div className="ss-add-message-option-wrapper">
                                              <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('bot', index)}>
                                                <MDBIcon
                                                  fas
                                                  icon="comment"
                                                  className="ss-add-option-icon"
                                                ></MDBIcon>
                                                <span>Bot statement</span>
                                              </div>
                                              <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('user', index)}>
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
                                    )}
                                  </Draggable>
                                ) : (
                                  <Draggable key={message.id} draggableId={message.id.toString()} index={index}>
                                    {(provided) => (
                                      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} key={index} className="ss-user-chat-wrapper ss-message-wrapper">
                                        <div
                                          className={`ss-user-chat ss-message ss-message--error ss-message-${index}`}
                                        // style={message?.message_content.length === 0 ? {width: '30%'}: {}}
                                        >
                                          <div
                                            className="ss-user-chat-detail ss-message__detail"
                                            onClick={() =>
                                              handleSelectMessage(index, message.belong_to, message.message_content[message.message_content.length - 1])
                                            }
                                          >
                                            <div className="ss-user-chat-detail-content">
                                              <div className="ss-user-message__content-wrapper">
                                                {message?.message_content.map((content, indexContent) => {
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
                                                              <div className="ss-message__content--user-text-input-top">
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
                                                                    readOnly
                                                                    placeholder={textInput.text?.placeholderLeft}
                                                                    style={{ width: '49%', marginBottom: '0px' }}
                                                                    disabled
                                                                  ></input>
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    placeholder={textInput.text?.placeholderRight}
                                                                    style={{ width: '49%' }}
                                                                    disabled
                                                                  ></input>
                                                                </div> :
                                                                <React.Fragment>
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    style={{ marginBottom: '0px' }}
                                                                    placeholder={textInput[textInput.type]?.placeholderLeft}
                                                                    disabled
                                                                  ></input>
                                                                  <span style={{ fontWeight: '400', color: 'black', fontSize: '12px', marginLeft: '18px' }}>{textInput.text?.placeholderRight}</span>
                                                                </React.Fragment>
                                                              )
                                                            }
                                                            {(textInput.type === 'phone_number') &&
                                                              <React.Fragment>
                                                                {textInput.phone_number.withHyphen === false ?
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    style={{ marginBottom: '0px' }}
                                                                    placeholder={textInput[textInput.type]?.number}
                                                                    disabled
                                                                  ></input> :
                                                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      style={{ marginBottom: '0px', width: '32%' }}
                                                                      placeholder={textInput[textInput.type]?.number1}
                                                                      disabled
                                                                    ></input>
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      style={{ marginBottom: '0px', width: '32%' }}
                                                                      placeholder={textInput[textInput.type]?.number2}
                                                                      disabled
                                                                    ></input>
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      style={{ marginBottom: '0px', width: '32%' }}
                                                                      placeholder={textInput[textInput.type]?.number3}
                                                                      disabled
                                                                    ></input>
                                                                  </div>
                                                                }
                                                              </React.Fragment>
                                                            }
                                                            {(textInput.type === 'password') &&
                                                              <React.Fragment>
                                                                <input
                                                                  className="ss-message__content--user-text-input ss-input-value"
                                                                  readOnly
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
                                                                  readOnly
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
                                                                  readOnly
                                                                  disabled
                                                                  placeholder={textInput[textInput.type].cfEmlAdd_email}
                                                                ></input>
                                                                <input
                                                                  className="ss-message__content--user-text-input ss-input-value"
                                                                  readOnly
                                                                  placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
                                                                  disabled
                                                                ></input>
                                                              </>
                                                              )}
                                                            {(textInput.type === 'password_confirmation') &&
                                                              (<>
                                                                <input
                                                                  className="ss-message__content--user-text-input ss-input-value"
                                                                  readOnly
                                                                  disabled
                                                                  placeholder={textInput[textInput.type].password}
                                                                ></input>
                                                                <input
                                                                  className="ss-message__content--user-text-input ss-input-value"
                                                                  readOnly
                                                                  placeholder={textInput[textInput.type].confirm_password}
                                                                  disabled
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
                                                              <div className="ss-message__content--user-textarea-top">
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
                                                                  readOnly
                                                                  placeholder={textarea[textarea.type]?.content}
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
                                                          </div>
                                                        )
                                                      }
                                                      {/* type == 'radio_button' */}
                                                      {
                                                        content.type === 'radio_button' && (
                                                          <div style={{ marginBottom: '10px' }}>
                                                            {(radioButton.title_require || radioButton.require) &&
                                                              <div className="ss-message__content--user-radio_button-top">
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
                                                                      disabled
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
                                                                      disabled
                                                                      checked={radioButton.initial_selection === item.id}
                                                                    />
                                                                    <img
                                                                      src={item.img}
                                                                      alt=""
                                                                    />
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
                                                              <div className="ss-message__content--user-checkbox-top">
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
                                                                      disabled
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
                                                                      disabled
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
                                                          </div>
                                                        )
                                                      }
                                                      {/* type == 'pull_down' */}
                                                      {
                                                        content.type === 'pull_down' && (
                                                          <div style={{ marginBottom: '10px' }}>
                                                            {(pullDown.title_require || pullDown.require) &&
                                                              <div className="ss-message__content--user-pull_down-top">
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
                                                                    <div className="ss-message__content--user-pull_down-row">
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                      <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
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
                                                                          style={{ width: '32%' }}
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                      <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                    <div className="ss-message__content--user-pull_down-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                  <span>{pullDown[pullDown.type].prefecture_comment}</span>
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
                                                                  <span>{pullDown[pullDown.type].city_comment}</span>
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
                                                            {(zipCodeAddress.title_require || zipCodeAddress.require) &&
                                                              <div className="ss-message__content--user-pull_down-top">
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
                                                              <div className="ss-message__content--user-calender-top">
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
                                                            {(agreeTerm.title_require || agreeTerm.require) &&
                                                              <div className="ss-message__content--user-agree_to_term-top">
                                                                {agreeTerm.title_require &&
                                                                  <span className="ss-message__content--user-agree_to_term-title">
                                                                    {agreeTerm.title}
                                                                  </span>
                                                                }
                                                                <span className="ss-message__content--user-text-input-required">
                                                                  * required
                                                                </span>
                                                              </div>
                                                            }
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
                                              {message?.message_content.length !== 0 &&
                                                <div className="ss-user-message__action-wrapper">
                                                  <Button className="ss-user-message__action-btn">
                                                    To the next
                                                  </Button>
                                                </div>
                                              }
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
                                                <div onClick={() => handleCopyMessage(index)} className="ss-option-wrapper">
                                                  <MDBIcon
                                                    fas
                                                    icon="copy"
                                                    className="ss-add-option-icon"
                                                  ></MDBIcon>
                                                  <span>Copy</span>
                                                </div>
                                                <div className="ss-option-wrapper" onClick={() => handleHiddenMessage(index, 'user')}>
                                                  {message.hidden ?
                                                    <React.Fragment>
                                                      <MDBIcon
                                                        fas
                                                        icon="angle-double-up"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>To enable</span>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                      <MDBIcon
                                                        fas
                                                        icon="eye-slash"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>Hidden</span>
                                                    </React.Fragment>
                                                  }
                                                </div>
                                                <div className="ss-option-wrapper" onClick={() => handleDeleteMessage(index)}>
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
                                              <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('bot', index)}>
                                                <MDBIcon
                                                  fas
                                                  icon="comment"
                                                  className="ss-add-option-icon"
                                                ></MDBIcon>
                                                <span>Bot statement</span>
                                              </div>
                                              <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('user', index)}>
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
                                    )}
                                  </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div>

                {/* ss setting */}
                <div className="ss-sc-content ss-setting-wrapper">
                  {console.log(dataMessages[indexMessageSelect])}
                  {dataMessages[indexMessageSelect] &&
                    <React.Fragment>
                      {belongTo === 'bot' && dataMessages[indexMessageSelect].message_content.length !== 0 && (
                        <div className="ss-bot-setting-container">
                          <div id="bot-statement" className="ss-bot-statement-detail-setting">
                            {/* Bot setting detail below */}
                            <div style={{ padding: '10px' }}>
                              <label htmlFor="ss-bot-statement-title">Type</label>
                              <select
                                name="bot_statement_type"
                                id="ss-bot-statement-type"
                                className="ss-bot-statement-type ss-input-value"
                                value={messageType}
                                onChange={e => handleChangeBotStatementType(e.target.value)}
                              >
                                <option value="text_input">Text</option>
                                <option value="file">File</option>
                                <option value="email">Email</option>
                                <option value="script">Script</option>
                                <option value="delay">Delay</option>
                                {/* <option value="api_link_age">Text</option> Pending */}
                              </select>

                              {/* type: text_input */}
                              {messageType === 'text_input' && (
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
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                      onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
                                    ></textarea>
                                  </div>
                                  <div className="ss-bot-checkbox-scroll-auto">
                                    <CheckboxCustom
                                      label="Do not scroll automatically"
                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'scroll_auto')}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['scroll_auto'] || ''}
                                    />
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
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                      onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
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
                                    <SelectCustom
                                      style={{ width: '100%' }}
                                      id="title"
                                      data={dataEmail}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'content')}
                                    />
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
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                      onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
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
                                    <div className="ss-user-setting__item-bottom-flex-start">
                                      <span style={{ marginRight: '10px' }}>Delay (seconds)</span>
                                      {/* <input
                                    type="number"
                                    name="ss-bot-statement-type-delay__num"
                                    id="ss-bot-statement-type-delay__num"
                                    className="ss-bot-statement-type-delay__num ss-input-value"
                                    min={'0'}
                                    max={'10'}
                                    value={dataMessages[indexMessageSelect].message_content[0][messageType]['content']}
                                    onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
                                  /> */}
                                      <InputNum
                                        placeholder="00"
                                        className="ss-user-setting-input-delay"
                                        min={0}
                                        max={10}
                                        value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'content')}
                                      />
                                    </div>
                                    <div className="ss-bot-statement-type-delay__checkbox-wrapper">
                                      <CheckboxCustom
                                        label="Turn on typing index"
                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'typing_on')}
                                        value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['typing_on'] || ''}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ss-bot-setting-condition-container">
                            <div className="ss-bot-setting-condition-header">
                              <div className="ss-bot-setting-condition-header-left">
                                <span style={{ fontWeight: '400' }}>Display target user condition setting</span>
                                <MDBIcon far icon="question-circle" style={{ color: '#FF7E00' }} />
                                <span className="ss-bot-setting-condition-icon-label">Standard</span>
                                <span className="ss-bot-setting-condition-icon-label" style={{ width: '50px', backgroundColor: '#7A52A3' }}>Pro</span>
                              </div>
                              <div className="ss-bot-setting-condition-header-right">
                                {isConditionUp ? <MDBIcon fas icon="caret-up" onClick={() => handlePannelCondition(false)} /> : <MDBIcon fas icon="caret-down" onClick={() => handlePannelCondition(true)} />}
                              </div>
                            </div>
                            <div className="ss-bot-setting-condition-sub-header">
                              <span style={{ fontWeight: '400' }}>*If set, if will be displayed only for users who meet the conditions</span>
                            </div>
                            {isConditionUp &&
                              <div className="ss-bot-setting-condition-contents">
                                {dataMessages[indexMessageSelect]?.conditions &&
                                  dataMessages[indexMessageSelect]?.conditions.map((condition, indexCondition) => {
                                    return <div key={indexCondition} className="ss-bot-setting-condition-content-container">
                                      <div className="ss-bot-setting-condition-content">
                                        {indexCondition !== 0 ?
                                          <SelectCustom
                                            style={{ width: '14%' }}
                                            data={[{ key: 'and', value: 'AND' }, { key: 'or', value: 'OR' }]}
                                            value={condition.linkCondition}
                                            onChange={value => onChangeValueCondition(indexCondition, value, 'linkCondition')}
                                          /> :
                                          <div style={{ width: '14%' }}></div>
                                        }
                                        <SelectCustom
                                          style={{ width: '59%', marginBottom: '5px' }}
                                          data={dataCondition}
                                          value={condition.nameCondition}
                                          onChange={value => onChangeValueCondition(indexCondition, value, 'nameCondition')}
                                        />
                                        <SelectCustom
                                          style={{ width: '24%' }}
                                          data={dataSubCondition}
                                          value={condition.condition}
                                          onChange={value => onChangeValueCondition(indexCondition, value, 'condition')}
                                        />
                                        <InputCustom
                                          style={{ width: '100%' }}
                                          value={condition.inputCondition}
                                          onChange={value => onChangeValueCondition(indexCondition, value, 'inputCondition')}
                                        />
                                      </div>
                                      <div className="ss-bot-setting-condition-times-icon">
                                        <MDBIcon fas icon="times-circle" onClick={() => handleDeleteCondition(indexCondition)} />
                                      </div>
                                    </div>
                                  })}
                              </div>
                            }
                            <div className="ss-bot-setting-condition-footer-button">
                              {isConditionUp &&
                                <div className="ss-bot-setting-condition-add-condition-button">
                                  <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
                                    Add condition
                                  </Button>
                                </div>
                              }
                              <div className="ss-bot-setting-condition-bottom-button">
                                <Button className="ss-bot-setting-condition-keep-button">
                                  keep
                                </Button>
                              </div>
                            </div>
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
                              <InputCustom
                                placeholder="Enter chat name"
                                onChange={value => onChangeValueNameMessage(indexMessageSelect, 'name', value)}
                                value={dataMessages[indexMessageSelect].name}
                              />
                            </div>
                          </div>
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="messages">
                              {(provided) => (
                                <div className="ss-user-setting__main" {...provided.droppableProps} ref={provided.innerRef}>
                                  {dataMessages &&
                                    dataMessages
                                      .filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0]?.message_content
                                      .map((content, indexContent, arr) => {
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
                                        console.log(content, 'ecehchejckc')
                                        return (
                                          <Draggable key={content.id} draggableId={content.id.toString()} index={indexContent}>
                                            {(provided) => (
                                              <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} style={{ marginBottom: '10px' }}>
                                                <div
                                                  id={indexContent === (arr.length - 1) ? 'last-element' : ''}
                                                  className={`ss-user-setting__item ss-user-setting__item-${indexContent} ${indexContent === (arr.length - 1) ? 'ss-user-setting__item--active' : ''}`}
                                                  onClick={() => handleSelectContentMessage(indexContent, content.type)}
                                                >
                                                  <MDBIcon
                                                    fas
                                                    icon="times-circle"
                                                    className="ss-user-setting__item-delete-btn"
                                                    onClick={(e) => handleDeleteMessageContent(indexMessageSelect, indexContent, e)}
                                                  />
                                                  {/* user: type = 'text_input' */}
                                                  {content.type === 'text_input' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'text_input', value, 'save_input_content')}
                                                            value={textInput.save_input_content}
                                                          />
                                                        </div>
                                                        {textInput.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={textInput?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'text_input', value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Use APIs to validate input values"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'text_input', value, 'use_api_input_value')}
                                                              value={textInput.use_api_input_value}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'text_input', value, 'require')}
                                                              value={textInput.require}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={textInput.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'text_input', value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={textInput.type}
                                                            data={type}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'text_input', value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* text_input: withTitle = true */}
                                                      {textInput?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={textInput.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* text_input: type = text */}
                                                      {textInput.type === 'text' && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              id="range"
                                                              value={textInput?.text?.range || 'no_input'}
                                                              data={rangeText}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'range')}
                                                              keyValue="key"
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label">character limit</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_from')}
                                                              value={textInput[textInput.type]?.character_limit_from}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_to')}
                                                              value={textInput[textInput.type]?.character_limit_to}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputDouble
                                                              rightWidth={'50%'}
                                                              icon={textInput[textInput.type]?.isSplitInput ? "minus-circle" : "plus-circle"}
                                                              valueLeft={textInput[textInput.type]?.placeholderLeft}
                                                              valueRight={textInput[textInput.type]?.placeholderRight}
                                                              onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, name === 'left' ? 'placeholderLeft' : 'placeholderRight')}
                                                              onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !textInput[textInput.type]?.isSplitInput, textInput.type, 'isSplitInput')}
                                                              placeholder={['placeholder', 'placeholder']}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      )}
                                                      {/* text_input: type = urls */}
                                                      {textInput.type === 'urls' &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="placeholder"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type)}
                                                            value={textInput[textInput.type]}
                                                          />
                                                        </div>
                                                      }
                                                      {/* text_input: type = email_address */}
                                                      {textInput.type === 'email_address' &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="placeholder"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type)}
                                                            value={textInput[textInput.type]}
                                                          />
                                                        </div>
                                                      }
                                                      {/* text_input: type = email_confirmation */}
                                                      {textInput.type === 'email_confirmation' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'cfEmlAdd_email')}
                                                              value={textInput[textInput.type]?.cfEmlAdd_email || ''}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'cfEmlAdd_confirm_email')}
                                                              value={textInput[textInput.type]?.cfEmlAdd_confirm_email || ''}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* text_input: type = phone_number */}
                                                      {textInput.type === 'phone_number' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              id="range"
                                                              value={textInput.phone_number?.withHyphen || false}
                                                              data={hyphenPhoneNumber}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'withHyphen')}
                                                              keyValue="key"
                                                            />
                                                          </div>
                                                          {/* phone_number: isWithHyphens = true */}
                                                          {textInput?.phone_number?.withHyphen === true &&
                                                            <React.Fragment>
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div className="ss-user-setting__item-select-bottom-wrapper ss-user-setting-phone-number-hyphens">
                                                                  <InputCustom
                                                                    placeholder="placeholder"
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number1')}
                                                                    value={textInput[textInput.type]?.number1}
                                                                  />
                                                                  <span style={{ fontSize: '20px' }}>-</span>
                                                                  <InputCustom
                                                                    placeholder="placeholder"
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number2')}
                                                                    value={textInput[textInput.type]?.number2}
                                                                  />
                                                                  <span style={{ fontSize: '20px' }}>-</span>
                                                                  <InputCustom
                                                                    placeholder="placeholder"
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number3')}
                                                                    value={textInput[textInput.type]?.number3}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </React.Fragment>
                                                          }
                                                          {/* phone_number: isWithHyphens = false */}
                                                          {textInput?.phone_number?.withHyphen === false &&
                                                            <React.Fragment>
                                                              <div className="ss-user-setting__item-bottom">
                                                                <InputCustom
                                                                  placeholder="placeholder"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number')}
                                                                  value={textInput[textInput.type]?.number}
                                                                />
                                                              </div>
                                                            </React.Fragment>
                                                          }
                                                        </React.Fragment>
                                                      }
                                                      {/* text_input: type = password || password_confirmation */}
                                                      {(textInput.type === 'password' || textInput.type === 'password_confirmation') && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label">character limit</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_from')}
                                                              value={textInput[textInput.type]?.character_limit_from}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_to')}
                                                              value={textInput[textInput.type]?.character_limit_to}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
                                                              <InputCustom
                                                                style={{ width: '100%' }}
                                                                placeholder="placeholder"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'password')}
                                                                value={textInput[textInput.type]?.password}
                                                              />
                                                            </div>
                                                          </div>
                                                          {/* text_input: type = password_confirmation */}
                                                          {(textInput.type === 'password_confirmation') && (
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
                                                                <InputCustom
                                                                  style={{ width: '100%' }}
                                                                  placeholder="placeholder"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'confirm_password')}
                                                                  value={textInput[textInput.type]?.confirm_password}
                                                                />
                                                              </div>
                                                            </div>
                                                          )}
                                                        </React.Fragment>
                                                      )}
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
                                                          value={label.lbl_content}
                                                          onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'lbl_content')}
                                                        ></textarea>
                                                      </div>
                                                    </>
                                                  )}
                                                  {/* user: type = 'textarea' */}
                                                  {content.type === 'textarea' && (
                                                    <React.Fragment>
                                                      {/* textarea: type = text */}
                                                      {textarea.type === 'text_input' && (
                                                        <div className="ss-user-setting__item-text_input-top">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'textarea', value, 'save_input_content')}
                                                            value={textarea.save_input_content}
                                                          />
                                                          {textarea.save_input_content &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                <SelectCustom
                                                                  style={{ width: '100%', marginRight: '10px' }}
                                                                  id="title"
                                                                  value={textarea?.save_input_content}
                                                                  data={inputContentVar}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                                />
                                                                <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                              </div>
                                                            </div>
                                                          }
                                                          <CheckboxCustom
                                                            label="Required"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                            value={textarea.require}
                                                          />
                                                        </div>
                                                      )}
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={textarea?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={textarea.type}
                                                            data={typeTextarea}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* textarea: withTitle = true */}
                                                      {textarea.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={textarea?.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* textarea: type = text_input */}
                                                      {textarea.type === 'text_input' && (
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label">character limit</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={1}
                                                            value={textarea.text_input?.character_limit_from}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'character_limit_from')}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={1}
                                                            value={textarea.text_input?.character_limit_to}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'character_limit_to')}
                                                          />
                                                        </div>
                                                      )}
                                                      {/* textarea: type = text_input || invalid_input */}
                                                      {(textarea.type === 'text_input' || textarea.type === 'invalid_input') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <textarea
                                                            style={{ width: '90%' }}
                                                            className="ss-user-setting-item-textarea-label ss-input-value"
                                                            placeholder="placeholder"
                                                            rows="5"
                                                            value={textarea[textarea.type]?.content}
                                                            onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, textarea.type, 'content')}
                                                          ></textarea>
                                                        </div>
                                                      )}
                                                      {/* textarea: type = consume_api_response */}
                                                      {(textarea.type === 'consume_api_response') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            id="range"
                                                            value={textarea.consume_api_response}
                                                            data={dataConsumeApiResponse}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'consume_api_response')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      )}
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'radio_button' */}
                                                  {content.type === 'radio_button' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="Save the input contents in a variable"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                          value={radioButton.save_input_content}
                                                        />
                                                        {radioButton.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={radioButton?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <CheckboxCustom
                                                          label="Required"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                          value={radioButton.require}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={radioButton?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={radioButton?.type}
                                                            data={typeRadio}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* radioButton: withTitle = true */}
                                                      {radioButton.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={radioButton?.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* radioButton: type = consume_api_response */}
                                                      {(radioButton.type === 'consume_api_response') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            id="range"
                                                            value={radioButton.consume_api_response}
                                                            data={dataConsumeApiResponse}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'consume_api_response')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      )}
                                                      {/* radioButton: type != consume_api_response */}
                                                      {radioButton.type !== 'consume_api_response' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, radioButton.type)}>
                                                              <Droppable droppableId='radio-items'>
                                                                {(providedChild) => {

                                                                  return <div className="ss-user-setting-item-radio-button-drag" {...providedChild.droppableProps} ref={providedChild.innerRef} style={{ width: '90%' }}>
                                                                    {
                                                                      Array.isArray(radioButton?.[radioButton.type]) && radioButton?.[radioButton.type]
                                                                        .map((itemRadio, indexRadio, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemRadio.id} draggableId={itemRadio.id + ''} index={indexRadio}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef} style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                                  {console.log(itemRadio)}
                                                                                  {radioButton.type === 'radio_button_img' &&
                                                                                    <React.Fragment>
                                                                                      <div className="ss-user-setting__item-bottom">
                                                                                        <InputCustom
                                                                                          placeholder="File URL"
                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, 'img')}
                                                                                          value={itemRadio.img}
                                                                                        />
                                                                                      </div>
                                                                                      <InputDouble
                                                                                        classCustom="ss-user-radio-custom-class"
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, name === 'left' ? 'text' : 'value')}
                                                                                        onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, radioButton.type, indexRadio)}
                                                                                        icon={array.length >= 2 ? "times-circle" : ""}
                                                                                        placeholder={['title', 'value']}
                                                                                        classIcon="ss-plus-circle-option-icon-times"
                                                                                        valueLeft={itemRadio.text}
                                                                                        valueRight={itemRadio.value}
                                                                                      />
                                                                                      <CheckboxCustom
                                                                                        label="Initial selection setting"
                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.id, 'initial_selection')}
                                                                                        value={radioButton.initial_selection === itemRadio.id}
                                                                                        isOnChange={false}
                                                                                      />
                                                                                    </React.Fragment>
                                                                                  }
                                                                                  {(radioButton.type === 'default' || radioButton.type === 'block_style') &&
                                                                                    <React.Fragment>
                                                                                      <InputDouble
                                                                                        classCustom="ss-user-radio-custom-class"
                                                                                        icon={array.length >= 2 ? "times-circle" : ""}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, name === 'left' ? 'text' : 'value')}
                                                                                        valueLeft={itemRadio.text}
                                                                                        valueRight={itemRadio.value}
                                                                                        placeholder={['title', 'value']}
                                                                                        classIcon="ss-plus-circle-option-icon-times"
                                                                                        onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, radioButton.type, indexRadio)}
                                                                                      />
                                                                                      <CheckboxCustom
                                                                                        label="Initial selection setting"
                                                                                        onChange={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.id, 'initial_selection')}
                                                                                        value={radioButton.initial_selection === itemRadio.id}
                                                                                        isOnChange={false}
                                                                                      />
                                                                                    </React.Fragment>
                                                                                  }
                                                                                </div>
                                                                              )}
                                                                            </Draggable>
                                                                          )
                                                                        })
                                                                    }
                                                                    {providedChild.placeholder}
                                                                  </div>
                                                                }}
                                                              </Droppable>
                                                            </DragDropContext>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <MDBIcon
                                                              fas
                                                              icon="plus-circle"
                                                              className="ss-plus-circle-option-icon"
                                                              onClick={() => handleAddItemRadioCheckbox(indexMessageSelect, indexContent, content.type, radioButton.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'checkbox' */}
                                                  {content.type === 'checkbox' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="Save the input contents in a variable"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                          value={checkbox.save_input_content}
                                                        />
                                                        {checkbox.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={checkbox?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <CheckboxCustom
                                                          label="Required"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                          value={checkbox.require}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={checkbox?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={checkbox?.type}
                                                            data={typeCheckbox}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* checkbox: withTitle = true */}
                                                      {checkbox.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            value={checkbox.title}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="All items checked"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'all_item_checked')}
                                                          value={checkbox.all_item_checked}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom-flex-start">
                                                        <span className="ss-user-setting-label">Selection limit</span>
                                                        <InputNum
                                                          placeholder="0000"
                                                          className="ss-user-setting-input-limit-character"
                                                          min={1}
                                                          disabled={!checkbox.required}
                                                          value={checkbox.selection_limit_from}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'selection_limit_from')}
                                                        />
                                                        <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                        <InputNum
                                                          placeholder="0000"
                                                          className="ss-user-setting-input-limit-character"
                                                          min={1}
                                                          value={checkbox.selection_limit_to}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'selection_limit_to')}
                                                        />
                                                      </div>
                                                      {/* checkbox: type = consume_api_response */}
                                                      {(checkbox.type === 'consume_api_response') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            id="range"
                                                            value={checkbox.consume_api_response}
                                                            data={dataConsumeApiResponse}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'checkbox', value, 'consume_api_response')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      )}
                                                      {/* checkbox: type != consume_api_response */}
                                                      {checkbox.type !== 'consume_api_response' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, checkbox.type)}>
                                                              <Droppable droppableId='checkbox-items'>
                                                                {(providedChild) => {
                                                                  // let arrMap;
                                                                  // if(radioButton.type === 'default') {
                                                                  //   arrMap
                                                                  // }

                                                                  return <div className="ss-user-setting-item-radio-button-drag" {...providedChild.droppableProps} ref={providedChild.innerRef} style={{ width: '90%' }}>
                                                                    {
                                                                      Array.isArray(checkbox?.[checkbox.type]) && checkbox?.[checkbox.type]
                                                                        .map((itemCheckbox, indexCheckbox, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemCheckbox.id} draggableId={itemCheckbox.id + ''} index={indexCheckbox}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef} style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                                  {checkbox.type === 'checkbox_img' &&
                                                                                    <React.Fragment>
                                                                                      <div className="ss-user-setting__item-bottom" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                        <InputCustom
                                                                                          placeholder="File URL"
                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, 'img')}
                                                                                          value={checkbox[checkbox.type][indexCheckbox].img}
                                                                                        />
                                                                                      </div>
                                                                                      <InputDouble
                                                                                        classCustom="ss-user-radio-custom-class"
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, name === 'left' ? 'text' : 'value')}
                                                                                        onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, checkbox.type, indexCheckbox)}
                                                                                        valueLeft={checkbox[checkbox.type][indexCheckbox].text}
                                                                                        valueRight={checkbox[checkbox.type][indexCheckbox].value}
                                                                                        icon={array.length >= 2 ? "times-circle" : ""}
                                                                                        placeholder={['title', 'value']}
                                                                                        classIcon="ss-plus-circle-option-icon-times"
                                                                                      />
                                                                                      {/* <CheckboxCustom
                                                                                        label="Initial selection setting"
                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, 'initial_selection')}
                                                                                        value={checkbox[checkbox.type][indexCheckbox].initial_selection}
                                                                                      /> */}
                                                                                    </React.Fragment>
                                                                                  }
                                                                                  {(checkbox.type === 'default') &&
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                      <InputDouble
                                                                                        classCustom="ss-user-radio-custom-class"
                                                                                        icon={array.length >= 2 ? "times-circle" : ""}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, name === 'left' ? 'text' : 'value')}
                                                                                        valueLeft={checkbox[checkbox.type][indexCheckbox].text}
                                                                                        valueRight={checkbox[checkbox.type][indexCheckbox].value}
                                                                                        placeholder={['text', 'value']}
                                                                                        classIcon="ss-plus-circle-option-icon-times"
                                                                                        onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, checkbox.type, indexCheckbox)}
                                                                                      />
                                                                                      {/* <CheckboxCustom
                                                                                        label="Initial selection setting"
                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, 'initial_selection')}
                                                                                        value={checkbox[checkbox.type][indexCheckbox].initial_selection}
                                                                                      /> */}
                                                                                    </div>
                                                                                  }
                                                                                </div>
                                                                              )}
                                                                            </Draggable>
                                                                          )
                                                                        })
                                                                    }
                                                                    {providedChild.placeholder}
                                                                  </div>
                                                                }}
                                                              </Droppable>
                                                            </DragDropContext>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <MDBIcon
                                                              fas
                                                              icon="plus-circle"
                                                              className="ss-plus-circle-option-icon"
                                                              onClick={() => handleAddItemRadioCheckbox(indexMessageSelect, indexContent, content.type, checkbox.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'zip_code_address' */}
                                                  {content.type === 'zip_code_address' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                            value={zipCodeAddress.save_input_content}
                                                          />
                                                        </div>
                                                        {zipCodeAddress.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={zipCodeAddress?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <CheckboxCustom
                                                            label="Use APIs to validate input values"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                            value={zipCodeAddress.use_api_input_value}
                                                          />
                                                        </div>
                                                        {zipCodeAddress.use_api_input_value &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              style={{ width: '90%' }}
                                                              id="title"
                                                              value={zipCodeAddress?.use_api_input_value}
                                                              data={inputContentVar}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                            />
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={value => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, zipCodeAddress.isCheckRequire === 'require' ? '' : 'require', 'isCheckRequire')}
                                                              value={zipCodeAddress.isCheckRequire === 'require'}
                                                              isOnChange={false}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="All items required"
                                                              onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, zipCodeAddress.isCheckRequire === 'all_items_require' ? '' : 'all_items_require', 'isCheckRequire')}
                                                              value={zipCodeAddress.isCheckRequire === 'all_items_require'}
                                                              isOnChange={false}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <CheckboxCustom
                                                            label="Split postal code into 3 digits + 4 digits"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'split_postal_code')}
                                                            value={zipCodeAddress.split_postal_code}
                                                          />
                                                        </div>
                                                      </div>
                                                      {zipCodeAddress.post_code !== undefined && (
                                                        zipCodeAddress.split_postal_code === false ?
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              classLabel="ss-custom-label-zip-code"
                                                              label="Post code"
                                                              className={"ss-user-setting__item-input-zip-code"}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code')}
                                                              onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'post_code')}
                                                              value={zipCodeAddress.post_code}
                                                              icon="times-circle"
                                                              placeholder="000 000"
                                                              classIcon="ss-plus-circle-option-icon-times"
                                                            />
                                                          </div> :
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              classLabel="ss-custom-label-zip-code"
                                                              label="Post code"
                                                              className={"ss-user-setting__item-input-zip-code"}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code_left')}
                                                              value={zipCodeAddress.post_code_left}
                                                              placeholder="000"
                                                              style={{ width: '17%', marginRight: '4%' }}
                                                            />
                                                            <InputCustom
                                                              className={"ss-user-setting__item-input-zip-code"}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code_right')}
                                                              value={zipCodeAddress.post_code_right}
                                                              placeholder="0000"
                                                              style={{ width: '20%', marginRight: '34%' }}
                                                            />
                                                            <MDBIcon
                                                              style={{ width: '5%' }}
                                                              // onClick={onClickIcon}
                                                              onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'post_code')}
                                                              fas
                                                              icon="times-circle"
                                                              className={"ss-plus-circle-option-icon-times"}
                                                            />
                                                          </div>
                                                      )}
                                                      {zipCodeAddress.prefecture !== undefined &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <span style={{ fontSize: '14px', fontWeight: '400', width: '15%' }}>Prefecture</span>
                                                          {zipCodeAddress.is_use_dropdown ?
                                                            <SelectCustom
                                                              style={{ width: '40%' }}
                                                              id="title"
                                                              value={zipCodeAddress?.prefecture}
                                                              data={dataPrefectures}
                                                              keyValue="name"
                                                              nameValue="name"
                                                              placeholder="placeholder"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                            /> :
                                                            <InputCustom
                                                              className={"ss-user-setting__item-input-zip-code"}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                              value={zipCodeAddress.prefecture}
                                                              placeholder={"placeholder"}
                                                              style={{ width: '40%' }}
                                                            />
                                                            // <input
                                                            //   type="text"
                                                            //   name="ss-user-setting__item-text_input-use-api"
                                                            //   className={"ss-input-value ss-user-setting-item ss-user-setting__item-input-zip-code"}
                                                            //   placeholder={"placeholder"}
                                                            //   value={zipCodeAddress.prefecture}
                                                            //   style={{ width: '40%' }}
                                                            //   onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                            // />
                                                          }
                                                          <CheckboxCustom
                                                            label="Use the dropdown"
                                                            className="ss-user-setting-checkbox-custom"
                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_dropdown')}
                                                            value={zipCodeAddress.is_use_dropdown}
                                                          />
                                                          <MDBIcon
                                                            style={{ width: '5%', marginLeft: '3px' }}
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'prefecture')}
                                                            fas
                                                            icon="times-circle"
                                                            className={"ss-plus-circle-option-icon-times"}
                                                          />
                                                        </div>
                                                      }
                                                      {zipCodeAddress.municipality !== undefined &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            classLabel="ss-custom-label-zip-code"
                                                            label="Municipalities"
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'municipality')}
                                                            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'municipality')}
                                                            value={zipCodeAddress.municipality}
                                                            icon="times-circle"
                                                            placeholder="placeholder"
                                                            classIcon="ss-plus-circle-option-icon-times"
                                                          />
                                                        </div>
                                                      }
                                                      {zipCodeAddress.address !== undefined &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            classLabel="ss-custom-label-zip-code"
                                                            label="Address"
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'address')}
                                                            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'address')}
                                                            value={zipCodeAddress.address}
                                                            icon="times-circle"
                                                            placeholder="placeholder"
                                                            classIcon="ss-plus-circle-option-icon-times"
                                                          />
                                                        </div>
                                                      }
                                                      {zipCodeAddress.building_name !== undefined &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            classLabel="ss-custom-label-zip-code"
                                                            label="Building name"
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'building_name')}
                                                            value={zipCodeAddress.building_name}
                                                            icon="times-circle"
                                                            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'building_name')}
                                                            placeholder="placeholder"
                                                            classIcon="ss-plus-circle-option-icon-times"
                                                          />
                                                        </div>
                                                      }
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'attaching_file' */}
                                                  {content.type === 'attaching_file' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                            value={attachingFile.save_input_content}
                                                          />
                                                        </div>
                                                        {attachingFile.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                id="title"
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                value={attachingFile?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={value => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={attachingFile.require}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Multiple file upload"
                                                              onChange={value => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, value, 'multifile_upload')}
                                                              value={attachingFile.multifile_upload}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            style={{ width: '90%' }}
                                                            data={dataTypeFile}
                                                            mode="multiple"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'file_type')}
                                                            value={attachingFile.file_type}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <Button className="ss-user-setting__select-btn-add" style={{ backgroundColor: '#A3B1BF', margin: '0px' }} onClick={() => console.log('Click select file')}>Select file</Button>
                                                        </div>
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'calendar' */}
                                                  {content.type === 'calendar' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                            value={calendar.save_input_content}
                                                          />
                                                        </div>
                                                        {calendar.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                value={calendar?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Required"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                            value={calendar.require}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                              style={{ width: '49%' }}
                                                              value={calendar?.title_require}
                                                              data={dropDownTitle}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            />
                                                            <SelectCustom
                                                              style={{ width: '49%' }}
                                                              value={calendar?.type}
                                                              data={typeCalendar}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            />
                                                          </div>
                                                        </div>
                                                        {/* calendar: withTitle = true */}
                                                        {calendar.title_require === true &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="title"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                              value={calendar.title}
                                                            />
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>start date</span>
                                                          <DatePicker
                                                            selected={calendar.start_date}
                                                            onChange={(date) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, date, 'start_date')}
                                                            className="ss-input-value"
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4', marginRight: '10px' }}>~</span>
                                                          <DatePicker
                                                            selected={calendar.end_date}
                                                            onChange={(date) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, date, 'end_date')}
                                                            className="ss-input-value"
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Use APIs to validate input values"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                              value={calendar.use_api_input_value}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Initial selection (shortest date from today)"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'initial_selection')}
                                                              value={calendar.initial_selection}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            label="Non-selectable date and time:"
                                                            mode="multiple"
                                                            style={{ width: '66%' }}
                                                            data={dataSelectDateTime}
                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'non_select_date_time')}
                                                            value={calendar.non_select_date_time}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start ss-user-setting__item-custom">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>fixed date</span>
                                                          <DatePicker
                                                            selected={calendar.select_fixed_date}
                                                            onChange={(date) => onChangeFixedDate(indexMessageSelect, indexContent, content.type, date, 'fixed_date')}
                                                            className="ss-input-value ss-date-picker-custom"
                                                            style={{ width: '100%' }}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          {console.log(calendar.fixed_date)}
                                                          <SelectCustom
                                                            mode="multiple"
                                                            style={{ width: '99%', minHeight: '20px' }}
                                                            data={calendar.fixed_date}
                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'fixed_date')}
                                                            value={calendar.fixed_date}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start" style={{ display: 'block' }}>
                                                          <div><span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Selectable dates (ranges based on "today")</span></div>
                                                          <div><span className="ss-user-setting-label" style={{ marginRight: '10px' }}>*Both positive and negative numbers can be specified.</span></div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Aggregation target period</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={1}
                                                            max={999}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'aggregation_target_period_from')}
                                                            value={calendar.aggregation_target_period_from}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={1}
                                                            max={999}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'aggregation_target_period_to')}
                                                            value={calendar.aggregation_target_period_to}
                                                          />
                                                        </div>
                                                        {/* calendar: type = date_selection */}
                                                        {calendar.type === 'date_selection' &&
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <DatePicker
                                                              selected={dataSelecteFixed}
                                                              className="ss-input-value ss-date-picker-custom"
                                                              onChange={(date) => setDataSelecteFixed(date)}
                                                            />
                                                            <MDBIcon style={{ color: 'grey', marginLeft: '10px', fontSize: '21px' }} far icon="calendar-alt" />
                                                          </div>
                                                        }
                                                        {/* calendar: type = embedded */}
                                                        {calendar.type === 'embedded' &&
                                                          <div className="ss-user-setting__item-bottom-flex-start" style={{ height: '280px' }}>
                                                            <DatePicker
                                                              // selected={calendar.select_fixed_date}
                                                              className="ss-input-value ss-date-picker-custom"
                                                              // style={{ width: '100%' }}
                                                              inline
                                                            />
                                                          </div>
                                                        }
                                                        {/* calendar: type = start_end_date */}
                                                        {calendar.type === 'start_end_date' &&
                                                          <React.Fragment>
                                                            <div className="ss-user-setting__item-bottom-flex-start">
                                                              <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Specified period</span>
                                                              <InputNum
                                                                placeholder="0000"
                                                                className="ss-user-setting-input-limit-character"
                                                                min={1}
                                                                max={999}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, calendar.type, 'specified_period_from')}
                                                                value={calendar.specified_period_from}
                                                              />
                                                              <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                              <InputNum
                                                                placeholder="0000"
                                                                className="ss-user-setting-input-limit-character"
                                                                min={1}
                                                                max={999}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, calendar.type, 'specified_period_to')}
                                                                value={calendar.specified_period_to}
                                                              />
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom-flex-start" style={{ display: 'block', height: '15px' }}>
                                                              <div><span className="ss-user-setting-label" style={{ marginRight: '10px', color: '#ccc' }}>*Both positive and negative numbers can be specified.</span></div>
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom-flex-start ss-user-setting-flex-date">
                                                              <DatePicker
                                                                selected={startDateClone}
                                                                onChange={(date) => setStartDateClone(date)}
                                                                selectsStart
                                                                startDate={startDateClone}
                                                                endDate={endDate}
                                                                className="ss-input-value ss-date-picker-custom"
                                                              />
                                                              <DatePicker
                                                                selected={endDate}
                                                                onChange={(date) => setEndDate(date)}
                                                                selectsEnd
                                                                startDate={startDateClone}
                                                                endDate={endDate}
                                                                minDate={startDateClone}
                                                                className="ss-input-value ss-date-picker-custom"
                                                              />
                                                              <MDBIcon style={{ color: 'grey', marginLeft: '10px', fontSize: '21px' }} far icon="calendar-alt" />
                                                            </div>
                                                          </React.Fragment>
                                                        }
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'agree_term' */}
                                                  {content.type === 'agree_term' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            style={{ width: '49%' }}
                                                            value={agreeTerm?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            style={{ width: '49%' }}
                                                            value={agreeTerm?.type}
                                                            data={agreeTermType}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* agreeTerm: withTitle = true */}
                                                      {agreeTerm.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            value={agreeTerm.title}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                          />
                                                        </div>
                                                      }
                                                      {/* agreeTerm: type = detail_content */}
                                                      {agreeTerm.type === 'detail_content' &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <textarea
                                                            style={{ width: '90%' }}
                                                            className="ss-user-setting-item-textarea-label ss-input-value"
                                                            placeholder="text"
                                                            rows="5"
                                                            value={agreeTerm.detail_content.content}
                                                            onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'detail_content', 'content')}
                                                          ></textarea>
                                                        </div>
                                                      }
                                                      {/* agreeTerm: type = post_link_only */}
                                                      {agreeTerm.type === 'post_link_only' &&
                                                        <React.Fragment>
                                                          {
                                                            Array.isArray(agreeTerm.post_link_only) &&
                                                            agreeTerm.post_link_only.map((agreeTermItem, indexAgree, array) => {
                                                              return (
                                                                <div key={indexAgree} className="ss-user-setting__item-bottom">
                                                                  <div className="ss-user-setting-item-radio-button-drag" style={{ width: '87%' }}>
                                                                    <div style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                      <InputCustom
                                                                        icon={array.length >= 2 ? "times-circle" : ""}
                                                                        classIcon="ss-plus-circle-option-icon-times"
                                                                        onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, agreeTerm.type, indexAgree)}
                                                                        style={{ width: '94%', marginBottom: '10px' }}
                                                                        placeholder="comment"
                                                                        value={agreeTermItem.title_comment}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, 'title_comment')}
                                                                      />
                                                                      <InputDouble
                                                                        classCustom="ss-user-setting-custom-double-input"
                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, name === 'left' ? 'title' : 'urls')}
                                                                        valueLeft={agreeTermItem.title}
                                                                        valueRight={agreeTermItem.urls}
                                                                        placeholder={['title', 'URLs']}
                                                                      />
                                                                      <InputCustom
                                                                        style={{ width: '100%', marginBottom: '10px' }}
                                                                        placeholder="comment"
                                                                        value={agreeTermItem.url_comment}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, 'url_comment')}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              )
                                                            })
                                                          }
                                                          <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <MDBIcon
                                                              fas
                                                              icon="plus-circle"
                                                              className="ss-plus-circle-option-icon"
                                                              onClick={() => handleAddItemAgreeTerm(indexMessageSelect, indexContent, content.type, agreeTerm.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <CheckboxCustom
                                                          className="ss-user-setting__item-custom-input-checkbox"
                                                          styleSpan={{ width: '100%' }}
                                                          disabled
                                                          label={
                                                            <InputCustom
                                                              placeholder="text"
                                                              style={{ width: '100%' }}
                                                              value={agreeTerm.term}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'term')}
                                                            />
                                                          }
                                                          onChange={value => console.log(value)}
                                                          value={false}
                                                        />
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'pull_down' */}
                                                  {content.type === 'pull_down' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="Save the input contents in a variable"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                          value={pullDown.save_input_content}
                                                        />
                                                        {pullDown.save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={pullDown?.save_input_content}
                                                                data={inputContentVar}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <CheckboxCustom
                                                          label="Required"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                          value={pullDown.require}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={pullDown?.title_require}
                                                            data={dropDownTitle}
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={pullDown?.type}
                                                            placeholder="type"
                                                            data={dataTypePullDown}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* pull_down: withTitle = true */}
                                                      {pullDown.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            value={pullDown.title}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                          />
                                                        </div>
                                                      }
                                                      {/* pull_down: type = customization */}
                                                      {pullDown.type === 'customization' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              icon={pullDown[pullDown.type]?.is_comment ? "times-circle" : "plus-circle"}
                                                              onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !pullDown[pullDown.type]?.is_comment, pullDown.type, 'is_comment')}
                                                              style={{ width: '84%', marginBottom: '10px' }}
                                                              placeholder="comment"
                                                              classIcon="ss-user-times-icon-custom"
                                                              value={pullDown[pullDown.type]?.title_comment || ''}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'title_comment')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div style={{ backgroundColor: '#F8F9FA', width: '90%', padding: '5px' }} >
                                                              <InputCustom
                                                                label="Display text while unselected"
                                                                style={{ width: '60%', marginBottom: '10px', marginLeft: '10px' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.display_unselected}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'display_unselected')}
                                                              />
                                                              <DragDropContext onDragEnd={result => handleDragEndPullDown(result, content.id, content.type, pullDown.type, pullDown[pullDown.type]?.is_comment ? 'options_with_comment' : 'options_without_comment')}>
                                                                <Droppable droppableId='customize-pull-down'>
                                                                  {(providedChild) => {
                                                                    let isComment = pullDown[pullDown.type]?.is_comment;
                                                                    let arrOptions = isComment ? pullDown[pullDown.type]?.options_with_comment : pullDown[pullDown.type]?.options_without_comment;
                                                                    return <div className="ss-user-setting-item-pull-down-drag" {...providedChild.droppableProps} ref={providedChild.innerRef} style={{ width: '103%' }}>
                                                                      {
                                                                        Array.isArray(arrOptions) && arrOptions
                                                                          .map((itemPullDown, indexPullDown, array) => {
                                                                            return (
                                                                              <Draggable draggable={true} key={itemPullDown.id} draggableId={itemPullDown.id + ''} index={indexPullDown}>
                                                                                {(providedChild) => (
                                                                                  <div
                                                                                    {...providedChild.draggableProps}
                                                                                    {...providedChild.dragHandleProps}
                                                                                    ref={providedChild.innerRef}
                                                                                    style={{ marginBottom: '10px', width: '98%', backgroundColor: '#F8F9FA', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                                                                  >
                                                                                    <MDBIcon fas icon="grip-horizontal" />
                                                                                    <InputDouble
                                                                                      classCustom={isComment ? "ss-user-setting-custom-double-input-custom" : ""}
                                                                                      onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown, name === 'left' ? 'text' : 'value')}
                                                                                      valueLeft={itemPullDown.text}
                                                                                      valueRight={itemPullDown.value}
                                                                                      placeholder={['text', 'value']}
                                                                                    />
                                                                                    {pullDown[pullDown.type]?.is_comment === true &&
                                                                                      <React.Fragment>
                                                                                        <span>~</span>
                                                                                        <InputDouble
                                                                                          classCustom="ss-user-setting-custom-double-input-custom"
                                                                                          onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown, name === 'left' ? 'text2' : 'value2')}
                                                                                          valueLeft={itemPullDown.text2}
                                                                                          valueRight={itemPullDown.value2}
                                                                                          placeholder={['text2', 'value2']}
                                                                                        />
                                                                                      </React.Fragment>
                                                                                    }
                                                                                    <MDBIcon
                                                                                      fas
                                                                                      style={{ fontSize: '25px' }}
                                                                                      icon="times-circle"
                                                                                      onClick={(e) => handleRemoveItemCustomizePullDown(indexMessageSelect, indexContent, content.type, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown)}
                                                                                    />
                                                                                  </div>
                                                                                )}
                                                                              </Draggable>
                                                                            )
                                                                          })
                                                                      }
                                                                      {providedChild.placeholder}
                                                                    </div>
                                                                  }}
                                                                </Droppable>
                                                              </DragDropContext>
                                                              <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <MDBIcon
                                                                  fas
                                                                  icon="plus-circle"
                                                                  className="ss-plus-circle-option-icon"
                                                                  onClick={() => handleAddItemCustomizePullDown(indexMessageSelect, indexContent, content.type, pullDown.type, pullDown[pullDown.type]?.is_comment ? 'options_with_comment' : 'options_without_comment')}
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%', marginBottom: '10px' }}
                                                              placeholder="comment"
                                                              value={pullDown[pullDown.type]?.comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = time_hm */}
                                                      {pullDown.type === 'time_hm' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="At start"
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="When finished"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.time}
                                                                data={dataHour}
                                                                placeholder="Time"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'time')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.minute}
                                                                data={dataMinutes}
                                                                placeholder="Minutes"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.every_minute}
                                                                data={dataEveryMinute}
                                                                placeholder="Every minute"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '24%' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_ymd */}
                                                      {pullDown.type === 'date_ymd' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="Start year"
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDay}
                                                                placeholder="Day"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '24%' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_md */}
                                                      {pullDown.type === 'date_md' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type].day}
                                                                data={dataDay}
                                                                placeholder="Day"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_ym */}
                                                      {pullDown.type === 'date_ym' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="Start year"
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type].comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_ymd_hm */}
                                                      {pullDown.type === 'date_ymd_hm' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDay}
                                                                placeholder="Day"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="At start"
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="When finished"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.time}
                                                                data={dataHour}
                                                                placeholder="Time"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'time')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.minute}
                                                                data={dataMinutes}
                                                                placeholder="Minutes"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.every_minute}
                                                                data={dataEveryMinute}
                                                                placeholder="Every minute"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '24%' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = dob_ymd */}
                                                      {pullDown.type === 'dob_ymd' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="Start year"
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at')}
                                                            />
                                                            <SelectCustom
                                                              style={{ width: '29%', marginLeft: '10%' }}
                                                              placeholder="Sort"
                                                              value={pullDown?.[pullDown.type]?.sort}
                                                              data={[
                                                                { key: 'asc', value: 'ascending order' },
                                                                { key: 'desc', value: 'descending order' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'sort')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'flex-start', padding: '0px 31px' }}>
                                                            <span style={{ marginBottom: '-10px', color: 'grey' }}>*Initally selected date of birth</span>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap' }}>
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDay}
                                                                placeholder="Day"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%', marginTop: '10px' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = dob_ym */}
                                                      {pullDown.type === 'dob_ym' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="Start year"
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataYear}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at')}
                                                            />
                                                            <SelectCustom
                                                              style={{ width: '29%', marginLeft: '10%' }}
                                                              placeholder="Sort"
                                                              value={pullDown?.[pullDown.type]?.sort}
                                                              data={[
                                                                { key: 'asc', value: 'ascending order' },
                                                                { key: 'desc', value: 'descending order' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'sort')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'flex-start', padding: '0px 31px' }}>
                                                            <span style={{ marginBottom: '-10px', color: 'grey' }}>*Initally selected date of birth</span>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap' }}>
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%' }}
                                                                placeholder="comment"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = timezone_from_to */}
                                                      {pullDown.type === 'timezone_from_to' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Range setting</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.range_start}
                                                              placeholder="At start"
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'range_start')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="When finished"
                                                              value={pullDown?.[pullDown.type]?.range_end}
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'range_end')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ alignItems: 'center' }}>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.hour_start_at}
                                                                  data={dataHour}
                                                                  placeholder="Time"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'hour_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.minute_start_at}
                                                                  data={dataMinutes}
                                                                  placeholder="Minutes"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.every_minute_start_at}
                                                                  data={dataEveryMinute}
                                                                  placeholder="Every minute"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute_start_at')}
                                                                />
                                                              </div>
                                                              <span>~</span>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.hour_end_at}
                                                                  data={dataHour}
                                                                  placeholder="Time"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'hour_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.minute_end_at}
                                                                  data={dataMinutes}
                                                                  placeholder="Minutes"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.every_minute_end_at}
                                                                  data={dataEveryMinute}
                                                                  placeholder="Every minute"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute_end_at')}
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="comment"
                                                              value={pullDown[pullDown.type]?.comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = period_from_to */}
                                                      {pullDown.type === 'period_from_to' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ alignItems: 'center' }}>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.year_start_at}
                                                                  data={dataYear}
                                                                  placeholder="Year"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.month_start_at}
                                                                  data={dataMonth}
                                                                  placeholder="Month"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.day_start_at}
                                                                  data={dataDay}
                                                                  placeholder="Day"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day_start_at')}
                                                                />
                                                              </div>
                                                              <span>~</span>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.year_end_at}
                                                                  data={dataYear}
                                                                  placeholder="Year"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.month_end_at}
                                                                  data={dataMonth}
                                                                  placeholder="Month"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.day_end_at}
                                                                  data={dataDay}
                                                                  placeholder="Day"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day_end_at')}
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="comment"
                                                              value={pullDown[pullDown.type]?.comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = prefectures */}
                                                      {pullDown.type === 'prefectures' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            {dataPrefectures &&
                                                              dataPrefectures.map((item, index) => {
                                                                return (
                                                                  <InputDouble
                                                                    classCustom={"ss-user-setting-double-input-custom"}
                                                                    disabled
                                                                    // onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown, name === 'left' ? 'text' : 'value')}
                                                                    valueLeft={item.name}
                                                                    valueRight={index + 1}
                                                                    rightWidth={{ width: '50%' }}
                                                                  // placeholder={['text', 'value']}
                                                                  />
                                                                )
                                                              })
                                                            }
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = up_to_municipality */}
                                                      {pullDown.type === 'up_to_municipality' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="comment"
                                                              value={pullDown[pullDown.type]?.prefecture_comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'prefecture_comment')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              style={{ width: '42%' }}
                                                              value={pullDown?.[pullDown.type]?.prefecture}
                                                              placeholder="Select prefecture"
                                                              data={dataPrefectures}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'prefecture')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '42%' }}
                                                              placeholder="Select city"
                                                              value={pullDown?.[pullDown.type]?.city}
                                                              data={dataHour}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'city')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="comment"
                                                              value={pullDown[pullDown.type]?.city_comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'city_comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = comsume_api_response */}
                                                      {pullDown.type === 'comsume_api_response' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              style={{ width: '90%' }}
                                                              value={pullDown?.[pullDown.type]}
                                                              placeholder="Select api"
                                                              data={dataConsumeApiResponse}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </React.Fragment>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        );
                                      })
                                  }
                                  {provided.placeholder}
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
                                <option value="calendar">Calendar</option>
                                <option value="agree_term">Agree to terms</option>
                              </select>
                              <Button className="ss-user-setting__select-btn-add" onClick={() => handleAddItemSetting(messageType || 'text_input')}>Addition</Button>
                            </div>
                            <div className="ss-user-setting__checkbox-wrapper">
                              <input type="checkbox" name="ss-user-setting__checkbox" />
                              <span>Align to the beginning and stop</span>
                              <MDBIcon fas icon="question-circle" style={{ color: '#347AED', fontSize: '12px', marginLeft: '5px' }} />
                            </div>
                            <div className="ss-user-setting-condition-container">

                              <div className="ss-bot-setting-condition-header">
                                <div className="ss-bot-setting-condition-header-left">
                                  <span style={{ fontWeight: '400' }}>Display target user condition setting</span>
                                  <MDBIcon far icon="question-circle" style={{ color: '#FF7E00' }} />
                                  <span className="ss-bot-setting-condition-icon-label">Standard</span>
                                  <span className="ss-bot-setting-condition-icon-label" style={{ width: '50px', backgroundColor: '#7A52A3' }}>Pro</span>
                                </div>
                                <div className="ss-bot-setting-condition-header-right">
                                  {isConditionUp ? <MDBIcon fas icon="caret-up" onClick={() => handlePannelCondition(false, 'user')} /> : <MDBIcon fas icon="caret-down" onClick={() => handlePannelCondition(true, 'user')} />}
                                </div>
                              </div>
                              <div className="ss-bot-setting-condition-sub-header">
                                <span style={{ fontWeight: '400' }}>*If set, if will be displayed only for users who meet the conditions</span>
                              </div>
                              {isConditionUp &&
                                <div className="ss-bot-setting-condition-contents">
                                  {dataMessages[indexMessageSelect]?.conditions &&
                                    dataMessages[indexMessageSelect]?.conditions.map((condition, indexCondition) => {
                                      return <div key={indexCondition} className="ss-bot-setting-condition-content-container">
                                        <div className="ss-bot-setting-condition-content">
                                          {indexCondition !== 0 ?
                                            <SelectCustom
                                              style={{ width: '14%' }}
                                              data={[{ key: 'and', value: 'AND' }, { key: 'or', value: 'OR' }]}
                                              value={condition.linkCondition}
                                              onChange={value => onChangeValueCondition(indexCondition, value, 'linkCondition')}
                                            /> :
                                            <div style={{ width: '14%' }}></div>
                                          }
                                          <SelectCustom
                                            style={{ width: '59%', marginBottom: '5px' }}
                                            data={dataCondition}
                                            value={condition.nameCondition}
                                            onChange={value => onChangeValueCondition(indexCondition, value, 'nameCondition')}
                                          />
                                          <SelectCustom
                                            style={{ width: '24%' }}
                                            data={dataSubCondition}
                                            value={condition.condition}
                                            onChange={value => onChangeValueCondition(indexCondition, value, 'condition')}
                                          />
                                          <InputCustom
                                            style={{ width: '100%' }}
                                            value={condition.inputCondition}
                                            onChange={value => onChangeValueCondition(indexCondition, value, 'inputCondition')}
                                          />
                                        </div>
                                        <div className="ss-bot-setting-condition-times-icon">
                                          <MDBIcon fas icon="times-circle" onClick={() => handleDeleteCondition(indexCondition)} />
                                        </div>
                                      </div>
                                    })}
                                </div>
                              }
                              <div className="ss-user-setting-condition-footer-button">
                                {isConditionUp &&
                                  <div className="ss-bot-setting-condition-add-condition-button">
                                    <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
                                      Add condition
                                    </Button>
                                  </div>
                                }
                                <div className="ss-user-setting-condition-bottom-button">
                                  <InputCustom
                                    style={{ height: '38.2px', margin: '10px', width: '22%' }}
                                    label="Registration button name"
                                    value={dataMessages[indexMessageSelect].buttonNameCondition}
                                    onChange={(value) => {
                                      dataMessages[indexMessageSelect].buttonNameCondition = value;
                                      setDataMessages([...dataMessages]);
                                    }}
                                  />
                                  <Button className="ss-bot-setting-condition-keep-button">
                                    keep
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </React.Fragment>
                  }
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{messageNoti}</span>
        </div>
      </ModalNoti>
      <ModalShort open={isOpenAddVariable} onClose={() => setIsOpenAddVariable(false)}>
        <div className="sl-popup-create-scenario-wrapper">
          <h4>Add variable</h4>
          <div className="sl-popup-create-scenario-input-wrapper">
            <span>Variable name</span>
            <input
              type="text"
              name="sl-popup-create-scenario-input"
              id="sl-popup-create-scenario-input"
              onChange={(e) => setVariableName(e.target.value)}
            />
          </div>
          <div className="sl-popup-create-scenario-input-wrapper">
            <span>Default name</span>
            <input
              type="text"
              name="sl-popup-create-scenario-input"
              id="sl-popup-create-scenario-input"
              onChange={(e) => setDefaultName(e.target.value)}
            />
          </div>
          <span id="sl-err-create-scenario" style={{ color: "red" }}></span>
          <div className="sl-popup-create-scenario-btn-wrapper">
            <Button
              className="sl-popup-create-scenario-create-btn"
              onClick={() => setIsOpenAddVariable(false)}
            >
              Close
            </Button>
            <Button
              className="sl-popup-create-scenario-cancel-btn"
              onClick={() => createVariable()}
            >
              Keep
            </Button>
          </div>
        </div>
      </ModalShort>
    </div >
  );
};

export default Scenario;
