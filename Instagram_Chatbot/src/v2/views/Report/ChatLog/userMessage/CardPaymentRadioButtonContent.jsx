/* cSpell: disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/components/BotMessages/InputCustom';
import SelectCustom from 'v2/components/BotMessages/SelectCustom';
import InputNum from 'v2/components/BotMessages/InputNum';
import { Radio } from 'antd';
import cvcIcon from 'assets/img/cvc-icon.png';

import {
  REQUIRED_LABEL,
  PLACEHOLDER_YEAR,
  PLACEHOLDER_MONTH,
  LABEL_CARD_NUMBER,
  LABEL_CARD_HOLDER,
  LABEL_EXPIRY,
  LABEL_CVC,
  EMPTY_STRING,
  DATA_YEAR_FIXED,
  DATA_MONTH,
  ALT_EMPTY,
  CARD_PART_NUMBER_MAX,
  CARD_PAYMENT_RADIO_TYPE,
  EXPIRY_TYPE_YM,
  EXPIRY_TYPE_MY,
} from './constants';


import { focusInput } from './helpers';
import PAYMENT_METHODS from './paymentMethods';

const CardPaymentRadioButtonContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
  onClickNext,
  messageContentLength,
  displayButtonNext,
}) => {
  const card2WrapRef = useRef(null);
  const card3WrapRef = useRef(null);
  const card4WrapRef = useRef(null);
  const cardPaymentRadioButton = content.card_payment_radio_button;
  if (!cardPaymentRadioButton) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(cardPaymentRadioButton.title_require ||
                      cardPaymentRadioButton.require) && (
                      <div
                        className="ss-message__content--user-text-input-top chat-log-um-mb-0"
                    
                      >
                        {cardPaymentRadioButton.title_require && (
                          <span className="ss-message__content--user-text-input-title">
                            {cardPaymentRadioButton.title}
                          </span>
                        )}
                        {cardPaymentRadioButton.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    {cardPaymentRadioButton.type === CARD_PAYMENT_RADIO_TYPE.DEFAULT && (
                      <Radio.Group
                        className="chat-log-um-checkbox-group" 
                        disabled={true}
                        value={cardPaymentRadioButton.initial_selection}
                      >
                        {cardPaymentRadioButton.radio_contents &&
                          cardPaymentRadioButton.radio_contents.map(
                            (itemPayment, indexPayment) => {
                              return (
                                <Radio
                                  value={itemPayment.value}
                                  key={indexPayment}
                                  className="chat-log-um-product-header" 
                                  onChange={() => {
                                    const dataValue = cardPaymentRadioButton.initial_selection !== itemPayment.value ? itemPayment.value : EMPTY_STRING;
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      dataValue,
                                      "initial_selection"
                                    );

                                    if (
                                      cardPaymentRadioButton.card_linked_setting.includes(
                                        dataValue
                                      )
                                    ) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        true,
                                        "is_display_card_payment"
                                      );
                                      displayButtonNext(true);
                                    } else {
                                      displayButtonNext(false);
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        false,
                                        "is_display_card_payment"
                                      );
                                      if (messageContentLength === 1)
                                        onClickNext();
                                    }
                                  }}
                                >
                                  {itemPayment.text}
                                </Radio>
                              );
                            }
                          )}
                      </Radio.Group>
                    )}
                    {cardPaymentRadioButton.type === CARD_PAYMENT_RADIO_TYPE.CUSTOMIZED_STYLE && (
                      <Radio.Group
                        className="chat-log-um-checkbox-group" 
                        disabled={true}
                        value={cardPaymentRadioButton.initial_selection}
                        buttonStyle="solid"
                      >
                        {cardPaymentRadioButton.radio_contents &&
                          cardPaymentRadioButton.radio_contents.map(
                            (itemPayment, indexPayment) => {
                              return (
                                <Radio.Button
                                  value={itemPayment.value}
                                  key={indexPayment}
                                  className="chat-log-um-product-center" 
                                  onChange={() => {
                                    const dataValue = cardPaymentRadioButton.initial_selection !== itemPayment.value ? itemPayment.value : EMPTY_STRING;
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      dataValue,
                                      "initial_selection"
                                    );

                                    // if (cardPaymentRadioButton.card_linked_setting !== dataValue && messageContentLength === 1) {
                                    //   onClickNext();
                                    // }
                                    if (
                                      cardPaymentRadioButton.card_linked_setting.includes(
                                        dataValue
                                      )
                                    ) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        true,
                                        "is_display_card_payment"
                                      );
                                      displayButtonNext(true);
                                    } else {
                                      displayButtonNext(false);
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        false,
                                        "is_display_card_payment"
                                      );
                                      if (messageContentLength === 1)
                                        onClickNext();
                                    }
                                  }}
                                >
                                  {itemPayment.text}
                                </Radio.Button>
                              );
                            }
                          )}
                      </Radio.Group>
                    )}
                    {cardPaymentRadioButton.type === CARD_PAYMENT_RADIO_TYPE.PICTURE_RADIO &&
                      cardPaymentRadioButton.radio_contents_img &&
                      cardPaymentRadioButton.radio_contents_img.map(
                        (itemPaymentImg, indexPaymentImg) => {
                          return (
                            <div key={indexPaymentImg} className="chat-log-um-color-muted" >
                              <Radio.Group
                                disabled={true}
                                className="chat-log-um-flex-fs14 ss-user-preview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width" 
                                
                                value={
                                  cardPaymentRadioButton.initial_selection_picture
                                }
                              >
                                {itemPaymentImg.contents &&
                                  itemPaymentImg.contents.map(
                                    (itemPaymentContent, indexPaymentContent) => {
                                      return (
                                        <Radio
                                          value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                                          key={indexPaymentContent}
                                          className="chat-log-um-mr-0" 
                                          onChange={() => {
                                            const dataValue = cardPaymentRadioButton.initial_selection_picture !== `${itemPaymentImg.id}-${itemPaymentContent.id}` ? `${itemPaymentImg.id}-${itemPaymentContent.id}` : EMPTY_STRING;
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              dataValue,
                                              "initial_selection_picture"
                                            );
                                            // if (cardPaymentRadioButton.card_linked_setting_picture !== dataValue && messageContentLength === 1) {
                                            //   onClickNext();
                                            // }
                                            if (
                                              cardPaymentRadioButton.card_linked_setting_picture ===
                                              dataValue
                                            ) {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                true,
                                                "is_display_card_payment"
                                              );
                                              displayButtonNext(true);
                                            } else {
                                              displayButtonNext(false);
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                false,
                                                "is_display_card_payment"
                                              );
                                              if (messageContentLength === 1)
                                                onClickNext();
                                            }
                                          }}
                                        >
                                          <img
                                            alt={ALT_EMPTY}
                                            src={itemPaymentContent.file_url}
                                          ></img>
                                          <div
                                            className="chat-log-um-checkbox-img-text" 
                                          >
                                            {itemPaymentContent.text}
                                          </div>
                                        </Radio>
                                      );
                                    }
                                  )}
                              </Radio.Group>
                            </div>
                          );
                        }
                      )}
                    {(cardPaymentRadioButton.type !== CARD_PAYMENT_RADIO_TYPE.PICTURE_RADIO
                      ? cardPaymentRadioButton.card_linked_setting.length > 0 &&
                        cardPaymentRadioButton.card_linked_setting.includes(
                          cardPaymentRadioButton.initial_selection
                        )
                      : cardPaymentRadioButton.card_linked_setting_picture &&
                        cardPaymentRadioButton.card_linked_setting_picture ===
                          cardPaymentRadioButton.initial_selection_picture) && (
                      <React.Fragment>
                        {cardPaymentRadioButton.payment_method.length !== 0 && (
                          <div
                            className="chat-log-um-flex-start" 
                          >
                            {cardPaymentRadioButton.payment_method.map(
                              (itemPayment, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="chat-log-um-payment-icon ss-img-list-bank" 
                                    
                                  >
                                    {
                                      PAYMENT_METHODS.find(
                                        (item) => item.key === itemPayment
                                      ).value
                                    }
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                        {cardPaymentRadioButton.separate_type === false ? (
                          <div className="ss-user-setting__item-bottom">
                            {/* <InputNum
                              labelClassName="chat-log-um-field-full" 
                              className="ss-user-setting-input-limit-character chat-log-um-field-full chat-log-um-ml-0"
                              label={LABEL_CARD_NUMBER}
                              controls={false}
                              max={Number.MAX_SAFE_INTEGER}
                              maxLength={16}
                              onPaste={e => {
                                // Get the pasted value and remove all white space
                                const value = e.clipboardData.getData('text').replace(/\s/g, '');
                                // Set the value of the input to the pasted value
                                onChangeValue(indexContent, content.type, value, 'card_number');
                                e.target.value = value;
                              }}
                              formatter={(value) => value.replace(/\s/g, "")}
                              parser={(value) => value.replace(/\s/g, "")}
                              disabled={true}
                          
                              value={cardPaymentRadioButton.card_number}
                              placeholder={cardPaymentRadioButton.card_number_placeholder}
                              onChange={value => onChangeValue(indexContent, content.type, value, 'card_number')}
                            /> */}
                            <InputCustom
                              labelClassName="chat-log-um-field-full" 
                              
                              label={LABEL_CARD_NUMBER}
                              type="number"
                              onKeyPress={(e) => {
                                if (e.target.value.length >= 16) e.preventDefault();
                              }}
                              disabled={true}
                              onPaste={(e) => {
                                // Get the pasted value and remove all white space
                                const value = e.clipboardData
                                  .getData("text")
                                  .replace(/[^0-9]/g, "")
                                  .slice(0, 16);
                                setTimeout(() => {
                                  
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "card_number"
                                  );
                                }, 10);
                                // Set the value of the input to the pasted value
                                // return value;
                              }}
                              // max={9999999999999999}
                              containerClassName="chat-log-um-field-full chat-log-um-ml-0" 
                              value={cardPaymentRadioButton.card_number}
                              placeholder={
                                cardPaymentRadioButton.card_number_placeholder
                              }
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "card_number"
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div className="ss-user-setting__item-bottom">
                            <div className="chat-log-um-field-full" >{LABEL_CARD_NUMBER}</div>
                            <div
                              className="chat-log-um-field-full ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type" 
                              
                            >
                              <InputNum
                                max={CARD_PART_NUMBER_MAX}
                                controls={false}
                                className="chat-log-um-ml-0 ss-user-setting-input-limit-character" 
                                disabled={true}
                                maxLength={4}
                                
                                value={cardPaymentRadioButton.card_number1}
                                placeholder={
                                  cardPaymentRadioButton.card_number_placeholder1
                                }
                                onChange={(value) => {
                                  if ((value + "").length === 4) {
                                    focusInput(card2WrapRef);
                                  }
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "card_number1"
                                  );
                                }}
                              />
                              <div ref={card2WrapRef}>
