import React from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker, Form, Input, Radio, Select } from 'antd';
import moment from 'moment';
import ClientFormRow from './ClientFormRow';
import {
  BOT_FEATURE_RADIO_OPTIONS,
  CART_SYSTEM_OPTIONS,
  ENTERPRISE_TYPE_2_OPTIONS,
  ENTERPRISE_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
  STATUS_OPTIONS,
} from '../clientFormOptions';
import {
  BOOLEAN_STRING_FALSE,
  CART_SYSTEM_NONE,
  CART_SYSTEM_SHOPIFY,
  CHANGE_IMAGE_LABEL,
  DATE_FORMAT,
  FIELD_ID_ADDRESS,
  FIELD_ID_BUILDING,
  FIELD_ID_CART,
  FIELD_ID_COMPANY_TYPE,
  FIELD_ID_COMPANY_TYPE_2,
  FIELD_ID_DEPARTMENT,
  FIELD_ID_EMAIL,
  FIELD_ID_END_DATE,
  FIELD_ID_IMAGE_BUTTON,
  FIELD_ID_IMAGE_PREVIEW,
  FIELD_ID_INSTAGRAM,
  FIELD_ID_LINE,
  FIELD_ID_MANAGER,
  FIELD_ID_MANAGER_KATA,
  FIELD_ID_MUNICIPALITY,
  FIELD_ID_NAME,
  FIELD_ID_NAME_KATA,
  FIELD_ID_NOTE,
  FIELD_ID_PASSWORD,
  FIELD_ID_PASSWORD_CONFIRM,
  FIELD_ID_PHONE,
  FIELD_ID_PLAN,
  FIELD_ID_PREFECTURE,
  FIELD_ID_PRICE,
  FIELD_ID_REPLY_APP_PASSWORD,
  FIELD_ID_REPLY_GMAIL,
  FIELD_ID_START_DATE,
  FIELD_ID_TIKTOK,
  FIELD_ID_TITLE,
  FIELD_ID_URL,
  FIELD_ID_WEB,
  FIELD_ID_ZIP,
  FILE_ACCEPT_IMAGES,
  LABEL_ADDRESS,
  LABEL_BUILDING,
  LABEL_CART_SYSTEM,
  LABEL_CLIENT_ID,
  LABEL_CLIENT_SECRET,
  LABEL_DEPARTMENT,
  LABEL_EMAIL,
  LABEL_ENTERPRISE_TYPE,
  LABEL_ENTERPRISE_TYPE_2,
  LABEL_LOGO,
  LABEL_MANAGER,
  LABEL_MANAGER_KATAKANA,
  LABEL_MUNICIPALITY,
  LABEL_NAME,
  LABEL_NAME_KATAKANA,
  LABEL_NOTE,
  LABEL_PASSWORD,
  LABEL_PASSWORD_CONFIRM,
  LABEL_PHONE,
  LABEL_PLAN_NAME,
  LABEL_PLAN_PRICE,
  LABEL_PREFECTURE,
  LABEL_REPLY_APP_PASSWORD,
  LABEL_REPLY_GMAIL,
  LABEL_SHOP_URL,
  LABEL_SITE_URL,
  LABEL_STATUS,
  LABEL_TITLE,
  LABEL_TITLE_VALIDATE,
  LABEL_URL,
  LABEL_ZIP,
  LABEL_BILLING_START,
  LABEL_INSTAGRAM_BOT,
  LABEL_LINE_BOT,
  LABEL_MIN_PERIOD_END,
  LABEL_TIKTOK_BOT,
  LABEL_WEB_BOT,
  PLAN_NAME_SUFFIX,
  SECTION_BOT_FEATURES,
  SECTION_CART,
  SECTION_COMPANY,
  SECTION_CONTACT,
  SECTION_CONTRACT,
  SECTION_LOGO_SITE,
  SECTION_MANAGER,
  SELECT_PLAN_PLACEHOLDER,
} from '../constants';

const { TextArea } = Input;

const Section = ({ title, children }) => (
  <section className="admin-client-form-section">
    <h5 className="admin-client-form-section-title">{title}</h5>
    {children}
  </section>
);

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

const BotFeatureRadio = ({ name, id }) => (
  <Form.Item name={name} noStyle>
    <Radio.Group id={id}>
      {BOT_FEATURE_RADIO_OPTIONS.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  </Form.Item>
);

BotFeatureRadio.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
};

const toMoment = (value) => {
  if (!value) return null;
  if (moment.isMoment(value)) return value;
  if (value instanceof Date) return moment(value);
  return moment(value);
};

