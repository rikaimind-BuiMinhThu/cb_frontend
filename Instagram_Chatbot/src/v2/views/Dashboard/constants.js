export const DASHBOARD_CHART_USER_ADMIN_LABEL = 'Ec chatbotユーザー';
export const DASHBOARD_CHART_USER_CLIENT_LABEL = '新規ユーザー';
export const DASHBOARD_CHART_MESSAGE_LABEL = '送信したメッセージ数';
export const DASHBOARD_OVERVIEW_TITLE = '概要';
export const DASHBOARD_UPDATED_LABEL = 'Updated 3 minutes ago';
export const DASHBOARD_CLIENT_MANAGEMENT = 'クライアント管理';
export const DASHBOARD_USER_MANAGEMENT = 'ユーザー管理';
export const DASHBOARD_KEYWORD_SETTING = 'キーワード設定';
export const DASHBOARD_CHATBOT = 'チャットボット';

export const DASHBOARD_CLIENT_ROUTE = '/v2/admin/client-management';
export const DASHBOARD_USER_ROUTE = '/v2/admin/user-management';
export const DASHBOARD_KEYWORD_ROUTE = '/v2/admin/keyword';
export const DASHBOARD_CHATBOT_ROUTE = '/v2/admin/chatbot';

export const DASHBOARD_ANALYTICS_USER_PATH = '/api/v1/analytics/chatbot_usages/user';
export const DASHBOARD_ANALYTICS_MESSAGE_PATH = '/api/v1/analytics/chatbot_usages/message';
export const DASHBOARD_ANALYTICS_USERS_PATH = '/api/v1/analytics/users';

export const DASHBOARD_DATE_RANGE_DAYS = 15;
export const DASHBOARD_HISTORICAL_MONTH_OFFSET = 6;
export const DASHBOARD_HISTORICAL_DAY = 15;
export const DASHBOARD_CHART_HEIGHT = 350;

export const DATE_SLICE_MONTH_START = 3;
export const DATE_SLICE_MONTH_END = 5;
export const DATE_SLICE_DAY_START = 0;
export const DATE_SLICE_DAY_END = 2;

export const formatChartDateLabel = (logDate) =>
  `${logDate.slice(DATE_SLICE_MONTH_START, DATE_SLICE_MONTH_END)}/${logDate.slice(DATE_SLICE_DAY_START, DATE_SLICE_DAY_END)}`;

export const parseStoredClient = () => {
  try {
    return JSON.parse(localStorage.getItem('client'));
  } catch (error) {
    return null;
  }
};

export const buildDateRange = () => {
  const dateEnd = new Date();
  const dateStart = new Date();
  dateStart.setDate(dateEnd.getDate() - DASHBOARD_DATE_RANGE_DAYS);
  const beginDate = dateStart.toISOString().slice(0, 10);
  const endDate = dateEnd.toISOString().slice(0, 10);
  const monthIndex = Number(endDate.slice(5, 7)) - 1;
  return { beginDate, endDate, monthIndex };
};

export const buildHistoricalBeginDate = (beginDate, monthIndex) =>
  `${beginDate.slice(0, 5)}${Math.abs(monthIndex - DASHBOARD_HISTORICAL_MONTH_OFFSET)}-${DASHBOARD_HISTORICAL_DAY}`;

export const sumUserCounts = (entries) =>
  (entries || []).reduce((total, entry) => total + entry.user_count, 0);
