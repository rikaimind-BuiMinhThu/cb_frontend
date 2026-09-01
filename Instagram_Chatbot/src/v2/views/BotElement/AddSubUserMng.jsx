import React, { useEffect, useState } from 'react';
import './../../assets/css/sub-user-mng.css';
import api from 'api/api-management';
import Cookies from 'js-cookie';
import ModalNoti from '../../views/Popup/ModalNoti';
import * as utils from './../../JS/validate.js';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../components/AdminShell';
import { Input } from 'antd';

function AddSubUserMng() {
  const [botId, setBotId] = useState();
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
  }, []);

  function handleInvite() {
    utils.checkEmailRequired('add-email', 'errEmail', 'メールアドレス');
    if (utils.checkEmailRequired('add-email', 'errEmail', 'メールアドレス')) {
      const formAdd = document.getElementById('sub-user__add-form');
      let user = {};
      for (let i = 0; i < formAdd.length; i++) {
        user[formAdd[i].name] = formAdd[i].value;
      }
      const add = { user_chatbot: { chatbot_id: botId, ...user } };
      api.post(`/api/v1/managements/user_chatbots`, add).then((res) => {
        if (res.data.code === 1) {
          setMsgNoti(`正常に追加されました！`);
          setIsOpenNoti(true);
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
            window.location.href = `/v2/admin/sub-user`;
          }, 2000);
        } else if (res.data.code === 2) {
          setMsgNoti(res.data.message || res.data.data);
          setIsOpenNoti(true);
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
          }, 2000);
        }
      }).catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    }
  }

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = '/v2/admin/sub-user'; }}
      />
      <AdminActionButton action="create" label="招待する" onClick={handleInvite} />
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
          <form id="sub-user__add-form">
            <AdminFormRow label="メールアドレス" required htmlFor="add-email">
              <Input
                id="add-email"
                placeholder="メールアドレスは、必ず指定してください。"
                name="email"
                onChange={() => utils.checkEmailRequired('add-email', 'errEmail', 'メールアドレス')}
              />
              <span id="errEmail" className="admin-form-error" />
            </AdminFormRow>

            <AdminFormRow label="権限" htmlFor="sub-user-role">
              <select className="admin-native-select" id="sub-user-role" name="role">
                <option value="bot_admin">管理者</option>
                <option value="editor">編集者</option>
                <option value="reader">観覧者</option>
              </select>
            </AdminFormRow>
          </form>
        </div>
      </AdminPage>

      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{msgNoti}</span>
        </div>
      </ModalNoti>
    </>
  );
}

export default AddSubUserMng;
