import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Button, Card, Image } from 'react-bootstrap';
import './../../assets/css/loginFacebook.css';
import { margin } from '@mui/system';
import api from '../../api/api-management'

function LoginFacebook({checkLogin}) {

  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState('');
  const [page, setPage] = useState([]);
  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState();

  function logoutFB() {
    window.FB.logout(function (response) {   // See the onlogin handler
      window.location.reload();
    });
  }

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      testAPI();
    } else {

    }
  }

  function checkLoginState() {
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function () {
    window.FB.init({
      appId: '1733245763691008',
      cookie: true,
      xfbml: true,
      version: 'v14.0'
    });

    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });

    var authRes = window.FB.getAuthResponse();
    //check if login successfully:       loginToFB
    // console.log("authRes: ", authRes);
  }

  function testAPI() {
    document.getElementById("loginToFB").style.display='none'
    document.getElementById("profileFB").style.display='block'
    document.getElementById("listPage").style.display='block'
    document.getElementById("logoutFB").style.display='block'
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function (response) {
      setUserName(response.name)
      console.log('Successful login for: ' + response.name);
      // document.getElementById('status').innerHTML =
      //   'Thanks for logging in, ' + response.name + '!';
    });

    var authRes = window.FB.getAuthResponse();
    window.FB.api(`${authRes.userID}/accounts?fields=id,name,picture`,
      function (resPage) {
        setPage(resPage.data)
      }
    );
    setUserID(authRes.userID)

    const responseFacebook = (response) => {
      console.log('accessToken', response.accessToken)
      console.log(response);
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
    document.getElementById("listPage").style.display='none'
    checkLogin(true)
    window.FB.api(`/${value}?fields=instagram_business_account`,
      function (response) {
        // alert(response.id)
        window.FB.api(`/${response.id}`,
          function (res) {
            console.log("res ne ne ne ne ne: ", res)
            var ig_id = res.id;
            // var ig_username = res.username;
            var ig_name = res.name;
            // var ig_profile_picture_url = res.profile_picture_url;
            console.log(ig_id, ig_name)
            var fb_AuthResponse = window.FB.getAuthResponse();
            var data = { "fb_AuthResponse": fb_AuthResponse, "page_id": value, "ig_id": res.id }
            api.post(`/api/v1/instagram_connect`, data).then(res => {
              console.log(res)
            }).catch(error => {
              console.log(error)
              // if (error.response.data.code === 3) {
              //   requestNewToken(path)
              // }
            })
          }
        );
      }
    );
  }

  return (

    <div style={{ padding: "30px" }}>
      <div id="loginToFB" style={{ width: "100%", textAlign: "center", margin: "auto" }}>
        <FacebookLogin
          scope="public_profile,email"
          callback={() => checkLoginState()}>
        </FacebookLogin>
        {/* <div id="status">
        </div> */}
      </div>
      <div id="profileFB" style={{width:"100%", textAlign:"center", margin:"auto", display:"none"}}>
        <img src={`https://graph.facebook.com/${userID}/picture?type=large`} /> {/**103192899082863 */}
        <h4>{userName}</h4>
      </div>
      <div id='listPage' style={{display:"none"}}>
        {page.map((item, i) => (
          <div key={i} style={{ display: "flex", height: "70px", textAlign: "left", margin: "auto", padding: "10px" }}>
            <img style={{ paddingLeft: "2.5%" }} src={item.picture.data.url}></img>
            <div style={{ paddingLeft: "10px", height: "70px", width: "20%", justifyContent: "center" }}>{item.name}</div>
            <div style={{ width: "70%", textAlign: "right" }}><Button onClick={() => selectPage(item.id)}>選択</Button></div>
          </div>

        ))}
      </div>
      <div id='logoutFB' style={{ width: "100%", margin: "auto", textAlign: "center", display:"none"}}>
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