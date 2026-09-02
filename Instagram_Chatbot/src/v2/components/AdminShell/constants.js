import { CLIENT_STORAGE_KEY } from 'v2/api/constants';

export const EMPTY_VALUE = '';
export const REQUIRED_BADGE = '必須';
export const LAYOUT_HORIZONTAL = 'horizontal';
export const LAYOUT_STACKED = 'stacked';
export const ALERT_ROLE = 'alert';

export const ACTION_CREATE = 'create';
export const ACTION_UPLOAD = 'upload';
export const ACTION_SAVE = 'save';
export const ACTION_EDIT = 'edit';
export const ACTION_PREVIEW = 'preview';
export const ACTION_DUPLICATE = 'duplicate';
export const ACTION_COPY = 'copy';
export const ACTION_BACK = 'back';
export const ACTION_CANCEL = 'cancel';
export const ACTION_DELETE = 'delete';
export const ACTION_PAYMENT = 'payment';
export const ACTION_SEARCH = 'search';
export const ACTION_DOWNLOAD = 'download';

export const ACTION_LABELS = {
  [ACTION_CREATE]: '作成',
  [ACTION_UPLOAD]: 'ファイル追加',
  [ACTION_SAVE]: '保存',
  [ACTION_EDIT]: '編集',
  [ACTION_PREVIEW]: 'プレビュー',
  [ACTION_DUPLICATE]: '複製',
  [ACTION_COPY]: 'コピー',
  [ACTION_BACK]: '戻る',
  [ACTION_CANCEL]: 'キャンセル',
  [ACTION_DELETE]: '削除',
  [ACTION_PAYMENT]: '決済',
  [ACTION_SEARCH]: '検索',
  [ACTION_DOWNLOAD]: 'ダウンロード',
};

export const BUTTON_TYPE_PRIMARY = 'primary';
export const BUTTON_TYPE_LINK = 'link';
export const BUTTON_TYPE_DEFAULT = 'default';
export const BUTTON_TYPE_TEXT = 'text';
export const BUTTON_SIZE_SMALL = 'small';

export const CONFIRM_TITLE = '確認';
export const CONFIRM_CANCEL = 'キャンセル';
export const CONFIRM_OK = 'はい';
export const CONFIRM_DELETE = '削除';
export const CONFIRM_MODAL_WIDTH = 400;

export const TABLE_EMPTY_DESCRIPTION = 'データがありません';
export const TABLE_TOTAL_PREFIX = '全 ';
export const TABLE_TOTAL_SUFFIX = ' 件';
export const TABLE_ROW_KEY = 'id';
export const DEFAULT_PAGE_SIZE = 10;

export const formatTableTotal = (total) =>
  `${TABLE_TOTAL_PREFIX}${total}${TABLE_TOTAL_SUFFIX}`;

export const SEARCH_PLACEHOLDER = '検索...';
export const SEARCH_FILTER_SPACE_SIZE = 4;

export const TOOLTIP_PLACEMENT_TOP = 'top';
export const LOGOUT_LABEL = 'ログアウト';
export const TOGGLE_SIDEBAR_ARIA_LABEL = 'メニューを開閉';
export const LOGO_ALT = 'EC ChatBot';
export const DEFAULT_PAGE_TITLE = '管理画面';
export const TITLE_SMS_LIST = 'SMS一覧';
export const TITLE_PUSH_MESSAGE = 'プッシュメッセージ';
export const TITLE_BOT_DEMO = 'ボットデモ';
export const TITLE_EDIT_EMAIL = 'メール編集';

export const SIDER_WIDTH = 240;
export const SIDER_THEME_LIGHT = 'light';
export const MENU_MODE_INLINE = 'inline';

export const USER_ROLE_ADMIN_DEEL = 'admin_deel';
export const USER_ROLE_ADMIN_CLIENT = 'admin_client';
export const USER_ROLE_CLIENT = 'client';

export const HEADER_TITLE_CONTEXT_ERROR =
  'useAdminHeaderTitleContext must be used within AdminHeaderTitleProvider';
export const HEADER_ACTIONS_CONTEXT_ERROR =
  'useAdminHeaderActionsContext must be used within AdminHeaderActionsProvider';
export const HEADER_ACTIONS_HOOK_ERROR =
  'useAdminHeaderActions must be used within AdminHeaderActionsProvider';

