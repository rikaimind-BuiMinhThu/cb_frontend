import DatePicker from 'react-datepicker';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import ModalDetail from 'views/Popup/ModalDetail';
import '../../assets/css/bot/push-message.css';
import api from '../../api/api-management';
import { tokenExpired } from 'api/tokenExpired';
import { Link } from 'react-router-dom';
import ModalNoti from 'views/Popup/ModalNoti';
import * as utils from './../../JS/validate.js';
import ModalShort from 'views/Popup/ModalShort';
function PushMessage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [msgNoti, setMsgNoti] = useState('');
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [isOpenAddPM, setIsOpenAddPM] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [listPushMessage, setListPushMessage] = useState([]);
  const [listVar, setListVar] = useState([]);
  const [customDiv, setCustomDiv] = useState([]);
  const [numHotTemp, setNumHotTemp] = useState(0);
  const [alternateSendTime, setAlternateSendTime] = useState([]);
  const [listExcludedTimeAlt, setListExcluedTimeAlt] = useState([]);
  const [update, setUpdate] = useState(false);
  const [itemUpdate, setItemUpdate] = useState();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    let listAlternateTime = [];
    for (var i = 1; i <= 36; i++) {
      listAlternateTime.push(i);
    }
    setAlternateSendTime(listAlternateTime);

    let listExcludedTimeAltEx = [];
    for (var i = 0; i < 24; i++) {
      listExcludedTimeAltEx.push(i);
    }
    setListExcluedTimeAlt(listExcludedTimeAltEx);
  }, []);
  useEffect(() => {
    var bot_id = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/chatbots/${bot_id}/variables?page=all`)
      .then((res) => {
        console.log(res.data.data);
        setListVar(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  useEffect(() => {
    var bot_id = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/push_messages?chatbot_id=${bot_id}&page=1`)
      .then((res) => {
        if (res.data.code == 1) {
          console.log(res.data.data);
          setListPushMessage(res.data.data);
        } else if (res.data.code == 2) {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data.code == 0) {
          tokenExpired();
        }
      });
  }, []);

  function reloadListPM() {
    var bot_id = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/push_messages?chatbot_id=${bot_id}&page=1`)
      .then((res) => {
        if (res.data.code == 1) {
          console.log(res.data.data);
          setListPushMessage(res.data.data);
        } else if (res.data.code == 2) {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data.code == 0) {
          tokenExpired();
        }
      });
  }

  function newTemp(e) {
    e.preventDefault();
    let cDivs = customDiv;
    cDivs.push(`newDiv${numHotTemp}`);
    // console.log(cDivs)
    setCustomDiv(cDivs);
    setNumHotTemp(numHotTemp + 1);
  }
  function getEmailList() {
    var bot_id = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/emails?page=all&chatbot_id=${bot_id}`)
      .then((res) => {
        if (res.data.code == 1) {
          console.log(res.data.data);
          // setEmailList(res.data.data);
          var group = document.getElementById(`push_message_email`);
          for (let i = 0; i < res.data?.data.length; i++) {
            let option = document.createElement('option');
            option.value = res.data.data[i].id;
            option.text = res.data.data[i].email_template_name;
            group?.add(option);
          }
        }
        // setEmailDetailId(res?.data?.data[0].id)
        // set1stEmailDetailId()
        // group.value =
        console.log('check status update', update);
        if (update == true) {
          if (group) group.value = emailDetailId;
        } else {
          if (group) group.value = res?.data?.data[0].id;
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  useEffect(() => {
    var date = new Date();
    if (date.getDate() != 1) {
      setEndDate(new Date(date.setDate(date.getDate() - 1)));
    }
    setStartDate(new Date(date.setDate(1)));
  }, []);

  function pushMessageList() {
    document.getElementById('table_push_message_list').style.display = 'block';
    document.getElementById('payment_management_setting').style.color = '#51cbce';
    document.getElementById('table_delivery_history').style.display = 'none';
    document.getElementById('payment_management_order_his').style.color = 'black';
  }

  function deliveryHistory() {
    document.getElementById('table_delivery_history').style.display = 'block';
    document.getElementById('payment_management_order_his').style.color = '#51cbce';
    document.getElementById('table_push_message_list').style.display = 'none';
    document.getElementById('payment_management_setting').style.color = 'black';
  }

  function selectDateStart(date) {
    setStartDate(date);
    // var validate = document.getElementById(`payment_management_date_err`)
    var endMonth =
      startDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : `${endDate.getMonth() + 1}`;
    var endDatee = startDate.getDate() < 10 ? `0${endDate.getDate()}` : `${endDate.getDate()}`;
    var dateMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var dateDate = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    if (
      parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`) >
      parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`)
    ) {
      // validate.style.display = 'block';
      // validate.innerHTML = 'Start date cannot be after end date.'
    } else {
      // validate.style.display = 'none';
      // validate.innerHTML = ''
    }
    console.log(parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`));
    console.log(parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`));
  }

  function selectDateEnd(date) {
    setEndDate(date);
    var validate = document.getElementById(`payment_management_date_err`);
    var startMonth =
      startDate.getMonth() + 1 ? `0${startDate.getMonth() + 1}` : `${startDate.getMonth() + 1}`;
    var startDatee = startDate.getDate() ? `0${startDate.getDate()}` : `${startDate.getDate()}`;
    var dateMonth = date.getMonth() + 1 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var dateDate = date.getDate() ? `0${date.getDate()}` : `${date.getDate()}`;
    if (
      parseInt(`${startDate.getFullYear()}${startMonth}${startDatee}`) >
      parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`)
    ) {
      validate.style.display = 'block';
      validate.innerHTML = 'End date cannot be before start date.';
    } else {
      validate.style.display = 'none';
      validate.innerHTML = '';
    }
  }

  function handleChangeDate(date) {
    console.log('dateChange');
    console.log(date);
    if(date == null){
      console.log('deleted date');
      console.log('start date', itemUpdate?.started_at);
      setStartDate(startDate)
    }else{
      setStartDate(date);
    }
    // utils.checkRequired('startDateTime', 'startDateTimeErr', 'Start date time');
  }

  function addPM() {
    getEmailList();
    setIsOpenAddPM(true);
    setUpdate(false);
  }

  function closeAddPM() {
    setUpdate(false);
    setCustomDiv([]);
    setIsOpenAddPM(false);
  }

  function deleteCDiv(e, index) {
    e.preventDefault();
    document.getElementById(`newCDiv${index}`).remove();
  }

  function selectVariableVal(value, i) {
    console.log(value);
    // var selectobject = document.getElementById(`operator${i}`);
    // if (
    //   value == 'current_url_param' ||
    //   value == 'current_url' ||
    //   value == 'current_url_title' ||
    //   value == 'user_id' ||
    //   value == 'bot_id' ||
    //   value == 'preview_flg' ||
    //   value == 'user_ip_address' ||
    //   value == 'user_country' ||
    //   value == 'user_device' ||
    //   value == 'user_browser' ||
    //   value == 'user_agent' ||
    //   value == 'cv_datetime' ||
    //   value == 'cv_flg' ||
    //   value == 'start_datetime' ||
    //   value == 'user_referer_firstopen' ||
    //   value == 'user_referer_current'
    // ) {
    //   for (var i = 0; i < selectobject.length; i++) {
    //     if (selectobject.options[i].value == 'contains') selectobject.remove(i);
    //   }
    // } else {
    //   var opt = document.createElement('option');
    //   opt.value = 'contains';
    //   opt.innerHTML = 'Contains';
    //   selectobject.appendChild(opt);
    // }
  }

  function savePM() {
    utils.checkRequired('title', 'titleErr', 'Push message name');
    utils.checkRequired('startDateTime', 'startDateTimeErr', 'Start date time');
    if (
      utils.checkRequired('title', 'titleErr', 'Push message name') &&
      utils.checkRequired('startDateTime', 'startDateTimeErr', 'Start date time')
    ) {
      var bot_id = Cookies.get('bot_id');
      const formAdd = document.getElementById('form_add_PM');
      let push_message = {};
      let variableList = [];
      let sysVariableList = [];
      let operatorList = [];
      let valueList = [];
      // let checkedTitle = false;
      // let checkedStartAt = false;
      for (let i = 0; i < formAdd.length; i++) {
        // if (formAdd[i].name.includes('title')) {
        //   if (formAdd[i].value !== '') {
        //     checkedTitle = true;
        //   }
        // }
        // if (formAdd[i].name.includes('started_at')) {
        //   if (formAdd[i].value !== '') {
        //     checkedStartAt = true;
        //   }
        // }
        if (
          !formAdd[i].name.includes('variable_id') &&
          !formAdd[i].name.includes('operator') &&
          !formAdd[i].name.includes('var') &&
          !formAdd[i].name.includes('value')
        ) {
          if (formAdd[i].name.includes('has_timezone_exclusion')) {
            if (document.getElementById('has_timezone_exclusion').checked == true) {
              push_message[formAdd[i].name] = 'yes';
            } else if (document.getElementById('has_timezone_exclusion').checked == false) {
              push_message[formAdd[i].name] = 'no';
            }
          } else {
            push_message[formAdd[i].name] = formAdd[i].value;
          }
        } else if (formAdd[i].name.includes('variable_id')) {
          if (
            formAdd[i].value !== 'current_url_param' ||
            formAdd[i].value !== 'current_url' ||
            formAdd[i].value !== 'current_url_title' ||
            formAdd[i].value !== 'user_id' ||
            formAdd[i].value !== 'bot_id' ||
            formAdd[i].value !== 'preview_flg' ||
            formAdd[i].value !== 'user_ip_address' ||
            formAdd[i].value !== 'user_country' ||
            formAdd[i].value !== 'user_device' ||
            formAdd[i].value !== 'user_browser' ||
            formAdd[i].value !== 'user_agent' ||
            formAdd[i].value !== 'cv_datetime' ||
            formAdd[i].value !== 'cv_flg' ||
            formAdd[i].value !== 'start_datetime' ||
            formAdd[i].value !== 'user_referer_firstopen' ||
            formAdd[i].value !== 'user_referer_current'
          ) {
            variableList.push(formAdd[i].value);
            sysVariableList.push('');
          } else {
            variableList.push('');
            sysVariableList.push(formAdd[i].value);
          }
        } else if (formAdd[i].name.includes('operator')) {
          operatorList.push(formAdd[i].value);
        } else if (formAdd[i].name.includes('value')) {
          valueList.push(formAdd[i].value);
        }
        // if( formAdd[i].name == 'has_timezone_exclusion'){
        //   // console.log(document.getElementById('has_timezone_exclusion').checked)

        //   // console.log(formAdd[i].value, 'value ne')
        //   if(document.getElementById('has_timezone_exclusion').checked == true){
        //     variableList.push('yes')
        //   }else if(document.getElementById('has_timezone_exclusion').checked == false){
        //     variableList.push('no')
        //   }
        // }
      }
      let varList = [];
      for (var i = 0; i < variableList.length; i++) {
        varList.push({
          variable_id: variableList[i],
          // variable_name: sysVariableList[i],
          operator: operatorList[i],
          value: valueList[i],
        });
      }
      //if (checkedStartAt == true && checkedTitle == true) {
      push_message.variables = varList;
      // var pmAdd = {push_message: {user}}
      console.log({ push_message });
      if (update == false) {
        api
          .post(`/api/v1/managements/push_messages?chatbot_id=${bot_id}`, { push_message })
          .then((res) => {
            if (res.data.code == 1) {
              setMsgNoti('Add Push Message successfully');
              setIsOpenNoti(true);
              setTimeout(() => {
                setIsOpenNoti(false);
                setMsgNoti('');
                reloadListPM();
              }, 1500);
              setIsOpenAddPM(false);
            } else if (res.data.code == 2) {
              console.log(res.data.message);
            }
          })
          .catch((error) => {
            if (error?.response.data.code == 0) {
              tokenExpired();
            }
          });
      } else {
        api
          .patch(`/api/v1/managements/push_messages/${idPMUpdate}`, { push_message })
          .then((res) => {
            if (res.data.code == 1) {
              setMsgNoti('Update Push Message successfully');
              setIsOpenNoti(true);
              setTimeout(() => {
                setIsOpenNoti(false);
                setMsgNoti('');
                reloadListPM();
              }, 1500);
              setIsOpenAddPM(false);
            } else if (res.data.code == 2) {
              console.log(res.data.message);
            }
          })
          .catch((error) => {
            if (error?.response.data.code == 0) {
              tokenExpired();
            }
          });
      }
      // } else {
      //   console.log('empty');
      // }
    }

    // console.log(varList)
  }

  function selectTimezoneExclusion(value, check) {
    console.log(value);
    if (value == true) {
      document.getElementById('excludedTime').style.display = 'block';
      setIsChecked(true);
      // document.getElementById('alternateTime').style.display= 'block'
    } else {
      document.getElementById('excludedTime').style.display = 'none';
      setIsChecked(false);
      // document.getElementById('alternateTime').style.display= 'none'
    }
  }

  function changeStatus(item) {
    if (item?.subscribe_status === 'subscribe') {
      api
        .patch(`/api/v1/managements/push_messages/${item?.id}/unsubscribe`)
        .then((res) => {
          setIsOpenNoti(true);
          setMsgNoti(`Unsubscribe successfully!`);
          reloadListPM();
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      api
        .patch(`/api/v1/managements/push_messages/${item.id}/subscribe`)
        .then((res) => {
          setIsOpenNoti(true);
          setMsgNoti(`Subscribe successfully!`);
          reloadListPM();
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
    //     /api/v1/managements/push_messages/id/subscribe
    // /api/v1/managements/push_messages/id/unsubscribe
  }

  const [emailDetailId, setEmailDetailId] = useState();
  const [idPMUpdate, setIdPMUpdate] = useState();
  function editPushMessage(item) {
    setUpdate(true);
    setIdPMUpdate(item.id);
    setEmailDetailId(item.email_id);
    if (item.has_timezone_exclusion == 'yes') {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }

    console.log('email detail id: ', item.email_id);

    item.started_at = item.started_at.substring(0, 19).replaceAll('T', ' ');
    delete item.id;
    delete item.updated_at;
    delete item.created_at;
    console.log(item);
    setItemUpdate(item);
    let numDiv = [];
    for (var i = 0; i < item.variables.length; i++) {
      numDiv.push(`newDiv${i}`);
      // if(document.getElementById(`variable_id${i}`)!=null &&
      // document.getElementById(`operator${i}`) != null &&
      // document.getElementById(`value${i}`) != null){
      //   //  document.getElementById(`variable_id${i}`).value = item.variables[i].variable_id
      //   // document.getElementById(`operator${i}`).value = item.variables[i].operator
      //   // document.getElementById(`value${i}`).value = item.variables[i].value
      // }
    }
    setCustomDiv(numDiv);
    setNumHotTemp(item.variables.length);

    setIsOpenAddPM(true);
  }

  function deletePMConf(id) {
    setIsOpenDelete(true);
    setIdDelete(id);
  }

  function deletePM() {
    setIsOpenDelete(false);
    api
      .delete(`/api/v1/managements/push_messages/${idDelete}`)
      .then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          setMsgNoti('Delete Push Message successfully');
          setIsOpenNoti(true);
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
            reloadListPM();
          }, 1500);
        } else if (res.data.code == 2) {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        if (error?.response.data.code == 0) {
          tokenExpired();
        }
      });
  }

  function checkTZ(check) {
    // console.log('checked: ',check)
    if (check == 'yes') {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4>Push message</h4>
              </CardHeader>
              <CardBody>
                <div className="push-message-option">
                  <div
                    id="payment_management_setting"
                    style={{ color: '#43b8af' }}
                    className="push-message-option-item"
                    onClick={() => pushMessageList()}
                  >
                    PUSH MESSAGE LIST
                  </div>
                  <div
                    id="payment_management_order_his"
                    className="push-message-option-item"
                    onClick={() => deliveryHistory()}
                  >
                    DELIVERY HISTORY
                  </div>
                </div>
                <div id="table_push_message_list" style={{ width: '100%' }}>
                  <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ width: '5%' }}>No</th>
                        <th style={{ width: '25%' }}>Push message name</th>
                        <th style={{ width: '15%' }}>Sending method</th>
                        <th style={{ width: '20%' }}>Start date and time</th>
                        <th style={{ width: '15%' }}>Situation</th>
                        <th style={{ width: '150px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listPushMessage?.map((item, i) => (
                        <tr key={i}>
                          <td style={{ width: '5%', border: '1px solid #7186a0' }}>{i}</td>
                          <td style={{ width: '25%', border: '1px solid #7186a0' }}>
                            {item.title}
                          </td>
                          <td style={{ width: '15%', border: '1px solid #7186a0' }}>
                            {item.sending_method === 'email' ? 'Email' : 'SMS'}
                          </td>
                          <td style={{ width: '20%', border: '1px solid #7186a0' }}>
                            {item.started_at.substring(0, 19).replaceAll('T', ' ')}
                          </td>
                          <td style={{ width: '15%', border: '1px solid #7186a0' }}>
                            {item.subscribe_status === 'subscribe'
                              ? 'Under delivery reservation'
                              : 'Unsubscribed'}
                          </td>
                          <td style={{ width: '150px', border: '1px solid #7186a0' }}>
                            <div style={{ width: '100%', display: 'flex' }}>
                              <button
                                style={{
                                  width: '32.33%',
                                  margin: '0px 1%',
                                  borderRadius: '5px',
                                  backgroundColor: `${
                                    item.subscribe_status === 'subscribe' ? '#F39C12' : '#9B59B6'
                                  }`,
                                  border: 'none',
                                  color: 'white',
                                }}
                                onClick={() => changeStatus(item)}
                              >
                                {item.subscribe_status === 'subscribe' ? '配信停止' : '配信する'}
                              </button>
                              <button
                                style={{
                                  width: '32.33%',
                                  margin: '0px 1%',
                                  borderRadius: '5px',
                                  backgroundColor: '#1ABC9C',
                                  border: 'none',
                                  color: 'white',
                                }}
                                onClick={() => editPushMessage(item)}
                              >
                                編集
                              </button>
                              <button
                                style={{
                                  width: '32.33%',
                                  margin: '0px 1%',
                                  borderRadius: '5px',
                                  backgroundColor: '#E74C3C',
                                  border: 'none',
                                  color: 'white',
                                }}
                                onClick={() => deletePMConf(item.id)}
                              >
                                削除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
                    <button className="push-message-btn-adddition" onClick={() => addPM()}>
                      Addition
                    </button>
                  </div>
                </div>
                <div id="table_delivery_history" style={{ width: '100%', display: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h4
                      style={{
                        margin: '0',
                        fontWeight: '400',
                        fontSize: '1.2em',
                      }}
                    >
                      Aggregation period
                    </h4>
                    <div style={{ borderRadius: '5px', padding: '5px' }}>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => selectDateStart(date)}
                        dateFormat="yyyy-MM-dd"
                        value={startDate}
                      />
                    </div>
                    <h4
                      style={{
                        margin: '0',
                        fontWeight: '400',
                        fontSize: '1.2em',
                      }}
                    >
                      から
                    </h4>
                    <div style={{ borderRadius: '5px', padding: '5px' }}>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => selectDateEnd(date)}
                        dateFormat="yyyy-MM-dd"
                        value={endDate}
                        // value={
                        //   endDatePreview
                        //     ? endDatePreview.toISOString().slice(0, 10).replaceAll('-', '/')
                        //     : 'yyyy/mm/dd'
                        // }
                      />
                    </div>
                    まで &emsp;<button className="push-message-btn-search">Search</button>
                  </div>
                  <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ width: '5%' }}>No</th>
                        <th style={{ width: '30%' }}>Push message name</th>
                        <th style={{ width: '15%' }}>Delivery date & time</th>
                        <th style={{ width: '20%' }}>Number of sent SMS</th>
                        <th style={{ width: '30%' }}>Number of failed SMS transmissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ width: '5%', border: '1px solid #7186a0' }}>No</td>
                        <td style={{ width: '30%', border: '1px solid #7186a0' }}>
                          Push message name
                        </td>
                        <td style={{ width: '15%', border: '1px solid #7186a0' }}>
                          Delivery date & time
                        </td>
                        <td style={{ width: '20%', border: '1px solid #7186a0' }}>
                          Number of sent SMS
                        </td>
                        <td style={{ width: '30%', border: '1px solid #7186a0' }}>
                          Number of failed SMS transmissions
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalDetail open={isOpenAddPM} onClose={() => closeAddPM()}>
          <div
            style={{ width: '100%', height: '97.5%', overflowY: 'auto' }}
            onLoad={getEmailList()}
          >
            <form id="form_add_PM">
              <div className="push-message-add-form">
                <span className="push-message-span-form">
                  Push message name
                  <span style={{ color: 'red' }}>*</span>
                </span>
                <input
                  id="title"
                  name="title"
                  defaultValue={update == true ? itemUpdate.title : ''}
                  className="push-message-input-form"
                  onChange={() => utils.checkRequired('title', 'titleErr', 'Push message name')}
                ></input>
              </div>
              <div className="push-message-add-form">
                <span className="push-message-span-form"></span>
                <span className="push-message-input-form">
                  * Give any name to the push message. This name will never appear in chat. <br />
                </span>
              </div>
              <div
                className="push-message-add-form"
                style={{ marginTop: '-20px', marginBottom: '5px' }}
              >
                <span className="push-message-span-form"></span>
                <span id="titleErr" style={{ color: 'red', display: 'none' }}></span>
              </div>
              <div className="push-message-add-form">
                <span className="push-message-span-form">Sending method</span>
                <select
                  id="push_message_sending_method"
                  name="sending_method"
                  className="push-message-input-form"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <br />
              <div className="push-message-add-form">
                <span className="push-message-span-form">
                  Email
                  <span style={{ color: 'red' }}>*</span>
                </span>
                <select id="push_message_email" name="email_id" className="push-message-input-form">
                  {/* <option value="">Please select email</option> */}
                </select>
              </div>
              <br />
              <div className="push-message-add-form">
                <span className="push-message-span-form">
                  Start date time
                  <span style={{ color: 'red' }}>*</span>
                </span>
                <div className="push-message-input-form" >
                  <DatePicker
                  className='pm_date_pick'
                    name="started_at"
                    id="startDateTime"
                    selected={startDate}
                    onChange={(date) => handleChangeDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                  />
                </div>
                {/* <input id='push_message_name' className='push-message-input-form'></input> */}
              </div>
              <div className="push-message-add-form">
                <span className="push-message-span-form"></span>
                <span className="push-message-input-form">
                  * Specify the date and time to send the push message. <br />
                </span>
              </div>
              <div
                className="push-message-add-form"
                style={{ marginTop: '-20px', marginBottom: '5px' }}
              >
                <span className="push-message-span-form"></span>
                <span id="startDateTimeErr" style={{ color: 'red', display: 'none' }}></span>
              </div>
              <div className="push-message-add-form">
                <span className="push-message-span-form">
                  Time zone exclusions for autosend pushes
                </span>
                <span>
                  <input
                    id="has_timezone_exclusion"
                    name="has_timezone_exclusion"
                    onChange={(e) =>
                      selectTimezoneExclusion(e.target.checked, itemUpdate?.has_timezone_exclusion)
                    }
                    type="checkbox"
                    checked={isChecked}
                    style={{ marginTop: '15px' }}
                    // onLoad={()=>checkTZ(itemUpdate?.has_timezone_exclusion)}
                  />
                </span>
              </div>
              <br />
              <div
                id="excludedTime"
                style={{
                  width: '100%',
                  display: `${
                    update == true && itemUpdate.has_timezone_exclusion === 'yes' ? 'block' : 'none'
                  }`,
                }}
              >
                <div className="push-message-add-form">
                  <span className="push-message-span-form">
                    Excluded time
                    <span style={{ color: 'red' }}>*</span>
                  </span>
                  <span style={{ display: 'flex', width: '80%' }}>
                    <select
                      id="excluded_time_from"
                      name="excluded_time_from"
                      defaultValue={update == true ? itemUpdate.excluded_time_from : ''}
                      className="push-message-input-form"
                      style={{ width: '35%' }}
                    >
                      {listExcludedTimeAlt.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    &ensp; <span>~</span> &ensp;
                    <select
                      id="excluded_time_to"
                      name="excluded_time_to"
                      defaultValue={update == true ? itemUpdate.excluded_time_to : ''}
                      className="push-message-input-form"
                      style={{ width: '35%' }}
                    >
                      {listExcludedTimeAlt.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
                <br />
                <div className="push-message-add-form">
                  <span className="push-message-span-form">
                    Alternate send time
                    <span style={{ color: 'red' }}>*</span>
                  </span>
                  <span style={{ display: 'flex', width: '80%' }}>
                    <select
                      id="alternate_send_time   "
                      name="alternate_send_time"
                      defaultValue={update == true ? itemUpdate.alternate_send_time : ''}
                      className="push-message-input-form"
                      style={{ width: '35%' }}
                    >
                      {listExcludedTimeAlt.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
                <div className="push-message-add-form">
                  <span className="push-message-span-form"></span>
                  <span id="timeZoneErr" style={{ width: '80%' }}></span>
                </div>
              </div>
              <div
                style={{ width: '98%', height: '1px', margin: '10px 1%', background: 'grey' }}
              ></div>
              <span>Target person designation</span>
              <p>*By adding conditions, you can narrow down the recipients of the push message.</p>
              <p>
                Currently, there are 0 recipients.<span style={{ color: 'blue' }}>[update]</span>
              </p>
              <div style={{ width: '95%', margin: '10px 2.5%' }}>
                <div style={{ width: '100%', display: 'flex' }}>
                  <div style={{ width: '15%', margin: '1% 1.5%' }}></div>
                  <select
                    id="1stVar"
                    name="1stVar"
                    defaultValue={'variable'}
                    style={{ width: '15%', margin: '1% 1%' }}
                  >
                    <option value="variable">Variable</option>
                  </select>
                  <select
                    name="1stVar"
                    id="1stVar"
                    defaultValue={'last_message_datetime'}
                    style={{ width: '30%', margin: '1% 1%' }}
                  >
                    <option value="last_message_datetime">last_message_datetime</option>
                  </select>
                  <select
                    name="1stOperator"
                    defaultValue={'of'}
                    id="operator"
                    style={{ width: '15%', margin: '1% 1%' }}
                  >
                    <option value="of">Of</option>
                  </select>
                  <select
                    name="last_message_datetime_since"
                    id="last_message_datetime_since"
                    style={{ width: '15%', margin: '1% 1%' }}
                  >
                    {alternateSendTime.map((time, i) => (
                      <option key={i} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <div style={{ width: '15%', margin: '1% 1.25%' }}></div>
                </div>
                {customDiv.map((item, i) => (
                  <div id={`newCDiv${i}`} style={{ width: '100%', display: 'flex' }} key={i}>
                    <select
                      name={`newAnd${i}`}
                      id={`newAnd${i}`}
                      defaultValue={`and`}
                      style={{ width: '15%', margin: '1% 1%' }}
                    >
                      <option value="and">And</option>
                    </select>
                    <select
                      id={`var${i}`}
                      name={`var${i}`}
                      defaultValue={'variable'}
                      style={{ width: '15%', margin: '1% 1%' }}
                    >
                      <option value="variable">Variable</option>
                    </select>
                    <select
                      name={`variable_id${i}`}
                      id={`variable_id${i}`}
                      defaultValue={update == true ? itemUpdate?.variables[i]?.variable_id : ''}
                      style={{ width: '30%', margin: '1% 1%' }}
                      onChange={(e) => selectVariableVal(e.target.value, i)}
                    >
                      {/* <option value="current_url">current_url</option>
                      <option value="current_url_param">current_url_param</option>
                      <option value="current_url_title">current_url_title</option>
                      <option value="user_id">user_id</option>
                      <option value="bot_id">bot_id</option>
                      <option value="preview_flg">preview_flg</option>
                      <option value="user_ip_address">user_ip_address</option>
                      <option value="user_country">user_country</option>
                      <option value="user_device">user_device</option>
                      <option value="user_browser">user_browser</option>
                      <option value="user_agent">user_agent</option>
                      <option value="cv_datetime">cv_datetime</option>
                      <option value="cv_flg">cv_flg</option>
                      <option value="start_datetime">cvstart_datetime_flg</option>
                      <option value="user_referer_firstopen">user_referer_firstopen</option>
                      <option value="user_referer_current">user_referer_current</option> */}
                      {listVar?.map((item, i) => (
                        <option value={`${item.id}`} key={i}>
                          {item.variable_name}
                        </option>
                      ))}
                    </select>
                    <select
                      name={`operator${i}`}
                      defaultValue={update == true ? itemUpdate?.variables[i]?.operator : 'is'}
                      id={`operator${i}`}
                      style={{ width: '15%', margin: '1% 1%' }}
                    >
                      <option value="is">Is</option>
                      <option value="is_not">Is not</option>
                      <option value="contains">Contains</option>
                    </select>
                    <input
                      name={`value${i}`}
                      id={`value${i}`}
                      defaultValue={update == true ? itemUpdate?.variables[i]?.value : ''}
                      style={{ width: '15%', margin: '1% 1%' }}
                    />
                    {/* {alternateSendTime?.map((time, i) => (
                        <option key={i} value={time}>
                          {time}
                        </option>
                      ))}
                    </select> */}
                    <button
                      style={{ width: '15%', margin: '1% 1%' }}
                      onClick={(e) => deleteCDiv(e, i)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  style={{
                    float: 'right',
                    width: '130px',
                    padding: '7.5px 15px',
                    textAlign: 'center',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#52cbce',
                    color: 'white',
                  }}
                  onClick={(e) => newTemp(e)}
                >
                  Add condition
                </button>
              </div>
            </form>
            <div style={{ width: '95%', margin: '5% 2.5% 5% 2.5%' }}>
              <button
                style={{
                  float: 'left',
                  width: '110px',
                  padding: '7.5px 35px',
                  textAlign: 'center',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#66615b',
                  color: 'white',
                }}
                onClick={() => setIsOpenAddPM(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  float: 'right',
                  width: '110px',
                  padding: '7.5px 35px',
                  textAlign: 'center',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#52cbce',
                  color: 'white',
                }}
                onClick={() => savePM()}
              >
                Save
              </button>
            </div>
          </div>
        </ModalDetail>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        <ModalShort
          open={isOpenDelete}
          onClose={() => {
            setIsOpenDelete(false);
          }}
        >
          <div style={{ width: '100%' }}>
            <h5>Do you want to delete this push message?</h5>
            <div style={{ display: 'flex', margin: 'auto', width: '100%' }}>
              <button
                style={{
                  width: '30%',
                  border: 'none',
                  padding: '5px 15px',
                  backgroundColor: '#52cbce',
                  borderRadius: '5px',
                  margin: 'auto',
                }}
                onClick={() => deletePM()}
              >
                Yes
              </button>
              <button
                style={{
                  width: '30%',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '5px',
                  margin: 'auto',
                }}
                onClick={() => setIsOpenDelete(false)}
              >
                No
              </button>
            </div>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default PushMessage;
