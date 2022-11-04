import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../assets/css/bot/variable.css';
import { MDBIcon } from 'mdbreact';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import api from './../../../api/api-management';
import ModalNoti from 'views/Popup/ModalNoti';
import ModalShort from 'views/Popup/ModalShort';
import { Button } from 'react-bootstrap';

function VariableManagement() {
  const [customVariable, setCustomVariable] = useState([]);
  const [numVar, setNumVar] = useState(1);
  const [botId, setBotId] = useState();
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [listVariable, setListVariable] = useState([]);
  const [openVariable, setOpenVariable] = useState(true);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [idVariable, setIdVariable] = useState();

  useEffect(() => {
    var bot_id = Cookies.get('bot_id');
    console.log(bot_id);
    setBotId(bot_id);
  }, []);

  useEffect(() => {
    var bot_id = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/chatbots/${bot_id}/variables?page=1`)
      .then((res) => {
        console.log(res.data.data);
        setListVariable(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function reloadListVariable() {
    api
      .get(`/api/v1/managements/chatbots/${botId}/variables?page=1`)
      .then((res) => {
        console.log(res.data.data);
        setListVariable(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //add field to add new variable
  function addNewVar() {
    let cDivs = customVariable;
    cDivs.push(`newDiv${numVar}`);
    setCustomVariable(cDivs);
    setNumVar(numVar + 1);
    console.log(customVariable);
    document.getElementById('add_new_var').setAttribute('disabled', '');
  }

  //save new variable
  function saveNewVar(index) {
    checkInput(`variable_name_${index}`, `errVarName_${index}`, 'Variable name');
    if (checkInput(`variable_name_${index}`, `errVarName_${index}`, 'Variable name')) {
      let name = document.getElementById(`variable_name_${index}`).value;
      let dfvalue = document.getElementById(`variable_value_${index}`).value;
      let add = { variable: { variable_name: name, default_value: dfvalue } };

      api
        .post(`/api/v1/managements/chatbots/${botId}/variables`, add)
        .then((res) => {
          if (res.data.code == 1) {
            console.log(res);
            reloadListVariable();
            setIsOpenNoti(true);
            setMsgNoti(`Save successfully!`);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
            }, 2000);
            const list = document.getElementById(`new_var_add_${index}`);
            while (list.hasChildNodes()) {
              list.removeChild(list.firstChild);
            }
            document.getElementById('add_new_var').removeAttribute('disabled');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
  function openDelete(id) {
    setIsOpenDelete(true);
    setIdVariable(id);
  }
  function deleteVariable() {
    api
      .delete(`/api/v1/managements/chatbots/${botId}/variables/${idVariable}`)
      .then((res) => {
        if (res.data.code == 1) {
          setIsOpenDelete(false);
          reloadListVariable();
          setMsgNoti(`Delete successfully!`);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        } else {
          setIsOpenDelete(false);
          setMsgNoti(`Delete failed!`);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //funtion update variable
  function updateVariable(id, index) {
    checkInput(`up_variable_name_${index}`, `errUpVarName_${index}`, 'Variable name');
    if (checkInput(`up_variable_name_${index}`, `errUpVarName_${index}`, 'Variable name')) {
      let name = document.getElementById(`up_variable_name_${index}`).value;
      let dfvalue = document.getElementById(`up_variable_value_${index}`).value;
      let editVariable = {
        variable: {
          variable_name: name,
          default_value: dfvalue,
        },
      };
      api
        .patch(`/api/v1/managements/chatbots/${botId}/variables/${id}`, editVariable)
        .then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            reloadListVariable();
            setIsOpenNoti(true);
            setMsgNoti(`Update successfully!`);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  //validate
  const field = document.getElementById.bind(document);
  function checkInput(idInput, errInput, lable) {
    if (field(idInput).value === '') {
      field(errInput).style.display = 'block';
      field(errInput).innerHTML = `${lable} required.`;
      return false;
    } else if (field(idInput).value.length > 30) {
      field(errInput).style.display = 'block';
      field(errInput).innerHTML = `${lable} > 30 charectors.`;
      return false;
    } else {
      field(errInput).style.display = 'none';
      field(errInput).innerHTML = ``;
      return true;
    }
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <button className="btn btn-primary" onClick={() => setOpenVariable(true)}>
                  USER-DEFINED VARIABLE
                </button>
                <button className="btn btn-primary" onClick={() => setOpenVariable(false)}>
                  SYSTEM VARIABLES
                </button>
                <p className="var-variable-note">
                  * A variable that stores the user's input contents. It can be assigned and
                  referenced in the scenario.
                </p>
              </CardHeader>
              <CardBody>
                {openVariable ? (
                  <div className="var_defined-variable">
                    <div className="var-form__head">
                      <label>Variable name</label>
                      <label>Default value</label>
                    </div>
                    <div className="var-form__variable">
                      {listVariable.map((item, i) => (
                        <div className="var-form__variable-group" id={`up_var_add_${i}`} key={i}>
                          <div className="var-form__variable-name">
                            <input
                              id={`up_variable_name_${i}`}
                              defaultValue={item.variable_name}
                              placeholder="Please input Variable name"
                              onChange={() =>
                                checkInput(
                                  `up_variable_name_${i}`,
                                  `errUpVarName_${i}`,
                                  'Variable name'
                                )
                              }
                              onBlur={() =>
                                checkInput(
                                  `up_variable_name_${i}`,
                                  `errUpVarName_${i}`,
                                  'Variable name'
                                )
                              }
                            />
                            <span id={`errUpVarName_${i}`} className="err-varriable"></span>
                          </div>

                          <div className="var-form__variable-name">
                            <input
                              id={`up_variable_value_${i}`}
                              defaultValue={item.default_value}
                              placeholder="Please input variable value"
                            />
                          </div>

                          <div className="var-form__variable-delete">
                            <MDBIcon
                              id="save_new_var"
                              fas
                              icon="edit"
                              style={{ fontSize: '20px' }}
                              onClick={() => updateVariable(item.id, i)}
                            ></MDBIcon>
                            <MDBIcon
                              id="save_new_var"
                              fas
                              icon="trash"
                              style={{ fontSize: '20px', marginLeft: '10px' }}
                              onClick={() => openDelete(item.id)}
                            ></MDBIcon>
                          </div>
                        </div>
                      ))}
                      {customVariable.map((cdiv, i) => (
                        <div className="var-form__variable-group" id={`new_var_add_${i}`} key={i}>
                          <div className="var-form__variable-name">
                            <input
                              id={`variable_name_${i}`}
                              placeholder="Please input Variable name"
                              onChange={() =>
                                checkInput(`variable_name_${i}`, `errVarName_${i}`, 'Variable name')
                              }
                              onBlur={() =>
                                checkInput(`variable_name_${i}`, `errVarName_${i}`, 'Variable name')
                              }
                            />
                            <span id={`errVarName_${i}`} className="err-varriable"></span>
                          </div>
                          <div className="var-form__variable-name">
                            <input
                              id={`variable_value_${i}`}
                              placeholder="Please input variable value"
                            />
                          </div>
                          <div className="var-form__variable-delete">
                            <MDBIcon
                              id="save_new_var"
                              fas
                              icon="save"
                              style={{ fontSize: '20px' }}
                              onClick={() => saveNewVar(i)}
                            ></MDBIcon>
                            <MDBIcon
                              id="cancel_new_var"
                              fas
                              icon="minus-circle"
                              style={{ fontSize: '20px', marginLeft: '10px' }}
                              onClick={() => cancelSaveNewVakr(i)}
                            ></MDBIcon>
                          </div>
                        </div>
                      ))}

                      <div className="var-div-add-new">
                        <button
                          id="add_new_var"
                          onClick={() => addNewVar()}
                          className="var-btn-add-new"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="var_system-variable">
                    <div className="var-form__head">
                      <label>Variable name</label>
                      <label>Variable description</label>
                    </div>
                    <div className="var-form__variable">
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="current_url" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          URL of the page that opened the bot
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="current_url_param" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          Parameters in the URL of the page that opened the bot (character string
                          after "?")
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="current_url_title" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          The title of the webpage that opened the bot
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_id" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          A unique ID automatically assigned to each user using the bot
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="bot_id" />
                        </div>
                        <div className="var-form__variable-value var-none-border">the bot's ID</div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="preview_flg" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          Flag for users using preview features (empty for normal users)
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_ip_address" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          IP address of the accessing user
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_country" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          Country name calculated from IP address
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_city" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          Municipality calculated from the IP address
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_device" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          The type of device the user is using (PC, smartphone, tablet)
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_browser" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          the type of browser the user is using
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_agent" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          User's browser information and OS information (each type, version, etc.)
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="cv_datetime" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          The date and time when the user reached the end of the scenario
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="cv_flg" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          Flag when the user has reached the end of the scenario (returns a value of
                          "1" for users who have reached the end, and a value of "0" for users in
                          the middle)
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="start_datetime" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          The date and time when you opened the chatbot and had your first
                          conversation
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_referer_firstopen" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          User's referral when first opened (the URL of the page they were on before
                          visiting the site)
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input type="text" disabled value="user_referer_current" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          User's last referral (the URL of the page they were on before visiting
                          your site)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ModalShort open={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>Do you want to delete this variable?</h4>
            <Button onClick={() => deleteVariable()}>Yes</Button>
            <Button onClick={() => setIsOpenDelete(false)}>No</Button>
          </div>
        </ModalShort>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default VariableManagement;
