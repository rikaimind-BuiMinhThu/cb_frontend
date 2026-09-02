import React from "react";
import PropTypes from "prop-types";
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import InputCustom from "v2/components/BotMessages/InputCustom";
import { moveToNext } from "v2/views/BotElement/BotSetting/PreviewComponent/Utils";

const TEXT_INPUT_TYPE_PHONE_NUMBER = "phone_number";

const PhoneNumber = ({ content, disabled, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== TEXT_INPUT_TYPE_PHONE_NUMBER) return null;
  const textInput = content.text_input;
  const phoneNumber = textInput.phone_number;

  if (phoneNumber.withHyphen === false) {
    return (
      <React.Fragment>
        <InputCustom
            disabled={disabled}
            className="m-b-0"
            placeholder={textInput[textInput.type]?.number}
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                textInput.type,
                "value"
              )
            }
            value={textInput[textInput.type]?.value || EMPTY_INPUT_VALUE}
            inputMode="numeric"
          ></InputCustom>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="ss-message__content--user-chat-container">
        <InputCustom
          disabled={disabled}
          className="ss-message__content--user-text-input ss-input-value ss-message__content--user-text-input-phone_number-hyphen"
          maxLength={3}
          type="tel"
          inputMode="numeric"
          placeholder={textInput[textInput.type]?.number1}
          onChange={(value) => {
            if (value.length === 3) {
              moveToNext(`ss-user-message-phone_number_2_${contentIndex}`);
            }
            onChangeValue(
              contentIndex,
              content.type,
              value,
              textInput.type,
              "value1"
            );
          }}
          onCompositionEnd={(event) => {
            if (event.target.value.length === 3) {
              moveToNext(`ss-user-message-phone_number_2_${contentIndex}`);
            }
          }}
          value={textInput[textInput.type]?.value1 || EMPTY_INPUT_VALUE}
        ></InputCustom>
        <InputCustom
          id={`ss-user-message-phone_number_2_${contentIndex}`}
          disabled={disabled}
          className="ss-message__content--user-text-input ss-input-value ss-message__content--user-text-input-phone_number-hyphen"
          type="tel"
          inputMode="numeric"
          maxLength={4}
          placeholder={textInput[textInput.type]?.number2}
          onChange={(value) => {
            if (value.length === 4) {
              moveToNext(`ss-user-message-phone_number_3_${contentIndex}`);
            }
            onChangeValue(
              contentIndex,
              content.type,
              value,
              textInput.type,
              "value2"
            );
          }}
          onCompositionEnd={(event) => {
            if (event.target.value.length === 4) {
              moveToNext(`ss-user-message-phone_number_3_${contentIndex}`);
            }
          }}
          value={textInput[textInput.type]?.value2 || EMPTY_INPUT_VALUE}
        ></InputCustom>
        <InputCustom
          id={`ss-user-message-phone_number_3_${contentIndex}`}
          disabled={disabled}
          className="ss-message__content--user-text-input ss-input-value ss-message__content--user-text-input-phone_number-hyphen"
          placeholder={textInput[textInput.type]?.number3}
          maxLength={4}
          type="tel"
          inputMode="numeric"
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              textInput.type,
              "value3"
            )
          }
          value={textInput[textInput.type]?.value3 || EMPTY_INPUT_VALUE}
        ></InputCustom>
      </div>
    </React.Fragment>
  );
};

PhoneNumber.propTypes = {
  content: PropTypes.object,
  disabled: PropTypes.bool,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
};

export default PhoneNumber;
