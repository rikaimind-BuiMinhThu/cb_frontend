import axios from 'axios';
import Cookies from 'js-cookie';
import {
  AUTHORIZATION_HEADER,
  BEARER_PREFIX,
  COOKIE_ROOT_PATH,
  REFRESH_TOKEN_COOKIE_KEY,
  TOKEN_COOKIE_KEY,
  USER_NAME_COOKIE_KEY,
} from './constants';

const getCookieOptions = (pathname) => ({
  path: pathname || COOKIE_ROOT_PATH,
});

const applyAuthorizationHeader = (token) => {
  axios.defaults.headers.common[AUTHORIZATION_HEADER] = `${BEARER_PREFIX}${token}`;
};

export const getToken = () => Cookies.get(TOKEN_COOKIE_KEY);

export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_COOKIE_KEY);

export const setRefreshToken = (refreshToken, pathname) => Cookies.set(
  REFRESH_TOKEN_COOKIE_KEY,
  refreshToken,
  getCookieOptions(pathname),
);

export const setToken = (token, pathname) => {
  Cookies.set(TOKEN_COOKIE_KEY, token, getCookieOptions(pathname));
  applyAuthorizationHeader(token);
};

export const setUserName = (name) => Cookies.set(USER_NAME_COOKIE_KEY, name);

export const getUserName = () => Cookies.get(USER_NAME_COOKIE_KEY);

export const removeToken = () => Cookies.remove(TOKEN_COOKIE_KEY, getCookieOptions());

export const removeTokenRefresh = () => Cookies.remove(
  REFRESH_TOKEN_COOKIE_KEY,
  getCookieOptions(),
);
