import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import '../assets/css/general.css';
import { Table } from 'reactstrap';
import { Modal, Select, Input, message } from 'antd';
import {
  AdminPage,
  AdminActionButton,
  AdminFormRow,
  AdminConfirmModal,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { Pagination } from '@material-ui/lab';
import { tokenExpired } from 'v2/api/tokenExpired';
import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import { MDBIcon } from 'mdbreact';
import moment from 'moment-timezone';
import { getSignInPath } from 'v2/variables/constants';
import {
  ADD_BUTTON_LABEL,
  ADD_MONTHS,
  ADD_PAYMENT_LABEL,
  ADD_PAYMENT_TITLE,
  API_SUCCESS_CODE,
  API_SUCCESS_CODE_STRING,
  API_WARNING_CODE,
  API_WARNING_CODE_STRING,
  AUTH_FALSE_VALUE,
  CLIENTS_API_PATH,
  CLIENT_PAYMENT_DETAIL_SEGMENT,
  CLIENT_STORAGE_KEY,
  COL_ACTIONS,
  COL_BILLING_END,
  COL_BILLING_START,
  COL_CREATED_AT,
  COL_ID,
  COL_PAID_AT,
  COL_PRICE,
  COL_STATUS,
  DATE_DASH,
  DATE_PICKER_FORMAT,
  DATE_PLACEHOLDER,
  DATE_SLASH,
  DATE_SLICE_LENGTH,
  DAY_UNIT,
  DEFAULT_PRICE,
  DELETE_CONFIRM_MESSAGE,
  EMPTY_FORM_ERRORS,
  EMPTY_STRING,
  END_AT_REQUIRED,
  FIELD_ID_END_AT,
  FIELD_ID_PAID_AT,
  FIELD_ID_PRICE,
  FIELD_ID_START_AT,
  FIELD_ID_STATUS,
  INITIAL_PAGE,
  IS_AUTH_COOKIE_KEY,
  LABEL_BILLING_END,
  LABEL_BILLING_START,
  LABEL_PAID_AT,
  LABEL_PRICE,
  LABEL_STATUS,
  LOCALE_JA,
  MAIN_PANEL_SELECTOR,
  MOMENT_DATE_FORMAT,
  MONTH_UNIT,
  PAGE_SIZE,
  PAID_AT_REQUIRED,
  PAYMENT_HISTORIES_API_PATH,
  PAYMENT_STATUS_OPTIONS,
  ROLE_ADMIN_CLIENT,
  ROLE_ADMIN_DEEL,
  START_AT_REQUIRED,
  STATUS_LABEL_PAID,
  STATUS_LABEL_UNPAID,
  STATUS_PAID,
  STATUS_UNPAID,
  SUBTRACT_DAYS,
  SUCCESS_CLIENT_ADDED,
  SUCCESS_CLIENT_UPDATED,
  SUCCESS_DELETED,
  TIMEZONE_TOKYO,
  TOKEN_COOKIE_KEY,
  TOKEN_EXPIRED_CODE,
  UPDATE_BUTTON_LABEL,
  UPDATE_PAYMENT_TITLE,
  USER_ROLE_COOKIE_KEY,
} from './clientPaymentDetailConstants';

registerLocale(LOCALE_JA, ja);

const getPaymentHistoriesUrl = (clientId, pageIndex) =>
  `${PAYMENT_HISTORIES_API_PATH}/${clientId}?&page=${pageIndex}`;

const formatPaymentDate = (date) => {
  if (!date) return EMPTY_STRING;
  const tokyoTime = moment.tz(TIMEZONE_TOKYO).toISOString().slice(DATE_SLICE_LENGTH);
  return `${moment(date).format(MOMENT_DATE_FORMAT)}${tokyoTime}`;
};

const formatSlicedDate = (value) =>
  value.slice(0, DATE_SLICE_LENGTH).replaceAll(DATE_DASH, DATE_SLASH);

const formatOptionalDate = (value) => (value ? formatSlicedDate(value) : EMPTY_STRING);

const handleTokenExpired = (error) => {
  if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
    tokenExpired();
  }
};

