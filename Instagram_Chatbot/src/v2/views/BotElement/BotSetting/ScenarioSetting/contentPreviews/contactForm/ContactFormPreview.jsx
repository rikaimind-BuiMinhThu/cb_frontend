import React from 'react';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import {
  CONTACT_FORM_FIELD_KEYS,
  CONTACT_FORM_FIELD_LABELS,
  DEFAULT_CONTACT_FORM_CONFIG,
  getContactFormFieldSettings,
} from '../../../PreviewComponent/Constants';
import { CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import '../../styles/contentPreviews/contactForm.css';

const INQUIRY_TYPE_FIELD = 'inquiry_type';
const CONTENT_FIELD = 'content';

const ContactFormPreview = ({ content }) => {
  const contactForm = content.contact_form;

  if (content.type !== CONTENT_SETTING_TYPES.CONTACT_FORM || !contactForm) return null;

  const fieldSettings = getContactFormFieldSettings(contactForm);
  const inquiryTypeOptions = contactForm.inquiry_type_options || [];
  const submitButtonName = contactForm.submit_button_name
    || DEFAULT_CONTACT_FORM_CONFIG.submit_button_name;

  const renderField = (fieldKey) => {
    if (fieldKey === INQUIRY_TYPE_FIELD) {
      return (
        <div key={fieldKey} className="ss-contact-form-preview__field">
          <div className="ss-contact-form-preview__field-label">
            {CONTACT_FORM_FIELD_LABELS[fieldKey]}
          </div>
          {inquiryTypeOptions.map((option, index) => (
            <div key={`${option}_${index}`} className="ss-contact-form-preview__radio-row">
              <input type="radio" disabled checked={index === 0} readOnly />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    }
    if (fieldKey === CONTENT_FIELD) {
      return (
        <div key={fieldKey} className="ss-contact-form-preview__field">
          <div className="ss-contact-form-preview__field-label">
            {CONTACT_FORM_FIELD_LABELS[fieldKey]}
          </div>
          <textarea className="ss-input-value" rows={4} disabled />
        </div>
      );
    }
    return (
      <div key={fieldKey} className="ss-contact-form-preview__field">
        <div className="ss-contact-form-preview__field-label">
          {CONTACT_FORM_FIELD_LABELS[fieldKey]}
        </div>
        <input type="text" className="ss-input-value" disabled placeholder={CONTACT_FORM_FIELD_LABELS[fieldKey]} />
      </div>
    );
  };

  return (
    <ContentPreviewShell>
      <div className="ss-contact-form-preview">
        {CONTACT_FORM_FIELD_KEYS.filter((fieldKey) => fieldSettings[fieldKey]?.visible).map(renderField)}
        <button type="button" className="ss-contact-form-preview__submit" disabled>
          {submitButtonName}
        </button>
      </div>
    </ContentPreviewShell>
  );
};

export default ContactFormPreview;
