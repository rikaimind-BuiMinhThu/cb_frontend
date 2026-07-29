import React from 'react';
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

const { TextArea } = Input;

function FormFieldError({ message }) {
  if (!message) return null;
  return (
    <div className="admin-client-form-error" role="alert">
      {message}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="admin-client-form-section">
      <h5 className="admin-client-form-section-title">{title}</h5>
      {children}
    </section>
  );
}

function BotFeatureRadio({ name, id }) {
  return (
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
}

function ClientFormBody({
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
}) {
  const cartSystem = Form.useWatch('cart_system', antdForm);

  const toMoment = (value) => {
    if (!value) return null;
    if (moment.isMoment(value)) return value;
    if (value instanceof Date) return moment(value);
    return moment(value);
  };

  return (
    <Form
      id={formId}
      form={antdForm}
      layout="vertical"
      disabled={disableInput}
      className="admin-client-form"
      initialValues={{
        cart_system: 'cart_system_none',
        is_instagram: 'false',
        is_line: 'false',
        is_tiktok: 'false',
        is_web: 'false',
      }}
    >
      <Section title="契約・プラン">
        <ClientFormRow label="ステータス" required>
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
          <FormFieldError message={fieldErrors.status} />
        </ClientFormRow>

        <ClientFormRow label="プラン名" required>
          <Form.Item name="plan" noStyle>
            <Select
              id="plan"
              placeholder="プランを選択"
              onChange={onSelectPlan}
              options={plans.map((planItem) => ({
                value: planItem.code,
                label: `${planItem.name}プラン`,
              }))}
            />
          </Form.Item>
        </ClientFormRow>

        <ClientFormRow label="プラン価格">
          <Form.Item name="price" noStyle>
            <Input
              id="newPlanPrice"
              onBlur={(e) =>
                validateAndSetField('price', validatePrice(e.target.value))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.price} />
        </ClientFormRow>

        <ClientFormRow label="課金開始日">
          <DatePicker
            id="startDate"
            format="YYYY/MM/DD"
            value={toMoment(startDate)}
            onChange={(date) => onStartDateChange(date ? date.toDate() : null)}
          />
          <FormFieldError message={fieldErrors.subscription_start_at} />
        </ClientFormRow>

        <ClientFormRow label="最低利用期間終了日">
          <DatePicker
            id="endDate"
            format="YYYY/MM/DD"
            value={toMoment(endDate)}
            onChange={(date) => onEndDateChange(date ? date.toDate() : null)}
          />
          <FormFieldError message={fieldErrors.subscription_end_at} />
        </ClientFormRow>
      </Section>

      <Section title="ボット機能">
        <ClientFormRow label="Instagramチャットボット機能">
          <BotFeatureRadio name="is_instagram" id="is_instagram" />
        </ClientFormRow>
        <ClientFormRow label="LINEチャットボット機能">
          <BotFeatureRadio name="is_line" id="is_line" />
        </ClientFormRow>
        <ClientFormRow label="TikTokチャットボット機能">
          <BotFeatureRadio name="is_tiktok" id="is_tiktok" />
        </ClientFormRow>
        <ClientFormRow label="WEBチャットボット機能">
          <BotFeatureRadio name="is_web" id="is_web" />
        </ClientFormRow>

        <ClientFormRow label="メモ" alignTop>
          <Form.Item name="note" noStyle>
            <TextArea id="newNote" rows={4} />
          </Form.Item>
          <FormFieldError message={fieldErrors.note} />
        </ClientFormRow>
      </Section>

      <Section title="会社情報">
        <ClientFormRow label="名称" required>
          <Form.Item name="name" noStyle>
            <Input
              id="newName"
              onBlur={(e) =>
                validateAndSetField('name', validateNameField(e.target.value, '名称'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.name} />
        </ClientFormRow>

        <ClientFormRow label="名称カナ" required>
          <Form.Item name="name_katakana" noStyle>
            <Input
              id="newNameKata"
              onBlur={(e) =>
                validateAndSetField('name_katakana', validateNameField(e.target.value, '名称カナ'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.name_katakana} />
        </ClientFormRow>

        <ClientFormRow label="企業種別" required>
          <Form.Item name="enterprise_type" noStyle>
            <Select
              id="newCompanyType"
              showSearch
              optionFilterProp="label"
              options={ENTERPRISE_TYPE_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.enterprise_type} />
        </ClientFormRow>

        <ClientFormRow label="企業種別２" required>
          <Form.Item name="enterprise_type_2" noStyle>
            <Select
              id="newCompanyType2"
              options={ENTERPRISE_TYPE_2_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.enterprise_type_2} />
        </ClientFormRow>

        <ClientFormRow label="部署名" required>
          <Form.Item name="department_name" noStyle>
            <Input
              id="newDepartmentName"
              onBlur={(e) =>
                validateAndSetField('department_name', validateNameField(e.target.value, '部署名'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.department_name} />
        </ClientFormRow>

        <ClientFormRow label="肩書" required>
          <Form.Item name="title" noStyle>
            <Input
              id="newTitle"
              onBlur={(e) =>
                validateAndSetField('title', validateField(e.target.value, 'タイトル'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.title} />
        </ClientFormRow>
      </Section>

      <Section title="担当者">
        <ClientFormRow label="担当者" required>
          <Form.Item name="responsible_person" noStyle>
            <Input
              id="newManager"
              onBlur={(e) =>
                validateAndSetField(
                  'responsible_person',
                  validateNameField(e.target.value, '担当者'),
                )
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.responsible_person} />
        </ClientFormRow>

        <ClientFormRow label="担当者カナ" required>
          <Form.Item name="responsible_person_katakana" noStyle>
            <Input
              id="newManagerKata"
              onBlur={(e) =>
                validateAndSetField(
                  'responsible_person_katakana',
                  validateNameField(e.target.value, '担当者カナ'),
                )
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.responsible_person_katakana} />
        </ClientFormRow>

        {showPasswordFields && (
          <>
            <ClientFormRow label="パスワード" required>
              <Form.Item name="password" noStyle>
                <Input.Password
                  id="newPassword"
                  onBlur={(e) =>
                    validateAndSetField(
                      'password',
                      validatePasswordField(e.target.value, 'パスワード'),
                    )
                  }
                />
              </Form.Item>
              <FormFieldError message={fieldErrors.password} />
            </ClientFormRow>

            <ClientFormRow label="パスワード(確認用)" required>
              <Form.Item name="password_confirmation" noStyle>
                <Input.Password
                  id="newConfirmPassword"
                  onBlur={(e) =>
                    validateAndSetField(
                      'password_confirmation',
                      validateField(e.target.value, 'パスワード(確認用)'),
                    )
                  }
                />
              </Form.Item>
              <FormFieldError message={fieldErrors.password_confirmation} />
            </ClientFormRow>
          </>
        )}
      </Section>

      <Section title="ロゴ・サイト">
        <ClientFormRow label="画像（ロゴ）" required={showPasswordFields} alignTop>
          <div className="admin-client-form-logo">
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                id={avatarId}
                style={{ display: 'none' }}
                onChange={onImageChange}
                disabled={disableInput}
                accept="image/png, image/jpeg"
              />
              {!disableInput && (
                <Button id="btnimgNum" onClick={onSelectImageClick}>
                  画像変更
                </Button>
              )}
              <FormFieldError message={fieldErrors.logo} />
            </div>
            {urlLogo ? (
              <img
                id="imgUpdatesrc"
                src={urlLogo}
                className="admin-client-form-logo-preview"
                alt=""
              />
            ) : null}
          </div>
        </ClientFormRow>

        <ClientFormRow label="サイトURL" required>
          <Form.Item name="url" noStyle>
            <Input
              id="newURL"
              onBlur={(e) => validateAndSetField('url', validateField(e.target.value, 'URL'))}
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.url} />
        </ClientFormRow>
      </Section>

      <Section title="住所・連絡先">
        <ClientFormRow label="郵便番号" required>
          <Form.Item name="zip_code" noStyle>
            <Input
              id="newPostCode"
              onBlur={(e) =>
                validateAndSetField('zip_code', validateZipCode(e.target.value))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.zip_code} />
        </ClientFormRow>

        <ClientFormRow label="都道府県" required>
          <Form.Item name="prefecture" noStyle>
            <Select
              id="newPrefectures"
              showSearch
              optionFilterProp="label"
              options={PREFECTURE_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.prefecture} />
        </ClientFormRow>

        <ClientFormRow label="市区町村" required>
          <Form.Item name="municipality" noStyle>
            <Input
              id="newMunicipalities"
              onBlur={(e) =>
                validateAndSetField('municipality', validateField(e.target.value, '都道府県'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.municipality} />
        </ClientFormRow>

        <ClientFormRow label="住所" required>
          <Form.Item name="address" noStyle>
            <Input
              id="newAddress"
              onBlur={(e) =>
                validateAndSetField('address', validateField(e.target.value, '住所'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.address} />
        </ClientFormRow>

        <ClientFormRow label="建物名" required>
          <Form.Item name="building_name" noStyle>
            <Input
              id="newBuildingName"
              onBlur={(e) =>
                validateAndSetField('building_name', validateField(e.target.value, '建物名'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.building_name} />
        </ClientFormRow>

        <ClientFormRow label="メールアドレス" required>
          <Form.Item name="email" noStyle>
            <Input
              id="newEmail"
              onBlur={(e) =>
                validateAndSetField('email', validateNameField(e.target.value, 'メールアドレス'))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.email} />
        </ClientFormRow>

        <ClientFormRow label="メール送信用Gmail">
          <Form.Item name="reply_smtp_gmail" noStyle>
            <Input id="replySmtpGmail" />
          </Form.Item>
          <FormFieldError message={fieldErrors.reply_smtp_gmail} />
        </ClientFormRow>

        <ClientFormRow label="メール送信用アプリパスワード">
          <Form.Item name="reply_smtp_gmail_app_password" noStyle>
            <Input.Password id="replySmtpGmailAppPassword" autoComplete="new-password" />
          </Form.Item>
          <FormFieldError message={fieldErrors.reply_smtp_gmail_app_password} />
        </ClientFormRow>

        <ClientFormRow label="電話番号" required>
          <Form.Item name="phone_number" noStyle>
            <Input
              id="newPhone"
              onBlur={(e) =>
                validateAndSetField('phone_number', validatePhoneNumber(e.target.value))
              }
            />
          </Form.Item>
          <FormFieldError message={fieldErrors.phone_number} />
        </ClientFormRow>
      </Section>

      <Section title="カート連携">
        <ClientFormRow label="カートシステム" required>
          <Form.Item name="cart_system" noStyle>
            <Select id="newCartSystem" options={CART_SYSTEM_OPTIONS} />
          </Form.Item>
          <FormFieldError message={fieldErrors.cart_system} />
        </ClientFormRow>

        {cartSystem === 'shopify' && (
          <>
            <ClientFormRow label="Shop URL">
              <Input value={shopUrl} onChange={(e) => setShopUrl(e.target.value)} />
            </ClientFormRow>
            <ClientFormRow label="Client ID">
              <Input value={clientId} onChange={(e) => setClientId(e.target.value)} />
            </ClientFormRow>
            <ClientFormRow label="Client Secret">
              <Input value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} />
            </ClientFormRow>
          </>
        )}
      </Section>
    </Form>
  );
}

export default ClientFormBody;
