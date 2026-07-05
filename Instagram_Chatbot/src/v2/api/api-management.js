import axios from 'axios';
import Cookies from 'js-cookie';
import { EC_CHATBOT_URL } from 'v2/variables/constants';
var service = axios.create(
    {
        // baseURL: 'http://rikai-dev.ddns.net:8000',
        baseURL: EC_CHATBOT_URL,
        data:'',
        headers: { 'Authorization': 'Bearer ' + Cookies.get('token') }
    });

export default service