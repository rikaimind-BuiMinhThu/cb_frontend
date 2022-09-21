import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav, NavbarToggler } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import logo from "./logoEC.jpg";
import Cookies from 'js-cookie'

var ps;

function Sidebar(props) {

  React.useEffect(() => {
    var cook = Cookies.get("user_role")
    if (cook == "admin_deel") {

    } else if (cook == "admin_client") {
      document.getElementById("sidebarClient").style.display = "none"
      document.getElementById("sidebarUser").style.display = "none"
      // var elem = document.getElementById('sidebarClient');
      // elem.parentNode.removeChild(elem);
    } else if (cook == "client") {
      document.getElementById("sidebarClient").style.display = "none"
      document.getElementById("sidebarUser").style.display = "none"
    }
  })

  React.useEffect(() => {
    var bot_type = Cookies.get("bot_type")
    if (bot_type == "bot") {
      console.log("botne")
      document.getElementById("sidebar_all").style.display="none"
    } else if(bot_type=="insta"){
      console.log("insta ne")
    }
  })

  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  function hide() {
    if (document.getElementById('userDropdown').style.display === "block") {
      document.getElementById('userDropdown').style.display = "none"
    } else {
      document.getElementById('userDropdown').style.display = "block"
    }
  }

  function hideInstaList() {
    if (document.getElementById('instaDropdown').style.display === "block") {
      document.getElementById('instaDropdown').style.display = "none"
    } else {
      document.getElementById('instaDropdown').style.display = "block"
    }
  }
  //botDropdown
  function hideBotList() {
    if (document.getElementById('botDropdown').style.display === "block") {
      document.getElementById('botDropdown').style.display = "none"
    } else {
      document.getElementById('botDropdown').style.display = "block"
    }
  }

  function homePage(){
    Cookies.remove('bot_type')
  }

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo" style={{ width: "100%" }} onClick={() => homePage()}>
        <a
          href="/admin/dashboard"
        >
          <img src={logo} alt="react-logo" style={{ height: "60px", paddingLeft: "10px" }} />
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          <ul id="sidebar_all">
            <li className={activeRoute('account-information') + (true ? " active-pro" : "")} key={'account-information'}>
              <NavLink to="account-information" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>アカウント情報</p>
              </NavLink>
            </li>
            <li className={activeRoute('basic-setting') + (true ? " active-pro" : "")} key={'basic-setting'}>
              <NavLink to="basic-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Basic Setting</p>
              </NavLink>
            </li>
            <li id="sidebarClient" className={activeRoute('client-management') + (true ? " active-pro" : "")} key={'client-management'}>
              <NavLink to="client-management" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>クライアント管理</p>
              </NavLink>
            </li>
            <li id="sidebarUser" className={activeRoute('user-management') + (true ? " active-pro" : "")} key={'user-management'}>
              <NavLink to="user-management" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-circle-10" style={{ color: "black" }} />
                <p style={{ color: "black" }}>ユーザー管理
                </p>
              </NavLink>
            </li>
            {/* <li className={activeRoute('instagram') + (true ? " active-pro" : "")} key={'insta'}>
              <NavLink to="instagram" onClick={hideInstaList} className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-bank" style={{ color: "black" }} />
                <p>Instagram Chatbot</p>
              </NavLink>
              <ul id="instaDropdown" style={{ display: "none", marginLeft: "-30px" }}>
                <li className={activeRoute('chatbot') + (true ? " active-pro" : "")} key={'notifications'}>
                  <NavLink to="chatbot" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-atom" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>チャットボット作成</p>
                  </NavLink>
                </li>
                <li className={activeRoute('keyword') + (true ? " active-pro" : "")} key={'keyword'}>
                  <NavLink to="keyword" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-key-25" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>キーワード設定</p>
                  </NavLink>
                </li>
                <li className={activeRoute('release') + (true ? " active-pro" : "")} key={'release'}>
                  <NavLink to="release" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-air-baloon" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>リリース</p>
                  </NavLink>
                </li>
                <li className={activeRoute('data') + (true ? " active-pro" : "")} key={'data'}>
                  <NavLink to="data" onClick={hide} className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-single-02" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>データ分析</p>
                  </NavLink>
                  <ul id="userDropdown" style={{ display: "none", marginLeft: "-30px" }}>
                    <li className={activeRoute('data-analyst') + (true ? " active-pro" : "")} key={'profile'}>
                      <NavLink to="data-analyst" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-bulb-63" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>サマリー</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('list-user') + (true ? " active-pro" : "")} key={'setting'}>
                      <NavLink to="list-user" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-bullet-list-67" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>ユーザー一覧</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('attracted-customer') + (true ? " active-pro" : "")} key={'about'}>
                      <NavLink to="attracted-customer" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>集客</p>
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className={activeRoute('crm') + (true ? " active-pro" : "")} key={'crm'}>
                  <NavLink to="crm" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-bulb-63" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>CRM</p>
                  </NavLink>
                </li>
              </ul>
            </li> */}
            <li className={activeRoute('bot') + (true ? " active-pro" : "")} key={'bot'}>
              <NavLink to="bot" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-bulb-63" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Bot List</p>
              </NavLink>
             
            </li>
            <li className={activeRoute('sub-user') + (true ? " active-pro" : "")} key={'sub-user'}>
              <NavLink to="sub-user" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Sub User Management</p>
              </NavLink>
            </li>
            <li className={activeRoute('plan-selection') + (true ? " active-pro" : "")} key={'plan-selection'}>
              <NavLink to="plan-selection" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Plan Selection</p>
              </NavLink>
            </li>
            <li className={activeRoute('plan-setting') + (true ? " active-pro" : "")} key={'plan-setting'}>
              <NavLink to="plan-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Plan Setting</p>
              </NavLink>
            </li>
            <li className={activeRoute('payment-history') + (true ? " active-pro" : "")} key={'payment-history'}>
              <NavLink to="payment-history" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Payment History</p>
              </NavLink>
            </li>
            
          </ul>
          <ul>
          <li className={activeRoute('scenario-setting') + (true ? " active-pro" : "")} key={'scenario-setting'}>
              <NavLink to="scenario-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-badge" style={{ color: "black" }} />
                <p style={{ color: "black" }}>scenario-setting</p>
              </NavLink>
            </li>
          </ul>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
