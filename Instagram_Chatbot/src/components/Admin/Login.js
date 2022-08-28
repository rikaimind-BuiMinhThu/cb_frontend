// import config from "@babel/core/lib/config";
import axios from "axios";
import React from "react";
import "../../assets/css/login.css"
import "../../assets/scss/paper-dashboard.scss?v=1.3.0";
import "../../assets/demo/demo.css";
import ModalNotiFail from "views/Popup/ModalNotiFail";
import Cookies from 'js-cookie';
import { setToken } from "api/auth";
import logo from '../../assets/img/logoEC.jpg'
import LoginFacebook from "./LoginFacebook";
class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = { token: '', navigator: 'false', msgNoti: '', isOpenNoti: false }
  }

  handleLogin = (props) => {
    var nameValue = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };

    if (nameValue === "" || password === "") {
      if (password === "") {
        document.getElementById('passwordMessage').innerHTML = "パスワードを入力してください。"
      } else {
        document.getElementById('passwordMessage').innerHTML = ""
      }
      if (nameValue === "") {
        document.getElementById('emailMessage').innerHTML = "メールを入力してください。"
      } else {
        document.getElementById('emailMessage').innerHTML = ""
      }
    } else {
      document.getElementById('emailMessage').innerHTML = ""
      document.getElementById('passwordMessage').innerHTML = ""
      // const loginInfo = { username: nameValue, password: password };
      const loginInfo = { user: { email: nameValue, password: password } }
      axios.post(`https://ec-chatbot-test1.com/api/v1/sign_in`, loginInfo)
        .then(res => {
          document.getElementById("loginErrorMsg").style.display= "none"
          const persons = res.data;
          if (persons.code === 1 || persons.code === "1") {
            setToken(persons.token)
            Cookies.set('refreshToken', persons.refresh_token); // {path: '/'}
            Cookies.set('user_role', persons.user.role); // {path: '/'}
            Cookies.set('is_auth', 'true');
            // Cookies.set('refreshToken', persons.refresh_token); /{path: '/admin/dashboard'}
            axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
            getToDashboard();
          } else {
            this.setState({ msgNoti: "ユーザー名またはパスワードが間違っています。" })
            document.getElementById("loginErrorMsg").style.display= "block"
            // this.setState({ isOpenNoti: true })
          }
        })
        .catch(error => alert(error));

      function getToDashboard() {
        window.location.href = '/admin/dashboard'
      }
    }
  }

  handleSubmit = (event) =>{
    event.preventDefault()
    var nameValue = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };

    if (nameValue === "" || password === "") {
      if (password === "") {
        document.getElementById('passwordMessage').innerHTML = "パスワードを入力してください。"
      } else {
        document.getElementById('passwordMessage').innerHTML = ""
      }
      if (nameValue === "") {
        document.getElementById('emailMessage').innerHTML = "メールを入力してください。"
      } else {
        document.getElementById('emailMessage').innerHTML = ""
      }
    } else {
      document.getElementById('emailMessage').innerHTML = ""
      document.getElementById('passwordMessage').innerHTML = ""
      // const loginInfo = { username: nameValue, password: password };
      const loginInfo = { user: { email: nameValue, password: password } }
      axios.post(`https://ec-chatbot-test1.com/api/v1/sign_in`, loginInfo)
        .then(res => {
          document.getElementById("loginErrorMsg").style.display= "none"
          console.log(res)
          const persons = res.data;
          if (persons.code === 1 || persons.code === "1") {
            setToken(persons.token)
            Cookies.set('refreshToken', persons.refresh_token); // {path: '/'}
            Cookies.set('user_role', persons.user.role);
            Cookies.set('is_auth', 'true');
            // Cookies.set('refreshToken', persons.refresh_token); /{path: '/admin/dashboard'}
            axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
            getToDashboard();
          } else {
            this.setState({ msgNoti: "ユーザー名またはパスワードが間違っています。" })
            document.getElementById("loginErrorMsg").style.display= "block"
            // this.setState({ isOpenNoti: true })
          }
        })
        .catch(error => alert(error));

      function getToDashboard() {
        window.location.href = '/admin/dashboard'
      }
    }
  }
  render() {
    return (
      <div className="App" style={{ marginTop: "1%" }}>
        <div>
          <img src={logo} alt="react-logo" style={{ height: "60px", paddingLeft: "2%" }} />
        </div>
        <div className="auth-wrapper" >
          <div className="auth-inner">

            <div>
              <h3>ログイン</h3>
              <form onSubmit={this.handleSubmit}>
                <div className="mb-3">
                  <label>メールアドレス</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="メールアドレス入力"
                    id="email"
                  />
                  <span id="emailMessage" style={{ color: 'red' }}></span>
                </div>
                <div className="mb-3">
                  <label>パスワード</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="パスワード入力"
                    id="password"
                  />
                  <span id="passwordMessage" style={{ color: 'red' }}></span>
                </div>
                <input type="submit" hidden value="Submit"></input>
              </form>
                <br />
                <div style={{width:"100%", textAlign:"center"}}><span id="loginErrorMsg" style={{ color: 'red', display:"none" }}>{this.state.msgNoti}</span></div>
              <div style={{ textAlign: "center" }} className="d-grid">
                <button
                  onClick={this.handleLogin}
                  id="submitForm"
                  type="submit"
                  className="btn btn-primary"
                >
                  ログイン
                </button>
              </div>
            </div>

            {/* <LoginFacebook></LoginFacebook> */}
          </div>
        </div>
        <ModalNotiFail open={this.state.isOpenNoti} onClose={() => this.setState({ isOpenNoti: false })}>
          <div style={{ width: "300px", textAlign: "center", color: "red" }}>
            <span style={{ fontSize: "16px" }}>{this.state.msgNoti}</span>
          </div>
        </ModalNotiFail>
      </div>
    );
  }
}

export default Login;
