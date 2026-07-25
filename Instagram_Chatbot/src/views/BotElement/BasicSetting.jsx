import React from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/basic_setting.css';
import * as utils from './../../JS/validate.js';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../api/api-management';
import ModalNoti from './../Popup/ModalNoti';
import { tokenExpired } from 'api/tokenExpired';

const MAIL_FORMAT =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

function BasicSetting() {
  const [userIdEC, setUsreIdEC] = useState();
  const [userDetail, setUserDetail] = useState({});
  const [clientId, setClientId] = useState(null);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [language, setLanguage] = useState('');
  const [division, setDivision] = useState('');
  const [replySmtpGmail, setReplySmtpGmail] = useState('');
  const [replySmtpGmailAppPassword, setReplySmtpGmailAppPassword] = useState('');
  const [hasReplySmtpPassword, setHasReplySmtpPassword] = useState(false);

  // authorization
  const [isAdminDeel, setIsAdminDeel] = useState(false);

  useEffect(() => {
    if (Cookies.get('user_role') === 'admin_deel') {
      setIsAdminDeel(true);
    } else {
      setIsAdminDeel(false);
    }
  }, []);

  useEffect(() => {
    setUsreIdEC(Cookies.get('user_id'));
  }, []);

  useEffect(() => {
    api
      .get(`/api/v1/managements/users/${Cookies.get('user_id')}`)
      .then((res) => {
        const user = res.data.data;
        setUserDetail(user);
        setLanguage(user.language);
        setDivision(user.business_division);
        if (user.client_id) {
          setClientId(user.client_id);
          loadClientSmtp(user.client_id);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function loadClientSmtp(id) {
    api
      .get(`/api/v1/managements/clients/${id}`)
      .then((res) => {
        if (res.data.code === 1 || res.data.code === '1') {
          const data = res.data.data;
          setReplySmtpGmail(data.reply_smtp_gmail || '');
          setReplySmtpGmailAppPassword('');
          setHasReplySmtpPassword(Boolean(data.has_reply_smtp_password));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function validateReplySmtp() {
    const gmail = (replySmtpGmail || '').trim().replace(/＠/g, '@');
    const password = replySmtpGmailAppPassword || '';
    const gmailErr = document.getElementById('errReplySmtpGmail');
    const passwordErr = document.getElementById('errReplySmtpPassword');

    if (gmailErr) {
      gmailErr.innerHTML = '';
    }
    if (passwordErr) {
      passwordErr.innerHTML = '';
    }

    if (!gmail && !password) return true;

    if (gmail && !MAIL_FORMAT.test(gmail)) {
      if (gmailErr) {
        gmailErr.innerHTML = 'メールを入力してください(例:abc＠abc.com)';
      }
      return false;
    }

    if (gmail && !password && !hasReplySmtpPassword) {
      if (passwordErr) {
        passwordErr.innerHTML = 'アプリパスワードを入力してください。';
      }
      return false;
    }

    if (!gmail && password) {
      if (gmailErr) {
        gmailErr.innerHTML = 'メール送信用Gmailを入力してください。';
      }
      return false;
    }

    return true;
  }

  function showNoti(message) {
    setIsOpenNoti(true);
    setMsgNoti(message);
    setTimeout(() => {
      setIsOpenNoti(false);
      setMsgNoti('');
    }, 2000);
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
      const form = document.getElementById('form-basic-setting');
      const obj = {};
      for (let i = 0; i < form.length; i++) {
        obj[form[i].name] = form[i].value;
      }
      const update = { user: obj };
      api
        .patch(`/api/v1/managements/users/${userIdEC}`, update)
        .then((res) => {
          if (res.data.code == 1) {
            return saveClientSmtp().then((smtpResult) => {
              if (smtpResult.ok) {
                showNoti('正常に更新されました！');
              } else {
                showNoti(smtpResult.message || 'メール送信設定の更新に失敗しました');
              }
            });
          } else if (res.data.code == 2) {
            showNoti(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
  }
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>基本設定</CardHeader>
              <CardBody>
                <form id="form-basic-setting">
                  <div className="bs-field-container">
                    <span className="bs-field-lable">
                      氏名 <span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="fullname"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="full_name"
                        defaultValue={userDetail.full_name}
                        onChange={() => utils.checkInput('fullname', 'errFullname', '氏名')}
                      ></input>
                      <span id="errFullname" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">事業区分</span>
                    <div className="bs-field-input">
                      <select
                        className="bs-field-input-select"
                        name="business_division"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                      >
                        <option value="sole_proprietorship">個人事業</option>
                        <option value="corporation">法人</option>
                      </select>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">
                      企業名<span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="companyName"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="company_name"
                        defaultValue={userDetail.company_name}
                        onChange={() => utils.checkInput('companyName', 'errCompanyname', '企業名')}
                      ></input>
                      <span id="errCompanyname" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">部署</span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="department"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="department"
                        defaultValue={userDetail.department}
                        onChange={() =>
                          utils.checkMaxLength('department', 'errDepartment', '部署', 50)
                        }
                      ></input>
                      <span id="errDepartment" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">役職</span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="job_title"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="job_title"
                        defaultValue={userDetail.job_title}
                        onChange={() =>
                          utils.checkMaxLength('job_title', 'errPosition', '役職', 50)
                        }
                      ></input>
                      <span id="errPosition" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">
                      メールアドレス {isAdminDeel && <span style={{ color: 'red' }}>*</span>}
                    </span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="emailAddress"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="email"
                        defaultValue={userDetail.email}
                        onChange={() =>
                          utils.checkEmailRequired(
                            'emailAddress',
                            'errEmailAddress',
                            'メールアドレス'
                          )
                        }
                        readOnly={isAdminDeel ? false : true}
                        style={{ color: isAdminDeel ? 'inherit' : '#aaa' }}
                      ></input>
                      <span id="errEmailAddress" className="bs-err-format"></span>
                      {!isAdminDeel && (
                        <span className="bs-err-format">
                          登録したメールアドレスを編集権限がありません。管理者へ連絡してください！
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">
                      電話番号<span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="phone_number"
                        type="number"
                        placeholder="必ず入力してください ..."
                        name="phone_number"
                        defaultValue={userDetail.phone_number}
                        onChange={() => utils.checkTel('phone_number', 'errPhone', '電話番号')}
                      ></input>
                      <span id="errPhone" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">郵便番号</span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="post_code"
                        type="number"
                        placeholder="必ず入力してください ..."
                        name="post_code"
                        defaultValue={userDetail.post_code}
                      ></input>
                      <span id="errPostCost" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">
                      住所<span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="address"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="address"
                        defaultValue={userDetail.address}
                        onChange={() => utils.checkInput('address', 'errAddress', '住所')}
                      ></input>
                      <span id="errAddress" className="bs-err-format"></span>
                    </div>
                  </div>
                  <div className="bs-field-container">
                    <span className="bs-field-lable">言語</span>
                    <div className="bs-field-input">
                      <select
                        className="bs-field-input-select"
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="japanese">日本</option>
                        <option value="english">英語</option>
                        <option value="vietnamese">ベトナム語</option>
                        <option value="chinese">中国人</option>
                      </select>
                    </div>
                  </div>
                  <div className="bs-field-container">
                    <span className="bs-field-lable">URL</span>
                    <div className="bs-field-input">
                      <input
                        className="bs-field-input-item"
                        id="url"
                        type="text"
                        placeholder="必ず入力してください ..."
                        name="url"
                        defaultValue={userDetail.url}
                        onChange={() => utils.checkUrl('url', 'errUrl', 'URL')}
                      ></input>
                      <span id="errUrl" className="bs-err-format"></span>
                    </div>
                  </div>
                </form>

                {clientId && (
                  <>
                    <div className="bs-field-container">
                      <span className="bs-field-lable">メール送信用Gmail</span>
                      <div className="bs-field-input">
                        <input
                          className="bs-field-input-item"
                          id="replySmtpGmail"
                          type="text"
                          placeholder="example@gmail.com"
                          value={replySmtpGmail}
                          onChange={(e) => setReplySmtpGmail(e.target.value)}
                          autoComplete="off"
                        ></input>
                        <span id="errReplySmtpGmail" className="bs-err-format"></span>
                      </div>
                    </div>
                    <div className="bs-field-container">
                      <span className="bs-field-lable">メール送信用アプリパスワード</span>
                      <div className="bs-field-input">
                        <input
                          className="bs-field-input-item"
                          id="replySmtpGmailAppPassword"
                          type="password"
                          placeholder={
                            hasReplySmtpPassword ? '設定済み（変更する場合のみ入力）' : ''
                          }
                          value={replySmtpGmailAppPassword}
                          onChange={(e) => setReplySmtpGmailAppPassword(e.target.value)}
                          autoComplete="new-password"
                        ></input>
                        <div style={{ fontSize: '12px', color: '#767676', marginTop: '4px' }}>
                          Gmailの2段階認証で発行したアプリパスワードを入力してください
                        </div>
                        <span id="errReplySmtpPassword" className="bs-err-format"></span>
                      </div>
                    </div>
                  </>
                )}

                <div className="bs-field-btn">
                  <button className="btn btn-primary" onClick={() => onSave()}>
                    保存
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default BasicSetting;
