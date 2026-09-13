import React from 'react';
import {
  InstagramOutlined,
  RobotOutlined,
  KeyOutlined,
  RocketOutlined,
  PieChartOutlined,
  BulbOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  BookOutlined,
  MailOutlined,
  FileAddOutlined,
  MessageOutlined,
  FileOutlined,
  UserSwitchOutlined,
  NotificationOutlined,
  BarChartOutlined,
  DownloadOutlined,
  FormatPainterOutlined,
  LineChartOutlined,
  CommentOutlined,
  CreditCardOutlined,
  CloudServerOutlined,
  DesktopOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
} from '@ant-design/icons';

export function getBotMenuItems(botId) {
  const smsPath = `/admin/bot-settings/${botId || ''}/sms-template`;
  const pushPath = `/admin/bot-settings/${botId || ''}/push-message`;

  return [
    {
      key: 'bot-settings',
      label: 'ボット設定',
      icon: <SettingOutlined />,
      children: [
        {
          key: 'scenario-group',
          label: 'シナリオ設定',
          icon: <BookOutlined />,
          children: [
            { key: '/admin/scenario-list', label: 'シナリオ一覧', path: '/admin/scenario-list', icon: <UnorderedListOutlined /> },
          ],
        },
        {
          key: 'email-group',
          label: 'メール設定',
          icon: <MailOutlined />,
          children: [
            { key: '/admin/create-email', label: 'メール作成', path: '/admin/create-email', icon: <FileAddOutlined /> },
            { key: '/admin/list-email', label: 'メール一覧', path: '/admin/list-email', icon: <MailOutlined /> },
          ],
        },
        { key: smsPath, label: 'SMS', path: smsPath, icon: <MessageOutlined /> },
        { key: '/admin/file-management', label: 'メディアファイル管理', path: '/admin/file-management', icon: <FileOutlined /> },
        { key: '/admin/sub-user', label: 'サブユーザ管理', path: '/admin/sub-user', icon: <UserSwitchOutlined /> },
        { key: pushPath, label: 'プッシュメッセージ', path: pushPath, icon: <NotificationOutlined /> },
        { key: '/admin/variable-management', label: '変数管理', path: '/admin/variable-management', icon: <BarChartOutlined /> },
        { key: '/admin/installation-tag-demo', label: '設定タグ＆デモ', path: '/admin/installation-tag-demo', icon: <DownloadOutlined /> },
        { key: '/admin/design-setting', label: 'デザイン設定', path: '/admin/design-setting', icon: <FormatPainterOutlined /> },
        { key: '/admin/report', label: 'レポート', path: '/admin/report', icon: <LineChartOutlined /> },
        { key: '/admin/bot-chat-log', label: '会話', path: '/admin/bot-chat-log', icon: <CommentOutlined /> },
        { key: '/admin/payment-management', label: '決済管理', path: '/admin/payment-management', icon: <CreditCardOutlined /> },
        { key: '/admin/payment-gateway', label: 'ペイメントゲートウェイ', path: '/admin/payment-gateway', icon: <CloudServerOutlined /> },
        { key: '/admin/withdrawal-prevention', label: '離脱防止', path: '/admin/withdrawal-prevention', icon: <DesktopOutlined /> },
      ],
    },
  ];
}

