import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { baseUserMessageComponentPropTypes } from "./userMessageComponentPropTypes";
import "v2/assets/css/bot/preview-chat-bot.css";
import {
  CART_SYSTEM,
  MESSAGE_CONTENT_TYPES,
  REQUIRED_FIELD_LABEL,
} from "v2/views/Preview/PreviewComponent/Constants";
import {
  getRadioImgGridStyle,
  getImgGridClassName,
  normalizeRadioButtonImgLayout,
} from "v2/views/ScenarioSetting/utils/radioButtonImgLayoutUtils";
import {
  buildEditorRadioOptionDataAttr,
  getRadioOptionSelectionKey,
  isRadioOptionInitiallySelected,
} from "v2/views/ScenarioSetting/utils/radioButtonSelectionUtils";
import { RADIO_BUTTON_TYPES } from "v2/views/ScenarioSetting/constants/contentTypeConstants";
import {
  getGenderOptions,
  isGenderRadio,
} from "v2/views/ScenarioSetting/utils/radioButtonGenderUtils";
import { isMobile } from "v2/views/Preview/PreviewComponent/Utils";
import OptionGender from "./OptionGender";

const applyRadioImgGridCssVars = (element, radioButton) => {
  if (!element) return;
  const vars = getRadioImgGridStyle(radioButton);
  Object.entries(vars).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
};

const LEXICA_PATH_KEYS = ["path", "order_path"];
const FIRST_TIME_VALUE = "first_time";
const FIRST_TIME_LABEL = "はじめて";

const isLexicaPathRadio = (radioButton) => {
  const key = String(radioButton?.save_input_content || "");
  return LEXICA_PATH_KEYS.includes(key);
};

const isFirstTimeOption = (item) => {
  const value = String(item?.value ?? "").toLowerCase();
  const text = String(item?.text || "");
  return value === FIRST_TIME_VALUE || text.includes(FIRST_TIME_LABEL);
};

const visibleRadioItems = (radioButton, cartSystem) => {
  const items = radioButton?.[radioButton.type] || [];
  if (cartSystem !== CART_SYSTEM.LEXICA) return items;
  if (!isMobile() || !isLexicaPathRadio(radioButton)) return items;
  return items.filter((item) => !isFirstTimeOption(item));
};

const PREVIEW_OPTION_PLACEHOLDER_LABEL = "ラベル";
const EMPTY_IMAGE_ALT = "";

const RadioButton = ({
  content,
  disabled,
  onChangeValue,
  errors,
  contentIndex,
  messageIndex,
  notUseButtonNext,
  onClickNext,
  cartSystem = "",
}) => {
  const isRadioContent = content.type === MESSAGE_CONTENT_TYPES.RADIO_BUTTON;
  const radioButton = isRadioContent ? content.radio_button : null;
  const visibleItems = radioButton
    ? visibleRadioItems(radioButton, cartSystem)
    : [];

  const initialSelection = radioButton?.initial_selection || "";

  useEffect(() => {
    if (!radioButton) return;
    if (cartSystem !== CART_SYSTEM.LEXICA) return;
    if (!isMobile() || !isLexicaPathRadio(radioButton)) return;
    if (!initialSelection) return;
    const stillVisible = visibleRadioItems(radioButton, cartSystem).some(
      (item) => getRadioOptionSelectionKey(item) === initialSelection
    );
    if (stillVisible) return;
    onChangeValue(contentIndex, content.type, "", "initial_selection");
  }, [
    cartSystem,
    content.type,
    contentIndex,
    initialSelection,
    onChangeValue,
    radioButton,
  ]);

  if (!isRadioContent || !radioButton) return null;

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

  const advanceAfterOptionSelect = () => {
    if (!notUseButtonNext) return;
    setTimeout(() => onClickNext(), 200);
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
    ]
      .filter(Boolean)
      .join(" ");
  };

  const renderGenderContent = () => (
    <OptionGender
      contentIndex={contentIndex}
      radioButton={radioButton}
      onChangeValue={onChangeValue}
      options={getGenderOptions(radioButton)}
      onAdvanceAfterSelect={advanceAfterOptionSelect}
    />
  );

  const renderDefaultContent = () => {
    if (isGenderRadio(radioButton)) return renderGenderContent();

    return visibleItems.map((item, index) => {
      const selectionKey = getRadioOptionSelectionKey(item);
      const inputId = `ss-message__content--user-radio_button_${messageIndex}_${contentIndex}_${selectionKey}_${index}`;
      const isSelected = isRadioOptionInitiallySelected(radioButton, item);
      return (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(
            contentIndex,
            item
          )}
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
              advanceAfterOptionSelect();
            }}
          />
          {item.text && <label htmlFor={inputId}>{item.text}</label>}
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
    advanceAfterOptionSelect();
  };

  const renderRadioButtonImgContent = () => {
    const items = visibleItems;
    const layout = normalizeRadioButtonImgLayout(radioButton);
    const gridClassName = getImgGridClassName(
      "ss-message__content--user-radio_button-img-grid",
      layout.type
    );

    return (
      <div
        className={gridClassName}
        ref={(element) => applyRadioImgGridCssVars(element, radioButton)}
      >
        {items.map((item, index) => {
          const selectionKey = getRadioOptionSelectionKey(item);
          const inputId = `ss-message__content--user-radio_button_img_${messageIndex}_${contentIndex}_${selectionKey}_${index}`;
          const isSelected = isRadioOptionInitiallySelected(radioButton, item);
          return (
            <div
              key={index}
              data-editor-radio-option={buildEditorRadioOptionDataAttr(
                contentIndex,
                item
              )}
              className={[
                "ss-message__content--user-radio_button--radio_button_img",
                isSelected
                  ? "ss-message__content--user-radio_button--selected"
                  : "",
                disabled
                  ? "ss-message__content--user-radio_button--radio_button_img--disabled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleImageOptionSelect(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
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
              <img
                src={item.img}
                alt={item.alt || item.text || EMPTY_IMAGE_ALT}
              />
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
    return visibleItems.map((item, index) => {
      const selectionKey = getRadioOptionSelectionKey(item);
      return (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(
            contentIndex,
            item
          )}
          className="ss-message__content--user-radio_button--block_style"
          onClick={() => {
            onChangeValue(
              contentIndex,
              content.type,
              selectionKey,
              "initial_selection"
            );
            advanceAfterOptionSelect();
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
      case RADIO_BUTTON_TYPES.GENDER:
        return renderGenderContent();
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
    if (
      !errors?.[`message${messageIndex}_content${contentIndex}_${content.type}`]
    )
      return null;
    return (
      <div className="validation-error-message">
        {
          errors?.[
            `message${messageIndex}_content${contentIndex}_${content.type}`
          ]
        }
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
  cartSystem: PropTypes.string,
};

export default RadioButton;
