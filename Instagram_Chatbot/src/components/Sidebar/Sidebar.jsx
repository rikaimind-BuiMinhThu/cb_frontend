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
      // var elem = document.getElementById('sidebarClient');
      // elem.parentNode.removeChild(elem);
    } else if (cook == "client") {
      document.getElementById("sidebarClient").style.display = "none"
      document.getElementById("sidebarUser").style.display = "none"
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
      <div className="logo" style={{ width: "100%" }}>
        <a
          href="/admin/dashboard"
        >
          <img src={logo} alt="react-logo" style={{ height: "60px", paddingLeft: "10px" }} />
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          <ul>
            <li className={activeRoute('dashboard') + (true ? " active-pro" : "")} key={'dashboard'}>
              <NavLink to="dashboard" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-bank" style={{ color: "black" }} />
                <p>ホーム</p>
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

            {/* <li className={activeRoute('template') + (true ? " active-pro" : "")} key={'notifications'}>
              <NavLink to="template" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-atom" style={{ color: "black" }} />
                <p style={{ color: "black" }}>チャットボット作成</p>
              </NavLink>
            </li> */}

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



            <li className={activeRoute('data-analyst') + (true ? " active-pro" : "")} key={'user-page'}>
              <NavLink to="data-analyst" onClick={hide} className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-single-02" style={{ color: "black" }} />
                <p style={{ color: "black" }}>データ分析{'>'}</p>
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
            {/* <li className={activeRoute('icons') + (true ? " active-pro" : "")} key={'icons'}>
              <NavLink to="icons" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-diamond" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Icons</p>
              </NavLink>
            </li> */}
          </ul>
          {/* {props.routes.map((prop, key) => {
            return (
              <li
                className={
                  activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-link"
                  activeClassName="active"
                  activeStyle={{ color: "black" }}
                >
                  <i className={prop.icon} style={{ color: "black" }} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })} */}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
