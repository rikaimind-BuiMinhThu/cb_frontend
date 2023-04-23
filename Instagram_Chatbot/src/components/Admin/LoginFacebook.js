import React, { useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Button, Card, Image } from 'react-bootstrap';
import './../../assets/css/loginFacebook.css';
import { margin } from '@mui/system';
import api from '../../api/api-management'
import Cookies from 'js-cookie';
import axios from 'axios';
import { event } from 'jquery';
import {FACEBOOK_APP_ID} from '../../variables/constants';

function LoginFacebook({ checkLogin }) {

  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState('');
  const [page, setPage] = useState([]);
  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState();
  const [urlImg, setUrlImg] = useState();
  const [username, setUsername] = useState();
  const [accessToken2, setAccessToken2] = useState()

  function logoutFB() {
    window.FB.getLoginStatus(function (response) {
      var ig_id = Cookies.get("ig_id");
      api.post(`/api/v1/logout_fb`, {ig_id: ig_id}).then(res => {
        if (res.data.code == 1) {
          setLogin(false);
          Cookies.remove("ig_id");
          Cookies.remove("page_access_token");
        }
        if (response.authResponse) {
          window.FB.logout(function (response) {   // See the onlogin handler
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      }).catch(error => {
        console.log(error)
      })
    });
  }

  function statusChangeCallback(response) {
    // console.log('statusChangeCallback');
    // console.log(response);
    if (response.status === 'connected') {
      testAPI();
    } else {

    }
  }

  function checkIsExisted() {
    // window.FB.init({
    //   appId: '1733245763691008',
    //   cookie: true,
    //   xfbml: true,
    //   version: 'v14.0'
    // });

    var page_access_token = Cookies.get("page_access_token");
    var ig_id = Cookies.get("ig_id");
    if (page_access_token == "" || page_access_token == null || page_access_token == undefined) {
      // window.FB.getLoginStatus(function (response) {
      //   statusChangeCallback(response);
      // });
      // console.log("chua login fb dau ne")
    } else {
      axios.get(`https://graph.facebook.com/v14.0/${ig_id}?fields=id,username,ig_id,name,profile_picture_url&access_token=${page_access_token}`).then(res => {
        checkLogin(true, ig_id)
        document.getElementById("btnLoginFB").style.display = "none"
        document.getElementById("listPage").style.display = "none"
        document.getElementById("profileFB").style.display = "block"
        document.getElementById("logoutFB").style.display = 'block'
        setUrlImg(res.data.profile_picture_url)
        setUsername(res.data.username)
        // window.location.reload()
      }).catch(error => {
        console.log(error)
        // if (error.response.data.code === 3) {
        //   requestNewToken(path)
        // }
      })
    }
  }

  function checkLoginState() {
    window.FB.getLoginStatus(function (response) {
      console.log(response.authResponse.accessToken)
      setAccessToken2(response.authResponse.accessToken)
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function () {
    window.FB.init({
      appId: FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v14.0'
    });

    window.FB.getLoginStatus(function (response) {
      console.log("getLoginStatus: ", response)
      statusChangeCallback(response);
    });

    var authRes = window.FB.getAuthResponse();
    //check if login successfully:       loginToFB
    // console.log("authRes: ", authRes);
  }

  function testAPI() {
    document.getElementById("loginToFB").style.display = 'none'
    document.getElementById("profileFB").style.display = 'block'
    document.getElementById("listPage").style.display = 'block'
    document.getElementById("logoutFB").style.display = 'block'
    // console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function (response) {
      setUserName(response.name)
      // document.getElementById('status').innerHTML =
      //   'Thanks for logging in, ' + response.name + '!';
    });


    var authRes = window.FB.getAuthResponse();
    window.FB.api(`${authRes.userID}/accounts?fields=id,name,picture`,
      function (resPage) {
        console.log("getPage: ", resPage)
        setPage(resPage.data)
      }
    );
    setUserID(authRes.userID)

    const responseFacebook = (response) => {
      // console.log('accessToken', response.accessToken)
      // console.log(response);
      setData(response);
      setPicture(response.picture.data.url);
      if (response.accessToken) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    }

  }



  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function selectPage(value) {
    document.getElementById("listPage").style.display = 'none'
    // checkLogin(true)
    window.FB.api(`/${value}?fields=instagram_business_account`,
      function (response) {
        console.log("instagram_business_account: ", response)
        console.log(value)
        if (response.instagram_business_account && response.id != "") {
          window.FB.api(`/${response.instagram_business_account.id}`, //this 
            function (res) {
              var ig_id = res.id;
              var ig_name = res.name;
              console.log(ig_id, ig_name)
              var fb_AuthResponse = window.FB.getAuthResponse();
              var data = { "fb_AuthResponse": fb_AuthResponse, "page_id": value, "ig_id": res.id }
              Cookies.set("ig_id", ig_id);
              Cookies.set("page_access_token", fb_AuthResponse.accessToken);
              console.log("data post insta connect", data)
              api.post(`/api/v1/instagram_connect`, data).then(res => {
                if (res.data.code == 2) {
                  alert("This account didn't link to instagram")//Didn't link to insta
                } else if (res.data.code == 1) {
                //change this to come to releases move to code = 1
                checkLogin(true, ig_id)
                window.FB.api(`/${ig_id}?fields=id,username,ig_id,name,profile_picture_url`, function(res) {
                  checkLogin(true, ig_id)
                  document.getElementById("btnLoginFB").style.display = "none"
                  document.getElementById("listPage").style.display = "none"
                  document.getElementById("profileFB").style.display = "block"
                  setUrlImg(res.profile_picture_url)
                  setUsername(res.username)
                })
                }
                
              }).catch(error => {
                console.log(error)
              })

            }
          );
        } else {
          alert("this account does not have instagram page")
        }

      }
    );

  }
  setTimeout(() => {
    if (document.getElementById("divLoginFB") != null) {
      document.getElementById("divLoginFB").onload = checkIsExisted()
    } else {
      checkIsExisted()
    }

  }, 500)

  return (

    <div id='divLoginFB' style={{ padding: "30px" }}>
      <div id="loginToFB" style={{ width: "100%", textAlign: "center", margin: "auto" }}>
        <div id='btnLoginFB'>
          <FacebookLogin
            scope="public_profile,email,instagram_basic,pages_show_list,ads_management,pages_read_engagement,pages_manage_metadata,business_management,instagram_manage_messages,instagram_manage_comments,pages_messaging"
            callback={() => checkLoginState()}>
          </FacebookLogin>
        </div>
        {/* <div id="status">
        </div> */}
      </div>
      <div id="profileFB" style={{ width: "100%", textAlign: "center", margin: "auto", display: "none" }}>
        <img style={{ width: "120px" }} src={urlImg} />
        <h4>{username}</h4>
      </div>
      <div id='listPage' style={{ display: "none" }}>
        {page != undefined ? (page.map((item, i) => (
          <div key={i} style={{ display: "flex", height: "70px", textAlign: "left", margin: "auto", padding: "10px" }}>
            <img style={{ paddingLeft: "2.5%" }} src={item.picture.data.url}></img>
            <div style={{ paddingLeft: "10px", height: "70px", width: "20%", justifyContent: "center" }}>{item.name}</div>
            <div style={{ width: "70%", textAlign: "right" }}><Button onClick={() => selectPage(item.id)}>Select</Button></div>
          </div>
        )
        )) : ""}
      </div>
      <div id='logoutFB' style={{ width: "100%", margin: "auto", textAlign: "center", display: "none" }}>
        <Button onClick={() => logoutFB()}>インスタグラムログアウト</Button>
      </div>

      {/* <Card >
        <Card.Header>
          {!login &&
            <FacebookLogin
              appId="1733245763691008"
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile,user_friends"
              callback={responseFacebook}
              icon="fa-facebook" />
          }
          {login &&
            <Image src={picture} roundedCircle />
          }
        </Card.Header>
        {login &&
          <Card.Body>
            <Card.Title>{data.name}</Card.Title>
            <Card.Text>
              {data.email}
            </Card.Text>
          </Card.Body>
        }
      </Card> */}
    </div>
  );
}

export default LoginFacebook;