import axios from 'axios';
import Cookies from 'js-cookie';

var service = axios.create(
    {
        // baseURL: 'http://rikai-dev.ddns.net:8000',
        baseURL: 'https://ec-chatbot-test.com',
        data:'',
        headers: { 'Authorization': 'Bearer ' + Cookies.get('token') }
    });

export default service