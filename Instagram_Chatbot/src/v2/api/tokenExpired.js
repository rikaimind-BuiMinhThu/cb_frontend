import Cookies from 'js-cookie';
import { getSignInPath } from 'v2/variables/constants';
import { removeToken, removeTokenRefresh } from './auth';
import {
  AUTH_FALSE_VALUE,
  IS_AUTH_COOKIE_KEY,
  SESSION_COOKIE_KEYS,
} from './constants';

export const tokenExpired = () => {
  Cookies.set(IS_AUTH_COOKIE_KEY, AUTH_FALSE_VALUE);
  removeToken();
  removeTokenRefresh();
  SESSION_COOKIE_KEYS.forEach((key) => Cookies.remove(key));
  window.location.href = getSignInPath();
};
