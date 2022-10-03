import React from 'react'
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
// import api from './../../../api/api-management';
import './../../assets/css/basic_setting.css'
import * as utils from './../../JS/validate.js'



function BasicSetting() {

  function onSave() {
    const form = document.getElementById('form-basic-setting');
    console.log(form);
    // const obj = {};
    // for (let i = 0; i < form.clientHeight; i++) {
    //   obj[form[i].name] = form[i].value;
    // }
    // console.log(obj);
  }
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                Basic Setting
              </CardHeader>
              <CardBody>
                <form id='form-basic-setting'>
                  <div className='field-container'>
                    <span className='field-lable'>Full name</span>
                    <div className='field-input'>
                      <input id='fullname' type='text' placeholder='enter input ...' name='fullname'
                        onChange={() => utils.checkInput('fullname', 'errFullname', 'Full name')}></input>
                      <span id="errFullname" className='err-format'></span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Business category</span>
                    <div className='field-input'>
                      <select name='business-category'>
                        <option>Sole propristc</option>
                        <option>Corporation</option>
                      </select>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Company name</span>
                    <div className='field-input'>
                      <input id='companyName' type='text' placeholder='enter input ...' name='company-name'
                        onChange={() => utils.checkInput('companyName', 'errCompanyname', 'Company name')}></input>
                      <span id="errCompanyname" className='err-format'></span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Department</span>
                    <div className='field-input'>
                      <input type='text' placeholder='enter input ...' name='department'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Position</span>
                    <div className='field-input'>
                      <input type='text' placeholder='enter input ...' name='position'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Email address</span>
                    <div className='field-input'>
                      <input id='emailAddress' type='text' placeholder='enter input ...' name=''
                        onChange={() => utils.checkEmail('emailAddress', 'errEmailAddress', 'Email address')}></input>
                      <span id="errEmailAddress" className='err-format'></span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>phone number</span>
                    <div className='field-input'>
                      <input type='text' placeholder='enter input ...' name=''></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>post code</span>
                    <div className='field-input'>
                      <input type='text' placeholder='enter input ...' name=''></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>address</span>
                    <div className='field-input'>
                      <input type='text' placeholder='enter input ...' name=''></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>language</span>
                    <div className='field-input'>
                      <select>
                        <option>Japanese</option>
                        <option>English</option>
                        <option>Vietnamese</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                  </div>
                </form>

                <div className='field-btn'>
                  <button className='btn btn-primary' onClick={() => onSave()}>Keep</button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BasicSetting