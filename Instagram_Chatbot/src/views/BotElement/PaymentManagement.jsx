import React, { useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../assets/css/bot/payment-mng.css'
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
function PaymentManagement() {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        var date = new Date()
        if (date.getDate() != 1) {
            setEndDate(new Date(date.setDate(date.getDate() - 1)))
        }
        setStartDate(new Date(date.setDate(1)))
    }, [])

    function orderHisSelected() {
        document.getElementById('payment_management_order_his').style.color = '#43b8af'
        document.getElementById('payment_management_setting').style.color = 'black'
    }

    function settingSelected() {
        document.getElementById('payment_management_order_his').style.color = 'black'
        document.getElementById('payment_management_setting').style.color = '#43b8af'
    }

    function selectDateStart(date) {
        setStartDate(date)
        var validate = document.getElementById(`payment_management_date_err`)
        var endMonth = (startDate.getMonth()+1 <10) ? `0${endDate.getMonth()+1}` : `${endDate.getMonth()+1}`
        var endDatee = (startDate.getDate() <10) ? `0${endDate.getDate()}` : `${endDate.getDate()}`
        var dateMonth = (date.getMonth()+1 <10) ? `0${date.getMonth() +1}` :  `${date.getMonth() + 1}`
        var dateDate = (date.getDate() <10) ? `0${date.getDate()}` :  `${date.getDate()}`
        if (parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`)
            > parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`)) {
            validate.style.display = 'block';
            validate.innerHTML = 'Start date cannot be after end date.'
        } else {
            validate.style.display = 'none';
            validate.innerHTML = ''
        }
        console.log(parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`))
        console.log(parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`))
    }

    function selectDateEnd(date) {
        setEndDate(date)
        var validate = document.getElementById(`payment_management_date_err`)
        var startMonth = (startDate.getMonth()+1) ? `0${startDate.getMonth()+1}` : `${startDate.getMonth()+1}`
        var startDatee = (startDate.getDate()) ? `0${startDate.getDate()}` : `${startDate.getDate()}`
        var dateMonth = (date.getMonth()+1) ? `0${date.getMonth() +1}` : `${date.getMonth() + 1}`
        var dateDate = (date.getDate()) ? `0${date.getDate()}` : `${date.getDate()}`
        if (parseInt(`${startDate.getFullYear()}${startMonth}${startDatee}`)
            > parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`)) {
            validate.style.display = 'block';
            validate.innerHTML = 'End date cannot be before start date.'
        } else {
            validate.style.display = 'none';
            validate.innerHTML = ''
        }
    }

    return (
        // <div>
        <div className="content">
            <Row id="screenAll">
                <Col md="12">
                    <Card>
                        <CardHeader>Payment management</CardHeader>
                        <CardBody>
                            <div className='payment-management-option'>
                                <div id='payment_management_order_his' style={{ color: '#43b8af' }} className='payment-management-option-item' onClick={() => orderHisSelected()}>ORDER HISTORY</div>
                                <div id='payment_management_setting' className='payment-management-option-item' onClick={() => settingSelected()}>SETTING</div>
                            </div>
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
                                    まで
                                    &emsp;<button className='payment-management-btn-search'>Search</button>
                                </div>
                                <span id='payment_management_date_err' style={{ color: "red", display: 'none' }}></span>
                            </div>
                            <br /> <br />
                            <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                  <thead className="text-primary">
                    <tr>
                      <th style={{width:"7.5%"}}>No</th>
                      <th style={{width:"7.5%"}}>User ID</th>
                      <th style={{width:"9%"}}>Order number</th>
                      <th>Product name</th>
                      <th style={{width:"7.5%"}}>Unit price</th>
                      <th style={{width:"7.5%"}}>Quantity</th>
                      <th style={{width:"7.5%"}}>Price</th>
                      <th>Consumption tax</th>
                      <th>Settlement fee (tax included)</th>
                      <th>Shipping fee (tax included)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        <td style={{border:'1px solid #7186a1'}}>123</td>
                        
                    </tr>
                  </tbody>
                  </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>

        // </div>
    )
}

export default PaymentManagement