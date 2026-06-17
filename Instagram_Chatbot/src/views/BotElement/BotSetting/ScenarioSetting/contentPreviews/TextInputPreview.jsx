import '../styles/base/preview-common.css';
import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const TextInputPreview = ({
  textInput,
  renderTextInputPasswordConfirmationPreview,
}) => (
                                                            <div className="ss-content-preview">
                                                              {(textInput.title_require || textInput.require) &&
                                                                <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
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
                                                                  <div className="ss-content-preview__row">
                                                                    <input
                                                                      readOnly
                                                                      placeholder={textInput.text?.placeholderLeft}
                                                                      disabled
                                                                     className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"></input>
                                                                    <input
                                                                      readOnly
                                                                      placeholder={textInput.text?.placeholderRight}
                                                                      disabled
                                                                      className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
                                                                    />
                                                                  </div> :
                                                                  <React.Fragment>
                                                                    <input
                                                                      readOnly
                                                                      placeholder={textInput[textInput.type]?.placeholderLeft}
                                                                      disabled
                                                                     className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"></input>
                                                                    {textInput.text?.placeholderRight &&
                                                                      <span className="ss-content-preview__suffix-label">{textInput.text?.placeholderRight}</span>
                                                                    }
                                                                  </React.Fragment>
                                                                )
                                                              }
                                                              {(textInput.type === 'phone_number') &&
                                                                <React.Fragment>
                                                                  {textInput.phone_number.withHyphen === false ?
                                                                    <input
                                                                      readOnly
                                                                      placeholder={textInput[textInput.type]?.number}
                                                                      disabled
                                                                     className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"></input> :
                                                                    <div className="ss-content-preview__row">
                                                                      <input
                                                                        readOnly
                                                                        placeholder={textInput[textInput.type]?.number1}
                                                                        disabled
                                                                       className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"></input>
                                                                      <input
                                                                        readOnly
                                                                        placeholder={textInput[textInput.type]?.number2}
                                                                        disabled
                                                                       className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"></input>
                                                                      <input
                                                                        readOnly
                                                                        placeholder={textInput[textInput.type]?.number3}
                                                                        disabled
                                                                       className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"></input>
                                                                    </div>
                                                                  }
                                                                </React.Fragment>
                                                              }
                                                              {(textInput.type === 'password') &&
                                                                <React.Fragment>
                                                                  <input
                                                                    readOnly
                                                                    placeholder={textInput[textInput.type]?.password}
                                                                    disabled
                                                                   className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"></input>
                                                                </React.Fragment>
                                                              }
                                                              {(textInput.type === 'urls' ||
                                                                textInput.type === 'email_address') &&
                                                                <React.Fragment>
                                                                  <input
                                                                    readOnly
                                                                    placeholder={textInput[textInput.type].placeholder}
                                                                    disabled
                                                                   className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"></input>
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
