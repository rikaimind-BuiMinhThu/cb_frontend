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
import { getAdminRoutePath as p } from 'v2/variables/constants';

export function getBotMenuItems(botId) {
  const smsPath = p(`/bot-settings/${botId || ''}/sms-template`);
  const pushPath = p(`/bot-settings/${botId || ''}/push-message`);

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
            { key: p('/scenario-list'), label: 'シナリオ一覧', path: p('/scenario-list'), icon: <UnorderedListOutlined /> },
          ],
        },
        {
          key: 'email-group',
          label: 'メール設定',
          icon: <MailOutlined />,
          children: [
            { key: p('/create-email'), label: 'メール作成', path: p('/create-email'), icon: <FileAddOutlined /> },
            { key: p('/list-email'), label: 'メール一覧', path: p('/list-email'), icon: <MailOutlined /> },
          ],
        },
        { key: smsPath, label: 'SMS', path: smsPath, icon: <MessageOutlined /> },
        { key: p('/file-management'), label: 'メディアファイル管理', path: p('/file-management'), icon: <FileOutlined /> },
        { key: p('/sub-user'), label: 'サブユーザ管理', path: p('/sub-user'), icon: <UserSwitchOutlined /> },
        { key: pushPath, label: 'プッシュメッセージ', path: pushPath, icon: <NotificationOutlined /> },
        { key: p('/variable-management'), label: '変数管理', path: p('/variable-management'), icon: <BarChartOutlined /> },
        { key: p('/installation-tag-demo'), label: '設定タグ＆デモ', path: p('/installation-tag-demo'), icon: <DownloadOutlined /> },
        { key: p('/design-setting'), label: 'デザイン設定', path: p('/design-setting'), icon: <FormatPainterOutlined /> },
        { key: p('/report'), label: 'レポート', path: p('/report'), icon: <LineChartOutlined /> },
        { key: p('/bot-chat-log'), label: '会話', path: p('/bot-chat-log'), icon: <CommentOutlined /> },
        { key: p('/payment-management'), label: '決済管理', path: p('/payment-management'), icon: <CreditCardOutlined /> },
        { key: p('/payment-gateway'), label: 'ペイメントゲートウェイ', path: p('/payment-gateway'), icon: <CloudServerOutlined /> },
        { key: p('/withdrawal-prevention'), label: '離脱防止', path: p('/withdrawal-prevention'), icon: <DesktopOutlined /> },
      ],
    },
  ];
}