export function getGlobalMenuItems(client) {
  const items = [];

  if (client?.is_instagram) {
    items.push({
      key: 'instagram',
      label: 'Instagram Chatbot',
      icon: <InstagramOutlined />,
      children: [
        { key: '/admin/chatbot', label: 'チャットボット作成', path: '/admin/chatbot', icon: <RobotOutlined /> },
        { key: '/admin/keyword', label: 'キーワード設定', path: '/admin/keyword', icon: <KeyOutlined /> },
        { key: '/admin/release', label: 'リリース', path: '/admin/release', icon: <RocketOutlined /> },
        {
          key: 'data-group',
          label: 'データ分析',
          icon: <PieChartOutlined />,
          children: [
            { key: '/admin/data-analyst', label: 'サマリー', path: '/admin/data-analyst', icon: <BulbOutlined /> },
            { key: '/admin/list-user', label: 'ユーザー一覧', path: '/admin/list-user', icon: <UnorderedListOutlined /> },
            { key: '/admin/attracted-customer', label: '集客', path: '/admin/attracted-customer', icon: <TeamOutlined /> },
          ],
        },
        { key: '/admin/crm', label: 'CRM', path: '/admin/crm', icon: <UsergroupAddOutlined /> },
      ],
    });
  }

  if (client?.is_web) {
    items.push({
      key: 'web-chatbot',
      label: 'Web Chatbot',
      icon: <SettingOutlined />,
      children: [
        { key: '/admin/basic-setting', label: '基本設定', path: '/admin/basic-setting', icon: <BookOutlined /> },
        { key: '/admin/reply-mail-management', label: '送信メール管理', path: '/admin/reply-mail-management', icon: <MailOutlined /> },
        { key: '/admin/bot', label: 'ボット一覧', path: '/admin/bot', icon: <UnorderedListOutlined /> },
        {
          key: '/admin/scenario-template-list',
          label: 'シナリオテンプレート',
          path: '/admin/scenario-template-list',
          icon: <BookOutlined />,
          id: 'scenarioTemplateManagement',
        },
        {
          key: '/admin/order-confirm-template-list',
          label: '注文確認メッセージテンプレート',
          path: '/admin/order-confirm-template-list',
          icon: <BookOutlined />,
          id: 'orderConfirmMessageTemplateManagement',
        },
      ],
    });
  }

  items.push(
    { key: '/admin/client-management', label: 'クライアント管理', path: '/admin/client-management', icon: <UserOutlined />, id: 'sidebarClient' },
    { key: '/admin/user-management', label: 'ユーザー管理', path: '/admin/user-management', icon: <TeamOutlined />, id: 'sidebarUser' },
    { key: '/admin/plan-management', label: 'プラン管理', path: '/admin/plan-management', icon: <SettingOutlined />, id: 'planManagement' },
    { key: '/admin/client-payment-detail', label: 'Payment History', path: '/admin/client-payment-detail', icon: <DollarOutlined />, id: 'clientPaymentDetail', hiddenByDefault: true },
    { key: '/admin/dashboard', label: 'ホーム', path: '/admin/dashboard', icon: <HomeOutlined /> },
  );

  return items;
}

function filterMenuItemsByRole(items, hiddenIds, userRole) {
  return items
    .filter((item) => {
      if (item.id && hiddenIds.has(item.id)) return false;
      if (item.hiddenByDefault && userRole === 'admin_deel') return false;
      if (item.hiddenByDefault && userRole !== 'admin_deel') return true;
      if (item.hiddenByDefault) return false;
      return true;
    })
    .map((item) => (
      item.children
        ? { ...item, children: filterMenuItemsByRole(item.children, hiddenIds, userRole) }
        : item
    ));
}

export function filterMenuByRole(items, userRole) {
  const hiddenIds = new Set();

  if (userRole === 'admin_deel') {
    hiddenIds.add('clientPaymentDetail');
  } else if (userRole === 'admin_client') {
    hiddenIds.add('sidebarClient');
    hiddenIds.add('sidebarUser');
    hiddenIds.add('planManagement');
    hiddenIds.add('scenarioTemplateManagement');
    hiddenIds.add('orderConfirmMessageTemplateManagement');
  } else if (userRole === 'client') {
    hiddenIds.add('sidebarClient');
    hiddenIds.add('sidebarUser');
    hiddenIds.add('planManagement');
    hiddenIds.add('scenarioTemplateManagement');
    hiddenIds.add('orderConfirmMessageTemplateManagement');
    hiddenIds.add('clientPaymentDetail');
  }

  return filterMenuItemsByRole(items, hiddenIds, userRole);
}

