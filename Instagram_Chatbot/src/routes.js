import v2Routes from './v2/routes';
import Dashboard from 'views/Dashboard.jsx';
import Chatbot from 'views/InstagramBotElement/Chatbot';

import ClientManagement from 'views/ClientManagement';
import PlanManagement from 'views/PlanManagement';
import Policy from 'views/InstagramBotElement/Policy';
import Release from 'views/InstagramBotElement/Release';
import UserManagement from 'views/UserManagement';
import Keyword from 'views/InstagramBotElement/Keyword';
import DataAnalyst from 'views/InstagramBotElement/DataAnalyst';
import ListUser from 'views/InstagramBotElement/ListUser';
import AttractedCustomer from 'views/InstagramBotElement/AttractedCusomer';
import CRM from 'views/InstagramBotElement/CRM';
import Template from 'views/InstagramBotElement/Template';
import BotManagement from 'views/BotElement/BotManagement';
import AddBotchat from 'views/BotElement/AddBotchat';
import AccountInformation from 'views/BotElement/AccountInformation';
import BasicSetting from 'views/BotElement/BasicSetting';
import SubUserManagement from 'views/BotElement/SubUserManagement';
import PlanSelection from 'views/BotElement/PlanSelection';
import PaymentSetting from 'views/BotElement/PaymentSetting';
import PaymentHistory from 'views/BotElement/PaymentHistory';
import IPAddressSetting from 'views/BotElement/IPAddressSetting';
import ScenarioList from 'views/BotElement/BotSetting/ScenarioSetting/ScenarioList';
import MediaFileManagement from 'views/BotElement/BotSetting/ScenarioSetting/MediaFileManagement';
import CreateEmail from 'views/BotElement/BotSetting/EmailSetting/CreateEmail';
import ListEmail from 'views/BotElement/BotSetting/EmailSetting/ListEmail';
import BotDemo from 'views/BotElement/BotDemo';
import CreateAPI from 'views/BotElement/BotSetting/APISetting/CreateAPI';
import APIManagement from 'views/BotElement/BotSetting/APISetting/APIManagement';
import CreateABTest from 'views/BotElement/BotSetting/ABTest/CreateABTest';
import ListABTest from 'views/BotElement/BotSetting/ABTest/ListABTest';
import Scenario from 'views/BotElement/BotSetting/ScenarioSetting/Scenario';
import VariableManagement from 'views/BotElement/BotSetting/VariableManagement';
import InstallationTag from 'views/BotElement/BotSetting/InstallationTag';
import Conversion from 'views/BotElement/BotSetting/Conversion';
import Preview from 'views/BotElement/BotSetting/Preview';
import ConversionInfo from 'views/BotElement/BotSetting/Report/ConversionInfo';
import { Statistic } from 'semantic-ui-react';
import BasicInformation from 'views/BotElement/BotSetting/AdvanceSetting/BasicInformation';
import TimeAndLang from 'views/BotElement/BotSetting/AdvanceSetting/TimeAndLang';
import WithdrawalPrevention from 'views/BotElement/BotSetting/AdvanceSetting/WithdrawalPrevention';
import BotAdmin from 'views/BotElement/BotSetting/AdvanceSetting/BotAdmin';
import FileManagement from 'views/BotElement/BotSetting/FileManagement';
import AddSubUserMng from 'views/BotElement/AddSubUserMng';
import HtmlScreen from 'views/HtmlScreen';
import Report from 'views/BotElement/BotSetting/Report/Report';
import PaymentManagement from 'views/BotElement/PaymentManagement';
import Payment from 'views/BotElement/BotSetting/Payment/Payment';
import PaymentGateway from 'views/BotElement/BotSetting/Payment/PaymentGateway';
import AddPaymentGateway from 'views/BotElement/BotSetting/Payment/AddPaymentGateway';
import ReplyMailManagement from 'views/BotElement/ReplyMailManagement';
import DesignChatbot from 'views/BotElement/BotSetting/DesignSetting/DesignChatbot';
import ClientPaymentDetail from 'views/ClientPaymentDetail';
import BotChatLog from 'views/BotElement/BotSetting/Report/ChatLog/BotChatLog';

