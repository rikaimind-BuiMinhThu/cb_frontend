import React from 'react';
import { useEffect } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/email/list-email.css';
import api from './../../../../api/api-management';
import { useState } from 'react';
import ModalShort from 'views/Popup/ModalShort';
import { Button } from 'react-bootstrap';
import ModalNoti from 'views/Popup/ModalNoti';
import Cookies from 'js-cookie';
import { Pagination } from '@material-ui/lab';
import { tokenExpired } from 'api/tokenExpired';

function ListEmail() {
  const [emailList, setEmailList] = useState([]);
  const [clientEmail, setClientEmail] = useState(null);
  const [isOpenDuplicate, setIsOpenDuplicate] = useState(false);
  const [idEmail, setIdEmail] = useState();
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  var [pageIndex, setPageIndex] = useState(1);
  var [totalPage, setTotalPage] = useState();
  var [page, setPage] = useState(1);

  useEffect(() => {
    var bot_id = Cookies.get('bot_id');
    if (bot_id) {
      api
        .get(`/api/v1/managements/emails?page=1&chatbot_id=${bot_id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data?.code === 1) {
            setEmailList(res.data?.data);
            var totalPage = Math.ceil(res.data.total / 25);
            setTotalPage(totalPage);
            setClientEmail(res?.data?.client_email);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }

    return () => {
      setEmailList([]);
      setTotalPage(1);
      setClientEmail([]);
    };
  }, []);

  function reLoad(pgIndex) {
    var bot_id = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/emails?page=${pgIndex}&chatbot_id=${bot_id}`)
      .then((res) => {
        var totalPage = Math.ceil(res.data?.total / 25);
        if (pgIndex > totalPage) {
          api
            .get(`/api/v1/managements/emails?page=${totalPage}&chatbot_id=${bot_id}`)
            .then((res) => {
              setEmailList(res.data.data);
            })
            .catch((err) => {
              console.log(err);
              if (err.response?.data.code === 0) {
                tokenExpired();
              }
            });
        } else {
          setEmailList(res.data.data);
        }
        setTotalPage(totalPage);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function openDuplicate(id) {
    setIsOpenDuplicate(true);
    setIdEmail(id);
  }

  function duplicateEmail() {
    api
      .post(`/api/v1/managements/emails/${idEmail}/duplicate`)
      .then((res) => {
        if (res.data.code == 1) {
          setIsOpenDuplicate(false);
          setIsOpenNoti(true);
          setMsgNoti(`正常に複製されました！`);
          reLoad(pageIndex);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        } else if (res.data.code == 2) {
          setIsOpenDuplicate(false);
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

  function openDelete(id) {
    setIsOpenDelete(true);
    setIdEmail(id);
  }

  function deleteEmail() {
    api
      .delete(`/api/v1/managements/emails/${idEmail}`)
      .then((res) => {
        if (res.data.code == 1) {
          setIsOpenDelete(false);
          setIsOpenNoti(true);
          setMsgNoti(`正常に削除されました！`);
          reLoad(pageIndex);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        } else if (res.data.code == 2) {
          setIsOpenDelete(false);
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
  function handleChange(event, value) {
    console.log(value);
    if (totalPage > 1) {
      setPage(parseInt(value));
      setPageIndex(value);
      reLoad(value);
      document.querySelector('.main-panel').scrollTop = 0;
    }
  }

  return (
    // <div>ListEmail</div>
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ margin: '10px 0' }}>メール一覧</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => (window.location.href = '/admin/create-email')}
                >
                  新メール追加
                </button>
              </CardHeader>
              <CardBody>
                <div className="mail__list">
                  {emailList?.map((item, i) => (
                    <div className="mail__list-item" key={i}>
                      <p>テスト</p>
                      <div className="mail-block">
                        <table className="mail-table">
                          <tbody>
                            <tr>
                              <th>差出人</th>
                              <td>
                                {item?.sender_name} {clientEmail != null ? `(${clientEmail})` : ''}
                              </td>
                            </tr>
                            <tr>
                              <th>宛先</th>
                              <td>{item?.to}</td>
                            </tr>
                            <tr>
                              <th>CC</th>
                              <td>
                                {item?.cc?.map((cc, ic) => (
                                  <span key={ic} style={{ fontWeight: '400' }}>
                                    {cc?.to} <br />
                                  </span>
                                ))}
                              </td>
                              {/* <td>aaa@gmail.com <br />aaab@gmail.com</td> */}
                            </tr>
                            <tr>
                              <th>BCC</th>
                              <td>
                                {item?.bcc?.map((bcc, ib) => (
                                  <span key={ib} style={{ fontWeight: '400' }}>
                                    {bcc?.to} <br />
                                  </span>
                                ))}
                              </td>
                            </tr>
                            <tr>
                              <th>Reply-To</th>
                              <td>{item?.reply_to}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="mail-detail">
                          <div className="email-detail--subject" type="text">
                            <span>件名 </span>
                            {item?.email_template_name}
                            <br />
                            <span>テンプレート名 </span>
                            {item?.subject}
                          </div>

                          <div className="mail-detail--text">
                            <span>メール内容 </span>
                            <p>{item?.content}</p>
                          </div>
                        </div>

                        <div className="mail-actions">
                          <button
                            className="mail-actions--btn btn btn-default"
                            onClick={() => {
                              window.location.href = `/admin/edit-email/${item?.id}`;
                            }}
                          >
                            編集
                          </button>
                          <button
                            className="mail-actions--btn btn btn-success"
                            onClick={() => openDuplicate(item.id)}
                          >
                            複製
                          </button>
                          <button
                            className="mail-actions--btn btn btn-danger"
                            onClick={() => openDelete(item.id)}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChange}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ModalShort open={isOpenDuplicate} onClose={() => setIsOpenDuplicate(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>本当に複製しますか。</h4>
            <Button onClick={() => duplicateEmail()}>はい</Button>
            <Button onClick={() => setIsOpenDuplicate(false)}>いいえ</Button>
          </div>
        </ModalShort>

        <ModalShort open={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>本当に削除しますか。</h4>
            <Button onClick={() => deleteEmail()}>はい</Button>
            <Button onClick={() => setIsOpenDelete(false)}>いいえ</Button>
          </div>
        </ModalShort>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default ListEmail;
