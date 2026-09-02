/* cSpell: disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom';
import SelectCustom from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/SelectCustom';
import InputNum from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputNum';
import cvcIcon from 'assets/img/cvc-icon.png';
import {
  REQUIRED_LABEL,
  LABEL_CARD_NUMBER,
  LABEL_CARD_HOLDER,
  LABEL_EXPIRY,
  LABEL_CVC,
  DATA_YEAR_FIXED,
  DATA_MONTH,
  ALT_EMPTY,
  CARD_PART_NUMBER_MAX,
  EXPIRY_TYPE_YM,
  EXPIRY_TYPE_MY,
} from './constants';


import { focusInput } from './helpers';
import PAYMENT_METHODS from './paymentMethods';

const CreditCardPaymentContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const card2WrapRef = useRef(null);
  const card3WrapRef = useRef(null);
  const card4WrapRef = useRef(null);
  const creditCardPayment = content.credit_card_payment;
  if (!creditCardPayment) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(creditCardPayment.title_require ||
                      creditCardPayment.require) && (
                      <div
                        className="ss-message__content--user-pull_down-top chat-log-um-mb-0"
                    
                      >
                        {creditCardPayment.title_require && (
                          <span className="ss-message__content--user-pull_down-title">
                            {creditCardPayment.title}
                          </span>
                        )}
                        {creditCardPayment.require && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    {creditCardPayment.payment_method.length > 0 && (
                      <div
                        className="chat-log-um-flex-start" 
                      >
                        {creditCardPayment.payment_method.map(
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
                    {creditCardPayment.separate_type === false ? (
                      <div className="ss-user-setting__item-bottom">
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
                          value={creditCardPayment.card_number}
                          placeholder={creditCardPayment.card_number_placeholder}
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
                          className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type chat-log-um-field-full"
                      
                        >
                          <InputNum
                            max={CARD_PART_NUMBER_MAX}
                            controls={false}
                            className="chat-log-um-ml-0 ss-user-setting-input-limit-character" 
                            disabled={true}
                            maxLength={4}
                            
                            value={creditCardPayment.card_number1}
                            placeholder={creditCardPayment.card_number_placeholder1}
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
                            
                            value={creditCardPayment.card_number2}
                            placeholder={creditCardPayment.card_number_placeholder2}
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
                            
                            value={creditCardPayment.card_number3}
                            placeholder={creditCardPayment.card_number_placeholder3}
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
                            
                            value={creditCardPayment.card_number4}
                            placeholder={creditCardPayment.card_number_placeholder4}
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
                    {creditCardPayment.is_hide_card_name !== true && (
                      <div className="ss-user-setting__item-bottom">
                        <InputCustom
                          labelClassName="chat-log-um-field-full" 
                          label={LABEL_CARD_HOLDER}
                          inline={false}
                          disabled={true}
                          value={creditCardPayment.card_holder}
                          placeholder={creditCardPayment.card_holder_placeholder}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "card_holder"
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="ss-user-setting__item-bottom">
                      <div className="chat-log-um-field-full" >{LABEL_EXPIRY}</div>
                      {creditCardPayment.type_date_of_expiry === EXPIRY_TYPE_YM && (
                        <div className="chat-log-um-flex-full" >
                          <SelectCustom
                            className="chat-log-um-field-33" 
                            value={creditCardPayment.year}
                            disabled={true}
                            placeholder={creditCardPayment.year_placeholder}
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
                            value={creditCardPayment.month}
                            placeholder={creditCardPayment.month_placeholder}
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
                      {creditCardPayment.type_date_of_expiry === EXPIRY_TYPE_MY && (
                        <div className="chat-log-um-flex-full" >
                          <SelectCustom
                            className="chat-log-um-field-33" 
                            value={creditCardPayment.month}
                            placeholder={creditCardPayment.month_placeholder}
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
                            value={creditCardPayment.year}
                            disabled={true}
                            placeholder={creditCardPayment.year_placeholder}
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
                    {creditCardPayment.is_hide_cvc !== true && (
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
                              <img className="chat-log-um-cvc-icon"  src={cvcIcon} alt={ALT_EMPTY} />
                            </span>
                          }
                          value={creditCardPayment.cvc}
                          placeholder={creditCardPayment.cvc_placeholder}
                          onChange={(value) =>
                            onChangeValue(indexContent, content.type, value, "cvc")
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
                  </div>
  );
};

CreditCardPaymentContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default CreditCardPaymentContent;
