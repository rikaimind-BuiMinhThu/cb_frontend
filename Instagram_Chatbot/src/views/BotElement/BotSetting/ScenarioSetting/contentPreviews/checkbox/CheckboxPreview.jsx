import React from 'react';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { CHECKBOX_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import {
  getCheckboxImgGridStyle,
  getCheckboxImgOptionStyle,
  getImgGridClassName,
  normalizeCheckboxImgLayout,
} from '../../utils/radioButtonImgLayoutUtils';
import {
  buildEditorCheckboxOptionDataAttr,
  getCheckboxImgSelectionKey,
  getCheckboxOptionSelectionKey,
  isCheckboxImgContentChecked,
  isCheckboxOptionChecked,
  isEditorCheckboxOptionHighlighted,
} from '../../utils/checkboxSelectionUtils';
import '../../styles/contentPreviews/checkbox.css';

const CheckboxPreview = ({
  checkbox,
  indexMessageSelect,
  indexContent,
  editorSelectedCheckboxOption,
}) => {
  const getEditorHighlightClassName = (optionId) => (
    isEditorCheckboxOptionHighlighted(
      editorSelectedCheckboxOption,
      indexMessageSelect,
      indexContent,
      checkbox.type,
      optionId,
    ) ? 'ss-checkbox-preview__option--selected' : ''
  );

  const renderHeader = () => {
    if (!checkbox.title_require && !checkbox.require) return null;
    return (
      <div className="ss-message__content--user-checkbox-top ss-checkbox-preview__header">
        {checkbox.title_require && (
          <span className="ss-message__content--user-checkbox-title">
            {checkbox.title}
          </span>
        )}
        {checkbox.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    );
  };

  const renderDefaultType = () => (
    checkbox[checkbox.type].map((item, index) => {
      const selectionKey = getCheckboxOptionSelectionKey(item);
      const inputId = `ss-checkbox-preview-default-${index}`;
      const isChecked = isCheckboxOptionChecked(checkbox, item);
      return (
        <div
          key={index}
          data-editor-checkbox-option={buildEditorCheckboxOptionDataAttr(indexContent, item.id)}
          className={[
            'ss-message__content--user-checkbox',
            isChecked ? 'ss-message__content--user-checkbox--selected' : '',
            getEditorHighlightClassName(item.id),
          ].filter(Boolean).join(' ')}
        >
          <input
            type="checkbox"
            name="ss-message__content--user-checkbox"
            id={inputId}
            disabled
            checked={isChecked}
          />
          {item.text && (
            <label htmlFor={inputId}>{item.text}</label>
          )}
        </div>
      );
    })
  );

  const renderCheckboxImgType = () => {
    const layout = normalizeCheckboxImgLayout(checkbox);
    const gridStyle = getCheckboxImgGridStyle(checkbox);
    const optionStyle = getCheckboxImgOptionStyle(checkbox);
    const gridClassName = getImgGridClassName(
      'ss-message__content--user-checkbox-img-grid',
      layout.type,
    );

    return checkbox[checkbox.type]?.map((group, groupIndex) => (
      <div
        key={groupIndex}
        data-editor-checkbox-option={buildEditorCheckboxOptionDataAttr(indexContent, group.id)}
        className="ss-message__content--user-checkbox--checkbox_img ss-checkbox-preview__img-group"
      >
        <div
          className={gridClassName}
          style={gridStyle}
        >
          {group.contents?.map((contentItem, contentIndex) => {
            const compositeKey = getCheckboxImgSelectionKey(group, contentItem);
            const inputId = `ss-checkbox-preview-img-${groupIndex}_${contentIndex}`;
            const isChecked = isCheckboxImgContentChecked(checkbox, group, contentItem);
            return (
              <div
                key={contentIndex}
                data-editor-checkbox-option={buildEditorCheckboxOptionDataAttr(indexContent, compositeKey)}
                className={[
                  'ss-message__content--user-checkbox--checkbox_img-item',
                  isChecked ? 'ss-message__content--user-checkbox--selected' : '',
                  getEditorHighlightClassName(compositeKey),
                ].filter(Boolean).join(' ')}
                style={optionStyle}
              >
                <input
                  type="checkbox"
                  className="ss-checkbox-img-input--hidden"
                  name={`ss-checkbox-preview-img-${groupIndex}`}
                  id={inputId}
                  disabled
                  checked={isChecked}
                  readOnly
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <img src={contentItem.file_url} alt="" />
                {contentItem.text && (
                  <div className="ss-checkbox-preview__img-text">{contentItem.text}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  const renderConsumeApiType = () => (
    <>
      {[0, 1].map((index) => {
        const inputId = `ss-checkbox-preview-api-${index}`;
        return (
          <div key={index} className="ss-message__content--user-checkbox">
            <input
              type="checkbox"
              name="ss-message__content--user-checkbox"
              id={inputId}
              disabled
            />
            <label htmlFor={inputId}>
              {PREVIEW_LABELS.placeholderLabel}
            </label>
          </div>
        );
      })}
    </>
  );

  const renderTypeBody = () => {
    switch (checkbox.type) {
      case CHECKBOX_TYPES.DEFAULT:
        return renderDefaultType();
      case CHECKBOX_TYPES.CHECKBOX_IMG:
        return renderCheckboxImgType();
      case CHECKBOX_TYPES.CONSUME_API_RESPONSE:
        return renderConsumeApiType();
      default:
        return null;
    }
  };

  return (
    <ContentPreviewShell className="ss-checkbox-preview">
      {renderHeader()}
      <div className="ss-message__content--user-checkbox-wrapper">
        {renderTypeBody()}
      </div>
    </ContentPreviewShell>
  );
};

export default CheckboxPreview;
