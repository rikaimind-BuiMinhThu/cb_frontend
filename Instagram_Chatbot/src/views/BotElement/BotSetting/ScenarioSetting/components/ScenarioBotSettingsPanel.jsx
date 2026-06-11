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

const ScenarioBotSettingsPanel = () => {
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
                      {selectedMessage && belongTo === 'bot' && selectedMessage.message_content?.length !== 0 && (
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
                          <ScenarioConditionsPanel variant="bot" />
                        </div>
                      )}
    </>
  );
};

export default ScenarioBotSettingsPanel;