export function getGlobalMenuItems(client) {
  const items = [];

  items.push({
    key: p('/dashboard'),
    label: 'ホーム',
    path: p('/dashboard'),
    icon: <HomeOutlined />,
    id: 'sidebarHome',
  });

  if (client?.is_instagram) {
    items.push({
      key: 'instagram',
      label: 'Instagramチャットボット',
      icon: <InstagramOutlined />,
      children: [
        { key: p('/chatbot'), label: 'チャットボット作成', path: p('/chatbot'), icon: <RobotOutlined /> },
        { key: p('/keyword'), label: 'キーワード設定', path: p('/keyword'), icon: <KeyOutlined /> },
        { key: p('/release'), label: 'リリース', path: p('/release'), icon: <RocketOutlined /> },
        {
          key: 'data-group',
          label: 'データ分析',
          icon: <PieChartOutlined />,
          children: [
            { key: p('/data-analyst'), label: 'サマリー', path: p('/data-analyst'), icon: <BulbOutlined /> },
            { key: p('/list-user'), label: 'ユーザー一覧', path: p('/list-user'), icon: <UnorderedListOutlined /> },
            { key: p('/attracted-customer'), label: '集客', path: p('/attracted-customer'), icon: <TeamOutlined /> },
          ],
        },
        { key: p('/crm'), label: 'CRM', path: p('/crm'), icon: <UsergroupAddOutlined /> },
      ],
    });
  }

  if (client?.is_web) {
    items.push({
      key: 'web-chatbot',
      label: 'Webチャットボット',
      icon: <SettingOutlined />,
      children: [
        { key: p('/basic-setting'), label: '基本設定', path: p('/basic-setting'), icon: <BookOutlined /> },
        { key: p('/reply-mail-management'), label: '送信メール管理', path: p('/reply-mail-management'), icon: <MailOutlined /> },
        { key: p('/bot'), label: 'ボット一覧', path: p('/bot'), icon: <UnorderedListOutlined /> },
        {
          key: p('/scenario-template-list'),
          label: 'シナリオテンプレート',
          path: p('/scenario-template-list'),
          icon: <BookOutlined />,
          id: 'scenarioTemplateManagement',
        },
        {
          key: p('/order-confirm-template-list'),
          label: '注文確認メッセージテンプレート',
          path: p('/order-confirm-template-list'),
          icon: <BookOutlined />,
          id: 'orderConfirmMessageTemplateManagement',
        },
      ],
    });
  }

  items.push(
    { key: p('/client-management'), label: 'クライアント管理', path: p('/client-management'), icon: <UserOutlined />, id: 'sidebarClient' },
    { key: p('/user-management'), label: 'ユーザー管理', path: p('/user-management'), icon: <TeamOutlined />, id: 'sidebarUser' },
    { key: p('/plan-management'), label: 'プラン管理', path: p('/plan-management'), icon: <SettingOutlined />, id: 'planManagement' },
    { key: p('/client-payment-detail'), label: '支払い履歴', path: p('/client-payment-detail'), icon: <DollarOutlined />, id: 'clientPaymentDetail', hiddenByDefault: true },
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
    hiddenIds.add('sidebarHome');
    hiddenIds.add('sidebarClient');
    hiddenIds.add('sidebarUser');
    hiddenIds.add('planManagement');
    hiddenIds.add('scenarioTemplateManagement');
    hiddenIds.add('orderConfirmMessageTemplateManagement');
  } else if (userRole === 'client') {
    hiddenIds.add('sidebarHome');
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
  [p('/dashboard')]: 'ホーム',
  [p('/client-management')]: 'クライアント管理',
  [p('/user-management')]: 'ユーザー管理',
  [p('/plan-management')]: 'プラン管理',
  [p('/client-payment-detail')]: '支払い履歴',
  [p('/bot')]: 'ボット管理',
  [p('/scenario-list')]: 'シナリオ一覧',
  [p('/scenario-setting')]: 'シナリオ設定',
  [p('/scenario-template-list')]: 'シナリオテンプレート一覧',
  [p('/scenario-template-setting')]: 'シナリオテンプレート設定',
  [p('/order-confirm-template-list')]: '注文確認メッセージテンプレート一覧',
  [p('/order-confirm-template-setting')]: '注文確認メッセージテンプレート設定',
  [p('/list-email')]: 'メール一覧',
  [p('/create-email')]: 'メール作成',
  [p('/file-management')]: 'メディアファイル管理',
  [p('/sub-user')]: 'サブユーザ管理',
  [p('/variable-management')]: '変数管理',
  [p('/installation-tag-demo')]: '設定ガイドとデモ',
  [p('/design-setting')]: 'デザイン設定',
  [p('/report')]: 'レポート',
  [p('/bot-chat-log')]: '会話',
  [p('/payment-management')]: '決済管理',
  [p('/payment-gateway')]: '決済ゲートウェイ一覧',
  [p('/add-payment-gateway')]: '決済ゲートウェイ追加',
  [p('/edit-payment-gateway')]: '決済ゲートウェイ編集',
  [p('/withdrawal-prevention')]: '離脱防止',
  [p('/crm')]: 'CRM',
  [p('/basic-setting')]: '基本設定',
  [p('/reply-mail-management')]: '送信メール管理',
  [p('/chatbot')]: 'チャットボット作成',
  [p('/keyword')]: 'キーワード設定',
  [p('/release')]: 'リリース',
  [p('/data-analyst')]: 'サマリー',
  [p('/list-user')]: 'ユーザー一覧',
  [p('/attracted-customer')]: '集客',
  [p('/add-bot-management')]: 'ボット追加',
  [p('/add-sub-user')]: 'サブユーザー招待',
};

/** Routes not listed in the sidebar map to a related menu path for selection/open state. */
export const MENU_ROUTE_ALIASES = [
  { match: p('/scenario-setting'), menuPath: p('/scenario-list') },
  { match: p('/scenario-template-setting'), menuPath: p('/scenario-template-list') },
  { match: p('/order-confirm-template-setting'), menuPath: p('/order-confirm-template-list') },
  { match: p('/edit-email'), menuPath: p('/create-email'), prefix: true },
  { match: p('/demo-bot'), menuPath: p('/installation-tag-demo'), prefix: true },
  { match: p('/add-payment-gateway'), menuPath: p('/payment-gateway'), prefix: true },
  { match: p('/edit-payment-gateway'), menuPath: p('/payment-gateway'), prefix: true },
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
  p('/scenario-list'),
  p('/scenario-setting'),
  p('/create-email'),
  p('/edit-email'),
  p('/list-email'),
  p('/file-management'),
  p('/sub-user'),
  `${p('/bot-settings')}/`,
  p('/variable-management'),
  p('/installation-tag-demo'),
  p('/design-setting'),
  p('/report'),
  p('/bot-chat-log'),
  p('/payment-management'),
  p('/payment-gateway'),
  p('/add-payment-gateway'),
  p('/edit-payment-gateway'),
  p('/withdrawal-prevention'),
  p('/demo-bot'),
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
