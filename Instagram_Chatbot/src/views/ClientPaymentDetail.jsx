import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api/api-management";
import Modal from "./Popup/Modal";
import ModalNoti from "./Popup/ModalNoti";
import "./Popup/modal.css";
import "../assets/css/general.css";
import { Card, CardHeader, CardBody, Table, Row, Col } from "reactstrap";
import { Button } from "react-bootstrap";
import { Pagination } from "@material-ui/lab";
import ModalShort from "./Popup/ModalShort";
import { tokenExpired } from "api/tokenExpired";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("ja", ja);

function ClientPaymentDetail() {
  var [dataList, setDataList] = useState([]);
  const [clientDetail, setClientDetail] = useState({});

  var [totalPage, setTotalPage] = useState();
  var [page, setPage] = useState(1);

  //Update, Detail
  var [paymentHisId, setPaymentHisId] = useState();
  var [startAt, setStartAt] = useState("");
  var [endAt, setEndAt] = useState("");
  var [status, setStatus] = useState("unpaid");
  var [paidAt, setPaidAt] = useState("");

  var [msgNoti, setMsgNoti] = useState();
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState(false);
  const [isOpenDeletePaymentHis, setIsOpenDeletePaymentHis] = useState(false);

  function getClientId() {
    const url = window.location.pathname;
    if (url.includes("client-payment-detail")) {
      var id = url.slice(url.lastIndexOf("/") + 1);
      console.log("==========================\n Client Id: " + id);
      return id;
    }
    return "";
  }
  /**
   * Check the user permissions
   */
  useEffect(() => {
    if (
      Cookies.get("token") === undefined ||
      Cookies.get("token") == null ||
      Cookies.get("token") === ""
    ) {
      window.location.href = "/";
    }
    if (Cookies.get("is_auth") === "false") {
      window.location.href = "/";
    }
    const userRole = Cookies.get("user_role");
    if (!userRole || userRole !== "admin_deel") {
      window.location.href = "/";
    }
  }, []);

  React.useEffect(() => {
    let id = getClientId();
    if (id === "") return;
    api
      .get(`/api/v1/managements/clients/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setClientDetail(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });

    api
      .get(`/api/v1/managements/payment_histories/${id}?&page=1`)
      .then((res) => {
        console.log(res.data);
        setDataList(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function reloadListPayment(pgIndex) {
    api
      .get(
        `/api/v1/managements/payment_histories/${clientDetail.id}?&page=${pgIndex}`
      )
      .then((res) => {
        var totalPage = Math.ceil(res.data.total / 25);
        if (pgIndex > totalPage) {
          api
            .get(
              `/api/v1/managements/payment_histories/${clientDetail.id}?&page=${totalPage}`
            )
            .then((resp) => {
              console.log(res.data.data);
              setDataList(resp.data.data);
            });
        } else {
          console.log(res.data.data);
          setDataList(res.data.data);
        }
        setTotalPage(totalPage);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updatePaymentHis(item) {
    console.log("detail: ", item);
    setPaymentHisId(item.id);
    if (item.start_at != null) setStartAt(new Date(item.start_at));
    if (item.end_at != null) setEndAt(new Date(item.end_at));
    if (item.paid_at != null) setPaidAt(new Date(item.paid_at));
    setStatus(item.status);

    setIsOpenUpdate(true);
  }

  function deletePaymentPopUp(id) {
    setPaymentHisId(id);
    setIsOpenDeletePaymentHis(true);
  }
  function deletePaymentHis() {
    setIsOpenDeletePaymentHis(false);
    api
      .delete(`/api/v1/managements/payment_histories/${paymentHisId}`)
      .then((res) => {
        reloadListPayment(page);
        showNotification("削除しました!");
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updatePayment() {
    if(!checkStatus()) return;
    var elements = document.getElementById("updateForm").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      obj[item.name] = item.value;
    }
    api
      .patch(`/api/v1/managements/payment_histories/${paymentHisId}`, {
        payment: obj,
      })
      .then((res) => {
        reloadListPayment(page);
        showNotification("クライアント更新しました!");
        setIsOpenUpdate(false);resetVariable();
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function addPaymentPopup() {
    setIsOpenAddPayment(true);
  }
  function addPayment() {
    if(!checkStatus()) return;
    var elements = document.getElementById("addForm").elements;
    var obj = {};
    for (var i = 0; i < elements.length - 1; i++) {
      var item = elements.item(i);
      obj[item.name] = item.value;
    }
    obj["client_id"] = clientDetail.id;
    api
      .post(`/api/v1/managements/payment_histories`, { payment: obj })
      .then((res) => {
        if (res.data.code === 1 || res.data.code === "1") {
          reloadListPayment();
          showNotification("クライアント追加しました!");
          setIsOpenAddPayment(false);
          resetVariable();
        } else if (res.data?.code === 2 || res.data?.code === "2") {
          showNotification(res.data.message);
          setIsOpenAddPayment(false);resetVariable();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function handleChange(event, value) {
    console.log("pageIndex: ", value);
    setPage(parseInt(value));
    reloadListPayment(value);
    document.querySelector(".main-panel").scrollTop = 0;
  }
  function showNotification(message) {
    setMsgNoti(message);
    setIsOpenNoti(true);
    setTimeout(() => {
      setMsgNoti("");
      setIsOpenNoti(false);
    }, 2000);
  }

  function resetVariable(){
    setPaymentHisId("");
        setStartAt("");
        setEndAt("");
        setStatus("unpaid");
        setPaidAt("");
  }

  function checkStatus(){
    var status = document.getElementById("status").value;
    var paidAt = document.getElementById("paidAt").value;
    if(status === 'paid'){
      if(paidAt === 'yyyy/mm/dd' || paidAt === null || paidAt === undefined){
        document.getElementById('paidAtErrMsg').innerHTML = '支払日は必須です';
        document.getElementById('paidAtErrMsg').style.display = 'block';
        return false;
      }
    }
    return true;
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div
                  className="swap"
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* date pick */}
                  </div>
                  <div
                    className="div_right"
                    style={{ float: "right", width: "15%" }}
                  >
                    <Button
                      type="text"
                      onClick={() => addPaymentPopup()}
                      style={{ backgroundColor: "#66615b" }}
                    >
                      支払いの追加
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table style={{ textAlign: "center", tableLayout: "fixed" }}>
                    <thead className="text-primary">
                      <tr>
                        <th colSpan={1}> ID </th>
                        <th colSpan={2}> 課金開始日 </th>
                        <th colSpan={2}> 課金終了日 </th>
                        <th colSpan={2}> スターテス </th>
                        <th colSpan={2}> 支払日 </th>
                        <th colSpan={3}> アクション </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList &&
                        dataList.map((item, index) => (
                          <tr
                            key={index}
                            style={{
                              overflow: "visible",
                              height: "14px",
                              backgroundColor: "white",
                            }}
                          >
                            <td colSpan={1}>{item.id}</td>
                            <td colSpan={2}>
                              {item.start_at != null
                                ? item.start_at
                                    .slice(0, 10)
                                    .replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={2}>
                              {item.end_at != null
                                ? item.end_at.slice(0, 10).replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={2}>
                              {item.status === "paid" ? "支払われた" : "未払い"}
                            </td>
                            <td colSpan={2}>
                              {item.paid_at != null
                                ? item.paid_at.slice(0, 10).replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={3}>
                              <div style={{ display: "inline-flex" }}>
                                <div onClick={() => updatePaymentHis(item)}>
                                  <i
                                    className="nc-icon nc-align-center nc-3x"
                                    style={{
                                      fontSize: "30px",
                                      marginTop: "5px",
                                      marginRight: "30px",
                                    }}
                                  ></i>
                                </div>
                                <div
                                  onClick={() => deletePaymentPopUp(item.id)}
                                >
                                  <i
                                    className="nc-icon nc-box nc-3x"
                                    style={{
                                      fontSize: "30px",
                                      marginTop: "5px",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>

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

        <Modal open={isOpenUpdate} onClose={() => {setIsOpenUpdate(false); resetVariable();}}>
          <div style={{ width: "100%" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>支払いの更新</h4>
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#bbb",
                  marginBottom: "15px",
                }}
              ></div>
              <form id="updateForm" className="swap">
                <div className="label-input">
                  課金開始日
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="startAt"
                      className="input-field"
                      selected={startAt && startAt}
                      onChange={(date) => setStartAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="start_at"
                      locale="ja"
                      value={
                        startAt === "" ||
                        startAt === undefined ||
                        startAt === null
                          ? "yyyy/mm/dd"
                          : startAt
                              .toISOString()
                              .slice(0, 10)
                              .replaceAll("-", "/")
                      }
                    />
                  </div>
                  <label
                    id="startAtErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </div>
                <br />
                <br />
                <div className="label-input">
                  課金終了日
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="endAt"
                      className="input-field"
                      selected={endAt && endAt}
                      onChange={(date) => setEndAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="end_at"
                      locale="ja"
                      value={
                        endAt === "" || endAt === undefined || endAt === null
                          ? "yyyy/mm/dd"
                          : endAt
                              .toISOString()
                              .slice(0, 10)
                              .replaceAll("-", "/")
                      }
                    />
                  </div>
                  <label
                    id="endAtErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </div>
                <br />
                <br />
                <label className="label-input">
                  {" "}
                  スターテス
                  <span className="span-require">*必須</span>
                  <select
                    style={{ padding: "3px 0px 3px 0px" }}
                    className="input-field"
                    defaultValue={status}
                    name="status"
                    id="status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option key={0} value="paid">
                      Paid
                    </option>
                    <option key={1} value="unpaid">
                      Unpaid
                    </option>
                  </select>
                </label>
                <br />
                <br />

                <div className="label-input">
                支払日 {status === 'paid'? <span className="span-require">*必須</span> : null}
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="paidAt"
                      className="input-field"
                      selected={paidAt && paidAt}
                      onChange={(date) => setPaidAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="paid_at"
                      locale="ja"
                      value={
                        paidAt === "" || paidAt === undefined || paidAt === null
                          ? "yyyy/mm/dd"
                          : paidAt
                              .toISOString()
                              .slice(0, 10)
                              .replaceAll("-", "/")
                      }
                    />
                  </div>
                  <label
                    id="paidAtErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </div>
                <br />
                <br />
                <Button id="btnSubmit" onClick={updatePayment}>
                  更新
                </Button>
              </form>
            </div>
          </div>
        </Modal>

        <Modal
          open={isOpenAddPayment}
          onClose={() => {setIsOpenAddPayment(false); resetVariable();}}
        >
          <div style={{ width: "100%", minHeight: "300px" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>支払いの追加</h4>
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#bbb",
                  marginBottom: "15px",
                }}
              ></div>
              <form id="addForm" className="swap">
                <div className="label-input">
                  課金開始日
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="startAt"
                      className="input-field"
                      selected={startAt && startAt}
                      onChange={(date) => setStartAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="start_at"
                      locale="ja"
                      value={
                        startAt === "" ||
                        startAt === undefined ||
                        startAt === null
                          ? "yyyy/mm/dd"
                          : startAt
                              .toISOString()
                              .slice(0, 10)
                              .replaceAll("-", "/")
                      }
                    />
                  </div>
                  <label
                    id="startAtErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </div>
                <br />
                <br />
                <div className="label-input">
                  課金終了日
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="endAtNew"
                      className="input-field"
                      selected={endAt && endAt}
                      onChange={(date) => setEndAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="end_at"
                      locale="ja"
                      value={
                        endAt === "" || endAt === undefined || endAt === null
                          ? "yyyy/mm/dd"
                          : endAt
                              .toISOString()
                              .slice(0, 10)
                              .replaceAll("-", "/")
                      }
                    />
                  </div>
                  <label
                    id="endAtErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </div>
                <br />
                <br />
                <label className="label-input">
                  スターテス
                  <span className="span-require">*必須</span>
                  <select
                    style={{ padding: "3px 0px 3px 0px" }}
                    className="input-field"
                    defaultValue={"unpaid"}
                    name="status"
                    id="status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option key={0} value="paid">
                      Paid
                    </option>
                    <option key={1} value="unpaid">
                      Unpaid
                    </option>
                  </select>
                </label>
                <br />
                <br />

                <div className="label-input">
                支払日 {status === 'paid'? <span className="span-require">*必須</span> : null}
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="paidAt"
                      className="input-field"
                      selected={paidAt && paidAt}
                      onChange={(date) => setPaidAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="paid_at"
                      locale="ja"
                      value={
                        paidAt === "" || paidAt === undefined || paidAt === null
                          ? "yyyy/mm/dd"
                          : paidAt
                              .toISOString()
                              .slice(0, 10)
                              .replaceAll("-", "/")
                      }
                    />
                  </div>
                  <label
                    id="paidAtErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </div>
                <br />
                <br />
                <Button id="btnSubmit" onClick={addPayment}>
                  追加
                </Button>
              </form>
            </div>
          </div>
        </Modal>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div
            style={{ width: "400px", textAlign: "center", color: "#51cbce" }}
          >
            <span style={{ fontSize: "16px" }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        
        <ModalShort
          open={isOpenDeletePaymentHis}
          onClose={() => setIsOpenDeletePaymentHis(false)}
        >
          <div
            style={{ width: "400px", textAlign: "center", color: "#51cbce" }}
          >
            <h4>この支払い履歴を削除してもよろしいですか?</h4>
            <Button onClick={() => deletePaymentHis()}>はい</Button>
            <Button onClick={() => setIsOpenDeletePaymentHis(false)}>
              いいえ
            </Button>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default ClientPaymentDetail;
