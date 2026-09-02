import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import {
  MESSAGE_CONTENT_TYPES,
  CONTACT_FORM_FIELD_KEYS,
  CONTACT_FORM_FIELD_LABELS,
  getContactFormFieldSettings,
} from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import EmailInput from "./TextInputComponent/EmailInput";

export default function ContactForm({
  content,
  disabled,
  onChangeValue,
  onClickNext,
  errors,
  contentIndex,
  messageIndex,
  message,
  isProcessing = false,
}) {
  if (content.type !== MESSAGE_CONTENT_TYPES.CONTACT_FORM) return null;

  const contactForm = content.contact_form || {};
  const fields = contactForm.fields || {};
  const fieldSettings = getContactFormFieldSettings(contactForm);
  const inquiryTypeOptions = contactForm.inquiry_type_options || [];
  const submitButtonName = contactForm.submit_button_name || "送信する";

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
      <span className="ss-message__content--user-text-input-required">※必須</span>
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
        value={fields[fieldName] || ""}
        onChange={(e) => onChangeField(fieldName, e.target.value)}
        placeholder={CONTACT_FORM_FIELD_LABELS[fieldName]}
      />
      {renderFieldError(fieldName)}
    </div>
  );

  const renderEmailInput = () => (
    <div className="m-b-10" key="email">
      <div className="ss-message__content--user-text-input-top m-b-0">
        <span className="ss-message__content--user-text-input-title">
          {CONTACT_FORM_FIELD_LABELS.email}
        </span>
        {renderRequiredBadge("email")}
      </div>
      <EmailInput
        disabled={disabled}
        className="m-b-0"
        placeholder={CONTACT_FORM_FIELD_LABELS.email}
        domainSuggestion={contactForm.domain_suggestion}
        value={fields.email || ""}
        onChange={(value) => onChangeField("email", value)}
      />
      {renderFieldError("email")}
    </div>
  );

  const renderTextArea = () => (
    <div className="m-b-10" key="content">
      <div className="ss-message__content--user-textarea-top m-b-0">
        <span className="ss-message__content--user-textarea-title">
          {CONTACT_FORM_FIELD_LABELS.content}
        </span>
        {renderRequiredBadge("content")}
      </div>
      <textarea
        disabled={disabled}
        className="ss-message__content--user-textarea ss-input-value"
        rows={4}
        value={fields.content || ""}
        onChange={(e) => onChangeField("content", e.target.value)}
        placeholder={CONTACT_FORM_FIELD_LABELS.content}
      />
      {renderFieldError("content")}
    </div>
  );

  const renderInquiryType = () => (
    <div className="m-b-10" key="inquiry_type">
      <div className="ss-message__content--user-radio_button-top m-b-0">
        <span className="ss-message__content--user-radio_button-title">
          {CONTACT_FORM_FIELD_LABELS.inquiry_type}
        </span>
        {renderRequiredBadge("inquiry_type")}
      </div>
      {inquiryTypeOptions.map((option, index) => (
        <div key={`${option}_${index}`} className="ss-message__content--user-radio_button">
          <input
            disabled={disabled}
            type="radio"
            id={`contact_form_inquiry_${messageIndex}_${contentIndex}_${index}`}
            name={`contact_form_inquiry_${messageIndex}_${contentIndex}`}
            checked={fields.inquiry_type === option}
            onChange={() => onChangeField("inquiry_type", option)}
          />
          <label htmlFor={`contact_form_inquiry_${messageIndex}_${contentIndex}_${index}`}>
            {option}
          </label>
        </div>
      ))}
      {renderFieldError("inquiry_type")}
    </div>
  );

  const renderField = (fieldName) => {
    switch (fieldName) {
      case "name":
        return renderTextInput("name");
      case "email":
        return renderEmailInput();
      case "phone":
        return renderTextInput("phone", "tel");
      case "inquiry_type":
        return renderInquiryType();
      case "order_number":
        return renderTextInput("order_number");
      case "product_name":
        return renderTextInput("product_name");
      case "content":
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
          {isProcessing ? "送信中..." : submitButtonName}
        </button>
      </div>
    </div>
  );
}
