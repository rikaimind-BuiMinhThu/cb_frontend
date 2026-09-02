import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, RENDER_CHATBOT_CONFIG } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import InputCustom from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";
import InputDebounce from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputDebounce";

export default function Text({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== "text") return null;
  const textInput = content.text_input;

  if (textInput.text?.isSplitInput) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SplitInputText content={content} disabled={disabled} handleOnChangeJpConvertText={handleOnChangeJpConvertText} contentIndex={contentIndex} onChangeValue={onChangeValue} />
      </div>
    )
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <SingleInputText content={content} disabled={disabled} handleOnChangeJpConvertText={handleOnChangeJpConvertText} contentIndex={contentIndex} onChangeValue={onChangeValue} />
    </div>
  )
}

const SplitInputText = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== "text") return null;
  const textInput = content.text_input;
  if (!textInput.text?.isSplitInput) return null;

  if (textInput.isUseConvertText) {
    return (
      <>
        <InputDebounce
          id={content.customId1 || undefined}
          disabled={disabled}
          placeholder={textInput.text?.placeholderLeft}
          style={{ width: "49%", marginBottom: "0px" }}
          onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "valueLeft")}
          value={textInput[textInput.type]?.valueLeft || ""}
          debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
        />
        <InputDebounce
          id={content.customId2 || undefined}
          disabled={disabled}
          placeholder={textInput.text?.placeholderRight}
          style={{ width: "49%" }}
          onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "valueRight")}
          value={textInput[textInput.type]?.valueRight || ""}
          debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
        />
      </>
    )
  }

  return <>
    <InputCustom
      id={content.customId1 || undefined}
      disabled={disabled}
      placeholder={textInput.text?.placeholderLeft}
      style={{ width: "49%", marginBottom: "0px" }}
      onChange={(value) =>
        onChangeValue(
          contentIndex,
          content.type,
          value,
          textInput.type,
          "valueLeft",
        )
      }
      value={textInput[textInput.type]?.valueLeft || ""}
    />
    <InputCustom
      id={content.customId2 || undefined}
      disabled={disabled}
      placeholder={textInput.text?.placeholderRight}
      style={{ width: "49%" }}
      onChange={(value) =>
        onChangeValue(
          contentIndex,
          content.type,
          value,
          textInput.type,
          "valueRight"
        )
      }
      value={textInput[textInput.type]?.valueRight || ""}
    />
  </>
}

const SingleInputText = ({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT || content.text_input.type !== "text") return null;
  const textInput = content.text_input;
  if (textInput.text?.isSplitInput) return null;

  if (textInput.isUseConvertText) {
    return (
      <InputDebounce
        id={content.customId || undefined}
        disabled={disabled}
        placeholder={textInput.text?.placeholderLeft}
        onChange={handleOnChangeJpConvertText(contentIndex, content.type, textInput.type, "value")}
        style={{ width: "49%", marginBottom: "0px" }}
        value={textInput[textInput.type]?.value || ""}
        debounceTime={RENDER_CHATBOT_CONFIG.DEBOUNCE_INPUT_TEXT_JP_CONVERT}
      />
    )
  }

  return (
    <InputCustom
      id={content.customId || undefined}
      disabled={disabled}
      placeholder={textInput.text?.placeholderLeft}
      style={{ width: "49%", marginBottom: "0px" }}
      onChange={(value) =>
        onChangeValue(
          contentIndex,
          content.type,
          value,
          textInput.type,
          "value"
        )
      }
      value={textInput[textInput.type]?.value || ""}
    />
  )
}
