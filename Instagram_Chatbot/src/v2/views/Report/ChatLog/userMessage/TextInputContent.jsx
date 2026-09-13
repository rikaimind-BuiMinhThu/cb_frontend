/* cSpell: disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/components/BotMessages/InputCustom';
import {
  REQUIRED_LABEL,
  PASSWORD_TYPE,
  TEXT_INPUT_TYPE,
  PHONE_PART1_MAX,
  PHONE_PART2_MAX,
  PHONE_PART3_MAX,
} from './constants';


import { focusInput } from './helpers';

const TextInputContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const phone2WrapRef = useRef(null);
  const phone3WrapRef = useRef(null);
  const textInput = content.text_input;
  if (!textInput) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(textInput.title_require || textInput.require) && (
                      <div
                        className="ss-message__content--user-text-input-top chat-log-um-mb-0"
                    
                      >
                        {textInput.title_require && (
                          <span className="ss-message__content--user-text-input-title">
                            {textInput.title}
                          </span>
                        )}
                        {textInput.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    {textInput.type === TEXT_INPUT_TYPE.TEXT &&
                      (textInput.text.isSplitInput ? (
                        <div
                          className="chat-log-um-split" 
                        >
                          <InputCustom
                            disabled={true}
                            placeholder={textInput.text?.placeholderLeft}
                            containerClassName="chat-log-um-field-half chat-log-um-mb-0" 
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                textInput.type,
                                "valueLeft"
                              )
                            }
                            value={textInput[textInput.type]?.valueLeft}
                          ></InputCustom>
                          <InputCustom
                            disabled={true}
                            placeholder={textInput.text?.placeholderRight}
                            containerClassName="chat-log-um-field-half" 
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                textInput.type,
                                "valueRight"
                              )
                            }
                            value={textInput[textInput.type]?.valueRight}
                          ></InputCustom>
                        </div>
                      ) : (
                        <React.Fragment>
                          <InputCustom
                            disabled={true}
                            containerClassName="chat-log-um-mb-0" 
                            placeholder={textInput[textInput.type]?.placeholderLeft}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                textInput.type,
                                "value"
                              )
                            }
                            value={textInput[textInput.type]?.value}
                          ></InputCustom>
                          {textInput.text?.placeholderRight && (
                            <span
                              className="chat-log-um-placeholder-hint" 
                            >
                              {textInput.text?.placeholderRight}
                            </span>
                          )}
                        </React.Fragment>
                    ))}
                    {textInput.type === TEXT_INPUT_TYPE.PHONE_NUMBER && (
                      <React.Fragment>
                        {textInput.phone_number.withHyphen === false ? (
                          <InputCustom
                            disabled={true}
                            // className="ss-message__content--user-text-input ss-input-value"
                            containerClassName="chat-log-um-mb-0" 
                            placeholder={textInput[textInput.type]?.number}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                textInput.type,
                                "value"
                              )
                            }
                            value={textInput[textInput.type]?.value}
                          ></InputCustom>
                        ) : (
                          <div
                            className="chat-log-um-split" 
                          >
                            <InputCustom
                              disabled={true}
                              className="ss-message__content--user-text-input ss-input-value"
                              maxLength={PHONE_PART1_MAX}
                              containerClassName="chat-log-um-field-third chat-log-um-mb-0" 
                              placeholder={textInput[textInput.type]?.number1}
                              onChange={(value) => {
                                if (value.length === PHONE_PART1_MAX) {
                                  focusInput(phone2WrapRef);
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  textInput.type,
                                  "value1"
                                );
                              }}
                              value={textInput[textInput.type]?.value1}
                            ></InputCustom>
                            <div ref={phone2WrapRef} className="chat-log-um-field-third">
                            <InputCustom
                              disabled={true}
                              className="ss-message__content--user-text-input ss-input-value"
                              containerClassName="chat-log-um-mb-0"
                              maxLength={PHONE_PART2_MAX}
                              placeholder={textInput[textInput.type]?.number2}
                              onChange={(value) => {
                                if (value.length === PHONE_PART2_MAX) {
                                  focusInput(phone3WrapRef);
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  textInput.type,
                                  "value2"
                                );
                              }}
                              value={textInput[textInput.type]?.value2}
                            ></InputCustom>
                            </div>
                            <div ref={phone3WrapRef} className="chat-log-um-field-third">
                            <InputCustom
                              disabled={true}
                              containerClassName="chat-log-um-mb-0"
                              placeholder={textInput[textInput.type]?.number3}
                              maxLength={PHONE_PART3_MAX}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  textInput.type,
                                  "value3"
                                )
                              }
                              value={textInput[textInput.type]?.value3}
                            ></InputCustom>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                    {textInput.type === TEXT_INPUT_TYPE.PASSWORD && (
                      <React.Fragment>
                        <InputCustom
                          disabled={true}
                          type={PASSWORD_TYPE}
                          // className="ss-message__content--user-text-input ss-input-value"
                          containerClassName="chat-log-um-mb-0" 
                          placeholder={textInput[textInput.type]?.password}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value"
                            )
                          }
                          value={textInput[textInput.type]?.value}
                        ></InputCustom>
                      </React.Fragment>
                    )}
                    {(textInput.type === TEXT_INPUT_TYPE.URLS ||
                      textInput.type === TEXT_INPUT_TYPE.EMAIL_ADDRESS) && (
                      <React.Fragment>
                        <InputCustom
                          disabled={true}
                          // className="ss-message__content--user-text-input ss-input-value"
                          containerClassName="chat-log-um-mb-0" 
                          placeholder={textInput[textInput.type].placeholder}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value"
                            )
                          }
                          value={textInput[textInput.type]?.value}
                        ></InputCustom>
                      </React.Fragment>
                    )}
                    {textInput.type === TEXT_INPUT_TYPE.EMAIL_CONFIRMATION && (
                      <>
                        <InputCustom
                          containerClassName="chat-log-um-mb-5" 
                          disabled={true}
                          placeholder={textInput[textInput.type].cfEmlAdd_email}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value"
                            )
                          }
                          value={textInput[textInput.type]?.value}
                        />
                        <InputCustom
                          disabled={true}
                          placeholder={
                            textInput[textInput.type].cfEmlAdd_confirm_email
                          }
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "valueConfirm"
                            )
                          }
                          value={textInput[textInput.type]?.valueConfirm}
                        />
                      </>
                    )}
                    {textInput.type === TEXT_INPUT_TYPE.PASSWORD_CONFIRMATION && (
                      <>
                        <InputCustom
                          containerClassName="chat-log-um-mb-5" 
                          disabled={true}
                          type={PASSWORD_TYPE}
                          placeholder={textInput[textInput.type].password}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value"
                            )
                          }
                          value={textInput[textInput.type]?.value}
                        />
                        <InputCustom
                          disabled={true}
                          type={PASSWORD_TYPE}
                          placeholder={textInput[textInput.type].confirm_password}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "valueConfirm"
                            )
                          }
                          value={textInput[textInput.type]?.valueConfirm}
                        />
                      </>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

TextInputContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default TextInputContent;
