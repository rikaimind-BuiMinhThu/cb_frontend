import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";

export default function RadioButton({ content, disabled, onChangeValue, errors, contentIndex, indexMessage }) {
  if (content.type !== MESSAGE_CONTENT_TYPES.RADIO_BUTTON) return null;

  const radioButton = content.radio_button;
  if (!radioButton) return null;

  const renderTitle = () => {
    if (!radioButton.title_require && !radioButton.require) return null;
    const title = radioButton.title_require && (
      <span className="ss-message__content--user-radio_button-title">
        {radioButton.title}
      </span>
    );
    const requiredLabel = radioButton.require === true && (
      <span className="ss-message__content--user-text-input-required">
        ※必須
      </span>
    );

    return (
      <div className="ss-message__content--user-radio_button-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderDefaultContent = () => {
    if (radioButton.use_as_gender)
      return <OptionGender 
        contentIndex={contentIndex} 
        radioButton={radioButton} 
        onChangeValue={onChangeValue} 
        options={radioButton[radioButton.type]}
      />;

    return radioButton[radioButton.type].map((item, index) => {
      return (
        <div 
          key={index} 
          className="ss-message__content--user-radio_button"
        >
          <input
            disabled={disabled}
            type="radio"
            id={`ss-message__content--user-radio_button_${item.value}`}
            checked={radioButton.initial_selection === item.value}
            onChange={() => {
              onChangeValue(
                contentIndex,
                content.type,
                item.value,
                "initial_selection"
              );
              // if (messageContent.length === 1) onClickNext();
            }}
          />
          {item.text && (
            <label htmlFor={`ss-message__content--user-radio_button_${item.value}`}>
              {item.text}
            </label>
          )}
        </div>
      );
    });
  };

  const renderRadioButtonImgContent = () => {
    return radioButton[radioButton.type].map((item, index) => {
      return (
        <div 
          key={index} 
          className="ss-message__content--user-radio_button--radio_button_img"
        >
          <input
            disabled={disabled}
            type="radio"
            name="ss-message__content--user-radio_button--radio_button_img"
            id="ss-message__content--user-radio_button--radio_button_img"
            checked={radioButton.initial_selection === item.value}
            onChange={() => {
              onChangeValue(
                contentIndex,
                content.type,
                item.value,
                "initial_selection"
              );
              // if (messageContent.length === 1) onClickNext();
            }}
          />
          <img src={item.img} alt="" />
          {item.text && (
            <label htmlFor={`ss-message__content--user-radio_button_${item.value}`}>
              {item.text}
            </label>
          )}
        </div>
      );
    });
  };

  const renderConsumeApiResponseContent = () => {
    return (
      <>
        <div className="ss-message__content--user-radio_button">
          <input
            type="radio"
            name="ss-message__content--user-radio_button"
            id="ss-message__content--user-radio_button"
          />
          <label htmlFor="ss-message__content--user-radio_button">
            ラベル
          </label>
        </div>
        <div className="ss-message__content--user-radio_button">
          <input
            type="radio"
            name="ss-message__content--user-radio_button"
            id="ss-message__content--user-radio_button"
          />
          <label htmlFor="ss-message__content--user-radio_button">
            ラベル
          </label>
        </div>
      </>
    );
  };

  const renderBlockStyleContent = () => {
    return radioButton[radioButton.type].map((item, index) => {
      return (
        <div
          key={index}
          className="ss-message__content--user-radio_button--block_style"
          onClick={() => {
            onChangeValue(
              contentIndex,
              content.type,
              item.value,
              "initial_selection"
            );
            // if (messageContent.length === 1) onClickNext();
          }}
        >
          <span>{item.text}</span>
        </div>
      );
    });
  };

  const renderContent = () => {
    switch (radioButton.type) {
      case "default":
        return renderDefaultContent();
      case "radio_button_img":
        return renderRadioButtonImgContent();
      case "consume_api_response":
        return renderConsumeApiResponseContent();
      case "block_style":
        return renderBlockStyleContent();
      default:
        return null;
    }
  };

  const renderErrorMessage = () => {
    if (!errors?.[`message${indexMessage}_content${contentIndex}_${content.type}`]) return null;
    return (
      <div className="validation-error-message">
        {errors?.[`message${indexMessage}_content${contentIndex}_${content.type}`]}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      {renderTitle()}
      <div className="ss-message__content--user-radio_button-wrapper">
        {renderContent()}
      </div>
      {renderErrorMessage()}
    </div>
  );
};
