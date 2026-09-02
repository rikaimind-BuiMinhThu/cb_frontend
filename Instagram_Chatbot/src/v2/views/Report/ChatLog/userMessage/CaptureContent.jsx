/* cSpell: disable */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom';
import {
  REQUIRED_LABEL,
  EMPTY_STRING,
} from './constants';


const CaptureContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
  captcha,
}) => {
  const captchaRef = useRef(null);
  useEffect(() => {
    if (!captchaRef.current || !captcha?.length) return;
    const item = captcha.filter(
      (entry) => entry.index === indexMessage && entry.indexContent === indexContent,
    )?.[0];
    captchaRef.current.innerHTML = item?.data || EMPTY_STRING;
  }, [captcha, indexMessage, indexContent]);
  const capture = content.capture;
  if (!capture) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    <div
                      className="ss-message__content--user-pull_down-top chat-log-um-mb-neg-5"
                  
                    >
                      {capture.title_require && (
                        <span className="ss-message__content--user-pull_down-title">
                          {capture.title}
                        </span>
                      )}
                      <span className="ss-message__content--user-text-input-required">
                        {REQUIRED_LABEL}
                      </span>
                    </div>
                    <div
                      className="ss-user-setting__item-bottom chat-log-um-mb-0"
                  
                    >
                      <InputCustom
                        disabled={true}
                        containerClassName="chat-log-um-field-50" 
                        value={capture.value}
                        onChange={(value) =>
                          onChangeValue(indexContent, content.type, value, "value")
                        }
                      />
                      {/* {new DOMParser().parseFromString(capture.img, "text/xml").innerHTML} */}
                      <div
                        ref={captchaRef}
                        className="chat-log-um-field-50" 
                      ></div>
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

CaptureContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
  captcha: PropTypes.array,
};

export default CaptureContent;
