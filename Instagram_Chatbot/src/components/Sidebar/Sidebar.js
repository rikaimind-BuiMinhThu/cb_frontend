/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav, NavbarToggler } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import logo from "./logoEC.jpg";

var ps;

function Sidebar(props) {
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
          href="https://www.creative-tim.com"
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
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className={activeRoute('icons') + (true ? " active-pro" : "")} key={'icons'}>
              <NavLink to="icons" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-diamond" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Icons</p>
              </NavLink>
            </li>
            <li className={activeRoute('maps') + (true ? " active-pro" : "")} key={'maps'}>
              <NavLink to="maps" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-pin-3" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Maps</p>
              </NavLink>
            </li>
            <li className={activeRoute('notifications') + (true ? " active-pro" : "")} key={'notifications'}>
              <NavLink to="notifications" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-bell-55" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Notifications</p>
              </NavLink>
            </li>
            <li className={activeRoute('user-page') + (true ? " active-pro" : "")} key={'user-page'}>
              <NavLink to="user-page" onClick={hide} className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-single-02" style={{ color: "black" }} />
                <p style={{ color: "black" }}>User Profile{'>'}</p>
              </NavLink>
              <ul id="userDropdown" style={{ display: "none",marginLeft:"-30px" }}>
                <li className={activeRoute('icons') + (true ? " active-pro" : "")} key={'profile'}>
                  <NavLink to="icons" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-bulb-63" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Profile</p>
                  </NavLink>
                </li>
                <li className={activeRoute('icons') + (true ? " active-pro" : "")} key={'setting'}>
                  <NavLink to="icons" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-bullet-list-67" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Setting</p>
                  </NavLink>
                </li>
                <li className={activeRoute('icons') + (true ? " active-pro" : "")} key={'about'}>
                  <NavLink to="icons" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>About</p>
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className={activeRoute('tables') + (true ? " active-pro" : "")} key={'table-list'}>
              <NavLink to="tables" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-tile-56" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Table List</p>
              </NavLink>
            </li>
            <li className={activeRoute('typography') + (true ? " active-pro" : "")} key={'typography'}>
              <NavLink to="typography" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                <i className="nc-icon nc-caps-small" style={{ color: "black" }} />
                <p style={{ color: "black" }}>Typography</p>
              </NavLink>
            </li>
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
