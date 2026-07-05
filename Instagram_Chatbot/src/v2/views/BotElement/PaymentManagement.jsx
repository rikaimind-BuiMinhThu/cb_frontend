import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import api from 'api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'v2/api/tokenExpired';
import ModalNoti from './../Popup/ModalNoti';
import { AdminPage } from '../../components/AdminShell';
import PaymentOrderHistoryTab from './PaymentManagement/PaymentOrderHistoryTab';
import PaymentSettingsTab from './PaymentManagement/PaymentSettingsTab';
import '../../assets/css/bot/payment-management.css';
import '../../assets/css/bot/report.css';

function PaymentManagement() {
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [startDate, setStartDate] = useState(() => moment().startOf('month'));
  const [endDate, setEndDate] = useState(() => moment().subtract(1, 'day'));
  const [tab, setTab] = useState('orders');
  const [dateError, setDateError] = useState('');
  const [openTax, setOpenTax] = useState(true);
  const [noCan, setNoCan] = useState(true);
  const [noPaid, setNoPaid] = useState(true);
  const [noShip, setNoShip] = useState(true);
  const [noNP, setNoNP] = useState(true);
  const [listvar, setListVar] = useState([]);
  const [customDivSpecifyPaymentGW, setCustomDivSpecifyPaymentGW] = useState(['newDiv0']);
  const [customDivSettlementPaymentGW, setCustomDivSettlementPaymentGW] = useState(['newDiv0']);
  const [customDivSettlementFee, setCustomDivSettlementFee] = useState(['newDiv0']);
  var [numSpecifyPaymentGW, setNumSpecifyPaymentGW] = useState(1);
  var [numSettlementPaymentGW, setNumSettlementPaymentGW] = useState(1);
  var [numSettlementFee, setNumSettlementFee] = useState(1);

  const [paymentGateway, setPaymentGateway] = useState([]);
  const [payment, setPayment] = useState({});
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();

  const [prefectures, setPrefectures] = useState([
    { prefectur: 'hokkaido', prefectureName: '北海道' },
    { prefectur: 'aomori', prefectureName: '青森県' },
    { prefectur: 'iwate', prefectureName: '岩手県' },
    { prefectur: 'miyagi', prefectureName: '宮城県' },
    { prefectur: 'akita', prefectureName: '秋田県' },
    { prefectur: 'yamagata', prefectureName: '山形県' },
    { prefectur: 'fukushima', prefectureName: '福島県' },
    { prefectur: 'ibaraki', prefectureName: '茨城県' },
    { prefectur: 'tochigi', prefectureName: '栃木県' },
    { prefectur: 'gunma', prefectureName: '群馬県' },
    { prefectur: 'saitama', prefectureName: '埼玉県' },
    { prefectur: 'chiba', prefectureName: '千葉県' },
    { prefectur: 'tokyo', prefectureName: '東京都' },
    { prefectur: 'kanagawa', prefectureName: '神奈川県' },
    { prefectur: 'niigata', prefectureName: '新潟県' },
    { prefectur: 'toyama', prefectureName: '富山県' },
    { prefectur: 'ishikawa', prefectureName: '石川県' },
    { prefectur: 'fukui', prefectureName: '福井県' },
    { prefectur: 'yamanashi', prefectureName: '山梨県' },
    { prefectur: 'nagano', prefectureName: '長野県' },
    { prefectur: 'gifu', prefectureName: '岐阜県' },
    { prefectur: 'shizuoka', prefectureName: '静岡県' },
    { prefectur: 'aichi', prefectureName: '愛知県' },
    { prefectur: 'Mie', prefectureName: '三重県' },
    { prefectur: 'shiga', prefectureName: '滋賀県' },
    { prefectur: 'kyoto', prefectureName: '京都府' },
    { prefectur: 'osaka', prefectureName: '大阪府' },
    { prefectur: 'hyogo', prefectureName: '兵庫県' },
    { prefectur: 'nara', prefectureName: '奈良県' },
    { prefectur: 'wakayama', prefectureName: '和歌山県' },
    { prefectur: 'tottori', prefectureName: '鳥取県' },
    { prefectur: 'shimane', prefectureName: '島根県' },
    { prefectur: 'okayama', prefectureName: '岡山県' },
    { prefectur: 'hiroshima', prefectureName: '広島県' },
    { prefectur: 'yamaguchi', prefectureName: '山口県' },
    { prefectur: 'tokushima', prefectureName: '徳島県' },
    { prefectur: 'kagawa', prefectureName: '香川県' },
    { prefectur: 'ehime', prefectureName: '愛媛県' },
    { prefectur: 'kochi', prefectureName: '高知県' },
    { prefectur: 'kukuoka', prefectureName: '福岡県' },
    { prefectur: 'saga', prefectureName: '佐賀県' },
    { prefectur: 'sagasaki', prefectureName: '長崎県' },
    { prefectur: 'kumamoto', prefectureName: '熊本県' },
    { prefectur: 'oita', prefectureName: '大分県' },
    { prefectur: 'miyazaki', prefectureName: '宮崎県' },
    { prefectur: 'kagoshima', prefectureName: '鹿児島県' },
    { prefectur: 'okinawa', prefectureName: '沖縄県' },
  ]);
  // authorization
  const [isAdminDeel, setIsAdminDeel] = useState(false);
  const [allClient, setAllClient] = useState([]);
  const [allBot, setAllBot] = useState([]);
  const [currentClientId, setCurrentClientId] = useState('deel');

  useEffect(() => {
    if (Cookies.get('user_role') === 'admin_deel') {
      setIsAdminDeel(true);
    } else {
      setIsAdminDeel(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminDeel) {
      api
        .get('/api/v1/managements/get_client_with_name')
        .then((res) => {
          console.log('all client: ', res.data);
          if (res.data?.code === 1) {
            setAllClient(res.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isAdminDeel]);

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
  }, []);
  useEffect(() => {
    api
      .get(`/api/v1/managements/chatbots/${botId}/variables?page=all`)
      .then((res) => {
        setListVar(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.code == 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  useEffect(() => {
    api
      .get(`/api/v1/payment_managements/payment_gateways?page=all`)
      .then((res) => {
        if (res.data.code == 1) {
          setPaymentGateway(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response.data.code == 0) {
          tokenExpired();
        }
      });
  }, []);

  useEffect(() => {
    api
      .get(`/api/v1/payment_managements/payment_managements/${botId}`)
      .then((res) => {
        console.log(res.data.data);
        setPayment(res.data.data);
        if (res.data?.data?.include_tax === 'internal_tax') setOpenTax(true);
        else setOpenTax(false);
        if (res.data?.data?.can_specify_payment === 'no') setNoCan(true);
        else setNoCan(false);
        if (res.data?.data?.need_paid_settlement_fee === 'free') setNoPaid(true);
        else setNoPaid(false);
        if (res.data?.data?.need_paid_shipping_fee === 'free') setNoShip(true);
        else setNoShip(false);
        if (res.data?.data?.need_np_deferred_payment === 'no') setNoNP(true);
        else setNoNP(false);
        if (res.data?.data?.specify_payment_variables[0]?.id !== null) {
          setCustomDivSpecifyPaymentGW(res.data?.data?.specify_payment_variables);
        }
        if (res.data?.data?.settlement_fee_variables[0]?.id !== null) {
          setCustomDivSettlementPaymentGW(res.data?.data?.settlement_fee_variables);
        }
        if (res.data?.data?.np_value_settlements[0]?.id !== null) {
          setCustomDivSettlementFee(res.data?.data?.np_value_settlements);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.code == 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  function reload() {
    api
      .get(`/api/v1/payment_managements/payment_managements/${botId}`)
      .then((res) => {
        console.log(res.data.data);
        setPayment(res.data.data);
        if (res.data?.data?.include_tax === 'internal_tax') setOpenTax(true);
        else setOpenTax(false);
        if (res.data?.data?.can_specify_payment === 'no') setNoCan(true);
        else setNoCan(false);
        if (res.data?.data?.need_paid_settlement_fee === 'free') setNoPaid(true);
        else setNoPaid(false);
        if (res.data?.data?.need_paid_shipping_fee === 'free') setNoShip(true);
        else setNoShip(false);
        if (res.data?.data?.need_np_deferred_payment === 'no') setNoNP(true);
        else setNoNP(false);
        if (res.data?.data?.specify_payment_variables[0]?.id !== null) {
          setCustomDivSpecifyPaymentGW(res.data?.data?.specify_payment_variables);
        }
        if (res.data?.data?.settlement_fee_variables[0]?.id !== null) {
          setCustomDivSettlementPaymentGW(res.data?.data?.settlement_fee_variables);
        }
        if (res.data?.data?.np_value_settlements[0]?.id !== null) {
          setCustomDivSettlementFee(res.data?.data?.np_value_settlements);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.code == 0) {
          tokenExpired();
        }
      });
  }

  function validateDateRange(start, end) {
    if (start && end && start.isAfter(end)) {
      setDateError('開始日の値は、終了日の値より小さいです。');
      return false;
    }
    setDateError('');
    return true;
  }

  function handleDateChange(start, end) {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      validateDateRange(start, end);
    } else {
      setDateError('');
    }
  }

  function handleSearch() {
    validateDateRange(startDate, endDate);
  }

  function saveConsumptionTax() {
    //consumption_tax
    // var obj = {};
    var elements = document.getElementById('included_tax').checked;
    var elements0 = document.getElementById('outside_tax').checked;
    var elements1 = document.getElementById('sales_tax_rate').value;
    var elements2 = document.getElementById('truncation').checked;
    var elements3 = document.getElementById('rounded').checked;

    let objDefault = {
      include_tax: 'internal_tax',
      sale_tax_rate: payment.sale_tax_rate,
      calculate_one_yen: payment.calculate_one_yen,
    };
    let obj = {
      include_tax: 'foreign_tax', // {internal_tax: false, foreign_tax: true}
      sale_tax_rate: elements1, // {eight_percent: 0, ten_percent: 1}
      calculate_one_yen:
        elements2 == false && elements3 == false
          ? ''
          : elements2 == true
          ? 'truncation'
          : 'rounded_up',
    };
    let res = {
      consumption_tax: elements == true ? objDefault : obj,
    };
    console.log(res);
    api
      .patch(`/api/v1/payment_managements/payment_managements/${botId}/update_consumption_tax`, res)
      .then((respon) => {
        console.log(respon);
        if (respon.data.code == 1) {
          setMsgNoti(`正常に更新されました！`);
          setIsOpenNoti(true);
          reload();
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
          }, 2000);
        }
        if (respon.data.code == 2) {
          setMsgNoti(respon.data.message);
          setIsOpenNoti(true);
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
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

  function addNewSpecifyPaymentGW() {
    let cDivs = customDivSpecifyPaymentGW;

    cDivs.push(`newDiv${numSpecifyPaymentGW}`);
    // console.log(cDivs)
    setCustomDivSpecifyPaymentGW(cDivs);
    setNumSpecifyPaymentGW(numSpecifyPaymentGW + 1);
  }

  function addNewSettlementPaymentGW() {
    let cDivs = customDivSettlementPaymentGW;

    cDivs.push(`newDiv${numSettlementPaymentGW}`);
    // console.log(cDivs)
    setCustomDivSettlementPaymentGW(cDivs);
    setNumSettlementPaymentGW(numSettlementPaymentGW + 1);
  }

  function addNewSettlementFee() {
    let cDivs = customDivSettlementFee;

    cDivs.push(`newDiv${numSettlementFee}`);
    // console.log(cDivs)
    setCustomDivSettlementFee(cDivs);
    setNumSettlementFee(numSettlementFee + 1);
  }

  function saveSpecifyPaymentGateway() {
    let formAdd = document.getElementById('customSPGW');
    let payment_method_variable = document.getElementById('specify_payment_method_variable')?.value;
    let specify_pg_none = document.getElementById('specify_pg_none')?.checked;
    let specify_pg_canbe = document.getElementById('specify_pg_canbe')?.checked;
    let pm = [];
    let pm_var = [];
    let pm_val = [];
    let obj = {};
    let checkVal = false;
    let checkVar = false;
    for (let i = 0; i < formAdd.length; i++) {
      // pm[formAdd[i].name] = formAdd[i].value;
      if (formAdd[i].name.includes('spgw_gateway')) {
        pm_val.push(formAdd[i].value);
      } else {
        pm_var.push(formAdd[i].value);
      }
    }
    for (var i = 0; i < pm_var.length; i++) {
      if (pm_var[i] == '') {
        checkVar = true;
        if (document.getElementById(`err_specifypgw_variable${i}`))
          document.getElementById(`err_specifypgw_variable${i}`).innerHTML =
            '変数は、必ず指定してください。';
      } else {
        if (document.getElementById(`err_specifypgw_variable${i}`))
          document.getElementById(`err_specifypgw_variable${i}`).innerHTML = '';
      }
      if (pm_val[i] == '') {
        checkVal = true;
        if (document.getElementById(`err_specifypgw_gw${i}`))
          document.getElementById(`err_specifypgw_gw${i}`).innerHTML =
            '決済ゲートウェイは、必ず指定してください。';
      } else {
        if (document.getElementById(`err_specifypgw_gw${i}`))
          document.getElementById(`err_specifypgw_gw${i}`).innerHTML = '';
      }
      pm.push({
        variable_value: pm_var[i],
        payment_gateway_id: pm_val[i],
      });
    }
    let res;
    if (specify_pg_none == true) {
      res = {
        specify_payment_gateway: {
          can_specify_payment: 'no', // {no: false, yes: true}
          specify_payment_variable_id: payment?.specify_payment_variable?.id, // variable_id
          variables: payment.specify_payment_variables,
        },
      };
      // var objDefault = {
      //   can_specify_payment: 'no', // {no: false, yes: true}
      //   specify_payment_variable_id: payment?.specify_payment_variable?.id, // variable_id
      //   variables: payment.specify_payment_variables,
      // };
    } else {
      if (checkVal == false && checkVar == false) {
        res = {
          specify_payment_gateway: {
            can_specify_payment: 'yes', // {no: false, yes: true}
            specify_payment_variable_id: payment_method_variable, // variable_id
            variables: pm,
          },
        };
        // var obj1 = {
        //   can_specify_payment: 'yes', // {no: false, yes: true}
        //   specify_payment_variable_id: payment_method_variable, // variable_id
        //   variables: pm,
        // };
      } else {
      }
    }

    console.log(res);
    if (res != null || res != undefined) {
      api
        .patch(
          `/api/v1/payment_managements/payment_managements/${botId}/update_specify_payment_gateway`,
          res
        )
        .then((respon) => {
          console.log(respon);
          if (respon.data.code == 1) {
            setMsgNoti(`正常に更新されました！`);
            setIsOpenNoti(true);
            reload();
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
            }, 2000);
          }
          if (respon.data.code == 2) {
            setMsgNoti(respon.data.message);
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
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

  function saveSettlementPaymentGateway() {
    let formAdd = document.getElementById('settlement_PMGW');
    let payment_method_variable = document.getElementById(
      'settlement_payment_method_variable'
    )?.value;
    let settlement_fee_free = document.getElementById('settlement_fee_free')?.checked;
    let settlement_fee_paid = document.getElementById('settlement_fee_paid')?.checked;
    let pm = [];
    let pm_var = [];
    let pm_val = [];
    let obj = {};
    let checkVar = false;
    let checkVal = false;
    for (let i = 0; i < formAdd.length; i++) {
      if (formAdd[i].name.includes('settpgw_commission')) {
        pm_val.push(formAdd[i].value);
      } else {
        pm_var.push(formAdd[i].value);
      }
    }
    for (var i = 0; i < pm_var.length; i++) {
      if (pm_var[i] == '') {
        checkVar = true;
        if (document.getElementById(`err_settpgw_variable${i}`))
          document.getElementById(`err_settpgw_variable${i}`).innerHTML =
            '変数は、必ず指定してください。';
      } else {
        if (document.getElementById(`err_settpgw_variable${i}`))
          document.getElementById(`err_settpgw_variable${i}`).innerHTML = '';
      }
      if (pm_val[i] == '') {
        checkVal = true;
        if (document.getElementById(`err_settpgw_commission${i}`))
          document.getElementById(`err_settpgw_commission${i}`).innerHTML =
            '手数料を入力してください。';
      } else {
        if (document.getElementById(`err_settpgw_commission${i}`))
          document.getElementById(`err_settpgw_commission${i}`).innerHTML = '';
      }
      pm.push({
        variable_value: pm_var[i],
        commission: pm_val[i],
      });
    }
    let res;
    if (settlement_fee_free) {
      res = {
        settlement_fee: {
          need_paid_settlement_fee: 'free', // {free: false, paid: true}
          settlement_fee_variable_id: payment?.settlement_fee_variable.id, // variable_id
          variables: payment.settlement_fee_variables,
        },
      };
    } else {
      if (checkVal == false && checkVar == false) {
        res = {
          settlement_fee: {
            need_paid_settlement_fee: 'paid', // {free: false, paid: true}
            settlement_fee_variable_id: payment_method_variable, // variable_id
            variables: pm,
          },
        };
      }
    }
    if (res != null || res != undefined) {
      api
        .patch(
          `/api/v1/payment_managements/payment_managements/${botId}/update_settlement_fee`,
          res
        )
        .then((respon) => {
          console.log(respon);
          if (respon.data.code == 1) {
            setMsgNoti(`正常に更新されました！`);
            setIsOpenNoti(true);
            reload();
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
            }, 2000);
          }
          if (respon.data.code == 2) {
            setMsgNoti(respon.data.message);
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
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

  function savePrefecturesTax() {
    let checkAmount = false;
    let formAdd = document.getElementById('shipping_fee_tax');
    let payment_method_variable = document.getElementById('shipping_fee_address_variable')?.value;
    let shipping_tax_free = document.getElementById('shipping_tax_free')?.checked;
    let shipping_tax_paid = document.getElementById('shipping_tax_paid')?.checked;
    let pm = [];
    // let pm_var = []
    // let pm_val = []
    // for (let i = 0; i < formAdd.length; i++) {
    //   pm[formAdd[i].name] = formAdd[i].value;
    // }
    for (let i = 0; i < formAdd.length; i++) {
      pm.push({
        prefecture_id: formAdd[i].name,
        amount: formAdd[i].value,
      });
    }
    for (let i = 0; i < formAdd.length; i++) {
      if (formAdd[i].value == '') {
        checkAmount = true;
        if (document.getElementById(`err_amount_of_money_${i}`))
          document.getElementById(`err_amount_of_money_${i}`).innerHTML = '必ず指定してください。';
      } else {
        if (document.getElementById(`err_amount_of_money_${i}`))
          document.getElementById(`err_amount_of_money_${i}`).innerHTML = '';
      }
    }
    let res;
    if (shipping_tax_free) {
      res = {
        shipping_fee: {
          need_paid_shipping_fee: 'free', // {free: false, paid: true}
          shipping_fee_variable_id: payment?.shipping_fee_variable.id, // variable_id
          variables: payment.shipping_fee_variables,
        },
      };
    } else {
      res = {
        shipping_fee: {
          need_paid_shipping_fee: 'paid', // {free: false, paid: true}
          shipping_fee_variable_id: payment_method_variable, // variable_id
          variables: pm,
        },
      };
    }
    if ((res != null || res != undefined) && checkAmount == false) {
      api
        .patch(`/api/v1/payment_managements/payment_managements/${botId}/update_shipping_fee`, res)
        .then((respon) => {
          console.log(respon);
          if (respon.data.code == 1) {
            setMsgNoti(`正常に更新されました！`);
            setIsOpenNoti(true);
            reload();
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
            }, 2000);
          }
          if (respon.data.code == 2) {
            setMsgNoti(respon.data.message);
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
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

  function saveNPDeferredPayment() {
    let np_deferred_no = document.getElementById('np_deferred_no').checked;
    let not_included = document.getElementById('not_included')?.checked;
    let enclosed = document.getElementById('enclosed')?.checked;
    let np_maximum_amount = document.getElementById('np_maximum_amount')?.value;
    let formAdd = document.getElementById('customNP');
    let pm = [];
    let pmFreeValue = [];
    let pmMaxValue = [];
    let pmMinValue = [];
    let checkMaxAmount = false;
    let checkFreeValue = false;
    let checkMaxValue = false;
    let checkMinValue = false;
    let res;

    for (var i = 0; i < formAdd.length; i++) {
      if (formAdd[i].name.includes('np_settlement_fee_value')) {
        pmFreeValue.push(formAdd[i].value);
      } else if (formAdd[i].name.includes('np_settlement_max_value')) {
        pmMaxValue.push(formAdd[i].value);
      } else {
        pmMinValue.push(formAdd[i].value);
      }
    }

    for (var i = 0; i < formAdd.length; i += 3) {
      pm.push({
        np_settlement_fee_value: formAdd[i].value,
        np_settlement_max_value: formAdd[i + 1].value,
        np_settlement_min_value: formAdd[i + 2].value,
      });
    }

    if (np_maximum_amount === '') {
      checkMaxAmount = true;
      if (document.getElementById(`err_np_maximum_amount`))
        document.getElementById(`err_np_maximum_amount`).innerHTML = '必ず指定してください。';
    } else {
      if (document.getElementById(`err_np_maximum_amount`))
        document.getElementById(`err_np_maximum_amount`).innerHTML = '';
    }
    for (var i = 0; i < pmFreeValue.length; i++) {
      if (pmFreeValue[i] == '') {
        checkFreeValue = true;
        if (document.getElementById(`err_np_settlement_fee_value_${i}`)) {
          document.getElementById(`err_np_settlement_fee_value_${i}`).innerHTML =
            '必ず指定してください。';
        }
      } else {
        if (document.getElementById(`err_np_settlement_fee_value_${i}`))
          document.getElementById(`err_np_settlement_fee_value_${i}`).innerHTML = '';
      }
      if (pmMaxValue[i] == '') {
        checkMaxValue = true;
        if (document.getElementById(`err_np_settlement_max_value_${i}`))
          document.getElementById(`err_np_settlement_max_value_${i}`).innerHTML =
            '必ず指定してください。';
      } else if (pmMaxValue[i] < pmMinValue[i]) {
        checkMaxValue = true;
        if (document.getElementById(`err_np_settlement_max_value_${i}`))
          document.getElementById(`err_np_settlement_max_value_${i}`).innerHTML =
            'NP 決済の最大値は最小値より大きくなければなりません。';
      } else {
        if (document.getElementById(`err_np_settlement_max_value_${i}`))
          document.getElementById(`err_np_settlement_max_value_${i}`).innerHTML = '';
      }
      if (pmMinValue[i] == '') {
        checkMinValue = true;
        if (document.getElementById(`err_np_settlement_min_value_${i}`))
          document.getElementById(`err_np_settlement_min_value_${i}`).innerHTML =
            '必ず指定してください。';
      } else {
        if (document.getElementById(`err_np_settlement_min_value_${i}`))
          document.getElementById(`err_np_settlement_min_value_${i}`).innerHTML = '';
      }
    }

    if (np_deferred_no) {
      res = {
        np_deferred_payment: {
          need_np_deferred_payment: 'no', // {free: false, paid: true}
          np_invoice_included: payment?.np_invoice_included, // {not_include: 0, enclosed: 1}
          np_maximum_amount: payment?.np_maximum_amount,
          np_value_settlements_attributes: payment?.settlement_fee_variable,
        },
      };
    } else {
      if (
        checkMaxAmount == false &&
        checkFreeValue == false &&
        checkMaxValue == false &&
        checkMinValue == false
      ) {
        res = {
          np_deferred_payment: {
            need_np_deferred_payment: 'yes',
            np_invoice_included: not_included ? 'not_include' : enclosed,
            np_maximum_amount: np_maximum_amount,
            np_value_settlements_attributes: pm,
          },
        };
      }
    }

    if (res != null || res != undefined) {
      console.log(res);
      api
        .patch(
          `/api/v1/payment_managements/payment_managements/${botId}/update_np_deferred_payment`,
          res
        )
        .then((respon) => {
          console.log(respon);
          if (respon.data.code == 1) {
            setMsgNoti(`正常に更新されました！`);
            setIsOpenNoti(true);
            reload();
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
            }, 2000);
          }
          if (respon.data.code == 2) {
            setMsgNoti(respon.data.message);
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);
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

  function deleteCdivSpecifyPGW(id) {
    var ele = document.getElementById(`specifyPGW${id}`);
    const customSPGW = document.getElementById(`customSPGW`);
    if (ele?.parentNode === customSPGW) {
      setCustomDivSpecifyPaymentGW(customDivSpecifyPaymentGW.filter((item, index) => index !== id));
    }
    // document.getElementById(`customSPGW`).removeChild(ele);
    // ele.remove();
  }

  function deleteCdivSettlementPGW(id) {
    var ele = document.getElementById(`settlementPGW${id}`);
    const settlement_PMGW = document.getElementById(`settlement_PMGW`);
    if (ele?.parentNode === settlement_PMGW) {
      setCustomDivSettlementPaymentGW(
        customDivSettlementPaymentGW.filter((item, index) => index !== id)
      );
    }
    // document.getElementById(`settlement_PMGW`).removeChild(ele);
    // ele.remove();
  }

  function deleteCdivSettlementFee(id) {
    console.log(customDivSettlementFee);
    var ele = document.getElementById(`settlementFee${id}`);
    const customNPElement = document.getElementById(`customNP`);
    if (ele?.parentNode === customNPElement) {
      // customNPElement?.removeChild(ele);
      setCustomDivSettlementFee(customDivSettlementFee.filter((item, index) => index !== id));
    }
    // document.getElementById(`customNP`).removeChild(ele);
    // ele.remove();
  }

  // handle select client
  const handleSelectClient = (value) => {
    if (value === 'deel') {
      setCurrentClientId(value);
    } else {
      setCurrentClientId(value);
      api
        .get(`/api/v1/managements/get_list_chatbot_by_client?client_id=${value}`)
        .then((res) => {
          console.log(res?.data?.data);
          setAllBot(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.data?.code == 0) {
            tokenExpired();
          }
        });
    }
  };

  return (
    <AdminPage className="admin-page--payment-management">
      <Tabs
        activeKey={tab}
        onChange={setTab}
        className="admin-page-tabs"
        items={[
            {
              key: 'orders',
              label: '注文履歴',
              children: (
                <PaymentOrderHistoryTab
                  startDate={startDate}
                  endDate={endDate}
                  dateError={dateError}
                  isAdminDeel={isAdminDeel}
                  allClient={allClient}
                  allBot={allBot}
                  currentClientId={currentClientId}
                  onDateChange={handleDateChange}
                  onSearch={handleSearch}
                  onSelectClient={handleSelectClient}
                />
              ),
            },
            {
              key: 'settings',
              label: '設定',
              children: (
                <PaymentSettingsTab
                  openTax={openTax}
                  setOpenTax={setOpenTax}
                  noCan={noCan}
                  setNoCan={setNoCan}
                  noPaid={noPaid}
                  setNoPaid={setNoPaid}
                  noShip={noShip}
                  setNoShip={setNoShip}
                  noNP={noNP}
                  setNoNP={setNoNP}
                  listvar={listvar}
                  payment={payment}
                  paymentGateway={paymentGateway}
                  prefectures={prefectures}
                  customDivSpecifyPaymentGW={customDivSpecifyPaymentGW}
                  customDivSettlementPaymentGW={customDivSettlementPaymentGW}
                  customDivSettlementFee={customDivSettlementFee}
                  onAddSpecifyPaymentGW={addNewSpecifyPaymentGW}
                  onDeleteSpecifyPaymentGW={deleteCdivSpecifyPGW}
                  onAddSettlementPaymentGW={addNewSettlementPaymentGW}
                  onDeleteSettlementPaymentGW={deleteCdivSettlementPGW}
                  onAddSettlementFee={addNewSettlementFee}
                  onDeleteSettlementFee={deleteCdivSettlementFee}
                  onSaveConsumptionTax={saveConsumptionTax}
                  onSaveSpecifyPaymentGateway={saveSpecifyPaymentGateway}
                  onSaveSettlementPaymentGateway={saveSettlementPaymentGateway}
                  onSavePrefecturesTax={savePrefecturesTax}
                  onSaveNPDeferredPayment={saveNPDeferredPayment}
                />
              ),
            },
          ]}
      />
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#1677ff' }}>
          <span style={{ fontSize: '16px' }}>{msgNoti}</span>
        </div>
      </ModalNoti>
    </AdminPage>
  );

}

export default PaymentManagement;
