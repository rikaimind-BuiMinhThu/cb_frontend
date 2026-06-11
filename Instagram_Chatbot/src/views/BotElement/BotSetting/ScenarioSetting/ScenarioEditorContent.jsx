import '../../../../assets/css/bot/scenario/scenario-single.css';
import React from 'react';
import {
  Col, Row, Card, CardBody, Button
} from 'reactstrap';
import icon from '../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
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
import ShopifyReferencePopup from './ShopifyReferencePopup';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  S3_UPLOAD_URL, 
  FUKUSHASHIKI_SEARCH_MODE_OPTIONS,
  FUKUSHASHIKI_SEARCH_VALUE_LABELS,
} from '../../../../variables/constants';
import { tokenExpired } from 'api/tokenExpired';
import DatePickerCustom from './scenarioComon/DatePickerCustom';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import { HtmlCodeMessage } from '../../../../components/BotMessages';
import CheckboxGroupCustom from './scenarioComon/CheckboxGroupCustom';
import shopifIcon from '../../../../assets/img/shopify-icon.png';
import nanoMetadata from 'nano-metadata';
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'moment/locale/zh-cn';
import ShopifyReferenceSelect from "./ShopifyReferenceSelect";
import { Tooltip } from '@mui/material';
import { MESSAGE_CONTENT_TYPES, TIMER_TYPES, TIMER_VARIABLES, TIMER_VARIABLES_DESCRIPTION, BOT_MESSAGE_TYPES, RANGE_TEXT_VALIDATE, LABELS, GENDER_DISPLAY_TYPES } from '../PreviewComponent/Constants';
import HtmlCodeConfig from './scenarioComon/HtmlCodeConfig';
import OptionGenderConfig from './OptionGenderConfig';
import SubmitButtonLoadingConfig from './SubmitButtonLoadingConfig';
import SubmitButtonConfig from './SubmitButtonConfig';
import {CART_SYSTEM} from '../PreviewComponent/Constants';
import ZipCodeAddressSetting from './Settings/ZipCodeAddressSetting';
import { CONTENT_SETTING_MAP } from './contentSettings';
import { PREVIEW_MAP } from './contentPreviews';
import { renderFukushashikiSetting } from './ScenarioUtils';
import PaymentDisplayStyleSection from './components/PaymentDisplayStyleSection';
import { PAYMENT_OPTION_IMAGE_FIELDS } from './constants/paymentStyleConstants';

import {
  dataPaymentMethod,
  dataHourFixed,
  dataMinutesFixed,
  dataEveryMinuteFixed,
  dataYearFixed,
  dataMonthFixed,
  dataDayFixed,
  dataMaxRangSlider,
  dataConsumeApiResponse,
  agreeTermType,
  dataTypeFile,
  dataSubCondition,
  dataApiLinkage,
  installmentOptions,
  initialTimeConfig,
  carouselType,
  typeCalendar,
  dropDownTitle,
  convertTextType,
  typeTextarea,
  typeRadio,
  rangeText,
  hyphenPhoneNumber,
  typeCheckbox,
  dataTypePullDown,
  dataSelectDateTime,
  dataConditionFixed,
} from './constants/scenarioFormConstants';
import {
  DELIVERY_CUT_OFF_SELECT_NONE,
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewRelativeRangeEnabled,
  isCalendarPreviewDaysSplitEnabled,
  deliveryCutOffTimeSelectValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  mergePreviewRelativeCalendar,
} from './utils/scenarioCalendarUtils';
import { cleanMessageTimerConfig } from './utils/scenarioApiUtils';
import { useScenarioEditor } from './context/ScenarioEditorContext';
import ScenarioActionsBar from './components/ScenarioActionsBar';
import ScenarioOverviewPanel from './components/ScenarioOverviewPanel';
import ScenarioCustomCssModal from './components/modals/ScenarioCustomCssModal';
import ScenarioCustomJsModal from './components/modals/ScenarioCustomJsModal';
import ScenarioTimerModal from './components/modals/ScenarioTimerModal';
import ScenarioErrMsgJsModal from './components/modals/ScenarioErrMsgJsModal';
import ScenarioMessageOverview from './components/ScenarioMessageOverview';
import ScenarioMessageDetailPanel from './components/ScenarioMessageDetailPanel';
const { Option } = Select;
const _ = require('lodash');


