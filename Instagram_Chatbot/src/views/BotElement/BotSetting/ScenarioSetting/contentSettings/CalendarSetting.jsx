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

const CalendarSetting = ({ indexMessageSelect, indexContent, content }) => {
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

  const calendar = content.calendar;

  return (
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
  );
};

export default CalendarSetting;
