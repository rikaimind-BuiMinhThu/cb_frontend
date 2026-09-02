import React from 'react';
import {
  BarChartOutlined,
  BookOutlined,
  BulbOutlined,
  CloudServerOutlined,
  CommentOutlined,
  CreditCardOutlined,
  DesktopOutlined,
  DollarOutlined,
  DownloadOutlined,
  FileAddOutlined,
  FileOutlined,
  FormatPainterOutlined,
  HomeOutlined,
  InstagramOutlined,
  KeyOutlined,
  LineChartOutlined,
  MailOutlined,
  MessageOutlined,
  NotificationOutlined,
  PieChartOutlined,
  RobotOutlined,
  RocketOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { getAdminRoutePath as p } from 'v2/variables/constants';
import {
  ADMIN_PATHS,
  DEFAULT_PAGE_TITLE,
  getBotPushMessagePath,
  getBotSmsTemplatePath,
  MENU_ID_CLIENT,
  MENU_ID_CLIENT_PAYMENT,
  MENU_ID_HOME,
  MENU_ID_ORDER_CONFIRM_TEMPLATE,
  MENU_ID_PLAN,
  MENU_ID_SCENARIO_TEMPLATE,
  MENU_ID_USER,
  MENU_KEYS,
  MENU_LABELS,
  PUSH_MESSAGE_SEGMENT,
  SMS_TEMPLATE_SEGMENT,
  TITLE_BOT_DEMO,
  TITLE_EDIT_EMAIL,
  TITLE_PUSH_MESSAGE,
  TITLE_SMS_LIST,
  USER_ROLE_ADMIN_CLIENT,
  USER_ROLE_ADMIN_DEEL,
  USER_ROLE_CLIENT,
} from './constants';

export const getBotMenuItems = (botId) => {
  const smsPath = p(getBotSmsTemplatePath(botId));
  const pushPath = p(getBotPushMessagePath(botId));

  return [
    {
      key: MENU_KEYS.BOT_SETTINGS,
      label: MENU_LABELS.BOT_SETTINGS,
      icon: <SettingOutlined />,
      children: [
        {
          key: MENU_KEYS.SCENARIO_GROUP,
          label: MENU_LABELS.SCENARIO_SETTINGS,
          icon: <BookOutlined />,
          children: [
            {
              key: p(ADMIN_PATHS.SCENARIO_LIST),
              label: MENU_LABELS.SCENARIO_LIST,
              path: p(ADMIN_PATHS.SCENARIO_LIST),
              icon: <UnorderedListOutlined />,
            },
          ],
        },
        {
          key: MENU_KEYS.EMAIL_GROUP,
          label: MENU_LABELS.EMAIL_SETTINGS,
          icon: <MailOutlined />,
          children: [
            {
              key: p(ADMIN_PATHS.CREATE_EMAIL),
              label: MENU_LABELS.CREATE_EMAIL,
              path: p(ADMIN_PATHS.CREATE_EMAIL),
              icon: <FileAddOutlined />,
            },
            {
              key: p(ADMIN_PATHS.LIST_EMAIL),
              label: MENU_LABELS.LIST_EMAIL,
              path: p(ADMIN_PATHS.LIST_EMAIL),
              icon: <MailOutlined />,
            },
          ],
        },
        { key: smsPath, label: MENU_LABELS.SMS, path: smsPath, icon: <MessageOutlined /> },
        {
          key: p(ADMIN_PATHS.FILE_MANAGEMENT),
          label: MENU_LABELS.FILE_MANAGEMENT,
          path: p(ADMIN_PATHS.FILE_MANAGEMENT),
          icon: <FileOutlined />,
        },
        {
          key: p(ADMIN_PATHS.SUB_USER),
          label: MENU_LABELS.SUB_USER,
          path: p(ADMIN_PATHS.SUB_USER),
          icon: <UserSwitchOutlined />,
        },
        { key: pushPath, label: MENU_LABELS.PUSH_MESSAGE, path: pushPath, icon: <NotificationOutlined /> },
        {
          key: p(ADMIN_PATHS.VARIABLE_MANAGEMENT),
          label: MENU_LABELS.VARIABLE_MANAGEMENT,
          path: p(ADMIN_PATHS.VARIABLE_MANAGEMENT),
          icon: <BarChartOutlined />,
        },
        {
          key: p(ADMIN_PATHS.INSTALLATION_TAG_DEMO),
          label: MENU_LABELS.INSTALLATION_TAG,
          path: p(ADMIN_PATHS.INSTALLATION_TAG_DEMO),
          icon: <DownloadOutlined />,
        },
        {
          key: p(ADMIN_PATHS.DESIGN_SETTING),
          label: MENU_LABELS.DESIGN_SETTING,
          path: p(ADMIN_PATHS.DESIGN_SETTING),
          icon: <FormatPainterOutlined />,
        },
        {
          key: p(ADMIN_PATHS.REPORT),
          label: MENU_LABELS.REPORT,
          path: p(ADMIN_PATHS.REPORT),
          icon: <LineChartOutlined />,
        },
        {
          key: p(ADMIN_PATHS.BOT_CHAT_LOG),
          label: MENU_LABELS.BOT_CHAT_LOG,
          path: p(ADMIN_PATHS.BOT_CHAT_LOG),
          icon: <CommentOutlined />,
        },
        {
          key: p(ADMIN_PATHS.PAYMENT_MANAGEMENT),
          label: MENU_LABELS.PAYMENT_MANAGEMENT,
          path: p(ADMIN_PATHS.PAYMENT_MANAGEMENT),
          icon: <CreditCardOutlined />,
        },
        {
          key: p(ADMIN_PATHS.PAYMENT_GATEWAY),
          label: MENU_LABELS.PAYMENT_GATEWAY,
          path: p(ADMIN_PATHS.PAYMENT_GATEWAY),
          icon: <CloudServerOutlined />,
        },
        {
          key: p(ADMIN_PATHS.WITHDRAWAL_PREVENTION),
          label: MENU_LABELS.WITHDRAWAL_PREVENTION,
          path: p(ADMIN_PATHS.WITHDRAWAL_PREVENTION),
          icon: <DesktopOutlined />,
        },
      ],
    },
  ];
};

export const getGlobalMenuItems = (client) => {
  const homeItem = {
    key: p(ADMIN_PATHS.DASHBOARD),
    label: MENU_LABELS.HOME,
    path: p(ADMIN_PATHS.DASHBOARD),
    icon: <HomeOutlined />,
    id: MENU_ID_HOME,
  };

  const instagramItems = client?.is_instagram
    ? [{
        key: MENU_KEYS.INSTAGRAM,
        label: MENU_LABELS.INSTAGRAM_CHATBOT,
        icon: <InstagramOutlined />,
        children: [
          {
            key: p(ADMIN_PATHS.CHATBOT),
            label: MENU_LABELS.CHATBOT_CREATE,
            path: p(ADMIN_PATHS.CHATBOT),
            icon: <RobotOutlined />,
          },
          {
            key: p(ADMIN_PATHS.KEYWORD),
            label: MENU_LABELS.KEYWORD,
            path: p(ADMIN_PATHS.KEYWORD),
            icon: <KeyOutlined />,
          },
          {
            key: p(ADMIN_PATHS.RELEASE),
            label: MENU_LABELS.RELEASE,
            path: p(ADMIN_PATHS.RELEASE),
            icon: <RocketOutlined />,
          },
          {
            key: MENU_KEYS.DATA_GROUP,
            label: MENU_LABELS.DATA_ANALYSIS,
            icon: <PieChartOutlined />,
            children: [
              {
                key: p(ADMIN_PATHS.DATA_ANALYST),
                label: MENU_LABELS.SUMMARY,
                path: p(ADMIN_PATHS.DATA_ANALYST),
                icon: <BulbOutlined />,
              },
              {
                key: p(ADMIN_PATHS.LIST_USER),
                label: MENU_LABELS.USER_LIST,
                path: p(ADMIN_PATHS.LIST_USER),
                icon: <UnorderedListOutlined />,
              },
              {
                key: p(ADMIN_PATHS.ATTRACTED_CUSTOMER),
                label: MENU_LABELS.ATTRACTED_CUSTOMER,
                path: p(ADMIN_PATHS.ATTRACTED_CUSTOMER),
                icon: <TeamOutlined />,
              },
            ],
          },
          {
            key: p(ADMIN_PATHS.CRM),
            label: MENU_LABELS.CRM,
            path: p(ADMIN_PATHS.CRM),
            icon: <UsergroupAddOutlined />,
          },
        ],
      }]
    : [];

  const webItems = client?.is_web
    ? [{
        key: MENU_KEYS.WEB_CHATBOT,
        label: MENU_LABELS.WEB_CHATBOT,
        icon: <SettingOutlined />,
        children: [
          {
            key: p(ADMIN_PATHS.BASIC_SETTING),
            label: MENU_LABELS.BASIC_SETTING,
            path: p(ADMIN_PATHS.BASIC_SETTING),
            icon: <BookOutlined />,
          },
          {
            key: p(ADMIN_PATHS.REPLY_MAIL_MANAGEMENT),
            label: MENU_LABELS.REPLY_MAIL,
            path: p(ADMIN_PATHS.REPLY_MAIL_MANAGEMENT),
            icon: <MailOutlined />,
          },
          {
            key: p(ADMIN_PATHS.BOT),
            label: MENU_LABELS.BOT_LIST,
            path: p(ADMIN_PATHS.BOT),
            icon: <UnorderedListOutlined />,
          },
          {
            key: p(ADMIN_PATHS.SCENARIO_TEMPLATE_LIST),
            label: MENU_LABELS.SCENARIO_TEMPLATE,
            path: p(ADMIN_PATHS.SCENARIO_TEMPLATE_LIST),
            icon: <BookOutlined />,
            id: MENU_ID_SCENARIO_TEMPLATE,
          },
          {
            key: p(ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_LIST),
            label: MENU_LABELS.ORDER_CONFIRM_TEMPLATE,
            path: p(ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_LIST),
            icon: <BookOutlined />,
            id: MENU_ID_ORDER_CONFIRM_TEMPLATE,
          },
        ],
      }]
    : [];

  const managementItems = [
    {
      key: p(ADMIN_PATHS.CLIENT_MANAGEMENT),
      label: MENU_LABELS.CLIENT_MANAGEMENT,
      path: p(ADMIN_PATHS.CLIENT_MANAGEMENT),
      icon: <UserOutlined />,
      id: MENU_ID_CLIENT,
    },
    {
      key: p(ADMIN_PATHS.USER_MANAGEMENT),
      label: MENU_LABELS.USER_MANAGEMENT,
      path: p(ADMIN_PATHS.USER_MANAGEMENT),
      icon: <TeamOutlined />,
      id: MENU_ID_USER,
    },
    {
      key: p(ADMIN_PATHS.PLAN_MANAGEMENT),
      label: MENU_LABELS.PLAN_MANAGEMENT,
      path: p(ADMIN_PATHS.PLAN_MANAGEMENT),
      icon: <SettingOutlined />,
      id: MENU_ID_PLAN,
    },
    {
      key: p(ADMIN_PATHS.CLIENT_PAYMENT_DETAIL),
      label: MENU_LABELS.PAYMENT_HISTORY,
      path: p(ADMIN_PATHS.CLIENT_PAYMENT_DETAIL),
      icon: <DollarOutlined />,
      id: MENU_ID_CLIENT_PAYMENT,
      hiddenByDefault: true,
    },
  ];

  return [homeItem, ...instagramItems, ...webItems, ...managementItems];
};

const filterMenuItemsByRole = (items, hiddenIds, userRole) => items
  .filter((item) => {
    if (item.id && hiddenIds.has(item.id)) return false;
    if (item.hiddenByDefault && userRole === USER_ROLE_ADMIN_DEEL) return false;
    if (item.hiddenByDefault && userRole !== USER_ROLE_ADMIN_DEEL) return true;
    if (item.hiddenByDefault) return false;
    return true;
  })
  .map((item) => (
    item.children
      ? { ...item, children: filterMenuItemsByRole(item.children, hiddenIds, userRole) }
      : item
  ));

const hiddenIdsForRole = (userRole) => {
  switch (userRole) {
    case USER_ROLE_ADMIN_DEEL:
      return new Set([MENU_ID_CLIENT_PAYMENT]);
    case USER_ROLE_ADMIN_CLIENT:
      return new Set([
        MENU_ID_HOME,
        MENU_ID_CLIENT,
        MENU_ID_USER,
        MENU_ID_PLAN,
        MENU_ID_SCENARIO_TEMPLATE,
        MENU_ID_ORDER_CONFIRM_TEMPLATE,
      ]);
    case USER_ROLE_CLIENT:
      return new Set([
        MENU_ID_HOME,
        MENU_ID_CLIENT,
        MENU_ID_USER,
        MENU_ID_PLAN,
        MENU_ID_SCENARIO_TEMPLATE,
        MENU_ID_ORDER_CONFIRM_TEMPLATE,
        MENU_ID_CLIENT_PAYMENT,
      ]);
    default:
      return new Set();
  }
};

export const filterMenuByRole = (items, userRole) =>
  filterMenuItemsByRole(items, hiddenIdsForRole(userRole), userRole);

export const ROUTE_TITLES = {
  [p(ADMIN_PATHS.DASHBOARD)]: MENU_LABELS.HOME,
  [p(ADMIN_PATHS.CLIENT_MANAGEMENT)]: MENU_LABELS.CLIENT_MANAGEMENT,
  [p(ADMIN_PATHS.USER_MANAGEMENT)]: MENU_LABELS.USER_MANAGEMENT,
  [p(ADMIN_PATHS.PLAN_MANAGEMENT)]: MENU_LABELS.PLAN_MANAGEMENT,
  [p(ADMIN_PATHS.CLIENT_PAYMENT_DETAIL)]: MENU_LABELS.PAYMENT_HISTORY,
  [p(ADMIN_PATHS.BOT)]: MENU_LABELS.BOT_MANAGEMENT,
  [p(ADMIN_PATHS.SCENARIO_LIST)]: MENU_LABELS.SCENARIO_LIST,
  [p(ADMIN_PATHS.SCENARIO_SETTING)]: MENU_LABELS.SCENARIO_SETTING,
  [p(ADMIN_PATHS.SCENARIO_TEMPLATE_LIST)]: MENU_LABELS.SCENARIO_TEMPLATE_LIST,
  [p(ADMIN_PATHS.SCENARIO_TEMPLATE_SETTING)]: MENU_LABELS.SCENARIO_TEMPLATE_SETTING,
  [p(ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_LIST)]: MENU_LABELS.ORDER_CONFIRM_TEMPLATE_LIST,
  [p(ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_SETTING)]: MENU_LABELS.ORDER_CONFIRM_TEMPLATE_SETTING,
  [p(ADMIN_PATHS.LIST_EMAIL)]: MENU_LABELS.LIST_EMAIL,
  [p(ADMIN_PATHS.CREATE_EMAIL)]: MENU_LABELS.CREATE_EMAIL,
  [p(ADMIN_PATHS.FILE_MANAGEMENT)]: MENU_LABELS.FILE_MANAGEMENT,
  [p(ADMIN_PATHS.SUB_USER)]: MENU_LABELS.SUB_USER,
  [p(ADMIN_PATHS.VARIABLE_MANAGEMENT)]: MENU_LABELS.VARIABLE_MANAGEMENT,
  [p(ADMIN_PATHS.INSTALLATION_TAG_DEMO)]: MENU_LABELS.INSTALLATION_GUIDE,
  [p(ADMIN_PATHS.DESIGN_SETTING)]: MENU_LABELS.DESIGN_SETTING,
  [p(ADMIN_PATHS.REPORT)]: MENU_LABELS.REPORT,
  [p(ADMIN_PATHS.BOT_CHAT_LOG)]: MENU_LABELS.BOT_CHAT_LOG,
  [p(ADMIN_PATHS.PAYMENT_MANAGEMENT)]: MENU_LABELS.PAYMENT_MANAGEMENT,
  [p(ADMIN_PATHS.PAYMENT_GATEWAY)]: MENU_LABELS.PAYMENT_GATEWAY_LIST,
  [p(ADMIN_PATHS.ADD_PAYMENT_GATEWAY)]: MENU_LABELS.ADD_PAYMENT_GATEWAY,
  [p(ADMIN_PATHS.EDIT_PAYMENT_GATEWAY)]: MENU_LABELS.EDIT_PAYMENT_GATEWAY,
  [p(ADMIN_PATHS.WITHDRAWAL_PREVENTION)]: MENU_LABELS.WITHDRAWAL_PREVENTION,
  [p(ADMIN_PATHS.CRM)]: MENU_LABELS.CRM,
  [p(ADMIN_PATHS.BASIC_SETTING)]: MENU_LABELS.BASIC_SETTING,
  [p(ADMIN_PATHS.REPLY_MAIL_MANAGEMENT)]: MENU_LABELS.REPLY_MAIL,
  [p(ADMIN_PATHS.CHATBOT)]: MENU_LABELS.CHATBOT_CREATE,
  [p(ADMIN_PATHS.KEYWORD)]: MENU_LABELS.KEYWORD,
  [p(ADMIN_PATHS.RELEASE)]: MENU_LABELS.RELEASE,
  [p(ADMIN_PATHS.DATA_ANALYST)]: MENU_LABELS.SUMMARY,
  [p(ADMIN_PATHS.LIST_USER)]: MENU_LABELS.USER_LIST,
  [p(ADMIN_PATHS.ATTRACTED_CUSTOMER)]: MENU_LABELS.ATTRACTED_CUSTOMER,
  [p(ADMIN_PATHS.ADD_BOT_MANAGEMENT)]: MENU_LABELS.ADD_BOT,
  [p(ADMIN_PATHS.ADD_SUB_USER)]: MENU_LABELS.INVITE_SUB_USER,
};

export const MENU_ROUTE_ALIASES = [
  { match: p(ADMIN_PATHS.SCENARIO_SETTING), menuPath: p(ADMIN_PATHS.SCENARIO_LIST) },
  { match: p(ADMIN_PATHS.SCENARIO_TEMPLATE_SETTING), menuPath: p(ADMIN_PATHS.SCENARIO_TEMPLATE_LIST) },
  {
    match: p(ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_SETTING),
    menuPath: p(ADMIN_PATHS.ORDER_CONFIRM_TEMPLATE_LIST),
  },
  { match: p(ADMIN_PATHS.EDIT_EMAIL), menuPath: p(ADMIN_PATHS.CREATE_EMAIL), prefix: true },
  { match: p(ADMIN_PATHS.DEMO_BOT), menuPath: p(ADMIN_PATHS.INSTALLATION_TAG_DEMO), prefix: true },
  { match: p(ADMIN_PATHS.ADD_PAYMENT_GATEWAY), menuPath: p(ADMIN_PATHS.PAYMENT_GATEWAY), prefix: true },
  { match: p(ADMIN_PATHS.EDIT_PAYMENT_GATEWAY), menuPath: p(ADMIN_PATHS.PAYMENT_GATEWAY), prefix: true },
];

export const resolveMenuPath = (pathname) => {
  const alias = MENU_ROUTE_ALIASES.find((item) => (
    item.prefix
      ? pathname === item.match || pathname.startsWith(`${item.match}/`)
      : pathname === item.match
  ));
  return alias ? alias.menuPath : pathname;
};

const BOT_MENU_PATH_PREFIXES = [
  p(ADMIN_PATHS.SCENARIO_LIST),
  p(ADMIN_PATHS.SCENARIO_SETTING),
  p(ADMIN_PATHS.CREATE_EMAIL),
  p(ADMIN_PATHS.EDIT_EMAIL),
  p(ADMIN_PATHS.LIST_EMAIL),
  p(ADMIN_PATHS.FILE_MANAGEMENT),
  p(ADMIN_PATHS.SUB_USER),
  `${p(ADMIN_PATHS.BOT_SETTINGS)}/`,
  p(ADMIN_PATHS.VARIABLE_MANAGEMENT),
  p(ADMIN_PATHS.INSTALLATION_TAG_DEMO),
  p(ADMIN_PATHS.DESIGN_SETTING),
  p(ADMIN_PATHS.REPORT),
  p(ADMIN_PATHS.BOT_CHAT_LOG),
  p(ADMIN_PATHS.PAYMENT_MANAGEMENT),
  p(ADMIN_PATHS.PAYMENT_GATEWAY),
  p(ADMIN_PATHS.ADD_PAYMENT_GATEWAY),
  p(ADMIN_PATHS.EDIT_PAYMENT_GATEWAY),
  p(ADMIN_PATHS.WITHDRAWAL_PREVENTION),
  p(ADMIN_PATHS.DEMO_BOT),
];

export const isBotMenuRoute = (pathname) =>
  BOT_MENU_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const getPageTitle = (pathname) => {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.includes(`/${SMS_TEMPLATE_SEGMENT}`)) return TITLE_SMS_LIST;
  if (pathname.includes(`/${PUSH_MESSAGE_SEGMENT}`)) return TITLE_PUSH_MESSAGE;
  if (pathname.includes(ADMIN_PATHS.DEMO_BOT)) return TITLE_BOT_DEMO;
  if (pathname.includes(ADMIN_PATHS.EDIT_EMAIL)) return TITLE_EDIT_EMAIL;
  return DEFAULT_PAGE_TITLE;
};
