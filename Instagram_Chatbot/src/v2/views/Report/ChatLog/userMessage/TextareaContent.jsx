/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  REQUIRED_LABEL,
  TEXTAREA_TYPE,
} from './constants';


const TextareaContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const textarea = content.textarea;
  if (!textarea) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(textarea.title_require || textarea.require) && (
                      <div
                        className="ss-message__content--user-textarea-top chat-log-um-mb-0"
                    
                      >
                        {textarea.title_require && (
                          <span className="ss-message__content--user-textarea-title">
                            {textarea.title}
                          </span>
                        )}
                        {textarea.require === true &&
                          textarea?.type === TEXTAREA_TYPE.TEXT_INPUT && (
                            <span className="ss-message__content--user-text-input-required">
                              {REQUIRED_LABEL}
                            </span>
                          )}
                      </div>
                    )}
                    {(textarea?.type === TEXTAREA_TYPE.TEXT_INPUT ||
                      textarea?.type === TEXTAREA_TYPE.INVALID_INPUT) && (
                      <textarea
                        disabled={disabled || textarea?.type === TEXTAREA_TYPE.INVALID_INPUT}
                        className="ss-message__content--user-textarea ss-input-value"
                        placeholder={textarea[textarea.type]?.content}
                        rows={3}
                        onChange={(e) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            e.target.value,
                            textarea?.type,
                            "value"
                          )
                        }
                        value={
                          textarea?.type === TEXTAREA_TYPE.INVALID_INPUT
                            ? textarea[textarea.type]?.content
                            : textarea[textarea.type]?.value
                        }
                      ></textarea>
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

TextareaContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default TextareaContent;
