import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const TextInputPreview = ({
  textInput,
  renderTextInputPasswordConfirmationPreview,
}) => (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(textInput.title_require || textInput.require) &&
                                                                <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                                                                  {textInput.title_require &&
                                                                    <span className="ss-message__content--user-text-input-title">
                                                                      {textInput.title}
                                                                    </span>
                                                                  }
                                                                  {textInput.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {(textInput.type === 'text') &&
                                                                (textInput.text.isSplitInput ?
                                                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      placeholder={textInput.text?.placeholderLeft}
                                                                      style={{ width: '49%', marginBottom: '0px' }}
                                                                      disabled
                                                                    ></input>
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      placeholder={textInput.text?.placeholderRight}
                                                                      style={{ width: '49%' }}
                                                                      disabled
                                                                    ></input>
                                                                  </div> :
                                                                  <React.Fragment>
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      style={{ marginBottom: '0px' }}
                                                                      placeholder={textInput[textInput.type]?.placeholderLeft}
                                                                      disabled
                                                                    ></input>
                                                                    {textInput.text?.placeholderRight &&
                                                                      <span style={{ fontWeight: '400', color: 'black', fontSize: '12px', marginLeft: '18px' }}>{textInput.text?.placeholderRight}</span>
                                                                    }
                                                                  </React.Fragment>
                                                                )
                                                              }
                                                              {(textInput.type === 'phone_number') &&
                                                                <React.Fragment>
                                                                  {textInput.phone_number.withHyphen === false ?
                                                                    <input
                                                                      className="ss-message__content--user-text-input ss-input-value"
                                                                      readOnly
                                                                      style={{ marginBottom: '0px' }}
                                                                      placeholder={textInput[textInput.type]?.number}
                                                                      disabled
                                                                    ></input> :
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        style={{ marginBottom: '0px', width: '32%' }}
                                                                        placeholder={textInput[textInput.type]?.number1}
                                                                        disabled
                                                                      ></input>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        style={{ marginBottom: '0px', width: '32%' }}
                                                                        placeholder={textInput[textInput.type]?.number2}
                                                                        disabled
                                                                      ></input>
                                                                      <input
                                                                        className="ss-message__content--user-text-input ss-input-value"
                                                                        readOnly
                                                                        style={{ marginBottom: '0px', width: '32%' }}
                                                                        placeholder={textInput[textInput.type]?.number3}
                                                                        disabled
                                                                      ></input>
                                                                    </div>
                                                                  }
                                                                </React.Fragment>
                                                              }
                                                              {(textInput.type === 'password') &&
                                                                <React.Fragment>
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    style={{ marginBottom: '0px' }}
                                                                    placeholder={textInput[textInput.type]?.password}
                                                                    disabled
                                                                  ></input>
                                                                </React.Fragment>
                                                              }
                                                              {(textInput.type === 'urls' ||
                                                                textInput.type === 'email_address') &&
                                                                <React.Fragment>
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    style={{ marginBottom: '0px' }}
                                                                    placeholder={textInput[textInput.type].placeholder}
                                                                    disabled
                                                                  ></input>
                                                                </React.Fragment>
                                                              }
                                                              {(textInput.type === 'email_confirmation') &&
                                                                (<>
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    disabled
                                                                    placeholder={textInput[textInput.type].cfEmlAdd_email}
                                                                  ></input>
                                                                  <input
                                                                    className="ss-message__content--user-text-input ss-input-value"
                                                                    readOnly
                                                                    placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
                                                                    disabled
                                                                  ></input>
                                                                </>
                                                                )}
                                                              {renderTextInputPasswordConfirmationPreview(textInput)}
                                                            </div>
);

export default TextInputPreview;
