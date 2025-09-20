import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";

export default function TextArea({ content, disabled, onChangeValue, errors, indexContent, indexMessage }) {
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
        ※必須
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
    if (textareaType !== "text_input" && textareaType !== "invalid_input") return null;
    const textareaValue = textareaType === "invalid_input" ? textarea[textareaType]?.content : textarea[textareaType]?.value;

    return (
      <textarea
        disabled={disabled || textareaType === "invalid_input"}
        className="ss-message__content--user-textarea ss-input-value"
        placeholder={textarea[textareaType]?.content}
        rows={3}
        onChange={(e) =>
          onChangeValue(
            indexContent,
            content.type,
            e.target.value,
            textareaType,
            "value"
          )
        }
        value={textareaValue}
      ></textarea>
    );
  };

  const renderErrorMessage = () => {
    if (!errors?.[`message${indexMessage}_content${indexContent}_${content.type}`]) return null;
    return (
      <div className="validation-error-message">
        {errors?.[`message${indexMessage}_content${indexContent}_${content.type}`]}
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