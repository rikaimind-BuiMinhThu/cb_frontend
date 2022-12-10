import React from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';
import './../../assets/css/sub-user-mng.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/api-management';
import Pagination from '@material-ui/lab/Pagination';
import Cookies from 'js-cookie';
import ModalShortTem from "./../Popup/ModalShortTem";
import ModalShort from '../../views/Popup/ModalShort';
import ModalNoti from '../../views/Popup/ModalNoti';
import { tokenExpired } from 'api/tokenExpired';



function SubUserManagement() {
  const [botId, setBotId] = useState();
  const [subUsers, setSubUsers] = useState([]);
  const [detailUser, setDetailUser] = useState([]);
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
  }, [])

  useEffect(() => {
    loadData();
  }, [])

  function loadData(pageIndex) {
    api.get(`/api/v1/managements/user_chatbots?chatbot_id=${Cookies.get('bot_id')}`).then(res => {
      if (res.data.code === 1) {
        console.log(res.data.data.user_chatbots);
        setSubUsers(res.data.data.user_chatbots);
      }
    }).catch(err => {
      console.log(err);
      if (err.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }

  function openPopupDelete(user) {
    setIsOpenPopupDelete(true);
    setDetailUser(user);
  }
  function handleDelete() {
    api.delete(`/api/v1/managements/user_chatbots/${detailUser.id}`).then(res => {
      console.log(res);
      if (res.data.code === 1) {
        setIsOpenPopupDelete(false);
        setIsOpenNoti(true);
        setMsgNoti(`正常に削除されました！`);
        loadData()
        setTimeout(() => {
          setIsOpenNoti(false);
          setMsgNoti('');
        }, 2000)
      } else if (res.data.code === 2) {
        setIsOpenPopupDelete(false);
        setIsOpenNoti(true);
        setMsgNoti(res.data.message || res.data.data);
        setTimeout(() => {
          setIsOpenNoti(false);
          setMsgNoti('');
        }, 2000)

      }
    }).catch(err => {
      console.log(err);
      if (err.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }

  function openPopupEdit(user) {
    setIsOpenEdit(true);
    setDetailUser(user);
  }
  function handleEdit() {
    const formEdit = document.getElementById('sub-user__edit-form');
    let edit = {};
    for (let i = 0; i < formEdit.clientHeight; i++) {
      edit[formEdit[1].name] = formEdit[1].value;
    }

    api.patch(`/api/v1/managements/user_chatbots/${detailUser.id}`, { "user_chatbot": edit }).then(res => {
      console.log(res);
      if (res.data.code === 1) {
        setIsOpenNoti(true);
        setMsgNoti(`正常に編集されました！`);
        loadData();
        setIsOpenEdit(false);
        setTimeout(() => {
          setIsOpenNoti(false);
          setMsgNoti('');
        }, 2000)
      } else if (res.data.code === 2) {
        setIsOpenNoti(true);
        setMsgNoti(res.data.message || res.data.data);
        setIsOpenEdit(false);
        setTimeout(() => {
          setIsOpenNoti(false);
          setMsgNoti('');
        }, 2000)
      }
    }).catch(err => {
      console.log(err);
      if (err.response?.data.code === 0) {
        tokenExpired()
      }
    })
  }


  function handleChange(event, value) {
    if (totalPage > 1) {
      setPage(parseInt(value));
      setPageIndex(value);
      loadData(value);
      document.querySelector('.main-panel').scrollTop = 0;
    }
  }


  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className='sub-user__title'>サブユーザー管理</div>
                <div className='sub-user__heading'>
                  <p>利用中のプランのボットの管理者として追加されているユーザーを表示します。
                    <br />
                    EC-CHATBOTのアカウントを持たないユーザーを管理者に追加したい場合は、
右の招待ボタンからユーザーを招待してからボットの管理者を追加してください。
                  </p>
                  <div className='sub-user__heading-btn'>
                    <Link to={'/admin/add-sub-user'}>
                      <button className='btn btn-primary'>ユーザー招待</button>

                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: '10%' }}>NO.</th>
                      <th style={{ width: '20%' }}>氏名</th>
                      <th style={{ width: '20%' }}>メールアドレス</th>
                      <th style={{ width: '15%' }}>権限</th>
                      <th style={{ width: '10%' }}>アアクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subUsers.map((user, i) => (
                      <tr key={i}>
                        <td className="sub-user__border-table">{user.id}</td>
                        <td className="sub-user__border-table">{user.full_name}</td>
                        <td className="sub-user__border-table">{user.email}</td>
                        <td className="sub-user__border-table">{user.role}</td>
                        <td className="sub-user__border-table">
                          <div className="sub-user__action-wrapper">
                            <div className='sub-user__btn'>
                              <button className="sub-user__btn-edit" onClick={() => openPopupEdit(user)}>編集</button>

                            </div>
                            <div className='sub-user__btn'>
                              <button className="sub-user__btn-delete" onClick={() => openPopupDelete(user)}>削除</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChange}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ModalShortTem open={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
          <div style={{ width: "800px", color: "#51cbce" }}>
            <h4>Sub UserEdit</h4>
            <form id='sub-user__edit-form'>
              <div className='sub-user__field-container sub-user__field-container-edit'>
                <span className='sub-user__field-lable'>氏名</span>
                <div className='sub-user__field-input'>
                  <input type='text' disabled name='full_name' defaultValue={detailUser.full_name}
                  ></input>
                  <span id="errEditFullname" className='sub-user__err-format'></span>
                </div>
              </div>
              <div className='sub-user__field-container sub-user__field-container-edit'>
                <span className='sub-user__field-lable'>authority</span>
                <div className='sub-user__field-input'>
                  <select name='role' defaultValue={detailUser.role}>
                    <option value='bot_admin'>管理者</option>
                    <option value='editor'>編集者</option>
                    <option value='reader'>観覧者</option>
                  </select>
                </div>
              </div>
            </form>
            <div className='btn-edit'>
              <button className='btn btn-primary' onClick={() => handleEdit()}>編集</button>
            </div>
          </div>
        </ModalShortTem>

        <ModalShort open={isOpenPopupDelete} onClose={() => setIsOpenPopupDelete(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>本当にこのサブユーザーを削除しますか?</h4>
            <Button onClick={() => handleDelete()}>はい</Button>
            <Button onClick={() => setIsOpenPopupDelete(false)}>いいえ</Button>
          </div>
        </ModalShort>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  )
}

export default SubUserManagement