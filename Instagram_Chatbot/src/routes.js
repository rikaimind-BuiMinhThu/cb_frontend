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
import Chatbot from "views/InstagramBotElement/Chatbot";

import ClientManagement from "views/ClientManagement";
import Policy from "views/InstagramBotElement/Policy";
import Release from "views/InstagramBotElement/Release";
import UserManagement from "views/UserManagement";
import Keyword from "views/InstagramBotElement/Keyword";
import DataAnalyst from "views/InstagramBotElement/DataAnalyst";
import ListUser from "views/InstagramBotElement/ListUser";
import AttractedCustomer from "views/InstagramBotElement/AttractedCusomer";
import CRM from "views/InstagramBotElement/CRM";
import Template from "views/InstagramBotElement/Template";
import BotManagement from "views/BotElement/BotManagement";
import AddBotchat from "views/BotElement/AddBotchat";
import AccountInformation from "views/BotElement/AccountInformation";
import BasicSetting from "views/BotElement/BasicSetting";
import SubUserManagement from "views/BotElement/SubUserManagement";
import PlanSelection from "views/BotElement/PlanSelection";
import PaymentSetting from "views/BotElement/PaymentSetting";
import PaymentHistory from "views/BotElement/PaymentHistory";
import IPAddressSetting from "views/BotElement/IPAddressSetting";
import Scenario from "views/BotElement/BotSetting/Scenario";
import BotDemo from "views/BotElement/BotDemo";

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
    path: "/instagram",
    name: "ホーム",
    icon: "nc-icon nc-bank",
    component: Chatbot,
    layout: "/admin",
  },
  {
    path: "/crm",
    name: "CRM",
    icon: "nc-icon nc-bulb-63",
    component: CRM,
    layout: "/admin",
  },
  {
    path: "/keyword",
    name: "キーワード設定",
    icon: "nc-icon nc-key-25",
    component: Keyword,
    layout: "/admin",
  },
  {
    path: "/chatbot",
    name: "チャットボット作成",
    icon: "nc-icon nc-bell-55",
    component: Chatbot,
    layout: "/admin",
  },
  {
    path: "/release",
    name: "リリース",
    icon: "nc-icon nc-air-baloon",
    component: Release,
    layout: "/admin",
  },
  {
    path: "/policy",
    name: "Policy",
    // icon: "nc-icon nc-bell-55",
    component: Policy,
    layout: "/admin",
  },
  {
    path: "/data",
    name: "データ分析",
    // icon: "nc-icon nc-bell-55",
    component: DataAnalyst,
    layout: "/admin",
  },
  {
    path: "/data-analyst",
    name: "データ分析",
    // icon: "nc-icon nc-bell-55",
    component: DataAnalyst,
    layout: "/admin",
  },
  {
    path: "/list-user",
    name: "ユーザー一覧",
    // icon: "nc-icon nc-bell-55",
    component: ListUser,
    layout: "/admin",
  },
  {
    path: "/attracted-customer",
    name: "集客",
    // icon: "nc-icon nc-bell-55",
    component: AttractedCustomer,
    layout: "/admin",
  },
  {
    path: "/template",
    name: "集客",
    // icon: "nc-icon nc-bell-55",
    component: Template,
    layout: "/admin",
  },
  {
    path: "/bot",
    name: "Bot Management",
    // icon: "nc-icon nc-single-02",
    component: BotManagement,
    layout: "/admin",
  },
  {
    path: "/bot-management",
    name: "Bot Management",
    // icon: "nc-icon nc-single-02",
    component: BotManagement,
    layout: "/admin",
  },
  {
    path: "/add-bot-management",
    name: "Add Bot Management",
    // icon: "nc-icon nc-single-02",
    component: AddBotchat,
    layout: "/admin",
  },
  {
    path: "/account-information",
    name: "Account Information Top",
    // icon: "nc-icon nc-single-02",
    component: AccountInformation,
    layout: "/admin",
  },
  {
    path: "/basic-setting",
    name: "Basic Setting",
    // icon: "nc-icon nc-single-02",
    component: BasicSetting,
    layout: "/admin",
  },
  {
    path: "/sub-user",
    name: "Sub User Management",
    // icon: "nc-icon nc-single-02",
    component: SubUserManagement,
    layout: "/admin",
  },
  {
    path: "/plan-selection",
    name: "Plan Selection",
    // icon: "nc-icon nc-single-02",
    component: PlanSelection,
    layout: "/admin",
  },
  {
    path: "/payment-setting",
    name: "Payment Setting",
    // icon: "nc-icon nc-single-02",
    component: PaymentSetting,
    layout: "/admin",
  },
  {
    path: "/payment-history",
    name: "Payment History",
    // icon: "nc-icon nc-single-02",
    component: PaymentHistory,
    layout: "/admin",
  },
  {
    path: "/ip-address-setting",
    name: "IP Address Setting",
    // icon: "nc-icon nc-single-02",
    component: IPAddressSetting,
    layout: "/admin",
  },
  {
    path: "/scenario-setting",
    name: "Scenario Setting",
    // icon: "nc-icon nc-single-02",
    component: Scenario,
    layout: "/admin",
  },
  {
    path: "/demo-bot/:id",
    name: "Demo Bot",
    // icon: "nc-icon nc-single-02",
    component: BotDemo,
    layout: "/admin",
  },

];
// if(Cookies.get('token') !== ""){
//   routes.splice('2','1')
// }
export default routes;
