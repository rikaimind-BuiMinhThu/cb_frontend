import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Nav, NavbarToggler } from 'reactstrap';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import logo from './logoEC.jpg';
import Cookies from 'js-cookie';

var ps;

function Sidebar(props) {
  React.useEffect(() => {
    var cook = Cookies.get('user_role');
    if (cook == 'admin_deel') {
    } else if (cook == 'admin_client') {
      document.getElementById('sidebarClient').style.display = 'none';
      document.getElementById('sidebarUser').style.display = 'none';
      // var elem = document.getElementById('sidebarClient');
      // elem.parentNode.removeChild(elem);
    } else if (cook == 'client') {
      document.getElementById('sidebarClient').style.display = 'none';
      document.getElementById('sidebarUser').style.display = 'none';
    }
  });

  React.useEffect(() => {
    var bot_type = Cookies.get('bot_type');
    if (bot_type == 'bot') {
      console.log('botne');
      document.getElementById('sidebar_all').style.display = 'none';
      document.getElementById('side_bar_bot').style.display = 'block';
    } else {
      document.getElementById('sidebar_all').style.display = 'block';
      document.getElementById('side_bar_bot').style.display = 'none';
    }
  });

  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  };
  function hide() {
    if (document.getElementById('userDropdown').style.display === 'block') {
      document.getElementById('userDropdown').style.display = 'none';
    } else {
      document.getElementById('userDropdown').style.display = 'block';
    }
  }

  function hideInstaList() {
    if (document.getElementById('instaDropdown').style.display === 'block') {
      document.getElementById('instaDropdown').style.display = 'none';
    } else {
      document.getElementById('instaDropdown').style.display = 'block';
    }
  }

  function hideWebChatList() {
    if (document.getElementById('webChatDrop').style.display === 'block') {
      document.getElementById('webChatDrop').style.display = 'none';
    } else {
      document.getElementById('webChatDrop').style.display = 'block';
    }
  }
  //hideWebChatList
  function hideBotList() {
    if (document.getElementById('botDropdown').style.display === 'block') {
      document.getElementById('botDropdown').style.display = 'none';
    } else {
      document.getElementById('botDropdown').style.display = 'block';
    }
  }

  function displayBotSetting() {
    if (document.getElementById('ulBotSetting').style.display === 'block') {
      document.getElementById('ulBotSetting').style.display = 'none';
    } else {
      document.getElementById('ulBotSetting').style.display = 'block';
    }
  }

  function displayScenarioSetting() {
    if (document.getElementById('scenarioSetting').style.display === 'block') {
      document.getElementById('scenarioSetting').style.display = 'none';
    } else {
      document.getElementById('scenarioSetting').style.display = 'block';
    }
  }

  function displayDesignSetting() {
    if (document.getElementById('designSetting').style.display === 'block') {
      document.getElementById('designSetting').style.display = 'none';
    } else {
      document.getElementById('designSetting').style.display = 'block';
    }
  }

  function displayEmailSetting() {
    if (document.getElementById('emailSetting').style.display === 'block') {
      document.getElementById('emailSetting').style.display = 'none';
    } else {
      document.getElementById('emailSetting').style.display = 'block';
    }
  }

  function displayAPISetting() {
    if (document.getElementById('APISetting').style.display === 'block') {
      document.getElementById('APISetting').style.display = 'none';
    } else {
      document.getElementById('APISetting').style.display = 'block';
    }
  }

  function displayABSetting() {
    if (document.getElementById('ABSetting').style.display === 'block') {
      document.getElementById('ABSetting').style.display = 'none';
    } else {
      document.getElementById('ABSetting').style.display = 'block';
    }
  }

  function displayReportSetting() {
    if (document.getElementById('ReportSetting').style.display === 'block') {
      document.getElementById('ReportSetting').style.display = 'none';
    } else {
      document.getElementById('ReportSetting').style.display = 'block';
    }
  }

  function displayAVSetting() {
    if (document.getElementById('AVSetting').style.display === 'block') {
      document.getElementById('AVSetting').style.display = 'none';
    } else {
      document.getElementById('AVSetting').style.display = 'block';
    }
  }

  // /APISetting

  function homePage() {
    Cookies.remove('bot_type');
  }

  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div className="sidebar" data-color={props.bgColor} data-active-color={props.activeColor}>
      <div className="logo" style={{ width: '100%' }} onClick={() => homePage()}>
        <a href="/admin/dashboard">
          <img src={logo} alt="react-logo" style={{ height: '60px', paddingLeft: '10px' }} />
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          <ul id="sidebar_all">
            <li
              style={{ listStyleType: 'none', marginLeft: '-50px' }}
              className={activeRoute('instagram') + (true ? ' active-pro' : '')}
              key={'insta'}
            >
              <NavLink
                to="/admin/dashboard"
                onClick={() => hideInstaList()}
                className="nav-link"
                activeClassName="active"
                activeStyle={{ color: 'black' }}
              >
                <i className="nc-icon nc-bank" style={{ color: 'black' }} />
                <p>Instagram Chatbot</p>
              </NavLink>
              <ul id="instaDropdown" style={{ display: 'none', marginLeft: '-30px' }}>
                <li
                  className={activeRoute('chatbot') + (true ? ' active-pro' : '')}
                  key={'notifications'}
                >
                  <NavLink
                    to="/admin/chatbot"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-atom" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>チャットボット作成</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('keyword') + (true ? ' active-pro' : '')}
                  key={'keyword'}
                >
                  <NavLink
                    to="/admin/keyword"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-key-25" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>キーワード設定</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('release') + (true ? ' active-pro' : '')}
                  key={'release'}
                >
                  <NavLink
                    to="/admin/release"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-air-baloon" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>リリース</p>
                  </NavLink>
                </li>
                <li className={activeRoute('data') + (true ? ' active-pro' : '')} key={'data'}>
                  <NavLink
                    to="/admin/data"
                    onClick={hide}
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-single-02" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>データ分析</p>
                  </NavLink>
                  <ul id="userDropdown" style={{ display: 'none', marginLeft: '-30px' }}>
                    <li
                      className={activeRoute('data-analyst') + (true ? ' active-pro' : '')}
                      key={'profile'}
                    >
                      <NavLink
                        to="/admin/data-analyst"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-bulb-63" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>サマリー</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('list-user') + (true ? ' active-pro' : '')}
                      key={'setting'}
                    >
                      <NavLink
                        to="/admin/list-user"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-bullet-list-67" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>ユーザー一覧</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('attracted-customer') + (true ? ' active-pro' : '')}
                      key={'about'}
                    >
                      <NavLink
                        to="/admin/attracted-customer"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>集客</p>
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className={activeRoute('crm') + (true ? ' active-pro' : '')} key={'crm'}>
                  <NavLink
                    to="/admin/crm"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-bulb-63" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>CRM</p>
                  </NavLink>
                </li>
              </ul>
            </li>
            <li
              style={{ listStyleType: 'none', marginLeft: '-50px' }}
              className={activeRoute('account-information') + (true ? ' active-pro' : '')}
              key={'account-information'}
            >
              <NavLink
                to="/admin/dashboard"
                onClick={() => hideWebChatList()}
                className="nav-link"
                activeClassName="active"
                activeStyle={{ color: 'black' }}
              >
                <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                <p style={{ color: 'black' }}>Web Chatbot</p>
              </NavLink>
              <ul id="webChatDrop" style={{ display: 'none', marginLeft: '-30px' }}>
                <li
                  className={activeRoute('account-information') + (true ? ' active-pro' : '')}
                  key={'account-information'}
                >
                  <NavLink
                    to="/admin/account-information"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>アカウント情報</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('basic-setting') + (true ? ' active-pro' : '')}
                  key={'basic-setting'}
                >
                  <NavLink
                    to="/admin/basic-setting"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Basic Setting</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('reply-mail-management') + (true ? ' active-pro' : '')}
                  key={'reply-mail-management'}
                >
                  <NavLink
                    to="/admin/reply-mail-management"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>reply mail management</p>
                  </NavLink>
                </li>
                <li
                  id="sidebarClient"
                  className={activeRoute('client-management') + (true ? ' active-pro' : '')}
                  key={'client-management'}
                >
                  <NavLink
                    to="/admin/client-management"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>クライアント管理</p>
                  </NavLink>
                </li>
                <li
                  id="sidebarUser"
                  className={activeRoute('user-management') + (true ? ' active-pro' : '')}
                  key={'user-management'}
                >
                  <NavLink
                    to="/admin/user-management"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-circle-10" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>ユーザー管理</p>
                  </NavLink>
                </li>

                <li className={activeRoute('bot') + (true ? ' active-pro' : '')} key={'bot'}>
                  <NavLink
                    to="/admin/bot"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-bulb-63" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Bot List</p>
                  </NavLink>
                </li>
                {/* <li className={activeRoute('plan-selection') + (true ? " active-pro" : "")} key={'plan-selection'}>
                  <NavLink to="/admin/plan-selection" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Plan Selection</p>
                  </NavLink>
                </li>
                <li className={activeRoute('plan-setting') + (true ? " active-pro" : "")} key={'plan-setting'}>
                  <NavLink to="/admin/plan-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Plan Setting</p>
                  </NavLink>
                </li>
                <li className={activeRoute('payment-history') + (true ? " active-pro" : "")} key={'payment-history'}>
                  <NavLink to="/admin/payment-history" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Payment History</p>
                  </NavLink>
                </li> */}
              </ul>
            </li>
          </ul>
          <ul id="side_bar_bot">
            <li
              style={{ listStyleType: 'none', marginLeft: '-50px' }}
              className={activeRoute('bot-setting') + (true ? ' active-pro' : '')}
              key={'scenario-setting'}
            >
              <NavLink
                to="/admin/bot-setting"
                onClick={() => displayBotSetting()}
                className="nav-link"
                activeClassName="active"
                activeStyle={{ color: 'black' }}
              >
                <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                <p style={{ color: 'black' }}>Bot Setting</p>
              </NavLink>
              <ul
                id={'ulBotSetting'}
                style={{
                  listStyleType: 'none',
                  marginLeft: '-30px',
                  textDecoration: 'underline',
                  display: 'block',
                }}
              >
                <li key={'scenario-setting'}>
                  <NavLink
                    onClick={() => displayScenarioSetting()}
                    to="/admin/scenario-list"
                    className="nav-link"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Scenario Setting</p>
                  </NavLink>
                  <ul
                    id="scenarioSetting"
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={activeRoute('scenario-list') + (true ? ' active-pro' : '')}
                      key={'scenario-list'}
                    >
                      <NavLink
                        to="/admin/scenario-list"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Scenario List</p>
                      </NavLink>
                    </li>
                    {/* <li
                      className={activeRoute('media-management') + (true ? ' active-pro' : '')}
                      key={'media-management'}
                    >
                      <NavLink
                        to="/admin/media-management"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Meida Management</p>
                      </NavLink>
                    </li> */}
                  </ul>
                </li>
                {/* <li key={'media-management'}>
                  <NavLink
                    onClick={() => displayDesignSetting()}
                    to="/admin/start-button"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Design Setting</p>
                  </NavLink>
                  <ul
                    id="designSetting"
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={activeRoute('start-button') + (true ? ' active-pro' : '')}
                      key={'start-button'}
                    >
                      <NavLink
                        to="/admin/start-button"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Start Button</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('chat-body') + (true ? ' active-pro' : '')}
                      key={'chat-body'}
                    >
                      <NavLink
                        to="/admin/chat-body"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Chat Body</p>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}
                <li key={'create-email'}>
                  <NavLink
                    onClick={() => displayEmailSetting()}
                    to="/admin/create-email"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Email Setting</p>
                  </NavLink>
                  <ul
                    id="emailSetting"
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={activeRoute('create-email') + (true ? ' active-pro' : '')}
                      key={'create-email'}
                    >
                      <NavLink
                        to="/admin/create-email"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Create Email</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('list-email') + (true ? ' active-pro' : '')}
                      key={'list-email'}
                    >
                      <NavLink
                        to="/admin/list-email"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Email List</p>
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li
                  className={activeRoute('file-management') + (true ? ' active-pro' : '')}
                  key={'file-management'}
                >
                  <NavLink
                    to="/admin/file-management"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>File Management</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('sub-user') + (true ? ' active-pro' : '')}
                  key={'sub-user'}
                >
                  <NavLink
                    to="/admin/sub-user"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Sub User Management</p>
                  </NavLink>
                </li>
                {/* <li key={'api-setting'}>
                  <NavLink
                    onClick={() => displayAPISetting()}
                    to="/admin/create-email"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>API Setting</p>
                  </NavLink>
                  <ul
                    id="APISetting"
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={activeRoute('create-api') + (true ? ' active-pro' : '')}
                      key={'create-api'}
                    >
                      <NavLink
                        to="/admin/create-api"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Create API</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('api-management') + (true ? ' active-pro' : '')}
                      key={'api-management'}
                    >
                      <NavLink
                        to="/admin/api-management"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>API Management</p>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}
                <li
                  className={activeRoute('push-message') + (true ? ' active-pro' : '')}
                  key={'push-message'}
                >
                  <NavLink
                    to="/admin/push-message"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Push Message</p>
                  </NavLink>
                </li>

                {/* <li key={'ab-test'}>
                  <NavLink onClick={() => displayABSetting()} to="/admin/create-ab-test" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>AB Test</p>
                  </NavLink>
                  <ul id="ABSetting" style={{ listStyleType: "none", marginLeft: "-30px", textDecoration: "underline", display: "none" }}>
                    <li className={activeRoute('create-ab-test') + (true ? " active-pro" : "")} key={'create-ab-test'}>
                      <NavLink to="/admin/create-ab-test" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>Create AB Test</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('list-ab-test') + (true ? " active-pro" : "")} key={'list-ab-test'}>
                      <NavLink to="/admin/list-ab-test" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>List AB Test</p>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}

                <li
                  className={activeRoute('variable-management') + (true ? ' active-pro' : '')}
                  key={'variable-management'}
                >
                  <NavLink
                    to="/admin/variable-management"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Variable Management</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('installation-tag-demo') + (true ? ' active-pro' : '')}
                  key={'installation-tag-demo'}
                >
                  <NavLink
                    to="/admin/installation-tag-demo"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Installation Tag and Demo</p>
                  </NavLink>
                </li>
                {/* <li
                  className={activeRoute('conversion') + (true ? ' active-pro' : '')}
                  key={'conversion'}
                >
                  <NavLink
                    to="/admin/conversion"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Conversion</p>
                  </NavLink>
                </li> */}
                {/* <li className={activeRoute('preview') + (true ? " active-pro" : "")} key={'preview'}>
                  <NavLink to="/admin/preview" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Preview</p>
                  </NavLink>
                </li> */}

                <li key={'report'}>
                  {/* <NavLink onClick={() => displayReportSetting()} to="/admin/report" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}> */}
                  <NavLink
                    to="/admin/report"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Report</p>
                  </NavLink>
                  <ul
                    id="ReportSetting"
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={activeRoute('conversion-info') + (true ? ' active-pro' : '')}
                      key={'conversion-info'}
                    >
                      <NavLink
                        to="/admin/conversion-info"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Conversion Info</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('statistics') + (true ? ' active-pro' : '')}
                      key={'statistics'}
                    >
                      <NavLink
                        to="/admin/statistics"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>Statistics</p>
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li
                  className={activeRoute('payment-management') + (true ? ' active-pro' : '')}
                  key={'payment'}
                >
                  <NavLink
                    to="/admin/payment-management"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Payment Management</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('payment-gateway') + (true ? ' active-pro' : '')}
                  key={'payment-gateway'}
                >
                  <NavLink
                    to="/admin/payment-gateway"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Payment Gateway</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('payment') + (true ? ' active-pro' : '')}
                  key={'payment-s'}
                >
                  <NavLink
                    to="/admin/payment"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Payment Service</p>
                  </NavLink>
                </li>
                <li
                  className={activeRoute('withdrawal-prevention') + (true ? ' active-pro' : '')}
                  key={'withdrawal-prevention'}
                >
                  <NavLink
                    to="/admin/withdrawal-prevention"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>Withdrawal Prevention</p>
                  </NavLink>
                </li>

                {/* <li key={'advance-setting'}>
                <li className={activeRoute('payment-management') + (true ? " active-pro" : "")} key={'payment'}>
                  <NavLink to="/admin/payment-management" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Payment Management</p>
                  </NavLink>
                </li>

                <li key={'advance-setting'}>
                  <NavLink onClick={() => displayAVSetting()} to="/admin/basic-info" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>Advance Setting</p>
                  </NavLink>
                  <ul id="AVSetting" style={{ listStyleType: "none", marginLeft: "-30px", textDecoration: "underline", display: "none" }}>
                    <li className={activeRoute('basic-info') + (true ? " active-pro" : "")} key={'basic-info'}>
                      <NavLink to="/admin/basic-info" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>Basic Information</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('tz-lang') + (true ? " active-pro" : "")} key={'tz-lang'}>
                      <NavLink to="/admin/tz-lang" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>Timezone and Language</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('ip-address-setting') + (true ? " active-pro" : "")} key={'ip-address-setting'}>
                      <NavLink to="/admin/ip-address-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>IP Address Setting</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('withdrawal-prevention') + (true ? " active-pro" : "")} key={'withdrawal-prevention'}>
                      <NavLink to="/admin/withdrawal-prevention" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>Withdrawal Prevention</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('bot-admin') + (true ? " active-pro" : "")} key={'bot-admin'}>
                      <NavLink to="/admin/bot-admin" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>Bot Admin</p>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}
              </ul>
            </li>
          </ul>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
