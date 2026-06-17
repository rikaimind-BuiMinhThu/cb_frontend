import React from 'react';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { RADIO_BUTTON_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import '../../styles/contentPreviews/radioButton.css';

const RadioButtonPreview = ({ radioButton }) => {
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
    radioButton[radioButton.type].map((item, index) => (
      <div key={index} className="ss-message__content--user-radio_button">
        <input
          type="radio"
          name="ss-message__content--user-radio_button"
          id="ss-message__content--user-radio_button"
          disabled
          checked={radioButton.initial_selection === item.value}
        />
        {item.text && (
          <label htmlFor="ss-message__content--user-radio_button">{item.text}</label>
        )}
      </div>
    ))
  );

  const renderImgType = () => (
    radioButton[radioButton.type].map((item, index) => (
      <div key={index} className="ss-message__content--user-radio_button--radio_button_img">
        <input
          type="radio"
          name="ss-message__content--user-radio_button--radio_button_img"
          id="ss-message__content--user-radio_button--radio_button_img"
          disabled
          checked={radioButton.initial_selection === item.value}
        />
        <img src={item.img} alt="" />
        {item.text && (
          <div className="ss-radio-button-preview__img-text">{item.text}</div>
        )}
      </div>
    ))
  );

  const renderConsumeApiType = () => (
    <>
      {[0, 1].map((index) => (
        <div key={index} className="ss-message__content--user-radio_button">
          <input
            type="radio"
            name="ss-message__content--user-radio_button"
            id="ss-message__content--user-radio_button"
            disabled
          />
          <label htmlFor="ss-message__content--user-radio_button">
            {PREVIEW_LABELS.placeholderLabel}
          </label>
        </div>
      ))}
    </>
  );

  const renderBlockStyleType = () => (
    radioButton[radioButton.type].map((item, index) => (
      item.text && (
        <div key={index} className="ss-message__content--user-radio_button--block_style ss-radio-button-preview__block-item">
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
