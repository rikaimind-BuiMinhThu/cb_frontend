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
import ScenarioList from "views/BotElement/BotSetting/ScenarioSetting/ScenarioList";
import MediaFileManagement from "views/BotElement/BotSetting/ScenarioSetting/MediaFileManagement";
import StartButton from "views/BotElement/BotSetting/DesignSetting/StartButton";
import ChatBody from "views/BotElement/BotSetting/DesignSetting/ChatBody";
import CreateEmail from "views/BotElement/BotSetting/EmailSetting/CreateEmail";
import ListEmail from "views/BotElement/BotSetting/EmailSetting/ListEmail";
import BotDemo from "views/BotElement/BotDemo";
import CreateAPI from "views/BotElement/BotSetting/APISetting/CreateAPI";
import APIManagement from "views/BotElement/BotSetting/APISetting/APIManagement";
import CreateABTest from "views/BotElement/BotSetting/ABTest/CreateABTest";
import ListABTest from "views/BotElement/BotSetting/ABTest/ListABTest";
import Scenario from "views/BotElement/BotSetting/ScenarioSetting/Scenario";
import VariableManagement from "views/BotElement/BotSetting/VariableManagement";
import InstallationTag from "views/BotElement/BotSetting/InstallationTag";
import Conversion from "views/BotElement/BotSetting/Conversion";
import Preview from "views/BotElement/BotSetting/Preview";
import ConversionInfo from "views/BotElement/BotSetting/Report/ConversionInfo";
import { Statistic } from "semantic-ui-react";
import BasicInformation from "views/BotElement/BotSetting/AdvanceSetting/BasicInformation";
import TimeAndLang from "views/BotElement/BotSetting/AdvanceSetting/TimeAndLang";
import WithdrawalPrevention from "views/BotElement/BotSetting/AdvanceSetting/WithdrawalPrevention";
import BotAdmin from "views/BotElement/BotSetting/AdvanceSetting/BotAdmin";
import FileManagement from "views/BotElement/BotSetting/FileManagement";
import AddSubUserMng from "views/BotElement/AddSubUserMng";
import HtmlScreen from "views/HtmlScreen";
import Report from "views/BotElement/BotSetting/Report/Report";
import PushMessage from "views/BotElement/PushMessage";
import PaymentManagement from "views/BotElement/PaymentManagement";

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
    component: HtmlScreen,
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
    path: "/push-message",
    name: "Push Message",
    // icon: "nc-icon nc-single-02",
    component: PushMessage,
    layout: "/admin",
  },
  {
    path: "/add-sub-user",
    name: "Add Sub User Managament",
    component: AddSubUserMng,
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
    path: "/bot-setting",
    name: "Bot Setting",
    // icon: "nc-icon nc-single-02",
    component: ScenarioList,
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
    path: "/scenario-list",
    name: "Scenario List",
    // icon: "nc-icon nc-single-02",
    component: ScenarioList,
    layout: "/admin",
  },
  {
    path: "/media-management",
    name: "Media management",
    // icon: "nc-icon nc-single-02",
    component: MediaFileManagement,
    layout: "/admin",
  },
  {
    path: "/start-button",
    name: "Start Button",
    // icon: "nc-icon nc-single-02",
    component: StartButton,
    layout: "/admin",
  },
  {
    path: "/chat-body",
    name: "Chat Body",
    // icon: "nc-icon nc-single-02",
    component: ChatBody,
    layout: "/admin",
  },
  {
    path: "/create-email",
    name: "Create Email",
    // icon: "nc-icon nc-single-02",
    component: CreateEmail,
    layout: "/admin",
  },
  {
    path: "/edit-email/:id",
    name: "Edit Email",
    // icon: "nc-icon nc-single-02",
    component: CreateEmail,
    layout: "/admin",
  },
  {
    path: "/list-email",
    name: "List Email",
    // icon: "nc-icon nc-single-02",
    component: ListEmail,
    layout: "/admin",
  },
  {
    path: "/demo-bot/:id",
    name: "Bot Demo",
    // icon: "nc-icon nc-single-02",
    component: BotDemo,
    layout: "/admin",
  },
  {
    path: "/file-management",
    name: "File Management",
    // icon: "nc-icon nc-single-02",
    component: FileManagement,
    layout: "/admin",
  },
  {
    path: "/create-api",
    name: "Create API",
    // icon: "nc-icon nc-single-02",
    component: CreateAPI,
    layout: "/admin",
  },
  {
    path: "/api-management",
    name: "API Management",
    // icon: "nc-icon nc-single-02",
    component: APIManagement,
    layout: "/admin",
  },
  {
    path: "/create-ab-test",
    name: "Create AB Test",
    // icon: "nc-icon nc-single-02",
    component: CreateABTest,
    layout: "/admin",
  },
  {
    path: "/list-ab-test",
    name: "List AB Test",
    // icon: "nc-icon nc-single-02",
    component: ListABTest,
    layout: "/admin",
  },
  {
    path: "/variable-management",
    name: "Variable Management",
    // icon: "nc-icon nc-single-02",
    component: VariableManagement,
    layout: "/admin",
  },
  {
    path: "/installation-tag-demo",
    name: "Installation Tag and Demo",
    // icon: "nc-icon nc-single-02",
    component: InstallationTag,
    layout: "/admin",
  },
  {
    path: "/conversion",
    name: "Conversion",
    // icon: "nc-icon nc-single-02",
    component: Conversion,
    layout: "/admin",
  },
  {
    path: "/report",
    name: "Report",
    // icon: "nc-icon nc-single-02",
    component: Report,
    layout: "/admin",
  },
  {
    path: "/payment-management",
    name: "Payment",
    // icon: "nc-icon nc-single-02",
    component: PaymentManagement,
    layout: "/admin",
  },
  {
    path: "/preview",
    name: "Preview",
    // icon: "nc-icon nc-single-02",
    component: Preview,
    layout: "/admin",
  },
  {
    path: "/conversion-info",
    name: "Conversion Information",
    // icon: "nc-icon nc-single-02",
    component: ConversionInfo,
    layout: "/admin",
  },
  {
    path: "/statistics",
    name: "Statistics",
    // icon: "nc-icon nc-single-02",
    component: Statistic,
    layout: "/admin",
  },

  {
    path: "/basic-info",
    name: "Basic Information",
    // icon: "nc-icon nc-single-02",
    component: BasicInformation,
    layout: "/admin",
  }, {
    path: "/tz-lang",
    name: "Timezone and Language",
    // icon: "nc-icon nc-single-02",
    component: TimeAndLang,
    layout: "/admin",
  }, {
    path: "/withdrawal-prevention",
    name: "Withdrawal Prevention",
    // icon: "nc-icon nc-single-02",
    component: WithdrawalPrevention,
    layout: "/admin",
  }, {
    path: "/bot-admin",
    name: "Bot Admin",
    // icon: "nc-icon nc-single-02",
    component: BotAdmin,
    layout: "/admin",
  },
];
// if(Cookies.get('token') !== ""){
//   routes.splice('2','1')
// }
export default routes;
