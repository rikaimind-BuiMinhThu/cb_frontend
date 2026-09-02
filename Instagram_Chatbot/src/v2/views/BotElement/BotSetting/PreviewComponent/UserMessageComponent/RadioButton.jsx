import React from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import {
  getRadioImgGridStyle,
  getImgGridClassName,
  normalizeRadioButtonImgLayout,
} from "v2/views/BotElement/BotSetting/ScenarioSetting/utils/radioButtonImgLayoutUtils";
import {
  buildEditorRadioOptionDataAttr,
  getRadioOptionSelectionKey,
  isRadioOptionInitiallySelected,
} from "v2/views/BotElement/BotSetting/ScenarioSetting/utils/radioButtonSelectionUtils";
import OptionGender from "./OptionGender";

const RADIO_BUTTON_TYPES = {
  DEFAULT: "default",
  RADIO_BUTTON_IMG: "radio_button_img",
  UPSELL_BUTTON: "upsell_button",
  CONSUME_API_RESPONSE: "consume_api_response",
  BLOCK_STYLE: "block_style",
};
const PREVIEW_OPTION_PLACEHOLDER_LABEL = "ラベル";

const RadioButton = ({ content, disabled, onChangeValue, errors, contentIndex, messageIndex, notUseButtonNext, onClickNext }) => {
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
        {REQUIRED_FIELD_LABEL}
      </span>
    );

    return (
      <div className="ss-message__content--user-radio_button-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const onClickRadioButton = (item) => {
    const selectionKey = getRadioOptionSelectionKey(item);
    if (selectionKey === radioButton.initial_selection && notUseButtonNext) {
      onClickNext();
    }
  };

  const getDefaultOptionClassName = (item) => {
    const isSelected = isRadioOptionInitiallySelected(radioButton, item);
    return [
      "ss-message__content--user-radio_button",
      isSelected ? "ss-message__content--user-radio_button--selected" : "",
    ].filter(Boolean).join(" ");
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
      const selectionKey = getRadioOptionSelectionKey(item);
      const inputId = `ss-message__content--user-radio_button_${messageIndex}_${contentIndex}_${selectionKey}_${index}`;
      const isSelected = isRadioOptionInitiallySelected(radioButton, item);
      return (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(contentIndex, item)}
          className={getDefaultOptionClassName(item)}
        >
          <input
            disabled={disabled}
            type="radio"
            id={inputId}
            name={`ss-message__content--user-radio_button_msg${messageIndex}_content${contentIndex}_${content.type}`}
            checked={isSelected}
            onClick={() => onClickRadioButton(item)}
            onChange={() => {
              onChangeValue(
                contentIndex,
                content.type,
                selectionKey,
                "initial_selection"
              );
              if (notUseButtonNext) setTimeout(() => onClickNext(), 200);
            }}
          />
          {item.text && (
            <label htmlFor={inputId}>
              {item.text}
            </label>
          )}
        </div>
      );
    });
  };

  const handleImageOptionSelect = (item) => {
    if (disabled) return;
    const selectionKey = getRadioOptionSelectionKey(item);
    onChangeValue(
      contentIndex,
      content.type,
      selectionKey,
      "initial_selection"
    );
    onClickRadioButton(item);
    if (notUseButtonNext) setTimeout(() => onClickNext(), 200);
  };

  const renderRadioButtonImgContent = () => {
    const items = radioButton[radioButton.type] || [];
    const layout = normalizeRadioButtonImgLayout(radioButton);
    const gridStyle = getRadioImgGridStyle(radioButton);
    const gridClassName = getImgGridClassName(
      'ss-message__content--user-radio_button-img-grid',
      layout.type,
    );

    return (
      <div
          className={gridClassName}
          style={gridStyle}
        >
        {items.map((item, index) => {
          const selectionKey = getRadioOptionSelectionKey(item);
          const inputId = `ss-message__content--user-radio_button_img_${messageIndex}_${contentIndex}_${selectionKey}_${index}`;
          const isSelected = isRadioOptionInitiallySelected(radioButton, item);
          return (
            <div
              key={index}
              data-editor-radio-option={buildEditorRadioOptionDataAttr(contentIndex, item)}
              className={[
                "ss-message__content--user-radio_button--radio_button_img",
                isSelected ? "ss-message__content--user-radio_button--selected" : "",
                disabled ? "ss-message__content--user-radio_button--radio_button_img--disabled" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => handleImageOptionSelect(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleImageOptionSelect(item);
                }
              }}
              role="button"
              tabIndex={disabled ? -1 : 0}
            >
              <input
                disabled={disabled}
                type="radio"
                className="ss-radio-button-img-input--hidden"
                name={`ss-message__content--user-radio_button--radio_button_img_msg${messageIndex}_content${contentIndex}_${content.type}`}
                id={inputId}
                checked={isSelected}
                readOnly
                tabIndex={-1}
                aria-hidden="true"
              />
              <img src={item.img} alt="" />
            </div>
          );
        })}
      </div>
    );
  };

  const renderConsumeApiResponseContent = () => {
    return (
      <>
        {[0, 1].map((index) => {
          const inputId = `ss-message__content--user-radio_button_api_${messageIndex}_${contentIndex}_${index}`;
          return (
            <div key={index} className="ss-message__content--user-radio_button">
              <input
                type="radio"
                name={`ss-message__content--user-radio_button_msg${messageIndex}_content${contentIndex}_${content.type}`}
                id={inputId}
                checked={false}
              />
              <label htmlFor={inputId}>
                {PREVIEW_OPTION_PLACEHOLDER_LABEL}
              </label>
            </div>
          );
        })}
      </>
    );
  };

  const renderBlockStyleContent = () => {
    return radioButton[radioButton.type].map((item, index) => {
      const selectionKey = getRadioOptionSelectionKey(item);
      return (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(contentIndex, item)}
          className="ss-message__content--user-radio_button--block_style"
          onClick={() => {
            onChangeValue(
              contentIndex,
              content.type,
              selectionKey,
              "initial_selection"
            );
          }}
        >
          <span>{item.text}</span>
        </div>
      );
    });
  };

  const renderContent = () => {
    switch (radioButton.type) {
      case RADIO_BUTTON_TYPES.DEFAULT:
        return renderDefaultContent();
      case RADIO_BUTTON_TYPES.RADIO_BUTTON_IMG:
        return renderRadioButtonImgContent();
      case RADIO_BUTTON_TYPES.UPSELL_BUTTON:
        return renderRadioButtonImgContent();
      case RADIO_BUTTON_TYPES.CONSUME_API_RESPONSE:
        return renderConsumeApiResponseContent();
      case RADIO_BUTTON_TYPES.BLOCK_STYLE:
        return renderBlockStyleContent();
      default:
        return null;
    }
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
      <div className="ss-message__content--user-radio_button-wrapper">
        {renderContent()}
      </div>
      {renderErrorMessage()}
    </div>
  );
};

RadioButton.propTypes = {
  ...baseUserMessageComponentPropTypes,
  onClickNext: PropTypes.func,
  notUseButtonNext: PropTypes.bool,
};

export default RadioButton;