export const MENU_ID_HOME = 'sidebarHome';
export const MENU_ID_CLIENT = 'sidebarClient';
export const MENU_ID_USER = 'sidebarUser';
export const MENU_ID_PLAN = 'planManagement';
export const MENU_ID_SCENARIO_TEMPLATE = 'scenarioTemplateManagement';
export const MENU_ID_ORDER_CONFIRM_TEMPLATE = 'orderConfirmMessageTemplateManagement';
export const MENU_ID_CLIENT_PAYMENT = 'clientPaymentDetail';

export const ADMIN_PATHS = {
  DASHBOARD: '/dashboard',
  CLIENT_MANAGEMENT: '/client-management',
  USER_MANAGEMENT: '/user-management',
  PLAN_MANAGEMENT: '/plan-management',
  CLIENT_PAYMENT_DETAIL: '/client-payment-detail',
  BOT: '/bot',
  SCENARIO_LIST: '/scenario-list',
  SCENARIO_SETTING: '/scenario-setting',
  SCENARIO_TEMPLATE_LIST: '/scenario-template-list',
  SCENARIO_TEMPLATE_SETTING: '/scenario-template-setting',
  ORDER_CONFIRM_TEMPLATE_LIST: '/order-confirm-template-list',
  ORDER_CONFIRM_TEMPLATE_SETTING: '/order-confirm-template-setting',
  LIST_EMAIL: '/list-email',
  CREATE_EMAIL: '/create-email',
  EDIT_EMAIL: '/edit-email',
  FILE_MANAGEMENT: '/file-management',
  SUB_USER: '/sub-user',
  VARIABLE_MANAGEMENT: '/variable-management',
  INSTALLATION_TAG_DEMO: '/installation-tag-demo',
  DESIGN_SETTING: '/design-setting',
  REPORT: '/report',
  BOT_CHAT_LOG: '/bot-chat-log',
  PAYMENT_MANAGEMENT: '/payment-management',
  PAYMENT_GATEWAY: '/payment-gateway',
  ADD_PAYMENT_GATEWAY: '/add-payment-gateway',
  EDIT_PAYMENT_GATEWAY: '/edit-payment-gateway',
  WITHDRAWAL_PREVENTION: '/withdrawal-prevention',
  CRM: '/crm',
  BASIC_SETTING: '/basic-setting',
  REPLY_MAIL_MANAGEMENT: '/reply-mail-management',
  CHATBOT: '/chatbot',
  KEYWORD: '/keyword',
  RELEASE: '/release',
  DATA: '/data',
  DATA_ANALYST: '/data-analyst',
  LIST_USER: '/list-user',
  ATTRACTED_CUSTOMER: '/attracted-customer',
  ADD_BOT_MANAGEMENT: '/add-bot-management',
  ADD_SUB_USER: '/add-sub-user',
  ACCOUNT_INFORMATION: '/account-information',
  BOT_SETTINGS: '/bot-settings',
  DEMO_BOT: '/demo-bot',
};

export const SMS_TEMPLATE_SEGMENT = 'sms-template';
export const PUSH_MESSAGE_SEGMENT = 'push-message';
export const SMS_TEMPLATE_ROUTE = `${ADMIN_PATHS.BOT_SETTINGS}/:botId/${SMS_TEMPLATE_SEGMENT}`;
export const PUSH_MESSAGE_ROUTE = `${ADMIN_PATHS.BOT_SETTINGS}/:botId/${PUSH_MESSAGE_SEGMENT}`;

