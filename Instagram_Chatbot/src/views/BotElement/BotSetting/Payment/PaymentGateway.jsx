import React from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../../../assets/css/bot/payment-mng.css'
function PaymentGateway() {
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
                                            <th style={{width:"5%"}}>No</th>
                                            <th style={{width:"12.5%"}}>Payment gateway name</th>
                                            <th style={{width:"12.5%"}}>Payment agency</th>
                                            <th style={{width:"7.5%"}}>Mode</th>
                                            <th style={{width:"12.5%"}}>Shop ID/Store openable</th>
                                            <th style={{width:"12.5%"}}>Merchant Code / Merchant Code</th>
                                            <th style={{width:"7.5%"}}>Client IP (IP code)</th>
                                            <th style={{width:"7.5%"}}>Store ID</th>
                                            <th style={{width:"100px"}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{width:"5%", border:'1px solid #7186a1'}}>1</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>PaymentGate</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>GMO Payment Gateway</td>
                                            <td style={{width:"7.5%", border:'1px solid #7186a1'}}>test</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>tshop00058883</td>
                                            <td style={{width:"12.5%", border:'1px solid #7186a1'}}>-</td>
                                            <td style={{width:"7.5%", border:'1px solid #7186a1'}}>-</td>
                                            <td style={{width:"7.5%", border:'1px solid #7186a1'}}>-</td>
                                            <td style={{width:"100px", border:'1px solid #7186a1'}}>
                                                    <button className='payment-gatway-btn-edit'>Edit</button>
                                                    <button className='payment-gatway-btn-delete'>Delete</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div style={{width:"100%", textAlign:"center"}}>
                                    <button className='payment-gatway-btn-add-gateway' onClick={()=>{window.location.href = '/admin/add-payment-gateway'}}>Addition</button>
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