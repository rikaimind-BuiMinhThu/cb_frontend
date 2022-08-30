import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../api/api-management';
import requestNewToken from 'api/request-new-token';
import Modal from './Popup/Modal';
import ModalNoti from './Popup/ModalNoti';
import './Popup/modal.css';
import * as utils from './../JS/client.js';
import '../assets/css/general.css';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { Title } from 'chart.js';
import { Pagination } from '@material-ui/lab';
import ModalShort from './Popup/ModalShort';
import $ from 'jquery';

function ClientManagement() {
  var [dataList, setDataList] = useState([]);
  var [detailData, setDetailData] = useState({});
  var [msgNoti, setMsgNoti] = useState();
  var [detailUpdateTitle, setDetailUpdateTitle] = useState();
  var [disableInput, setDisableInput] = useState();
  var [isOpenDeleteClient, setIsOpenDeleteClient] = useState(false);

  var [contract, setContract] = useState();
  var [inputEndDate, setInputEndDate] = useState('');
  var [inputStartDate, setInputStartDate] = useState('');
  var [inputImage, setInputImage] = useState('');

  //Update, Detail
  var [status, setStatus] = useState();
  var [plan, setPlan] = useState();
  var [price, setPrice] = useState();
  var [isInstagram, setIsInstagram] = useState();
  var [isLine, setIsLine] = useState();
  var [isTiktok, setIsTiktok] = useState();
  var [isWeb, setIsWeb] = useState();
  var [note, setNote] = useState();
  var [name, setName] = useState();
  var [nameKata, setNameKata] = useState();
  var [companyType, setCompanyType] = useState();
  var [companyType2, setCompanyType2] = useState();
  var [departmentName, setDepartmentName] = useState();
  var [title, setTitle] = useState();
  var [manager, setManager] = useState();
  var [managerKata, setManagerKata] = useState();
  var [urlLogo, setUrlLogo] = useState();
  var [url, setUrl] = useState();
  var [zipCode, setZipCode] = useState();
  var [prefecture, setPrefecture] = useState();
  var [municipality, setMunicipality] = useState();
  var [address, setAddress] = useState();
  var [buildingName, setBuildingName] = useState();
  var [email, setEmail] = useState();
  var [phone, setPhone] = useState();
  var [updateId, setUpdateId] = useState();
  const [updateImageChange, setUpdateImageChange] = useState(false);

  var [namesearch, setNamesearch] = useState('');
  var [pageIndex, setPageIndex] = useState(1);
  var [totalPage, setTotalPage] = useState();

  // var [dateStart, setDateStart] = useState();
  // var [inputValueName, setInputValueName] = useState();
  // var [inputValueAddress, setInputValueAddress] = useState();
  // var [inputValuePhone, setInputValuePhone] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);

  React.useEffect(() => {
    var cook = Cookies.get('user_role');
    if (cook == 'admin_deel') {
    } else if (cook == 'admin_client') {
      window.location.href = '/admin/dashboard';
      // var elem = document.getElementById('sidebarClient');
      // elem.parentNode.removeChild(elem);
    } else if (cook == 'client') {
      window.location.href = '/admin/dashboard';
    }
  });

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
    Cookies.get('token');
    // console.log(Cookies.get('token'));
  });
  React.useEffect(() => {
    var paramSearch = { page: pageIndex };
    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/clients`, paramSearch)
      .then((res) => {
        console.log(res.data.data);
        var totalPage = Math.ceil(res.data.data.total / 25);
        setTotalPage(totalPage);
        setDataList(res.data.data);
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
        // if (error.response.data.code === 3) {
        //   requestNewToken(path)
        // }
      });
  }, []);

  React.useEffect(() => {
    console.log(inputStartDate);
  }, [inputStartDate]);

  function search() {
    var searchVal = document.getElementById('searchUser').value;
    setNamesearch(searchVal);
    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/clients?name=${searchVal}&page=${1}&client_id=`)
      .then((res) => {
        var totalPage = Math.ceil(res.data.data.total / 25);
        if (pageIndex > totalPage) {
          api
            .get(`/api/v1/managements/clients?name=${searchVal}&page=${1}&client_id=`)
            .then((resp) => {
              setDataList(resp.data.data);
            });
        } else {
          setDataList(res.data.data);
        }
        setPage(1);
        setTotalPage(totalPage);
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.data.code === 3) {
        //   requestNewToken(path)
        // }
      });
  }

  function reloadListClient(pgIndex) {
    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/clients?name=${namesearch}&page=${pgIndex}&client_id=`)
      .then((res) => {
        var totalPage = Math.ceil(res.data.data.total / 25);
        if (pgIndex > totalPage) {
          api
            .get(`/api/v1/managements/clients?name=${namesearch}&page=${totalPage}&client_id=`)
            .then((resp) => {
              setDataList(resp.data.data);
            });
        } else {
          setDataList(res.data.data);
        }
        setTotalPage(totalPage);
        // setPage(1)
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.data.code === 3) {
        //   requestNewToken(path)
        // }
      });
  }

  function getUserDetail(item) {
    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/clients/${item.id}`)
      .then((res) => {
        var data = res.data.data;
        console.log(data);
        setUpdateId(data.id);
        setDetailUpdateTitle('詳細');
        setContract(data.status);
        setPlan(data.plan);
        setPrice(data.price);
        if (data.subscription_start_at != null) {
          setInputStartDate(data.subscription_start_at.slice(0, 10));
        } else {
          // setInputStartDate(data.subscription_start_at)
          setInputStartDate('');
        }
        if (data.subscription_end_at != null) {
          setInputEndDate(data.subscription_end_at.slice(0, 10));
        } else {
          // setInputEndDate(data.subscription_end_at)
          setInputEndDate('');
        }
        // setInputStartDate(data.subscription_start_at) //.slice(0, 10)
        // setInputEndDate(data.subscription_end_at) //.slice(0, 10)
        setIsInstagram(data.is_instagram);
        setIsLine(data.is_line);
        setIsTiktok(data.is_tiktok);
        setIsWeb(data.is_web);
        setNote(data.note);
        setName(data.name);
        setNameKata(data.name_katakana);
        setCompanyType(data.enterprise_type);
        setCompanyType2(data.enterprise_type_2);
        setDepartmentName(data.department_name);
        setTitle(data.title);
        setManager(data.responsible_person);
        setManagerKata(data.responsible_person_katakana);
        setUrlLogo(`https://ec-chatbot-test.com/${data.logo_url.url}`);
        setUrl(data.url);
        setZipCode(data.zip_code);
        // console.log('prefecture: ' ,data.prefecture)
        // if (data.prefecture === null) {
        //   setPrefecture('')
        // } else { setPrefecture(data.prefecture) }
        setPrefecture(data.prefecture);
        if (data.municipality !== null) {
          setMunicipality(data.municipality);
        } else {
          setMunicipality('');
        }
        setAddress(data.address);
        setBuildingName(data.building_name);
        setEmail(data.email);
        setPhone(data.phone_number);
        setIsOpen(true);
        // console.log(data.status)
        if (data.status === 'active') {
          document.getElementById('in_contract').checked = true;
        } else if (data.status === 'pause') {
          document.getElementById('pause_contract').checked = true;
        } else if (data.status === 'ended') {
          document.getElementById('finished_contract').checked = true;
        } else if (data.status === 'trial') {
          document.getElementById('trial_contract').checked = true;
        }
        setDisableInput(true);
      })
      .catch((error) => {
        console.log(error);
      });
    // setIsOpen(true)
    // setDisableInput(true)
  }
  $('#screenAll').keydown(function (event) {
    if (event.keyCode == 9) {
      //tab pressed
      event.preventDefault(); // stops its action
    }
  });
  function updateClientUser(item) {
    // document.getElementById("screenAll").disabled = true;

    var path = window.location.pathname;
    api
      .get(`/api/v1/managements/clients/${item.id}`)
      .then((res) => {
        var data = res.data.data;
        console.log('managements/clients: ', data);
        setUpdateId(data.id);
        setDetailUpdateTitle('クライアント更新');
        setContract(data.status);
        setPlan(data.plan);
        setPrice(data.price);
        if (data.subscription_start_at != null) {
          setInputStartDate(data.subscription_start_at.slice(0, 10));
        } else {
          // setInputStartDate(data.subscription_start_at)
          setInputStartDate('');
        }
        if (data.subscription_end_at != null) {
          setInputEndDate(data.subscription_end_at.slice(0, 10));
        } else {
          // setInputEndDate(data.subscription_end_at)
          setInputEndDate('');
        }
        //.slice(0, 10)
        // setInputEndDate(data.subscription_end_at)// .slice(0, 10)
        setIsInstagram(data.is_instagram);
        setIsLine(data.is_line);
        setIsTiktok(data.is_tiktok);
        setIsWeb(data.is_web);
        setNote(data.note);
        setName(data.name);
        setNameKata(data.name_katakana);
        setCompanyType(data.enterprise_type);
        setCompanyType2(data.enterprise_type_2);
        setDepartmentName(data.department_name);
        setTitle(data.title);
        setManager(data.responsible_person);
        setManagerKata(data.responsible_person_katakana);
        setUrlLogo(`https://ec-chatbot-test.com/${data.logo_url.url}`);
        setUrl(data.url);
        setZipCode(data.zip_code);
        // if (data.prefecture === null) {
        //   setPrefecture('')
        // } else { setPrefecture(data.prefecture) }
        setPrefecture(data.prefecture);
        if (data.municipality !== null) {
          setMunicipality(data.municipality);
        } else {
          setMunicipality('');
        }
        setAddress(data.address);
        setBuildingName(data.building_name);
        setEmail(data.email);
        setPhone(data.phone_number);
        setIsOpen(true);
        // console.log(data.status)
        if (data.status === 'active') {
          document.getElementById('in_contract').checked = true;
        } else if (data.status === 'pause') {
          document.getElementById('pause_contract').checked = true;
        } else if (data.status === 'ended') {
          document.getElementById('finished_contract').checked = true;
        } else if (data.status === 'trial') {
          document.getElementById('trial_contract').checked = true;
        }
        setDisableInput(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [idDeleteClient, setIdDeleteClient] = useState();

  function deleteClientPopup(id) {
    setIsOpenDeleteClient(true);
    setIdDeleteClient(id);
  }

  function deleteClientUser() {
    setIsOpenDeleteClient(false);
    var path = window.location.pathname;
    api
      .delete(`/api/v1/managements/clients/${idDeleteClient}`)
      .then((res) => {
        reloadListClient(pageIndex);
        setMsgNoti('削除しました!');
        setIsOpenNoti(true);
        setTimeout(() => {
          setMsgNoti('');
          setIsOpenNoti(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.code === 3) {
          requestNewToken(path);
        }
      });
  }

  function updateClient() {
    var path = window.location.pathname;

    var price = document.getElementById('newPlanPrice').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var name = document.getElementById('newName').value;
    var nameKata = document.getElementById('newNameKata').value;
    var companyType = document.getElementById('newCompanyType').value;
    var companyType2 = document.getElementById('newCompanyType2').value;
    var department = document.getElementById('newDepartmentName').value;
    var title = document.getElementById('newTitle').value;
    var manager = document.getElementById('newManager').value;
    var managerKata = document.getElementById('newManagerKata').value;
    var url = document.getElementById('newURL').value;
    var zipCode = document.getElementById('newPostCode').value;
    var prefectures = document.getElementById('newPrefectures').value;
    var municipalities = document.getElementById('newMunicipalities').value;
    var address = document.getElementById('newAddress').value;
    var building = document.getElementById('newBuildingName').value;
    var emaill = document.getElementById('newEmail').value;
    var phone = document.getElementById('newPhone').value;

    var managerkatabytes = encodeURI(managerKata).split(/%..|./).length - 1;
    var namekatabytes = encodeURI(nameKata).split(/%..|./).length - 1;

    var nameKata;
    var managerKata;
    // if (ava === "") {
    //   document.getElementById("newClientImgLogoErrMsg").innerHTML = "Please choose an image"
    //   document.getElementById("newClientImgLogoErrMsg").style.display = "block"
    // }
    var emailCheck;
    var emailCheckLen;
    let dateCheck = false;
    if (utils.checkDateEndIn(inputEndDate, inputStartDate) === true) {
      dateCheck = true;
    }

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    if (
      document.getElementById('newEmail') != null &&
      document.getElementById('newEmail').value.length > 0 &&
      document.getElementById('newEmail').value.length < 35
    ) {
      emailCheckLen = true;
      if (emaill.match(mailformat)) {
        document.getElementById('newClientメールアドレスErrMsg').style.display = 'none';
        document.getElementById('newClientメールアドレスErrMsg').innerHTML = '';
        emailCheck = true;
      } else {
        //newClientEmailErrMsg
        emailCheck = false;
      }
    } else {
      emailCheckLen = false;
    }

    if (namekatabytes != nameKata.length * 3) {
      nameKata = false;
    } else {
      document.getElementById('newClient名称カナErrMsg').style.display = 'none';
      document.getElementById('newClient名称カナErrMsg').innerHTML = '';
      nameKata = true;
    }

    if (managerkatabytes != managerKata.length * 3) {
      managerKata = false;
    } else {
      document.getElementById('newClient名称カナErrMsg').style.display = 'none';
      document.getElementById('newClient名称カナErrMsg').innerHTML = '';
      managerKata = true;
    }
    checkNameAdd(name, '名称');
    checkNameAdd(nameKata, '名称カナ');
    checkFieldAdd(companyType, 'CompanyType');
    checkFieldAdd(companyType2, 'CompanyType2');
    checkFieldAdd(department, '部署名');
    checkFieldAdd(title, 'タイトル');
    checkNameAdd(manager, '担当者');
    checkNameAdd(managerKata, '担当者カナ');
    checkFieldAdd(url, 'URL');
    checkFieldAdd(address, '住所');
    checkFieldAdd(municipalities, '都道府県');
    checkInputNumber(zipCode, '郵便番号');
    checkFieldAdd(prefectures, 'Prefectures');
    checkFieldAdd(building, '建物名');
    checkNameAdd(email, 'メールアドレス');
    utils.checkPhoneNumber(phone, '電話番号');
    if (
      checkNameAdd(name, '名称') === true &&
      checkNameAdd(nameKata, '名称カナ') === true &&
      checkFieldAdd(companyType, 'CompanyType') === true &&
      checkFieldAdd(companyType2, 'CompanyType2') === true &&
      checkFieldAdd(department, '部署名') === true &&
      checkFieldAdd(title, 'タイトル') === true &&
      checkNameAdd(manager, '担当者') === true &&
      checkNameAdd(managerKata, '担当者カナ') === true &&
      checkFieldAdd(url, 'URL') === true &&
      checkFieldAdd(address, '住所') === true &&
      checkFieldAdd(municipalities, '都道府県') === true &&
      checkFieldAdd(zipCode, '郵便番号') === true &&
      checkFieldAdd(prefectures, 'Prefectures') === true &&
      checkFieldAdd(building, '建物名') === true &&
      checkNameAdd(email, 'メールアドレス') === true &&
      utils.checkPhoneNumber(phone, '電話番号') === true &&
      nameKata == true &&
      managerKata == true &&
      emailCheck == true &&
      emailCheckLen == true &&
      dateCheck === true
    ) {
      var elements = document.getElementById('detailUserClient').elements;
      // console.log(elements);
      var obj = {};
      for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }

      // var passwordU = obj.password
      // var conf_password = obj.password_confirmation
      // var usr = { "password": passwordU, "password_confirmation": conf_password }
      // delete obj.password_confirmation
      // delete obj.password
      if (updateImageChange) {
        obj.logo_url = inputImage;
      }
      obj.email = emaill;
      // var updateClient = { client: obj };
      // console.log(newClient)

      var updateClient = { client: obj };
      console.log(updateClient);
      api
        .patch(`/api/v1/managements/clients/${updateId}`, updateClient)
        .then((res) => {
          reloadListClient(pageIndex);
          setMsgNoti('クライアント更新しました!');
          setIsOpen(false);
          setIsOpenNoti(true);
        })
        .catch((error) => {
          // alert(error)
          console.log(error);
          // if (error.response.data.code === 3) {
          //   requestNewToken(path)
          // }
        });
    } else {
      if (emailCheck == false) {
        checkNameAdd(email, 'メールアドレス');
        if (checkNameAdd(email, 'メールアドレス')) {
          document.getElementById('newClientメールアドレスErrMsg').style.display = 'block';
          document.getElementById('newClientメールアドレスErrMsg').innerHTML =
            'メールを入力してください(例:abc＠abc.com)';
        }
      }
      if (checkNameAdd(name, '名称') !== true) {
        checkNameAdd(name, '名称');
      }
      if (checkNameAdd(manager, '担当者') !== true) {
        checkNameAdd(manager, '担当者');
      }
      if (nameKata == false) {
        checkNameAdd(nameKata, '名称カナ');
        if (checkNameAdd(nameKata, '名称カナ')) {
          document.getElementById('newClient名称カナErrMsg').style.display = 'block';
          document.getElementById('newClient名称カナErrMsg').innerHTML =
            '名称カナを入力してください。';
        }
      }
      if (managerKata == false) {
        checkNameAdd(managerKata, '担当者カナ');
        if (checkNameAdd(managerKata, '担当者カナ')) {
          document.getElementById('newClient担当者カナErrMsg').style.display = 'block';
          document.getElementById('newClient担当者カナErrMsg').innerHTML =
            '名称カナを入力してください。';
        }
      }
      if (emailCheckLen == false) {
        checkNameAdd(email, 'メールアドレス');
        // document.getElementById('newClientメールアドレスErrMsg').style.display = 'block';
        // document.getElementById('newClientメールアドレスErrMsg').innerHTML =
        //   'メールを入力してください(例:abc＠abc.com)';
      }
      if (utils.checkPhoneNumber(phone, '電話番号') !== true) {
        utils.checkPhoneNumber(phone, '電話番号');
      }
      if (dateCheck === false) {
        utils.checkDateEndIn(inputEndDate, inputStartDate);
      }
      if (updateImageChange && getBaseUrlAdd() === false) {
        getBaseUrlAdd();
      }
      console.log('Missing field');
    }

    // }
  }

  function checkFieldUpdate(value, field) {
    if (value === '') {
      document.getElementById(`${field}ErrMsg`).style.display = 'block';
      document.getElementById(`${field}ErrMsg`).innerHTML = `${field} cannot be empty`;
    } else {
      document.getElementById(`${field}ErrMsg`).style.display = 'none';
      document.getElementById(`${field}ErrMsg`).innerHTML = '';
      return true;
    }
  }

  function addClient() {
    var path = window.location.pathname;
    const reader = new FileReader();

    var ava = document.getElementById('avatar_add').value;
    var price = document.getElementById('newPlanPrice').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var name = document.getElementById('newName').value;
    var nameKata = document.getElementById('newNameKata').value;
    var companyType = document.getElementById('newCompanyType').value;
    var companyType2 = document.getElementById('newCompanyType2').value;
    var department = document.getElementById('newDepartmentName').value;
    var title = document.getElementById('newTitle').value;
    var manager = document.getElementById('newManager').value;
    var managerKata = document.getElementById('newManagerKata').value;
    var password = document.getElementById('newPassword').value;
    var cfPassword = document.getElementById('newConfirmPassword').value;
    var url = document.getElementById('newURL').value;
    var zipCode = document.getElementById('newPostCode').value;
    var prefectures = document.getElementById('newPrefectures').value;
    var municipalities = document.getElementById('newMunicipalities').value;
    var address = document.getElementById('newAddress').value;
    var building = document.getElementById('newBuildingName').value;
    var email = document.getElementById('newEmail').value;
    var phone = document.getElementById('newPhone').value;

    var managerkatabytes = encodeURI(managerKata).split(/%..|./).length - 1;
    var namekatabytes = encodeURI(nameKata).split(/%..|./).length - 1;

    var nameKata;
    var managerKata;
    var passwdLengthCheck;
    var cfPass;
    var emailCheck;
    let dateCheck = false;
    if (utils.checkDateEndIn(inputEndDate, inputStartDate) === true) {
      dateCheck = true;
    }

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    if (email.length > 35) {
      emailCheck = false;
    }
    if (email.match(mailformat)) {
      document.getElementById('newClientメールアドレスErrMsg').style.display = 'none';
      document.getElementById('newClientメールアドレスErrMsg').innerHTML = '';
      emailCheck = true;
    } else {
      //newClientEmailErrMsg
      emailCheck = false;
    }
    if (password.length < 6 || password.length > 24) {
      passwdLengthCheck = false;
    } else {
      document.getElementById('newClientパスワードErrMsg').style.display = 'none';
      document.getElementById('newClientパスワードErrMsg').innerHTML = '';
      passwdLengthCheck = true;
    }
    if (cfPassword != password) {
      cfPass = false;
    } else {
      document.getElementById('newClientパスワード(確認用)ErrMsg').style.display = 'none';
      document.getElementById('newClientパスワード(確認用)ErrMsg').innerHTML = '';
      cfPass = true;
    }

    if (ava === '') {
      document.getElementById('newClientImgLogoErrMsg').innerHTML = '画像を選択してください。';
      document.getElementById('newClientImgLogoErrMsg').style.display = 'block';
    }

    if (namekatabytes != nameKata.length * 3) {
      nameKata = false;
    } else {
      document.getElementById('newClient名称カナErrMsg').style.display = 'none';
      document.getElementById('newClient名称カナErrMsg').innerHTML = '';
      nameKata = true;
    }

    if (managerkatabytes != managerKata.length * 3 || managerKata.length == 0) {
      managerKata = false;
    } else {
      document.getElementById('newClient担当者カナErrMsg').style.display = 'none';
      document.getElementById('newClient担当者カナErrMsg').innerHTML = '';
      managerKata = true;
    }
    checkNameAdd(name, '名称');
    checkNameAdd(nameKata, '名称カナ');
    checkFieldAdd(companyType, 'CompanyType');
    checkFieldAdd(companyType2, 'CompanyType2');
    checkFieldAdd(department, '部署名');
    checkFieldAdd(title, 'タイトル');
    checkNameAdd(manager, '担当者');
    checkNameAdd(managerKata, '担当者カナ');
    checkFieldAdd(password, 'パスワード');
    checkFieldAdd(cfPassword, 'パスワード(確認用)');
    checkFieldAdd(url, 'URL');
    checkFieldAdd(address, '住所');
    checkFieldAdd(municipalities, '都道府県');
    checkInputNumber(zipCode, '郵便番号');
    checkFieldAdd(prefectures, 'Prefectures');
    checkFieldAdd(building, '建物名');
    checkNameAdd(email, 'メールアドレス');
    checkFieldAdd(phone, '電話番号');
    // console.log("nameKata: ", nameKata, ", managerKata: ", managerKata)
    if (
      checkPickStatus() === true &&
      checkNameAdd(name, '名称') === true &&
      checkNameAdd(nameKata, '名称カナ') === true &&
      checkFieldAdd(companyType, 'CompanyType') === true &&
      checkFieldAdd(companyType2, 'CompanyType2') === true &&
      checkFieldAdd(department, '部署名') === true &&
      checkFieldAdd(title, 'タイトル') === true &&
      checkNameAdd(manager, '担当者') === true &&
      checkNameAdd(managerKata, '担当者カナ') === true &&
      checkFieldAdd(password, 'パスワード') === true &&
      checkFieldAdd(cfPassword, 'パスワード(確認用)') === true &&
      checkFieldAdd(url, 'URL') === true &&
      checkFieldAdd(address, '住所') === true &&
      checkFieldAdd(municipalities, '都道府県') === true &&
      checkInputNumber(zipCode, '郵便番号') === true &&
      checkFieldAdd(prefectures, 'Prefectures') === true &&
      checkFieldAdd(building, '建物名') === true &&
      checkNameAdd(email, 'メールアドレス') === true &&
      utils.checkPhoneNumber(phone, '電話番号') === true &&
      ava !== '' &&
      getBaseUrlAdd() === true &&
      nameKata == true &&
      managerKata == true &&
      passwdLengthCheck == true &&
      emailCheck == true &&
      dateCheck === true &&
      price > 0 &&
      zipCode > 0
    ) {
      // if (checkFieldAdd(name, 'Name') === true && checkFieldAdd(address, "Address") === true && utils.checkInputNumber(phone, "Phone") === true) {
      var elements = document.getElementById('addForm').elements;
      var obj = {};
      for (var i = 0; i < elements.length - 1; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      var passwordU = obj.password;
      var conf_password = obj.password_confirmation;
      var usr = { password: passwordU, password_confirmation: conf_password };
      delete obj.password_confirmation;
      delete obj.password;
      obj.logo_url = inputImage;
      var newClient = { client: obj, user: usr };
      console.log(newClient);

      api
        .post(`/api/v1/managements/clients`, newClient)
        .then((res) => {
          if (res.data.code === 1 || res.data.code === '1') {
            reloadListClient();
            setMsgNoti('クライアント追加しました!');
            setIsOpenAddUser(false);
            setIsOpenNoti(true);
          } else {
            if (res.data.message.includes(`Client name has`)) {
              setMsgNoti('クライアント名は一意です。');
            } else {
              setMsgNoti(res.data.message);
            }
            setIsOpenAddUser(false);
            setIsOpenNoti(true);
          }
        })
        .catch((error) => {
          // alert(error)
          console.log(error);
          // if (error.response.data.code === 3) {
          //   requestNewToken(path)
          // }
        });

      // }
    } else {
      if (emailCheck == false) {
        checkNameAdd(email, 'メールアドレス');
        if (checkNameAdd(email, 'メールアドレス')) {
          document.getElementById('newClientメールアドレスErrMsg').style.display = 'block';
          document.getElementById('newClientメールアドレスErrMsg').innerHTML =
            'メールを入力してください(例:abc＠abc.com)';
        }
      }
      if (passwdLengthCheck == false) {
        document.getElementById('newClientパスワードErrMsg').style.display = 'block';
        document.getElementById('newClientパスワードErrMsg').innerHTML =
          '24文字以下入力してください。6文字以上入力してください。';
      }
      if (cfPass == false) {
        document.getElementById('newClientパスワード(確認用)ErrMsg').style.display = 'block';
        document.getElementById('newClientパスワード(確認用)ErrMsg').innerHTML =
          '確認用パスワードが一致しません';
      }
      if (checkNameAdd(name, '名称') !== true) {
        checkNameAdd(name, '名称');
      }
      if (checkNameAdd(manager, '担当者') !== true) {
        checkNameAdd(manager, '担当者');
      }
      if (nameKata == false) {
        checkNameAdd(nameKata, '名称カナ');
        if (checkNameAdd(nameKata, '名称カナ')) {
          document.getElementById('newClient名称カナErrMsg').style.display = 'block';
          document.getElementById('newClient名称カナErrMsg').innerHTML =
            '名称カナを入力してください。';
        }
      }
      if (managerKata == false) {
        checkNameAdd(managerKata, '担当者カナ');
        if (checkNameAdd(managerKata, '担当者カナ')) {
          document.getElementById('newClient担当者カナErrMsg').style.display = 'block';
          document.getElementById('newClient担当者カナErrMsg').innerHTML =
            '名称カナを入力してください。';
        }
      }
      if (utils.checkPhoneNumber(phone, '電話番号') !== true) {
        utils.checkPhoneNumber(phone, '電話番号');
      }
      if (dateCheck === false) {
        utils.checkDateEndIn(inputEndDate, inputStartDate);
      }
      if (getBaseUrlAdd() === false) {
        getBaseUrlAdd();
      }
      if (price <= 0) {
        document.getElementById('newClientプラン価格ErrMsg').style.display = 'block';
        document.getElementById('newClientプラン価格ErrMsg').innerHTML = '正数を入力してください。';
      }
      if (zipCode <= 0) {
        document.getElementById('newClient郵便番号ErrMsg').style.display = 'block';
        document.getElementById('newClient郵便番号ErrMsg').innerHTML = '正数を入力してください。';
      }
    }
  }

  function checkPickStatus() {
    var status = '';
    if (document.getElementById('in_contract').checked) {
      status = document.getElementById('in_contract').value;
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none';
      document.getElementById(`newClientStatusErrMsg`).innerHTML = '';
      return true;
    } else if (document.getElementById('pause_contract').checked) {
      status = document.getElementById('pause_contract').value;
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none';
      document.getElementById(`newClientStatusErrMsg`).innerHTML = '';
      return true;
    } else if (document.getElementById('finished_contract').checked) {
      status = document.getElementById('finished_contract').value;
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none';
      document.getElementById(`newClientStatusErrMsg`).innerHTML = '';
      return true;
    } else if (document.getElementById('trial_contract').checked) {
      status = document.getElementById('trial_contract').value;
      document.getElementById(`newClientStatusErrMsg`).style.display = 'none';
      document.getElementById(`newClientStatusErrMsg`).innerHTML = '';
      return true;
    } else {
      document.getElementById(`newClientStatusErrMsg`).style.display = 'block';
      document.getElementById(`newClientStatusErrMsg`).innerHTML = `ステータスを選択してください。`;
    }
  }

  function checkFieldAdd(value, field) {
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} 入力してください。`;
    } else if (value && value.length > 50) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `50文字以下入力してください。`;
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
      return true;
    }
  }

  function checkNameAdd(value, field) {
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} 入力してください。`;
    } else if (value && value.length > 35) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `35文字以下入力してください。`;
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
      return true;
    }
  }

  function checkPasswordAdd(value, field) {
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} 入力してください。`;
    } else if (value && value.length > 24) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(
        `newClient${field}ErrMsg`
      ).innerHTML = `24文字以下入力してください。6文字以上入力してください。`;
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
      return true;
    }
  }

  function setSizeSlect() {
    document.getElementById('newPrefectures').size = '10';
  }
  function setSizeSlectCom() {
    document.getElementById('newCompanyType').size = '10';
  }
  function setSizeSlectCom2() {
    document.getElementById('newCompanyType2').size = '3';
  }
  function setSizeAfterSelect() {
    document.getElementById('newPrefectures').size = '1';
  }
  function setSizeAfterSelectCom() {
    document.getElementById('newCompanyType').size = '1';
  }
  function setSizeAfterSelectCom2() {
    document.getElementById('newCompanyType2').size = '1';
  }
  function closeSizeSelect() {
    document.getElementById('newPrefectures').size = '1';
  }
  function closeSizeSelectCom() {
    document.getElementById('newCompanyType').size = '1';
  }
  function closeSizeSelectCom2() {
    document.getElementById('newCompanyType2').size = '1';
  }

  function checkInputNumber(value, field) {
    // var phoneRe = /^\d+$/;
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(
        `newClient${field}ErrMsg`
      ).innerHTML = `${field} を入力してください。`;
    } else if (parseInt(value) == isNaN) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(
        `newClient${field}ErrMsg`
      ).innerHTML = `${field} 番号になければなりません。`;
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
      return true;
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
    utils.checkDateEndIn(inputEndDate, document.getElementById('startDate').value.toString());
    setInputStartDate(inputdate);
    if (document.getElementById('startDate').value.toString() === '') {
      document.getElementById(`newClientStartErrMsg`).style.display = 'block';
      document.getElementById(`newClientStartErrMsg`).innerHTML = `開始日を入力してください。`;
    } else {
      document.getElementById(`newClientStartErrMsg`).style.display = 'none';
      document.getElementById(`newClientStartErrMsg`).innerHTML = ``;
    }
  }

  function checkEndDate(endDateIn) {
    utils.checkDateEndIn(endDateIn, inputStartDate);
    if (utils.checkDateEndIn(endDateIn, inputStartDate) === true) {
      setInputEndDate(endDateIn);
    }
    setInputEndDate(endDateIn);
  }

  function setContractInput(data) {
    setContract(data);
  }

  function addUserPopup() {
    setContract('');
    setInputStartDate('');
    setInputEndDate('');
    setIsOpenAddUser(true);
    //detailUserClient
  }

  function getBaseUrlAdd() {
    console.log('getNe');
    var file = document.querySelector('input[type=file]')['files'][0];
    if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
      var reader = new FileReader();
      var baseString;
      reader.onloadend = function () {
        baseString = reader.result;
        setInputImage(baseString);
        console.log(baseString);
        if (baseString !== undefined || baseString !== '') {
          document.getElementById('newClientImgLogoErrMsg').style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
      return true;
    } else {
      document.getElementById('newClientImgLogoErrMsg').innerHTML = '画像を選択してください。';
      document.getElementById('newClientImgLogoErrMsg').style.display = 'block';
      return false;
    }
  }

  function getBaseUrl(event) {
    console.log('getNe');
    var file = document.querySelector('input[type=file]')['files'][0];
    if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
      var reader = new FileReader();
      var baseString;
      var imgUrl = URL.createObjectURL(event.target.files[0]);
      document.getElementById(`imgUpdatesrc`).src = imgUrl;
      reader.onloadend = function () {
        baseString = reader.result;
        setInputImage(baseString);
        console.log(baseString);
        if (baseString !== undefined || baseString !== '') {
          document.getElementById('newClientImgLogoErrMsg').style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
      return true;
    } else {
      document.getElementById('newClientImgLogoErrMsg').innerHTML = '画像を選択してください。';
      document.getElementById('newClientImgLogoErrMsg').style.display = 'block';
      return false;
    }
  }

  var [page, setPage] = useState(1);

  function handleChange(event, value) {
    console.log('pageIndex: ', value);
    setPage(parseInt(value));
    setPageIndex(value);
    reloadListClient(value);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.main-panel').scrollTop = 0;
  }

  function selectImgUpdate(e) {
    e.preventDefault();
    document.getElementById(`avatar`).click();
  }

  const items = dataList.clients;
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="swap" style={{ display: 'flex', width: '100%' }}>
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
                  <div className="div_right" style={{ float: 'right' }}>
                    <Button
                      type="text"
                      onClick={() => addUserPopup()}
                      style={{ backgroundColor: '#66615b' }}
                    >
                      クライアント追加
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: '5%' }}>ID</th>
                      <th style={{ width: '7%' }}> 画像</th>
                      <th style={{ width: '10%' }}>名称</th>
                      <th style={{ width: '10%' }}>プラン</th>
                      {/* <th style={{ width: "10%" }}><select className="text-primary" style={{ border: "none", fontWeight: "bold" }} defaultValue={''}>
                        <option value="">プラン</option>
                        <option value={0}>スタートアッププラン</option>
                        <option value={1}>プレミアムプラン</option>
                        <option value={2}>エキスパートプラン のいづれかを表示</option>
                      </select></th> */}
                      <th>プラン価格</th>
                      {/**Plan price */}
                      <th>課金開始日</th>
                      {/**Date start count price */}
                      <th style={{ width: '10%' }}>最低利用期間終了日</th>
                      {/**Date end using */}
                      <th style={{ minWidth: '200px', width: '200px' }}>住所</th>
                      {/**Address */}
                      <th style={{ width: '10%' }}>コンバージョン数</th>
                      <th style={{ width: '10%' }}>最終ログイン日時</th>
                      {/**Last login date_time */}
                      <th className="actionListClient">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items.map((item) => (
                        <tr key={item.id} style={{ overflow: 'hidden', height: '14px' }}>
                          <td>{item.id}</td>
                          <td style={{ margin: '0', padding: '0' }}>
                            <img
                              src={`https://ec-chatbot-test.com${item.logo_url.url}`}
                              style={{ height: '60px', width: '60px', objectFit: 'cover' }}
                              alt=""
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>
                            {item.plan == 'startup'
                              ? 'スタートアップ'
                              : item.plan == 'expert'
                              ? 'エキスパート'
                              : item.plan == 'complete'
                              ? '完全成果報酬'
                              : 'プレミアム'}
                          </td>
                          <td>{item.price}</td>
                          <td id="dateStart">
                            {item.subscription_start_at == null
                              ? item.subscription_start_at
                              : item.subscription_start_at.slice(0, 10)}
                          </td>
                          {/* .slice(0, 10) */}
                          <td id="dateEnd">
                            {item.subscription_end_at == null
                              ? item.subscription_end_at
                              : item.subscription_end_at.slice(0, 10)}
                          </td>
                          {/* .slice(0, 10) */}
                          <td style={{ minWidth: '200px', width: '200px' }}>
                            <div>
                              {item.prefecture} {item.address} {item.building_name}
                            </div>
                          </td>
                          <td>{item.instagram_conversion_count}</td>
                          <td>{item.last_sign_in_at?.replaceAll('/', '-')}</td>
                          <td className="actionListClient">
                            <div style={{ display: 'flex' }}>
                              <div onClick={() => getUserDetail(item)}>
                                <i
                                  className="nc-icon nc-badge nc-3x"
                                  style={{
                                    fontSize: '30px',
                                    marginTop: '5px',
                                    marginRight: '30px',
                                  }}
                                ></i>
                              </div>
                              {/* <Button onClick={() => getUserDetail(item)}>詳細</Button> */}
                              <div onClick={() => updateClientUser(item)}>
                                <i
                                  className="nc-icon nc-align-center nc-3x"
                                  style={{
                                    fontSize: '30px',
                                    marginTop: '5px',
                                    marginRight: '30px',
                                  }}
                                ></i>
                              </div>
                              {/* <Button className="editBtn" onClick={() => updateClientUser(item)}>
                                編集
                              </Button> */}
                              <div onClick={() => deleteClientPopup(item.id)}>
                                <i
                                  className="nc-icon nc-box nc-3x"
                                  style={{ fontSize: '30px', marginTop: '5px', cursor: 'pointer' }}
                                ></i>
                              </div>
                              {/* <Button
                                className="deleteBtn"
                                onClick={() => deleteClientPopup(item.id)}
                              >
                                削除
                              </Button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {/* Modal key={item.id} */}
                  </tbody>
                </Table>

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
        <Modal key={detailData.id} open={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ width: '100%' }}>
            <div style={{ marginTop: '-30px' }}>
              <h4>{detailUpdateTitle}</h4>
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#bbb',
                  marginBottom: '15px',
                }}
              ></div>
              <form id="detailUserClient" className="swap">
                <div style={{ display: 'flex' }}>
                  <label style={{ width: '30%' }}>
                    ステータス {/*Status*/}
                    <span className="span-require">*必須</span>
                  </label>
                  <span value={contract}>
                    <input
                      name="status"
                      type="radio"
                      disabled={disableInput == true ? true : false}
                      id="in_contract"
                      value={contract}
                      onClick={(e) => setContract('active')}
                    />
                    <label htmlFor="in_contract" className="radioButtonAddClient">
                      契約
                    </label>
                    <input
                      name="status"
                      type="radio"
                      disabled={disableInput == true ? true : false}
                      id="pause_contract"
                      value={contract}
                      onClick={(e) => setContract('pause')}
                    />
                    <label htmlFor="pause_contract" className="radioButtonAddClient">
                      休止
                    </label>
                    <input
                      name="status"
                      type="radio"
                      disabled={disableInput == true ? true : false}
                      id="finished_contract"
                      value={contract}
                      onClick={(e) => setContract('ended')}
                    />
                    <label htmlFor="finished_contract" className="radioButtonAddClient">
                      解約
                    </label>
                    <input
                      name="status"
                      type="radio"
                      disabled={disableInput == true ? true : false}
                      id="trial_contract"
                      value={contract}
                      onClick={(e) => setContract('trial')}
                    />
                    <label htmlFor="trial_contract" className="radioButtonAddClient">
                      お試し
                    </label>
                  </span>
                </div>
                <label
                  id="newClientStatusErrMsg"
                  className="input-field"
                  style={{ display: 'none', color: 'red' }}
                ></label>
                <br />
                <label className="label-input">
                  {' '}
                  プラン名 {/*Plan*/}
                  <span className="span-require">*必須</span>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    disabled={disableInput == true ? true : false}
                    className="input-field"
                    defaultValue={plan}
                    name="plan"
                    id="plan"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="startup">スタートアッププラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="expert">エキスパートプラン</option>
                    <option value="complete">完全成果報酬プラン</option>
                  </select>
                </label>
                <br />
                <br />
                <label className="label-input">
                  プラン価格 {/**Plan price*/}
                  <input
                    className="input-field"
                    value={price}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={(e) => utils.checkInputNumber(e.target.value, 'プラン価格')}
                    type="text"
                    id="newPlanPrice"
                    name="price"
                  />
                  <label
                    id="newClientプラン価格ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  課金開始日 {/** Date start count price */}
                  <input
                    type="text"
                    value={
                      inputStartDate !== '' ? inputStartDate?.replace(/-/g, '/') : 'yyyy/mm/dd'
                    }
                    onChange={() => {}}
                    className="input-field"
                    disabled={disableInput === true ? true : false}
                    readOnly
                  />
                  <input
                    style={{ position: 'absolute', right: '0', opacity: '0', zIndex: '1' }}
                    disabled={disableInput == true ? true : false}
                    type="date"
                    id="startDate"
                    name="subscription_start_at"
                    value={inputStartDate}
                    onChange={(e) => checkInputDate(e.target.value)}
                    className="input-field"
                  />
                  <label
                    id="newClientStartErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  最低利用期間終了日
                  <input
                    type="text"
                    value={inputEndDate !== '' ? inputEndDate?.replace(/-/g, '/') : 'yyyy/mm/dd'}
                    onChange={() => {}}
                    className="input-field"
                    disabled={disableInput === true ? true : false}
                    readOnly
                  />
                  <input
                    style={{ position: 'absolute', right: '0', opacity: '0', zIndex: '1' }}
                    disabled={disableInput == true ? true : false}
                    type="date"
                    id="endDate"
                    value={inputEndDate}
                    name="subscription_end_at"
                    onChange={(e) => checkEndDate(e.target.value)}
                    className="input-field"
                  />
                  <label
                    id="newClientEndErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">Instagramチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    disabled={disableInput == true ? true : false}
                    className="input-field"
                    defaultValue={isInstagram}
                    name="is_instagram"
                    id="is_instagram"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientInstagramCreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">LINEチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    disabled={disableInput == true ? true : false}
                    className="input-field"
                    defaultValue={isLine}
                    name="is_line"
                    id="is_line"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientLINECreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">TikTokチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    disabled={disableInput == true ? true : false}
                    className="input-field"
                    defaultValue={isTiktok}
                    name="is_tiktok"
                    id="is_tiktok"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientTikTokCreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">WEBチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    disabled={disableInput == true ? true : false}
                    className="input-field"
                    defaultValue={isWeb}
                    name="is_web"
                    id="is_web"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientWEBCreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  メモ
                  <textarea
                    className="input-field"
                    disabled={disableInput == true ? true : false}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows="4"
                    id="newNote"
                    name="note"
                    cols="50"
                  />
                  <label
                    id="newClientNoteErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  名称 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    disabled={disableInput == true ? true : false}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={(e) => checkNameAdd(e.target.value, '名称')}
                    type="text"
                    id="newName"
                    name="name"
                  />
                  <label
                    id="newClient名称ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  名称カナ <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    disabled={disableInput == true ? true : false}
                    value={nameKata}
                    onChange={(e) => setNameKata(e.target.value)}
                    onBlur={(e) => checkNameAdd(e.target.value, '名称カナ')}
                    type="text"
                    id="newNameKata"
                    name="name_katakana"
                  />
                  <label
                    id="newClient名称カナErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  企業種別 <span className="span-require">*必須</span>
                  {/* <input className="input-field" value={companyType} onChange={(e) => setCompanyType(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType")} type="text" id="newCompanyType" name="enterprise_type" /> */}
                  <select
                    style={{ padding: '3px 0px 3px 0px', maxHeight: '50%!important%' }}
                    disabled={disableInput == true ? true : false}
                    onMouseLeave={() => closeSizeSelectCom()}
                    onMouseDown={() => setSizeSlectCom()}
                    className="input-field"
                    defaultValue={companyType}
                    name="enterprise_type"
                    id="newCompanyType"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom()} value="株式会社">
                      株式会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限会社">
                      有限会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合名会社">
                      合名会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合資会社">
                      合資会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合同会社">
                      合同会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人">
                      医療法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人社団">
                      医療法人社団
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人財団">
                      医療法人財団
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会医療法人">
                      社会医療法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般財団法人">
                      一般財団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益財団法人">
                      公益財団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般社団法人">
                      一般社団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益社団法人">
                      公益社団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="宗教法人">
                      宗教法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="学校法人">
                      学校法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会福祉法人">
                      社会福祉法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="更生保護法人">
                      更生保護法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="相互社会">
                      相互社会
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="特定非営利活動法人">
                      特定非営利活動法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="独立行政法人">
                      独立行政法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="地方独立行政法人">
                      地方独立行政法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="弁護士法人">
                      弁護士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限責任中間法人">
                      有限責任中間法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="無限責任中間法人">
                      無限責任中間法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="行政書士法人">
                      行政書士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="司法書士法人">
                      司法書士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="税理士法人">
                      税理士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="国立大学法人">
                      国立大学法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公立大学法人">
                      公立大学法人
                    </option>
                    {/* <option onClick={() => setSizeAfterSelectCom()} value="和歌山県">和歌山県</option> */}
                    <option onClick={() => setSizeAfterSelectCom()} value="農事組合法人">
                      農事組合法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="管理組合法人">
                      管理組合法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会保険労務士法人">
                      社会保険労務士法人
                    </option>
                  </select>
                  <label
                    id="newClientCompanyTypeErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  企業種別２ <span className="span-require">*必須</span>
                  {/* <input className="input-field" value={companyType2} onChange={(e) => setCompanyType2(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType2")} type="text" id="newCompanyType2" name="enterprise_type_2" /> */}
                  <select
                    style={{ padding: '3px 0px 3px 0px', maxHeight: '50%!important%' }}
                    disabled={disableInput == true ? true : false}
                    onMouseLeave={() => closeSizeSelectCom2()}
                    onMouseDown={() => setSizeSlectCom2()}
                    className="input-field"
                    defaultValue={companyType2}
                    name="enterprise_type_2"
                    id="newCompanyType2"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom2()} value="先頭に使う">
                      先頭に使う
                    </option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="末尾に使う">
                      末尾に使う
                    </option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="なし">
                      なし
                    </option>
                  </select>
                  <label
                    id="newClientCompanyType2ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  部署名 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={departmentName}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    onBlur={(e) => checkNameAdd(e.target.value, '部署名')}
                    type="text"
                    id="newDepartmentName"
                    name="department_name"
                  />
                  <label
                    id="newClient部署名ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  肩書 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={title}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={(e) => checkFieldAdd(e.target.value, 'タイトル')}
                    type="text"
                    id="newTitle"
                    name="title"
                  />
                  <label
                    id="newClientタイトルErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  担当者 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={manager}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setManager(e.target.value)}
                    onBlur={(e) => checkNameAdd(e.target.value, '担当者')}
                    type="text"
                    id="newManager"
                    name="responsible_person"
                  />
                  <label
                    id="newClient担当者ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  担当者カナ <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={managerKata}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setManagerKata(e.target.value)}
                    onBlur={(e) => checkNameAdd(e.target.value, '担当者カナ')}
                    type="text"
                    id="newManagerKata"
                    name="responsible_person_katakana"
                  />
                  <label
                    id="newClient担当者カナErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                {/* <label className="label-input">パスワード <span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Password")} type="password" id="newPassword" name="password" />
                  <label id="newClientPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br />
                <label className="label-input">パスワード(確認用)<span className="span-require">*必須</span>
                  <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "ConfirmPassword")} type="password" id="newConfirmPassword" name="password_confirmation" />
                  <label id="newClientConfirmPasswordErrMsg" className="input-field" style={{ display: 'none', color: "red" }}></label>
                </label> <br /><br /> */}
                <label className="label-input">
                  画像（ロゴ）<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    type="file"
                    id="avatar"
                    style={{ display: disableInput == true ? 'none' : 'block' }}
                    onChange={(e) => {
                      getBaseUrl(e);
                      setUpdateImageChange(true);
                    }}
                    disabled={disableInput == true ? true : false}
                    hidden
                    name="logo_url"
                    accept="image/png, image/jpeg"
                  />
                  <button
                    id="btnimgNum"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid gray',
                      marginLeft: '12%',
                      marginTop: '-60px',
                      borderRadius: '10px',
                      width: '100px',
                    }}
                    onClick={(e) => selectImgUpdate(e)}
                  >
                    画像変更
                  </button>
                  <br />
                  <img
                    id="imgUpdatesrc"
                    src={urlLogo}
                    style={{ maxHeight: '200px', marginLeft: '30%', marginTop: '5px' }}
                  ></img>
                  <label
                    id="newClientImgLogoErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  サイトURL <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={disableInput == true ? true : false}
                    onBlur={(e) => checkFieldAdd(e.target.value, 'URL')}
                    type="text"
                    id="newURL"
                    name="url"
                  />
                  <label
                    id="newClientURLErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  郵便番号 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    disabled={disableInput == true ? true : false}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onBlur={(e) => utils.checkInputNumber(e.target.value, '郵便番号')}
                    type="text"
                    id="newPostCode"
                    name="zip_code"
                  />
                  <label
                    id="newClient郵便番号ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  都道府県 <span className="span-require">*必須</span>
                  {/* <input className="input-field" value={prefecture} onChange={(e) => setPrefecture(e.target.value)} onBlur={(e) => checkFieldAdd(e.target.value, "Prefectures")} type="text" id="newPrefectures" name="prefecture" /> */}
                  <select
                    style={{ padding: '3px 0px 3px 0px', maxHeight: '50%!important%' }}
                    disabled={disableInput == true ? true : false}
                    onMouseLeave={() => closeSizeSelect()}
                    onMouseDown={() => setSizeSlect()}
                    className="input-field"
                    defaultValue={prefecture}
                    name="prefecture"
                    id="newPrefectures"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelect()} value="北海道">
                      北海道
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="青森県">
                      青森県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="岩手県">
                      岩手県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="宮城県">
                      宮城県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="秋田県">
                      秋田県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="山形県">
                      山形県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="福島県">
                      福島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="茨城県">
                      茨城県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="栃木県">
                      栃木県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="群馬県">
                      群馬県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="埼玉県">
                      埼玉県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="千葉県">
                      千葉県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="東京都">
                      東京都
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="神奈川県">
                      神奈川県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="新潟県">
                      新潟県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="富山県">
                      富山県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="石川県">
                      石川県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="福井県">
                      福井県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="山梨県">
                      山梨県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="長野県">
                      長野県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="岐阜県">
                      岐阜県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="静岡県">
                      静岡県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="愛知県">
                      愛知県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="三重県">
                      三重県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="滋賀県">
                      滋賀県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="京都府">
                      京都府
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="大阪府">
                      大阪府
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="兵庫県">
                      兵庫県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="奈良県">
                      奈良県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="和歌山県">
                      和歌山県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="鳥取県">
                      鳥取県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="島根県">
                      島根県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="岡山県">
                      岡山県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="広島県">
                      広島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="山口県">
                      山口県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="徳島県">
                      徳島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="香川県">
                      香川県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="愛媛県">
                      愛媛県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="高知県">
                      高知県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="福岡県">
                      福岡県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="佐賀県">
                      佐賀県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="長崎県">
                      長崎県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="熊本県">
                      熊本県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="大分県">
                      大分県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="宮崎県">
                      宮崎県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="鹿児島県">
                      鹿児島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="沖縄県">
                      沖縄県
                    </option>
                  </select>
                  <label
                    id="newClientPrefecturesErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  市区町村 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={municipality}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setMunicipality(e.target.value)}
                    onBlur={(e) => checkFieldAdd(e.target.value, '都道府県')}
                    type="text"
                    id="newMunicipalities"
                    name="municipality"
                  />
                  <label
                    id="newClient都道府県ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  住所 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={address}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={(e) => checkFieldAdd(e.target.value, '住所')}
                    type="text"
                    id="newAddress"
                    name="address"
                  />
                  <label
                    id="newClient住所ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  建物名 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={buildingName}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setBuildingName(e.target.value)}
                    onBlur={(e) => checkFieldAdd(e.target.value, '建物名')}
                    type="text"
                    id="newBuildingName"
                    name="building_name"
                  />
                  <label
                    id="newClient建物名ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  メールアドレス <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={email}
                    disabled={disableInput == true ? true : false}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => checkNameAdd(e.target.value, 'メールアドレス')}
                    type="text"
                    id="newEmail"
                    name="email"
                  />
                  <label
                    id="newClientメールアドレスErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  電話番号 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={disableInput == true ? true : false}
                    onBlur={(e) => utils.checkPhoneNumber(e.target.value, '電話番号')}
                    type="text"
                    id="newPhone"
                    name="phone_number"
                  />
                  <label
                    id="newClient電話番号ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
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
              <h4>クライアント追加</h4>
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#bbb',
                  marginBottom: '15px',
                }}
              ></div>
              <form id="addForm" className="swap">
                <div style={{ display: 'flex' }}>
                  <label style={{ width: '30%' }}>
                    ステータス {/*Status*/}
                    <span className="span-require">*必須</span>
                  </label>
                  <span>
                    <input
                      name="status"
                      type="radio"
                      id="in_contract"
                      value={contract}
                      onClick={(e) => setContract('active')}
                    />
                    <label htmlFor="in_contract" className="radioButtonAddClient">
                      契約
                    </label>
                    <input
                      name="status"
                      type="radio"
                      id="pause_contract"
                      value={contract}
                      onClick={(e) => setContract('pause')}
                    />
                    <label htmlFor="pause_contract" className="radioButtonAddClient">
                      休止
                    </label>
                    <input
                      name="status"
                      type="radio"
                      id="finished_contract"
                      value={contract}
                      onClick={(e) => setContract('ended')}
                    />
                    <label htmlFor="finished_contract" className="radioButtonAddClient">
                      解約
                    </label>
                    <input
                      name="status"
                      type="radio"
                      id="trial_contract"
                      value={contract}
                      onClick={(e) => setContract('trial')}
                    />
                    <label htmlFor="trial_contract" className="radioButtonAddClient">
                      お試し
                    </label>
                  </span>
                </div>
                <label
                  id="newClientStatusErrMsg"
                  className="input-field"
                  style={{ display: 'none', color: 'red' }}
                ></label>
                <br />
                <label className="label-input">
                  {' '}
                  プラン名 {/*Plan*/}
                  <span className="span-require">*必須</span>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={'start_up_plan'}
                    name="plan"
                    id="plan"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="startup">スタートアッププラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="expert">エキスパートプラン</option>
                    <option value="complete">完全成果報酬プラン</option>
                  </select>
                </label>
                <br />
                <br />
                <label className="label-input">
                  プラン価格 {/**Plan price*/}
                  <input
                    className="input-field"
                    onBlur={(e) => utils.checkInputNumber(e.target.value, 'プラン価格')}
                    type="text"
                    id="newPlanPrice"
                    name="price"
                  />
                  <label
                    id="newClientプラン価格ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  課金開始日 {/** Date start count price */}
                  <input
                    type="text"
                    value={inputStartDate ? inputStartDate?.replace(/-/g, '/') : 'yyyy/mm/dd'}
                    onChange={() => {}}
                    className="input-field"
                    readOnly
                  />
                  <input
                    style={{ position: 'absolute', right: '0', opacity: '0', zIndex: '1' }}
                    type="date"
                    id="startDate"
                    name="subscription_start_at"
                    onChange={(e) => checkInputDate(e.target.value)}
                    className="input-field"
                  />
                  <label
                    id="newClientStartErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  最低利用期間終了日
                  <input
                    type="text"
                    value={inputEndDate ? inputEndDate?.replace(/-/g, '/') : 'yyyy/mm/dd'}
                    onChange={() => {}}
                    className="input-field"
                    readOnly
                  />
                  <input
                    style={{ position: 'absolute', right: '0', opacity: '0', zIndex: '1' }}
                    type="date"
                    id="endDate"
                    value={inputEndDate}
                    name="subscription_end_at"
                    onChange={(e) => checkEndDate(e.target.value)}
                    className="input-field"
                  />
                  <label
                    id="newClientEndErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">Instagramチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={'yes'}
                    name="is_instagram"
                    id="is_instagram"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientInstagramCreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">LINEチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={'yes'}
                    name="is_line"
                    id="is_line"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientLINECreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">TikTokチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={'yes'}
                    name="is_tiktok"
                    id="is_tiktok"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientTikTokCreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  <label className="long-label">WEBチャットボット機能</label>
                  <select
                    style={{ padding: '3px 0px 3px 0px' }}
                    className="input-field"
                    defaultValue={'yes'}
                    name="is_web"
                    id="is_web"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                  <label
                    id="newClientWEBCreateErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  メモ
                  <textarea className="input-field" rows="4" id="newNote" name="note" cols="50" />
                  <label
                    id="newClientNoteErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  名称 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkNameAdd(e.target.value, '名称')}
                    type="text"
                    id="newName"
                    name="name"
                  />
                  <label
                    id="newClient名称ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  名称カナ<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkNameAdd(e.target.value, '名称カナ')}
                    type="text"
                    id="newNameKata"
                    name="name_katakana"
                  />
                  <label
                    id="newClient名称カナErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  企業種別 <span className="span-require">*必須</span>
                  {/* <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType")} type="text" id="newCompanyType" name="enterprise_type" /> */}
                  <select
                    style={{ padding: '3px 0px 3px 0px', maxHeight: '50%!important%' }}
                    onMouseLeave={() => closeSizeSelectCom()}
                    onMouseDown={() => setSizeSlectCom()}
                    className="input-field"
                    defaultValue={'株式会社'}
                    name="enterprise_type"
                    id="newCompanyType"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom()} value="株式会社">
                      株式会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限会社">
                      有限会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合名会社">
                      合名会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合資会社">
                      合資会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="合同会社">
                      合同会社
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人">
                      医療法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人社団">
                      医療法人社団
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="医療法人財団">
                      医療法人財団
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会医療法人">
                      社会医療法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般財団法人">
                      一般財団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益財団法人">
                      公益財団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="一般社団法人">
                      一般社団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公益社団法人">
                      公益社団法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="宗教法人">
                      宗教法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="学校法人">
                      学校法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会福祉法人">
                      社会福祉法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="更生保護法人">
                      更生保護法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="相互社会">
                      相互社会
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="特定非営利活動法人">
                      特定非営利活動法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="独立行政法人">
                      独立行政法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="地方独立行政法人">
                      地方独立行政法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="弁護士法人">
                      弁護士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="有限責任中間法人">
                      有限責任中間法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="無限責任中間法人">
                      無限責任中間法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="行政書士法人">
                      行政書士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="司法書士法人">
                      司法書士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="税理士法人">
                      税理士法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="国立大学法人">
                      国立大学法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="公立大学法人">
                      公立大学法人
                    </option>
                    {/* <option onClick={() => setSizeAfterSelectCom()} value="和歌山県">和歌山県</option> */}
                    <option onClick={() => setSizeAfterSelectCom()} value="農事組合法人">
                      農事組合法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="管理組合法人">
                      管理組合法人
                    </option>
                    <option onClick={() => setSizeAfterSelectCom()} value="社会保険労務士法人">
                      社会保険労務士法人
                    </option>
                  </select>
                  <label
                    id="newClientCompanyTypeErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  企業種別２ <span className="span-require">*必須</span>
                  {/* <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "CompanyType2")} type="text" id="newCompanyType2" name="enterprise_type_2" /> */}
                  <select
                    style={{ padding: '3px 0px 3px 0px', maxHeight: '50%!important%' }}
                    onMouseLeave={() => closeSizeSelectCom2()}
                    onMouseDown={() => setSizeSlectCom2()}
                    className="input-field"
                    defaultValue={'先頭に使う'}
                    name="enterprise_type_2"
                    id="newCompanyType2"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelectCom2()} value="先頭に使う">
                      先頭に使う
                    </option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="末尾に使う">
                      末尾に使う
                    </option>
                    <option onClick={() => setSizeAfterSelectCom2()} value="なし">
                      なし
                    </option>
                  </select>
                  <label
                    id="newClientCompanyType2ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  部署名 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkNameAdd(e.target.value, '部署名')}
                    type="text"
                    id="newDepartmentName"
                    name="department_name"
                  />
                  <label
                    id="newClient部署名ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  肩書 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkFieldAdd(e.target.value, 'タイトル')}
                    type="text"
                    id="newTitle"
                    name="title"
                  />
                  <label
                    id="newClientタイトルErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  担当者 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkNameAdd(e.target.value, '担当者')}
                    type="text"
                    id="newManager"
                    name="responsible_person"
                  />
                  <label
                    id="newClient担当者ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  担当者カナ <span className="span-require">*必須</span>
                  {/* waiting BE */}
                  <input
                    className="input-field"
                    onBlur={(e) => checkNameAdd(e.target.value, '担当者カナ')}
                    type="text"
                    id="newManagerKata"
                    name="responsible_person_katakana"
                  />
                  <label
                    id="newClient担当者カナErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  パスワード <span className="span-require">*必須</span>
                  {/* waiting BE */}
                  <input
                    className="input-field"
                    onBlur={(e) => checkPasswordAdd(e.target.value, 'パスワード')}
                    type="password"
                    id="newPassword"
                    name="password"
                  />
                  <label
                    id="newClientパスワードErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  パスワード(確認用) <span className="span-require">*必須</span>
                  {/* waiting BE */}
                  <input
                    className="input-field"
                    onBlur={(e) => checkFieldAdd(e.target.value, 'パスワード(確認用)')}
                    type="password"
                    id="newConfirmPassword"
                    name="password_confirmation"
                  />
                  <label
                    id="newClientパスワード(確認用)ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  画像（ロゴ）<span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    type="file"
                    id="avatar_add"
                    onChange={(e) => getBaseUrlAdd()}
                    name="img_logo"
                    accept="image/png, image/jpeg"
                  />
                  <label
                    id="newClientImgLogoErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  サイトURL <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkFieldAdd(e.target.value, 'URL')}
                    type="text"
                    id="newURL"
                    name="url"
                  />
                  <label
                    id="newClientURLErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  郵便番号 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => utils.checkInputNumber(e.target.value, '郵便番号')}
                    type="text"
                    id="newPostCode"
                    name="zip_code"
                  />
                  <label
                    id="newClient郵便番号ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  都道府県 <span className="span-require">*必須</span>
                  {/* <input className="input-field" onBlur={(e) => checkFieldAdd(e.target.value, "Prefectures")} type="text" id="newPrefectures" name="prefecture" /> */}
                  <select
                    style={{ padding: '3px 0px 3px 0px', maxHeight: '50%!important%' }}
                    onMouseLeave={() => closeSizeSelect()}
                    onMouseDown={() => setSizeSlect()}
                    className="input-field"
                    defaultValue={'北海道'}
                    name="prefecture"
                    id="newPrefectures"
                  >
                    {/* <option value="" disabled={true}>Select one option</option> */}
                    <option onClick={() => setSizeAfterSelect()} value="北海道">
                      北海道
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="青森県">
                      青森県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="岩手県">
                      岩手県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="宮城県">
                      宮城県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="秋田県">
                      秋田県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="山形県">
                      山形県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="福島県">
                      福島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="茨城県">
                      茨城県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="栃木県">
                      栃木県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="群馬県">
                      群馬県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="埼玉県">
                      埼玉県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="千葉県">
                      千葉県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="東京都">
                      東京都
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="神奈川県">
                      神奈川県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="新潟県">
                      新潟県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="富山県">
                      富山県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="石川県">
                      石川県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="福井県">
                      福井県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="山梨県">
                      山梨県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="長野県">
                      長野県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="岐阜県">
                      岐阜県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="静岡県">
                      静岡県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="愛知県">
                      愛知県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="三重県">
                      三重県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="滋賀県">
                      滋賀県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="京都府">
                      京都府
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="大阪府">
                      大阪府
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="兵庫県">
                      兵庫県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="奈良県">
                      奈良県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="和歌山県">
                      和歌山県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="鳥取県">
                      鳥取県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="島根県">
                      島根県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="岡山県">
                      岡山県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="広島県">
                      広島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="山口県">
                      山口県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="徳島県">
                      徳島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="香川県">
                      香川県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="愛媛県">
                      愛媛県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="高知県">
                      高知県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="福岡県">
                      福岡県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="佐賀県">
                      佐賀県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="長崎県">
                      長崎県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="熊本県">
                      熊本県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="大分県">
                      大分県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="宮崎県">
                      宮崎県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="鹿児島県">
                      鹿児島県
                    </option>
                    <option onClick={() => setSizeAfterSelect()} value="沖縄県">
                      沖縄県
                    </option>
                  </select>
                  <label
                    id="newClientPrefecturesErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  市区町村 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkFieldAdd(e.target.value, '都道府県')}
                    type="text"
                    id="newMunicipalities"
                    name="municipality"
                  />
                  <label
                    id="newClient都道府県ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  住所 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkFieldAdd(e.target.value, '住所')}
                    type="text"
                    id="newAddress"
                    name="address"
                  />
                  <label
                    id="newClient住所ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  建物名 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkFieldAdd(e.target.value, '建物名')}
                    type="text"
                    id="newBuildingName"
                    name="building_name"
                  />
                  <label
                    id="newClient建物名ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  メールアドレス <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => checkNameAdd(e.target.value, 'メールアドレス')}
                    type="text"
                    id="newEmail"
                    name="email"
                  />
                  <label
                    id="newClientメールアドレスErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
                <br />
                <br />
                <label className="label-input">
                  電話番号 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) => utils.checkPhoneNumber(e.target.value, '電話番号')}
                    type="text"
                    id="newPhone"
                    name="phone_number"
                  />
                  <label
                    id="newClient電話番号ErrMsg"
                    className="input-field"
                    style={{ display: 'none', color: 'red' }}
                  ></label>
                </label>{' '}
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
        <ModalShort open={isOpenDeleteClient} onClose={() => setIsOpenDeleteClient(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>クライアントを削除しますか。</h4>
            <Button onClick={() => deleteClientUser()}>はい</Button>
            <Button onClick={() => setIsOpenDeleteClient(false)}>いいえ</Button>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default ClientManagement;
