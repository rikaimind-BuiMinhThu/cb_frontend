import React from "react";
import ContentPreviewShell from "../shared/ContentPreviewShell";
import { RADIO_BUTTON_TYPES } from "../../constants/contentTypeConstants";
import { PREVIEW_LABELS } from "../../constants/scenarioSettingLabels";
import {
  getRadioImgGridStyle,
  getImgGridClassName,
  normalizeRadioButtonImgLayout,
} from "v2/views/ScenarioSetting/utils/radioButtonImgLayoutUtils";
import {
  buildEditorRadioOptionDataAttr,
  isEditorRadioOptionHighlighted,
  isRadioOptionInitiallySelected,
} from "v2/views/ScenarioSetting/utils/radioButtonSelectionUtils";
import {
  getGenderOptions,
  isGenderRadio,
} from "v2/views/ScenarioSetting/utils/radioButtonGenderUtils";
import {
  GENDER_OPTION_DESIGN_CLASS,
  GENDER_OPTION_SELECTED_CLASS,
  GENDER_OPTION_TWINKLE_CLASS,
  RADIO_OPTION_TWINKLE_CLASS,
  resolveOptionDesignStyle,
} from "v2/views/ScenarioSetting/utils/radioOptionDesignStyle";
import "../../styles/contentPreviews/radioButton.css";
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE } from "v2/views/Preview/PreviewComponent/Constants";

const EMPTY_IMAGE_ALT = "";

