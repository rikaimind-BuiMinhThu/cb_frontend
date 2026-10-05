import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';
import { Button } from 'react-bootstrap';
import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import {
  API_SUCCESS_CODE,
  IG_ID_COOKIE_KEY,
  INSTAGRAM_CONNECT_PATH,
  INSTAGRAM_NOT_LINKED_CODE,
  LOGOUT_FB_PATH,
  PAGE_ACCESS_TOKEN_COOKIE_KEY,
} from 'v2/api/constants';
import { FACEBOOK_APP_ID, META_GRAPH_API_VERSION } from 'v2/variables/constants';
import {
  EMPTY_VALUE,
  FACEBOOK_ACTION_FAILED_MESSAGE,
  FACEBOOK_CONNECTED_STATUS,
  FACEBOOK_GRAPH_BASE_URL,
  FACEBOOK_LOGIN_SCOPE,
  FACEBOOK_ME_PATH,
  FACEBOOK_PAGE_FIELDS,
  FACEBOOK_SDK_SCRIPT_ID,
  FACEBOOK_SDK_URL,
  INSTAGRAM_BUSINESS_ACCOUNT_FIELDS,
  INSTAGRAM_LOGOUT_BUTTON,
  INSTAGRAM_NO_PAGE_MESSAGE,
  INSTAGRAM_NOT_LINKED_MESSAGE,
  INSTAGRAM_PROFILE_FIELDS,
  SCRIPT_ELEMENT,
  SELECT_PAGE_BUTTON,
  SESSION_CHECK_DELAY_MS,
} from './constants';
import 'v2/assets/css/loginFacebook.css';

const loadFacebookSdk = () => {
  if (window.FB) {
    return;
  }
  const script = document.createElement(SCRIPT_ELEMENT);
  script.id = FACEBOOK_SDK_SCRIPT_ID;
  script.src = FACEBOOK_SDK_URL;
  script.async = true;
  document.body.appendChild(script);
};

const getInstagramProfileUrl = (igId, accessToken) =>
  `${FACEBOOK_GRAPH_BASE_URL}/${META_GRAPH_API_VERSION}/${igId}?fields=${INSTAGRAM_PROFILE_FIELDS}&access_token=${accessToken}`;

