import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../../../assets/css/bot/payment-mng.css'
import api from '../../../../api/api-management'
import { tokenExpired } from 'api/tokenExpired';
import { Link } from 'react-router-dom';
import ModalNoti from 'views/Popup/ModalNoti';
import ModalShort from 'views/Popup/ModalShort';
function PaymentGateway() {
    const [gateway, setGateway] = useState([])
    const [msgNoti, setMsgNoti] = useState('')
    const [idDelete, setIdDelete] = useState('')
    const [isOpenNoti, setIsOpenNoti] = useState(false)
    const [isOpenDeletePW, setIsOpenDeletePW] = useState(false)

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

    function reloadListPMGW(){
        api.get(`/api/v1/payment_managements/payment_gateways`).then(res => {
            console.log(res.data.data)
            setGateway(res.data.data)
        }).catch(error => {
            console.log(error);
            if (error.response?.data.code === 0) {
                tokenExpired()
            }
        })
    }

    function cnfDeleteGW(id) {
        setIdDelete(id)
        setIsOpenDeletePW(true)
    }

    function deleteGW() {
        setIsOpenDeletePW(false)
        api.delete(`/api/v1/payment_managements/payment_gateways/${idDelete}`).then(res => {
            if (res.data.code === 1) {
                setIsOpenNoti(true)
                setMsgNoti("Delete payment gateway successfully!")
                setTimeout(() => {
                    
                    setIsOpenNoti(false)
                    setMsgNoti("")
                }, 1500)
                reloadListPMGW()
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
                                                        <button className='payment-gatway-btn-edit'>Edit</button>
                                                    </Link>
                                                    <button className='payment-gatway-btn-delete'
                                                        onClick={() => cnfDeleteGW(item?.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
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
                <ModalShort open={isOpenDeletePW} onClose={() => setIsOpenDeletePW(false)}>
                    <div>
                        <h4>Do you want to delete the payment gateway?</h4>
                        <div className='payment-gateway-cnf-btn'>
                            <button className='payment-gateway-cnf-btn-detail-yes' onClick={() => deleteGW()}>Yes</button>
                            <button className='payment-gateway-cnf-btn-detail-no' onClick={() => setIsOpenDeletePW(false)}>No</button>
                        </div>
                    </div>
                </ModalShort>
                <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
                    <div>
                        <h6>{msgNoti}</h6>
                    </div>
                </ModalNoti>
            </div>
        </>
    )
}

export default PaymentGateway