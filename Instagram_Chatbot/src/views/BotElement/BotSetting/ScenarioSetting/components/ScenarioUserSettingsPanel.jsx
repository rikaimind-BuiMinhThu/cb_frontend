import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputNum from '../scenarioComon/InputNum';
import InputDouble from '../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import moment from 'moment';
import api from '../../../../../api/api-management';
import Cookies from 'js-cookie';
import ModalNoti from '../../../../Popup/ModalNoti';
import ModalShort from '../../../../Popup/ModalShort';
import Preview from '../../Preview';
import PreviewFaq from '../../PreviewFaq';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  S3_UPLOAD_URL,
  FUKUSHASHIKI_SEARCH_MODE_OPTIONS,
  FUKUSHASHIKI_SEARCH_VALUE_LABELS,
} from '../../../../../variables/constants';
import { tokenExpired } from 'api/tokenExpired';
import DatePickerCustom from '../scenarioComon/DatePickerCustom';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import { HtmlCodeMessage } from '../../../../../components/BotMessages';
import CheckboxGroupCustom from '../scenarioComon/CheckboxGroupCustom';
import shopifIcon from '../../../../../assets/img/shopify-icon.png';
import nanoMetadata from 'nano-metadata';
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'moment/locale/zh-cn';
import ShopifyReferenceSelect from '../ShopifyReferenceSelect';
import { Tooltip } from '@mui/material';
import { MESSAGE_CONTENT_TYPES, TIMER_TYPES, TIMER_VARIABLES, TIMER_VARIABLES_DESCRIPTION, BOT_MESSAGE_TYPES, RANGE_TEXT_VALIDATE, LABELS, GENDER_DISPLAY_TYPES, CART_SYSTEM } from '../../PreviewComponent/Constants';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import OptionGenderConfig from '../OptionGenderConfig';
import SubmitButtonLoadingConfig from '../SubmitButtonLoadingConfig';
import SubmitButtonConfig from '../SubmitButtonConfig';
import ZipCodeAddressSetting from '../Settings/ZipCodeAddressSetting';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { PREVIEW_MAP } from '../contentPreviews';
import { renderFukushashikiSetting } from '../ScenarioUtils';
import PaymentDisplayStyleSection from './PaymentDisplayStyleSection';
import { PAYMENT_OPTION_IMAGE_FIELDS } from '../constants/paymentStyleConstants';
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
} from '../constants/scenarioFormConstants';
import {
  DELIVERY_CUT_OFF_SELECT_NONE,
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewRelativeRangeEnabled,
  isCalendarPreviewDaysSplitEnabled,
  deliveryCutOffTimeSelectValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  mergePreviewRelativeCalendar,
} from '../utils/scenarioCalendarUtils';
import { cleanMessageTimerConfig } from '../utils/scenarioApiUtils';
import { settingsCarousel } from './scenarioCarouselSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioConditionsPanel from './ScenarioConditionsPanel';
import ScenarioCustomCssModal from './modals/ScenarioCustomCssModal';
import ScenarioCustomJsModal from './modals/ScenarioCustomJsModal';
import ScenarioTimerModal from './modals/ScenarioTimerModal';
import ScenarioErrMsgJsModal from './modals/ScenarioErrMsgJsModal';

const { Option } = Select;
const _ = require('lodash');

