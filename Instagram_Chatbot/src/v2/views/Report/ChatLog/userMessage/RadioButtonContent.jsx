/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  REQUIRED_LABEL,
  SAMPLE_LABEL,
  ALT_EMPTY,
  RADIO_TYPE,
} from './constants';


const RadioButtonContent = ({
  content,
  indexContent,
  disabled,
  onChangeValue,
  onClickNext,
  messageContentLength,
}) => {
  const radioButton = content.radio_button;
  if (!radioButton) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(radioButton.title_require || radioButton.require) && (
                      <div
                        className="ss-message__content--user-radio_button-top chat-log-um-mb-0"
                    
                      >
                        {radioButton.title_require && (
                          <span className="ss-message__content--user-radio_button-title">
                            {radioButton.title}
                          </span>
                        )}
                        {radioButton.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="ss-message__content--user-radio_button-wrapper">
                      {radioButton.type === RADIO_TYPE.DEFAULT &&
                        radioButton[radioButton.type].map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="ss-message__content--user-radio_button"
                            >
                              <input
                                disabled={true}
                                type="radio"
                                id="ss-message__content--user-radio_button"
                                checked={radioButton.initial_selection === item.value}
                                onChange={() => {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    item.value,
                                    "initial_selection"
                                  );
                                  if (messageContentLength === 1) onClickNext();
                                }}
                              />
                              {item.text && (
                                <label htmlFor="ss-message__content--user-radio_button">
                                  {item.text}
                                </label>
                              )}
                            </div>
                          );
                        })}
                      {(radioButton.type === RADIO_TYPE.RADIO_BUTTON_IMG || radioButton.type === RADIO_TYPE.UPSELL_BUTTON) &&
                        radioButton[radioButton.type].map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="ss-message__content--user-radio_button--radio_button_img"
                            >
                              <input
                                disabled={true}
                                type="radio"
                                name="ss-message__content--user-radio_button--radio_button_img"
                                id="ss-message__content--user-radio_button--radio_button_img"
                                checked={
                                  radioButton.initial_selection === item.value
                                }
                                onChange={() => {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    item.value,
                                    "initial_selection"
                                  );
                                  if (messageContentLength === 1) onClickNext();
                                }}
                                value={radioButton.initial_selection}
                              />
                              <img src={item.img} alt={ALT_EMPTY} />
                              {item.text && (
                                <div
                                  className="chat-log-um-center-flex" 
                                >
                                  {item.text}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      {radioButton.type === RADIO_TYPE.CONSUME_API_RESPONSE && (
                        <>
                          <div className="ss-message__content--user-radio_button">
                            <input
                              type="radio"
                              name="ss-message__content--user-radio_button"
                              id="ss-message__content--user-radio_button"
                            />
                            <label htmlFor="ss-message__content--user-radio_button">
                              {SAMPLE_LABEL}
                            </label>
                          </div>
                          <div className="ss-message__content--user-radio_button">
                            <input
                              type="radio"
                              name="ss-message__content--user-radio_button"
                              id="ss-message__content--user-radio_button"
                            />
                            <label htmlFor="ss-message__content--user-radio_button">
                              {SAMPLE_LABEL}
                            </label>
                          </div>
                        </>
                      )}
                      {radioButton.type === RADIO_TYPE.BLOCK_STYLE &&
                        radioButton[radioButton.type].map((item, index) => {
                          return (
                            item.text && (
                              <div
                                className={`ss-message__content--user-radio_button--block_style chat-log-um-block-style ${(radioButton.value ? radioButton.value === item.id : radioButton.initial_selection === item.id) ? 'chat-log-um-block-style--selected' : ''}`}
                                key={index}
                                onClick={() => {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    item.id,
                                    "initial_selection"
                                  );
                                  if (messageContentLength === 1) onClickNext();
                                }}
                              >
                                <span>{item.text}</span>
                              </div>
                            )
                          );
                        })}
                    </div>
                  </div>
  );
};

RadioButtonContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  disabled: PropTypes.bool,
  onChangeValue: PropTypes.func,
  onClickNext: PropTypes.func,
  messageContentLength: PropTypes.number,
};

export default RadioButtonContent;
