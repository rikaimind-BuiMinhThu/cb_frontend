import React from "react";
import PropTypes from "prop-types";
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, RENDER_CHATBOT_CONFIG } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import InputCustom from "v2/components/BotMessages/InputCustom";
import InputDebounce from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioCommon/InputDebounce";

const TEXT_INPUT_TYPE_TEXT = "text";

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
    <div className="ss-message__split-row">
      <SingleInputText content={content} disabled={disabled} handleOnChangeJpConvertText={handleOnChangeJpConvertText} contentIndex={contentIndex} onChangeValue={onChangeValue} />
    </div>
  );
};

const SplitInputText = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== TEXT_INPUT_TYPE_TEXT) return null;
  const textInput = content.text_input;
  if (!textInput.text?.isSplitInput) return null;

  if (textInput.isUseConvertText) {
    return (
      <>
        <InputDebounce
          id={content.customId1 || undefined}
          disabled={disabled}
          placeholder={textInput.text?.placeholderLeft}
          className="w-49-percent-flush"
          onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "valueLeft")}
          value={textInput[textInput.type]?.valueLeft || EMPTY_INPUT_VALUE}
          debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
        />
        <InputDebounce
          id={content.customId2 || undefined}
          disabled={disabled}
          placeholder={textInput.text?.placeholderRight}
          className="w-49-percent"
          onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "valueRight")}
          value={textInput[textInput.type]?.valueRight || EMPTY_INPUT_VALUE}
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
        placeholder={textInput.text?.placeholderLeft}
        className="w-49-percent-flush"
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            textInput.type,
            "valueLeft",
          )
        }
        value={textInput[textInput.type]?.valueLeft || EMPTY_INPUT_VALUE}
      />
      <InputCustom
        id={content.customId2 || undefined}
        disabled={disabled}
        placeholder={textInput.text?.placeholderRight}
        className="w-49-percent"
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            textInput.type,
            "valueRight"
          )
        }
        value={textInput[textInput.type]?.valueRight || EMPTY_INPUT_VALUE}
      />
    </>
  );
};

const SingleInputText = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== TEXT_INPUT_TYPE_TEXT) return null;
  const textInput = content.text_input;
  if (textInput.text?.isSplitInput) return null;

  if (textInput.isUseConvertText) {
    return (
      <InputDebounce
        id={content.customId || undefined}
        disabled={disabled}
        placeholder={textInput.text?.placeholderLeft}
        onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "value")}
        className="w-49-percent-flush"
        value={textInput[textInput.type]?.value || EMPTY_INPUT_VALUE}
        debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
      />
    );
  }

  return (
    <InputCustom
      id={content.customId || undefined}
      disabled={disabled}
      placeholder={textInput.text?.placeholderLeft}
      className="w-49-percent-flush"
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
