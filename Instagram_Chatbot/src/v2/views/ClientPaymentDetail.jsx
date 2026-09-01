import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from 'api/api-management';
import "../assets/css/general.css";
import { Table } from "reactstrap";
import { Modal, Select, Input, message } from "antd";
import {
  AdminPage,
  AdminActionButton,
  AdminFormRow,
  AdminConfirmModal,
  useAdminHeaderActions,
} from "../components/AdminShell";
import { Pagination } from "@material-ui/lab";
import { tokenExpired } from "v2/api/tokenExpired";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { MDBIcon } from "mdbreact";
import moment from "moment-timezone";
registerLocale("ja", ja);

const PAYMENT_STATUS_OPTIONS = [
  { value: "paid", label: "支払済" },
  { value: "unpaid", label: "未払い" },
];

const EMPTY_FORM_ERRORS = { startAt: "", endAt: "", paidAt: "" };

function formatPaymentDate(date) {
  if (!date) return "";
  const tokyoTime = moment.tz("Asia/Tokyo").toISOString().slice(10);
  return moment(date).format("YYYY-MM-DD") + tokyoTime;
}

function PaymentFormFields({
  startAt,
  endAt,
  paidAt,
  status,
  price,
  subscriptionStartAt,
  errors,
  onChangeStartAt,
  onChangeEndAt,
  onChangePaidAt,
  onChangeStatus,
}) {
  return (
    <>
      <AdminFormRow label="課金開始日" required error={errors.startAt} htmlFor="startAt">
        <DatePicker
          id="startAt"
          className="input-field"
          selected={startAt || null}
          onChange={onChangeStartAt}
          dateFormat="yyyy/MM/dd"
          locale="ja"
          placeholderText="yyyy/mm/dd"
          minDate={subscriptionStartAt}
        />
      </AdminFormRow>
      <AdminFormRow label="課金終了日" required error={errors.endAt} htmlFor="endAt">
        <DatePicker
          id="endAt"
          className="input-field"
          selected={endAt || null}
          onChange={onChangeEndAt}
          dateFormat="yyyy/MM/dd"
          locale="ja"
          placeholderText="yyyy/mm/dd"
          minDate={startAt || subscriptionStartAt}
        />
      </AdminFormRow>
      <AdminFormRow label="価格" htmlFor="price">
        <Input id="price" value={price} disabled />
      </AdminFormRow>
      <AdminFormRow label="スターテス" htmlFor="status">
        <Select
          id="status"
          value={status}
          onChange={onChangeStatus}
          options={PAYMENT_STATUS_OPTIONS}
        />
      </AdminFormRow>
      <AdminFormRow
        label="支払日"
        required={status === "paid"}
        error={errors.paidAt}
        htmlFor="paidAt"
      >
        <DatePicker
          id="paidAt"
          className="input-field"
          selected={paidAt || null}
          onChange={onChangePaidAt}
          dateFormat="yyyy/MM/dd"
          locale="ja"
          placeholderText="yyyy/mm/dd"
          disabled={status === "unpaid"}
          minDate={startAt || subscriptionStartAt}
        />
      </AdminFormRow>
    </>
  );
}

