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

const SliderSetting = ({ indexMessageSelect, indexContent, content }) => {
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

  const slider = content.slider;

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default SliderSetting;
