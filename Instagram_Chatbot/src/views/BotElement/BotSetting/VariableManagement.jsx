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
import { tokenExpired } from 'api/tokenExpired';
import Pagination from '@material-ui/lab/Pagination';

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

  let [totalPage, setTotalPage] = useState();
  var [pageIndex, setPageIndex] = useState(1);
  var [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

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
        if (res.data.data !== [] && res.data.total !== 0) {
          console.log(res?.data);
          setListVariable(res?.data?.data);
          setTotalPage(Math.ceil(res?.data?.total / 25));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function reloadListVariable(pgIndex) {
    console.log(pgIndex);
    api
      .get(`/api/v1/managements/chatbots/${botId}/variables?page=${pgIndex}&name=${search}`)
      .then((res) => {
        console.log(res);
        setListVariable(res.data.data);
        for (var i = 0; i < res.data.data.length; i++) {
          document.getElementById(`up_variable_name_${i}`).value = res?.data?.data[i].variable_name;
          document.getElementById(`up_variable_value_${i}`).value =
            res?.data?.data[i].default_value;
        }
        setTotalPage(Math.ceil(res.data.total / 25));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function handleChange(event, value) {
    if (totalPage > 1) {
      setPage(parseInt(value));
      setPageIndex(value);
      reloadListVariable(value);
      document.querySelector('.main-panel').scrollTop = 0;
    }
  }

  function handleSearch() {
    reloadListVariable(pageIndex);
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
    checkInput(`variable_name_${index}`, `errVarName_${index}`, '変数名');
    if (checkInput(`variable_name_${index}`, `errVarName_${index}`, '変数名')) {
      let name = document.getElementById(`variable_name_${index}`).value;
      let dfvalue = document.getElementById(`variable_value_${index}`).value;
      let add = { variable: { variable_name: name, default_value: dfvalue } };

      api
        .post(`/api/v1/managements/chatbots/${botId}/variables`, add)
        .then((res) => {
          if (res.data.code == 1) {
            console.log(res);
            reloadListVariable(pageIndex);
            setIsOpenNoti(true);
            setMsgNoti(`保存しました。`);
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
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
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
    console.log(idVariable);
    api
      .delete(`/api/v1/managements/chatbots/${botId}/variables/${idVariable}`)
      .then((res) => {
        if (res.data.code == 1) {
          setIsOpenDelete(false);
          reloadListVariable(pageIndex);
          setMsgNoti(`削除しました。`);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        } else {
          setIsOpenDelete(false);
          setMsgNoti(`削除できませんでした。`);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  //funtion update variable
  function updateVariable(id, index) {
    checkInput(`up_variable_name_${index}`, `errUpVarName_${index}`, '変数名');
    if (checkInput(`up_variable_name_${index}`, `errUpVarName_${index}`, '変数名')) {
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
            reloadListVariable(pageIndex);
            setIsOpenNoti(true);
            setMsgNoti(`更新しました。`);
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
  }

  //validate
  const field = document.getElementById.bind(document);
  function checkInput(idInput, errInput, lable) {
    if (field(idInput).value === '') {
      field(errInput).style.display = 'block';
      field(errInput).innerHTML = `${lable}は、必ず指定してください。`;
      return false;
    } else if (field(idInput).value.length > 30) {
      field(errInput).style.display = 'block';
      field(errInput).innerHTML = `${lable} 30 文字以上。`;
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
                  ユーザー定義関数
                </button>
                <button className="btn btn-primary" onClick={() => setOpenVariable(false)}>
                  システム変数
                </button>
                {openVariable ? (
                  <div className="var-variable-search">
                    <input
                      className="var-form-input"
                      type="text"
                      placeholder="変数検索..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button style={{ width: "100px" }} onClick={() => handleSearch()}>検索</Button>
                  </div>
                ) : (
                  ''
                )}
                <p className="var-variable-note">
                  ※ユーザの入力内容などを保管する変数です。シナリオの中で代入や参照ができます。
                </p>
              </CardHeader>
              <CardBody>
                {openVariable ? (
                  <div className="var_defined-variable">
                    <div className="var-form__head">
                      <label>変数名</label>
                      <label>デフォルト値</label>
                    </div>
                    <div className="var-form__variable">
                      {listVariable?.map((item, i) => (
                        <div className="var-form__variable-group" id={`up_var_add_${i}`} key={i}>
                          <div className="var-form__variable-name">
                            <input
                              className="var-form-input"
                              id={`up_variable_name_${i}`}
                              defaultValue={
                                item.variable_name == undefined ? '' : item.variable_name
                              }
                              placeholder="変数名をご入力ください"
                              onChange={() =>
                                checkInput(
                                  `up_variable_name_${i}`,
                                  `errUpVarName_${i}`,
                                  '変数名'
                                )
                              }
                              onBlur={() =>
                                checkInput(
                                  `up_variable_name_${i}`,
                                  `errUpVarName_${i}`,
                                  '変数名'
                                )
                              }
                            />
                            <span id={`errUpVarName_${i}`} className="err-varriable"></span>
                          </div>

                          <div className="var-form__variable-name">
                            <input
                              className="var-form-input"
                              id={`up_variable_value_${i}`}
                              defaultValue={
                                item.default_value == undefined ? '' : item.default_value
                              }
                              placeholder="変数値をご入力ください"
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
                              className="var-form-input"
                              id={`variable_name_${i}`}
                              placeholder="変数名をご入力ください"
                              onChange={() =>
                                checkInput(`variable_name_${i}`, `errVarName_${i}`, '変数名')
                              }
                              onBlur={() =>
                                checkInput(`variable_name_${i}`, `errVarName_${i}`, '変数名')
                              }
                            />
                            <span id={`errVarName_${i}`} className="err-varriable"></span>
                          </div>
                          <div className="var-form__variable-name">
                            <input
                              className="var-form-input"
                              id={`variable_value_${i}`}
                              placeholder="変数値をご入力ください"
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
                          追加
                        </button>
                      </div>
                    </div>
                    <Pagination
                      count={totalPage}
                      variant="outlined"
                      page={page}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div className="var_system-variable">
                    <div className="var-form__head">
                      <label>変数名</label>
                      <label>変数備考</label>
                    </div>
                    <div className="var-form__variable">
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="current_url"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ボットを開いたページのURL
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="current_url_param"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ボットを開いたページのURLについてるパラメータ（「?」以降の文字列）
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="current_url_title"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ボットを開いたwebページのタイトルZ
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input className="var-form-input" type="text" disabled value="user_id" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ボットを使用するユーザーごとに自動的に付与されるユニークなID
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input className="var-form-input" type="text" disabled value="bot_id" />
                        </div>
                        <div className="var-form__variable-value var-none-border">ボットのID</div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="preview_flg"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          プレビュー機能の使用ユーザーのフラグ（通常ユーザーは空）
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_ip_address"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          アクセスしたユーザーのIPアドレス
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_country"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          IPアドレスから割り出した国名
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_city"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          IPアドレスから割り出した市区町村
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_device"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ユーザーが使用しているデバイスの種類（PC、スマホ、タブレット）
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_browser"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ユーザーが使用しているブラウザの種類
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_agent"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ユーザーが使用しているブラウザ情報とOS情報（各種類、バージョンなど）
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="cv_datetime"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ユーザーがシナリオの終端まできた時の日時
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input className="var-form-input" type="text" disabled value="cv_flg" />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          ユーザーがシナリオの終端まできた時にフラグ（終端まできたユーザーは「1」の値、途中のユーザーは「0」の値を返す）
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="start_datetime"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          チャットボットを開き最初に会話をした日時
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_referer_firstopen"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          最初に開いた時のユーザーのリファラル（サイトに訪れる前に滞在していたページのURL）
                        </div>
                      </div>
                      <div className="var-form__variable-group">
                        <div className="var-form__variable-name">
                          <input
                            className="var-form-input"
                            type="text"
                            disabled
                            value="user_referer_current"
                          />
                        </div>
                        <div className="var-form__variable-value var-none-border">
                          最後に開いた時のユーザーのリファラル（サイトに訪れる前に滞在していたページのURL）
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
            <h4>変数を削除しますか。</h4>
            <Button onClick={() => deleteVariable()}>はい</Button>
            <Button onClick={() => setIsOpenDelete(false)}>いいえ</Button>
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
