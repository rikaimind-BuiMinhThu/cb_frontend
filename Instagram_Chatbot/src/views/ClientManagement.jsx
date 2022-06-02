import React, { useState } from "react";
import Cookies from "js-cookie";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import Modal from "./Popup/Modal";
import ModalNoti from "./Popup/ModalNoti";
import "./Popup/modal.css"
import "../assets/css/general.css"
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";
import { Button } from "react-bootstrap";
function ClientManagement() {
  var [dataList, setDataList] = useState([])
  var [detailData, setDetailData] = useState({})
  var [msgNoti, setMsgNoti] = useState()
  var [detailUpdateTitle, setDetailUpdateTitle] = useState()
  var [disableInput, setDisableInput] = useState()
  var [inputValueName, setInputValueName] = useState();
  var [inputValueAddress, setInputValueAddress] = useState();
  var [inputValuePhone, setInputValuePhone] = useState();

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenNoti, setIsOpenNoti] = useState(false)
  const [isOpenAddUser, setIsOpenAddUser] = useState(false)

  React.useEffect(() => {
    Cookies.get('token')
    console.log(Cookies.get('token'));
  });
  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/managements/clients`).then(res => {
      setDataList(res.data)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }, [])

  function reloadListClient() {
    var path = window.location.pathname;
    api.get(`/api/v1/managements/clients`).then(res => {
      setDataList(res.data)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }

  function getUserDetail(item) {
    setDetailUpdateTitle("Detail Client")
    setDetailData(item)
    setIsOpen(true)
    setDisableInput(true)
  }

  function updateClientUser(item) {
    setDisableInput(false)
    setDetailUpdateTitle("Edit Client")
    setDetailData(item)
    setInputValueName(item.name)
    setInputValueAddress(item.address)
    setInputValuePhone(item.phone_number)
    setIsOpen(true)
  }

  function deleteClientUser(id) {
    var path = window.location.pathname;
    api.delete(`/api/v1/managements/clients/${id}`).then(res => {
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
    var address = document.getElementById('address').value
    var phone = document.getElementById('phone').value
    if (checkFieldUpdate(name, 'name') === true && checkFieldUpdate(address, "address") === true && checkFieldUpdate(phone, "phone") === true) {
      var elements = document.getElementById("detailUserClient").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 3; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      console.log(detailData.id)
      var updateClient = { client: obj };
      console.log(updateClient);
      api.patch(`/api/v1/managements/clients/${detailData.id}`, updateClient).then(res => {
        reloadListClient()
        setMsgNoti("Update Client successfully!")
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
    var name = document.getElementById('newName').value
    var address = document.getElementById('newAddress').value
    var phone = document.getElementById('newPhone').value
    if (checkFieldAdd(name, 'Name') === true && checkFieldAdd(address, "Address") === true && checkInputPhone(phone, "Phone") === true) {
      var elements = document.getElementById("addForm").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 1; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      var newClient = { client: obj };
      api.post(`/api/v1/managements/clients`, newClient).then(res => {
        reloadListClient()
        setMsgNoti("Add Client successfully!")
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
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  function checkInputPhone(value, field) {
    var phoneRe = /^\d+$/;
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else if (phoneRe.test(value) === false) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = "Please input number format"
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  function changeInputField(){
    var value =''
    detailData["name"] = value
    console.log(value)
  }

  const items = dataList.data
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
                      <th>Address</th>
                      <th>Phone Number</th>
                      <th className="actionList">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items && items.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.address}</td>
                          <td>{item.phone_number}</td>
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
                  <input id="name" className="input-field" value={inputValueName} onChange={(e) => setInputValueName(e.target.value)} onBlur={(e) => checkFieldUpdate(e.target.value, "name")} disabled={disableInput} type="text" name="name" />
                  <label id="nameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">
                  Address:
                  <input id="address" className="input-field" value={inputValueAddress} onChange={(e) => setInputValueAddress(e.target.value)} onBlur={(e) => checkFieldUpdate(e.target.value, "address")} disabled={disableInput} type="text" name="address" />
                  <label id="addressErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Phone Number:
                  <input id="phone" className="input-field" value={inputValuePhone} onChange={(e) => setInputValuePhone(e.target.value)} onBlur={(e) => checkFieldUpdate(e.target.value, "phone")} disabled={disableInput} type="text" name="phone_number" />
                  <label id="phoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Created At:
                  <input className="input-field" placeholder={detailData.created_at} disabled={true} type="text" name="createdAt" />
                  <label id="" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Updated At:
                  <input className="input-field" placeholder={detailData.updated_at} disabled={true} type="text" name="updatedAt" />
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
              <h4>Add Client</h4>
              <form id="addForm" className="swap">
                <label className="label-input">
                  Name:
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Name")} type="text" id="newName" name="name" />
                  <label id="newClientNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">
                  Address:
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Address")} type="text" id="newAddress" name="address" />
                  <label id="newClientAddressErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Phone Number:
                  <input className="input-field" onBlur={(e) => checkInputPhone(e.target.value, "Phone")} type="text" id="newPhone" name="phone_number" />
                  <label id="newClientPhoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
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

export default ClientManagement;
