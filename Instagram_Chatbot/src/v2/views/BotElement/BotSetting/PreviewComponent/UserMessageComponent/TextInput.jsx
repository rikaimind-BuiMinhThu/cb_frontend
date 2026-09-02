import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import InputCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";
import Text from "./TextInputComponent/Text";
import PhoneNumber from "./TextInputComponent/PhoneNumber";
import EmailInput from "./TextInputComponent/EmailInput";

export default function TextInput({ content, disabled, handleOnChangeJpConvertText, contentIndex, onChangeValue, errors, messageIndex }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT) return null;
  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}_${content.text_input.type}`;
  const textInput = content.text_input;

  const renderTitle = () => {
    if (!textInput.title_require && !textInput.require) return null;
    const title = textInput.title_require &&  (
      <span className="ss-message__content--user-text-input-title">
        {textInput.title}
      </span>
    );

    const requiredLabel = textInput.require && (
      <span className="ss-message__content--user-text-input-required">
        ※必須
      </span>
    );
    
    return (
      <div className="ss-message__content--user-text-input-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderContent = () => {
    switch (textInput.type) {
      case "text":
        return <Text content={content}
          disabled={disabled}
          handleOnChangeJpConvertText={handleOnChangeJpConvertText}
          contentIndex={contentIndex}
          onChangeValue={onChangeValue}
        />;
      case "phone_number":
        return <PhoneNumber content={content}
          disabled={disabled}
          contentIndex={contentIndex}
          onChangeValue={onChangeValue}
        />;
      case "password":
        return <>
          <InputCustom
            disabled={disabled}
            type="password"
            className="m-b-0"
            placeholder={textInput[textInput.type]?.password}
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
        </>;
      case "urls":
        return <>
          <InputCustom
            disabled={disabled}
            className="m-b-0"
            placeholder={textInput[textInput.type].placeholder}
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
        </>;
      case "email_address":
        return <>
          <EmailInput
            disabled={disabled}
            className="m-b-0"
            placeholder={textInput[textInput.type].placeholder}
            domainSuggestion={textInput[textInput.type]?.domain_suggestion}
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
        </>;
      case "email_confirmation":
        return <>
          <EmailInput
            className="m-b-5"
            disabled={disabled}
            placeholder={textInput[textInput.type].cfEmlAdd_email}
            domainSuggestion={textInput[textInput.type]?.domain_suggestion}
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
          <EmailInput
            disabled={disabled}
            placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
            domainSuggestion={textInput[textInput.type]?.domain_suggestion}
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                textInput.type,
                "valueConfirm"
              )
            }
            value={textInput[textInput.type]?.valueConfirm || ""}
          />
        </>;
      case "password_confirmation":
        return <>
          <InputCustom
            className="m-b-5"
            disabled={disabled}
            type="password"
            placeholder={textInput[textInput.type].password}
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
          <InputCustom
            disabled={disabled}
            type="password"
            placeholder={textInput[textInput.type].confirm_password}
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                textInput.type,
                "valueConfirm"
              )
            }
            value={textInput[textInput.type]?.valueConfirm || ""}
          />
        </>;
      default:
        return null;
    }
  };

  const renderErrorMessage = () => {
    if (!errors?.[errorKey]) return null;
    return (
      <div className="validation-error-message">
        {errors?.[errorKey]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      {renderContent()}
      {renderErrorMessage()}
    </div>
  )
};