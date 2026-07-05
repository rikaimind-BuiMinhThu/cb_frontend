import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminActionButton, useAdminHeaderTitle, useAdminHeaderActions } from '../../../../components/AdminShell';
import ModalNoti from '../../../Popup/ModalNoti';
import '../../../../assets/css/bot/email/create-email.css';

function CreateEmail() {
  const [ccNum, setCcNum] = useState(0);
  const [bccNum, setBccNum] = useState(0);

  const [ccAll, setCcAll] = useState([]);
  const [bccAll, setBccAll] = useState([]);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [mailAction, setMailAction] = useState(true);
  const [detailEmail, setDetailEmail] = useState();
  const [listCcDetail, setListCcDetail] = useState([]);
  const [listBccDetail, setListBccDetail] = useState([]);
  const [isAdminDeel, setIsAdminDeel] = useState(false);

  useEffect(() => {
    if (Cookies.get('user_role') === 'admin_deel') {
      setIsAdminDeel(true);
    } else {
      setIsAdminDeel(false);
    }
  }, []);

  useEffect(() => {
    const url = window.location.pathname;
    if (url.includes(`edit-email`)) {
      var id = url.slice(url.lastIndexOf('/') + 1);
      console.log('id', id);
      let ccList = [];
      let bccList = [];
      setMailAction(false);
      api
        .get(`/api/v1/managements/emails/${id}`)
        .then((res) => {
          if (res.data.code == 1) {
            setDetailEmail(res.data.data);
            //CC
            for (var i = 0; i < res.data.data.email_cc.length; i++) {
              ccList.push(res.data?.data?.email_cc[i].to);
            }
            setCcNum(res.data.data.email_cc.length);
            ccList.forEach((index, i) => {
              let cc = document.getElementById('list-cc');
              var newCc = document.createElement('div');
              newCc.setAttribute('id', `cc${i}`);
              newCc.innerHTML = `
              <div style="margin:0px 5px 0px 0px; border-radius:5px; width:max-content; background-color:#e0e0e0; display:flex">
              <span style="width:max-content;">${index}</span>&ensp; 
              <span id="deleteCc${i}">X</span></div>
            `;
              cc.appendChild(newCc);
              document.getElementById(`deleteCc${i}`).addEventListener('click', () => {
                var ele = document.getElementById(`cc${i}`);
                ele?.parentNode?.removeChild(ele);
                var listcc = ccList;
                listcc.splice(i, 1);
                // console.log('listcc detail: ', listcc);
                setCcAll(listcc);
              });
            });
            setListCcDetail(ccList);

            for (var i = 0; i < res.data.data.email_bcc.length; i++) {
              bccList.push(res.data?.data?.email_bcc[i].to);
            }
            setBccNum(res.data.data.email_bcc.length);
            bccList.forEach((index, i) => {
              let bcc = document.getElementById('list-bcc');
              var newBcc = document.createElement('div');
              newBcc.setAttribute('id', `bcc${i}`);
              newBcc.innerHTML = `
            <div style="margin:0px 5px 0px 0px; border-radius:5px; width:max-content; background-color:#e0e0e0; display:flex">
            <span style="width:max-content;">${index}</span>&ensp; 
            <span id="deleteBCc${i}">X</span></div>
            `;
              bcc.appendChild(newBcc);
              document.getElementById(`deleteBCc${i}`).addEventListener('click', () => {
                var ele = document.getElementById(`bcc${i}`);
                ele?.parentNode?.removeChild(ele);
                var listbcc = bccList;
                listbcc.splice(i, 1);
                setBccAll(listbcc);
              });
            });
            setListBccDetail(bccList);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
  }, []);

  function checkListcc(value, listcc) {
    var mailformat = /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
    if (value.match(mailformat)) {
      let i = 0;
      listcc.forEach((cc) => {
        if (cc === value) i = i + 1;
      });
      if (i === 0) {
        listcc.push(value);
        setCcAll(listcc);

        let cc = document.getElementById('list-cc');
        var newCc = document.createElement('div');
        newCc.setAttribute('id', `cc${ccNum}`);
        newCc.innerHTML = `
          <div style="margin:0px 5px 0px 0px; border-radius:5px; width:max-content; background-color:#e0e0e0; display:flex">
          <span style="width:max-content;">${value}</span>&ensp; 
          <span id="deleteCc${ccNum}FI">X</span></div>
          `;
        cc.appendChild(newCc);
        document.getElementById(`deleteCc${ccNum}FI`).addEventListener('click', () => {
          var ele = document.getElementById(`cc${ccNum}`);
          ele?.parentNode?.removeChild(ele);
          listcc.splice(ccNum, 1);
          setCcAll(listcc);
          setListCcDetail(listcc);
        });
        document.getElementById('cc').value = '';
        setCcNum(ccNum + 1);
        document.getElementById('errCcMail').style.display = 'none';
      } else {
        document.getElementById('errCcMail').style.display = 'block';
        document.getElementById('errCcMail').innerText = 'メール複製';
      }
    } else {
      document.getElementById('errCcMail').style.display = 'block';
      document.getElementById('errCcMail').innerText =
        'メールの正しいフォーマットに入力してください。';
    }
  }

  function checkListBcc(value, listbcc) {
    var mailformat = /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
    if (value.match(mailformat)) {
      let i = 0;
      listbcc.forEach((bcc) => {
        if (bcc === value) i = i + 1;
      });
      if (i === 0) {
        listbcc.push(value);
        setBccAll(listbcc);

        let bcc = document.getElementById('list-bcc');
        var newBcc = document.createElement('div');
        newBcc.setAttribute('id', `bcc${bccNum}`);
        newBcc.innerHTML = `
        <div style="margin:0px 5px 0px 0px; border-radius:5px; width:max-content; background-color:#e0e0e0; display:flex">
        <span style="width:max-content;">${value}</span>&ensp; 
        <span id="deleteBCc${bccNum}FI">X</span></div>
        `;
        bcc.appendChild(newBcc);
        document.getElementById(`deleteBCc${bccNum}FI`).addEventListener('click', () => {
          // console.log('clicked delete bcc');
          var ele = document.getElementById(`bcc${bccNum}`);
          ele?.parentNode?.removeChild(ele);
          listbcc.splice(bccNum, 1);
          setBccAll(listbcc);
          setListBccDetail(listbcc);
        });
        document.getElementById('bcc').value = '';
        setBccNum(bccNum + 1);
        document.getElementById('errBccMail').style.display = 'none';
      } else {
        document.getElementById('errBccMail').innerText = 'メール複製';
      }
    } else {
      document.getElementById('errBccMail').style.display = 'block';
      document.getElementById('errBccMail').innerText =
        'メールの正しいフォーマットに入力してください。';
    }
  }

  function addCC(e) {
    if (e.keyCode === 13) {
      var value = e.target.value;
      if (mailAction == false) {
        checkListcc(value, listCcDetail);
      } else {
        checkListcc(value, ccAll);
      }
    }
  }

  function addBCC(e) {
    if (e.keyCode === 13) {
      //check email form
      var value = e.target.value;
      if (mailAction == false) {
        checkListBcc(value, listBccDetail);
      } else {
        checkListBcc(value, bccAll);
      }
    }
  }

  function addEmail(e) {
    e.preventDefault();
    checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name');
    checkTo('to', 'errEmailTo', 'To');
    checkRequired('subject', 'errSubject', 'Subject');
    checkRequired('text', 'errText', 'text');
    if (
      checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name') &&
      checkTo('to', 'errEmailTo', 'To') &&
      checkRequired('subject', 'errSubject', 'Subject') &&
      checkRequired('text', 'errText', 'text')
    ) {
      const form = document.getElementById('create-email-form');
      const obj = {};
      for (let i = 0; i < form.length; i++) {
        obj[form[i].name] = form[i].value;
      }
      obj.cc = ccAll;
      obj.bcc = bccAll;

      var bot_id = Cookies.get('bot_id');
      obj.chatbot_id = bot_id;
      console.log('bot_id: ', bot_id);
      let add = { email: obj };
      console.log(add);
      api
        .post('/api/v1/managements/emails', add)
        .then((res) => {
          if (res.data.code == 1) {
            setIsOpenNoti(true);
            setMsgNoti(`正常に追加されました！!`);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
              window.location.href = `/v2/admin/list-email`;
            }, 1500);
          } else if (res.data.code == 2) {
            console.log(res);
            setIsOpenNoti(true);
            setMsgNoti(res.data.message);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
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

  function saveEmail(e) {
    e.preventDefault();
    const url = window.location.pathname;
    var id = url.slice(url.lastIndexOf('/') + 1);
    checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name');
    checkTo('to', 'errEmailTo', 'To');
    checkRequired('subject', 'errSubject', 'Subject');
    checkRequired('text', 'errText', 'text');
    if (
      checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name') &&
      checkTo('to', 'errEmailTo', 'To') &&
      checkRequired('subject', 'errSubject', 'Subject') &&
      checkRequired('text', 'errText', 'text')
    ) {
      const form = document.getElementById('create-email-form');
      const obj = {};
      for (let i = 0; i < form.length; i++) {
        obj[form[i].name] = form[i].value;
      }
      obj.cc = ccAll;
      obj.bcc = bccAll;

      var bot_id = Cookies.get('bot_id');
      obj.chatbot_id = bot_id;
      // console.log('bot_id: ', bot_id);
      let add = { email: obj };
      console.log(add);

      api
        .patch(`/api/v1/managements/emails/${id}`, add)
        .then((res) => {
          if (res.data.code == 1) {
            setIsOpenNoti(true);
            setMsgNoti(`正常に更新されました！`);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
              window.location.href = `/v2/admin/list-email`;
            }, 1500);
          } else if (res.data.code == 2) {
            setIsOpenNoti(true);
            setMsgNoti(res.data.message);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
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

  const field = document.getElementById.bind(document);

  function checkRequired(emailId, errEmail, lable) {
    if (field(emailId).value === '') {
      field(errEmail).style.display = 'block';
      field(errEmail).innerHTML = `これは必須項目です。`;
      return false;
    } else {
      field(errEmail).style.display = 'none';
      field(errEmail).innerHTML = ``;
      return true;
    }
  }

  function checkEmail(emailId, errEmail, lable) {
    var regex = /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
    let value = field(emailId).value;
    if (emailId == 'to' && value.slice(0, 2) == '{{' && value.slice(-2) == '}}') {
      console.log(value.slice(2, value.length - 2), ': nenen')
      if (value.slice(2, value.length - 2).replace(/\s/g, '') == '') {
        field(errEmail).style.display = 'block';
        field(errEmail).innerHTML = `メールの変数を指定してください`;
        return false;
      }else{
        field(errEmail).style.display = 'none';
        field(errEmail).innerHTML = ``;
        return true;
      }

    } else if (emailId == 'to' && !regex.test(field(emailId).value)) {
      field(errEmail).style.display = 'block';
      field(errEmail).innerHTML = `メールフォーマットが正しくありません`;
      return false;
    } else if (emailId != 'to' && !regex.test(field(emailId).value)) {
      field(errEmail).style.display = 'block';
      field(errEmail).innerHTML = `メールフォーマットが正しくありません`;
      return false;
    } else {
      field(errEmail).style.display = 'none';
      field(errEmail).innerHTML = ``;
      return true;
    }
  }

  function checkTo(emailId, errEmail, lable) {
    console.log(checkEmail(emailId, errEmail, lable));
    checkEmail(emailId, errEmail, lable);
    checkRequired(emailId, errEmail, lable);
    if (checkRequired(emailId, errEmail, lable) && checkEmail(emailId, errEmail, lable))
      return true;
  }

  useAdminHeaderTitle(mailAction === false ? 'メール編集' : 'メール作成');

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="cancel"
        label="戻る"
        onClick={() => { window.location.href = '/v2/admin/list-email'; }}
      />
      {mailAction === false ? (
        <AdminActionButton action="save" onClick={(e) => saveEmail(e)} />
      ) : (
        <AdminActionButton action="create" label="追加" onClick={(e) => addEmail(e)} />
      )}
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="email-form-page">
          <form id="create-email-form">
                  <div className="field-container">
                    <span className="field-lable">
                      テンプレート名 <span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="field-input">
                      <input
                        className="ce_input"
                        id="email_template_name"
                        defaultValue={
                          mailAction == false ? detailEmail?.email.email_template_name : ''
                        }
                        type="text"
                        placeholder="テンプレート名は、必ず指定してください。"
                        name="email_template_name"
                        onChange={() =>
                          checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name')
                        }
                        onBlur={() =>
                          checkRequired('email_template_name', 'errEmailName', 'Emailtemplate name')
                        }
                      ></input>
                      <span id="errEmailName" className="err-email-format"></span>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">差出人</span>
                    <div className="field-input">
                      <input
                        className="ce_input"
                        id="sender_name"
                        type="text"
                        defaultValue={mailAction == false ? detailEmail?.email.sender_name : ''}
                        placeholder="差出人は、必ず指定してください。"
                        name="sender_name"
                      ></input>
                      <span id="errEmailSender" className="err-email-format"></span>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">
                      TO <span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="field-input">
                      <input
                        className="ce_input"
                        id="to"
                        type="text"
                        defaultValue={mailAction == false ? detailEmail?.email.to : ''}
                        placeholder="no-reply@ec-chatbot.com"
                        name="to"
                        onChange={() => checkTo('to', 'errEmailTo', 'To')}
                        onBlur={() => checkTo('to', 'errEmailTo', 'To')}
                      ></input>
                      <span id="errEmailTo" className="err-email-format"></span>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">CC</span>
                    <div className="field-input-cc">
                      <div id="list-cc"></div>
                      <input
                        className="ce_input"
                        id="cc"
                        type="text"
                        placeholder="no-reply@ec-chatbot.com"
                        onKeyUp={(e) => addCC(e)}
                      ></input>
                      {/* <textarea className='textarea-email' placeholder='no-reply@botchan.chat' name='cc'></textarea> */}
                      <span id="errCcMail" className="err-email-format"></span>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">BCC</span>
                    <div className="field-input-cc">
                      <div id="list-bcc"></div>
                      <input
                        className="ce_input"
                        id="bcc"
                        type="text"
                        placeholder="no-reply@botchan.chat"
                        onKeyUp={(e) => addBCC(e)}
                      ></input>
                      {/* <textarea className='textarea-email' placeholder='no-reply@botchan.chat' name='bcc'></textarea> */}
                      <span id="errBccMail" className="err-email-format"></span>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">Reply-To</span>
                    <div className="field-input">
                      <input
                        className="ce_input"
                        type="text"
                        defaultValue={mailAction == false ? detailEmail?.email.reply_to : ''}
                        placeholder="no-reply@ec-chatbot.com"
                        name="reply_to"
                      ></input>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">
                      件名<span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="field-input">
                      <input
                        className="ce_input"
                        id="subject"
                        type="text"
                        defaultValue={mailAction == false ? detailEmail?.email.subject : ''}
                        placeholder="件名は、必ず指定してください。"
                        name="subject"
                        onChange={() => checkRequired('subject', 'errSubject', 'Subject')}
                        onBlur={() => checkRequired('subject', 'errSubject', 'Subject')}
                      ></input>
                      <span id="errSubject" className="err-email-format"></span>
                    </div>
                  </div>

                  <div className="field-container">
                    <span className="field-lable">
                      メール内容<span style={{ color: 'red' }}>*</span>
                    </span>
                    <div className="field-input">
                      <textarea
                        className="ce_textArea"
                        id="text"
                        cols="10"
                        rows="7"
                        defaultValue={mailAction == false ? detailEmail?.email.content : ''}
                        placeholder="メール内容は、必ず指定してください。"
                        name="content"
                        onChange={() => checkRequired('text', 'errText', 'Text')}
                        onBlur={() => checkRequired('text', 'errText', 'Text')}
                      ></textarea>
                      <span id="errText" className="err-email-format"></span>
                    </div>
                  </div>
          </form>
        </div>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </AdminPage>
    </>
  );
}

export default CreateEmail;
