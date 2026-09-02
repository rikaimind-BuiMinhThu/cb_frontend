import axios from 'axios';
import { EC_CHATBOT_URL } from 'v2/variables/constants';
import { getRefreshToken, setToken } from './auth';
import {
  API_SUCCESS_CODE,
  AUTHORIZATION_HEADER,
  BEARER_PREFIX,
  REFRESH_TOKEN_PATH,
} from './constants';
import { tokenExpired } from './tokenExpired';

const requestNewToken = () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    tokenExpired();
    return Promise.resolve();
  }

  return axios
    .post(
      `${EC_CHATBOT_URL}${REFRESH_TOKEN_PATH}`,
      {},
      {
        headers: {
          [AUTHORIZATION_HEADER]: `${BEARER_PREFIX}${refreshToken}`,
        },
      },
    )
    .then((response) => {
      const token = response.data?.token;
      if (response.data?.code === API_SUCCESS_CODE && token) {
        setToken(token);
        return token;
      }
      tokenExpired();
      return undefined;
    })
    .catch(() => {
      tokenExpired();
    });
};

export default requestNewToken;
