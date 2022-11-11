import React from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';

function AddPaymentGateway() {
    function savePaymentGateway() {
        let gw_name = document.getElementById('pm_gw_name').value
        let gw_agency = document.getElementById('pm_gw_agency').value
        let gw_mode = document.getElementById('pm_gw_mode').value
        let gw_shop_id = document.getElementById('pm_gw_shop_id').value
        let gw_shop_pass = document.getElementById('pm_gw_shop_pass').value
        let checked_name = false
        let checked_shop = false
        if (gw_name == '') {
            document.getElementById('pm_gw_name_err').style.display = 'block'
            checked_name = false
        } else {
            document.getElementById('pm_gw_name_err').style.display = 'none'
            checked_name = true
        }
        if (gw_shop_id == '') {
            document.getElementById('shop_id_err').style.display = 'block'
            checked_shop = false
        } else {
            document.getElementById('shop_id_err').style.display = 'none'
            checked_shop = true
        }   
        if (checked_name == true && checked_shop == true) {
            alert('checked ok!')
        } else {
            alert('not ok')
        }
    }
    return (
        <>
            <div className="content">
                <Row id="screenAll">
                    <Col md="12">
                        <Card>
                            <CardHeader>Add Payment gateway</CardHeader>
                            <CardBody style={{ textAlign: "center", width: "100%" }}>
                                <div className='add-payment-gateway-add-form'>

                                    <span className='add-payment-gateway-span-form'>
                                        Payment gateway name
                                        <span style={{ color: "red" }}>*</span>
                                    </span>

                                    <input id='pm_gw_name' className='add-payment-gateway-input-form'></input>
                                </div>
                                <div className='add-payment-gateway-add-form' style={{ padding: "0", marginTop: "-1.75%" }}>
                                    <span className='add-payment-gateway-span-form' ></span>
                                    <span id='pm_gw_name_err' className='add-payment-gateway-input-form' style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input Payment gateway name</span>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'>
                                        Payment agency
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <select id='pm_gw_agency' defaultValue={'GMO'} className='add-payment-gateway-input-form'>
                                        <option value="GMO">GMO Payment Gateway</option>
                                        <option value="NP">NP deferred payment</option>
                                    </select>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'>
                                        Mode
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <select id='pm_gw_mode' defaultValue={'test'} className='add-payment-gateway-input-form'>
                                        <option value="test">Test</option>
                                        <option value="production">Production</option>
                                    </select>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'>
                                        Shop ID
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <input id='pm_gw_shop_id' className='add-payment-gateway-input-form'></input>
                                </div>
                                <div className='add-payment-gateway-add-form'
                                    style={{ padding: "0", marginTop: "-1.75%" }}>
                                    <span className='add-payment-gateway-span-form'></span>
                                    <span id='shop_id_err' className='add-payment-gateway-input-form' style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input shop Id</span>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'>shop password</span>
                                    <input id='pm_gw_shop_pass' className='add-payment-gateway-input-form'></input>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'></span>
                                    <div>
                                        <button className='add-payment-gateway-btn-return' onClick={() => { window.location.href = '/admin/payment-gateway' }}>Return</button>
                                        <button className='add-payment-gateway-btn-save' onClick={() => savePaymentGateway()}>Save</button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        </>
    )
}

export default AddPaymentGateway