const PaymentFormFields = ({
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
}) => (
  <>
    <AdminFormRow
      label={LABEL_BILLING_START}
      required
      error={errors.startAt}
      htmlFor={FIELD_ID_START_AT}
    >
      <DatePicker
        id={FIELD_ID_START_AT}
        className="input-field"
        selected={startAt || null}
        onChange={onChangeStartAt}
        dateFormat={DATE_PICKER_FORMAT}
        locale={LOCALE_JA}
        placeholderText={DATE_PLACEHOLDER}
        minDate={subscriptionStartAt}
      />
    </AdminFormRow>
    <AdminFormRow
      label={LABEL_BILLING_END}
      required
      error={errors.endAt}
      htmlFor={FIELD_ID_END_AT}
    >
      <DatePicker
        id={FIELD_ID_END_AT}
        className="input-field"
        selected={endAt || null}
        onChange={onChangeEndAt}
        dateFormat={DATE_PICKER_FORMAT}
        locale={LOCALE_JA}
        placeholderText={DATE_PLACEHOLDER}
        minDate={startAt || subscriptionStartAt}
      />
    </AdminFormRow>
    <AdminFormRow label={LABEL_PRICE} htmlFor={FIELD_ID_PRICE}>
      <Input id={FIELD_ID_PRICE} value={price} disabled />
    </AdminFormRow>
    <AdminFormRow label={LABEL_STATUS} htmlFor={FIELD_ID_STATUS}>
      <Select
        id={FIELD_ID_STATUS}
        value={status}
        onChange={onChangeStatus}
        options={PAYMENT_STATUS_OPTIONS}
      />
    </AdminFormRow>
    <AdminFormRow
      label={LABEL_PAID_AT}
      required={status === STATUS_PAID}
      error={errors.paidAt}
      htmlFor={FIELD_ID_PAID_AT}
    >
      <DatePicker
        id={FIELD_ID_PAID_AT}
        className="input-field"
        selected={paidAt || null}
        onChange={onChangePaidAt}
        dateFormat={DATE_PICKER_FORMAT}
        locale={LOCALE_JA}
        placeholderText={DATE_PLACEHOLDER}
        disabled={status === STATUS_UNPAID}
        minDate={startAt || subscriptionStartAt}
      />
    </AdminFormRow>
  </>
);

