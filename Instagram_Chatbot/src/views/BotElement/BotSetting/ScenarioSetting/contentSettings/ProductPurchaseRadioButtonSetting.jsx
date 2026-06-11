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

const ProductPurchaseRadioButtonSetting = ({ indexMessageSelect, indexContent, content }) => {
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

  const productPurchaseRadioButton = content.product_purchase_radio_button;

  return (
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
  );
};

export default ProductPurchaseRadioButtonSetting;
