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
import Dashboard from "views/Dashboard.jsx";
import Chatbot from "views/Chatbot.jsx";
import Icons from "views/Icons.jsx";
import ClientManagement from "views/ClientManagement";
import Policy from "views/Policy"
import UserPage from "views/User.jsx";
import UpgradeToPro from "views/Upgrade.jsx";
import UserManagement from "views/UserManagement";
import Pricing from "views/Pricing";
// import Cookies from 'js-cookie'

var routes = [
  {
    path: "/dashboard",
    name: "ホーム",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/client-management",
    name: "クライアント管理",
    icon: "nc-icon nc-pin-3",
    component: ClientManagement,
    layout: "/admin",
  },
  {
    path: "/user-management",
    name: "ユーザー管理",
    icon: "nc-icon nc-circle-10",
    component: UserManagement,
    layout: "/admin",
  },
  {
    path: "/pricing",
    name: "価格",
    icon: "nc-icon nc-bulb-63",
    component: Pricing,
    layout: "/admin",
  },
  {
    path: "/chatbot",
    name: "Chatbot",
    icon: "nc-icon nc-bell-55",
    component: Chatbot,
    layout: "/admin",
  },
  {
    path: "/policy",
    name: "Policy",
    // icon: "nc-icon nc-bell-55",
    component: Policy,
    layout: "/admin",
  },
  // {
  //   path: "/user-page",
  //   name: "User Profile",
  //   icon: "nc-icon nc-single-02",
  //   component: UserPage,
  //   layout: "/admin",
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: Icons,
  //   layout: "/admin",
  // }
];
// if(Cookies.get('token') !== ""){
//   routes.splice('2','1')
// }
export default routes;
