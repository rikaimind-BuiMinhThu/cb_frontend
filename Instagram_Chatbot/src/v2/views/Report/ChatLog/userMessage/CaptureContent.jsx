/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/components/BotMessages/InputCustom';
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
  const capture = content.capture;
  if (!capture) {
    return null;
  }

  const captchaItem = captcha?.filter(
    (entry) => entry.index === indexMessage && entry.indexContent === indexContent,
  )?.[0];
  const captchaHtml = captchaItem?.data || EMPTY_STRING;
  const errorKey = `message${indexMessage}_content${indexContent}_${content.type}`;

  return (
    <div className="chat-log-um-block">
      <div className="ss-message__content--user-pull_down-top chat-log-um-mb-neg-5">
        {capture.title_require && (
          <span className="ss-message__content--user-pull_down-title">
            {capture.title}
          </span>
        )}
        <span className="ss-message__content--user-text-input-required">
          {REQUIRED_LABEL}
        </span>
      </div>
      <div className="ss-user-setting__item-bottom chat-log-um-mb-0">
        <InputCustom
          disabled={true}
          containerClassName="chat-log-um-field-50"
          value={capture.value}
          onChange={(value) =>
            onChangeValue(indexContent, content.type, value, 'value')
          }
        />
        <div
          className="chat-log-um-field-50"
          dangerouslySetInnerHTML={{ __html: captchaHtml }}
        />
      </div>
      {errors?.[errorKey] && (
        <div className="chat-log-um-error">
          {errors[errorKey]}
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
