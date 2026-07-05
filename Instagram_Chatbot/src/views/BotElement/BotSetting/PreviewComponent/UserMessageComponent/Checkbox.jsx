import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import { Checkbox as AntdCheckbox } from "antd";

export default function Checkbox({ content, disabled, onChangeValue, errors, contentIndex, messageIndex }) {
  if (content.type !== MESSAGE_CONTENT_TYPES.CHECKBOX) return null;

  const checkbox = content.checkbox;
  if (!checkbox) return null;

  const renderTitle = () => {
    if (!checkbox.title_require && !checkbox.require) return null;

    const title = checkbox.title_require && (
      <span className="ss-message__content--user-checkbox-title">
        {checkbox.title}
      </span>
    );

    const requiredLabel = checkbox.require === true && (
      <span className="ss-message__content--user-text-input-required">
        ※必須
      </span>
    );

    return (
      <div className="ss-message__content--user-checkbox-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderContent = () => {
    switch (checkbox.type) {
      case "default":
        return renderDefaultContent();
      case "checkbox_img":
        return renderCheckboxImgContent();
      case "consume_api_response":
        return renderConsumeApiResponseContent();
      default:
        return null;
    }
  };

  const renderDefaultContent = () => {
    return (
      <AntdCheckbox.Group
        className="w-100-percent"
        disabled={disabled}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            "checkedValue"
          )
        }
        value={checkbox.checkedValue}
      >
        {checkbox[checkbox.type].map((item, index) => {
          return (
            <div key={index} className="ss-message__content--user-checkbox">
              <AntdCheckbox value={item.id}>
                <label htmlFor="ss-message__content--user-checkbox">
                  {item.text}
                </label>
              </AntdCheckbox>
            </div>
          );
        })}
      </AntdCheckbox.Group>
    );
  };

  const renderCheckboxImgContent = () => {
    return (
      <AntdCheckbox.Group
        className="w-100-percent"
        disabled={disabled}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            "initial_selection_picture"
            )
          }
          value={checkbox.initial_selection_picture}
        >
          {checkbox[checkbox.type].map((item, index) => {
            return (
              <div
                key={index}
                className="ss-message__content--user-checkbox"
              >
                <AntdCheckbox value={item.id}>
                  <label htmlFor="ss-message__content--user-checkbox">
                    {item.text}
                  </label>
                </AntdCheckbox>
              </div>
            );
          })}
      </AntdCheckbox.Group>
    );
  };

  const renderConsumeApiResponseContent = () => {
    return (
      <>
        <div className="ss-message__content--user-checkbox">
          <input
            type="checkbox"
            name="ss-message__content--user-checkbox"
            id="ss-message__content--user-checkbox"
          />
          <label htmlFor="ss-message__content--user-checkbox">
            ラベル
          </label>
        </div>
        <div className="ss-message__content--user-checkbox">
          <input
            type="checkbox"
            name="ss-message__content--user-checkbox"
            id="ss-message__content--user-checkbox"
            disabled={disabled}
          />
          <label htmlFor="ss-message__content--user-checkbox">
            ラベル
          </label>
        </div>
      </>
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
    <div style={{ marginBottom: "10px" }}>
      {renderTitle()}
      <div className="ss-message__content--user-checkbox-wrapper">
        {renderContent()}
      </div>
      {renderErrorMessage()}
    </div>
  );
}
