import axios from 'axios';
import Cookies from 'js-cookie';

var service = axios.create(
    {
        // baseURL: 'http://rikai-dev.ddns.net:8000',
        baseURL: 'http://ec2-107-21-168-134.compute-1.amazonaws.com',
        data:'',
        headers: { 'Authorization': 'Bearer ' + Cookies.get('token') }
    });

export default service