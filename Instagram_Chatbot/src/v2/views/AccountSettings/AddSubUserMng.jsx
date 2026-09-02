import React, { useState } from 'react';
import { Input, message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import {
  API_SUCCESS_CODE,
  BOT_ID_COOKIE_KEY,
} from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminActionButton,
  AdminFormRow,
  AdminPage,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { ADMIN_PATHS } from 'v2/components/AdminShell/constants';
import { getAdminRoutePath } from 'v2/variables/constants';
import { getEmailRequiredError } from 'v2/utils/formValidate';
import {
  ADD_SUCCESS_MESSAGE,
  API_WARNING_CODE,
  EMAIL_LABEL,
  EMAIL_PLACEHOLDER,
  EMPTY_VALUE,
  INVITE_LABEL,
  REDIRECT_DELAY_MS,
  ROLE_LABEL,
  ROLE_OPTIONS,
  USER_CHATBOTS_PATH,
  ROLE_BOT_ADMIN,
} from './addSubUserConstants';
import 'v2/views/AccountSettings/styles/sub-user-mng.css';

const AddSubUserMng = () => {
  const [botId] = useState(() => Cookies.get(BOT_ID_COOKIE_KEY));
  const [email, setEmail] = useState(EMPTY_VALUE);
  const [role, setRole] = useState(ROLE_BOT_ADMIN);
  const [emailError, setEmailError] = useState(EMPTY_VALUE);

  const goToSubUserList = () => {
    window.location.href = getAdminRoutePath(ADMIN_PATHS.SUB_USER);
  };

  const handleInvite = () => {
    const nextEmailError = getEmailRequiredError(email, EMAIL_LABEL);
    setEmailError(nextEmailError);
    if (nextEmailError) return;

    const add = { user_chatbot: { chatbot_id: botId, email, role } };
    api.post(USER_CHATBOTS_PATH, add).then((res) => {
      if (res.data.code === API_SUCCESS_CODE) {
        message.success(ADD_SUCCESS_MESSAGE);
        setTimeout(goToSubUserList, REDIRECT_DELAY_MS);
        return;
      }
      if (res.data.code === API_WARNING_CODE) {
        message.warning(res.data.message || res.data.data);
      }
    }).catch((err) => {
      if (err.response?.data.code === 0) {
        tokenExpired();
      }
    });
  };

  useAdminHeaderActions(
    <>
      <AdminActionButton action="back" onClick={goToSubUserList} />
      <AdminActionButton action="create" label={INVITE_LABEL} onClick={handleInvite} />
    </>
  );

  return (
    <AdminPage>
      <div className="admin-page-body">
        <AdminFormRow label={EMAIL_LABEL} required htmlFor="add-email" error={emailError}>
          <Input
            id="add-email"
            placeholder={EMAIL_PLACEHOLDER}
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(getEmailRequiredError(e.target.value, EMAIL_LABEL));
            }}
          />
        </AdminFormRow>
        <AdminFormRow label={ROLE_LABEL} htmlFor="sub-user-role">
          <select
            className="admin-native-select"
            id="sub-user-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </AdminFormRow>
      </div>
    </AdminPage>
  );
};

export default AddSubUserMng;
