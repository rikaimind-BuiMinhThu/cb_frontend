import axios from 'axios';
import Cookies from 'js-cookie';
import { EC_CHATBOT_URL } from 'variables/constants';
import { tokenExpired } from './tokenExpired';

const service = axios.create({
  baseURL: EC_CHATBOT_URL,
  timeout: 30000,
});

service.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  const headers = config.headers || {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (headers.Authorization) {
    delete headers.Authorization;
  }
  config.headers = headers;
  return config;
});

service.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response && error.response.data && error.response.data.code;
    if (code === 0) {
      tokenExpired();
    }
    return Promise.reject(error);
  }
);

export default service;
