import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import DatePickerCustom from '../../scenarioComon/DatePickerCustom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import shopifIcon from '../../../../../../assets/img/shopify-icon.png';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { BOT_MESSAGE_TYPES } from '../../../PreviewComponent/Constants';
import { PREVIEW_MAP } from '../../contentPreviews';
import {
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewRelativeRangeEnabled,
  isCalendarPreviewDaysSplitEnabled,
  deliveryCutOffTimeSelectValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  mergePreviewRelativeCalendar,
} from '../../utils/scenarioCalendarUtils';
import { settingsCarousel } from '../scenarioCarouselSettings';

const { Option } = Select;

const UserContentPreviewList = ({ message, index, bindings }) => {
  const {
    dataHour, dataMinutes, dataYear, dataMonth, dataDay, dataPrefectures, dataCity,
    renderZipCodeAddressTitle, renderPostCode, renderPrefecture, renderMunicipality,
    renderAddressField, renderBuildingName,     renderTextInputPasswordConfirmationPreview,
    renderPreviewPulldownfromJs,
    setIndexCarouselSlide,
  } = bindings;

  return (
    <>
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
              data-id={message?.message_content[indexContent]?.['button_submit_id'] ?? content.button_submit_id}
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
    </>
  );
};

export default UserContentPreviewList;
