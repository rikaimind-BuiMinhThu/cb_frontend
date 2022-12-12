import React from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
// import api from './../../../api/api-management';
import './../../assets/css/basic_setting.css';
import * as utils from './../../JS/validate.js';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../api/api-management';
import ModalNoti from './../Popup/ModalNoti';
import { tokenExpired } from 'api/tokenExpired';

function BasicSetting() {
  const [userIdEC, setUsreIdEC] = useState();
  const [userDetail, setUserDetail] = useState({});
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [language, setLanguage] = useState('');
  const [division, setDivision] = useState('');

  useEffect(() => {
    setUsreIdEC(Cookies.get('user_id'));
  }, []);

  useEffect(() => {
    api
      .get(`/api/v1/managements/users/${Cookies.get('user_id')}`)
      .then((res) => {
        setUserDetail(res.data.data);
        setLanguage(res.data.data.language);
        setDivision(res.data.data.business_division);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

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
      utils.checkUrl('url', 'errUrl', 'URL')
    ) {
      const form = document.getElementById('form-basic-setting');
      const obj = {};
      for (let i = 0; i < form.length; i++) {
        obj[form[i].name] = form[i].value;
      }
      const update = { user: obj };
      console.log(update);
      api
        .patch(`/api/v1/managements/users/${userIdEC}`, update)
        .then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            setIsOpenNoti(true);
            setMsgNoti(`正常に更新されました！`);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti('');
            }, 2000);
          } else if (res.data.code == 2) {
            setIsOpenNoti(true);
            setMsgNoti(res.data.data);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti('');
            }, 2000);
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
                        onChange={() =>
                          utils.checkInput('companyName', 'errCompanyname', '企業名')
                        }
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
                    メールアドレス<span style={{ color: 'red' }}>*</span>
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
                      ></input>
                      <span id="errEmailAddress" className="bs-err-format"></span>
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
