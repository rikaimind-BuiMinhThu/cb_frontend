import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "routes.js";
import PushMessage from 'views/BotSettings/PushMessage/PushMessagePage';
import ListSmsTemplate from "views/BotSettings/SmsTemplate/ListSmsTemplate";

var ps;

function Dashboard(props) {
  const mainPanel = React.useRef();
  const location = useLocation();

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });

  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    const pathname = location.pathname;
    // const client = JSON.parse(sessionStorage.getItem('client'));
    const client = JSON.parse(localStorage.getItem('client'));
    // const isInstagram = client?.is_instagram;
    // const isWeb = client?.is_web;
    const isInstagram = true;
    const isWeb = true;
    const instagramRolesUrl = ['/admin/chatbot', '/admin/keyword', '/admin/release', '/admin/data', '/admin/data-analyst', '/admin/list-user', '/admin/attracted-customer', '/admin/crm'];
    const webRolesUrl = ['/admin/bot', '/admin/account-information', '/admin/basic-setting', '/admin/reply-mail-management'];
    if ((!isInstagram && instagramRolesUrl.includes(pathname)) || (!isWeb && webRolesUrl.includes(pathname))) {
      window.location.href = '/admin/dashboard';
    }
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={routes}
        bgColor={"white"}
        activeColor={"info"}
      />
      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} />
        <Switch>
          {/** avoid using this, it's difficult to handle and track */}
          {routes.map((route, key) => {
            return (
              <Route
                path={route.layout + route.path}
                component={route.component}
                key={key}
              />
            );
          })}
          { /** use as below */}
          <Route
            path="/admin/bot-settings/:botId/sms-template"
            component={ListSmsTemplate}
            name="SMS一覧"
          />
          <Route
            path="/admin/bot-settings/:botId/push-message"
            component={PushMessage}
            name="プッシュメッセージ"
          />
        </Switch>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Dashboard;
