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

const ProductPurchaseSetting = ({ indexMessageSelect, indexContent, content }) => {
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

  const productPurchase = content.product_purchase;

  return (
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
  );
};

export default ProductPurchaseSetting;
