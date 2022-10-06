import React from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/sub-user-mng.css';



function AddSubUserMng(props) {
    return (
        <>
            <div className="content">
                <Row id="screenAll">
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <div className='sub-user__title'>sub-user invitation</div>
                            </CardHeader>
                            <CardBody>
                                <form id='sub-user__add-form'>
                                    <div className='sub-user__field-container'>
                                        <span className='sub-user__field-lable'>authority</span>
                                        <div className='sub-user__field-input'>
                                            <select name='authority' value=''>
                                                <option value='administrator'>administrator</option>
                                                <option value='general_user'>General user</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='sub-user__field-container'>
                                        <span className='sub-user__field-lable'>Full name</span>
                                        <div className='sub-user__field-input'>
                                            <input id='add-full_name' type='text' placeholder='Please enter your full name' name='full_name' defaultValue=''
                                            ></input>
                                            <span id="errAddFullname" className='sub-user__err-format'></span>
                                        </div>
                                    </div>

                                    <div className='sub-user__field-container'>
                                        <span className='sub-user__field-lable'>email address</span>
                                        <div className='sub-user__field-input'>
                                            <input id='add-email_address' type='text' placeholder='Please enter your e-mail address' name='email_address' defaultValue=''
                                            ></input>
                                            <span id="errAddEmailAddress" className='sub-user__err-format'></span>
                                        </div>
                                    </div>
                                </form>

                                <div className='sub-user__field-btn'>
                                    <button className='btn' onClick={() => { window.location.href = `/admin/sub-user` }}>Return</button>
                                    <button className='btn btn-primary'>Invite</button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default AddSubUserMng;