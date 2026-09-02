import React from 'react';
import { Checkbox } from 'antd';
import ContentSettingShell from '../shared/ContentSettingShell';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import InputCustom from '../../scenarioCommon/InputCustom';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import EmailDomainSuggestionSettingsModal from '../../scenarioCommon/EmailDomainSuggestionSettingsModal';
import {
  CONTACT_FORM_TEMPLATE_LABELS,
  CONTACT_FORM_FIELD_KEYS,
  CONTACT_FORM_FIELD_LABELS,
} from '../../../PreviewComponent/Constants';
import { CONTACT_FORM_SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildContactFormSettingContext } from './contactFormSettingContext';
import '../../styles/contentSettings/contactForm.css';

const CONTACT_FORM_TEMPLATE_OPTIONS = [
  { key: 'basic', value: CONTACT_FORM_TEMPLATE_LABELS.basic },
  { key: 'detailed', value: CONTACT_FORM_TEMPLATE_LABELS.detailed },
  { key: 'product', value: CONTACT_FORM_TEMPLATE_LABELS.product },
];

const ContactFormSetting = (props) => {
  const {
    content,
    indexMessageSelect,
    indexContent,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
    dataEmail,
  } = props;

  if (content.type !== 'contact_form') return null;

  const ctx = buildContactFormSettingContext(props);
  const {
    contactForm,
    fieldSettings,
    changeContent,
    handleChangeContactFormTemplate,
    handleChangeContactFormFieldSetting,
    handleChangeContactFormSendToUser,
    handleChangeContactFormDomainSuggestion,
    handleChangeContactFormDomainValue,
    handleAddContactFormEmailDomain,
    handleRemoveContactFormEmailDomain,
    handleResetContactFormEmailDomains,
  } = ctx;

  const renderTemplateSelect = () => (
    <div className="ss-user-setting__item-bottom ss-contact-form-setting__row">
      <SelectCustom
        id="contact_form_template"
        label={CONTACT_FORM_SETTING_LABELS.formType}
        labelClassName="ss-contact-form-setting__label"
        className="ss-contact-form-setting__control"
        value={contactForm.form_template}
        onChange={handleChangeContactFormTemplate}
        data={CONTACT_FORM_TEMPLATE_OPTIONS}
        keyValue="key"
        nameValue="value"
      />
    </div>
  );

  const renderSubmitButtonName = () => (
    <div className="ss-user-setting__item-bottom ss-contact-form-setting__row">
      <InputCustom
        classLabel="ss-contact-form-setting__label"
        containerClassName="ss-contact-form-setting__control"
        label={CONTACT_FORM_SETTING_LABELS.submitButtonName}
        inline
        placeholder={CONTACT_FORM_SETTING_LABELS.submitPlaceholder}
        onChange={changeContent('submit_button_name')}
        value={contactForm.submit_button_name}
      />
    </div>
  );

  const renderFieldVisibilityGrid = () => (
    <div
      className="ss-user-setting__item-bottom ss-contact-form-setting__fields"
    >
      <div className="ss-contact-form-setting__fields-title">{CONTACT_FORM_SETTING_LABELS.visibleFields}</div>
      <div className="ss-contact-form-setting__fields-grid">
        <div />
        <div className="ss-contact-form-setting__fields-header">{CONTACT_FORM_SETTING_LABELS.visible}</div>
        <div className="ss-contact-form-setting__fields-header">{CONTACT_FORM_SETTING_LABELS.required}</div>
        {CONTACT_FORM_FIELD_KEYS.map((fieldKey) => {
          const fieldSetting = fieldSettings[fieldKey] || { visible: false, required: false };
          const emailLocked = fieldKey === 'email' && Boolean(contactForm.email_settings?.send_to_user);
          return (
            <React.Fragment key={fieldKey}>
              <span className="ss-contact-form-setting__fields-label">
                {CONTACT_FORM_FIELD_LABELS[fieldKey]}
              </span>
              <div className="ss-contact-form-setting__fields-cell">
                <Checkbox
                  disabled={emailLocked}
                  checked={fieldSetting.visible}
                  onChange={(e) =>
                    handleChangeContactFormFieldSetting(fieldKey, 'visible', e.target.checked)
                  }
                />
              </div>
              <div className="ss-contact-form-setting__fields-cell">
                <Checkbox
                  disabled={!fieldSetting.visible || emailLocked}
                  checked={fieldSetting.required}
                  onChange={(e) =>
                    handleChangeContactFormFieldSetting(fieldKey, 'required', e.target.checked)
                  }
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {contactForm.email_settings?.send_to_user && (
        <div className="ss-contact-form-setting__fields-hint">
          {CONTACT_FORM_SETTING_LABELS.emailRequiredHint}
        </div>
      )}
    </div>
  );

  const renderInquiryTypeOptions = () => {
    if (!fieldSettings.inquiry_type?.visible) return null;
    return (
      <div className="ss-user-setting__item-bottom ss-contact-form-setting__inquiry">
        <div className="ss-contact-form-setting__inquiry-label">{CONTACT_FORM_SETTING_LABELS.inquiryType}</div>
        <textarea
          className="ss-input-value ss-contact-form-setting__inquiry-textarea"
          rows="3"
          value={(contactForm.inquiry_type_options || []).join('\n')}
          onChange={(e) =>
            changeContent('inquiry_type_options')(
              e.target.value.split('\n').map((v) => v.trim()).filter(Boolean)
            )
          }
        />
      </div>
    );
  };

  const renderDomainSuggestion = () => (
    <div className="ss-user-setting__item-bottom ss-contact-form-setting__domain">
      <EmailDomainSuggestionSettingsModal
        domainSuggestion={contactForm.domain_suggestion}
        onToggleEnabled={(value) => handleChangeContactFormDomainSuggestion('enabled', value)}
        onChangeMode={(value) => handleChangeContactFormDomainSuggestion('mode', value)}
        onChangeDomain={(indexDomain, value) => handleChangeContactFormDomainValue(indexDomain, value)}
        onAddDomain={handleAddContactFormEmailDomain}
        onRemoveDomain={handleRemoveContactFormEmailDomain}
        onResetDomains={handleResetContactFormEmailDomains}
      />
    </div>
  );

  const renderEmailSettings = () => (
    <div
      className="ss-user-setting__item-bottom ss-contact-form-setting__email"
    >
      <div className="ss-contact-form-setting__email-title">{CONTACT_FORM_SETTING_LABELS.emailSettings}</div>
      <CheckboxCustom
        label={CONTACT_FORM_SETTING_LABELS.sendConfirmToUser}
        onChange={handleChangeContactFormSendToUser}
        value={contactForm.email_settings?.send_to_user}
      />
      <CheckboxCustom
        label={CONTACT_FORM_SETTING_LABELS.sendNotifyToStaff}
        onChange={changeContent('email_settings', 'send_to_staff')}
        value={contactForm.email_settings?.send_to_staff}
      />
    </div>
  );

  const renderUserEmailTemplateSelect = () => {
    if (!contactForm.email_settings?.send_to_user) return null;
    return (
      <div className="ss-user-setting__item-bottom ss-contact-form-setting__row">
        <SelectCustom
          id="contact_form_user_email_template"
          label={CONTACT_FORM_SETTING_LABELS.userEmailTemplate}
          labelClassName="ss-contact-form-setting__label"
          className="ss-contact-form-setting__control"
          data={dataEmail}
          keyValue="id"
          nameValue="email_template_name"
          value={contactForm.email_settings?.user_email_id || ''}
          onChange={changeContent('email_settings', 'user_email_id')}
        />
      </div>
    );
  };

  const renderStaffEmailTemplateSelect = () => {
    if (!contactForm.email_settings?.send_to_staff) return null;
    return (
      <div className="ss-user-setting__item-bottom ss-contact-form-setting__row">
        <SelectCustom
          id="contact_form_staff_email_template"
          label={CONTACT_FORM_SETTING_LABELS.staffEmailTemplate}
          labelClassName="ss-contact-form-setting__label"
          className="ss-contact-form-setting__control"
          data={dataEmail}
          keyValue="id"
          nameValue="email_template_name"
          value={contactForm.email_settings?.staff_email_id || ''}
          onChange={changeContent('email_settings', 'staff_email_id')}
        />
      </div>
    );
  };

  return (
    <ContentSettingShell
      contentType="contact_form"
      contentData={contactForm}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderTemplateSelect()}
      {renderSubmitButtonName()}
      {renderFieldVisibilityGrid()}
      {renderInquiryTypeOptions()}
      {renderDomainSuggestion()}
      {renderEmailSettings()}
      {renderUserEmailTemplateSelect()}
      {renderStaffEmailTemplateSelect()}
    </ContentSettingShell>
  );
};

export default ContactFormSetting;
