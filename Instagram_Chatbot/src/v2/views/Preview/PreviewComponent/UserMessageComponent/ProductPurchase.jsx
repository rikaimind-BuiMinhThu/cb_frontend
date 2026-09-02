/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import InputNum from 'v2/components/BotMessages/InputNum';
import { Checkbox, Radio } from 'antd';
import {
  ALT_EMPTY,
  EMPTY_STRING,
  PREVIEW_MESSAGE_CONTENT_TYPES,
  PRICE_PREFIX,
  PRICE_SUFFIX,
  PRODUCT_NUMBER_PREFIX,
  PRODUCT_PURCHASE_TYPE,
  QUANTITY_PREFIX,
  QUANTITY_SUFFIX,
  REQUIRED_FIELD_LABEL,
} from '../Constants';


const ProductPurchase = ({
  content,
  contentIndex,
  messageIndex,
  disabled,
  errors,
  onChangeValue,
}) => {
  const productPurchase = content.product_purchase;
  if (!content || content.type !== PREVIEW_MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE || !productPurchase) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(productPurchase.title_require || productPurchase.require) && (
                      <div
                        className="ss-message__content--user-checkbox-top chat-log-um-mb-0"
                    
                      >
                        {productPurchase.title_require && (
                          <span className="ss-message__content--user-checkbox-title">
                            {productPurchase.title}
                          </span>
                        )}
                        {productPurchase.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_FIELD_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div>
                      {productPurchase.type === PRODUCT_PURCHASE_TYPE.TEXT_WITH_THUMBNAIL_IMAGE &&
                        (productPurchase.multiple_item_purchase ? (
                          <React.Fragment>
                            <Checkbox.Group
                              className="ss-user-preivew-product-purchase-checkbox-group ss-user-preivew-product-purchase-style-width chat-log-um-field-full"
                          
                              disabled={disabled}
                              value={productPurchase.initial_selection}
                            >
                              {productPurchase.products.map(
                                (itemProduct, indexProduct) => {
                                  return (
                                    <div
                                      key={indexProduct}
                                      className="chat-log-um-option-box" 
                                    >
                                      <Checkbox
                                        value={itemProduct.id}
                                        className="chat-log-um-borderless" 
                                        onChange={() => {
                                          const selectArr = productPurchase.initial_selection.includes(itemProduct.id)
                                            ? productPurchase.initial_selection.filter(
                                              (item) => item !== itemProduct.id,
                                            )
                                            : [...productPurchase.initial_selection, itemProduct.id];
                                          onChangeValue(
                                            contentIndex,
                                            content.type,
                                            selectArr,
                                            "initial_selection"
                                          );
                                          // onChangeValueMessageContent(messageIndexSelect, contentIndex, content.type, value, 'products', indexProduct, 'price_display_custom')
                                        }}
                                      >
                                        <div className="ss-user-overview-product-purchase-container">
                                          <div className="ss-user-preivew-product-purchase-img">
                                            <img src={itemProduct.img_url} alt={ALT_EMPTY} />
                                          </div>
                                          {(productPurchase.product_name_display ||
                                            productPurchase.price_display ||
                                            productPurchase.product_number_display) && (
                                            <div className="ss-user-preivew-product-purchase-infor">
                                              {productPurchase.product_name_display &&
                                                itemProduct.title && (
                                                  <div className="ss-user-overview-product-purchase-infor-title">
                                                    {itemProduct.title}
                                                  </div>
                                                )}
                                              {productPurchase.product_number_display &&
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
                                                productPurchase.price_display &&
                                                itemProduct.item_price && (
                                                  <div className="ss-user-overview-product-purchase-infor-price">
                                                    {PRICE_PREFIX}{itemProduct.item_price}{" "}
                                                   {PRICE_SUFFIX}
                                                  </div>
                                                )
                                              )}
                                              {(productPurchase.quantity_designation_all ||
                                                itemProduct.is_quantity_designation) &&
                                              itemProduct.quantity_limit ? (
                                                <div className="ss-user-overview-product-purchase-infor-price">
                                                  {QUANTITY_PREFIX}
                                                  {itemProduct.quantity_limit}{QUANTITY_SUFFIX}
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </Checkbox>
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) && (
                                        <div>
                                          <InputNum
                                            className="sp-product-purchase-custom-input-quantity chat-log-um-field-46-ml"
                                        
                                            value={itemProduct.quantity_select}
                                            onChange={(value) => {
                                              const selectArr = [
                                                ...productPurchase.initial_selection,
                                              ];
                                              if (
                                                !selectArr.includes(
                                                  itemProduct.id
                                                ) &&
                                                value
                                              ) {
                                                selectArr.push(itemProduct.id);
                                                onChangeValue(
                                                  contentIndex,
                                                  content.type,
                                                  selectArr,
                                                  "initial_selection"
                                                );
                                              }
                                              onChangeValue(
                                                contentIndex,
                                                content.type,
                                                value,
                                                "products",
                                                indexProduct,
                                                "quantity_select"
                                              );
                                            }}
                                            controls={false}
                                            min={1}
                                            disabled={disabled}
                                            max={
                                              itemProduct.quantity_limit ||
                                              Number.MAX_SAFE_INTEGER
                                            }
                                            addonAfter={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select <
                                                      (itemProduct.quantity_limit ||
                                                        Number.MAX_SAFE_INTEGER)
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select +
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      selectArr.push(
                                                        itemProduct.id
                                                      );
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        selectArr,
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                +
                                              </div>
                                            }
                                            addonBefore={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select >
                                                      1
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select -
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      selectArr.push(
                                                        itemProduct.id
                                                      );
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        selectArr,
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                -
                                              </div>
                                            }
                                          />
                                          {errors?.[
                                            `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                          ] && (
                                            <div
                                              className="chat-log-um-error-indent" 
                                            >
                                              {
                                                errors?.[
                                                  `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                                ]
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </Checkbox.Group>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Radio.Group
                              className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width chat-log-um-field-full"
                          
                              disabled={disabled}
                              value={productPurchase.initial_selection[0]}
                            >
                              {productPurchase.products.map(
                                (itemProduct, indexProduct) => {
                                  return (
                                    <div
                                      className="chat-log-um-option-box" 
                                      key={indexProduct}
                                    >
                                      <Radio
                                        value={itemProduct.id}
                                        className="chat-log-um-borderless" 
                                        onChange={() => {
                                          const dataValue = productPurchase.initial_selection.includes(itemProduct.id) ? [] : [itemProduct.id];
                                          onChangeValue(
                                            contentIndex,
                                            content.type,
                                            dataValue,
                                            "initial_selection"
                                          );
                                        }}
                                      >
                                        <div className="ss-user-overview-product-purchase-container">
                                          <div className="ss-user-preivew-product-purchase-img">
                                            <img alt={ALT_EMPTY} src={itemProduct.img_url} />
                                          </div>
                                          {(productPurchase.product_name_display ||
                                            productPurchase.price_display ||
                                            productPurchase.product_number_display) && (
                                            <div className="ss-user-preivew-product-purchase-infor">
                                              {productPurchase.product_name_display &&
                                                itemProduct.title && (
                                                  <div className="ss-user-overview-product-purchase-infor-title">
                                                    {itemProduct.title}
                                                  </div>
                                                )}
                                              {productPurchase.product_number_display &&
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
                                                productPurchase.price_display &&
                                                itemProduct.item_price && (
                                                  <div className="ss-user-overview-product-purchase-infor-price">
                                                    {PRICE_PREFIX}{itemProduct.item_price}{" "}
                                                   {PRICE_SUFFIX}
                                                  </div>
                                                )
                                              )}
                                              {(productPurchase.quantity_designation_all ||
                                                itemProduct.is_quantity_designation) &&
                                              itemProduct.quantity_limit ? (
                                                <div className="ss-user-overview-product-purchase-infor-price">
                                                  {QUANTITY_PREFIX}
                                                  {itemProduct.quantity_limit}{QUANTITY_SUFFIX}
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {/* {productPurchase.multiple_item_purchase &&
                                          <div className="ss-user-overview-product-purchase-infor-price">
                                            Multiple item purchase
                                          </div>
                                        } */}
                                            </div>
                                          )}
                                        </div>
                                      </Radio>
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) && (
                                        <div>
                                          <InputNum
                                            className="sp-product-purchase-custom-input-quantity chat-log-um-field-46-ml"
                                        
                                            value={itemProduct.quantity_select}
                                            onChange={(value) => {
                                              const selectArr = [
                                                ...productPurchase.initial_selection,
                                              ];
                                              if (
                                                !selectArr.includes(
                                                  itemProduct.id
                                                ) &&
                                                value
                                              ) {
                                                onChangeValue(
                                                  contentIndex,
                                                  content.type,
                                                  [itemProduct.id],
                                                  "initial_selection"
                                                );
                                              }
                                              onChangeValue(
                                                contentIndex,
                                                content.type,
                                                value,
                                                "products",
                                                indexProduct,
                                                "quantity_select"
                                              );
                                            }}
                                            controls={false}
                                            disabled={disabled}
                                            min={1}
                                            max={
                                              itemProduct.quantity_limit ||
                                              Number.MAX_SAFE_INTEGER
                                            }
                                            addonAfter={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select <
                                                      (itemProduct.quantity_limit ||
                                                        Number.MAX_SAFE_INTEGER)
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select +
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        [itemProduct.id],
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                +
                                              </div>
                                            }
                                            addonBefore={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select >
                                                      1
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select -
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        [itemProduct.id],
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                -
                                              </div>
                                            }
                                          />
                                          {errors?.[
                                            `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                          ] && (
                                            <div
                                              className="chat-log-um-error-indent" 
                                            >
                                              {
                                                errors?.[
                                                  `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                                ]
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </Radio.Group>
                          </React.Fragment>
                        ))}
                      {productPurchase.type === PRODUCT_PURCHASE_TYPE.TEXT_WITH_IMAGE &&
                        (productPurchase.multiple_item_purchase ? (
                          <React.Fragment>
                            <Checkbox.Group
                              className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-preivew-product-purchase-style-width chat-log-um-field-full"
                          
                              disabled={disabled}
                              value={productPurchase.initial_selection}
                            >
                              {productPurchase.products.map(
                                (itemProduct, indexProduct) => {
                                  return (
                                    <div
                                      key={indexProduct}
                                      className="chat-log-um-option-box" 
                                    >
                                      <Checkbox
                                        key={indexProduct}
                                        value={itemProduct.id}
                                        onChange={() => {
                                          const selectArr = productPurchase.initial_selection.includes(itemProduct.id)
                                            ? productPurchase.initial_selection.filter(
                                              (item) => item !== itemProduct.id,
                                            )
                                            : [...productPurchase.initial_selection, itemProduct.id];
                                          onChangeValue(
                                            contentIndex,
                                            content.type,
                                            selectArr,
                                            "initial_selection"
                                          );
                                          // onChangeValueMessageContent(messageIndexSelect, contentIndex, content.type, value, 'products', indexProduct, 'price_display_custom')
                                        }}
                                      >
                                        <div className="ss-user-overview-product-purchase-container-type-text_image">
                                          <div className="ss-user-overview-product-purchase-img-type-text_image">
                                            <img alt={ALT_EMPTY} src={itemProduct.img_url} />
                                          </div>
                                          {(productPurchase.product_name_display ||
                                            productPurchase.price_display ||
                                            productPurchase.product_number_display) && (
                                            <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                              {productPurchase.product_name_display &&
                                              itemProduct.title
                                                ? itemProduct.title
                                                : EMPTY_STRING}{" "}
                                              {productPurchase.product_number_display &&
                                              itemProduct.item_number
                                                ? itemProduct.item_number
                                                : EMPTY_STRING}{" "}
                                              {itemProduct.price_display_custom
                                                ? itemProduct.price_display_custom
                                                : productPurchase.price_display &&
                                                  itemProduct.item_price
                                                ? `${itemProduct.item_price}${PRICE_SUFFIX}`
                                                : EMPTY_STRING}
                                            </div>
                                          )}
                                          {(productPurchase.quantity_designation_all ||
                                            itemProduct.is_quantity_designation) &&
                                          itemProduct.quantity_limit ? (
                                            <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                              {QUANTITY_PREFIX}{itemProduct.quantity_limit}
                                              {QUANTITY_SUFFIX}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </Checkbox>
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) && (
                                        <div>
                                          <InputNum
                                            className="sp-product-purchase-custom-input-quantity chat-log-um-field-46"
                                            value={itemProduct.quantity_select}
                                            onChange={(value) => {
                                              const selectArr = [
                                                ...productPurchase.initial_selection,
                                              ];
                                              if (
                                                !selectArr.includes(
                                                  itemProduct.id
                                                ) &&
                                                value
                                              ) {
                                                selectArr.push(itemProduct.id);
                                                onChangeValue(
                                                  contentIndex,
                                                  content.type,
                                                  selectArr,
                                                  "initial_selection"
                                                );
                                              }
                                              onChangeValue(
                                                contentIndex,
                                                content.type,
                                                value,
                                                "products",
                                                indexProduct,
                                                "quantity_select"
                                              );
                                            }}
                                            controls={false}
                                            min={1}
                                            disabled={disabled}
                                        
                                            max={
                                              itemProduct.quantity_limit ||
                                              Number.MAX_SAFE_INTEGER
                                            }
                                            addonAfter={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select <
                                                      (itemProduct.quantity_limit ||
                                                        Number.MAX_SAFE_INTEGER)
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select +
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      selectArr.push(
                                                        itemProduct.id
                                                      );
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        selectArr,
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                +
                                              </div>
                                            }
                                            addonBefore={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select >
                                                      1
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select -
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      selectArr.push(
                                                        itemProduct.id
                                                      );
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        selectArr,
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                -
                                              </div>
                                            }
                                          />
                                          {errors?.[
                                            `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                          ] && (
                                            <div
                                              className="chat-log-um-error-11" 
                                            >
                                              {
                                                errors?.[
                                                  `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                                ]
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </Checkbox.Group>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Radio.Group
                              className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width chat-log-um-field-full"
                          
                              disabled={disabled}
                              onChange={(e) => {
                                const dataValue = productPurchase.initial_selection.includes(e.target.value) ? [] : [e.target.value];
                                onChangeValue(
                                  contentIndex,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );
                              }}
                              value={productPurchase.initial_selection[0]}
                            >
                              {productPurchase.products.map(
                                (itemProduct, indexProduct) => {
                                  return (
                                    <div
                                      className="chat-log-um-option-box" 
                                      key={indexProduct}
                                    >
                                      <Radio
                                        value={itemProduct.id}
                                        key={indexProduct}
                                      >
                                        <div className="ss-user-overview-product-purchase-container-type-text_image">
                                          <div className="ss-user-overview-product-purchase-img-type-text_image">
                                            <img alt={ALT_EMPTY} src={itemProduct.img_url} />
                                          </div>
                                          {(productPurchase.product_name_display ||
                                            productPurchase.price_display ||
                                            productPurchase.product_number_display) && (
                                            <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                              {productPurchase.product_name_display &&
                                              itemProduct.title
                                                ? itemProduct.title
                                                : EMPTY_STRING}{" "}
                                              {productPurchase.product_number_display &&
                                              itemProduct.item_number
                                                ? itemProduct.item_number
                                                : EMPTY_STRING}{" "}
                                              {itemProduct.price_display_custom
                                                ? itemProduct.price_display_custom
                                                : productPurchase.price_display &&
                                                  itemProduct.item_price
                                                ? `${itemProduct.item_price}${PRICE_SUFFIX}`
                                                : EMPTY_STRING}
                                            </div>
                                          )}
                                          {(productPurchase.quantity_designation_all ||
                                            itemProduct.is_quantity_designation) &&
                                          itemProduct.quantity_limit ? (
                                            <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                              {QUANTITY_PREFIX}{itemProduct.quantity_limit}
                                              {QUANTITY_SUFFIX}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </Radio>
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) && (
                                        <div>
                                          <InputNum
                                            className="sp-product-purchase-custom-input-quantity chat-log-um-field-46"
                                        
                                            disabled={disabled}
                                            value={itemProduct.quantity_select}
                                            onChange={(value) => {
                                              const selectArr = [
                                                ...productPurchase.initial_selection,
                                              ];
                                              if (
                                                !selectArr.includes(
                                                  itemProduct.id
                                                ) &&
                                                value
                                              ) {
                                                onChangeValue(
                                                  contentIndex,
                                                  content.type,
                                                  [itemProduct.id],
                                                  "initial_selection"
                                                );
                                              }
                                              onChangeValue(
                                                contentIndex,
                                                content.type,
                                                value,
                                                "products",
                                                indexProduct,
                                                "quantity_select"
                                              );
                                            }}
                                            controls={false}
                                            min={1}
                                            max={
                                              itemProduct.quantity_limit ||
                                              Number.MAX_SAFE_INTEGER
                                            }
                                            addonAfter={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select <
                                                      (itemProduct.quantity_limit ||
                                                        Number.MAX_SAFE_INTEGER)
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select +
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        [itemProduct.id],
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                +
                                              </div>
                                            }
                                            addonBefore={
                                              <div
                                                className="chat-log-um-option-pad" 
                                                onClick={() => {
                                                  if (!disabled) {
                                                    if (
                                                      itemProduct.quantity_select >
                                                      1
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        itemProduct.quantity_select -
                                                          1,
                                                        "products",
                                                        indexProduct,
                                                        "quantity_select"
                                                      );
                                                    }
                                                    const selectArr = [
                                                      ...productPurchase.initial_selection,
                                                    ];
                                                    if (
                                                      !selectArr.includes(
                                                        itemProduct.id
                                                      )
                                                    ) {
                                                      onChangeValue(
                                                        contentIndex,
                                                        content.type,
                                                        [itemProduct.id],
                                                        "initial_selection"
                                                      );
                                                    }
                                                  }
                                                }}
                                              >
                                                -
                                              </div>
                                            }
                                          />
                                          {errors?.[
                                            `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                          ] && (
                                            <div
                                              className="chat-log-um-error-11" 
                                            >
                                              {
                                                errors?.[
                                                  `message${messageIndex}_content${contentIndex}_${content.type}_${indexProduct}`
                                                ]
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </Radio.Group>
                          </React.Fragment>
                        ))}
                      {productPurchase.type === PRODUCT_PURCHASE_TYPE.CONSUME_API_RESPONSE && <></>}
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

ProductPurchase.propTypes = {
  content: PropTypes.object,
  contentIndex: PropTypes.number,
  messageIndex: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default ProductPurchase;