export const ROUTE_TITLES = {
  '/admin/dashboard': 'ホーム',
  '/admin/client-management': 'クライアント管理',
  '/admin/user-management': 'ユーザー管理',
  '/admin/plan-management': 'プラン管理',
  '/admin/client-payment-detail': 'Payment History',
  '/admin/data-analyst': 'サマリー',
  '/admin/list-user': 'ユーザー一覧',
  '/admin/chatbot': 'チャットボット作成',
  '/admin/bot': 'ボット管理',
  '/admin/scenario-list': 'シナリオ一覧',
  '/admin/scenario-setting': 'シナリオ設定',
  '/admin/scenario-template-list': 'シナリオテンプレート一覧',
  '/admin/scenario-template-setting': 'シナリオテンプレート設定',
  '/admin/order-confirm-template-list': '注文確認メッセージテンプレート一覧',
  '/admin/order-confirm-template-setting': '注文確認メッセージテンプレート設定',
  '/admin/list-email': 'メール一覧',
  '/admin/create-email': 'メール作成',
  '/admin/file-management': 'メディアファイル管理',
  '/admin/sub-user': 'サブユーザ管理',
  '/admin/variable-management': '変数管理',
  '/admin/installation-tag-demo': '設定ガイドとデモ',
  '/admin/design-setting': 'デザイン設定',
  '/admin/report': 'レポート',
  '/admin/bot-chat-log': '会話',
  '/admin/payment-management': '決済管理',
  '/admin/payment-gateway': '決済ゲートウェイ一覧',
  '/admin/add-payment-gateway': '決済ゲートウェイ追加',
  '/admin/edit-payment-gateway': '決済ゲートウェイ編集',
  '/admin/withdrawal-prevention': '離脱防止',
  '/admin/crm': 'CRM',
};

/** Routes not listed in the sidebar map to a related menu path for selection/open state. */
export const MENU_ROUTE_ALIASES = [
  { match: '/admin/scenario-setting', menuPath: '/admin/scenario-list' },
  { match: '/admin/scenario-template-setting', menuPath: '/admin/scenario-template-list' },
  { match: '/admin/order-confirm-template-setting', menuPath: '/admin/order-confirm-template-list' },
  { match: '/admin/edit-email', menuPath: '/admin/create-email', prefix: true },
  { match: '/admin/demo-bot', menuPath: '/admin/installation-tag-demo', prefix: true },
  { match: '/admin/add-payment-gateway', menuPath: '/admin/payment-gateway', prefix: true },
  { match: '/admin/edit-payment-gateway', menuPath: '/admin/payment-gateway', prefix: true },
];

export function resolveMenuPath(pathname) {
  for (const alias of MENU_ROUTE_ALIASES) {
    if (alias.prefix) {
      if (pathname === alias.match || pathname.startsWith(`${alias.match}/`)) {
        return alias.menuPath;
      }
      continue;
    }
    if (pathname === alias.match) {
      return alias.menuPath;
    }
  }
  return pathname;
}

const BOT_MENU_PATH_PREFIXES = [
  '/admin/scenario-list',
  '/admin/scenario-setting',
  '/admin/create-email',
  '/admin/edit-email',
  '/admin/list-email',
  '/admin/file-management',
  '/admin/sub-user',
  '/admin/bot-settings/',
  '/admin/variable-management',
  '/admin/installation-tag-demo',
  '/admin/design-setting',
  '/admin/report',
  '/admin/bot-chat-log',
  '/admin/payment-management',
  '/admin/payment-gateway',
  '/admin/add-payment-gateway',
  '/admin/edit-payment-gateway',
  '/admin/withdrawal-prevention',
  '/admin/demo-bot',
];

export function isBotMenuRoute(pathname) {
  return BOT_MENU_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function getPageTitle(pathname) {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.includes('/sms-template')) return 'SMS一覧';
  if (pathname.includes('/push-message')) return 'プッシュメッセージ';
  if (pathname.includes('/demo-bot')) return 'ボットデモ';
  if (pathname.includes('/edit-email')) return 'メール編集';
  return '管理画面';
}
