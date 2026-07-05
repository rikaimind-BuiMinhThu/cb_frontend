import React, { useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import requestNewToken from 'api/request-new-token';
import ModalNoti from './Popup/ModalNoti';
import Modal from './Popup/Modal';
import './Popup/modal.css';
import * as utils from './../JS/user.js';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';
import ModalDetail from './Popup/ModalDetail';
import ava from './Popup/ava.png';
import ModalShort from './Popup/ModalShort';
// import { Pagination } from "element-react";
import $ from 'jquery';
import { tokenExpired } from 'v2/api/tokenExpired';
import { MDBIcon } from 'mdbreact';

function UserManagement() {
  var [dataList, setDataList] = useState([]);
  var [detailData, setDetailData] = useState({});
  var [msgNoti, setMsgNoti] = useState();
  var [detailUpdateTitle, setDetailUpdateTitle] = useState();
  var [disableInput, setDisableInput] = useState();
  var [inputValueFullName, setInputValueFullName] = useState();
  var [clientIdUpdate, setClientIdUpdate] = useState();
  //Update
  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [role, setRole] = useState('');
  // var [EnglishName, setEnglishName] = useState()§§§§§§§§§§§§§§§
  // var [cfPassword, setCfPassword] = useState()
  var [pageIndex, setPageIndex] = useState(1);
  var [totalPage, setTotalPage] = useState();
  const [password, setPassword] = useState('');
  const [clientName, setClientName] = useState('');
  // var pageIndex = 2

  var [updateId, setUpdateId] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenDetailUser, setIsOpenDetailUser] = useState(false);
  const [listClient, setListClient] = useState([]);

  const [namesearch, setNamesearch] = useState('');

  React.useEffect(() => {
    var cook = Cookies.get('user_role');
    if (cook == 'admin_client') {
      window.location.href = '/v2/admin/dashboard';
    } else if (cook == 'admin_deel') {
    } else if (cook == 'client') {
      window.location.href = '/v2/admin/dashboard';
    }
  });

  // React.useEffect(() => {
  //   console.log('token in dashboard', Cookies.get('token'))
  //   console.log('is_auth', Cookies.get('is_auth'))
  //   if (Cookies.get('token') == undefined) {
  //     window.location.href = '/'
  //   }
  // }, [])
  React.useEffect(() => {
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

  React.useEffect(() => {
    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/clients`)
      .then((res) => {
        // console.log(res.data.data)
        setListClient(res.data.data);

        document.getElementById('searchUser').addEventListener('keypress', (e) => {
          // e.preventDefault()
          if (e.key === 'Enter') {
            // Cancel the default action, if needed
            e.preventDefault();
            // Trigger the button element with a click
            search();
          }
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  // const clients_id = listClient.clients

  React.useEffect(() => {
    Cookies.get('token');
    // console.log(Cookies.get('token'));
  });
  React.useEffect(() => {
    var paramSearch = { page: pageIndex };
    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/users`, paramSearch)
      .then((res) => {
        // console.log(res.data)
        if (res.data.total !== 0) {
          var totalPage = Math.ceil(res.data.total / 25);
          setTotalPage(totalPage);
          setDataList(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function search() {
    var path = window.location.pathname;
    // setPageIndex(pgIndex)
    var seachVal = document.getElementById('searchUser').value;
    api
      .get(`/api/v1/managements/users?name=${seachVal}&page=${pageIndex}&client_id=`)
      .then((res) => {
        var totalPage = Math.ceil(res.data.total / 25);
        if (pageIndex > totalPage) {
          api
            .get(`/api/v1/managements/users?name=${seachVal}&page=${totalPage}&client_id=`)
            .then((resp) => {
              setDataList(resp.data);
            });
        } else {
          setDataList(res.data);
        }
        setPage(1);
        setTotalPage(totalPage);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function reloadListClient(pgIndex) {
    var path = window.location.pathname;
    // setPageIndex(pgIndex)
    api
      .get(`/api/v1/managements/users?name=${namesearch}&page=${pgIndex}&client_id=`)
      .then((res) => {
        var totalPage = Math.ceil(res.data.total / 25);
        if (pgIndex > totalPage) {
          api
            .get(`/api/v1/managements/users?name=${namesearch}&page=${totalPage}&client_id=`)
            .then((resp) => {
              setDataList(resp.data);
            });
        } else {
          setDataList(res.data);
        }
        setTotalPage(totalPage);
        // setPage(1)
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }
  $('#screenAll').keydown(function (event) {
    if (event.keyCode == 9) {
      //tab pressed
      event.preventDefault(); // stops its action
    }
  });

  function getUserDetail(item) {
    setDetailUpdateTitle('ユーザー詳細');
    setDetailData(item);
    setIsOpen(true);
    setDisableInput(true);
  }

  function updateClientUser(item) {
    // console.log(item);
    setDisableInput(false);
    setDetailUpdateTitle('ユーザー編集');
    setDetailData(item);
    // setInputValueFullName(item.full_name)
    setName(item.full_name);
    setUpdateId(item.id);
    setClientIdUpdate(item.client_id);
    // setEnglishName(item.english_name)
    setEmail(item.email);
    setRole(item.role);
    // setPassword(item.password)
    setClientName(item.client_name);
    setIsOpen(true);
  }
  const [idDeleteUser, setIdDeleteUser] = useState();
  const [isOpenDeleteUser, setIsOpenDeleteUser] = useState(false);
  function confirmDeleteUser(id) {
    setIsOpenDeleteUser(true);
    setIdDeleteUser(id);
  }

  function deleteClientUser() {
    var path = window.location.pathname;
    setIsOpenDeleteUser(false);
    api
      .delete(`/api/v1/managements/users/${idDeleteUser}`)
      .then((res) => {
        reloadListClient(pageIndex);
        setMsgNoti('削除しました!');
        setIsOpenNoti(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updateClient() {
    var path = window.location.pathname;
    var nameUpdate = document.getElementById('nameUpdate').value;
    const emailUpdate = document.getElementById('updateEmail').value;
    const passwordUpdate = document.getElementById('updatePassword').value;
    const client_id_update = document.getElementById('client_id_update').value;
    const confirmPasswordUpdate = document.getElementById('updateConfirmPassword').value;

    let passCheck = false;
    let passCheckLen = false;
    let emailCheck = false;
    let nameCheck = false;

    if (nameUpdate.length === 0 || nameUpdate.length > 35) {
      nameCheck = false;
    } else {
      nameCheck = true;
      document.getElementById('名称ErrMsg').style.display = 'none';
      document.getElementById('名称ErrMsg').innerHTML = '';
    }

    let mailFormat = /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
    if (emailUpdate.length > 35) {
      emailCheck = false;
    } else if (emailUpdate.match(mailFormat)) {
      document.getElementById('newUserメールアドレスErrMsg').style.display = 'none';
      document.getElementById('newUserメールアドレスErrMsg').innerHTML = '';
      emailCheck = true;
    } else {
      emailCheck = false;
    }

    if ((passwordUpdate.length > 0 && passwordUpdate.length < 6) || passwordUpdate.length > 24) {
      passCheckLen = false;
    } else {
      document.getElementById('パスワードErrMsg').style.display = 'none';
      document.getElementById('パスワードErrMsg').innerHTML = '';
      passCheckLen = true;
    }

    if (passwordUpdate !== confirmPasswordUpdate) {
      passCheck = false;
    } else {
      document.getElementById('パスワード(確認用)ErrMsg').style.display = 'none';
      document.getElementById('パスワード(確認用)ErrMsg').innerHTML = '';
      passCheck = true;
    }

    if (
      utils.checkUserNameInputUpdate(name, '名称') === true &&
      utils.checkInputEmail(email, 'メールアドレス') === true &&
      // && checkFieldUpdate(passwordUpdate, "パスワード") === true
      // && checkFieldUpdate(confirmPasswordUpdate, "パスワード(確認用)") === true
      passCheck === true &&
      passCheckLen === true &&
      emailCheck === true &&
      nameCheck === true
    ) {
      var elements = document.getElementById('detailUserClient').elements;
      var obj = {};
      for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      obj.client_id = client_id_update;
      if (passwordUpdate === '' && confirmPasswordUpdate === '') {
        delete obj.password;
        delete obj.password_confirmation;
      }
      var updateClient = { user: obj };
      // console.log(updateClient);
      api
        .patch(`/api/v1/managements/users/${updateId}`, updateClient)
        .then((res) => {
          reloadListClient(pageIndex);
          setMsgNoti('ユーザーを更新しました!');
          setIsOpen(false);
          setIsOpenNoti(true);
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      if (passCheck === false) {
        document.getElementById('パスワード(確認用)ErrMsg').style.display = 'block';
        document.getElementById('パスワード(確認用)ErrMsg').innerHTML =
          'パスワードが一致しません。もう一度ご入力ください。';
      }
      if (passCheckLen === false) {
        document.getElementById('パスワードErrMsg').style.display = 'block';
        document.getElementById('パスワードErrMsg').innerHTML =
          '24文字以下入力してください。6文字以上入力してください。';
      }
      if (emailCheck === false) {
        // document.getElementById("newUserメールアドレスErrMsg").style.display = "block"
        // document.getElementById("newUserメールアドレスErrMsg").innerHTML = "メールを入力してください(例:abc＠abc.com)"
        utils.checkInputEmail(email, 'メールアドレス');
      }
      if (nameCheck === false) {
        // document.getElementById("名称ErrMsg").style.display = "block"
        // document.getElementById("名称ErrMsg").innerHTML = "名称を入力してください。"
        utils.checkUserNameInputUpdate(name, '名称');
      }
    }
  }

  function checkFieldUpdate(value, field) {
    if (value === '') {
      document.getElementById(`${field}ErrMsg`).style.display = 'block';
      document.getElementById(`${field}ErrMsg`).innerHTML = `${field} 入力してください。`;
    } else {
      document.getElementById(`${field}ErrMsg`).style.display = 'none';
      document.getElementById(`${field}ErrMsg`).innerHTML = '';
      return true;
    }
  }

  function addClient() {
    var path = window.location.pathname;
    var email = document.getElementById('newEmail').value;
    var name = document.getElementById('newName').value;
    var confirmPassword = document.getElementById('newConfirmPassword').value;
    var password = document.getElementById('newPassword').value;
    var passCheck;
    var passCheckLen;

    var emailCheck;
    var nameCheck;
    if (name.length === 0 || name.length > 35) {
      nameCheck = false;
    } else {
      nameCheck = true;
      document.getElementById('newUser名称ErrMsg').style.display = 'none';
      document.getElementById('newUser名称ErrMsg').innerHTML = '';
    }

    var mailformat = /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
    if (email.length > 35) {
      emailCheck = false;
    } else if (email.match(mailformat)) {
      document.getElementById('newUserメールアドレスErrMsg').style.display = 'none';
      document.getElementById('newUserメールアドレスErrMsg').innerHTML = '';
      emailCheck = true;
    } else {
      //newClientEmailErrMsg
      emailCheck = false;
    }

    if (password.length < 6 || password.length > 24) {
      passCheckLen = false;
    } else {
      //newUserPasswordErrMsg
      document.getElementById('newUserパスワードErrMsg').style.display = 'none';
      document.getElementById('newUserパスワードErrMsg').innerHTML = '';
      passCheckLen = true;
    }
    if (password !== confirmPassword) {
      passCheck = false;
    } else {
      document.getElementById('newUserパスワード(確認用)ErrMsg').style.display = 'none';
      document.getElementById('newUserパスワード(確認用)ErrMsg').innerHTML = '';
      passCheck = true;
    }
    if (
      utils.checkInputEmail(email, 'メールアドレス') === true &&
      utils.checkPasswordInputAdd(password, 'パスワード') === true &&
      utils.checkUserNameInputAdd(name, '名称') === true &&
      utils.checkFieldAdd(confirmPassword, 'パスワード(確認用)') === true &&
      passCheck == true &&
      passCheckLen == true &&
      emailCheck == true &&
      nameCheck == true
    ) {
      var elements = document.getElementById('addForm').elements;
      var obj = {};
      for (var i = 0; i < elements.length - 1; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      // var client_id = 80
      // obj.client_id = 80
      // obj.push(client_id)
      delete obj.confirm_password;
      var newUser = { user: obj };
      // console.log(newUser);
      api
        .post(`/api/v1/users/registrations`, newUser)
        .then((res) => {
          if (res.data?.code === 1 || res.data?.code === '1') {
            reloadListClient(pageIndex);
            setMsgNoti('ユーザーを追加しました!');
            setIsOpenAddUser(false);
            setIsOpenNoti(true);
          } else if (res.data?.code === 2 || res.data?.code === '2') {
            if (res.data?.message.includes('Email has already been taken')) {
              setMsgNoti('メールアドレスはは既に存在しています。');
            } else {
              setMsgNoti(res.data?.message);
            }
            setIsOpenAddUser(false);
            setIsOpenNoti(true);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      if (passCheck == false) {
        document.getElementById('newUserパスワード(確認用)ErrMsg').style.display = 'block';
        document.getElementById('newUserパスワード(確認用)ErrMsg').innerHTML =
          'パスワードが一致しません。もう一度ご入力ください。';
      }
      if (passCheckLen == false) {
        document.getElementById('newUserパスワードErrMsg').style.display = 'block';
        document.getElementById('newUserパスワードErrMsg').innerHTML =
          '24文字以下入力してください。6文字以上入力してください。';
      }
      if (emailCheck == false) {
        // document.getElementById("newUserメールアドレスErrMsg").style.display = "block"
        // document.getElementById("newUserメールアドレスErrMsg").innerHTML = "メールを入力してください(例:abc＠abc.com)"
        utils.checkInputEmail(email, 'メールアドレス');
      }
      if (nameCheck == false) {
        // document.getElementById("newUser名称ErrMsg").style.display = "block"
        // document.getElementById("newUser名称ErrMsg").innerHTML = "名称を入力してください。"
        utils.checkUserNameInputAdd(name, '名称');
      }
    }
  }

  const items = dataList.users;

  // let PageSize = 10;
  // const [currentPage, setCurrentPage] = useState(1);
  // const firstPageIndex = (currentPage - 1) * PageSize;
  // const lastPageIndex = firstPageIndex + PageSize;

  // let [active, setActive] = useState(1);
  // function setPage(num){
  //   setActive(num)
  // }
  // let pageNum = [];
  // for (let number = 1; number <= 5; number++) {
  //   pageNum.push(
  //     <Pagination.Item onClick={setPage(number)} key={number} active={number === active}>
  //       {number}
  //     </Pagination.Item>,
  //   );
  // }

  var [page, setPage] = useState(1);
  // function handleChangePage(ef) {
  //   setPage(parseInt(ef))
  //   console.log(ef)
  //   setPageIndex(ef)
  //   reloadListClient(ef)
  // }

  function handleChange(event, value) {
    if (totalPage > 1) {
      // console.log('pageIndex: ', value);
      setPage(parseInt(value));
      setPageIndex(value);
      reloadListClient(value);
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('.main-panel').scrollTop = 0;
    }
  }

  function detailUser(id) {
    // console.log('userId: ', id);
    setIsOpenDetailUser(true);
  }

  // handle on change input value
  const onChangeInputWarning = (value) => {
    document.getElementById(`${value}ErrMsg`).style.display = 'none';
    document.getElementById(`${value}ErrMsg`).innerHTML = '';
  };

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="swap" style={{ display: 'flex' }}>
                  {/* <div className="div_left"><CardTitle tag="h4">Client Management</CardTitle></div> */}
                  <div style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="searchUser"
                      name="searchUser"
                      style={{
                        height: '38px',
                        width: '200px',
                        border: '1px solid #dee2e6',
                        paddingTop: '-10px',
                        borderRadius: '3px',
                      }}
                    ></input>
                    <Button onClick={() => search()} style={{ backgroundColor: '#66615b' }}>
                      検索
                    </Button>
                  </div>
                  <div className="div_right">
                    <Button
                      onClick={() => setIsOpenAddUser(true)}
                      style={{ backgroundColor: '#66615b' }}
                    >
                      ユーザー追加
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: 'center' }}>
                  <thead className="text-primary">
                    <tr>
                      <th>ID</th>
                      <th>名称</th>
                      <th>ログインID</th>
                      <th>権限</th>
                      <th>クライアント</th>
                      <th className="actionListUser">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items?.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.full_name}</td>
                          {/* onClick={() => detailUser(item.id)} */}
                          <td>{item.email}</td>
                          <td>{item.role === 'admin_client' ? 'クライアント' : 'ユーザー'}</td>
                          <td>{item.client_name}</td>
                          <td className="actionListUser">
                            <div style={{ display: 'flex' }}>
                              {/* <Button onClick={() => getUserDetail(item)}>View Detail</Button> */}
                              <div style={{marginRight: '30px', marginTop: '5px'}}>
                                  <MDBIcon
                                   onClick={(e) => updateClientUser(item)}
                                   style={{
                                      fontSize: '1.5em',
                                    }}
                                      far
                                      icon="edit"
                                    />
                                </div>

                                <div style={{marginTop: '5px'}}>
                                  <MDBIcon
                                   onClick={(e) => confirmDeleteUser(item.id)}
                                   style={{
                                      fontSize: '1.5em',
                                    }}
                                      far
                                      icon="trash-alt"
                                    />
                                </div>

                              {/* <div onClick={() => updateClientUser(item)}>
                                <i
                                  className="nc-icon nc-align-center nc-3x"
                                  style={{
                                    fontSize: '30px',
                                    marginTop: '5px',
                                    marginRight: '30px',
                                  }}
                                ></i>
                              </div> */}
                              {/* <Button className="editBtn" onClick={() => updateClientUser(item)}>
                                編集
                              </Button> */}
                              {/* <div onClick={() => confirmDeleteUser(item.id)}>
                                <i
                                  className="nc-icon nc-box nc-3x"
                                  style={{ fontSize: '30px', marginTop: '5px', cursor: 'pointer' }}
                                ></i>
                              </div> */}
                              {/* <Button
                                className="deleteBtn"
                                onClick={() => confirmDeleteUser(item.id)}
                              >
                                削除
                              </Button> */}
                              {/* Modal key={item.id} */}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>

                <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChange}
                />

                {/* <Pagination layout="prev, pager, next" total={50} small={true}/> */}
              </CardBody>
            </Card>
          </Col>
          <ModalDetail open={isOpenDetailUser} onClose={() => setIsOpenDetailUser(false)}>
            <div style={{ width: '400', height: '100%', textAlign: 'center', padding: '0' }}>
              <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div
                  style={{
                    width: '30% ',
                    height: '100%',
                    position: 'absolute',
                    borderRight: '1px solid #dddddd',
                  }}
                >
                  <div style={{ width: '100% ', height: '30%' }}>
                    <img
                      src={ava}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '50%',
                        width: '150px',
                        height: '150px',
                      }}
                    ></img>
                  </div>
                  <div style={{ width: '100%', position: 'relative' }}>
                    <div
                      style={{
                        height: '3px',
                        width: '75%',
                        position: 'absolute',
                        margin: '35px 12.5% 0% 12.5%',
                        backgroundColor: 'gray',
                      }}
                    ></div>
                    <div
                      style={{
                        width: '100%',
                        display: 'grid',
                        marginLeft: '-2%',
                        position: 'absolute',
                        gridTemplateColumns: 'auto auto auto auto',
                        textAlign: 'center',
                      }}
                    >
                      {/* <div style={{ display: "flex" }}> */}
                      <div style={{ paddingLeft: '0%' }}>
                        <span>電話番号</span>
                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor: 'gray',
                            borderRadius: '50%',
                            display: 'table',
                          }}
                        >
                          <span style={{ verticalAlign: 'middle', display: 'table-cell' }}>1</span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '0%' }}>
                        <span>メール</span>
                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor: 'gray',
                            borderRadius: '50%',
                            display: 'table',
                          }}
                        >
                          <span style={{ verticalAlign: 'middle', display: 'table-cell' }}>2</span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '0%' }}>
                        <span>タグ</span>
                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor: 'gray',
                            borderRadius: '50%',
                            display: 'table',
                          }}
                        >
                          <span style={{ verticalAlign: 'middle', display: 'table-cell' }}>3</span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '0%' }}>
                        <span>顧客データ</span>
                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor: 'gray',
                            borderRadius: '50%',
                            display: 'table',
                          }}
                        >
                          <span style={{ verticalAlign: 'middle', display: 'table-cell' }}>4</span>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                {/* <div style={{ width: "70%", height: "100%" }}>asdasdas</div> */}
              </div>
            </div>
          </ModalDetail>
        </Row>
        <Modal key={detailData.id} open={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ width: '500px' }}>
            <div style={{ marginTop: '-30px' }}>
              <h4>{detailUpdateTitle}</h4>
              <form id="detailUserClient" className="swap">
                {/* <label className="label-input">
                  Name:
                  <input id="name" className="input-field" value={inputValueFullName} onChange={(e) => setInputValueFullName(e.target.value)} onBlur={(e) => checkFieldUpdate(e.target.value, "name")} disabled={disableInput} type="text" name="full_name" />
                  <label id="nameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">
                  Email:
                  <input id="email" className="input-field" value={detailData.email} disabled={true} type="text" name="email" />
                  <label id="emailErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Phone Number:
                  <input id="phone" className="input-field" value={detailData.phone_number} disabled={true} type="text" name="phone_number" />
                  <label id="phoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Created At:
                  <input className="input-field" value={detailData.created_at} disabled={true} type="text" name="createdAt" />
                  <label id="" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Updated At:
                  <input className="input-field" value={detailData.updated_at} disabled={true} type="text" name="updatedAt" />
                  <label id="" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br /> */}

                <label className="label-input">
                  名称&nbsp;<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      onChangeInputWarning('名称');
                    }}
                    onBlur={(e) => utils.checkUserNameInputUpdate(e.target.value, '名称')}
                    type="text"
                    id="nameUpdate"
                    name="full_name"
                  />
                </label>
                <span
                  id="名称ErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />
                <label className="label-input">
                  ログインID&nbsp;<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      onChangeInputWarning('newUserメールアドレス');
                    }}
                    onBlur={(e) => utils.checkInputEmail(e.target.value, 'メールアドレス')}
                    type="text"
                    id="updateEmail"
                    name="email"
                  />
                </label>
                <span
                  id="newUserメールアドレスErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />

                <label className="label-input">
                  クライアント<span className="span-require">*必須</span>
                  <select
                    id="client_id_update"
                    style={{ padding: '3px 0px 3px 0px' }}
                    // value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="input-field"
                    name="client_id"
                    defaultValue={clientIdUpdate}
                  >
                    {listClient?.clients?.map((client, i) => {
                      return (
                        <option key={i} value={client.id}>
                          {client.name}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <br />
                <br />

                <label className="label-input">
                  <label className="long-label">
                    権限&nbsp;<span className="span-require">*必須</span>
                  </label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={role}
                    onChange={(e) => setRole(e.target.value)}
                    name="role"
                    id="role"
                  >
                    <option value="admin_client">クライアント</option>
                    <option value="client">ユーザー</option>
                  </select>
                </label>
                <span
                  id="newClientTikTokCreateErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />

                <label className="label-input">
                  パスワード &nbsp;
                  <input
                    className="input-field"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      onChangeInputWarning('パスワード');
                    }}
                    // onBlur={(e) => checkFieldUpdate(e.target.value, "パスワード")}
                    type="password"
                    id="updatePassword"
                    name="password"
                  />
                </label>
                <span
                  id="パスワードErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />

                <label className="label-input">
                  パスワード（確認用）
                  <input
                    className="input-field"
                    onChange={() => onChangeInputWarning('パスワード(確認用)')}
                    // onBlur={(e) => checkFieldUpdate(e.target.value, "パスワード(確認用)")}
                    type="password"
                    id="updateConfirmPassword"
                    name="password_confirmation"
                  />
                </label>
                <span
                  id="パスワード(確認用)ErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />

                <Button id="btnUpdate" hidden={disableInput} onClick={updateClient}>
                  {' '}
                  更新
                </Button>
              </form>
            </div>
          </div>
        </Modal>
        <Modal open={isOpenAddUser} onClose={() => setIsOpenAddUser(false)}>
          <div style={{ width: '100%' }}>
            <div style={{ marginTop: '-30px' }}>
              <h4>ユーザー追加</h4>
              <form id="addForm" className="swap">
                <label className="label-input">
                  名称&nbsp;<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => utils.checkUserNameInputAdd(e.target.value, '名称')}
                    type="text"
                    id="newName"
                    name="full_name"
                  />
                </label>
                <span
                  id="newUser名称ErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />
                <label className="label-input">
                  ログインID&nbsp;<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => utils.checkInputEmail(e.target.value, 'メールアドレス')}
                    type="text"
                    id="newEmail"
                    name="email"
                  />
                </label>
                <span
                  id="newUserメールアドレスErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />

                <label className="label-input">
                  パスワード &nbsp;<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => utils.checkPasswordInputAdd(e.target.value, 'パスワード')}
                    type="password"
                    id="newPassword"
                    name="password"
                  />
                </label>
                <span
                  id="newUserパスワードErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />
                <label className="label-input">
                  パスワード（確認用）<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) =>
                      utils.checkPasswordInputAdd(e.target.value, 'パスワード(確認用)')
                    }
                    type="password"
                    id="newConfirmPassword"
                    name="confirm_password"
                  />
                </label>
                <span
                  id="newUserパスワード(確認用)ErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />
                <label className="label-input">
                  クライアント<span className="span-require">*必須</span>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    name="client_id"
                  >
                    {listClient?.clients?.map((client, i) => {
                      return (
                        <option key={i} value={client.id}>
                          {client.name}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label className="label-input">
                  <label className="long-label">
                    権限&nbsp;<span className="span-require">*必須</span>
                  </label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={'admin_client'}
                    name="role"
                    id="role"
                  >
                    <option value="admin_client">クライアント</option>
                    <option value="client">ユーザー</option>
                  </select>
                </label>
                <span
                  id="newClientTikTokCreateErrMsg"
                  style={{ display: 'none', color: 'red', float: 'right', width: '70%' }}
                ></span>
                <br />
                <br />
                <Button id="btnSubmit" onClick={addClient}>
                  追加
                </Button>
              </form>
            </div>
          </div>
        </Modal>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        <ModalShort open={isOpenDeleteUser} onClose={() => setIsOpenDeleteUser(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>ユーザーを削除しますか。</h4>
            <Button onClick={() => deleteClientUser()}>はい</Button>
            <Button onClick={() => setIsOpenDeleteUser(false)}>いいえ</Button>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default UserManagement;
