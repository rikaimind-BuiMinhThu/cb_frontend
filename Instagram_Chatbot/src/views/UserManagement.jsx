import React, { useState } from "react";
import Cookies from "js-cookie";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import ModalNoti from "./Popup/ModalNoti";
import Modal from "./Popup/Modal";
import "./Popup/modal.css"
import * as utils from './../JS/user.js'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";
import { Button } from "react-bootstrap";
import Pagination from '@material-ui/lab/Pagination';
// import { Pagination } from "element-react";
function UserManagement() {
  var [dataList, setDataList] = useState([])
  var [detailData, setDetailData] = useState({})
  var [msgNoti, setMsgNoti] = useState()
  var [detailUpdateTitle, setDetailUpdateTitle] = useState()
  var [disableInput, setDisableInput] = useState()
  var [inputValueFullName, setInputValueFullName] = useState()

  //Update
  var [name, setName] = useState()
  // var [email, setEmail] = useState()
  // var [role, setRole] = useState()
  // var [EnglishName, setEnglishName] = useState()§§§§§§§§§§§§§§§
  // var [cfPassword, setCfPassword] = useState()
  var [pageIndex, setPageIndex] = useState(1)
  var [totalPage, setTotalPage] = useState()
  // var pageIndex = 2

  var [updateId, setUpdateId] = useState()

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenNoti, setIsOpenNoti] = useState(false)
  const [isOpenAddUser, setIsOpenAddUser] = useState(false)
  const [listClient, setListClient] = useState([])

  // React.useEffect(() => {
  //   var path = window.location.pathname;
  //   api.get(`/api/v1/managements/clients`).then(res => {
  //     // console.log(res.data.data)
  //     setListClient(res.data.data)
  //   }).catch(error => {
  //     console.log(error)
  //     if (error.response.data.code === 3) {
  //       requestNewToken(path)
  //     }
  //   })
  // }, [])

  const clients_id = listClient.clients

  React.useEffect(() => {
    Cookies.get('token')
    // console.log(Cookies.get('token'));
  });
  React.useEffect(() => {
    var paramSearch={page: pageIndex}
    var path = window.location.pathname;
    api.get(`/api/v1/managements/users`, paramSearch).then(res => {
      console.log(res.data.data.total)
      var totalPage = Math.ceil(res.data.data.total/25)
      setTotalPage(totalPage)
      setDataList(res.data.data)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }, [])

  function reloadListClient(pgIndex) {
    var path = window.location.pathname;
    // setPageIndex(pgIndex)
    api.get(`/api/v1/managements/users?name=&page=${pgIndex}&client_id=`).then(res => {
      setDataList(res.data.data)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }

  function getUserDetail(item) {
    setDetailUpdateTitle("Detail User")
    setDetailData(item)
    setIsOpen(true)
    setDisableInput(true)
  }

  function updateClientUser(item) {
    setDisableInput(false)
    setDetailUpdateTitle("Edit User")
    setDetailData(item)
    // setInputValueFullName(item.full_name)
    setName(item.full_name)
    setUpdateId(item.id)
    // setEnglishName(item.english_name)
    // setEmail(item.email)
    // setRole(item.role)
    // setPassword(item.password)
    setIsOpen(true)
  }

  function deleteClientUser(id) {
    var path = window.location.pathname;
    api.delete(`/api/v1/managements/users/${id}`).then(res => {
      reloadListClient(pageIndex)
      setMsgNoti("削除しました!")
      setIsOpenNoti(true)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }

  function updateClient() {
    var path = window.location.pathname;
    var name = document.getElementById('nameUpdate').value
    console.log('nameupdate: ', name)
    if (checkFieldUpdate(name, 'name') === true) {
      var elements = document.getElementById("detailUserClient").elements;
      var obj = {};
      for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      console.log("aaa", obj)
      var updateClient = { user: obj };
      console.log(updateClient);
      api.patch(`/api/v1/managements/users/${updateId}`, updateClient).then(res => {
        reloadListClient(pageIndex)
        setMsgNoti("ユーザーを更新しました!")
        setIsOpen(false)
        setIsOpenNoti(true)
      }).catch(error => {
        alert(error)
        console.log(error)
        if (error.response.data.code === 3) {
          requestNewToken(path)
        }
      })
    }
  }

  function checkFieldUpdate(value, field) {
    if (value === '') {
      document.getElementById(`${field}ErrMsg`).style.display = 'block'
      document.getElementById(`${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else {
      document.getElementById(`${field}ErrMsg`).style.display = 'none'
      document.getElementById(`${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  function addClient() {
    var path = window.location.pathname;
    var email = document.getElementById('newEmail').value
    var name = document.getElementById('newName').value
    var confirmPassword = document.getElementById('newConfirmPassword').value
    var password = document.getElementById('newPassword').value
    if (utils.checkFieldAdd(email, 'Email') === true && utils.checkFieldAdd(password, "Password") === true && utils.checkFieldAdd(name, "Name") === true &&
      utils.checkFieldAdd(confirmPassword, "ConfirmPassword") === true) {
      var elements = document.getElementById("addForm").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 1; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      // var client_id = 80
      // obj.client_id = 80
      // obj.push(client_id)
      delete obj.confirm_password
      var newUser = { user: obj };
      console.log(newUser)
      api.post(`/api/v1/users/registrations`, newUser).then(res => {
        reloadListClient(pageIndex)
        setMsgNoti("ユーザーを追加しました!")
        setIsOpenAddUser(false)
        setIsOpenNoti(true)
      }).catch(error => {
        alert(error)
        console.log(error)
        if (error.response.data.code === 3) {
          requestNewToken(path)
        }
      })
    }
  }

  const items = dataList.users

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

  var [page, setPage] = useState(1)
  function handleChangePage(ef) {
    setPage(parseInt(ef))
    console.log(ef)
    setPageIndex(ef)
    reloadListClient(ef)
  }


  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="swap">
                  {/* <div className="div_left"><CardTitle tag="h4">Client Management</CardTitle></div> */}
                  <div className="div_right"><Button onClick={() => setIsOpenAddUser(true)}>ユーザー追加</Button></div>
                </div>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: "center" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>名前</th>
                      <th>メール</th>
                      <th>役割</th>
                      <th className="actionList">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items && items.map(item => (
                        <tr key={item.id}>
                          <td>{item.full_name}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
                          <td className="actionList">
                            <div>
                              {/* <Button onClick={() => getUserDetail(item)}>View Detail</Button> */}
                              <Button className="editBtn" onClick={() => updateClientUser(item)}>編集</Button>
                              <Button className="deleteBtn" onClick={() => deleteClientUser(item.id)}>削除</Button>
                              {/* Modal key={item.id} */}
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>


                <Pagination count={totalPage} page={page} onChange={(e) => handleChangePage(e.target.textContent)} />



                {/* <Pagination layout="prev, pager, next" total={50} small={true}/> */}
              </CardBody>

            </Card>

          </Col>

        </Row>
        <Modal key={detailData.id} open={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ width: "500px" }}>
            <div style={{ marginTop: "-30px" }}>
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

                <label className="label-input">名称&nbsp;<span className="span-require">*必須</span>
                  <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} onBlur={(e) => checkFieldUpdate(e.target.value, "name")} type="text" id="nameUpdate" name="full_name" />
                  <label id="nameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                {/* <label className="label-input">ログインID&nbsp;<span className="span-require">*必須</span>
                  <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => utils.checkInputEmail(e.target.value, "Email")} type="text" id="newEmail" name="email" />
                  <label id="newUserEmailErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">権限&nbsp;<span className="span-require">*必須</span></label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={role} name="role" id="role">
                    <option value="deel">Deel Management</option>
                    <option value="client">Client Management</option>
                  </select>
                  <label id="newClientTikTokCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br /> */}
                <Button id="btnUpdate" hidden={disableInput} onClick={updateClient}> 更新</Button>
              </form>
            </div>
          </div>
        </Modal>
        <Modal open={isOpenAddUser} onClose={() => setIsOpenAddUser(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>Add User</h4>
              <form id="addForm" className="swap">
                <label className="label-input">名称&nbsp;<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => utils.checkFieldAdd(e.target.value, "Name")} type="text" id="newName" name="full_name" />
                  <label id="newUserNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">ログインID&nbsp;<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => utils.checkInputEmail(e.target.value, "Email")} type="text" id="newEmail" name="email" />
                  <label id="newUserEmailErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">権限&nbsp;<span className="span-require">*必須</span></label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'deel'} name="role" id="role">
                    <option value="deel">Deel Management</option>
                    <option value="client">Client Management</option>
                  </select>
                  <label id="newClientTikTokCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">パスワード&nbsp;<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => utils.checkFieldAdd(e.target.value, "Password")} type="password" id="newPassword" name="password" />
                  <label id="newUserPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">パスワード（確認用&nbsp;<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => utils.checkFieldAdd(e.target.value, "ConfirmPassword")} type="password" id="newConfirmPassword" name="confirm_password" />
                  <label id="newUserConfirmPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">Belong to <span className="span-require">*必須</span>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" name="client_id">
                    {clients_id?.map((client, i) => {
                      return (
                        <option key={i} value={client.id}>
                          {client.name}
                        </option>
                      )
                    })}
                  </select>
                </label>
                <Button id="btnSubmit" onClick={addClient}>追加</Button>
              </form>
            </div>
          </div>
        </Modal>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>{msgNoti}</h4>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default UserManagement;
