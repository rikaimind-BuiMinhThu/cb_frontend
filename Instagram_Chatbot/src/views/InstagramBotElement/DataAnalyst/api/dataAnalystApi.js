import api from '../../../../api/api-management';
import { PAGE_SIZE } from '../constants';
import { formatChartDate, getBaselineBeginDate, getLiveEndDate } from '../utils/dateRange';

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  return search.toString();
}

function sumUserCounts(userCounts) {
  return (userCounts || []).reduce((total, item) => total + (item.user_count || 0), 0);
}

export async function fetchOverviewAnalytics({ beginDate, endDate, isAdminDeel }) {
  const baselineBeginDate = getBaselineBeginDate(beginDate);
  const query = buildQuery({ begin_date: beginDate, end_date: endDate });
  const baselineQuery = buildQuery({ begin_date: baselineBeginDate, end_date: endDate });

  const [userRes, messageRes, periodUsersRes, baselineUsersRes] = await Promise.all([
    api.get(`/api/v1/analytics/chatbot_usages/user?${query}`),
    api.get(`/api/v1/analytics/chatbot_usages/message?${query}`),
    api.get(`/api/v1/analytics/users?${query}`),
    api.get(`/api/v1/analytics/users?${baselineQuery}`),
  ]);

  const userCounts = userRes.data?.counts || [];
  const messageCounts = messageRes.data?.counts || [];
  const periodUsers = periodUsersRes.data?.user_counts || [];
  const baselineUsers = baselineUsersRes.data?.user_counts || [];

  const chartCategories = isAdminDeel
    ? userCounts.map((item) => formatChartDate(item.log_date))
    : periodUsers.map((item) => formatChartDate(item.log_date));
  const ecUserSeries = userCounts.map((item) => item.user_count);
  const messageSeries = messageCounts.map((item) => item.message_count);
  const newUserSeries = periodUsers.map((item) => item.user_count);

  const periodTotal = sumUserCounts(periodUsers);
  const baselineTotal = sumUserCounts(baselineUsers);
  const newUserPercent = baselineTotal ? (periodTotal / baselineTotal) * 100 : 0;
  const repeaterPercent = baselineTotal ? ((baselineTotal - periodTotal) / baselineTotal) * 100 : 0;

  return {
    chartCategories,
    userSeries: isAdminDeel ? ecUserSeries : newUserSeries,
    messageSeries,
    repeaterPercent,
    newUserPercent,
  };
}

export async function fetchLiveData({ beginDate, endDate, page, clientName }) {
  const liveEndDate = getLiveEndDate(endDate);
  const query = buildQuery({
    begin_date: beginDate,
    end_date: liveEndDate,
    page,
    client_name: clientName,
  });

  const response = await api.get(`/api/v1/analytics/chatbot_usages/live?${query}`);
  return {
    items: response.data?.live_usages || [],
    total: response.data?.total || 0,
  };
}

export async function fetchMessageGroups({ beginDate, endDate, page, clientName }) {
  const query = buildQuery({
    begin_date: beginDate,
    end_date: endDate,
    page,
    client_name: clientName,
  });

  const response = await api.get(`/api/v1/message_managements/message_groups/data_analyst?${query}`);
  return {
    items: response.data?.data || [],
    total: response.data?.total || 0,
  };
}

export async function fetchMessageGroupExport(groupId) {
  const response = await api.get(`/api/v1/message_managements/message_groups/${groupId}/export_csv`);
  return response.data?.data?.instagram_users || [];
}

export function normalizePage(currentPage, total) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return Math.min(currentPage, totalPages);
}
