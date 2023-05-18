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