const ScenarioUserSettingsPanel = () => {
  const panel = useScenarioPanelDestructuring();
  const {
    scenarioName, scenarioType, urlThanks, merchandiseId, lpProductUrl, coupon,
    isUseOnlyRegularOrder, isUseFukushashiki, isUseCustomCss, customCssContent,
    isUsedCartConfirmPage, urlCartConfirmPage, isOpenModalCustomCss, isUseCustomJsCode,
    headCustomJsCode, topBodyCustomJsCode, bottomBodyCustomJsCode, isOpenModalCustomJsCode,
    timerConfig, errMsgJsCode, isOpenErrMsgByJsSettingModal, isUseErrMsgByJs,
    errorScenarioName, belongTo, messageType, indexMessageSelect, dataInputVar,
    isOpenPreview, varFileReference, isOpenFileReference, indexCarouselSlide,
    varShopifyReference, isOpenShopifyReference, botTextValue, isOpenAddVariable,
    fileError, fileErrorCarousel, dataMessages, dataPrefectures, dataCity,
    botId, scenarioId, isOpenNoti, messageNoti, dataEmail, isConditionUp,
    conditions, variableName, defaultValue, acceptFile, dataHour, dataMinutes,
    dataEveryMinute, dataYear, dataMonth, dataDay, errorVariable, dataCondition,
    isUsedMessageLoadedPast, isUsedCrosssell, productIdCrossSell,
    isClearLandingPageSession, isUseBtnUpdateTracking, useFullwidthChatbotMobile,
    clientCartSystem, listProductVariants, isShopifyPaymentScenario,
    setScenarioName, setScenarioType, setUrlThanks, setMerchandiseId, setLpProductUrl,
    setCoupon, setIsUseOnlyRegularOrder, setIsUseFukushashiki, setIsUseCustomCss,
    setCustomCssContent, setIsUsedCartConfirmPage, setUrlCartConfirmPage,
    setIsOpenModalCustomCss, setIsUseCustomJsCode, setHeadCustomJsCode,
    setTopBodyCustomJsCode, setBottomBodyCustomJsCode, setIsOpenModalCustomJsCode,
    setTimerConfig, setErrMsgJsCode, setIsOpenErrMsgByJsSettingModal, setIsUseErrMsgByJs,
    setErrorScenarioName, setBelongTo, setMessageType, setIndexMessageSelect,
    setDataInputVar, setIsOpenPreview, setVarFileReference, setIsOpenFileReference,
    setIndexCarouselSlide, setVarShopifyReference, setIsOpenShopifyReference,
    setBotTextValue, setIsOpenAddVariable, setFileError, setFileErrorCarousel,
    setDataMessages, setDataPrefectures, setDataCity, setBotId, setScenarioId,
    setIsOpenNoti, setMessageNoti, setDataEmail, setIsConditionUp, setConditions,
    setVariableName, setDefaultValue, setAcceptFile, setDataHour, setDataMinutes,
    setDataEveryMinute, setDataYear, setDataMonth, setDataDay, setErrorVariable,
    setDataCondition, setIsUsedMessageLoadedPast, setIsUsedCrosssell,
    setProductIdCrossSell, setIsClearLandingPageSession, setIsUseBtnUpdateTracking,
    setUseFullwidthChatbotMobile, setClientCartSystem, setListProductVariants,
    handleGetMessage, onClickSaveScenario, onClickSavePreview, getListVariable,
    handleOpenPreview,
    onChangeValueMessageContent, onChangeTimePullDown, onChangeValueNameMessage,
    botUploadFile, carouselUploadFile, getBaseUrl, handleSelectMessage, handleHiddenMessage,
    handleSelectContentMessage, handleEditIconClick, handleChangeBotStatementType,
    handleAddItemSetting, handleCopyMessage, handleDeleteMessageContent, handleDeleteMessage,
    handleAddItemRadioCheckbox, handleAddItemCustomizePullDown, handleAddItemProductPullDown,
    handleAddItemAgreeTerm, handleDragEnd, handleDragEndMessageOverview,
    handleDragEndRadioCheckbox, handleDragEndPullDown, handleDragEndProduct,
    onChangeFixedDate, handleChangeValueRequireZipCode, handleRemoveItemContent,
    handleRemoveItemCustomizePullDown, handleRemoveItemProductPullDown,
    handleRemoveItemZipCodeAddress, createVariable, onClickCreateStatement,
    handlePannelCondition, onChangeValueCondition, onClickAddCondition,
    handleDeleteCondition, handleDownloadFile, isColor,
    renderPaymentMethodDescriptionInput, renderRootFaqOption, renderAddressField,
    renderBuildingName, renderMunicipality, renderPostCode, renderZipCodeAddressTitle,
    renderPrefecture, renderLPIntegrationOptionSetting, renderLPIntegrationOptionPreview,
    renderTextInputPasswordConfirmationPreview, renderPreviewPulldownfromJs,
    renderDetailSettingPulldownFromJs,
  } = panel;

  const selectedMessage = dataMessages?.[indexMessageSelect];

  return (
    <>
                      {selectedMessage && belongTo === 'user' && (
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
                                                  }) : null}

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
                            <ScenarioConditionsPanel variant="user" />
                          </div>

                        </div>
                      )}
    </>
  );
};

export default ScenarioUserSettingsPanel;
