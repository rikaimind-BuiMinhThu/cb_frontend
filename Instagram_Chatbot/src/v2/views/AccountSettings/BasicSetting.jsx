import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import {
  API_SUCCESS_CODE,
  USER_ID_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
} from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminActionButton,
  AdminFormRow,
  AdminPage,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { USER_ROLE_ADMIN_DEEL } from 'v2/components/AdminShell/constants';
import {
  DEFAULT_MAX_LENGTH,
  getEmailRequiredError,
  getInputError,
  getMaxLengthError,
  getTelError,
  getUrlError,
} from 'v2/utils/formValidate';
import {
  ADDRESS_LABEL,
  API_WARNING_CODE,
  APP_PASSWORD_REQUIRED_MESSAGE,
  ASCII_AT,
  BUSINESS_DIVISION_LABEL,
  CLIENTS_PATH,
  COMPANY_NAME_LABEL,
  CORPORATION,
  DEPARTMENT_LABEL,
  DIVISION_CORP_LABEL,
  DIVISION_SOLE_LABEL,
  EMAIL_LABEL,
  EMAIL_READONLY_HINT,
  EMPTY_VALUE,
  FAIL_FALLBACK,
  FULL_NAME_LABEL,
  FULL_WIDTH_AT,
  GMAIL_REQUIRED_MESSAGE,
  INVALID_GMAIL_MESSAGE,
  JOB_TITLE_LABEL,
  LANGUAGE_CHINESE,
  LANGUAGE_EN_LABEL,
  LANGUAGE_ENGLISH,
  LANGUAGE_JA_LABEL,
  LANGUAGE_JAPANESE,
  LANGUAGE_LABEL,
  LANGUAGE_VI_LABEL,
  LANGUAGE_VIETNAMESE,
  LANGUAGE_ZH_LABEL,
  MAIL_FORMAT,
  PHONE_LABEL,
  POST_CODE_LABEL,
  REQUIRED_PLACEHOLDER,
  SMTP_GMAIL_LABEL,
  SMTP_GMAIL_PLACEHOLDER,
  SMTP_PASSWORD_HINT,
  SMTP_PASSWORD_LABEL,
  SMTP_PASSWORD_SET_PLACEHOLDER,
  SMTP_UPDATE_FAILED,
  SOLE_PROPRIETORSHIP,
  UPDATE_SUCCESS_MESSAGE,
  URL_LABEL,
  USERS_PATH,
} from './basicSettingConstants';
import 'v2/views/AccountSettings/styles/basic-setting.css';

const isApiSuccess = (code) => code === API_SUCCESS_CODE || code === String(API_SUCCESS_CODE);

