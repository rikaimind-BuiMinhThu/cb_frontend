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
import { MDBIcon } from "mdbreact";
import moment from "moment-timezone";
registerLocale("ja", ja);

function ClientPaymentDetail() {
  const [editMode, setEditMode] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [clientDetail, setClientDetail] = useState({});
  const [subscriptionStartAt, setSubscriptionStartAt] = useState(null);
  const [subscriptionEndAt, setSubscriptionEndAt] = useState(null);

  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(1);

  //Update, Detail
  const [paymentHisId, setPaymentHisId] = useState();
  const [startAt, setStartAt] = useState();
  const [endAt, setEndAt] = useState();
  const [status, setStatus] = useState("unpaid");
  const [paidAt, setPaidAt] = useState();

  const [msgNoti, setMsgNoti] = useState();
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState(false);
  const [isOpenDeletePaymentHis, setIsOpenDeletePaymentHis] = useState(false);

  function getClientId() {
    const url = window.location.pathname;
    if (url.includes("client-payment-detail")) {
      var id = url.slice(url.lastIndexOf("/") + 1);
      if (id === "client-payment-detail") {
        id = JSON.parse(sessionStorage.getItem("client")).id;
        setEditMode(false);
      }
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
    if (
      !(userRole || userRole === "admin_deel" || userRole === "admin_client")
    ) {
      window.location.href = "/";
    }
  }, []);

  React.useEffect(() => {
    let id = getClientId();
    if (id === "") return;
    api
      .get(`/api/v1/managements/clients/${id}`)
      .then((res) => {
        let client = res.data.data;
        setClientDetail(client);
        if (client.subscription_start_at) {
          setSubscriptionStartAt(
            moment.tz(client.subscription_start_at, "Asia/Tokyo").toDate()
          );
        }
        if (client.subscription_end_at) {
          setSubscriptionEndAt(
            moment.tz(client.subscription_end_at, "Asia/Tokyo").toDate()
          );
        }
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
        setDataList(res.data.data);
        setTotalPage(Math.ceil(res.data.total / 20));
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
        var totalPage = Math.ceil(res.data.total / 20);
        if (pgIndex > totalPage) {
          api
            .get(
              `/api/v1/managements/payment_histories/${clientDetail.id}?&page=${totalPage}`
            )
            .then((resp) => {
              setDataList(resp.data.data);
            });
        } else {
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
    setPaymentHisId(item.id);
    if (item.start_at != null)
      setStartAt(moment.tz(item.start_at, "Asia/Tokyo").toDate());
    if (item.end_at != null)
      setEndAt(moment.tz(item.end_at, "Asia/Tokyo").toDate());
    if (item.paid_at != null)
      setPaidAt(moment.tz(item.paid_at, "Asia/Tokyo").toDate());
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
    if (!checkStatus()) return;
    var obj = getFormData("updateForm");
    api
      .patch(`/api/v1/managements/payment_histories/${paymentHisId}`, {
        payment: obj,
      })
      .then((res) => {
        reloadListPayment(page);
        showNotification("クライアント更新しました!");
        setIsOpenUpdate(false);
        resetVariable();
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
    if (!checkStatus()) return;
    var obj = getFormData("addForm");
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
          setIsOpenAddPayment(false);
          resetVariable();
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

  function resetVariable() {
    setPaymentHisId("");
    setStartAt("");
    setEndAt("");
    setStatus("unpaid");
    setPaidAt("");
  }

  function checkStatus() {
    var status = document.getElementById("status").value;
    var paidAt = document.getElementById("paidAt").value;
    var startAt = document.getElementById("startAt").value;
    var endAt = document.getElementById("endAt").value;
    var error = 0;
    if (status === "paid") {
      if (!paidAt) {
        document.getElementById("paidAtErrMsg").innerHTML = "支払日は必須です";
        document.getElementById("paidAtErrMsg").style.display = "block";
        error += 1;
      }
    }
    if (!startAt) {
      document.getElementById("startAtErrMsg").innerHTML =
        "課金開始日は必須です";
      document.getElementById("startAtErrMsg").style.display = "block";
      error += 1;
    }
    if (!endAt) {
      document.getElementById("endAtErrMsg").innerHTML = "課金終了日は必須です";
      document.getElementById("endAtErrMsg").style.display = "block";
      error += 1;
    }
    return error === 0;
  }

  function getFormData(formId) {
    var elements = document.getElementById(formId).elements;
    var obj = {};
    let now = new moment.tz("Asia/Tokyo").toISOString().slice(10);
    for (var i = 0; i < elements.length - 1; i++) {
      var item = elements.item(i);
      obj[item.name] = item.value;
    }
    obj.start_at = obj.start_at.replaceAll("/", "-") + now;
    obj.end_at = obj.end_at.replaceAll("/", "-") + now;
    if (obj.paid_at) {
      obj.paid_at = obj.paid_at.replaceAll("/", "-") + now;
    }
    return obj;
  }

  function onChangeStartAt(date) {
    setStartAt(date);
    if (endAt && date > endAt) {
      setEndAt(date);
    }
  }
  function onChangeStatus(event) {
    setStatus(event.target.value);
    if (event.target.value === "unpaid") {
      setPaidAt(null);
    }
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              {editMode ? (
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
              ) : (
                <></>
              )}
              <CardBody>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table style={{ textAlign: "center", tableLayout: "fixed" }}>
                    <thead className="text-primary">
                      <tr>
                        <th colSpan={1}> ID </th>
                        <th colSpan={2}> 課金開始日 </th>
                        <th colSpan={2}> 課金終了日 </th>
                        <th colSpan={1}> スターテス </th>
                        <th colSpan={2}> 支払日 </th>
                        <th colSpan={2}> 作成日 </th>
                        {editMode ? <th colSpan={2}> アクション </th> : <></>}
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
                            <td colSpan={1}>{dataList.length - index}</td>
                            <td colSpan={2}>
                              {item.start_at
                                ? item.start_at
                                    .slice(0, 10)
                                    .replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={2}>
                              {item.end_at
                                ? item.end_at.slice(0, 10).replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={1}>
                              {item.status === "paid" ? "支払われた" : "未払い"}
                            </td>
                            <td colSpan={2}>
                              {item.paid_at
                                ? item.paid_at.slice(0, 10).replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={2}>
                              {item.created_at.slice(0, 10).replaceAll("-", "/")}
                            </td>
                            {editMode ? (
                              <td colSpan={2}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      marginRight: "20px",
                                      fontSize: "1.5em",
                                    }}
                                  >
                                    <MDBIcon
                                      far
                                      icon="edit"
                                      onClick={() => updatePaymentHis(item)}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      cursor: "pointer",
                                      fontSize: "1.5em",
                                    }}
                                  >
                                    <MDBIcon
                                      far
                                      icon="trash-alt"
                                      onClick={() =>
                                        deletePaymentPopUp(item.id)
                                      }
                                      light
                                    />
                                  </div>
                                </div>
                              </td>
                            ) : (
                              <></>
                            )}
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

        <Modal
          open={isOpenUpdate}
          onClose={() => {
            setIsOpenUpdate(false);
            resetVariable();
          }}
        >
          <div style={{ width: "100%", minHeight: "500px" }}>
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
                  課金開始日 <span className="span-require">*必須</span>
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="startAt"
                      className="input-field"
                      selected={startAt && startAt}
                      onChange={(date) => onChangeStartAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="start_at"
                      locale="ja"
                      value={startAt}
                      placeholderText="yyyy/mm/dd"
                      minDate={subscriptionStartAt}
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
                  課金終了日 <span className="span-require">*必須</span>
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="endAt"
                      className="input-field"
                      selected={endAt && endAt}
                      onChange={(date) => setEndAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="end_at"
                      locale="ja"
                      value={endAt}
                      placeholderText="yyyy/mm/dd"
                      minDate={startAt ?? subscriptionStartAt}
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
                  <select
                    style={{ padding: "3px 0px 3px 0px" }}
                    className="input-field"
                    defaultValue={status}
                    name="status"
                    id="status"
                    onChange={(e) => onChangeStatus(e)}
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
                  支払日
                  {status === "paid" ? (
                    <span className="span-require">*必須</span>
                  ) : null}
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="paidAt"
                      className="input-field"
                      selected={paidAt && paidAt}
                      onChange={(date) => setPaidAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="paid_at"
                      locale="ja"
                      value={paidAt}
                      placeholderText="yyyy/mm/dd"
                      disabled={status === "unpaid"}
                      minDate={startAt ?? subscriptionStartAt}
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
          onClose={() => {
            setIsOpenAddPayment(false);
            resetVariable();
          }}
        >
          <div style={{ width: "100%", minHeight: "500px" }}>
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
                  課金開始日 <span className="span-require">*必須</span>
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="startAt"
                      className="input-field"
                      selected={startAt && startAt}
                      onChange={(date) => onChangeStartAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="start_at"
                      locale="ja"
                      value={startAt}
                      placeholderText="yyyy/mm/dd"
                      minDate={subscriptionStartAt}
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
                  課金終了日 <span className="span-require">*必須</span>
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="endAt"
                      className="input-field"
                      selected={endAt && endAt}
                      onChange={(date) => setEndAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="end_at"
                      locale="ja"
                      value={endAt}
                      placeholderText="yyyy/mm/dd"
                      minDate={startAt ?? subscriptionStartAt}
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
                  <select
                    style={{ padding: "3px 0px 3px 0px" }}
                    className="input-field"
                    defaultValue={"unpaid"}
                    name="status"
                    id="status"
                    onChange={(e) => onChangeStatus(e)}
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
                  支払日{" "}
                  {status === "paid" ? (
                    <span className="span-require">*必須</span>
                  ) : null}
                  <div style={{ marginTop: "-24px" }}>
                    <DatePicker
                      id="paidAt"
                      className="input-field"
                      selected={paidAt && paidAt}
                      onChange={(date) => setPaidAt(date)}
                      dateFormat="yyyy/MM/dd"
                      name="paid_at"
                      locale="ja"
                      value={paidAt}
                      placeholderText="yyyy/mm/dd"
                      disabled={status === "unpaid"}
                      minDate={startAt ?? subscriptionStartAt}
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
