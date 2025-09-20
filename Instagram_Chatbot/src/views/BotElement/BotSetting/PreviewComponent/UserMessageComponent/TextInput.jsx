import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import InputCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";
import Text from "./TextInputComponent/Text";


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

  const renderText = () => {
    return (
      <Text content={content} disabled={disabled} handleOnChangeJpConvertText={handleOnChangeJpConvertText} indexContent={indexContent} onChangeValue={onChangeValue} />
    );
  };

  const renderContent = () => {
    switch (textInput.type) {
      case "text":
        return renderText();
      case "phone_number":
        return renderPhoneNumber();
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
      {textInput.type === "phone_number" && (
        <React.Fragment>
          {textInput.phone_number.withHyphen === false ? (
            <InputCustom
              disabled={disabled}
              // className="ss-message__content--user-text-input ss-input-value"
              style={{ marginBottom: "0px" }}
              placeholder={textInput[textInput.type]?.number}
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
              inputMode="numeric"
            ></InputCustom>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <InputCustom
                disabled={disabled}
                className="ss-message__content--user-text-input ss-input-value"
                maxLength={3}
                style={{ marginBottom: "0px", width: "32%" }}
                type="tel"
                inputMode="numeric"
                placeholder={textInput[textInput.type]?.number1}
                onChange={(value) => {
                  if (value.length === 3) {
                    moveToNext(`ss-user-message-phone_number_2_${indexContent}`);
                  }
                  onChangeValue(
                    indexContent,
                    content.type,
                    value,
                    textInput.type,
                    "value1"
                  );
                }}
                onCompositionEnd={(event) => {
                  if (event.target.value.length === 3) {
                    moveToNext(`ss-user-message-phone_number_2_${indexContent}`);
                  }
                }}
                value={textInput[textInput.type]?.value1}
              ></InputCustom>
              <InputCustom
                id={`ss-user-message-phone_number_2_${indexContent}`}
                disabled={disabled}
                className="ss-message__content--user-text-input ss-input-value"
                style={{ marginBottom: "0px", width: "32%" }}
                type="tel"
                inputMode="numeric"
                maxLength={4}
                placeholder={textInput[textInput.type]?.number2}
                onChange={(value) => {
                  if (value.length === 4) {
                    moveToNext(`ss-user-message-phone_number_3_${indexContent}`);
                  }
                  onChangeValue(
                    indexContent,
                    content.type,
                    value,
                    textInput.type,
                    "value2"
                  );
                }}
                onCompositionEnd={(event) => {
                  if (event.target.value.length === 4) {
                    moveToNext(`ss-user-message-phone_number_3_${indexContent}`);
                  }
                }}
                value={textInput[textInput.type]?.value2}
              ></InputCustom>
              <InputCustom
                id={`ss-user-message-phone_number_3_${indexContent}`}
                disabled={disabled}
                // className="ss-message__content--user-text-input ss-input-value"
                style={{ marginBottom: "0px", width: "32%" }}
                placeholder={textInput[textInput.type]?.number3}
                maxLength={4}
                type="tel"
                inputMode="numeric"
                onChange={(value) =>
                  onChangeValue(
                    indexContent,
                    content.type,
                    value,
                    textInput.type,
                    "value3"
                  )
                }
                value={textInput[textInput.type]?.value3}
              ></InputCustom>
            </div>
          )}
        </React.Fragment>
      )}
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