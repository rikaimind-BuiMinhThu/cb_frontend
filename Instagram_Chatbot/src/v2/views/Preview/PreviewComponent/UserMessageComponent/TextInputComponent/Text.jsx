import React from "react";
import PropTypes from "prop-types";
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, RENDER_CHATBOT_CONFIG } from "v2/views/Preview/PreviewComponent/Constants";
import InputCustom from "v2/components/BotMessages/InputCustom";
import InputDebounce from "v2/views/ScenarioSetting/scenarioCommon/InputDebounce";

const TEXT_INPUT_TYPE_TEXT = "text";

const resolveChatInputValue = (value, placeholder) => {
  if (value == null || value === EMPTY_INPUT_VALUE) return EMPTY_INPUT_VALUE;
  if (placeholder && String(value) === String(placeholder)) return EMPTY_INPUT_VALUE;
  return value;
};

const Text = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== TEXT_INPUT_TYPE_TEXT) return null;
  const textInput = content.text_input;

  if (textInput.text?.isSplitInput) {
    return (
      <div className="ss-message__split-row">
        <SplitInputText content={content} disabled={disabled} handleOnChangeJpConvertText={handleOnChangeJpConvertText} contentIndex={contentIndex} onChangeValue={onChangeValue} />
      </div>
    );
  }

  return (
    <SingleInputText content={content} disabled={disabled} handleOnChangeJpConvertText={handleOnChangeJpConvertText} contentIndex={contentIndex} onChangeValue={onChangeValue} />
  );
};

const SplitInputText = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== TEXT_INPUT_TYPE_TEXT) return null;
  const textInput = content.text_input;
  if (!textInput.text?.isSplitInput) return null;

  const leftPlaceholder = textInput.text?.placeholderLeft;
  const rightPlaceholder = textInput.text?.placeholderRight;
  const leftValue = resolveChatInputValue(textInput[textInput.type]?.valueLeft, leftPlaceholder);
  const rightValue = resolveChatInputValue(textInput[textInput.type]?.valueRight, rightPlaceholder);

  if (textInput.isUseConvertText) {
    return (
      <>
        <InputDebounce
          id={content.customId1 || undefined}
          disabled={disabled}
          placeholder={leftPlaceholder}
          containerClassName="w-49-percent-flush"
          onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "valueLeft")}
          value={leftValue}
          debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
        />
        <InputDebounce
          id={content.customId2 || undefined}
          disabled={disabled}
          placeholder={rightPlaceholder}
          containerClassName="w-49-percent"
          onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "valueRight")}
          value={rightValue}
          debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
        />
      </>
    );
  }

  return (
    <>
      <InputCustom
        id={content.customId1 || undefined}
        disabled={disabled}
        placeholder={leftPlaceholder}
        containerClassName="w-49-percent-flush"
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            textInput.type,
            "valueLeft",
          )
        }
        value={leftValue}
      />
      <InputCustom
        id={content.customId2 || undefined}
        disabled={disabled}
        placeholder={rightPlaceholder}
        containerClassName="w-49-percent"
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            textInput.type,
            "valueRight"
          )
        }
        value={rightValue}
      />
    </>
  );
};

const SingleInputText = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== TEXT_INPUT_TYPE_TEXT) return null;
  const textInput = content.text_input;
  if (textInput.text?.isSplitInput) return null;

  const placeholder = textInput.text?.placeholderLeft;
  const inputValue = resolveChatInputValue(textInput[textInput.type]?.value, placeholder);

  if (textInput.isUseConvertText) {
    return (
      <InputDebounce
        id={content.customId || undefined}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "value")}
        className="m-b-0"
        value={inputValue}
        debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
      />
    );
  }

  return (
    <InputCustom
      id={content.customId || undefined}
      disabled={disabled}
      placeholder={placeholder}
      className="m-b-0"
      onChange={(value) =>
        onChangeValue(
          contentIndex,
          content.type,
          value,
          textInput.type,
          "value"
        )
      }
      value={inputValue}
    />
  );
};

const textInputPropTypes = {
  content: PropTypes.object,
  disabled: PropTypes.bool,
  handleOnChangeJpConvertText: PropTypes.func,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
};

Text.propTypes = textInputPropTypes;
SplitInputText.propTypes = textInputPropTypes;
SingleInputText.propTypes = textInputPropTypes;

export default Text;
