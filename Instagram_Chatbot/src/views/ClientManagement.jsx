import React, { useState } from "react";
import Cookies from "js-cookie";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import Modal from "./Popup/Modal";
import ModalNoti from "./Popup/ModalNoti";
import "./Popup/modal.css";
import * as utils from './../JS/client.js'
import "../assets/css/general.css";
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
  var [contract, setContract] = useState();
  var [inputEndDate, setInputEndDate] = useState('');
  var [inputStartDate, setInputStartDate] = useState('');

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
    // var path = window.location.pathname;
    // var name = document.getElementById('newName').value
    // var address = document.getElementById('newAddress').value
    // var phone = document.getElementById('newPhone').value

    //   var ele = document.getElementsByName("status")
    //   for(i = 0; i < ele.length; i++) {
    //     if(ele[i].checked)
    //     console.log('abc, ',ele[i].value)
    // }

    // if (checkFieldAdd(name, 'Name') === true && checkFieldAdd(address, "Address") === true && utils.checkInputNumber(phone, "Phone") === true) {
    var elements = document.getElementById("addForm").elements;
    var obj = {};
    for (var i = 0; i < elements.length - 1; i++) {
      var item = elements.item(i);
      obj[item.name] = item.value;
    }
    var newClient = { client: obj };
    console.log(newClient)
    // api.post(`/api/v1/managements/clients`, newClient).then(res => {
    //   reloadListClient()
    //   setMsgNoti("Add Client successfully!")
    //   setIsOpenAddUser(false)
    //   setIsOpenNoti(true)
    // }).catch(error => {
    //   alert(error)
    //   console.log(error)
    //   if (error.response.data.code === 3) {
    //     requestNewToken(path)
    //   }
    // })

    // }
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

  function checkInputDate(inputdate) {
    utils.checkDateToday(inputdate)
    if (utils.checkDateToday(inputdate) === true) {
      setInputEndDate(inputdate)
      setInputStartDate(inputdate)
    }
  }

  function checkEndDate(endDateIn) {
    utils.checkDateEndIn(endDateIn, inputStartDate)
    if (utils.checkDateEndIn(endDateIn, inputStartDate) === true) {
      setInputEndDate(endDateIn)
    }
  }

  function setContractInput(data) {
    console.log(data);
    setContract(data)
  }

  function changeInputField(value) {
    // setContract(value)
    contract = value
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
                  <div className="div_right"><Button onClick={() => setIsOpenAddUser(true)}>Add Client</Button></div>
                </div>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: "center" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>ID</th>
                      <th>画像</th>
                      <th><select className="text-primary" style={{ border: "none", fontWeight:"bold" }} defaultValue={''} name="instagram_create" id="instagram_create">
                        <option value="">プラン</option>
                        <option value="startup_plan">スタートアッププラン</option>
                        <option value="premium_plan">プレミアムプラン</option>
                        <option value="expert_plan">エキスパートプラン のいづれかを表示</option>
                      </select></th>
                      <th>プラン価格</th>{/**Plan price */}
                      <th>課金開始日</th>{/**Date start count price */}
                      <th>最低利用期間終了日</th>{/**Date end using */}
                      <th>住所</th>{/**Address */}
                      <th>最終ログイン日時</th>{/**Last login date_time */}
                      <th className="actionList">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {
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
                              
                            </div>
                          </td>
                        </tr>
                      ))
                    } */}
                    {/* Modal key={item.id} */}
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
          <div style={{ width: "100%" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>Add Client</h4>
              <form id="addForm" className="swap">
                {/* <label className="label-input">
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
                <br /><br /> */}
                <label className="label-input">ステータス {/*Status*/}<span className="span-require">*必須</span>
                  <span className="input-field">
                    <input name="status" type="radio" id="in_contract" value={contract} onClick={(e) => setContract('in_contract')} />
                    <label htmlFor="in_contract" className="radioButtonAddClient" >契約</label>
                    <input name="status" type="radio" id="pause_contract" value={contract} onClick={(e) => setContract('pause_contract')} />
                    <label htmlFor="pause_contract" className="radioButtonAddClient">休止</label>
                    <input name="status" type="radio" id="finished_contract" value={contract} onClick={(e) => setContract('finished_contract')} />
                    <label htmlFor="finished_contract" className="radioButtonAddClient">解約</label>
                    <input name="status" type="radio" id="trial_contract" value={contract} onClick={(e) => setContract('trial_contract')} />
                    <label htmlFor="trial_contract" className="radioButtonAddClient">お試し</label>
                  </span>
                </label>
                <br /><br />
                <label className="label-input"> プラン名 {/*Plan*/}<span className="span-require">*必須</span>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'start_up_plan'} name="plan_price" id="plan">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="start_up_plan">スタートアッププラン</option>
                    <option value="premium_plan">プレミアムプラン</option>
                    <option value="expert_plan">エキスパートプラン のいづれかを選択</option>
                  </select>
                </label><br /><br />
                <label className="label-input">プラン価格 {/**Plan price*/}
                  <input className="input-field" onBlur={(e) => utils.checkInputNumber(e.target.value, "Price")} type="text" id="newPlanPrice" name="plan_price" />
                  <label id="newClientPriceErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">課金開始日 {/** Date start count price */}
                  <input type="date" id="startDate" name="startDate" onChange={(e) => checkInputDate(e.target.value)} className="input-field" />
                  <label id="newClientStartErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">最低利用期間終了日
                  <input type="date" id="endDate" value={inputEndDate} name="endDate" onChange={(e) => checkEndDate(e.target.value)} className="input-field" />
                  <label id="newClientEndErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">Instagramチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="instagram_create" id="instagram_create">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="yes">あり</option>
                    <option value="no">なし</option>
                  </select>
                  <label id="newClientInstagramCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">LINEチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="LINE_create" id="LINE_create">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="yes">あり</option>
                    <option value="no">なし</option>
                  </select>
                  <label id="newClientLINECreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">TikTokチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="TikTok_create" id="TikTok_create">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="yes">あり</option>
                    <option value="no">なし</option>
                  </select>
                  <label id="newClientTikTokCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">WEBチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="WEB_create" id="WEB_create">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="yes">あり</option>
                    <option value="no">なし</option>
                  </select>
                  <label id="newClientWEBCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">メモ
                  <textarea className="input-field" rows="4" id="newNote" name="note" cols="50" />
                  <label id="newClientNoteErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">名称 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Name")} type="text" id="newName" name="name" />
                  <label id="newClientNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">名称カナ <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "NameKata")} type="text" id="newNameKata" name="name_kata" />
                  <label id="newClientNameKataErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">企業種別 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType")} type="text" id="newCompanyType" name="company_type" />
                  <label id="newClientCompanyTypeErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">名称カナ <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType2")} type="text" id="newCompanyType2" name="company_type2" />
                  <label id="newClientCompanyType2ErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">部署名 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "DepartmentName")} type="text" id="newDepartmentName" name="department_name" />
                  <label id="newClientCompanyType2ErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">肩書 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Title")} type="text" id="newTitle" name="title" />
                  <label id="newClientTitleErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">担当者 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Manager")} type="text" id="newManager" name="manager" />
                  <label id="newClientManagerErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">担当者カナ <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "ManagerKata")} type="text" id="newManagerKata" name="manager_kata" />
                  <label id="newClientManagerKataErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">パスワード <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Password")} type="password" id="newPassword" name="password" />
                  <label id="newClientPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">パスワード(確認用)<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "ConfirmPassword")} type="password" id="newConfirmPassword" name="confirm_password" />
                  <label id="newClientConfirmPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <span className="span-require">*必須</span><br /><br />
                <label className="label-input">画像（ロゴ）
                  <input className="input-field" type="file" id="avatar" name="img_logo" accept="image/png, image/jpeg" />
                  <label id="newClientImgLogoErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">サイトURL <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "URL")} type="text" id="newURL" name="url" />
                  <label id="newClientURLErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">郵便番号 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "PostCode")} type="text" id="newPostCode" name="post_code" />
                  <label id="newClientPostCodeErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">都道府県 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Prefectures")} type="text" id="newPrefectures" name="prefectures" />
                  <label id="newClientPrefecturesErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">市区町村 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Municipalities")} type="text" id="newMunicipalities" name="municipalities" />
                  <label id="newClientMunicipalitiesErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">住所 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Address")} type="text" id="newAddress" name="address" />
                  <label id="newClientAddressErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">建物名 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "BuildingName")} type="text" id="newBuildingName" name="building_name" />
                  <label id="newClientBuildingNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">メールアドレス <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Email")} type="text" id="newEmail" name="email" />
                  <label id="newClientEmailErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">電話番号 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => utils.checkPhoneNumber(e.target.value, "Phone")} type="text" id="newPhone" name="phone" />
                  <label id="newClientPhoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                {/* <label className="label-input">
                  Phone Number:
                  <input className="input-field" onBlur={(e) => utils.checkInputNumber(e.target.value, "Phone")} type="text" id="newPhone" name="phone_number" />
                  <label id="newClientPhoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Phone Number:
                  <input className="input-field" onBlur={(e) => utils.checkInputNumber(e.target.value, "Phone")} type="text" id="newPhone" name="phone_number" />
                  <label id="newClientPhoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input">
                  Phone Number:
                  <input className="input-field" onBlur={(e) => utils.checkInputNumber(e.target.value, "Phone")} type="text" id="newPhone" name="phone_number" />
                  <label id="newClientPhoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br /> */}
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
