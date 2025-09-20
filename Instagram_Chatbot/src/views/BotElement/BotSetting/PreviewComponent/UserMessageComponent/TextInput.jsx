import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import InputCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";
import Text from "./TextInputComponent/Text";
import PhoneNumber from "./TextInputComponent/PhoneNumber";

export default function TextInput({ content, disabled, handleOnChangeJpConvertText, indexContent, onChangeValue, errors, indexMessage }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.TEXT_INPUT) return null;
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
          indexContent={indexContent}
          onChangeValue={onChangeValue}
        />;
      case "phone_number":
        return <PhoneNumber content={content}
          disabled={disabled}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
        />;
      case "password":
        return renderPassword();
      case "urls":
        return renderUrls();
      case "email_address":
        return renderEmailAddress();
      case "email_confirmation":
        return renderEmailConfirmation();
      case "password_confirmation":
        return renderPasswordConfirmation();
      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      {renderTitle()}
      {renderContent()}
      {textInput.type === "password" && (
        <React.Fragment>
          <InputCustom
            disabled={disabled}
            type="password"
            // className="ss-message__content--user-text-input ss-input-value"
            style={{ marginBottom: "0px" }}
            placeholder={textInput[textInput.type]?.password}
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                textInput.type,
                "value"
              )
            }
            value={textInput[textInput.type]?.value}
          ></InputCustom>
        </React.Fragment>
      )}
      {(textInput.type === "urls" ||
        textInput.type === "email_address") && (
          <React.Fragment>
            <InputCustom
              disabled={disabled}
              // className="ss-message__content--user-text-input ss-input-value"
              style={{ marginBottom: "0px" }}
              placeholder={textInput[textInput.type].placeholder}
              onChange={(value) =>
                onChangeValue(
                  indexContent,
                  content.type,
                  value,
                  textInput.type,
                  "value"
                )
              }
              value={textInput[textInput.type]?.value}
            ></InputCustom>
          </React.Fragment>
        )}
      {textInput.type === "email_confirmation" && (
        <>
          <InputCustom
            style={{ marginBottom: "5px" }}
            disabled={disabled}
            placeholder={textInput[textInput.type].cfEmlAdd_email}
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                textInput.type,
                "value"
              )
            }
            value={textInput[textInput.type]?.value}
          />
          <InputCustom
            disabled={disabled}
            placeholder={
              textInput[textInput.type].cfEmlAdd_confirm_email
            }
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                textInput.type,
                "valueConfirm"
              )
            }
            value={textInput[textInput.type]?.valueConfirm}
          />
        </>
      )}
      {textInput.type === "password_confirmation" && (
        <>
          <InputCustom
            style={{ marginBottom: "5px" }}
            disabled={disabled}
            type="password"
            placeholder={textInput[textInput.type].password}
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                textInput.type,
                "value"
              )
            }
            value={textInput[textInput.type]?.value}
          />
          <InputCustom
            disabled={disabled}
            type="password"
            placeholder={textInput[textInput.type].confirm_password}
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                textInput.type,
                "valueConfirm"
              )
            }
            value={textInput[textInput.type]?.valueConfirm}
          />
        </>
      )}
      {errors?.[
        `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
      ] && (
          <div style={{ color: "#FF7E00", fontSize: "12px" }}>
            {
              errors?.[
              `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
              ]
            }
          </div>
        )}
    </div>
  )
};