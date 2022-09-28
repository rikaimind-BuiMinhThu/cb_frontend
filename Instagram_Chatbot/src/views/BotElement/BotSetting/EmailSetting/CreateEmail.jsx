import { element } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/email/create-email.css';
import api from './../../../../api/api-management';
import ModalNoti from 'views/Popup/ModalNoti';
import Cookies from 'js-cookie';


function CreateEmail() {
  const [ccNum, setCcNum] = useState(1);
  const [bccNum, setBccNum] = useState(1);

  const [ccAll, setCcAll] = useState([]);
  const [bccAll, setBccAll] = useState([]);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [mailAction, setMailAction] = useState(true)

  useEffect(() => {
    const url = window.location.pathname;
    if(url.includes(`edit-email`)){
      var id = url.substring(url.length-1, url.length)
      console.log(id)
      setMailAction(false)
    }
  }, [])

  function addCC(e) {
    if (e.keyCode === 13) {
      //check email form
      var value = e.target.value;
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
      if (value.match(mailformat)) {
        document.getElementById('errCcMail').style.display = 'none'
        var listcc = []
        listcc = ccAll
        listcc.push(value)
        setCcAll(listcc);

        let cc = document.getElementById('list-cc');
        cc.style.display = "flex"
        var newCc = document.createElement('div')
        newCc.setAttribute('id', `cc${ccNum}`)
        newCc.innerHTML = `
        <div style="margin:0px 5px 0px 0px; border-radius:5px; width:max-content; background-color:#e0e0e0; display:flex">
        <span style="width:max-content;">${value}</span>&ensp; 
        <span id="deleteCc${ccNum}FI">X</span></div>
        `
        cc.appendChild(newCc);
        document.getElementById(`deleteCc${ccNum}FI`).addEventListener('click', () => {
          var ele = document.getElementById(`cc${ccNum}`)
          ele.parentNode.removeChild(ele);
        })
        document.getElementById('cc').value = '';
        setCcNum(ccNum + 1);
      } else {
        document.getElementById('errCcMail').style.display = 'block'
      }
    }
  }

  function addBCC(e) {
    if (e.keyCode === 13) {
      //check email form
      var value = e.target.value;
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
      if (value.match(mailformat)) {
        document.getElementById('errBccMail').style.display = 'none'
        var listbcc = []
        listbcc = bccAll
        listbcc.push(value)
        setBccAll(listbcc)


        let bcc = document.getElementById('list-bcc');
        bcc.style.display = "flex"
        var newBcc = document.createElement('div')
        newBcc.setAttribute('id', `cc${bccNum}`)
        newBcc.innerHTML = `
        <div style="margin:0px 5px 0px 0px; border-radius:5px; width:max-content; background-color:#e0e0e0; display:flex">
        <span style="width:max-content;">${value}</span>&ensp; 
        <span id="deleteCc${bccNum}FI">X</span></div>
        `
        bcc.appendChild(newBcc);
        document.getElementById(`deleteCc${bccNum}FI`).addEventListener('click', () => {
          var ele = document.getElementById(`cc${bccNum}`)
          ele.parentNode.removeChild(ele);
        })
        document.getElementById('bcc').value = '';
        setBccNum(bccNum + 1);
      } else {
        document.getElementById('errBccMail').style.display = 'block'
      }
    }
  }

  function addEmail(e) {
    e.preventDefault();
    checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name');
    checkTo('to', 'errEmailTo', 'To');
    checkRequired('subject', 'errSubject', 'Subject');
    checkRequired('text', 'errText', 'text');
    if (checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name') &&
      checkTo('to', 'errEmailTo', 'To') &&
      checkRequired('subject', 'errSubject', 'Subject') &&
      checkRequired('text', 'errText', 'text')) {
      const form = document.getElementById('create-email-form');
      const obj = {};
      for (let i = 0; i < form.length; i++) {
        obj[form[i].name] = form[i].value;
      }
      obj.cc = ccAll
      obj.bcc = bccAll


      var bot_id = Cookies.get('bot_id')
      obj.chatbot_id = bot_id
      console.log('bot_id: ', bot_id)
      let add = { email: obj }

      api.post('/api/v1/managements/emails', add).then(res => {
        if (res.data.code == 1) {
          setIsOpenNoti(true);
          setMsgNoti(`Add successfully!`)
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``)
          }, 2000)
        } else if (res.data.code == 2) {
          setIsOpenNoti(true);
          setMsgNoti(res.data.message)
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``)
          }, 2000)
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  const field = document.getElementById.bind(document);
  function checkEmail(emailId, errEmail, lable) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    if (!regex.test(field(emailId).value)) {
      field(errEmail).style.display = 'block';
      field(errEmail).innerHTML = `${lable} incorrect.`
      return false;
    } else {
      field(errEmail).style.display = 'none';
      field(errEmail).innerHTML = ``
      return true;
    }
  }

  function checkRequired(emailId, errEmail, lable) {
    if (field(emailId).value === '') {
      field(errEmail).style.display = 'block';
      field(errEmail).innerHTML = `${lable} required.`
      return false;
    }
    else {
      field(errEmail).style.display = 'none';
      field(errEmail).innerHTML = ``
      return true;
    }
  }

  function checkTo(emailId, errEmail, lable) {
    checkEmail(emailId, errEmail, lable);
    checkRequired(emailId, errEmail, lable);
    if (checkRequired(emailId, errEmail, lable) && checkEmail(emailId, errEmail, lable))
      return true;
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ margin: '10px 0' }}>Create Email</h4>
              </CardHeader>
              <CardBody>
                <form id='create-email-form'>
                  <div className='field-container'>
                    <span className='field-lable'>Emailtemplate name</span>
                    <div className='field-input'>
                      <input id='email_template_name' defaultValue={mailAction==false? "value of edit email":""} type='text' placeholder='Enter email template name' name='email_template_name'
                        onChange={() => checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name')}
                        onBlur={() => checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name')}></input>
                      <span id="errEmailName" className='err-email-format'></span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Sender name</span>
                    <div className='field-input'>
                      <input id='sender_name' type='text' placeholder='Please enter the sender name' name='sender_name'></input>
                      <span id="errEmailSender" className='err-email-format'></span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>To</span>
                    <div className='field-input'>
                      <input id='to' type='text' placeholder='no-reply@botchan.chat' name='to' onChange={() => checkTo('to', 'errEmailTo', 'To')}
                        onBlur={() => checkTo('to', 'errEmailTo', 'To')}></input>
                      <span id="errEmailTo" className='err-email-format'></span>
                    </div>
                  </div>


                  <div className='field-container'>
                    <span className='field-lable'>CC</span>
                    <div className='field-input'>
                      <div id='list-cc'></div>
                      <input id='cc' type='text' placeholder='no-reply@botchan.chat' onKeyUp={(e) => addCC(e)} ></input>
                      {/* <textarea className='textarea-email' placeholder='no-reply@botchan.chat' name='cc'></textarea> */}
                      <span id="errCcMail" className='err-email-format'>Please input right format of email</span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>BCC</span>
                    <div className='field-input'>
                      <div id='list-bcc'></div>
                      <input id='bcc' type='text' placeholder='no-reply@botchan.chat' onKeyUp={(e) => addBCC(e)} ></input>
                      {/* <textarea className='textarea-email' placeholder='no-reply@botchan.chat' name='bcc'></textarea> */}
                      <span id="errBccMail" className='err-email-format'>PLease input right format of email</span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Reply-To</span>
                    <div className='field-input'>
                      <input type='text' placeholder='no-reply@botchan.chat' name='reply_to'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Subject</span>
                    <div className='field-input'>
                      <input id='subject' type='text' placeholder='Please enter a subject' name='subject' onChange={() => checkRequired('subject', 'errSubject', 'Subject')}
                        onBlur={() => checkRequired('subject', 'errSubject', 'Subject')}></input>
                      <span id="errSubject" className='err-email-format'></span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Text</span>
                    <div className='field-input'>
                      <textarea id='text' cols='10' rows='7' placeholder='Please enter the text' name='content' onChange={() => checkRequired('text', 'errText', 'text')}
                        onBlur={() => checkRequired('text', 'errText', 'text')}></textarea>
                      <span id="errText" className='err-email-format'></span>
                    </div>
                  </div>
                </form>

                <div className='field-btn'>
                  <button className='btn' onClick={() => { window.location.href = '/admin/list-email' }}>Return</button>
                  <button className='btn btn-primary' onClick={(e) => addEmail(e)}>Save</button>
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
  )
}

export default CreateEmail