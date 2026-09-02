import React from 'react';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../components/AdminShell';
import { Input, message } from 'antd';
import './../../assets/css/basic_setting.css';
import * as utils from './../../JS/validate.js';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';

const MAIL_FORMAT =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

function BasicSetting() {
  const isAdminDeel = Cookies.get('user_role') === 'admin_deel';
  const [userIdEC] = useState(() => Cookies.get('user_id'));
  const [userDetail, setUserDetail] = useState({
    full_name: '',
    company_name: '',
    department: '',
    job_title: '',
    email: '',
    phone_number: '',
    post_code: '',
    address: '',
    url: '',
  });
  const [clientId, setClientId] = useState(null);
  const [language, setLanguage] = useState('');
  const [division, setDivision] = useState('');
  const [replySmtpGmail, setReplySmtpGmail] = useState('');
  const [replySmtpGmailAppPassword, setReplySmtpGmailAppPassword] = useState('');
  const [hasReplySmtpPassword, setHasReplySmtpPassword] = useState(false);
  const [smtpErrors, setSmtpErrors] = useState({ gmail: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/api/v1/managements/users/${Cookies.get('user_id')}`)
      .then((res) => {
        if (cancelled) return;
        const user = res.data.data || {};
        setUserDetail({
          full_name: user.full_name || '',
          company_name: user.company_name || '',
          department: user.department || '',
          job_title: user.job_title || '',
          email: user.email || '',
          phone_number: user.phone_number || '',
          post_code: user.post_code || '',
          address: user.address || '',
          url: user.url || '',
        });
        setLanguage(user.language || '');
        setDivision(user.business_division || '');
        if (user.client_id) {
          setClientId(user.client_id);
          loadClientSmtp(user.client_id, () => cancelled);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function loadClientSmtp(id, isCancelled) {
    api
      .get(`/api/v1/managements/clients/${id}`)
      .then((res) => {
        if (isCancelled?.()) return;
        if (res.data.code === 1 || res.data.code === '1') {
          const data = res.data.data;
          setReplySmtpGmail(data.reply_smtp_gmail || '');
          setReplySmtpGmailAppPassword('');
          setHasReplySmtpPassword(Boolean(data.has_reply_smtp_password));
        }
      })
      .catch((err) => {
        if (isCancelled?.()) return;
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updateUserField(key, value) {
    setUserDetail((prev) => ({ ...prev, [key]: value }));
  }

  function validateReplySmtp() {
    const gmail = (replySmtpGmail || '').trim().replace(/＠/g, '@');
    const password = replySmtpGmailAppPassword || '';
    const nextErrors = { gmail: '', password: '' };

    if (!gmail && !password) {
      setSmtpErrors(nextErrors);
      return true;
    }

    if (gmail && !MAIL_FORMAT.test(gmail)) {
      nextErrors.gmail = 'メールを入力してください(例:abc＠abc.com)';
      setSmtpErrors(nextErrors);
      return false;
    }

    if (gmail && !password && !hasReplySmtpPassword) {
      nextErrors.password = 'アプリパスワードを入力してください。';
      setSmtpErrors(nextErrors);
      return false;
    }

    if (!gmail && password) {
      nextErrors.gmail = 'メール送信用Gmailを入力してください。';
      setSmtpErrors(nextErrors);
      return false;
    }

    setSmtpErrors(nextErrors);
    return true;
  }

  function showNoti(text, type = 'success') {
    if (type === 'warning') {
      message.warning(text);
    } else {
      message.success(text);
    }
  }

  function saveClientSmtp() {
    if (!clientId) {
      return Promise.resolve({ ok: true });
    }

    const clientPayload = {
      reply_smtp_gmail: (replySmtpGmail || '').trim().replace(/＠/g, '@'),
    };
    if (replySmtpGmailAppPassword) {
      clientPayload.reply_smtp_gmail_app_password = replySmtpGmailAppPassword;
    }

    return api
      .patch(`/api/v1/managements/clients/${clientId}`, { client: clientPayload })
      .then((res) => {
        if (res.data.code == 1) {
          if (replySmtpGmailAppPassword) {
            setHasReplySmtpPassword(true);
            setReplySmtpGmailAppPassword('');
          }
          return { ok: true };
        }
        return { ok: false, message: res.data.message || res.data.data || 'Fail' };
      });
  }

  function onSave() {
    if (saving) return;
    utils.checkInput('fullname', 'errFullname', '氏名');
    utils.checkInput('companyName', 'errCompanyname', '企業名');
    utils.checkMaxLength('department', 'errDepartment', '部署', 50);
    utils.checkMaxLength('job_title', 'errPosition', 'Positi役職on', 50);
    utils.checkEmailRequired('emailAddress', 'errEmailAddress', 'メールアドレス');
    utils.checkTel('phone_number', 'errPhone', '電話番号');
    utils.checkInput('address', 'errAddress', '住所');
    utils.checkUrl('url', 'errUrl', 'URL');
    if (
      utils.checkInput('fullname', 'errFullname', '氏名') &&
      utils.checkInput('companyName', 'errCompanyname', '企業名') &&
      utils.checkMaxLength('department', 'errDepartment', '企業名', 50) &&
      utils.checkMaxLength('job_title', 'errPosition', '役職', 50) &&
      utils.checkEmailRequired('emailAddress', 'errEmailAddress', 'メールアドレス') &&
      utils.checkTel('phone_number', 'errPhone', '電話番号') &&
      utils.checkInput('address', 'errAddress', '住所') &&
      utils.checkUrl('url', 'errUrl', 'URL') &&
      validateReplySmtp()
    ) {
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
        .patch(`/api/v1/managements/users/${userIdEC}`, update)
        .then((res) => {
          if (res.data.code == 1) {
            return saveClientSmtp().then((smtpResult) => {
              if (smtpResult.ok) {
                showNoti('正常に更新されました！');
              } else {
                showNoti(smtpResult.message || 'メール送信設定の更新に失敗しました', 'warning');
              }
            });
          } else if (res.data.code == 2) {
            showNoti(res.data.data, 'warning');
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        })
        .finally(() => setSaving(false));
    }
  }

  useAdminHeaderActions(
    <AdminActionButton action="save" loading={saving} onClick={() => onSave()} />
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
          <form id="form-basic-setting">
            <AdminFormRow label="氏名" required htmlFor="fullname">
              <Input
                id="fullname"
                placeholder="必ず入力してください ..."
                name="full_name"
                value={userDetail.full_name}
                onChange={(e) => {
                  updateUserField('full_name', e.target.value);
                  utils.checkInput('fullname', 'errFullname', '氏名');
                }}
              />
              <span id="errFullname" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="事業区分" htmlFor="business_division">
              <select
                className="admin-native-select"
                id="business_division"
                name="business_division"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
              >
                <option value="sole_proprietorship">個人事業</option>
                <option value="corporation">法人</option>
              </select>
            </AdminFormRow>

            <AdminFormRow label="企業名" required htmlFor="companyName">
              <Input
                id="companyName"
                placeholder="必ず入力してください ..."
                name="company_name"
                value={userDetail.company_name}
                onChange={(e) => {
                  updateUserField('company_name', e.target.value);
                  utils.checkInput('companyName', 'errCompanyname', '企業名');
                }}
              />
              <span id="errCompanyname" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="部署" htmlFor="department">
              <Input
                id="department"
                placeholder="必ず入力してください ..."
                name="department"
                value={userDetail.department}
                onChange={(e) => {
                  updateUserField('department', e.target.value);
                  utils.checkMaxLength('department', 'errDepartment', '部署', 50);
                }}
              />
              <span id="errDepartment" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="役職" htmlFor="job_title">
              <Input
                id="job_title"
                placeholder="必ず入力してください ..."
                name="job_title"
                value={userDetail.job_title}
                onChange={(e) => {
                  updateUserField('job_title', e.target.value);
                  utils.checkMaxLength('job_title', 'errPosition', '役職', 50);
                }}
              />
              <span id="errPosition" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="メールアドレス" required={isAdminDeel} htmlFor="emailAddress">
              <Input
                id="emailAddress"
                placeholder="必ず入力してください ..."
                name="email"
                value={userDetail.email}
                onChange={(e) => {
                  updateUserField('email', e.target.value);
                  utils.checkEmailRequired('emailAddress', 'errEmailAddress', 'メールアドレス');
                }}
                readOnly={!isAdminDeel}
              />
              <span id="errEmailAddress" className="admin-form-error" />
              {!isAdminDeel && (
                <div className="admin-form-row-hint">
                  登録したメールアドレスを編集権限がありません。管理者へ連絡してください！
                </div>
              )}
            </AdminFormRow>

            <AdminFormRow label="電話番号" required htmlFor="phone_number">
              <Input
                id="phone_number"
                type="number"
                placeholder="必ず入力してください ..."
                name="phone_number"
                value={userDetail.phone_number}
                onChange={(e) => {
                  updateUserField('phone_number', e.target.value);
                  utils.checkTel('phone_number', 'errPhone', '電話番号');
                }}
              />
              <span id="errPhone" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="郵便番号" htmlFor="post_code">
              <Input
                id="post_code"
                type="number"
                placeholder="必ず入力してください ..."
                name="post_code"
                value={userDetail.post_code}
                onChange={(e) => updateUserField('post_code', e.target.value)}
              />
              <span id="errPostCost" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="住所" required htmlFor="address">
              <Input
                id="address"
                placeholder="必ず入力してください ..."
                name="address"
                value={userDetail.address}
                onChange={(e) => {
                  updateUserField('address', e.target.value);
                  utils.checkInput('address', 'errAddress', '住所');
                }}
              />
              <span id="errAddress" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="言語" htmlFor="language">
              <select
                className="admin-native-select"
                id="language"
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="japanese">日本</option>
                <option value="english">英語</option>
                <option value="vietnamese">ベトナム語</option>
                <option value="chinese">中国人</option>
              </select>
            </AdminFormRow>

            <AdminFormRow label="URL" htmlFor="url">
              <Input
                id="url"
                placeholder="必ず入力してください ..."
                name="url"
                value={userDetail.url}
                onChange={(e) => {
                  updateUserField('url', e.target.value);
                  utils.checkUrl('url', 'errUrl', 'URL');
                }}
              />
              <span id="errUrl" className="admin-form-error" />
            </AdminFormRow>
          </form>

          {clientId && (
            <>
              <AdminFormRow label="メール送信用Gmail" htmlFor="replySmtpGmail" error={smtpErrors.gmail}>
                <Input
                  id="replySmtpGmail"
                  placeholder="example@gmail.com"
                  value={replySmtpGmail}
                  onChange={(e) => setReplySmtpGmail(e.target.value)}
                  autoComplete="off"
                />
              </AdminFormRow>
              <AdminFormRow
                label="メール送信用アプリパスワード"
                htmlFor="replySmtpGmailAppPassword"
                hint="Gmailの2段階認証で発行したアプリパスワードを入力してください"
                error={smtpErrors.password}
              >
                <Input.Password
                  id="replySmtpGmailAppPassword"
                  placeholder={hasReplySmtpPassword ? '設定済み（変更する場合のみ入力）' : ''}
                  value={replySmtpGmailAppPassword}
                  onChange={(e) => setReplySmtpGmailAppPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </AdminFormRow>
            </>
          )}
        </div>
      </AdminPage>
    </>
  );
}

export default BasicSetting;
