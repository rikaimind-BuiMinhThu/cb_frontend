import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const TextareaPreview = ({
  textarea,
}) => (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(textarea.title_require || textarea.require) &&
                                                                <div className="ss-message__content--user-textarea-top" style={{ marginBottom: '0px' }}>
                                                                  {textarea.title_require &&
                                                                    <span className="ss-message__content--user-textarea-title">
                                                                      {textarea.title}
                                                                    </span>
                                                                  }
                                                                  {textarea.require === true && textarea?.type === 'text_input' &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {(textarea?.type === 'text_input' ||
                                                                textarea?.type === 'invalid_input') && (
                                                                  <textarea
                                                                    className="ss-message__content--user-textarea ss-input-value"
                                                                    readOnly
                                                                    placeholder={textarea[textarea.type]?.content}
                                                                    rows={3}
                                                                    value={textarea?.type === 'invalid_input' ? textarea[textarea.type]?.content : ''}
                                                                  ></textarea>
                                                                )}
                                                              {textarea?.type === 'consume_api_response' && (
                                                                <textarea
                                                                  className="ss-message__content--user-textarea ss-input-value"
                                                                  readOnly
                                                                  value={'入力値の検証にAPIを利用する'}
                                                                  rows={3}
                                                                ></textarea>
                                                              )}
                                                            </div>
);

export default TextareaPreview;
