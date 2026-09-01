import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Nav, NavbarToggler } from 'reactstrap';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import logo from './ecchatbot-logo.png';
import Cookies from 'js-cookie';
import { MDBIcon } from 'mdbreact';

var ps;

function Sidebar(props) {
  const [botId, setBotId] = useState();

  useEffect(() => {
    const botId = Cookies.get('bot_id');
    setBotId(botId);
  }, []);

  React.useEffect(() => {
    var cook = Cookies.get('user_role');
    if (cook == 'admin_deel') {
      document.getElementById('clientPaymentDetail').style.display = 'none';
    } else if (cook == 'admin_client') {
      document.getElementById('sidebarClient').style.display = 'none';
      document.getElementById('sidebarUser').style.display = 'none';
      document.getElementById('planManagement').style.display = 'none';
      // var elem = document.getElementById('sidebarClient');
      // elem.parentNode.removeChild(elem);
    } else if (cook == 'client') {
      document.getElementById('sidebarClient').style.display = 'none';
      document.getElementById('sidebarUser').style.display = 'none';
      document.getElementById('planManagement').style.display = 'none';
      document.getElementById('clientPaymentDetail').style.display = 'none';
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
  // const client = JSON.parse(sessionStorage.getItem('client'));
  const client = JSON.parse(localStorage.getItem('client'));
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

  function displaySMSSetting() {
    if (document.getElementById('smsSetting').style.display === 'block') {
      document.getElementById('smsSetting').style.display = 'none';
    } else {
      document.getElementById('smsSetting').style.display = 'block';
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
    <div
      className='sidebar'
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div
        className='logo'
        style={{ width: '100%' }}
        onClick={() => homePage()}
      >
        <a href='/v2/admin/dashboard'>
          <img
            src={logo}
            alt='react-logo'
            style={{ height: '60px', paddingLeft: '10px' }}
          />
        </a>
      </div>
      <div className='sidebar-wrapper' ref={sidebar}>
        <Nav>
          <ul id='sidebar_all'>
            {client?.is_instagram ? (
              <li
                style={{ listStyleType: 'none', marginLeft: '-50px' }}
                className={activeRoute('instagram') + (true ? ' active-pro' : '')}
                key={'insta'}
              >
                <NavLink
                  to='/v2/admin/dashboard'
                  onClick={() => hideInstaList()}
                  className='nav-link'
                  activeClassName='active'
                  activeStyle={{ color: 'black' }}
                >
                  {/* <i className="nc-icon nc-bank" style={{ color: 'black' }} /> */}
                  {/* <MDBIcon fab icon="instagram" style={{ color: "black" }} /> */}
                  <i
                    className='fab fa-instagram'
                    style={{ color: 'black', fontWeight: '800' }}
                  ></i>
                  <p>Instagramチャットボット</p>
                </NavLink>
                <ul
                  id='instaDropdown'
                  style={{ display: 'none', marginLeft: '-30px' }}
                >
                  <li
                    className={
                      activeRoute('chatbot') + (true ? ' active-pro' : '')
                    }
                    key={'notifications'}
                  >
                    <NavLink
                      to='/v2/admin/chatbot'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-atom" style={{ color: 'black' }} /> */}
                      <i className='fas fa-atom' style={{ color: 'black' }}></i>
                      <p style={{ color: 'black' }}>チャットボット作成</p>
                    </NavLink>
                  </li>
                  <li
                    className={
                      activeRoute('keyword') + (true ? ' active-pro' : '')
                    }
                    key={'keyword'}
                  >
                    <NavLink
                      to='/v2/admin/keyword'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-key-25" style={{ color: 'black' }} /> */}
                      <i className='fas fa-key' style={{ color: 'black' }}></i>
                      <p style={{ color: 'black' }}>キーワード設定</p>
                    </NavLink>
                  </li>
                  <li
                    className={
                      activeRoute('release') + (true ? ' active-pro' : '')
                    }
                    key={'release'}
                  >
                    <NavLink
                      to='/v2/admin/release'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-air-baloon" style={{ color: 'black' }} /> */}
                      <i className='fab fa-fly' style={{ color: 'black' }}></i>
                      <p style={{ color: 'black' }}>リリース</p>
                    </NavLink>
                  </li>
                  <li
                    className={activeRoute('data') + (true ? ' active-pro' : '')}
                    key={'data'}
                  >
                    <NavLink
                      to='/v2/admin/data-analyst'
                      onClick={hide}
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-single-02" style={{ color: 'black' }} /> */}
                      <MDBIcon fas icon='chart-pie' style={{ color: 'black' }} />
                      <p style={{ color: 'black' }}>データ分析</p>
                    </NavLink>
                    <ul
                      id='userDropdown'
                      style={{ display: 'none', marginLeft: '-30px' }}
                    >
                      <li
                        className={
                          activeRoute('data-analyst') +
                          (true ? ' active-pro' : '')
                        }
                        key={'profile'}
                      >
                        <NavLink
                          to='/v2/admin/data-analyst'
                          className='nav-link'
                          activeClassName='active'
                          activeStyle={{ color: 'black' }}
                        >
                          <i
                            className='nc-icon nc-bulb-63'
                            style={{ color: 'black', fontWeight: '800' }}
                          />
                          <p style={{ color: 'black' }}>サマリー</p>
                        </NavLink>
                      </li>
                      <li
                        className={
                          activeRoute('list-user') + (true ? ' active-pro' : '')
                        }
                        key={'setting'}
                      >
                        <NavLink
                          to='/v2/admin/list-user'
                          className='nav-link'
                          activeClassName='active'
                          activeStyle={{ color: 'black' }}
                        >
                          <i
                            className='nc-icon nc-bullet-list-67'
                            style={{ color: 'black', fontWeight: '800' }}
                          />
                          <p style={{ color: 'black' }}>ユーザー一覧</p>
                        </NavLink>
                      </li>
                      <li
                        className={
                          activeRoute('attracted-customer') +
                          (true ? ' active-pro' : '')
                        }
                        key={'about'}
                      >
                        <NavLink
                          to='/v2/admin/attracted-customer'
                          className='nav-link'
                          activeClassName='active'
                          activeStyle={{ color: 'black' }}
                        >
                          {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                          <MDBIcon
                            fas
                            icon='user-check'
                            style={{ color: 'black' }}
                          />
                          <p style={{ color: 'black' }}>集客</p>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li
                    className={activeRoute('crm') + (true ? ' active-pro' : '')}
                    key={'crm'}
                  >
                    <NavLink
                      to='/v2/admin/crm'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-bulb-63" style={{ color: 'black' }} /> */}
                      {/* <i class="fas fa-chalkboard-teacher"></i> */}
                      <MDBIcon
                        fas
                        icon='chalkboard-teacher'
                        style={{ color: 'black' }}
                      />
                      <p style={{ color: 'black' }}>CRM</p>
                    </NavLink>
                  </li>
                </ul>
              </li>) : ('')}
            {client?.is_web ? (
              <li
                style={{ listStyleType: 'none', marginLeft: '-50px' }}
                className={
                  activeRoute('account-information') + (true ? ' active-pro' : '')
                }
                key={'account-information'}
              >
                <NavLink
                  to='/v2/admin/bot'
                  onClick={() => hideWebChatList()}
                  className='nav-link'
                  activeClassName='active'
                  activeStyle={{ color: 'black' }}
                >
                  {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                  <MDBIcon fas icon='cogs' style={{ color: 'black' }} />
                  <p style={{ color: 'black' }}>Webチャットボット</p>
                </NavLink>
                <ul
                  id='webChatDrop'
                  style={{ display: 'none', marginLeft: '-30px' }}
                >
                  {/* <li
                    className={
                      activeRoute('account-information') +
                      (true ? ' active-pro' : '')
                    }
                    key={'account-information'}
                  >
                    <NavLink
                      to='/v2/admin/account-information'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      // <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                      <MDBIcon
                        fas
                        icon='address-book'
                        style={{ color: 'black' }}
                      />
                      <p style={{ color: 'black' }}>アカウント情報</p>
                    </NavLink>
                  </li> */}
                  <li
                    className={
                      activeRoute('basic-setting') + (true ? ' active-pro' : '')
                    }
                    key={'basic-setting'}
                  >
                    <NavLink
                      to='/v2/admin/basic-setting'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                      <MDBIcon fas icon='briefcase' style={{ color: 'black' }} />
                      <p style={{ color: 'black' }}>基本設定</p>
                    </NavLink>
                  </li>
                  <li
                    className={
                      activeRoute('reply-mail-management') +
                      (true ? ' active-pro' : '')
                    }
                    key={'reply-mail-management'}
                  >
                    <NavLink
                      to='/v2/admin/reply-mail-management'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                      <MDBIcon fas icon='envelope' style={{ color: 'black' }} />
                      <p style={{ color: 'black' }}>送信メール管理</p>
                    </NavLink>
                  </li>
                  <li
                    className={activeRoute('bot') + (true ? ' active-pro' : '')}
                    key={'bot'}
                  >
                    <NavLink
                      to='/v2/admin/bot'
                      className='nav-link'
                      activeClassName='active'
                      activeStyle={{ color: 'black' }}
                    >
                      {/* <i className="nc-icon nc-bulb-63" style={{ color: 'black' }} /> */}
                      <MDBIcon fas icon='list' style={{ color: 'black' }} />

                      <p style={{ color: 'black' }}>ボット一覧</p>
                    </NavLink>
                  </li>
                  {/* <li className={activeRoute('plan-selection') + (true ? " active-pro" : "")} key={'plan-selection'}>
                    <NavLink to="/v2/admin/plan-selection" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                      <i className="nc-icon nc-badge" style={{ color: "black" }} />
                      <p style={{ color: "black" }}>プラン選択</p>
                    </NavLink>
                  </li>
                  <li className={activeRoute('plan-setting') + (true ? " active-pro" : "")} key={'plan-setting'}>
                    <NavLink to="/v2/admin/plan-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                      <i className="nc-icon nc-badge" style={{ color: "black" }} />
                      <p style={{ color: "black" }}>プラン設定</p>
                    </NavLink>
                  </li>
                  <li className={activeRoute('payment-history') + (true ? " active-pro" : "")} key={'payment-history'}>
                    <NavLink to="/v2/admin/payment-history" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                      <i className="nc-icon nc-badge" style={{ color: "black" }} />
                      <p style={{ color: "black" }}>支払い履歴</p>
                    </NavLink>
                  </li> */}
                </ul>
              </li>) : ('')}
              <li
                style={{ listStyleType: 'none', marginLeft: '-50px' }}
                id='sidebarClient'
                className={
                  activeRoute('client-management') + (true ? ' active-pro' : '')
                }
                key={'client-management'}
              >
                <NavLink
                  to='/v2/admin/client-management'
                  className='nav-link'
                  activeClassName='active'
                  activeStyle={{ color: 'black' }}
                >
                  {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                  <MDBIcon fas icon='user-tie' style={{ color: 'black' }} />
                  <p style={{ color: 'black' }}>クライアント管理</p>
                </NavLink>
              </li>
              <li
                style={{ listStyleType: 'none', marginLeft: '-50px' }}
                id='sidebarUser'
                className={
                  activeRoute('user-management') + (true ? ' active-pro' : '')
                }
                key={'user-management'}
              >
                <NavLink
                  to='/v2/admin/user-management'
                  className='nav-link'
                  activeClassName='active'
                  activeStyle={{ color: 'black' }}
                >
                  {/* <i className="nc-icon nc-circle-10" style={{ color: 'black' }} /> */}
                  <MDBIcon fas icon='user' style={{ color: 'black' }} />
                  <p style={{ color: 'black' }}>ユーザー管理</p>
                </NavLink>
            </li>
            <li
              id='planManagement'
              style={{ listStyleType: 'none', marginLeft: '-50px' }}
              className={activeRoute('plan-management') + (true ? ' active-pro' : '')}
              key={'plan-management'}
            >
              <NavLink
                to="/v2/admin/plan-management"
                className="nav-link"
                activeClassName="active"
                activeStyle={{ color: 'black' }}
              >
                <MDBIcon fas icon="cogs" style={{ color: "black" }} />
                <p style={{ color: 'black' }}>プラン管理</p>
              </NavLink>
            </li>
            <li
              id='clientPaymentDetail'
              style={{ listStyleType: 'none', marginLeft: '-50px', display: "none" }}
              className={activeRoute('client-payment-detail') + (true ? ' active-pro' : '')}
              key={'client-payment-detail'}
            >
              <NavLink
                to="/v2/admin/client-payment-detail"
                className="nav-link"
                activeClassName="active"
                activeStyle={{ color: 'black' }}
              >
                <MDBIcon fas icon="money-check-alt" style={{color: 'black'}} />
                <p style={{ color: 'black' }}>支払い履歴</p>
              </NavLink>
            </li>
          </ul>
          <ul id='side_bar_bot'>
            <li
              style={{ listStyleType: 'none', marginLeft: '-50px' }}
              className={
                activeRoute('bot-setting') + (true ? ' active-pro' : '')
              }
              key={'scenario-setting'}
            >
              <NavLink
                to='/v2/admin/bot-setting'
                onClick={() => displayBotSetting()}
                className='nav-link'
                activeClassName='active'
                activeStyle={{ color: 'black' }}
              >
                {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                <MDBIcon fas icon='user-cog' style={{ color: 'black' }} />
                <p style={{ color: 'black' }}>ボット設定</p>
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
                    to='/v2/admin/scenario-list'
                    className='nav-link'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='swatchbook' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>シナリオ設定</p>
                  </NavLink>
                  <ul
                    id='scenarioSetting'
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={
                        activeRoute('scenario-list') +
                        (true ? ' active-pro' : '')
                      }
                      key={'scenario-list'}
                    >
                      <NavLink
                        to='/v2/admin/scenario-list'
                        className='nav-link'
                        activeClassName='active'
                        activeStyle={{ color: 'black' }}
                      >
                        {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                        <MDBIcon
                          fas
                          icon='th-list'
                          style={{ color: 'black' }}
                        />
                        <p style={{ color: 'black' }}>シナリオ一覧</p>
                      </NavLink>
                    </li>
                    {/* <li
                      className={activeRoute('media-management') + (true ? ' active-pro' : '')}
                      key={'media-management'}
                    >
                      <NavLink
                        to="/v2/admin/media-management"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>メディア管理</p>
                      </NavLink>
                    </li> */}
                  </ul>
                </li>
                <li key={'create-email'}>
                  <NavLink
                    onClick={() => displayEmailSetting()}
                    to='/v2/admin/create-email'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='mail-bulk' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>メール設定</p>
                  </NavLink>
                  <ul
                    id='emailSetting'
                    style={{
                      listStyleType: 'none',
                      marginLeft: '-30px',
                      textDecoration: 'underline',
                      display: 'none',
                    }}
                  >
                    <li
                      className={
                        activeRoute('create-email') +
                        (true ? ' active-pro' : '')
                      }
                      key={'create-email'}
                    >
                      <NavLink
                        to='/v2/admin/create-email'
                        className='nav-link'
                        activeClassName='active'
                        activeStyle={{ color: 'black' }}
                      >
                        {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                        <MDBIcon
                          fas
                          icon='file-signature'
                          style={{ color: 'black' }}
                        />
                        <p style={{ color: 'black' }}>メール作成</p>
                      </NavLink>
                    </li>
                    <li
                      className={
                        activeRoute('list-email') + (true ? ' active-pro' : '')
                      }
                      key={'list-email'}
                    >
                      <NavLink
                        to='/v2/admin/list-email'
                        className='nav-link'
                        activeClassName='active'
                        activeStyle={{ color: 'black' }}
                      >
                        {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                        <MDBIcon
                          fas
                          icon='mail-bulk'
                          style={{ color: 'black' }}
                        />
                        <p style={{ color: 'black' }}>メール一覧</p>
                      </NavLink>
                    </li>
                  </ul>
                </li>
                
                {/** SMS Template */}
                <li
                  className={activeRoute("sms") + (true ? " active-pro" : "")}
                  key={"sms"}
                >
                  <NavLink
                    to={`/v2/admin/bot-settings/${botId}/sms-template`}
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    <MDBIcon fas icon='fa fa-comment' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>SMS</p>
                  </NavLink>
                </li>
                <li
                  className={
                    activeRoute('file-management') + (true ? ' active-pro' : '')
                  }
                  key={'file-management'}
                >
                  <NavLink
                    to='/v2/admin/file-management'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='file-alt' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>メディアファイル管理</p>
                  </NavLink>
                </li>
                <li
                  className={
                    activeRoute('sub-user') + (true ? ' active-pro' : '')
                  }
                  key={'sub-user'}
                >
                  <NavLink
                    to='/v2/admin/sub-user'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='user-check' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>サブユーザ管理</p>
                  </NavLink>
                </li>
                {/* <li key={'api-setting'}>
                  <NavLink
                    onClick={() => displayAPISetting()}
                    to="/v2/admin/create-email"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>API設定</p>
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
                        to="/v2/admin/create-api"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>API作成</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('api-management') + (true ? ' active-pro' : '')}
                      key={'api-management'}
                    >
                      <NavLink
                        to="/v2/admin/api-management"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>API管理</p>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}
                {/** SMS Template */}
                <li className={
                    activeRoute('push-message') + (true ? ' active-pro' : '')
                  }
                  key={'push-message'}
                >
                  <NavLink
                    to={`/v2/admin/bot-settings/${botId}/push-message`}
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    <MDBIcon
                      fas
                      icon='envelope-square'
                      style={{ color: 'black' }}
                    />
                    <p style={{ color: 'black' }}>プッシュメッセージ</p>
                  </NavLink>
                </li>

                {/* <li key={'ab-test'}>
                  <NavLink onClick={() => displayABSetting()} to="/v2/admin/create-ab-test" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>ABテスト</p>
                  </NavLink>
                  <ul id="ABSetting" style={{ listStyleType: "none", marginLeft: "-30px", textDecoration: "underline", display: "none" }}>
                    <li className={activeRoute('create-ab-test') + (true ? " active-pro" : "")} key={'create-ab-test'}>
                      <NavLink to="/v2/admin/create-ab-test" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>ABテスト作成</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('list-ab-test') + (true ? " active-pro" : "")} key={'list-ab-test'}>
                      <NavLink to="/v2/admin/list-ab-test" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>ABテスト一覧</p>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}

                <li
                  className={
                    activeRoute('variable-management') +
                    (true ? ' active-pro' : '')
                  }
                  key={'variable-management'}
                >
                  <NavLink
                    to='/v2/admin/variable-management'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='chart-bar' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>変数管理</p>
                  </NavLink>
                </li>
                <li
                  className={
                    activeRoute('installation-tag-demo') +
                    (true ? ' active-pro' : '')
                  }
                  key={'installation-tag-demo'}
                >
                  <NavLink
                    to='/v2/admin/installation-tag-demo'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='download' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>設定タグ＆デモ</p>
                  </NavLink>
                </li>
                <li
                  className={
                    activeRoute('design-setting') + (true ? ' active-pro' : '')
                  }
                  key={'design-setting'}
                >
                  <NavLink
                    to='/v2/admin/design-setting'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon
                      fas
                      icon='paint-brush'
                      style={{ color: 'black' }}
                    />
                    <p style={{ color: 'black' }}>デザイン設定</p>
                  </NavLink>
                </li>
                {/* <li
                  className={activeRoute('conversion') + (true ? ' active-pro' : '')}
                  key={'conversion'}
                >
                  <NavLink
                    to="/v2/admin/conversion"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>コンバージョン</p>
                  </NavLink>
                </li> */}
                {/* <li className={activeRoute('preview') + (true ? " active-pro" : "")} key={'preview'}>
                  <NavLink to="/v2/admin/preview" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>プレビュー</p>
                  </NavLink>
                </li> */}

                <li key={'report'}>
                  {/* <NavLink onClick={() => displayReportSetting()} to="/v2/admin/report" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}> */}
                  <NavLink
                    to='/v2/admin/report'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon fas icon='chart-line' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>レポート</p>
                  </NavLink>
                  {/* <ul
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
                        to="/v2/admin/conversion-info"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>コンバージョン情報</p>
                      </NavLink>
                    </li>
                    <li
                      className={activeRoute('statistics') + (true ? ' active-pro' : '')}
                      key={'statistics'}
                    >
                      <NavLink
                        to="/v2/admin/statistics"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>統計</p>
                      </NavLink>
                    </li>
                  </ul> */}
                </li>
                <li key={'chat-log'} >
                      <NavLink
                        to="/v2/admin/bot-chat-log"
                        className="nav-link"
                        activeClassName="active"
                        activeStyle={{ color: 'black' }}
                      >
                        <MDBIcon fas icon='fa fa-comments' style={{ color: 'black' }} />
                        <p style={{ color: 'black' }}>会話</p>
                      </NavLink>
                    </li>
                <li
                  className={
                    activeRoute('payment-management') +
                    (true ? ' active-pro' : '')
                  }
                  key={'payment'}
                >
                  <NavLink
                    to='/v2/admin/payment-management'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon
                      fas
                      icon='money-check'
                      style={{ color: 'black' }}
                    />
                    <p style={{ color: 'black' }}>決済管理</p>
                  </NavLink>
                </li>
                <li
                  className={
                    activeRoute('payment-gateway') + (true ? ' active-pro' : '')
                  }
                  key={'payment-gateway'}
                >
                  <NavLink
                    to='/v2/admin/payment-gateway'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} />server */}
                    <MDBIcon fas icon='server' style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>ペイメントゲートウェイ</p>
                  </NavLink>
                </li>
                {/* <li
                  className={activeRoute('payment') + (true ? ' active-pro' : '')}
                  key={'payment-s'}
                >
                  <NavLink
                    to="/v2/admin/payment"
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ color: 'black' }}
                  >
                    <i className="nc-icon nc-badge" style={{ color: 'black' }} />
                    <p style={{ color: 'black' }}>決済サービス</p>
                  </NavLink>
                </li> */}
                <li
                  className={
                    activeRoute('withdrawal-prevention') +
                    (true ? ' active-pro' : '')
                  }
                  key={'withdrawal-prevention'}
                >
                  <NavLink
                    to='/v2/admin/withdrawal-prevention'
                    className='nav-link'
                    activeClassName='active'
                    activeStyle={{ color: 'black' }}
                  >
                    {/* <i className="nc-icon nc-badge" style={{ color: 'black' }} /> */}
                    <MDBIcon
                      fas
                      icon='window-restore'
                      style={{ color: 'black' }}
                    />
                    <p style={{ color: 'black' }}>離脱防止</p>
                  </NavLink>
                </li>

                {/* <li key={'advance-setting'}>
                <li className={activeRoute('payment-management') + (true ? " active-pro" : "")} key={'payment'}>
                  <NavLink to="/v2/admin/payment-management" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>決済管理</p>
                  </NavLink>
                </li>

                <li key={'advance-setting'}>
                  <NavLink onClick={() => displayAVSetting()} to="/v2/admin/basic-info" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                    <i className="nc-icon nc-badge" style={{ color: "black" }} />
                    <p style={{ color: "black" }}>詳細設定</p>
                  </NavLink>
                  <ul id="AVSetting" style={{ listStyleType: "none", marginLeft: "-30px", textDecoration: "underline", display: "none" }}>
                    <li className={activeRoute('basic-info') + (true ? " active-pro" : "")} key={'basic-info'}>
                      <NavLink to="/v2/admin/basic-info" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>基本情報</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('tz-lang') + (true ? " active-pro" : "")} key={'tz-lang'}>
                      <NavLink to="/v2/admin/tz-lang" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>タイムゾーンと言語</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('ip-address-setting') + (true ? " active-pro" : "")} key={'ip-address-setting'}>
                      <NavLink to="/v2/admin/ip-address-setting" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>IPアドレス設定</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('withdrawal-prevention') + (true ? " active-pro" : "")} key={'withdrawal-prevention'}>
                      <NavLink to="/v2/admin/withdrawal-prevention" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>離脱防止</p>
                      </NavLink>
                    </li>
                    <li className={activeRoute('bot-admin') + (true ? " active-pro" : "")} key={'bot-admin'}>
                      <NavLink to="/v2/admin/bot-admin" className="nav-link" activeClassName="active" activeStyle={{ color: "black" }}>
                        <i className="nc-icon nc-badge" style={{ color: "black" }} />
                        <p style={{ color: "black" }}>ボット管理者</p>
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
