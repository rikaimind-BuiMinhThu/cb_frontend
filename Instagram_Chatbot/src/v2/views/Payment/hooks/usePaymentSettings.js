import { useEffect, useState } from 'react';
import { message } from 'antd';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  API_WARNING_CODE,
  CHATBOTS_PATH_PREFIX,
  COMMISSION_REQUIRED_MESSAGE,
  DEFAULT_AMOUNT,
  DEFAULT_VARIABLE_ID,
  EMPTY_NP_ROW,
  EMPTY_SETTLEMENT_ROW,
  EMPTY_SPECIFY_ROW,
  EMPTY_VALUE,
  GATEWAY_REQUIRED_MESSAGE,
  NP_DEFERRED_NO,
  NP_DEFERRED_YES,
  NP_INVOICE_ENCLOSED,
  NP_INVOICE_NOT_INCLUDE,
  NP_MAX_MIN_ERROR,
  PAYMENT_GATEWAYS_ALL_PATH,
  PAYMENT_MANAGEMENT_PATH_PREFIX,
  PREFECTURES,
  REQUIRED_FIELD_MESSAGE,
  SETTLEMENT_FEE_FREE,
  SETTLEMENT_FEE_PAID,
  SHIPPING_FEE_FREE,
  SHIPPING_FEE_PAID,
  SPECIFY_PAYMENT_NO,
  SPECIFY_PAYMENT_YES,
  TAX_FOREIGN,
  TAX_INTERNAL,
  TAX_RATE_EIGHT,
  TAX_TRUNCATION,
  UPDATE_CONSUMPTION_TAX_SUFFIX,
  UPDATE_NP_DEFERRED_SUFFIX,
  UPDATE_SETTLEMENT_FEE_SUFFIX,
  UPDATE_SHIPPING_FEE_SUFFIX,
  UPDATE_SPECIFY_GATEWAY_SUFFIX,
  UPDATE_SUCCESS_MESSAGE,
  VARIABLE_REQUIRED_MESSAGE,
  VARIABLES_PAGE_ALL_SUFFIX,
} from '../paymentConstants';

const isApiSuccess = (code) => code === API_SUCCESS_CODE || code === String(API_SUCCESS_CODE);

const handlePaymentError = (err) => {
  if (err?.response?.data?.code === 0) {
    tokenExpired();
  }
};

const showPaymentResponse = (respon, onSuccess) => {
  if (isApiSuccess(respon.data.code)) {
    message.success(UPDATE_SUCCESS_MESSAGE);
    onSuccess();
    return;
  }
  if (respon.data.code === API_WARNING_CODE) {
    message.warning(respon.data.message);
  }
};

const mapSpecifyRows = (data) => {
  if (data?.specify_payment_variables?.[0]?.id == null) {
    return [EMPTY_SPECIFY_ROW];
  }
  return data.specify_payment_variables.map((item) => ({
    variableValue: item.variable_value || EMPTY_VALUE,
    gatewayId: item.payment_gateway_id || EMPTY_VALUE,
  }));
};

const mapSettlementRows = (data) => {
  if (data?.settlement_fee_variables?.[0]?.id == null) {
    return [EMPTY_SETTLEMENT_ROW];
  }
  return data.settlement_fee_variables.map((item) => ({
    variableValue: item.variable_value || EMPTY_VALUE,
    commission: item.commission ?? EMPTY_VALUE,
  }));
};

const mapNpRows = (data) => {
  if (data?.np_value_settlements?.[0]?.id == null) {
    return [EMPTY_NP_ROW];
  }
  return data.np_value_settlements.map((item) => ({
    feeValue: item.np_settlement_fee_value ?? EMPTY_VALUE,
    maxValue: item.np_settlement_max_value ?? EMPTY_VALUE,
    minValue: item.np_settlement_min_value ?? EMPTY_VALUE,
  }));
};

