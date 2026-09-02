import React from 'react';
import { PREVIEW_LABELS } from '../constants/scenarioSettingLabels';
import { TEXT_INPUT_TYPES } from '../constants/contentTypeConstants';
import '../styles/base/preview-common.css';

const TextInputPreview = ({
  textInput,
  renderTextInputPasswordConfirmationPreview,
}) => (
  <div className="ss-content-preview">
    {(textInput.title_require || textInput.require) && (
      <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
        {textInput.title_require && (
          <span className="ss-message__content--user-text-input-title">
            {textInput.title}
          </span>
        )}
        {textInput.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    )}
    {textInput.type === TEXT_INPUT_TYPES.TEXT && (
      textInput.text.isSplitInput ? (
        <div className="ss-content-preview__row">
          <input
            readOnly
            placeholder={textInput.text?.placeholderLeft}
            disabled
            className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
          />
          <input
            readOnly
            placeholder={textInput.text?.placeholderRight}
            disabled
            className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
          />
        </div>
      ) : (
        <>
          <input
            readOnly
            placeholder={textInput[textInput.type]?.placeholderLeft}
            disabled
            className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"
          />
          {textInput.text?.placeholderRight && (
            <span className="ss-content-preview__suffix-label">{textInput.text?.placeholderRight}</span>
          )}
        </>
      )
    )}
    {textInput.type === TEXT_INPUT_TYPES.PHONE_NUMBER && (
      textInput.phone_number.withHyphen === false ? (
        <input
          readOnly
          placeholder={textInput[textInput.type]?.number}
          disabled
          className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"
        />
      ) : (
        <div className="ss-content-preview__row">
          <input
            readOnly
            placeholder={textInput[textInput.type]?.number1}
            disabled
            className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"
          />
          <input
            readOnly
            placeholder={textInput[textInput.type]?.number2}
            disabled
            className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"
          />
          <input
            readOnly
            placeholder={textInput[textInput.type]?.number3}
            disabled
            className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"
          />
        </div>
      )
    )}
    {textInput.type === TEXT_INPUT_TYPES.PASSWORD && (
      <input
        readOnly
        placeholder={textInput[textInput.type]?.password}
        disabled
        className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"
      />
    )}
    {(textInput.type === TEXT_INPUT_TYPES.URLS
      || textInput.type === TEXT_INPUT_TYPES.EMAIL_ADDRESS) && (
      <input
        readOnly
        placeholder={textInput[textInput.type].placeholder}
        disabled
        className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"
      />
    )}
    {textInput.type === TEXT_INPUT_TYPES.EMAIL_CONFIRMATION && (
      <>
        <input
          className="ss-message__content--user-text-input ss-input-value"
          readOnly
          disabled
          placeholder={textInput[textInput.type].cfEmlAdd_email}
        />
        <input
          className="ss-message__content--user-text-input ss-input-value"
          readOnly
          placeholder={textInput[textInput.type].cfEmlAdd_confirm_email}
          disabled
        />
      </>
    )}
    {renderTextInputPasswordConfirmationPreview(textInput)}
  </div>
);

export default TextInputPreview;
