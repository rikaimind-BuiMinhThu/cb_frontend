import axios from 'axios';
import Cookies from 'js-cookie';

var service = axios.create(
    {
        // baseURL: 'http://rikai-dev.ddns.net:8000',
        baseURL: 'http://ecchatbot-dev.ddns.net',
        data:'',
        headers: { 'Authorization': 'Bearer ' + Cookies.get('token') }
    });

export default service