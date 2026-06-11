import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const RadioButtonPreview = ({
  radioButton,
}) => (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(radioButton.title_require || radioButton.require) &&
                                                                <div className="ss-message__content--user-radio_button-top" style={{ marginBottom: '0px' }}>
                                                                  {radioButton.title_require &&
                                                                    <span className="ss-message__content--user-radio_button-title">
                                                                      {radioButton.title}
                                                                    </span>
                                                                  }
                                                                  {radioButton.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              <div className="ss-message__content--user-radio_button-wrapper">
                                                                {radioButton.type === 'default' && (
                                                                  radioButton[radioButton.type].map((item, index) => {
                                                                    return <div key={index} className="ss-message__content--user-radio_button">
                                                                      <input
                                                                        type="radio"
                                                                        name="ss-message__content--user-radio_button"
                                                                        id="ss-message__content--user-radio_button"
                                                                        disabled
                                                                        checked={radioButton.initial_selection === item.value}
                                                                      />
                                                                      {item.text &&
                                                                        <label htmlFor="ss-message__content--user-radio_button">
                                                                          {item.text}
                                                                        </label>
                                                                      }
                                                                    </div>
                                                                  })
                                                                )}
                                                                {radioButton.type === 'radio_button_img' && (
                                                                  radioButton[radioButton.type].map((item, index) => {
                                                                    return <div key={index} className="ss-message__content--user-radio_button--radio_button_img">
                                                                      <input
                                                                        type="radio"
                                                                        name="ss-message__content--user-radio_button--radio_button_img"
                                                                        id="ss-message__content--user-radio_button--radio_button_img"
                                                                        disabled
                                                                        checked={radioButton.initial_selection === item.value}
                                                                      />
                                                                      <img
                                                                        src={item.img}
                                                                        alt=""
                                                                      />
                                                                      {item.text &&
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                          {item.text}
                                                                        </div>
                                                                      }
                                                                    </div>
                                                                  })
                                                                )}
                                                                {radioButton.type === 'consume_api_response' && (
                                                                  <>
                                                                    <div className="ss-message__content--user-radio_button">
                                                                      <input
                                                                        type="radio"
                                                                        name="ss-message__content--user-radio_button"
                                                                        id="ss-message__content--user-radio_button"
                                                                        disabled
                                                                      />
                                                                      <label htmlFor="ss-message__content--user-radio_button">
                                                                        label
                                                                      </label>
                                                                    </div>
                                                                    <div className="ss-message__content--user-radio_button">
                                                                      <input
                                                                        type="radio"
                                                                        name="ss-message__content--user-radio_button"
                                                                        id="ss-message__content--user-radio_button"
                                                                        disabled
                                                                      />
                                                                      <label htmlFor="ss-message__content--user-radio_button">
                                                                        label
                                                                      </label>
                                                                    </div>
                                                                  </>
                                                                )}
                                                                {radioButton.type === 'block_style' && (
                                                                  radioButton[radioButton.type].map((item, index) => {
                                                                    return item.text && <div style={{ marginBottom: '10px' }} key={index} className="ss-message__content--user-radio_button--block_style">
                                                                      <span>{item.text}</span>
                                                                    </div>
                                                                  })
                                                                )}
                                                              </div>
                                                            </div>
);

export default RadioButtonPreview;
