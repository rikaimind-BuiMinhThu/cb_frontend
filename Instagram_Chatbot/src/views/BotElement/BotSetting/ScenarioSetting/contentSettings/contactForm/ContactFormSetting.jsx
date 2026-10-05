import React from 'react';
import { Checkbox } from 'antd';
import ContentSettingShell from '../shared/ContentSettingShell';
import SelectCustom from '../../scenarioComon/SelectCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import EmailDomainSuggestionSetting from '../../scenarioComon/EmailDomainSuggestionSetting';
import {
  CONTACT_FORM_TEMPLATE_LABELS,
  CONTACT_FORM_FIELD_KEYS,
  CONTACT_FORM_FIELD_LABELS,
} from '../../../PreviewComponent/Constants';
import { buildContactFormSettingContext } from './contactFormSettingContext';
import '../../styles/contentSettings/contactForm.css';

const CONTACT_FORM_TEMPLATE_OPTIONS = [
  { key: 'basic', value: CONTACT_FORM_TEMPLATE_LABELS.basic },
  { key: 'detailed', value: CONTACT_FORM_TEMPLATE_LABELS.detailed },
  { key: 'product', value: CONTACT_FORM_TEMPLATE_LABELS.product },
];

const fieldRowStyle = {
  width: '90%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
};

const fieldLabelStyle = {
  flex: '0 0 140px',
  width: '140px',
  textAlign: 'left',
  marginRight: 0,
};

const fieldControlStyle = {
  flex: 1,
  minWidth: 0,
  width: '100%',
};

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
    <div className="ss-user-setting__item-bottom" style={fieldRowStyle}>
      <SelectCustom
        id="contact_form_template"
        label="フォーム種類"
        styleLabel={fieldLabelStyle}
        style={fieldControlStyle}
        value={contactForm.form_template}
        onChange={handleChangeContactFormTemplate}
        data={CONTACT_FORM_TEMPLATE_OPTIONS}
        keyValue="key"
        nameValue="value"
      />
    </div>
  );

  const renderSubmitButtonName = () => (
    <div className="ss-user-setting__item-bottom" style={fieldRowStyle}>
      <InputCustom
        styleLabel={fieldLabelStyle}
        style={fieldControlStyle}
        label="送信ボタン名称"
        inline
        placeholder="送信する"
        onChange={changeContent('submit_button_name')}
        value={contactForm.submit_button_name}
      />
    </div>
  );

  const renderFieldVisibilityGrid = () => (
    <div
      className="ss-user-setting__item-bottom ss-contact-form-setting__fields"
      style={{ width: '90%', marginTop: '10px' }}
    >
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>表示フィールド</div>
      <div className="ss-contact-form-setting__fields-grid">
        <div />
        <div className="ss-contact-form-setting__fields-header">表示</div>
        <div className="ss-contact-form-setting__fields-header">必須</div>
        {CONTACT_FORM_FIELD_KEYS.map((fieldKey) => {
          const fieldSetting = fieldSettings[fieldKey] || { visible: false, required: false };
          const emailLocked = fieldKey === 'email' && Boolean(contactForm.email_settings?.send_to_user);
          return (
            <React.Fragment key={fieldKey}>
              <span style={{ fontSize: '13px' }}>{CONTACT_FORM_FIELD_LABELS[fieldKey]}</span>
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
        <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
          ユーザーへ確認メールを送信する場合、メールアドレスは必須表示になります。
        </div>
      )}
    </div>
  );

  const renderInquiryTypeOptions = () => {
    if (!fieldSettings.inquiry_type?.visible) return null;
    return (
      <div className="ss-user-setting__item-bottom" style={{ width: '90%' }}>
        <div style={{ fontSize: '14px', marginBottom: '5px' }}>お問い合わせ種別（改行区切り）</div>
        <textarea
          style={{ width: '100%' }}
          className="ss-input-value"
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
    <div className="ss-user-setting__item-bottom" style={{ width: '90%' }}>
      <EmailDomainSuggestionSetting
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
      className="ss-user-setting__item-bottom"
      style={{ width: '90%', marginTop: '10px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>メール送信設定</div>
      <CheckboxCustom
        label="ユーザーへ確認メールを送信する"
        onChange={handleChangeContactFormSendToUser}
        value={contactForm.email_settings?.send_to_user}
      />
      <CheckboxCustom
        label="担当者へ通知メールを送信する"
        onChange={changeContent('email_settings', 'send_to_staff')}
        value={contactForm.email_settings?.send_to_staff}
      />
    </div>
  );

  const renderUserEmailTemplateSelect = () => {
    if (!contactForm.email_settings?.send_to_user) return null;
    return (
      <div className="ss-user-setting__item-bottom" style={fieldRowStyle}>
        <SelectCustom
          id="contact_form_user_email_template"
          label="ユーザー向けメールテンプレート"
          styleLabel={fieldLabelStyle}
          style={fieldControlStyle}
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
      <div className="ss-user-setting__item-bottom" style={fieldRowStyle}>
        <SelectCustom
          id="contact_form_staff_email_template"
          label="担当者向けメールテンプレート"
          styleLabel={fieldLabelStyle}
          style={fieldControlStyle}
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
