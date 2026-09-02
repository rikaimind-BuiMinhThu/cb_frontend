/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  LABEL_SUBMIT_CONTACT,
  CONTACT_FORM_TITLE,
  CONTACT_LABEL_NAME,
  CONTACT_LABEL_EMAIL,
  CONTACT_LABEL_PHONE,
  CONTACT_LABEL_INQUIRY_TYPE,
  CONTACT_LABEL_ORDER_NUMBER,
  CONTACT_LABEL_PRODUCT_NAME,
  CONTACT_LABEL_CONTENT,
} from './constants';


const ContactFormContent = ({
  content,
  disabled,
}) => {
  const contactForm = content.contact_form;
  if (!contactForm) {
    return null;
  }

  return (
                  <div className="chat-log-um-contact-note" >
                    <div className="chat-log-um-contact-title" >{CONTACT_FORM_TITLE}</div>
                    {contactForm.fields?.name && <div>{CONTACT_LABEL_NAME}{contactForm.fields.name}</div>}
                    {contactForm.fields?.email && <div>{CONTACT_LABEL_EMAIL}{contactForm.fields.email}</div>}
                    {contactForm.fields?.phone && <div>{CONTACT_LABEL_PHONE}{contactForm.fields.phone}</div>}
                    {contactForm.fields?.inquiry_type && <div>{CONTACT_LABEL_INQUIRY_TYPE}{contactForm.fields.inquiry_type}</div>}
                    {contactForm.fields?.order_number && <div>{CONTACT_LABEL_ORDER_NUMBER}{contactForm.fields.order_number}</div>}
                    {contactForm.fields?.product_name && <div>{CONTACT_LABEL_PRODUCT_NAME}{contactForm.fields.product_name}</div>}
                    {contactForm.fields?.content && <div>{CONTACT_LABEL_CONTENT}{contactForm.fields.content}</div>}
                    <div className="ss-user-setting__item-text_input-top chat-log-um-mt-8" >
                      <button
                        className="chat-log-um-submit-btn ss-user-setting__select-btn-add btn btn-secondary" 
                        disabled
                        
                      >
                        {contactForm.submit_button_name || LABEL_SUBMIT_CONTACT}
                      </button>
                    </div>
                  </div>
  );
};

ContactFormContent.propTypes = {
  content: PropTypes.object,
  disabled: PropTypes.bool,
};

export default ContactFormContent;