const ScenarioEditorContent = () => {
  const { state, actions, messages, client } = useScenarioEditor();
  const {
    scenarioName,
    scenarioType,
    urlThanks,
    merchandiseId,
    lpProductUrl,
    coupon,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
    isUsedCartConfirmPage,
    urlCartConfirmPage,
    isOpenModalCustomCss,
    isUseCustomJsCode,
    headCustomJsCode,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
    isOpenModalCustomJsCode,
    timerConfig,
    errMsgJsCode,
    isOpenErrMsgByJsSettingModal,
    isUseErrMsgByJs,
    errorScenarioName,
    belongTo,
    messageType,
    indexMessageSelect,
    dataInputVar,
    isOpenPreview,
    varFileReference,
    isOpenFileReference,
    indexCarouselSlide,
    varShopifyReference,
    isOpenShopifyReference,
    botTextValue,
    isOpenAddVariable,
    fileError,
    fileErrorCarousel,
    dataMessages,
    dataPrefectures,
    dataCity,
    botId,
    scenarioId,
    isOpenNoti,
    messageNoti,
    dataEmail,
    isConditionUp,
    conditions,
    variableName,
    defaultValue,
    acceptFile,
    dataHour,
    dataMinutes,
    dataEveryMinute,
    dataYear,
    dataMonth,
    dataDay,
    errorVariable,
    dataCondition,
    isUsedMessageLoadedPast,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    useFullwidthChatbotMobile,
    clientCartSystem,
    listProductVariants,
    isShopifyPaymentScenario,
  } = state;
  const {
    setScenarioName,
    setScenarioType,
    setUrlThanks,
    setMerchandiseId,
    setLpProductUrl,
    setCoupon,
    setIsUseOnlyRegularOrder,
    setIsUseFukushashiki,
    setIsUseCustomCss,
    setCustomCssContent,
    setIsUsedCartConfirmPage,
    setUrlCartConfirmPage,
    setIsOpenModalCustomCss,
    setIsUseCustomJsCode,
    setHeadCustomJsCode,
    setTopBodyCustomJsCode,
    setBottomBodyCustomJsCode,
    setIsOpenModalCustomJsCode,
    setTimerConfig,
    setErrMsgJsCode,
    setIsOpenErrMsgByJsSettingModal,
    setIsUseErrMsgByJs,
    setErrorScenarioName,
    setBelongTo,
    setMessageType,
    setIndexMessageSelect,
    setDataInputVar,
    setIsOpenPreview,
    setVarFileReference,
    setIsOpenFileReference,
    setIndexCarouselSlide,
    setVarShopifyReference,
    setIsOpenShopifyReference,
    setBotTextValue,
    setIsOpenAddVariable,
    setFileError,
    setFileErrorCarousel,
    setDataMessages,
    setDataPrefectures,
    setDataCity,
    setBotId,
    setScenarioId,
    setIsOpenNoti,
    setMessageNoti,
    setDataEmail,
    setIsConditionUp,
    setConditions,
    setVariableName,
    setDefaultValue,
    setAcceptFile,
    setDataHour,
    setDataMinutes,
    setDataEveryMinute,
    setDataYear,
    setDataMonth,
    setDataDay,
    setErrorVariable,
    setDataCondition,
    setIsUsedMessageLoadedPast,
    setIsUsedCrosssell,
    setProductIdCrossSell,
    setIsClearLandingPageSession,
    setIsUseBtnUpdateTracking,
    setUseFullwidthChatbotMobile,
    setClientCartSystem,
    setListProductVariants,
    handleGetMessage,
    onClickSaveScenario,
    onClickSavePreview,
    getListVariable,
    handleOpenPreview,
  } = actions;
  const {
    onChangeValueMessageContent,
    onChangeTimePullDown,
    onChangeValueNameMessage,
  } = messages;

  const renderPaymentMethodDescriptionInput = ({ selectedItem, dataMessages }) => {
    if (!selectedItem.isUsedHTMLDescription) return null;
    return (
      <InputCustom
        maxLength={10000}
        style={{ width: '100%', marginBottom: '5px' }}
        label="HTMLの説明をカスタマイズする"
        inline={false}
        placeholder="ここにHTMLを入力してください"
        value={selectedItem.descriptionContent}
        onChange={(value) => {
          selectedItem.descriptionContent = value;
          setDataMessages([...dataMessages]);
        }}
      />
    );
  };

  const renderRootFaqOption = (wrapperClassName = null) => {
    if (scenarioType !== 'faq') return null;
    
    const checkbox = (
      <CheckboxCustom
        label="Root FAQ Message"
        onChange={(value) => {
          // Uncheck all other messages
          const updatedMessages = dataMessages.map((msg, idx) => {
            if (idx === indexMessageSelect) {
              return { ...msg, is_root_faq_msg: value };
            } else {
              return { ...msg, is_root_faq_msg: false };
            }
          });
          setDataMessages(updatedMessages);
        }}
        value={dataMessages[indexMessageSelect].is_root_faq_msg || false}
      />
    );

    if (wrapperClassName) {
      return (
        <div className={wrapperClassName}>
          {checkbox}
        </div>
      );
    }

    return checkbox;
  };

  function botUploadFile() {
    document.getElementById('ss-bot-file-upload').click();
  }

  function carouselUploadFile() {
    document.getElementById('ss-carouse-file-upload').click();
  }

  const getBaseUrl = async (event, indexContent) => {
    var fileInput = event.target.files[0];
    const type = fileInput.name.slice(fileInput.name.lastIndexOf('.') + 1).toLowerCase();

    let trueFile;
    if (dataMessages[indexMessageSelect].belong_to === 'user') {
      trueFile = ['jpeg', 'jpg', 'png'].includes(type);
    } else {
      trueFile = ['jpeg', 'jpg', 'png', 'pdf', 'mp4'].includes(type);
    }
    let file;
    if (trueFile) {
      if (type != 'pdf' && type != 'mp4' && fileInput.size / 1024 / 1024 >= 2) {
        setFileError(`ファイルサイズは2MB以下です。`);
        return;
      } else if (type === 'pdf' && fileInput.size / 1024 / 1024 >= 3) {
        setFileError(`ファイルサイズは3MB以下です。`);
        return;
      } else if (type === 'mp4') {
        if (fileInput.size / 1024 / 1024 >= 50) {
          setFileError(`ファイルサイズは50MB以下です。`);
          return;
        }
        // const video = document?.createElement('video');
        // video.setAttribute('id', 'checkDurationVid');
        // const source = document?.createElement('source');

        // source.src = URL.createObjectURL(fileInput);
        // source.type = "video/mp4";
        // video.appendChild(source);
        // document.getElementById("check-append-vid").appendChild(video);
        // var dura = document.getElementById('checkDurationVid')
        let duration = await nanoMetadata.video.duration(fileInput);
        if (duration > 15) {
          setFileError(`15秒以下のビデオをアップロードしてください。`);
          return;
        }

      }
      setFileError('');
      const video = document.getElementById('preview-video');
      file = { user_file: { file_type: type, size: fileInput.size, timeplay: `${type == 'mp4' ? video?.duration : ''}` } };
      api
        .post(`/api/v1/managements/file/upload`, file)
        .then((res) => {
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
                    setMessageNoti(`追加しました。`);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMessageNoti(``);
                    }, 2000);
                  } else {
                    setMessageNoti(`追加できませんでした。`);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMessageNoti(``);
                    }, 2000);
                  }
                })
                .catch((err) => {
                  if (err.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
            })
            .catch((err) => {
              if (err.response?.data.code === 0) {
                tokenExpired();
              }
            });

        })
        .catch((err) => {
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else if (dataMessages[indexMessageSelect].belong_to !== 'user') {
      setFileError(`ファイル形式を選択してください。`);
    } else {
      setFileErrorCarousel('jpeg,jpg,pngのファイルを選択してください。');
      setTimeout(() => {
        setFileErrorCarousel('');
      }, 4000)
    }
  }

  // handle select message
  const handleSelectMessage = (index, belongTo, type) => {
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
    // {parse(dataMessages)}

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
    //   if (indexMessageSelect && index === indexMessageSelect) {
    //     message.message_content[0].type = value;
    //   }
    // });
    let data = [...dataMessages];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (indexMessageSelect !== undefined && i === indexMessageSelect) {
          data[i].message_content[0].type = value;
        }
      }
    }
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
            split_postal_code: false,
            compact_municipality_and_address: false,
            compact_municipality_and_address_and_building_name: false,
            post_code_label: '郵便番号',
            prefecture_label: '都道府県',
            municipality_label: '市区町村',
            address_label: '番地',
            building_name_label: '建物名',
          }
        }
      );
    } else if (messageType === 'image') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            imageURL: '',
            displayButtonNext: true,
            image_width: "100%",
            image_height: "100%"
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
            isUseConvertText: false,
            isCustomID: false,
            convertTextTypeValue: 'katakana',
            idRefector: '',
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
              disable_remove_leading_zero: false,
            },
            password: {},
            password_confirmation: {}
          }
        }
      );
    } else if (messageType === 'shipping_address') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            type: 'shipping_address',
            shipping_address: {
              range: 'no_input',
              isSplitInput: true,
            },
            card_linked_setting: [],
            radio_contents: [
              { id: 1 }
            ],
            name: '',
            kana_name: '',
            number:'',
            post_code: '',
            is_use_dropdown: false,
            prefecture: null,
            municipality: '',
            address: '',
            building_name: '',
            split_postal_code: false,
            compact_municipality_and_address: false,
            compact_municipality_and_address_and_building_name: false,
            withHyphen: false,
            
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
            checkbox_img: [{
              id: 1,
              contents: [
                { id: 1 }
              ]
            }],
            checkedValue: [],
            initial_selection_picture: []
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
              initial_selection: "",
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
            prefectures: {},
            lp_integration_option: {},
            from_js_result: {}
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
            start_end_date: {},
            preview_relative_range_enabled: false,
            preview_days_from_today: 0,
            preview_days_relative_to_end_date: 0,
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
                id: 1,
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
            colour: true, //type: true, false
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
                id: 1,
                productVariantId: '',
                displayName: ''
              }
            ]
          }
        }
      );
    } else if (messageType === 'product_purchase_select_option') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            require: false,
            type: 'text_with_thumbnail_image',
            product_number_display: false,
            price_display: false,
            product_name_display: false,
            display_unselected: '選択してください',
            products: [
              {
                id: 1,
                productVariantId: '',
                displayName: ''
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
            is_use_installment: [],
            separate_type: false,
            separate_name: false,
            validity_check: false,
            type_date_of_expiry: 'ym',
            payment_method: [],
            card_linked_setting: [],
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
    } else if (messageType ==='button_submit') {
      dataMessages[indexMessageSelect].message_content.push(
        {
          id: idMax,
          type: messageType,
          [messageType]: {
            title_require: false,
            require: false,
            is_display_error_message: false,
            is_use_js: false,
            is_used_cart_confirm_page: false,
            use_for_confirm_order: false, 
          },
          button_submit_name:''
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
    let idMax = Math.max(...dataMessages.map(item => item.id)) + 1;
    let arrMessage = _.cloneDeep(dataMessages[index]);
    arrMessage.id = idMax;

    dataMessages.splice(index, 0, arrMessage);
    setDataMessages([...dataMessages]);

  }

  const handleDeleteMessageContent = (indexMessage, indexContent) => {
    let arrMessage = [...dataMessages[indexMessage].message_content];
    let startArr = arrMessage.slice(0, indexContent);
    let lastArr = arrMessage.slice(indexContent + 1, arrMessage.length);
    for (let i = 0; i < dataMessages.length; i++) {
      if (indexMessage === i) {
        dataMessages[i].message_content = [...startArr, ...lastArr];
      }
    }
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
        id: idMax,
        contents: [
          { id: 1 }
        ]
      });
    }
    setDataMessages([...dataMessages]);
  }

  const handleAddItemCustomizePullDown = (indexMessage, indexContent, contentType, pullDownType, name) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name];
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

  const handleAddItemProductPullDown = (indexMessage, indexContent, contentType) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][contentType].products;

    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][contentType].products = [];
      arr = dataMessages[indexMessage].message_content[indexContent][contentType].products;
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

  const handleDragEndProduct = (result, idContent, type, contentType) => {
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

  const renderAddressField = (address) => {
    if ((address.compact_municipality_and_address && !address.is_display_address_field) || address.compact_municipality_and_address_and_building_name) return;
    if (address.address === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
          {address.address_label || '番地'}
        </div>
        <InputCustom
          placeholder={address.address}
          disabled={true}
          style={{ width: '100%' }}
        />
      </div>
    );
  }

  const renderBuildingName = (address) => {
    if (address.building_name === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
          {address.building_name_label || '建物名'}
        </div>
        <InputCustom
          placeholder={address.building_name}
          disabled={true}
          style={{ width: '100%' }}
        />
      </div>
    );
  }

  const renderMunicipality = (address) => {
    if (address.municipality === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
          {address.municipality_label || '市区町村'}
        </div>
        <InputCustom
          placeholder={address.municipality}
          disabled={true}
          style={{ width: '100%' }}
        />
      </div>
    );
  }

  const renderSinglePostCode = (address) => {
    return (
      <InputCustom
        placeholder={address.post_code}
        disabled={true}
        style={{ width: '100%' }}
      />
    );
  }

  const renderSplitPostCode = (address) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <InputCustom
          placeholder={address.post_code_left}
          disabled={true}
          style={{ width: '49%' }}
        />
        <InputCustom
          placeholder={address.post_code_right}
          disabled={true}
          style={{ width: '49%' }}
        />
      </div>
    );
  }

  const renderPostCode = (address) => {
    if (address.post_code === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px' }}>
          {address.post_code_label || '郵便番号'}
        </div>
        {address.split_postal_code !== true ? renderSinglePostCode(address) : renderSplitPostCode(address)}
      </div>
    );
  }

  const renderZipCodeAddressTitle = (zipCodeAddress) => {
    if (!(zipCodeAddress.title_require || zipCodeAddress.isCheckRequire)) return;

    const hasRequiredItem = () => {
      if (zipCodeAddress.isCheckRequire !== 'set_required_for_each_item') return false;
      return ['postCode', 'prefecture', 'municipality', 'address', 'buildingName'].some(item => zipCodeAddress[`${item}Required`]);
    }

    const isRequired = zipCodeAddress.isCheckRequire === 'all_items_require' || zipCodeAddress.isCheckRequire === 'require' || hasRequiredItem();
    return (
      <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
        {zipCodeAddress.title_require &&
          <span className="ss-message__content--user-pull_down-title">
            {zipCodeAddress.title}
          </span>
        }
        {isRequired &&
          <span className="ss-message__content--user-text-input-required">
            ※必須
          </span>
        }
      </div>
    );
  }

  const renderPrefecture = (address) => {
    if (address.prefecture === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
          {address.prefecture_label || '都道府県'}
        </div>
        <InputCustom
          placeholder={address.prefecture}
          disabled={true}
          style={{ width: '100%' }}
        />
      </div>
    );
  }

  const renderLPIntegrationOptionSetting = ({ indexMessageSelect, indexContent, content, pullDown }) => {
    if (pullDown.type !== 'lp_integration_option') return null;
    return (
      <React.Fragment>
        <CheckboxCustom
          label="文言を右に表示する"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'with_suffix')}
          value={pullDown.with_suffix}
        />
        {
          pullDown.with_suffix && (
            <div className="ss-user-setting__item-bottom">
              <InputCustom
                placeholder="文言"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_integration_option_text')}
                value={pullDown.lp_integration_option_text}
              />
            </div>
          )
        }
        <CheckboxCustom
          label="空なオプション解除"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'dont_display_empty_option')}
          value={pullDown.dont_display_empty_option}
        />
        {
          renderFukushashikiSetting({
            mode: pullDown.lp_element_search_mode,
            inputValue: pullDown.lp_element_search_value,
            onModeChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_element_search_mode'),
            onInputChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_element_search_value'),
          })
        }
      </React.Fragment>
    );
  }

  const renderLPIntegrationOptionPreview = (pullDown) => {
    if (pullDown.type !== 'lp_integration_option') return null;
    const selectWidth = pullDown.with_suffix ? '70%' : '100%';
    
    return (
      <React.Fragment>
        <SelectCustom
          data={dataPrefectures}
          placeholder="選択してください。"
          style={{ width: selectWidth }}
        />
        {
          pullDown.with_suffix && (
            <label style={{ width: '30%' }}>{pullDown.lp_integration_option_text}</label>
          )
        }
      </React.Fragment>
    );
  }

  const renderTextInputPasswordConfirmationPreview = (textInput) => {
    if (textInput.type !== 'password_confirmation') return null;
    
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  const renderPreviewPulldownfromJs = (pullDown) => {
    if (pullDown.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

    return (
      <React.Fragment>
        <SelectCustom
          data={[]}
          placeholder="選択してください。"
          style={{ width: '100%' }}
        />
      </React.Fragment>
    )
  };

  const renderDetailSettingPulldownFromJs = ({ indexMessageSelect, indexContent, content, pullDown }) => {
    if (pullDown.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

    return (
      <React.Fragment>
        <div>
          <div
            className='ss-user-setting__item-bottom'
            style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}
          >
            jscode
          </div>
          <div className='ss-user-setting__item-bottom'>
            <textarea
              style={{ width: '90%' }}
              className='ss-user-setting-item-textarea-label ss-input-value'
              placeholder='テキスト'
              rows='10'
              value={pullDown.from_js_result_code}
              onChange={(e) =>
                onChangeValueMessageContent(
                  indexMessageSelect,
                  indexContent,
                  content.type,
                  e.target.value,
                  'from_js_result_code'
                )
              }
            />
          </div>
        </div>
        <div
          className='ss-user-setting__item-row'
          style={{ display: 'flex', gap: '10px', marginLeft: '35px', width: '90%' }}
        >
          <Tooltip title='複写先要素の取得方法をお選びください' placement='top'>
            <div style={{ width: '25%' }}>
              <SelectCustom
                id='title'
                style={{ width: '100%' }}
                value={pullDown.from_js_result_target_search_mode}
                onChange={(value) =>
                  onChangeValueMessageContent(
                    indexMessageSelect,
                    indexContent,
                    content.type,
                    value,
                    'from_js_result_target_search_mode'
                  )
                }
                data={[
                  { key: 1, value: 'id' },
                  { key: 2, value: 'css_selector' },
                  { key: 3, value: 'xpath' },
                ]}
                keyValue='key'
                placeholder='複写先要素の取得方法をお選びください'
              />
            </div>
          </Tooltip>
          <Tooltip
            title={
              {
                1: '複写先要素のIDを入力ください',
                2: '複写先要素のcss_selectorを入力ください',
                3: '複写先要素のxPathを入力ください',
              }[pullDown[pullDown.type]?.from_js_result_target_search_mode] || ''
            }
            placement='top'
          >
            <div style={{ flex: '75%' }}>
              <InputCustom
                styleLabel={{ width: '100%' }}
                style={{ width: '100%' }}
                onChange={(value) =>
                  onChangeValueMessageContent(
                    indexMessageSelect,
                    indexContent,
                    content.type,
                    value,
                    'from_js_result_target_search_value'
                  )
                }
                value={pullDown.from_js_result_target_search_value}
                placeholder={
                  {
                    1: '複写先要素のIDを入力ください',
                    2: '複写先要素のcss_selectorを入力ください',
                    3: '複写先要素のxPathを入力ください',
                  }[pullDown[pullDown.type]?.from_js_result_target_search_mode] || ''
                }
              />
            </div>
          </Tooltip>
        </div>
      </React.Fragment>
    );
  };
  
  const onChangeFixedDate = (indexMessage, indexContent, type, value, name) => {
    if (value) {
      dataMessages[indexMessage].message_content[indexContent][type][name].push(moment(value, "YYYY-MM-DD").format("YYYY-MM-DD"));
    }
    dataMessages[indexMessage].message_content[indexContent][type].select_fixed_date = value;
    setDataMessages([...dataMessages]);
  }

  const handleChangeValueRequireZipCode = (indexMessage, indexContent, type, value, name) => {
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

  const handleRemoveItemProductPullDown = (indexMessage, indexContent, contentType, name, indexPullDown) => {
    const newArrRadio = dataMessages[indexMessage].message_content[indexContent][contentType].products.filter((item, index) => index !== indexPullDown);
    dataMessages[indexMessage].message_content[indexContent][contentType].products = newArrRadio;
    setDataMessages([...dataMessages]);
  }

  const handleRemoveItemZipCodeAddress = (indexMessage, indexContent, contentType, field) => {
    let newArr = dataMessages[indexMessage].message_content[indexContent][contentType];
    delete newArr[field];
    dataMessages[indexMessage].message_content[indexContent][contentType] = newArr;
    setDataMessages([...dataMessages]);
  }

  const createVariable = () => {
    if (!variableName) {
      setErrorVariable("変数名を入力してください。");
      return;
    }
    let data = {
      variable: {
        variable_name: variableName,
        default_value: defaultValue,
      }
    }
    api.post(`/api/v1/managements/chatbots/${botId}/variables`, data).then(res => {
      setIsOpenAddVariable(false);
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti('変数を作成しました。');
      } else if (res.data.code === 2) {
        setMessageNoti(res.data.message);
      }
      getListVariable();
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    }).catch((error) => {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    });
  }

  const onClickCreateStatement = async (belongTo, indexMessage) => {
    let dataMessagesClone = [...dataMessages];
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
              text_input: {
                use_for_confirm_message: false,
              },
              getting_error_notification: {
                use_for_confirm_message: false,
              },
              email: {},
              file: {},
              script: {},
              html_code: {},
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
          is_display_button_next: true,
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
              text_input: {
                use_for_confirm_message: false,
              },
              email: {},
              file: {},
              script: {},
              html_code: {},
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
          is_display_button_next: true,
          message_content: [],
        }
      )
    }

    setBelongTo('');
    setDataMessages([...dataMessagesClone]);
  }

  const handlePannelCondition = (isUpCondition, role = 'bot') => {
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
        document.querySelector('.ss-user-setting__bottom').style.maxHeight = '460px';
      } else {
        document.querySelector('.ss-user-setting__main').style.height = '57%';
        document.querySelector('.ss-user-setting__bottom').style.maxHeight = '220px';
      }
    }
  }

  const onChangeValueCondition = (index, value, name) => {
    dataMessages[indexMessageSelect].conditions[index][name] = value;
    setConditions([...conditions]);
  }

  const onClickAddCondition = () => {
    dataMessages[indexMessageSelect].conditions.push({
      linkCondition: 'and',
      condition: 'is',
      nameCondition: 'current_url',
      inputCondition: '',
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
    let link = document.createElement('a');
    link.href = file;
    link.download = "file"
    document.body.appendChild(link);

    link.click();
    link.remove();
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

  const settingsCarousel = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  }

  return (
    <div className="content">
      <ScenarioActionsBar onSave={onClickSaveScenario} onSavePreview={onClickSavePreview} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="ss-sc-setting">
                {/* ss overview */}
                <div className="ss-sc-content ss-overview">
                  <ScenarioOverviewPanel />
                  <ScenarioMessageOverview errorScenarioName={errorScenarioName}>
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
                              <span>ボット発言</span>
                            </div>
                            <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('user')}>
                              <MDBIcon
                                fas
                                icon="comment"
                                className="ss-add-option-icon"
                              ></MDBIcon>
                              <span>ユーザ入力</span>
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
                                  }
                                }
                                let titleMessage = "";
                                if (content) {
                                  if (content.type === 'delay') { titleMessage = "遅延" }
                                  else if (content.type === 'file') { titleMessage = "ファイル" }
                                  else if (content.type === 'email') { titleMessage = "メール" }
                                  else if (content.type === 'api_linkage') { titleMessage = "API連携" }
                                  else if (content.type === 'script') { titleMessage = "スクリプト" }
                                  else if (content.type === 'clear_variable') { titleMessage = "変数クリア" }
                                  else if (content.type === 'variable_set') { titleMessage = "変数セット" }
                                  else if (content.type === 'pause') { titleMessage = "一時停止" }
                                  else if (content.type === 'getting_error_notification') { titleMessage = "エラー取得の通知" }
                                  else if (content.type === BOT_MESSAGE_TYPES.HTML_CODE) { titleMessage = "HTMLコード" }
                                  else if (content.type === BOT_MESSAGE_TYPES.UGC) { titleMessage = "HTML_UGC_CONFIG" }
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
                                                    {content.type !== 'text_input' && <div className="ss-sub-title-message">
                                                      {titleMessage}
                                                    </div>}
                                                    {message.message_name && <div className="ss-sub-title-message ss-truncation-text" style={{ backgroundColor: '#fff', maxWidth: '60%' }}>{message.message_name}</div>}
                                                  </div>
                                                  {/* bot: type == 'text_input' */}
                                                  {/* bot: type == 'getting_error_notification' */}
                                                  {(content.type === 'text_input' || content.type === 'getting_error_notification') && (
                                                    // <textarea
                                                    //   className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                    //   value={content[content.type]?.content || ''}
                                                    //   style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                    //   readOnly
                                                    // ></textarea>
                                                    <div
                                                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                                                      style={message.hidden === true ? { opacity: '0.4' } : {}}
                                                      contentEditable={false}
                                                      suppressContentEditableWarning={true}
                                                      dangerouslySetInnerHTML={{ __html: content[content.type]?.content }}
                                                      onClick={(event) => {
                                                        if ((event.target.tagName.toLowerCase() === 'a') || (event.target.tagName.toLowerCase() === 'img')) {
                                                          event.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
                                                          // Thực hiện hành động khác ở đây, ví dụ như mở một cửa sổ popup
                                                        }
                                                      }}
                                                    />
                                                  )}
                                                  {/* bot: type == 'file' */}
                                                  {content.type === 'file' && (
                                                    content[content.type]?.content ? (
                                                      <React.Fragment>
                                                        {/* {(type === 'mp4') && */}
                                                        <div id='check-append-vid' style={type !== 'mp4' ? { display: 'none' } : {}} className="ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-video">
                                                          <video
                                                            // id="preview-video"
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
                                                  {(content.type === 'script' || content.type === BOT_MESSAGE_TYPES.HTML_CODE || content.type === BOT_MESSAGE_TYPES.UGC ) && (
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
                                                      <span>コピー</span>
                                                    </div>
                                                    <div className="ss-option-wrapper" onClick={() => handleHiddenMessage(index, 'bot')}>
                                                      {message.hidden ?
                                                        <React.Fragment>
                                                          <MDBIcon
                                                            fas
                                                            icon="angle-double-up"
                                                            className="ss-add-option-icon"
                                                          ></MDBIcon>
                                                          <span>有効にする</span>
                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                          <MDBIcon
                                                            fas
                                                            icon="eye-slash"
                                                            className="ss-add-option-icon"
                                                          ></MDBIcon>
                                                          <span>無効にする</span>
                                                        </React.Fragment>
                                                      }
                                                    </div>
                                                    <div className="ss-option-wrapper" onClick={() => handleDeleteMessage(index)}>
                                                      <MDBIcon
                                                        fas
                                                        icon="trash"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>削除</span>
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
                                                      <span>コピー</span>
                                                    </div>
                                                    <div className="ss-option-wrapper">
                                                      <MDBIcon
                                                        fas
                                                        icon="eye-slash"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>無効にする</span>
                                                    </div>
                                                    <div className="ss-option-wrapper">
                                                      <MDBIcon
                                                        fas
                                                        icon="trash"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>削除</span>
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
                                                <span>ボット発言</span>
                                              </div>
                                              <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('user', index)}>
                                                <MDBIcon
                                                  fas
                                                  icon="comment"
                                                  className="ss-add-option-icon"
                                                ></MDBIcon>
                                                <span>ユーザ入力</span>
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
                                                    const image = content.image;
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
                                                    let productPurchaseSelectOption = content.product_purchase_select_option;
                                                    let smsVerify = content.sms_verify;
                                                    let afteePaymentModule = content.AFTEE_payment_module;
                                                    let slider = content.slider;
                                                    let cardPaymentRadioButton = content.card_payment_radio_button;
                                                    let shippingAddress = content.shipping_address;
                                                    let variableSet = content.variable_set;
                                                    let buttonSubmit = content.button_submit;
                                                    let labelNoTransition = content.label_no_transition;
                                                    return (
                                                      <React.Fragment key={indexContent}>
                                                        {/* type == 'shipping_address' */}
                                                        {
                                                          content.type === 'shipping_address' && (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(shippingAddress.title_require || shippingAddress.require) &&
                                                                <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                                                                  {shippingAddress.title_require &&
                                                                    <span className="ss-message__content--user-text-input-title">
                                                                      {shippingAddress.title}
                                                                    </span>
                                                                  }
                                                                  {shippingAddress.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {
                                                                <Radio.Group
                                                                  style={{ width: "100%", fontSize: '14px' }}
                                                                  onChange={(value) => console.log(value)}
                                                                  value={shippingAddress.value_initial_selection}
                                                                >
                                                                  {shippingAddress.radio_contents && shippingAddress.radio_contents.map((itemPayment, indexPayment) => {

                                                                    return <Radio value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%' }}>
                                                                      {itemPayment.text}
                                                                    </Radio>
                                                                  })}
                                                                </Radio.Group>
                                                              }
                                                              {shippingAddress.name !== undefined && (
                                                                  <>
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px' }}>
                                                                      お名前
                                                                    </div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        placeholder={shippingAddress[shippingAddress.type]?.name_placeholderLeft}
                                                                        style={{ width: '49%', marginBottom: '0px' }}
                                                                        disabled
                                                                      ></input>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        placeholder={shippingAddress[shippingAddress.type]?.name_placeholderRight}
                                                                        style={{ width: '49%' }}
                                                                        disabled
                                                                      ></input>
                                                                    </div>
                                                                  </>
                                                                  )
                                                              }
                                                              {shippingAddress.kana_name !== undefined && (
                                                                  <>
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px' }}>
                                                                      フリガナ
                                                                    </div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        placeholder={shippingAddress[shippingAddress.type]?.kana_name_placeholderLeft}
                                                                        style={{ width: '49%', marginBottom: '0px' }}
                                                                        disabled
                                                                      ></input>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        placeholder={shippingAddress[shippingAddress.type]?.kana_name_placeholderRight}
                                                                        style={{ width: '49%' }}
                                                                        disabled
                                                                      ></input>
                                                                    </div>
                                                                  </>
                                                                  )
                                                              }
                                                              {
                                                                <div style={{ marginBottom: '10px' }}>
                                                                {(shippingAddress.title_require || shippingAddress.isCheckRequire) &&
                                                                  <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                                                                    {shippingAddress.title_require &&
                                                                      <span className="ss-message__content--user-pull_down-title">
                                                                        {shippingAddress.title}
                                                                      </span>
                                                                    }
                                                                    {(shippingAddress.isCheckRequire === 'all_items_require' ||
                                                                      shippingAddress.isCheckRequire === 'require') &&
                                                                      <span className="ss-message__content--user-text-input-required">
                                                                        ※必須
                                                                      </span>
                                                                    }
                                                                  </div>
                                                                }
                                                                {shippingAddress.post_code !== undefined && (
                                                                  <div className="ss-user-setting__item-bottom">
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px', marginTop:'5px' }}>
                                                                      郵便番号
                                                                    </div>
                                                                    {shippingAddress.split_postal_code !== true ?
                                                                      <InputCustom
                                                                        placeholder={shippingAddress.post_code}
                                                                        disabled={true}
                                                                        style={{ width: '100%' }}
                                                                      /> :
                                                                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                        <InputCustom
                                                                          placeholder={shippingAddress.post_code_left}
                                                                          disabled={true}
                                                                          style={{ width: '49%' }}
                                                                        />
                                                                        <InputCustom
                                                                          placeholder={shippingAddress.post_code_right}
                                                                          disabled={true}
                                                                          style={{ width: '49%' }}
                                                                        />
                                                                      </div>
                                                                    }
                                                                  </div>
                                                                )}
                                                                {shippingAddress.prefecture !== undefined &&
                                                                  <div className="ss-user-setting__item-bottom">
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                                                                      都道府県
                                                                    </div>
                                                                    <InputCustom
                                                                      placeholder={shippingAddress.prefecture}
                                                                      disabled={true}
                                                                      style={{ width: '100%' }}
                                                                    />
                                                                  </div>
                                                                }
                                                                {shippingAddress.municipality !== undefined &&
                                                                  <div className="ss-user-setting__item-bottom">
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                                                                      市区町村
                                                                    </div>
                                                                    <InputCustom
                                                                      placeholder={shippingAddress.municipality}
                                                                      disabled={true}
                                                                      style={{ width: '100%' }}
                                                                    />
                                                                  </div>
                                                                }
                                                                {shippingAddress.address !== undefined &&
                                                                  <div className="ss-user-setting__item-bottom">
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                                                                      番地
                                                                    </div>
                                                                    <InputCustom
                                                                      placeholder={shippingAddress.address}
                                                                      disabled={true}
                                                                      style={{ width: '100%' }}
                                                                    />
                                                                  </div>
                                                                }
                                                                {shippingAddress.building_name !== undefined &&
                                                                  <div className="ss-user-setting__item-bottom">
                                                                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                                                                      建物名
                                                                    </div>
                                                                    <InputCustom
                                                                      placeholder={shippingAddress.building_name}
                                                                      disabled={true}
                                                                      style={{ width: '100%' }}
                                                                    />
                                                                  </div>
                                                                }
                                                              </div>
                                                              }
                                                              {shippingAddress.number !== undefined && (
                                                                <React.Fragment>
                                                                  {shippingAddress.withHyphen === false ?
                                                                    <>
                                                                      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                                                                        電話番号
                                                                      </div>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        style={{ marginBottom: '0px' }}
                                                                        placeholder={shippingAddress[shippingAddress.type]?.number_placeholder}
                                                                        disabled
                                                                      ></input>
                                                                    </>
                                                                    :
                                                                    <>
                                                                      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                                                                        電話番号
                                                                      </div>
                                                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <input
                                                                          className="ss-message__content--user-text-input ss-input-value"
                                                                          readOnly
                                                                          style={{ marginBottom: '0px', width: '32%' }}
                                                                          placeholder={shippingAddress[shippingAddress.type]?.number1_placeholder}
                                                                          disabled
                                                                        ></input>
                                                                        <input
                                                                          className="ss-message__content--user-text-input ss-input-value"
                                                                          readOnly
                                                                          style={{ marginBottom: '0px', width: '32%' }}
                                                                          placeholder={shippingAddress[shippingAddress.type]?.number2_placeholder}
                                                                          disabled
                                                                        ></input>
                                                                        <input
                                                                          className="ss-message__content--user-text-input ss-input-value"
                                                                          readOnly
                                                                          style={{ marginBottom: '0px', width: '32%' }}
                                                                          placeholder={shippingAddress[shippingAddress.type]?.number3_placeholder}
                                                                          disabled
                                                                        ></input>
                                                                      </div>
                                                                    </>

                                                                  }
                                                                </React.Fragment>
                                                              )
                                                              } </div>
                                                          )
                                                        }
                                                        {PREVIEW_MAP[content.type] ? React.createElement(PREVIEW_MAP[content.type], {
                                                          textInput,
                                                          label,
                                                          textarea,
                                                          radioButton,
                                                          checkbox,
                                                          pullDown,
                                                          dataHour,
                                                          dataMinutes,
                                                          dataYear,
                                                          dataMonth,
                                                          dataDay,
                                                          dataPrefectures,
                                                          dataCity,
                                                          renderTextInputPasswordConfirmationPreview,
                                                          renderPreviewPulldownfromJs,
                                                        }) : null}

                                                        {/* type == 'zip_code_address' */}
                                                        {
                                                          content.type === 'zip_code_address' && (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {renderZipCodeAddressTitle(zipCodeAddress)}
                                                              {renderPostCode(zipCodeAddress)}
                                                              {renderPrefecture(zipCodeAddress)}
                                                              {renderMunicipality(zipCodeAddress)}
                                                              {renderAddressField(zipCodeAddress)}
                                                              {renderBuildingName(zipCodeAddress)}
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
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {!attachingFile.file_content && <span style={{ fontWeight: '400', fontSize: '12px' }}>未選択</span>}
                                                              <div className="ss-message__content--user-attaching_file">
                                                                <Button className="ss-message__content--user-attaching_file-btn" style={{ backgroundColor: '#A3B1BF', marginTop: '0px' }}>
                                                                  ファイルを選択
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
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {/* calendar: type = 'date_selection' */}
                                                              {calendar.type === 'date_selection' && (
                                                                <React.Fragment>
                                                                  <DatePickerCustom
                                                                    style={{ width: '99%', marginTop: '5px' }}
                                                                    value={calendar.date_selection_test ? moment(calendar.date_selection_test, "YYYY-MM-DD") : null}
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
                                                                      locale={locale}
                                                                      headerRender={({ value, type, onChange, onTypeChange }) => {
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
                                                                            <Select.Option key={i} value={i} className="month-item">
                                                                              {months[i]}
                                                                            </Select.Option>,
                                                                          );
                                                                        }

                                                                        const year = value.year();
                                                                        const month = value.month();
                                                                        const options = [];
                                                                        for (let i = year - 50; i < year + 50; i += 1) {
                                                                          options.push(
                                                                            <Select.Option key={i} value={i} className="year-item">
                                                                              {i}
                                                                            </Select.Option>,
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
                                                                                  onChange={(e) => onTypeChange(e.target.value)}
                                                                                  value={type}
                                                                                >
                                                                                  <Radio.Button value="month">月</Radio.Button>
                                                                                  <Radio.Button value="year">年</Radio.Button>
                                                                                </Radio.Group>
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                        );
                                                                      }}
                                                                      style={{ top: '20px', width: '300px', border: '1px solid grey' }}
                                                                      value={calendar.date_selection_test ? moment(calendar.date_selection_test, "YYYY-MM-DD") : null}
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
                                                                    value={calendar.start_date_test ? moment(calendar.start_date_test, "YYYY-MM-DD") : null}
                                                                    onChange={(date, dateString) => console.log(dateString)}
                                                                  />
                                                                  <DatePickerCustom
                                                                    style={{ width: '49%', marginTop: '5px' }}
                                                                    disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
                                                                    value={calendar.end_date_test ? moment(calendar.end_date_test, "YYYY-MM-DD") : null}
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
                                                                  ※必須
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
                                                                      ※必須
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
                                                        {
                                                          content.type === 'image' && (
                                                            <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                                                              <img src={image.imageURL} style={{ width: image.image_width, height: image.image_height }} />
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
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {creditCardPayment.separate_type === false ?
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="カード番号"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={creditCardPayment.card_number_placeholder}
                                                                  />
                                                                </div> :
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <div style={{ width: '100%' }}>カード番号</div>
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
                                                                    label="カード名義"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={creditCardPayment.card_number_placeholder}
                                                                  />
                                                                </div>
                                                              }
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div style={{ width: '100%' }}>有効期限</div>
                                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                                                  <SelectCustom
                                                                    placeholder="年"
                                                                    style={{ width: '49%' }}
                                                                    value={creditCardPayment.year_placeholder}
                                                                    disabled={true}
                                                                  />
                                                                  <SelectCustom
                                                                    placeholder="月"
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
                                                                    label="CVC非表示"
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
                                                            <div style={{ color: '#6989A6', fontSize: '14px' }}>キャプチャ</div>
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
                                                                      ※必須
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
                                                                                      商品番号: {itemProduct.item_number}
                                                                                    </div>
                                                                                  }
                                                                                  {itemProduct.price_display_custom ?
                                                                                    <div className="ss-user-overview-product-purchase-infor-price">
                                                                                      {itemProduct.price_display_custom}
                                                                                    </div> :
                                                                                    productPurchase.price_display && itemProduct.item_price &&
                                                                                    <div className="ss-user-overview-product-purchase-infor-price">
                                                                                      値段: {itemProduct.item_price} 円
                                                                                    </div>
                                                                                  }
                                                                                  {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                                                                                    <div className="ss-user-overview-product-purchase-infor-price">
                                                                                      数量：最大{itemProduct.quantity_limit}個まで
                                                                                    </div> :
                                                                                    ""
                                                                                  }
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
                                                                                      商品番号: {itemProduct.item_number}
                                                                                    </div>
                                                                                  }
                                                                                  {itemProduct.price_display_custom ?
                                                                                    <div className="ss-user-overview-product-purchase-infor-price">
                                                                                      {itemProduct.price_display_custom}
                                                                                    </div> :
                                                                                    productPurchase.price_display && itemProduct.item_price &&
                                                                                    <div className="ss-user-overview-product-purchase-infor-price">
                                                                                      値段: {itemProduct.item_price} 円
                                                                                    </div>
                                                                                  }
                                                                                  {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                                                                                    <div className="ss-user-overview-product-purchase-infor-price">
                                                                                      数量：最大{itemProduct.quantity_limit}個まで
                                                                                    </div> :
                                                                                    ""
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
                                                                              {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                                                                                <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                                                                  数量：最大{itemProduct.quantity_limit}個まで
                                                                                </div> :
                                                                                ""
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
                                                                              {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                                                                                <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                                                                  数量：最大{itemProduct.quantity_limit}個まで
                                                                                </div> :
                                                                                ""
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
                                                                      ※必須
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
                                                                                    商品番号: {itemProduct.item_number}
                                                                                  </div>
                                                                                }
                                                                                {itemProduct.price_display_custom ?
                                                                                  <div className="ss-user-overview-product-purchase-infor-price">
                                                                                    {itemProduct.price_display_custom}
                                                                                  </div> :
                                                                                  productPurchaseRadioButton.price_display && itemProduct.item_price &&
                                                                                  <div className="ss-user-overview-product-purchase-infor-price">
                                                                                    値段: {itemProduct.item_price} 円
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
                                                              </div>
                                                            </div>
                                                          )
                                                        }
                                                        {/* type == 'product_purchase_select_option' */}
                                                        {
                                                            content.type === 'product_purchase_select_option' && (
                                                                <div style={{ marginBottom: '10px' }}>
                                                                  {(productPurchaseSelectOption.title_require || productPurchaseSelectOption.require) &&
                                                                      <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                                                                        {productPurchaseSelectOption.title_require &&
                                                                            <span className="ss-message__content--user-pull_down-title">
                                                                      {productPurchaseSelectOption.title}
                                                                    </span>
                                                                        }
                                                                        {productPurchaseSelectOption.require === true &&
                                                                            <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                        }
                                                                      </div>
                                                                  }
                                                                  <div className="ss-message__content--user-pull_down-wrapper">
                                                                    {productPurchaseSelectOption.type === 'text_with_thumbnail_image' && (
                                                                        <>
                                                                          <div className="ss-message__content--user-pull_down--customization">
                                                                            <div className="">
                                                                              <div className="ss-message__content--user-pull_down-col col-12" style={{ padding: '0' }}>
                                                                                <SelectCustom
                                                                                    data={productPurchaseSelectOption.products}
                                                                                    style={{ width: '100%' }}
                                                                                    placeholder={productPurchaseSelectOption.display_unselected}
                                                                                    keyValue="productVariantId"
                                                                                    nameValue="title"
                                                                                />
                                                                              </div>
                                                                            </div>
                                                                          </div>
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
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              <div>
                                                                <Slider
                                                                  trackStyle={{ backgroundColor: slider.color || '#2C75F0' }}
                                                                  min={slider.type === 'discrete_type' ? parseInt(slider.min_value) : 0}
                                                                  max={slider.type === 'discrete_type' ? parseInt(slider.max_value) : 100}
                                                                  dots={slider.type === 'discrete_type'}
                                                                  step={slider.type !== 'discrete_type' && 0.1}
                                                                  marks={
                                                                    slider.type === 'discrete_type' ?
                                                                      {
                                                                        [slider.min_value]: slider.min_label,
                                                                        [slider.max_value]: slider.max_label
                                                                      } :
                                                                      {
                                                                        0: slider.min_label,
                                                                        100: slider.max_label
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
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {cardPaymentRadioButton.type === 'default' &&
                                                                <Radio.Group
                                                                  style={{ width: "100%", fontSize: '14px' }}
                                                                  onChange={(value) => console.log(value)}
                                                                  value={cardPaymentRadioButton.initial_selection}
                                                                >
                                                                  {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
                                                               
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
                                                                    label="カード番号"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={cardPaymentRadioButton.card_number_placeholder}
                                                                  />
                                                                </div> :
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <div style={{ width: '100%' }}>カード番号</div>
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
                                                              {Array.isArray(cardPaymentRadioButton.is_use_installment) && cardPaymentRadioButton.is_use_installment.length > 0 &&
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <div style={{ width: '100%' }}>お支払い回数</div>
                                                                    <SelectCustom
                                                                      style={{ width: '100%' }}
                                                                      placeholder="--"
                                                                      value={cardPaymentRadioButton.installment_placeholder}
                                                                      disabled={true}
                                                                    />
                                                                </div>
                                                              }
                                                              
                                                              {cardPaymentRadioButton.is_hide_card_name === false && 
                                                                (cardPaymentRadioButton.separate_name === false ?
                                                                  <div className="ss-user-setting__item-bottom">
                                                                  <InputCustom
                                                                    className="ss-user-setting-input-overview"
                                                                    styleLabel={{ width: '100%' }}
                                                                    label="カード名義"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={cardPaymentRadioButton.card_holder_placeholder}
                                                                  />
                                                                </div>
                                                                :
                                                                <>
                                                                  <div style={{ width: "100%" }}>カード名義</div>
                                                                  <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                                                                    <InputCustom
                                                                      className="ss-user-setting-input-overview"
                                                                      inline={false}
                                                                      disabled={true}
                                                                      value={cardPaymentRadioButton.card_holder1}
                                                                      placeholder={
                                                                        cardPaymentRadioButton.card_holder_placeholder1
                                                                      }
                                                                    />
                                                                    <InputCustom
                                                                      className="ss-user-setting-input-overview"
                                                                      styleLabel={{ width: "100%" }}
                                                                      inline={false}
                                                                      disabled={true}
                                                                      value={cardPaymentRadioButton.card_holder2}
                                                                      placeholder={
                                                                        cardPaymentRadioButton.card_holder_placeholder2
                                                                      }
                                                                    />
                                                                  </div>
                                                                </>
                                                                )
                                                                
                                                              }
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div style={{ width: '100%' }}>有効期限</div>
                                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                                                  <SelectCustom
                                                                    placeholder="年"
                                                                    style={{ width: '49%' }}
                                                                    value={cardPaymentRadioButton.year_placeholder}
                                                                    disabled={true}
                                                                  />
                                                                  <SelectCustom
                                                                    placeholder="月"
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
                                                                    label="CVC非表示"
                                                                    inline={false}
                                                                    disabled={true}
                                                                    placeholder={cardPaymentRadioButton.cvc_placeholder}
                                                                  />
                                                                </div>
                                                              }
                                                            </div>
                                                          )
                                                        }
                                                        {/* type == 'button_submit' */}
                                                        {content.type === 'button_submit' &&
                                                          <>
                                                            {buttonSubmit.is_display_error_message &&
                                                              <div className="ss-user-setting__item-text_input-top">
                                                                <div style={{
                                                                  width: "92%",
                                                                  padding: "5px",
                                                                  border: "1px solid #f44336",
                                                                  backgroundColor: "#ffebee",
                                                                  color: "#d32f2f",
                                                                  borderRadius: "5px",
                                                                  fontFamily: "Arial, sans-serif",
                                                                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                                                  margin: "8px",
                                                                }}
                                                                >
                                                                  {"エラーが発生しました。もう一度お試しください。"}
                                                                </div>
                                                              </div>
                                                            }
                                                            <div className="ss-user-setting__item-text_input-top">
                                                              <Button
                                                                data-id={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['button_submit_id'] ?? content.button_submit_id}
                                                                className="ss-user-setting__select-btn-add"
                                                                style={{
                                                                  background: "linear-gradient(135deg, #4caf50, #43a047)",
                                                                  color: "#fff",
                                                                  border: "none",
                                                                  borderRadius: "25px",
                                                                  padding: "15px 30px",
                                                                  fontSize: "16px",
                                                                  fontWeight: "bold",
                                                                  cursor: "pointer",
                                                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                                  transition: "all 0.3s ease",
                                                                  margin: '5px',
                                                                  width: "95%",
                                                                  alignContent: "center",
                                                                }}
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                }}
                                                              >
                                                                {content.button_submit_name}
                                                              </Button>
                                                            </div>
                                                          </>
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
                                                {!message.not_use_button && message.message_content[0]?.type !== 'button_submit'&& message?.message_content.length !== 0 &&
                                                  ((message?.message_content.length === 1 && 
                                                    !(message.message_content[0].type === 'product_purchase_radio_button'
                                                      || (message.message_content[0].type === 'carousel' && message.message_content[0]?.[message.message_content[0].type].require)
                                                      || (message.message_content[0].type === 'radio_button' && !message.message_content[0][message.message_content[0].type].initial_selection))
                                                  )
                                                    || message?.message_content.length > 1) &&
                                                  <div className="ss-user-message__action-wrapper">
                                                    <Button className="ss-user-message__action-btn">
                                                      {message.buttonName || "次へ"}
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
                                                  <span>コピー</span>
                                                </div>
                                                <div className="ss-option-wrapper" onClick={() => handleHiddenMessage(index, 'user')}>
                                                  {message.hidden ?
                                                    <React.Fragment>
                                                      <MDBIcon
                                                        fas
                                                        icon="angle-double-up"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>有効にする</span>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                      <MDBIcon
                                                        fas
                                                        icon="eye-slash"
                                                        className="ss-add-option-icon"
                                                      ></MDBIcon>
                                                      <span>無効にする</span>
                                                    </React.Fragment>
                                                  }
                                                </div>
                                                <div className="ss-option-wrapper" onClick={() => handleDeleteMessage(index)}>
                                                  <MDBIcon
                                                    fas
                                                    icon="trash"
                                                    className="ss-add-option-icon"
                                                  ></MDBIcon>
                                                  <span>削除</span>
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
                                                <span>ボット発言</span>
                                              </div>
                                              <div className="ss-option-wrapper" onClick={() => onClickCreateStatement('user', index)}>
                                                <MDBIcon
                                                  fas
                                                  icon="comment"
                                                  className="ss-add-option-icon"
                                                ></MDBIcon>
                                                <span>ユーザ入力</span>
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
                  </ScenarioMessageOverview>
                </div>

                {/* ss setting */}
                <ScenarioMessageDetailPanel>
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
                                    <span>名称</span>
                                    <span className="ss-user-setting__name-error" style={{ marginLeft: '5px', marginTop: '0px' }}>※必須</span>
                                  </div>
                                  <InputCustom
                                    placeholder="名称"
                                    style={{ width: '100%' }}
                                    onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
                                    value={dataMessages[indexMessageSelect].message_name}
                                  />
                                </div>
                              </div>
                              <label htmlFor="ss-bot-statement-title" style={{ marginBottom: '1px' }}>タイプ</label>
                              <select
                                name="bot_statement_type"
                                id="ss-bot-statement-type"
                                className="ss-input-value"
                                value={messageType}
                                onChange={e => handleChangeBotStatementType(e.target.value)}
                              >
                                <option value="text_input">テキスト</option>
                                <option value="getting_error_notification">エラー取得の通知</option>
                                <option value="file">ファイル</option>
                                <option value="email">メール</option>
                                <option value="api_linkage">API連携</option>
                                <option value="script">スクリプト</option>
                                <option value="delay">遅延</option>
                                <option value="clear_variable">変数クリア</option>
                                <option value="variable_set">変数セット</option>
                                <option value="pause">一時停止</option>
                                <option value="html_code">HTMLコード</option>
                                <option value="use_html_ugc_config">HTML_UGC_CONFIG</option>
                                {/* <option value="api_link_age">テキスト</option> Pending */}
                              </select>

                              {/* type: text_input */}
                              {/* type == 'getting_error_notification' */}
                              {(messageType === 'text_input' || messageType === 'getting_error_notification') && (
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
                                      placeholder="入力"
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                      onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
                                    >
                                    </textarea>
                                  </div>
                                  <div className="ss-bot-checkbox-scroll-auto">
                                    <CheckboxCustom
                                      label="自動でスクロールさせない"
                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'scroll_auto')}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['scroll_auto'] || ''}
                                    />
                                  </div>
                                  <div className="ss-bot-checkbox-scroll-auto">
                                    <CheckboxCustom
                                      label="確認メッセージに使用"
                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'use_for_confirm_message')}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['use_for_confirm_message'] || ''}
                                    />
                                  </div>
                                  <div className="ss-bot-checkbox-scroll-auto">
                                    <CheckboxCustom
                                      label="ログイン済み時に表示しない"
                                      onChange={(value) => {
                                        dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                        setDataMessages([...dataMessages]);
                                      }}
                                      value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                    />
                                  </div>
                                  <div className="ss-bot-checkbox-scroll-auto">
                                    <CheckboxCustom
                                      label="エラー発生の時に表示しない"
                                      onChange={(value) => {
                                        dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                        setDataMessages([...dataMessages]);
                                      }}
                                      value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                    />
                                  </div>
                                  {renderRootFaqOption('ss-bot-checkbox-scroll-auto')}
                                  {dataMessages[indexMessageSelect].message_content[0][messageType]?.['use_for_confirm_message'] && (
                                    <div
                                    id="ss-bot-statement-type-text"
                                    className="ss-bot-statement-type-text ss-bot-statement-type"
                                  >
                                    <textarea
                                      name="bot-statement-type-text-content"
                                      id="bot-statement-type-text-content"
                                      className="ss-bot-statement-type-text-content ss-input-value"
                                      rows={5}
                                      placeholder="入力"
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['jscode'] || ''}
                                      onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'jscode')}
                                    >
                                    </textarea>
                                  </div>
                                  )}
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
                                      placeholder="ファイルのURL"
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
                                      label={<span>自動でスクロールさせない<MDBIcon fas icon="question-circle" style={{ color: '#347AED', marginLeft: '5px', fontSize: '13px' }} /></span>}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.scroll_auto || false}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'scroll_auto')}
                                    />
                                    <div className="ss-file-upload-wrapper">
                                      <Button className="ss-bot-file-reference-btn" onClick={() => setIsOpenFileReference(true)}>
                                        ファイル参照
                                      </Button>
                                      <Button className="ss-bot-file-upload-btn" onClick={botUploadFile}>
                                        追加
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
                                      keyValue={"id"}
                                      nameValue={"email_template_name"}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.contentId || ''}
                                      onChange={(value) => {
                                        onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'contentId');
                                        onChangeValueMessageContent(indexMessageSelect, 0, messageType, dataEmail.find(item => item.id === value)?.email_template_name || '', 'content');
                                    }}
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
                                      label={'「処理中」アイコンを表示する'}
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
                                      label={'前のブロックを非活性にする'}
                                      value={dataMessages[indexMessageSelect].message_content[0][messageType]?.isDeactivePreviousBlock}
                                      onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'isDeactivePreviousBlock')}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* type: script */}
                              {(messageType === 'script'|| messageType === BOT_MESSAGE_TYPES.UGC)&& (
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
                                      placeholder="スクリプト..."
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
                                      <span style={{ marginRight: '10px' }}>遅延（秒）</span>
                                      <InputNum
                                        placeholder="00"
                                        className="ss-user-setting-input-delay ss-user-setting-input-limit-character"
                                        min={0}
                                        max={10}
                                        value={dataMessages[indexMessageSelect].message_content[0][messageType]?.['content'] || ''}
                                        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'content')}
                                      />
                                    </div>
                                    <div className="ss-bot-statement-type-delay__checkbox-wrapper">
                                      <CheckboxCustom
                                        label="typing_on (入力指標をオンにする)"
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
                                  <span style={{ fontWeight: '400' }}>変数</span>
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
                                  }}>追加</Button>
                                </div>
                              )}
                              {/* type: variable_set */}
                              {messageType === 'variable_set' && (
                                <div className="ss-bot-statement-wrapper" style={{ marginTop: '15px' }}>
                                  <span>※直後の条件分岐に変数を使用したい場合、ユーザー側の変数セットブロックをご利用ください。</span>
                                  <span style={{ fontWeight: '400', marginTop: '15px', display: 'block' }}>変数</span>
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
                                  }}>追加</Button>
                                </div>
                              )}

                              {/* type: pause */}
                              {messageType === 'pause' && (
                                <div style={{ marginTop: '15px', fontWeight: '700' }}>一時停止</div>
                              )}

                              {/* type: html_code */}
                              {messageType === BOT_MESSAGE_TYPES.HTML_CODE && (
                                <HtmlCodeConfig 
                                  config={dataMessages[indexMessageSelect].message_content[0][messageType]}
                                  onChangeValue={onChangeValueMessageContent}
                                  indexMessageSelect={indexMessageSelect}
                                />
                              )}
                            </div>
                          </div>
                          <div className="ss-bot-setting-condition-container">
                            <div className="ss-bot-setting-condition-header">
                              <div className="ss-bot-setting-condition-header-left">
                                <span style={{ fontWeight: '400' }}>表示対象者の条件設定</span>
                                <MDBIcon far icon="question-circle" style={{ color: '#FF7E00', padding: '10px' }} />
                                <span className="ss-bot-setting-condition-icon-label">Standard</span>
                                <span className="ss-bot-setting-condition-icon-label" style={{ width: '50px', backgroundColor: '#7A52A3' }}>Pro</span>
                              </div>
                              <div className="ss-bot-setting-condition-header-right">
                                {isConditionUp ? <MDBIcon fas icon="caret-up" onClick={() => handlePannelCondition(false)} /> : <MDBIcon fas icon="caret-down" onClick={() => handlePannelCondition(true)} />}
                              </div>
                            </div>
                            <div className="ss-bot-setting-condition-sub-header">
                              <span style={{ fontWeight: '400' }}>※設定すると、条件に当てはまるユーザーに対してのみ表示されます。</span>
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
                                    条件追加
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
                                <span>名称</span>
                                <span className="ss-user-setting__name-error" style={{ marginLeft: '5px' }}>※必須</span>
                              </div>
                              <InputCustom
                                placeholder="名称を入力"
                                style={dataMessages[indexMessageSelect].message_name ? {} : { borderColor: 'red' }}
                                onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
                                value={dataMessages[indexMessageSelect].message_name}
                              />
                              {!dataMessages[indexMessageSelect].message_name && <div style={{ color: 'rgb(185, 74, 72)' }}>
                                必ず指定してください。
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
                                        let image = content.image;
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
                                        let productPurchaseSelectOption = content.product_purchase_select_option;
                                        let smsVerify = content.sms_verify;
                                        let afteePaymentModule = content.AFTEE_payment_module;
                                        let slider = content.slider;
                                        let cardPaymentRadioButton = content.card_payment_radio_button;
                                        let shippingAddress = content.shipping_address
                                        let variableSet = content.variable_set;
                                        let buttonSubmit = content.button_submit;
                                        let labelNoTransition = content.label_no_transition;

                                        let numberMaxLength = 0;
                                        if (content.type === 'checkbox') {
                                          if (checkbox.type === 'default') {
                                            numberMaxLength = checkbox?.[checkbox.type]?.length;
                                          } else if (checkbox.type === 'checkbox_img') {
                                            checkbox?.[checkbox.type].forEach(item => {
                                              numberMaxLength += item.contents.length;
                                            });
                                          }
                                        }
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
                                                  {CONTENT_SETTING_MAP[content.type] ? React.createElement(CONTENT_SETTING_MAP[content.type], {
                                                    indexMessageSelect,
                                                    indexContent,
                                                    content,
                                                    textInput,
                                                    label,
                                                    textarea,
                                                    radioButton,
                                                    checkbox,
                                                    pullDown,
                                                    numberMaxLength,
                                                    dataMessages,
                                                    setDataMessages,
                                                    onChangeValueMessageContent,
                                                    renderRootFaqOption,
                                                    dataInputVar,
                                                    setIsOpenAddVariable,
                                                    isUseFukushashiki,
                                                    handleDragEndRadioCheckbox,
                                                    handleRemoveItemContent,
                                                    handleAddItemRadioCheckbox,
                                                    setIsOpenFileReference,
                                                    setVarFileReference,
                                                    setAcceptFile,
                                                    handleDragEndPullDown,
                                                    handleRemoveItemCustomizePullDown,
                                                    handleAddItemCustomizePullDown,
                                                    onChangeTimePullDown,
                                                    dataHour,
                                                    dataMinutes,
                                                    dataEveryMinute,
                                                    dataYear,
                                                    dataMonth,
                                                    dataDay,
                                                    dataPrefectures,
                                                    dataCity,
                                                    renderLPIntegrationOptionSetting,
                                                    renderDetailSettingPulldownFromJs,
                                                  }) : null}

                                                  {/* user: type = 'zip_code_address' ADD_FUKU */}
                                                  {content.type === 'zip_code_address' && (
                                                    <ZipCodeAddressSetting
                                                      indexMessageSelect={indexMessageSelect}
                                                      indexContent={indexContent}
                                                      contentType={content.type}
                                                      zipCodeAddress={zipCodeAddress}
                                                      dataMessages={dataMessages}
                                                      setDataMessages={setDataMessages}
                                                      dataInputVar={dataInputVar}
                                                      dataPrefectures={dataPrefectures}
                                                      isUseFukushashiki={isUseFukushashiki}
                                                      setIsOpenAddVariable={setIsOpenAddVariable}
                                                      onChangeValueMessageContent={onChangeValueMessageContent}
                                                      handleRemoveItemZipCodeAddress={handleRemoveItemZipCodeAddress}
                                                      renderRootFaqOption={renderRootFaqOption}
                                                    />
                                                  )}
                                                  {/* user: type = 'attaching_file' */}
                                                  {content.type === 'attaching_file' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        <CheckboxCustom
                                                          label="入力された内容を変数に保存する。"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={attachingFile.is_save_input_content}
                                                        />
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
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="必須"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={attachingFile.require}
                                                            />
                                                          </div>
                                                          {/* <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="Multiple file upload"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'multifile_upload')}
                                                              value={attachingFile.multifile_upload}
                                                            />
                                                          </div> */}
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
                                                          <Button className="ss-user-setting__select-btn-add" style={{ backgroundColor: '#A3B1BF', margin: '0px' }} onClick={() => console.log('Click select file')}>ファイルを選択</Button>
                                                        </div>
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'calendar' */}
                                                  {content.type === 'calendar' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        <CheckboxCustom
                                                          label="入力された内容を変数に保存する。"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={calendar.is_save_input_content}
                                                        />
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
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <CheckboxCustom
                                                          label="必須"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                          value={calendar.require}
                                                        />
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                              style={{ width: '49%' }}
                                                              value={calendar?.title_require}
                                                              data={dropDownTitle}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            />
                                                            <SelectCustom
                                                              allowClear={false}
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
                                                              placeholder="タイトル"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                              value={calendar.title}
                                                            />
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '12px' }}>開始日～終了日</span>
                                                          <DatePickerCustom
                                                            style={{ width: '39%' }}
                                                            value={calendar.start_date ? moment(calendar.start_date, "YYYY-MM-DD") : null}
                                                            onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'start_date')}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4', marginRight: '10px' }}>~</span>
                                                          <DatePickerCustom
                                                            style={{ width: '39%' }}
                                                            value={calendar.end_date ? moment(calendar.end_date, "YYYY-MM-DD") : null}
                                                            onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'end_date')}
                                                          />
                                                        </div>
                                                        {(() => {
                                                          const previewRel = getCalendarPreviewRelativeRangeLabel(calendar);
                                                          if (!previewRel) return null;
                                                          return (
                                                            <div className="ss-user-setting__item-bottom" style={{ fontSize: '12px', color: '#5a7a9a', marginTop: '4px' }}>
                                                              プレビュー適用範囲（今日・終了日オフセット）: {previewRel.start} ～ {previewRel.end}
                                                            </div>
                                                          );
                                                        })()}
                                                        <CheckboxCustom
                                                          label="入力値の検証にAPIを利用する"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                          value={calendar.use_api_input_value}
                                                        />
                                                        <CheckboxCustom
                                                          label="初期選択（今日から最短の日付）"
                                                          onChange={value => {
                                                            if (value === true) {
                                                              // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY-MM-DD"), 'date_selection_test');
                                                              // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY-MM-DD"), 'date_select');
                                                              // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY-MM-DD"), 'start_date_select');
                                                              // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY-MM-DD"), 'end_date_select');
                                                              // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY-MM-DD"), 'start_date_test');
                                                              // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, moment().format("YYYY-MM-DD"), 'end_date_test');
                                                              if (calendar.type !== "start_end_date") {
                                                                let i = 0;
                                                                let date_select = "";
                                                                date_select = moment().add(i, 'days').format("YYYY-MM-DD");
                                                                while (handleDisableDateCalendar(moment().add(i, 'days'), calendar)) {
                                                                  if (i === 100) {
                                                                    date_select = null;
                                                                    break;
                                                                  }
                                                                  date_select = moment().add(i + 1, 'days').format("YYYY-MM-DD");
                                                                  i++;
                                                                }
                                                                // calendar.date_select = date_select;
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, date_select, 'date_selection_test');
                                                              } else if (calendar.type === "start_end_date") {
                                                                let i = 0;
                                                                let start_date_select;
                                                                let end_date_select;
                                                                while (handleDisableDateCalendar(moment().add(i, 'days'), calendar)) {
                                                                  if (i === 100) {
                                                                    start_date_select = null;
                                                                    end_date_select = null;
                                                                    break;
                                                                  }
                                                                  start_date_select = moment().add(i + 1, 'days');
                                                                  end_date_select = moment().add(i + 1, 'days');
                                                                  i++;
                                                                }
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, start_date_select, 'start_date_test');
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, end_date_select, 'end_date_test');
                                                              }
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
                                                        <div className="ss-user-setting__item-bottom" style={{ width: '100%' , marginTop: '4px' }}>
                                                            <CheckboxCustom label="今日を起点にプレビュー範囲を合わせる（設定した開始～終了の内側に収めます）" onChange={(value)=>
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value,
                                                                'preview_relative_range_enabled')}
                                                                value={isCalendarPreviewRelativeRangeEnabled(calendar)}
                                                                />
                                                        </div>
                                                        {isCalendarPreviewRelativeRangeEnabled(calendar) && (
                                                        <div className="ss-user-setting__calendar-preview-offset-wrap">
                                                            <div className="ss-user-setting__calendar-preview-offset-row">
                                                                <span className="ss-user-setting-label" style={{ marginLeft: 0 }}>今日から（日）</span>
                                                                <InputNum placeholder="0" style={{ width: 100, minWidth: 88 }} min={Number.MIN_SAFE_INTEGER}
                                                                    max={Number.MAX_SAFE_INTEGER} disabled={isCalendarPreviewDaysSplitEnabled(calendar)} onChange={(v)=>
                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, v, 'preview_days_from_today')}
                                                                    value={calendar.preview_days_from_today ?? 0}
                                                                    />
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom" style={{ width: '100%' , marginTop: 6 }}>
                                                                <CheckboxCustom label="営業日（店舗による出荷準備）とカレンダーデイ（配送業者の配送期間）の設定にする" onChange={(value)=> {
                                                                    if (value === true || value === 1) {
                                                                    const total = Number(calendar.preview_days_from_today) || 0;
                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, true,
                                                                    'preview_days_split_enabled');
                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, 0, 'preview_business_days');
                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, total, 'preview_calendar_days');
                                                                    } else {
                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, false,
                                                                    'preview_days_split_enabled');
                                                                    }
                                                                    }}
                                                                    value={isCalendarPreviewDaysSplitEnabled(calendar)}
                                                                    />
                                                            </div>
                                                            {isCalendarPreviewDaysSplitEnabled(calendar) && (
                                                            <>
                                                                <div style={{ marginLeft: 12, marginTop: 8, marginBottom: 4, paddingLeft: 12, borderLeft: '2px solid #d9d9d9' ,
                                                                    }}>
                                                                    <div style={{ display: 'flex' , alignItems: 'flex-end' , flexWrap: 'wrap' , gap: '8px 10px' , }}>
                                                                        <span style={{ paddingBottom: 10, fontSize: 16, color: '#888' }}>=</span>
                                                                        <div style={{ display: 'flex' , flexDirection: 'column' , alignItems: 'center' , minWidth: 100 }}>
                                                                            <span className="ss-user-setting-label" style={{ marginBottom: 4, fontSize: 12 }}>
                                                                                営業日
                                                                            </span>
                                                                            <div style={{ display: 'flex' , alignItems: 'center' , flexWrap: 'wrap' , gap: 6 }}>
                                                                                <InputNum placeholder="0" style={{ width: 100, minWidth: 88 }} min={Number.MIN_SAFE_INTEGER}
                                                                                    max={Number.MAX_SAFE_INTEGER} onChange={(v)=> {
                                                                                    const b = Number(v) || 0;
                                                                                    const c = Number(calendar.preview_calendar_days) || 0;
                                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, b,
                                                                                    'preview_business_days');
                                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, b + c,
                                                                                    'preview_days_from_today');
                                                                                    }}
                                                                                    value={calendar.preview_business_days ?? 0}
                                                                                    />
                                                                                    <span style={{ fontSize: 12, color: '#666' , whiteSpace: 'nowrap' }}>
                                                                                        日（店舗による出荷準備など）
                                                                                    </span>
                                                                            </div>
                                                                        </div>
                                                                        <span style={{ paddingBottom: 10, fontSize: 16 }}>+</span>
                                                                        <div style={{ display: 'flex' , flexDirection: 'column' , alignItems: 'center' , minWidth: 100 }}>
                                                                            <span className="ss-user-setting-label" style={{ marginBottom: 4, fontSize: 12 }}>
                                                                                カレンダーデイ
                                                                            </span>
                                                                            <div style={{ display: 'flex' , alignItems: 'center' , flexWrap: 'wrap' , gap: 6 }}>
                                                                                <InputNum placeholder="0" style={{ width: 100, minWidth: 88 }} min={Number.MIN_SAFE_INTEGER}
                                                                                    max={Number.MAX_SAFE_INTEGER} onChange={(v)=> {
                                                                                    const c = Number(v) || 0;
                                                                                    const b = Number(calendar.preview_business_days) || 0;
                                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, c,
                                                                                    'preview_calendar_days');
                                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, b + c,
                                                                                    'preview_days_from_today');
                                                                                    }}
                                                                                    value={calendar.preview_calendar_days ?? 0}
                                                                                    />
                                                                                    <span style={{ fontSize: 12, color: '#666' , whiteSpace: 'nowrap' }}>
                                                                                        日（配送業者の配送期間など）
                                                                                    </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ss-user-setting__item-bottom" style={{ width: '100%' , marginTop: 12 }}>
                                                                    <div className="ss-user-setting-label" style={{ marginBottom: 6, fontWeight: 700 }}>
                                                                        カットオフの時間
                                                                    </div>
                                                                    <Select style={{ width: 200, minWidth: 160 }} showSearch optionFilterProp="children"
                                                                        value={deliveryCutOffTimeSelectValue(calendar)} onChange={(val)=> {
                                                                        const saved =
                                                                        val === DELIVERY_CUT_OFF_SELECT_NONE ? '' : val;
                                                                        onChangeValueMessageContent(
                                                                        indexMessageSelect,
                                                                        indexContent,
                                                                        content.type,
                                                                        saved,
                                                                        'preview_delivery_cut_off_time'
                                                                        );
                                                                        }}
                                                                        getPopupContainer={(trigger) => trigger.parentNode}
                                                                        >
                                                                        <Option value={DELIVERY_CUT_OFF_SELECT_NONE}>
                                                                            適用しない
                                                                        </Option>
                                                                        {Array.from({ length: 24 }, (_, h) => (
                                                                        <Option key={h} value={`${String(h).padStart(2, '0' )}:00`}>
                                                                            {`${h}:00`}
                                                                        </Option>
                                                                        ))}
                                                                    </Select>
                                                                    <div style={{ fontSize: 12, color: '#666' , marginTop: 6 }}>
                                                                        設定した時間以降の注文は最短日が+1日になります。
                                                                    </div>
                                                                </div>
                                                                <div className="ss-user-setting__item-bottom" style={{ width: '100%' , marginTop: 14 }}>
                                                                    <div className="ss-user-setting-label" style={{ marginBottom: 6, fontWeight: 700 }}>
                                                                        営業休業日
                                                                    </div>
                                                                    <div className="ss-user-setting-label" style={{ marginBottom: 8, fontSize: 12 }}>
                                                                        曜日の設定
                                                                    </div>
                                                                    <div style={{ display: 'flex' , flexWrap: 'wrap' , gap: '10px 16px' , alignItems: 'center' }}>
                                                                        {[
                                                                        { dow: 0, label: '日' },
                                                                        { dow: 1, label: '月' },
                                                                        { dow: 2, label: '火' },
                                                                        { dow: 3, label: '水' },
                                                                        { dow: 4, label: '木' },
                                                                        { dow: 5, label: '金' },
                                                                        { dow: 6, label: '土' },
                                                                        ].map(({ dow, label }) => {
                                                                        const closedList = Array.isArray(calendar.preview_closed_weekdays)
                                                                          ? calendar.preview_closed_weekdays
                                                                          : [];
                                                                        const checked = closedList.includes(dow);
                                                                        return (
                                                                        <Checkbox
                                                                          key={dow}
                                                                          checked={checked}
                                                                          onChange={(e) => {
                                                                            const next = new Set(
                                                                              Array.isArray(calendar.preview_closed_weekdays)
                                                                                ? [...calendar.preview_closed_weekdays]
                                                                                : []
                                                                            );
                                                                            if (e.target.checked) next.add(dow);
                                                                            else next.delete(dow);
                                                                            onChangeValueMessageContent(
                                                                              indexMessageSelect,
                                                                              indexContent,
                                                                              content.type,
                                                                              Array.from(next).sort((a, b) => a - b),
                                                                              'preview_closed_weekdays'
                                                                            );
                                                                          }}
                                                                        >
                                                                          {label}
                                                                        </Checkbox>
                                                                        );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </>
                                                            )}
                                                            <div className="ss-user-setting__calendar-preview-offset-row">
                                                              <span className="ss-user-setting-label" style={{ marginLeft: 0 }}>連続選択日数（開始日を含む／－は前に短縮）</span>
                                                              <InputNum
                                                                placeholder="0"
                                                                style={{ width: 100, minWidth: 88 }}
                                                                min={Number.MIN_SAFE_INTEGER}
                                                                max={Number.MAX_SAFE_INTEGER}
                                                                onChange={(v) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, v, 'preview_days_relative_to_end_date')}
                                                                value={calendar.preview_days_relative_to_end_date ?? 0}
                                                              />
                                                            </div>
                                                          </div>
                                                        )}
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '98%' }}>
                                                            <SelectCustom
                                                              label="選択不可の日時"
                                                              mode="multiple"
                                                              styleLabel={{ fontWeight: '700', marginRight: '17px' }}
                                                              style={{ width: '81%' }}
                                                              data={dataSelectDateTime}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'non_select_date_time')}
                                                              value={calendar.non_select_date_time}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start ss-user-setting__item-custom">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>固定日付</span>
                                                          <DatePickerCustom
                                                            value={calendar.select_fixed_date ? moment(calendar.select_fixed_date, "YYYY-MM-DD") : null}
                                                            onChange={(date, dateString) => onChangeFixedDate(indexMessageSelect, indexContent, content.type, dateString, 'fixed_date')}
                                                            style={{ width: '88%' }}
                                                            allowClear={true}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            mode="multiple"
                                                            style={{ width: '99%', minHeight: '20px' }}
                                                            data={calendar.fixed_date}
                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'fixed_date')}
                                                            value={calendar.fixed_date}
                                                          />
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start" style={{ display: 'block' }}>
                                                          <div><span className="ss-user-setting-label" style={{ marginRight: '10px', fontWeight: '700', fontSize: '14px' }}>選択不可の日付（”今日”を基準にした範囲）</span></div>
                                                          <div><span className="ss-user-setting-label" style={{ marginRight: '10px' }}>※正の数時と負の数字の両方を指定することができます。</span></div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>集計対象期間</span>
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
                                                              value={calendar.date_selection_test ? moment(calendar.date_selection_test, "YYYY-MM-DD") : null}
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
                                                              locale={locale}
                                                              headerRender={({ value, type, onChange, onTypeChange }) => {
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
                                                                    <Select.Option key={i} value={i} className="month-item">
                                                                      {months[i]}
                                                                    </Select.Option>,
                                                                  );
                                                                }

                                                                const year = value.year();
                                                                const month = value.month();
                                                                const options = [];
                                                                for (let i = year - 50; i < year + 50; i += 1) {
                                                                  options.push(
                                                                    <Select.Option key={i} value={i} className="year-item">
                                                                      {i}
                                                                    </Select.Option>,
                                                                  );
                                                                }
                                                                return (
                                                                  <div style={{ padding: 8 }}>
                                                                    <Row>
                                                                      <Col xs={4}>
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
                                                                      <Col xs={4}>
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
                                                                      <Col xs={4}>
                                                                        <Radio.Group
                                                                          size="small"
                                                                          onChange={(e) => onTypeChange(e.target.value)}
                                                                          value={type}
                                                                        >
                                                                          <Radio.Button value="month">月</Radio.Button>
                                                                          <Radio.Button value="year">年</Radio.Button>
                                                                        </Radio.Group>
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                );
                                                              }}
                                                              style={{ top: '20px', width: '300px', border: '1px solid grey' }}
                                                              value={calendar.date_selection_test ? moment(calendar.date_selection_test, "YYYY-MM-DD") : null}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'date_selection_test')}
                                                              disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                            />
                                                          </div>
                                                        }
                                                        {/* calendar: type = start_end_date */}
                                                        {calendar.type === 'start_end_date' &&
                                                          <React.Fragment>
                                                            <div className="ss-user-setting__item-bottom-flex-start">
                                                              <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>指定期間</span>
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
                                                              <div><span className="ss-user-setting-label" style={{ marginRight: '10px', color: '#ccc' }}>※終了日は開始日からN日の指定期間を連動させる。</span></div>
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'space-around' }}>
                                                              <DatePickerCustom
                                                                style={{ width: '49%' }}
                                                                disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                                                                value={calendar.start_date_test ? moment(calendar.start_date_test, "YYYY-MM-DD") : null}
                                                                onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'start_date_test')}
                                                              />
                                                              <DatePickerCustom
                                                                style={{ width: '49%' }}
                                                                disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
                                                                value={calendar.end_date_test ? moment(calendar.end_date_test, "YYYY-MM-DD") : null}
                                                                onChange={(date, dateString) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateString, 'end_date_test')}
                                                              />
                                                            </div>
                                                          </React.Fragment>
                                                        }
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'agree_term' ADD_FUKU */}
                                                  {content.type === 'agree_term' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <CheckboxCustom
                                                          label="ログイン済み時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                        />
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            style={{ width: '49%' }}
                                                            value={agreeTerm?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            style={{ width: '49%' }}
                                                            allowClear={false}
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
                                                            placeholder="タイトル"
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
                                                            placeholder="テキスト"
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
                                                                        placeholder="コメント"
                                                                        value={agreeTermItem.title_comment}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, 'title_comment')}
                                                                      />
                                                                      <InputDouble
                                                                        classCustom="ss-user-setting-custom-double-input"
                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, name === 'left' ? 'title' : 'urls')}
                                                                        valueLeft={agreeTermItem.title}
                                                                        valueRight={agreeTermItem.urls}
                                                                        placeholder={['タイトル', 'URLs']}
                                                                      />
                                                                      <InputCustom
                                                                        style={{ width: '100%', marginBottom: '10px' }}
                                                                        placeholder="コメント"
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
                                                              maxLength={Number.MAX_SAFE_INTEGER}
                                                              placeholder="テキスト"
                                                              style={{ width: '100%', color: '#252422' }}
                                                              value={agreeTerm.term}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'term')}
                                                            />
                                                          }
                                                          onChange={value => console.log(value)}
                                                          value={false}
                                                        />
                                                      </div>
                                                      {isUseFukushashiki && <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginLeft: '34px',width:'90%' }}>
                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                              <div style={{ width: '20%' }}>
                                                                <SelectCustom
                                                                  id="title"
                                                                  style={{ width: '100%' }}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_mode', value)}
                                                                  data={[
                                                                    { key: 1, value: 'id' },
                                                                    { key: 2, value: 'css_selector' },
                                                                    { key: 3, value: 'xpath' }
                                                                  ]}
                                                                  keyValue="key"
                                                                  placeholder="複写先要素の取得方法をお選びください"
                                                                />
                                                              </div>
                                                        </Tooltip>
                                                        <Tooltip title={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']
                                                                  ] || ''} placement="top">
                                                              <div style={{ flex: '80%' }}>
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  style={{ width: '100%' }}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                        </Tooltip>
                                                            </div>}
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'pull_down' ADD_FUKU */}
                                                  {/* user: type = 'carousel' ADD_FUKU */}
                                                  {
                                                    content.type === 'image' && (
                                                      <React.Fragment>
                                                        <div className="ss-user-setting__item-text_input-top">
                                                          <CheckboxCustom
                                                            label="ログイン済み時に表示しない"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                          />
                                                          <CheckboxCustom
                                                            label="エラー発生の時に表示しない"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                          />
                                                          {renderRootFaqOption()}
                                                          <CheckboxCustom
                                                            label="自動スクロールしない"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_not_auto_scroll')}
                                                            value={image.is_not_auto_scroll || false}
                                                          />
                                                          <CheckboxCustom
                                                            label="入力された内容を変数に保存する。"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                            value={image.is_save_input_content}
                                                          />
                                                          {image.is_save_input_content &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                <SelectCustom
                                                                  style={{ width: '100%', marginRight: '10px' }}
                                                                  id="title"
                                                                  value={image?.save_input_content}
                                                                  data={dataInputVar}
                                                                  keyValue="variable_name"
                                                                  nameValue="variable_name"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                                />
                                                                <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                              </div>
                                                            </div>
                                                          }
                                                          <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                            <CheckboxCustom
                                                              label="入力値の検証にAPIを利用する"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                              value={image.use_api_input_value}
                                                            />
                                                          </div>
                                                          {image.use_api_input_value &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <SelectCustom
                                                                style={{ width: '90%' }}
                                                                id="title"
                                                                value={image?.use_api_input_value}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                              />
                                                            </div>
                                                          }
                                                          <CheckboxCustom
                                                            label="「続行」ボタンを表示する"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'displayButtonNext')}
                                                            value={image.displayButtonNext}
                                                          />
                                                          {/*
                                                          Edit Width, Height
                                                           <div className='d-flex mt-2 mb-2'>
                                                            <div>
                                                              <label>幅</label>
                                                              <div>
                                                              <InputCustom
                                                              placeholder="プレースホルダ"
                                                              value={image.image_width}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'image_width')}
                                                            />
                                                              </div>
                                                            </div>
                                                            <div>
                                                              <label>標高ン</label>
                                                              <div>
                                                              <InputCustom
                                                              placeholder="プレースホルダ"
                                                              value={image.image_height}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'image_height')}
                                                            />
                                                              </div>
                                                            </div>
                                                          </div> */}
                                                          <div className="ss-user-setting__item-bottom">
                                                            <img src={image.imageURL} style={{ width: image.image_width, height: image.image_height }}></img>
                                                          </div>

                                                          <div className="ss-file-upload-wrapper" style={{ width: '90%' }}>
                                                            <Button style={{ margin: '0px', marginRight: '15px' }} className="ss-bot-file-reference-btn" onClick={() => {
                                                              setIsOpenFileReference(true);
                                                              setVarFileReference({ indexContent, contentType: 'image', subContentType: 'imageURL', childSubContentType: undefined, indexSubContent: undefined, img: undefined })
                                                            }}>
                                                              ファイル参照
                                                            </Button>
                                                            <input
                                                              type="file"
                                                              id="ss-carouse-file-upload"
                                                              name="carouse-file-upload"
                                                              hidden
                                                              onChange={(e) => getBaseUrl(e, indexContent)}
                                                            />
                                                            <Button style={{ margin: '0px' }} className="ss-bot-file-upload-btn" onClick={carouselUploadFile}>
                                                              追加
                                                            </Button>


                                                          </div>
                                                        </div>
                                                      </React.Fragment>

                                                    )
                                                  }
                                                  {content.type === 'carousel' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        <CheckboxCustom
                                                          label="入力された内容を変数に保存する。"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={carousel.is_save_input_content}
                                                          isOnChange={false}
                                                        />
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
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper" style={{marginBottom: '0px'}}>
                                                          <div>
                                                            <CheckboxCustom
                                                              label="短縮URLを利用する"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_shortened_urls')}
                                                              value={carousel.use_shortened_urls}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="必須"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={carousel.require}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div>
                                                          <CheckboxCustom
                                                            label="JavaScriptの利用"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_js')}
                                                            value={carousel.is_use_js}
                                                          />
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
                                                            allowClear={false}
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
                                                            placeholder="タイトル"
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
                                                                let arrCarousel = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
                                                                let idMax;
                                                                if (arrCarousel.length !== 0) {
                                                                  idMax = Math.max(...arrCarousel.map(item => item.id)) + 1;
                                                                } else {
                                                                  idMax = 1;
                                                                }
                                                                dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents.push({
                                                                  id: idMax,
                                                                  title: '',
                                                                  subtitle: '',
                                                                  urls: '',
                                                                  fileUrl: '',
                                                                  buttonTitle: ''
                                                                });
                                                                setDataMessages([...dataMessages]);
                                                              }}>追加</Button>
                                                            </div>
                                                          </div>
                                                          {carousel[carousel.type]?.contents.length > 1 &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div style={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                                                                <MDBIcon fas icon="times-circle" style={{ marginRight: '25px' }} onClick={() => {
                                                                  let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
                                                                  let startArr = arrMessage.slice(0, indexCarouselSlide);
                                                                  let lastArr = arrMessage.slice(indexCarouselSlide + 1, arrMessage.length);
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
                                                                      placeholder="タイトル"
                                                                      value={itemCarousel.title}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'title')}
                                                                    />
                                                                    <InputCustom
                                                                      className="ss-mg-top-5"
                                                                      placeholder="サブタイトル"
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
                                                                      placeholder="ファイルのURL"
                                                                      value={itemCarousel.fileUrl}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'fileUrl')}
                                                                    />
                                                                  </div>
                                                                </React.Fragment>
                                                              })}
                                                            </Carousel>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ marginTop: '20px' }}>
                                                            <span style={{ fontWeight: '400', width: '90%' }}>※JPEGまたはPNG/縦横比1.91:1の横向き画像または縦横比1:1の正方形画像</span>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-file-upload-wrapper" style={{ width: '90%' }}>
                                                              <Button style={{ margin: '0px', marginRight: '15px' }} className="ss-bot-file-reference-btn" onClick={() => {
                                                                setIsOpenFileReference(true)
                                                                setVarFileReference({ indexContent, contentType: content.type, subContentType: carousel.type, childSubContentType: 'contents', indexSubContent: indexCarouselSlide, img: 'fileUrl' })
                                                              }}>
                                                                ファイル参照
                                                              </Button>
                                                              <input
                                                                type="file"
                                                                id="ss-carouse-file-upload"
                                                                name="carouse-file-upload"
                                                                hidden
                                                                onChange={(e) => getBaseUrl(e, indexContent)}
                                                              />
                                                              <Button style={{ margin: '0px' }} className="ss-bot-file-upload-btn" onClick={carouselUploadFile}>
                                                                追加
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
                                                              placeholder="ボタンタイトル"
                                                              value={carousel[carousel.type].contents[indexCarouselSlide]?.buttonTitle}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarouselSlide, 'buttonTitle')}
                                                            />
                                                          </div>
                                                          {carousel.is_use_js &&
                                                            <>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}>
                                                                jscode
                                                              </div>
                                                              <div className="ss-user-setting__item-bottom">
                                                                <textarea
                                                                  style={{ width: '90%' }}
                                                                  className="ss-user-setting-item-textarea-label ss-input-value"
                                                                  placeholder="テキスト"
                                                                  rows="5"
                                                                  value={carousel.jscode}
                                                                  onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'jscode')}
                                                                />
                                                              </div>
                                                            </>
                                                          }


                                                        </React.Fragment>
                                                      )}
                                                    </>
                                                  )}
                                                  {/* user: type = 'credit_card_payment' */}
                                                  {content.type === 'credit_card_payment' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        <CheckboxCustom
                                                          label="入力された内容を変数に保存する。"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={creditCardPayment.is_save_input_content}
                                                        />
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
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <CheckboxCustom
                                                          label="必須"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                          value={creditCardPayment.require}
                                                        />
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="CVC非表示"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_cvc')}
                                                              value={creditCardPayment.is_hide_cvc}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="カード名非表示"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_card_name')}
                                                              value={creditCardPayment.is_hide_card_name}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required">
                                                            <CheckboxCustom
                                                              label="分割払い"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_installment')}
                                                              value={creditCardPayment.is_use_installment}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                          <div>
                                                            <CheckboxCustom
                                                              label="セパレート式"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_type')}
                                                              value={creditCardPayment.separate_type}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required" style={{ marginLeft: '95px' }}>
                                                            <CheckboxCustom
                                                              label="有効性チェックをする"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'validity_check')}
                                                              value={creditCardPayment.validity_check}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-text_input-use-api-required" style={{ width: '35%', marginLeft: '52px', display: 'flex', justifyContent: 'space-between' }}>
                                                            <span style={{ paddingTop: '3px' }}>有効期限</span>
                                                            <SelectCustom
                                                              style={{ width: '53%' }}
                                                              allowClear={false}
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
                                                            placeholder="タイトル"
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
                                                            label="カード番号"
                                                            inline={false}
                                                            placeholder="プレースホルダ"
                                                            value={creditCardPayment.card_number_placeholder}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder')}
                                                          />
                                                          {isUseFukushashiki &&
                                                            <>
                                                              <div className='ss-user-setting__item-row' style={{ width: '90%', display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ width: '20%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number_fukushashiki_search_mode', value)}
                                                                      data={[
                                                                        { key: 1, value: 'id' },
                                                                        { key: 2, value: 'css_selector' },
                                                                        { key: 3, value: 'xpath' }
                                                                      ]}
                                                                      keyValue="key"
                                                                      placeholder="複写先要素の取得方法をお選びください"
                                                                    />
                                                                  </div>
                                                                </Tooltip>
                                                                <Tooltip title={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_mode']
                                                                ] || ''} placement="top">
                                                                  <div style={{ flex: '80%' }}>
                                                                    <InputCustom
                                                                      styleLabel={{ width: '100%' }}
                                                                      style={{ width: '100%' }}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number_fukushashiki_search_value', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_value']}
                                                                      placeholder={{
                                                                        1: '複写先要素のIDを入力ください',
                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                        3: '複写先要素のxPathを入力ください',
                                                                      }[
                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_value']
                                                                      ] || ''}
                                                                    />
                                                                  </div>
                                                                </Tooltip>
                                                              </div>
                                                            </>}
                                                        </div> :
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>カード番号</div>
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              value={creditCardPayment.card_number_placeholder1}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder1')}
                                                            />
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              value={creditCardPayment.card_number_placeholder2}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder2')}
                                                            />
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              value={creditCardPayment.card_number_placeholder3}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder3')}
                                                            />
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              value={creditCardPayment.card_number_placeholder4}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder4')}
                                                            />
                                                          </div>
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          styleLabel={{ width: '90%' }}
                                                          label="カード名義"
                                                          inline={false}
                                                          placeholder="プレースホルダ"
                                                          value={creditCardPayment.card_holder_placeholder}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder')}
                                                        />
                                                        {isUseFukushashiki && <>
                                                          <div className='ss-user-setting__item-row' style={{ width: '90%', display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                              <div style={{ width: '20%' }}>
                                                                <SelectCustom
                                                                  id="title"
                                                                  style={{ width: '100%' }}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder_fukushashiki_search_mode', value)}
                                                                  data={[
                                                                    { key: 1, value: 'id' },
                                                                    { key: 2, value: 'css_selector' },
                                                                    { key: 3, value: 'xpath' }
                                                                  ]}
                                                                  keyValue="key"
                                                                  placeholder="複写先要素の取得方法をお選びください"
                                                                />
                                                              </div>
                                                            </Tooltip>
                                                            <Tooltip title={{
                                                              1: '複写先要素のIDを入力ください',
                                                              2: '複写先要素のcss_selectorを入力ください',
                                                              3: '複写先要素のxPathを入力ください',
                                                            }[
                                                              dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_mode']
                                                            ] || ''} placement="top">
                                                              <div style={{ flex: '80%' }}>
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  style={{ width: '100%' }}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_value']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </Tooltip>
                                                          </div> </>}
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%' }}>有効期限</div>
                                                        <div style={{ width: '90%' }}>
                                                          <SelectCustom
                                                            placeholder="年"
                                                            style={{ width: '100%' }}
                                                            value={creditCardPayment.year_placeholder}
                                                            data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'year_placeholder')}
                                                          />
                                                          {isUseFukushashiki &&
                                                            <>
                                                              <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ width: '20%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'year_fukushashiki_search_mode', value)}
                                                                      data={[
                                                                        { key: 1, value: 'id' },
                                                                        { key: 2, value: 'css_selector' },
                                                                        { key: 3, value: 'xpath' }
                                                                      ]}
                                                                      keyValue="key"
                                                                      placeholder="複写先要素の取得方法をお選びください"
                                                                    />
                                                                  </div>
                                                                </Tooltip>
                                                                <Tooltip title={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_mode']
                                                                ] || ''} placement="top">
                                                                  <div style={{ flex: '80%' }}>
                                                                    <InputCustom
                                                                      styleLabel={{ width: '100%' }}
                                                                      style={{ width: '100%' }}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'year_fukushashiki_search_value', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_value']}
                                                                      placeholder={{
                                                                        1: '複写先要素のIDを入力ください',
                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                        3: '複写先要素のxPathを入力ください',
                                                                      }[
                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_value']
                                                                      ] || ''}
                                                                    />
                                                                  </div>
                                                                </Tooltip>
                                                              </div>
                                                            </>
                                                          }
                                                        </div>
                                                        <div style={{ width: '90%', marginTop: '10px' }}>
                                                          <SelectCustom
                                                            placeholder="月"
                                                            style={{ width: '100%' }}
                                                            value={creditCardPayment.month_placeholder}
                                                            data={dataMonthFixed}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'month_placeholder')}
                                                          />
                                                          {isUseFukushashiki &&
                                                            <>
                                                              <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ width: '20%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'month_fukushashiki_search_mode', value)}
                                                                      data={[
                                                                        { key: 1, value: 'id' },
                                                                        { key: 2, value: 'css_selector' },
                                                                        { key: 3, value: 'xpath' }
                                                                      ]}
                                                                      keyValue="key"
                                                                      placeholder="複写先要素の取得方法をお選びください"
                                                                    />
                                                                  </div>
                                                                </Tooltip>
                                                                <Tooltip title={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_mode']
                                                                ] || ''} placement="top">
                                                                  <div style={{ flex: '80%' }}>
                                                                    <InputCustom
                                                                      styleLabel={{ width: '100%' }}
                                                                      style={{ width: '100%' }}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'month_fukushashiki_search_value', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_value']}
                                                                      placeholder={{
                                                                        1: '複写先要素のIDを入力ください',
                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                        3: '複写先要素のxPathを入力ください',
                                                                      }[
                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_value']
                                                                      ] || ''}
                                                                    />
                                                                  </div>
                                                                </Tooltip>
                                                              </div>
                                                            </>
                                                          }
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          styleLabel={{ width: '90%' }}
                                                          label="CVC非表示"
                                                          inline={false}
                                                          placeholder="プレースホルダ"
                                                          value={creditCardPayment.cvc_placeholder}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'cvc_placeholder')}
                                                        />
                                                        {isUseFukushashiki &&
                                                          <>
                                                            <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div style={{ width: '20%' }}>
                                                                  <SelectCustom
                                                                    id="title"
                                                                    style={{ width: '100%' }}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'cvc_fukushashiki_search_mode', value)}
                                                                    data={[
                                                                      { key: 1, value: 'id' },
                                                                      { key: 2, value: 'css_selector' },
                                                                      { key: 3, value: 'xpath' }
                                                                    ]}
                                                                    keyValue="key"
                                                                    placeholder="複写先要素の取得方法をお選びください"
                                                                  />
                                                                </div>
                                                              </Tooltip>
                                                              <Tooltip title={{
                                                                1: '複写先要素のIDを入力ください',
                                                                2: '複写先要素のcss_selectorを入力ください',
                                                                3: '複写先要素のxPathを入力ください',
                                                              }[
                                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_mode']
                                                              ] || ''} placement="top">
                                                                <div style={{ flex: '80%' }}>
                                                                  <InputCustom
                                                                    styleLabel={{ width: '100%' }}
                                                                    style={{ width: '100%' }}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'cvc_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_value']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </Tooltip>
                                                            </div>
                                                          </>
                                                        }
                                                      </div>
                                                      {
                                                        creditCardPayment.is_use_installment && (
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              styleLabel={{ width: '90%' }}
                                                              label="お支払い回数"
                                                              inline={false}
                                                              placeholder="プレースホルダ"
                                                              data={installmentOptions}
                                                              value={creditCardPayment.installment_placeholder}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'installment_placeholder')}
                                                            />
                                                            {isUseFukushashiki &&
                                                              <>
                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                    <div style={{ width: '20%' }}>
                                                                      <SelectCustom
                                                                        id="title"
                                                                        style={{ width: '100%' }}
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_mode']}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'installment_fukushashiki_search_mode', value)}
                                                                        data={[
                                                                          { key: 1, value: 'id' },
                                                                          { key: 2, value: 'css_selector' },
                                                                          { key: 3, value: 'xpath' }
                                                                        ]}
                                                                        keyValue="key"
                                                                        placeholder="複写先要素の取得方法をお選びください"
                                                                      />
                                                                    </div>
                                                                  </Tooltip>
                                                                  <Tooltip title={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_mode']
                                                                  ] || ''} placement="top">
                                                                    <div style={{ flex: '80%' }}>
                                                                      <InputCustom
                                                                        styleLabel={{ width: '100%' }}
                                                                        style={{ width: '100%' }}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'installment_fukushashiki_search_value', value)}
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_value']}
                                                                        placeholder={{
                                                                          1: '複写先要素のIDを入力ください',
                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                          3: '複写先要素のxPathを入力ください',
                                                                        }[
                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_value']
                                                                        ] || ''}
                                                                      />
                                                                    </div>
                                                                  </Tooltip>
                                                                </div>
                                                              </>
                                                            }
                                                          </div>
                                                        )
                                                      }
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
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={capture.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between' }}>
                                                          <div style={{ width: '32%' }}>
                                                            <div>タイプ</div>
                                                            <SelectCustom
                                                              placeholder="type"
                                                              style={{ width: '100%' }}
                                                              value={capture.type}
                                                              data={[
                                                                { key: '0123456789', value: '数字' }, { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', value: '英数字' }, { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', value: 'アルファベットのみ' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            />
                                                          </div>
                                                          <div style={{ width: '32%' }}>
                                                            <div>長さ</div>
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
                                                            <div>色</div>
                                                            <SelectCustom
                                                              placeholder="色"
                                                              style={{ width: '100%' }}
                                                              value={capture.colour}
                                                              data={[{ key: true, value: 'あり' }, { key: false, value: '無し' }]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'colour')}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%' }}>
                                                          <img style={{ width: '35%' }} src={`https://svg-captcha-nodejs.vercel.app/captchapreview?size=${capture.length}${capture.colour ? "&color=true" : ""}&charPreset=${capture.type}`} />
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
                                                            label="必須"
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
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={productPurchase.type}
                                                            data={[
                                                              { key: 'text_with_thumbnail_image', value: 'サムネイル画像付きテキスト' },
                                                              { key: 'text_with_image', value: '画像付きテキスト' },
                                                              { key: 'consume_api_respone', value: 'API応答を利用する' }
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
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={productPurchase.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <Row style={{ width: '90%' }}>
                                                          <Col xl={4} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="数量指定"
                                                              value={productPurchase.quantity_designation_all}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'quantity_designation_all')}
                                                            />
                                                          </Col>
                                                          <Col xl={5} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="商品番号表示"
                                                              value={productPurchase.product_number_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_number_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={3} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="値段表示"
                                                              value={productPurchase.price_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'price_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={4} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="商品名表示"
                                                              value={productPurchase.product_name_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_name_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={5} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="複数商品購入"
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
                                                                                  <div
                                                                                      className="ss-user-setting-product-purchase-container"
                                                                                      style={array.length > 1 ? {marginBottom: '10px'} : {}}>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-file-img">
                                                                                      <InputCustom
                                                                                          className="ss-mg-bottom-5"
                                                                                          value={itemProduct.img_url}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'img_url')}
                                                                                      />
                                                                                      <MDBIcon
                                                                                          className="ss-mg-bottom-5" fas
                                                                                          icon="folder-open"
                                                                                          onClick={() => {
                                                                                            setIsOpenFileReference(true)
                                                                                            setVarFileReference({
                                                                                              indexContent,
                                                                                              contentType: content.type,
                                                                                              subContentType: 'products',
                                                                                              indexSubContent: indexProduct,
                                                                                              img: 'img_url'
                                                                                            })
                                                                                          }}
                                                                                      />
                                                                                    </div>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-infor-product">
                                                                                      <InputCustom
                                                                                          placeholder="タイトル"
                                                                                          style={{
                                                                                            borderTopRightRadius: '0px',
                                                                                            borderBottomRightRadius: '0px'
                                                                                          }}
                                                                                          className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left"
                                                                                          value={itemProduct.title}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'title')}
                                                                                      />
                                                                                      <InputCustom
                                                                                          placeholder="商品番号"
                                                                                          style={{
                                                                                            borderTopLeftRadius: '0px',
                                                                                            borderBottomLeftRadius: '0px',
                                                                                            borderTopRightRadius: '0px',
                                                                                            borderBottomRightRadius: '0px',
                                                                                            borderLeft: '0px',
                                                                                            borderRight: '0px'
                                                                                          }}
                                                                                          className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle"
                                                                                          value={itemProduct.item_number}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_number')}
                                                                                      />
                                                                                      <InputNum
                                                                                          placeholder="値段"
                                                                                          className="ss-mg-bottom-5 ss-user-setting-input-limit-character"
                                                                                          style={{
                                                                                            borderTopLeftRadius: '0px',
                                                                                            borderBottomLeftRadius: '0px',
                                                                                            marginLeft: '0px',
                                                                                            width: '78%'
                                                                                          }}
                                                                                          value={itemProduct.item_price}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_price')}
                                                                                      />
                                                                                    </div>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-sub-infor">
                                                                                      <div style={{width: '50%'}}>
                                                                                        <InputNum
                                                                                            className="ss-user-setting-input-limit-character ss-mg-bottom-5"
                                                                                            style={{
                                                                                              marginLeft: '0px',
                                                                                              width: '50%'
                                                                                            }}
                                                                                            label="数量の上限"
                                                                                            value={itemProduct.quantity_limit}
                                                                                            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'quantity_limit')}
                                                                                        />
                                                                                      </div>
                                                                                      {productPurchase.price_display &&
                                                                                          <div style={{width: '50%'}}>
                                                                                            <InputCustom
                                                                                                className="ss-mg-bottom-5"
                                                                                                label="値段表示内容（カスタマイズ）"
                                                                                                value={itemProduct.price_display_custom}
                                                                                                onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')}
                                                                                            />
                                                                                          </div>
                                                                                      }
                                                                                    </div>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-sub-infor">
                                                                                      <div style={{width: '50%'}}>
                                                                                        <CheckboxCustom
                                                                                            label="初期選択設定"
                                                                                            value={productPurchase.initial_selection.includes(itemProduct.id)}
                                                                                            onChange={() => {
                                                                                              let selectArr = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection];
                                                                                              if (productPurchase.multiple_item_purchase) {
                                                                                                if (selectArr.includes(itemProduct.id)) {
                                                                                                  selectArr = [...selectArr.filter(item => item !== itemProduct.id)];
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
                                                                                          <div style={{width: '50%'}}>
                                                                                            <CheckboxCustom
                                                                                                label="数量指定"
                                                                                                value={itemProduct.is_quantity_designation}
                                                                                                onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'is_quantity_designation')}
                                                                                            />
                                                                                          </div>
                                                                                      }
                                                                                    </div>
                                                                                    {array.length > 1 &&
                                                                                        <div
                                                                                            className="ss-user-setting-product-purchase-times-icons">
                                                                                          <MDBIcon fas
                                                                                                   icon="times-circle"
                                                                                                   onClick={() => {
                                                                                                     let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
                                                                                                     let startArr = arrMessage.slice(0, indexProduct);
                                                                                                     let lastArr = arrMessage.slice(indexProduct + 1, arrMessage.length);
                                                                                                     dataMessages[indexMessageSelect].message_content[indexContent][content.type].products = [...startArr, ...lastArr];
                                                                                                     dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection.filter(item => item !== itemProduct.id);
                                                                                                     setDataMessages([...dataMessages]);
                                                                                                   }}/>
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
                                                            <div style={{width: '90%'}}>
                                                              <Button
                                                                  style={{
                                                                    margin: '0px',
                                                                    backgroundColor: '#327AED',
                                                                    textTransform: 'lowercase'
                                                                  }}
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
                                                                追加
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
                                                            label="必須"
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
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={productPurchaseRadioButton.type}
                                                            data={[
                                                              { key: 'text_with_thumbnail_image', value: 'サムネイル画像付きテキスト' },
                                                              { key: 'text_with_image', value: '画像付きテキスト' },
                                                              { key: 'consume_api_respone', value: 'API応答を利用する' }
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
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={productPurchaseRadioButton.title}
                                                          />
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom">
                                                        <Row style={{ width: '90%' }}>
                                                          <Col xl={4} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="商品名表示"
                                                              value={productPurchaseRadioButton.product_name_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_name_display')}
                                                            />
                                                          </Col>
                                                          <Col xl={5} style={{ display: "flex", justifyContent: 'flex-start' }}>
                                                            <CheckboxCustom
                                                              label="商品番号表示"
                                                              value={productPurchaseRadioButton.product_number_display}
                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'product_number_display')}
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
                                                                                  <div
                                                                                      className="ss-user-setting-product-purchase-container"
                                                                                      style={array.length > 1 ? {marginBottom: '10px'} : {}}>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-file-img">
                                                                                      <InputCustom
                                                                                          className="ss-mg-bottom-5"
                                                                                          value={itemProduct.img_url}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'img_url')}
                                                                                      />
                                                                                      <MDBIcon
                                                                                          className="ss-mg-bottom-5" fas
                                                                                          icon="folder-open"
                                                                                          onClick={() => {
                                                                                            setIsOpenFileReference(true)
                                                                                            setVarFileReference({
                                                                                              indexContent,
                                                                                              contentType: content.type,
                                                                                              subContentType: 'products',
                                                                                              indexSubContent: indexProduct,
                                                                                              img: 'img_url'
                                                                                            })
                                                                                          }}
                                                                                      />
                                                                                    </div>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-infor-product">
                                                                                      <InputCustom
                                                                                          placeholder="タイトル"
                                                                                          style={{
                                                                                            borderTopRightRadius: '0px',
                                                                                            borderBottomRightRadius: '0px'
                                                                                          }}
                                                                                          className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left"
                                                                                          value={itemProduct.title}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'title')}
                                                                                      />
                                                                                      <InputCustom
                                                                                          placeholder="商品番号"
                                                                                          style={{
                                                                                            borderTopLeftRadius: '0px',
                                                                                            borderBottomLeftRadius: '0px',
                                                                                            borderTopRightRadius: '0px',
                                                                                            borderBottomRightRadius: '0px',
                                                                                            borderLeft: '0px',
                                                                                            borderRight: '0px'
                                                                                          }}
                                                                                          className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle"
                                                                                          value={itemProduct.item_number}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_number')}
                                                                                      />
                                                                                      <InputNum
                                                                                          placeholder="値段"
                                                                                          className="ss-mg-bottom-5 ss-user-setting-input-limit-character"
                                                                                          style={{
                                                                                            borderTopLeftRadius: '0px',
                                                                                            borderBottomLeftRadius: '0px',
                                                                                            marginLeft: '0px',
                                                                                            width: '78%'
                                                                                          }}
                                                                                          value={itemProduct.item_price}
                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'item_price')}
                                                                                      />
                                                                                    </div>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-sub-infor">
                                                                                    </div>
                                                                                    <div
                                                                                        className="ss-user-setting-product-purchase-file-img">
                                                                                      <ShopifyReferenceSelect
                                                                                          placeholder="バリアントID"
                                                                                          listProductVariants={listProductVariants}
                                                                                          value={itemProduct.productVariantId}
                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect,
                                                                                              indexContent,
                                                                                              content.type,
                                                                                              value,
                                                                                              "products",
                                                                                              indexProduct,
                                                                                              "productVariantId")}
                                                                                      />
                                                                                      <div className="ss-mg-bottom-5 ss-shopify-icon" style={{
                                                                                        cursor: "default"
                                                                                      }}>
                                                                                        <img src={shopifIcon} alt=""/>
                                                                                      </div>
                                                                                      {/*<InputCustom*/}
                                                                                      {/*    className="ss-mg-bottom-5"*/}
                                                                                      {/*    placeholder="バリアントID"*/}
                                                                                      {/*    value={itemProduct.displayName}*/}
                                                                                      {/*    readOnly={true}*/}
                                                                                      {/*/>*/}
                                                                                      {/*<div className="ss-mg-bottom-5 ss-shopify-icon"*/}
                                                                                      {/*     onClick={() => {*/}
                                                                                      {/*       setIsOpenShopifyReference(true)*/}
                                                                                      {/*       setVarShopifyReference({*/}
                                                                                      {/*         indexContent,*/}
                                                                                      {/*         contentType: content.type,*/}
                                                                                      {/*         subContentType: 'products',*/}
                                                                                      {/*         indexSubContent: indexProduct,*/}
                                                                                      {/*         productVariantId: 'productVariantId',*/}
                                                                                      {/*         displayName: 'displayName'*/}
                                                                                      {/*       })*/}
                                                                                      {/*     }}>*/}
                                                                                      {/*  <img src={shopifIcon} alt=""/>*/}
                                                                                      {/*</div>*/}
                                                                                      {/*<MDBIcon*/}
                                                                                      {/*    className="ss-mg-bottom-5" fas*/}
                                                                                      {/*    icon="folder-open"*/}
                                                                                      {/*    onClick={() => {*/}
                                                                                      {/*      setIsOpenFileReference(true)*/}
                                                                                      {/*      setVarFileReference({*/}
                                                                                      {/*        indexContent,*/}
                                                                                      {/*        contentType: content.type,*/}
                                                                                      {/*        subContentType: 'products',*/}
                                                                                      {/*        indexSubContent: indexProduct,*/}
                                                                                      {/*        img: 'img_url'*/}
                                                                                      {/*      })*/}
                                                                                      {/*    }}*/}
                                                                                      {/*/>*/}
                                                                                    </div>
                                                                                    {array.length > 1 &&
                                                                                        <div
                                                                                            className="ss-user-setting-product-purchase-times-icons">
                                                                                          <MDBIcon fas
                                                                                                   icon="times-circle"
                                                                                                   onClick={() => {
                                                                                                     let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
                                                                                                     let startArr = arrMessage.slice(0, indexProduct);
                                                                                                     let lastArr = arrMessage.slice(indexProduct + 1, arrMessage.length);
                                                                                                     dataMessages[indexMessageSelect].message_content[indexContent][content.type].products = [...startArr, ...lastArr];
                                                                                                     dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection.filter(item => item !== itemProduct.id);
                                                                                                     setDataMessages([...dataMessages]);
                                                                                                   }}/>
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
                                                            <div style={{width: '90%'}}>
                                                              <Button
                                                                  style={{
                                                                    margin: '0px',
                                                                    backgroundColor: '#327AED',
                                                                    textTransform: 'lowercase'
                                                                  }}
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
                                                                追加
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </>
                                                  )}
                                                  {/* user: type = 'product_purchase_select_option' */}
                                                  {content.type === 'product_purchase_select_option' && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-text_input-top">
                                                            <CheckboxCustom
                                                                label="必須"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                                value={productPurchaseSelectOption.require}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div
                                                                className="ss-user-setting__item-bottom">
                                                              <SelectCustom
                                                                  id="title"
                                                                  value={productPurchaseSelectOption?.title_require}
                                                                  data={dropDownTitle}
                                                                  placeholder="タイトル"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                              />
                                                            </div>
                                                          </div>
                                                          {productPurchaseSelectOption.title_require === true &&
                                                              <div className="ss-user-setting__item-bottom">
                                                                <InputCustom
                                                                    placeholder="タイトル"
                                                                    value={productPurchaseSelectOption.title}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                                />
                                                              </div>
                                                          }
                                                          {/* pull_down: type = text_with_thumbnail_image */}
                                                          {productPurchaseSelectOption.type === 'text_with_thumbnail_image' &&
                                                              <React.Fragment>
                                                                <div className="ss-user-setting__item-bottom">
                                                                  <div style={{ backgroundColor: '#F8F9FA', width: '90%', padding: '5px' }} >
                                                                    <InputCustom
                                                                        label="デフォルトオプション"
                                                                        style={{ width: '60%', marginBottom: '10px', marginLeft: '10px' }}
                                                                        placeholder="コメント"
                                                                        value={productPurchaseSelectOption?.display_unselected}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'display_unselected')}
                                                                    />
                                                                    <DragDropContext onDragEnd={result => handleDragEndProduct(result, content.id, content.type, 'products')}>
                                                                      <Droppable droppableId='customize-pull-down'>

                                                                        {(providedChild) => {
                                                                          let arrOptions = productPurchaseSelectOption?.products;
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
                                                                                                  <div style={{
                                                                                                    marginBottom: '10px',
                                                                                                    width: '100%',
                                                                                                    backgroundColor: '#F8F9FA',
                                                                                                    padding: '5px',
                                                                                                  }}>
                                                                                                    {/*<MDBIcon fas*/}
                                                                                                    {/*         icon="grip-horizontal"/>*/}
                                                                                                    <div
                                                                                                        className="ss-user-setting-product-purchase-file-img">
                                                                                                      <InputCustom
                                                                                                          className="ss-mg-bottom-5"
                                                                                                          value={itemPullDown.img_url}
                                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexPullDown, 'img_url')}
                                                                                                      />
                                                                                                      <MDBIcon
                                                                                                          className="ss-mg-bottom-5"
                                                                                                          fas
                                                                                                          icon="folder-open"
                                                                                                          onClick={() => {
                                                                                                            setIsOpenFileReference(true)
                                                                                                            setVarFileReference({
                                                                                                              indexContent,
                                                                                                              contentType: content.type,
                                                                                                              subContentType: 'products',
                                                                                                              indexSubContent: indexPullDown,
                                                                                                              img: 'img_url'
                                                                                                            })
                                                                                                          }}
                                                                                                      />
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="ss-user-setting-product-purchase-infor-product">
                                                                                                      <InputCustom
                                                                                                          placeholder="タイトル"
                                                                                                          style={{
                                                                                                            borderTopRightRadius: '0px',
                                                                                                            borderBottomRightRadius: '0px'
                                                                                                          }}
                                                                                                          className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left"
                                                                                                          value={itemPullDown.title}
                                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexPullDown, 'title')}
                                                                                                      />
                                                                                                      <InputCustom
                                                                                                          placeholder="商品番号"
                                                                                                          style={{
                                                                                                            borderTopLeftRadius: '0px',
                                                                                                            borderBottomLeftRadius: '0px',
                                                                                                            borderTopRightRadius: '0px',
                                                                                                            borderBottomRightRadius: '0px',
                                                                                                            borderLeft: '0px',
                                                                                                            borderRight: '0px'
                                                                                                          }}
                                                                                                          className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle"
                                                                                                          value={itemPullDown.item_number}
                                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexPullDown, 'item_number')}
                                                                                                      />
                                                                                                      <InputNum
                                                                                                          placeholder="値段"
                                                                                                          className="ss-mg-bottom-5 ss-user-setting-input-limit-character"
                                                                                                          style={{
                                                                                                            borderTopLeftRadius: '0px',
                                                                                                            borderBottomLeftRadius: '0px',
                                                                                                            marginLeft: '0px',
                                                                                                            width: '78%'
                                                                                                          }}
                                                                                                          value={itemPullDown.item_price}
                                                                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexPullDown, 'item_price')}
                                                                                                      />
                                                                                                    </div>
                                                                                                    <div className="ss-user-setting-product-purchase-file-img">
                                                                                                      <ShopifyReferenceSelect
                                                                                                          placeholder="バリアントID"
                                                                                                          listProductVariants={listProductVariants}
                                                                                                          value={itemPullDown.productVariantId}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect,
                                                                                                              indexContent,
                                                                                                              content.type,
                                                                                                              value,
                                                                                                              "products",
                                                                                                              indexPullDown,
                                                                                                              "productVariantId")}
                                                                                                      />
                                                                                                      <div className="ss-mg-bottom-5 ss-shopify-icon" style={{
                                                                                                        cursor: "default"
                                                                                                      }}>
                                                                                                        <img src={shopifIcon} alt=""/>
                                                                                                      </div>
                                                                                                    </div>

                                                                                                    {array.length >= 2 &&
                                                                                                        <MDBIcon
                                                                                                            fas
                                                                                                            style={{fontSize: '25px'}}
                                                                                                            icon="times-circle"
                                                                                                            onClick={() => handleRemoveItemProductPullDown(indexMessageSelect, indexContent, content.type, productPurchaseSelectOption.type, indexPullDown)}
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
                                                                    <div className="ss-user-setting__item-bottom"
                                                                         style={{
                                                                           display: 'flex',
                                                                           justifyContent: 'flex-end'
                                                                         }}>
                                                                      <MDBIcon
                                                                          fas
                                                                          icon="plus-circle"
                                                                          className="ss-plus-circle-option-icon"
                                                                          onClick={() => handleAddItemProductPullDown(indexMessageSelect, indexContent, content.type, productPurchaseSelectOption.type)}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </React.Fragment>
                                                          }
                                                        </React.Fragment>
                                                  )}
                                                  {/* user: type = 'sms_verify' */}
                                                  {content.type === 'sms_verify' && (
                                                      <React.Fragment>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div
                                                              className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                                id="title"
                                                                style={{width: '49%'}}
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
                                                                  placeholder="タイトル"
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
                                                          <div
                                                              className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                                style={{width: '49%'}}
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
                                                          placeholder="テキスト"
                                                          rows="5"
                                                          value={afteePaymentModule.content}
                                                          onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'content')}
                                                        />
                                                      </div>
                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'slider' ADD_FUKU */}
                                                  {content.type === 'slider' && (
                                                    <React.Fragment>
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                                                        <div style={{ width: '90%' }}>
                                                          <CheckboxCustom
                                                            label="ログイン済み時に表示しない"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                          />
                                                          <CheckboxCustom
                                                            label="エラー発生の時に表示しない"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                          />
                                                          {renderRootFaqOption()}
                                                          <CheckboxCustom
                                                            label="入力された内容を変数に保存する。"
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
                                                            <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                          </div>
                                                        </div>
                                                      }
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px' }}>
                                                        <div style={{ width: '90%' }}>
                                                          <CheckboxCustom
                                                            label="必須"
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
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={slider.type}
                                                            data={[
                                                              { key: 'continuous_type', value: '連続タイプ' },
                                                              { key: 'discrete_type', value: '離散タイプ' }
                                                            ]}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* slider: withTitle = true */}
                                                      {slider?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={slider.title}
                                                          />
                                                        </div>
                                                      }
                                                      {slider.type === 'discrete_type' &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                                                            <SelectCustom
                                                              label="最小値"
                                                              style={{ width: '15%', marginRight: '10px' }}
                                                              value={slider.min_value}
                                                              data={[
                                                                { key: '0', value: '0' },
                                                                { key: '1', value: '1' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'min_value')}
                                                            />
                                                            <SelectCustom
                                                              label="最大値のラベル"
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
                                                            label="最小値のラベル"
                                                            placeholder=""
                                                            style={{ width: '82%', borderColor: slider.min_label ? 'gray' : 'red' }}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'min_label')}
                                                            value={slider.min_label}
                                                          />
                                                        </div>
                                                        {!slider.min_label &&
                                                          <div style={{ width: '90%', color: '#b94a48', marginLeft: '21%' }}>必ず指定ください。</div>
                                                        }
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                          <InputCustom
                                                            label="最大値のラベル"
                                                            style={{ width: '82%', borderColor: slider.max_label ? 'gray' : 'red' }}
                                                            placeholder=""
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'max_label')}
                                                            value={slider.max_label}
                                                          />
                                                        </div>
                                                        {!slider.max_label &&
                                                          <div style={{ width: '90%', color: '#b94a48', marginLeft: '21%' }}>必ず指定ください。</div>
                                                        }
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div style={{ width: '90%', display: 'flex', alignItems: 'center' }}>
                                                          <InputCustom
                                                            label="カラー"
                                                            style={{ width: '30%', marginLeft: '12%', borderColor: slider.color && (isColor(slider.color) ? 'gray' : 'red') }}
                                                            placeholder="#2c75f0"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'color')}
                                                            value={slider.color}
                                                          />
                                                          <div style={{ width: '95px', height: '36px', backgroundColor: slider.color || '#2C75F0', marginLeft: '13px' }}></div>
                                                        </div>
                                                        {(slider.color && !isColor(slider.color)) &&
                                                          <div style={{ width: '90%', color: '#b94a48', marginLeft: '21%' }}>カラーには、有効な正規表現を指定してください。</div>
                                                        }
                                                      </div>
                                                      {isUseFukushashiki && <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginLeft: '35px',width:'90%' }}>
                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                          <div style={{ width: '25%' }}>
                                                            <SelectCustom
                                                              id="title"
                                                              style={{ width: '100%' }}
                                                              value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_mode', value)}
                                                              data={[
                                                                { key: 1, value: 'id' },
                                                                { key: 2, value: 'css_selector' },
                                                                { key: 3, value: 'xpath' }
                                                              ]}
                                                              keyValue="key"
                                                              placeholder="複写先要素の取得方法をお選びください"
                                                            />
                                                          </div>
                                                        </Tooltip>
                                                        <Tooltip title={{
                                                          1: '複写先要素のIDを入力ください',
                                                          2: '複写先要素のcss_selectorを入力ください',
                                                          3: '複写先要素のxPathを入力ください',
                                                        }[
                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']
                                                        ] || ''} placement="top">
                                                          <div style={{ flex: '75%' }}>
                                                            <InputCustom
                                                              styleLabel={{ width: '100%' }}
                                                              style={{ width: '100%' }}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_value', value)}
                                                              value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_value']}
                                                              placeholder={{
                                                                1: '複写先要素のIDを入力ください',
                                                                2: '複写先要素のcss_selectorを入力ください',
                                                                3: '複写先要素のxPathを入力ください',
                                                              }[
                                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']
                                                              ] || ''}
                                                            />
                                                          </div>
                                                        </Tooltip>
                                                      </div>}

                                                    </React.Fragment>
                                                  )}
                                                  {/* user: type = 'card_payment_radio_button' ADD_FUKU */}
                                                  {content.type === 'card_payment_radio_button' && (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="ログイン済み時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                        />
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        {renderRootFaqOption()}
                                                        <CheckboxCustom
                                                          label="入力された内容を変数に保存する。"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={cardPaymentRadioButton.is_save_input_content}
                                                        />
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
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '95%' }}>
                                                            <span>カード決済連動設定</span>
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>
                                                            <CheckboxCustom
                                                              label="必須"
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
                                                              allowClear={false}
                                                              data={[
                                                                { key: 'default', value: 'デフォルト' },
                                                                { key: 'customized_style', value: 'カスタマイズスタイル（四角い枠）' },
                                                                { key: 'picture_radio', value: '画像ラジオ' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            />
                                                          </div>
                                                        </div>
                                                        <PaymentDisplayStyleSection
                                                          cardPaymentRadioButton={cardPaymentRadioButton}
                                                          onChange={(value, field) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field)}
                                                        />
                                                        {/* cardPaymentRadioButton: withTitle = true */}
                                                        {cardPaymentRadioButton?.title_require === true &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="タイトル"
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
                                                                    {isUseFukushashiki && (
                                                                      <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                          <div style={{ flexBasis: '23%', maxWidth: '23%' }}>
                                                                            <SelectCustom
                                                                              id="title"
                                                                              style={{ width: '100%' }}
                                                                              value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']}
                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_mode', value)}
                                                                              data={[
                                                                                { key: 1, value: 'id' },
                                                                                { key: 2, value: 'css_selector' },
                                                                                { key: 3, value: 'xpath' }
                                                                              ]}
                                                                              keyValue="key"
                                                                              placeholder="複写先要素の取得方法をお選びください"
                                                                            />
                                                                          </div>
                                                                        </Tooltip>
                                                                        <div style={{ flexBasis: '75%', maxWidth: '75%' }}>
                                                                          <InputCustom
                                                                            styleLabel={{ width: '100%' }}
                                                                            maxLength={250}
                                                                            useFukushashiki={true}
                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_value', value)}
                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_value']}
                                                                            placeholder={{
                                                                              1: '複写先要素のIDを入力ください',
                                                                              2: '複写先要素のcss_selectorを入力ください',
                                                                              3: '複写先要素のxPathを入力ください',
                                                                            }[
                                                                              dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']
                                                                            ] || ''}
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                    )}
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
                                                                                        placeholder={["テキスト", "値"]}
                                                                                        valueLeft={itemPaymentRadio.text}
                                                                                        valueRight={itemPaymentRadio.value}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents', indexPaymentRadio, name === 'left' ? 'text' : 'value')}
                                                                                      />
                                                                                    </div>
                                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '10px', paddingLeft: '28px' }}>
                                                                                      {PAYMENT_OPTION_IMAGE_FIELDS.map(({ key, label }) => (
                                                                                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                                          <span style={{ fontSize: '12px' }}>{label}</span>
                                                                                          {itemPaymentRadio[key] && (
                                                                                            <img src={itemPaymentRadio[key]} alt={label} style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #ddd' }} />
                                                                                          )}
                                                                                          <input
                                                                                            type="file"
                                                                                            accept="image/png,image/jpeg,image/jpg"
                                                                                            onChange={(e) => {
                                                                                              const file = e.target.files[0];
                                                                                              e.target.value = null;
                                                                                              if (!file) return;
                                                                                              const reader = new FileReader();
                                                                                              reader.onloadend = () => {
                                                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, reader.result, 'radio_contents', indexPaymentRadio, key);
                                                                                              };
                                                                                              reader.readAsDataURL(file);
                                                                                            }}
                                                                                          />
                                                                                        </div>
                                                                                      ))}
                                                                                    </div>
                                                                                    <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                                      <CheckboxCustom
                                                                                        label="初期選択設定"
                                                                                        value={cardPaymentRadioButton.initial_selection === itemPaymentRadio.value}
                                                                                        onChange={() => {
                                                                                          if (cardPaymentRadioButton.initial_selection !== itemPaymentRadio.value) {
                                                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'initial_selection');
                                                                                          } else {
                                                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                          }
                                                                                        }}
                                                                                      />
                                                                                      <CheckboxCustom
                                                                                        label="説明HTML"
                                                                                        onChange={(value) => {
                                                                                          itemPaymentRadio.isUsedHTMLDescription = value;
                                                                                          setDataMessages([...dataMessages]);
                                                                                        }}
                                                                                        value={itemPaymentRadio.isUsedHTMLDescription}
                                                                                      />
                                                                                      <CheckboxCustom
                                                                                        label="カード決済連動設定"
                                                                                        value={cardPaymentRadioButton.card_linked_setting.includes(itemPaymentRadio.value)}
                                                                                        onChange={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'card_linked_setting')}
                                                                                      />
                                                                                    </div>
                                                                                    {renderPaymentMethodDescriptionInput({ selectedItem: itemPaymentRadio, dataMessages })}
                                                                                    {array.length > 1 &&
                                                                                      <div className="ss-user-setting-payment-radio-times-icons">
                                                                                        <MDBIcon fas icon="times-circle"
                                                                                          onClick={() => {
                                                                                            let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                                            let startArr = arrMessage.slice(0, indexPaymentRadio);
                                                                                            let lastArr = arrMessage.slice(indexPaymentRadio + 1, arrMessage.length);
                                                                                            dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents = [...startArr, ...lastArr];
                                                                                            setDataMessages([...dataMessages]);
                                                                                          }} />
                                                                                      </div>
                                                                                    }
                                                                                    {cardPaymentRadioButton.card_linked_setting.includes(itemPaymentRadio.value) && (
                                                                                      <>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '95%', height: '1px', backgroundColor: 'black' }}></div>
                                                                                        </div>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '95%' }}>
                                                                                            <span>カード決済連動設定</span>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '90%', display: 'flex' }}>
                                                                                            <div style={{ width: '28%' }}>
                                                                                              <CheckboxCustom
                                                                                                label="CVC非表示"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_cvc')}
                                                                                                value={cardPaymentRadioButton.is_hide_cvc}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '36%' }}>
                                                                                              <CheckboxCustom
                                                                                                label="カード名非表示"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_card_name')}
                                                                                                value={cardPaymentRadioButton.is_hide_card_name}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '28%' }}>
                                                                                              <CheckboxCustom
                                                                                                label="分割払い"
                                                                                                onChange={() => {
                                                                                                  let updatedInstallment = Array.isArray(cardPaymentRadioButton.is_use_installment)
                                                                                                    ? [...cardPaymentRadioButton.is_use_installment]
                                                                                                    : [];
                                                                                                  if (updatedInstallment.includes(itemPaymentRadio.value)) {
                                                                                                    updatedInstallment = updatedInstallment.filter(id => id !== itemPaymentRadio.value);
                                                                                                  } else {
                                                                                                    updatedInstallment.push(itemPaymentRadio.value);
                                                                                                  }
                                                                                                  console.log("Updated installment:", updatedInstallment);
                                                                                                  onChangeValueMessageContent(
                                                                                                    indexMessageSelect,
                                                                                                    indexContent,
                                                                                                    content.type,
                                                                                                    updatedInstallment,
                                                                                                    'is_use_installment'
                                                                                                  );
                                                                                                }}
                                                                                                value={Array.isArray(cardPaymentRadioButton.is_use_installment)
                                                                                                  ? cardPaymentRadioButton.is_use_installment.includes(itemPaymentRadio.value)
                                                                                                  : false}
                                                                                              />
                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '90%', display: 'flex' }}>
                                                                                            <div style={{ width: '28%', display: 'flex', alignItems: 'center' }}>
                                                                                              <CheckboxCustom
                                                                                                label="セパレート式"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_type')}
                                                                                                value={cardPaymentRadioButton.separate_type}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '36%', display: 'flex', alignItems: 'center' }}>
                                                                                              <CheckboxCustom
                                                                                                label="有効性チェックをする"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'validity_check')}
                                                                                                value={cardPaymentRadioButton.validity_check}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '28%', display: 'flex', alignItems: 'center' }}>
                                                                                              <CheckboxCustom
                                                                                                label="姓と名を分けて入力する"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_name')}
                                                                                                value={cardPaymentRadioButton.separate_name}
                                                                                              />
                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div style={{ width: '30%', marginLeft: '31px', display: 'flex', justifyContent: 'space-between' }}>
                                                                                              <span style={{ paddingTop: '3px', fontWeight: '400' }}>有効期限</span>
                                                                                              <SelectCustom
                                                                                                style={{ width: '53%' }}
                                                                                                allowClear={false}
                                                                                                value={cardPaymentRadioButton.type_date_of_expiry}
                                                                                                data={[{ key: 'ym', value: 'YM' }, { key: 'my', value: 'MY' }]}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type_date_of_expiry')}
                                                                                              />
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
                                                                                              label="カード番号"
                                                                                              inline={false}
                                                                                              placeholder="プレースホルダ"
                                                                                              value={cardPaymentRadioButton.card_number_placeholder}
                                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder')}
                                                                                            />
                                                                                            {isUseFukushashiki &&
                                                                                              <>
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_mode']}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number_fukushashiki_search_mode', value)}
                                                                                                        data={[
                                                                                                          { key: 1, value: 'id' },
                                                                                                          { key: 2, value: 'css_selector' },
                                                                                                          { key: 3, value: 'xpath' }
                                                                                                        ]}
                                                                                                        keyValue="key"
                                                                                                        placeholder="複写先要素の取得方法をお選びください"
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                  <Tooltip title={{
                                                                                                    1: '複写先要素のIDを入力ください',
                                                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                                                    3: '複写先要素のxPathを入力ください',
                                                                                                  }[
                                                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_mode']
                                                                                                  ] || ''} placement="top">
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number_fukushashiki_search_value', value)}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_value']}
                                                                                                        placeholder={{
                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                        }[
                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_value']
                                                                                                        ] || ''}
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                </div>
                                                                                              </>}
                                                                                          </div> :
                                                                                          <div className="ss-user-setting__item-bottom">
                                                                                            <div style={{ width: '90%' }}>カード番号</div>
                                                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type" style={{ flexWrap: 'wrap', rowGap: '10px' }}>
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder1}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder1')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_mode']}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number1_fukushashiki_search_mode', value)}
                                                                                                          data={[
                                                                                                            { key: 1, value: 'id' },
                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                            { key: 3, value: 'xpath' }
                                                                                                          ]}
                                                                                                          keyValue="key"
                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title={{
                                                                                                      1: '複写先要素のIDを入力ください',
                                                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                                                      3: '複写先要素のxPathを入力ください',
                                                                                                    }[
                                                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_mode']
                                                                                                    ] || ''} placement="top">
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number1_fukushashiki_search_value', value)}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_value']}
                                                                                                          placeholder={{
                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                          }[
                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_value']
                                                                                                          ] || ''}
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                  </div> </>}
                                                                                              </div>
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder2}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder2')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_mode']}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number2_fukushashiki_search_mode', value)}
                                                                                                          data={[
                                                                                                            { key: 1, value: 'id' },
                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                            { key: 3, value: 'xpath' }
                                                                                                          ]}
                                                                                                          keyValue="key"
                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title={{
                                                                                                      1: '複写先要素のIDを入力ください',
                                                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                                                      3: '複写先要素のxPathを入力ください',
                                                                                                    }[
                                                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_mode']
                                                                                                    ] || ''} placement="top">
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number2_fukushashiki_search_value', value)}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_value']}
                                                                                                          placeholder={{
                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                          }[
                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_value']
                                                                                                          ] || ''}
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                  </div> </>}
                                                                                              </div>
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder3}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder3')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_mode']}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number3_fukushashiki_search_mode', value)}
                                                                                                          data={[
                                                                                                            { key: 1, value: 'id' },
                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                            { key: 3, value: 'xpath' }
                                                                                                          ]}
                                                                                                          keyValue="key"
                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title={{
                                                                                                      1: '複写先要素のIDを入力ください',
                                                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                                                      3: '複写先要素のxPathを入力ください',
                                                                                                    }[
                                                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_mode']
                                                                                                    ] || ''} placement="top">
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number3_fukushashiki_search_value', value)}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_value']}
                                                                                                          placeholder={{
                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                          }[
                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_value']
                                                                                                          ] || ''}
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                  </div> </>}
                                                                                              </div>
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder4}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder4')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_mode']}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number4_fukushashiki_search_mode', value)}
                                                                                                          data={[
                                                                                                            { key: 1, value: 'id' },
                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                            { key: 3, value: 'xpath' }
                                                                                                          ]}
                                                                                                          keyValue="key"
                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title={{
                                                                                                      1: '複写先要素のIDを入力ください',
                                                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                                                      3: '複写先要素のxPathを入力ください',
                                                                                                    }[
                                                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_mode']
                                                                                                    ] || ''} placement="top">
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number4_fukushashiki_search_value', value)}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_value']}
                                                                                                          placeholder={{
                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                          }[
                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_value']
                                                                                                          ] || ''}
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                  </div> </>}
                                                                                              </div>
                                                                                            </div>

                                                                                          </div>
                                                                                        }
                                                                                        {cardPaymentRadioButton.separate_name === false ?
                                                                                          <div className="ss-user-setting__item-bottom">
                                                                                            <InputCustom
                                                                                              styleLabel={{ width: '90%' }}
                                                                                              label="カード名義"
                                                                                              inline={false}
                                                                                              placeholder="プレースホルダ"
                                                                                              value={cardPaymentRadioButton.card_holder_placeholder}
                                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder')}
                                                                                            />
                                                                                            {isUseFukushashiki &&
                                                                                              <>
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_mode']}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder_fukushashiki_search_mode', value)}
                                                                                                        data={[
                                                                                                          { key: 1, value: 'id' },
                                                                                                          { key: 2, value: 'css_selector' },
                                                                                                          { key: 3, value: 'xpath' }
                                                                                                        ]}
                                                                                                        keyValue="key"
                                                                                                        placeholder="複写先要素の取得方法をお選びください"
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                  <Tooltip title={{
                                                                                                    1: '複写先要素のIDを入力ください',
                                                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                                                    3: '複写先要素のxPathを入力ください',
                                                                                                  }[
                                                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_mode']
                                                                                                  ] || ''} placement="top">
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder_fukushashiki_search_value', value)}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_value']}
                                                                                                        placeholder={{
                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                        }[
                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_value']
                                                                                                        ] || ''}
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                </div>
                                                                                              </>}
                                                                                          </div> :
                                                                                          <div className="ss-user-setting__item-bottom">
                                                                                            <div style={{ width: '90%' }}>カード名義</div>
                                                                                            <div style={{ display: 'flex', width: '90%', gap: '10px' }}>
                                                                                              <div style={{ width: '100%' }}>
                                                                                                <InputCustom
                                                                                                  style={{width: '99%'}}
                                                                                                  inline={false}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_holder_placeholder1}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder1')}
                                                                                                />
                                                                                              </div>
                                                                                              <div style={{ width: '100%' }}>
                                                                                                <InputCustom
                                                                                                  style={{width: '99%'}}
                                                                                                  inline={false}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_holder_placeholder2}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder2')}
                                                                                                />
                                                                                              </div>
                                                                                            </div>
                                                                                            {isUseFukushashiki &&
                                                                                              <>
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_mode']}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder1_fukushashiki_search_mode', value)}
                                                                                                        data={[
                                                                                                          { key: 1, value: 'id' },
                                                                                                          { key: 2, value: 'css_selector' },
                                                                                                          { key: 3, value: 'xpath' }
                                                                                                        ]}
                                                                                                        keyValue="key"
                                                                                                        placeholder="複写先要素の取得方法をお選びください"
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                  <Tooltip title={{
                                                                                                    1: '複写先要素のIDを入力ください',
                                                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                                                    3: '複写先要素のxPathを入力ください',
                                                                                                  }[
                                                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_mode']
                                                                                                  ] || ''} placement="top">
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder1_fukushashiki_search_value', value)}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_value']}
                                                                                                        placeholder={{
                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                        }[
                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_value']
                                                                                                        ] || ''}
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                </div>
                                                                                              </>}
                                                                                              {isUseFukushashiki &&
                                                                                              <>
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_mode']}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder2_fukushashiki_search_mode', value)}
                                                                                                        data={[
                                                                                                          { key: 1, value: 'id' },
                                                                                                          { key: 2, value: 'css_selector' },
                                                                                                          { key: 3, value: 'xpath' }
                                                                                                        ]}
                                                                                                        keyValue="key"
                                                                                                        placeholder="複写先要素の取得方法をお選びください"
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                  <Tooltip title={{
                                                                                                    1: '複写先要素のIDを入力ください',
                                                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                                                    3: '複写先要素のxPathを入力ください',
                                                                                                  }[
                                                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_mode']
                                                                                                  ] || ''} placement="top">
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder2_fukushashiki_search_value', value)}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_value']}
                                                                                                        placeholder={{
                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                        }[
                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_value']
                                                                                                        ] || ''}
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                </div>
                                                                                              </>}
                                                                                          </div>
                                                                                        }
                                                                                        {Array.isArray(cardPaymentRadioButton.is_use_installment) && cardPaymentRadioButton.is_use_installment.includes(itemPaymentRadio.value) &&
                                                                                          <div className="ss-user-setting__item-bottom">
                                                                                            <SelectCustom
                                                                                              styleLabel={{ width: '90%' }}
                                                                                              label="お支払い回数"
                                                                                              inline={false}
                                                                                              placeholder="プレースホルダ"
                                                                                              data={installmentOptions}
                                                                                              value={cardPaymentRadioButton.installment_placeholder}
                                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'installment_placeholder')}
                                                                                            />
                                                                                            {isUseFukushashiki &&
                                                                                              <>
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_mode']}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'installment_fukushashiki_search_mode', value)}
                                                                                                        data={[
                                                                                                          { key: 1, value: 'id' },
                                                                                                          { key: 2, value: 'css_selector' },
                                                                                                          { key: 3, value: 'xpath' }
                                                                                                        ]}
                                                                                                        keyValue="key"
                                                                                                        placeholder="複写先要素の取得方法をお選びください"
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                  <Tooltip title={{
                                                                                                    1: '複写先要素のIDを入力ください',
                                                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                                                    3: '複写先要素のxPathを入力ください',
                                                                                                  }[
                                                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_mode']
                                                                                                  ] || ''} placement="top">
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'installment_fukushashiki_search_value', value)}
                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_value']}
                                                                                                        placeholder={{
                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                        }[
                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_value']
                                                                                                        ] || ''}
                                                                                                      />
                                                                                                    </div>
                                                                                                  </Tooltip>
                                                                                                </div>
                                                                                              </>}
                                                                                          </div>
                                                                                        }
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '90%' }}>有効期限</div>
                                                                                          <div style={{ display: 'flex', width: '90%', gap: '15px', flexWrap: isUseFukushashiki ? 'wrap' : 'no-wrap' }}>
                                                                                            <div style={{ width: isUseFukushashiki ? '100%' : '47%' }}>
                                                                                              <SelectCustom
                                                                                                placeholder="年"
                                                                                                style={{ width: '100%' }}
                                                                                                value={cardPaymentRadioButton.year_placeholder}
                                                                                                data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'year_placeholder')}
                                                                                              />
                                                                                              {isUseFukushashiki &&
                                                                                                <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_mode']}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'year_fukushashiki_search_mode', value)}
                                                                                                          data={[
                                                                                                            { key: 1, value: 'id' },
                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                            { key: 3, value: 'xpath' }
                                                                                                          ]}
                                                                                                          keyValue="key"
                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title={{
                                                                                                      1: '複写先要素のIDを入力ください',
                                                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                                                      3: '複写先要素のxPathを入力ください',
                                                                                                    }[
                                                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_mode']
                                                                                                    ] || ''} placement="top">
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'year_fukushashiki_search_value', value)}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_value']}
                                                                                                          placeholder={{
                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                          }[
                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_value']
                                                                                                          ] || ''}
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                  </div>
                                                                                                </>
                                                                                              }
                                                                                            </div>
                                                                                            <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                              <SelectCustom
                                                                                                placeholder="月"
                                                                                                style={{ width: '100%' }}
                                                                                                value={cardPaymentRadioButton.month_placeholder}
                                                                                                data={dataMonthFixed}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'month_placeholder')}
                                                                                              />
                                                                                              {isUseFukushashiki &&
                                                                                                <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_mode']}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'month_fukushashiki_search_mode', value)}
                                                                                                          data={[
                                                                                                            { key: 1, value: 'id' },
                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                            { key: 3, value: 'xpath' }
                                                                                                          ]}
                                                                                                          keyValue="key"
                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title={{
                                                                                                      1: '複写先要素のIDを入力ください',
                                                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                                                      3: '複写先要素のxPathを入力ください',
                                                                                                    }[
                                                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_mode']
                                                                                                    ] || ''} placement="top">
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'month_fukushashiki_search_value', value)}
                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_value']}
                                                                                                          placeholder={{
                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                          }[
                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_value']
                                                                                                          ] || ''}
                                                                                                        />
                                                                                                      </div>
                                                                                                    </Tooltip>
                                                                                                  </div>
                                                                                                </>
                                                                                              }
                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="ss-user-setting__item-bottom">

                                                                                          <InputCustom
                                                                                            styleLabel={{ width: '90%' }}
                                                                                            label="CVC非表示"
                                                                                            inline={false}
                                                                                            placeholder="プレースホルダ"
                                                                                            value={cardPaymentRadioButton.cvc_placeholder}
                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'cvc_placeholder')}
                                                                                          />
                                                                                          {isUseFukushashiki &&
                                                                                            <>
                                                                                              <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                  <div style={{ width: '20%' }}>
                                                                                                    <SelectCustom
                                                                                                      id="title"
                                                                                                      style={{ width: '100%' }}
                                                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_mode']}
                                                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'cvc_fukushashiki_search_mode', value)}
                                                                                                      data={[
                                                                                                        { key: 1, value: 'id' },
                                                                                                        { key: 2, value: 'css_selector' },
                                                                                                        { key: 3, value: 'xpath' }
                                                                                                      ]}
                                                                                                      keyValue="key"
                                                                                                      placeholder="複写先要素の取得方法をお選びください"
                                                                                                    />
                                                                                                  </div>
                                                                                                </Tooltip>
                                                                                                <Tooltip title={{
                                                                                                  1: '複写先要素のIDを入力ください',
                                                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                                                  3: '複写先要素のxPathを入力ください',
                                                                                                }[
                                                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_mode']
                                                                                                ] || ''} placement="top">
                                                                                                  <div style={{ flex: '80%' }}>
                                                                                                    <InputCustom
                                                                                                      styleLabel={{ width: '100%' }}
                                                                                                      style={{ width: '100%' }}
                                                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'cvc_fukushashiki_search_value', value)}
                                                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_value']}
                                                                                                      placeholder={{
                                                                                                        1: '複写先要素のIDを入力ください',
                                                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                                                        3: '複写先要素のxPathを入力ください',
                                                                                                      }[
                                                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_value']
                                                                                                      ] || ''}
                                                                                                    />
                                                                                                  </div>
                                                                                                </Tooltip>
                                                                                              </div>
                                                                                            </>
                                                                                          }
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
                                                                                          return <React.Fragment key={indexContentPayment}>
                                                                                            <div style={{ width: arrContent.length > 1 ? `${(100 / arrContent.length) - 1}%` : '100%', padding: '5px' }}>
                                                                                              <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '92%' }}
                                                                                                  placeholder="ファイルのURL"
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents_img', indexPaymentRadioImg, 'contents', indexContentPayment, 'file_url')}
                                                                                                  value={itemContentPayment.file_url}
                                                                                                />
                                                                                                <MDBIcon onClick={() => {
                                                                                                  setAcceptFile(['image'])
                                                                                                  setIsOpenFileReference(true)
                                                                                                  setVarFileReference({ indexContent, contentType: content.type, subContentType: 'radio_contents_img', indexSubContentType: indexPaymentRadioImg, childSubContentType: 'contents', indexChildSubContentType: indexContentPayment, img: 'file_url' })
                                                                                                }}
                                                                                                  fas icon="paperclip"
                                                                                                  style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
                                                                                                />
                                                                                              </div>
                                                                                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                                                <InputDouble
                                                                                                  placeholder={["テキスト", "値"]}
                                                                                                  valueLeft={itemContentPayment.text}
                                                                                                  valueRight={itemContentPayment.value}
                                                                                                  onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents_img', indexPaymentRadioImg, 'contents', indexContentPayment, name === 'left' ? 'text' : 'value')}
                                                                                                />
                                                                                              </div>
                                                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                                                <CheckboxCustom
                                                                                                  label="初期選択設定"
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
                                                                                                  label="カード決済連動設定"
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
                                                            >追加</Button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </>
                                                  )}
                                                  {/* user: type = 'shipping_address' */}
                                                  {content.type === 'shipping_address' && (
                                                    <>
                                                    <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="ログイン済み時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                        />
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        {renderRootFaqOption()}
                                                        <div className="ss-user-setting__item-bottom" style={{ position: 'relative' }}>
                                                            {shippingAddress.type !== "picture_radio" &&
                                                                <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'radio_contents')}>
                                                                    <Droppable droppableId='payment-radio'>
                                                                        {(providedChild) => {
                                                                            return <div className="ss-user-setting-item-payment-radio-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                                {isUseFukushashiki && (
                                                                                    <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                            <div style={{ flexBasis: '23%', maxWidth: '23%' }}>
                                                                                                <SelectCustom
                                                                                                    id="title"
                                                                                                    style={{ width: '100%' }}
                                                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']}
                                                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_mode', value)}
                                                                                                    data={[
                                                                                                        { key: 1, value: 'id' },
                                                                                                        { key: 2, value: 'css_selector' },
                                                                                                        { key: 3, value: 'xpath' }
                                                                                                    ]}
                                                                                                    keyValue="key"
                                                                                                    placeholder="複写先要素の取得方法をお選びください"
                                                                                                />
                                                                                            </div>
                                                                                        </Tooltip>
                                                                                        <div style={{ flexBasis: '75%', maxWidth: '75%' }}>
                                                                                            <InputCustom
                                                                                                styleLabel={{ width: '100%' }}
                                                                                                maxLength={250}
                                                                                                useFukushashiki={true}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_value', value)}
                                                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_value']}
                                                                                                placeholder={{
                                                                                                    1: '複写先要素のIDを入力ください',
                                                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                                                    3: '複写先要素のxPathを入力ください',
                                                                                                }[
                                                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']
                                                                                                ] || ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                                {
                                                                                    Array.isArray(shippingAddress.radio_contents) && shippingAddress.radio_contents
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
                                                                                                                        placeholder={["テキスト", "値"]}
                                                                                                                        valueLeft={itemPaymentRadio.text}
                                                                                                                        valueRight={itemPaymentRadio.value}
                                                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents', indexPaymentRadio, name === 'left' ? 'text' : 'value')}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                                                                    <CheckboxCustom
                                                                                                                        label="初期選択設定"
                                                                                                                        value={shippingAddress.value_initial_selection === itemPaymentRadio.value}
                                                                                                                        onChange={() => {
                                                                                                                            if (shippingAddress.value_initial_selection !== itemPaymentRadio.value) {
                                                                                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'value_initial_selection');
                                                                                                                            } else {
                                                                                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'value_initial_selection');
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    />
                                                                                                                    <CheckboxCustom
                                                                                                                        label="配送先を入力する"
                                                                                                                        value={shippingAddress.card_linked_setting.includes(itemPaymentRadio.value)}
                                                                                                                        onChange={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'card_linked_setting')}
                                                                                                                    />
                                                
                                                                                                                </div>
                                                                                                                {array.length > 1 &&
                                                                                                                    <div className="ss-user-setting-payment-radio-times-icons">
                                                                                                                        <MDBIcon fas icon="times-circle"
                                                                                                                            onClick={() => {
                                                                                                                                let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                                                                                let startArr = arrMessage.slice(0, indexPaymentRadio);
                                                                                                                                let lastArr = arrMessage.slice(indexPaymentRadio + 1, arrMessage.length);
                                                                                                                                dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents = [...startArr, ...lastArr];
                                                                                                                                setDataMessages([...dataMessages]);
                                                                                                                            }} />
                                                                                                                    </div>
                                                                                                                }
                                                                                                                {shippingAddress.card_linked_setting.includes(itemPaymentRadio.value) && (
                                                                                                        <React.Fragment>
                                                                                                          <div className="ss-user-setting__item-bottom">
                                                                                                            <div style={{ width: '95%', height: '1px', backgroundColor: 'black' }}></div>
                                                                                                          </div>
                                                                                                          <div className="ss-user-setting__item-bottom">
                                                                                                            <div style={{ width: '95%' }}>
                                                                                                              <span>配送先住所</span>
                                                                                                            </div>
                                                                                                          </div>
                                                                                                          <div className="ss-user-setting__item-text_input-top">
                                                                                                            <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                                                                              <CheckboxCustom
                                                                                                                label="入力値の検証にAPIを利用する"
                                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                                                                                value={shippingAddress.use_api_input_value}
                                                                                                              />
                                                                                                            </div>
                                                                                                            {shippingAddress.use_api_input_value &&
                                                                                                              <div className="ss-user-setting__item-bottom">
                                                                                                                <SelectCustom
                                                                                                                  style={{ width: '90%' }}
                                                                                                                  id="title"
                                                                                                                  value={shippingAddress?.use_api_input_value}
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
                                                                                                                  label="必須"
                                                                                                                  onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, shippingAddress.isCheckRequire === 'require' ? '' : 'require', 'isCheckRequire')}
                                                                                                                  value={shippingAddress.isCheckRequire === 'require'}
                                                                                                                  isOnChange={false}
                                                                                                                />
                                                                                                              </div>
                                                                                                              <div className="ss-user-setting__item-text_input-use-api-required">
                                                                                                                <CheckboxCustom
                                                                                                                  label="全項目必須"
                                                                                                                  onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, shippingAddress.isCheckRequire === 'all_items_require' ? '' : 'all_items_require', 'isCheckRequire')}
                                                                                                                  value={shippingAddress.isCheckRequire === 'all_items_require'}
                                                                                                                  isOnChange={false}
                                                                                                                />
                                                                                                              </div>
                                                                                                              <div className="ss-user-setting__item-text_input-use-api-required">
                                                                                                                <CheckboxCustom
                                                                                                                  label="電話番号（ハイフン付き）"
                                                                                                                  value={shippingAddress.withHyphen}
                                                                                                                  data={hyphenPhoneNumber}
                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'withHyphen')}
                                                                                                                />
                                                                                                              </div>
                                                                                                            </div>
                                                                                                            <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                                                                              <CheckboxCustom
                                                                                                                label="郵便番号を3桁+4桁に分割する"
                                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'split_postal_code')}
                                                                                                                value={shippingAddress.split_postal_code}
                                                                                                              />
                                                                                                            </div>
                                                                                                            <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                                                                              <CheckboxCustom
                                                                                                                label="市区町村と番地を１フィールドで利用"
                                                                                                                onChange={value => {
                                                                                                                  onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'compact_municipality_and_address')
                                                                                                                  if (value) {
                                                                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, false, 'compact_municipality_and_address_and_building_name')
                                                                                                                  }
                                                                                                                }}
                                                                                                                value={shippingAddress.compact_municipality_and_address}
                                                                                                              />
                                                                                                            </div>
                                                                                                            <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                                                                              <CheckboxCustom
                                                                                                                label="市区町村・番地・建物名を１フィールドで利用"
                                                                                                                onChange={value => {
                                                                                                                  onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'compact_municipality_and_address_and_building_name')
                                                                                                                  if (value) {
                                                                                                                    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, false, 'compact_municipality_and_address')
                                                                                                                  }
                                                                                                                }}
                                                                                                                value={shippingAddress.compact_municipality_and_address_and_building_name}
                                                                                                              />
                                                                                                            </div>
                                                                                                          </div>

                                                                                                          {/* shipping_address: name placename */}
                                                                                                          {
                                                                                                            <React.Fragment>
                                                                                                              {shippingAddress.name !== undefined && (
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <div style={{ width: '18%', fontSize: '14px', fontWeight: '400' }}>
                                                                                                                    お名前
                                                                                                                  </div>
                                                                                                                  <div style={{ width: '75%' }}>
                                                                                                                    <InputDouble
                                                                                                                      width={'50%'}
                                                                                                                      //icon={shippingAddress.text?.isSplitInput ? "minus-circle" : "plus-circle"}
                                                                                                                      valueLeft={shippingAddress.shipping_address?.name_placeholderLeft}
                                                                                                                      valueRight={shippingAddress.shipping_address?.name_placeholderRight}
                                                                                                                      onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, name === 'left' ? 'name_placeholderLeft' : 'name_placeholderRight')}
                                                                                                                      onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !shippingAddress.type?.isSplitInput, shippingAddress.type, 'isSplitInput')}
                                                                                                                      placeholder={['プレースホルダ', 'プレースホルダ']}
                                                                                                                    />
                                                                                                                  </div>
                                                                                                                  <MDBIcon
                                                                                                                    style={{ width: '6%' }}
                                                                                                                    // onClick={onClickIcon}
                                                                                                                    onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'name')}
                                                                                                                    fas
                                                                                                                    icon="times-circle"
                                                                                                                    className={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                  />
                                                                                                                </div>
                                                                                                              )}
                                                                                                              {shippingAddress.name !== undefined && isUseFukushashiki && shippingAddress.type.isSplitInput && (
                                                                                                                <>
                                                                                                                  <div className="ss-user-setting__item-bottom">
                                                                                                                    <div style={{ width: '16%' }}>

                                                                                                                    </div>
                                                                                                                    <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                        <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                          <SelectCustom
                                                                                                                            id="title"
                                                                                                                            style={{ width: '100%' }}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_left_fukushashiki_search_mode']}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_left_fukushashiki_search_mode', value)}
                                                                                                                            data={[
                                                                                                                              { key: 1, value: 'id' },
                                                                                                                              { key: 2, value: 'css_selector' },
                                                                                                                              { key: 3, value: 'xpath' }
                                                                                                                            ]}
                                                                                                                            keyValue="key"
                                                                                                                            placeholder="複写先要素の取得方法をお選びください"
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </Tooltip>
                                                                                                                      <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                        <InputCustom
                                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                                          maxLength={250}
                                                                                                                          useFukushashiki={true}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_left_fukushashiki_search_value', value)}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_left_fukushashiki_search_value']}
                                                                                                                          placeholder={{
                                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                                          }[
                                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_left_fukushashiki_search_mode']
                                                                                                                          ] || ''}
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '5%' }}>
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  <div className='ss-user-setting__item-bottom'>
                                                                                                                    <div style={{ width: '16%' }}>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                        <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                          <SelectCustom
                                                                                                                            id="title"
                                                                                                                            style={{ width: '100%' }}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_right_fukushashiki_search_mode']}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_right_fukushashiki_search_mode', value)}
                                                                                                                            data={[
                                                                                                                              { key: 1, value: 'id' },
                                                                                                                              { key: 2, value: 'css_selector' },
                                                                                                                              { key: 3, value: 'xpath' }
                                                                                                                            ]}
                                                                                                                            keyValue="key"
                                                                                                                            placeholder="複写先要素の取得方法をお選びください"
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </Tooltip>
                                                                                                                      <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                        <InputCustom
                                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                                          maxLength={250}
                                                                                                                          useFukushashiki={true}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_right_fukushashiki_search_value', value)}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_right_fukushashiki_search_value']}
                                                                                                                          placeholder={{
                                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                                          }[
                                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_right_fukushashiki_search_mode']
                                                                                                                          ] || ''}
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '5%' }}>
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                </>
                                                                                                              )}
                                                                                                              
                                                                                                            </React.Fragment>
                                                                                                          }
                                                                                                          {/* shipping_address: katakana name */}
                                                                                                          {
                                                                                                            <React.Fragment>
                                                                                                              {shippingAddress.kana_name !== undefined && (
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <div style={{ width: '18%', fontSize: '14px', fontWeight: '400' }}>
                                                                                                                    フリガナ
                                                                                                                  </div>
                                                                                                                  <div style={{ width: '75%' }}>
                                                                                                                    <InputDouble
                                                                                                                      width={'50%'}
                                                                                                                      //icon={shippingAddress.text?.isSplitInput ? "minus-circle" : "plus-circle"}
                                                                                                                      valueLeft={shippingAddress.type?.kana_name_placeholderLeft}
                                                                                                                      valueRight={shippingAddress.type?.kana_name_placeholderRight}
                                                                                                                      onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, name === 'left' ? 'kana_name_placeholderLeft' : 'kana_name_placeholderRight')}
                                                                                                                      onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !shippingAddress.type?.isSplitInput, shippingAddress.type, 'isSplitInput')}
                                                                                                                      placeholder={['プレースホルダ', 'プレースホルダ']}
                                                                                                                    />
                                                                                                                  </div>
                                                                                                                  <MDBIcon
                                                                                                                    style={{ width: '6%' }}
                                                                                                                    // onClick={onClickIcon}
                                                                                                                    onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'kana_name')}
                                                                                                                    fas
                                                                                                                    icon="times-circle"
                                                                                                                    className={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                  />
                                                                                                                </div>
                                                                                                              )}
                                                                                                              {shippingAddress.kana_name !== undefined && isUseFukushashiki && shippingAddress.type.isSplitInput && (
                                                                                                                <>
                                                                                                                  <div className="ss-user-setting__item-bottom">
                                                                                                                    <div style={{ width: '16%' }}>

                                                                                                                    </div>
                                                                                                                    <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                        <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                          <SelectCustom
                                                                                                                            id="title"
                                                                                                                            style={{ width: '100%' }}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_left_fukushashiki_search_mode']}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_left_fukushashiki_search_mode', value)}
                                                                                                                            data={[
                                                                                                                              { key: 1, value: 'id' },
                                                                                                                              { key: 2, value: 'css_selector' },
                                                                                                                              { key: 3, value: 'xpath' }
                                                                                                                            ]}
                                                                                                                            keyValue="key"
                                                                                                                            placeholder="複写先要素の取得方法をお選びください"
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </Tooltip>
                                                                                                                      <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                        <InputCustom
                                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                                          maxLength={250}
                                                                                                                          useFukushashiki={true}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_left_fukushashiki_search_value', value)}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_left_fukushashiki_search_value']}
                                                                                                                          placeholder={{
                                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                                          }[
                                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_left_fukushashiki_search_mode']
                                                                                                                          ] || ''}
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '5%' }}>
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  <div className='ss-user-setting__item-bottom'>
                                                                                                                    <div style={{ width: '16%' }}>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                        <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                          <SelectCustom
                                                                                                                            id="title"
                                                                                                                            style={{ width: '100%' }}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_right_fukushashiki_search_mode']}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_right_fukushashiki_search_mode', value)}
                                                                                                                            data={[
                                                                                                                              { key: 1, value: 'id' },
                                                                                                                              { key: 2, value: 'css_selector' },
                                                                                                                              { key: 3, value: 'xpath' }
                                                                                                                            ]}
                                                                                                                            keyValue="key"
                                                                                                                            placeholder="複写先要素の取得方法をお選びください"
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </Tooltip>
                                                                                                                      <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                        <InputCustom
                                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                                          maxLength={250}
                                                                                                                          useFukushashiki={true}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_right_fukushashiki_search_value', value)}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_right_fukushashiki_search_value']}
                                                                                                                          placeholder={{
                                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                                          }[
                                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_right_fukushashiki_search_mode']
                                                                                                                          ] || ''}
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '5%' }}>
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                </>
                                                                                                              )}

                                                                                                            </React.Fragment>
                                                                                                          }
                                                                                                          {shippingAddress.post_code !== undefined && (
                                                                                                            shippingAddress.split_postal_code === false ?
                                                                                                              <>
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <InputCustom
                                                                                                                    classLabel="ss-custom-label-zip-code"
                                                                                                                    label="郵便番号"
                                                                                                                    className={"ss-user-setting__item-input-zip-code"}
                                                                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code')}
                                                                                                                    onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'post_code')}
                                                                                                                    value={shippingAddress.post_code}
                                                                                                                    icon="times-circle"
                                                                                                                    placeholder="000 000"
                                                                                                                    classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                  />

                                                                                                                </div>
                                                                                                                {isUseFukushashiki && (
                                                                                                                  <div className="ss-user-setting__item-bottom">
                                                                                                                    <div style={{ width: '16%' }}>

                                                                                                                    </div>
                                                                                                                    <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                        <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                          <SelectCustom
                                                                                                                            id="title"
                                                                                                                            style={{ width: '100%' }}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_fukushashiki_search_mode']}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_fukushashiki_search_mode', value)}
                                                                                                                            data={[
                                                                                                                              { key: 1, value: 'id' },
                                                                                                                              { key: 2, value: 'css_selector' },
                                                                                                                              { key: 3, value: 'xpath' }
                                                                                                                            ]}
                                                                                                                            keyValue="key"
                                                                                                                            placeholder="複写先要素の取得方法をお選びください"
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </Tooltip>
                                                                                                                      <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                        <InputCustom
                                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                                          maxLength={250}
                                                                                                                          useFukushashiki={true}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_fukushashiki_search_value', value)}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_fukushashiki_search_value']}
                                                                                                                          placeholder={{
                                                                                                                            1: '複写先要素のIDを入力ください',
                                                                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                                                                            3: '複写先要素のxPathを入力ください',
                                                                                                                          }[
                                                                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_fukushashiki_search_mode']
                                                                                                                          ] || ''}
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '5%' }}>
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                )}
                                                                                                              </>
                                                                                                              :
                                                                                                              <>
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <InputCustom
                                                                                                                    classLabel="ss-custom-label-zip-code"
                                                                                                                    label="郵便番号"
                                                                                                                    className={"ss-user-setting__item-input-zip-code"}
                                                                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code_left')}
                                                                                                                    value={shippingAddress.post_code_left}
                                                                                                                    placeholder="000"
                                                                                                                    style={{ width: '17%', marginRight: '4%' }}
                                                                                                                  />
                                                                                                                  <InputCustom
                                                                                                                    className={"ss-user-setting__item-input-zip-code"}
                                                                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code_right')}
                                                                                                                    value={shippingAddress.post_code_right}
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
                                                                                                                {isUseFukushashiki && (
                                                                                                                  <>
                                                                                                                    <div className="ss-user-setting__item-bottom">
                                                                                                                      <div style={{ width: '16%' }}>

                                                                                                                      </div>
                                                                                                                      <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                          <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                            <SelectCustom
                                                                                                                              id="title"
                                                                                                                              style={{ width: '100%' }}
                                                                                                                              value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_left_fukushashiki_search_mode']}
                                                                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_left_fukushashiki_search_mode', value)}
                                                                                                                              data={[
                                                                                                                                { key: 1, value: 'id' },
                                                                                                                                { key: 2, value: 'css_selector' },
                                                                                                                                { key: 3, value: 'xpath' }
                                                                                                                              ]}
                                                                                                                              keyValue="key"
                                                                                                                              placeholder="複写先要素の取得方法をお選びください"
                                                                                                                            />
                                                                                                                          </div>
                                                                                                                        </Tooltip>
                                                                                                                        <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                          <InputCustom
                                                                                                                            styleLabel={{ width: '100%' }}
                                                                                                                            maxLength={250}
                                                                                                                            useFukushashiki={true}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_left_fukushashiki_search_value', value)}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_left_fukushashiki_search_value']}
                                                                                                                            placeholder={{
                                                                                                                              1: '複写先要素のIDを入力ください',
                                                                                                                              2: '複写先要素のcss_selectorを入力ください',
                                                                                                                              3: '複写先要素のxPathを入力ください',
                                                                                                                            }[
                                                                                                                              dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_left_fukushashiki_search_mode']
                                                                                                                            ] || ''}
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </div>
                                                                                                                      <div style={{ width: '5%' }}>
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                    <div className="ss-user-setting__item-bottom">
                                                                                                                      <div style={{ width: '16%' }}>

                                                                                                                      </div>
                                                                                                                      <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                          <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                            <SelectCustom
                                                                                                                              id="title"
                                                                                                                              style={{ width: '100%' }}
                                                                                                                              value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_right_fukushashiki_search_mode']}
                                                                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_right_fukushashiki_search_mode', value)}
                                                                                                                              data={[
                                                                                                                                { key: 1, value: 'id' },
                                                                                                                                { key: 2, value: 'css_selector' },
                                                                                                                                { key: 3, value: 'xpath' }
                                                                                                                              ]}
                                                                                                                              keyValue="key"
                                                                                                                              placeholder="複写先要素の取得方法をお選びください"
                                                                                                                            />
                                                                                                                          </div>
                                                                                                                        </Tooltip>
                                                                                                                        <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                          <InputCustom
                                                                                                                            styleLabel={{ width: '100%' }}
                                                                                                                            maxLength={250}
                                                                                                                            useFukushashiki={true}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_right_fukushashiki_search_value', value)}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_right_fukushashiki_search_value']}
                                                                                                                            placeholder={{
                                                                                                                              1: '複写先要素のIDを入力ください',
                                                                                                                              2: '複写先要素のcss_selectorを入力ください',
                                                                                                                              3: '複写先要素のxPathを入力ください',
                                                                                                                            }[
                                                                                                                              dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_right_fukushashiki_search_mode']
                                                                                                                            ] || ''}
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </div>
                                                                                                                      <div style={{ width: '5%' }}>
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                  </>

                                                                                                                )}
                                                                                                              </>
                                                                                                          )}
                                                                                                          {shippingAddress.prefecture !== undefined &&
                                                                                                            <>
                                                                                                              <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                                                                                                <span style={{ fontSize: '14px', fontWeight: '400' }}
                                                                                                                  className="ss-custom-label-zip-code">都道府県</span>
                                                                                                                {shippingAddress.is_use_dropdown ?
                                                                                                                  <SelectCustom
                                                                                                                    style={{ width: '40%' }}
                                                                                                                    id="title"
                                                                                                                    value={shippingAddress?.prefecture}
                                                                                                                    data={dataPrefectures}
                                                                                                                    keyValue="name"
                                                                                                                    nameValue="name"
                                                                                                                    placeholder="プレースホルダ"
                                                                                                                    onChange={value => {
                                                                                                                      if (value) {
                                                                                                                        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')
                                                                                                                      } else {
                                                                                                                        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'prefecture')
                                                                                                                      }
                                                                                                                    }}
                                                                                                                  /> :
                                                                                                                  <InputCustom
                                                                                                                    className={"ss-user-setting__item-input-zip-code"}
                                                                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                                                                                    value={shippingAddress.prefecture}
                                                                                                                    placeholder={"プレースホルダ"}
                                                                                                                    style={{ width: '40%' }}
                                                                                                                  />
                                                                                                                  // <input
                                                                                                                  //   type="text"
                                                                                                                  //   name="ss-user-setting__item-text_input-use-api"
                                                                                                                  //   className={"ss-input-value ss-user-setting-item ss-user-setting__item-input-zip-code"}
                                                                                                                  //   placeholder={"プレースホルダ"}
                                                                                                                  //   value={zipCodeAddress.prefecture}
                                                                                                                  //   style={{ width: '40%' }}
                                                                                                                  //   onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                                                                                  // />
                                                                                                                }
                                                                                                                <CheckboxCustom
                                                                                                                  label="プルダウンを利用"
                                                                                                                  className="ss-user-setting-custom-width-checkbox"
                                                                                                                  style={{ width: '35%', paddingLeft: '7px', marginBottom: '0px' }}
                                                                                                                  onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_dropdown')}
                                                                                                                  value={shippingAddress.is_use_dropdown}
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
                                                                                                              {isUseFukushashiki && (
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <div style={{ width: '16%' }}>

                                                                                                                  </div>
                                                                                                                  <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                      <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                        <SelectCustom
                                                                                                                          id="title"
                                                                                                                          style={{ width: '100%' }}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['prefecture_fukushashiki_search_mode']}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'prefecture_fukushashiki_search_mode', value)}
                                                                                                                          data={[
                                                                                                                            { key: 1, value: 'id' },
                                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                                            { key: 3, value: 'xpath' }
                                                                                                                          ]}
                                                                                                                          keyValue="key"
                                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </Tooltip>
                                                                                                                    <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                      <InputCustom
                                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                                        maxLength={250}
                                                                                                                        useFukushashiki={true}
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'prefecture_fukushashiki_search_value', value)}
                                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['prefecture_fukushashiki_search_value']}
                                                                                                                        placeholder={{
                                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                                        }[
                                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['prefecture_fukushashiki_search_mode']
                                                                                                                        ] || ''}
                                                                                                                      />
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  <div style={{ width: '5%' }}>
                                                                                                                  </div>
                                                                                                                </div>
                                                                                                              )}
                                                                                                            </>
                                                                                                          }
                                                                                                          {shippingAddress.municipality !== undefined &&
                                                                                                            <div>
                                                                                                              <div className="ss-user-setting__item-bottom">
                                                                                                                <InputCustom
                                                                                                                  classLabel="ss-custom-label-zip-code"
                                                                                                                  label="市区町村"
                                                                                                                  className={"ss-user-setting__item-input-zip-code"}
                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'municipality')}
                                                                                                                  onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'municipality')}
                                                                                                                  value={shippingAddress.municipality}
                                                                                                                  icon="times-circle"
                                                                                                                  placeholder="プレースホルダ"
                                                                                                                  classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                />
                                                                                                              </div>
                                                                                                              {isUseFukushashiki && (
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <div style={{ width: '16%' }}>

                                                                                                                  </div>
                                                                                                                  <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                      <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                        <SelectCustom
                                                                                                                          id="title"
                                                                                                                          style={{ width: '100%' }}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['municipality_fukushashiki_search_mode']}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'municipality_fukushashiki_search_mode', value)}
                                                                                                                          data={[
                                                                                                                            { key: 1, value: 'id' },
                                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                                            { key: 3, value: 'xpath' }
                                                                                                                          ]}
                                                                                                                          keyValue="key"
                                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </Tooltip>
                                                                                                                    <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                      <InputCustom
                                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                                        maxLength={250}
                                                                                                                        useFukushashiki={true}
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'municipality_fukushashiki_search_value', value)}
                                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['municipality_fukushashiki_search_value']}
                                                                                                                        placeholder={{
                                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                                        }[
                                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['municipality_fukushashiki_search_mode']
                                                                                                                        ] || ''}
                                                                                                                      />
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  <div style={{ width: '5%' }}>
                                                                                                                  </div>
                                                                                                                </div>
                                                                                                              )}
                                                                                                            </div>
                                                                                                          }
                                                                                                          {shippingAddress.address !== undefined &&
                                                                                                            <>
                                                                                                              <div className="ss-user-setting__item-bottom">
                                                                                                                <InputCustom
                                                                                                                  classLabel="ss-custom-label-zip-code"
                                                                                                                  label="番地"
                                                                                                                  className={"ss-user-setting__item-input-zip-code"}
                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'address')}
                                                                                                                  onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'address')}
                                                                                                                  value={shippingAddress.address}
                                                                                                                  icon="times-circle"
                                                                                                                  placeholder="プレースホルダ"
                                                                                                                  classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                />
                                                                                                              </div>
                                                                                                              {isUseFukushashiki && (
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <div style={{ width: '16%' }}>

                                                                                                                  </div>
                                                                                                                  <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                      <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                        <SelectCustom
                                                                                                                          id="title"
                                                                                                                          style={{ width: '100%' }}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['address_fukushashiki_search_mode']}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'address_fukushashiki_search_mode', value)}
                                                                                                                          data={[
                                                                                                                            { key: 1, value: 'id' },
                                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                                            { key: 3, value: 'xpath' }
                                                                                                                          ]}
                                                                                                                          keyValue="key"
                                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </Tooltip>
                                                                                                                    <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                      <InputCustom
                                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                                        maxLength={250}
                                                                                                                        useFukushashiki={true}
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'address_fukushashiki_search_value', value)}
                                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['address_fukushashiki_search_value']}
                                                                                                                        placeholder={{
                                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                                        }[
                                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['address_fukushashiki_search_mode']
                                                                                                                        ] || ''}
                                                                                                                      />
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  <div style={{ width: '5%' }}>
                                                                                                                  </div>
                                                                                                                </div>
                                                                                                              )}
                                                                                                            </>
                                                                                                          }
                                                                                                          {shippingAddress.building_name !== undefined &&
                                                                                                            <>
                                                                                                              <div className="ss-user-setting__item-bottom">
                                                                                                                <InputCustom
                                                                                                                  classLabel="ss-custom-label-zip-code"
                                                                                                                  label="建物名"
                                                                                                                  className={"ss-user-setting__item-input-zip-code"}
                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'building_name')}
                                                                                                                  value={shippingAddress.building_name}
                                                                                                                  icon="times-circle"
                                                                                                                  onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'building_name')}
                                                                                                                  placeholder="プレースホルダ"
                                                                                                                  classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                />
                                                                                                              </div>
                                                                                                              {isUseFukushashiki && (
                                                                                                                <div className="ss-user-setting__item-bottom">
                                                                                                                  <div style={{ width: '16%' }}>

                                                                                                                  </div>
                                                                                                                  <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">

                                                                                                                      <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                        <SelectCustom
                                                                                                                          id="title"
                                                                                                                          style={{ width: '100%' }}
                                                                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['building_name_fukushashiki_search_mode']}
                                                                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'building_name_fukushashiki_search_mode', value)}
                                                                                                                          data={[
                                                                                                                            { key: 1, value: 'id' },
                                                                                                                            { key: 2, value: 'css_selector' },
                                                                                                                            { key: 3, value: 'xpath' }
                                                                                                                          ]}
                                                                                                                          keyValue="key"
                                                                                                                          placeholder="複写先要素の取得方法をお選びください"
                                                                                                                        />
                                                                                                                      </div>
                                                                                                                    </Tooltip>
                                                                                                                    <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                      <InputCustom
                                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                                        maxLength={250}
                                                                                                                        useFukushashiki={true}
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'building_name_fukushashiki_search_value', value)}
                                                                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['building_name_fukushashiki_search_value']}
                                                                                                                        placeholder={{
                                                                                                                          1: '複写先要素のIDを入力ください',
                                                                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                                                                          3: '複写先要素のxPathを入力ください',
                                                                                                                        }[
                                                                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['building_name_fukushashiki_search_mode']
                                                                                                                        ] || ''}
                                                                                                                      />
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  <div style={{ width: '5%' }}>
                                                                                                                  </div>
                                                                                                                </div>
                                                                                                              )}
                                                                                                            </>
                                                                                                          }
                                                                                                          {/* shipping_address: type = phone_number */}
                                                                                                          {
                                                                                                            <React.Fragment>
                                                                                                              {/* phone_number: isWithHyphens = true */}
                                                                                                              {shippingAddress.number !== undefined && shippingAddress?.withHyphen === true &&
                                                                                                                <React.Fragment>
                                                                                                                  <div className="ss-user-setting__item-bottom">
                                                                                                                    <div style={{ width: '18%', fontSize: '14px', fontWeight: '400' }}>
                                                                                                                      電話番号
                                                                                                                    </div>
                                                                                                                    <div className="ss-user-setting__item-select-bottom-wrapper ss-user-setting-phone-number-hyphens" style={{ width: '75%' }}>
                                                                                                                      <InputCustom
                                                                                                                        placeholder="プレースホルダ"
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number1_placeholder')}
                                                                                                                        value={shippingAddress.type?.number1_placeholder}
                                                                                                                      />
                                                                                                                      <span style={{ fontSize: '20px' }}>-</span>
                                                                                                                      <InputCustom
                                                                                                                        placeholder="プレースホルダ"
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number2_placeholder')}
                                                                                                                        value={shippingAddress.type?.number2_placeholder}
                                                                                                                      />
                                                                                                                      <span style={{ fontSize: '20px' }}>-</span>
                                                                                                                      <InputCustom
                                                                                                                        placeholder="プレースホルダ"
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number3_placeholder')}
                                                                                                                        value={shippingAddress.type?.number3_placeholder}
                                                                                                                      />
                                                                                                                    </div>
                                                                                                                    <MDBIcon
                                                                                                                      style={{ width: '6%' }}
                                                                                                                      // onClick={onClickIcon}
                                                                                                                      onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'number')}
                                                                                                                      fas
                                                                                                                      icon="times-circle"
                                                                                                                      className={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                    />
                                                                                                                    {isUseFukushashiki && (
                                                                                                                      <>
                                                                                                                        <div className='ss-user-setting__item-bottom' style={{ marginTop: '10px' }}>
                                                                                                                          <div style={{ width: '16%' }}>
                                                                                                                          </div>
                                                                                                                          <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                              <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                                <SelectCustom
                                                                                                                                  id="title"
                                                                                                                                  style={{ width: '100%' }}
                                                                                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number1_fukushashiki_search_mode']}
                                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number1_fukushashiki_search_mode', value)}
                                                                                                                                  data={[
                                                                                                                                    { key: 1, value: 'id' },
                                                                                                                                    { key: 2, value: 'css_selector' },
                                                                                                                                    { key: 3, value: 'xpath' }
                                                                                                                                  ]}
                                                                                                                                  keyValue="key"
                                                                                                                                  placeholder="複写先要素の取得方法をお選びください"
                                                                                                                                />
                                                                                                                              </div>
                                                                                                                            </Tooltip>
                                                                                                                            <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                              <InputCustom
                                                                                                                                styleLabel={{ width: '100%' }}
                                                                                                                                maxLength={250}
                                                                                                                                useFukushashiki={true}
                                                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number1_fukushashiki_search_value', value)}
                                                                                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number1_fukushashiki_search_value']}
                                                                                                                                placeholder={{
                                                                                                                                  1: '複写先要素のIDを入力ください',
                                                                                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                                                                                  3: '複写先要素のxPathを入力ください',
                                                                                                                                }[
                                                                                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number1_fukushashiki_search_mode']
                                                                                                                                ] || ''}
                                                                                                                              />
                                                                                                                            </div>
                                                                                                                          </div>
                                                                                                                          <div style={{ width: '5%' }}>
                                                                                                                          </div>
                                                                                                                        </div>
                                                                                                                        <div className='ss-user-setting__item-bottom'>
                                                                                                                          <div style={{ width: '16%' }}>
                                                                                                                          </div>
                                                                                                                          <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                              <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                                <SelectCustom
                                                                                                                                  id="title"
                                                                                                                                  style={{ width: '100%' }}
                                                                                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number2_fukushashiki_search_mode']}
                                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number2_fukushashiki_search_mode', value)}
                                                                                                                                  data={[
                                                                                                                                    { key: 1, value: 'id' },
                                                                                                                                    { key: 2, value: 'css_selector' },
                                                                                                                                    { key: 3, value: 'xpath' }
                                                                                                                                  ]}
                                                                                                                                  keyValue="key"
                                                                                                                                  placeholder="複写先要素の取得方法をお選びください"
                                                                                                                                />
                                                                                                                              </div>
                                                                                                                            </Tooltip>
                                                                                                                            <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                              <InputCustom
                                                                                                                                styleLabel={{ width: '100%' }}
                                                                                                                                maxLength={250}
                                                                                                                                useFukushashiki={true}
                                                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number2_fukushashiki_search_value', value)}
                                                                                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number2_fukushashiki_search_value']}
                                                                                                                                placeholder={{
                                                                                                                                  1: '複写先要素のIDを入力ください',
                                                                                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                                                                                  3: '複写先要素のxPathを入力ください',
                                                                                                                                }[
                                                                                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number2_fukushashiki_search_mode']
                                                                                                                                ] || ''}
                                                                                                                              />
                                                                                                                            </div>
                                                                                                                          </div>
                                                                                                                          <div style={{ width: '5%' }}>
                                                                                                                          </div>
                                                                                                                        </div>
                                                                                                                        <div className='ss-user-setting__item-bottom'>
                                                                                                                          <div style={{ width: '16%' }}>
                                                                                                                          </div>
                                                                                                                          <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                              <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                                <SelectCustom
                                                                                                                                  id="title"
                                                                                                                                  style={{ width: '100%' }}
                                                                                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number3_fukushashiki_search_mode']}
                                                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number3_fukushashiki_search_mode', value)}
                                                                                                                                  data={[
                                                                                                                                    { key: 1, value: 'id' },
                                                                                                                                    { key: 2, value: 'css_selector' },
                                                                                                                                    { key: 3, value: 'xpath' }
                                                                                                                                  ]}
                                                                                                                                  keyValue="key"
                                                                                                                                  placeholder="複写先要素の取得方法をお選びください"
                                                                                                                                />
                                                                                                                              </div>
                                                                                                                            </Tooltip>
                                                                                                                            <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                              <InputCustom
                                                                                                                                styleLabel={{ width: '100%' }}
                                                                                                                                maxLength={250}
                                                                                                                                useFukushashiki={true}
                                                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number3_fukushashiki_search_value', value)}
                                                                                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number3_fukushashiki_search_value']}
                                                                                                                                placeholder={{
                                                                                                                                  1: '複写先要素のIDを入力ください',
                                                                                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                                                                                  3: '複写先要素のxPathを入力ください',
                                                                                                                                }[
                                                                                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number3_fukushashiki_search_mode']
                                                                                                                                ] || ''}
                                                                                                                              />
                                                                                                                            </div>
                                                                                                                          </div>
                                                                                                                          <div style={{ width: '5%' }}>
                                                                                                                          </div>
                                                                                                                        </div>
                                                                                                                      </>
                                                                                                                    )}
                                                                                                                  </div>
                                                                                                                </React.Fragment>
                                                                                                              }
                                                                                                              {/* phone_number: isWithHyphens = false */}
                                                                                                              {shippingAddress.number !== undefined && shippingAddress?.withHyphen === false &&
                                                                                                                <React.Fragment>
                                                                                                                  <div className="ss-user-setting__item-bottom">
                                                                                                                    <div style={{ width: '18%', fontSize: '14px', fontWeight: '400' }}>
                                                                                                                      電話番号
                                                                                                                    </div>
                                                                                                                    <div style={{ width: '82%' }}>
                                                                                                                      <InputCustom
                                                                                                                        style={{ width: '91.5%' }}
                                                                                                                        placeholder="プレースホルダ"
                                                                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number_placeholder')}
                                                                                                                        value={shippingAddress.type?.number_placeholder}
                                                                                                                        onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'number')}
                                                                                                                        icon="times-circle"
                                                                                                                        classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                                                                                      />
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                  {isUseFukushashiki && (
                                                                                                                    <div className="ss-user-setting__item-bottom">
                                                                                                                      <div style={{ width: '16%' }}>

                                                                                                                      </div>
                                                                                                                      <div style={{ width: '75%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                                          <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                                                                            <SelectCustom
                                                                                                                              id="title"
                                                                                                                              style={{ width: '100%' }}
                                                                                                                              value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number_fukushashiki_search_mode']}
                                                                                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number_fukushashiki_search_mode', value)}
                                                                                                                              data={[
                                                                                                                                { key: 1, value: 'id' },
                                                                                                                                { key: 2, value: 'css_selector' },
                                                                                                                                { key: 3, value: 'xpath' }
                                                                                                                              ]}
                                                                                                                              keyValue="key"
                                                                                                                              placeholder="複写先要素の取得方法をお選びください"
                                                                                                                            />
                                                                                                                          </div>
                                                                                                                        </Tooltip>
                                                                                                                        <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                                                                                          <InputCustom
                                                                                                                            styleLabel={{ width: '100%' }}
                                                                                                                            maxLength={250}
                                                                                                                            useFukushashiki={true}
                                                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number_fukushashiki_search_value', value)}
                                                                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number_fukushashiki_search_value']}
                                                                                                                            placeholder={{
                                                                                                                              1: '複写先要素のIDを入力ください',
                                                                                                                              2: '複写先要素のcss_selectorを入力ください',
                                                                                                                              3: '複写先要素のxPathを入力ください',
                                                                                                                            }[
                                                                                                                              dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number_fukushashiki_search_mode']
                                                                                                                            ] || ''}
                                                                                                                          />
                                                                                                                        </div>
                                                                                                                      </div>
                                                                                                                      <div style={{ width: '5%' }}>
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                  )}
                                                                                                                </React.Fragment>
                                                                                                              }
                                                                                                            </React.Fragment>
                                                                                                          }
                                                                                                        </React.Fragment>
                                                                                                      )}
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
                                                            }
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                            <div style={{ width: '90%' }}>
                                                                <Button style={{ margin: '0px', padding: '9px 19px', backgroundColor: '#327AED' }}
                                                                    onClick={() => {
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
                                                                        }
                                                                    }
                                                                >追加</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                  )}
                                                  {/* user: type = 'button_submit' */}
                                                  {content.type === 'button_submit' &&
                                                    <>
                                                      <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px', display: 'flex' }}>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="エラーメッセージを表示する"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_display_error_message')}
                                                            value={buttonSubmit.is_display_error_message}
                                                          />
                                                        </div>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="JavaScriptの利用"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_js')}
                                                            value={buttonSubmit.is_use_js}
                                                          />
                                                        </div>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="入力された内容を変数に保存する。"
                                                              onChange={(value) =>
                                                                onChangeValueMessageContent(
                                                                  indexMessageSelect,
                                                                  indexContent,
                                                                  content.type,
                                                                  value,
                                                                  "is_save_input_content"
                                                                )
                                                              }
                                                            value={buttonSubmit.is_save_input_content}
                                                            isOnChange={false}
                                                          />
                                                        </div>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="確認メッセージ用"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_for_confirm_order')}
                                                            value={buttonSubmit.use_for_confirm_order}
                                                          />
                                                        </div>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="ログイン済み時に表示しない"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                          />
                                                        </div>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="エラー発生の時に表示しない"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                          />
                                                        </div>
                                                        <div style={{ width: '45%' }}>
                                                          <CheckboxCustom
                                                            label="確認するのみに表示"
                                                            onChange={(value) => {
                                                              dataMessages[indexMessageSelect].only_display_when_confirm = value;
                                                              setDataMessages([...dataMessages]);
                                                            }}
                                                            value={dataMessages[indexMessageSelect].only_display_when_confirm}
                                                          />
                                                        </div>
                                                        {renderRootFaqOption()}
                                                      </div>
                                                      {buttonSubmit.is_save_input_content && (
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: "100%", marginRight: "10px" }}
                                                                id="title"
                                                                value={buttonSubmit.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
                                                                onChange={(value) =>
                                                                  onChangeValueMessageContent(
                                                                    indexMessageSelect,
                                                                    indexContent,
                                                                    content.type,
                                                                    value,
                                                                    "save_input_content"
                                                                  )
                                                                }
                                                              />
                                                              <Button
                                                                style={{ margin: "0px", lineHeight: "0px" }}
                                                                className="ss-user-setting__select-btn-add"
                                                                onClick={() => setIsOpenAddVariable(true)}
                                                              >
                                                                追加
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        )
                                                      }
                                                      {buttonSubmit.is_display_error_message &&
                                                        <>
                                                          <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                              <div style={{ flexBasis: '26%', maxWidth: '26%' }}>
                                                                <SelectCustom
                                                                  id="title"
                                                                  label="エラーメッセージ"
                                                                  style={{ width: '100%' }}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['error_message_display_element_search_type']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'error_message_display_element_search_type', value)}
                                                                  data={[
                                                                    { key: 1, value: 'id' },
                                                                    { key: 2, value: 'css_selector' },
                                                                    { key: 3, value: 'xpath' }
                                                                  ]}
                                                                  keyValue="key"
                                                                  placeholder="複写先要素の取得方法をお選びください"
                                                                />
                                                              </div>
                                                            </Tooltip>
                                                            <div style={{ flexBasis: '63%', maxWidth: '63%', marginTop: '22px' }}>
                                                              <InputCustom
                                                                styleLabel={{ width: '100%' }}
                                                                maxLength={250}
                                                                useFukushashiki={true}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'error_message_display_element_search_value', value)}
                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['error_message_display_element_search_value']}
                                                                placeholder={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['error_message_display_element_search_type']
                                                                ] || ''}
                                                              />
                                                            </div>
                                                          </div>
                                                        </>
                                                      }
                                                      {buttonSubmit.is_use_js &&
                                                        <>
                                                          <div className='ss-user-setting__item-bottom' style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}>
                                                            jscode
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <textarea
                                                              style={{ width: '90%' }}
                                                              className="ss-user-setting-item-textarea-label ss-input-value"
                                                              placeholder="テキスト"
                                                              rows="8"
                                                              value={buttonSubmit.jscode}
                                                              onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'jscode')}
                                                            />
                                                          </div>
                                                        </>
                                                      }
                                                      <div className="ss-user-setting__item-text_input-top" style={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <InputCustom
                                                          className="ss-user-setting-input-overview"
                                                          styleLabel={{ width: '90%' }}
                                                          style={{ width: '90%' }}
                                                          label="IDボタン"
                                                          inline={false}
                                                          placeholder={'IDボタン'}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'button_submit_id', value)}
                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['button_submit_id']}
                                                        />
                                                        <InputCustom
                                                          className="ss-user-setting-input-overview"
                                                          styleLabel={{ width: '90%', marginTop: '10px' }}
                                                          style={{ width: '90%' }}
                                                          label="ボタン名称"
                                                          inline={false}
                                                          placeholder={'ボタン名称'}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'button_submit_name', value)}
                                                          value={content.button_submit_name}
                                                        />
                                                        <SubmitButtonConfig
                                                          content={content}
                                                          onChange={onChangeValueMessageContent}
                                                          indexMessageSelect={indexMessageSelect}
                                                          indexContent={indexContent}
                                                          buttonSubmit={buttonSubmit}
                                                        />
                                                      </div>
                                                    </>}
                                                  {/* user: type = 'label_no_transition' */}
                                                  {content.type === 'label_no_transition' && (
                                                    <React.Fragment>
                                                      <div style={{ marginBottom: '10px' }}>* You cannot add other user input components together with "Label (no transition record)".</div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <textarea
                                                          style={{ width: '90%' }}
                                                          placeholder="テキスト"
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
                                  onChange={(e) => setMessageType(e.target.value)}
                                  className="ss-input-value"
                                  value={messageType}
                                >
                                  <option value="text_input">テキスト入力</option>
                                  <option value="image">画像</option>
                                  <option value="label">ラベル</option>
                                  <option value="textarea">テキストエリア</option>
                                  <option value="radio_button">ラジオボタン</option>
                                  <option value="checkbox">チェックボックス</option>
                                  <option value="pull_down">プルダウン</option>
                                  <option value="zip_code_address">郵便番号と住所</option>
                                  <option value="attaching_file">ファイル添付</option>
                                  <option value="calendar">カレンダー</option>
                                  <option value="agree_term">規約同意</option>
                                  <option value="carousel">カルーセル</option>
                                  <option value="credit_card_payment">カード決済</option>
                                  <option value="capture">キャプチャ</option>
                                  <option value="product_purchase">商品購入</option>
                                  <option value="product_purchase_radio_button">商品購入（ラジオボタン型）</option>
                                  <option value="product_purchase_select_option">商品購入（プルダウン）</option>
                                  <option value="sms_verify">SMS Verify</option>
                                  <option value="AFTEE_payment_module">AFTEE決済モジュール</option>
                                  <option value="slider">スライダー</option>
                                  <option value="card_payment_radio_button">ラジオボタン付きカード決済</option>
                                  <option value="shipping_address">配送先住所</option>
                                  <option value="button_submit">確認する</option>
                                  <option value="variable_set" style={{ display: 'none' }}>変数セット</option>
                                  <option
                                    style={dataMessages[indexMessageSelect].message_content.length > 0 && messageType !== 'label_no_transition' ? { display: 'none' } : {}}
                                    value="label_no_transition">
                                    ラベル（推移記録なし）
                                  </option>
                                </select>
                                <Button className="ss-user-setting__select-btn-add" style={{ padding: '9px 23px' }} onClick={() => handleAddItemSetting(messageType || 'text_input')}>追加</Button>
                              </div>
                            }
                            <div className="ss-user-setting__checkbox-wrapper">
                              <input style={{ width: '15px' }} type="checkbox" name="ss-user-setting__checkbox" />
                              <span>先頭に揃えて停止する</span>
                              <MDBIcon fas icon="question-circle" style={{ color: '#347AED', fontSize: '12px', marginLeft: '5px' }} />
                            </div>
                            <div className="ss-user-setting-condition-footer-button">
                              <div className="ss-user-setting-condition-bottom-button">
                                <InputCustom
                                  style={{ height: '38.2px', margin: '10px', width: '25%' }}
                                  label="登録ボタン名称"
                                  value={dataMessages[indexMessageSelect].buttonName}
                                  maxLength={30}
                                  onChange={(value) => {
                                    dataMessages[indexMessageSelect].buttonName = value;
                                    setDataMessages([...dataMessages]);
                                  }}
                                />
                                <div style={{ width: '100%' }}>
                                  <CheckboxCustom
                                    label="このボタンを利用しない"
                                    onChange={(value) => {
                                      dataMessages[indexMessageSelect].not_use_button = value;
                                      setDataMessages([...dataMessages]);
                                    }}
                                    value={dataMessages[indexMessageSelect].not_use_button}

                                  />
                                </div>
                                <div style={{ width: '100%' }}>
                                  <CheckboxCustom
                                    label="JavaScriptの利用"
                                    onChange={(value) => {
                                      dataMessages[indexMessageSelect].button_jscode = value;
                                      setDataMessages([...dataMessages]);
                                    }}
                                    value={dataMessages[indexMessageSelect].button_jscode}

                                  />
                                </div>
                                {/* <Button className="ss-bot-setting-condition-keep-button">
                                    keep
                                  </Button> */
                                }
                              </div>
                              {dataMessages[indexMessageSelect].button_jscode &&
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                  <div className='ss-user-setting__item-bottom' style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}>
                                    jscode
                                  </div>
                                  <div className="ss-user-setting__item-bottom">
                                    <textarea
                                      style={{ width: '95%' }}
                                      className="ss-user-setting-item-textarea-label ss-input-value"
                                      placeholder="テキスト"
                                      rows="5"
                                      value={dataMessages[indexMessageSelect].jscode}
                                      onChange={(e) => {
                                        dataMessages[indexMessageSelect].jscode = e.target.value;
                                        setDataMessages([...dataMessages]);
                                      }}
                                    />
                                  </div>
                                </div>
                              }
                            </div>
                            <div className="ss-user-setting-condition-container">
                              <div className="ss-bot-setting-condition-header">
                                <div className="ss-bot-setting-condition-header-left">
                                  <span style={{ fontWeight: '400' }}>表示対象者の条件設定</span>
                                  <MDBIcon far icon="question-circle" style={{ color: '#FF7E00', padding: '10px' }} />
                                  <span className="ss-bot-setting-condition-icon-label">Standard</span>
                                  <span className="ss-bot-setting-condition-icon-label" style={{ width: '50px', backgroundColor: '#7A52A3' }}>Pro</span>
                                </div>
                                <div className="ss-bot-setting-condition-header-right">
                                  {isConditionUp ? <MDBIcon fas icon="caret-up" onClick={() => handlePannelCondition(false, 'user')} /> : <MDBIcon fas icon="caret-down" onClick={() => handlePannelCondition(true, 'user')} />}
                                </div>
                              </div>
                              <div className="ss-bot-setting-condition-sub-header">
                                <span style={{ fontWeight: '400' }}>※設定すると、条件に当てはまるユーザーに対してのみ表示されます。</span>
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
                                    {isConditionUp &&
                                  <div className="ss-bot-setting-condition-add-condition-button">
                                    <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
                                      条件追加
                                    </Button>
                                  </div>
                                }
                                </div>
                              }
                            </div>
                          </div>

                        </div>
                      )}
                    </React.Fragment>
                  }
                </ScenarioMessageDetailPanel>
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
      <ScenarioCustomCssModal />
      <ScenarioCustomJsModal />
      <ScenarioTimerModal />
      <ScenarioErrMsgJsModal />
      <ModalShort open={isOpenAddVariable} onClose={() => setIsOpenAddVariable(false)}>
        <div className="sl-popup-create-scenario-wrapper">
          <h4>変数追加</h4>
          <div style={{ marginBottom: '10px' }}>
            <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px' }}>変数名</span>
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
            <span style={{ width: '100px' }}>デフォルト名</span>
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
              閉じる
            </Button>
            <Button
              style={{ backgroundColor: '#024BB9' }}
              className="ss-popup-add-variable-input-keep-button"
              onClick={() => createVariable()}
            >
              保存
            </Button>
          </div>
        </div>
      </ModalShort>
      <ModalShort open={isOpenFileReference} onClose={() => setIsOpenFileReference(false)}>
        <div className="ss-popup-file-reference-scenario">
          <FileReferencePopup
            onCancel={() => {
              setIsOpenFileReference(false)
              setAcceptFile();
            }}
            acceptFile={acceptFile}
            onReferFile={(file_url) => {
              if (dataMessages[indexMessageSelect].belong_to === 'user') {
                if (varFileReference.indexChildSubContentType !== undefined) {
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
      <ModalShort open={isOpenShopifyReference} onClose={() => setIsOpenShopifyReference(false)}>
        <div className="ss-popup-shopify-reference-scenario">
          <ShopifyReferencePopup
              onCancel={() => {
                setIsOpenShopifyReference(false)
              }}
              onReferProductVariant={(productVariantId, displayName) => {
                if (dataMessages[indexMessageSelect].belong_to === 'user') {
                  if (varFileReference.indexChildSubContentType !== undefined) {
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, productVariantId, varShopifyReference.subContentType, varShopifyReference.indexSubContentType, varShopifyReference.childSubContentType, varShopifyReference.indexChildSubContentType, varShopifyReference.productVariantId);
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, displayName, varShopifyReference.subContentType, varShopifyReference.indexSubContentType, varShopifyReference.childSubContentType, varShopifyReference.indexChildSubContentType, varShopifyReference.displayName);
                  } else if (varFileReference.childSubContentType !== undefined) {
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, productVariantId, varShopifyReference.subContentType, varShopifyReference.childSubContentType, varShopifyReference.indexSubContent, varShopifyReference.productVariantId);
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, displayName, varShopifyReference.subContentType, varShopifyReference.childSubContentType, varShopifyReference.indexSubContent, varShopifyReference.displayName);
                  } else {
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, productVariantId, varShopifyReference.subContentType, varShopifyReference.indexSubContent, varShopifyReference.productVariantId);
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, displayName, varShopifyReference.subContentType, varShopifyReference.indexSubContent, varShopifyReference.displayName);
                  }
                } else {
                  onChangeValueMessageContent(indexMessageSelect, 0, messageType, productVariantId, 'content')
                }
                setIsOpenShopifyReference(false)
              }}
          />
        </div>
      </ModalShort>
      {isOpenPreview && (
        scenarioType === 'faq' ? (
          <PreviewFaq />
        ) : (
          <Preview isOpen={isOpenPreview} onOpenPreview={(isOpen) => handleOpenPreview(isOpen)} isFromScenario={true} />
        )
      )}
    </div>
  );
};

export default ScenarioEditorContent;