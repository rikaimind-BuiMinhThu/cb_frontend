import React from 'react';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import {
  getCheckboxImgGridStyle,
  getImgGridClassName,
  normalizeCheckboxImgLayout,
} from "v2/views/BotElement/BotSetting/ScenarioSetting/utils/radioButtonImgLayoutUtils";
import {
  buildEditorCheckboxOptionDataAttr,
  getCheckboxImgSelectionKey,
  getCheckboxOptionSelectionKey,
  isCheckboxImgContentChecked,
  isCheckboxOptionChecked,
} from "v2/views/BotElement/BotSetting/ScenarioSetting/utils/checkboxSelectionUtils";

const CHECKBOX_TYPES = {
  DEFAULT: "default",
  CHECKBOX_IMG: "checkbox_img",
  CONSUME_API_RESPONSE: "consume_api_response",
};
const PREVIEW_OPTION_PLACEHOLDER_LABEL = "ラベル";

const Checkbox = ({ content, disabled, onChangeValue, errors, contentIndex, messageIndex }) => {
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
        {REQUIRED_FIELD_LABEL}
      </span>
    );

    return (
      <div className="ss-message__content--user-checkbox-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const handleDefaultChange = (item) => {
    const selectionKey = getCheckboxOptionSelectionKey(item);
    const current = [...(checkbox.checkedValue ?? [])];
    const index = current.findIndex((value) => String(value) === String(selectionKey));
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(selectionKey);
    }
    onChangeValue(contentIndex, content.type, current, "checkedValue");
  };

  const handleCheckboxImgChange = (group, contentItem) => {
    const selectionKey = getCheckboxImgSelectionKey(group, contentItem);
    const current = [...(checkbox.initial_selection_picture ?? [])];
    const index = current.findIndex((value) => String(value) === String(selectionKey));
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(selectionKey);
    }
    onChangeValue(contentIndex, content.type, current, "initial_selection_picture");
  };

  const getDefaultOptionClassName = (item) => {
    const isSelected = isCheckboxOptionChecked(checkbox, item);
    return [
      "ss-message__content--user-checkbox",
      isSelected ? "ss-message__content--user-checkbox--selected" : "",
    ].filter(Boolean).join(" ");
  };

  const renderDefaultContent = () => {
    return checkbox[checkbox.type].map((item, index) => {
      const selectionKey = getCheckboxOptionSelectionKey(item);
      const inputId = `ss-message__content--user-checkbox_${messageIndex}_${contentIndex}_${selectionKey}_${index}`;
      const isSelected = isCheckboxOptionChecked(checkbox, item);
      return (
        <div
          key={index}
          data-editor-checkbox-option={buildEditorCheckboxOptionDataAttr(contentIndex, item.id)}
          className={getDefaultOptionClassName(item)}
        >
          <input
            disabled={disabled}
            type="checkbox"
            id={inputId}
            name={`ss-message__content--user-checkbox_msg${messageIndex}_content${contentIndex}_${content.type}`}
            checked={isSelected}
            onChange={() => handleDefaultChange(item)}
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

  const renderCheckboxImgContent = () => {
    const layout = normalizeCheckboxImgLayout(checkbox);
    const gridStyle = getCheckboxImgGridStyle(checkbox);
    const gridClassName = getImgGridClassName(
      'ss-message__content--user-checkbox-img-grid',
      layout.type,
    );

    return checkbox[checkbox.type]?.map((group, groupIndex) => (
      <div
        key={groupIndex}
        data-editor-checkbox-option={buildEditorCheckboxOptionDataAttr(contentIndex, group.id)}
        className="ss-message__content--user-checkbox--checkbox_img"
      >
        <div
          className={gridClassName}
          style={{
            '--checkbox-option-margin': gridStyle['--checkbox-option-margin'],
            '--checkbox-option-padding': gridStyle['--checkbox-option-padding'],
            '--scroll-visible-columns': gridStyle['--scroll-visible-columns'],
            '--preview-grid-columns': gridStyle.gridTemplateColumns,
          }}
        >
          {group.contents?.map((contentItem, contentItemIndex) => {
            const compositeKey = getCheckboxImgSelectionKey(group, contentItem);
            const inputId = `ss-message__content--user-checkbox_img_${messageIndex}_${contentIndex}_${compositeKey}_${contentItemIndex}`;
            const isSelected = isCheckboxImgContentChecked(checkbox, group, contentItem);
            return (
              <div
                key={contentItemIndex}
                data-editor-checkbox-option={buildEditorCheckboxOptionDataAttr(contentIndex, compositeKey)}
                className={[
                  "ss-message__content--user-checkbox--checkbox_img-item",
                  isSelected ? "ss-message__content--user-checkbox--selected" : "",
                  disabled ? "ss-message__content--user-checkbox--checkbox_img-item--disabled" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => {
                  if (disabled) return;
                  handleCheckboxImgChange(group, contentItem);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!disabled) handleCheckboxImgChange(group, contentItem);
                  }
                }}
                role="button"
                tabIndex={disabled ? -1 : 0}
              >
                <input
                  disabled={disabled}
                  type="checkbox"
                  className="ss-checkbox-img-input--hidden"
                  name={`ss-message__content--user-checkbox--checkbox_img_msg${messageIndex}_content${contentIndex}_${content.type}`}
                  id={inputId}
                  checked={isSelected}
                  readOnly
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <img src={contentItem.file_url} alt="" />
                {contentItem.text && (
                  <div className="ss-message__content--user-checkbox-img-text">{contentItem.text}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  const renderConsumeApiResponseContent = () => {
    return (
      <>
        {[0, 1].map((index) => {
          const inputId = `ss-message__content--user-checkbox_api_${messageIndex}_${contentIndex}_${index}`;
          return (
            <div key={index} className="ss-message__content--user-checkbox">
              <input
                type="checkbox"
                name={`ss-message__content--user-checkbox_msg${messageIndex}_content${contentIndex}_${content.type}`}
                id={inputId}
                disabled={disabled}
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

  const renderContent = () => {
    switch (checkbox.type) {
      case CHECKBOX_TYPES.DEFAULT:
        return renderDefaultContent();
      case CHECKBOX_TYPES.CHECKBOX_IMG:
        return renderCheckboxImgContent();
      case CHECKBOX_TYPES.CONSUME_API_RESPONSE:
        return renderConsumeApiResponseContent();
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
      <div className="ss-message__content--user-checkbox-wrapper">
        {renderContent()}
      </div>
      {renderErrorMessage()}
    </div>
  );
};

Checkbox.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

export default Checkbox;
