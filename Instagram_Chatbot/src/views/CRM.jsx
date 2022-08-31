import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import ava from './Popup/ava.png';
import insta_img from './Popup/instagram.jpeg';
import tag_icon from './Popup/tag_icon.jpeg';
import ModalDetail from './Popup/ModalDetail';
import '../assets/css/general.css';

import api from '../api/api-management';

import ModalShort from './Popup/ModalShort';
import ModalDetailInstaUser from './Popup/ModalDetailInstaUser';
import Cookies from 'js-cookie';
import ModalNoti from './Popup/ModalNoti';
function CRM() {
  const [isOpenDetailUser, setIsOpenDetailUser] = useState(false);

  const [isOpenAddTable, setIsOpenAddTable] = useState(false);
  const [isOpenAddLabel, setIsOpenAddLabel] = useState(false);

  const [listInstagramUser, setListInstagramUser] = useState([]);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  const [isOpenActiveChatbot, setIsOpenActiveChatbot] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');
  const [idActiveChatbot, setIdActiveChatbot] = useState();
  const [isOpenNotiActiveChatbot, setIsOpenNotiActiveChatbot] = useState('');

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
    // var path = window.location.pathname;
    api
      .get(`/api/v1/managements/instagram_users`)
      .then((res) => {
        // console.log('instagram_users: ', res.data.data.instagram_users);
        setListInstagramUser(res.data.data.instagram_users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [instagramUser, setInstagramUser] = useState();
  const [labelinstagramUser, setLabelInstagramUser] = useState([]);
  const [historyinstagramUser, setHistoryInstagramUser] = useState([]);
  const [customTable, setCustomTable] = useState([]);
  const [customLabel, setCustomLabel] = useState([]);
  const [customLabelLen, setCustomLabelLen] = useState();
  const [idInstaUser, setIdInstaUser] = useState();

  function detailUser(id) {
    setIsOpenDetailUser(true);
    api
      .get(`/api/v1/managements/instagram_users/${id}`)
      .then((res) => {
        // console.log('detail instagram_users: ', res.data.data);
        setInstagramUser(res.data.data.instagram_users);
        setLabelInstagramUser(res.data.data.labels);
        // var listLab = 10
        // var listLabRe = res.data.data.labels.length
        // if(listLabRe<listLab){
        //   setLabelInstagramUser(res.data.data.labels)
        // }else{
        //   setLabelInstagramUser(res.data.data.labels.slice(0,10))
        // }
        // var status = res.data.data.instagram_users.status
        // if(status == "archive"){

        // }else if(status == "lead"){

        // }else if(status == "progression"){

        // }else if(status == "progression"){

        // }else if(status == null){

        // }
        setCustomTable(res.data.data.custom_items);
        setCustomLabel(res.data.data.labels);
        setCustomLabelLen(res.data.data.labels.length);
        // console.log(res.data.data.labels.length);
        setIdInstaUser(res.data.data.instagram_users.id);
        var listHistory = [];
        var historyLe;
        if (res.data.data.message_histories.length < 10) {
          historyLe = res.data.data.message_histories.length;
        } else {
          historyLe = 10;
        }
        for (var i = 0; i < historyLe; i++) {
          listHistory.push(res.data.data.message_histories[i]);
        }
        setHistoryInstagramUser(listHistory);
      })
      .catch((error) => {
        console.log(error);
      });
    // api.get(`/api/v1/instagram_users/custom_items/${id}`).then(res => {
    //   console.log("custom_items: ",res.data)
    //   if(res.data.code == 1){
    //     setCustomTable(res.data.data.)
    //   }
    // }).catch(error => {
    //   console.log(error)
    // })
  }

  function reloadInstaUser(id) {
    // console.log('id reload: ', id);
    api
      .get(`/api/v1/managements/instagram_users/${id}`)
      .then((res) => {
        // console.log('detail instagram_users: ', res.data.data);
        setInstagramUser(res.data.data.instagram_users);
        setLabelInstagramUser(res.data.data.labels);
        setCustomTable(res.data.data.custom_items);
        setCustomLabel(res.data.data.labels);
        if (res.data.data.labels.length >= 10) {
          setCustomLabelLen(10);
        } else {
          setCustomLabelLen(res.data.data?.labels?.length);
        }
        // setIdInstaUser(res.data.data.instagram_users.id)
        var listHistory = [];
        var historyLe;
        if (res.data.data.message_histories.length < 10) {
          historyLe = res.data.data.message_histories.length;
        } else {
          historyLe = 10;
        }
        for (var i = 0; i < historyLe; i++) {
          listHistory.push(res.data.data.message_histories[i]);
        }
        setHistoryInstagramUser(listHistory);
        if (res.data.data.labels.length >= 10) {
          document.getElementById(`addLabelItem`).style.display = 'none';
        }
        if (res.data.data.custom_items?.length >= 8) {
          document.getElementById(`AddTableButton`).style.display = 'none';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // var table =
  //   { title: ["breakfast", "lunch", "dinner", "video web"], value: ["bread", "chicken", "rice", "youtube"] }
  // var tableList = []
  // for (var i = 0; i < table.title.length; i++) {
  //   var itemTable = { title: table.title[i], value: table.value[i] }
  //   tableList.push(itemTable)
  // }
  var tblList = [
    { id: 1, title: 'title 1', value: 'value 1' },
    { id: 2, title: 'title 2', value: 'value 2' },
    { id: 3, title: 'title 3', value: 'value 3' },
    { id: 4, title: 'title 4', value: 'value 4' },
    { id: 5, title: 'title 5', value: 'value 5' },
  ];

  var lblList = [
    { id: 1, name: 'lbl 1' },
    { id: 2, name: 'lbl 2' },
    { id: 3, name: 'lbl 3' },
    { id: 4, name: 'lbl 4' },
  ];

  function addTableItem() {
    if (tblList.length == 8) {
      document.getElementById('AddTableButton').style.display = 'none';
    }
    var titleAdd = document.getElementById('newItemTitle').value;
    var valueAdd = document.getElementById('newItemValue').value;
    checkInputItemTitle(titleAdd);
    checkInputItemValue(valueAdd);
    if (checkInputItemTitle(titleAdd) == true && checkInputItemValue(valueAdd) == true) {
      var add = {
        custom_item: {
          title: titleAdd,
          value: valueAdd,
          instagram_user_id: idInstaUser,
        },
      };

      api
        .post(`/api/v1/instagram_users/custom_items`, add)
        .then((res) => {
          // console.log(res);
          reloadInstaUser(idInstaUser);
          setIsOpenAddTable(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  function addLabel() {
    var labelIn = document.getElementById('newLabel').value;
    checkInputLabel(labelIn);
    if (checkInputLabel(labelIn) == true) {
      // alert("oke nhe")
      var add = { label: { name: labelIn, instagram_user_id: idInstaUser } };
      api
        .post(`/api/v1/instagram_users/labels`, add)
        .then((res) => {
          // console.log(res);
          reloadInstaUser(idInstaUser);
          setIsOpenAddLabel(false);
          // setListBag(res.data.data.message_bags)
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // else{
    //   alert("Please Input Labelname")
    // }
  }

  function checkInputLabel(value) {
    if (value == '') {
      document.getElementById('newLabelErrMsg').style.display = 'block';
      document.getElementById('newLabelErrMsg').innerHTML = '入力してください。';
      document.getElementById('btnAddLbl').disabled = true;
    } else if (value.length > 20) {
      document.getElementById('newLabelErrMsg').style.display = 'block';
      document.getElementById('newLabelErrMsg').innerHTML = '最大20つの文字';
      document.getElementById('btnAddLbl').disabled = true;
    } else {
      document.getElementById('newLabelErrMsg').style.display = 'none';
      document.getElementById('newLabelErrMsg').innerHTML = '';
      document.getElementById('btnAddLbl').disabled = false;
      return true;
    }
  }

  function checkInputItemTitle(value) {
    if (value == '') {
      document.getElementById('newItemTitleErrMsg').style.display = 'block';
      document.getElementById('newItemTitleErrMsg').innerHTML = '入力してください。';
      document.getElementById('btnAddItem').disabled = true;
    } else if (value.length > 15) {
      document.getElementById('newItemTitleErrMsg').style.display = 'block';
      document.getElementById('newItemTitleErrMsg').innerHTML = '最大15つの文字';
      document.getElementById('btnAddItem').disabled = true;
    } else {
      document.getElementById('newItemTitleErrMsg').style.display = 'none';
      document.getElementById('newItemTitleErrMsg').innerHTML = '';
      document.getElementById('btnAddItem').disabled = false;
      return true;
    }
  }

  function checkInputItemValue(value) {
    if (value == '') {
      document.getElementById('newItemValueErrMsg').style.display = 'block';
      document.getElementById('newItemValueErrMsg').innerHTML = '入力してください。';
      document.getElementById('btnAddItem').disabled = true;
    } else if (value.length > 15) {
      document.getElementById('newItemValueErrMsg').style.display = 'block';
      document.getElementById('newItemValueErrMsg').innerHTML = '最大15つの文字';
      document.getElementById('btnAddItem').disabled = true;
    } else {
      document.getElementById('newItemValueErrMsg').style.display = 'none';
      document.getElementById('newItemValueErrMsg').innerHTML = '';
      document.getElementById('btnAddItem').disabled = false;
      return true;
    }
  }

  function editDetail() {
    document.getElementById(`btnSaveDetail`).style.display = 'block';
    document.getElementById(`btnEditDetail`).style.display = 'none';
    document.getElementById(`addLabelItem`).style.display = 'none';
    document.getElementById(`AddTableButton`).style.display = 'none';
    for (let i = 0; i < customLabel.length; i++) {
      if (document.getElementById(`deleteLbl${customLabel[i]?.id}`) !== null) {
        document.getElementById(`deleteLbl${customLabel[i]?.id}`).style.display = 'block';
      }

      // document.getElementById(`deleteTbl${lblList[i].id}`).style.display = "block"
      // document.getElementById(`deleteTbl${lblList[i].id}`).style.display = "block"
    }
    for (let i = 0; i < customTable.length; i++) {
      if (document.getElementById(`deleteTbl${customTable[i]?.id}`) !== null) {
        document.getElementById(`deleteTbl${customTable[i]?.id}`).style.display = 'block';
      }
    }
    // reloadInstaUser(idInstaUser);
    // console.log(customLabelLen, customTable?.length);
    // if (customLabelLen >= 10) {
    //   document.getElementById(`addLabelItem`).style.display = 'none';
    // }
    // if (customTable?.length >= 8) {
    //   document.getElementById(`AddTableButton`).style.display = 'none';
    // }
    // document.getElementById("deleteLbl").style.display = "block"
  }

  function saveDetail() {
    document.getElementById(`btnSaveDetail`).style.display = 'none';
    document.getElementById(`btnEditDetail`).style.display = 'block';
    if (customLabel?.length >= 10) {
      document.getElementById(`addLabelItem`).style.display = 'none';
    } else {
      document.getElementById(`addLabelItem`).style.display = 'block';
    }
    if (customTable?.length >= 8) {
      document.getElementById(`AddTableButton`).style.display = 'none';
    } else {
      document.getElementById(`AddTableButton`).style.display = 'block';
    }
    for (let i = 0; i < customLabel.length; i++) {
      document.getElementById(`deleteLbl${customLabel[i]?.id}`).style.display = 'none';
      // document.getElementById(`deleteTbl${lblList[i].id}`).style.display = "block"
      // document.getElementById(`deleteTbl${lblList[i].id}`).style.display = "block"
    }
    for (let i = 0; i < customTable.length; i++) {
      document.getElementById(`deleteTbl${customTable[i]?.id}`).style.display = 'none';
    }
    reloadInstaUser(idInstaUser);
    // console.log(customLabelLen, customTable?.length);
  }

  function deleteLabel(id) {
    api
      .delete(`/api/v1/instagram_users/labels/${id}`)
      .then((res) => {
        // console.log(res);
        // reloadInstaUser(idInstaUser);
        // setTimeout(() => {
        //   editDetail();
        // }, 5500);
        // console.log(customLabel, id);
        setCustomLabel(customLabel.filter((label) => label.id !== id));
        document.getElementById(`addLabelItem`).style.display = 'none';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteItemTable(id) {
    // deleteItemTable()
    api
      .delete(`/api/v1/instagram_users/custom_items/${id}`)
      .then((res) => {
        // console.log(res);
        // reloadInstaUser(idInstaUser);
        // console.log(customTable, id);
        setCustomTable(customTable.filter((table) => table.id !== id));
        document.getElementById('AddTableButton').style.display = 'none';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeStatus(value, id) {
    setIsChangeStatus(true);
    var val = { instagram_user: { status: value } };
    api
      .patch(`/api/v1/managements/instagram_users/${id}`, val)
      .then((res) => {
        // console.log(res);
        // setTimeout(() => {
        //   setIsOpenNoti(true)
        //   setMsgNoti("Change status successfully")
        // }, 500)
        // setTimeout(function () {
        //   setIsOpenNoti(false)
        // }, 2000);
        // getBagMsg(group, id)
        detailUser(id);
        setTimeout(() => {
          setIsChangeStatus(false);
          setIsOpenNoti(true);
        }, 1500);
        // getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // delete support EC
  const activeChatbotClick = (id) => {
    setIsOpenActiveChatbot(true);
    setIdActiveChatbot(id);
  };

  function activeChatbot() {
    setIsOpenActiveChatbot(false);
    // console.log(idActiveChatbot);
    api
      .delete(`/api/v1/instagram_users/supporting_users/${idActiveChatbot}`)
      .then((res) => {
        // console.log(res);
        setIsOpenNotiActiveChatbot(true);
        setMsgNoti('自動応答に切り替えました！');
        setTimeout(() => {
          setIsOpenNotiActiveChatbot(false);
          setMsgNoti('');
        }, 1500);
        return api.get(`/api/v1/managements/instagram_users`);
      })
      .then((res) => {
        setListInstagramUser(res.data.data?.instagram_users);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h3>インスタグラムユーザー</h3>
              </CardHeader>
              <CardBody>
                <Table
                  style={{
                    textAlign: 'center',
                    tableLayout: 'fixed',
                    overflow: 'hidden',
                  }}
                >
                  <thead className="text-primary">
                    <tr>
                      <th>ユーザー名</th>
                      <th>名前</th>
                      <th>フォローしている</th>
                      <th>フォローされている</th>
                      <th>作成日</th>
                      <th>更新日</th>
                      <th style={{ width: '250px', minWidth: '250px' }}>詳細</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listInstagramUser.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <a
                            href={`https://www.instagram.com/${item.username}/`}
                            style={{ color: 'black' }}
                          >
                            {item.username}
                          </a>
                        </td>
                        <td>{item.full_name}</td>
                        <td>{item.is_user_follow_business == true ? 'あり' : 'なし'}</td>
                        <td>{item.is_business_follow_user == true ? 'あり' : 'なし'}</td>
                        <td>
                          {item.created_at.slice(0, 16).replace('T', ' ').replaceAll('-', '/')}
                        </td>
                        <td>
                          {item.updated_at.slice(0, 16).replace('T', ' ').replaceAll('-', '/')}
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Button
                              style={{ backgroundColor: '#51cbcd' }}
                              onClick={() => detailUser(item.id)}
                            >
                              詳細
                            </Button>
                            {item?.need_support && (
                              <Button
                                style={{ backgroundColor: 'red' }}
                                onClick={() => activeChatbotClick(item?.id)}
                              >
                                自動応答
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* <tr>
                      <td>nghia.hoang</td>
                      <td>nghia.hoang@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                    <tr>
                      <td>dung.bui</td>
                      <td>dung.bui@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                    <tr>
                      <td>quan.le</td>
                      <td>quan.le@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr> */}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalDetailInstaUser open={isOpenDetailUser} onClose={() => setIsOpenDetailUser(false)}>
          <div
            style={{
              height: '100%',
              textAlign: 'center',
              padding: '0',
              color: '#5f6368',
            }}
          >
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <div
                style={{
                  width: '27.5% ',
                  height: '100%',
                  paddingBottom: '2.5%',
                }}
              >
                <div style={{ borderRight: '1px solid #dddddd', height: '100%' }}>
                  <div style={{ width: '100% ', height: '20%' }}>
                    <img
                      src={ava}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                      }}
                    ></img>
                  </div>
                  <div style={{ width: '100%', position: 'relative' }}>
                    <div
                      style={{
                        height: '3px',
                        width: '72.5%',
                        position: 'absolute',
                        margin: '38px 12.5% 0% 12.5%',
                        backgroundColor: 'gray',
                      }}
                    ></div>
                    <div
                      style={{
                        width: '100%',
                        display: 'grid',
                        marginLeft: '-2%',
                        position: 'relative',
                        gridTemplateColumns: '25% 25% 25% 25%',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ paddingLeft: '0%' }}>
                        <span style={{ fontSize: '12px' }}>アーカイブ</span>
                        <div
                          onClick={() => changeStatus('archive', instagramUser.id)}
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor:
                              instagramUser !== undefined
                                ? instagramUser.status == 'archive'
                                  ? '#51cbce'
                                  : 'gray'
                                : 'gray',
                            borderRadius: '50%',
                            display: 'table',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              verticalAlign: 'middle',
                              display: 'table-cell',
                            }}
                          >
                            1
                          </span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '0%' }}>
                        <span style={{ fontSize: '12px' }}>リード</span>
                        <div
                          onClick={() => changeStatus('lead', instagramUser.id)}
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor:
                              instagramUser !== undefined
                                ? instagramUser.status == 'lead'
                                  ? '#51cbce'
                                  : 'gray'
                                : 'gray',
                            borderRadius: '50%',
                            display: 'table',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              verticalAlign: 'middle',
                              display: 'table-cell',
                            }}
                          >
                            2
                          </span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '0%' }}>
                        <span style={{ fontSize: '12px' }}>進行中</span>
                        <div
                          onClick={() => changeStatus('progression', instagramUser.id)}
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor:
                              instagramUser !== undefined
                                ? instagramUser.status == 'progression'
                                  ? '#51cbce'
                                  : 'gray'
                                : 'gray',
                            borderRadius: '50%',
                            display: 'table',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              verticalAlign: 'middle',
                              display: 'table-cell',
                            }}
                          >
                            3
                          </span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '0%' }}>
                        <span style={{ fontSize: '12px' }}>成立</span>
                        <div
                          onClick={() => changeStatus('completion', instagramUser.id)}
                          style={{
                            width: '35px',
                            height: '35px',
                            margin: 'auto',
                            backgroundColor:
                              instagramUser !== undefined
                                ? instagramUser.status == 'completion'
                                  ? '#51cbce'
                                  : 'gray'
                                : 'gray',
                            borderRadius: '50%',
                            display: 'table',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              verticalAlign: 'middle',
                              display: 'table-cell',
                            }}
                          >
                            4
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'left',
                      marginLeft: '15px',
                      marginTop: '5px',
                    }}
                  >
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.email == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        メール:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.email == null
                            ? ''
                            : instagramUser.email
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.phone_number == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        電話番号:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.phone_number == null
                            ? ''
                            : instagramUser.phone_number
                          : ''}
                      </span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span>
                        フォローしている:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.is_user_follow_business == true
                            ? 'あり'
                            : 'なし'
                          : ''}
                      </span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span>
                        フォローされている:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.is_business_follow_user == true
                            ? 'あり'
                            : 'なし'
                          : ''}
                      </span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span>
                        開始日:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.created_at
                              .slice(0, 16)
                              .replace('T', ' ')
                              .replaceAll('-', '/')
                          : ''}{' '}
                      </span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span>
                        最終更新:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.updated_at
                              .slice(0, 16)
                              .replace('T', ' ')
                              .replaceAll('-', '/')
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.real_name == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        名前:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.real_name == null
                            ? ''
                            : instagramUser.real_name
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.company_name == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        企業:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.company_name == null
                            ? ''
                            : instagramUser.company_name
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.company_role == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        役割:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.company_role == null
                            ? ''
                            : instagramUser.company_role
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.website == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        ウェブサイト:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.website == null
                            ? ''
                            : instagramUser.website
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.propose == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        用途（ニーズ）:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.propose == null
                            ? ''
                            : instagramUser.propose
                          : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '10px',
                        display: `${
                          instagramUser !== undefined
                            ? instagramUser.know_product_in == null
                              ? 'none'
                              : 'block'
                            : 'none'
                        }`,
                      }}
                    >
                      <span>
                        認知経路:{' '}
                        {instagramUser !== undefined
                          ? instagramUser.know_product_in == null
                            ? ''
                            : instagramUser.know_product_in
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '74%',
                  height: '100%',
                  display: 'flex',
                  paddingBottom: '2.5%',
                }}
              >
                <div
                  style={{
                    width: '60%',
                    height: '100%',
                    borderRight: '1px solid #dddddd',
                    paddingLeft: '0px',
                  }}
                >
                  <br />
                  <div id="btnEditDetail" style={{ float: 'right', marginRight: '2%' }}>
                    <Button onClick={() => editDetail()}>編集</Button>
                  </div>
                  <div
                    id="btnSaveDetail"
                    style={{
                      float: 'right',
                      marginRight: '2%',
                      display: 'none',
                    }}
                  >
                    <Button onClick={() => saveDetail()}>保存</Button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: '4%',
                      marginTop: '3.5%',
                    }}
                  >
                    <h5>{instagramUser !== undefined ? instagramUser.username : ''}</h5>
                    &ensp;&ensp;
                    <img src={insta_img} style={{ width: '30px', height: '30px' }}></img>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: '4%',
                      flexWrap: 'wrap',
                    }}
                  >
                    <img
                      src={tag_icon}
                      style={{
                        width: '30px',
                        height: '30px',
                        marginTop: '10px',
                      }}
                    ></img>
                    {(customLabel == undefined ? [] : customLabel).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          marginTop: '15px',
                          marginLeft: '8px',
                          display: 'flex',
                          display: `${item.name == null ? 'none' : 'block'}`,
                          position: 'relative',
                        }}
                      >
                        &ensp;
                        <span
                          style={{
                            backgroundColor: item.is_admin_add == false ? '#1ba2b8' : '#ffc107',
                            color: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px 5px 10px',
                            position: '',
                            cursor: 'pointer',
                          }}
                          className="custom-label"
                        >
                          {item.name == null ? '' : item.name}
                        </span>
                        <span
                          id={`deleteLbl${item.id}`}
                          onClick={() => deleteLabel(item.id)}
                          style={{
                            float: 'right',
                            marginLeft: '-8px',
                            marginTop: '-6px',
                            display: 'none',
                          }}
                        >
                          <button
                            style={{
                              position: 'absolute',
                              marginLeft: '-8px',
                              padding: '0px 0px 0.5px 0px',
                              border: '1px solid gray',
                              backgroundColor: 'white',
                              width: '20px',
                              height: '20px',
                              borderRadius: '20px',
                            }}
                          >
                            <span>X</span>
                          </button>
                        </span>
                      </div>
                    ))}
                    <div
                      id="addLabelItem"
                      style={{
                        display: `${customLabelLen >= 10 ? 'none' : 'block'}`,
                        marginTop: '12.5px',
                        marginLeft: '14px',
                        backgroundColor: '#1ba2b8',
                        padding: '5px 10px 0px 10px',
                        borderRadius: '5px',
                        textAlign: 'center',
                      }}
                      onClick={() => {
                        setIsOpenAddLabel(true);
                      }}
                    >
                      <span style={{ color: 'white' }}>
                        <i className="nc-icon nc-simple-add" style={{ fontWeight: '800' }}></i>
                      </span>
                    </div>
                  </div>
                  <br />
                  <br />
                  <div style={{ textAlign: 'left' }}>
                    <span
                      style={{
                        fontWeight: '700',
                        fontSize: '18px',
                        marginLeft: '4%',
                        color: '#5f6368',
                      }}
                    >
                      顧客データ
                    </span>
                    <div
                      style={{
                        width: '90%',
                        marginLeft: '4%',
                        height: '1px',
                        backgroundColor: '#e4e4e4',
                      }}
                    ></div>
                    <br />

                    <div className="grid-container-crm">
                      {(customTable == undefined ? [] : customTable).map((item) => (
                        <div key={item.id} className="grid-item-crm">
                          <div style={{ display: 'flex', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: '50%',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                borderRight: '1px solid #e4e4e4',
                              }}
                            >
                              <span>{item.title}</span>
                            </div>
                            <div
                              style={{
                                width: '50%',
                                maxWidth: '200px',
                                overflow: 'hidden',
                              }}
                            >
                              <span>{item.value}</span>
                            </div>
                          </div>
                          <span
                            id={`deleteTbl${item.id}`}
                            onClick={() => deleteItemTable(item.id)}
                            style={{
                              float: 'right',
                              width: '20px',
                              height: '20px',
                              marginRight: '-8px',
                              marginTop: '-34px',
                              display: 'none',
                            }}
                          >
                            <button
                              style={{
                                position: 'absolute',
                                marginLeft: '-8px',
                                padding: '0px 0px 0.5px 0px',
                                border: '1px solid gray',
                                backgroundColor: 'white',
                                width: '20px',
                                height: '20px',
                                borderRadius: '20px',
                              }}
                            >
                              <span>X</span>
                            </button>
                          </span>
                        </div>
                      ))}
                      <div
                        id="AddTableButton"
                        className="grid-item-crm"
                        style={{
                          color: '#5f6368',
                          display: `${customTable.length >= 8 ? 'none' : 'block'}`,
                        }}
                      >
                        <button
                          style={{
                            width: '100%',
                            fontWeight: '600',
                            border: 'none',
                            backgroundColor: 'white',
                            color: '#5f6368',
                          }}
                          onClick={() => {
                            setIsOpenAddTable(true);
                          }}
                        >
                          ＋ データ追加{' '}
                        </button>{' '}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ maxWidth: '43%', height: '95%', overflow: 'hidden' }}>
                  {historyinstagramUser.map((item) => (
                    <div
                      key={item.created_at}
                      style={{
                        display: 'flex',
                        paddingTop: '5px',
                        paddingLeft: '0px',
                        marginLeft: '3px',
                        paddingBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          minWidth: '80px',
                          borderRight: '1px solid #e4e4e4',
                        }}
                      >
                        <span>
                          {item.created_at.slice(5, 16).replace('T', ' ').replace('-', '/')}
                        </span>
                      </div>

                      {/* <span style={{ width: "73px" }}>{((item.created_at).slice(5,16)).replace("T"," ").replace("-","/")}</span> */}
                      {/* <span>&ensp;{item.action}:&ensp;{item.usage_type}</span> */}
                      <div
                        style={{
                          textAlign: 'left',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          width: '95%',
                        }}
                      >
                        <span>
                          &ensp;
                          {item.usage_type == 'dm_received' ? '送り' : '受け'}
                          :&ensp;{item.content}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalDetailInstaUser>
        <ModalShort open={isOpenAddTable} onClose={() => setIsOpenAddTable(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>集客データ追加</h4>
            <label style={{ width: '100%' }}>タイトル</label>
            <input
              id="newItemTitle"
              style={{ width: '100%' }}
              onChange={(e) => checkInputItemTitle(e.target.value)}
              name="item_table_title"
            ></input>
            <label id="newItemTitleErrMsg" style={{ display: 'none', color: 'red' }}></label>
            <label style={{ width: '100%' }}>値</label>
            <input
              id="newItemValue"
              style={{ width: '100%' }}
              onChange={(e) => checkInputItemValue(e.target.value)}
              name="item_table_value"
            ></input>
            <label id="newItemValueErrMsg" style={{ display: 'none', color: 'red' }}></label>
            {/* <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label> */}
            <br />
            <Button id="btnAddItem" onClick={() => addTableItem()}>
              追加
            </Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenAddLabel} onClose={() => setIsOpenAddLabel(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>ラベル追加</h4>
            <input
              id="newLabel"
              style={{ width: '100%' }}
              onChange={(e) => checkInputLabel(e.target.value)}
              name="item_label"
            ></input>
            <label id="newLabelErrMsg" style={{ display: 'none', color: 'red' }}></label>
            <br />
            <Button id="btnAddLbl" onClick={() => addLabel()}>
              追加
            </Button>
          </div>
        </ModalShort>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>ステータスを変更しました。</h4>
          </div>
        </ModalNoti>
        <ModalLoading open={isChangeStatus} />

        <ModalNoti open={isOpenNotiActiveChatbot} onClose={() => setIsOpenNotiActiveChatbot(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>{msgNoti}</h4>
          </div>
        </ModalNoti>
        <ModalShort open={isOpenActiveChatbot} onClose={() => setIsOpenActiveChatbot(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>自動応答に切り替えますか？</h4>
            <Button onClick={() => activeChatbot()}>はい</Button>
            <Button onClick={() => setIsOpenActiveChatbot(false)}>いいえ</Button>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

const ModalLoading = ({ open }) => {
  if (open) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: '10000',
        }}
      >
        <div className="loading-animation"></div>
      </div>
    );
  }

  return <></>;
};

export default CRM;