var routes = [
  {
    path: '/dashboard',
    name: 'ホーム',
    icon: 'nc-icon nc-bank',
    component: Dashboard,
    layout: '/admin',
  },
  {
    path: '/client-management',
    name: 'クライアント管理',
    icon: 'nc-icon nc-pin-3',
    component: ClientManagement,
    layout: '/admin',
  },
  {
    path: '/user-management',
    name: 'ユーザー管理',
    icon: 'nc-icon nc-circle-10',
    component: UserManagement,
    layout: '/admin',
  },
  {
    path: '/instagram',
    name: 'ホーム',
    icon: 'nc-icon nc-bank',
    component: Chatbot,
    layout: '/admin',
  },
  {
    path: '/crm',
    name: 'CRM',
    icon: 'nc-icon nc-bulb-63',
    component: CRM,
    layout: '/admin',
  },
  {
    path: '/keyword',
    name: 'キーワード設定',
    icon: 'nc-icon nc-key-25',
    component: Keyword,
    layout: '/admin',
  },
  {
    path: '/chatbot',
    name: 'チャットボット作成',
    icon: 'nc-icon nc-bell-55',
    component: Chatbot,
    layout: '/admin',
  },
  {
    path: '/release',
    name: 'リリース',
    icon: 'nc-icon nc-air-baloon',
    component: Release,
    layout: '/admin',
  },
  {
    path: '/policy',
    name: 'ポリシー',
    // icon: "nc-icon nc-bell-55",
    component: HtmlScreen,
    layout: '/admin',
  },
  {
    path: '/data',
    name: 'データ分析',
    // icon: "nc-icon nc-bell-55",
    component: DataAnalyst,
    layout: '/admin',
  },
  {
    path: '/data-analyst',
    name: 'データ分析',
    // icon: "nc-icon nc-bell-55",
    component: DataAnalyst,
    layout: '/admin',
  },
  {
    path: '/list-user',
    name: 'ユーザー一覧',
    // icon: "nc-icon nc-bell-55",
    component: ListUser,
    layout: '/admin',
  },
  {
    path: '/attracted-customer',
    name: '集客',
    // icon: "nc-icon nc-bell-55",
    component: AttractedCustomer,
    layout: '/admin',
  },
  {
    path: '/template',
    name: '集客',
    // icon: "nc-icon nc-bell-55",
    component: Template,
    layout: '/admin',
  },
  {
    path: '/bot',
    name: 'ボット管理',
    // icon: "nc-icon nc-single-02",
    component: BotManagement,
    layout: '/admin',
  },
  {
    path: '/bot-management',
    name: 'ポリシー',
    // icon: "nc-icon nc-single-02",
    component: BotManagement,
    layout: '/admin',
  },
  {
    path: '/add-bot-management',
    name: 'ボット管理追加',
    // icon: "nc-icon nc-single-02",
    component: AddBotchat,
    layout: '/admin',
  },
  // {
  //   path: '/account-information',
  //   name: 'アカウント情報',
  //   // icon: "nc-icon nc-single-02",
  //   component: AccountInformation,
  //   layout: '/admin',
  // },
  {
    path: '/reply-mail-management',
    name: '送信メール管理',
    // icon: "nc-icon nc-single-02",
    component: ReplyMailManagement,
    layout: '/admin',
  },
  {
    path: '/basic-setting',
    name: 'アカウント基本設定',
    // icon: "nc-icon nc-single-02",
    component: BasicSetting,
    layout: '/admin',
  },
  {
    path: '/sub-user',
    name: 'サブユーザ管理',
    // icon: "nc-icon nc-single-02",
    component: SubUserManagement,
    layout: '/admin',
  },
  {
    path: '/add-sub-user',
    name: 'ボットサブユーザー追加',
    component: AddSubUserMng,
    layout: '/admin',
  },
  // {
  //   path: "/plan-selection",
  //   name: "Plan Selection",
  //   // icon: "nc-icon nc-single-02",
  //   component: PlanSelection,
  //   layout: "/admin",
  // },
  {
    path: '/payment-setting',
    name: '決済設定',
    // icon: "nc-icon nc-single-02",
    component: PaymentSetting,
    layout: '/admin',
  },
  {
    path: '/payment-history',
    name: '決済履歴',
    // icon: "nc-icon nc-single-02",
    component: PaymentHistory,
    layout: '/admin',
  },
  {
    path: '/ip-address-setting',
    name: 'IPアドレス設定',
    // icon: "nc-icon nc-single-02",
    component: IPAddressSetting,
    layout: '/admin',
  },
  {
    path: '/bot-setting',
    name: 'ボット設定',
    // icon: "nc-icon nc-single-02",
    component: ScenarioList,
    layout: '/admin',
  },
  {
    path: '/scenario-setting',
    name: 'シナリオ設定',
    // icon: "nc-icon nc-single-02",
    component: Scenario,
    layout: '/admin',
  },
  {
    path: '/scenario-list',
    name: 'シナリオ一覧',
    // icon: "nc-icon nc-single-02",
    component: ScenarioList,
    layout: '/admin',
  },
  {
    path: '/design-setting',
    name: 'デザイン設定',
    // icon: "nc-icon nc-single-02",
    component: DesignChatbot,
    layout: '/admin',
  },

  {
    path: '/create-email',
    name: 'メール定定',
    // icon: "nc-icon nc-single-02",
    component: CreateEmail,
    layout: '/admin',
  },
  {
    path: '/edit-email/:id',
    name: 'メール編集',
    // icon: "nc-icon nc-single-02",
    component: CreateEmail,
    layout: '/admin',
  },
  {
    path: '/list-email',
    name: 'メール一覧',
    // icon: "nc-icon nc-single-02",
    component: ListEmail,
    layout: '/admin',
  },
  {
    path: '/demo-bot/:id',
    name: 'ボットデモ',
    // icon: "nc-icon nc-single-02",
    component: BotDemo,
    layout: '/admin',
  },
  {
    path: '/file-management',
    name: 'メディアファイル管理',
    // icon: "nc-icon nc-single-02",
    component: FileManagement,
    layout: '/admin',
  },
  // {
  //   path: "/create-api",
  //   name: "Create API",
  //   // icon: "nc-icon nc-single-02",
  //   component: CreateAPI,
  //   layout: "/admin",
  // },
  // {
  //   path: "/api-management",
  //   name: "API Management",
  //   // icon: "nc-icon nc-single-02",
  //   component: APIManagement,
  //   layout: "/admin",
  // },
  // {
  //   path: "/create-ab-test",
  //   name: "Create AB Test",
  //   // icon: "nc-icon nc-single-02",
  //   component: CreateABTest,
  //   layout: "/admin",
  // },
  // {
  //   path: "/list-ab-test",
  //   name: "List AB Test",
  //   // icon: "nc-icon nc-single-02",
  //   component: ListABTest,
  //   layout: "/admin",
  // },
  {
    path: '/variable-management',
    name: '変数管理',
    // icon: "nc-icon nc-single-02",
    component: VariableManagement,
    layout: '/admin',
  },
  {
    path: '/installation-tag-demo',
    name: '設定ガイドとデモ',
    // icon: "nc-icon nc-single-02",
    component: InstallationTag,
    layout: '/admin',
  },
  // {
  //   path: "/conversion",
  //   name: "Conversion",
  //   // icon: "nc-icon nc-single-02",
  //   component: Conversion,
  //   layout: "/admin",
  // },
  {
    path: '/report',
    name: 'レポート',
    // icon: "nc-icon nc-single-02",
    component: Report,
    layout: '/admin',
  },
  {
    path: '/payment-management',
    name: '決済',
    // icon: "nc-icon nc-single-02",
    component: PaymentManagement,
    layout: '/admin',
  },
  {
    path: '/payment-gateway',
    name: '決済ゲートウェイ',
    // icon: "nc-icon nc-single-02",
    component: PaymentGateway,
    layout: '/admin',
  },
  {
    path: '/add-payment-gateway',
    name: '決済ゲートウェイ追加',
    // icon: "nc-icon nc-single-02",
    component: AddPaymentGateway,
    layout: '/admin',
  },
  {
    path: '/edit-payment-gateway/:id',
    name: '決済ゲートウェイ編集',
    // icon: "nc-icon nc-single-02",
    component: AddPaymentGateway,
    layout: '/admin',
  },
  {
    path: '/payment',
    name: '決済サービス',
    // icon: "nc-icon nc-single-02",
    component: Payment,
    layout: '/admin',
  },
  {
    path: '/preview',
    name: 'プレビュー',
    // icon: "nc-icon nc-single-02",
    component: Preview,
    layout: '/admin',
  },
  // {
  //   path: "/conversion-info",
  //   name: "Conversion Information",
  //   // icon: "nc-icon nc-single-02",
  //   component: ConversionInfo,
  //   layout: "/admin",
  // },
  // {
  //   path: "/statistics",
  //   name: "Statistics",
  //   // icon: "nc-icon nc-single-02",
  //   component: Statistic,
  //   layout: "/admin",
  // },

  // {
  //   path: "/basic-info",
  //   name: "Basic Information",
  //   // icon: "nc-icon nc-single-02",
  //   component: BasicInformation,
  //   layout: "/admin",
  // }, {
  //   path: "/tz-lang",
  //   name: "Timezone and Language",
  //   // icon: "nc-icon nc-single-02",
  //   component: TimeAndLang,
  //   layout: "/admin",
  // },
  {
    path: '/withdrawal-prevention',
    name: '離脱防止',
    // icon: "nc-icon nc-single-02",
    component: WithdrawalPrevention,
    layout: '/admin',
  },
  {
    path: '/bot-admin',
    name: 'ボットAdmin',
    // icon: "nc-icon nc-single-02",
    component: BotAdmin,
    layout: '/admin',
  },
  {
    path: '/plan-management',
    name: 'プラン管理',
    component: PlanManagement,
    layout: '/admin',
  },
  {
    path: '/client-payment-detail',
    name: 'クライアントの支払い詳細',
    component: ClientPaymentDetail,
    layout: '/admin',
  },
  {
    path: '/bot-chat-log',
    name: '会話',
    component: BotChatLog,
    layout: '/admin',
  },
];
// if(Cookies.get('token') !== ""){
//   routes.splice('2','1')
// }
export default [...routes, ...v2Routes];
