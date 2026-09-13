import api from '../../../../api/api-management';
import { PAGE_SIZE, BASELINE_MONTHS_BEFORE } from '../constants';
import { formatDateToApi } from '../../DataAnalyst/utils/dateRange';
import moment from 'moment';

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  return search.toString();
}

function sumCounts(items, key) {
  return (items || []).reduce((total, item) => total + (item[key] || 0), 0);
}

function averageCounts(items, key) {
  if (!items?.length) return 0;
  return sumCounts(items, key) / items.length;
}

function getEcBaselineBeginDate(beginDate) {
  return moment(beginDate).subtract(BASELINE_MONTHS_BEFORE, 'months').format('YYYY-MM-DD');
}

function getPreviousPeriodDates(beginDate, endDate) {
  const start = moment(beginDate);
  const end = moment(endDate);
  const durationDays = end.diff(start, 'days');
  const prevEnd = start.clone().subtract(1, 'day');
  const prevStart = prevEnd.clone().subtract(durationDays, 'days');
  return {
    beginDate: prevStart.format('YYYY-MM-DD'),
    endDate: prevEnd.format('YYYY-MM-DD'),
  };
}

export async function fetchUserAnalytics({ beginDate, endDate, isAdminDeel }) {
  const ecBaselineBeginDate = getEcBaselineBeginDate(beginDate);
  const previousPeriod = getPreviousPeriodDates(beginDate, endDate);

  const periodQuery = buildQuery({ begin_date: beginDate, end_date: endDate });
  const ecBaselineQuery = buildQuery({ begin_date: ecBaselineBeginDate, end_date: endDate });
  const previousQuery = buildQuery({
    begin_date: previousPeriod.beginDate,
    end_date: previousPeriod.endDate,
  });

  const [
    userRes,
    messageRes,
    periodUsersRes,
    baselineUsersRes,
    ecBaselineUserRes,
    previousMessageRes,
  ] = await Promise.all([
    api.get(`/api/v1/analytics/chatbot_usages/user?${periodQuery}`),
    api.get(`/api/v1/analytics/chatbot_usages/message?${periodQuery}`),
    api.get(`/api/v1/analytics/users?${periodQuery}`),
    api.get(`/api/v1/analytics/users?${ecBaselineQuery}`),
    api.get(`/api/v1/analytics/chatbot_usages/user?${ecBaselineQuery}`),
    api.get(`/api/v1/analytics/chatbot_usages/message?${previousQuery}`),
  ]);

  const userCounts = userRes.data?.counts || [];
  const messageCounts = messageRes.data?.counts || [];
  const periodUsers = periodUsersRes.data?.user_counts || [];
  const baselineUsers = baselineUsersRes.data?.user_counts || [];
  const ecBaselineUsers = ecBaselineUserRes.data?.counts || [];
  const previousMessages = previousMessageRes.data?.counts || [];

  const chartCategories = isAdminDeel
    ? userCounts.map((item) => formatChartDate(item.log_date))
    : periodUsers.map((item) => formatChartDate(item.log_date));

  const ecUserSeries = userCounts.map((item) => item.user_count);
  const messageSeries = messageCounts.map((item) => item.message_count);
  const newUserSeries = periodUsers.map((item) => item.user_count);

  const periodUserTotal = sumCounts(periodUsers, 'user_count');
  const baselineUserTotal = sumCounts(baselineUsers, 'user_count');
  const newUserPercent = baselineUserTotal ? (periodUserTotal / baselineUserTotal) * 100 : 0;
  const repeaterPercent = baselineUserTotal
    ? ((baselineUserTotal - periodUserTotal) / baselineUserTotal) * 100
    : 0;

  const periodMessageTotal = sumCounts(messageCounts, 'message_count');
  const previousMessageTotal = sumCounts(previousMessages, 'message_count');
  const messageChangePercent = previousMessageTotal
    ? ((periodMessageTotal - previousMessageTotal) / previousMessageTotal) * 100
    : 0;

  const periodEcAvg = averageCounts(userCounts, 'user_count');
  const baselineEcAvg = averageCounts(ecBaselineUsers, 'user_count');
  const ecUserPercent = baselineEcAvg ? (periodEcAvg / baselineEcAvg) * 100 : 0;
  const ecNewUserPercent = baselineEcAvg
    ? (Math.abs(periodEcAvg - baselineEcAvg) / baselineEcAvg) * 100
    : 0;

  return {
    chartCategories,
    userSeries: isAdminDeel ? ecUserSeries : newUserSeries,
    messageSeries,
    repeaterPercent,
    newUserPercent,
    periodMessageTotal,
    messageChangePercent,
    ecUserPercent,
    ecNewUserPercent,
  };
}

function formatChartDate(logDate) {
  if (!logDate) return '';
  return `${logDate.slice(3, 5)}/${logDate.slice(0, 2)}`;
}

export async function fetchInstagramUsers({ page, instagramUserName, clientName }) {
  const query = buildQuery({
    page,
    instagram_user_name: instagramUserName,
    client_name: clientName,
  });

  const response = await api.get(`/api/v1/managements/instagram_users?${query}`);
  return {
    items: response.data?.data?.instagram_users || [],
    total: response.data?.total || 0,
  };
}

export async function fetchAllInstagramUsersForExport({ instagramUserName, clientName } = {}) {
  const firstPage = await fetchInstagramUsers({
    page: 1,
    instagramUserName,
    clientName,
  });

  const allItems = [...firstPage.items];
  const totalPages = Math.ceil(firstPage.total / PAGE_SIZE);

  if (totalPages <= 1) {
    return allItems;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchInstagramUsers({
        page: index + 2,
        instagramUserName,
        clientName,
      })
    )
  );

  remainingPages.forEach((result) => {
    allItems.push(...result.items);
  });

  return allItems;
}

export function normalizePage(currentPage, total) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return Math.min(currentPage, totalPages);
}

export { formatDateToApi };
