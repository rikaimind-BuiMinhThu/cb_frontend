import Dashboard from 'v2/views/Dashboard.jsx';
import Chatbot from 'views/InstagramBotElement/Chatbot';

import ClientManagement from 'v2/views/ClientManagement/index';
import PlanManagement from 'v2/views/PlanManagement';
import ReleasePage from 'views/InstagramBotElement/Release/ReleasePage';
import UserManagement from 'v2/views/UserManagement/index';
import Keyword from 'views/InstagramBotElement/Keyword';
import DataAnalyst from 'views/InstagramBotElement/DataAnalyst';
import ListUser from 'views/InstagramBotElement/ListUser';
import AttractedCustomer from 'views/InstagramBotElement/AttractedCustomer';
import CRM from 'views/InstagramBotElement/CRM';
import Template from 'v2/views/InstagramBotElement/Template';
import BotManagement from 'v2/views/BotManagement/BotManagement';
import AddBotchat from 'v2/views/BotManagement/AddBotchat';
import BasicSetting from 'v2/views/AccountSettings/BasicSetting';
import SubUserManagement from 'v2/views/AccountSettings/SubUserManagement';
import PaymentSetting from 'v2/views/AccountSettings/PaymentSetting';
import PaymentHistory from 'v2/views/AccountSettings/PaymentHistory';
import IPAddressSetting from 'v2/views/AccountSettings/IPAddressSetting';
import ScenarioList from 'v2/views/ScenarioSetting/ScenarioList';
import CreateEmail from 'v2/views/EmailSetting/CreateEmail';
import ListEmail from 'v2/views/EmailSetting/ListEmail';
import BotDemo from 'v2/views/BotManagement/BotDemo';
import Scenario from 'v2/views/ScenarioSetting/Scenario';
import ScenarioTemplateList from 'v2/views/ScenarioSetting/ScenarioTemplateList';
import ScenarioTemplateEditor from 'v2/views/ScenarioSetting/ScenarioTemplateEditor';
import OrderConfirmMessageTemplateList from 'v2/views/OrderConfirmTemplate/OrderConfirmMessageTemplateList';
import OrderConfirmMessageTemplateEditor from 'v2/views/OrderConfirmTemplate/OrderConfirmMessageTemplateEditor';
import VariableManagement from 'v2/views/VariableManagement';
import InstallationTag from 'v2/views/InstallationTag/InstallationTag';
import WithdrawalPrevention from 'v2/views/AdvanceSetting/WithdrawalPrevention';
import BotAdmin from 'v2/views/AdvanceSetting/BotAdmin';
import FileManagement from 'v2/views/FileManagement/FileManagement';
import AddSubUserMng from 'v2/views/AccountSettings/AddSubUserMng';
import HtmlScreen from 'v2/views/HtmlScreen';
import Report from 'v2/views/Report/Report';
import PaymentManagement from 'v2/views/Payment/PaymentManagement';
import Payment from 'v2/views/Payment/Payment';
import PaymentGateway from 'v2/views/Payment/PaymentGateway';
import AddPaymentGateway from 'v2/views/Payment/AddPaymentGateway';
import ReplyMailManagement from 'v2/views/AccountSettings/ReplyMailManagement';
import DesignChatbot from 'v2/views/DesignSetting/DesignChatbot';
import ClientPaymentDetail from 'v2/views/ClientPaymentDetail';
import BotChatLog from 'v2/views/Report/ChatLog/BotChatLog';
import ListSmsTemplate from 'v2/views/SmsTemplate/ListSmsTemplate';
import PushMessage from 'v2/views/PushMessage/PushMessagePage';
import { MENU_LABELS } from 'v2/components/AdminShell/constants';

