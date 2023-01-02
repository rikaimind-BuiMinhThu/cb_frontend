import React from 'react';
import '../../assets/css/bot/reply-mail.css';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Pagination } from '@material-ui/lab';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/api-management';
import ModalNoti from '../../views/Popup/ModalNoti';

function ReplyMailManagement() {
  // states
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [replyMails, setReplyMails] = useState([]);
  const [clientNames, setClientNames] = useState([]);
  const [currentClientId, setCurrentClientId] = useState('');
  const [isOpenAddPopup, setIsOpenAddPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');

  // side effects
  useEffect(() => {
    api
      .get('/api/v1/managements/client_emails?page=1')
      .then((res) => {
        console.log('client_emails: ', res.data);
        if (res.data?.code === 1) {
          if(res.data.data !==[] && res.data.total !==0){
            setReplyMails(res.data?.data);
          var totalPage = Math.ceil(res.data?.total / 25);
          setTotalPage(totalPage);
          }

        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      setReplyMails([]);
      setTotalPage(1);
    };
  }, []);

  useEffect(() => {
    api
      .get('/api/v1/managements/get_client_with_name')
      .then((res) => {
        console.log('get_client_with_name: ', res.data);
        if (res.data?.code === 1) {
          setClientNames(res.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      setClientNames([]);
    };
  }, []);

  // handle change page
  const handlePageChange = (event, value) => {
    setPage(parseInt(value));
    setPageIndex(value);
    reloadReplyMails(value);
    document.querySelector('.main-panel').scrollTop = 0;
  };

  // handle add mail
  const handleAddMail = (e) => {
    e.preventDefault();

    const form = document.getElementById('rm-add-mail__form');
    var payload = {};
    for (let i = 0; i < form.length; i++) {
      if (form[i].name) {
        payload[form[i].name] = form[i].value;
      }
    }
    console.log(payload);
    if (payload['rm-mail'] && payload['rm-password']) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
      if (!regex.test(payload['rm-mail'])) {
        document.getElementById('rm-add-email-err').style.display = 'block';
        document.getElementById(
          'rm-add-email-err'
        ).innerHTML = `メールフォーマットが正しくありません`;
      } else {
        api
          .post('/api/v1/managements/client_emails', {
            email: { email: payload['rm-mail'], password: payload['rm-password'] },
            client_id: currentClientId,
          })
          .then((res) => {
            if (res.data?.code === 1) {
              setIsOpenNoti(true);
              setMsgNoti(`作成しました。`);
              setTimeout(() => {
                setIsOpenNoti(false);
                setMsgNoti('');
                setIsOpenAddPopup(false);
                reloadReplyMails(pageIndex);
              }, 1500);
            } else {
              console.log(res);
              setIsOpenNoti(true);
              setMsgNoti(res.data.message);
              setTimeout(() => {
                setIsOpenNoti(false);
                setMsgNoti('');
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      if (!payload['rm-mail']) {
        document.getElementById('rm-add-email-err').style.display = 'block';
        document.getElementById('rm-add-email-err').innerHTML = `これは必須項目です。`;
      }
      if (!payload['rm-password']) {
        document.getElementById('rm-add-password-err').style.display = 'block';
        document.getElementById('rm-add-password-err').innerHTML = `これは必須項目です。`;
      }
    }
  };

  // open add popup
  const openAddPopup = () => {
    const form = document.getElementById('rm-add-mail__form');
    for (let i = 0; i < form.length; i++) {
      if (form[i].name) {
        form[i].value = '';
      }
    }
    setIsOpenAddPopup(true);
  };

  // reload reply mails
  const reloadReplyMails = (pageIndex = 1) => {
    api
      .get(`/api/v1/managements/client_emails?page=${pageIndex}`)
      .then((res) => {
        console.log('client_emails: ', res.data);
        if (res.data?.code === 1) {
          var totalPage = Math.ceil(res.data?.total / 25);
          setTotalPage(totalPage);
          setReplyMails(res.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // handle update button click
  const handleUpdateBtnClick = (clientId, id) => {
    const inputMail = document.getElementById(`rm-input-mail-table-${clientId}`);
    const inputPassword = document.getElementById(`rm-input-password-table-${clientId}`);
    console.log(inputMail?.value);
    if (inputMail?.value && inputPassword?.value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
      if (!regex.test(inputMail?.value)) {
        document.getElementById(`rm-input-mail-table-err-${clientId}`).style.display = 'block';
        document.getElementById(
          `rm-input-mail-table-err-${clientId}`
        ).innerHTML = `メールフォーマットが正しくありません`;
      } else {
        api
          .patch(`/api/v1/managements/client_emails/${id}`, {
            email: { email: inputMail?.value, password: inputPassword?.value },
          })
          .then((res) => {
            if (res.data?.code === 1) {
              inputPassword.value = '';
              setIsOpenNoti(true);
              setMsgNoti(`更新しました。`);
              setTimeout(() => {
                setIsOpenNoti(false);
                setMsgNoti('');
                setIsOpenAddPopup(false);
                reloadReplyMails(pageIndex);
              }, 1500);
            } else {
              console.log(res);
              setIsOpenNoti(true);
              setMsgNoti(res.data?.data);
              setTimeout(() => {
                setIsOpenNoti(false);
                setMsgNoti('');
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      if (!inputMail?.value) {
        document.getElementById(`rm-input-mail-table-err-${clientId}`).style.display = 'block';
        document.getElementById(
          `rm-input-mail-table-err-${clientId}`
        ).innerHTML = `これは必須項目です。`;
      }
      if (!inputPassword?.value) {
        document.getElementById(`rm-input-password-table-err-${clientId}`).style.display = 'block';
        document.getElementById(
          `rm-input-password-table-err-${clientId}`
        ).innerHTML = `これは必須項目です。`;
      }
    }
  };

  return (
    <div className="content">
      <Row id="screenAll">
        <Col md="12">
          <Card>
            <CardHeader>
              <div className="rm-add-mail-wrapper">
                <select
                  name="list-client"
                  id="rm-list-client"
                  value={currentClientId}
                  onChange={(e) => setCurrentClientId(e.target.value)}
                >
                  <option value="" hidden disabled>
                    クライアントを選択してください。
                  </option>
                  {clientNames.map((name) => (
                    <option key={name?.id} value={name?.id}>
                      {name?.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn"
                  onClick={openAddPopup}
                  disabled={currentClientId ? false : true}
                  style={{ backgroundColor: currentClientId ? 'green' : '#66615B' }}
                >
                  返事メール追加
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div>
                <Table className="rm-table">
                  <thead>
                    <tr>
                      <th>クライアント名</th>
                      <th>返事メール追加</th>
                      <th>パスワード</th>
                      <th>アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {replyMails.map((mail) => (
                      <tr key={mail?.client_id}>
                        <td>{mail?.full_name}</td>
                        <td>
                          <input
                            id={`rm-input-mail-table-${mail?.client_id}`}
                            className="rm-input-field"
                            type="text"
                            placeholder="メール入力"
                            defaultValue={mail?.email}
                            onChange={() => {
                              document.getElementById(
                                `rm-input-mail-table-err-${mail?.client_id}`
                              ).style.display = 'none';
                            }}
                          />
                          <span
                            id={`rm-input-mail-table-err-${mail?.client_id}`}
                            style={{ display: 'none', color: 'red' }}
                          ></span>
                        </td>
                        <td>
                          <input
                            id={`rm-input-password-table-${mail?.client_id}`}
                            className="rm-input-field"
                            type="text"
                            placeholder="パスワード入力"
                            onChange={() => {
                              document.getElementById(
                                `rm-input-password-table-err-${mail?.client_id}`
                              ).style.display = 'none';
                            }}
                          />
                          <span
                            id={`rm-input-password-table-err-${mail?.client_id}`}
                            style={{ display: 'none', color: 'red' }}
                          ></span>
                        </td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleUpdateBtnClick(mail?.client_id, mail?.id)}
                            style={{ backgroundColor: '#0030ff' }}
                          >
                            更新
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Pagination
                count={totalPage}
                variant="outlined"
                page={page}
                onChange={handlePageChange}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <div className="rm-modal" style={{ display: isOpenAddPopup ? 'block' : 'none' }}></div>
      <div className="rm-add-mail-popup" style={{ display: isOpenAddPopup ? 'block' : 'none' }}>
        <h4 className="rm-add-mail__title">メール追加</h4>
        <form id="rm-add-mail__form">
          <div className="rm-add-mail-item">
            <label htmlFor="rm-mail">メール追加</label>
            <input
              className="rm-input-field"
              type="text"
              name="rm-mail"
              id="rm-mail"
              placeholder="メール入力"
              onChange={() => {
                document.getElementById(`rm-add-email-err`).style.display = 'none';
              }}
            />
          </div>
          <span id="rm-add-email-err" style={{ display: 'none', color: 'red' }}></span>
          <div className="rm-add-mail-item">
            <label htmlFor="rm-password">パスワード</label>
            <input
              className="rm-input-field"
              type={isChecked ? 'text' : 'password'}
              name="rm-password"
              id="rm-password"
              placeholder="パスワード入力"
              onChange={() => {
                document.getElementById(`rm-add-password-err`).style.display = 'none';
              }}
            />
            <input
              type="checkbox"
              name=""
              id="rm-input-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </div>
          <span id="rm-add-password-err" style={{ display: 'none', color: 'red' }}></span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              type="submit"
              className="btn"
              onClick={handleAddMail}
              style={{ backgroundColor: 'green' }}
            >
              追加
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setIsOpenAddPopup(false)}
              style={{ backgroundColor: 'red' }}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{msgNoti}</span>
        </div>
      </ModalNoti>
    </div>
  );
}

export default ReplyMailManagement;
