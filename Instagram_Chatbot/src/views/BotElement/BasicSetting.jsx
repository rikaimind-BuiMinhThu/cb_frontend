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
    utils.checkInput('fullname', 'errFullname', 'The name');
    utils.checkInput('companyName', 'errCompanyname', 'Company name');
    utils.checkMaxLength('department', 'errDepartment', 'Department', 50);
    utils.checkMaxLength('job_title', 'errPosition', 'Position', 50);
    utils.checkEmailRequired('emailAddress', 'errEmailAddress', 'The Mail address');
    utils.checkTel('phone_number', 'errPhone', 'The Tel');
    utils.checkInput('address', 'errAddress', 'The Address');
    if (
      utils.checkInput('fullname', 'errFullname', 'The name') &&
      utils.checkInput('companyName', 'errCompanyname', 'Company name') &&
      utils.checkMaxLength('department', 'errDepartment', 'Department', 50) &&
      utils.checkMaxLength('job_title', 'errPosition', 'Position', 50) &&
      utils.checkEmailRequired('emailAddress', 'errEmailAddress', 'The Mail address') &&
      utils.checkTel('phone_number', 'errPhone', 'The Tel') &&
      utils.checkInput('address', 'errAddress', 'The Address')
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
            setMsgNoti(`Update successfully!`);
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
              <CardHeader>Basic Setting</CardHeader>
              <CardBody>
                <form id="form-basic-setting">
                  <div className="bs-field-container">
                    <span className="bs-field-lable">Full name</span>
                    <div className="bs-field-input">
                      <input
                        id="fullname"
                        type="text"
                        placeholder="enter input ..."
                        name="full_name"
                        defaultValue={userDetail.full_name}
                        onChange={() => utils.checkInput('fullname', 'errFullname', 'The name')}
                      ></input>
                      <span id="errFullname" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Business category</span>
                    <div className="bs-field-input">
                      <select
                        name="business_division"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                      >
                        <option value="sole_proprietorship">Sole proprietorship</option>
                        <option value="corporation">Corporation</option>
                      </select>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Company name</span>
                    <div className="bs-field-input">
                      <input
                        id="companyName"
                        type="text"
                        placeholder="enter input ..."
                        name="company_name"
                        defaultValue={userDetail.company_name}
                        onChange={() =>
                          utils.checkInput('companyName', 'errCompanyname', 'Company name')
                        }
                      ></input>
                      <span id="errCompanyname" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Department</span>
                    <div className="bs-field-input">
                      <input
                        id="department"
                        type="text"
                        placeholder="enter input ..."
                        name="department"
                        defaultValue={userDetail.department}
                        onChange={() =>
                          utils.checkMaxLength('department', 'errDepartment', 'Department', 50)
                        }
                      ></input>
                      <span id="errDepartment" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Position</span>
                    <div className="bs-field-input">
                      <input
                        id="job_title"
                        type="text"
                        placeholder="enter input ..."
                        name="job_title"
                        defaultValue={userDetail.job_title}
                        onChange={() =>
                          utils.checkMaxLength('job_title', 'errPosition', 'Position', 50)
                        }
                      ></input>
                      <span id="errPosition" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Email address</span>
                    <div className="bs-field-input">
                      <input
                        id="emailAddress"
                        type="text"
                        placeholder="enter input ..."
                        name="email"
                        defaultValue={userDetail.email}
                        onChange={() =>
                          utils.checkEmailRequired(
                            'emailAddress',
                            'errEmailAddress',
                            'The Mail address'
                          )
                        }
                      ></input>
                      <span id="errEmailAddress" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Phone number</span>
                    <div className="bs-field-input">
                      <input
                        id="phone_number"
                        type="number"
                        placeholder="enter input ..."
                        name="phone_number"
                        defaultValue={userDetail.phone_number}
                        onChange={() => utils.checkTel('phone_number', 'errPhone', 'The Tel')}
                      ></input>
                      <span id="errPhone" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Post code</span>
                    <div className="bs-field-input">
                      <input
                        id="post_code"
                        type="number"
                        placeholder="enter input ..."
                        name="post_code"
                        defaultValue={userDetail.post_code}
                      ></input>
                      <span id="errPostCost" className="bs-err-format"></span>
                    </div>
                  </div>

                  <div className="bs-field-container">
                    <span className="bs-field-lable">Address</span>
                    <div className="bs-field-input">
                      <input
                        id="address"
                        type="text"
                        placeholder="enter input ..."
                        name="address"
                        defaultValue={userDetail.address}
                        onChange={() => utils.checkInput('address', 'errAddress', 'The Address')}
                      ></input>
                      <span id="errAddress" className="bs-err-format"></span>
                    </div>
                  </div>
                  <div className="bs-field-container">
                    <span className="bs-field-lable">Language</span>
                    <div className="bs-field-input">
                      <select
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="japanese">Japanese</option>
                        <option value="english">English</option>
                        <option value="vietnamese">Vietnamese</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                  </div>
                </form>

                <div className="bs-field-btn">
                  <button className="btn btn-primary" onClick={() => onSave()}>
                    Keep
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