const routes = [
  {
    path: '/dashboard',
    name: 'ホーム',
    icon: 'nc-icon nc-bank',
    component: Dashboard,
    layout: '/v2/admin',
  },
  {
    path: '/client-management',
    name: 'クライアント管理',
    icon: 'nc-icon nc-pin-3',
    component: ClientManagement,
    layout: '/v2/admin',
  },
  {
    path: '/user-management',
    name: 'ユーザー管理',
    icon: 'nc-icon nc-circle-10',
    component: UserManagement,
    layout: '/v2/admin',
  },
  {
    path: '/instagram',
    name: 'ホーム',
    icon: 'nc-icon nc-bank',
    component: Chatbot,
    layout: '/v2/admin',
  },
  {
    path: '/crm',
    name: 'CRM',
    icon: 'nc-icon nc-bulb-63',
    component: CRM,
    layout: '/v2/admin',
  },
  {
    path: '/keyword',
    name: 'キーワード設定',
    icon: 'nc-icon nc-key-25',
    component: Keyword,
    layout: '/v2/admin',
  },
  {
    path: '/chatbot',
    name: 'チャットボット作成',
    icon: 'nc-icon nc-bell-55',
    component: Chatbot,
    layout: '/v2/admin',
  },
  {
    path: '/release',
    name: 'リリース',
    icon: 'nc-icon nc-air-baloon',
    component: ReleasePage,
    layout: '/v2/admin',
  },
  {
    path: '/policy',
    name: 'ポリシー',
    // icon: "nc-icon nc-bell-55",
    component: HtmlScreen,
    layout: '/v2/admin',
  },
  {
    path: '/data',
    name: 'データ分析',
    // icon: "nc-icon nc-bell-55",
    component: DataAnalyst,
    layout: '/v2/admin',
  },
  {
    path: '/data-analyst',
    name: 'データ分析',
    // icon: "nc-icon nc-bell-55",
    component: DataAnalyst,
    layout: '/v2/admin',
  },
  {
    path: '/list-user',
    name: 'ユーザー一覧',
    // icon: "nc-icon nc-bell-55",
    component: ListUser,
    layout: '/v2/admin',
  },
  {
    path: '/attracted-customer',
    name: '集客',
    // icon: "nc-icon nc-bell-55",
    component: AttractedCustomer,
    layout: '/v2/admin',
  },
  {
    path: '/template',
    name: '集客',
    // icon: "nc-icon nc-bell-55",
    component: Template,
    layout: '/v2/admin',
  },
  {
    path: '/bot',
    name: 'ボット管理',
    // icon: "nc-icon nc-single-02",
    component: BotManagement,
    layout: '/v2/admin',
  },
  {
    path: '/bot-management',
    name: 'ポリシー',
    // icon: "nc-icon nc-single-02",
    component: BotManagement,
    layout: '/v2/admin',
  },
  {
    path: '/add-bot-management',
    name: 'ボット管理追加',
    // icon: "nc-icon nc-single-02",
    component: AddBotchat,
    layout: '/v2/admin',
  },
  // {
  //   path: '/account-information',
  //   name: 'アカウント情報',
  //   // icon: "nc-icon nc-single-02",
  //   component: AccountInformation,
  //   layout: '/v2/admin',
  // },
  {
    path: '/reply-mail-management',
    name: '送信メール管理',
    // icon: "nc-icon nc-single-02",
    component: ReplyMailManagement,
    layout: '/v2/admin',
  },
  {
    path: '/basic-setting',
    name: 'アカウント基本設定',
    // icon: "nc-icon nc-single-02",
    component: BasicSetting,
    layout: '/v2/admin',
  },
  {
    path: '/sub-user',
    name: 'サブユーザ管理',
    // icon: "nc-icon nc-single-02",
    component: SubUserManagement,
    layout: '/v2/admin',
  },
  {
    path: '/add-sub-user',
    name: 'ボットサブユーザー追加',
    component: AddSubUserMng,
    layout: '/v2/admin',
  },
  // {
  //   path: "/plan-selection",
  //   name: "Plan Selection",
  //   // icon: "nc-icon nc-single-02",
  //   component: PlanSelection,
  //   layout: "/v2/admin",
  // },
  {
    path: '/payment-setting',
    name: '決済設定',
    // icon: "nc-icon nc-single-02",
    component: PaymentSetting,
    layout: '/v2/admin',
  },
  {
    path: '/payment-history',
    name: '決済履歴',
    // icon: "nc-icon nc-single-02",
    component: PaymentHistory,
    layout: '/v2/admin',
  },
  {
    path: '/ip-address-setting',
    name: 'IPアドレス設定',
    // icon: "nc-icon nc-single-02",
    component: IPAddressSetting,
    layout: '/v2/admin',
  },
  {
    path: '/bot-setting',
    name: 'ボット設定',
    // icon: "nc-icon nc-single-02",
    component: ScenarioList,
    layout: '/v2/admin',
  },
  {
    path: '/scenario-setting',
    name: 'シナリオ設定',
    // icon: "nc-icon nc-single-02",
    component: Scenario,
    layout: '/v2/admin',
  },
  {
    path: '/scenario-list',
    name: 'シナリオ一覧',
    // icon: "nc-icon nc-single-02",
    component: ScenarioList,
    layout: '/v2/admin',
  },
  {
    path: '/scenario-template-list',
    name: 'シナリオテンプレート一覧',
    component: ScenarioTemplateList,
    layout: '/v2/admin',
  },
  {
    path: '/scenario-template-setting',
    name: 'シナリオテンプレート設定',
    component: ScenarioTemplateEditor,
    layout: '/v2/admin',
  },
  {
    path: '/order-confirm-template-list',
    name: '注文確認メッセージテンプレート一覧',
    component: OrderConfirmMessageTemplateList,
    layout: '/v2/admin',
  },
  {
    path: '/order-confirm-template-setting',
    name: '注文確認メッセージテンプレート設定',
    component: OrderConfirmMessageTemplateEditor,
    layout: '/v2/admin',
  },
  {
    path: '/design-setting',
    name: 'デザイン設定',
    // icon: "nc-icon nc-single-02",
    component: DesignChatbot,
    layout: '/v2/admin',
  },

  {
    path: '/create-email',
    name: 'メール定定',
    // icon: "nc-icon nc-single-02",
    component: CreateEmail,
    layout: '/v2/admin',
  },
  {
    path: '/edit-email/:id',
    name: 'メール編集',
    // icon: "nc-icon nc-single-02",
    component: CreateEmail,
    layout: '/v2/admin',
  },
  {
    path: '/list-email',
    name: 'メール一覧',
    // icon: "nc-icon nc-single-02",
    component: ListEmail,
    layout: '/v2/admin',
  },
  {
    path: '/demo-bot/:id',
    name: 'ボットデモ',
    // icon: "nc-icon nc-single-02",
    component: BotDemo,
    layout: '/v2/admin',
  },
  {
    path: '/file-management',
    name: 'メディアファイル管理',
    // icon: "nc-icon nc-single-02",
    component: FileManagement,
    layout: '/v2/admin',
  },
  {
    path: '/variable-management',
    name: '変数管理',
    // icon: "nc-icon nc-single-02",
    component: VariableManagement,
    layout: '/v2/admin',
  },
  {
    path: '/installation-tag-demo',
    name: '設定ガイドとデモ',
    // icon: "nc-icon nc-single-02",
    component: InstallationTag,
    layout: '/v2/admin',
  },
  {
    path: '/report',
    name: 'レポート',
    // icon: "nc-icon nc-single-02",
    component: Report,
    layout: '/v2/admin',
  },
  {
    path: '/payment-management',
    name: '決済',
    // icon: "nc-icon nc-single-02",
    component: PaymentManagement,
    layout: '/v2/admin',
  },
  {
    path: '/payment-gateway',
    name: '決済ゲートウェイ',
    // icon: "nc-icon nc-single-02",
    component: PaymentGateway,
    layout: '/v2/admin',
  },
  {
    path: '/add-payment-gateway',
    name: '決済ゲートウェイ追加',
    // icon: "nc-icon nc-single-02",
    component: AddPaymentGateway,
    layout: '/v2/admin',
  },
  {
    path: '/edit-payment-gateway/:id',
    name: '決済ゲートウェイ編集',
    // icon: "nc-icon nc-single-02",
    component: AddPaymentGateway,
    layout: '/v2/admin',
  },
  {
    path: '/payment',
    name: '決済サービス',
    // icon: "nc-icon nc-single-02",
    component: Payment,
    layout: '/v2/admin',
  },
  {
    path: '/withdrawal-prevention',
    name: '離脱防止',
    // icon: "nc-icon nc-single-02",
    component: WithdrawalPrevention,
    layout: '/v2/admin',
  },
  {
    path: '/bot-admin',
    name: 'ボットAdmin',
    // icon: "nc-icon nc-single-02",
    component: BotAdmin,
    layout: '/v2/admin',
  },
  {
    path: '/plan-management',
    name: 'プラン管理',
    component: PlanManagement,
    layout: '/v2/admin',
  },
  {
    path: '/client-payment-detail',
    name: 'クライアントの支払い詳細',
    component: ClientPaymentDetail,
    layout: '/v2/admin',
  },
  {
    path: '/bot-chat-log',
    name: '会話',
    component: BotChatLog,
    layout: '/v2/admin',
  },
  {
    path: '/bot-settings/:botId/sms-template',
    name: MENU_LABELS.SMS,
    component: ListSmsTemplate,
    layout: '/v2/admin',
  },
  {
    path: '/bot-settings/:botId/push-message',
    name: MENU_LABELS.PUSH_MESSAGE,
    component: PushMessage,
    layout: '/v2/admin',
  },
];
// if(Cookies.get('token') !== ""){
//   routes.splice('2','1')
// }
export default routes;
