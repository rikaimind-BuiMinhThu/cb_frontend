/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

import {
  REQUIRED_LABEL,
  SAMPLE_LABEL,
  ALT_EMPTY,
  CHECKBOX_TYPE,
} from './constants';


const CheckboxContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const checkbox = content.checkbox;
  if (!checkbox) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(checkbox.title_require || checkbox.require) && (
                      <div
                        className="ss-message__content--user-checkbox-top chat-log-um-mb-0"
                    
                      >
                        {checkbox.title_require && (
                          <span className="ss-message__content--user-checkbox-title">
                            {checkbox.title}
                          </span>
                        )}
                        {checkbox.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div>
                      {checkbox.type === CHECKBOX_TYPE.DEFAULT && (
                        <Checkbox.Group
                          className="chat-log-um-field-full" 
                          disabled={true}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "checkedValue"
                            )
                          }
                          value={checkbox.checkedValue}
                        >
                          {checkbox[checkbox.type].map((item, index) => {
                            return (
                              <div
                                key={index}
                                className="ss-message__content--user-checkbox"
                              >
                                <Checkbox value={item.id}>
                                  <label htmlFor="ss-message__content--user-checkbox">
                                    {item.text}
                                  </label>
                                </Checkbox>
                              </div>
                            );
                          })}
                        </Checkbox.Group>
                      )}
                      {/* {checkbox.type === CHECKBOX_TYPE.CHECKBOX_IMG && (
                        checkbox[checkbox.type].map((item, index) => {
                          return <div key={index} className="ss-message__content--user-checkbox--checkbox_img chat-log-um-block" >
                            <CheckboxCustom
                              disabled={true}
                              onChange={() => onChangeValueCheckbox(indexContent, content.type, item.id, 'checkedValue')}
                              value={checkbox.checkedValue.includes(item.id)}
                              isOnChange={false}
                            />
                            <img
                              src={item.img}
                              alt={ALT_EMPTY}
                            />
                            <div className="chat-log-um-center" >{item.text}</div>
                          </div>
                        })
                      )} */}
                      {checkbox.type === CHECKBOX_TYPE.CHECKBOX_IMG && checkbox[checkbox.type] && (
                        <Checkbox.Group
                          disabled={true}
                          className="chat-log-um-checkbox-group ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width" 
                          
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "initial_selection_picture"
                            )
                          }
                          value={checkbox.initial_selection_picture}
                        >
                          {checkbox[checkbox.type].map(
                            (itemCheckboxImg, indexCheckboxImg) => {
                              return (
                                <div
                                  key={indexCheckboxImg}
                                  className="chat-log-um-checkbox-img-row" 
                                >
                                  {itemCheckboxImg.contents &&
                                    itemCheckboxImg.contents.map(
                                      (itemCheckContent, indexCheckboxContent) => {
                                        return (
                                          <Checkbox
                                            value={`${itemCheckboxImg.id}-${itemCheckContent.id}`}
                                            key={indexCheckboxContent}
                                            className="chat-log-um-mr-0" 
                                          >
                                            <img
                                              alt={ALT_EMPTY}
                                              src={itemCheckContent.file_url}
                                            ></img>
                                            <div
                                              className="chat-log-um-checkbox-img-text" 
                                            >
                                              {itemCheckContent.text}
                                            </div>
                                          </Checkbox>
                                        );
                                      }
                                    )}
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      )}
                      {checkbox.type === CHECKBOX_TYPE.CONSUME_API_RESPONSE && (
                        <>
                          <div className="ss-message__content--user-checkbox">
                            <input
                              type="checkbox"
                              name="ss-message__content--user-checkbox"
                              id="ss-message__content--user-checkbox"
                            />
                            <label htmlFor="ss-message__content--user-checkbox">
                              {SAMPLE_LABEL}
                            </label>
                          </div>
                          <div className="ss-message__content--user-checkbox">
                            <input
                              type="checkbox"
                              name="ss-message__content--user-checkbox"
                              id="ss-message__content--user-checkbox"
                            />
                            <label htmlFor="ss-message__content--user-checkbox">
                              {SAMPLE_LABEL}
                            </label>
                          </div>
                        </>
                      )}
                    </div>
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

CheckboxContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default CheckboxContent;
