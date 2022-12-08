import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import './../../assets/css/bot/bot-list.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import api from '../../api/api-management';
import { Pagination } from '@material-ui/lab';
import ModalShort from '../../views/Popup/ModalShort';
import ModalNoti from '../../views/Popup/ModalNoti';
import { tokenExpired } from 'api/tokenExpired';

function BotManagement() {
  // states
  const [botList, setBotList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const [msgConfirm, setMsgConfirm] = useState('');
  const [isStop, setIsStop] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');
  const [statusSelected, setStatusSelected] = useState('');
  const [search, setSearch] = useState('');
  const [isActiveSearch, setIsActiveSearch] = useState('all');

  // side effects
  useEffect(() => {
    console.log('token in dashboard', Cookies.get('token'));
    console.log('is_auth', Cookies.get('is_auth'));
    if (
      Cookies.get('token') == undefined ||
      Cookies.get('token') == null ||
      Cookies.get('token') == ''
    ) {
      window.location.href = '/';
    }
    if (Cookies.get('is_auth') == 'false') {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    // reloadList(1);
    api
      .get(`/api/v1/managements/chatbots?page=1&status=all`)
      .then((res) => {
        console.log('bot list get data: ', res.data);
        setBotList(res.data?.data);
        setTotalPage(Math.ceil(res.data?.total / 10));
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function reloadList(pgIndex) {
    console.log(pgIndex);
    api
      .get(`/api/v1/managements/chatbots?page=${pgIndex}&name=${search}&status=${isActiveSearch}`)
      .then((res) => {
        console.log('bot list get data: ', res.data);
        setBotList(res.data?.data);
        setTotalPage(Math.ceil(res.data?.total / 10));
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function handleSearch() {
    reloadList(pageIndex);
  }

  // open bot settings
  function openBotSetting(id) {
    Cookies.remove('bot_id');
    Cookies.set('bot_type', 'bot');
    Cookies.set('bot_id', `${id}`);
    window.location.href = '/admin/scenario-list';
  }

  function duplicateBot(id) {
    api
      .post(`/api/v1/managements/chatbots/${id}/duplicate`)
      .then((res) => {
        console.log('duplicate: ', res.data);
        if (res.data.code == 1) {
          setIsOpenNoti(true);
          setMsgNoti('Duplicate bot successfully!');
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti('');
          }, 2000);
          api
            .get(`/api/v1/managements/chatbots?page=1&status=${isActiveSearch}`)
            .then((res) => {
              console.log('bot list get data: ', res.data);
              setBotList(res.data?.data);
              setTotalPage(Math.ceil(res.data?.total / 10));
            })
            .catch((error) => {
              console.log(error);
              if (error.response?.data.code === 0) {
                tokenExpired();
              }
            });
        } else if (res.data.code == 2) {
          setIsOpenNoti(true);
          setMsgNoti(res.data?.message);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti('');
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  // handle change page
  const handleChangePage = (event, value) => {
    if (totalPage > 1) {
      setPage(parseInt(value));
      setPageIndex(value);
      reloadList(value);
      document.querySelector('.main-panel').scrollTop = 0;
    }
  };

  // handle confirm action
  const confirmAction = () => {
    if (isStop) {
      api
        .patch(`/api/v1/managements/chatbots/${idSelected}`, {
          chatbot: { status: statusSelected === 'off' ? 'on' : 'off' },
        })
        .then((res) => {
          console.log(res);
          if (res.data?.code === 1) {
            setIsStop(false);
            setIsOpenPopupConfirm(false);
            setMsgConfirm('');
            setIdSelected('');
            setStatusSelected('');
            setIsOpenNoti(true);
            setMsgNoti('Changed status successfully!');
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti('');
            }, 2000);
            api
              .get(`/api/v1/managements/chatbots?page=${page}&status=${isActiveSearch}`)
              .then((res) => {
                console.log('bot list get data: ', res.data);
                setBotList(res.data?.data);
                setTotalPage(Math.ceil(res.data?.total / 10));
              })
              .catch((error) => {
                console.log(error);
                if (error.response?.data.code === 0) {
                  tokenExpired();
                }
              });
          } else if (res.data?.code === 2) {
            setIsStop(false);
            setIsOpenPopupConfirm(false);
            setMsgConfirm('');
            setIdSelected('');
            setStatusSelected('');
            setIsOpenNoti(true);
            setMsgNoti(res.data?.message);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti('');
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
    if (isDelete) {
      api
        .delete(`/api/v1/managements/chatbots/${idSelected}`)
        .then((res) => {
          console.log(res);
          if (res.data?.code === 1) {
            setIsDelete(false);
            setIsOpenPopupConfirm(false);
            setMsgConfirm('');
            setIdSelected('');
            setIsOpenNoti(true);
            setMsgNoti('Delete successfully');
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti('');
            }, 2000);
            api
              .get(`/api/v1/managements/chatbots?page=1&status=${isActiveSearch}`)
              .then((res) => {
                console.log('bot list get data: ', res.data);
                setBotList(res.data?.data);
                setTotalPage(Math.ceil(res.data?.total / 10));
              })
              .catch((error) => {
                console.log(error);
                if (error.response?.data.code === 0) {
                  tokenExpired();
                }
              });
          } else if (res.data?.code === 2) {
            setIsDelete(false);
            setIsOpenPopupConfirm(false);
            setMsgConfirm('');
            setIdSelected('');
            setIsOpenNoti(true);
            setMsgNoti(res.data?.message);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti('');
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
  };

  // handle stop bot button click
  const handleStopBot = (id, status) => {
    setIsStop(true);
    setIsOpenPopupConfirm(true);
    // alert(status)
    if (status == 'on') {
      setMsgConfirm('Are you sure you want to start this bot?');
    } else if (status == 'off') {
      setMsgConfirm('Are you sure you want to stop this bot?');
    }

    setIdSelected(id);
    setStatusSelected(status);
  };

  // handle delete bot button click
  const handleDeleteBot = (id) => {
    setIsDelete(true);
    setIsOpenPopupConfirm(true);
    setMsgConfirm('Are you sure you want to delete this bot?');
    setIdSelected(id);
  };

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="div-add-bot">
                  <div className="div-add-bot--search">
                    <input
                      type="text"
                      placeholder="search ..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="bm_status-filter">
                      <h4>Bot status:</h4>
                      <select
                        name="bot-status"
                        id="bm_bot-status"
                        onChange={(e) => setIsActiveSearch(e.target.value)}
                        value={isActiveSearch}
                      >
                        <option value="all">All</option>
                        <option value="on">On</option>
                        <option value="off">Off</option>
                      </select>
                    </div>
                    <button className="btn-add-bot btn-bl-search" onClick={() => handleSearch()}>
                      Search
                    </button>
                  </div>
                  <Link to={'/admin/add-bot-management'}>
                    <button className="btn-add-bot">Add bot</button>
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: '10%' }}>ID</th>
                      <th style={{ width: '20%' }}>Bot name</th>
                      <th style={{ width: '15%' }}>Status</th>
                      <th style={{ width: '20%' }}>Owner name</th>
                      <th style={{ width: '15%' }}>My authority</th>
                      <th style={{ width: '300px', minWidth: '300px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {botList != []
                      ? botList.map((bot) => (
                          <tr key={bot?.id}>
                            <td className="border-table-bot">{bot?.id}</td>
                            <td className="border-table-bot">{bot?.bot_name}</td>
                            <td className="border-table-bot">{bot?.status}</td>
                            <td className="border-table-bot">Hoang Cong Nghia</td>
                            <td className="border-table-bot">Owner</td>
                            <td className="border-table-bot action-table-bot">
                              <div className="action-wrapper">
                                <button
                                  className="btn-edit-bot"
                                  onClick={() => openBotSetting(bot.id)}
                                >
                                  編集
                                </button>
                                <button
                                  className="btn-duplicate-bot"
                                  onClick={() => duplicateBot(bot.id)}
                                >
                                  複製
                                </button>
                                <Link to={`/admin/demo-bot/${bot?.id}`}>
                                  <button className="btn-demo-bot">デモ</button>
                                </Link>
                                <button
                                  className="btn-stop-bot"
                                  onClick={() => handleStopBot(bot?.id, bot?.status)}
                                >
                                  {bot?.status === 'off' ? 'スタート' : 'ストップ'}
                                </button>
                                <button
                                  className="btn-delete-bot"
                                  onClick={() => handleDeleteBot(bot?.id)}
                                >
                                  削除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      : ''}
                  </tbody>
                </Table>
                <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChangePage}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalShort open={isOpenPopupConfirm} onClose={() => setIsOpenPopupConfirm(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>{msgConfirm}</h4>
            <Button onClick={() => confirmAction()}>はい</Button>
            <Button onClick={() => setIsOpenPopupConfirm(false)}>いいえ</Button>
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

export default BotManagement;
