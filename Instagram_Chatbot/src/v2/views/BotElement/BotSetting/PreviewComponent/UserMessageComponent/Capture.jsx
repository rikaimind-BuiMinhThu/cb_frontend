import React from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import InputCustom from 'v2/components/BotMessages/InputCustom';
import { EMPTY_INPUT_VALUE, PREVIEW_MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from '../Constants';

const Capture = ({
  content,
  messageIndex,
  contentIndex,
  onChangeValue,
  errors,
  disabled,
  captcha,
}) => {
  if (!content || content.type !== PREVIEW_MESSAGE_CONTENT_TYPES.CAPTURE || !content.capture) {
    return null;
  }

  const capture = content.capture;
  const captchaItem = captcha?.find(
    (item) => item.index === messageIndex && item.contentIndex === contentIndex,
  );
  const captchaHtml = captchaItem?.data || EMPTY_INPUT_VALUE;
  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;

  return (
    <div className="preview-um-block">
      <div className="ss-message__content--user-pull_down-top preview-um-capture-title-row">
        {capture.title_require && (
          <span className="ss-message__content--user-pull_down-title">
            {capture.title}
          </span>
        )}
        <span className="ss-message__content--user-text-input-required">
          {REQUIRED_FIELD_LABEL}
        </span>
      </div>
      <div className="ss-user-setting__item-bottom preview-um-field-bottom-mb-0">
        <InputCustom
          disabled={disabled}
          containerClassName="preview-um-field-half"
          value={capture.value}
          onChange={(value) => onChangeValue(contentIndex, content.type, value, 'value')}
        />
        <div
          className="preview-um-field-half"
          dangerouslySetInnerHTML={{ __html: captchaHtml }}
        />
      </div>
      {errors?.[errorKey] && (
        <div className="validation-error-message">
          {errors[errorKey]}
        </div>
      )}
    </div>
  );
};

Capture.propTypes = {
  content: PropTypes.object,
  messageIndex: PropTypes.number,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  captcha: PropTypes.array,
};

export default Capture;
