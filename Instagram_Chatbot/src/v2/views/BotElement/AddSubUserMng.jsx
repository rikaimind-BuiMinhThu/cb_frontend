import React from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/sub-user-mng.css';
import api from 'api/api-management';
import { useEffect } from 'react';
import { useState } from 'react';
import Cookies from 'js-cookie';
import ModalNoti from '../../views/Popup/ModalNoti';
import * as utils from './../../JS/validate.js'
import { tokenExpired } from 'v2/api/tokenExpired';





function AddSubUserMng() {
    const [botId, setBotId] = useState();
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    const [msgNoti, setMsgNoti] = useState('');



    useEffect(() => {
        setBotId(Cookies.get('bot_id'));
    }, [])

    function handleInvite() {
        utils.checkEmailRequired('add-email', 'errEmail', 'Email');
        if (utils.checkEmailRequired('add-email', 'errEmail', 'Email')) {
            const formAdd = document.getElementById('sub-user__add-form');
            let user = {};
            for (let i = 0; i < formAdd.length; i++) {
                user[formAdd[i].name] = formAdd[i].value
            }
            const add = { "user_chatbot": { "chatbot_id": botId, ...user } }
            api.post(`/api/v1/managements/user_chatbots`, add).then(res => {
                if (res.data.code === 1) {
                    setMsgNoti(`正常に追加されました！`);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                        setMsgNoti('');
                        setIsOpenNoti(false);
                        window.location.href = `/v2/admin/sub-user`;
                    }, 2000)
                }
                else if (res.data.code === 2) {
                    setMsgNoti(res.data.message || res.data.data);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                        setMsgNoti('');
                        setIsOpenNoti(false);
                    }, 2000)
                }
            }).catch(err => {
                console.log(err);
                if (err.response?.data.code === 0) {
                    tokenExpired()
                }
            })
        }
    }

    return (
        <>
            <div className="content">
                <Row id="screenAll">
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <div className='sub-user__title'>サブユーザー招待</div>
                            </CardHeader>
                            <CardBody>
                                <form id='sub-user__add-form'>

                                    <div className='sub-user__field-container'>
                                        <span className='sub-user__field-lable'>メールアドレス</span>
                                        <div className='sub-user__field-input'>
                                            <input id='add-email' type='text'
                                                placeholder='メールアドレスは、必ず指定してください。' name='email'
                                                style={{ border: '1px solid grey', borderRadius: '5px', padding: '5px 15px' }}
                                                onChange={() => utils.checkEmailRequired('add-email', 'errEmail', 'Email')}></input>
                                            <span id="errEmail" className='sub-user__err-format'></span>
                                        </div>
                                    </div>

                                    <div className='sub-user__field-container'>
                                        <span className='sub-user__field-lable'>権限</span>
                                        <div className='sub-user__field-input'>
                                            <select name='role'
                                                style={{ padding: '5px 15px', borderRadius: '5px', border: '1px solid grey' }}>
                                                <option value='bot_admin'>管理者</option>
                                                <option value='editor'>編集者</option>
                                                <option value='reader'>観覧者</option>
                                            </select>
                                        </div>
                                    </div>


                                </form>

                                <div className='sub-user__field-btn'>
                                    <button className='btn' onClick={() => { window.location.href = `/v2/admin/sub-user` }}>戻る</button>
                                    <button className='btn btn-primary' onClick={() => handleInvite()}>招待する</button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
                    <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
                        <span style={{ fontSize: '16px' }}>{msgNoti}</span>
                    </div>
                </ModalNoti>
            </div>
        </>
    );
}

export default AddSubUserMng;