export const MENU_LABELS = {
  BOT_SETTINGS: 'ボット設定',
  SCENARIO_SETTINGS: 'シナリオ設定',
  SCENARIO_LIST: 'シナリオ一覧',
  EMAIL_SETTINGS: 'メール設定',
  CREATE_EMAIL: 'メール作成',
  LIST_EMAIL: 'メール一覧',
  SMS: 'SMS',
  FILE_MANAGEMENT: 'メディアファイル管理',
  SUB_USER: 'サブユーザ管理',
  PUSH_MESSAGE: 'プッシュメッセージ',
  VARIABLE_MANAGEMENT: '変数管理',
  INSTALLATION_TAG: '設定タグ＆デモ',
  DESIGN_SETTING: 'デザイン設定',
  REPORT: 'レポート',
  BOT_CHAT_LOG: '会話',
  PAYMENT_MANAGEMENT: '決済管理',
  PAYMENT_GATEWAY: 'ペイメントゲートウェイ',
  WITHDRAWAL_PREVENTION: '離脱防止',
  HOME: 'ホーム',
  INSTAGRAM_CHATBOT: 'Instagramチャットボット',
  CHATBOT_CREATE: 'チャットボット作成',
  KEYWORD: 'キーワード設定',
  RELEASE: 'リリース',
  DATA_ANALYSIS: 'データ分析',
  SUMMARY: 'サマリー',
  USER_LIST: 'ユーザー一覧',
  ATTRACTED_CUSTOMER: '集客',
  CRM: 'CRM',
  WEB_CHATBOT: 'Webチャットボット',
  BASIC_SETTING: '基本設定',
  REPLY_MAIL: '送信メール管理',
  BOT_LIST: 'ボット一覧',
  SCENARIO_TEMPLATE: 'シナリオテンプレート',
  ORDER_CONFIRM_TEMPLATE: '注文確認メッセージテンプレート',
  CLIENT_MANAGEMENT: 'クライアント管理',
  USER_MANAGEMENT: 'ユーザー管理',
  PLAN_MANAGEMENT: 'プラン管理',
  PAYMENT_HISTORY: '支払い履歴',
  BOT_MANAGEMENT: 'ボット管理',
  SCENARIO_SETTING: 'シナリオ設定',
  SCENARIO_TEMPLATE_LIST: 'シナリオテンプレート一覧',
  SCENARIO_TEMPLATE_SETTING: 'シナリオテンプレート設定',
  ORDER_CONFIRM_TEMPLATE_LIST: '注文確認メッセージテンプレート一覧',
  ORDER_CONFIRM_TEMPLATE_SETTING: '注文確認メッセージテンプレート設定',
  PAYMENT_GATEWAY_LIST: '決済ゲートウェイ一覧',
  ADD_PAYMENT_GATEWAY: '決済ゲートウェイ追加',
  EDIT_PAYMENT_GATEWAY: '決済ゲートウェイ編集',
  ADD_BOT: 'ボット追加',
  INVITE_SUB_USER: 'サブユーザー招待',
  INSTALLATION_GUIDE: '設定ガイドとデモ',
};

export const MENU_KEYS = {
  BOT_SETTINGS: 'bot-settings',
  SCENARIO_GROUP: 'scenario-group',
  EMAIL_GROUP: 'email-group',
  INSTAGRAM: 'instagram',
  DATA_GROUP: 'data-group',
  WEB_CHATBOT: 'web-chatbot',
};

export const INSTAGRAM_ROLE_PATHS = [
  ADMIN_PATHS.CHATBOT,
  ADMIN_PATHS.KEYWORD,
  ADMIN_PATHS.RELEASE,
  ADMIN_PATHS.DATA,
  ADMIN_PATHS.DATA_ANALYST,
  ADMIN_PATHS.LIST_USER,
  ADMIN_PATHS.ATTRACTED_CUSTOMER,
  ADMIN_PATHS.CRM,
];

export const WEB_ROLE_PATHS = [
  ADMIN_PATHS.BOT,
  ADMIN_PATHS.ACCOUNT_INFORMATION,
  ADMIN_PATHS.BASIC_SETTING,
  ADMIN_PATHS.REPLY_MAIL_MANAGEMENT,
  ADMIN_PATHS.SCENARIO_TEMPLATE_LIST,
  ADMIN_PATHS.SCENARIO_TEMPLATE_SETTING,
  ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_LIST,
  ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_SETTING,
];

export const getBotSmsTemplatePath = (botId) =>
  `${ADMIN_PATHS.BOT_SETTINGS}/${botId || EMPTY_VALUE}/${SMS_TEMPLATE_SEGMENT}`;

export const getBotPushMessagePath = (botId) =>
  `${ADMIN_PATHS.BOT_SETTINGS}/${botId || EMPTY_VALUE}/${PUSH_MESSAGE_SEGMENT}`;

export const ADMIN_VERSION_SWITCH_VARIANT = 'antd';

export const parseStoredClient = () => {
  try {
    return JSON.parse(localStorage.getItem(CLIENT_STORAGE_KEY));
  } catch {
    return null;
  }
};
