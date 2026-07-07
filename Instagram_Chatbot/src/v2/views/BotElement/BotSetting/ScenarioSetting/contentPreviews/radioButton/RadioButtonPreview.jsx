import React from 'react';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { RADIO_BUTTON_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import {
  getRadioImgGridStyle,
  getRadioImgOptionStyle,
  getImgGridClassName,
  normalizeRadioButtonImgLayout,
} from '../../utils/radioButtonImgLayoutUtils';
import {
  buildEditorRadioOptionDataAttr,
  isEditorRadioOptionHighlighted,
  isRadioOptionInitiallySelected,
} from '../../utils/radioButtonSelectionUtils';
import '../../styles/contentPreviews/radioButton.css';

const RadioButtonPreview = ({
  radioButton,
  indexMessageSelect,
  indexContent,
  editorSelectedRadioOption,
}) => {
  const getEditorHighlightClassName = (item) => (
    isEditorRadioOptionHighlighted(
      editorSelectedRadioOption,
      indexMessageSelect,
      indexContent,
      radioButton.type,
      item,
    ) ? 'ss-radio-button-preview__option--selected' : ''
  );

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

  const renderDefaultType = () => (
    radioButton[radioButton.type].map((item, index) => {
      const inputId = `ss-radio-button-preview-default-${index}`;
      const isSelected = isRadioOptionInitiallySelected(radioButton, item);
      return (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(indexContent, item)}
          className={[
            'ss-message__content--user-radio_button',
            isSelected ? 'ss-message__content--user-radio_button--selected' : '',
            getEditorHighlightClassName(item),
          ].filter(Boolean).join(' ')}
        >
          <input
            type="radio"
            name="ss-message__content--user-radio_button"
            id={inputId}
            disabled
            checked={isSelected}
          />
          {item.text && (
            <label htmlFor={inputId}>{item.text}</label>
          )}
        </div>
      );
    })
  );

  const renderImgType = () => {
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
          const inputId = `ss-radio-button-preview-img-${index}`;
          const isSelected = isRadioOptionInitiallySelected(radioButton, item);
          return (
            <div
              key={index}
              data-editor-radio-option={buildEditorRadioOptionDataAttr(indexContent, item)}
              className={[
                'ss-message__content--user-radio_button--radio_button_img',
                isSelected ? 'ss-message__content--user-radio_button--selected' : '',
                getEditorHighlightClassName(item),
              ].filter(Boolean).join(' ')}
              style={getRadioImgOptionStyle(radioButton)}
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
              <img src={item.img} alt="" />
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
            <label htmlFor={inputId}>
              {PREVIEW_LABELS.placeholderLabel}
            </label>
          </div>
        );
      })}
    </>
  );

  const renderBlockStyleType = () => (
    radioButton[radioButton.type].map((item, index) => (
      item.text && (
        <div
          key={index}
          data-editor-radio-option={buildEditorRadioOptionDataAttr(indexContent, item)}
          className={[
            'ss-message__content--user-radio_button--block_style',
            'ss-radio-button-preview__block-item',
            getEditorHighlightClassName(item),
          ].filter(Boolean).join(' ')}
        >
          <span>{item.text}</span>
        </div>
      )
    ))
  );

  const renderTypeBody = () => {
    switch (radioButton.type) {
      case RADIO_BUTTON_TYPES.DEFAULT:
        return renderDefaultType();
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
