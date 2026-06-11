import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputNum from '../scenarioComon/InputNum';
import InputDouble from '../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import moment from 'moment';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import CheckboxGroupCustom from '../scenarioComon/CheckboxGroupCustom';
import shopifIcon from '../../../../../assets/img/shopify-icon.png';
import locale from 'antd/es/date-picker/locale/ja_JP';
import ShopifyReferenceSelect from '../ShopifyReferenceSelect';
import { Tooltip } from '@mui/material';
import { MESSAGE_CONTENT_TYPES, LABELS, GENDER_DISPLAY_TYPES, CART_SYSTEM } from '../../PreviewComponent/Constants';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import OptionGenderConfig from '../OptionGenderConfig';
import PaymentDisplayStyleSection from '../components/PaymentDisplayStyleSection';
import { PAYMENT_OPTION_IMAGE_FIELDS } from '../constants/paymentStyleConstants';
import DatePickerCustom from '../scenarioComon/DatePickerCustom';
import {
  dataPaymentMethod, dataHourFixed, dataMinutesFixed, dataEveryMinuteFixed,
  dataYearFixed, dataMonthFixed, dataDayFixed, dataMaxRangSlider,
  dataConsumeApiResponse, agreeTermType, dataTypeFile, dataSubCondition,
  installmentOptions, carouselType, typeCalendar, dropDownTitle,
  convertTextType, typeTextarea, typeRadio, rangeText, hyphenPhoneNumber,
  typeCheckbox, dataTypePullDown, dataSelectDateTime, dataConditionFixed,
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
import { settingsCarousel } from '../components/scenarioCarouselSettings';
import { useScenarioContentSettingProps } from '../hooks/useScenarioContentSettingProps';

const { Option } = Select;

const CreditCardPaymentSetting = ({ indexMessageSelect, indexContent, content }) => {
  const {
    dataMessages, setDataMessages, onChangeValueMessageContent, renderRootFaqOption,
    dataInputVar, setIsOpenAddVariable, isUseFukushashiki, handleDragEndRadioCheckbox,
    handleRemoveItemContent, handleAddItemRadioCheckbox, setIsOpenFileReference,
    setVarFileReference, setAcceptFile, handleDragEndPullDown, handleRemoveItemCustomizePullDown,
    handleAddItemCustomizePullDown, onChangeTimePullDown, dataHour, dataMinutes, dataEveryMinute,
    dataYear, dataMonth, dataDay, dataPrefectures, dataCity, renderLPIntegrationOptionSetting,
    renderDetailSettingPulldownFromJs, handleRemoveItemZipCodeAddress, renderAddressField,
    renderBuildingName, renderMunicipality, renderPostCode, renderZipCodeAddressTitle,
    renderPrefecture, renderPaymentMethodDescriptionInput, handleAddItemAgreeTerm,
    handleDragEndProduct, handleRemoveItemProductPullDown, handleAddItemProductPullDown,
    botUploadFile, carouselUploadFile, getBaseUrl, handleDownloadFile, isColor,
    listProductVariants, clientCartSystem, isShopifyPaymentScenario,
  } = useScenarioContentSettingProps(indexMessageSelect, indexContent, content);

  const creditCardPayment = content.credit_card_payment;

  return (
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
  );
};

export default CreditCardPaymentSetting;
