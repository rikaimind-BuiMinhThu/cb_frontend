import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../assets/css/bot/payment-mng.css';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import api from 'api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'api/tokenExpired';

function PaymentManagement() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openHisOrder, setOpenHisOrder] = useState(true);
  const [openTax, setOpenTax] = useState(true);
  const [noCan, setNoCan] = useState(true);
  const [noPaid, setNoPaid] = useState(true);
  const [noShip, setNoShip] = useState(true);
  const [listvar, setListVar] = useState([])
  const [customDivSpecifyPaymentGW, setCustomDivSpecifyPaymentGW] = useState(['newDiv0']);
  const [customDivSettlementPaymentGW, setCustomDivSettlementPaymentGW] = useState(['newDiv0']);
  var [numSpecifyPaymentGW, setNumSpecifyPaymentGW] = useState(1);
  var [numSettlementPaymentGW, setNumSettlementPaymentGW] = useState(1);
  const [paymentGateway, setPaymentGateway] = useState([])

  const [prefectures, setPrefectures] = useState([
    { prefectur: 'hokkaido', prefectureName: 'Hokkaido' },
    { prefectur: 'aomori', prefectureName: 'Aomori' },
    { prefectur: 'iwate', prefectureName: 'Iwate' },
    { prefectur: 'miyagi', prefectureName: 'Miyagi' },
    { prefectur: 'akita', prefectureName: 'Akita' },
    { prefectur: 'yamagata', prefectureName: 'Yamagata' },
    { prefectur: 'fukushima', prefectureName: 'Fukushima' },
    { prefectur: 'ibaraki', prefectureName: 'Ibaraki' },
    { prefectur: 'tochigi', prefectureName: 'Tochigi' },
    { prefectur: 'gunma', prefectureName: 'Gunma' },
    { prefectur: 'saitama', prefectureName: 'Saitama' },
    { prefectur: 'chiba', prefectureName: 'Chiba' },
    { prefectur: 'tokyo', prefectureName: 'Tokyo' },
    { prefectur: 'kanagawa', prefectureName: 'Kanagawa' },
    { prefectur: 'niigata', prefectureName: 'Niigata' },
    { prefectur: 'toyama', prefectureName: 'Toyama' },
    { prefectur: 'ishikawa', prefectureName: 'Ishikawa' },
    { prefectur: 'fukui', prefectureName: 'Fukui' },
    { prefectur: 'yamanashi', prefectureName: 'Yamanashi' },
    { prefectur: 'nagano', prefectureName: 'Nagano' },
    { prefectur: 'gifu', prefectureName: 'Gifu' },
    { prefectur: 'shizuoka', prefectureName: 'Shizuoka' },
    { prefectur: 'aichi', prefectureName: 'Aichi' },
    { prefectur: 'Mie', prefectureName: 'Mie' },
    { prefectur: 'shiga', prefectureName: 'Shiga' },
    { prefectur: 'kyoto', prefectureName: 'Kyoto' },
    { prefectur: 'osaka', prefectureName: 'Osaka' },
    { prefectur: 'hyogo', prefectureName: 'Hyogo' },
    { prefectur: 'nara', prefectureName: 'Nara' },
    { prefectur: 'wakayama', prefectureName: 'Wakayama' },
    { prefectur: 'tottori', prefectureName: 'Tottori' },
    { prefectur: 'shimane', prefectureName: 'Shimane' },
    { prefectur: 'okayama', prefectureName: 'Okayama' },
    { prefectur: 'hiroshima', prefectureName: 'Hiroshima' },
    { prefectur: 'yamaguchi', prefectureName: 'Yamaguchi' },
    { prefectur: 'tokushima', prefectureName: 'Tokushima' },
    { prefectur: 'kagawa', prefectureName: 'Kagawa' },
    { prefectur: 'ehime', prefectureName: 'Ehime' },
    { prefectur: 'kochi', prefectureName: 'Kochi' },
    { prefectur: 'kukuoka', prefectureName: 'Fukuoka' },
    { prefectur: 'saga', prefectureName: 'Saga' },
    { prefectur: 'sagasaki', prefectureName: 'Nagasaki' },
    { prefectur: 'kumamoto', prefectureName: 'Kumamoto' },
    { prefectur: 'oita', prefectureName: 'Oita' },
    { prefectur: 'miyazaki', prefectureName: 'Miyazaki' },
    { prefectur: 'kagoshima', prefectureName: 'Kagoshima' }
  ])

  useEffect(() => {
    var date = new Date();
    if (date.getDate() != 1) {
      setEndDate(new Date(date.setDate(date.getDate() - 1)));
    }
    setStartDate(new Date(date.setDate(1)));
  }, []);
  useEffect(() => {
    var botId = Cookies.get('bot_id')
    api.get(`/api/v1/managements/chatbots/${botId}/variables?page=all`).then(res => {
      setListVar(res?.data?.data)
    }).catch(err => {
      console.log(err)
      if (err?.response?.data?.code == 0) {
        tokenExpired()
      }
    })
  }, [])

  useEffect(()=>{
    api.get(`/api/v1/payment_managements/payment_gateways?page=all`).then(res=>{
      if(res.data.code == 1){
        setPaymentGateway(res.data.data)
      }
    }).catch(err =>{
      console.log(err)
      if(err?.response.data.code ==0){
        tokenExpired()
      }
    })
  },[])

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
      validate.innerHTML = 'Start date cannot be after end date.';
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
      validate.innerHTML = 'End date cannot be before start date.';
    } else {
      validate.style.display = 'none';
      validate.innerHTML = '';
    }
  }

  function saveConsumptionTax() {
    //consumption_tax
    var obj = {}
    var elements = document.getElementById('included_tax').checked;
    var elements0 = document.getElementById('outside_tax').checked;
    var elements1 = document.getElementById('sales_tax_rate').value;
    var elements2 = document.getElementById('truncation').checked;
    var elements3 = document.getElementById('rounded').checked;

    obj = {
      included_outside_tax: elements == true ? 'tax_included' : 'outside_tax',
      sales_tax_rate: elements1,
      truncation_rounded: (elements2 == false && elements3 == false) ? '' : elements2 == true ? 'truncation' : 'rounded'

    }
    console.log(obj);
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

  function saveSpecifyPaymentGateway() {
    let formAdd = document.getElementById('customSPGW')
    let payment_method_variable = document.getElementById('specify_payment_method_variable')?.value
    let specify_pg_none = document.getElementById('payment_method_variable')?.checked
    let specify_pg_canbe = document.getElementById('specify_pg_canbe')?.checked
    let pm = []
    let pm_var = []
    let pm_val = []
    let obj = {}
    let checkVal = false
    let checkVar = false
    for (let i = 0; i < formAdd.length; i++) {
      // pm[formAdd[i].name] = formAdd[i].value;
      if (formAdd[i].name.includes('spgw_gateway')) {
        pm_val.push(formAdd[i].value)
      } else {
        pm_var.push(formAdd[i].value)
      }

    }
    for (var i = 0; i < pm_var.length; i++) {
      if(pm_var[i] == ''){
        checkVar = true
        if(document.getElementById(`err_specifypgw_variable${i}`))
        document.getElementById(`err_specifypgw_variable${i}`).innerHTML = 'Please input variable'
      }else{
        if(document.getElementById(`err_specifypgw_variable${i}`))
        document.getElementById(`err_specifypgw_variable${i}`).innerHTML = ''
      }
      if(pm_val[i] == ''){
        checkVal = true
        if(document.getElementById(`err_specifypgw_gw${i}`))
        document.getElementById(`err_specifypgw_gw${i}`).innerHTML = 'Please input payment gateway'
      }else{
        if(document.getElementById(`err_specifypgw_gw${i}`))
        document.getElementById(`err_specifypgw_gw${i}`).innerHTML = ''
      }
      pm.push({
        variable_value: pm_var[i],
        payment_gateway: pm_val[i]
      })
    }
    obj = {
      specify_payment_gateway: specify_pg_none == true ? 'specify_pg_none' : 'specify_pg_canbe',
      payment_method_var: payment_method_variable,
      variable_payment_gateway: pm

    }
    if(checkVal == false && checkVar == false){
      console.log(obj)
    }else{
      console.log('vvv')
    }
  }

  function saveSettlementPaymentGateway() {
    let formAdd = document.getElementById('settlement_PMGW')
    let payment_method_variable = document.getElementById('settlement_payment_method_variable')?.value
    let settlement_fee_free = document.getElementById('settlement_fee_free')?.checked
    let settlement_fee_paid = document.getElementById('settlement_fee_paid')?.checked
    let pm = []
    let pm_var = []
    let pm_val = []
    let obj = {}
    let checkVar = false
    let checkVal = false
    for (let i = 0; i < formAdd.length; i++) {
      if (formAdd[i].name.includes('settpgw_commission')) {
        pm_val.push(formAdd[i].value)
      } else {
        pm_var.push(formAdd[i].value)
      }

    }
    for (var i = 0; i < pm_var.length; i++) {
      if(pm_var[i] == ''){
        checkVar = true
        if(document.getElementById(`err_settpgw_variable${i}`))
        document.getElementById(`err_settpgw_variable${i}`).innerHTML = 'Please input variable'
      }else{
        if(document.getElementById(`err_settpgw_variable${i}`))
        document.getElementById(`err_settpgw_variable${i}`).innerHTML = ''
      }
      if(pm_val[i] == ''){
        checkVal = true
        if(document.getElementById(`err_settpgw_commission${i}`))
        document.getElementById(`err_settpgw_commission${i}`).innerHTML = 'Please input comission'
      }else{
        if(document.getElementById(`err_settpgw_commission${i}`))
        document.getElementById(`err_settpgw_commission${i}`).innerHTML = ''
      }
      pm.push({
        variable_value: pm_var[i],
        comission: pm_val[i]
      })
    }
    obj = {
      specify_payment_gateway: settlement_fee_free == true ? 'free' : 'paid',
      payment_method_var: payment_method_variable,
      variable_payment_comission: pm
    }
    if(checkVal == false && checkVar == false){
      console.log(obj)
    }else{
      console.log('kkk')
    }
  }

  function savePrefecturesTax() {
    let formAdd = document.getElementById('shipping_fee_tax')
    let payment_method_variable = document.getElementById('shipping_fee_address_variable')?.value
    let shipping_tax_free = document.getElementById('shipping_tax_free')?.checked
    let shipping_tax_paid = document.getElementById('shipping_tax_paid')?.checked
    let pm = {}
    // let pm_var = []
    // let pm_val = []
    let obj = {}
    for (let i = 0; i < formAdd.length; i++) {
      pm[formAdd[i].name] = formAdd[i].value;

    }
    // for (var i = 0; i < pm_var.length; i++) {
    //   pm.push({
    //     variable_value: pm_var[i],
    //     payment_gateway: pm_val[i]
    //   })
    // }
    obj = {
      shipping_fee_tax: shipping_tax_free == true ? 'free' : 'paid',
      payment_method_var: payment_method_variable,
      variable_payment_comission: pm

    }
    console.log(obj)

  }

  function deleteCdivSpecifyPGW(id) {
    var ele = document.getElementById(`specifyPGW${id}`);
    ele.remove();
  }

  function deleteCdivSettlementPGW(id) {
    var ele = document.getElementById(`settlementPGW${id}`);
    ele.remove();
  }


  return (
    // <div>
    <div className="content">
      <Row id="screenAll">
        <Col md="12">
          <Card>
            <CardHeader>Payment management</CardHeader>
            <CardBody>
              <div className="payment-management-option">
                <div
                  id="payment_management_order_his"
                  style={{ color: '#43b8af' }}
                  className="payment-management-option-item"
                  onClick={() => orderHisSelected()}
                >
                  ORDER HISTORY
                </div>
                <div
                  id="payment_management_setting"
                  className="payment-management-option-item"
                  onClick={() => settingSelected()}
                >
                  SETTING
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
                        コンバージョン数
                      </h4>
                      <div style={{ borderRadius: '5px', padding: '5px' }}>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => selectDateStart(date)}
                          dateFormat="yyyy-MM-dd"
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
                          selected={endDate}
                          onChange={(date) => selectDateEnd(date)}
                          dateFormat="yyyy-MM-dd"
                          value={endDate}
                        // value={
                        //   endDatePreview
                        //     ? endDatePreview.toISOString().slice(0, 10).replaceAll('-', '/')
                        //     : 'yyyy/mm/dd'
                        // }
                        />
                      </div>
                      まで &emsp;<button className="payment-management-btn-search">Search</button>
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
                        <th style={{ width: '7.5%' }}>User ID</th>
                        <th style={{ width: '9%' }}>Order number</th>
                        <th>Product name</th>
                        <th style={{ width: '7.5%' }}>Unit price</th>
                        <th style={{ width: '7.5%' }}>Quantity</th>
                        <th style={{ width: '7.5%' }}>Price</th>
                        <th>Consumption tax</th>
                        <th>Settlement fee (tax included)</th>
                        <th>Shipping fee (tax included)</th>
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
                      </tr>
                    </tbody>
                  </Table>
                </>
              ) : (
                <div>
                  <div className="payment_management_setting__item">
                    <h6>consumption tax</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <form id='consumption_tax'>
                          <input
                            type="radio"
                            name="included_outside_tax"
                            id='included_tax'
                            checked={openTax}
                            value={`tax_include`}
                            onChange={() => setOpenTax(true)}
                          />
                          <label> tax included</label>
                          <input type="radio" id='outside_tax' name="included_outside_tax" value={`outside`}
                            onChange={() => setOpenTax(false)} />
                          <label>outside tax</label>
                          <br />
                          <div className="payment_management_setting__check-out">
                            <div style={{ width: "100%", display: `${openTax == true ? 'none' : 'block'}` }}>
                              <span style={{ fontWeight: "500", color: '#767676' }}>sales tax rate(%) &emsp;
                                <select id='sales_tax_rate' name='sales_tax_rate'>
                                  <option value="8">8</option>
                                  {/* <option value="9">9</option> */}
                                  <option value="10">10</option>
                                </select></span>
                              <br />
                              <span style={{ fontWeight: "500", color: '#767676' }}>Less than 1 yen &emsp;
                                <input type="radio" name="truncation_rounded" id='truncation' value={`truncation`} />
                                <label> truncation</label>
                                <input type="radio" name="truncation_rounded" id='rounded' value={`rounded`} />
                                <label>rounded up</label></span>
                            </div>
                            <br />
                            <p>
                              In the case of tax-inclusive, the product price subtotal will be used
                              as the order price.
                            </p>
                            <p>
                              In the case of tax-excluded, the order amount is calculated by adding
                              the tax rate to the product price subtotal.
                            </p>
                          </div>
                        </form>
                        <button className="btn btn-primary" onClick={() => saveConsumptionTax()}>Keep</button>
                      </div>
                    </div>
                  </div>

                  <div className="payment_management_setting__item">
                    <h6>Specify payment gateway</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        {/* <form action=""> */}
                        <input
                          type="radio"
                          name="specify_payment_gateway"
                          id='specify_pg_none'
                          checked={noCan}
                          onChange={() => setNoCan(true)}
                        />
                        <label> None</label>
                        <input type="radio" id='specify_pg_canbe'
                          name="specify_payment_gateway"
                          onChange={() => setNoCan(false)} />
                        <label>can be</label>
                        <br />
                        <div className="payment_management_setting__can"
                          style={{ display: `${noCan == true ? 'none' : 'block'}` }}>
                          <label style={{ width: "20%" }}>Payment method variable name</label>
                          <select name='specify_payment_method_variable' style={{ width: "30%" }} id='specify_payment_method_variable'>
                            {listvar?.map((item, i) => (
                              <option key={i} value={item.id}>{item.variable_name}</option>
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
                                <div key={cdiv} id={`specifyPGW${i}`}>
                                  <div style={{ display: 'flex' }}>
                                  <label style={{ width: "10%" }}>
                                    variable value <span style={{ color: 'red' }}>*</span>
                                  </label>
                                  <input style={{ width: "20%" }} name={`spgw_variable_${i}`} type="text" />
                                  <label style={{ width: "105px", textAlign:'center' }}>payment gateway</label>
                                  <select style={{ width: "20%" }}  name={`spgw_gateway_${i}`}>
                                    {paymentGateway?.map((item, i)=>(
                                      <option key={i} value={item.id}>{item.gateway_name}</option>
                                    ))}
                                  
                                  </select><span style={{ color: 'red', display: `${i == 0 ? 'none' : 'block'}`}} onClick={() => deleteCdivSpecifyPGW(i)}>&emsp;X</span>
                                  </div>
                                  <div id={`err_settlement${i}`}>
                                  <label style={{ width: "10%" }}></label>
                                  <label style={{ width: "20%", color: 'red' }} id={`err_specifypgw_variable${i}`}></label>
                                  <label style={{ width: "105px" }}></label>
                                  <label style={{ width: "20%", color: 'red' }} id={`err_specifypgw_gw${i}`}></label>

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
                          <button className="btn btn-outline-primary" onClick={() => addNewSpecifyPaymentGW()}>
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        {/* </form> */}
                        <button className="btn btn-primary" onClick={() => saveSpecifyPaymentGateway()}>Keep</button>
                      </div>
                    </div>
                  </div>

                  <div className="payment_management_setting__item">
                    <h6>Settlement fee (tax included)</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">

                        <input
                          type="radio"
                          name="settlement_fee"
                          id='settlement_fee_free'
                          checked={noPaid}
                          onChange={() => setNoPaid(true)}
                        />
                        <label> free</label>
                        <input type="radio" name="settlement_fee"
                          id='settlement_fee_paid' onChange={() => setNoPaid(false)} />
                        <label>Paid</label>
                        <br />

                        <div className="payment_management_setting__can" style={{ display: `${noPaid == true ? 'none' : 'block'}` }}>
                          <label style={{ width: "20%" }}>Payment method variable name</label>
                          <select name='settlement_payment_method_variable' style={{ width: "30%" }} id='settlement_payment_method_variable'>
                            {listvar?.map((item, i) => (
                              <option key={i} value={item.id}>{item.variable_name}</option>
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
                              <div key={cdiv} id={`settlementPGW${i}`}>
                                <div style={{ display: 'flex' }}>
                                  <label style={{ width: "10%" }}>
                                    variable value <span style={{ color: 'red' }}>*</span>
                                  </label>
                                  <input style={{ width: "20%" }} type="text" name={`settpgw_variable${i}`} />
                                  <label style={{ width: "105px", textAlign:'center' }}>commission</label>
                                  <input style={{ width: "20%" }} type="number" name={`settpgw_commission${i}`} placeholder="0" />
                                  <span>Yen (tax included)</span>
                                  <span style={{ color: 'red', display: `${i == 0 ? 'none' : 'block'}` }}
                                    onClick={() => deleteCdivSettlementPGW(i)}>&emsp;X</span>
                                </div>
                                <div id={`err_settlement${i}`}>
                                  <label style={{ width: "10%" }}></label>
                                  <label style={{ width: "20%", color: 'red' }} id={`err_settpgw_variable${i}`}></label>
                                  <label style={{ width: "65px" }}></label>
                                  <label style={{ width: "20%", color: 'red' }} id={`err_settpgw_commission${i}`}></label>

                                </div>
                              </div>
                            ))}
                            {/* addNewSettlementPaymentGW */}
                          </form>
                          <button className="btn btn-outline-primary"
                            onClick={() => addNewSettlementPaymentGW()}>
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <button className="btn btn-primary"
                          onClick={() => saveSettlementPaymentGateway()}>Keep</button>
                      </div>
                    </div>
                  </div>

                  <div className="payment_management_setting__item">
                    <h6>Shipping fee (tax included)</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">

                        <input
                          type="radio"
                          name="shipping_tax"
                          id='shipping_tax_free'
                          checked={noShip}
                          onChange={() => setNoShip(true)}
                        />
                        <label> free</label>
                        <input type="radio" name="shipping_tax"
                          id='shipping_tax_paid' onChange={() => setNoShip(false)} />
                        <label>Paid</label>
                        <br />
                        <div className="payment_management_setting__can" style={{ display: noShip == true ? 'none' : 'block' }}>
                          <label style={{ width: "20%" }}>Address variable name</label>
                          <select name='shipping_fee_address_variable' style={{ width: "30%" }} id='shipping_fee_address_variable'>
                            {listvar?.map((item, i) => (
                              <option key={i} value={item.id}>{item.variable_name}</option>
                            ))}
                          </select>
                          <br /><br />
                          <div style={{ width: "52%", display: "flex", borderBottom: "2px solid #cccccc" }}>
                            <span style={{ width: "35%", padding: "2%", color: "#767676" }}>Prefectures</span>
                            <span style={{ width: "65%", padding: "2% 2% 2% 0%", color: "#767676" }}>Amount of money</span>
                          </div>
                          <div style={{ width: "52%", height: '300px', overflowY: 'scroll' }}>
                            <form style={{ width: "100%" }} id='shipping_fee_tax'>
                              {prefectures.map((item, i) => (
                                <div style={{ width: "100%", display: "flex", padding: "10px", borderBottom: "1px solid #cccccc" }}
                                  key={i}>
                                  <span style={{ width: "35%", padding: "2%", color: "#767676" }}>{item.prefectureName}</span>
                                  <input type='number' name={item.prefectur} style={{ width: "40%", color: "#767676" }} />
                                  <span style={{ width: "25%", padding: "2%", color: "#767676" }}>Yen (tax included)</span>
                                </div>
                              ))}

                            </form>
                          </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => savePrefecturesTax()}>Keep</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>

    // </div>
  );
}

export default PaymentManagement;