<InputNum
                                max={CARD_PART_NUMBER_MAX}
                                
                                controls={false}
                                className="chat-log-um-ml-7 ss-user-setting-input-limit-character" 
                                disabled={true}
                                maxLength={4}
                                
                                value={cardPaymentRadioButton.card_number2}
                                placeholder={
                                  cardPaymentRadioButton.card_number_placeholder2
                                }
                                onChange={(value) => {
                                  if ((value + "").length === 4) {
                                    focusInput(card3WrapRef);
                                  }
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "card_number2"
                                  );
                                }}
                              />
                          </div>
                              <div ref={card3WrapRef}>
<InputNum
                                
                                max={CARD_PART_NUMBER_MAX}
                                controls={false}
                                className="chat-log-um-ml-7 ss-user-setting-input-limit-character" 
                                disabled={true}
                                maxLength={4}
                                
                                value={cardPaymentRadioButton.card_number3}
                                placeholder={
                                  cardPaymentRadioButton.card_number_placeholder3
                                }
                                onChange={(value) => {
                                  if ((value + "").length === 4) {
                                    focusInput(card4WrapRef);
                                  }
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "card_number3"
                                  );
                                }}
                              />
                          </div>
                              <div ref={card4WrapRef}>
<InputNum
                                
                                max={CARD_PART_NUMBER_MAX}
                                controls={false}
                                className="chat-log-um-ml-7 ss-user-setting-input-limit-character" 
                                disabled={true}
                                maxLength={4}
                                
                                value={cardPaymentRadioButton.card_number4}
                                placeholder={
                                  cardPaymentRadioButton.card_number_placeholder4
                                }
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "card_number4"
                                  )
                                }
                              />
                          </div>
                            </div>
                          </div>
                        )}
                        {cardPaymentRadioButton.is_hide_card_name === false && (
                          <div className="ss-user-setting__item-bottom">
                            <InputCustom
                              className="ss-user-setting-input-overview"
                              labelClassName="chat-log-um-field-full" 
                              label={LABEL_CARD_HOLDER}
                              inline={false}
                              disabled={true}
                              value={cardPaymentRadioButton.card_holder}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "card_holder"
                                )
                              }
                              placeholder={
                                cardPaymentRadioButton.card_holder_placeholder
                              }
                            />
                          </div>
                        )}
                        <div className="ss-user-setting__item-bottom">
                          <div className="chat-log-um-field-full" >{LABEL_EXPIRY}</div>
                          {cardPaymentRadioButton.type_date_of_expiry === EXPIRY_TYPE_YM && (
                            <div className="chat-log-um-flex-full" >
                              <SelectCustom
                                className="chat-log-um-field-33" 
                                value={cardPaymentRadioButton.year}
                                disabled={true}
                                placeholder={PLACEHOLDER_YEAR}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    item.key >= new Date().getFullYear() &&
                                    item.key <= new Date().getFullYear() + 10
                                )}
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "year"
                                  )
                                }
                              />
                              <SelectCustom
                                className="chat-log-um-field-33-ml" 
                                value={cardPaymentRadioButton.month}
                                placeholder={PLACEHOLDER_MONTH}
                                data={DATA_MONTH}
                                disabled={true}
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "month"
                                  )
                                }
                              />
                            </div>
                          )}
                          {cardPaymentRadioButton.type_date_of_expiry === EXPIRY_TYPE_MY && (
                            <div className="chat-log-um-flex-full" >
                              <SelectCustom
                                className="chat-log-um-field-33" 
                                value={cardPaymentRadioButton.month}
                                placeholder={PLACEHOLDER_MONTH}
                                data={DATA_MONTH}
                                disabled={true}
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "month"
                                  )
                                }
                              />
                              <SelectCustom
                                className="chat-log-um-field-33-ml" 
                                value={cardPaymentRadioButton.year}
                                disabled={true}
                                placeholder={PLACEHOLDER_YEAR}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    item.key >= new Date().getFullYear() &&
                                    item.key <= new Date().getFullYear() + 10
                                )}
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "year"
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>
                        {cardPaymentRadioButton.is_hide_cvc === false && (
                          <div
                            className="ss-user-setting__item-bottom chat-log-um-display-block"
                        
                          >
                            <InputNum
                              className="chat-log-um-field-33 chat-log-um-ml-0 ss-user-setting-input-limit-character" 
                              
                              max={CARD_PART_NUMBER_MAX}
                              maxLength={4}
                              disabled={true}
                              controls={false}
                              label={
                                <span className="chat-log-um-font-400" >
                                  {LABEL_CVC}{' '}
                                  <img
                                    alt={ALT_EMPTY}
                                    className="chat-log-um-cvc-icon" 
                                    src={cvcIcon}
                                  />
                                </span>
                              }
                              value={cardPaymentRadioButton.cvc}
                              placeholder={cardPaymentRadioButton.cvc_placeholder}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "cvc"
                                )
                              }
                            />
                          </div>
                        )}
                        {errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ] && (
                          <div className="chat-log-um-error" >
                            {
                              errors?.[
                                `message${indexMessage}_content${indexContent}_${content.type}`
                              ]
                            }
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </div>
  );
};

CardPaymentRadioButtonContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
  onClickNext: PropTypes.func,
  messageContentLength: PropTypes.number,
  displayButtonNext: PropTypes.func,
};

export default CardPaymentRadioButtonContent;
