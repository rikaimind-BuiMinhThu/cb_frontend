import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../assets/css/bot/payment-mng.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { useEffect } from 'react';
import api from 'api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'api/tokenExpired';
import ModalNoti from './../Popup/ModalNoti';
import { AdminPage } from '../../components/AdminShell';
registerLocale('ja', ja);

function PaymentManagement() {
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openHisOrder, setOpenHisOrder] = useState(true);
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
    var date = new Date();
    if (date.getDate() != 1) {
      setEndDate(new Date(date.setDate(date.getDate() - 1)));
    }
    setStartDate(new Date(date.setDate(1)));
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

  function orderHisSelected() {
    setOpenHisOrder(true);
    document.getElementById('payment_management_order_his').style.color = '#43b8af';
    document.getElementById('payment_management_setting').style.color = 'black';
  }

  function settingSelected() {
    setOpenHisOrder(false);
    document.getElementById('payment_management_order_his').style.color = 'black';
    document.getElementById('payment_management_setting').style.color = '#43b8af';
  }

  function selectDateStart(date) {
    setStartDate(date);
    var validate = document.getElementById(`payment_management_date_err`);
    var endMonth =
      startDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : `${endDate.getMonth() + 1}`;
    var endDatee = startDate.getDate() < 10 ? `0${endDate.getDate()}` : `${endDate.getDate()}`;
    var dateMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var dateDate = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    if (
      parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`) >
      parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`)
    ) {
      validate.style.display = 'block';
      validate.innerHTML = '開始日の値は、終了日の値より小さいです。';
    } else {
      validate.style.display = 'none';
      validate.innerHTML = '';
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
      validate.innerHTML = '開始日の値は、終了日の値より小さいです。';
    } else {
      validate.style.display = 'none';
      validate.innerHTML = '';
    }
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
    <AdminPage title="決済管理" card={false}>
      <Row id="screenAll">
        <Col md="12">
          <Card className="admin-page-card">
            <CardBody>
              <div className="payment-management-option">
                <div
                  id="payment_management_order_his"
                  style={{ color: '#43b8af' }}
                  className="payment-management-option-item"
                  onClick={() => orderHisSelected()}
                >
                  注文履歴
                </div>
                <div
                  id="payment_management_setting"
                  className="payment-management-option-item"
                  onClick={() => settingSelected()}
                >
                  設定
                </div>
              </div>
              {openHisOrder ? (
                <>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h4
                        style={{
                          margin: '0',
                          fontWeight: '400',
                          fontSize: '1.2em',
                        }}
                      >
                        注文日時
                      </h4>
                      <div style={{ borderRadius: '5px', padding: '5px' }}>
                        <DatePicker
                          wrapperClassName="payment-management-datePicker"
                          // style={{padding:'5px 15px', border:"1px solid #7186a0", borderRadius:'5px'}}
                          selected={startDate}
                          onChange={(date) => selectDateStart(date)}
                          dateFormat="yyyy-MM-dd"
                          locale="ja"
                          value={startDate}
                          // value={
                          //   startDatePreview
                          //     ? startDatePreview.toISOString().slice(0, 10).replaceAll('-', '/')
                          //     : 'yyyy/mm/dd'
                          // }
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
                          wrapperClassName="payment-management-datePicker"
                          selected={endDate}
                          onChange={(date) => selectDateEnd(date)}
                          dateFormat="yyyy-MM-dd"
                          locale="ja"
                          value={endDate}
                          // value={
                          //   endDatePreview
                          //     ? endDatePreview.toISOString().slice(0, 10).replaceAll('-', '/')
                          //     : 'yyyy/mm/dd'
                          // }
                        />
                      </div>
                      <h4
                        style={{
                          margin: '0',
                          fontWeight: '400',
                          fontSize: '1.2em',
                        }}
                      >
                        まで
                      </h4>
                      {isAdminDeel && (
                        <>
                          <select
                            className="pm-select"
                            value={currentClientId}
                            onChange={(e) => handleSelectClient(e.target.value)}
                          > 
                            <option value={'deel'}>Deel</option>
                            {allClient.map((client, index) => (
                              <option key={index} value={client.id}>
                                {client.name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      {currentClientId !== 'deel' && (
                        <>
                          <select className="pm-select">
                            {allBot.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.bot_name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      &emsp;<button className="payment-management-btn-search">Search</button>
                    </div>
                    <span
                      id="payment_management_date_err"
                      style={{ color: 'red', display: 'none' }}
                    ></span>
                  </div>
                  <br /> <br />
                  <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ width: '7.5%' }}>No</th>
                        <th style={{ width: '7.5%' }}>ユーザID</th>
                        <th style={{ width: '9%' }}>注文番号</th>
                        <th>商品名</th>
                        <th style={{ width: '7.5%' }}>単価</th>
                        <th style={{ width: '7.5%' }}>数量</th>
                        <th style={{ width: '7.5%' }}>価格</th>
                        <th>消費税</th>
                        <th>決済手数料（税込）</th>
                        <th>送料（税込）</th>
                        <th>合計（税込）</th>
                        <th>モード</th>
                        <th>状態</th>
                        <th>注文日時</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              ) : (
                <div>
                  {/* 1.CONSUMPTION TAX */}
                  <div className="payment_management_setting__item">
                    <h6>消費税</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <form id="consumption_tax">
                          <input
                            type="radio"
                            name="included_outside_tax"
                            id="included_tax"
                            defaultChecked={openTax}
                            value={`internal_tax`}
                            onChange={() => setOpenTax(true)}
                          />
                          <label>内税</label>
                          <input
                            type="radio"
                            id="outside_tax"
                            name="included_outside_tax"
                            value={`outside`}
                            defaultChecked={!openTax}
                            onChange={() => setOpenTax(false)}
                          />
                          <label>外税</label>
                          <br />
                          <div className="payment_management_setting__check-out">
                            <div
                              style={{
                                width: '100%',
                                display: `${openTax == true ? 'none' : 'block'}`,
                              }}
                            >
                              <span style={{ fontWeight: '500', color: '#767676' }}>
                                消費税率（％）&emsp;
                                <select
                                  id="sales_tax_rate"
                                  name="sales_tax_rate"
                                  defaultValue={
                                    payment.sale_tax_rate ? payment.sale_tax_rate : 'eight_percent'
                                  }
                                >
                                  <option value="eight_percent">8</option>
                                  {/* <option value="9">9</option> */}
                                  <option value="ten_percent">10</option>
                                </select>
                              </span>
                              <br />
                              <span style={{ fontWeight: '500', color: '#767676' }}>
                                1円未満 &emsp;
                                <input
                                  type="radio"
                                  name="truncation_rounded"
                                  id="truncation"
                                  defaultChecked={
                                    payment.calculate_one_yen == 'truncation' ||
                                    payment.calculate_one_yen == null
                                  }
                                  value={`truncation`}
                                />
                                <label>切り捨て</label>
                                <input
                                  type="radio"
                                  name="truncation_rounded"
                                  id="rounded"
                                  defaultChecked={payment.calculate_one_yen == 'rounded_up'}
                                  value="rounded_up"
                                />
                                <label>切り捨て</label>
                              </span>
                            </div>
                            <br />
                            <p>内税の場合は、商品金額小計をそのまま注文金額とします。</p>
                            <p>外税の場合は、商品金額小計に税率を上乗せして注文金額とします。</p>
                          </div>
                        </form>
                        <button className="btn btn-primary" onClick={() => saveConsumptionTax()}>
                          保存
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2.SPECIFY PAYMENT GATEWAY */}
                  <div className="payment_management_setting__item">
                    <h6>決済ゲートウェイ指定</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        {/* <form action=""> */}
                        <input
                          type="radio"
                          name="specify_payment_gateway"
                          id="specify_pg_none"
                          value={`no`}
                          defaultChecked={noCan}
                          onChange={() => setNoCan(true)}
                        />
                        <label>無し</label>
                        <input
                          type="radio"
                          id="specify_pg_canbe"
                          name="specify_payment_gateway"
                          value={`yes`}
                          defaultChecked={!noCan}
                          onChange={() => setNoCan(false)}
                        />
                        <label>あり</label>
                        <br />
                        <div
                          className="payment_management_setting__can"
                          style={{ display: `${noCan == true ? 'none' : 'block'}` }}
                        >
                          <label style={{ width: '20%' }}>決済方法の変数名</label>
                          <select
                            name="specify_payment_method_variable"
                            style={{ width: '30%' }}
                            id="specify_payment_method_variable"
                            defaultValue={
                              payment?.specify_payment_variable?.id
                                ? payment?.specify_payment_variable?.id
                                : 1
                            }
                          >
                            {listvar?.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.variable_name}
                              </option>
                            ))}
                          </select>
                          <br />
                          <div>
                            {/* <form action=""> */}
                            <form id="customSPGW">
                              {/* <div id={`specifyPGW`}>
                                <label>variable value</label>
                                <input name={`spgw_variable`} type="text" />
                                <label>payment gateway</label>
                                <select name={`spgw_gateway`}>
                                {paymentGateway?.map((item, i)=>(
                                      <option key={i} value={item.id}>{item.gateway_name}</option>
                                    ))}
                                </select>
                              </div> */}
                              {customDivSpecifyPaymentGW?.map((cdiv, i) => (
                                <div key={i} id={`specifyPGW${i}`}>
                                  <div style={{ display: 'flex' }}>
                                    <label style={{ width: '10%' }}>
                                      変数値 <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                      style={{ width: '20%' }}
                                      name={`spgw_variable_${i}`}
                                      type="text"
                                      defaultValue={
                                        payment?.specify_payment_variables.length > 0
                                          ? payment?.specify_payment_variables[i]?.variable_value
                                          : null
                                      }
                                    />
                                    <label style={{ width: '105px', textAlign: 'center' }}>
                                      決済ゲートウェイ
                                    </label>
                                    <select
                                      style={{ width: '20%' }}
                                      name={`spgw_gateway_${i}`}
                                      defaultValue={
                                        payment?.specify_payment_variables.length > 0
                                          ? payment?.specify_payment_variables[i]
                                              ?.payment_gateway_name
                                          : null
                                      }
                                    >
                                      {paymentGateway?.map((item, i) => (
                                        <option key={i} value={item.id}>
                                          {item.gateway_name}
                                        </option>
                                      ))}
                                    </select>
                                    <span
                                      style={{
                                        color: 'red',
                                        display: `${i == 0 ? 'none' : 'block'}`,
                                      }}
                                      onClick={() => deleteCdivSpecifyPGW(i)}
                                    >
                                      &emsp;X
                                    </span>
                                  </div>
                                  <div id={`err_settlement${i}`}>
                                    <label style={{ width: '10%' }}></label>
                                    <label
                                      style={{ width: '20%', color: 'red' }}
                                      id={`err_specifypgw_variable${i}`}
                                    ></label>
                                    <label style={{ width: '105px' }}></label>
                                    <label
                                      style={{ width: '20%', color: 'red' }}
                                      id={`err_specifypgw_gw${i}`}
                                    ></label>
                                  </div>
                                </div>
                              ))}
                            </form>
                            {/* <label>variable value</label>
                              <input type="text" />
                              <label>payment gateway</label>
                              <select>
                                <option value="l">l</option>
                                <option value="l">l dddddddddddddd</option>
                              </select>
                              <br /> */}
                            {/* <label>variable value</label>
                                <input type="text" />
                                <label>payment gateway</label>
                                <select>
                                  <option value="l">l</option>
                                  <option value="l">l dddddddddddddd</option>
                                </select> */}
                            {/* </form> */}
                          </div>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => addNewSpecifyPaymentGW()}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        {/* </form> */}
                        <button
                          className="btn btn-primary"
                          onClick={() => saveSpecifyPaymentGateway()}
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3.SETTLEMENT FEE (TAX INCLUDED) */}
                  <div className="payment_management_setting__item">
                    <h6>決済手数料（税込）</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <input
                          type="radio"
                          name="settlement_fee"
                          id="settlement_fee_free"
                          value={`free`}
                          checked={noPaid}
                          onChange={() => setNoPaid(true)}
                        />
                        <label>無料</label>
                        <input
                          type="radio"
                          name="settlement_fee"
                          id="settlement_fee_paid"
                          checked={!noPaid}
                          onChange={() => setNoPaid(false)}
                        />
                        <label>有料</label>
                        <br />

                        <div
                          className="payment_management_setting__can"
                          style={{ display: `${noPaid == true ? 'none' : 'block'}` }}
                        >
                          <label style={{ width: '20%' }}>決済方法の変数名</label>
                          <select
                            name="settlement_payment_method_variable"
                            style={{ width: '30%' }}
                            id="settlement_payment_method_variable"
                            defaultValue={
                              payment?.settlement_fee_variable?.id
                                ? payment?.settlement_fee_variable?.id
                                : 1
                            }
                          >
                            {listvar?.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.variable_name}
                              </option>
                            ))}
                          </select>
                          <br />
                          <form id="settlement_PMGW">
                            {/* <div id={`settlementPGW`}>
                              <label style={{width:"10%"}}>
                                variable value <span style={{ color: 'red' }}>*</span>
                              </label>
                              <input style={{width:"20%"}} type="text" name={`settpgw_variable`} />
                              <label style={{width:"65px"}}>commission</label>
                              <input style={{width:"20%"}} type="number" name='settpgw_commission' placeholder="0" />
                              <span type="text">Yen (tax included)</span>

                            </div> */}
                            {customDivSettlementPaymentGW?.map((cdiv, i) => (
                              <div key={i} id={`settlementPGW${i}`}>
                                <div style={{ display: 'flex' }}>
                                  <label style={{ width: '10%' }}>
                                    変数値<span style={{ color: 'red' }}>*</span>
                                  </label>
                                  <input
                                    style={{ width: '20%' }}
                                    type="text"
                                    name={`settpgw_variable${i}`}
                                    defaultValue={
                                      payment?.settlement_fee_variables.length > 0
                                        ? payment?.settlement_fee_variables[i]?.variable_value
                                        : null
                                    }
                                  />
                                  <label style={{ width: '105px', textAlign: 'center' }}>
                                    手数料
                                  </label>
                                  <input
                                    style={{ width: '20%' }}
                                    type="number"
                                    name={`settpgw_commission${i}`}
                                    placeholder="0"
                                    defaultValue={
                                      payment?.settlement_fee_variables.length > 0
                                        ? payment?.settlement_fee_variables[i]?.commission
                                        : null
                                    }
                                  />
                                  <span>円（税込）</span>
                                  <span
                                    style={{
                                      color: 'red',
                                      display: `${i == 0 ? 'none' : 'block'}`,
                                    }}
                                    onClick={() => deleteCdivSettlementPGW(i)}
                                  >
                                    &emsp;X
                                  </span>
                                </div>
                                <div id={`err_settlement${i}`}>
                                  <label style={{ width: '10%' }}></label>
                                  <label
                                    style={{ width: '20%', color: 'red' }}
                                    id={`err_settpgw_variable${i}`}
                                  ></label>
                                  <label style={{ width: '65px' }}></label>
                                  <label
                                    style={{ width: '20%', color: 'red' }}
                                    id={`err_settpgw_commission${i}`}
                                  ></label>
                                </div>
                              </div>
                            ))}
                            {/* addNewSettlementPaymentGW */}
                          </form>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => addNewSettlementPaymentGW()}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => saveSettlementPaymentGateway()}
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4.SHIPPING FEE (TAX INCLUDED) */}
                  <div className="payment_management_setting__item">
                    <h6>送料（税込）</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <input
                          type="radio"
                          name="shipping_tax"
                          id="shipping_tax_free"
                          value={`free`}
                          checked={noShip}
                          onChange={() => setNoShip(true)}
                        />
                        <label>無料</label>
                        <input
                          type="radio"
                          name="shipping_tax"
                          id="shipping_tax_paid"
                          checked={!noShip}
                          onChange={() => setNoShip(false)}
                        />
                        <label>有料</label>
                        <br />
                        <div
                          className="payment_management_setting__can"
                          style={{ display: noShip == true ? 'none' : 'block' }}
                        >
                          <label style={{ width: '20%' }}>住所の変数名</label>
                          <select
                            name="shipping_fee_address_variable"
                            style={{ width: '30%' }}
                            id="shipping_fee_address_variable"
                            defaultValue={payment?.shipping_fee_variable.id}
                          >
                            {listvar?.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.variable_name}
                              </option>
                            ))}
                          </select>
                          <br />
                          <br />
                          <div
                            style={{
                              width: '52%',
                              display: 'flex',
                              borderBottom: '2px solid #cccccc',
                            }}
                          >
                            <span style={{ width: '35%', padding: '2%', color: '#767676' }}>
                              都道府県
                            </span>
                            <span
                              style={{ width: '65%', padding: '2% 2% 2% 0%', color: '#767676' }}
                            >
                              金額
                            </span>
                          </div>
                          <div style={{ width: '52%', height: '300px', overflowY: 'scroll' }}>
                            <form style={{ width: '100%' }} id="shipping_fee_tax">
                              {prefectures.map((item, i) => (
                                <div
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    padding: '10px',
                                    borderBottom: '1px solid #cccccc',
                                  }}
                                  key={i}
                                >
                                  <span style={{ width: '35%', padding: '2%', color: '#767676' }}>
                                    {item.prefectureName}
                                  </span>
                                  <span style={{ width: '40%', display: 'inline-block' }}>
                                    <input
                                      type="number"
                                      name={payment?.shipping_fee_variables[i]?.prefecture_id}
                                      style={{ width: '100%', color: '#767676' }}
                                      defaultValue={
                                        payment?.shipping_fee_variables[i]?.value
                                          ? payment?.shipping_fee_variables[i]?.value
                                          : 0
                                      }
                                    />
                                    <label
                                      style={{ color: 'red' }}
                                      id={`err_amount_of_money_${i}`}
                                    ></label>
                                  </span>
                                  <span style={{ width: '25%', padding: '2%', color: '#767676' }}>
                                    円（税込）
                                  </span>
                                </div>
                              ))}
                            </form>
                          </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => savePrefecturesTax()}>
                          保存
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 5.NP DEFERRED PAYMENT */}
                  <div className="payment_management_setting__item">
                    <h6>NP後払い</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <input
                          type="radio"
                          name="np_deferred"
                          id="np_deferred_no"
                          value={`no`}
                          checked={noNP}
                          onChange={() => setNoNP(true)}
                        />
                        <label>無し</label>
                        <input
                          type="radio"
                          name="np_deferred"
                          id="np_deferred_can"
                          checked={!noNP}
                          onChange={() => setNoNP(false)}
                        />
                        <label>あり</label>
                        <br />
                        <div
                          className="payment_management_setting__can"
                          style={{ display: `${noNP == true ? 'none' : 'block'}` }}
                        >
                          <div>
                            <span style={{ fontWeight: '400', color: '#767676' }}>
                              請求書の同梱 &emsp;
                              <input
                                type="radio"
                                name="invoice_included"
                                id="not_included"
                                value={`not_included`}
                                defaultChecked={
                                  payment.np_invoice_included == 'not_include' ||
                                  payment.np_invoice_included == null
                                }
                              />
                              <label>同梱しない</label>
                              <input
                                type="radio"
                                name="invoice_included"
                                id="enclosed "
                                value={`enclosed`}
                                defaultChecked={payment.np_invoice_included == 'enclosed'}
                              />
                              <label>同梱する（NP後払いwiz）</label>
                            </span>
                            <span style={{ fontWeight: '400', color: '#767676' }}>
                              ※別途ヤマトクレジットファイナンスとの契約が必要になります。
                            </span>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <label style={{ marginRight: '20px' }}>
                              上限金額<span style={{ color: 'red' }}>*</span>
                            </label>
                            <span style={{ display: 'inline-block' }}>
                              <input
                                type="number"
                                placeholder="0"
                                id="np_maximum_amount"
                                defaultValue={payment.np_maximum_amount}
                              />
                              <br />
                              <label style={{ color: 'red' }} id={`err_np_maximum_amount`}></label>
                            </span>
                            円
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <label style={{ marginRight: '20px' }}>
                              決済手数料（税込）<span style={{ color: 'red' }}>*</span>
                            </label>
                            <form id="customNP">
                              {customDivSettlementFee.map((cdiv, i) => (
                                <div style={{ display: 'flex' }} key={i} id={`settlementFee${i}`}>
                                  <div style={{ display: 'inline-block' }}>
                                    <input
                                      style={{ marginLeft: '20px' }}
                                      type="number"
                                      placeholder="0"
                                      name={`np_settlement_fee_value${i}`}
                                      defaultValue={
                                        payment?.np_value_settlements.length > 0
                                          ? payment?.np_value_settlements[i]
                                              ?.np_settlement_fee_value
                                          : null
                                      }
                                    />
                                    ~<br />
                                    <label
                                      style={{ color: 'red', margin: '0 0 0 20px' }}
                                      id={`err_np_settlement_fee_value_${i}`}
                                    ></label>
                                  </div>
                                  <div style={{ display: 'inline-block' }}>
                                    <input
                                      style={{ marginLeft: '20px' }}
                                      type="number"
                                      placeholder="0"
                                      name={`np_settlement_max_value${i}`}
                                      defaultValue={
                                        payment?.np_value_settlements.length > 0
                                          ? payment?.np_value_settlements[i]
                                              ?.np_settlement_max_value
                                          : null
                                      }
                                    />
                                    円
                                    <br />
                                    <label
                                      style={{ color: 'red', margin: '0 0 0 20px' }}
                                      id={`err_np_settlement_max_value_${i}`}
                                    ></label>
                                  </div>
                                  <div style={{ display: 'inline-block' }}>
                                    <input
                                      style={{ marginLeft: '20px' }}
                                      type="number"
                                      placeholder="0"
                                      name={`np_settlement_min_value${i}`}
                                      defaultValue={
                                        payment?.np_value_settlements.length > 0
                                          ? payment?.np_value_settlements[i]
                                              ?.np_settlement_min_value
                                          : null
                                      }
                                    />
                                    円
                                    <br />
                                    <label
                                      style={{ color: 'red', margin: '0 0 0 20px' }}
                                      id={`err_np_settlement_min_value_${i}`}
                                    ></label>
                                  </div>
                                  <span
                                    style={{
                                      color: 'red',
                                      display: `${i == 0 ? 'none' : 'inline-block'}`,
                                      marginTop: '10px',
                                    }}
                                    onClick={() => deleteCdivSettlementFee(i)}
                                  >
                                    &emsp;X
                                  </span>
                                </div>
                              ))}
                            </form>
                          </div>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => addNewSettlementFee()}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button className="btn btn-primary" onClick={() => saveNPDeferredPayment()}>
                          保存
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{msgNoti}</span>
        </div>
      </ModalNoti>
    </AdminPage>
  );
}

export default PaymentManagement;