const ClientPaymentDetail = () => {
  const [editMode, setEditMode] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [clientDetail, setClientDetail] = useState({});
  const [subscriptionStartAt, setSubscriptionStartAt] = useState(null);

  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(INITIAL_PAGE);

  const [paymentHisId, setPaymentHisId] = useState();
  const [startAt, setStartAt] = useState();
  const [endAt, setEndAt] = useState();
  const [status, setStatus] = useState(STATUS_UNPAID);
  const [paidAt, setPaidAt] = useState();
  const [price, setPrice] = useState(DEFAULT_PRICE);

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState(false);
  const [isOpenDeletePaymentHis, setIsOpenDeletePaymentHis] = useState(false);
  const [formErrors, setFormErrors] = useState(EMPTY_FORM_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getClientId = () => {
    const url = window.location.pathname;
    if (!url.includes(CLIENT_PAYMENT_DETAIL_SEGMENT)) {
      return EMPTY_STRING;
    }
    const slicedId = url.slice(url.lastIndexOf('/') + 1);
    if (slicedId === CLIENT_PAYMENT_DETAIL_SEGMENT) {
      setEditMode(false);
      return JSON.parse(localStorage.getItem(CLIENT_STORAGE_KEY)).id;
    }
    return slicedId;
  };

  useEffect(() => {
    if (
      Cookies.get(TOKEN_COOKIE_KEY) === undefined ||
      Cookies.get(TOKEN_COOKIE_KEY) == null ||
      Cookies.get(TOKEN_COOKIE_KEY) === EMPTY_STRING
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
    }
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (!(userRole || userRole === ROLE_ADMIN_DEEL || userRole === ROLE_ADMIN_CLIENT)) {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    const id = getClientId();
    if (id === EMPTY_STRING) return;

    api
      .get(`${CLIENTS_API_PATH}/${id}`)
      .then((res) => {
        const client = res.data.data;
        setClientDetail(client);
        if (client.subscription_start_at) {
          setSubscriptionStartAt(
            moment.tz(client.subscription_start_at, TIMEZONE_TOKYO).toDate()
          );
        }
      })
      .catch((error) => {
        handleTokenExpired(error);
      });

    api
      .get(getPaymentHistoriesUrl(id, INITIAL_PAGE))
      .then((res) => {
        setDataList(res.data.data);
        setTotalPage(Math.ceil(res.data.total / PAGE_SIZE));
      })
      .catch((error) => {
        handleTokenExpired(error);
      });
  }, []);

  const reloadListPayment = (pgIndex) => {
    api
      .get(getPaymentHistoriesUrl(clientDetail.id, pgIndex))
      .then((res) => {
        const nextTotalPage = Math.ceil(res.data.total / PAGE_SIZE);
        if (pgIndex > nextTotalPage) {
          api
            .get(getPaymentHistoriesUrl(clientDetail.id, nextTotalPage))
            .then((resp) => {
              setDataList(resp.data.data);
            });
        } else {
          setDataList(res.data.data);
        }
        setTotalPage(nextTotalPage);
      })
      .catch((error) => {
        handleTokenExpired(error);
      });
  };

  const resetVariable = () => {
    setPaymentHisId(EMPTY_STRING);
    setStartAt(EMPTY_STRING);
    setEndAt(EMPTY_STRING);
    setStatus(STATUS_UNPAID);
    setPaidAt(EMPTY_STRING);
    setPrice(DEFAULT_PRICE);
    setFormErrors(EMPTY_FORM_ERRORS);
  };

  const updatePaymentHis = (item) => {
    setPaymentHisId(item.id);
    if (item.start_at != null) {
      setStartAt(moment.tz(item.start_at, TIMEZONE_TOKYO).toDate());
    }
    if (item.end_at != null) {
      setEndAt(moment.tz(item.end_at, TIMEZONE_TOKYO).toDate());
    }
    if (item.paid_at != null) {
      setPaidAt(moment.tz(item.paid_at, TIMEZONE_TOKYO).toDate());
    }
    setStatus(item.status);
    setPrice(item.price);
    setFormErrors(EMPTY_FORM_ERRORS);
    setIsOpenUpdate(true);
  };

  const deletePaymentPopUp = (id) => {
    setPaymentHisId(id);
    setIsOpenDeletePaymentHis(true);
  };

  const deletePaymentHis = () => {
    setDeleting(true);
    api
      .delete(`${PAYMENT_HISTORIES_API_PATH}/${paymentHisId}`)
      .then(() => {
        setIsOpenDeletePaymentHis(false);
        reloadListPayment(page);
        message.success(SUCCESS_DELETED);
      })
      .catch((error) => {
        handleTokenExpired(error);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const checkStatus = () => {
    const nextErrors = { ...EMPTY_FORM_ERRORS };
    if (status === STATUS_PAID && !paidAt) {
      nextErrors.paidAt = PAID_AT_REQUIRED;
    }
    if (!startAt) {
      nextErrors.startAt = START_AT_REQUIRED;
    }
    if (!endAt) {
      nextErrors.endAt = END_AT_REQUIRED;
    }
    setFormErrors(nextErrors);
    return !nextErrors.startAt && !nextErrors.endAt && !nextErrors.paidAt;
  };

  const buildPaymentPayload = () => ({
    start_at: formatPaymentDate(startAt),
    end_at: formatPaymentDate(endAt),
    status,
    price,
    paid_at: paidAt ? formatPaymentDate(paidAt) : EMPTY_STRING,
  });

  const updatePayment = () => {
    if (!checkStatus()) return;
    const obj = buildPaymentPayload();
    setSubmitting(true);
    api
      .patch(`${PAYMENT_HISTORIES_API_PATH}/${paymentHisId}`, {
        payment: obj,
      })
      .then((res) => {
        if (res.data?.code === API_WARNING_CODE || res.data?.code === API_WARNING_CODE_STRING) {
          message.warning(res.data.message);
          return;
        }
        reloadListPayment(page);
        message.success(SUCCESS_CLIENT_UPDATED);
        setIsOpenUpdate(false);
        resetVariable();
      })
      .catch((error) => {
        handleTokenExpired(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const addPaymentPopup = () => {
    resetVariable();
    setIsOpenAddPayment(true);
  };

  const addPayment = () => {
    if (!checkStatus()) return;
    const obj = {
      ...buildPaymentPayload(),
      client_id: clientDetail.id,
    };
    setSubmitting(true);
    api
      .post(PAYMENT_HISTORIES_API_PATH, { payment: obj })
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE || res.data.code === API_SUCCESS_CODE_STRING) {
          reloadListPayment(page);
          message.success(SUCCESS_CLIENT_ADDED);
          setIsOpenAddPayment(false);
          resetVariable();
        } else if (res.data?.code === API_WARNING_CODE || res.data?.code === API_WARNING_CODE_STRING) {
          message.warning(res.data.message);
        }
      })
      .catch((error) => {
        handleTokenExpired(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleChange = (event, value) => {
    setPage(parseInt(value));
    reloadListPayment(value);
    document.querySelector(MAIN_PANEL_SELECTOR).scrollTop = 0;
  };

  const onChangeStartAt = (date) => {
    setStartAt(date);
    setFormErrors((prev) => ({ ...prev, startAt: EMPTY_STRING }));
    if (!endAt) {
      setEndAt(moment(date).add(ADD_MONTHS, MONTH_UNIT).subtract(SUBTRACT_DAYS, DAY_UNIT).toDate());
    } else if (endAt && date > endAt) {
      setEndAt(date);
    }
  };

  const onChangeStatus = (value) => {
    setStatus(value);
    if (value === STATUS_UNPAID) {
      setPaidAt(null);
      setFormErrors((prev) => ({ ...prev, paidAt: EMPTY_STRING }));
    }
  };

  const onChangeEndAt = (date) => {
    setEndAt(date);
    setFormErrors((prev) => ({ ...prev, endAt: EMPTY_STRING }));
  };

  const onChangePaidAt = (date) => {
    setPaidAt(date);
    setFormErrors((prev) => ({ ...prev, paidAt: EMPTY_STRING }));
  };

  const closeUpdateModal = () => {
    setIsOpenUpdate(false);
    resetVariable();
  };

  const closeAddModal = () => {
    setIsOpenAddPayment(false);
    resetVariable();
  };

  useAdminHeaderActions(
    editMode ? (
      <AdminActionButton action="create" label={ADD_PAYMENT_LABEL} onClick={() => addPaymentPopup()} />
    ) : null
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
          <div className="admin-payment-detail-table-wrap">
            <Table className="admin-payment-detail-table">
              <thead className="text-primary">
                <tr>
                  <th colSpan={1}> {COL_ID} </th>
                  <th colSpan={2}> {COL_BILLING_START} </th>
                  <th colSpan={2}> {COL_BILLING_END} </th>
                  <th colSpan={1}> {COL_PRICE} </th>
                  <th colSpan={1}> {COL_STATUS} </th>
                  <th colSpan={2}> {COL_PAID_AT} </th>
                  <th colSpan={2}> {COL_CREATED_AT} </th>
                  {editMode ? <th colSpan={2}> {COL_ACTIONS} </th> : <></>}
                </tr>
              </thead>
              <tbody>
                {dataList &&
                  dataList.map((item, index) => (
                    <tr key={index} className="admin-payment-detail-row">
                      <td colSpan={1}>{dataList.length - index}</td>
                      <td colSpan={2}>{formatOptionalDate(item.start_at)}</td>
                      <td colSpan={2}>{formatOptionalDate(item.end_at)}</td>
                      <td colSpan={1}>{item.price}</td>
                      <td colSpan={1}>
                        {item.status === STATUS_PAID ? STATUS_LABEL_PAID : STATUS_LABEL_UNPAID}
                      </td>
                      <td colSpan={2}>{formatOptionalDate(item.paid_at)}</td>
                      <td colSpan={2}>{formatSlicedDate(item.created_at)}</td>
                      {editMode ? (
                        <td colSpan={2}>
                          <div className="admin-payment-detail-actions">
                            <div className="admin-payment-detail-icon admin-payment-detail-icon--edit">
                              <MDBIcon
                                far
                                icon="edit"
                                onClick={() => updatePaymentHis(item)}
                              />
                            </div>
                            <div className="admin-payment-detail-icon admin-payment-detail-icon--delete">
                              <MDBIcon
                                far
                                icon="trash-alt"
                                onClick={() => deletePaymentPopUp(item.id)}
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
            title={UPDATE_PAYMENT_TITLE}
            open={isOpenUpdate}
            onCancel={closeUpdateModal}
            centered
            destroyOnClose
            footer={
              <div className="admin-form-actions">
                <AdminActionButton action="cancel" onClick={closeUpdateModal} />
                <AdminActionButton
                  action="save"
                  label={UPDATE_BUTTON_LABEL}
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
              onChangeEndAt={onChangeEndAt}
              onChangePaidAt={onChangePaidAt}
              onChangeStatus={onChangeStatus}
            />
          </Modal>

          <Modal
            title={ADD_PAYMENT_TITLE}
            open={isOpenAddPayment}
            onCancel={closeAddModal}
            centered
            destroyOnClose
            footer={
              <div className="admin-form-actions">
                <AdminActionButton action="cancel" onClick={closeAddModal} />
                <AdminActionButton
                  action="create"
                  label={ADD_BUTTON_LABEL}
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
              onChangeEndAt={onChangeEndAt}
              onChangePaidAt={onChangePaidAt}
              onChangeStatus={onChangeStatus}
            />
          </Modal>

          <AdminConfirmModal
            open={isOpenDeletePaymentHis}
            danger
            loading={deleting}
            message={DELETE_CONFIRM_MESSAGE}
            onOk={deletePaymentHis}
            onCancel={() => setIsOpenDeletePaymentHis(false)}
          />
        </div>
      </AdminPage>
    </>
  );
};

export default ClientPaymentDetail;
