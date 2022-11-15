import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../../../assets/css/bot/payment-mng.css'
import api from '../../../../api/api-management'
import { tokenExpired } from 'api/tokenExpired';
import { Link } from 'react-router-dom';
function PaymentGateway() {
    const [gateway, setGateway] = useState([])
    useEffect(() => {
        api.get(`/api/v1/payment_managements/payment_gateways`).then(res => {
            console.log(res.data.data)
            setGateway(res.data.data)
        }).catch(error => {
            console.log(error);
            if (error.response?.data.code === 0) {
                tokenExpired()
            }
        })
    }, [])
    return (
        <>
            <div className="content">
                <Row id="screenAll">
                    <Col md="12">
                        <Card>
                            <CardHeader>Payment gateway</CardHeader>
                            <CardBody>
                                <h6>List of payment gateway</h6>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }}>No</th>
                                            <th style={{ width: "12.5%" }}>Payment gateway name</th>
                                            <th style={{ width: "12.5%" }}>Payment agency</th>
                                            <th style={{ width: "7.5%" }}>Mode</th>
                                            <th style={{ width: "12.5%" }}>Shop ID/Store openable</th>
                                            <th style={{ width: "12.5%" }}>Merchant Code / Merchant Code</th>
                                            <th style={{ width: "7.5%" }}>Client IP (IP code)</th>
                                            <th style={{ width: "7.5%" }}>Store ID</th>
                                            <th style={{ width: "100px" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gateway?.map((item, i) => (
                                            <tr key={i}>
                                                <td style={{ width: "5%", border: '1px solid #7186a1' }}>{i}</td>
                                                <td style={{ width: "12.5%", border: '1px solid #7186a1' }}>{item.gateway_name}</td>
                                                <td style={{ width: "12.5%", border: '1px solid #7186a1' }}>{item.payment_agency}</td>
                                                <td style={{ width: "7.5%", border: '1px solid #7186a1' }}>{item.mode}</td>
                                                <td style={{ width: "12.5%", border: '1px solid #7186a1' }}>{item.shop_id}</td>
                                                <td style={{ width: "12.5%", border: '1px solid #7186a1' }}>{item.merchant_code}</td>
                                                <td style={{ width: "7.5%", border: '1px solid #7186a1' }}>{item.client_ip}</td>
                                                <td style={{ width: "7.5%", border: '1px solid #7186a1' }}>{item.store_id}</td>
                                                <td style={{ width: "100px", border: '1px solid #7186a1' }}>
                                                    <Link to={`/admin/edit-payment-gateway/${item?.id}`}>
                                                        <button className='payment-gatway-btn-edit'>デモ</button>
                                                    </Link>
                                                    {/* <button className='payment-gatway-btn-edit'
                                                    onClick={()=>{window.location.href = '/admin/edit-payment-gateway'}}>Edit</button> */}
                                                    <button className='payment-gatway-btn-delete'>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* <tr>
                                            <td style={{width:"5%", border:'1px solid #7186a1'}}>1</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>PaymentGate</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>GMO Payment Gateway</td>
                                            <td style={{width:"7.5%", border:'1px solid #7186a1'}}>test</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>tshop00058883</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>-</td>
                                            <td style={{width:"7.5%", border:'1px solid #7186a1'}}>-</td>
                                            <td style={{width:"7.5%", border:'1px solid #7186a1'}}>-</td>
                                            <td style={{width:"100px", border:'1px solid #7186a1'}}>
                                                    <button className='payment-gatway-btn-edit'
                                                    onClick={()=>{window.location.href = '/admin/edit-payment-gateway'}}>Edit</button>
                                                    <button className='payment-gatway-btn-delete'>Delete</button>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                    
                                </Table>
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <Link to={'/admin/add-payment-gateway'}>
                                    <button className='payment-gatway-btn-add-gateway'>Addition</button>
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default PaymentGateway