function ClientPaymentDetail() {
  const [editMode, setEditMode] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [clientDetail, setClientDetail] = useState({});
  const [subscriptionStartAt, setSubscriptionStartAt] = useState(null);

  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(1);

  //Update, Detail
  const [paymentHisId, setPaymentHisId] = useState();
  const [startAt, setStartAt] = useState();
  const [endAt, setEndAt] = useState();
  const [status, setStatus] = useState("unpaid");
  const [paidAt, setPaidAt] = useState();
  const [price, setPrice] = useState(0);

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState(false);
  const [isOpenDeletePaymentHis, setIsOpenDeletePaymentHis] = useState(false);
  const [formErrors, setFormErrors] = useState(EMPTY_FORM_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function getClientId() {
    const url = window.location.pathname;
    if (url.includes("client-payment-detail")) {
      var id = url.slice(url.lastIndexOf("/") + 1);
      if (id === "client-payment-detail") {
        // id = JSON.parse(sessionStorage.getItem("client")).id;
        id = JSON.parse(localStorage.getItem("client")).id;
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
    setPrice(item.price);
    setFormErrors(EMPTY_FORM_ERRORS);

    setIsOpenUpdate(true);
  }

  function deletePaymentPopUp(id) {
    setPaymentHisId(id);
    setIsOpenDeletePaymentHis(true);
  }
  function deletePaymentHis() {
    setDeleting(true);
    api
      .delete(`/api/v1/managements/payment_histories/${paymentHisId}`)
      .then(() => {
        setIsOpenDeletePaymentHis(false);
        reloadListPayment(page);
        message.success("削除しました!");
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  }

  function updatePayment() {
    if (!checkStatus()) return;
    const obj = buildPaymentPayload();
    setSubmitting(true);
    api
      .patch(`/api/v1/managements/payment_histories/${paymentHisId}`, {
        payment: obj,
      })
      .then((res) => {
        if (res.data?.code === 2 || res.data?.code === "2") {
          message.warning(res.data.message);
          return;
        }
        reloadListPayment(page);
        message.success("クライアント更新しました!");
        setIsOpenUpdate(false);
        resetVariable();
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  function addPaymentPopup() {
    resetVariable();
    setIsOpenAddPayment(true);
  }
  function addPayment() {
    if (!checkStatus()) return;
    const obj = buildPaymentPayload();
    obj.client_id = clientDetail.id;
    setSubmitting(true);
    api
      .post(`/api/v1/managements/payment_histories`, { payment: obj })
      .then((res) => {
        if (res.data.code === 1 || res.data.code === "1") {
          reloadListPayment(page);
          message.success("クライアント追加しました!");
          setIsOpenAddPayment(false);
          resetVariable();
        } else if (res.data?.code === 2 || res.data?.code === "2") {
          message.warning(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  function handleChange(event, value) {
    setPage(parseInt(value));
    reloadListPayment(value);
    document.querySelector(".main-panel").scrollTop = 0;
  }
  function resetVariable() {
    setPaymentHisId("");
    setStartAt("");
    setEndAt("");
    setStatus("unpaid");
    setPaidAt("");
    setPrice(0);
    setFormErrors(EMPTY_FORM_ERRORS);
  }

  function checkStatus() {
    const nextErrors = { ...EMPTY_FORM_ERRORS };
    if (status === "paid" && !paidAt) {
      nextErrors.paidAt = "支払日は、必ず指定してください。";
    }
    if (!startAt) {
      nextErrors.startAt = "課金開始日は、必ず指定してください。";
    }
    if (!endAt) {
      nextErrors.endAt = "課金終了日は、必ず指定してください。";
    }
    setFormErrors(nextErrors);
    return !nextErrors.startAt && !nextErrors.endAt && !nextErrors.paidAt;
  }

  function buildPaymentPayload() {
    return {
      start_at: formatPaymentDate(startAt),
      end_at: formatPaymentDate(endAt),
      status,
      price,
      paid_at: paidAt ? formatPaymentDate(paidAt) : "",
    };
  }

  function onChangeStartAt(date) {
    setStartAt(date);
    setFormErrors((prev) => ({ ...prev, startAt: "" }));
    if (!endAt) {
      setEndAt(moment(date).add(1, "months").subtract(1, 'days').toDate());
    } else if (endAt && date > endAt) {
      setEndAt(date);
    }
  }
  function onChangeStatus(value) {
    setStatus(value);
    if (value === "unpaid") {
      setPaidAt(null);
      setFormErrors((prev) => ({ ...prev, paidAt: "" }));
    }
  }

  useAdminHeaderActions(
    editMode ? (
      <AdminActionButton action="create" label="支払いの追加" onClick={() => addPaymentPopup()} />
    ) : null
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table style={{ textAlign: "center", tableLayout: "fixed" }}>
                    <thead className="text-primary">
                      <tr>
                        <th colSpan={1}> ID </th>
                        <th colSpan={2}> 課金開始日 </th>
                        <th colSpan={2}> 課金終了日 </th>
                        <th colSpan={1}> 価格 </th>
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
                            <td colSpan={1}>{item.price}</td>
                            <td colSpan={1}>
                              {item.status === "paid" ? "支払済" : "未払い"}
                            </td>
                            <td colSpan={2}>
                              {item.paid_at
                                ? item.paid_at.slice(0, 10).replaceAll("-", "/")
                                : ""}
                            </td>
                            <td colSpan={2}>
                              {item.created_at
                                .slice(0, 10)
                                .replaceAll("-", "/")}
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

        <Modal
          title="支払いの更新"
          open={isOpenUpdate}
          onCancel={() => {
            setIsOpenUpdate(false);
            resetVariable();
          }}
          centered
          destroyOnClose
          footer={
            <div className="admin-form-actions">
              <AdminActionButton
                action="cancel"
                onClick={() => {
                  setIsOpenUpdate(false);
                  resetVariable();
                }}
              />
              <AdminActionButton
                action="save"
                label="更新"
                loading={submitting}
                onClick={updatePayment}
              />
            </div>
          }
        >
          <PaymentFormFields
            startAt={startAt}
            endAt={endAt}
            paidAt={paidAt}
            status={status}
            price={price}
            subscriptionStartAt={subscriptionStartAt}
            errors={formErrors}
            onChangeStartAt={onChangeStartAt}
            onChangeEndAt={(date) => {
              setEndAt(date);
              setFormErrors((prev) => ({ ...prev, endAt: "" }));
            }}
            onChangePaidAt={(date) => {
              setPaidAt(date);
              setFormErrors((prev) => ({ ...prev, paidAt: "" }));
            }}
            onChangeStatus={onChangeStatus}
          />
        </Modal>

        <Modal
          title="支払いの追加"
          open={isOpenAddPayment}
          onCancel={() => {
            setIsOpenAddPayment(false);
            resetVariable();
          }}
          centered
          destroyOnClose
          footer={
            <div className="admin-form-actions">
              <AdminActionButton
                action="cancel"
                onClick={() => {
                  setIsOpenAddPayment(false);
                  resetVariable();
                }}
              />
              <AdminActionButton
                action="create"
                label="追加"
                loading={submitting}
                onClick={addPayment}
              />
            </div>
          }
        >
          <PaymentFormFields
            startAt={startAt}
            endAt={endAt}
            paidAt={paidAt}
            status={status}
            price={price}
            subscriptionStartAt={subscriptionStartAt}
            errors={formErrors}
            onChangeStartAt={onChangeStartAt}
            onChangeEndAt={(date) => {
              setEndAt(date);
              setFormErrors((prev) => ({ ...prev, endAt: "" }));
            }}
            onChangePaidAt={(date) => {
              setPaidAt(date);
              setFormErrors((prev) => ({ ...prev, paidAt: "" }));
            }}
            onChangeStatus={onChangeStatus}
          />
        </Modal>

        <AdminConfirmModal
          open={isOpenDeletePaymentHis}
          danger
          loading={deleting}
          message="本当に削除しますか。"
          onOk={deletePaymentHis}
          onCancel={() => setIsOpenDeletePaymentHis(false)}
        />
      </div>
      </AdminPage>
    </>
  );
}

export default ClientPaymentDetail;
