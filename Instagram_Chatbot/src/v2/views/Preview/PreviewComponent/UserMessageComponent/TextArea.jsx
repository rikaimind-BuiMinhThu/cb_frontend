import React from 'react';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/Preview/PreviewComponent/Constants";
import {
  isFloatPlaceholderEnabled,
  usePreviewTheme,
} from "v2/views/Preview/PreviewComponent/PreviewThemeContext";

const TEXT_AREA_TYPE_TEXT_INPUT = "text_input";
const TEXT_AREA_TYPE_INVALID_INPUT = "invalid_input";
const FIELD_FLOAT_CLASS = "field-float";
const FIELD_FLOAT_FILLED_CLASS = "field-float field-float--filled";
const FIELD_FLOAT_LABEL_CLASS = "field-float__label";

const TextArea = ({ content, disabled, onChangeValue, errors, contentIndex, messageIndex }) => {
  const themeSettings = usePreviewTheme();
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
    const placeholder = textarea[textareaType]?.content;
    const useFloat = isFloatPlaceholderEnabled(themeSettings) && Boolean(placeholder);
    const hasValue = Boolean(textareaValue);
    const floatWrapperClass = hasValue ? FIELD_FLOAT_FILLED_CLASS : FIELD_FLOAT_CLASS;

    const textareaNode = (
      <textarea
        disabled={disabled || textareaType === TEXT_AREA_TYPE_INVALID_INPUT}
        className="ss-message__content--user-textarea ss-input-value"
        placeholder={useFloat ? '' : placeholder}
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
      />
    );

    if (!useFloat) return textareaNode;

    return (
      <div className={floatWrapperClass}>
        <span className={FIELD_FLOAT_LABEL_CLASS}>{placeholder}</span>
        {textareaNode}
      </div>
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

TextArea.propTypes = baseUserMessageComponentPropTypes;

export default TextArea;
