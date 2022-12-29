import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { setToken } from "./auth";
import { EC_CHATBOT_URL } from "variables/constants";
export default function requestNewToken(pathname) {
    var header = `Authorization: Bearer ${Cookies.get('refreshToken')}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('refreshToken')}`;
    
    axios
        .post(`${EC_CHATBOT_URL}/api/v1/refresh_token`, header)
        .then(data => {
            // console.log("data ne: ", data.data.token)
            // setToken('token', data.data.access_token);
            // setToken('token', data.data.access_token, pathname);
        }).catch(error => {
            console.log(error)
        });
};

// var service1 = axios.create(
//     {
//         // baseURL: 'http://rikai-dev.ddns.net:8000',
//         baseURL: 'https://ec-chatbot-test1.com',
//         data:'',
//         headers: { 'Authorization': 'Bearer ' + Cookies.get('refreshToken') }
//     });

// export default service1