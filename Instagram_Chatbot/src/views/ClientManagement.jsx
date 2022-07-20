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
import { Title } from "chart.js";
import { Pagination } from "@material-ui/lab";
function ClientManagement() {
  var [dataList, setDataList] = useState([])
  var [detailData, setDetailData] = useState({})
  var [msgNoti, setMsgNoti] = useState()
  var [detailUpdateTitle, setDetailUpdateTitle] = useState()
  var [disableInput, setDisableInput] = useState()

  var [contract, setContract] = useState();
  var [inputEndDate, setInputEndDate] = useState('');
  var [inputStartDate, setInputStartDate] = useState('');
  var [inputImage, setInputImage] = useState('');

  //Update, Detail
  var [status, setStatus] = useState();
  var [plan, setPlan] = useState();
  var [price, setPrice] = useState();
  var [isInstagram, setIsInstagram] = useState()
  var [isLine, setIsLine] = useState()
  var [isTiktok, setIsTiktok] = useState()
  var [isWeb, setIsWeb] = useState()
  var [note, setNote] = useState()
  var [name, setName] = useState()
  var [nameKata, setNameKata] = useState()
  var [companyType, setCompanyType] = useState()
  var [companyType2, setCompanyType2] = useState()
  var [departmentName, setDepartmentName] = useState()
  var [title, setTitle] = useState()
  var [manager, setManager] = useState()
  var [managerKata, setManagerKata] = useState()
  var [urlLogo, setUrlLogo] = useState()
  var [url, setUrl] = useState()
  var [zipCode, setZipCode] = useState()
  var [prefecture, setPrefecture] = useState()
  var [municipality, setMunicipality] = useState()
  var [address, setAddress] = useState()
  var [buildingName, setBuildingName] = useState()
  var [email, setEmail] = useState()
  var [phone, setPhone] = useState()
  var [updateId, setUpdateId] = useState()


  var [pageIndex, setPageIndex] = useState(1)
  var [totalPage, setTotalPage] = useState()




  // var [dateStart, setDateStart] = useState();
  // var [inputValueName, setInputValueName] = useState();
  // var [inputValueAddress, setInputValueAddress] = useState();
  // var [inputValuePhone, setInputValuePhone] = useState();


  const [isOpen, setIsOpen] = useState(false)
  const [isOpenNoti, setIsOpenNoti] = useState(false)
  const [isOpenAddUser, setIsOpenAddUser] = useState(false)

  React.useEffect(() => {
    Cookies.get('token')
    // console.log(Cookies.get('token'));
  });
  React.useEffect(() => {
    var paramSearch = { page: pageIndex }
    var path = window.location.pathname;
    api.get(`/api/v1/managements/clients`, paramSearch).then(res => {
      console.log(res.data.data)
      var totalPage = Math.ceil(res.data.data.total / 25)
      setTotalPage(totalPage)
      setDataList(res.data.data)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }, [])


  function reloadListClient(pgIndex) {
    var path = window.location.pathname;
    api.get(`/api/v1/managements/clients?name=&page=${pgIndex}&client_id=`).then(res => {
      var totalPage = Math.ceil(res.data.data.total / 25)
      if (pgIndex > totalPage) {
        api.get(`/api/v1/managements/clients?name=&page=${totalPage}&client_id=`).then(resp => {
          setDataList(resp.data.data)
        })
      } else {
        setDataList(res.data.data)
      }
      setTotalPage(totalPage)

    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function getUserDetail(item) {

    var path = window.location.pathname;
    api.get(`/api/v1/managements/clients/${item.id}`).then(res => {
      var data = res.data.data
      // console.log(data)
      setUpdateId(data.id)
      setDetailUpdateTitle("詳細")
      setContract(data.status)
      setPlan(data.plan)
      setPrice(data.price)
      setInputStartDate(data.subscription_start_at) //.slice(0, 10)
      setInputEndDate(data.subscription_end_at) //.slice(0, 10)
      setIsInstagram(data.is_instagram)
      setIsLine(data.is_line)
      setIsTiktok(data.is_tiktok)
      setIsWeb(data.is_web)
      setNote(data.note)
      setName(data.name)
      setNameKata(data.name_katakana)
      setCompanyType(data.enterprise_type)
      setCompanyType2(data.enterprise_type_2)
      setDepartmentName(data.department_name)
      setTitle(data.title)
      setManager(data.responsible_person)
      setManagerKata(data.responsible_person_katakana)
      setUrlLogo(`https://ec-chatbot-test.com/${data.logo_url.url}`)
      setUrl(data.url)
      setZipCode(data.zip_code)
      // console.log('prefecture: ' ,data.prefecture)
      // if (data.prefecture === null) {
      //   setPrefecture('')
      // } else { setPrefecture(data.prefecture) }
      setPrefecture(data.prefecture) 
      if (data.municipality !== null) {
        setMunicipality(data.municipality)
      } else { setMunicipality('') }
      setAddress(data.address)
      setBuildingName(data.building_name)
      setEmail(data.email)
      setPhone(data.phone_number)
      setIsOpen(true)
      // console.log(data.status)
      if (data.status === 'active') {
        document.getElementById("in_contract").checked = true
      } else if (data.status === 'pause') {
        document.getElementById("pause_contract").checked = true
      } else if (data.status === 'ended') {
        document.getElementById("finished_contract").checked = true
      } else if (data.status === 'trial') {
        document.getElementById("trial_contract").checked = true
      }
      setDisableInput(true)
    }).catch(error => {
      console.log(error)
    })
    // setIsOpen(true)
    // setDisableInput(true)
  }

  function updateClientUser(item) {
    var path = window.location.pathname;
    api.get(`/api/v1/managements/clients/${item.id}`).then(res => {
      var data = res.data.data
      // console.log(data)
      setUpdateId(data.id)
      setDetailUpdateTitle("クライアント更新")
      setContract(data.status)
      setPlan(data.plan)
      setPrice(data.price)
      setInputStartDate(data.subscription_start_at) //.slice(0, 10)
      setInputEndDate(data.subscription_end_at)// .slice(0, 10)
      setIsInstagram(data.is_instagram)
      setIsLine(data.is_line)
      setIsTiktok(data.is_tiktok)
      setIsWeb(data.is_web)
      setNote(data.note)
      setName(data.name)
      setNameKata(data.name_katakana)
      setCompanyType(data.enterprise_type)
      setCompanyType2(data.enterprise_type_2)
      setDepartmentName(data.department_name)
      setTitle(data.title)
      setManager(data.responsible_person)
      setManagerKata(data.responsible_person_katakana)
      setUrlLogo(`https://ec-chatbot-test.com/${data.logo_url.url}`)
      setUrl(data.url)
      setZipCode(data.zip_code)
      // if (data.prefecture === null) {
      //   setPrefecture('')
      // } else { setPrefecture(data.prefecture) }
      setPrefecture(data.prefecture) 
      if (data.municipality !== null) {
        setMunicipality(data.municipality)
      } else { setMunicipality('') }
      setAddress(data.address)
      setBuildingName(data.building_name)
      setEmail(data.email)
      setPhone(data.phone_number)
      setIsOpen(true)
      // console.log(data.status)
      if (data.status === 'active') {
        document.getElementById("in_contract").checked = true
      } else if (data.status === 'pause') {
        document.getElementById("pause_contract").checked = true
      } else if (data.status === 'ended') {
        document.getElementById("finished_contract").checked = true
      } else if (data.status === 'trial') {
        document.getElementById("trial_contract").checked = true
      }
      setDisableInput(false)
    }).catch(error => {
      console.log(error)
    })
  }

  function deleteClientUser(id) {
    var path = window.location.pathname;
    api.delete(`/api/v1/managements/clients/${id}`).then(res => {
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

    var price = document.getElementById('newPlanPrice').value
    var startDate = document.getElementById('startDate').value
    var endDate = document.getElementById('endDate').value
    var name = document.getElementById('newName').value
    var nameKata = document.getElementById('newNameKata').value
    var companyType = document.getElementById('newCompanyType').value
    var companyType2 = document.getElementById('newCompanyType2').value
    var department = document.getElementById('newDepartmentName').value
    var title = document.getElementById('newTitle').value
    var manager = document.getElementById('newManager').value
    var managerKata = document.getElementById('newManagerKata').value
    var url = document.getElementById('newURL').value
    var zipCode = document.getElementById('newPostCode').value
    var prefectures = document.getElementById('newPrefectures').value
    var municipalities = document.getElementById('newMunicipalities').value
    var address = document.getElementById('newAddress').value
    var building = document.getElementById('newBuildingName').value
    var email = document.getElementById('newEmail').value
    var phone = document.getElementById('newPhone').value



    if (checkPickStatus() === true && checkInputNumber(price, 'Price') === true && checkFieldAdd(startDate, "Start") === true
      && checkFieldAdd(endDate, "End") === true && checkFieldAdd(name, "Name") === true
      && checkFieldAdd(nameKata, "NameKata") === true && checkFieldAdd(companyType, "CompanyType") === true
      && checkFieldAdd(companyType2, "CompanyType2") === true && checkFieldAdd(department, "DepartmentName") === true
      && checkFieldAdd(title, "Title") === true && checkFieldAdd(manager, "Manager") === true
      && checkFieldAdd(managerKata, "ManagerKata") === true
      && checkFieldAdd(url, "URL") === true
      && checkFieldAdd(address, "Address") === true && checkFieldAdd(municipalities, "Municipalities") === true
      && checkFieldAdd(zipCode, "PostCode") === true && checkFieldAdd(prefectures, "Prefectures") === true
      && checkFieldAdd(building, "BuildingName") === true && checkFieldAdd(email, "Email") === true
      && checkFieldAdd(phone, "Phone") === true) {
      var elements = document.getElementById("detailUserClient").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 3; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }

      // var passwordU = obj.password
      // var conf_password = obj.password_confirmation
      // var usr = { "password": passwordU, "password_confirmation": conf_password }
      // delete obj.password_confirmation
      // delete obj.password
      obj.logo_url = inputImage
      var updateClient = { client: obj };
      // console.log(newClient)

      var updateClient = { client: obj };
      console.log(updateClient);
      api.patch(`/api/v1/managements/clients/${updateId}`, updateClient).then(res => {
        reloadListClient()
        setMsgNoti("クライアント更新しました!")
        setIsOpen(false)
        setIsOpenNoti(true)
      }).catch(error => {
        alert(error)
        console.log(error)
        if (error.response.data.code === 3) {
          requestNewToken(path)
        }
      })
    } else {
      console.log("Missing field")
    }


    // }
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
    // console.log(document.getElementById('newPlanPrice').style.display === "none")
    var price = document.getElementById('newPlanPrice').value
    var startDate = document.getElementById('startDate').value
    var endDate = document.getElementById('endDate').value
    var name = document.getElementById('newName').value
    var nameKata = document.getElementById('newNameKata').value
    var companyType = document.getElementById('newCompanyType').value
    var companyType2 = document.getElementById('newCompanyType2').value
    var department = document.getElementById('newDepartmentName').value
    var title = document.getElementById('newTitle').value
    var manager = document.getElementById('newManager').value
    var managerKata = document.getElementById('newManagerKata').value
    var password = document.getElementById('newPassword').value
    var cfPassword = document.getElementById('newConfirmPassword').value
    var url = document.getElementById('newURL').value
    var zipCode = document.getElementById('newPostCode').value
    var prefectures = document.getElementById('newPrefectures').value
    var municipalities = document.getElementById('newMunicipalities').value
    var address = document.getElementById('newAddress').value
    var building = document.getElementById('newBuildingName').value
    var email = document.getElementById('newEmail').value
    var phone = document.getElementById('newPhone').value



    if (checkPickStatus() === true && checkInputNumber(price, 'Price') === true && checkFieldAdd(startDate, "Start") === true
      && checkFieldAdd(endDate, "End") === true && checkFieldAdd(name, "Name") === true
      && checkFieldAdd(nameKata, "NameKata") === true && checkFieldAdd(companyType, "CompanyType") === true
      && checkFieldAdd(companyType2, "CompanyType2") === true && checkFieldAdd(department, "DepartmentName") === true
      && checkFieldAdd(title, "Title") === true && checkFieldAdd(manager, "Manager") === true
      && checkFieldAdd(managerKata, "ManagerKata") === true && checkFieldAdd(password, "Password") === true
      && checkFieldAdd(cfPassword, "ConfirmPassword") === true && checkFieldAdd(url, "URL") === true
      && checkFieldAdd(address, "Address") === true && checkFieldAdd(municipalities, "Municipalities") === true
      && checkFieldAdd(zipCode, "PostCode") === true && checkFieldAdd(prefectures, "Prefectures") === true
      && checkFieldAdd(building, "BuildingName") === true && checkFieldAdd(email, "Email") === true
      && checkFieldAdd(phone, "Phone") === true) {



      // if (checkFieldAdd(name, 'Name') === true && checkFieldAdd(address, "Address") === true && utils.checkInputNumber(phone, "Phone") === true) {
      var elements = document.getElementById("addForm").elements;
      var obj = {};
      for (var i = 0; i < elements.length - 1; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      var passwordU = obj.password
      var conf_password = obj.password_confirmation
      var usr = { "password": passwordU, "password_confirmation": conf_password }
      delete obj.password_confirmation
      delete obj.password
      obj.logo_url = inputImage
      var newClient = { client: obj, user: usr };
      console.log(newClient)
      api.post(`/api/v1/managements/clients`, newClient).then(res => {
        if (res.data.code === 1 || res.data.code === "1") {
          reloadListClient()
          setMsgNoti("クライアント追加しました!")
          setIsOpenAddUser(false)
          setIsOpenNoti(true)
        } else {
          setMsgNoti(res.data.message)
          setIsOpenAddUser(false)
          setIsOpenNoti(true)
        }

      }).catch(error => {
        alert(error)
        console.log(error)
        if (error.response.data.code === 3) {
          requestNewToken(path)
        }
      })

      // }
    } else {
      console.log('Missing field')
    }
  }

  function checkPickStatus() {
    var status = ''
    if (document.getElementById('in_contract').checked) {
      status = document.getElementById('in_contract').value
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none'
      document.getElementById(`newClientStatusErrMsg`).innerHTML = ""
      return true
    } else if (document.getElementById('pause_contract').checked) {
      status = document.getElementById('pause_contract').value
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none'
      document.getElementById(`newClientStatusErrMsg`).innerHTML = ""
      return true
    } else if (document.getElementById('finished_contract').checked) {
      status = document.getElementById('finished_contract').value
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none'
      document.getElementById(`newClientStatusErrMsg`).innerHTML = ""
      return true
    } else if (document.getElementById('trial_contract').checked) {
      status = document.getElementById('trial_contract').value
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none'
      document.getElementById(`newClientStatusErrMsg`).innerHTML = ""
      return true
    } else {
      document.getElementById(`newClientStatusErrMsg`).style.display = 'block'
      document.getElementById(`newClientStatusErrMsg`).innerHTML = `Status cannot be empty`
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
  
  function setSizeSlect() {
    document.getElementById('newPrefectures').size = "10"
  }
  function setSizeSlectCom() {
    document.getElementById('newCompanyType').size = "10"
  }
  function setSizeSlectCom2() {
    document.getElementById('newCompanyType2').size = "10"
  }
  function setSizeAfterSelect() {
    document.getElementById('newPrefectures').size = "1"
  }
  function setSizeAfterSelectCom() {
    document.getElementById('newCompanyType').size = "1"
  }
  function setSizeAfterSelectCom2() {
    document.getElementById('newCompanyType2').size = "1"
  }
  function closeSizeSelect() {
    document.getElementById('newPrefectures').size = "1"
  }
  function closeSizeSelectCom() {
    document.getElementById('newCompanyType').size = "1"
  }
  function closeSizeSelectCom2() {
    document.getElementById('newCompanyType2').size = "1"
  }

  function checkInputNumber(value, field) {
    // var phoneRe = /^\d+$/;
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  // function checkFieldAdd(value, field) {
  //   if (value === '') {
  //     document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
  //     document.getElementById(`newClient${field}ErrMsg`).innerHTML = `This field cannot be empty`
  //   } else {
  //     document.getElementById(`newClient${field}ErrMsg`).style.display = 'none'
  //     document.getElementById(`newClient${field}ErrMsg`).innerHTML = ""
  //     return true
  //   }
  // }

  function checkInputDate(inputdate) {
    // utils.checkDateToday(inputdate)
    // if (utils.checkDateToday(inputdate) === true) {
    //   // setInputEndDate(inputdate)
    //   setInputStartDate(inputdate)
    // }
    setInputStartDate(inputdate)
    if (document.getElementById('startDate').value.toString() === '') {
      document.getElementById(`newClientStartErrMsg`).style.display = 'block'
      document.getElementById(`newClientStartErrMsg`).innerHTML = `Start date cannot be empty`
    } else {
      document.getElementById(`newClientStartErrMsg`).style.display = 'none'
      document.getElementById(`newClientStartErrMsg`).innerHTML = ``
    }
  }

  function checkEndDate(endDateIn) {
    utils.checkDateEndIn(endDateIn, inputStartDate)
    if (utils.checkDateEndIn(endDateIn, inputStartDate) === true) {
      setInputEndDate(endDateIn)
    }
    setInputEndDate(endDateIn)
  }

  function setContractInput(data) {
    setContract(data)
  }

  function addUserPopup() {
    setContract('')
    setInputStartDate('')
    setIsOpenAddUser(true)
  }

  function getBaseUrl() {
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      setInputImage(baseString)
    };
    reader.readAsDataURL(file);
  }

  var [page, setPage] = useState(1)
  function handleChangePage(ef) {
    setPage(parseInt(ef))
    setPageIndex(ef)
    reloadListClient(ef)
  }



  const items = dataList.clients
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="swap">
                  <div className="div_right"><Button onClick={() => addUserPopup()}>クライアント追加</Button></div>
                </div>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: "center", tableLayout: "fixed", overflow: "hidden" }}>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: "5%" }}>ID</th>
                      <th style={{ width: "7%" }}>画像</th>
                      <th style={{ width: "10%" }}>名称</th>
                      <th style={{width: '10%'}}>プラン</th>
                      {/* <th style={{ width: "10%" }}><select className="text-primary" style={{ border: "none", fontWeight: "bold" }} defaultValue={''}>
                        <option value="">プラン</option>
                        <option value={0}>スタートアッププラン</option>
                        <option value={1}>プレミアムプラン</option>
                        <option value={2}>エキスパートプラン のいづれかを表示</option>
                      </select></th> */}
                      <th>プラン価格</th>{/**Plan price */}
                      <th>課金開始日</th>{/**Date start count price */}
                      <th style={{width: '10%'}}>最低利用期間終了日</th>{/**Date end using */}
                      <th>住所</th>{/**Address */}
                      <th style={{width: '10%'}}>最終ログイン日時</th>
                      {/**Last login date_time */}
                      <th className="actionList">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items && items.map(item => (
                        <tr key={item.id} style={{ overflow: "hidden", height: "14px", }}>
                          <td>{item.id}</td>
                          <td style={{ margin: "0", padding: "0" }}><img src={`https://ec-chatbot-test.com${item.logo_url.url}`} style={{ maxHeight: "60px", maxWidth: "100px" }} alt="" /></td>
                          <td>{item.name}</td>
                          <td>{item.plan}</td>
                          <td>{item.price}</td>
                          <td id="dateStart">{item.subscription_start_at}</td>
                          {/* .slice(0, 10) */}
                          <td id="dateEnd">{item.subscription_end_at}</td>
                          {/* .slice(0, 10) */}
                          <td>{item.address}</td>
                          <td>{item.last_sign_in_at}</td>
                          <td className="actionList">
                            <div>
                              <Button onClick={() => getUserDetail(item)}>詳細</Button>
                              <Button className="editBtn" onClick={() => updateClientUser(item)}>編集</Button>
                              <Button className="deleteBtn" onClick={() => deleteClientUser(item.id)}>削除</Button>

                            </div>
                          </td>
                        </tr>
                      ))
                    }
                    {/* Modal key={item.id} */}
                  </tbody>
                </Table>


                <Pagination count={totalPage} page={page} onChange={(e) => handleChangePage(e.target.textContent)} />

              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal key={detailData.id} open={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>{detailUpdateTitle}</h4>
              <form id="detailUserClient" className="swap">
                <label className="label-input">ステータス {/*Status*/}<span className="span-require">*必須</span>
                  <span className="input-field" value={contract}>
                    <input name="status" type="radio" id="in_contract" value={contract} onClick={(e) => setContract('active')} />
                    <label htmlFor="in_contract" className="radioButtonAddClient" >契約</label>
                    <input name="status" type="radio" id="pause_contract" value={contract} onClick={(e) => setContract('pause')} />
                    <label htmlFor="pause_contract" className="radioButtonAddClient">休止</label>
                    <input name="status" type="radio" id="finished_contract" value={contract} onClick={(e) => setContract('ended')} />
                    <label htmlFor="finished_contract" className="radioButtonAddClient">解約</label>
                    <input name="status" type="radio" id="trial_contract" value={contract} onClick={(e) => setContract('trial')} />
                    <label htmlFor="trial_contract" className="radioButtonAddClient">お試し</label>
                  </span>
                  <label id="newClientStatusErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input"> プラン名 {/*Plan*/}<span className="span-require">*必須</span>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={plan} name="plan" id="plan">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="startup">スタートアッププラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="expert">エキスパートプラン</option>
                    <option value="complete">完全成果報酬プラン</option>
                  </select>
                </label><br /><br />
                <label className="label-input">プラン価格 {/**Plan price*/}
                  <input className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={(e) => utils.checkInputNumber(e.target.value, "Price")} type="number" id="newPlanPrice" name="price" />
                  <label id="newClientPriceErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">課金開始日 {/** Date start count price */}
                  <input type="date" id="startDate" name="subscription_start_at" value={inputStartDate} onChange={(e) => checkInputDate(e.target.value)} className="input-field" />
                  <label id="newClientStartErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">最低利用期間終了日
                  <input type="date" id="endDate" value={inputEndDate} name="subscription_end_at" onChange={(e) => checkEndDate(e.target.value)} className="input-field" />
                  <label id="newClientEndErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">Instagramチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={isInstagram} name="is_instagram" id="is_instagram">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientInstagramCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">LINEチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={isLine} name="is_line" id="is_line">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientLINECreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">TikTokチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={isTiktok} name="is_tiktok" id="is_tiktok">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientTikTokCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">WEBチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={isWeb} name="is_web" id="is_web">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientWEBCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">メモ
                  <textarea className="input-field" value={note} onChange={(e) => setNote(e.target.value)} rows="4" id="newNote" name="note" cols="50" />
                  <label id="newClientNoteErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">名称 <span className="span-require">*必須</span>
                  <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Name")} type="text" id="newName" name="name" />
                  <label id="newClientNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">名称カナ <span className="span-require">*必須</span>
                  <input className="input-field" value={nameKata} onChange={(e) => setNameKata(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "NameKata")} type="text" id="newNameKata" name="name_katakana" />
                  <label id="newClientNameKataErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">企業種別 <span className="span-require">*必須</span>
                  {/* <input className="input-field" value={companyType} onChange={(e) => setCompanyType(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType")} type="text" id="newCompanyType" name="enterprise_type" /> */}
                  <select style={{ padding: "3px 0px 3px 0px", maxHeight: "50%!important%" }} onMouseLeave={() => closeSizeSelectCom()} onMouseDown={() => setSizeSlectCom()} className="input-field" defaultValue={companyType} name="enterprise_type" id="newCompanyType">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom()} value="株式会社">株式会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限会社">有限会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合名会社">合名会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合資会社">合資会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合同会社">合同会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人">医療法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人社団">医療法人社団</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人財団">医療法人財団</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会医療法人">社会医療法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般財団法人">一般財団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益財団法人">公益財団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般社団法人">一般社団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益社団法人">公益社団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="宗教法人">宗教法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="学校法人">学校法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会福祉法人">社会福祉法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="更生保護法人">更生保護法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="相互社会">相互社会</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="特定非営利活動法人">特定非営利活動法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="独立行政法人">独立行政法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="地方独立行政法人">地方独立行政法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="弁護士法人">弁護士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限責任中間法人">有限責任中間法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="無限責任中間法人">無限責任中間法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="行政書士法人">行政書士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="司法書士法人">司法書士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="税理士法人">税理士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="国立大学法人">国立大学法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公立大学法人">公立大学法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="和歌山県">和歌山県</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="農事組合法人">農事組合法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="管理組合法人">管理組合法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会保険労務士法人">社会保険労務士法人</option>
                  </select>
                  <label id="newClientCompanyTypeErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">企業種別２ <span className="span-require">*必須</span>
                  {/* <input className="input-field" value={companyType2} onChange={(e) => setCompanyType2(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType2")} type="text" id="newCompanyType2" name="enterprise_type_2" /> */}
                  <select style={{ padding: "3px 0px 3px 0px", maxHeight: "50%!important%" }} onMouseLeave={() => closeSizeSelectCom2()} onMouseDown={() => setSizeSlectCom2()} className="input-field" defaultValue={companyType2} name="enterprise_type_2" id="newCompanyType2">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom2()} value="先頭に使う">先頭に使う</option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="末尾に使う">末尾に使う</option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="なし">なし</option>
                  </select>
                  <label id="newClientCompanyType2ErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">部署名 <span className="span-require">*必須</span>
                  <input className="input-field" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "DepartmentName")} type="text" id="newDepartmentName" name="department_name" />
                  <label id="newClientDepartmentNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">肩書 <span className="span-require">*必須</span>
                  <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Title")} type="text" id="newTitle" name="title" />
                  <label id="newClientTitleErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">担当者 <span className="span-require">*必須</span>
                  <input className="input-field" value={manager} onChange={(e) => setManager(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Manager")} type="text" id="newManager" name="responsible_person" />
                  <label id="newClientManagerErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">担当者カナ <span className="span-require">*必須</span>
                  <input className="input-field" value={managerKata} onChange={(e) => setManagerKata(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "ManagerKata")} type="text" id="newManagerKata" name="responsible_person_katakana" />
                  <label id="newClientManagerKataErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                {/* <label className="label-input">パスワード <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Password")} type="password" id="newPassword" name="password" />
                  <label id="newClientPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">パスワード(確認用)<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "ConfirmPassword")} type="password" id="newConfirmPassword" name="password_confirmation" />
                  <label id="newClientConfirmPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br /> */}
                <label className="label-input">画像（ロゴ）<span className="span-require">*必須</span>
                  <input className="input-field" type="file" id="avatar" onChange={(e) => getBaseUrl()} name="logo_url" accept="image/png, image/jpeg" />
                  <img src={urlLogo} style={{ maxHeight: "200px", marginLeft: "30%", marginTop: "5px" }}></img>
                  <label id="newClientImgLogoErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">サイトURL <span className="span-require">*必須</span>
                  <input className="input-field" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "URL")} type="text" id="newURL" name="url" />
                  <label id="newClientURLErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">郵便番号 <span className="span-require">*必須</span>
                  <input className="input-field" value={zipCode} onChange={(e) => setZipCode(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "PostCode")} type="text" id="newPostCode" name="zip_code" />
                  <label id="newClientPostCodeErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">都道府県 <span className="span-require">*必須</span>
                  {/* <input className="input-field" value={prefecture} onChange={(e) => setPrefecture(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Prefectures")} type="text" id="newPrefectures" name="prefecture" /> */}
                  <select style={{ padding: "3px 0px 3px 0px", maxHeight: "50%!important%" }} onMouseLeave={() => closeSizeSelect()} onMouseDown={() => setSizeSlect()} className="input-field" defaultValue={prefecture} name="prefecture" id="newPrefectures">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelect()} value="北海道">北海道</option>
                    <option onClick={() => setSizeAfterSelect()} value="青森県">青森県</option>
                    <option onClick={() => setSizeAfterSelect()} value="岩手県">岩手県</option>
                    <option onClick={() => setSizeAfterSelect()} value="宮城県">宮城県</option>
                    <option onClick={() => setSizeAfterSelect()} value="秋田県">秋田県</option>
                    <option onClick={() => setSizeAfterSelect()} value="山形県">山形県</option>
                    <option onClick={() => setSizeAfterSelect()} value="福島県">福島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="茨城県">茨城県</option>
                    <option onClick={() => setSizeAfterSelect()} value="栃木県">栃木県</option>
                    <option onClick={() => setSizeAfterSelect()} value="群馬県">群馬県</option>
                    <option onClick={() => setSizeAfterSelect()} value="埼玉県">埼玉県</option>
                    <option onClick={() => setSizeAfterSelect()} value="千葉県">千葉県</option>
                    <option onClick={() => setSizeAfterSelect()} value="東京都">東京都</option>
                    <option onClick={() => setSizeAfterSelect()} value="神奈川県">神奈川県</option>
                    <option onClick={() => setSizeAfterSelect()} value="新潟県">新潟県</option>
                    <option onClick={() => setSizeAfterSelect()} value="富山県">富山県</option>
                    <option onClick={() => setSizeAfterSelect()} value="石川県">石川県</option>
                    <option onClick={() => setSizeAfterSelect()} value="福井県">福井県</option>
                    <option onClick={() => setSizeAfterSelect()} value="山梨県">山梨県</option>
                    <option onClick={() => setSizeAfterSelect()} value="長野県">長野県</option>
                    <option onClick={() => setSizeAfterSelect()} value="岐阜県">岐阜県</option>
                    <option onClick={() => setSizeAfterSelect()} value="静岡県">静岡県</option>
                    <option onClick={() => setSizeAfterSelect()} value="愛知県">愛知県</option>
                    <option onClick={() => setSizeAfterSelect()} value="三重県">三重県</option>
                    <option onClick={() => setSizeAfterSelect()} value="滋賀県">滋賀県</option>
                    <option onClick={() => setSizeAfterSelect()} value="京都府">京都府</option>
                    <option onClick={() => setSizeAfterSelect()} value="大阪府">大阪府</option>
                    <option onClick={() => setSizeAfterSelect()} value="兵庫県">兵庫県</option>
                    <option onClick={() => setSizeAfterSelect()} value="奈良県">奈良県</option>
                    <option onClick={() => setSizeAfterSelect()} value="和歌山県">和歌山県</option>
                    <option onClick={() => setSizeAfterSelect()} value="鳥取県">鳥取県</option>
                    <option onClick={() => setSizeAfterSelect()} value="島根県">島根県</option>
                    <option onClick={() => setSizeAfterSelect()} value="岡山県">岡山県</option>
                    <option onClick={() => setSizeAfterSelect()} value="広島県">広島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="山口県">山口県</option>
                    <option onClick={() => setSizeAfterSelect()} value="徳島県">徳島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="香川県">香川県</option>
                    <option onClick={() => setSizeAfterSelect()} value="愛媛県">愛媛県</option>
                    <option onClick={() => setSizeAfterSelect()} value="高知県">高知県</option>
                    <option onClick={() => setSizeAfterSelect()} value="福岡県">福岡県</option>
                    <option onClick={() => setSizeAfterSelect()} value="佐賀県">佐賀県</option>
                    <option onClick={() => setSizeAfterSelect()} value="長崎県">長崎県</option>
                    <option onClick={() => setSizeAfterSelect()} value="熊本県">熊本県</option>
                    <option onClick={() => setSizeAfterSelect()} value="大分県">大分県</option>
                    <option onClick={() => setSizeAfterSelect()} value="宮崎県">宮崎県</option>
                    <option onClick={() => setSizeAfterSelect()} value="鹿児島県">鹿児島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="沖縄県">沖縄県</option>
                  </select>
                  <label id="newClientPrefecturesErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">市区町村 <span className="span-require">*必須</span>
                  <input className="input-field" value={municipality} onChange={(e) => setMunicipality(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Municipalities")} type="text" id="newMunicipalities" name="municipality" />
                  <label id="newClientMunicipalitiesErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">住所 <span className="span-require">*必須</span>
                  <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Address")} type="text" id="newAddress" name="address" />
                  <label id="newClientAddressErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">建物名 <span className="span-require">*必須</span>
                  <input className="input-field" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "BuildingName")} type="text" id="newBuildingName" name="building_name" />
                  <label id="newClientBuildingNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">メールアドレス <span className="span-require">*必須</span>
                  <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Email")} type="text" id="newEmail" name="email" />
                  <label id="newClientEmailErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">電話番号 <span className="span-require">*必須</span>
                  <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={(e) => utils.checkPhoneNumber(e.target.value, "Phone")} type="text" id="newPhone" name="phone_number" />
                  <label id="newClientPhoneErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <Button id="btnUpdate" hidden={disableInput} onClick={updateClient}> 更新</Button>
              </form>
            </div>
          </div>
        </Modal>
        <Modal open={isOpenAddUser} onClose={() => setIsOpenAddUser(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>クライアント追加</h4>
              <form id="addForm" className="swap">
                <label className="label-input">ステータス {/*Status*/}<span className="span-require">*必須</span>
                  <span className="input-field">
                    <input name="status" type="radio" id="in_contract" value={contract} onClick={(e) => setContract('active')} />
                    <label htmlFor="in_contract" className="radioButtonAddClient" >契約</label>
                    <input name="status" type="radio" id="pause_contract" value={contract} onClick={(e) => setContract('pause')} />
                    <label htmlFor="pause_contract" className="radioButtonAddClient">休止</label>
                    <input name="status" type="radio" id="finished_contract" value={contract} onClick={(e) => setContract('ended')} />
                    <label htmlFor="finished_contract" className="radioButtonAddClient">解約</label>
                    <input name="status" type="radio" id="trial_contract" value={contract} onClick={(e) => setContract('trial')} />
                    <label htmlFor="trial_contract" className="radioButtonAddClient">お試し</label>
                  </span>
                  <label id="newClientStatusErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label>
                <br /><br />
                <label className="label-input"> プラン名 {/*Plan*/}<span className="span-require">*必須</span>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'start_up_plan'} name="plan" id="plan">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="startup">スタートアッププラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="expert">エキスパートプラン</option>
                    <option value="complete">完全成果報酬プラン</option>
                  </select>
                </label><br /><br />
                <label className="label-input">プラン価格 {/**Plan price*/}
                  <input className="input-field" onBlur={(e) => utils.checkInputNumber(e.target.value, "Price")} type="number" id="newPlanPrice" name="price" />
                  <label id="newClientPriceErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">課金開始日 {/** Date start count price */}
                  <input type="date" id="startDate" name="subscription_start_at" onChange={(e) => checkInputDate(e.target.value)} className="input-field" />
                  <label id="newClientStartErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input">最低利用期間終了日
                  <input type="date" id="endDate" value={inputEndDate} name="subscription_end_at" onChange={(e) => checkEndDate(e.target.value)} className="input-field" />
                  <label id="newClientEndErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">Instagramチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="is_instagram" id="is_instagram">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientInstagramCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">LINEチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="is_line" id="is_line">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientLINECreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">TikTokチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="is_tiktok" id="is_tiktok">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label id="newClientTikTokCreateErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label><br /><br />
                <label className="label-input"><label className="long-label">WEBチャットボット機能</label>
                  <select style={{ padding: "3px 0px 3px 0px" }} className="input-field" defaultValue={'yes'} name="is_web" id="is_web">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
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
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "NameKata")} type="text" id="newNameKata" name="name_katakana" />
                  <label id="newClientNameKataErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">企業種別 <span className="span-require">*必須</span>
                  {/* <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType")} type="text" id="newCompanyType" name="enterprise_type" /> */}
                  <select style={{ padding: "3px 0px 3px 0px", maxHeight: "50%!important%" }} onMouseLeave={() => closeSizeSelectCom()} onMouseDown={() => setSizeSlectCom()} className="input-field" defaultValue={'株式会社'} name="enterprise_type" id="newCompanyType">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom()} value="株式会社">株式会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限会社">有限会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合名会社">合名会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合資会社">合資会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合同会社">合同会社</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人">医療法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人社団">医療法人社団</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人財団">医療法人財団</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会医療法人">社会医療法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般財団法人">一般財団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益財団法人">公益財団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般社団法人">一般社団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益社団法人">公益社団法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="宗教法人">宗教法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="学校法人">学校法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会福祉法人">社会福祉法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="更生保護法人">更生保護法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="相互社会">相互社会</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="特定非営利活動法人">特定非営利活動法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="独立行政法人">独立行政法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="地方独立行政法人">地方独立行政法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="弁護士法人">弁護士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限責任中間法人">有限責任中間法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="無限責任中間法人">無限責任中間法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="行政書士法人">行政書士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="司法書士法人">司法書士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="税理士法人">税理士法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="国立大学法人">国立大学法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公立大学法人">公立大学法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="和歌山県">和歌山県</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="農事組合法人">農事組合法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="管理組合法人">管理組合法人</option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会保険労務士法人">社会保険労務士法人</option>
                  </select>
                  <label id="newClientCompanyTypeErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">企業種別２ <span className="span-require">*必須</span>
                  {/* <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType2")} type="text" id="newCompanyType2" name="enterprise_type_2" /> */}
                  <select style={{ padding: "3px 0px 3px 0px", maxHeight: "50%!important%" }} onMouseLeave={() => closeSizeSelectCom2()} onMouseDown={() => setSizeSlectCom2()} className="input-field" defaultValue={'先頭に使う'} name="enterprise_type_2" id="newCompanyType2">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom2()} value="先頭に使う">先頭に使う</option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="末尾に使う">末尾に使う</option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="なし">なし</option>
                  </select>
                  <label id="newClientCompanyType2ErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">部署名 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "DepartmentName")} type="text" id="newDepartmentName" name="department_name" />
                  <label id="newClientDepartmentNameErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">肩書 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Title")} type="text" id="newTitle" name="title" />
                  <label id="newClientTitleErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">担当者 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Manager")} type="text" id="newManager" name="responsible_person" />
                  <label id="newClientManagerErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">担当者カナ <span className="span-require">*必須</span>
                  {/* waiting BE */}
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "ManagerKata")} type="text" id="newManagerKata" name="responsible_person_katakana" />
                  <label id="newClientManagerKataErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">パスワード <span className="span-require">*必須</span>
                  {/* waiting BE */}
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Password")} type="password" id="newPassword" name="password" />
                  <label id="newClientPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">パスワード(確認用)<span className="span-require">*必須</span>
                  {/* waiting BE */}
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "ConfirmPassword")} type="password" id="newConfirmPassword" name="password_confirmation" />
                  <label id="newClientConfirmPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">画像（ロゴ）<span className="span-require">*必須</span>
                  <input className="input-field" type="file" id="avatar" onChange={(e) => getBaseUrl()} name="img_logo" accept="image/png, image/jpeg" />
                  <label id="newClientImgLogoErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">サイトURL <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "URL")} type="text" id="newURL" name="url" />
                  <label id="newClientURLErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">郵便番号 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "PostCode")} type="text" id="newPostCode" name="zip_code" />
                  <label id="newClientPostCodeErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">都道府県 <span className="span-require">*必須</span>
                  {/* <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Prefectures")} type="text" id="newPrefectures" name="prefecture" /> */}
                  <select style={{ padding: "3px 0px 3px 0px", maxHeight: "50%!important%" }} onMouseLeave={() => closeSizeSelect()} onMouseDown={() => setSizeSlect()} className="input-field" defaultValue={'北海道'} name="prefecture" id="newPrefectures">
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelect()} value="北海道">北海道</option>
                    <option onClick={() => setSizeAfterSelect()} value="青森県">青森県</option>
                    <option onClick={() => setSizeAfterSelect()} value="岩手県">岩手県</option>
                    <option onClick={() => setSizeAfterSelect()} value="宮城県">宮城県</option>
                    <option onClick={() => setSizeAfterSelect()} value="秋田県">秋田県</option>
                    <option onClick={() => setSizeAfterSelect()} value="山形県">山形県</option>
                    <option onClick={() => setSizeAfterSelect()} value="福島県">福島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="茨城県">茨城県</option>
                    <option onClick={() => setSizeAfterSelect()} value="栃木県">栃木県</option>
                    <option onClick={() => setSizeAfterSelect()} value="群馬県">群馬県</option>
                    <option onClick={() => setSizeAfterSelect()} value="埼玉県">埼玉県</option>
                    <option onClick={() => setSizeAfterSelect()} value="千葉県">千葉県</option>
                    <option onClick={() => setSizeAfterSelect()} value="東京都">東京都</option>
                    <option onClick={() => setSizeAfterSelect()} value="神奈川県">神奈川県</option>
                    <option onClick={() => setSizeAfterSelect()} value="新潟県">新潟県</option>
                    <option onClick={() => setSizeAfterSelect()} value="富山県">富山県</option>
                    <option onClick={() => setSizeAfterSelect()} value="石川県">石川県</option>
                    <option onClick={() => setSizeAfterSelect()} value="福井県">福井県</option>
                    <option onClick={() => setSizeAfterSelect()} value="山梨県">山梨県</option>
                    <option onClick={() => setSizeAfterSelect()} value="長野県">長野県</option>
                    <option onClick={() => setSizeAfterSelect()} value="岐阜県">岐阜県</option>
                    <option onClick={() => setSizeAfterSelect()} value="静岡県">静岡県</option>
                    <option onClick={() => setSizeAfterSelect()} value="愛知県">愛知県</option>
                    <option onClick={() => setSizeAfterSelect()} value="三重県">三重県</option>
                    <option onClick={() => setSizeAfterSelect()} value="滋賀県">滋賀県</option>
                    <option onClick={() => setSizeAfterSelect()} value="京都府">京都府</option>
                    <option onClick={() => setSizeAfterSelect()} value="大阪府">大阪府</option>
                    <option onClick={() => setSizeAfterSelect()} value="兵庫県">兵庫県</option>
                    <option onClick={() => setSizeAfterSelect()} value="奈良県">奈良県</option>
                    <option onClick={() => setSizeAfterSelect()} value="和歌山県">和歌山県</option>
                    <option onClick={() => setSizeAfterSelect()} value="鳥取県">鳥取県</option>
                    <option onClick={() => setSizeAfterSelect()} value="島根県">島根県</option>
                    <option onClick={() => setSizeAfterSelect()} value="岡山県">岡山県</option>
                    <option onClick={() => setSizeAfterSelect()} value="広島県">広島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="山口県">山口県</option>
                    <option onClick={() => setSizeAfterSelect()} value="徳島県">徳島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="香川県">香川県</option>
                    <option onClick={() => setSizeAfterSelect()} value="愛媛県">愛媛県</option>
                    <option onClick={() => setSizeAfterSelect()} value="高知県">高知県</option>
                    <option onClick={() => setSizeAfterSelect()} value="福岡県">福岡県</option>
                    <option onClick={() => setSizeAfterSelect()} value="佐賀県">佐賀県</option>
                    <option onClick={() => setSizeAfterSelect()} value="長崎県">長崎県</option>
                    <option onClick={() => setSizeAfterSelect()} value="熊本県">熊本県</option>
                    <option onClick={() => setSizeAfterSelect()} value="大分県">大分県</option>
                    <option onClick={() => setSizeAfterSelect()} value="宮崎県">宮崎県</option>
                    <option onClick={() => setSizeAfterSelect()} value="鹿児島県">鹿児島県</option>
                    <option onClick={() => setSizeAfterSelect()} value="沖縄県">沖縄県</option>
                  </select>
                  <label id="newClientPrefecturesErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">市区町村 <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Municipalities")} type="text" id="newMunicipalities" name="municipality" />
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
                  <input className="input-field" onBlur={(e) => utils.checkPhoneNumber(e.target.value, "Phone")} type="text" id="newPhone" name="phone_number" />
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

export default ClientManagement;
