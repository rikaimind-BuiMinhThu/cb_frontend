import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const CheckboxPreview = ({
  checkbox,
}) => (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(checkbox.title_require || checkbox.require) &&
                                                                <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                                                                  {checkbox.title_require &&
                                                                    <span className="ss-message__content--user-checkbox-title">
                                                                      {checkbox.title}
                                                                    </span>
                                                                  }
                                                                  {checkbox.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              {/* <div className="ss-message__content--user-checkbox-wrapper"> */}
                                                              {checkbox.type === 'default' && (
                                                                checkbox[checkbox.type].map((item, index) => {
                                                                  return <div key={index} className="ss-message__content--user-checkbox">
                                                                    <input
                                                                      type="checkbox"
                                                                      name="ss-message__content--user-checkbox"
                                                                      id="ss-message__content--user-checkbox"
                                                                      disabled
                                                                      checked={checkbox.all_item_checked}
                                                                    />
                                                                    <label htmlFor="ss-message__content--user-checkbox">
                                                                      {item.text}
                                                                    </label>
                                                                  </div>
                                                                })
                                                              )}
                                                              {/* {checkbox.type === 'checkbox_img' && (
                                                                checkbox[checkbox.type].map((itemCheckboxImg, indexCheckboxImg) => {
                                                                  return <div key={indexCheckboxImg} className="ss-message__content--user-checkbox--checkbox_img" style={{ marginBottom: '10px' }}>
                                                                    <input
                                                                      type="checkbox"
                                                                      name="ss-message__content--user-checkbox--checkbox_img"
                                                                      id="ss-message__content--user-checkbox--checkbox_img"
                                                                      disabled
                                                                      checked={checkbox.all_item_checked}
                                                                    />
                                                                    <img
                                                                      src={item.img}
                                                                      alt=""
                                                                    />
                                                                    <div style={{ textAlign: 'center' }}>{item.text}</div>
                                                                  </div>
                                                                })
                                                              )} */}
                                                              {checkbox.type === 'checkbox_img' && checkbox.checkbox_img &&
                                                                checkbox[checkbox.type].map((itemCheckboxImg, indexCheckboxImg) => {
                                                                  return <div key={indexCheckboxImg} className="ss-message__content--user-checkbox--checkbox_img" style={{ color: '#6789A6', marginBottom: '10px' }}>
                                                                    <Checkbox.Group
                                                                      style={{ width: "100%", fontSize: '14px', display: 'flex' }}
                                                                      className="ss-user-overview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width"
                                                                      onChange={(value) => console.log(value)}
                                                                      value={checkbox.initial_selection_picture}
                                                                    >
                                                                      {itemCheckboxImg.contents && itemCheckboxImg.contents.map((itemCheckboxContent, indexContent) => {
                                                                        return <Checkbox value={`${itemCheckboxImg.id}-${itemCheckboxContent.id}`} key={indexContent} style={{ marginRight: '0px' }}>
                                                                          <img src={itemCheckboxContent.file_url}></img>
                                                                          <div style={{ textAlign: 'center', fontSize: '14px', color: '#6789A6', fontWeight: '700' }}>{itemCheckboxContent.text}</div>
                                                                        </Checkbox>
                                                                      })}
                                                                    </Checkbox.Group>
                                                                  </div>
                                                                })
                                                              }
                                                              {checkbox.type === 'consume_api_response' && (
                                                                <>
                                                                  <div className="ss-message__content--user-checkbox">
                                                                    <input
                                                                      type="checkbox"
                                                                      name="ss-message__content--user-checkbox"
                                                                      id="ss-message__content--user-checkbox"
                                                                      disabled
                                                                    />
                                                                    <label htmlFor="ss-message__content--user-checkbox">
                                                                      label
                                                                    </label>
                                                                  </div>
                                                                  <div className="ss-message__content--user-checkbox">
                                                                    <input
                                                                      type="checkbox"
                                                                      name="ss-message__content--user-checkbox"
                                                                      id="ss-message__content--user-checkbox"
                                                                      disabled
                                                                    />
                                                                    <label htmlFor="ss-message__content--user-checkbox">
                                                                      label
                                                                    </label>
                                                                  </div>
                                                                </>
                                                              )}
                                                              {/* </div> */}
                                                            </div>
);

export default CheckboxPreview;
