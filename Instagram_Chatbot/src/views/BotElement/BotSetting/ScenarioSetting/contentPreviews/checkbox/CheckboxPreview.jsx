import React from 'react';
import { Checkbox } from 'antd';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { CHECKBOX_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import '../../styles/contentPreviews/checkbox.css';

const CheckboxPreview = ({ checkbox }) => {
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
    checkbox[checkbox.type].map((item, index) => (
      <div key={index} className="ss-message__content--user-checkbox">
        <input
          type="checkbox"
          name="ss-message__content--user-checkbox"
          id="ss-message__content--user-checkbox"
          disabled
          checked={checkbox.all_item_checked}
        />
        <label htmlFor="ss-message__content--user-checkbox">{item.text}</label>
      </div>
    ))
  );

  const renderCheckboxImgType = () => (
    checkbox.checkbox_img && checkbox[checkbox.type].map((itemCheckboxImg, indexCheckboxImg) => (
      <div key={indexCheckboxImg} className="ss-message__content--user-checkbox--checkbox_img ss-checkbox-preview__img-group">
        <Checkbox.Group
          className="ss-user-overview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width ss-checkbox-preview__img-group-inner"
          onChange={(value) => console.log(value)}
          value={checkbox.initial_selection_picture}
        >
          {itemCheckboxImg.contents && itemCheckboxImg.contents.map((itemCheckboxContent, indexContent) => (
            <Checkbox
              value={`${itemCheckboxImg.id}-${itemCheckboxContent.id}`}
              key={indexContent}
              className="ss-checkbox-preview__img-checkbox"
            >
              <img src={itemCheckboxContent.file_url} alt="" />
              <div className="ss-checkbox-preview__img-text">{itemCheckboxContent.text}</div>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>
    ))
  );

  const renderConsumeApiType = () => (
    <>
      {[0, 1].map((index) => (
        <div key={index} className="ss-message__content--user-checkbox">
          <input
            type="checkbox"
            name="ss-message__content--user-checkbox"
            id="ss-message__content--user-checkbox"
            disabled
          />
          <label htmlFor="ss-message__content--user-checkbox">
            {PREVIEW_LABELS.placeholderLabel}
          </label>
        </div>
      ))}
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
      {renderTypeBody()}
    </ContentPreviewShell>
  );
};

export default CheckboxPreview;
