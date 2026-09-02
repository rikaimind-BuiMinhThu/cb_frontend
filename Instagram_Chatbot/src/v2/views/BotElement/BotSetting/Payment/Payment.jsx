import React, { useEffect, useState } from 'react'
import InputCustom from '../ScenarioSetting/scenarioComon/InputCustom'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import './test-payment.js';
function Payment() {

    const [yearExpired, setYearExpired] = useState([]);
    const [monthExpired, setMonthExpired] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    useEffect(() => {
        var date = (new Date()).getFullYear();
        var year = []
        for (let i = parseInt(date); i <= parseInt(date) + 8
            ; i++) {
            year.push(i)
        }
        setYearExpired(year)
        const script = document.createElement("script");
        script.src = "https://stg.static.mul-pay.jp/ext/js/token.js";
        script.async = true;
        // script.onload = () => scriptLoaded();

        document.body.appendChild(script);
    }, [])

    function scriptLoaded() {
        doPurchase()
    }
    function doPurchase() {
        // var cardno, expire, securitycode, holdername;

        var cardNumber = document.getElementById("cardNumber").value;
        var expireYear = document.getElementById("yearEx").value;
        var expireMonth = document.getElementById("monthEx").value;
        var securitycode = document.getElementById("securityCode").value;
        var cardHolder = document.getElementById("cardHolder").value;
        var tokennumber = 1;

        if (cardNumber == '' || expireYear == '' || expireMonth == '' || securitycode == '' || cardHolder == '') {
            document.getElementById('purchaseErr').style.display = 'block'
        } else {
            if(parseInt(expireMonth) <10 ){
                expireMonth = `0${expireMonth}`
            }
            document.getElementById('purchaseErr').style.display = 'none'
            var shop_id = 'tshop00058883';
            window.Multipayment.init(shop_id);
            window.Multipayment.getToken({
                // holdername: 'Abby Yarbro',
                // cardno: '4111111111111111',           // card number without spaces
                // expire: '201905',                     // expiry in format 'YYYYMM'
                // securitycode: '123'
                holdername: cardHolder,
                cardno: cardNumber,                     // card number without spaces
                expire: `${'2019'}${expireMonth}`,                     // expiry in format 'YYYYMM'
                securitycode: securitycode
            }, res => {
                if (res.resultCode != '000') {
                    // show error message
                    console.log('error code ' + res.resultCode);
                } else {
                    let token = res.tokenObject.token;
                }
            });

        }

        // callback function should be a string only
    }

    //   function gmoResponseHandler(res) {
    //     console.log(res)
    //     // if(res.resultCode != '000') {
    //     //   // show error message
    //     //   console.log('error code ' + res.resultCode);
    //     // } else {
    //     //   var token = res.tokenObject.token;
    //     //   // use this token instead of card details to create transactions
    //     //   document.getElementById('token').innerHTML = token;
    //     // }
    //   };

    function onChangeValue(contentIndex) {
        
    }

    function purchase() {
        doPurchase()
    }
    return (
        <>
            <div className="content">
                <Row id="screenAll">
                    <Col md="12">
                        <Card>
                            <CardHeader>ádasasd</CardHeader>
                            <CardBody>
                                <div style={{ width: '100%' }}>
                                    <span>Card Number:</span>
                                    <InputCustom
                                        id={`cardNumber`}
                                        style={{ width: "100%" }}
                                        placeholder={`Please input card number...`}
                                        onChange={value => onChangeValue(value)}
                                        // value={''}
                                    />
                                    <br />
                                    <span>Card Holder:</span>
                                    <InputCustom
                                        id={`cardHolder`}
                                        style={{ width: "100%" }}
                                        placeholder={`Please input card holder...`}
                                        onChange={value => onChangeValue(value)}
                                    />
                                    <br />
                                    <span>Card expiry date:</span>
                                    <div style={{ display: "flex" }}>
                                        {/* <InputCustom
                                   style={{width:"49%"}}
                                        placeholder={`Expire year`}
                                        onChange={value => onChangeValue(value)}
                                        value={``}
                                    /> */}
                                        <select name="yearEx" id="yearEx" defaultValue={""}>
                                            <option value="">Year</option>
                                            {yearExpired.map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>

                                        <span className='span_end'>&</span>
                                        <select name="monthEx" id="monthEx" defaultValue={""}>
                                            <option value="" disabled>Month</option>
                                            {monthExpired.map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                        <br />
                                    </div>
                                    <span>Security code:</span>
                                    <InputCustom
                                        id={`securityCode`}
                                        style={{ width: "100%" }}
                                        placeholder={`Please input security code...`}
                                        onChange={value => onChangeValue(value)}
                                        // value={``}
                                    />
                                    <br />
                                    <span id='purchaseErr' style={{ color: 'red', display: 'none' }}>Please input all field</span>
                                </div>
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <button style={{backgroundColor:"white", border:'1px solid black', borderRadius:"5px"}} id='btnPurchase' onClick={() => purchase()}>
                                        Purchase
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        </>
    )
}

export default Payment