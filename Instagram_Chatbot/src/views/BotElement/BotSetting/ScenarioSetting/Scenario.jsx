import '../../../../assets/css/bot/scenario/scenario-single.css';
import React, { useEffect, useState, useRef } from 'react';
import {
  Col, Row, Card, CardBody, Button
} from 'reactstrap';
import icon from '../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
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
import Preview from '../Preview';
import FileReferencePopup from './FileReferencePopup';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  S3_UPLOAD_URL
} from '../../../../variables/constants';
import { tokenExpired } from 'api/tokenExpired';
import DatePickerCustom from './scenarioComon/DatePickerCustom';
import { Carousel, Checkbox, Radio, Slider, Calendar } from 'antd';
import CheckboxGroupCustom from './scenarioComon/CheckboxGroupCustom';
import american_express from '../../../../assets/img/payment-method/american_express.png';
import diner_club from '../../../../assets/img/payment-method/diner_club.png';
import discover from '../../../../assets/img/payment-method/discover.png';
import jcb from '../../../../assets/img/payment-method/jcb.png';
import master_card from '../../../../assets/img/payment-method/master_card.png';
import visa from '../../../../assets/img/payment-method/visa.png';
import nanoMetadata from 'nano-metadata';

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

let dataProductPurchase = [
  {
    key: 'quantity_designation',
    value: 'Quantity Designation'
  },
  {
    key: 'product_number_display',
    value: 'Product Number Display'
  },
  {
    key: 'price_display',
    value: 'Price display'
  },
  {
    key: 'product_name_display',
    value: 'Product name display'
  },
  {
    key: 'multiple_item_purchase',
    value: 'Multiple item purchase'
  }
]


let dataHourFixed = [];
for (let i = 0; i <= 23; i++) {
  dataHourFixed.push({
    key: i + '',
    value: i + ''
  });
}

