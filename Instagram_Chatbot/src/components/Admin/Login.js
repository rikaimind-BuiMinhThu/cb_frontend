// import config from "@babel/core/lib/config";
import axios from "axios";
import React from "react";
import "../../assets/css/login.css"
import "../../assets/scss/paper-dashboard.scss?v=1.3.0";
import "../../assets/demo/demo.css";
import ModalNoti from "views/Popup/ModalNoti";
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
        document.getElementById('passwordMessage').innerHTML = "Password cannot be empty"
      } else {
        document.getElementById('passwordMessage').innerHTML = ""
      }
      if (nameValue === "") {
        document.getElementById('emailMessage').innerHTML = "Email cannot be empty"
      } else {
        document.getElementById('emailMessage').innerHTML = ""
      }
    } else {
      document.getElementById('emailMessage').innerHTML = ""
      document.getElementById('passwordMessage').innerHTML = ""
      // const loginInfo = { username: nameValue, password: password };
      const loginInfo = { user: { email: nameValue, password: password } }
      axios.post(`http://ec2-107-21-168-134.compute-1.amazonaws.com/api/v1/sign_in`, loginInfo)
        .then(res => {
          const persons = res.data;
          if (persons.code === 1 || persons.code === "1") {
            setToken(persons.token)
            Cookies.set('refreshToken', persons.refresh_token); // {path: '/'}
            // Cookies.set('refreshToken', persons.refresh_token); /{path: '/admin/dashboard'}
            axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
            getToDashboard();
          }else{
            this.setState({msgNoti: "Wrong username or password"})
            this.setState({isOpenNoti: true})
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
        <ModalNoti open={this.state.isOpenNoti} onClose={() => this.setState({isOpenNoti: false})}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h6>{this.state.msgNoti}</h6>
          </div>
        </ModalNoti>
      </div>
    );
  }
}

export default Login;
