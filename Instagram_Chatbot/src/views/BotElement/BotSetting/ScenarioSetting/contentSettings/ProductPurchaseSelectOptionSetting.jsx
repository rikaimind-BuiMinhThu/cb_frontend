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

const ProductPurchaseSelectOptionSetting = ({ indexMessageSelect, indexContent, content }) => {
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

  const productPurchaseSelectOption = content.product_purchase_select_option;

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default ProductPurchaseSelectOptionSetting;
