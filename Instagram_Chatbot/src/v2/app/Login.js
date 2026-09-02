import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { setRefreshToken, setToken } from 'v2/api/auth';
import {
  API_SUCCESS_CODE,
  AUTH_TRUE_VALUE,
  BOT_TYPE_COOKIE_KEY,
  IS_AUTH_COOKIE_KEY,
  SIGN_IN_PATH,
  USER_ID_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
} from 'v2/api/constants';
import {
  getDebugFlag,
  getDefaultLandingPath,
  getEnvironment,
} from 'v2/variables/constants';
import logo from '../assets/img/ecchatbot-logo.png';
import {
  CLIENT_STORAGE_KEY,
  DEBUG_STORAGE_KEY,
  EMAIL_INPUT_ID,
  EMAIL_LABEL,
  EMAIL_MESSAGE_ID,
  EMAIL_PLACEHOLDER,
  EMAIL_REQUIRED_MESSAGE,
  EMPTY_VALUE,
  ENV_STORAGE_KEY,
  LOGIN_BUTTON,
  LOGIN_ERROR_MSG_ID,
  LOGIN_FAILED_MESSAGE,
  LOGIN_INVALID_MESSAGE,
  LOGIN_TITLE,
  LOGO_ALT,
  PASSWORD_INPUT_ID,
  PASSWORD_LABEL,
  PASSWORD_MESSAGE_ID,
  PASSWORD_PLACEHOLDER,
  PASSWORD_REQUIRED_MESSAGE,
  SUBMIT_FORM_BUTTON_ID,
} from './constants';
import 'v2/assets/css/login.css';

const persistSession = (data) => {
  setToken(data.token);
  setRefreshToken(data.refresh_token);
  Cookies.set(USER_ROLE_COOKIE_KEY, data.user.role);
  Cookies.set(USER_ID_COOKIE_KEY, data.user.id);
  Cookies.set(IS_AUTH_COOKIE_KEY, AUTH_TRUE_VALUE);
  localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(data.client));
};

const Login = () => {
  const [email, setEmail] = useState(EMPTY_VALUE);
  const [password, setPassword] = useState(EMPTY_VALUE);
  const [emailError, setEmailError] = useState(EMPTY_VALUE);
  const [passwordError, setPasswordError] = useState(EMPTY_VALUE);
  const [notice, setNotice] = useState(EMPTY_VALUE);

  useEffect(() => {
    Cookies.remove(BOT_TYPE_COOKIE_KEY);
    if (!localStorage.getItem(ENV_STORAGE_KEY)) {
      localStorage.setItem(ENV_STORAGE_KEY, getEnvironment());
    }
    localStorage.setItem(DEBUG_STORAGE_KEY, getDebugFlag());
  }, []);

  const submitLogin = (event) => {
    event.preventDefault();
    const hasEmail = Boolean(email);
    const hasPassword = Boolean(password);

    if (!hasEmail || !hasPassword) {
      setEmailError(hasEmail ? EMPTY_VALUE : EMAIL_REQUIRED_MESSAGE);
      setPasswordError(hasPassword ? EMPTY_VALUE : PASSWORD_REQUIRED_MESSAGE);
      setNotice(EMPTY_VALUE);
      return;
    }

    setEmailError(EMPTY_VALUE);
    setPasswordError(EMPTY_VALUE);
    setNotice(EMPTY_VALUE);

    api
      .post(SIGN_IN_PATH, { user: { email, password } })
      .then((response) => {
        const data = response.data;
        if (Number(data.code) === API_SUCCESS_CODE) {
          persistSession(data);
          window.location.href = getDefaultLandingPath(data.user.role, data.client);
          return;
        }
        setNotice(LOGIN_INVALID_MESSAGE);
      })
      .catch(() => {
        setNotice(LOGIN_FAILED_MESSAGE);
      });
  };

  return (
    <div className="App login-page">
      <div>
        <img src={logo} alt={LOGO_ALT} className="login-logo" />
      </div>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <h3>{LOGIN_TITLE}</h3>
          <form onSubmit={submitLogin}>
            <div className="mb-3">
              <label htmlFor={EMAIL_INPUT_ID}>{EMAIL_LABEL}</label>
              <input
                type="email"
                className="form-control"
                placeholder={EMAIL_PLACEHOLDER}
                id={EMAIL_INPUT_ID}
                aria-describedby={EMAIL_MESSAGE_ID}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <span id={EMAIL_MESSAGE_ID} role="alert" className="login-error">
                {emailError}
              </span>
            </div>
            <div className="mb-3">
              <label htmlFor={PASSWORD_INPUT_ID}>{PASSWORD_LABEL}</label>
              <input
                type="password"
                className="form-control"
                placeholder={PASSWORD_PLACEHOLDER}
                id={PASSWORD_INPUT_ID}
                aria-describedby={PASSWORD_MESSAGE_ID}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <span id={PASSWORD_MESSAGE_ID} role="alert" className="login-error">
                {passwordError}
              </span>
            </div>
            <div className="login-notice">
              {notice && (
                <span id={LOGIN_ERROR_MSG_ID} role="alert" className="login-error">
                  {notice}
                </span>
              )}
            </div>
            <div className="d-grid login-submit">
              <button
                id={SUBMIT_FORM_BUTTON_ID}
                type="submit"
                className="btn btn-primary"
              >
                {LOGIN_BUTTON}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
