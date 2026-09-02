// import config from "@babel/core/lib/config";
import axios from "axios";
import React from "react";
import "v2/assets/css/login.css"
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import Cookies from 'js-cookie';
import { setToken } from "v2/api/auth";
import logo from '../../assets/img/ecchatbot-logo.png'
import {EC_CHATBOT_URL, getDefaultLandingPath} from '../../variables/constants'
class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = { token: '', navigator: 'false', msgNoti: '', emailError: '', passwordError: '' };
    Cookies.remove('bot_type');

    if (!localStorage.getItem("env")) {
      localStorage.setItem("env", this.getEnvironment());
    }

    localStorage.setItem("debug", this.getDebugFlag());
  }

  getEnvironment() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.env || "production";
  }

  getDebugFlag(){
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.debug === "true";
  }

  handleLogin = (props) => {
    var nameValue = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (nameValue === "" || password === "") {
      this.setState({
        passwordError: password === "" ? "パスワードを入力してください。" : "",
        emailError: nameValue === "" ? "メールを入力してください。" : "",
        msgNoti: "",
      });
    } else {
      this.setState({ emailError: "", passwordError: "", msgNoti: "" });
      // const loginInfo = { username: nameValue, password: password };
      const loginInfo = { user: { email: nameValue, password: password } }
      axios.post(`${EC_CHATBOT_URL}/api/v1/sign_in`, loginInfo)
        .then(res => {
          this.setState({ msgNoti: "" });
          const persons = res.data;
          if (persons.code === 1 || persons.code === "1") {
            setToken(persons.token)
            Cookies.set('refreshToken', persons.refresh_token); // {path: '/'}
            Cookies.set('user_role', persons.user.role); // {path: '/'}
            Cookies.set('user_id', persons.user.id); // {path: '/'}
            Cookies.set('is_auth', 'true');
            localStorage.setItem("client", JSON.stringify(res.data.client));
            // sessionStorage.setItem("client", JSON.stringify(res.data.client));
            // Cookies.set('refreshToken', persons.refresh_token); /{path: '/v2/admin/dashboard'}
            axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
            getToDashboard(persons.user.role, res.data.client);
          } else {
            this.setState({ msgNoti: "ユーザー名またはパスワードが間違っています。" })
          }
        })
        .catch(() => {
          this.setState({ msgNoti: "ログインに失敗しました。" });
        });

      function getToDashboard(role, client) {
        window.location.href = getDefaultLandingPath(role, client)
      }
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    var nameValue = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (nameValue === "" || password === "") {
      this.setState({
        passwordError: password === "" ? "パスワードを入力してください。" : "",
        emailError: nameValue === "" ? "メールを入力してください。" : "",
        msgNoti: "",
      });
    } else {
      this.setState({ emailError: "", passwordError: "", msgNoti: "" });
      // const loginInfo = { username: nameValue, password: password };
      const loginInfo = { user: { email: nameValue, password: password } }
      axios.post(`${EC_CHATBOT_URL}/api/v1/sign_in`, loginInfo)
        .then(res => {
          this.setState({ msgNoti: "" });
          const persons = res.data;
          if (persons.code === 1 || persons.code === "1") {
            setToken(persons.token)
            Cookies.set('refreshToken', persons.refresh_token); // {path: '/'}
            Cookies.set('user_role', persons.user.role);
            Cookies.set('user_id', persons.user.id); // {path: '/'}
            Cookies.set('is_auth', 'true');
            localStorage.setItem("client", JSON.stringify(res.data.client));
            // sessionStorage.setItem("client", JSON.stringify(res.data.client));
            // Cookies.set('refreshToken', persons.refresh_token); /{path: '/v2/admin/dashboard'}
            axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
            getToDashboard(persons.user.role, res.data.client);
          } else {
            this.setState({ msgNoti: "ユーザー名またはパスワードが間違っています。" })
          }
        })
        .catch(() => {
          this.setState({ msgNoti: "ログインに失敗しました。" });
        });

      function getToDashboard(role, client) {
        window.location.href = getDefaultLandingPath(role, client)
      }
    }
  }
  render() {
    return (
      <div className="App" style={{ marginTop: "1%" }}>
        <div>
          <img src={logo} alt="react-logo" style={{ height: "45px", paddingLeft: "2%" }} />
        </div>
        <div className="auth-wrapper" >
          <div className="auth-inner">

            <div>
              <h3>ログイン</h3>
              <form onSubmit={this.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email">メールアドレス</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="メールアドレス入力"
                    id="email"
                    aria-describedby="emailMessage"
                  />
                  <span id="emailMessage" role="alert" style={{ color: 'red' }}>{this.state.emailError}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="password">パスワード</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="パスワード入力"
                    id="password"
                    aria-describedby="passwordMessage"
                  />
                  <span id="passwordMessage" role="alert" style={{ color: 'red' }}>{this.state.passwordError}</span>
                </div>
                <input type="submit" hidden value="Submit"></input>
              </form>
              <br />
              <div style={{ width: "100%", textAlign: "center" }}>
                {this.state.msgNoti && (
                  <span id="loginErrorMsg" role="alert" style={{ color: 'red' }}>{this.state.msgNoti}</span>
                )}
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

            {/* Facebook login is available via LoginFacebook when enabled */}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
