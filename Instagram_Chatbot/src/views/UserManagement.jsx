import React, { useState } from "react";
import Cookies from "js-cookie";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import ModalNoti from "./Popup/ModalNoti";
import Modal from "./Popup/Modal";
import "./Popup/modal.css"
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";
import { Button } from "react-bootstrap";
function UserManagement() {
  var [dataList, setDataList] = useState([])
  var [detailData, setDetailData] = useState({})
  var [msgNoti, setMsgNoti] = useState()
  var [detailUpdateTitle, setDetailUpdateTitle] = useState()
  var [disableInput, setDisableInput] = useState()
  var [inputValueFullName, setInputValueFullName] = useState()

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenNoti, setIsOpenNoti] = useState(false)
  const [isOpenAddUser, setIsOpenAddUser] = useState(false)

  React.useEffect(() => {
    Cookies.get('token')
    console.log(Cookies.get('token'));
  });
  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/managements/users`).then(res => {
      // console.log(res.data.data.users)
      setDataList(res.data.data)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }, [])

  function reloadListClient() {
    var path = window.location.pathname;
    api.get(`/api/v1/managements/users`).then(res => {
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
    setInputValueFullName(item.full_name)
    setIsOpen(true)
  }

  function deleteClientUser(id) {
    var path = window.location.pathname;
    api.delete(`/api/v1/managements/users/${id}`).then(res => {
      reloadListClient()
      setMsgNoti("Delete successfully!")
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
    var name = document.getElementById('name').value
    var email = document.getElementById('email').value
    var phone = document.getElementById('phone').value
    if (checkFieldUpdate(name, 'name') === true) {
      var elements = document.getElementById("detailUserClient").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 5; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      var updateClient = { user: obj };
      console.log(updateClient);
      api.patch(`/api/v1/managements/users/${detailData.id}`, updateClient).then(res => {
        reloadListClient()
        setMsgNoti("Updated User successfully!")
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
    var password = document.getElementById('newPassword').value
    if (checkFieldAdd(email, 'Email') === true && checkFieldAdd(password, "Password") === true ) {
      var elements = document.getElementById("addForm").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 1; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      var newClient = { user: obj };
      api.post(`/api/v1/users/registrations`, newClient).then(res => {
        reloadListClient()
        setMsgNoti("Add User successfully!")
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

  function checkFieldAdd(value, field) {
    if (value === '') {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  function checkInputEmail(value, field) {
    var phoneRe = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (value === '') {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else if (phoneRe.test(value) === false) {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = "Please input right email format: abc@abc.com"
    } else {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  const items = dataList.users
  console.log(items)
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="swap">
                  {/* <div className="div_left"><CardTitle tag="h4">Client Management</CardTitle></div> */}
                  <div className="div_right"><Button onClick={() => setIsOpenAddUser(true)}>Add Client</Button></div>
                </div>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: "center" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th className="actionList">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items && items.map(item => (
                        <tr key={item.id}>
                          <td>{item.full_name}</td>
                          <td>{item.email}</td>
                          <td>{item.created_at}</td>
                          <td className="actionList">
                            <div>
                              <Button onClick={() => getUserDetail(item)}>View Detail</Button>
                              <Button className="editBtn" onClick={() => updateClientUser(item)}>Edit</Button>
                              <Button className="deleteBtn" onClick={() => deleteClientUser(item.id)}>Delete</Button>
                              {/* Modal key={item.id} */}
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal key={detailData.id} open={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ width: "500px" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>{detailUpdateTitle}</h4>
              <form id="detailUserClient" className="swap">
                <label className="label-input">
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
                <br /><br />
                <Button id="btnUpdate" hidden={disableInput} onClick={updateClient}> Update</Button>
              </form>
            </div>
          </div>
        </Modal>
        <Modal open={isOpenAddUser} onClose={() => setIsOpenAddUser(false)}>
          <div style={{ width: "500px" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>Add User</h4>
              <form id="addForm" className="swap">
                <label className="label-input">
                  Email:
                  <input className="input-field" onBlur={(e) => checkInputEmail(e.target.value, "Email")} type="text" id="newEmail" name="email" />
                  <label id="newUserEmailErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">
                  Password:
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Password")} type="text" id="newPassword" name="password" />
                  <label id="newUserPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <Button id="btnSubmit" onClick={addClient}> Add Ne</Button>
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
