import { element } from 'prop-types';
import React from 'react'
import { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/email/create-email.css'


function CreateEmail() {
  const [listCC, setListCC] = useState([]);
  const [ccNum, setCcNum] = useState(1)

  const [ccAll, setCcAll] = useState("")

  function addEmail() {
    const form = document.getElementById('create-email-form');
    const res = {};
    for (let i = 0; i < form.length; i++) {
      res[form[i].name] = form[i].value;
    }
    console.log(res);
    console.log('ccAll: ', ccAll);
  }

  function addCC(e) {
    if (e.keyCode === 13) {
      //check email form
      var value = e.target.value;
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
      if (value.match(mailformat)) {
        document.getElementById('errMailFormat').style.display = 'none'
        if (ccNum == 1) {
          setCcAll(`${value}`)
        } else {
          setCcAll(`${ccAll}, ${value}`)
        }

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
        document.getElementById('errMailFormat').style.display = 'block'
      }



    }
  }

  return (
    // <div>CreateEmail</div>
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
                    <span className='field-lable'>emailtemplate name</span>
                    <div className='field-input'>
                      <input type='text' placeholder='Enter email template name' name='email_template_name'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>sender name</span>
                    <div className='field-input'>
                      <input type='text' placeholder='Please enter the sender name' name='sender_name'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>to</span>
                    <div className='field-input'>
                      <input type='text' placeholder='no-reply@botchan.chat' name='to'></input>
                    </div>
                  </div>


                  <div className='field-container'>
                    <span className='field-lable'>CC</span>
                    <div className='field-input'>
                      <div id='list-cc'></div>
                      <input id='cc' type='text' placeholder='no-reply@botchan.chat' name='cc' onKeyUp={(e) => addCC(e)} ></input>
                      {/* <textarea className='textarea-email' placeholder='no-reply@botchan.chat' name='cc'></textarea> */}
                      <span id="errMailFormat" className='err-email-format'>PLease input right format of email</span>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>BCC</span>
                    <div className='field-input'>
                      <textarea className='textarea-email' placeholder='no-reply@botchan.chat' name='bcc'></textarea>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Reply-To</span>
                    <div className='field-input'>
                      <input type='text' placeholder='no-reply@botchan.chat' name='reply_to'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>subject</span>
                    <div className='field-input'>
                      <input type='text' placeholder='Please enter a subject' name='subject'></input>
                    </div>
                  </div>

                  <div className='field-container'>
                    <span className='field-lable'>Text</span>
                    <div className='field-input'>
                      <textarea cols='10' rows='7' placeholder='Please enter the text' name='text'></textarea>
                    </div>
                  </div>
                </form>

                <div className='field-btn'>
                  <button className='btn' onClick={() => { window.location.href = '/admin/list-email' }}>Return</button>
                  <button className='btn btn-primary' onClick={() => addEmail()}>Save</button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default CreateEmail