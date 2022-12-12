import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../../../assets/css/bot/payment-mng.css'
import api from '../../../../api/api-management'
import { tokenExpired } from 'api/tokenExpired';
import { Link } from 'react-router-dom';
import ModalNoti from 'views/Popup/ModalNoti';
import ModalShort from 'views/Popup/ModalShort';
import { Pagination } from '@material-ui/lab';
function PaymentGateway() {
    const [gateway, setGateway] = useState([])
    const [msgNoti, setMsgNoti] = useState('')
    const [idDelete, setIdDelete] = useState('')
    const [isOpenNoti, setIsOpenNoti] = useState(false)
    const [isOpenDeletePW, setIsOpenDeletePW] = useState(false)
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {
        api.get(`/api/v1/payment_managements/payment_gateways?page=all`).then(res => {
            console.log(res.data.data)
            setGateway(res.data.data)
        }).catch(error => {
            console.log(error);
            if (error.response?.data.code === 0) {
                tokenExpired()
            }
        })
    }, [])

    function reloadListPMGW(pgIndex) {
        console.log(pgIndex);
        api.get(`/api/v1/payment_managements/payment_gateways?page=${pgIndex}`).then(res => {
            console.log(res.data.data)
            if (res?.data?.code == 1) {
                setGateway(res.data.data)
                setTotalPage(Math.ceil(res.data?.total / 25));
            }

        }).catch(error => {
            console.log(error);
            if (error.response?.data.code === 0) {
                tokenExpired()
            }
        })
    }

    const handleChangePage = (event, value) => {
        if (totalPage > 1) {
            setPage(parseInt(value));
            setPageIndex(value);
            reloadListPMGW(value);
            document.querySelector('.main-panel').scrollTop = 0;
        }
    };

    function cnfDeleteGW(id) {
        setIdDelete(id)
        setIsOpenDeletePW(true)
    }

    function deleteGW() {
        setIsOpenDeletePW(false)
        api.delete(`/api/v1/payment_managements/payment_gateways/${idDelete}`).then(res => {
            if (res.data.code === 1) {
                setIsOpenNoti(true)
                setMsgNoti("決済ゲートウェイを削除しました。")
                setTimeout(() => {

                    setIsOpenNoti(false)
                    setMsgNoti("")
                }, 1500)
                reloadListPMGW(pageIndex)
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
                            <CardHeader>決済ゲートウェイ名</CardHeader>
                            <CardBody>
                                <h6>決済ゲートウェイ一覧</h6>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }}>No.</th>
                                            <th style={{ width: "12.5%" }}>決済ゲートウェイ名</th>
                                            <th style={{ width: "12.5%" }}>決済代行会社</th>
                                            <th style={{ width: "7.5%" }}>モード</th>
                                            <th style={{ width: "12.5%" }}>ショップID/店舗公開可能鍵</th>
                                            <th style={{ width: "12.5%" }}>加盟店コード/加盟店コード</th>
                                            <th style={{ width: "7.5%" }}>クライアントIP（IPコード）</th>
                                            <th style={{ width: "7.5%" }}>店舗ID</th>
                                            <th style={{ width: "100px" }}>アクション</th>
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
                                                        <button className='payment-gatway-btn-edit'>編集</button>
                                                    </Link>
                                                    <button className='payment-gatway-btn-delete'
                                                        onClick={() => cnfDeleteGW(item?.id)}>削除</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                                <Pagination
                                    count={totalPage}
                                    variant="outlined"
                                    page={page}
                                    onChange={handleChangePage}
                                />
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <Link to={'/admin/add-payment-gateway'}>
                                        <button className='payment-gatway-btn-add-gateway'>追加</button>
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <ModalShort open={isOpenDeletePW} onClose={() => setIsOpenDeletePW(false)}>
                    <div>
                        <h4>本当に削除しますか。</h4>
                        <div className='payment-gateway-cnf-btn'>
                            <button className='payment-gateway-cnf-btn-detail-yes' onClick={() => deleteGW()}>はい</button>
                            <button className='payment-gateway-cnf-btn-detail-no' onClick={() => setIsOpenDeletePW(false)}>いいえ</button>
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