const mapShippingRows = (data) =>
  PREFECTURES.map((item, index) => ({
    prefectureId: data?.shipping_fee_variables?.[index]?.prefecture_id || item.prefectur,
    amount: data?.shipping_fee_variables?.[index]?.value ?? DEFAULT_AMOUNT,
  }));

const usePaymentSettings = (botId) => {
  const [openTax, setOpenTax] = useState(true);
  const [saleTaxRate, setSaleTaxRate] = useState(TAX_RATE_EIGHT);
  const [calculateOneYen, setCalculateOneYen] = useState(TAX_TRUNCATION);
  const [taxSaving, setTaxSaving] = useState(false);
  const [noCan, setNoCan] = useState(true);
  const [noPaid, setNoPaid] = useState(true);
  const [noShip, setNoShip] = useState(true);
  const [noNP, setNoNP] = useState(true);
  const [listvar, setListVar] = useState([]);
  const [paymentGateway, setPaymentGateway] = useState([]);
  const [payment, setPayment] = useState({});

  const [specifyVariableId, setSpecifyVariableId] = useState(DEFAULT_VARIABLE_ID);
  const [specifyRows, setSpecifyRows] = useState([EMPTY_SPECIFY_ROW]);
  const [specifyErrors, setSpecifyErrors] = useState([]);

  const [settlementVariableId, setSettlementVariableId] = useState(DEFAULT_VARIABLE_ID);
  const [settlementRows, setSettlementRows] = useState([EMPTY_SETTLEMENT_ROW]);
  const [settlementErrors, setSettlementErrors] = useState([]);

  const [shippingVariableId, setShippingVariableId] = useState(EMPTY_VALUE);
  const [shippingRows, setShippingRows] = useState(mapShippingRows({}));
  const [shippingErrors, setShippingErrors] = useState([]);

  const [npInvoiceIncluded, setNpInvoiceIncluded] = useState(NP_INVOICE_NOT_INCLUDE);
  const [npMaximumAmount, setNpMaximumAmount] = useState(EMPTY_VALUE);
  const [npMaxAmountError, setNpMaxAmountError] = useState(EMPTY_VALUE);
  const [npRows, setNpRows] = useState([EMPTY_NP_ROW]);
  const [npErrors, setNpErrors] = useState([]);

  const applyPayment = (data) => {
    setPayment(data);
    setOpenTax(data?.include_tax === TAX_INTERNAL);
    setSaleTaxRate(data?.sale_tax_rate || TAX_RATE_EIGHT);
    setCalculateOneYen(data?.calculate_one_yen || TAX_TRUNCATION);
    setNoCan(data?.can_specify_payment === SPECIFY_PAYMENT_NO);
    setNoPaid(data?.need_paid_settlement_fee === SETTLEMENT_FEE_FREE);
    setNoShip(data?.need_paid_shipping_fee === SHIPPING_FEE_FREE);
    setNoNP(data?.need_np_deferred_payment === NP_DEFERRED_NO);
    setSpecifyVariableId(data?.specify_payment_variable?.id || DEFAULT_VARIABLE_ID);
    setSpecifyRows(mapSpecifyRows(data));
    setSpecifyErrors([]);
    setSettlementVariableId(data?.settlement_fee_variable?.id || DEFAULT_VARIABLE_ID);
    setSettlementRows(mapSettlementRows(data));
    setSettlementErrors([]);
    setShippingVariableId(data?.shipping_fee_variable?.id || EMPTY_VALUE);
    setShippingRows(mapShippingRows(data));
    setShippingErrors([]);
    setNpInvoiceIncluded(
      data?.np_invoice_included === NP_INVOICE_ENCLOSED
        ? NP_INVOICE_ENCLOSED
        : NP_INVOICE_NOT_INCLUDE
    );
    setNpMaximumAmount(data?.np_maximum_amount ?? EMPTY_VALUE);
    setNpMaxAmountError(EMPTY_VALUE);
    setNpRows(mapNpRows(data));
    setNpErrors([]);
  };

  const reload = () => {
    if (!botId) return;
    api
      .get(`${PAYMENT_MANAGEMENT_PATH_PREFIX}/${botId}`)
      .then((res) => {
        applyPayment(res.data.data);
      })
      .catch(handlePaymentError);
  };

  useEffect(() => {
    if (!botId) return undefined;
    const request = { cancelled: false };
    api
      .get(`${CHATBOTS_PATH_PREFIX}/${botId}${VARIABLES_PAGE_ALL_SUFFIX}`)
      .then((res) => {
        if (request.cancelled) return;
        setListVar(res?.data?.data);
      })
      .catch((err) => {
        if (request.cancelled) return;
        handlePaymentError(err);
      });
    return () => {
      request.cancelled = true;
    };
  }, [botId]);

  useEffect(() => {
    const request = { cancelled: false };
    api
      .get(PAYMENT_GATEWAYS_ALL_PATH)
      .then((res) => {
        if (request.cancelled) return;
        if (isApiSuccess(res.data.code)) {
          setPaymentGateway(res.data.data);
        }
      })
      .catch((err) => {
        if (request.cancelled) return;
        handlePaymentError(err);
      });
    return () => {
      request.cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!botId) return undefined;
    const request = { cancelled: false };
    api
      .get(`${PAYMENT_MANAGEMENT_PATH_PREFIX}/${botId}`)
      .then((res) => {
        if (request.cancelled) return;
        applyPayment(res.data.data);
      })
      .catch((err) => {
        if (request.cancelled) return;
        handlePaymentError(err);
      });
    return () => {
      request.cancelled = true;
    };
  }, [botId]);

  const patchSetting = (suffix, payload, onFinally) => {
    api
      .patch(`${PAYMENT_MANAGEMENT_PATH_PREFIX}/${botId}${suffix}`, payload)
      .then((respon) => {
        showPaymentResponse(respon, reload);
      })
      .catch(handlePaymentError)
      .finally(() => {
        if (onFinally) onFinally();
      });
  };

  const saveConsumptionTax = () => {
    if (taxSaving) return;
    const payload = {
      consumption_tax: {
        include_tax: openTax ? TAX_INTERNAL : TAX_FOREIGN,
        sale_tax_rate: saleTaxRate,
        calculate_one_yen: calculateOneYen,
      },
    };
    setTaxSaving(true);
    patchSetting(UPDATE_CONSUMPTION_TAX_SUFFIX, payload, () => setTaxSaving(false));
  };

  const addSpecifyRow = () => {
    setSpecifyRows([...specifyRows, EMPTY_SPECIFY_ROW]);
  };

  const deleteSpecifyRow = (index) => {
    setSpecifyRows(specifyRows.filter((_, rowIndex) => rowIndex !== index));
    setSpecifyErrors(specifyErrors.filter((_, rowIndex) => rowIndex !== index));
  };

  const updateSpecifyRow = (index, field, value) => {
    setSpecifyRows(
      specifyRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const saveSpecifyPaymentGateway = () => {
    if (noCan) {
      patchSetting(UPDATE_SPECIFY_GATEWAY_SUFFIX, {
        specify_payment_gateway: {
          can_specify_payment: SPECIFY_PAYMENT_NO,
          specify_payment_variable_id: payment?.specify_payment_variable?.id,
          variables: payment.specify_payment_variables,
        },
      });
      return;
    }
    const errors = specifyRows.map((row) => ({
      variable: row.variableValue === EMPTY_VALUE ? VARIABLE_REQUIRED_MESSAGE : EMPTY_VALUE,
      gateway: row.gatewayId === EMPTY_VALUE ? GATEWAY_REQUIRED_MESSAGE : EMPTY_VALUE,
    }));
    setSpecifyErrors(errors);
    const hasError = errors.some((rowError) => rowError.variable || rowError.gateway);
    if (hasError) return;
    patchSetting(UPDATE_SPECIFY_GATEWAY_SUFFIX, {
      specify_payment_gateway: {
        can_specify_payment: SPECIFY_PAYMENT_YES,
        specify_payment_variable_id: specifyVariableId,
        variables: specifyRows.map((row) => ({
          variable_value: row.variableValue,
          payment_gateway_id: row.gatewayId,
        })),
      },
    });
  };

  const addSettlementRow = () => {
    setSettlementRows([...settlementRows, EMPTY_SETTLEMENT_ROW]);
  };

  const deleteSettlementRow = (index) => {
    setSettlementRows(settlementRows.filter((_, rowIndex) => rowIndex !== index));
    setSettlementErrors(settlementErrors.filter((_, rowIndex) => rowIndex !== index));
  };

  const updateSettlementRow = (index, field, value) => {
    setSettlementRows(
      settlementRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const saveSettlementPaymentGateway = () => {
    if (noPaid) {
      patchSetting(UPDATE_SETTLEMENT_FEE_SUFFIX, {
        settlement_fee: {
          need_paid_settlement_fee: SETTLEMENT_FEE_FREE,
          settlement_fee_variable_id: payment?.settlement_fee_variable?.id,
          variables: payment.settlement_fee_variables,
        },
      });
      return;
    }
    const errors = settlementRows.map((row) => ({
      variable: row.variableValue === EMPTY_VALUE ? VARIABLE_REQUIRED_MESSAGE : EMPTY_VALUE,
      commission: row.commission === EMPTY_VALUE ? COMMISSION_REQUIRED_MESSAGE : EMPTY_VALUE,
    }));
    setSettlementErrors(errors);
    const hasError = errors.some((rowError) => rowError.variable || rowError.commission);
    if (hasError) return;
    patchSetting(UPDATE_SETTLEMENT_FEE_SUFFIX, {
      settlement_fee: {
        need_paid_settlement_fee: SETTLEMENT_FEE_PAID,
        settlement_fee_variable_id: settlementVariableId,
        variables: settlementRows.map((row) => ({
          variable_value: row.variableValue,
          commission: row.commission,
        })),
      },
    });
  };

  const updateShippingRow = (index, amount) => {
    setShippingRows(
      shippingRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, amount } : row
      )
    );
  };

  const savePrefecturesTax = () => {
    if (noShip) {
      patchSetting(UPDATE_SHIPPING_FEE_SUFFIX, {
        shipping_fee: {
          need_paid_shipping_fee: SHIPPING_FEE_FREE,
          shipping_fee_variable_id: payment?.shipping_fee_variable?.id,
          variables: payment.shipping_fee_variables,
        },
      });
      return;
    }
    const errors = shippingRows.map((row) =>
      row.amount === EMPTY_VALUE || row.amount === null ? REQUIRED_FIELD_MESSAGE : EMPTY_VALUE
    );
    setShippingErrors(errors);
    const hasError = errors.some((rowError) => rowError);
    if (hasError) return;
    patchSetting(UPDATE_SHIPPING_FEE_SUFFIX, {
      shipping_fee: {
        need_paid_shipping_fee: SHIPPING_FEE_PAID,
        shipping_fee_variable_id: shippingVariableId,
        variables: shippingRows.map((row) => ({
          prefecture_id: row.prefectureId,
          amount: row.amount,
        })),
      },
    });
  };

  const addNpRow = () => {
    setNpRows([...npRows, EMPTY_NP_ROW]);
  };

  const deleteNpRow = (index) => {
    setNpRows(npRows.filter((_, rowIndex) => rowIndex !== index));
    setNpErrors(npErrors.filter((_, rowIndex) => rowIndex !== index));
  };

  const updateNpRow = (index, field, value) => {
    setNpRows(
      npRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row))
    );
  };

  const saveNPDeferredPayment = () => {
    if (noNP) {
      patchSetting(UPDATE_NP_DEFERRED_SUFFIX, {
        np_deferred_payment: {
          need_np_deferred_payment: NP_DEFERRED_NO,
          np_invoice_included: payment?.np_invoice_included,
          np_maximum_amount: payment?.np_maximum_amount,
          np_value_settlements_attributes: payment?.settlement_fee_variable,
        },
      });
      return;
    }
    const maxAmountError =
      npMaximumAmount === EMPTY_VALUE ? REQUIRED_FIELD_MESSAGE : EMPTY_VALUE;
    setNpMaxAmountError(maxAmountError);
    const errors = npRows.map((row) => {
      const fee = row.feeValue === EMPTY_VALUE ? REQUIRED_FIELD_MESSAGE : EMPTY_VALUE;
      const min = row.minValue === EMPTY_VALUE ? REQUIRED_FIELD_MESSAGE : EMPTY_VALUE;
      const maxEmpty = row.maxValue === EMPTY_VALUE;
      const maxTooSmall =
        !maxEmpty && row.minValue !== EMPTY_VALUE && Number(row.maxValue) < Number(row.minValue);
      const max = maxEmpty
        ? REQUIRED_FIELD_MESSAGE
        : maxTooSmall
          ? NP_MAX_MIN_ERROR
          : EMPTY_VALUE;
      return { fee, max, min };
    });
    setNpErrors(errors);
    const hasRowError = errors.some((rowError) => rowError.fee || rowError.max || rowError.min);
    if (maxAmountError || hasRowError) return;
    patchSetting(UPDATE_NP_DEFERRED_SUFFIX, {
      np_deferred_payment: {
        need_np_deferred_payment: NP_DEFERRED_YES,
        np_invoice_included: npInvoiceIncluded,
        np_maximum_amount: npMaximumAmount,
        np_value_settlements_attributes: npRows.map((row) => ({
          np_settlement_fee_value: row.feeValue,
          np_settlement_max_value: row.maxValue,
          np_settlement_min_value: row.minValue,
        })),
      },
    });
  };

  return {
    openTax,
    setOpenTax,
    saleTaxRate,
    setSaleTaxRate,
    calculateOneYen,
    setCalculateOneYen,
    taxSaving,
    noCan,
    setNoCan,
    noPaid,
    setNoPaid,
    noShip,
    setNoShip,
    noNP,
    setNoNP,
    listvar,
    payment,
    paymentGateway,
    prefectures: PREFECTURES,
    specifyVariableId,
    setSpecifyVariableId,
    specifyRows,
    specifyErrors,
    settlementVariableId,
    setSettlementVariableId,
    settlementRows,
    settlementErrors,
    shippingVariableId,
    setShippingVariableId,
    shippingRows,
    shippingErrors,
    npInvoiceIncluded,
    setNpInvoiceIncluded,
    npMaximumAmount,
    setNpMaximumAmount,
    npMaxAmountError,
    npRows,
    npErrors,
    onAddSpecifyPaymentGW: addSpecifyRow,
    onDeleteSpecifyPaymentGW: deleteSpecifyRow,
    onUpdateSpecifyRow: updateSpecifyRow,
    onAddSettlementPaymentGW: addSettlementRow,
    onDeleteSettlementPaymentGW: deleteSettlementRow,
    onUpdateSettlementRow: updateSettlementRow,
    onUpdateShippingRow: updateShippingRow,
    onAddSettlementFee: addNpRow,
    onDeleteSettlementFee: deleteNpRow,
    onUpdateNpRow: updateNpRow,
    onSaveConsumptionTax: saveConsumptionTax,
    onSaveSpecifyPaymentGateway: saveSpecifyPaymentGateway,
    onSaveSettlementPaymentGateway: saveSettlementPaymentGateway,
    onSavePrefecturesTax: savePrefecturesTax,
    onSaveNPDeferredPayment: saveNPDeferredPayment,
  };
};

export default usePaymentSettings;
