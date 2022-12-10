import { tokenExpired } from 'api/tokenExpired';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import ModalNoti from 'views/Popup/ModalNoti';
import api from '../../../../api/api-management'
function AddPaymentGateway() {
    const [msgNoti, setMsgNoti] = useState('')
    const [isOpenNoti, setIsOpenNoti] = useState(false)
    const [detailGw, setDetailGw] = useState()
    useEffect(() => {
        let path = window.location.pathname
        let id
        if (path.includes('edit-payment')) {
            id = path.substring(path.lastIndexOf('/') + 1, path.length)
            api.get(`/api/v1/payment_managements/payment_gateways/${id}`).then(res => {
                console.log(res.data)
                if (res.data.code === 1) {
                    setDetailGw(res.data.data);
                } else if (res.data.code === 2) {
                    // console.log('Not found')
                    setMsgNoti('Gateway not found')
                    setIsOpenNoti(true)
                    setTimeout(() => {
                        setIsOpenNoti(false);
                        document.getElementById('return_list').click();
                    }, 1000)
                }

            }).catch(error => {
                console.log(error)
                if (error.response?.data.code === 0) {
                    tokenExpired()
                }
            })
        }
        console.log(path)
    }, [])

    function savePaymentGateway() {
        let path = window.location.pathname;
        let id = path.substring(path.lastIndexOf('/') + 1, path.length)
        let gw_name = document.getElementById('pm_gw_name').value
        let gw_agency = document.getElementById('pm_gw_agency').value
        let gw_mode = document.getElementById('pm_gw_mode').value
        let gw_shop_id = document.getElementById('pm_gw_shop_id').value
        let gw_shop_pass = document.getElementById('pm_gw_shop_pass').value
        let gw_merchant_code = document.getElementById('pm_gw_merchant_code').value
        let pm_gw_sp_code = document.getElementById('pm_gw_sp_code').value
        let pm_gw_terminal_id = document.getElementById('pm_gw_terminal_id').value
        let checked_name = false
        let checked_shop = false
        let checked_merchant = false
        let check_sp = false
        let check_terminal = false
        if (gw_agency == 'gmo') {
            if (gw_name == '' || gw_name == ' ') {
                document.getElementById('pm_gw_name_err').style.display = 'block'
                document.getElementById('pm_gw_name_err').innerHTML = 'Please input payment gateway'
                checked_name = false
            } else {
                document.getElementById('pm_gw_name_err').style.display = 'none'
                document.getElementById('pm_gw_name_err').innerHTML = ''
                checked_name = true
            }
            if (gw_shop_id == '' || gw_shop_id == ' ') {
                document.getElementById('shop_id_err').style.display = 'block'
                document.getElementById('shop_id_err').innerHTML = 'Please input shop Id'
                checked_shop = false
            } else {
                document.getElementById('shop_id_err').style.display = 'none'
                document.getElementById('shop_id_err').innerHTML = ''
                checked_shop = true
            }
        } else if (gw_agency == 'np_payment') {
            if (gw_name == '') {
                document.getElementById('pm_gw_name_err').style.display = 'block'
                checked_name = false
            } else {
                document.getElementById('pm_gw_name_err').style.display = 'none'
                checked_name = true
            }
            if (gw_merchant_code == '') {
                document.getElementById('merchant_code_err').style.display = 'block'
                checked_merchant = false
            } else {
                document.getElementById('merchant_code_err').style.display = 'none'
                checked_merchant = true
            }
            if (pm_gw_sp_code == '') {
                document.getElementById('sp_code_err').style.display = 'block'
                check_sp = false
            } else {
                document.getElementById('sp_code_err').style.display = 'none'
                check_sp = true
            }
            if (pm_gw_terminal_id == '') {
                document.getElementById('terminal_id_err').style.display = 'block'
                check_terminal = false
            } else {
                document.getElementById('terminal_id_err').style.display = 'none'
                check_terminal = true
            }
        }
        if ((gw_agency == 'gmo' && checked_name == true && checked_shop == true)
            || (gw_agency == 'np_payment' && check_terminal == true && checked_merchant == true && check_sp == true)) {
            var addPMGW
            if (gw_agency == 'gmo') {
                addPMGW = {
                    payment: {
                        gateway_name: gw_name, payment_agency: gw_agency,
                        mode: gw_mode, shop_id: gw_shop_id, shop_pass: gw_shop_pass,
                        merchant_code: "", sp_code: "", terminal_id: "", client_ip: "", store_id: ""
                    }
                }
            } else if (gw_agency == 'np_payment') {
                addPMGW = {
                    payment: {
                        gateway_name: gw_name, payment_agency: gw_agency,
                        mode: gw_mode, shop_id: "", shop_pass: "",
                        merchant_code: gw_merchant_code, sp_code: pm_gw_sp_code, terminal_id: pm_gw_terminal_id, client_ip: "", store_id: ""
                    }
                }
            }

            if (path.includes('edit-payment')) {
                api.patch(`/api/v1/payment_managements/payment_gateways/${id}`, addPMGW).then(res =>{
                    if (res.data.code === 1) {
                        // console.log('oke')
                        setMsgNoti('Update payment gateway successfully!')
                        setIsOpenNoti(true)
                        setTimeout(() => {
                            setIsOpenNoti(false);
                            document.getElementById('return_list').click()
                        }, 1000)
                    } else if (res.data.code === 2) {
                        console.log(res.data.message)
                    }
                }).catch(error =>{
                    console.log(error)
                if (error.response?.data.code === 0) {
                    tokenExpired()
                }
                })
            }else{
                api.post(`/api/v1/payment_managements/payment_gateways`, addPMGW).then(res => {
                if (res.data.code === 1) {
                    // console.log('oke')
                    setMsgNoti('Add payment gateway successfully!')
                    setIsOpenNoti(true)
                    setTimeout(() => {
                        setIsOpenNoti(false);
                        document.getElementById('return_list').click()
                    }, 1000)
                } else if (res.data.code === 2) {
                    console.log(res.data.message)
                }
            }).catch(error => {
                console.log(error)
                if (error.response?.data.code === 0) {
                    tokenExpired()
                }
            })
            }

            
        }
    }

    function checkPaymentMethod(value) {
        if (value == 'gmo') {
            document.getElementById('GMO_pay').style.display = 'block'
            document.getElementById('NP_pay').style.display = 'none'
        } else if (value == 'np_payment') {
            document.getElementById('NP_pay').style.display = 'block'
            document.getElementById('GMO_pay').style.display = 'none'
        }
    }

    function checkPmGWName(name){
        document.getElementById('pm_gw_name').value = name.replace(/ +(?= )/g,'')
        if(name.length>50){
            document.getElementById('pm_gw_name_err').innerHTML = 'Payment gateway name maximun 50 characters'
            document.getElementById('pm_gw_name_err').style.display = 'block'
        }else{
            document.getElementById('pm_gw_name_err').innerHTML = ''
            document.getElementById('pm_gw_name_err').style.display = 'none'
        }
    }

    function checkPMGWShopId(shopId){
        document.getElementById('pm_gw_shop_id').value = shopId.replace(/ +(?= )/g,'')
        if(shopId.length>25){
            document.getElementById('shop_id_err').innerHTML = 'Payment gateway shop id maximun 25 characters'
            document.getElementById('shop_id_err').style.display = 'block'
        }else{
            document.getElementById('shop_id_err').innerHTML = ''
            document.getElementById('shop_id_err').style.display = 'none'
        }
    }

    function checkShopPassword(pass){
        document.getElementById('pm_gw_shop_pass').value = pass.replace( /\s/g, '')

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

                                    <input id='pm_gw_name' className='add-payment-gateway-input-form' onChange={(e)=>checkPmGWName(e.target.value)}
                                        defaultValue={`${detailGw == undefined ? '' : detailGw.gateway_name}`}></input>
                                </div>
                                <div className='add-payment-gateway-add-form' style={{ padding: "0", marginTop: "-1.75%" }}>
                                    <span className='add-payment-gateway-span-form' ></span>
                                    <span id='pm_gw_name_err' className='add-payment-gateway-input-form' 
                                    style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input Payment gateway name</span>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'>
                                        Payment agency
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <select id='pm_gw_agency' defaultValue={`${detailGw == undefined ? 'gmo' : detailGw.payment_agency}`}
                                        className='add-payment-gateway-input-form'
                                        onChange={(e) => checkPaymentMethod(e.target.value)}>
                                        <option value="gmo">GMO Payment Gateway</option>
                                        <option value="np_payment">NP deferred payment</option>
                                    </select>
                                </div>
                                <div className='add-payment-gateway-add-form'>
                                    <span className='add-payment-gateway-span-form'>
                                        Mode
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <select id='pm_gw_mode'
                                        defaultValue={`${detailGw == undefined ? 'test' : detailGw.mode}`}
                                        className='add-payment-gateway-input-form'>
                                        <option value="test">Test</option>
                                        <option value="production">Production</option>
                                    </select>
                                </div>
                                <div id='GMO_pay'>
                                    <div className='add-payment-gateway-add-form'>
                                        <span className='add-payment-gateway-span-form'>
                                            Shop ID
                                            <span style={{ color: "red" }}>*</span>
                                        </span>
                                        <input id='pm_gw_shop_id'onChange={(e)=>checkPMGWShopId(e.target.value)} defaultValue={`${detailGw == undefined ? '' : detailGw.shop_id}`}
                                            className='add-payment-gateway-input-form'></input>
                                    </div>
                                    <div className='add-payment-gateway-add-form'
                                        style={{ padding: "0", marginTop: "-1.75%" }}>
                                        <span className='add-payment-gateway-span-form'></span>
                                        <span id='shop_id_err' className='add-payment-gateway-input-form' 
                                        style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input shop Id</span>
                                    </div>
                                    <div className='add-payment-gateway-add-form'>
                                        <span className='add-payment-gateway-span-form'>shop password</span>
                                        <input id='pm_gw_shop_pass' style={{border:"1px solid gray", borderRadius:"2.5px"}}  type={'password'} onChange={(e)=>checkShopPassword(e.target.value)}
                                            className='add-payment-gateway-input-form'></input>
                                    </div>
                                </div>
                                <div id='NP_pay' style={{ display: 'none' }}>
                                    <div className='add-payment-gateway-add-form'>
                                        <span className='add-payment-gateway-span-form'>
                                            Merchant code
                                            <span style={{ color: "red" }}>*</span>
                                        </span>
                                        <input id='pm_gw_merchant_code' defaultValue={`${detailGw == undefined ? '' : detailGw.merchant_code}`}
                                            className='add-payment-gateway-input-form'></input>
                                    </div>
                                    <div className='add-payment-gateway-add-form'
                                        style={{ padding: "0", marginTop: "-1.75%" }}>
                                        <span className='add-payment-gateway-span-form'></span>
                                        <span id='merchant_code_err' className='add-payment-gateway-input-form'
                                            style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input Merchant code</span>
                                    </div>
                                    <div className='add-payment-gateway-add-form'>
                                        <span className='add-payment-gateway-span-form'>
                                            SP code
                                            <span style={{ color: "red" }}>*</span>
                                        </span>
                                        <input id='pm_gw_sp_code' defaultValue={`${detailGw == undefined ? '' : detailGw.sp_code}`}
                                            className='add-payment-gateway-input-form'></input>
                                    </div>
                                    <div className='add-payment-gateway-add-form'
                                        style={{ padding: "0", marginTop: "-1.75%" }}>
                                        <span className='add-payment-gateway-span-form'></span>
                                        <span id='sp_code_err' className='add-payment-gateway-input-form'
                                            style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input SP code</span>
                                    </div>
                                    <div className='add-payment-gateway-add-form'>
                                        <span className='add-payment-gateway-span-form'>
                                            Terminal ID
                                            <span style={{ color: "red" }}>*</span>
                                        </span>
                                        <input id='pm_gw_terminal_id' defaultValue={`${detailGw == undefined ? '' : detailGw.terminal_id}`}
                                            className='add-payment-gateway-input-form'></input>
                                    </div>
                                    <div className='add-payment-gateway-add-form'
                                        style={{ padding: "0", marginTop: "-1.75%" }}>
                                        <span className='add-payment-gateway-span-form'></span>
                                        <span id='terminal_id_err' className='add-payment-gateway-input-form'
                                            style={{ color: 'red', display: "none", marginBottom: "-3.5%" }}>Please input Terminal ID</span>
                                    </div>
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
                <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
                    <div>
                        <h6>{msgNoti}</h6>
                    </div>
                </ModalNoti>
            </div>
            <Link to={'/admin/payment-gateway'}>
                <button id='return_list' style={{ display: 'none' }}>Back</button>
            </Link>
        </>
    )
}

export default AddPaymentGateway