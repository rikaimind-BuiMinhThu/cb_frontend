import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { setToken } from "./auth";
export default function requestNewToken(pathname) {
    var header = `Authorization: Bearer ${Cookies.get('refreshToken')}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('refreshToken')}`;
    
    axios
        .post("http://ec2-107-21-168-134.compute-1.amazonaws.com/api/v1/refresh_token", header)
        .then(data => {
            setToken(data.data.access_token, pathname);
        }).catch(error => {
            console.log(error)
        });
};