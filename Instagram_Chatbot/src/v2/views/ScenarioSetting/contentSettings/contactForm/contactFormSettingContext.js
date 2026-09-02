import {
  getContactFormFieldSettings,
  getContactFormTemplateFieldSettings,
} from 'v2/views/Preview/PreviewComponent/Constants';
import { createDefaultDomainSuggestion } from 'v2/views/Preview/PreviewComponent/emailDomainDefaults';

export const buildContactFormSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
  } = props;

  const contactForm = content.contact_form;
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const fieldSettings = getContactFormFieldSettings(contactForm);

  const ensureContactFormDomainSuggestion = () => {
    if (!contactForm) return;
    if (!contactForm.domain_suggestion) {
      contactForm.domain_suggestion = createDefaultDomainSuggestion();
    }
  };

  const handleChangeContactFormTemplate = (template) => {
    if (!contactForm) return;
    contactForm.form_template = template;
    contactForm.field_settings = getContactFormTemplateFieldSettings(template);
    if (contactForm.email_settings?.send_to_user) {
      contactForm.field_settings.email = { visible: true, required: true };
    }
    setDataMessages([...dataMessages]);
  };

  const handleChangeContactFormFieldSetting = (fieldKey, settingKey, value) => {
    if (!contactForm) return;
    if (!contactForm.field_settings) {
      contactForm.field_settings = getContactFormFieldSettings(contactForm);
    }
    const current = contactForm.field_settings[fieldKey] || { visible: false, required: false };
    const emailLocked = fieldKey === 'email' && Boolean(contactForm.email_settings?.send_to_user);

    if (settingKey === 'visible') {
      if (emailLocked && !value) return;
      contactForm.field_settings[fieldKey] = {
        visible: Boolean(value),
        required: value ? Boolean(current.required) : false,
      };
    } else if (settingKey === 'required') {
      if (!current.visible) return;
      if (emailLocked && !value) return;
      contactForm.field_settings[fieldKey] = {
        visible: true,
        required: Boolean(value),
      };
    }
    setDataMessages([...dataMessages]);
  };

  const handleChangeContactFormSendToUser = (value) => {
    if (!contactForm) return;
    if (!contactForm.email_settings) {
      contactForm.email_settings = {};
    }
    contactForm.email_settings.send_to_user = value;
    if (value) {
      if (!contactForm.field_settings) {
        contactForm.field_settings = getContactFormFieldSettings(contactForm);
      }
      contactForm.field_settings.email = { visible: true, required: true };
    }
    setDataMessages([...dataMessages]);
  };

  const handleChangeContactFormDomainSuggestion = (field, value) => {
    ensureContactFormDomainSuggestion();
    contactForm.domain_suggestion[field] = value;
    setDataMessages([...dataMessages]);
  };

  const handleChangeContactFormDomainValue = (indexDomain, value) => {
    ensureContactFormDomainSuggestion();
    contactForm.domain_suggestion.domains[indexDomain].domain = value;
    setDataMessages([...dataMessages]);
  };

  const handleAddContactFormEmailDomain = () => {
    ensureContactFormDomainSuggestion();
    const domains = contactForm.domain_suggestion.domains;
    const idMax = domains.length > 0 ? Math.max(...domains.map((item) => item.id)) + 1 : 1;
    domains.push({ id: idMax, domain: '' });
    setDataMessages([...dataMessages]);
  };

  const handleRemoveContactFormEmailDomain = (indexDomain) => {
    ensureContactFormDomainSuggestion();
    contactForm.domain_suggestion.domains = contactForm.domain_suggestion.domains.filter(
      (_, index) => index !== indexDomain
    );
    setDataMessages([...dataMessages]);
  };

  const handleResetContactFormEmailDomains = () => {
    ensureContactFormDomainSuggestion();
    contactForm.domain_suggestion.domains = createDefaultDomainSuggestion().domains;
    setDataMessages([...dataMessages]);
  };

  return {
    contactForm,
    messageContent,
    changeContent,
    changeMessageField,
    fieldSettings,
    handleChangeContactFormTemplate,
    handleChangeContactFormFieldSetting,
    handleChangeContactFormSendToUser,
    handleChangeContactFormDomainSuggestion,
    handleChangeContactFormDomainValue,
    handleAddContactFormEmailDomain,
    handleRemoveContactFormEmailDomain,
    handleResetContactFormEmailDomains,
  };
};