const RadioButtonPreview = ({
  radioButton,
  indexMessageSelect,
  indexContent,
  editorSelectedRadioOption,
}) => {
  const getEditorHighlightClassName = (item) =>
    isEditorRadioOptionHighlighted(
      editorSelectedRadioOption,
      indexMessageSelect,
      indexContent,
      radioButton.type,
      item
    )
      ? "ss-radio-button-preview__option--selected"
      : "";

  const renderHeader = () => {
    if (!radioButton.title_require && !radioButton.require) return null;
    return (
      <div className="ss-message__content--user-radio_button-top ss-radio-button-preview__header">
        {radioButton.title_require && (
          <span className="ss-message__content--user-radio_button-title">
            {radioButton.title}
          </span>
        )}
        {radioButton.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    );
  };

  const getOptionDesign = (item) => resolveOptionDesignStyle({
    option: item,
    radioButton,
  });

  const renderDefaultType = () =>
    radioButton[radioButton.type].map((item, index) => {
      const inputId = `ss-radio-button-preview-default-${index}`;
      const isSelected = isRadioOptionInitiallySelected(radioButton, item);
      const { style, twinkle } = getOptionDesign(item);
      return (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(
            indexContent,
            item
          )}
          className={[
            "ss-message__content--user-radio_button",
            isSelected
              ? "ss-message__content--user-radio_button--selected"
              : "",
            twinkle ? RADIO_OPTION_TWINKLE_CLASS : "",
            getEditorHighlightClassName(item),
          ]
            .filter(Boolean)
            .join(" ")}
          style={style}
        >
          <input
            type="radio"
            name="ss-message__content--user-radio_button"
            id={inputId}
            disabled
            checked={isSelected}
          />
          {item.text && <label htmlFor={inputId}>{item.text}</label>}
        </div>
      );
    });

  const getGenderDisplayClass = () => {
    if (radioButton.gender_display_type === "vertical") return "gender-display-column";
    if (radioButton.gender_display_type === "horizontal") return "gender-display-row";
    return EMPTY_INPUT_VALUE;
  };

  const renderGenderType = () => {
    const options = getGenderOptions(radioButton);
    const displayClass = getGenderDisplayClass();

    return (
      <div className="options-gender_wrapper">
        <div className={`options-gender_wrapper-item ${displayClass}`}>
          {options.map((item) => {
            const isSelected = isRadioOptionInitiallySelected(
              radioButton,
              item
            );
            const { resolved, style, twinkle } = getOptionDesign(item);
            const hasDesignVisual = Boolean(
              item?.design
              || item?.preset_config
              || resolved.background_color
              || resolved.image
            );
            return (
              <div
                key={item.id}
                data-editor-radio-option={buildEditorRadioOptionDataAttr(
                  indexContent,
                  item
                )}
                className={[
                  "option-gender-item",
                  hasDesignVisual ? GENDER_OPTION_DESIGN_CLASS : "",
                  isSelected ? GENDER_OPTION_SELECTED_CLASS : "",
                  twinkle ? GENDER_OPTION_TWINKLE_CLASS : "",
                  isSelected ? "ss-radio-button-preview__option--selected" : "",
                  getEditorHighlightClassName(item),
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={style}
              >
                {resolved.image ? (
                  <img
                    className="option-gender-item__design-image"
                    src={resolved.image}
                    alt={item.text || EMPTY_IMAGE_ALT}
                  />
                ) : null}
                {item.text ? (
                  <div className="option-gender-icon-text">{item.text}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderImgType = () => {
    const items = radioButton[radioButton.type] || [];
    const layout = normalizeRadioButtonImgLayout(radioButton);
    const gridClassName = getImgGridClassName(
      "ss-message__content--user-radio_button-img-grid",
      layout.type
    );

    return (
      <div
        className={gridClassName}
        ref={(element) => {
          if (!element) return;
          const vars = getRadioImgGridStyle(radioButton);
          Object.entries(vars).forEach(([name, value]) => {
            element.style.setProperty(name, value);
          });
        }}
      >
        {items.map((item, index) => {
          const inputId = `ss-radio-button-preview-img-${index}`;
          const isSelected = isRadioOptionInitiallySelected(radioButton, item);
          const { resolved, style, twinkle } = getOptionDesign(item);
          const imageSrc = resolved.image || item.img;
          return (
            <div
              key={index}
              data-editor-radio-option={buildEditorRadioOptionDataAttr(
                indexContent,
                item
              )}
              className={[
                "ss-message__content--user-radio_button--radio_button_img",
                isSelected
                  ? "ss-message__content--user-radio_button--selected"
                  : "",
                twinkle ? RADIO_OPTION_TWINKLE_CLASS : "",
                getEditorHighlightClassName(item),
              ]
                .filter(Boolean)
                .join(" ")}
              style={style}
            >
              <input
                type="radio"
                className="ss-radio-button-img-input--hidden"
                name="ss-message__content--user-radio_button--radio_button_img"
                id={inputId}
                disabled
                checked={isSelected}
                readOnly
                tabIndex={-1}
                aria-hidden="true"
              />
              <img src={imageSrc} alt={EMPTY_IMAGE_ALT} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderConsumeApiType = () => (
    <>
      {[0, 1].map((index) => {
        const inputId = `ss-radio-button-preview-api-${index}`;
        return (
          <div key={index} className="ss-message__content--user-radio_button">
            <input
              type="radio"
              name="ss-message__content--user-radio_button"
              id={inputId}
              disabled
              checked={false}
            />
            <label htmlFor={inputId}>{PREVIEW_LABELS.placeholderLabel}</label>
          </div>
        );
      })}
    </>
  );

  const renderBlockStyleType = () =>
    radioButton[radioButton.type].map(
      (item, index) =>
        item.text && (
          <div
            key={index}
            data-editor-radio-option={buildEditorRadioOptionDataAttr(
              indexContent,
              item
            )}
            className={[
              "ss-message__content--user-radio_button--block_style",
              "ss-radio-button-preview__block-item",
              getEditorHighlightClassName(item),
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{item.text}</span>
          </div>
        )
    );

  const renderTypeBody = () => {
    if (isGenderRadio(radioButton)) {
      return renderGenderType();
    }
    switch (radioButton.type) {
      case RADIO_BUTTON_TYPES.DEFAULT:
        return renderDefaultType();
      case RADIO_BUTTON_TYPES.GENDER:
        return renderGenderType();
      case RADIO_BUTTON_TYPES.RADIO_BUTTON_IMG:
        return renderImgType();
      case RADIO_BUTTON_TYPES.UPSELL_BUTTON:
        return renderImgType();
      case RADIO_BUTTON_TYPES.CONSUME_API_RESPONSE:
        return renderConsumeApiType();
      case RADIO_BUTTON_TYPES.BLOCK_STYLE:
        return renderBlockStyleType();
      default:
        return null;
    }
  };

  return (
    <ContentPreviewShell className="ss-radio-button-preview">
      {renderHeader()}
      <div className="ss-message__content--user-radio_button-wrapper">
        {renderTypeBody()}
      </div>
    </ContentPreviewShell>
  );
};

export default RadioButtonPreview;
