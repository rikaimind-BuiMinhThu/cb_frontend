import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { setToken } from "./auth";
export default function requestNewToken(pathname) {
    var header = `Authorization: Bearer ${Cookies.get('refreshToken')}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('refreshToken')}`;
    
    axios
        .post("http://rikai-dev.ddns.net:8000/api/admin/refresh", header)
        .then(data => {
            setToken(data.data.access_token, pathname);
        }).catch(error => {
            console.log(error)
        });
};