let dataMinutesFixed = [];
for (let i = 0; i <= 59; i++) {
  dataMinutesFixed.push({
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

let dataMonthFixed = [];
for (let i = 1; i <= 12; i++) {
  dataMonthFixed.push({
    key: i + '',
    value: i + ''
  });
}

let dataMaxRangSlider = [];
for (let i = 2; i <= 10; i++) {
  dataMaxRangSlider.push({
    key: i + '',
    value: i + ''
  })
}

let dataDayFixed = [];
for (let i = 1; i <= 31; i++) {
  dataDayFixed.push({
    key: i + '',
    value: i + ''
  });
}

let dataEveryMinuteFixed = [
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

let carouselType = [
  {
    key: 'default',
    value: 'Default'
  },
  {
    key: 'consume_api_response',
    value: 'Consume API response'
  }
];

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

let dataConditionFixed = [
  {
    variable_name: 'current_url',
    default_value: 'current_url'
  },
  {
    variable_name: 'current_url_param',
    default_value: 'current_url_param'
  },
  {
    variable_name: 'current_url_title',
    default_value: 'current_url_title'
  },
  {
    variable_name: 'user_id',
    default_value: 'user_id'
  },
  {
    variable_name: 'bot_id',
    default_value: 'bot_id'
  },
  {
    variable_name: 'preview_flg',
    default_value: 'preview_flg'
  },
  {
    variable_name: 'user_ip_address',
    default_value: 'user_ip_address'
  },
  {
    variable_name: 'user_country',
    default_value: 'user_country'
  },
  {
    variable_name: 'user_city',
    default_value: 'user_city'
  },
  {
    variable_name: 'user_device',
    default_value: 'user_device'
  },
  {
    variable_name: 'user_browser',
    default_value: 'user_browser'
  },
  {
    variable_name: 'user_agent',
    default_value: 'user_agent'
  },
  {
    variable_name: 'cv_flg',
    default_value: 'cv_flg'
  },
  {
    variable_name: 'start_datetime',
    default_value: 'start_datetime'
  },
  {
    variable_name: 'user_referer_firstopen',
    default_value: 'user_referer_firstopen'
  },
  {
    variable_name: 'user_referer_current',
    default_value: 'user_referer_current'
  },
  {
    variable_name: 'churn_block_passed',
    default_value: 'churn_block_passed'
  },
  {
    variable_name: 'prevention_block_passed',
    default_value: 'prevention_block_passed'
  },
  {
    variable_name: 'churn_request_flag',
    default_value: 'churn_request_flag'
  },
  {
    variable_name: 'Phone number_hyphen',
    default_value: 'Phone number_hyphen'
  },
  {
    variable_name: 'Address_zip code 1',
    default_value: 'Address_zip code 1'
  },
  {
    variable_name: 'Address_Building name',
    default_value: 'Address_Building name'
  },
  {
    variable_name: 'address',
    default_value: 'address'
  },
  {
    variable_name: 'email address',
    default_value: 'email address'
  },
  {
    variable_name: 'phone number',
    default_value: 'phone number'
  },
  {
    variable_name: 'sex',
    default_value: 'sex'
  },
  {
    variable_name: 'date of birth',
    default_value: 'date of birth'
  },
  {
    variable_name: 'Address_zip code',
    default_value: 'Address_zip code'
  },
  {
    variable_name: 'Address_postal code with hyphens',
    default_value: 'Address_postal code with hyphens'
  },
  {
    variable_name: 'Address_zip code 1h',
    default_value: 'Address_zip code 1h'
  },
  {
    variable_name: 'Address_zip code 2',
    default_value: 'Address_zip code 2'
  },
  {
    variable_name: 'Address_Prefecture',
    default_value: 'Address_Prefecture'
  },
  {
    variable_name: 'Address_City',
    default_value: 'Address_City'
  },
  {
    variable_name: 'street address',
    default_value: 'street address'
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
];

let dataApiLinkage = [
  {
    key: 'credit_card_duplication_check',
    value: 'Credit card duplication check'
  },
  {
    key: 'send_value_variable',
    value: 'sendValueVariable'
  },
  {
    key: 'get_payment_method_name',
    value: 'Get payment method name'
  },
  {
    key: 'valid_phone_number_shipping',
    value: 'validPhoneNumber_shipping'
  },
  {
    key: 'valid_phone_number',
    value: 'validPhoneNumber'
  },
  {
    key: 'get_new_address',
    value: 'getNewAddress'
  },
  {
    key: 'get_price',
    value: 'getPrice'
  },
  {
    key: 'check_duplicate_zipcode',
    value: 'checkDuplicate Zipcode'
  },
  {
    key: 'click_order',
    value: 'Click order'
  },
  {
    key: 'validate_email',
    value: 'Validate Email'
  },
  {
    key: 'confirm',
    value: 'confirm'
  },
  {
    key: 'landing',
    value: 'landing'
  }
]

const Scenario = () => {
  // states
  const [fileVideo, setFileVideo] = useState('');
  const [scenarioName, setScenarioName] = useState('');
  const [errorScenarioName, setErrorScenarioName] = useState('');

  const [belongTo, setBelongTo] = useState('bot');
  const [messageType, setMessageType] = useState('text_input');
  const [indexMessageSelect, setIndexMessageSelect] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [indexMessageContentSelect, setIndexMessageContentSelect] = useState('');
  const [dataInputVar, setDataInputVar] = useState([]);
  const [isOpenPreview, setIsOpenPreview] = useState(false);

  const [varFileReference, setVarFileReference] = useState({});
  const [isOpenFileReference, setIsOpenFileReference] = useState(false);
  const [indexCarouselSlide, setIndexCarouselSlide] = useState(0);

  // bot setting values
  const [botTextValue, setBotTextValue] = useState('');
  const [isOpenAddVariable, setIsOpenAddVariable] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [isClickPlus, setIsClickPlus] = useState(false);

  const [fileError, setFileError] = useState('');
  const [fileErrorCarousel, setFileErrorCarousel] = useState('');
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
  const [defaultValue, setDefaultValue] = useState('');

  //state data pull_down
  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataMinutes, setDataMinutes] = useState(dataMinutesFixed);
  const [dataEveryMinute, setDataEveryMinute] = useState(dataEveryMinuteFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataMonth, setDataMonth] = useState(dataMonthFixed);
  const [dataDay, setDataDay] = useState(dataDayFixed);

  const [errorVariable, setErrorVariable] = useState('');

  const [dataCondition, setDataCondition] = useState([]);

  const carouselSlide = useRef(null);
  // side effects

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
    setScenarioId(Cookies.get('scenario_id'));
  }, [])

  useEffect(() => {
    handleGetMessage();
  }, [])

  useEffect(() => {
    getListVariable();
  }, [])

  useEffect(() => {
    api.get(`/api/v1/managements/emails?page=all&chatbot_id=${botId}`).then(res => {
      setDataEmail(res.data.data);
    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }, [])

  // useEffect(() => {
  //   setDataMessages(dataClone.messages);
  // }, [])

  useEffect(() => {
    api.get(`/api/v1/prefectures`).then((res) => {
      // console.log(res.data.data);
      setDataPrefectures(res.data.data);
    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }, [])


  useEffect(() => {
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    handleOpenPreview(isOpenPreview);
  }, [])

  const handleGetMessage = () => {
    api.get(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`).then((res) => {
      setDataMessages(res.data.data?.conversation?.messages || []);
      setScenarioName(res.data.data?.scenario_name || '');

    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    });
  }

  function botUploadFile() {
    document.getElementById('ss-bot-file-upload').click();
  }

  function carouselUploadFile() {
    document.getElementById('ss-carouse-file-upload').click();
  }

  const getBaseUrl = async (event, indexContent) => {
    var fileInput = document.querySelector('input[type=file]')['files'][0];
    const type = fileInput.name.slice(fileInput.name.lastIndexOf('.') + 1);

    let trueFile;
    if (dataMessages[indexMessageSelect].belong_to === 'user') {
      trueFile = ['jpeg', 'jpg', 'png'].includes(type);
    } else {
      trueFile = ['jpeg', 'jpg', 'png', 'pdf', 'mp4'].includes(type);
    }
    let file;
    if (trueFile) {
      if (type != 'pdf' && type != 'mp4' && fileInput.size / 1024 / 1024 > 2) {
        setFileError(`You need to upload file which size under 2MB.`);
        return;
      } else if (type === 'pdf' && fileInput.size / 1024 / 1024 > 3) {
        setFileError(`You need to upload file which size under 3MB.`);
        return;
      } else if (type === 'mp4') {
        const vid = document?.getElementById('preview-video');
        let duration = await nanoMetadata.video.duration(fileInput);
        console.log(duration);
        if (duration > 15) {
          setFileError(`You need to upload video which duration under 15 seconds.`);
          return;
        }

      }
      setFileError('');
      const video = document.getElementById('preview-video');
      file = { user_file: { file_type: type, size: fileInput.size, timeplay: `${type == 'mp4' ? video?.duration : ''}` } };
      api
        .post(`/api/v1/managements/file/upload`, file)
        .then((res) => {
          console.log('res upload file type: ', res);
          const urlFile = res.data.data.url;
          let filePost = { user_file: { file_type: type, file_url: res.data.data.path } };
          let typeUpload = ''
          if (type == 'mp4') {
            typeUpload = 'video/mp4'
          } else if (type == 'pdf') {
            typeUpload = 'application/pdf'
          } else {
            typeUpload = `image/${type}`
          }

          axios
            .put(urlFile, fileInput
              , {
                headers: {
                  'Content-Type': typeUpload
                },
              })
            .then((res) => {
              console.log('response`: ', res);
              api
                .post(`/api/v1/managements/file`, filePost)
                .then((res) => {
                  if (res.data.code == 1) {
                    if (dataMessages[indexMessageSelect].belong_to === 'user') {
                      dataMessages[indexMessageSelect].message_content[indexContent].carousel.default.contents[indexCarouselSlide].fileUrl = S3_UPLOAD_URL + res.data.data.file_url;
                    } else {
                      dataMessages[indexMessageSelect].message_content[0].file.content = S3_UPLOAD_URL + res.data.data.file_url;
                    }
                    setDataMessages([...dataMessages]);
                    setMessageNoti(`Add successfully!`);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMessageNoti(``);
                    }, 2000);
                  } else {
                    setMessageNoti(`Add failed!`);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMessageNoti(``);
                    }, 2000);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  if (err.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
            })
            .catch((err) => {
              console.log("err: ", err);
              if (err.response?.data.code === 0) {
                tokenExpired();
              }
            });

        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else if (dataMessages[indexMessageSelect].belong_to !== 'user') {
      setFileError(`You need enter format file is jpeg/ jpg/ png/ pdf/ mp4.`);
    } else {
      setFileErrorCarousel('Please specify jpeg, jpg, png type files for the file.');
      setTimeout(() => {
        setFileErrorCarousel('');
      }, 4000)
    }
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

  const handleHiddenMessage = (index, role) => {
    dataMessages[index].hidden = !dataMessages[index].hidden;

    if (role === 'bot') {
      document.querySelectorAll('.ss-bot-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-bot-chat-overview-${index}`)) {
          if (!dataMessages[index].hidden) ele.style.opacity = '1'
          if (dataMessages[index].hidden) ele.style.opacity = '0.4'
        }
      });
    } else if (role === 'user') {
      document.querySelectorAll('.ss-user-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-user-chat-detail-content-${index}`)) {
          if (!dataMessages[index].hidden) ele.style.opacity = '1'
          if (dataMessages[index].hidden) ele.style.opacity = '0.4'
        }
      });
    }

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
            initial_selection: 1,
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
            urls: {}, //string
            email_address: {}, //string
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
            checkedValue: []
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
              options_with_comment: [{ id: 1 }],
              options_without_comment: [{ id: 1 }]
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
            prefectures: {}
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
            require: true,
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
    } else if (messageType === 'carousel') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'default',
            default: {
              contents: [{
                title: '',
                subtitle: '',
                urls: '',
                fileUrl: '',
                buttonTitle: ''
              }]
            }
          }
        }
      );
    } else if (messageType === 'credit_card_payment') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            save_input_content: false,
            require: false,
            title_require: false,
            is_hide_card_name: false,
            is_hide_cvc: false,
            separate_type: false,
            validity_check: false,
            type_date_of_expiry: 'ym',
            payment_method: []
          }
        }
      );
    } else if (messageType === 'capture') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            require: true,
            type: '0123456789', //type: numbers, alphanumeric, alphabet_only,
            length: 6,
            colour: 'can_be', //type: can_be, none
          }
        }
      );
    } else if (messageType === 'product_purchase') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            require: false,
            type: 'text_with_thumbnail_image', //type: text_with_thumbnail_image, text_with_image, consume_api_respone,
            initial_selection: [],
            quantity_designation_all: false,
            product_number_display: false,
            price_display: false,
            product_name_display: false,
            multiple_item_purchase: false,
            products: [
              {
                id: 1,
                quantity_select: 1,
                is_quantity_designation: false
              }
            ]
          }
        }
      );
    } else if (messageType === 'product_purchase_radio_button') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            require: false,
            type: 'text_with_thumbnail_image', //type: text_with_thumbnail_image, text_with_image, consume_api_respone,
            initial_selection: [],
            product_number_display: false,
            price_display: false,
            product_name_display: false,
            products: [
              {
                id: 1
              }
            ]
          }
        }
      );
    } else if (messageType === 'AFTEE_payment_module') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            type: 'aftee', //type: aftee, atone, paidy, zcom            
          }
        }
      );
    } else if (messageType === 'slider') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            save_input_content: false,
            title_require: false,
            require: false,
            type: 'continuous_type', //type: continuous_type, discrete_type
            max_value: '2',
            min_value: '0'
          }
        }
      );
    } else if (messageType === 'card_payment_radio_button') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            is_save_input_content: false,
            require: false,
            type: 'default',
            title_require: false,
            is_hide_card_name: false,
            is_hide_cvc: false,
            separate_type: false,
            validity_check: false,
            type_date_of_expiry: 'ym',
            payment_method: [],
            radio_contents: [
              { id: 1 }
            ],
            radio_contents_img: [
              {
                id: 1,
                contents: [
                  { id: 1 }
                ]
              }
            ]
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
            require: false,
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
    console.log(arrMessage);
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
    console.log(dataMessages[index])
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
    let messageArr = [...dataMessages[indexMessageSelect].message_content];
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

    handleSelectMessage(result.destination.index, 'user');
    // setIndexMessageSelect(result.destination.index);
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

  const onChangeTimePullDown = (indexMessage, indexContent, type, value, name, subField, typeData) => {
    onChangeValueMessageContent(indexMessage, indexContent, type, value, name, subField);
    let field = dataMessages[indexMessage].message_content[indexContent][type][name];
    console.log(field, 'checkkk');
    if (typeData === 'dataHour') {
      if (subField === 'start_at') {
        setDataHour(dataHourFixed.filter(item => (parseInt(item.key) >= parseInt(value || 0) && parseInt(item.key) <= parseInt(field.end_at || 24))));
      } else if (subField === 'end_at') {
        setDataHour(dataHourFixed.filter(item => (parseInt(item.key) <= parseInt(value || 24) && parseInt(item.key) >= parseInt(field.start_at || 0))));
      }
    } else if (typeData === 'dataYear') {
      if (subField === 'start_year') {
        setDataYear(dataYearFixed.filter(item => (parseInt(item.key) >= parseInt(value || 1935) && parseInt(item.key) <= parseInt(field.end_year || 2072))));
      } else if (subField === 'end_year') {
        setDataYear(dataYearFixed.filter(item => (parseInt(item.key) <= parseInt(value || 2072) && parseInt(item.key) >= parseInt(field.start_year || 1935))));
      }
    }
  }

  const onChangeValueMessageContent = (indexMessage, indexContent, type, value, name, subField, indexSubField, subName, variable) => {
    console.log(indexMessage, indexContent, type, name, subField, indexSubField, value);
    if (variable !== undefined) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] = {};
      }
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName][variable] = value;
    } else if (subName !== undefined) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] = {};
      }
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] = value;
    } else if (indexSubField !== undefined) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name][subField] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name][subField] = {};
      }
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] = value;
    } else if (subField !== undefined) {
      if (dataMessages[indexMessage].message_content[indexContent][type][name] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type][name] = {};
      }
      console.log(dataMessages[indexMessage].message_content[indexContent])
      dataMessages[indexMessage].message_content[indexContent][type][name][subField] = value;
    } else if (name !== undefined) {
      if (dataMessages[indexMessage].message_content[indexContent][type] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type] = {};
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

  const getListVariable = () => {
    api.get(`/api/v1/managements/chatbots/${botId}/variables?page=all`).then(res => {
      console.log(res.data);
      if (res.data.code === 1) {
        setDataCondition([
          ...dataConditionFixed,
          ...res.data.data
        ]);
        setDataInputVar(res.data.data);
      }
    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    });
  }

  const createVariable = () => {
    if (!variableName) {
      setErrorVariable("Variable name can't be empty");
      return;
    }
    let data = {
      variable: {
        variable_name: variableName,
        default_value: defaultValue
      }
    }
    api.post(`/api/v1/managements/chatbots/${botId}/variables`, data).then(res => {
      console.log(res.data);
      setIsOpenAddVariable(false);
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti('Create variable successfully');
      } else if (res.data.code === 2) {
        setMessageNoti(res.data.message);
      }
      getListVariable();
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    });
  }

  const onClickSavePreview = () => {
    console.log(scenarioName);
    if (!scenarioName) {
      setErrorScenarioName("This field cant't be empty");
      return;
    } else {
      setErrorScenarioName("");
    }

    let data = {
      conversation: {
        messages: [...dataMessages],
      },
      scenario_name: scenarioName
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
      setIsOpenPreview(false);
      setTimeout(() => {
        setIsOpenPreview(true);
      }, 200);
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');

      }, 2000);
    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }

  const onClickSaveScenario = () => {
    console.log(scenarioName);
    if (!scenarioName) {
      setErrorScenarioName("This field cant't be empty");
      return;
    } else {
      setErrorScenarioName("");
    }
    let data = {
      conversation: {
        messages: [...dataMessages],
      },
      scenario_name: scenarioName
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
    }).catch((error) => {
      console.log(error);
      if (error.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }

  const onClickCreateStatement = async (belongTo, indexMessage) => {
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
              type: 'text_input',
              text_input: {},
              email: {},
              file: {},
              script: {},
              delay: {
                typing_on: false,
              },
              api_link_age: {},
              clear_variable: {
                variables: [dataInputVar[0]?.variable_name]
              },
              variable_set: {
                variables: [
                  {
                    key: dataInputVar[0]?.variable_name,
                    value: ''
                  }
                ]
              }
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
              type: 'text_input',
              text_input: {},
              email: {},
              file: {},
              script: {},
              delay: {},
              api_link_age: {},
              clear_variable: {
                variables: [dataInputVar[0]?.variable_name]
              },
              variable_set: {
                variables: [
                  {
                    key: dataInputVar[0]?.variable_name,
                    value: ''
                  }
                ]
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

    setBelongTo('');
    setDataMessages([...dataMessagesClone]);
    // handleSelectMessage(indexMessage ? indexMessage + 1 : indexMessage, belongTo);
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

  const handleDownloadFile = (file) => {
    console.log(file);
    let link = document.createElement('a');
    link.href = file;
    link.download = "file"
    document.body.appendChild(link);

    link.click();
    link.remove();
  }

  const handleOpenPreview = (isOpen) => {
    if (!isOpenPreview) return;
    if (isOpen) {
      document.getElementById('sp-container').style.height = "610px";
      document.getElementById('sp-header').style.position = "static";
      document.getElementById('sp-header').style.borderBottomLeftRadius = "0px";
      document.getElementById('sp-header').style.borderBottomRightRadius = "0px";
      document.getElementById('sp-process-bar').style.display = "block";
      document.getElementById('sp-body').style.display = "block";
    } else {
      document.getElementById('sp-container').style.height = "0px";
      document.getElementById('sp-process-bar').style.display = "none";
      document.getElementById('sp-body').style.display = "none";
      document.getElementById('sp-header').style.borderBottomLeftRadius = "25px";
      document.getElementById('sp-header').style.borderBottomRightRadius = "25px";
      document.getElementById('sp-header').style.position = "absolute";
      document.getElementById('sp-header').style.bottom = "13px";
    }
    setIsOpenPreview(!isOpenPreview);
  }

  const SampleNextArrow = props => {
    const { className, style, onClick } = props
    return (
      <RightOutlined
        className={className}
        style={{
          ...style,
          color: 'black',
          fontSize: '15px',
          lineHeight: '1.5715'
        }}
        onClick={onClick} />
    )
  }

  function isColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    var test1 = s.color == strColor;
    var test2 = /^#[a-fA-F0-9]{3,6}$/i.test(strColor);
    if (test1 == true || test2 == true) {
      return true;
    } else {
      return false;
    }
  }

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props
    return (
      <LeftOutlined
        className={className}
        style={{
          ...style,
          color: 'black',
          fontSize: '15px',
          lineHeight: '1.5715'
        }}
        onClick={onClick} />
    )
  }

  const handleDisableDateCalendar = (current, calendar) => {
    console.log(calendar.start_date, calendar.end_date, calendar.fixed_date, calendar.non_select_date_time, calendar.aggregation_target_period_from, calendar.aggregation_target_period_to)
    if (calendar.end_date || calendar.start_date
      || calendar.fixed_date.length !== 0 || calendar.non_select_date_time
      || calendar.aggregation_target_period_from || calendar.aggregation_target_period_to
      || calendar.end_date_test || calendar[calendar.type].specified_period_from
      || calendar[calendar.type].specified_period_to) {
      return (moment(current, 'YYYY/MM/DD') > moment(calendar.end_date, 'YYYY/MM/DD')
        || moment(current, 'YYYY/MM/DD') < moment(calendar.start_date, 'YYYY/MM/DD')
        || (calendar.type === "start_end_date" && moment(current, 'YYYY/MM/DD') > moment(calendar.end_date_test, 'YYYY/MM/DD'))
        || calendar.fixed_date?.find(date => date === moment(current).format("YYYY/MM/DD"))
        || moment(current) < (calendar.aggregation_target_period_from ? moment().add(calendar.aggregation_target_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current) > (calendar.aggregation_target_period_to ? moment().add(calendar.aggregation_target_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current, 'YYYY/MM/DD') < (calendar[calendar.type].specified_period_from ? moment(calendar.start_date_test, 'YYYY/MM/DD').add(calendar[calendar.type].specified_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current, 'YYYY/MM/DD') > (calendar[calendar.type].specified_period_to ? moment(calendar.start_date_test, 'YYYY/MM/DD').add(calendar[calendar.type].specified_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
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
    console.log(calendar.start_date_test, calendar[calendar.type].specified_period_from, calendar[calendar.type].specified_period_to)
    if (calendar.end_date || calendar.start_date
      || calendar.fixed_date || calendar.non_select_date_time
      || calendar.start_date_test || calendar.specified_period_from
      || calendar.specified_period_to || calendar.aggregation_target_period_from
      || calendar.aggregation_target_period_to) {
      return (moment(current, 'YYYY/MM/DD') > moment(calendar.end_date, 'YYYY/MM/DD')
        || moment(current, 'YYYY/MM/DD') < moment(calendar.start_date, 'YYYY/MM/DD')
        || (calendar.type === "start_end_date" && moment(current, 'YYYY/MM/DD') < moment(calendar.start_date_test, 'YYYY/MM/DD'))
        || calendar.fixed_date?.find(date => date === moment(current).format("YYYY/MM/DD"))
        || moment(current) < (calendar.aggregation_target_period_from ? moment().add(calendar.aggregation_target_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current) > (calendar.aggregation_target_period_to ? moment().add(calendar.aggregation_target_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current, 'YYYY/MM/DD') < (calendar[calendar.type].specified_period_from ? moment(calendar.start_date_test, 'YYYY/MM/DD').add(calendar[calendar.type].specified_period_from, 'days') : moment(undefined, 'YYYY/MM/DD'))
        || moment(current, 'YYYY/MM/DD') > (calendar[calendar.type].specified_period_to ? moment(calendar.start_date_test, 'YYYY/MM/DD').add(calendar[calendar.type].specified_period_to, 'days') : moment(undefined, 'YYYY/MM/DD'))
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

  const settingsCarousel = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  }

  return (
    <div className="content">
      <div className="ss-actions">
        <Button onClick={() => onClickSaveScenario()}>Keep</Button>
        <Button onClick={() => onClickSavePreview()}>Save and preview</Button>
      </div>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="ss-sc-setting">
                {/* ss overview */}
                <div className="ss-sc-content ss-overview">
                  {/* Input name of scenario */}

                  <div>
                    <InputCustom
                      style={{ width: '100%' }}
                      value={scenarioName}
                      onChange={value => setScenarioName(value)}
                      placeholder="Enter scenario name"
                    />
                    {errorScenarioName && <span style={{ fontSize: '12px', color: '#FF621D' }}>{errorScenarioName}</span>}

                  </div>
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
                                let type;
                                if (message.belong_to === 'bot') {
                                  content = message.message_content[0];
                                  if (content.type === 'file') {
                                    type = content[content.type]?.content?.slice(content[content.type]?.content.lastIndexOf('.') + 1) || "";
                                    console.log(type, 'checkkk type');
                                  }
                                }
                                return message.belong_to === 'bot' ? (
                                  <Draggable key={message.id} draggableId={message.id?.toString()} index={index}>
                                    {(provided) => (
                                      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} id={`message_${index}`} key={index} className="ss-bot-chat-wrapper ss-message-wrapper">
                                        <div
                                          className={`ss-bot-chat ss-message ss-message-${index}`}
                                        >
                                          <div
                                            className="ss-bot-chat-detail ss-message__detail"
                                            onClick={() =>
                                              handleSelectMessage(index, message.belong_to, content?.type)
                                            }
                                          >
                                            <img className="ss-bot-ava" src={icon} alt="" />
                                            {content ?
                                              <React.Fragment>
                                                <div style={{ width: '65%' }}>
                                                  <div style={{ display: 'flex', paddingLeft: '10px' }}>
                                                    {content.type !== 'text_input' && <div className="ss-sub-title-message">{content.type}</div>}
                                                    {message.message_name && <div className="ss-sub-title-message ss-truncation-text" style={{ backgroundColor: '#fff', maxWidth: '60%' }}>{message.message_name}</div>}
                                                  </div>
                                                  {/* bot: type == 'text_input' */}
                                                  {content.type === 'text_input' && (
                                                    <textarea
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                      value={content[content.type]?.content || ''}
                                                      style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                      readOnly
                                                    ></textarea>
                                                  )}
                                                  {/* bot: type == 'file' */}
                                                  {content.type === 'file' && (
                                                    content[content.type]?.content ? (
                                                      <React.Fragment>
                                                        {/* {(type === 'mp4') && */}
                                                        <div style={type !== 'mp4' ? { display: 'none' } : {}} className="ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-video">
                                                          <video
                                                            id="preview-video"
                                                            src={content[content.type]?.content}
                                                            controls
                                                          ></video>
                                                        </div>
                                                        {/* } */}
                                                        {(type === 'jpeg' || type === 'png' || type === 'jpg') &&
                                                          <img
                                                            className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content`}
                                                            src={content[content.type]?.content}
                                                            alt=""
                                                            style={{ width: '27%', border: 'none', height: 'auto', ...message.hidden === true ? { opacity: '0.4' } : {} }}
                                                          />
                                                        }
                                                        {(type === 'pdf') &&
                                                          <textarea
                                                            className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                            style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                            value={content[content.type]?.content}
                                                            readOnly
                                                          ></textarea>
                                                        }
                                                      </React.Fragment>
                                                    ) :
                                                      <textarea
                                                        className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                        style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                        value={''}
                                                        readOnly
                                                      ></textarea>
                                                  )}

                                                  {/* bot: type == 'email' */}
                                                  {content.type === 'email' && (
                                                    <textarea
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                      style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                      value={content[content.type]?.content || ''}
                                                      readOnly
                                                    ></textarea>
                                                  )}

                                                  {/* bot: type == 'api_linkage' || 'pause' */}
                                                  {(content.type === 'api_linkage' || content.type === 'pause') && (
                                                    <textarea
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                      style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                      value={''}
                                                      readOnly
                                                    ></textarea>
                                                  )}
                                                  {/* bot: type == 'script' */}
                                                  {content.type === 'script' && (
                                                    <textarea
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                      style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                      value={content[content.type]?.content || ''}
                                                      readOnly
                                                    ></textarea>
                                                  )}
                                                  {/* bot: type == 'delay' */}
                                                  {content.type === 'delay' && (
                                                    <textarea
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                      style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                      value={`${content[content.type]?.content || 0} 秒`}
                                                      readOnly
                                                    ></textarea>
                                                  )}

                                                  {/* bot: type == 'clear_variable' */}
                                                  {content.type === 'clear_variable' && (
                                                    <div style={{ backgroundColor: 'white', ...message.hidden === true ? { opacity: '0.4' } : {} }} className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                    >
                                                      <ul>
                                                        {console.log(content[content.type]?.variables)}
                                                        {content[content.type]?.variables.length !== 0 && content[content.type]?.variables.map((item, index) => {
                                                          return <li key={index}>
                                                            {item}
                                                          </li>
                                                        })}
                                                      </ul>
                                                    </div>
                                                  )}

                                                  {/* bot: type == 'variable_set' */}
                                                  {content.type === 'variable_set' && (
                                                    <div style={{ backgroundColor: 'white', ...message.hidden === true ? { opacity: '0.4' } : {} }}
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}>
                                                      <ul>
                                                        {console.log(content[content.type]?.variables)}
                                                        {content[content.type]?.variables.length !== 0 && content[content.type]?.variables.map((item, index) => {
                                                          return <li key={index}>
                                                            {item.key} : {item.value}
                                                          </li>
                                                        })}
                                                      </ul>
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="ss-chat-option" style={content.type !== "text_input" ? { marginTop: '25px' } : {}}>
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
                                              </React.Fragment>
                                              :
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
                                  <Draggable key={message.id} draggableId={message.id?.toString()} index={index}>
                                    {(provided) => (
                                      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} key={index} className="ss-user-chat-wrapper ss-message-wrapper">
                                        <div
                                          className={`ss-user-chat ss-message ss-message-${index}`}
                                        // style={message?.message_content.length === 0 ? {width: '30%'}: {}}
                                        >
                                          <div
                                            className="ss-user-chat-detail ss-message__detail"
                                            onClick={() =>
                                              handleSelectMessage(index, message.belong_to, message.message_content[message.message_content.length - 1])
                                            }
                                          >
                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                              {message.message_name && <div className="ss-sub-title-message ss-truncation-text" style={{ backgroundColor: '#fff', maxWidth: '60%', marginRight: '10px' }}>{message.message_name}</div>}
                                              <div className={`ss-user-chat-detail-content ss-user-chat-detail-content-${index} ${message.hidden === true ? "ss-message-hidden-style" : ""}`}
                                                style={message.message_name ? {} : { borderColor: 'red' }}>
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
                                                                    placeholder={textInput[textInput.type].placeholder}
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
                                                                    className="ss-message__content--user-textarea ss-input-value"
                                                                    readOnly
                                                                    placeholder={textarea[textarea.type]?.content}
                                                                    rows={3}
                                                                    value={textarea?.type === 'invalid_input' ? textarea[textarea.type]?.content : ''}
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
                                                              {/* <div className="ss-message__content--user-checkbox-wrapper"> */}
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
                                                              {/* </div> */}
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
                                                                            <div className="ss-message__content--user-pull_down-col col-12" style={{ padding: '0' }}>
                                                                              <SelectCustom
                                                                                data={pullDown[pullDown.type].options_without_comment}
                                                                                keyValue="value"
                                                                                style={{ width: '100%' }}
                                                                                placeholder={pullDown[pullDown.type].display_unselected}
                                                                                nameValue="text"
                                                                              />
                                                                            </div> :
                                                                            <div className="ss-message__content--user-pull_down-col col-12" style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
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
                                                                  <DatePickerCustom
                                                                    style={{ width: '99%', marginTop: '5px' }}
                                                                    value={calendar.date_selection_test ? moment(calendar.date_selection_test) : null}
                                                                    onChange={(date, dateString) => console.log(dateString)}
                                                                    disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                                  />
                                                                </React.Fragment>
                                                              )}
                                                              {/* calendar: type = 'embedded' */}
                                                              {calendar.type === 'embedded' && (
                                                                <React.Fragment>
                                                                  <div className="ss-message__content--user-calender-embedded" style={{ marginTop: '5px' }}>
                                                                    <Calendar
                                                                      className="ss-custom-calendar"
                                                                      fullscreen={false}
                                                                      onPanelChange={(value, mode) => console.log(value)}
                                                                      style={{ top: '20px', width: '300px', border: '1px solid grey' }}
                                                                      value={calendar.date_selection_test ? moment(calendar.date_selection_test) : null}
                                                                      onChange={value => console.log(value.format("DD/MM/YYYY"))}
                                                                      disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                                    />
                                                                  </div>
                                                                </React.Fragment>
                                                              )}
                                                              {/* calendar: type = 'start_end_date' */}
                                                              {calendar.type === 'start_end_date' && (
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                  <DatePickerCustom
                                                                    style={{ width: '49%', marginTop: '5px' }}
                                                                    disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                                    value={calendar.start_date_test ? moment(calendar.start_date_test) : null}
                                                                    onChange={(date, dateString) => console.log(dateString)}
                                                                  />
                                                                  <DatePickerCustom
                                                                    style={{ width: '49%', marginTop: '5px' }}
                                                                    disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
                                                                    value={calendar.end_date_test ? moment(calendar.end_date_test) : null}
                                                                    onChange={(date, dateString) => console.log(dateString)}
                                                                  />
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
                                                        {/* type == 'carousel' */}
                                                        {
                                                          content.type === 'carousel' && (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(carousel.title_require || carousel.require) &&
                                                                <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                                                                  {carousel.title_require &&
                                                                    <span className="ss-message__content--user-checkbox-title">
                                                                      {carousel.title}
                                                                    </span>
                                                                  }
                                                                  {carousel.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      * required
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              <div className="ss-message__content--user-checkbox-wrapper">
                                                                {carousel.type === 'default' && (
                                                                  <Carousel arrows {...settingsCarousel} afterChange={(currentSlide) => setIndexCarouselSlide(currentSlide)}>
                                                                    {carousel[carousel?.type]?.contents &&
                                                                      carousel[carousel?.type]?.contents.map((itemCarousel, indexCarousel) => {
                                                                        return <React.Fragment key={indexCarousel}>
                                                                          <div style={{ width: '100%', minHeight: '298px' }}>
                                                                            <img src={itemCarousel.fileUrl} />
                                                                            {itemCarousel.title && <div style={{ fontWeight: '800' }}>{itemCarousel.title}</div>}
                                                                            {itemCarousel.subtitle && <div>{itemCarousel.subtitle}</div>}
                                                                          </div>
                                                                          {itemCarousel.buttonTitle &&
                                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                                                              <span style={{ minWidth: '10%', height: '10%', backgroundColor: '#088C43', padding: '7px', color: 'white', fontWeight: '400', borderRadius: '5px' }}>
                                                                                {itemCarousel.buttonTitle}
                                                                              </span>
                                                                            </div>
                                                                          }
                                                                        </React.Fragment>
                                                                      })}
                                                                  </Carousel>
                                                                )}
                                                                {carousel.type === 'consume_api_response' && (
                                                                  <>
                                                                  </>
                                                                )}
                                                              </div>
                                                            </div>
                                                          )
                                                        }
                                                        {/* type == 'credit_card_payment' */}
                                                        {
                                                          content.type === 'credit_card_payment' && (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(creditCardPayment.title_require || creditCardPayment.require) &&
                                                                <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                                                                  {creditCardPayment.title_require &&
                                                                    <span className="ss-message__content--user-text-input-title">
                                                                      {creditCardPayment.title}
                                                                    </span>
                                                                  }
                                                                  {creditCardPayment.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      * required
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {creditCardPayment.separate_type === false ?
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="Card number"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={creditCardPayment.card_number_placeholder}
                                                                  />
                                                                </div> :
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <div style={{ width: '100%' }}>Card number</div>
                                                                  <div style={{ width: '100%' }} className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={creditCardPayment.card_number_placeholder1}
                                                                    />
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={creditCardPayment.card_number_placeholder2}
                                                                    />
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={creditCardPayment.card_number_placeholder3}
                                                                    />
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={creditCardPayment.card_number_placeholder4}
                                                                    />
                                                                  </div>
                                                                </div>
                                                              }
                                                              {creditCardPayment.is_hide_card_name === false &&
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="Card holder"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={creditCardPayment.card_number_placeholder}
                                                                  />
                                                                </div>
                                                              }
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div style={{ width: '100%' }}>Date of expiry</div>
                                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                                                  <SelectCustom
                                                                    placeholder="year"
                                                                    style={{ width: '49%' }}
                                                                    value={creditCardPayment.year_placeholder}
                                                                    disabled={true}
                                                                  />
                                                                  <SelectCustom
                                                                    placeholder="month"
                                                                    style={{ width: '49%' }}
                                                                    value={creditCardPayment.month_placeholder}
                                                                    disabled={true}
                                                                  />
                                                                </div>
                                                              </div>
                                                              {creditCardPayment.is_hide_cvc === false &&
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="CVC"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={creditCardPayment.cvc_placeholder}
                                                                  />
                                                                </div>
                                                              }
                                                            </div>
                                                          )
                                                        }
                                                        {/* type == 'capture' */}
                                                        {
                                                          content.type === 'capture' && (
                                                            <div style={{ color: '#6989A6', fontSize: '14px' }}>capture</div>
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
                                                                        className="ss-user-overview-product-purchase-checkbox-group ss-user-overview-product-purchase-style-width"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(value) => console.log(value)}
                                                                        value={productPurchase.initial_selection}
                                                                      >
                                                                        {productPurchase.products.map((itemProduct, indexProduct) => {
                                                                          return <Checkbox key={indexProduct} value={itemProduct.id}>
                                                                            <div className="ss-user-overview-product-purchase-container">
                                                                              <div className="ss-user-overview-product-purchase-img">
                                                                                <img src={itemProduct.img_url} />
                                                                              </div>
                                                                              {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                                                                <div className="ss-user-overview-product-purchase-infor">
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
                                                                                </div>
                                                                              }
                                                                            </div>
                                                                          </Checkbox>
                                                                        })}
                                                                      </Checkbox.Group>
                                                                    </React.Fragment>
                                                                  ) : (
                                                                    <React.Fragment>
                                                                      <Radio.Group
                                                                        className="ss-user-overview-product-purchase-radio-group ss-user-overview-product-purchase-style-width"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(value) => console.log(value)}
                                                                        value={productPurchase.initial_selection[0]}
                                                                      >
                                                                        {productPurchase.products.map((itemProduct, indexProduct) => {
                                                                          return <Radio value={itemProduct.id} key={indexProduct}>
                                                                            <div className="ss-user-overview-product-purchase-container">
                                                                              <div className="ss-user-overview-product-purchase-img">
                                                                                <img src={itemProduct.img_url} />
                                                                              </div>
                                                                              {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                                                                <div className="ss-user-overview-product-purchase-infor">
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
                                                                        className="ss-user-overview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(value) => console.log(value)}
                                                                        value={productPurchase.initial_selection}
                                                                      >
                                                                        {productPurchase.products.map((itemProduct, indexProduct) => {
                                                                          return <Checkbox key={indexProduct} value={itemProduct.id}>
                                                                            <div className="ss-user-overview-product-purchase-container-type-text_image">
                                                                              <div className="ss-user-overview-product-purchase-img-type-text_image">
                                                                                <img src={itemProduct.img_url} />
                                                                              </div>
                                                                              {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                                                                                <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                                                                  {productPurchase.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchase.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchase.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                                                                                </div>
                                                                              }
                                                                            </div>
                                                                          </Checkbox>
                                                                        })}
                                                                      </Checkbox.Group>
                                                                    </React.Fragment>
                                                                  ) : (
                                                                    <React.Fragment>
                                                                      <Radio.Group
                                                                        className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(value) => console.log(value)}
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
                                                                      className="ss-user-overview-product-purchase-radio-group ss-user-overview-product-purchase-style-width"
                                                                      style={{ width: "100%" }}
                                                                      onChange={(value) => console.log(value)}
                                                                    >
                                                                      {productPurchaseRadioButton.products.map((itemProduct, indexProduct) => {
                                                                        return <Radio value={itemProduct.id} key={indexProduct}>
                                                                          <div className="ss-user-overview-product-purchase-container">
                                                                            <div className="ss-user-overview-product-purchase-img">
                                                                              <img src={itemProduct.img_url} />
                                                                            </div>
                                                                            {(productPurchaseRadioButton.product_name_display || productPurchaseRadioButton.price_display || productPurchaseRadioButton.product_number_display) &&
                                                                              <div className="ss-user-overview-product-purchase-infor">
                                                                                {productPurchaseRadioButton.product_name_display && itemProduct.title &&
                                                                                  <div className="ss-user-overview-product-purchase-infor-title">
                                                                                    {itemProduct.title}
                                                                                  </div>
                                                                                }
                                                                                {productPurchaseRadioButton.product_number_display && itemProduct.item_number &&
                                                                                  <div className="ss-user-overview-product-purchase-infor-item-number">
                                                                                    Item No.: {itemProduct.item_number}
                                                                                  </div>
                                                                                }
                                                                                {productPurchaseRadioButton.price_display && itemProduct.item_price &&
                                                                                  <div className="ss-user-overview-product-purchase-infor-price">
                                                                                    Price: {itemProduct.item_price} 円
                                                                                  </div>
                                                                                }
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
                                                                      className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                                                                      style={{ width: "100%" }}
                                                                      onChange={(value) => console.log(value)}
                                                                    >
                                                                      {productPurchaseRadioButton.products && productPurchaseRadioButton.products.map((itemProduct, indexProduct) => {
                                                                        return <Radio value={itemProduct.id} key={indexProduct}>
                                                                          <div className="ss-user-overview-product-purchase-container-type-text_image">
                                                                            <div className="ss-user-overview-product-purchase-img-type-text_image">
                                                                              <img src={itemProduct.img_url} />
                                                                            </div>
                                                                            {(productPurchaseRadioButton.product_name_display || productPurchaseRadioButton.price_display || productPurchaseRadioButton.product_number_display) &&
                                                                              <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                                                                {productPurchaseRadioButton.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchaseRadioButton.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {productPurchaseRadioButton.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : ""}
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
                                                              </div>
                                                            </div>
                                                          )
                                                        }
                                                        {/* type == 'sms_verify' */}
                                                        {content.type === 'sms_verify' && (
                                                          <div style={{ marginBottom: '10px' }}>
                                                            {smsVerify.title_require &&
                                                              <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                                                                {smsVerify.title_require &&
                                                                  <span className="ss-message__content--user-checkbox-title">
                                                                    {smsVerify.title}
                                                                  </span>
                                                                }
                                                              </div>
                                                            }
                                                          </div>
                                                        )}
                                                        {/* type == 'AFTEE_payment_module' */}
                                                        {content.type === 'AFTEE_payment_module' && (
                                                          afteePaymentModule.content &&
                                                          <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '10px' }}>
                                                            {afteePaymentModule.content}
                                                          </div>
                                                        )}
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
                                                                  value={cardPaymentRadioButton.initial_selection}
                                                                >
                                                                  {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
                                                                    console.log(itemPayment)
                                                                    return <Radio value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%' }}>
                                                                      {itemPayment.text}
                                                                    </Radio>
                                                                  })}
                                                                </Radio.Group>
                                                              }
                                                              {cardPaymentRadioButton.type === 'customized_style' &&
                                                                <Radio.Group
                                                                  style={{ width: "100%", fontSize: '14px' }}
                                                                  onChange={(value) => console.log(value)}
                                                                  value={cardPaymentRadioButton.initial_selection}
                                                                  buttonStyle="solid"
                                                                >
                                                                  {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
                                                                    console.log(itemPayment)
                                                                    return <Radio.Button value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%', textAlign: 'center', lineHeight: '22px' }}>
                                                                      {itemPayment.text}
                                                                    </Radio.Button>
                                                                  })}
                                                                </Radio.Group>
                                                              }
                                                              {cardPaymentRadioButton.type === 'picture_radio' && cardPaymentRadioButton.radio_contents_img &&
                                                                cardPaymentRadioButton.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => {
                                                                  return <div key={indexPaymentImg} style={{ color: '#6789A6' }}>
                                                                    <Radio.Group
                                                                      style={{ width: "100%", fontSize: '14px', display: 'flex' }}
                                                                      className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                                                                      onChange={(value) => console.log(value)}
                                                                      value={cardPaymentRadioButton.initial_selection_picture}
                                                                    >
                                                                      {itemPaymentImg.contents.map((itemPaymentContent, indexContent) => {
                                                                        return <Radio value={`${itemPaymentImg.id}-${itemPaymentContent.id}`} key={indexContent} style={{ marginRight: '0px' }}>
                                                                          <img src={itemPaymentContent.file_url}></img>
                                                                          <div style={{ textAlign: 'center', fontSize: '14px', color: '#6789A6', fontWeight: '700' }}>{itemPaymentContent.text}</div>
                                                                        </Radio>
                                                                      })}
                                                                    </Radio.Group>
                                                                  </div>
                                                                })
                                                              }

                                                              {cardPaymentRadioButton.separate_type === false ?
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="Card number"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={cardPaymentRadioButton.card_number_placeholder}
                                                                  />
                                                                </div> :
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <div style={{ width: '100%' }}>Card number</div>
                                                                  <div style={{ width: '100%' }} className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={cardPaymentRadioButton.card_number_placeholder1}
                                                                    />
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={cardPaymentRadioButton.card_number_placeholder2}
                                                                    />
                                                                    <InputCustom
                                                                      disabled={true}
                                                                      placeholder={cardPaymentRadioButton.card_number_placeholder3}
                                                                    />
                                                                    <InputCustom
                                                                      disabled={true}
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
                                                                    disabled={true}
                                                                    placeholder={cardPaymentRadioButton.card_holder_placeholder}
                                                                  />
                                                                </div>
                                                              }
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div style={{ width: '100%' }}>Date of expiry</div>
                                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                                                  <SelectCustom
                                                                    placeholder="year"
                                                                    style={{ width: '49%' }}
                                                                    value={cardPaymentRadioButton.year_placeholder}
                                                                    disabled={true}
                                                                  />
                                                                  <SelectCustom
                                                                    placeholder="month"
                                                                    style={{ width: '49%' }}
                                                                    value={cardPaymentRadioButton.month_placeholder}
                                                                    disabled={true}
                                                                  />
                                                                </div>
                                                              </div>
                                                              {cardPaymentRadioButton.is_hide_cvc === false &&
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="CVC"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={cardPaymentRadioButton.cvc_placeholder}
                                                                  />
                                                                </div>
                                                              }
                                                            </div>
                                                          )
                                                        }
                                                        {/* type == 'label_no_transition' */}
                                                        {content.type === 'label_no_transition' && (
                                                          <div style={{ marginBottom: '10px' }}>
                                                            {labelNoTransition.value}
                                                          </div>
                                                        )}
                                                      </React.Fragment>
                                                    )
                                                  })}
                                                </div>
                                                {message?.message_content.length !== 0 &&
                                                  <div className="ss-user-message__action-wrapper">
                                                    <Button className="ss-user-message__action-btn">
                                                      {message.buttonName || "To the next"}
                                                    </Button>
                                                  </div>
                                                }
                                              </div>
                                            </div>

                                            <div className="ss-chat-option" style={message.message_name ? { marginTop: '25px' } : {}}>
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
                  {dataMessages[indexMessageSelect] &&
                    <React.Fragment>
                      {belongTo === 'bot' && dataMessages[indexMessageSelect].message_content.length !== 0 && (
                        <div className="ss-bot-setting-container">
                          <div id="bot-statement" className="ss-bot-statement-detail-setting">
                            {/* Bot setting detail below */}
                            <div style={{ padding: '10px' }}>
                              <div className="ss-user-setting__top">
                                <div className="ss-user-setting__name-wrapper" style={{ marginBottom: '10px' }}>
                                  <div>
                                    <span>Name</span>
                                    <span className="ss-user-setting__name-error" style={{ marginLeft: '5px', marginTop: '0px' }}>* required</span>
                                  </div>
                                  <InputCustom
                                    placeholder="name"
                                    style={{ width: '100%' }}
                                    onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
                                    value={dataMessages[indexMessageSelect].message_name}
                                  />
                                </div>
                              </div>
                              <label htmlFor="ss-bot-statement-title" style={{ marginBottom: '1px' }}>Type</label>
                              <select
                                name="bot_statement_type"
                                id="ss-bot-statement-type"
                                className="ss-input-value"
                                value={messageType}
                                onChange={e => handleChangeBotStatementType(e.target.value)}
                              >
                                <option value="text_input">Text</option>
                                <option value="file">File</option>
                                <option value="email">Email</option>
                                <option value="api_linkage">API linkage</option>
                                <option value="script">Script</option>
                                <option value="delay">Delay</option>
                                <option value="clear_variable">Clear variable</option>
                                <option value="variable_set">Variable set</option>
                                <option value="pause">Pause</option>
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
                                    <textarea
                                      name="bot-statement-type-file-content"
                                      id="ss-bot-statement-type-file-content"
                                      className="ss-bot-statement-type-file-content ss-input-value"
                                      rows={5}
                                      placeholder="File URL"
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.content || ''}
                                      onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
                                    ></textarea>
                                    <input
                                      type="file"
                                      id="ss-bot-file-upload"
                                      name="bot-file-upload"
                                      hidden
                                      onChange={(e) => getBaseUrl(e)}
                                    />
                                    {fileError &&
                                      <div style={{ color: '#FF7E00', fontSize: '12px' }}>
                                        {fileError}
                                      </div>
                                    }
                                    <CheckboxCustom
                                      label={<span>do not scroll automatically<MDBIcon fas icon="question-circle" style={{ color: '#347AED', marginLeft: '5px', fontSize: '13px' }} /></span>}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.scroll_auto || false}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'scroll_auto')}
                                    />
                                    <div className="ss-file-upload-wrapper">
                                      <Button className="ss-bot-file-reference-btn" onClick={() => setIsOpenFileReference(true)}>
                                        file reference
                                      </Button>
                                      <Button className="ss-bot-file-upload-btn" onClick={botUploadFile}>
                                        addition
                                      </Button>
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
                                      keyValue={"email_template_name"}
                                      nameValue={"email_template_name"}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'content')}
                                    />
                                  </div>
                                </div>
                              )}
                              {/* type: api_linkage */}
                              {messageType === 'api_linkage' && (
                                <div className="ss-bot-statement-wrapper">
                                  <div
                                    className="ss-bot-statement-type-email ss-bot-statement-type"
                                  >
                                    <SelectCustom
                                      style={{ width: '100%' }}
                                      id="title"
                                      data={dataApiLinkage}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.type || ''}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'type')}
                                    />
                                    <CheckboxCustom
                                      className={"ss-checkbox-custom-style"}
                                      label={'Show a "processing" icon'}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.isShowProcessing}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'isShowProcessing')}
                                    />
                                    <InputCustom
                                      style={{ width: '100%' }}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.titleProcessing}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'titleProcessing')}
                                    />
                                    <CheckboxCustom
                                      className={"ss-checkbox-custom-style"}
                                      label={'deactivate previous block'}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.isDeactivePreviousBlock}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'isDeactivePreviousBlock')}
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
                              {/* type: clear_variable */}
                              {messageType === 'clear_variable' && (
                                <div className="ss-bot-statement-wrapper" style={{ marginTop: '15px' }}>
                                  {console.log(dataMessages[indexMessageSelect].message_content[0][messageType]?.variables)}
                                  <span style={{ fontWeight: '400' }}>variable</span>
                                  {dataMessages[indexMessageSelect].message_content[0][messageType]?.variables &&
                                    dataMessages[indexMessageSelect].message_content[0][messageType]?.variables
                                      .map((item, index, arr) => {
                                        return (
                                          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                            <SelectCustom
                                              style={{ width: '30%', marginTop: '5px' }}
                                              data={dataInputVar}
                                              keyValue="variable_name"
                                              nameValue="variable_name"
                                              value={item}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index)}
                                            />
                                            {arr.length > 1 &&
                                              <MDBIcon style={{ marginLeft: '5px' }} fas icon="times-circle" onClick={() => {
                                                let arrMessage = [...dataMessages[indexMessageSelect].message_content[0][messageType].variables];
                                                let startArr = arrMessage.slice(0, index);
                                                let lastArr = arrMessage.slice(index + 1, arrMessage.length);
                                                dataMessages[indexMessageSelect].message_content[0][messageType].variables = [...startArr, ...lastArr];
                                                setDataMessages([...dataMessages]);
                                              }} />
                                            }
                                          </div>
                                        )
                                      })
                                  }
                                  <Button onClick={() => {
                                    dataMessages[indexMessageSelect].message_content[0][messageType]?.variables.push(dataInputVar[0]?.variable_name);
                                    setDataMessages([...dataMessages]);
                                  }}>addition</Button>
                                </div>
                              )}
                              {/* type: variable_set */}
                              {messageType === 'variable_set' && (
                                <div className="ss-bot-statement-wrapper" style={{ marginTop: '15px' }}>
                                  {console.log(dataMessages[indexMessageSelect].message_content[0][messageType]?.variables)}
                                  <span>*If you want to use a variable for the conditional branch immediately after, please use the variable set block on the user side.</span>
                                  <span style={{ fontWeight: '400', marginTop: '15px', display: 'block' }}>variable</span>
                                  {dataMessages[indexMessageSelect].message_content[0][messageType]?.variables &&
                                    dataMessages[indexMessageSelect].message_content[0][messageType]?.variables
                                      .map((item, index, arr) => {
                                        return (
                                          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                            <SelectCustom
                                              style={{ width: '30%', marginTop: '5px' }}
                                              data={dataInputVar}
                                              keyValue="variable_name"
                                              nameValue="variable_name"
                                              value={item.key}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index, 'key')}
                                            />
                                            <InputCustom
                                              style={{ width: '60%', marginLeft: '10px', marginTop: '5px' }}
                                              value={item.value}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index, 'value')}
                                            />
                                            {arr.length > 1 &&
                                              <MDBIcon style={{ marginLeft: '5px' }} fas icon="times-circle" onClick={() => {
                                                let arrMessage = [...dataMessages[indexMessageSelect].message_content[0][messageType].variables];
                                                let startArr = arrMessage.slice(0, index);
                                                let lastArr = arrMessage.slice(index + 1, arrMessage.length);
                                                dataMessages[indexMessageSelect].message_content[0][messageType].variables = [...startArr, ...lastArr];
                                                setDataMessages([...dataMessages]);
                                              }} />
                                            }
                                          </div>
                                        )
                                      })
                                  }
                                  <Button onClick={() => {
                                    dataMessages[indexMessageSelect].message_content[0][messageType]?.variables.push({ key: dataInputVar[0]?.variable_name, value: '' });
                                    setDataMessages([...dataMessages]);
                                  }}>addition</Button>
                                </div>
                              )}

                              {/* type: pause */}
                              {messageType === 'pause' && (
                                <div style={{ marginTop: '15px', fontWeight: '700' }}>pause</div>
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
                                          keyValue={"variable_name"}
                                          nameValue={"variable_name"}
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
                              {/* <div className="ss-bot-setting-condition-bottom-button">
                                <Button className="ss-bot-setting-condition-keep-button">
                                  keep
                                </Button>
                              </div> */}
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
                                style={dataMessages[indexMessageSelect].message_name ? {} : { borderColor: 'red' }}
                                onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
                                value={dataMessages[indexMessageSelect].message_name}
                              />
                              {!dataMessages[indexMessageSelect].message_name && <div style={{ color: 'rgb(185, 74, 72)' }}>
                                Must be specified.
                              </div>}
                            </div>
                          </div>
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="messages">
                              {(provided) => {
                                let messageUserSelect = dataMessages && dataMessages.filter((message, index) => (message.belong_to === 'user' && index === indexMessageSelect))[0]?.message_content;
                                return <div className="ss-user-setting__main" {...provided.droppableProps} ref={provided.innerRef}>
                                  {messageUserSelect &&
                                    messageUserSelect
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
                                          <Draggable key={content.id} draggableId={content.id?.toString()} index={indexContent}>
                                            {(provided) => (
                                              <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <div
                                                  id={indexContent === (arr.length - 1) ? 'last-element' : ''}
                                                  className={`ss-user-setting__item ss-user-setting__item-${indexContent} ${indexContent === (arr.length - 1) ? 'ss-user-setting__item--active' : ''}`}
                                                  onClick={() => handleSelectContentMessage(indexContent, content.type)}
                                                  style={{ marginBottom: '10px' }}
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
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={textInput.is_save_input_content}
                                                            isOnChange={false}
                                                          />
                                                        </div>
                                                        {textInput.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={textInput?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Use APIs to validate input values"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                              value={textInput.use_api_input_value}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={textInput.require}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      {textInput.use_api_input_value &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            // style={{ width: '49%' }}
                                                            value={textInput.data_use_api_input_value}
                                                            data={[]}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'data_use_api_input_value')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={textInput.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={textInput.type}
                                                            data={type}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
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
                                                              max={textInput[textInput.type]?.character_limit_to}
                                                              min={0}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_from')}
                                                              value={textInput[textInput.type]?.character_limit_from}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={textInput[textInput.type]?.character_limit_from || 0}
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
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'placeholder')}
                                                            value={textInput[textInput.type]?.placeholder}
                                                          />
                                                        </div>
                                                      }
                                                      {/* text_input: type = email_address */}
                                                      {textInput.type === 'email_address' &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="placeholder"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'placeholder')}
                                                            value={textInput[textInput.type].placeholder}
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
                                                              max={textInput[textInput.type]?.character_limit_to}
                                                              min={0}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_from')}
                                                              value={textInput[textInput.type]?.character_limit_from}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={textInput[textInput.type]?.character_limit_from || 0}
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
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'textarea', value, 'is_save_input_content')}
                                                            value={textarea.is_save_input_content}
                                                          />
                                                          {textarea.is_save_input_content &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                <SelectCustom
                                                                  style={{ width: '100%', marginRight: '10px' }}
                                                                  id="title"
                                                                  value={textarea?.save_input_content}
                                                                  data={dataInputVar}
                                                                  keyValue="variable_name"
                                                                  nameValue="variable_name"
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
                                                            max={textarea.text_input?.character_limit_to}
                                                            min={0}
                                                            value={textarea.text_input?.character_limit_from}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'character_limit_from')}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={textarea.text_input?.character_limit_from || 0}
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
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={radioButton.is_save_input_content}
                                                        />
                                                        {radioButton.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={radioButton?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef}>
                                                                                  {console.log(itemRadio)}
                                                                                  <div style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                                    {radioButton.type === 'radio_button_img' &&
                                                                                      <React.Fragment>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                          <InputCustom
                                                                                            style={{ width: '86%' }}
                                                                                            placeholder="File URL"
                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, 'img')}
                                                                                            value={itemRadio.img}
                                                                                          />
                                                                                          <MDBIcon onClick={() => {
                                                                                            setIsOpenFileReference(true)
                                                                                            setVarFileReference({ indexContent, contentType: content.type, subContentType: radioButton.type, indexSubContent: indexRadio, img: 'img' })
                                                                                          }}
                                                                                            fas icon="paperclip"
                                                                                            style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
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
                                                                                          onChange={() => {
                                                                                            if (radioButton.initial_selection !== itemRadio.id) {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.id, 'initial_selection');
                                                                                            } else {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                            }
                                                                                          }}
                                                                                          value={radioButton.initial_selection === itemRadio.id}
                                                                                          isOnChange={false}
                                                                                        />
                                                                                      </React.Fragment>
                                                                                    }
                                                                                    {(radioButton.type === 'default' || radioButton.type === 'block_style') &&
                                                                                      <React.Fragment>
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                          <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
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
                                                                                        </div>
                                                                                        <CheckboxCustom
                                                                                          label="Initial selection setting"
                                                                                          onChange={() => {
                                                                                            if (radioButton.initial_selection !== itemRadio.id) {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.id, 'initial_selection');
                                                                                            } else {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                            }
                                                                                          }}
                                                                                          value={radioButton.initial_selection === itemRadio.id}
                                                                                          isOnChange={false}
                                                                                        />
                                                                                      </React.Fragment>
                                                                                    }
                                                                                  </div>
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
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={checkbox.is_save_input_content}
                                                        />
                                                        {checkbox.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={checkbox?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                      {(checkbox.type !== 'consume_api_response') && (
                                                        <React.Fragment>
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
                                                              max={checkbox.selection_limit_to}
                                                              min={0}
                                                              disabled={!checkbox.require}
                                                              value={checkbox.selection_limit_from}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'selection_limit_from')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={checkbox.selection_limit_from || 0}
                                                              max={checkbox?.[checkbox.type].length}
                                                              value={checkbox.selection_limit_to}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'selection_limit_to')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      )}
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

                                                                  return <div className="ss-user-setting-item-checkbox-button-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                    {
                                                                      Array.isArray(checkbox?.[checkbox.type]) && checkbox?.[checkbox.type]
                                                                        .map((itemCheckbox, indexCheckbox, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemCheckbox.id} draggableId={itemCheckbox.id + ''} index={indexCheckbox}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef} >
                                                                                  <div style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                                    {checkbox.type === 'checkbox_img' &&
                                                                                      <React.Fragment>
                                                                                        <div className="ss-user-setting__item-bottom" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                          <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                          <InputCustom
                                                                                            style={{ width: '86%' }}
                                                                                            placeholder="File URL"
                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, 'img')}
                                                                                            value={checkbox[checkbox.type][indexCheckbox].img}
                                                                                          />
                                                                                          <MDBIcon onClick={() => {
                                                                                            setIsOpenFileReference(true)
                                                                                            setVarFileReference({ indexContent, contentType: content.type, subContentType: checkbox.type, indexSubContent: indexCheckbox, img: 'img' })
                                                                                          }}
                                                                                            fas icon="paperclip"
                                                                                            style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
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
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={zipCodeAddress.is_save_input_content}
                                                          />
                                                        </div>
                                                        {zipCodeAddress.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={zipCodeAddress?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                              data={dataInputVar}
                                                              keyValue="variable_name"
                                                              nameValue="variable_name"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                            />
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, zipCodeAddress.isCheckRequire === 'require' ? '' : 'require', 'isCheckRequire')}
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
                                                              classIcon={"ss-plus-circle-option-icon-times-custom"}
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
                                                              style={{ width: '6%' }}
                                                              // onClick={onClickIcon}
                                                              onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'post_code')}
                                                              fas
                                                              icon="times-circle"
                                                              className={"ss-plus-circle-option-icon-times-custom"}
                                                            />
                                                          </div>
                                                      )}
                                                      {zipCodeAddress.prefecture !== undefined &&
                                                        <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                                          <span style={{ fontSize: '14px', fontWeight: '400' }}
                                                            className="ss-custom-label-zip-code">Prefecture</span>
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
                                                            style={{ width: '35%', paddingLeft: '7px', marginBottom: '0px' }}
                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_dropdown')}
                                                            value={zipCodeAddress.is_use_dropdown}
                                                          />
                                                          <MDBIcon
                                                            style={{ width: '5%', marginLeft: '3px' }}
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'prefecture')}
                                                            fas
                                                            icon="times-circle"
                                                            className={"ss-plus-circle-option-icon-times-custom"}
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
                                                            classIcon={"ss-plus-circle-option-icon-times-custom"}
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
                                                            classIcon={"ss-plus-circle-option-icon-times-custom"}
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
                                                            classIcon={"ss-plus-circle-option-icon-times-custom"}
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
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={attachingFile.is_save_input_content}
                                                          />
                                                        </div>
                                                        {attachingFile.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                id="title"
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                value={attachingFile?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={attachingFile.require}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Multiple file upload"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'multifile_upload')}
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
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={calendar.is_save_input_content}
                                                          />
                                                        </div>
                                                        {calendar.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                value={calendar?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                          <span className="ss-user-setting-label" style={{ marginRight: '12px' }}>start date</span>
                                                          <DatePickerCustom
                                                            style={{ width: '39%' }}
                                                            value={calendar.start_date ? moment(calendar.start_date) : null}
                                                            onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'start_date')}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4', marginRight: '10px' }}>~</span>
                                                          <DatePickerCustom
                                                            style={{ width: '39%' }}
                                                            value={calendar.end_date ? moment(calendar.end_date) : null}
                                                            onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'end_date')}
                                                          />
                                                        </div>
                                                        <CheckboxCustom
                                                          label="Use APIs to validate input values"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                          value={calendar.use_api_input_value}
                                                        />
                                                        <CheckboxCustom
                                                          label="Initial selection (shortest date from today)"
                                                          onChange={value => {
                                                            if (value === true) {
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY/MM/DD"), 'date_selection_test');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY/MM/DD"), 'date_select');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY/MM/DD"), 'start_date_select');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY/MM/DD"), 'end_date_select');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY/MM/DD"), 'start_date_test');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY/MM/DD"), 'end_date_test');
                                                            } else {
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'date_selection_test');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'date_select');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'start_date_select');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'end_date_select');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'start_date_test');
                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'end_date_test');
                                                            }
                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'initial_selection');
                                                          }}
                                                          value={calendar.initial_selection}
                                                        />
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            label="Non-selectable date and time:"
                                                            mode="multiple"
                                                            styleLabel={{ fontWeight: '700' }}
                                                            style={{ width: '66%' }}
                                                            data={dataSelectDateTime}
                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'non_select_date_time')}
                                                            value={calendar.non_select_date_time}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start ss-user-setting__item-custom">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>fixed date</span>
                                                          <DatePickerCustom
                                                            value={calendar.select_fixed_date ? moment(calendar.select_fixed_date) : null}
                                                            onChange={(date, dateString) => onChangeFixedDate(indexMessageSelect, indexContent, content.type, dateString, 'fixed_date')}
                                                            style={{ width: '88%' }}
                                                            allowClear={false}
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
                                                          <div><span className="ss-user-setting-label" style={{ marginRight: '10px', fontWeight: '700', fontSize: '14px' }}>Selectable dates (ranges based on "today")</span></div>
                                                          <div><span className="ss-user-setting-label" style={{ marginRight: '10px' }}>*Both positive and negative numbers can be specified.</span></div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>Aggregation target period</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={Number.MIN_SAFE_INTEGER}
                                                            max={calendar.aggregation_target_period_to}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'aggregation_target_period_from')}
                                                            value={calendar.aggregation_target_period_from}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={calendar.aggregation_target_period_from}
                                                            max={Number.MAX_SAFE_INTEGER}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'aggregation_target_period_to')}
                                                            value={calendar.aggregation_target_period_to}
                                                          />
                                                        </div>
                                                        {/* calendar: type = date_selection */}
                                                        {calendar.type === 'date_selection' &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DatePickerCustom
                                                              style={{ width: '99%' }}
                                                              value={calendar.date_selection_test ? moment(calendar.date_selection_test) : null}
                                                              onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'date_selection_test')}
                                                              disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                            />
                                                          </div>
                                                        }
                                                        {/* calendar: type = embedded */}
                                                        {calendar.type === 'embedded' &&
                                                          <div className="ss-user-setting__item-bottom-flex-start" style={{ height: '380px' }}>
                                                            <Calendar
                                                              className="ss-custom-calendar"
                                                              fullscreen={false}
                                                              onPanelChange={(value, mode) => console.log(value)}
                                                              style={{ top: '20px', width: '300px', border: '1px solid grey' }}
                                                              value={calendar.date_selection_test ? moment(calendar.date_selection_test) : null}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value.format("DD/MM/YYYY"), 'date_selection_test')}
                                                              disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
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
                                                                style={{ width: '16%' }}
                                                                min={1}
                                                                max={calendar[calendar.type].specified_period_to}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, calendar.type, 'specified_period_from')}
                                                                value={calendar[calendar.type].specified_period_from}
                                                              />
                                                              <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                              <InputNum
                                                                placeholder="0000"
                                                                className="ss-user-setting-input-limit-character"
                                                                style={{ width: '16%' }}
                                                                min={calendar[calendar.type].specified_period_from}
                                                                max={9999}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, calendar.type, 'specified_period_to')}
                                                                value={calendar[calendar.type].specified_period_to}
                                                              />
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom-flex-start" style={{ display: 'block', height: '15px' }}>
                                                              <div><span className="ss-user-setting-label" style={{ marginRight: '10px', color: '#ccc' }}>*The end date is linked to the specified period of N days from the start date.</span></div>
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'space-around' }}>
                                                              <DatePickerCustom
                                                                style={{ width: '49%' }}
                                                                disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                                value={calendar.start_date_test ? moment(calendar.start_date_test) : null}
                                                                onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'start_date_test')}
                                                              />
                                                              <DatePickerCustom
                                                                style={{ width: '49%' }}
                                                                disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
                                                                value={calendar.end_date_test ? moment(calendar.end_date_test) : null}
                                                                onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'end_date_test')}
                                                              />
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
                                                                        style={{ width: '94%', marginBottom: '10px', display: 'inline' }}
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
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={pullDown.is_save_input_content}
                                                        />
                                                        {pullDown.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={pullDown?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                                    return <div className="ss-user-setting-item-pull-down-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
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
                                                                                  >
                                                                                    <div style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" />
                                                                                      <InputDouble
                                                                                        style={array.length === 1 && !pullDown[pullDown.type]?.is_comment ? { width: '95%' } : {}}
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
                                                                                      {array.length >= 2 &&
                                                                                        <MDBIcon
                                                                                          fas
                                                                                          style={{ fontSize: '25px' }}
                                                                                          icon="times-circle"
                                                                                          onClick={(e) => handleRemoveItemCustomizePullDown(indexMessageSelect, indexContent, content.type, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown)}
                                                                                        />
                                                                                      }
                                                                                    </div>
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
                                                              data={dataHourFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at', 'dataHour')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="When finished"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHourFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at', 'dataHour')}
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
                                                              data={dataYearFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
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
                                                                data={dataMonthFixed}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type].day}
                                                                data={dataDayFixed}
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
                                                              data={dataYearFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
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
                                                                data={[{ key: '2022', value: '2022' }, { key: '2023', value: '2023' }]}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonthFixed}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDayFixed}
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
                                                              data={dataHourFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at', 'dataHour')}

                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="When finished"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHourFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at', 'dataHour')}
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
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="Start year"
                                                              data={dataYearFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
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
                                                                data={dataYearFixed}
                                                                placeholder="Year"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonthFixed}
                                                                placeholder="Month"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDayFixed}
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
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="Start year"
                                                              data={dataYear}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="End year"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYear}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
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
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="At start"
                                                              data={dataHour}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at', 'dataHour')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="When finished"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHour}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at', 'dataHour')}
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
                                                              keyValue="id"
                                                              nameValue="name"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'prefecture')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '42%' }}
                                                              placeholder="Select city"
                                                              value={pullDown?.[pullDown.type]?.city}
                                                              data={[]}
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
                                                  {/* user: type = 'carousel' */}
                                                  {content.type === 'carousel' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={carousel.is_save_input_content}
                                                            isOnChange={false}
                                                          />
                                                        </div>
                                                        {carousel.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={carousel?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Use shortened URLs"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_shortened_urls')}
                                                              value={carousel.use_shortened_urls}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={carousel.require}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={carousel.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={carousel.type}
                                                            data={carouselType}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* carousel: withTitle = true */}
                                                      {carousel?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={carousel.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* carousel: type = default */}
                                                      {carousel.type === 'default' && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom" style={carousel[carousel.type]?.contents.length > 1 ? { marginBottom: '0px' } : {}}>
                                                            <div style={{ width: '90%' }}>
                                                              <Button style={{ margin: '0px', backgroundColor: '#327AED' }} onClick={() => {
                                                                dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents.push({
                                                                  title: '',
                                                                  subtitle: '',
                                                                  urls: '',
                                                                  fileUrl: '',
                                                                  buttonTitle: ''
                                                                });
                                                                setDataMessages([...dataMessages]);
                                                              }}>addition</Button>
                                                            </div>
                                                          </div>
                                                          {carousel[carousel.type]?.contents.length > 1 &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div style={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                                                                <MDBIcon fas icon="times-circle" style={{ marginRight: '25px' }} onClick={() => {
                                                                  let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
                                                                  let startArr = arrMessage.slice(0, indexCarouselSlide);
                                                                  let lastArr = arrMessage.slice(indexCarouselSlide + 1, arrMessage.length);
                                                                  console.log(arrMessage, [...startArr, ...lastArr]);
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents = [...startArr, ...lastArr];
                                                                  setDataMessages([...dataMessages]);
                                                                  // carouselSlide.current.goTo(indexMessageSelect)
                                                                }} />
                                                              </div>
                                                            </div>
                                                          }
                                                          <div style={{ width: '92%', marginLeft: '4%' }}>
                                                            <Carousel arrows {...settingsCarousel} afterChange={(currentSlide) => setIndexCarouselSlide(currentSlide)}>
                                                              {carousel[carousel.type]?.contents.map((itemCarousel, indexCarousel) => {
                                                                return <React.Fragment key={indexCarousel}>
                                                                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={indexCarousel}>
                                                                    <InputCustom
                                                                      placeholder="title"
                                                                      value={itemCarousel.title}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'title')}
                                                                    />
                                                                    <InputCustom
                                                                      className="ss-mg-top-5"
                                                                      placeholder="subtitle"
                                                                      value={itemCarousel.subtitle}
                                                                      maxLength={90}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'subtitle')}
                                                                    />
                                                                    <InputCustom
                                                                      className="ss-mg-top-5"
                                                                      placeholder="URLs"
                                                                      value={itemCarousel.urls}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'urls')}
                                                                    />
                                                                    <InputCustom
                                                                      className="ss-mg-top-5"
                                                                      placeholder="File URL"
                                                                      value={itemCarousel.fileUrl}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'fileUrl')}
                                                                    />
                                                                  </div>
                                                                </React.Fragment>
                                                              })}
                                                            </Carousel>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ marginTop: '20px' }}>
                                                            <span style={{ fontWeight: '400', width: '90%' }}>*JPEG or PNG/horizontal image with an aspect ratio of 1.91:1 or square image with an aspect ratio of 1:1</span>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-file-upload-wrapper" style={{ width: '90%' }}>
                                                              <Button style={{ margin: '0px', marginRight: '15px' }} className="ss-bot-file-reference-btn" onClick={() => {
                                                                setIsOpenFileReference(true)
                                                                setVarFileReference({ indexContent, contentType: content.type, subContentType: carousel.type, childSubContentType: 'contents', indexSubContent: indexCarouselSlide, img: 'fileUrl' })
                                                              }}>
                                                                file reference
                                                              </Button>
                                                              <input
                                                                type="file"
                                                                id="ss-carouse-file-upload"
                                                                name="carouse-file-upload"
                                                                hidden
                                                                onChange={(e) => getBaseUrl(e, indexContent)}
                                                              />
                                                              <Button style={{ margin: '0px' }} className="ss-bot-file-upload-btn" onClick={carouselUploadFile}>
                                                                addition
                                                              </Button>
                                                            </div>
                                                          </div>
                                                          {fileErrorCarousel && <div className="ss-user-setting__item-bottom">
                                                            <div style={{ color: '#FF7E00', fontSize: '12px', width: '90%' }}>
                                                              {fileErrorCarousel}
                                                            </div>
                                                          </div>
                                                          }
                                                          <div className="ss-user-setting__item-bottom" style={{ width: '90%', height: '1px', marginLeft: '5%', backgroundColor: 'gray' }}></div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="button title"
                                                              value={carousel[carousel.type].contents[indexCarouselSlide]?.buttonTitle}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarouselSlide, 'buttonTitle')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      )}
                                                    </>
                                                  )}
                                                  {/* user: type = 'credit_card_payment' */}
                                                  {content.type === 'credit_card_payment' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={creditCardPayment.is_save_input_content}
                                                          />
                                                        </div>
                                                        {creditCardPayment.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={creditCardPayment?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
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
                                                            value={creditCardPayment.require}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Hide CVC"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_cvc')}
                                                              value={creditCardPayment.is_hide_cvc}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Hide card name"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_card_name')}
                                                              value={creditCardPayment.is_hide_card_name}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="Separate type"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_type')}
                                                              value={creditCardPayment.separate_type}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required" style={{ marginLeft: '80px' }}>
                                                            <CheckboxCustom
                                                              label="Perform a validity check"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'validity_check')}
                                                              value={creditCardPayment.validity_check}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required" style={{ width: '35%', marginLeft: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                                            <span style={{ paddingTop: '3px' }}>date of expiry</span>
                                                            <SelectCustom
                                                              style={{ width: '53%' }}
                                                              value={creditCardPayment.type_date_of_expiry}
                                                              data={[{ key: 'ym', value: 'YM' }, { key: 'my', value: 'MY' }]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type_date_of_expiry')}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <SelectCustom
                                                          // style={{ width: '90%' }}
                                                          value={creditCardPayment.title_require}
                                                          data={dropDownTitle}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                        />
                                                      </div>
                                                      {/* creditCardPayment: withTitle = true */}
                                                      {creditCardPayment?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={creditCardPayment.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <CheckboxGroupCustom
                                                          style={{ width: '90%' }}
                                                          value={creditCardPayment.payment_method}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'payment_method')}
                                                          data={dataPaymentMethod}
                                                        />
                                                      </div>
                                                      {creditCardPayment.separate_type === false ?
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            styleLabel={{ width: '90%' }}
                                                            label="Card number"
                                                            inline={false}
                                                            placeholder="placeholder"
                                                            value={creditCardPayment.card_number_placeholder}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder')}
                                                          />
                                                        </div> :
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>Card number</div>
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={creditCardPayment.card_number_placeholder1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder1')}
                                                            />
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={creditCardPayment.card_number_placeholder2}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder2')}
                                                            />
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={creditCardPayment.card_number_placeholder3}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder3')}
                                                            />
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={creditCardPayment.card_number_placeholder4}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder4')}
                                                            />
                                                          </div>
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          styleLabel={{ width: '90%' }}
                                                          label="Card holder"
                                                          inline={false}
                                                          placeholder="placeholder"
                                                          value={creditCardPayment.card_holder_placeholder}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder')}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%' }}>Date of expiry</div>
                                                        <div style={{ display: 'flex', width: '90%' }}>
                                                          <SelectCustom
                                                            placeholder="year"
                                                            style={{ width: '25%' }}
                                                            value={creditCardPayment.year_placeholder}
                                                            data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'year_placeholder')}
                                                          />
                                                          <SelectCustom
                                                            placeholder="month"
                                                            style={{ width: '25%', marginLeft: '10px' }}
                                                            value={creditCardPayment.month_placeholder}
                                                            data={dataMonthFixed}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'month_placeholder')}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          styleLabel={{ width: '90%' }}
                                                          label="CVC"
                                                          inline={false}
                                                          placeholder="placeholder"
                                                          value={creditCardPayment.cvc_placeholder}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'cvc_placeholder')}
                                                        />
                                                      </div>
                                                    </>
                                                  )}
                                                  {/* user: type = 'capture' */}
                                                  {content.type === 'capture' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <SelectCustom
                                                          // style={{ width: '90%' }}
                                                          value={capture.title_require}
                                                          data={dropDownTitle}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                        />
                                                      </div>
                                                      {/* capture: withTitle = true */}
                                                      {capture?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={capture.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between' }}>
                                                          <div style={{ width: '32%' }}>
                                                            <div>Type</div>
                                                            <SelectCustom
                                                              placeholder="type"
                                                              style={{ width: '100%' }}
                                                              value={capture.type}
                                                              data={[
                                                                { key: '0123456789', value: 'Numbers' }, { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', value: 'Alphanumeric' }, { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', value: 'Alphabet only' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            />
                                                          </div>
                                                          <div style={{ width: '32%' }}>
                                                            <div>Length</div>
                                                            <InputNum
                                                              className="ss-user-setting-input-limit-character"
                                                              style={{ width: '100%', marginLeft: '0px' }}
                                                              min={1}
                                                              max={9999}
                                                              value={capture.length}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'length')}
                                                            />
                                                          </div>
                                                          <div style={{ width: '32%' }}>
                                                            <div>Colour</div>
                                                            <SelectCustom
                                                              placeholder="colour"
                                                              style={{ width: '100%' }}
                                                              value={capture.colour}
                                                              data={[{ key: true, value: 'Can be' }, { key: false, value: 'None' }]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'colour')}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%' }}>
                                                          <img style={{ width: '35%' }} src={`https://svg-captcha.herokuapp.com/captchapreview?size=${capture.length}${capture.colour ? "&color=true" : ""}&charPreset=${capture.type}`} />
                                                        </div>
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'product_purchase' */}
                                                  {content.type === 'product_purchase' && (
                                                    <>
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                                                        <div style={{ width: '90%' }}>
                                                          <CheckboxCustom
                                                            label="Required"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                            value={productPurchase.require}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={productPurchase.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={productPurchase.type}
                                                            data={[
                                                              { key: 'text_with_thumbnail_image', value: 'Text with thumbnail image' },
                                                              { key: 'text_with_image', value: 'Text with image' },
                                                              { key: 'consume_api_respone', value: 'Consume API response' }
                                                            ]}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* productPurchase: withTitle = true */}
                                                      {productPurchase?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={productPurchase.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <Row style={{ width: '90%' }}>
                                                          <Col xl={4} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Quantity Designation"
                                                              value={productPurchase.quantity_designation_all}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'quantity_designation_all')}
                                                            />
                                                          </Col>
                                                          <Col xl={5} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Product Number Display"
                                                              value={productPurchase.product_number_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_number_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={3} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Price display"
                                                              value={productPurchase.price_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'price_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={4} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Product name display"
                                                              value={productPurchase.product_name_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_name_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={5} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Multiple item purchase"
                                                              value={productPurchase.multiple_item_purchase}
                                                              onChange={(value) => {
                                                                let selectArr = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection];
                                                                if (value === false && selectArr.length > 0) {
                                                                  onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, [selectArr[0]], 'initial_selection');
                                                                }
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'multiple_item_purchase')
                                                              }}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      {productPurchase.type !== 'consume_api_respone' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'products')}>
                                                              <Droppable droppableId='product-purchase'>
                                                                {(providedChild) => {
                                                                  return <div className="ss-user-setting-item-product-purchase" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                    {
                                                                      Array.isArray(productPurchase?.products) && productPurchase?.products
                                                                        .map((itemProduct, indexProduct, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemProduct.id} draggableId={itemProduct.id + ''} index={indexProduct}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef} >
                                                                                  <div className="ss-user-setting-product-purchase-container" style={array.length > 1 ? { marginBottom: '10px' } : {}}>
                                                                                    <div className="ss-user-setting-product-purchase-file-img">
                                                                                      <InputCustom
                                                                                        className="ss-mg-bottom-5"
                                                                                        value={itemProduct.img_url}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'img_url')}
                                                                                      />
                                                                                      <MDBIcon
                                                                                        className="ss-mg-bottom-5" fas icon="folder-open"
                                                                                        onClick={() => {
                                                                                          setIsOpenFileReference(true)
                                                                                          setVarFileReference({ indexContent, contentType: content.type, subContentType: 'products', indexSubContent: indexProduct, img: 'img_url' })
                                                                                        }}
                                                                                      />
                                                                                    </div>
                                                                                    <div className="ss-user-setting-product-purchase-infor-product">
                                                                                      <InputCustom
                                                                                        placeholder="title"
                                                                                        style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                                                                                        className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left"
                                                                                        value={itemProduct.title}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'title')}
                                                                                      />
                                                                                      <InputCustom
                                                                                        placeholder="item number"
                                                                                        style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderLeft: '0px', borderRight: '0px' }}
                                                                                        className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle"
                                                                                        value={itemProduct.item_number}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_number')}
                                                                                      />
                                                                                      <InputNum
                                                                                        placeholder="price"
                                                                                        className="ss-mg-bottom-5 ss-user-setting-input-limit-character"
                                                                                        style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '0px', width: '78%' }}
                                                                                        value={itemProduct.item_price}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_price')}
                                                                                      />
                                                                                    </div>
                                                                                    <div className="ss-user-setting-product-purchase-sub-infor">
                                                                                      <div style={{ width: '50%' }}>
                                                                                        <InputNum
                                                                                          className="ss-user-setting-input-limit-character ss-mg-bottom-5"
                                                                                          style={{ marginLeft: '0px', width: '50%' }}
                                                                                          label="Quantity limit"
                                                                                          value={itemProduct.quantity_limit}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'quantity_limit')}
                                                                                        />
                                                                                      </div>
                                                                                      {productPurchase.price_display &&
                                                                                        <div style={{ width: '50%' }}>
                                                                                          <InputCustom
                                                                                            className="ss-mg-bottom-5"
                                                                                            label="Price display contents (customized)"
                                                                                            value={itemProduct.price_display_custom}
                                                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')}
                                                                                          />
                                                                                        </div>
                                                                                      }
                                                                                    </div>
                                                                                    <div className="ss-user-setting-product-purchase-sub-infor">
                                                                                      <div style={{ width: '50%' }}>
                                                                                        <CheckboxCustom
                                                                                          label="Initial selection setting"
                                                                                          value={productPurchase.initial_selection.includes(itemProduct.id)}
                                                                                          onChange={() => {
                                                                                            let selectArr = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection];
                                                                                            if (productPurchase.multiple_item_purchase) {
                                                                                              if (selectArr.includes(itemProduct.id)) {
                                                                                                selectArr = [...selectArr.filter(item => item !== itemProduct.id)];
                                                                                                console.log(selectArr, itemProduct.id, 'cehckkkkk');
                                                                                              } else {
                                                                                                selectArr.push(itemProduct.id);
                                                                                              }
                                                                                              dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = [...selectArr];
                                                                                              setDataMessages([...dataMessages]);
                                                                                            } else {
                                                                                              let dataValue;
                                                                                              if (selectArr.includes(itemProduct.id)) {
                                                                                                dataValue = [];
                                                                                              } else {
                                                                                                dataValue = [itemProduct.id];
                                                                                              }
                                                                                              dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = dataValue;
                                                                                              setDataMessages([...dataMessages]);
                                                                                            }
                                                                                            // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                                                                          }}
                                                                                        />
                                                                                      </div>
                                                                                      {productPurchase.quantity_designation_all === false &&
                                                                                        <div style={{ width: '50%' }}>
                                                                                          <CheckboxCustom
                                                                                            label="Quantity designation"
                                                                                            value={itemProduct.is_quantity_designation}
                                                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'is_quantity_designation')}
                                                                                          />
                                                                                        </div>
                                                                                      }
                                                                                    </div>
                                                                                    {array.length > 1 &&
                                                                                      <div className="ss-user-setting-product-purchase-times-icons">
                                                                                        <MDBIcon fas icon="times-circle"
                                                                                          onClick={() => {
                                                                                            let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
                                                                                            let startArr = arrMessage.slice(0, indexProduct);
                                                                                            let lastArr = arrMessage.slice(indexProduct + 1, arrMessage.length);
                                                                                            console.log(arrMessage, [...startArr, ...lastArr]);
                                                                                            dataMessages[indexMessageSelect].message_content[indexContent][content.type].products = [...startArr, ...lastArr];
                                                                                            dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection.filter(item => item !== itemProduct.id);
                                                                                            setDataMessages([...dataMessages]);
                                                                                          }} />
                                                                                      </div>
                                                                                    }
                                                                                  </div>
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

                                                          <div className="ss-user-setting__item-bottom">
                                                            <div style={{ width: '90%' }}>
                                                              <Button
                                                                style={{ margin: '0px', backgroundColor: '#327AED', textTransform: 'lowercase' }}
                                                                onClick={() => {
                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
                                                                  let idMax;
                                                                  if (arrMess.length !== 0) {
                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                  } else {
                                                                    idMax = 1;
                                                                  }
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].products.push({
                                                                    id: idMax,
                                                                    quantity_select: 1,
                                                                    is_quantity_designation: false
                                                                  });
                                                                  setDataMessages([...dataMessages]);
                                                                }}
                                                              >
                                                                addition
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </>
                                                  )}
                                                  {/* user: type = 'product_purchase_radio_button' */}
                                                  {content.type === 'product_purchase_radio_button' && (
                                                    <>
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                                                        <div style={{ width: '90%' }}>
                                                          <CheckboxCustom
                                                            label="Required"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                            value={productPurchaseRadioButton.require}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={productPurchaseRadioButton.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={productPurchaseRadioButton.type}
                                                            data={[
                                                              { key: 'text_with_thumbnail_image', value: 'Text with thumbnail image' },
                                                              { key: 'text_with_image', value: 'Text with image' },
                                                              { key: 'consume_api_respone', value: 'Consume API response' }
                                                            ]}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* productPurchaseRadioButton: withTitle = true */}
                                                      {productPurchaseRadioButton?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={productPurchaseRadioButton.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <Row style={{ width: '90%' }}>
                                                          <Col xl={4} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Product name display"
                                                              value={productPurchaseRadioButton.product_name_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_name_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={5} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Product Number Display"
                                                              value={productPurchaseRadioButton.product_number_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_number_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={3} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="Price display"
                                                              value={productPurchaseRadioButton.price_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'price_display')}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      {productPurchaseRadioButton.type !== 'consume_api_respone' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'products')}>
                                                              <Droppable droppableId='product-purchase'>
                                                                {(providedChild) => {
                                                                  return <div className="ss-user-setting-item-product-purchase" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                    {
                                                                      Array.isArray(productPurchaseRadioButton?.products) && productPurchaseRadioButton?.products
                                                                        .map((itemProduct, indexProduct, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemProduct.id} draggableId={itemProduct.id + ''} index={indexProduct}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef} >
                                                                                  <div className="ss-user-setting-product-purchase-container" style={array.length > 1 ? { marginBottom: '10px' } : {}}>
                                                                                    <div className="ss-user-setting-product-purchase-file-img">
                                                                                      <InputCustom
                                                                                        className="ss-mg-bottom-5"
                                                                                        value={itemProduct.img_url}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'img_url')}
                                                                                      />
                                                                                      <MDBIcon
                                                                                        className="ss-mg-bottom-5" fas icon="folder-open"
                                                                                        onClick={() => {
                                                                                          setIsOpenFileReference(true)
                                                                                          setVarFileReference({ indexContent, contentType: content.type, subContentType: 'products', indexSubContent: indexProduct, img: 'img_url' })
                                                                                        }}
                                                                                      />
                                                                                    </div>
                                                                                    <div className="ss-user-setting-product-purchase-infor-product">
                                                                                      <InputCustom
                                                                                        placeholder="title"
                                                                                        style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                                                                                        className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left"
                                                                                        value={itemProduct.title}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'title')}
                                                                                      />
                                                                                      <InputCustom
                                                                                        placeholder="item number"
                                                                                        style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderLeft: '0px', borderRight: '0px' }}
                                                                                        className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle"
                                                                                        value={itemProduct.item_number}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_number')}
                                                                                      />
                                                                                      <InputNum
                                                                                        placeholder="price"
                                                                                        className="ss-mg-bottom-5 ss-user-setting-input-limit-character"
                                                                                        style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '0px', width: '78%' }}
                                                                                        value={itemProduct.item_price}
                                                                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_price')}
                                                                                      />
                                                                                    </div>
                                                                                    <div className="ss-user-setting-product-purchase-sub-infor">
                                                                                      {productPurchaseRadioButton.price_display &&
                                                                                        <div style={{ width: '50%' }}>
                                                                                          <InputCustom
                                                                                            className="ss-mg-bottom-5"
                                                                                            label="Price display contents (customized)"
                                                                                            value={itemProduct.price_display_custom}
                                                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')}
                                                                                          />
                                                                                        </div>
                                                                                      }
                                                                                    </div>
                                                                                    {array.length > 1 &&
                                                                                      <div className="ss-user-setting-product-purchase-times-icons">
                                                                                        <MDBIcon fas icon="times-circle"
                                                                                          onClick={() => {
                                                                                            let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
                                                                                            let startArr = arrMessage.slice(0, indexProduct);
                                                                                            let lastArr = arrMessage.slice(indexProduct + 1, arrMessage.length);
                                                                                            console.log(arrMessage, [...startArr, ...lastArr]);
                                                                                            dataMessages[indexMessageSelect].message_content[indexContent][content.type].products = [...startArr, ...lastArr];
                                                                                            dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection.filter(item => item !== itemProduct.id);
                                                                                            setDataMessages([...dataMessages]);
                                                                                          }} />
                                                                                      </div>
                                                                                    }
                                                                                  </div>
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
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div style={{ width: '90%' }}>
                                                              <Button
                                                                style={{ margin: '0px', backgroundColor: '#327AED', textTransform: 'lowercase' }}
                                                                onClick={() => {
                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
                                                                  let idMax;
                                                                  if (arrMess.length !== 0) {
                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                  } else {
                                                                    idMax = 1;
                                                                  }
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].products.push({
                                                                    id: idMax,
                                                                    is_quantity_designation: false
                                                                  });
                                                                  setDataMessages([...dataMessages]);
                                                                }}
                                                              >
                                                                addition
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </>
                                                  )}
                                                  {/* user: type = 'sms_verify' */}
                                                  {content.type === 'sms_verify' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={smsVerify.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* smsVerify: withTitle = true */}
                                                      {smsVerify?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={smsVerify.title}
                                                          />
                                                        </div>
                                                      }
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'AFTEE_payment_module' */}
                                                  {content.type === 'AFTEE_payment_module' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            style={{ width: '49%' }}
                                                            value={afteePaymentModule.type}
                                                            data={[
                                                              { key: 'aftee', value: 'Aftee' },
                                                              { key: 'atone', value: 'Atone' },
                                                              { key: 'paidy', value: 'Paidy' },
                                                              { key: 'zcom', value: 'ZCom' }
                                                            ]}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <textarea
                                                          style={{ width: '90%' }}
                                                          className="ss-user-setting-item-textarea-label ss-input-value"
                                                          placeholder="text"
                                                          rows="5"
                                                          value={afteePaymentModule.content}
                                                          onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'content')}
                                                        />
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'slider' */}
                                                  {content.type === 'slider' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                                                        <div style={{ width: '90%' }}>
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={slider.is_save_input_content}
                                                          />
                                                        </div>
                                                      </div>
                                                      {slider.is_save_input_content &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                              style={{ width: '100%', marginRight: '10px' }}
                                                              id="title"
                                                              value={slider?.save_input_content}
                                                              data={dataInputVar}
                                                              keyValue="variable_name"
                                                              nameValue="variable_name"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                            />
                                                            <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                          </div>
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                                                        <div style={{ width: '90%' }}>
                                                          <CheckboxCustom
                                                            label="Required"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                            value={slider.require}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={slider.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            style={{ width: '49%' }}
                                                            value={slider.type}
                                                            data={[
                                                              { key: 'continuous_type', value: 'Continuous type' },
                                                              { key: 'discrete_type', value: 'Discrete type' }
                                                            ]}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* slider: withTitle = true */}
                                                      {slider?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="title"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={slider.title}
                                                          />
                                                        </div>
                                                      }
                                                      {slider.type === 'discrete_type' &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                                                            <SelectCustom
                                                              label="Minimum value"
                                                              style={{ width: '15%', marginRight: '10px' }}
                                                              value={slider.min_value}
                                                              data={[
                                                                { key: '0', value: '0' },
                                                                { key: '1', value: '1' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'min_value')}
                                                            />
                                                            <SelectCustom
                                                              label="Maximum value"
                                                              style={{ width: '15%' }}
                                                              value={slider.max_value}
                                                              data={dataMaxRangSlider}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'max_value')}
                                                            />
                                                          </div>
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                          <InputCustom
                                                            label="Minimum label"
                                                            placeholder=""
                                                            style={{ width: '82%', borderColor: slider.min_label ? 'gray' : 'red' }}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'min_label')}
                                                            value={slider.min_label}
                                                          />
                                                        </div>
                                                        {!slider.min_label &&
                                                          <div style={{ width: '90%', color: '#b94a48', marginLeft: '21%' }}>Must be specified</div>
                                                        }
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                          <InputCustom
                                                            label="Maximum label"
                                                            style={{ width: '82%', borderColor: slider.max_label ? 'gray' : 'red' }}
                                                            placeholder=""
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'max_label')}
                                                            value={slider.max_label}
                                                          />
                                                        </div>
                                                        {!slider.max_label &&
                                                          <div style={{ width: '90%', color: '#b94a48', marginLeft: '21%' }}>Must be specified</div>
                                                        }
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%', display: 'flex', alignItems: 'center' }}>
                                                          <InputCustom
                                                            label="Color"
                                                            style={{ width: '30%', marginLeft: '12%', borderColor: slider.color && (isColor(slider.color) ? 'gray' : 'red') }}
                                                            placeholder="#2c75f0"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'color')}
                                                            value={slider.color}
                                                          />
                                                          <div style={{ width: '95px', height: '36px', backgroundColor: slider.color || '#2C75F0', marginLeft: '13px' }}></div>
                                                        </div>
                                                        {(slider.color && !isColor(slider.color)) &&
                                                          <div style={{ width: '90%', color: '#b94a48', marginLeft: '21%' }}>Specify a valid regular expression for color.</div>
                                                        }
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'card_payment_radio_button' */}
                                                  {content.type === 'card_payment_radio_button' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <div className="ss-user-setting__item-text_input-save-variable-wrapper">
                                                          <CheckboxCustom
                                                            label="Save the input contents in a variable."
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={cardPaymentRadioButton.is_save_input_content}
                                                          />
                                                        </div>
                                                        {cardPaymentRadioButton.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                value={cardPaymentRadioButton?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>Addition</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '95%' }}>
                                                            <span>card payment linked setting</span>
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>
                                                            <CheckboxCustom
                                                              label="Required"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={cardPaymentRadioButton.require}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                              style={{ width: '49%' }}
                                                              value={cardPaymentRadioButton.title_require}
                                                              data={dropDownTitle}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            />
                                                            <SelectCustom
                                                              id="type"
                                                              style={{ width: '49%' }}
                                                              value={cardPaymentRadioButton.type}
                                                              data={[
                                                                { key: 'default', value: 'Default' },
                                                                { key: 'customized_style', value: 'Customized style' },
                                                                { key: 'picture_radio', value: 'Picture radio' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            />
                                                          </div>
                                                        </div>
                                                        {/* cardPaymentRadioButton: withTitle = true */}
                                                        {cardPaymentRadioButton?.title_require === true &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="title"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                              value={cardPaymentRadioButton.title}
                                                            />
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom" style={{ position: 'relative' }}>
                                                          {cardPaymentRadioButton.type !== "picture_radio" ?
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'radio_contents')}>
                                                              <Droppable droppableId='payment-radio'>
                                                                {(providedChild) => {
                                                                  return <div className="ss-user-setting-item-payment-radio-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                    {
                                                                      Array.isArray(cardPaymentRadioButton.radio_contents) && cardPaymentRadioButton.radio_contents
                                                                        .map((itemPaymentRadio, indexPaymentRadio, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemPaymentRadio.id} draggableId={itemPaymentRadio.id + ''} index={indexPaymentRadio}>
                                                                              {(providedChild) => (
                                                                                <div
                                                                                  key={itemPaymentRadio.id}
                                                                                  {...providedChild.draggableProps}
                                                                                  {...providedChild.dragHandleProps}
                                                                                  ref={providedChild.innerRef}
                                                                                >
                                                                                  <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-no-img">
                                                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                      <InputDouble
                                                                                        placeholder={["text", "value"]}
                                                                                        valueLeft={itemPaymentRadio.text}
                                                                                        valueRight={itemPaymentRadio.value}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents', indexPaymentRadio, name === 'left' ? 'text' : 'value')}
                                                                                      />
                                                                                    </div>
                                                                                    <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                                      <CheckboxCustom
                                                                                        label="Initial selection setting"
                                                                                        value={cardPaymentRadioButton.initial_selection === itemPaymentRadio.id}
                                                                                        onChange={() => {
                                                                                          if (cardPaymentRadioButton.initial_selection !== itemPaymentRadio.id) {
                                                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.id, 'initial_selection');
                                                                                          } else {
                                                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                          }
                                                                                        }}
                                                                                      />
                                                                                      <CheckboxCustom
                                                                                        label="Card payment linked setting"
                                                                                        value={cardPaymentRadioButton.card_linked_setting === itemPaymentRadio.id}
                                                                                        onChange={() => {
                                                                                          if (cardPaymentRadioButton.card_linked_setting !== itemPaymentRadio.id) {
                                                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.id, 'card_linked_setting');
                                                                                          } else {
                                                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'card_linked_setting');
                                                                                          }
                                                                                        }}
                                                                                      />
                                                                                    </div>
                                                                                    {array.length > 1 &&
                                                                                      <div className="ss-user-setting-payment-radio-times-icons">
                                                                                        <MDBIcon fas icon="times-circle"
                                                                                          onClick={() => {
                                                                                            let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                                            let startArr = arrMessage.slice(0, indexPaymentRadio);
                                                                                            let lastArr = arrMessage.slice(indexPaymentRadio + 1, arrMessage.length);
                                                                                            console.log(arrMessage, [...startArr, ...lastArr]);
                                                                                            dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents = [...startArr, ...lastArr];
                                                                                            setDataMessages([...dataMessages]);
                                                                                          }} />
                                                                                      </div>
                                                                                    }
                                                                                  </div>
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
                                                            </DragDropContext> :
                                                            <React.Fragment>
                                                              <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'radio_contents_img')}>
                                                                <Droppable droppableId='payment-radio-img'>
                                                                  {(providedChild) => {
                                                                    return <div className="ss-user-setting-item-payment-radio-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                      {
                                                                        Array.isArray(cardPaymentRadioButton.radio_contents_img) && cardPaymentRadioButton.radio_contents_img
                                                                          .map((itemPaymentRadioImg, indexPaymentRadioImg, array) => {
                                                                            return (
                                                                              <Draggable draggable={true} key={itemPaymentRadioImg.id} draggableId={itemPaymentRadioImg.id + ''} index={indexPaymentRadioImg}>
                                                                                {(providedChild) => (
                                                                                  <div
                                                                                    key={itemPaymentRadioImg.id}
                                                                                    {...providedChild.draggableProps}
                                                                                    {...providedChild.dragHandleProps}
                                                                                    ref={providedChild.innerRef}
                                                                                  >
                                                                                    <div style={{ display: 'flex', marginBottom: '10px', backgroundColor: 'rgb(248, 249, 250)', position: 'relative' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px', display: 'flex', alignItems: 'center', marginRight: '5px', marginLeft: '10px' }} />
                                                                                      <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-img"
                                                                                      >
                                                                                        {itemPaymentRadioImg.contents.map((itemContentPayment, indexContentPayment, arrContent) => {
                                                                                          return <React.Fragment>
                                                                                            <div style={{ width: arrContent.length > 1 ? `${(100 / arrContent.length) - 1}%` : '100%', padding: '5px' }}>
                                                                                              <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '92%' }}
                                                                                                  placeholder="File URL"
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents_img', indexPaymentRadioImg, 'contents', indexContentPayment, 'file_url')}
                                                                                                  value={itemContentPayment.file_url}
                                                                                                />
                                                                                                <MDBIcon onClick={() => {
                                                                                                  setIsOpenFileReference(true)
                                                                                                  setVarFileReference({ indexContent, contentType: content.type, subContentType: 'radio_contents_img', indexSubContentType: indexPaymentRadioImg, childSubContentType: 'contents', indexChildSubContentType: indexContentPayment, img: 'file_url' })
                                                                                                }}
                                                                                                  fas icon="paperclip"
                                                                                                  style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
                                                                                                />
                                                                                              </div>
                                                                                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                                                <InputDouble
                                                                                                  placeholder={["text", "value"]}
                                                                                                  valueLeft={itemContentPayment.text}
                                                                                                  valueRight={itemContentPayment.value}
                                                                                                  onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents_img', indexPaymentRadioImg, 'contents', indexContentPayment, name === 'left' ? 'text' : 'value')}
                                                                                                />
                                                                                              </div>
                                                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                                                <CheckboxCustom
                                                                                                  label="Initial selection setting"
                                                                                                  value={cardPaymentRadioButton.initial_selection_picture === `${itemPaymentRadioImg.id}-${itemContentPayment.id}`}
                                                                                                  onChange={() => {
                                                                                                    if (cardPaymentRadioButton.initial_selection_picture !== `${itemPaymentRadioImg.id}-${itemContentPayment.id}`) {
                                                                                                      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, `${itemPaymentRadioImg.id}-${itemContentPayment.id}`, 'initial_selection_picture')
                                                                                                    } else {
                                                                                                      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection_picture')
                                                                                                    }
                                                                                                  }}
                                                                                                />
                                                                                                <CheckboxCustom
                                                                                                  label="Card payment linked setting"
                                                                                                  value={cardPaymentRadioButton.card_linked_setting_picture === `${itemPaymentRadioImg.id}-${itemContentPayment.id}`}
                                                                                                  onChange={() => {
                                                                                                    if (cardPaymentRadioButton.card_linked_setting_picture !== `${itemPaymentRadioImg.id}-${itemContentPayment.id}`) {
                                                                                                      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, `${itemPaymentRadioImg.id}-${itemContentPayment.id}`, 'card_linked_setting_picture')
                                                                                                    } else {
                                                                                                      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'card_linked_setting_picture')
                                                                                                    }
                                                                                                  }}
                                                                                                />
                                                                                              </div>
                                                                                            </div>
                                                                                          </React.Fragment>
                                                                                        })}
                                                                                      </div>
                                                                                      <div className="ss-user-setting-plus-minus-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <div>
                                                                                          {itemPaymentRadioImg.contents.length < 3 &&
                                                                                            <div style={{ color: '#327AED' }}
                                                                                              onClick={() => {
                                                                                                let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents];
                                                                                                let idMax;
                                                                                                if (arrMess.length !== 0) {
                                                                                                  idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                                                } else {
                                                                                                  idMax = 1;
                                                                                                }
                                                                                                dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents.push({
                                                                                                  id: idMax
                                                                                                });
                                                                                                setDataMessages([...dataMessages]);
                                                                                              }}
                                                                                            >+</div>}
                                                                                          {itemPaymentRadioImg.contents.length > 1 &&
                                                                                            <div style={{ color: '#FA8464' }}
                                                                                              onClick={() => {
                                                                                                dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents.pop();
                                                                                                setDataMessages([...dataMessages]);
                                                                                              }}
                                                                                            >-</div>}
                                                                                        </div>
                                                                                      </div>
                                                                                      {array.length > 1 &&
                                                                                        <div className="ss-user-setting-payment-radio-times-icons">
                                                                                          <MDBIcon fas icon="times-circle"
                                                                                            onClick={() => {
                                                                                              let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img];
                                                                                              let startArr = arrMessage.slice(0, indexPaymentRadioImg);
                                                                                              let lastArr = arrMessage.slice(indexPaymentRadioImg + 1, arrMessage.length);
                                                                                              console.log(arrMessage, [...startArr, ...lastArr]);
                                                                                              dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img = [...startArr, ...lastArr];
                                                                                              setDataMessages([...dataMessages]);
                                                                                            }} />
                                                                                        </div>
                                                                                      }
                                                                                    </div>
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
                                                            </React.Fragment>
                                                          }
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>
                                                            <Button style={{ margin: '0px', padding: '9px 19px', backgroundColor: '#327AED' }}
                                                              onClick={() => {
                                                                if (cardPaymentRadioButton.type !== 'picture_radio') {
                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                  let idMax;
                                                                  if (arrMess.length !== 0) {
                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                  } else {
                                                                    idMax = 1;
                                                                  }
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents.push({
                                                                    id: idMax
                                                                  });
                                                                  setDataMessages([...dataMessages]);
                                                                } else {
                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img];
                                                                  let idMax;
                                                                  if (arrMess.length !== 0) {
                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                  } else {
                                                                    idMax = 1;
                                                                  }
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img.push({
                                                                    id: idMax,
                                                                    contents: [
                                                                      { id: 1 }
                                                                    ]
                                                                  });
                                                                  setDataMessages([...dataMessages]);
                                                                }
                                                              }}
                                                            >addition</Button>
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '95%', height: '1px', backgroundColor: 'black' }}></div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '95%' }}>
                                                            <span>card payment linked setting</span>
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%', display: 'flex' }}>
                                                            <div style={{ width: '28%' }}>
                                                              <CheckboxCustom
                                                                label="Hide CVC"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_cvc')}
                                                                value={cardPaymentRadioButton.is_hide_cvc}
                                                              />
                                                            </div>
                                                            <div>
                                                              <CheckboxCustom
                                                                label="Hide card name"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_card_name')}
                                                                value={cardPaymentRadioButton.is_hide_card_name}
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%', display: 'flex' }}>
                                                            <div style={{ width: '20%', display: 'flex', alignItems: 'center' }}>
                                                              <CheckboxCustom
                                                                label="Separate type"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_type')}
                                                                value={cardPaymentRadioButton.separate_type}
                                                              />
                                                            </div>
                                                            <div style={{ marginLeft: '47px', display: 'flex', alignItems: 'center' }}>
                                                              <CheckboxCustom
                                                                label="Perform a validity check"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'validity_check')}
                                                                value={cardPaymentRadioButton.validity_check}
                                                              />
                                                            </div>
                                                            <div style={{ width: '35%', marginLeft: '38px', display: 'flex', justifyContent: 'space-between' }}>
                                                              <span style={{ paddingTop: '3px', fontWeight: '400' }}>date of expiry</span>
                                                              <SelectCustom
                                                                style={{ width: '53%' }}
                                                                value={cardPaymentRadioButton.type_date_of_expiry}
                                                                data={[{ key: 'ym', value: 'YM' }, { key: 'my', value: 'MY' }]}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type_date_of_expiry')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>

                                                      <div className="ss-user-setting__item-bottom">
                                                        <CheckboxGroupCustom
                                                          style={{ width: '90%' }}
                                                          value={cardPaymentRadioButton.payment_method}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'payment_method')}
                                                          data={dataPaymentMethod}
                                                        />
                                                      </div>
                                                      {cardPaymentRadioButton.separate_type === false ?
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            styleLabel={{ width: '90%' }}
                                                            label="Card number"
                                                            inline={false}
                                                            placeholder="placeholder"
                                                            value={cardPaymentRadioButton.card_number_placeholder}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder')}
                                                          />
                                                        </div> :
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>Card number</div>
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={cardPaymentRadioButton.card_number_placeholder1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder1')}
                                                            />
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={cardPaymentRadioButton.card_number_placeholder2}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder2')}
                                                            />
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={cardPaymentRadioButton.card_number_placeholder3}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder3')}
                                                            />
                                                            <InputCustom
                                                              placeholder="placeholder"
                                                              value={cardPaymentRadioButton.card_number_placeholder4}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder4')}
                                                            />
                                                          </div>
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          styleLabel={{ width: '90%' }}
                                                          label="Card holder"
                                                          inline={false}
                                                          placeholder="placeholder"
                                                          value={cardPaymentRadioButton.card_holder_placeholder}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder')}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%' }}>Date of expiry</div>
                                                        <div style={{ display: 'flex', width: '90%' }}>
                                                          <SelectCustom
                                                            placeholder="year"
                                                            style={{ width: '25%' }}
                                                            value={cardPaymentRadioButton.year_placeholder}
                                                            data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'year_placeholder')}
                                                          />
                                                          <SelectCustom
                                                            placeholder="month"
                                                            style={{ width: '25%', marginLeft: '10px' }}
                                                            value={cardPaymentRadioButton.month_placeholder}
                                                            data={dataMonthFixed}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'month_placeholder')}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          styleLabel={{ width: '90%' }}
                                                          label="CVC"
                                                          inline={false}
                                                          placeholder="placeholder"
                                                          value={cardPaymentRadioButton.cvc_placeholder}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'cvc_placeholder')}
                                                        />
                                                      </div>
                                                    </>
                                                  )}
                                                  {/* user: type = 'label_no_transition' */}
                                                  {content.type === 'label_no_transition' && (
                                                    <React.Fragment>
                                                      <div style={{ marginBottom: '10px' }}>* You cannot add other user input components together with "Label (no transition record)".</div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <textarea
                                                          style={{ width: '90%' }}
                                                          placeholder="text"
                                                          rows="5"
                                                          value={labelNoTransition.value}
                                                          onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'value')}
                                                        />
                                                      </div>
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
                              }}
                            </Droppable>
                          </DragDropContext>
                          <div className="ss-user-setting__bottom">
                            {dataMessages[indexMessageSelect].message_content[0]?.type !== 'label_no_transition' &&
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
                                  <option value="carousel">Carousel</option>
                                  <option value="credit_card_payment">Credit card payment</option>
                                  <option value="capture">Capture</option>
                                  <option value="product_purchase">Product purchase</option>
                                  <option value="product_purchase_radio_button">Product purchase (radio button type)</option>
                                  <option value="sms_verify">SMS Verify</option>
                                  <option value="AFTEE_payment_module">AFTEE payment module</option>
                                  <option value="slider">Slider</option>
                                  <option value="card_payment_radio_button">Card payment with radio button</option>
                                  <option value="variable_set" style={{ display: 'none' }}>Variable set</option>
                                  <option
                                    style={dataMessages[indexMessageSelect].message_content.length > 0 && messageType !== 'label_no_transition' ? { display: 'none' } : {}}
                                    value="label_no_transition">
                                    Label (no transition record)
                                  </option>
                                </select>
                                <Button className="ss-user-setting__select-btn-add" onClick={() => handleAddItemSetting(messageType || 'text_input')}>Addition</Button>
                              </div>
                            }
                            <div className="ss-user-setting__checkbox-wrapper">
                              <input style={{ width: '15px' }} type="checkbox" name="ss-user-setting__checkbox" />
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
                                            keyValue={"variable_name"}
                                            nameValue={"variable_name"}
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
                                    value={dataMessages[indexMessageSelect].buttonName}
                                    maxLength={30}
                                    onChange={(value) => {
                                      dataMessages[indexMessageSelect].buttonName = value;
                                      setDataMessages([...dataMessages]);
                                    }}
                                  />
                                  {/* <Button className="ss-bot-setting-condition-keep-button">
                                    keep
                                  </Button> */}
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
          <div style={{ marginBottom: '10px' }}>
            <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px' }}>Variable name</span>
              <input
                type="text"
                name="sl-popup-create-scenario-input"
                id="sl-popup-create-scenario-input"
                onChange={(e) => {
                  setErrorVariable('');
                  setVariableName(e.target.value);
                }}
              />

            </div>
            {errorVariable &&
              <div style={{ textAlign: 'center', color: 'red' }}>{errorVariable}</div>
            }
          </div>
          <div className="sl-popup-create-scenario-input-wrapper">
            <span style={{ width: '100px' }}>Default name</span>
            <input
              type="text"
              name="sl-popup-create-scenario-input"
              id="sl-popup-create-scenario-input"
              onChange={(e) => setDefaultValue(e.target.value)}
            />
          </div>
          <span id="sl-err-create-scenario" style={{ color: "red" }}></span>
          <div className="sl-popup-create-scenario-btn-wrapper">
            <Button
              className="ss-popup-add-variable-input-close-button"
              onClick={() => setIsOpenAddVariable(false)}
            >
              Close
            </Button>
            <Button
              style={{ backgroundColor: '#024BB9' }}
              className="ss-popup-add-variable-input-keep-button"
              onClick={() => createVariable()}
            >
              Keep
            </Button>
          </div>
        </div>
      </ModalShort>
      <ModalShort open={isOpenFileReference} onClose={() => setIsOpenFileReference(false)}>
        <div className="ss-popup-file-reference-scenario">
          <FileReferencePopup
            onCancel={() => setIsOpenFileReference(false)}
            onReferFile={(file_url) => {
              if (dataMessages[indexMessageSelect].belong_to === 'user') {
                if (varFileReference.indexChildSubContentType !== undefined) {
                  console.log(varFileReference, 'checkkkkk varFileReference.indexChildSubContentType')
                  onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, file_url, varFileReference.subContentType, varFileReference.indexSubContentType, varFileReference.childSubContentType, varFileReference.indexChildSubContentType, varFileReference.img);
                } else if (varFileReference.childSubContentType !== undefined) {
                  onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, file_url, varFileReference.subContentType, varFileReference.childSubContentType, varFileReference.indexSubContent, varFileReference.img);
                } else {
                  onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, file_url, varFileReference.subContentType, varFileReference.indexSubContent, varFileReference.img);
                }
              } else {
                onChangeValueMessageContent(indexMessageSelect, 0, messageType, file_url, 'content')
              }
              setIsOpenFileReference(false)
            }}
          />
        </div>
      </ModalShort>
      {isOpenPreview && <Preview isOpen={isOpenPreview} onOpenPreview={(isOpen) => handleOpenPreview(isOpen)} />}
    </div >
  );
};

export default Scenario;