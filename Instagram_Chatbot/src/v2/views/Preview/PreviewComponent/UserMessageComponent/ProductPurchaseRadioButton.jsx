/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import { Radio } from 'antd';
import {
  ALT_EMPTY,
  EMPTY_STRING,
  PREVIEW_MESSAGE_CONTENT_TYPES,
  PRICE_PREFIX,
  PRICE_SUFFIX,
  PRODUCT_NUMBER_PREFIX,
  PRODUCT_PURCHASE_TYPE,
  REQUIRED_FIELD_LABEL,
} from '../Constants';


const ProductPurchaseRadioButton = ({
  content,
  contentIndex,
  messageIndex,
  disabled,
  errors,
  onChangeValue,
}) => {
  const productPurchaseRadioButton = content.product_purchase_radio_button;
  if (!content || content.type !== PREVIEW_MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_RADIO_BUTTON || !productPurchaseRadioButton) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(productPurchaseRadioButton.title_require ||
                      productPurchaseRadioButton.require) && (
                      <div
                        className="ss-message__content--user-checkbox-top chat-log-um-mb-0"
                    
                      >
                        {productPurchaseRadioButton.title_require && (
                          <span className="ss-message__content--user-checkbox-title">
                            {productPurchaseRadioButton.title}
                          </span>
                        )}
                        {productPurchaseRadioButton.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_FIELD_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div>
                      {productPurchaseRadioButton.type ===
                        PRODUCT_PURCHASE_TYPE.TEXT_WITH_THUMBNAIL_IMAGE && (
                        <React.Fragment>
                          <Radio.Group
                            className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width chat-log-um-field-full"
                        
                            disabled={disabled}
                            onChange={(value) => {
                              onChangeValue(
                                contentIndex,
                                content.type,
                                value.target.value,
                                "initial_selection"
                              );
                            }}
                            value={productPurchaseRadioButton.initial_selection}
                          >
                            {productPurchaseRadioButton.products.map(
                              (itemProduct, indexProduct) => {
                                return (
                                  <Radio
                                    value={itemProduct.id}
                                    key={indexProduct}
                                  >
                                    <div className="ss-user-overview-product-purchase-container">
                                      <div className="ss-user-preivew-product-purchase-img">
                                        <img alt={ALT_EMPTY} src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchaseRadioButton.product_name_display ||
                                        productPurchaseRadioButton.price_display ||
                                        productPurchaseRadioButton.product_number_display) && (
                                        <div className="ss-user-preivew-product-purchase-infor">
                                          {productPurchaseRadioButton.product_name_display &&
                                            itemProduct.title && (
                                              <div className="ss-user-overview-product-purchase-infor-title">
                                                {itemProduct.title}
                                              </div>
                                            )}
                                          {productPurchaseRadioButton.product_number_display &&
                                            itemProduct.item_number && (
                                              <div className="ss-user-overview-product-purchase-infor-item-number">
                                                {PRODUCT_NUMBER_PREFIX}{itemProduct.item_number}
                                              </div>
                                            )}
                                          {itemProduct.price_display_custom ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              {itemProduct.price_display_custom}
                                            </div>
                                          ) : (
                                            productPurchaseRadioButton.price_display &&
                                            itemProduct.item_price && (
                                              <div className="ss-user-overview-product-purchase-infor-price">
                                                {PRICE_PREFIX}{itemProduct.item_price}{PRICE_SUFFIX}
                                              </div>
                                            )
                                          )}
                                          {/* {productPurchaseRadioButton.multiple_item_purchase &&
                                          <div className="ss-user-overview-product-purchase-infor-price">
                                            Multiple item purchase
                                          </div>
                                        } */}
                                        </div>
                                      )}
                                    </div>
                                  </Radio>
                                );
                              }
                            )}
                          </Radio.Group>
                        </React.Fragment>
                      )}
                      {productPurchaseRadioButton.type === PRODUCT_PURCHASE_TYPE.TEXT_WITH_IMAGE && (
                        <React.Fragment>
                          <Radio.Group
                            className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width chat-log-um-field-full"
                        
                            disabled={disabled}
                            value={productPurchaseRadioButton.initial_selection}
                            onChange={(value) => {
                              onChangeValue(
                                contentIndex,
                                content.type,
                                value.target.value,
                                "initial_selection"
                              );
                            }}
                          >
                            {productPurchaseRadioButton.products.map(
                              (itemProduct, indexProduct) => {
                                return (
                                  <Radio
                                    value={itemProduct.id}
                                    key={indexProduct}
                                  >
                                    <div className="ss-user-overview-product-purchase-container-type-text_image">
                                      <div className="ss-user-overview-product-purchase-img-type-text_image">
                                        <img alt={ALT_EMPTY} src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchaseRadioButton.product_name_display ||
                                        productPurchaseRadioButton.price_display ||
                                        productPurchaseRadioButton.product_number_display) && (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          {productPurchaseRadioButton.product_name_display &&
                                          itemProduct.title
                                            ? itemProduct.title
                                            : EMPTY_STRING}{" "}
                                          {productPurchaseRadioButton.product_number_display &&
                                          itemProduct.item_number
                                            ? itemProduct.item_number
                                            : EMPTY_STRING}{" "}
                                          {itemProduct.price_display_custom
                                            ? itemProduct.price_display_custom
                                            : productPurchaseRadioButton.price_display &&
                                              itemProduct.item_price
                                            ? `${itemProduct.item_price}${PRICE_SUFFIX}`
                                            : EMPTY_STRING}
                                        </div>
                                      )}
                                    </div>
                                  </Radio>
                                );
                              }
                            )}
                          </Radio.Group>
                        </React.Fragment>
                      )}
                      {productPurchaseRadioButton.type ===
                        PRODUCT_PURCHASE_TYPE.CONSUME_API_RESPONSE && <></>}
                      {errors?.[
                        `message${messageIndex}_content${contentIndex}_${content.type}`
                      ] && (
                        <div className="chat-log-um-error" >
                          {
                            errors?.[
                              `message${messageIndex}_content${contentIndex}_${content.type}`
                            ]
                          }
                        </div>
                      )}
                    </div>
                  </div>
  );
};

ProductPurchaseRadioButton.propTypes = {
  content: PropTypes.object,
  contentIndex: PropTypes.number,
  messageIndex: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default ProductPurchaseRadioButton;
