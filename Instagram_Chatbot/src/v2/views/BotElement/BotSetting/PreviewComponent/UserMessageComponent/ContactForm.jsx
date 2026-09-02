import React from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import {
  CONTACT_FORM_FIELD_KEYS,
  CONTACT_FORM_FIELD_LABELS,
  DEFAULT_CONTACT_FORM_CONFIG,
  EMPTY_INPUT_VALUE,
  getContactFormFieldSettings,
  MESSAGE_CONTENT_TYPES,
  REQUIRED_FIELD_LABEL,
} from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import EmailInput from "./TextInputComponent/EmailInput";

const CONTACT_FORM_SUBMITTING_LABEL = "送信中...";
const CONTACT_FORM_FIELD_NAMES = {
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  INQUIRY_TYPE: "inquiry_type",
  ORDER_NUMBER: "order_number",
  PRODUCT_NAME: "product_name",
  CONTENT: "content",
};

const ContactForm = ({
  content,
  disabled,
  onChangeValue,
  onClickNext,
  errors,
  contentIndex,
  messageIndex,
  message,
  isProcessing = false,
}) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.CONTACT_FORM) return null;

  const contactForm = content.contact_form || {};
  const fields = contactForm.fields || {};
  const fieldSettings = getContactFormFieldSettings(contactForm);
  const inquiryTypeOptions = contactForm.inquiry_type_options || [];
  const submitButtonName = contactForm.submit_button_name || DEFAULT_CONTACT_FORM_CONFIG.submit_button_name;

  const errorKey = (fieldName) =>
    `message${messageIndex}_content${contentIndex}_${content.type}_${fieldName}`;

  const renderFieldError = (fieldName) => {
    const messageText = errors?.[errorKey(fieldName)];
    if (!messageText) return null;
    return <div className="validation-error-message">{messageText}</div>;
  };

  const onChangeField = (fieldName, value) => {
    onChangeValue(contentIndex, content.type, value, "fields", fieldName);
  };

  const renderRequiredBadge = (fieldName) => {
    if (!fieldSettings[fieldName]?.required) return null;
    return (
      <span className="ss-message__content--user-text-input-required">{REQUIRED_FIELD_LABEL}</span>
    );
  };

  const renderTextInput = (fieldName, type = "text") => (
    <div className="m-b-10" key={fieldName}>
      <div className="ss-message__content--user-text-input-top m-b-0">
        <span className="ss-message__content--user-text-input-title">
          {CONTACT_FORM_FIELD_LABELS[fieldName]}
        </span>
        {renderRequiredBadge(fieldName)}
      </div>
      <input
        type={type}
        disabled={disabled}
        className="ss-message__content--user-text-input ss-input-value"
        value={fields[fieldName] || EMPTY_INPUT_VALUE}
        onChange={(e) => onChangeField(fieldName, e.target.value)}
        placeholder={CONTACT_FORM_FIELD_LABELS[fieldName]}
      />
      {renderFieldError(fieldName)}
    </div>
  );

  const renderEmailInput = () => (
    <div className="m-b-10" key={CONTACT_FORM_FIELD_NAMES.EMAIL}>
      <div className="ss-message__content--user-text-input-top m-b-0">
        <span className="ss-message__content--user-text-input-title">
          {CONTACT_FORM_FIELD_LABELS.email}
        </span>
        {renderRequiredBadge(CONTACT_FORM_FIELD_NAMES.EMAIL)}
      </div>
      <EmailInput
        disabled={disabled}
        className="m-b-0"
        placeholder={CONTACT_FORM_FIELD_LABELS.email}
        domainSuggestion={contactForm.domain_suggestion}
        value={fields.email || EMPTY_INPUT_VALUE}
        onChange={(value) => onChangeField(CONTACT_FORM_FIELD_NAMES.EMAIL, value)}
      />
      {renderFieldError(CONTACT_FORM_FIELD_NAMES.EMAIL)}
    </div>
  );

  const renderTextArea = () => (
    <div className="m-b-10" key={CONTACT_FORM_FIELD_NAMES.CONTENT}>
      <div className="ss-message__content--user-textarea-top m-b-0">
        <span className="ss-message__content--user-textarea-title">
          {CONTACT_FORM_FIELD_LABELS.content}
        </span>
        {renderRequiredBadge(CONTACT_FORM_FIELD_NAMES.CONTENT)}
      </div>
      <textarea
        disabled={disabled}
        className="ss-message__content--user-textarea ss-input-value"
        rows={4}
        value={fields.content || EMPTY_INPUT_VALUE}
        onChange={(e) => onChangeField(CONTACT_FORM_FIELD_NAMES.CONTENT, e.target.value)}
        placeholder={CONTACT_FORM_FIELD_LABELS.content}
      />
      {renderFieldError(CONTACT_FORM_FIELD_NAMES.CONTENT)}
    </div>
  );

  const renderInquiryType = () => (
    <div className="m-b-10" key={CONTACT_FORM_FIELD_NAMES.INQUIRY_TYPE}>
      <div className="ss-message__content--user-radio_button-top m-b-0">
        <span className="ss-message__content--user-radio_button-title">
          {CONTACT_FORM_FIELD_LABELS.inquiry_type}
        </span>
        {renderRequiredBadge(CONTACT_FORM_FIELD_NAMES.INQUIRY_TYPE)}
      </div>
      {inquiryTypeOptions.map((option, index) => (
        <div key={`${option}_${index}`} className="ss-message__content--user-radio_button">
          <input
            disabled={disabled}
            type="radio"
            id={`contact_form_inquiry_${messageIndex}_${contentIndex}_${index}`}
            name={`contact_form_inquiry_${messageIndex}_${contentIndex}`}
            checked={fields.inquiry_type === option}
            onChange={() => onChangeField(CONTACT_FORM_FIELD_NAMES.INQUIRY_TYPE, option)}
          />
          <label htmlFor={`contact_form_inquiry_${messageIndex}_${contentIndex}_${index}`}>
            {option}
          </label>
        </div>
      ))}
      {renderFieldError(CONTACT_FORM_FIELD_NAMES.INQUIRY_TYPE)}
    </div>
  );

  const renderField = (fieldName) => {
    switch (fieldName) {
      case CONTACT_FORM_FIELD_NAMES.NAME:
        return renderTextInput(CONTACT_FORM_FIELD_NAMES.NAME);
      case CONTACT_FORM_FIELD_NAMES.EMAIL:
        return renderEmailInput();
      case CONTACT_FORM_FIELD_NAMES.PHONE:
        return renderTextInput(CONTACT_FORM_FIELD_NAMES.PHONE, "tel");
      case CONTACT_FORM_FIELD_NAMES.INQUIRY_TYPE:
        return renderInquiryType();
      case CONTACT_FORM_FIELD_NAMES.ORDER_NUMBER:
        return renderTextInput(CONTACT_FORM_FIELD_NAMES.ORDER_NUMBER);
      case CONTACT_FORM_FIELD_NAMES.PRODUCT_NAME:
        return renderTextInput(CONTACT_FORM_FIELD_NAMES.PRODUCT_NAME);
      case CONTACT_FORM_FIELD_NAMES.CONTENT:
        return renderTextArea();
      default: {
        return null;
      }
    }
  };

  const renderFields = () =>
    CONTACT_FORM_FIELD_KEYS.filter(
      (fieldName) => fieldSettings[fieldName]?.visible
    ).map((fieldName) => renderField(fieldName));

  const onSubmit = () => {
    onClickNext(messageIndex, message);
  };

  const globalError = errors?.[`message${messageIndex}_content${contentIndex}_${content.type}`];

  return (
    <div className="m-b-10">
      {renderFields()}
      {globalError && (
        <div className="validation-error-message m-b-10">{globalError}</div>
      )}
      <div className="ss-user-setting__item-text_input-top">
        <button
          id="chatbot-contact-form-submit-button"
          disabled={disabled || isProcessing}
          onClick={onSubmit}
        >
          {isProcessing ? CONTACT_FORM_SUBMITTING_LABEL : submitButtonName}
        </button>
      </div>
    </div>
  );
};

ContactForm.propTypes = {
  ...baseUserMessageComponentPropTypes,
  message: PropTypes.object,
  onClickNext: PropTypes.func,
  isProcessing: PropTypes.bool,
};

export default ContactForm;
