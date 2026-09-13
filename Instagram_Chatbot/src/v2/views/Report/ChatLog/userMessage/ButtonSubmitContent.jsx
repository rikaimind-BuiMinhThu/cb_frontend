/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  LABEL_SUBMIT,
  SUBMIT_IMAGE_WIDTH_DEFAULT,
} from './constants';


const ButtonSubmitContent = ({
  content,
}) => {
  const buttonSubmit = content.button_submit;

  return (
                  <div className="chat-log-um-block" >
                    <div className="ss-user-setting__item-text_input-top">
                      <button
                        disabled
                        id="chatbot-submit-button"
                        className={['chat-log-um-submit-btn',
                        'ss-user-setting__select-btn-add',
                        'btn',
                        'btn-secondary',
                        buttonSubmit?.button_image_url ? 'chatbot-submit-button--image' : '',
                      ].filter(Boolean).join(' ')}>
                        {buttonSubmit?.button_image_url ? (
                          <img
                            src={buttonSubmit.button_image_url}
                            alt={content.button_submit_name || buttonSubmit?.button_submit_name || LABEL_SUBMIT}
                            className="chat-log-um-submit-image" style={{ '--um-btn-w': buttonSubmit.button_image_width || SUBMIT_IMAGE_WIDTH_DEFAULT }}
                          />
                        ) : (
                          content.button_submit_name || buttonSubmit?.button_submit_name || LABEL_SUBMIT
                        )}
                      </button>
                    </div>
                  </div>
  );
};

ButtonSubmitContent.propTypes = {
  content: PropTypes.object,
};

export default ButtonSubmitContent;