const ClientFormBody = ({
  formId,
  antdForm,
  showPasswordFields,
  disableInput,
  avatarId,
  avatarInputRef,
  plans,
  contract,
  setContract,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  urlLogo,
  shopUrl,
  setShopUrl,
  clientId,
  setClientId,
  clientSecret,
  setClientSecret,
  onSelectPlan,
  onImageChange,
  onSelectImageClick,
  fieldErrors,
  validateAndSetField,
  validateNameField,
  validateField,
  validatePasswordField,
  validatePrice,
  validateZipCode,
  validatePhoneNumber,
}) => {
  const cartSystem = Form.useWatch('cart_system', antdForm);

  return (
    <Form
      id={formId}
      form={antdForm}
      layout="vertical"
      disabled={disableInput}
      className="admin-client-form"
      initialValues={{
        cart_system: CART_SYSTEM_NONE,
        is_instagram: BOOLEAN_STRING_FALSE,
        is_line: BOOLEAN_STRING_FALSE,
        is_tiktok: BOOLEAN_STRING_FALSE,
        is_web: BOOLEAN_STRING_FALSE,
      }}
    >
      <Section title={SECTION_CONTRACT}>
        <ClientFormRow label={LABEL_STATUS} required error={fieldErrors.status}>
          <Radio.Group
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            disabled={disableInput}
          >
            {STATUS_OPTIONS.map((option) => (
              <Radio key={option.value} id={option.id} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </ClientFormRow>

        <ClientFormRow label={LABEL_PLAN_NAME} required>
          <Form.Item name="plan" noStyle>
            <Select
              id={FIELD_ID_PLAN}
              placeholder={SELECT_PLAN_PLACEHOLDER}
              onChange={onSelectPlan}
              options={plans.map((planItem) => ({
                value: planItem.code,
                label: `${planItem.name}${PLAN_NAME_SUFFIX}`,
              }))}
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_PLAN_PRICE} error={fieldErrors.price}>
          <Form.Item name="price" noStyle>
            <Input
              id={FIELD_ID_PRICE}
              onBlur={(e) =>
                validateAndSetField('price', validatePrice(e.target.value))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_BILLING_START} error={fieldErrors.subscription_start_at}>
          <DatePicker
            id={FIELD_ID_START_DATE}
            format={DATE_FORMAT}
            value={toMoment(startDate)}
            onChange={(date) => onStartDateChange(date ? date.toDate() : null)}
          />
        </ClientFormRow>

        <ClientFormRow label={LABEL_MIN_PERIOD_END} error={fieldErrors.subscription_end_at}>
          <DatePicker
            id={FIELD_ID_END_DATE}
            format={DATE_FORMAT}
            value={toMoment(endDate)}
            onChange={(date) => onEndDateChange(date ? date.toDate() : null)}
          />
        </ClientFormRow>
      </Section>

      <Section title={SECTION_BOT_FEATURES}>
        <ClientFormRow label={LABEL_INSTAGRAM_BOT}>
          <BotFeatureRadio name="is_instagram" id={FIELD_ID_INSTAGRAM} />
        </ClientFormRow>
        <ClientFormRow label={LABEL_LINE_BOT}>
          <BotFeatureRadio name="is_line" id={FIELD_ID_LINE} />
        </ClientFormRow>
        <ClientFormRow label={LABEL_TIKTOK_BOT}>
          <BotFeatureRadio name="is_tiktok" id={FIELD_ID_TIKTOK} />
        </ClientFormRow>
        <ClientFormRow label={LABEL_WEB_BOT}>
          <BotFeatureRadio name="is_web" id={FIELD_ID_WEB} />
        </ClientFormRow>

        <ClientFormRow label={LABEL_NOTE} alignTop error={fieldErrors.note}>
          <Form.Item name="note" noStyle>
            <TextArea id={FIELD_ID_NOTE} rows={4} />
          </Form.Item>
        </ClientFormRow>
      </Section>

      <Section title={SECTION_COMPANY}>
        <ClientFormRow label={LABEL_NAME} required error={fieldErrors.name}>
          <Form.Item name="name" noStyle>
            <Input
              id={FIELD_ID_NAME}
              onBlur={(e) =>
                validateAndSetField('name', validateNameField(e.target.value, LABEL_NAME))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_NAME_KATAKANA} required error={fieldErrors.name_katakana}>
          <Form.Item name="name_katakana" noStyle>
            <Input
              id={FIELD_ID_NAME_KATA}
              onBlur={(e) =>
                validateAndSetField('name_katakana', validateNameField(e.target.value, LABEL_NAME_KATAKANA))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_ENTERPRISE_TYPE} required error={fieldErrors.enterprise_type}>
          <Form.Item name="enterprise_type" noStyle>
            <Select
              id={FIELD_ID_COMPANY_TYPE}
              showSearch
              optionFilterProp="label"
              options={ENTERPRISE_TYPE_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_ENTERPRISE_TYPE_2} required error={fieldErrors.enterprise_type_2}>
          <Form.Item name="enterprise_type_2" noStyle>
            <Select
              id={FIELD_ID_COMPANY_TYPE_2}
              options={ENTERPRISE_TYPE_2_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_DEPARTMENT} required error={fieldErrors.department_name}>
          <Form.Item name="department_name" noStyle>
            <Input
              id={FIELD_ID_DEPARTMENT}
              onBlur={(e) =>
                validateAndSetField('department_name', validateNameField(e.target.value, LABEL_DEPARTMENT))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_TITLE} required error={fieldErrors.title}>
          <Form.Item name="title" noStyle>
            <Input
              id={FIELD_ID_TITLE}
              onBlur={(e) =>
                validateAndSetField('title', validateField(e.target.value, LABEL_TITLE_VALIDATE))
              }
            />
          </Form.Item>
        </ClientFormRow>
      </Section>

      <Section title={SECTION_MANAGER}>
        <ClientFormRow label={LABEL_MANAGER} required error={fieldErrors.responsible_person}>
          <Form.Item name="responsible_person" noStyle>
            <Input
              id={FIELD_ID_MANAGER}
              onBlur={(e) =>
                validateAndSetField(
                  'responsible_person',
                  validateNameField(e.target.value, LABEL_MANAGER),
                )
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_MANAGER_KATAKANA} required error={fieldErrors.responsible_person_katakana}>
          <Form.Item name="responsible_person_katakana" noStyle>
            <Input
              id={FIELD_ID_MANAGER_KATA}
              onBlur={(e) =>
                validateAndSetField(
                  'responsible_person_katakana',
                  validateNameField(e.target.value, LABEL_MANAGER_KATAKANA),
                )
              }
            />
          </Form.Item>
        </ClientFormRow>

        {showPasswordFields && (
          <>
            <ClientFormRow label={LABEL_PASSWORD} required error={fieldErrors.password}>
              <Form.Item name="password" noStyle>
                <Input.Password
                  id={FIELD_ID_PASSWORD}
                  onBlur={(e) =>
                    validateAndSetField(
                      'password',
                      validatePasswordField(e.target.value, LABEL_PASSWORD),
                    )
                  }
                />
              </Form.Item>
            </ClientFormRow>

            <ClientFormRow label={LABEL_PASSWORD_CONFIRM} required error={fieldErrors.password_confirmation}>
              <Form.Item name="password_confirmation" noStyle>
                <Input.Password
                  id={FIELD_ID_PASSWORD_CONFIRM}
                  onBlur={(e) =>
                    validateAndSetField(
                      'password_confirmation',
                      validateField(e.target.value, LABEL_PASSWORD_CONFIRM),
                    )
                  }
                />
              </Form.Item>
            </ClientFormRow>
          </>
        )}
      </Section>

      <Section title={SECTION_LOGO_SITE}>
        <ClientFormRow label={LABEL_LOGO} required={showPasswordFields} alignTop error={fieldErrors.logo}>
          <div className="admin-client-form-logo">
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                id={avatarId}
                className="admin-client-form-logo-input"
                onChange={onImageChange}
                disabled={disableInput}
                accept={FILE_ACCEPT_IMAGES}
              />
              {!disableInput && (
                <Button id={FIELD_ID_IMAGE_BUTTON} onClick={onSelectImageClick}>
                  {CHANGE_IMAGE_LABEL}
                </Button>
              )}
            </div>
            {urlLogo ? (
              <img
                id={FIELD_ID_IMAGE_PREVIEW}
                src={urlLogo}
                className="admin-client-form-logo-preview"
                alt=""
              />
            ) : null}
          </div>
        </ClientFormRow>

        <ClientFormRow label={LABEL_SITE_URL} required error={fieldErrors.url}>
          <Form.Item name="url" noStyle>
            <Input
              id={FIELD_ID_URL}
              onBlur={(e) => validateAndSetField('url', validateField(e.target.value, LABEL_URL))}
            />
          </Form.Item>
        </ClientFormRow>
      </Section>

      <Section title={SECTION_CONTACT}>
        <ClientFormRow label={LABEL_ZIP} required error={fieldErrors.zip_code}>
          <Form.Item name="zip_code" noStyle>
            <Input
              id={FIELD_ID_ZIP}
              onBlur={(e) =>
                validateAndSetField('zip_code', validateZipCode(e.target.value))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_PREFECTURE} required error={fieldErrors.prefecture}>
          <Form.Item name="prefecture" noStyle>
            <Select
              id={FIELD_ID_PREFECTURE}
              showSearch
              optionFilterProp="label"
              options={PREFECTURE_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_MUNICIPALITY} required error={fieldErrors.municipality}>
          <Form.Item name="municipality" noStyle>
            <Input
              id={FIELD_ID_MUNICIPALITY}
              onBlur={(e) =>
                validateAndSetField('municipality', validateField(e.target.value, LABEL_PREFECTURE))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_ADDRESS} required error={fieldErrors.address}>
          <Form.Item name="address" noStyle>
            <Input
              id={FIELD_ID_ADDRESS}
              onBlur={(e) =>
                validateAndSetField('address', validateField(e.target.value, LABEL_ADDRESS))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_BUILDING} required error={fieldErrors.building_name}>
          <Form.Item name="building_name" noStyle>
            <Input
              id={FIELD_ID_BUILDING}
              onBlur={(e) =>
                validateAndSetField('building_name', validateField(e.target.value, LABEL_BUILDING))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_EMAIL} required error={fieldErrors.email}>
          <Form.Item name="email" noStyle>
            <Input
              id={FIELD_ID_EMAIL}
              onBlur={(e) =>
                validateAndSetField('email', validateNameField(e.target.value, LABEL_EMAIL))
              }
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_REPLY_GMAIL} error={fieldErrors.reply_smtp_gmail}>
          <Form.Item name="reply_smtp_gmail" noStyle>
            <Input id={FIELD_ID_REPLY_GMAIL} />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_REPLY_APP_PASSWORD} error={fieldErrors.reply_smtp_gmail_app_password}>
          <Form.Item name="reply_smtp_gmail_app_password" noStyle>
            <Input.Password id={FIELD_ID_REPLY_APP_PASSWORD} autoComplete="new-password" />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label={LABEL_PHONE} required error={fieldErrors.phone_number}>
          <Form.Item name="phone_number" noStyle>
            <Input
              id={FIELD_ID_PHONE}
              onBlur={(e) =>
                validateAndSetField('phone_number', validatePhoneNumber(e.target.value))
              }
            />
          </Form.Item>
        </ClientFormRow>
      </Section>

      <Section title={SECTION_CART}>
        <ClientFormRow label={LABEL_CART_SYSTEM} required error={fieldErrors.cart_system}>
          <Form.Item name="cart_system" noStyle>
            <Select id={FIELD_ID_CART} options={CART_SYSTEM_OPTIONS} />
          </Form.Item>
        </ClientFormRow>

        {cartSystem === CART_SYSTEM_SHOPIFY && (
          <>
            <ClientFormRow label={LABEL_SHOP_URL}>
              <Input value={shopUrl} onChange={(e) => setShopUrl(e.target.value)} />
            </ClientFormRow>
            <ClientFormRow label={LABEL_CLIENT_ID}>
              <Input value={clientId} onChange={(e) => setClientId(e.target.value)} />
            </ClientFormRow>
            <ClientFormRow label={LABEL_CLIENT_SECRET}>
              <Input value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} />
            </ClientFormRow>
          </>
        )}
      </Section>
    </Form>
  );
};

ClientFormBody.propTypes = {
  formId: PropTypes.string,
  antdForm: PropTypes.object,
  showPasswordFields: PropTypes.bool,
  disableInput: PropTypes.bool,
  avatarId: PropTypes.string,
  avatarInputRef: PropTypes.object,
  plans: PropTypes.array,
  contract: PropTypes.string,
  setContract: PropTypes.func,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  urlLogo: PropTypes.string,
  shopUrl: PropTypes.string,
  setShopUrl: PropTypes.func,
  clientId: PropTypes.string,
  setClientId: PropTypes.func,
  clientSecret: PropTypes.string,
  setClientSecret: PropTypes.func,
  onSelectPlan: PropTypes.func,
  onImageChange: PropTypes.func,
  onSelectImageClick: PropTypes.func,
  fieldErrors: PropTypes.object,
  validateAndSetField: PropTypes.func,
  validateNameField: PropTypes.func,
  validateField: PropTypes.func,
  validatePasswordField: PropTypes.func,
  validatePrice: PropTypes.func,
  validateZipCode: PropTypes.func,
  validatePhoneNumber: PropTypes.func,
};

export default ClientFormBody;
