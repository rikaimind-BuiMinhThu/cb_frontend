import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../assets/css/bot/variable.css';
import { MDBIcon } from 'mdbreact';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import api from './../../../api/api-management';
import ModalNoti from 'views/Popup/ModalNoti';

function VariableManagement() {
  const [customVariable, setCustomVariable] = useState([]);
  const [numVar, setNumVar] = useState(1);
  const [botId, setBotId] = useState();
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [listVariable, setListVariable] = useState([]);



  useEffect(() => {
    var bot_id = Cookies.get('bot_id')
    console.log(bot_id)
    setBotId(bot_id)
  }, [])

  useEffect(() => {
    var bot_id = Cookies.get('bot_id')
    api.get(`/api/v1/managements/chatbots/${bot_id}/variables?page=1`).then(res => {
      console.log(res.data.data)
      setListVariable(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  function reloadListVariable() {
    api.get(`/api/v1/managements/chatbots/${botId}/variables?page=1`).then(res => {
      console.log(res.data.data)
      setListVariable(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }

  //add field to add new variable
  function addNewVar() {
    let cDivs = customVariable;
    cDivs.push(`newDiv${numVar}`);
    setCustomVariable(cDivs);
    setNumVar(numVar + 1);
    document.getElementById('add_new_var').setAttribute('disabled', '');
  }

  //save new variable
  function saveNewVar(index) {
    let name = document.getElementById(`variable_name_${index}`).value
    let dfvalue = document.getElementById(`variable_value_${index}`).value
    let add = { variable: { variable_name: name, default_value: dfvalue } }
    console.log(add)

    api.post(`/api/v1/managements/chatbots/${botId}/variables`, add).then(res => {
      console.log(res);
      reloadListVariable()
      const list = document.getElementById(`new_var_add_${index}`);
      while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
      }
      document.getElementById('add_new_var').removeAttribute('disabled');


    }).catch(err => {
      console.log(err)
    })
  }

  function cancelSaveNewVakr(index) {
    const list = document.getElementById(`new_var_add_${index}`);
    // console.log(list)
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
    document.getElementById('add_new_var').removeAttribute('disabled');
  }

  //function delete variable
  function deleteVariable(id) {

  }

  //funtion update variable
  function updateVariable(id, index) {
    let name = document.getElementById(`up_variable_name_${index}`).value
    let dfvalue = document.getElementById(`up_variable_value_${index}`).value
    console.log(name, dfvalue)
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <button className='btn btn-primary'>USER-DEFINED VARIABLE</button>
                <button className='btn btn-primary'>SYSTEM VARIABLES</button>
                <p className='variable-note'>* A variable that stores the user's input contents. It can be assigned and referenced in the scenario.</p>
              </CardHeader>
              <CardBody>
                <div className=''>
                  <div className='form__head'>
                    <label>Variable name</label>
                    <label>Default value</label>
                  </div>
                  <div className='form__variable'>
                    {listVariable.map((item, i) => (
                      <div className='form__variable-group' id={`up_var_add_${i}`} key={i}>
                        <input id={`up_variable_name_${i}`} defaultValue={item.variable_name} className='form__variable-name' placeholder='Please input variavble name' />
                        <input id={`up_variable_value_${i}`} defaultValue={item.default_value} className='form__variable-value' placeholder='Please input variable value' />
                        <div className='form__variable-delete'>
                          <MDBIcon
                            id='save_new_var'
                            fas
                            icon="edit" style={{ fontSize: '20px' }}
                            onClick={() => updateVariable(item.id, i)}
                          ></MDBIcon>
                          <MDBIcon
                            id='save_new_var'
                            fas
                            icon="trash" style={{ fontSize: '20px', marginLeft: '10px' }}
                            onClick={() => deleteVariable(item.id)}
                          ></MDBIcon>

                        </div>
                      </div>
                    ))}
                    {customVariable.map((cdiv, i) => (
                      <div className='form__variable-group' id={`new_var_add_${i}`} key={i}>
                        <input id={`variable_name_${i}`} className='form__variable-name' placeholder='Please input variavble name' />
                        <input id={`variable_value_${i}`} className='form__variable-value' placeholder='Please input variable value' />
                        <div className='form__variable-delete'>
                          <MDBIcon
                            id='save_new_var'
                            fas
                            icon="save" style={{ fontSize: '20px' }}
                            onClick={() => saveNewVar(i)}
                          ></MDBIcon>
                          <MDBIcon
                            id='cancel_new_var'
                            fas
                            icon="minus-circle" style={{ fontSize: '20px', marginLeft: '10px' }}
                            onClick={() => cancelSaveNewVakr(i)}
                          ></MDBIcon>
                        </div>
                      </div>
                    ))}

                    <div className='var-div-add-new'>
                      <button id='add_new_var' onClick={() => addNewVar()} className='var-btn-add-new'>
                        Add
                      </button>


                    </div>

                  </div>
                </div>

                {/* <div className='variable-plus'>
                  <MDBIcon fas icon="plus-circle" />
                </div> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  )
}

export default VariableManagement