const LoginFacebook = ({ checkLogin }) => {
  const [pages, setPages] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState();
  const [username, setUsername] = useState();
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showPageList, setShowPageList] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const applyProfile = (profile) => {
      setShowLoginButton(false);
      setShowPageList(false);
      setShowProfile(true);
      setShowLogout(true);
      setProfileImageUrl(profile.profile_picture_url);
      setUsername(profile.username);
    };

    const restoreConnectedSession = () => {
      const pageAccessToken = Cookies.get(PAGE_ACCESS_TOKEN_COOKIE_KEY);
      const igId = Cookies.get(IG_ID_COOKIE_KEY);
      if (!pageAccessToken || !igId) {
        return;
      }
      axios
        .get(getInstagramProfileUrl(igId, pageAccessToken))
        .then((response) => {
          checkLogin(true, igId);
          applyProfile(response.data);
        })
        .catch(() => undefined);
    };

    const loadFacebookPages = () => {
      const authResponse = window.FB.getAuthResponse();
      setShowLoginButton(false);
      setShowProfile(true);
      setShowPageList(true);
      setShowLogout(true);
      window.FB.api(FACEBOOK_ME_PATH, (response) => {
        setUsername(response.name);
      });
      window.FB.api(
        `${authResponse.userID}/accounts?fields=${FACEBOOK_PAGE_FIELDS}`,
        (pageResponse) => {
          setPages(pageResponse.data || []);
        },
      );
    };

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: META_GRAPH_API_VERSION,
      });
      window.FB.getLoginStatus((response) => {
        if (response.status === FACEBOOK_CONNECTED_STATUS) {
          loadFacebookPages();
        }
      });
    };

    loadFacebookSdk();
    const timer = window.setTimeout(restoreConnectedSession, SESSION_CHECK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [checkLogin]);

  const logoutFacebook = () => {
    window.FB.getLoginStatus((statusResponse) => {
      const igId = Cookies.get(IG_ID_COOKIE_KEY);
      api
        .post(LOGOUT_FB_PATH, { ig_id: igId })
        .then((response) => {
          if (Number(response.data.code) === API_SUCCESS_CODE) {
            Cookies.remove(IG_ID_COOKIE_KEY);
            Cookies.remove(PAGE_ACCESS_TOKEN_COOKIE_KEY);
            setShowLoginButton(true);
            setShowProfile(false);
            setShowPageList(false);
            setShowLogout(false);
          }
          if (statusResponse.authResponse) {
            window.FB.logout(() => {
              window.location.reload();
            });
            return;
          }
          window.location.reload();
        })
        .catch(() => {
          message.error(FACEBOOK_ACTION_FAILED_MESSAGE);
        });
    });
  };

  const checkLoginState = () => {
    window.FB.getLoginStatus((response) => {
      if (response.status === FACEBOOK_CONNECTED_STATUS) {
        const authResponse = window.FB.getAuthResponse();
        setShowLoginButton(false);
        setShowProfile(true);
        setShowPageList(true);
        setShowLogout(true);
        window.FB.api(FACEBOOK_ME_PATH, (profileResponse) => {
          setUsername(profileResponse.name);
        });
        window.FB.api(
          `${authResponse.userID}/accounts?fields=${FACEBOOK_PAGE_FIELDS}`,
          (pageResponse) => {
            setPages(pageResponse.data || []);
          },
        );
      }
    });
  };

  const selectPage = (pageId) => {
    setShowPageList(false);
    window.FB.api(
      `/${pageId}?fields=${INSTAGRAM_BUSINESS_ACCOUNT_FIELDS}`,
      (response) => {
        if (!response.instagram_business_account || response.id === EMPTY_VALUE) {
          message.error(INSTAGRAM_NO_PAGE_MESSAGE);
          return;
        }
        window.FB.api(
          `/${response.instagram_business_account.id}`,
          (instagramAccount) => {
            const igId = instagramAccount.id;
            const facebookAuthResponse = window.FB.getAuthResponse();
            Cookies.set(IG_ID_COOKIE_KEY, igId);
            Cookies.set(
              PAGE_ACCESS_TOKEN_COOKIE_KEY,
              facebookAuthResponse.accessToken,
            );
            api
              .post(INSTAGRAM_CONNECT_PATH, {
                fb_AuthResponse: facebookAuthResponse,
                page_id: pageId,
                ig_id: igId,
              })
              .then((connectResponse) => {
                if (Number(connectResponse.data.code) === INSTAGRAM_NOT_LINKED_CODE) {
                  message.error(INSTAGRAM_NOT_LINKED_MESSAGE);
                  return;
                }
                if (Number(connectResponse.data.code) !== API_SUCCESS_CODE) {
                  return;
                }
                checkLogin(true, igId);
                window.FB.api(
                  `/${igId}?fields=${INSTAGRAM_PROFILE_FIELDS}`,
                  (profile) => {
                    checkLogin(true, igId);
                    setShowLoginButton(false);
                    setShowPageList(false);
                    setShowProfile(true);
                    setProfileImageUrl(profile.profile_picture_url);
                    setUsername(profile.username);
                  },
                );
              })
              .catch(() => {
                message.error(FACEBOOK_ACTION_FAILED_MESSAGE);
              });
          },
        );
      },
    );
  };

  return (
    <div className="login-facebook">
      {showLoginButton && (
        <div className="login-facebook-section">
          <FacebookLogin
            scope={FACEBOOK_LOGIN_SCOPE}
            callback={() => checkLoginState()}
          />
        </div>
      )}
      {showProfile && (
        <div className="login-facebook-section">
          <img
            className="login-facebook-avatar"
            src={profileImageUrl}
            alt={username || EMPTY_VALUE}
          />
          <h4>{username}</h4>
        </div>
      )}
      {showPageList && (
        <div>
          {pages.map((item) => (
            <div key={item.id} className="login-facebook-page">
              <img
                className="login-facebook-page-image"
                src={item.picture.data.url}
                alt={item.name || EMPTY_VALUE}
              />
              <div className="login-facebook-page-name">{item.name}</div>
              <div className="login-facebook-page-action">
                <Button onClick={() => selectPage(item.id)}>{SELECT_PAGE_BUTTON}</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showLogout && (
        <div className="login-facebook-section login-facebook-logout">
          <Button onClick={() => logoutFacebook()}>{INSTAGRAM_LOGOUT_BUTTON}</Button>
        </div>
      )}
    </div>
  );
};

LoginFacebook.propTypes = {
  checkLogin: PropTypes.func.isRequired,
};

export default LoginFacebook;
