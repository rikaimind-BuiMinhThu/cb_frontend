import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

const TEXT_AREA_TYPE_TEXT_INPUT = "text_input";
const TEXT_AREA_TYPE_INVALID_INPUT = "invalid_input";

const TextArea = ({ content, disabled, onChangeValue, errors, contentIndex, messageIndex }) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.TEXT_AREA) return null;

  const textarea = content.textarea;
  if (!textarea.content) return null;

  const renderTitle = () => {
    if (!textarea.title_require && !textarea.require) return null;

    const title = textarea.title_require && (
      <span className="ss-message__content--user-textarea-title">
        {textarea.title}
      </span>
    );

    const requiredLabel = textarea.require && (
      <span className="ss-message__content--user-text-input-required">
        {REQUIRED_FIELD_LABEL}
      </span>
    );

    return (
      <div className="ss-message__content--user-textarea-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderContent = () => {
    const textareaType = textarea?.type;
    if (!textareaType) return null;
    if (textareaType !== TEXT_AREA_TYPE_TEXT_INPUT && textareaType !== TEXT_AREA_TYPE_INVALID_INPUT) return null;
    const textareaValue = textareaType === TEXT_AREA_TYPE_INVALID_INPUT ? textarea[textareaType]?.content : textarea[textareaType]?.value;

    return (
      <textarea
        disabled={disabled || textareaType === TEXT_AREA_TYPE_INVALID_INPUT}
        className="ss-message__content--user-textarea ss-input-value"
        placeholder={textarea[textareaType]?.content}
        rows={3}
        onChange={(e) =>
          onChangeValue(
            contentIndex,
            content.type,
            e.target.value,
            textareaType,
            "value"
          )
        }
        value={textareaValue || EMPTY_INPUT_VALUE}
      ></textarea>
    );
  };

  const renderErrorMessage = () => {
    if (!errors?.[`message${messageIndex}_content${contentIndex}_${content.type}`]) return null;
    return (
      <div className="validation-error-message">
        {errors?.[`message${messageIndex}_content${contentIndex}_${content.type}`]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      {renderContent()}
      {renderErrorMessage()}
    </div>
  );
};

export default TextArea;
