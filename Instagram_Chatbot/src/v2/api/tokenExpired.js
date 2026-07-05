import Cookies from 'js-cookie';
import { getAppPath } from 'v2/variables/constants';

export function tokenExpired() {
  Cookies.set('is_auth', 'false');
  Cookies.remove('token', '/');
  Cookies.remove('bot_id');
  Cookies.remove('client_id');
  Cookies.remove('user_id');
  Cookies.remove('role');
  Cookies.remove('scenario_id');
  Cookies.remove('refreshToken');

  window.location.href = getAppPath('/sign-in');
}