const BasicSetting = () => {
  const isAdminDeel = Cookies.get(USER_ROLE_COOKIE_KEY) === USER_ROLE_ADMIN_DEEL;
  const [userIdEC] = useState(() => Cookies.get(USER_ID_COOKIE_KEY));
  const [userDetail, setUserDetail] = useState({
    full_name: EMPTY_VALUE,
    company_name: EMPTY_VALUE,
    department: EMPTY_VALUE,
    job_title: EMPTY_VALUE,
    email: EMPTY_VALUE,
    phone_number: EMPTY_VALUE,
    post_code: EMPTY_VALUE,
    address: EMPTY_VALUE,
    url: EMPTY_VALUE,
  });
  const [clientId, setClientId] = useState(null);
  const [language, setLanguage] = useState(EMPTY_VALUE);
  const [division, setDivision] = useState(EMPTY_VALUE);
  const [replySmtpGmail, setReplySmtpGmail] = useState(EMPTY_VALUE);
  const [replySmtpGmailAppPassword, setReplySmtpGmailAppPassword] = useState(EMPTY_VALUE);
  const [hasReplySmtpPassword, setHasReplySmtpPassword] = useState(false);
  const [smtpErrors, setSmtpErrors] = useState({ gmail: EMPTY_VALUE, password: EMPTY_VALUE });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const updateUserField = (key, value) => {
    setUserDetail((prev) => ({ ...prev, [key]: value }));
  };

  const loadClientSmtp = (id, isCancelled) => {
    api
      .get(`${CLIENTS_PATH}/${id}`)
      .then((res) => {
        if (isCancelled?.()) return;
        if (isApiSuccess(res.data.code)) {
          const data = res.data.data;
          setReplySmtpGmail(data.reply_smtp_gmail || EMPTY_VALUE);
          setReplySmtpGmailAppPassword(EMPTY_VALUE);
          setHasReplySmtpPassword(Boolean(data.has_reply_smtp_password));
        }
      })
      .catch((err) => {
        if (isCancelled?.()) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  useEffect(() => {
    const request = { cancelled: false };
    api
      .get(`${USERS_PATH}/${Cookies.get(USER_ID_COOKIE_KEY)}`)
      .then((res) => {
        if (request.cancelled) return;
        const user = res.data.data || {};
        setUserDetail({
          full_name: user.full_name || EMPTY_VALUE,
          company_name: user.company_name || EMPTY_VALUE,
          department: user.department || EMPTY_VALUE,
          job_title: user.job_title || EMPTY_VALUE,
          email: user.email || EMPTY_VALUE,
          phone_number: user.phone_number || EMPTY_VALUE,
          post_code: user.post_code || EMPTY_VALUE,
          address: user.address || EMPTY_VALUE,
          url: user.url || EMPTY_VALUE,
        });
        setLanguage(user.language || EMPTY_VALUE);
        setDivision(user.business_division || EMPTY_VALUE);
        if (user.client_id) {
          setClientId(user.client_id);
          loadClientSmtp(user.client_id, () => request.cancelled);
        }
      })
      .catch((err) => {
        if (request.cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  }, []);

  const validateReplySmtp = () => {
    const gmail = (replySmtpGmail || EMPTY_VALUE).trim().replace(new RegExp(FULL_WIDTH_AT, 'g'), ASCII_AT);
    const password = replySmtpGmailAppPassword || EMPTY_VALUE;
    const nextErrors = { gmail: EMPTY_VALUE, password: EMPTY_VALUE };

    if (!gmail && !password) {
      setSmtpErrors(nextErrors);
      return true;
    }

    if (gmail && !MAIL_FORMAT.test(gmail)) {
      nextErrors.gmail = INVALID_GMAIL_MESSAGE;
      setSmtpErrors(nextErrors);
      return false;
    }

    if (gmail && !password && !hasReplySmtpPassword) {
      nextErrors.password = APP_PASSWORD_REQUIRED_MESSAGE;
      setSmtpErrors(nextErrors);
      return false;
    }

    if (!gmail && password) {
      nextErrors.gmail = GMAIL_REQUIRED_MESSAGE;
      setSmtpErrors(nextErrors);
      return false;
    }

    setSmtpErrors(nextErrors);
    return true;
  };

  const showNoti = (text, type = 'success') => {
    if (type === 'warning') {
      message.warning(text);
      return;
    }
    message.success(text);
  };

  const saveClientSmtp = () => {
    if (!clientId) {
      return Promise.resolve({ ok: true });
    }

    const clientPayload = {
      reply_smtp_gmail: (replySmtpGmail || EMPTY_VALUE).trim().replace(new RegExp(FULL_WIDTH_AT, 'g'), ASCII_AT),
    };
    if (replySmtpGmailAppPassword) {
      clientPayload.reply_smtp_gmail_app_password = replySmtpGmailAppPassword;
    }

    return api
      .patch(`${CLIENTS_PATH}/${clientId}`, { client: clientPayload })
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          if (replySmtpGmailAppPassword) {
            setHasReplySmtpPassword(true);
            setReplySmtpGmailAppPassword(EMPTY_VALUE);
          }
          return { ok: true };
        }
        return { ok: false, message: res.data.message || res.data.data || FAIL_FALLBACK };
      });
  };

  const onSave = () => {
    if (saving) return;
    const nextErrors = {
      full_name: getInputError(userDetail.full_name, FULL_NAME_LABEL),
      company_name: getInputError(userDetail.company_name, COMPANY_NAME_LABEL),
      department: getMaxLengthError(userDetail.department, DEPARTMENT_LABEL, DEFAULT_MAX_LENGTH),
      job_title: getMaxLengthError(userDetail.job_title, JOB_TITLE_LABEL, DEFAULT_MAX_LENGTH),
      email: getEmailRequiredError(userDetail.email, EMAIL_LABEL),
      phone_number: getTelError(userDetail.phone_number, PHONE_LABEL),
      address: getInputError(userDetail.address, ADDRESS_LABEL),
      url: getUrlError(userDetail.url, URL_LABEL),
    };
    setFieldErrors(nextErrors);
    const hasFieldError = Object.values(nextErrors).some(Boolean);
    if (hasFieldError || !validateReplySmtp()) return;

    const update = {
      user: {
        full_name: userDetail.full_name,
        business_division: division,
        company_name: userDetail.company_name,
        department: userDetail.department,
        job_title: userDetail.job_title,
        email: userDetail.email,
        phone_number: userDetail.phone_number,
        post_code: userDetail.post_code,
        address: userDetail.address,
        language,
        url: userDetail.url,
      },
    };
    setSaving(true);
    api
      .patch(`${USERS_PATH}/${userIdEC}`, update)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          return saveClientSmtp().then((smtpResult) => {
            if (smtpResult.ok) {
              showNoti(UPDATE_SUCCESS_MESSAGE);
              return;
            }
            showNoti(smtpResult.message || SMTP_UPDATE_FAILED, 'warning');
          });
        }
        if (res.data.code === API_WARNING_CODE) {
          showNoti(res.data.data, 'warning');
        }
        return undefined;
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setSaving(false));
  };

  useAdminHeaderActions(
    <AdminActionButton action="save" loading={saving} onClick={onSave} />
  );

  return (
    <AdminPage>
      <div className="admin-page-body">
        <AdminFormRow label={FULL_NAME_LABEL} required htmlFor="fullname" error={fieldErrors.full_name}>
          <Input
            id="fullname"
            placeholder={REQUIRED_PLACEHOLDER}
            name="full_name"
            value={userDetail.full_name}
            onChange={(e) => {
              updateUserField('full_name', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                full_name: getInputError(e.target.value, FULL_NAME_LABEL),
              }));
            }}
          />
        </AdminFormRow>

        <AdminFormRow label={BUSINESS_DIVISION_LABEL} htmlFor="business_division">
          <select
            className="admin-native-select"
            id="business_division"
            name="business_division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value={SOLE_PROPRIETORSHIP}>{DIVISION_SOLE_LABEL}</option>
            <option value={CORPORATION}>{DIVISION_CORP_LABEL}</option>
          </select>
        </AdminFormRow>

        <AdminFormRow label={COMPANY_NAME_LABEL} required htmlFor="companyName" error={fieldErrors.company_name}>
          <Input
            id="companyName"
            placeholder={REQUIRED_PLACEHOLDER}
            name="company_name"
            value={userDetail.company_name}
            onChange={(e) => {
              updateUserField('company_name', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                company_name: getInputError(e.target.value, COMPANY_NAME_LABEL),
              }));
            }}
          />
        </AdminFormRow>

        <AdminFormRow label={DEPARTMENT_LABEL} htmlFor="department" error={fieldErrors.department}>
          <Input
            id="department"
            placeholder={REQUIRED_PLACEHOLDER}
            name="department"
            value={userDetail.department}
            onChange={(e) => {
              updateUserField('department', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                department: getMaxLengthError(e.target.value, DEPARTMENT_LABEL, DEFAULT_MAX_LENGTH),
              }));
            }}
          />
        </AdminFormRow>

        <AdminFormRow label={JOB_TITLE_LABEL} htmlFor="job_title" error={fieldErrors.job_title}>
          <Input
            id="job_title"
            placeholder={REQUIRED_PLACEHOLDER}
            name="job_title"
            value={userDetail.job_title}
            onChange={(e) => {
              updateUserField('job_title', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                job_title: getMaxLengthError(e.target.value, JOB_TITLE_LABEL, DEFAULT_MAX_LENGTH),
              }));
            }}
          />
        </AdminFormRow>

        <AdminFormRow
          label={EMAIL_LABEL}
          required={isAdminDeel}
          htmlFor="emailAddress"
          error={fieldErrors.email}
        >
          <Input
            id="emailAddress"
            placeholder={REQUIRED_PLACEHOLDER}
            name="email"
            value={userDetail.email}
            onChange={(e) => {
              updateUserField('email', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                email: getEmailRequiredError(e.target.value, EMAIL_LABEL),
              }));
            }}
            readOnly={!isAdminDeel}
          />
          {!isAdminDeel && (
            <div className="admin-form-row-hint">
              {EMAIL_READONLY_HINT}
            </div>
          )}
        </AdminFormRow>

        <AdminFormRow label={PHONE_LABEL} required htmlFor="phone_number" error={fieldErrors.phone_number}>
          <Input
            id="phone_number"
            type="number"
            placeholder={REQUIRED_PLACEHOLDER}
            name="phone_number"
            value={userDetail.phone_number}
            onChange={(e) => {
              updateUserField('phone_number', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                phone_number: getTelError(e.target.value, PHONE_LABEL),
              }));
            }}
          />
        </AdminFormRow>

        <AdminFormRow label={POST_CODE_LABEL} htmlFor="post_code">
          <Input
            id="post_code"
            type="number"
            placeholder={REQUIRED_PLACEHOLDER}
            name="post_code"
            value={userDetail.post_code}
            onChange={(e) => updateUserField('post_code', e.target.value)}
          />
        </AdminFormRow>

        <AdminFormRow label={ADDRESS_LABEL} required htmlFor="address" error={fieldErrors.address}>
          <Input
            id="address"
            placeholder={REQUIRED_PLACEHOLDER}
            name="address"
            value={userDetail.address}
            onChange={(e) => {
              updateUserField('address', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                address: getInputError(e.target.value, ADDRESS_LABEL),
              }));
            }}
          />
        </AdminFormRow>

        <AdminFormRow label={LANGUAGE_LABEL} htmlFor="language">
          <select
            className="admin-native-select"
            id="language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value={LANGUAGE_JAPANESE}>{LANGUAGE_JA_LABEL}</option>
            <option value={LANGUAGE_ENGLISH}>{LANGUAGE_EN_LABEL}</option>
            <option value={LANGUAGE_VIETNAMESE}>{LANGUAGE_VI_LABEL}</option>
            <option value={LANGUAGE_CHINESE}>{LANGUAGE_ZH_LABEL}</option>
          </select>
        </AdminFormRow>

        <AdminFormRow label={URL_LABEL} htmlFor="url" error={fieldErrors.url}>
          <Input
            id="url"
            placeholder={REQUIRED_PLACEHOLDER}
            name="url"
            value={userDetail.url}
            onChange={(e) => {
              updateUserField('url', e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                url: getUrlError(e.target.value, URL_LABEL),
              }));
            }}
          />
        </AdminFormRow>

        {clientId && (
          <>
            <AdminFormRow label={SMTP_GMAIL_LABEL} htmlFor="replySmtpGmail" error={smtpErrors.gmail}>
              <Input
                id="replySmtpGmail"
                placeholder={SMTP_GMAIL_PLACEHOLDER}
                value={replySmtpGmail}
                onChange={(e) => setReplySmtpGmail(e.target.value)}
                autoComplete="off"
              />
            </AdminFormRow>
            <AdminFormRow
              label={SMTP_PASSWORD_LABEL}
              htmlFor="replySmtpGmailAppPassword"
              hint={SMTP_PASSWORD_HINT}
              error={smtpErrors.password}
            >
              <Input.Password
                id="replySmtpGmailAppPassword"
                placeholder={hasReplySmtpPassword ? SMTP_PASSWORD_SET_PLACEHOLDER : EMPTY_VALUE}
                value={replySmtpGmailAppPassword}
                onChange={(e) => setReplySmtpGmailAppPassword(e.target.value)}
                autoComplete="new-password"
              />
            </AdminFormRow>
          </>
        )}
      </div>
    </AdminPage>
  );
};

export default BasicSetting;
